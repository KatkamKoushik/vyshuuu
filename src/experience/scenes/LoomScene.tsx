'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/experienceStore';
import { scrollBridge } from '@/lib/scrollBridge';
import { loomVertexShader } from '../shaders/loom/loomVertex';
import { loomFragmentShader } from '../shaders/loom/loomFragment';
import { createLoomUniforms, LoomUniforms } from '../shaders/loom/loomUniforms';

export const LoomScene: React.FC = () => {
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

  // Pointer tracking via mutable refs (NEVER in Zustand per frame)
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const pointerDamped = useRef(new THREE.Vector2(0, 0));
  const lightPosDamped = useRef(new THREE.Vector3(-0.35, 1.35, 2.35));

  // Initialize shader uniforms
  const uniforms = useMemo<LoomUniforms>(() => {
    return createLoomUniforms(tierNumeric);
  }, [tierNumeric]);

  // Geometry: Subdivided plane with slight curvature
  const geometry = useMemo(() => {
    // 5.4m wide x 3.6m high architectural fabric plane
    return new THREE.PlaneGeometry(5.4, 3.6, 48, 48);
  }, []);

  // Window pointer event listener (restrained inspection light response)
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
    const u = mat.uniforms as unknown as LoomUniforms;

    // Time progression
    u.uTime.value = state.clock.getElapsedTime();

    // Read centralized scroll progress for the Loom section from scrollBridge
    const targetProgress = isReducedMotion ? 1.0 : scrollBridge.loomProgress;

    // Viscous exponential smoothing of progress
    u.uProgress.value = THREE.MathUtils.lerp(u.uProgress.value, targetProgress, delta * 3.5);

    // Opacity modulation: fades in as loom progress begins, fades out as specimen section engages
    const specimenFade = Math.max(0, 1.0 - scrollBridge.specimenProgress * 3.0);
    const targetOpacity = (targetProgress > 0.01 ? 1.0 : 0.0) * specimenFade;
    u.uOpacity.value = THREE.MathUtils.lerp(u.uOpacity.value, targetOpacity, delta * 4.0);

    if (u.uOpacity.value < 0.005) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    // Damped pointer movement for the Zari Illuminator
    if (!isReducedMotion) {
      pointerDamped.current.lerp(pointerTarget.current, delta * 2.2);

      // Restrained inspection raking beam trajectory:
      // Pointer nudges light across the plane at a grazing angle in left/center space
      const targetLightX = -0.35 + pointerDamped.current.x * 1.3;
      const targetLightY = 1.30 + pointerDamped.current.y * 0.9;
      // Idle harmonic sway when pointer rests (subtle, quiet)
      const idleSwayX = Math.sin(state.clock.getElapsedTime() * 0.35) * 0.12;
      const idleSwayY = Math.cos(state.clock.getElapsedTime() * 0.28) * 0.08;

      lightPosDamped.current.set(
        targetLightX + idleSwayX,
        targetLightY + idleSwayY,
        2.35 + Math.sin(state.clock.getElapsedTime() * 0.22) * 0.10
      );

      u.uPointer.value.copy(pointerDamped.current);
      u.uLightPos.value.copy(lightPosDamped.current);
    } else {
      // Reduced motion: static raking light angle
      u.uLightPos.value.set(-0.35, 1.35, 2.45);
    }

    // Restrained camera-relative orientation
    // The material stays mostly frontal with subtle perspective tilt
    if (!isReducedMotion) {
      meshRef.current.rotation.y = 0.08 + pointerDamped.current.x * 0.025;
      meshRef.current.rotation.x = -0.06 - pointerDamped.current.y * 0.02;
    }
  });

  return (
    <group position={[-0.25, -0.08, 0.35]}>
      <mesh ref={meshRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={loomVertexShader}
          fragmentShader={loomFragmentShader}
          uniforms={uniforms as unknown as { [uniform: string]: THREE.IUniform }}
          transparent={true}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
