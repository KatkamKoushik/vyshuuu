'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollBridge } from '@/lib/scrollBridge';
import { useExperienceStore } from '@/stores/experienceStore';

interface Waypoint {
  t: number;
  pos: THREE.Vector3;
  lookAt: THREE.Vector3;
}

/**
 * CameraController // Active Theory Hydra Pure Spline Camera Engine
 * 
 * Features:
 * 1. 5-Chamber Continuous 3D Waypoint Spline:
 *    - Chamber 1 (0.00 - 0.20): The Loom & Filament Threshold
 *    - Chamber 2 (0.20 - 0.45): The 6-Yard Unfurling Sanctuary
 *    - Chamber 3 (0.45 - 0.70): The Spatial Vault / Curved Ribbon Ring
 *    - Chamber 4 (0.70 - 0.88): The Light Corridor (Gossamer Gallery)
 *    - Chamber 5 (0.88 - 1.00): The Secret Atelier & Living Heirloom Seal
 * 2. Active Theory Framerate-Normalized Alpha:
 *    Ensures identical camera interpolation velocity on 60Hz and 120Hz displays.
 * 3. Dynamic Cursor Parallax with Museum-Grade Restraint.
 */
export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);

  const currentPos = useRef(new THREE.Vector3(0, 0, 5.8));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const pointerDamped = useRef(new THREE.Vector2(0, 0));

  // The 5 Architectural Sanctuaries
  const waypoints = useMemo<Waypoint[]>(
    () => [
      {
        t: 0.0,
        pos: new THREE.Vector3(0.0, 0.0, 5.8),
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
      },
      {
        t: 0.18,
        pos: new THREE.Vector3(0.0, 0.15, 5.2),
        lookAt: new THREE.Vector3(0.0, -0.05, 0.0),
      },
      {
        t: 0.38,
        pos: new THREE.Vector3(-0.08, 0.72, 3.82),
        lookAt: new THREE.Vector3(-0.46, -0.68, 0.28),
      },
      {
        t: 0.60,
        pos: new THREE.Vector3(0.35, 0.22, 4.3),
        lookAt: new THREE.Vector3(0.0, -0.12, 0.0),
      },
      {
        t: 0.82,
        pos: new THREE.Vector3(-0.22, -0.12, 3.35),
        lookAt: new THREE.Vector3(0.08, 0.05, 0.0),
      },
      {
        t: 1.0,
        pos: new THREE.Vector3(0.0, -0.32, 3.65),
        lookAt: new THREE.Vector3(0.0, -0.42, 0.0),
      },
    ],
    []
  );

  // Active Theory Framerate Normalization Formula
  const normalizeLerpAlpha = (alpha: number, delta: number): number => {
    const clamped = Math.max(0.0001, Math.min(0.9999, alpha));
    const frameHzMultiplier = delta / 0.016666; // 60fps baseline
    return 1 - Math.exp(Math.log(1 - clamped) * frameHzMultiplier);
  };

  // Interpolate camera waypoint spline at parameter t
  const getSplineState = (t: number) => {
    const clampedT = Math.max(0, Math.min(1, t));

    // Find bounding segments
    let i = 0;
    while (i < waypoints.length - 1 && waypoints[i + 1].t < clampedT) {
      i++;
    }

    if (i >= waypoints.length - 1) {
      return {
        pos: waypoints[waypoints.length - 1].pos,
        lookAt: waypoints[waypoints.length - 1].lookAt,
      };
    }

    const p0 = waypoints[i];
    const p1 = waypoints[i + 1];
    const segmentSpan = p1.t - p0.t;
    const localT = segmentSpan > 0 ? (clampedT - p0.t) / segmentSpan : 0;
    const smoothT = THREE.MathUtils.smoothstep(localT, 0, 1);

    const pos = new THREE.Vector3().lerpVectors(p0.pos, p1.pos, smoothT);
    const lookAt = new THREE.Vector3().lerpVectors(p0.lookAt, p1.lookAt, smoothT);

    return { pos, lookAt };
  };

  useFrame((state, delta) => {
    // Prioritize global narrative progress; fallback to unfurling progress
    const p = Math.max(scrollBridge.globalProgress, scrollBridge.unfurlingProgress * 0.45);

    // Subtle pointer parallax (restrained, luxury gallery feel)
    if (!isReducedMotion) {
      const pointerAlpha = normalizeLerpAlpha(0.12, delta);
      pointerDamped.current.lerp(
        new THREE.Vector2(state.pointer.x, state.pointer.y),
        pointerAlpha
      );
    }

    const { pos: targetPos, lookAt: targetLookAt } = getSplineState(p);

    const parallaxX = pointerDamped.current.x * 0.045;
    const parallaxY = pointerDamped.current.y * 0.028;

    const finalX = targetPos.x + parallaxX;
    const finalY = targetPos.y + parallaxY;
    const finalZ = targetPos.z;

    if (isReducedMotion) {
      currentPos.current.set(finalX, finalY, finalZ);
      currentTarget.current.copy(targetLookAt);
    } else {
      const cameraAlpha = normalizeLerpAlpha(0.085, delta);
      currentPos.current.lerp(new THREE.Vector3(finalX, finalY, finalZ), cameraAlpha);
      currentTarget.current.lerp(targetLookAt, cameraAlpha);
    }

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
