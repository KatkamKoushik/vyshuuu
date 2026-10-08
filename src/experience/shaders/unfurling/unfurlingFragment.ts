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
    // 1. Texture Sampling within Canonical Active Textile Interior
    // -------------------------------------------------------------------------
    // Remap mesh UV strictly within the active handloom woven plane,
    // permanently eliminating white canvas plate margins:
    // Safe active woven textile interior (leaving margin away from the scanning white plate):
    // Image rows 25 to 754 (V in [0.042..0.965]), Cols 24 to 1973 (U in [0.012..0.988])
    vec2 clothUv = vec2(
      mix(0.012, 0.988, clamp(uv.x, 0.0, 1.0)),
      mix(0.042, 0.965, clamp(uv.y, 0.0, 1.0))
    );

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
      baseColor = texture2D(tBaseColor, clothUv).rgb;
      // Absolute safeguard: clamp any residual neutral plate margin pixels to dark obsidian silk
      if (baseColor.r > 0.68 && baseColor.g > 0.68 && baseColor.b > 0.62) {
        baseColor = vec3(0.065, 0.060, 0.054);
      }
      zariMask = texture2D(tZariMask, clothUv).r;
      borderMask = texture2D(tBorderMask, clothUv).r;
      palluMask = texture2D(tPalluMask, clothUv).r;
      redAccent = texture2D(tRedAccent, clothUv).r;
      
      vec4 dirSample = texture2D(tWeaveDirection, clothUv);
      weaveDir = dirSample.rg;

      roughnessVal = texture2D(tRoughness, clothUv).r;
      
      vec3 normSample = texture2D(tMicroNormal, clothUv).rgb;
      microNormalLocal = normalize(normSample * 2.0 - 1.0);

      edgeFringeVal = texture2D(tEdgeFringe, clothUv).r;
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
    float clothVisibility = smoothstep(uv.x - 0.10, uv.x, unfurlFront);

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

    // Two-sided normal consistency for organic cascading silk folds
    if (dot(Ng, V) < 0.0) {
      Ng = -Ng;
      T = -T;
      B = -B;
    }

    // Micro-normal catches thread crests under lateral grazing illumination
    float facingAngle = clamp(dot(Ng, V), 0.0, 1.0);
    float grazingView = pow(max(1.0 - facingAngle, 0.0001), 2.2);
    float microNormalWeight = mix(0.06, 0.25, grazingView);
    vec3 perturbedLocal = normalize(mix(vec3(0.0, 0.0, 1.0), microNormalLocal, microNormalWeight));
    vec3 N = normalize(perturbedLocal.x * T + perturbedLocal.y * B + perturbedLocal.z * Ng);

    // -------------------------------------------------------------------------
    // 4. Lateral Raking Key Light Sweep & Wide Architectural Beam Envelope
    // -------------------------------------------------------------------------
    vec3 L = normalize(uLightPos - vWorldPos);
    vec3 H = normalize(L + V);

    float NdotL = max(0.0, dot(N, L));
    float NdotV = max(0.0, dot(N, V));
    float NdotH = max(0.0, dot(N, H));

    // Wide, elegant lateral beam envelope:
    // Peaks at key light focus (~100%), but maintains generous ambient illumination (~55%)
    // across the entire 6 yards so the textile is never submerged in blackness
    float beamDistX = abs(vWorldPos.x - uLightPos.x);
    float beamEnvelope = mix(0.55, 1.0, exp(-beamDistX * beamDistX * 0.06));

    // Acute grazing angle: key light strikes at an acute raking angle across both flanks
    float grazingBeamAngle = clamp(abs(dot(Ng, L)), 0.0, 1.0);
    float rakingIncident = smoothstep(0.04, 0.38, grazingBeamAngle) * beamEnvelope;

    // -------------------------------------------------------------------------
    // 5. Authentic Zari Metallic Response & True Fabric Albedo
    // -------------------------------------------------------------------------
    // Preserve rich handloom silk albedo:
    // Base color already contains authentic woven obsidian twill, gold checks, and border motifs
    vec3 diffuseAlbedo = baseColor;

    // Anisotropic metallic thread crest glints along 06_WEAVE_DIRECTION
    vec2 dirCentered = (weaveDir - 0.5) * 2.0;
    vec3 anisoTangent = normalize(dirCentered.x * T + dirCentered.y * B + 0.01 * Ng);
    float TdotH = dot(anisoTangent, H);

    // High exponent for sharp metallic thread crest glints
    float anisoExponent = mix(35.0, 140.0, zariMask);
    float anisoSpec = pow(clamp(1.0 - TdotH * TdotH, 0.0001, 1.0), anisoExponent * 0.5);

    // Blinn component
    float roughnessNorm = clamp(roughnessVal, 0.18, 0.80);
    float shininess = clamp((2.0 / (roughnessNorm * roughnessNorm + 0.001)) - 2.0, 15.0, 160.0);
    float blinnSpec = pow(max(NdotH, 0.0001), shininess);

    // Pallu entry modulation (major reveal between 70% and 90%)
    float palluReveal = smoothstep(0.65, 0.88, uProgress) * palluMask;

    // Specular ignition gating: zari glints catch light across the weave
    float rakingGlintGate = pow(max(NdotL, 0.0001), 1.8) * rakingIncident;
    float zariSpecular = (anisoSpec * 0.82 + blinnSpec * 0.18) * zariMask * rakingGlintGate * (1.30 + palluReveal * 0.50);

    // Liquid silk luster across charcoal body contours:
    float silkSheen = pow(max(1.0 - NdotV, 0.0001), 3.2) * (1.0 - zariMask * 0.5) * 0.35 * max(0.20, NdotL);

    // -------------------------------------------------------------------------
    // 6. Diffuse & Architectural Depth Integration (High-CRI Exhibition Lighting)
    // -------------------------------------------------------------------------
    // Material selvedge ambient occlusion: subtle, natural edge shadow
    float selvedgeAOFactor = smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.96, uv.y);
    float selvedgeAO = mix(0.55, 1.0, selvedgeAOFactor);

    // Half-Lambert diffuse scattering: light gently wraps around curved silk folds
    // preventing harsh black cutoffs in pleat valleys
    float wrappedNdotL = dot(N, L) * 0.5 + 0.5;
    float diffuseWrap = wrappedNdotL * 0.70 + 0.30;
    vec3 diffuseColor = diffuseAlbedo * diffuseWrap * (uLightIntensity * 0.55) * beamEnvelope * selvedgeAO;

    // Architectural depth falloff: folds receding into negative space maintain soft visibility
    float depthAtmosphere = smoothstep(-1.8, 0.8, vWorldPos.z);

    // Warm floor bounce on downward-facing pleat valleys
    float floorBounce = max(0.0, -N.y) * 0.12;
    vec3 ambientFloorBounce = vec3(0.045, 0.038, 0.026) * floorBounce;

    // Rich gallery ambient fill: reveals weave texture and check geometry in shadow
    vec3 ambientFill = vec3(0.18, 0.16, 0.14);
    vec3 ambientColor = (ambientFill * baseColor * 2.5 * selvedgeAO + ambientFloorBounce) * mix(0.85, 1.0, depthAtmosphere);

    // Specular color blend: vibrant antique gold (#C5A869) and warm silk luster
    vec3 zariGlintColor = uZariColor * zariSpecular * 1.6;
    vec3 silkGlintColor = vec3(0.10, 0.09, 0.075) * silkSheen;
    vec3 specularColor = zariGlintColor + silkGlintColor;

    vec3 finalRgb = (ambientColor + diffuseColor + specularColor) * mix(0.78, 1.0, depthAtmosphere);

    // Auspicious Red Accent (fine dyed silk twill)
    if (redAccent > 0.05) {
      finalRgb = mix(finalRgb, finalRgb * uRedAccentColor * 1.8, redAccent * 0.45);
    }

    // -------------------------------------------------------------------------
    // 7. Material-Based Opaque Selvedge (Zero Cartoon Outline)
    // -------------------------------------------------------------------------
    float finalAlpha = uOpacity * clothVisibility;

    // Subtle edge fringe mask at loose pallu yarn tassels
    if (edgeFringeVal > 0.01) {
      finalAlpha *= mix(1.0, 0.70, edgeFringeVal);
    }

    gl_FragColor = vec4(finalRgb, finalAlpha);
  }
`;
