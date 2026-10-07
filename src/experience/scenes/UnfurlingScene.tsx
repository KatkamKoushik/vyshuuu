'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/experienceStore';
import { scrollBridge } from '@/lib/scrollBridge';
import { unfurlingVertexShader } from '../shaders/unfurling/unfurlingVertex';
import { unfurlingFragmentShader } from '../shaders/unfurling/unfurlingFragment';
import { createUnfurlingUniforms, UnfurlingUniforms } from '../shaders/unfurling/unfurlingUniforms';
import { useLockedTextures } from '../hooks/useLockedTextures';

export const UnfurlingScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

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

  // Geometry: Subdivided plane with 7.2m x 2.84m aspect ratio (matching 1997x787 ~2.538:1)
  const geometry = useMemo(() => {
    const segX = tierNumeric >= 3 ? 160 : tierNumeric === 2 ? 100 : 64;
    const segY = tierNumeric >= 3 ? 80 : tierNumeric === 2 ? 50 : 32;
    return new THREE.PlaneGeometry(7.2, 2.84, segX, segY);
  }, [tierNumeric]);

  // Window pointer event listener (smooth interactive raking light)
  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion) return;

    const handlePointerMove = (e: MouseEvent) => {
      // Normalized coordinates [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerTarget.current.set(nx, ny);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [isReducedMotion]);

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const mat = materialRef.current;
    const u = mat.uniforms as unknown as UnfurlingUniforms;

    // Time progression
    u.uTime.value = state.clock.getElapsedTime();

    // Read normalized scroll progress for the 6-Yard Unfurling sequence
    const targetProgress = isReducedMotion ? 1.0 : scrollBridge.unfurlingProgress;

    // Viscous exponential smoothing of scroll progression (mass and inertia)
    u.uProgress.value = THREE.MathUtils.lerp(u.uProgress.value, targetProgress, delta * 3.2);

    // Viscous damping of scroll velocity
    velocityDamped.current = THREE.MathUtils.lerp(
      velocityDamped.current,
      scrollBridge.scrollVelocity,
      delta * 4.5
    );
    u.uScrollVelocity.value = velocityDamped.current;

    // Opacity modulation: emerges gently as unfurling sequence begins
    // Sequence active between progress 0.05 and 1.0
    const targetOpacity = targetProgress > 0.02 ? 1.0 : targetProgress * 50.0;
    u.uOpacity.value = THREE.MathUtils.lerp(u.uOpacity.value, targetOpacity, delta * 3.8);

    if (u.uOpacity.value < 0.005) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    // Damped pointer movement for the Lateral Raking Illuminator
    if (!isReducedMotion) {
      pointerDamped.current.lerp(pointerTarget.current, delta * 2.5);

      // Lateral raking key light position:
      // Grazes across the fabric from left-above at an acute angle
      const targetLightX = -1.8 + pointerDamped.current.x * 1.5;
      const targetLightY = 2.2 + pointerDamped.current.y * 1.0;
      const idleSwayX = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
      const idleSwayY = Math.cos(state.clock.getElapsedTime() * 0.25) * 0.10;

      lightPosDamped.current.set(
        targetLightX + idleSwayX,
        targetLightY + idleSwayY,
        3.2 + Math.sin(state.clock.getElapsedTime() * 0.2) * 0.12
      );

      u.uPointer.value.copy(pointerDamped.current);
      u.uLightPos.value.copy(lightPosDamped.current);
    } else {
      // Reduced motion: static broad lateral raking angle
      u.uLightPos.value.set(-1.8, 2.2, 3.2);
    }

    // Dynamic spatial choreography of the 6-Yard Continuous Mesh:
    // Follows the unfurling narrative progression (0.00 -> 1.00)
    const p = u.uProgress.value;

    if (!isReducedMotion) {
      // Slight perspective tilt that deepens as pleats unfurl and settles at the end
      const rotY = 0.08 + Math.sin(p * Math.PI) * 0.12 + pointerDamped.current.x * 0.025;
      const rotX = -0.04 - Math.sin(p * Math.PI * 0.8) * 0.08 - pointerDamped.current.y * 0.02;
      const rotZ = Math.sin(p * Math.PI * 0.6) * -0.03;

      meshRef.current.rotation.set(rotX, rotY, rotZ);

      // Subtle lateral drift anticipating the full composition
      const posX = -0.15 + (p - 0.5) * 0.35 + pointerDamped.current.x * 0.03;
      const posY = 0.02 - Math.sin(p * Math.PI * 0.7) * 0.12 + pointerDamped.current.y * 0.03;
      const posZ = 0.25 + Math.sin(p * Math.PI) * 0.20;

      meshRef.current.position.set(posX, posY, posZ);
    } else {
      // Reduced motion: balanced resting architectural orientation
      meshRef.current.rotation.set(-0.04, 0.08, 0.0);
      meshRef.current.position.set(-0.15, 0.0, 0.3);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={unfurlingVertexShader}
          fragmentShader={unfurlingFragmentShader}
          uniforms={uniforms as unknown as { [uniform: string]: THREE.IUniform }}
          transparent={true}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
