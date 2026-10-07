export const loomFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;
  uniform float uSpecimenProgress;
  uniform vec2 uPointer;
  uniform vec3 uLightPos;
  uniform float uLightIntensity;
  uniform float uWarpDensity;
  uniform float uWeftDensity;
  uniform float uWarpStrength;
  uniform float uWeftStrength;
  uniform float uWeaveIrregularity;
  uniform float uZariMaskStrength;
  uniform float uZariFrequency;
  uniform float uQualityTier;
  uniform vec3 uBaseColor;
  uniform vec3 uZariColor;
  uniform vec3 uSheenColor;
  uniform float uOpacity;
  uniform float uEdgeThickness;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    if (uOpacity <= 0.001) {
      discard;
    }

    // ------------------------------------------------------------------------
    // 1. Procedural Weave Coordinates
    // ------------------------------------------------------------------------
    // Fine organic handloom nuance
    float jitterX = sin(vUv.y * 36.0 + 1.2) * uWeaveIrregularity + cos(vUv.y * 95.0) * (uWeaveIrregularity * 0.35);
    float jitterY = sin(vUv.x * 30.0 + 2.4) * uWeaveIrregularity + cos(vUv.x * 75.0) * (uWeaveIrregularity * 0.35);
    vec2 weaveUv = vUv + vec2(jitterX, jitterY);

    float warpCoord = weaveUv.x * uWarpDensity;
    float weftCoord = weaveUv.y * uWeftDensity;

    float warpPhase = warpCoord * 3.14159265;
    float weftPhase = weftCoord * 3.14159265;

    // Crown cross-sections (rounded thread profiles)
    float warpThread = max(0.0, sin(warpPhase));
    float weftThread = max(0.0, sin(weftPhase));

    // Over-under plain weave interlacing
    float cellX = floor(warpCoord);
    float cellY = floor(weftCoord);
    float isOver = mod(cellX + cellY, 2.0); // 1 = warp is over, 0 = weft is over

    // ------------------------------------------------------------------------
    // 2. Narrative Sequence Progression
    // ------------------------------------------------------------------------
    float effProgress = max(uProgress, smoothstep(0.0, 0.2, uSpecimenProgress));
    float warpVisibility = smoothstep(0.02, 0.22, effProgress);
    float weftVisibility = smoothstep(0.18, 0.42, effProgress);
    float surfaceCohesion = smoothstep(0.35, 0.65, effProgress);
    float rakingVisibility = smoothstep(0.55, 0.85, effProgress);
    float zariVisibility = smoothstep(0.70, 0.95, effProgress);

    // ------------------------------------------------------------------------
    // 3. Distance & Facing Angle Modulation (Silk Hand vs Grid)
    // ------------------------------------------------------------------------
    vec3 L = normalize(uLightPos - vWorldPos);
    vec3 V = normalize(vViewDir);
    vec3 H = normalize(L + V);

    float NdotV_geom = max(0.0, dot(vNormal, V));
    float NdotL_geom = max(0.0, dot(vNormal, L));

    // Facing angle strongly suppresses micro-relief (liquid smooth silk hand at facing angle).
    // Micro-weave is only revealed under steep grazing view angles or acute raking light.
    float grazingFactor = pow(clamp(1.0 - NdotV_geom, 0.0, 1.0), 3.0);
    float rakingFactor = pow(clamp(1.0 - NdotL_geom * 3.2, 0.0, 1.0), 2.2) * smoothstep(0.01, 0.12, NdotL_geom);
    float angleFactor = max(grazingFactor, rakingFactor);

    // Base emergence at facing view is nearly zero (0.01) -> liquid smooth silk
    // Rises gently to 0.42 at grazing / raking conditions
    float weaveEmergence = mix(0.01, 0.42, angleFactor) * surfaceCohesion;

    // ------------------------------------------------------------------------
    // 4. Soft Analytical Yarn Normal Perturbation (Surgically Quieted)
    // ------------------------------------------------------------------------
    // Normal scale quieted to 0.045 max * weaveEmergence (at facing view ~0.0005)
    float normalScale = 0.045 * weaveEmergence;
    float dHx = cos(warpPhase) * (isOver > 0.5 ? 1.0 : 0.20) * warpVisibility * uWarpStrength;
    float dHy = cos(weftPhase) * (isOver < 0.5 ? 1.0 : 0.20) * weftVisibility * uWeftStrength;
    vec3 yarnNormalLocal = normalize(vec3(-dHx * normalScale, -dHy * normalScale, 1.0));

    vec3 N = normalize(
      yarnNormalLocal.x * vec3(1.0, 0.0, 0.0) +
      yarnNormalLocal.y * vec3(0.0, 1.0, 0.0) +
      yarnNormalLocal.z * vNormal
    );

    // ------------------------------------------------------------------------
    // 5. Directional Raking Inspection Beam (Long, Soft, Grazing — No Spotlight)
    // ------------------------------------------------------------------------
    // Surface grazing orientation: Motivated by fold surface orientation
    float NdotL = max(dot(N, L), 0.0);
    // Soft shoulder: avoids a localized bright hotspot
    float shallowRake = pow(NdotL, 1.15) * rakingVisibility;

    // Directional elongated raking beam:
    // Travels diagonally across the textile plane (elongated along the fold axis, soft width)
    vec2 beamDir = normalize(vec2(0.82, 0.57));
    vec2 beamPerp = vec2(-beamDir.y, beamDir.x);
    vec2 deltaPos = vWorldPos.xy - uLightPos.xy;

    float distPerp = abs(dot(deltaPos, beamPerp));
    float distPara = abs(dot(deltaPos, beamDir));

    // Elongated beam profile: width ~ 2.0m, length ~ 6.0m (ratio ~ 3:1)
    float beamProfile = exp(-pow(distPerp / 2.0, 2.0)) * exp(-pow(distPara / 6.0, 2.0));
    float zDist = abs(uLightPos.z - vWorldPos.z);
    float beamDepthAtten = 1.0 / (1.0 + zDist * 0.22);

    // Tangible baseline ambiance (0.22) + soft directional raking sweep (up to 1.0)
    float lightAtten = mix(0.22, 1.0, beamProfile) * beamDepthAtten;

    // ------------------------------------------------------------------------
    // 6. BROAD DIRECTIONAL SILK SHEEN (Hierarchy #2: Dominates over micro-weave)
    // ------------------------------------------------------------------------
    // Silk triangular fiber cross-section produces continuous directional sheen bands.
    // Macroscopic anisotropic lobe across the entire fabric fold:
    vec3 tangentWarp = vec3(0.0, 1.0, 0.0);
    vec3 tangentWeft = vec3(1.0, 0.0, 0.0);

    float dotTH_Warp = dot(tangentWarp, H);
    float sinTH_Warp = sqrt(max(0.0, 1.0 - dotTH_Warp * dotTH_Warp));
    // Broad, sweeping silk highlight (low exponent = soft, liquid luster)
    float broadSpecWarp = pow(sinTH_Warp, 7.5);
    float broadSpecWeft = pow(sqrt(max(0.0, 1.0 - pow(dot(tangentWeft, H), 2.0))), 6.5);
    float broadSilkSheen = mix(broadSpecWeft, broadSpecWarp, 0.72);

    // Subtle micro-thread anisotropic variation (restrained blend)
    float microSpecWarp = pow(sinTH_Warp, 22.0);
    float microSpecWeft = pow(sqrt(max(0.0, 1.0 - pow(dot(tangentWeft, H), 2.0))), 18.0);
    float microSilkSheen = mix(microSpecWeft * weftVisibility, microSpecWarp * warpVisibility, isOver);

    // Composite silk sheen: 90% broad flowing liquid luster, 10% micro-weave variation only under grazing light
    float finalSilkSheen = mix(broadSilkSheen, microSilkSheen, 0.10 * weaveEmergence);
    finalSilkSheen *= smoothstep(0.25, 0.60, effProgress);

    // ------------------------------------------------------------------------
    // 7. SELECTIVE ZARI THREAD SYSTEM (Hierarchy #5: Selective & Discovered)
    // ------------------------------------------------------------------------
    // Zari is NOT applied everywhere. It forms fine, discrete accent threads
    // catching the light only when raking light hits at the correct grazing angle.
    float zariStripe = step(0.965, sin(weaveUv.x * uZariFrequency + 0.6));
    float zariMask = zariStripe * isOver * uZariMaskStrength * zariVisibility;

    // Metallic specular: sharp, warm antique gold luster
    float NdotH = max(dot(N, H), 0.0);
    float zariSpecular = pow(NdotH, 54.0) * zariMask * 1.6;

    // ------------------------------------------------------------------------
    // 8. SILK BODY & FRESNEL BACKSCATTER (Hierarchy #1: Tangible in darkness)
    // ------------------------------------------------------------------------
    // Rich charcoal base with warm kora silk edge luminescence
    float NdotV = max(0.0, dot(N, V));
    float silkFresnel = pow(1.0 - NdotV, 3.2) * 0.26;

    // Ambient body: textile retains tangible presence even when light moves away
    vec3 ambientSilk = uBaseColor * 0.44 + uSheenColor * silkFresnel * 0.14;

    // Diffuse body illuminated by raking light
    vec3 diffuseLight = uBaseColor * (shallowRake * 0.70 * lightAtten * uLightIntensity);
    vec3 diffuseSilk = ambientSilk + diffuseLight;

    // Subtle selvedge border edge treatment (SHOT 12 thickness cue)
    float distToEdgeX = min(vUv.x, 1.0 - vUv.x);
    float distToEdgeY = min(vUv.y, 1.0 - vUv.y);
    float distToEdge = min(distToEdgeX, distToEdgeY);
    float specimenEdgeFactor = smoothstep(0.1, 0.45, uSpecimenProgress);
    float edgeDarkening = mix(1.0, smoothstep(0.0, uEdgeThickness, distToEdge), specimenEdgeFactor * 0.35);
    diffuseSilk *= edgeDarkening;

    // Rim catch-light along physical textile silhouette
    float rimDistance = smoothstep(0.007, 0.001, distToEdge);
    float rimCatch = rimDistance * pow(1.0 - NdotV_geom, 2.5) * specimenEdgeFactor;
    vec3 rimLightContribution = uSheenColor * (rimCatch * 0.55 * shallowRake * lightAtten);

    // ------------------------------------------------------------------------
    // 9. Radiance Composition (Reversed Hierarchy)
    // ------------------------------------------------------------------------
    // Silk Sheen: warm ivory luster flowing broadly across fold crests
    vec3 sheenContribution = uSheenColor * (finalSilkSheen * 0.58 * shallowRake * lightAtten * uLightIntensity);

    // Zari Radiance: discrete golden sparks along accent threads
    vec3 zariRadiance = uZariColor * (shallowRake * 0.16 + zariSpecular) * zariMask * lightAtten * uLightIntensity;

    // Idle organic breathing (whisper of suspension)
    float breathing = sin(uTime * 0.7 + vUv.y * 2.5) * 0.008 * smoothstep(0.5, 1.0, effProgress);

    // Composite final radiance
    vec3 finalColor = diffuseSilk + sheenContribution + zariRadiance + rimLightContribution + (uSheenColor * breathing);

    // Alpha modulation
    float baseAlpha = uOpacity * smoothstep(0.02, 0.12, effProgress);

    // Continuum tail-fade into obsidian darkness
    float continuumTailFade = 1.0 - smoothstep(0.72, 0.98, vUv.x) * smoothstep(0.85, 1.0, uSpecimenProgress);
    float alpha = baseAlpha * continuumTailFade;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
