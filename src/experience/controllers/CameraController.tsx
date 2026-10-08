'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollBridge } from '@/lib/scrollBridge';
import { useExperienceStore } from '@/stores/experienceStore';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);

  const currentPos = useRef(new THREE.Vector3(0, 0, 5.8));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const pointerDamped = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const p = scrollBridge.unfurlingProgress;

    // Transition factor into the 6-Yard Unfurling scene (0 = Threshold, 1 = Unfurling)
    const unfurlT = isReducedMotion
      ? p > 0.05
        ? 1.0
        : 0.0
      : THREE.MathUtils.smoothstep(p, 0.02, 0.32);

    // Subtle pointer parallax (restrained, luxury gallery feel)
    if (!isReducedMotion) {
      pointerDamped.current.lerp(
        new THREE.Vector2(state.pointer.x, state.pointer.y),
        delta * 2.2
      );
    }

    const parallaxX = pointerDamped.current.x * 0.05 * unfurlT;
    const parallaxY = pointerDamped.current.y * 0.03 * unfurlT;

    // Cinematic 3/4 Downward Perspective (PASS 1B: Closer, physical depth, textile dominance):
    // Brought visually closer to the heavy draped continuum to reduce empty black void
    const targetX = THREE.MathUtils.lerp(0.0, -0.08, unfurlT) + parallaxX;
    const targetY = THREE.MathUtils.lerp(0.0, 0.72, unfurlT) + parallaxY;
    const targetZ = THREE.MathUtils.lerp(5.8, 3.82, unfurlT);

    // Target lookAt point:
    // Centered on the massive grounded cascade and spreading foreground pallu
    const lookX = THREE.MathUtils.lerp(0.0, -0.46, unfurlT);
    const lookY = THREE.MathUtils.lerp(0.0, -0.68, unfurlT);
    const lookZ = THREE.MathUtils.lerp(0.0, 0.28, unfurlT);

    if (isReducedMotion) {
      currentPos.current.set(targetX, targetY, targetZ);
      currentTarget.current.set(lookX, lookY, lookZ);
    } else {
      const dampSpeed = delta * 3.4;
      currentPos.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), dampSpeed);
      currentTarget.current.lerp(new THREE.Vector3(lookX, lookY, lookZ), dampSpeed);
    }

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
