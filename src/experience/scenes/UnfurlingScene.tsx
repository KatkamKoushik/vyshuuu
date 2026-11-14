'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/experienceStore';
import { scrollBridge } from '@/lib/scrollBridge';
import { unfurlingVertexShader } from '../shaders/unfurling/unfurlingVertex';
import { unfurlingFragmentShader } from '../shaders/unfurling/unfurlingFragment';
import {
  galleryBackdropVertexShader,
  galleryBackdropFragmentShader,
} from '../shaders/unfurling/galleryBackdropShader';
import {
  stoneFloorVertexShader,
  stoneFloorFragmentShader,
} from '../shaders/unfurling/stoneFloorShader';
import { createUnfurlingUniforms, UnfurlingUniforms } from '../shaders/unfurling/unfurlingUniforms';
import { useLockedTextures } from '../hooks/useLockedTextures';
import { audioEngine } from '@/lib/audio/webAudioEngine';

export const UnfurlingScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const backdropMeshRef = useRef<THREE.Mesh>(null);
  const backdropMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const floorMeshRef = useRef<THREE.Mesh>(null);
  const floorMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);

  // Quality tier numeric mapping
  const tierNumeric = useMemo(() => {
    switch (qualityTier) {
      case 'ULTRA':
        return 4;
      case 'HIGH':
        return 3;
      case 'MED':
        return 2;
      case 'LOW':
        return 1;
      default:
        return 0;
    }
  }, [qualityTier]);

  // Load all 9 locked production texture maps
  const { textures, isLoaded, hasValidTextures } = useLockedTextures();

  // Pointer tracking refs (strictly outside Zustand to avoid frame-by-frame state churn)
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const pointerDamped = useRef(new THREE.Vector2(0, 0));
  const lightPosDamped = useRef(new THREE.Vector3(-1.8, 2.2, 3.2));
  const velocityDamped = useRef(0);

  // Living Cloth Touch Physics & Transverse Ripple Tracking
  const clockTimeRef = useRef(0);
  const touchImpulses = useRef<[THREE.Vector4, THREE.Vector4, THREE.Vector4, THREE.Vector4]>([
    new THREE.Vector4(-1, -1, 0, 0),
    new THREE.Vector4(-1, -1, 0, 0),
    new THREE.Vector4(-1, -1, 0, 0),
    new THREE.Vector4(-1, -1, 0, 0),
  ]);
  const touchImpulseIndex = useRef(0);
  const touchIntensity = useRef(0);
  const touchVelocity = useRef(new THREE.Vector2(0, 0));
  const touchClothUv = useRef(new THREE.Vector2(0.5, 0.5));
  const lastContact = useRef({ x: 0, y: 0, time: 0 });

  // Initialize shader uniforms
  const uniforms = useMemo<UnfurlingUniforms>(() => {
    return createUnfurlingUniforms(tierNumeric);
  }, [tierNumeric]);

  // Initialize gallery backdrop uniforms
  const backdropUniforms = useMemo(() => {
    return {
      uProgress: { value: 0 },
      uOpacity: { value: 0 },
      uLightPos: { value: new THREE.Vector3(-1.8, 2.2, 3.2) },
      uTime: { value: 0 },
    };
  }, []);

  // Initialize stone floor plinth uniforms
  const floorUniforms = useMemo(() => {
    return {
      uProgress: { value: 0 },
      uOpacity: { value: 0 },
      uLightPos: { value: new THREE.Vector3(-1.8, 2.2, 3.2) },
      uTime: { value: 0 },
    };
  }, []);

  // Update textures in uniforms when loaded
  useEffect(() => {
    if (isLoaded && materialRef.current) {
      const u = materialRef.current.uniforms as unknown as UnfurlingUniforms;
      if (hasValidTextures && textures.baseColor) {
        u.tBaseColor.value = textures.baseColor;
        u.tZariMask.value = textures.zariMask;
        u.tBorderMask.value = textures.borderMask;
        u.tPalluMask.value = textures.palluMask;
        u.tRedAccent.value = textures.redAccent;
        u.tWeaveDirection.value = textures.weaveDirection;
        u.tRoughness.value = textures.roughness;
        u.tMicroNormal.value = textures.microNormal;
        u.tEdgeFringe.value = textures.edgeFringe;
        u.uHasTextures.value = 1.0;
      } else {
        // Fallback to high-fidelity procedural loom shader when textures are incomplete/failed
        u.uHasTextures.value = 0.0;
      }
    }
  }, [isLoaded, hasValidTextures, textures]);

  // Geometry: Subdivided plane for smooth sculptural continuous manifold
  const geometry = useMemo(() => {
    const segX = tierNumeric >= 3 ? 200 : tierNumeric === 2 ? 120 : 80;
    const segY = tierNumeric >= 3 ? 90 : tierNumeric === 2 ? 60 : 40;
    return new THREE.PlaneGeometry(7.2, 2.84, segX, segY);
  }, [tierNumeric]);

  // Window pointer & touch event listeners (smooth interactive raking light on desktop & mobile)
  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion) return;

    const registerTouchInteraction = (nx: number, ny: number) => {
      pointerTarget.current.set(nx, ny);

      // Harmonize with Three.js state.clock.getElapsedTime() for coherent wave physics
      const now = clockTimeRef.current;
      const dt = Math.max(0.005, now - lastContact.current.time);
      const dx = nx - lastContact.current.x;
      const dy = ny - lastContact.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      lastContact.current = { x: nx, y: ny, time: now };

      // Map normalized view coordinates to cloth manifold UV coordinate plane
      const u = Math.max(0, Math.min(1, (nx + 0.85) / 1.55));
      const v = Math.max(0, Math.min(1, (ny + 0.75) / 1.35));

      if (speed > 0.12) {
        touchClothUv.current.set(u, v);
        touchVelocity.current.set(dx / dt, dy / dt);
        const intensity = Math.min(1.0, speed * 0.45);
        touchIntensity.current = Math.max(touchIntensity.current, intensity);

        // Sonic feedback: procedural silk thread friction modulated by drag intensity
        audioEngine.triggerTouchFriction(intensity);

        // Check if last impulse was > 90ms ago to emit continuous decaying ripples
        const prevIdx = (touchImpulseIndex.current - 1 + 4) % 4;
        const timeSinceLastImpulse = now - touchImpulses.current[prevIdx].z;

        if (timeSinceLastImpulse > 0.09) {
          const idx = touchImpulseIndex.current % 4;
          touchImpulses.current[idx].set(u, v, now, intensity);
          touchImpulseIndex.current++;

          // Raking light catching gold zari threads in pallu region (u > 0.62)
          if (u > 0.62) {
            audioEngine.triggerZariChime(1.0 + (1.0 - v) * 0.35, intensity);
          }
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      registerTouchInteraction(nx, ny);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const nx = (touch.clientX / window.innerWidth) * 2 - 1;
        const ny = -(touch.clientY / window.innerHeight) * 2 + 1;
        registerTouchInteraction(nx, ny);
      }
    };

    // Use pointermove as single source of truth (covers mouse, pen, and touch) to prevent double-firing
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, [isReducedMotion]);

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const mat = materialRef.current;
    const u = mat.uniforms as unknown as UnfurlingUniforms;

    // Time progression
    const elapsed = state.clock.getElapsedTime();
    clockTimeRef.current = elapsed;
    u.uTime.value = elapsed;

    // Read normalized scroll progress for the 6-Yard Unfurling sequence
    const targetProgress = isReducedMotion ? 1.0 : scrollBridge.unfurlingProgress;

    // Viscous exponential smoothing of scroll progression (mass and inertia)
    u.uProgress.value = THREE.MathUtils.lerp(u.uProgress.value, targetProgress, delta * 3.2);
    const p = u.uProgress.value;
    if (typeof window !== 'undefined') {
      (window as unknown as { __UNFURL_U__?: UnfurlingUniforms }).__UNFURL_U__ = u;
    }

    // Viscous damping of scroll velocity
    velocityDamped.current = THREE.MathUtils.lerp(
      velocityDamped.current,
      scrollBridge.scrollVelocity,
      delta * 4.5
    );
    u.uScrollVelocity.value = velocityDamped.current;

    // Opacity modulation: emerges gently as unfurling sequence begins
    const targetOpacity = targetProgress > 0.02 ? 1.0 : targetProgress * 50.0;
    u.uOpacity.value = THREE.MathUtils.lerp(u.uOpacity.value, targetOpacity, delta * 3.8);

    if (u.uOpacity.value < 0.005) {
      meshRef.current.visible = false;
      if (backdropMeshRef.current) backdropMeshRef.current.visible = false;
      if (floorMeshRef.current) floorMeshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;
    if (backdropMeshRef.current) backdropMeshRef.current.visible = true;
    if (floorMeshRef.current) floorMeshRef.current.visible = true;

    // Ensure mesh is never culled by Three.js bounding sphere checks
    meshRef.current.frustumCulled = false;

    // Damped pointer movement for Lateral Raking Illuminator
    if (!isReducedMotion) {
      pointerDamped.current.lerp(pointerTarget.current, delta * 2.5);

      // Lateral raking key light sweep:
      const targetLightX = -3.6 + p * 2.2 + pointerDamped.current.x * 1.2;
      const targetLightY = 2.2 + pointerDamped.current.y * 0.8;
      const idleSwayX = Math.sin(elapsed * 0.3) * 0.10;
      const idleSwayY = Math.cos(elapsed * 0.25) * 0.08;

      lightPosDamped.current.set(
        targetLightX + idleSwayX,
        targetLightY + idleSwayY,
        2.5 + Math.sin(p * Math.PI) * 0.35
      );

      u.uPointer.value.copy(pointerDamped.current);
      u.uLightPos.value.copy(lightPosDamped.current);
    } else {
      // Reduced motion: static restrained lateral raking angle
      u.uLightPos.value.set(-3.2, 2.2, 2.8);
    }

    // Update Living Cloth Touch Physics Uniforms & decay
    touchIntensity.current *= Math.pow(0.88, delta * 60.0);
    u.uTouchPos.value.copy(touchClothUv.current);
    u.uTouchVelocity.value.copy(touchVelocity.current);
    u.uTouchIntensity.value = touchIntensity.current;
    u.uTouchWaveTime.value = elapsed;
    u.uTouchImpulse0.value.copy(touchImpulses.current[0]);
    u.uTouchImpulse1.value.copy(touchImpulses.current[1]);
    u.uTouchImpulse2.value.copy(touchImpulses.current[2]);
    u.uTouchImpulse3.value.copy(touchImpulses.current[3]);

    // Sync gallery backdrop uniforms
    if (backdropMaterialRef.current) {
      const bu = backdropMaterialRef.current.uniforms;
      bu.uProgress.value = p;
      bu.uOpacity.value = u.uOpacity.value;
      bu.uLightPos.value.copy(u.uLightPos.value);
      bu.uTime.value = elapsed;
    }

    // Sync stone floor plinth uniforms
    if (floorMaterialRef.current) {
      const fu = floorMaterialRef.current.uniforms;
      fu.uProgress.value = p;
      fu.uOpacity.value = u.uOpacity.value;
      fu.uLightPos.value.copy(u.uLightPos.value);
      fu.uTime.value = elapsed;
    }

    // Dynamic spatial orientation:
    // Complements the downward 3/4 camera view with subtle organic mass sway
    if (!isReducedMotion) {
      const rotY = 0.04 + Math.sin(p * Math.PI * 0.85) * 0.05 + pointerDamped.current.x * 0.012;
      const rotX = -0.04 - Math.sin(p * Math.PI * 0.7) * 0.03 - pointerDamped.current.y * 0.010;
      const rotZ = 0.0;

      meshRef.current.rotation.set(rotX, rotY, rotZ);

      const posX = -0.05 + (p - 0.5) * 0.10 + pointerDamped.current.x * 0.015;
      const posY = 0.0;
      const posZ = 0.0;

      meshRef.current.position.set(posX, posY, posZ);
    } else {
      meshRef.current.rotation.set(-0.04, 0.04, 0.0);
      meshRef.current.position.set(-0.05, 0.0, 0.0);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dark Architectural Stone Floor Plinth with Visible Contact & Cast Shadows */}
      <mesh
        ref={floorMeshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.15, 0]}
      >
        <planeGeometry args={[18.0, 14.0]} />
        <shaderMaterial
          ref={floorMaterialRef}
          vertexShader={stoneFloorVertexShader}
          fragmentShader={stoneFloorFragmentShader}
          uniforms={floorUniforms}
          transparent={true}
          depthWrite={false}
        />
      </mesh>

      {/* Architectural Gallery Backdrop Wall */}
      <mesh ref={backdropMeshRef} position={[0, 0.4, -2.4]}>
        <planeGeometry args={[22.0, 14.0]} />
        <shaderMaterial
          ref={backdropMaterialRef}
          vertexShader={galleryBackdropVertexShader}
          fragmentShader={galleryBackdropFragmentShader}
          uniforms={backdropUniforms}
          transparent={true}
          depthWrite={false}
        />
      </mesh>

      {/* The Continuous Cascading 6-Yard Unfurling Textile */}
      <mesh ref={meshRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={unfurlingVertexShader}
          fragmentShader={unfurlingFragmentShader}
          uniforms={uniforms as unknown as { [uniform: string]: THREE.IUniform }}
          transparent={true}
          depthWrite={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
