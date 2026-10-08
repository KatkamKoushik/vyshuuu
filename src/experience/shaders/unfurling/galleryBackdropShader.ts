export const galleryBackdropVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const galleryBackdropFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uProgress;
  uniform float uOpacity;
  uniform vec3 uLightPos;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    if (uOpacity <= 0.001) {
      discard;
    }

    // Base gallery wall tone: warm architectural obsidian slate
    vec3 baseWall = vec3(0.082, 0.075, 0.065);

    // Subtle architectural vignette from center
    float vignette = smoothstep(1.5, 0.2, length(vUv - vec2(0.5, 0.48)) * 1.3);
    vec3 wallColor = baseWall * vignette;

    // 1. Focused lateral raking light sweep across the gallery wall
    float beamDistX = abs(vWorldPos.x - uLightPos.x);
    float beamDistY = abs(vWorldPos.y - uLightPos.y);
    float wallBeam = exp(-beamDistX * beamDistX * 0.15 - beamDistY * beamDistY * 0.22);
    vec3 rakingWash = vec3(0.09, 0.075, 0.055) * wallBeam * 0.65;

    // 2. Soft Contact Shadow cast by the 6-yard saree
    // As fabric unrolls from left (-3.4) to right (+3.4), calculate cloth coverage
    float unfurlFront = smoothstep(0.06, 0.96, uProgress * 1.08);
    float clothLeft = -3.4;
    float clothRight = mix(-3.4, 3.4, unfurlFront);

    // Horizontal shadow envelope with soft edge blur
    float shadowX = smoothstep(clothLeft - 0.8, clothLeft + 0.3, vWorldPos.x)
                  * (1.0 - smoothstep(clothRight - 0.2, clothRight + 0.9, vWorldPos.x));

    // Vertical shadow profile: main cloth body + deep contact pool under lower drape hem
    float clothBodyShadow = smoothstep(-1.6, -0.9, vWorldPos.y) * (1.0 - smoothstep(0.9, 1.6, vWorldPos.y));
    float floorOcclusion = smoothstep(-1.85, -1.25, vWorldPos.y) * smoothstep(-0.65, -1.25, vWorldPos.y);

    float totalShadow = shadowX * max(clothBodyShadow * 0.60, floorOcclusion * 0.75);

    // Occlude wall illumination in the contact shadow zone:
    vec3 illuminatedWall = wallColor + rakingWash;
    vec3 inShadowWall = vec3(0.024, 0.020, 0.017); // Deep contact shadow behind the heavy silk
    vec3 finalRgb = mix(illuminatedWall, inShadowWall, totalShadow);

    // Soft atmospheric alpha tied to unfurling opacity
    float alpha = uOpacity * 0.88;

    gl_FragColor = vec4(finalRgb, alpha);
  }
`;
