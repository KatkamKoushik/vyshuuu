'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollBridge } from '@/lib/scrollBridge';
import { useExperienceStore } from '@/stores/experienceStore';

const particleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aSeed;

  varying float vPhase;
  varying float vSpeed;
  varying float vDistToCamera;

  uniform float uTime;
  uniform float uScrollVelocity;
  uniform vec2 uPointer;
  uniform float uPixelRatio;

  void main() {
    vPhase = aPhase;
    vSpeed = aSpeed;

    vec3 pos = position;

    // Organic 3D harmonic drift (Brownian micro-currents in darkroom void)
    float t = uTime * aSpeed * 0.45;
    pos.x += sin(t + aPhase) * 0.22 + cos(t * 0.4 + aSeed) * 0.14;
    pos.y += cos(t * 0.8 + aPhase) * 0.18;
    pos.z += sin(t * 0.6 + aSeed) * 0.16;

    // Fluid reaction to scroll velocity: particles stream vertically with inertial inertia
    pos.y += uScrollVelocity * (1.1 + aSeed * 0.015);

    // Subtle magnetic deflection from cursor
    vec2 pointerWorld = uPointer * vec2(3.0, 2.0);
    float dPointer = length(pos.xy - pointerWorld);
    if (dPointer < 1.4) {
      vec2 push = normalize(pos.xy - pointerWorld) * (1.4 - dPointer) * 0.18;
      pos.xy += push;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDistToCamera = -mvPosition.z;

    // Perspective point size with focal plane depth-of-field scaling
    gl_PointSize = aSize * uPixelRatio * (120.0 / max(0.8, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = /* glsl */ `
  varying float vPhase;
  varying float vSpeed;
  varying float vDistToCamera;

  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;

  void main() {
    // Soft circular filament profile
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Soft feathered edge
    float alpha = smoothstep(0.5, 0.08, dist);

    // Glowing golden core
    float core = exp(-dist * 10.0) * 0.8;

    // Scintillating glint twinkle (gold zari threads catching raking illumination)
    float twinkle = pow(max(0.0, sin(uTime * vSpeed * 2.2 + vPhase)), 10.0) * 1.8;

    // Soft depth-of-field fade when too close to lens or deep in backdrop
    float depthFade = smoothstep(0.5, 2.0, vDistToCamera) * (1.0 - smoothstep(7.0, 9.5, vDistToCamera));

    vec3 finalColor = uColor * (0.85 + core + twinkle * 0.75);
    float finalAlpha = alpha * (0.35 + twinkle * 0.45 + core * 0.2) * uOpacity * depthFade;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

export const GoldParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const velocityDamped = useRef(0);
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);

  // Exact target count: 420 particles (~400 specified)
  const particleCount = useMemo(() => {
    if (qualityTier === 'LOW') return 160;
    if (qualityTier === 'MED') return 280;
    return 420;
  }, [qualityTier]);

  const [geometry, uniforms] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const seeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spatial distribution suspended around the 6-yard saree continuum
      positions[i * 3 + 0] = (Math.random() - 0.5) * 9.5; // X: -4.75 to +4.75
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.2; // Y: -3.1 to +3.1
      positions[i * 3 + 2] = (Math.random() - 0.45) * 5.5; // Z: -2.0 to +3.5

      sizes[i] = 0.8 + Math.random() * 1.8; // Varied particle weights
      phases[i] = Math.random() * Math.PI * 2.0;
      speeds[i] = 0.5 + Math.random() * 1.2;
      seeds[i] = Math.random() * 100.0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const uni = {
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color('#C5A869') }, // Antique Zari Gold
      uOpacity: { value: 1.0 },
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
    };

    return [geo, uni];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!materialRef.current || !pointsRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = elapsed;

    if (!isReducedMotion) {
      velocityDamped.current = THREE.MathUtils.lerp(
        velocityDamped.current,
        scrollBridge.scrollVelocity,
        delta * 3.5
      );
      materialRef.current.uniforms.uScrollVelocity.value = velocityDamped.current;

      // Pointer tracking
      const targetX = state.pointer.x;
      const targetY = state.pointer.y;
      materialRef.current.uniforms.uPointer.value.set(targetX, targetY);
    } else {
      materialRef.current.uniforms.uScrollVelocity.value = 0;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
