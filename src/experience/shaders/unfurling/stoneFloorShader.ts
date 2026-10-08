export const stoneFloorVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const stoneFloorFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uProgress;
  uniform float uOpacity;
  uniform vec3 uLightPos;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  // Ultra-fine pseudo-random micro-texture for dark honed architectural slate
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    if (uOpacity <= 0.001) {
      discard;
    }

    // Base tone: Honed architectural basalt/slate plinth
    // Restrained dark tone to ground the saree without competing with it
    vec3 baseSlate = vec3(0.038, 0.035, 0.031);

    // Subtle stone micro-grain
    float grain = (hash21(vWorldPos.xz * 36.0) - 0.5) * 0.005;

    // Substantially reduced seam contrast: wide slab spacing (3.6m), imperceptible joint
    float seamDistX = abs(fract(vWorldPos.x / 3.6 + 0.5) - 0.5) * 3.6;
    float seamDistZ = abs(fract(vWorldPos.z / 3.6 + 0.5) - 0.5) * 3.6;
    float seamX = smoothstep(0.012, 0.001, seamDistX);
    float seamZ = smoothstep(0.012, 0.001, seamDistZ);
    // Almost invisible hairline incision (zero bright bevel)
    float slabJoint = max(seamX, seamZ) * 0.005;

    vec3 floorStone = (baseSlate - slabJoint) + vec3(grain);

    // 1. Directional Raking Key Wash & Soft Honed Specular Sheen (Subtle, restrained)
    vec3 L = normalize(uLightPos - vWorldPos);
    vec3 N = vec3(0.0, 1.0, 0.0);
    vec3 H = normalize(L + vViewDir);

    float lightDist = length(vWorldPos - uLightPos);
    float rakingDiffuse = exp(-lightDist * 0.22) * max(0.0, dot(N, L));
    float honedSpecular = pow(max(0.0, dot(N, H)), 32.0) * 0.045;

    vec3 floorLit = floorStone 
                  + vec3(0.045, 0.036, 0.024) * rakingDiffuse 
                  + vec3(0.075, 0.062, 0.042) * honedSpecular;

    // 2. Broad Continuous Contact Shadows & Deep Occlusion
    // Calibrated to the exact revised cascade footprint:
    // Contact Pool 1: Early Touchdown & Plunge Contact Zone (X in [-2.2, -1.1], Z in [-1.0, 0.0])
    float touchX = smoothstep(-2.3, -1.8, vWorldPos.x) * (1.0 - smoothstep(-1.0, -0.5, vWorldPos.x));
    float touchZ = smoothstep(-1.0, -0.6, vWorldPos.z) * (1.0 - smoothstep(0.1, 0.5, vWorldPos.z));
    float contactTouch = touchX * touchZ * smoothstep(0.18, 0.35, uProgress) * 0.94;

    // Contact Pool 2: Grounded Central Drape & Lateral Pooling Zone (X in [-1.8, -0.3], Z in [-0.4, 0.6])
    float centralX = smoothstep(-1.9, -1.3, vWorldPos.x) * (1.0 - smoothstep(0.0, 0.5, vWorldPos.x));
    float centralZ = smoothstep(-0.5, -0.1, vWorldPos.z) * (1.0 - smoothstep(0.7, 1.2, vWorldPos.z));
    float contactCentral = centralX * centralZ * smoothstep(0.30, 0.55, uProgress) * 0.96;

    // Contact Pool 3: Monumental Foreground Pallu Spread (X in [-1.3, +0.3], Z in [0.2, 1.4])
    float palluProgress = smoothstep(0.55, 0.85, uProgress);
    float palluX = smoothstep(-1.3, -0.6, vWorldPos.x) * (1.0 - smoothstep(0.3, 0.8, vWorldPos.x));
    float palluZ = smoothstep(0.2, 0.5, vWorldPos.z) * (1.0 - smoothstep(1.3, 1.8, vWorldPos.z));
    float contactPallu = palluX * palluZ * palluProgress * 0.98;

    float totalContactAO = clamp(max(contactTouch, max(contactCentral, contactPallu)), 0.0, 1.0);

    // Directional raking shadow offset
    vec2 shadowOffset = (vWorldPos.xz - uLightPos.xz) * 0.12;
    float castX = smoothstep(-2.2, -1.5, vWorldPos.x - shadowOffset.x)
                * (1.0 - smoothstep(0.3, 1.0, vWorldPos.x - shadowOffset.x));
    float castZ = smoothstep(-0.9, -0.3, vWorldPos.z - shadowOffset.y)
                * (1.0 - smoothstep(1.1, 1.8, vWorldPos.z - shadowOffset.y));
    float castShadow = castX * castZ * 0.65;

    float totalShadow = clamp(max(totalContactAO, castShadow), 0.0, 1.0);

    // Deep obsidian contact shadow tone: physically anchors the heavy silk
    vec3 shadowColor = vec3(0.005, 0.004, 0.003);
    vec3 finalFloor = mix(floorLit, shadowColor, totalShadow);

    // 3. Radial Gallery Vignette (Floor gently melts into deep exhibition void beyond 3.0m)
    float radialDist = length(vWorldPos.xz * vec2(0.30, 0.42));
    float vignette = smoothstep(3.0, 0.7, radialDist);

    float alpha = uOpacity * vignette * 0.98;

    gl_FragColor = vec4(finalFloor, alpha);
  }
`;
