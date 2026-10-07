'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/experienceStore';
import { scrollBridge } from '@/lib/scrollBridge';
import { loomVertexShader } from '../shaders/loom/loomVertex';
import { loomFragmentShader } from '../shaders/loom/loomFragment';
import { createLoomUniforms, LoomUniforms } from '../shaders/loom/loomUniforms';

export const MaterialSpecimenScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);

  // Quality tier numeric mapping (0 = Fallback, 1 = Low, 2 = Med, 3 = High, 4 = Ultra)
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

  // Pointer tracking via mutable refs (strictly outside Zustand to avoid frame-by-frame state churn)
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const pointerDamped = useRef(new THREE.Vector2(0, 0));
  const lightPosDamped = useRef(new THREE.Vector3(-0.35, 1.35, 2.35));

  // Initialize shader uniforms with SHOT 12 authoring parameters
  const uniforms = useMemo<LoomUniforms>(() => {
    const u = createLoomUniforms(tierNumeric);
    // In specimen mode, weave structure is established
    u.uProgress.value = 1.0;
    return u;
  }, [tierNumeric]);

  // Geometry: Subdivided rectangular specimen (6.0m length x 2.4m height, 64x48 segments)
  const geometry = useMemo(() => {
    const segmentsX = tierNumeric >= 3 ? 64 : 40;
    const segmentsY = tierNumeric >= 3 ? 48 : 32;
    return new THREE.PlaneGeometry(6.0, 2.4, segmentsX, segmentsY);
  }, [tierNumeric]);

  // Window pointer event listener for the inspection spotlight
  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion) return;

    const handlePointerMove = (e: MouseEvent) => {
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

    // Read normalized scroll progress from the centralized scrollBridge
    const targetProgress = isReducedMotion ? 1.0 : scrollBridge.specimenProgress;

    // Viscous exponential smoothing of specimen progress
    u.uSpecimenProgress.value = THREE.MathUtils.lerp(
      u.uSpecimenProgress.value,
      targetProgress,
      delta * 3.5
    );

    // Crossfade opacity: active while specimenProgress > 0.01
    const targetOpacity = targetProgress > 0.01 ? 1.0 : 0.0;
    u.uOpacity.value = THREE.MathUtils.lerp(u.uOpacity.value, targetOpacity, delta * 4.0);

    // Skip heavy spatial calculation if completely transparent
    if (u.uOpacity.value < 0.01) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    // Specimen Spatial Transformation Sequence (0.00 -> 1.00):
    // 0.00 -> 0.30: Suspended flat specimen with edge perception
    // 0.30 -> 0.65: Shallow fold wave develops
    // 0.65 -> 0.85: Macro perspective inspection along fold crest
    // 0.85 -> 1.00: Diagonal ribbon continuum extending beyond darkness
    const prog = u.uSpecimenProgress.value;

    if (!isReducedMotion) {
      pointerDamped.current.lerp(pointerTarget.current, delta * 2.2);

      // Light inspection position: directional raking beam skims fold crest from above-left
      // Positioned to illuminate the left/center textile body, away from the right typography
      const targetLightX = -0.35 + pointerDamped.current.x * 1.3;
      const targetLightY = 1.30 + pointerDamped.current.y * 0.9;
      const idleSwayX = Math.sin(state.clock.getElapsedTime() * 0.35) * 0.12;
      const idleSwayY = Math.cos(state.clock.getElapsedTime() * 0.28) * 0.08;

      lightPosDamped.current.set(
        targetLightX + idleSwayX,
        targetLightY + idleSwayY,
        2.35 + Math.sin(state.clock.getElapsedTime() * 0.22) * 0.10
      );

      u.uPointer.value.copy(pointerDamped.current);
      u.uLightPos.value.copy(lightPosDamped.current);

      // Spatial transformation of the specimen mesh:
      // Brings the surface forward, tilts slightly along the diagonal grain, and curves into depth
      // Mesh is anchored in left/center space (-0.35 to -0.15) so the title "THE UNSTITCHED SPECIMEN"
      // rests quietly beside the textile in deep negative space rather than over the highlight
      const macroZoom = smoothstep(0.40, 0.75, prog) * 0.50;
      const lateralShift = smoothstep(0.35, 0.80, prog) * 0.20;
      const continuumDrop = smoothstep(0.80, 1.0, prog) * -0.35;

      meshRef.current.position.set(
        -0.35 + lateralShift + pointerDamped.current.x * 0.03,
        -0.05 + continuumDrop + pointerDamped.current.y * 0.03,
        0.30 + macroZoom
      );

      // Rotational choreography:
      // Initial subtle frontal tilt -> progressive diagonal inspection -> continuous ribbon angle
      const rotY = 0.07 + smoothstep(0.3, 0.7, prog) * 0.14 + pointerDamped.current.x * 0.025;
      const rotX = -0.05 + smoothstep(0.4, 0.85, prog) * -0.09 - pointerDamped.current.y * 0.02;
      const rotZ = smoothstep(0.75, 1.0, prog) * -0.08;

      meshRef.current.rotation.set(rotX, rotY, rotZ);
    } else {
      // Reduced motion: composed, static resting perspective in left/center space
      u.uLightPos.value.set(-0.35, 1.35, 2.45);
      meshRef.current.position.set(-0.25, -0.08, 0.45);
      meshRef.current.rotation.set(-0.06, 0.12, -0.04);
    }
  });

  return (
    <group position={[0, 0, 0]}>
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

// Smoothstep helper for animation curves
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}
