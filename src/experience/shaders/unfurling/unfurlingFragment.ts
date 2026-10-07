export const unfurlingFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vTangent;
  varying vec3 vBitangent;

  uniform float uTime;
  uniform float uProgress;
  uniform float uScrollVelocity;
  uniform vec2 uPointer;
  uniform vec3 uLightPos;
  uniform float uLightIntensity;
  uniform float uQualityTier;
  uniform float uOpacity;

  // Color constants
  uniform vec3 uBaseColor;
  uniform vec3 uZariColor;
  uniform vec3 uSheenColor;
  uniform vec3 uRedAccentColor;

  // 9 Locked Production Texture Samplers
  uniform sampler2D tBaseColor;
  uniform sampler2D tZariMask;
  uniform sampler2D tBorderMask;
  uniform sampler2D tPalluMask;
  uniform sampler2D tRedAccent;
  uniform sampler2D tWeaveDirection;
  uniform sampler2D tRoughness;
  uniform sampler2D tMicroNormal;
  uniform sampler2D tEdgeFringe;
  uniform float uHasTextures;

  void main() {
    if (uOpacity <= 0.001) {
      discard;
    }

    vec2 uv = vUv;

    // -------------------------------------------------------------------------
    // 1. Texture Sampling & Material Attributes
    // -------------------------------------------------------------------------
    vec3 baseColor;
    float zariMask = 0.0;
    float borderMask = 0.0;
    float palluMask = 0.0;
    float redAccent = 0.0;
    vec2 weaveDir = vec2(0.5, 0.5); // [0.5, 0.5] = [128, 128] neutral
    float roughnessVal = 0.53;
    vec3 microNormalLocal = vec3(0.0, 0.0, 1.0);
    float edgeFringeVal = 0.0;

    if (uHasTextures > 0.5) {
      // Direct sampling from the 9 locked production maps
      baseColor = texture2D(tBaseColor, uv).rgb;
      zariMask = texture2D(tZariMask, uv).r;
      borderMask = texture2D(tBorderMask, uv).r;
      palluMask = texture2D(tPalluMask, uv).r;
      redAccent = texture2D(tRedAccent, uv).r;
      
      vec4 dirSample = texture2D(tWeaveDirection, uv);
      weaveDir = dirSample.rg; // R = transverse/weft, G = longitudinal/warp

      roughnessVal = texture2D(tRoughness, uv).r; // 72 to 162 mapped to 0..1
      
      vec3 normSample = texture2D(tMicroNormal, uv).rgb;
      // Convert from [0..1] to [-1..1] tangent normal (OpenGL +Y)
      microNormalLocal = normalize(normSample * 2.0 - 1.0);

      edgeFringeVal = texture2D(tEdgeFringe, uv).r;
    } else {
      // Graceful high-fidelity procedural fallback during initial asset transmit
      baseColor = uBaseColor;
      // Synthetic zari motif in pallu area (U > 0.68)
      if (uv.x > 0.68) {
        zariMask = smoothstep(0.4, 0.6, sin(uv.x * 60.0) * cos(uv.y * 30.0));
      }
      roughnessVal = mix(0.58, 0.28, zariMask);
    }

    // -------------------------------------------------------------------------
    // 2. Sequential Unfurling Narrative Emergence
    // -------------------------------------------------------------------------
    // Emergence threshold: reveals cloth gradually along U coordinate
    float emergenceU = smoothstep(0.02, 0.98, uProgress * 1.15);
    float clothVisibility = smoothstep(uv.x - 0.15, uv.x, emergenceU);

    if (clothVisibility <= 0.01) {
      discard;
    }

    // Pallu luster boost when Pallu enters raking light (p > 0.65)
    float palluEntry = smoothstep(0.60, 0.85, uProgress) * palluMask;
    float activeZari = zariMask * (1.0 + palluEntry * 0.4);

    // -------------------------------------------------------------------------
    // 3. Normal Vector Transformation (Tangent Space -> World Space)
    // -------------------------------------------------------------------------
    // Construct TBN matrix from geometric vertex interpolants
    vec3 T = normalize(vTangent);
    vec3 B = normalize(vBitangent);
    vec3 Ng = normalize(vNormal);

    // Micro-normal strength quieted at steep facing angles, responsive at raking angles
    float microNormalWeight = mix(0.4, 0.85, smoothstep(0.2, 0.8, uProgress));
    vec3 perturbedLocal = normalize(mix(vec3(0.0, 0.0, 1.0), microNormalLocal, microNormalWeight));
    vec3 N = normalize(perturbedLocal.x * T + perturbedLocal.y * B + perturbedLocal.z * Ng);

    // -------------------------------------------------------------------------
    // 4. Broad Lateral Raking Illumination
    // -------------------------------------------------------------------------
    // Light is positioned laterally to rake across the pleat folds and thread crowns
    vec3 lightTarget = vWorldPos;
    vec3 L = normalize(uLightPos - lightTarget);
    vec3 V = normalize(vViewDir);
    vec3 H = normalize(L + V);

    float NdotL = max(0.0, dot(N, L));
    float NdotV = max(0.0, dot(N, V));
    float NdotH = max(0.0, dot(N, H));
    float VdotH = max(0.0, dot(V, H));

    // Raking angle factor: enhances grazing illumination across pleats
    float rakingGrazing = pow(1.0 - abs(dot(Ng, L)), 1.8);

    // -------------------------------------------------------------------------
    // 5. Anisotropic Specular Glint (Driven by 06_WEAVE_DIRECTION)
    // -------------------------------------------------------------------------
    // Weave tangent vector in tangent plane
    vec2 dirCentered = (weaveDir - 0.5) * 2.0; // [-1..1]
    vec3 anisoTangent = normalize(dirCentered.x * T + dirCentered.y * B + 0.01 * Ng);

    // Anisotropic specular response (Ward-style highlights along yarn direction)
    float TdotH = dot(anisoTangent, H);
    float anisoExponent = mix(12.0, 48.0, activeZari);
    float anisoSpec = pow(clamp(1.0 - TdotH * TdotH, 0.0, 1.0), anisoExponent * 0.5);

    // Standard Blinn-Phong specular for isotropic micro-roughness
    float roughnessNorm = clamp(roughnessVal, 0.15, 0.85);
    float shininess = (2.0 / (roughnessNorm * roughnessNorm + 0.001)) - 2.0;
    shininess = clamp(shininess, 4.0, 128.0);
    float blinnSpec = pow(NdotH, shininess);

    // Combined specular: metallic zari glint vs soft silk sheen
    float zariSpecular = (anisoSpec * 0.7 + blinnSpec * 0.3) * activeZari * 2.4;
    float silkSheen = pow(1.0 - NdotV, 2.8) * (1.0 - activeZari) * 0.65;

    // -------------------------------------------------------------------------
    // 6. Diffuse & Ambient Color Composite
    // -------------------------------------------------------------------------
    // Soft chiaroscuro wrap lighting (mimicking light scattering through fine silk)
    float wrapFactor = 0.25;
    float diffuseWrap = max(0.0, (dot(N, L) + wrapFactor) / (1.0 + wrapFactor));

    // Ambient shadow fill
    vec3 ambientColor = vec3(0.05, 0.045, 0.04);

    // Final color assembly
    vec3 diffuseColor = baseColor * diffuseWrap * uLightIntensity * (1.0 + rakingGrazing * 0.3);
    vec3 specularColor = mix(uSheenColor, uZariColor, activeZari) * (zariSpecular + silkSheen);
    vec3 finalRgb = ambientColor + diffuseColor + specularColor;

    // Auspicious Red Accent enrichment
    if (redAccent > 0.05) {
      finalRgb = mix(finalRgb, finalRgb * uRedAccentColor * 1.8, redAccent * 0.45);
    }

    // -------------------------------------------------------------------------
    // 7. Edge Fringe Mask Selvedge Alpha Taper
    // -------------------------------------------------------------------------
    float finalAlpha = uOpacity * clothVisibility;
    if (edgeFringeVal > 0.01) {
      // Subtle alpha fray along fringe edge tassels
      finalAlpha *= mix(1.0, 0.75, edgeFringeVal);
    }

    // Subtle edge vignette
    float edgeVignette = smoothstep(0.0, 0.02, uv.y) * smoothstep(1.0, 0.98, uv.y);
    finalAlpha *= mix(0.7, 1.0, edgeVignette);

    gl_FragColor = vec4(finalRgb, finalAlpha);
  }
`;
