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
    // 1. Texture Sampling & Material Attributes (9 Locked Maps)
    // -------------------------------------------------------------------------
    vec3 baseColor;
    float zariMask = 0.0;
    float borderMask = 0.0;
    float palluMask = 0.0;
    float redAccent = 0.0;
    vec2 weaveDir = vec2(0.5, 0.5); // [0.5, 0.5] = [128, 128] neutral
    float roughnessVal = 0.58;
    vec3 microNormalLocal = vec3(0.0, 0.0, 1.0);
    float edgeFringeVal = 0.0;

    if (uHasTextures > 0.5) {
      baseColor = texture2D(tBaseColor, uv).rgb;
      zariMask = texture2D(tZariMask, uv).r;
      borderMask = texture2D(tBorderMask, uv).r;
      palluMask = texture2D(tPalluMask, uv).r;
      redAccent = texture2D(tRedAccent, uv).r;
      
      vec4 dirSample = texture2D(tWeaveDirection, uv);
      weaveDir = dirSample.rg; // R = transverse/weft, G = longitudinal/warp

      roughnessVal = texture2D(tRoughness, uv).r;
      
      vec3 normSample = texture2D(tMicroNormal, uv).rgb;
      microNormalLocal = normalize(normSample * 2.0 - 1.0);

      edgeFringeVal = texture2D(tEdgeFringe, uv).r;
    } else {
      baseColor = uBaseColor;
      if (uv.x > 0.68) {
        zariMask = smoothstep(0.4, 0.6, sin(uv.x * 60.0) * cos(uv.y * 30.0));
      }
      roughnessVal = mix(0.58, 0.28, zariMask);
    }

    // -------------------------------------------------------------------------
    // 2. Progressive Physical Unfurling Visibility
    // -------------------------------------------------------------------------
    float unfurlFront = smoothstep(0.06, 0.96, uProgress * 1.08);
    float clothVisibility = smoothstep(uv.x - 0.12, uv.x, unfurlFront);

    if (clothVisibility <= 0.01) {
      discard;
    }

    // -------------------------------------------------------------------------
    // 3. Normal Vector Transformation with Restrained Micro-Weave
    // -------------------------------------------------------------------------
    vec3 T = normalize(vTangent);
    vec3 B = normalize(vBitangent);
    vec3 Ng = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    // Texture scale refinement: silk body reads first as liquid-smooth MATERIAL.
    // Micro-normal is heavily suppressed at facing angles, revealing thread relief
    // only under steep grazing/raking illumination.
    float facingAngle = clamp(dot(Ng, V), 0.0, 1.0);
    float grazingView = pow(1.0 - facingAngle, 2.5);
    float microNormalWeight = mix(0.06, 0.28, grazingView);
    vec3 perturbedLocal = normalize(mix(vec3(0.0, 0.0, 1.0), microNormalLocal, microNormalWeight));
    vec3 N = normalize(perturbedLocal.x * T + perturbedLocal.y * B + perturbedLocal.z * Ng);

    // -------------------------------------------------------------------------
    // 4. Controlled Lateral Raking Illumination Sweep
    // -------------------------------------------------------------------------
    vec3 L = normalize(uLightPos - vWorldPos);
    vec3 H = normalize(L + V);

    float NdotL = max(0.0, dot(N, L));
    float NdotV = max(0.0, dot(N, V));
    float NdotH = max(0.0, dot(N, H));

    // Controlled raking angle factor: light grazes along fold crests
    float rakingGrazing = pow(clamp(1.0 - abs(dot(Ng, L)), 0.0, 1.0), 2.2);
    float rakingIncident = smoothstep(0.02, 0.35, dot(Ng, L));

    // -------------------------------------------------------------------------
    // 5. Zari Refinement: Dark at Rest, Ignites ONLY under Raking Light
    // -------------------------------------------------------------------------
    // Metallicity suppresses diffuse albedo: metallic zari absorbs non-specular light,
    // appearing as rich antique bronze / deep charcoal at rest (NO glowing gold bands)
    vec3 darkAntiqueRest = vec3(0.045, 0.038, 0.028);
    vec3 diffuseAlbedo = mix(baseColor, darkAntiqueRest, zariMask * 0.88);

    // Anisotropic thread highlight (Ward-style along 06_WEAVE_DIRECTION)
    vec2 dirCentered = (weaveDir - 0.5) * 2.0;
    vec3 anisoTangent = normalize(dirCentered.x * T + dirCentered.y * B + 0.01 * Ng);
    float TdotH = dot(anisoTangent, H);

    // High exponent for narrow, sharp, elegant thread crest glints
    float anisoExponent = mix(32.0, 128.0, zariMask);
    float anisoSpec = pow(clamp(1.0 - TdotH * TdotH, 0.0, 1.0), anisoExponent * 0.5);

    // Blinn microfacet component
    float roughnessNorm = clamp(roughnessVal, 0.18, 0.82);
    float shininess = (2.0 / (roughnessNorm * roughnessNorm + 0.001)) - 2.0;
    shininess = clamp(shininess, 8.0, 128.0);
    float blinnSpec = pow(NdotH, shininess);

    // Pallu entry modulation (major reveal between 70% and 90%)
    float palluReveal = smoothstep(0.65, 0.88, uProgress) * palluMask;

    // Specular ignition gating: zari ignites ONLY when raking light hits at grazing specular angle
    float rakingGlintGate = pow(NdotL, 2.4) * rakingIncident;
    float zariSpecular = (anisoSpec * 0.80 + blinnSpec * 0.20) * zariMask * rakingGlintGate * (1.2 + palluReveal * 0.6);

    // Soft isotropic Kora silk sheen on the charcoal silk body
    float silkSheen = pow(1.0 - NdotV, 3.2) * (1.0 - zariMask) * 0.35 * (NdotL + 0.15);

    // -------------------------------------------------------------------------
    // 6. Diffuse & Ambient Color Composite
    // -------------------------------------------------------------------------
    // Restrained diffuse lighting: avoids generic flood illumination
    float diffuseWrap = max(0.0, (dot(N, L) + 0.12) / 1.12);
    vec3 diffuseColor = diffuseAlbedo * diffuseWrap * uLightIntensity * (0.75 + rakingGrazing * 0.45);

    // Deep obsidian ambient shadow
    vec3 ambientColor = vec3(0.018, 0.016, 0.015);

    // Specular color blend: restrained antique gold (#C5A869)
    vec3 zariGlintColor = uZariColor * zariSpecular;
    vec3 silkGlintColor = uSheenColor * silkSheen;
    vec3 specularColor = zariGlintColor + silkGlintColor;

    vec3 finalRgb = ambientColor + diffuseColor + specularColor;

    // Auspicious Red Accent (fine dyed silk twill)
    if (redAccent > 0.05) {
      finalRgb = mix(finalRgb, finalRgb * uRedAccentColor * 1.5, redAccent * 0.40);
    }

    // -------------------------------------------------------------------------
    // 7. Edge Fringe Mask Alpha Taper
    // -------------------------------------------------------------------------
    float finalAlpha = uOpacity * clothVisibility;
    if (edgeFringeVal > 0.01) {
      finalAlpha *= mix(1.0, 0.75, edgeFringeVal);
    }

    // Selvedge vignette
    float edgeVignette = smoothstep(0.0, 0.018, uv.y) * smoothstep(1.0, 0.982, uv.y);
    finalAlpha *= mix(0.75, 1.0, edgeVignette);

    gl_FragColor = vec4(finalRgb, finalAlpha);
  }
`;
