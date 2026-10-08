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
  const { textures, isLoaded } = useLockedTextures();

  // Pointer tracking refs (strictly outside Zustand to avoid frame-by-frame state churn)
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const pointerDamped = useRef(new THREE.Vector2(0, 0));
  const lightPosDamped = useRef(new THREE.Vector3(-1.8, 2.2, 3.2));
  const velocityDamped = useRef(0);

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
    }
  }, [isLoaded, textures]);

  // Geometry: Subdivided plane for smooth sculptural continuous manifold
  const geometry = useMemo(() => {
    const segX = tierNumeric >= 3 ? 200 : tierNumeric === 2 ? 120 : 80;
    const segY = tierNumeric >= 3 ? 90 : tierNumeric === 2 ? 60 : 40;
    return new THREE.PlaneGeometry(7.2, 2.84, segX, segY);
  }, [tierNumeric]);

  // Window pointer & touch event listeners (smooth interactive raking light on desktop & mobile)
  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion) return;

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerTarget.current.set(nx, ny);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const nx = (touch.clientX / window.innerWidth) * 2 - 1;
        const ny = -(touch.clientY / window.innerHeight) * 2 + 1;
        pointerTarget.current.set(nx, ny);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
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
