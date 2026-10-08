'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/experienceStore';
import { scrollBridge } from '@/lib/scrollBridge';

export const ThresholdScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const setIntroSettled = useExperienceStore((s) => s.setIntroSettled);
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);
  const progressRef = useRef(0);
  const settledNotified = useRef(false);

  // Generate an organic, slightly imperfect vertical filament curve
  const geometry = useMemo(() => {
    const pointCount = 36;
    const points: THREE.Vector3[] = [];
    const height = 4.2; // Spans viewport vertically
    const startY = height / 2;

    for (let i = 0; i < pointCount; i++) {
      const t = i / (pointCount - 1);
      const y = startY - t * height;
      // Micro-imperfection mimicking hand-drawn silver-gold zari wire
      const microSway = Math.sin(t * Math.PI * 3) * 0.012 + Math.cos(t * Math.PI * 5) * 0.006;
      points.push(new THREE.Vector3(microSway, y, 0));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    // Slender wire radius: 0.0035 (approx 0.7mm visual filament at normal camera distance)
    return new THREE.TubeGeometry(curve, 64, 0.0035, 8, false);
  }, []);

  // Material: Antique Zari with metallic micro-luster
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C5A869'), // Antique Zari
      metalness: 0.92,
      roughness: 0.28,
      wireframe: false,
    });
  }, []);

  useEffect(() => {
    if (isReducedMotion) {
      progressRef.current = 1.0;
      setIntroSettled(true);
      settledNotified.current = true;
    }
  }, [isReducedMotion, setIntroSettled]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isReducedMotion) {
      meshRef.current.position.y = 0;
      return;
    }

    // Viscous vertical descent over ~1.4 seconds
    if (progressRef.current < 1.0) {
      // Damped viscous progression: responsive timing
      progressRef.current = Math.min(1.0, progressRef.current + delta * 0.85);
      
      // Easing: ease-out cubic feel
      const t = progressRef.current;
      const ease = 1 - Math.pow(1 - t, 3);

      // Descends from above viewport (+2.8) down into resting center (0.0)
      meshRef.current.position.y = (1 - ease) * 2.8;

      // Notify parent when filament has established presence (around 45%)
      if (ease >= 0.45 && !settledNotified.current) {
        settledNotified.current = true;
        setIntroSettled(true);
      }
    } else {
      // Resting micro-breathing (subtle organic weave suspension)
      const time = state.clock.getElapsedTime();
      const loomProg = scrollBridge.loomProgress;
      // As Loom begins, the single filament glides upward and dissolves into the warp
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.015 + loomProg * 3.2;
      meshRef.current.rotation.y = Math.sin(time * 0.4) * 0.05;
      meshRef.current.scale.setScalar(Math.max(0.001, 1 - loomProg * 1.5));
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} position={[0, 2.8, 0]} />
    </group>
  );
};
