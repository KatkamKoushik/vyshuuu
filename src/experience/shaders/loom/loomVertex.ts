export const loomVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uProgress;
  uniform float uSpecimenProgress;
  uniform float uFoldAmplitude;
  uniform float uFoldFrequency;
  uniform float uSurfaceDepth;
  uniform float uContinuumBend;

  void main() {
    vUv = uv;

    vec3 transformed = position;

    // 1. Loom Baseline Drape: Gentle catenary sag along the center
    float sag = -sin(uv.x * 3.14159265) * 0.08 * sin(uv.y * 3.14159265);
    float breath = sin(uTime * 0.5 + uv.x * 1.5) * 0.005 * smoothstep(0.4, 1.0, uProgress);
    // Smoothly phase out flat loom sag as specimen spatial fold engages
    transformed.z += (sag + breath) * (1.0 - smoothstep(0.0, 0.35, uSpecimenProgress));

    // 2. SHOT 12.5 Natural Heavy Silk Fold (Non-periodic, viscous drape memory):
    // Single predominant asymmetrical cascading fold with soft secondary drape
    float foldP = smoothstep(0.10, 0.70, uSpecimenProgress);
    if (foldP > 0.001) {
      // Long-wavelength asymmetrical fold crest along length
      float foldX = (uv.x - 0.40) * 3.14159265 * uFoldFrequency;
      // Asymmetric weighting: smooth bell-shaped crest rather than a mechanical sine wave
      float foldCrest = (sin(foldX) * 0.70 + sin(foldX * 0.5 + 0.4) * 0.35);
      
      // Width taper: silk drapes gracefully with slight tension along top edge
      float foldYMod = cos((uv.y - 0.5) * 2.0);
      float foldDisp = foldCrest * foldYMod * uFoldAmplitude * foldP;

      // Selvedge border tension: subtle micro-curl on outer edges
      float edgeCurl = (pow(1.0 - uv.y, 6.0) - pow(uv.y, 6.0)) * 0.035 * foldP;

      // Soft diagonal drape bias (tension across unstitched bias)
      float diagBias = (uv.x * 0.3 - uv.y * 0.2) * 0.08 * foldP;

      transformed.z += foldDisp + edgeCurl + diagBias;

      // Subtle tactile surface depth
      transformed.z += sin(uv.x * 40.0) * (uSurfaceDepth * 0.002) * foldP;
    }

    // 3. Continuum Architecture (0.78 -> 1.00):
    // Continuous diagonal ribbon extending beyond darkness toward the six-yard saree
    float contP = smoothstep(0.78, 1.0, uSpecimenProgress);
    if (contP > 0.001) {
      float arch = -pow(max(0.0, uv.x - 0.30), 2.2) * 1.4 * uContinuumBend * contP;
      float twist = sin(uv.x * 2.4) * 0.22 * contP;
      transformed.z += arch + twist;
      transformed.y += sin(uv.x * 1.5) * 0.18 * contP;
    }

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPos = worldPosition.xyz;

    // Normal calculation: smooth derivative of fold deformation
    vec3 N = normal;
    if (foldP > 0.001) {
      float dFdX = cos((uv.x - 0.40) * 3.14159265 * uFoldFrequency) * uFoldAmplitude * foldP * 0.75;
      N = normalize(vec3(-dFdX, 0.0, 1.0));
    }
    vNormal = normalize(normalMatrix * N);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;
