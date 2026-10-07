export const unfurlingVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec3 vTangent;
  varying vec3 vBitangent;

  uniform float uTime;
  uniform float uProgress;
  uniform float uScrollVelocity;
  uniform float uFoldAmplitude;
  uniform float uFoldFrequency;
  uniform float uPleatDensity;
  uniform float uContinuumSag;
  uniform float uSettlingEnergy;
  uniform vec2 uPointer;

  // Analytical 3D deformation function for the 6-Yard Unfurling Cloth
  vec3 evaluateClothPosition(vec2 uvCoord, float p) {
    float baseWidth = 6.8;
    float baseHeight = 2.4;

    // Unfurling leading front along the length of the 6-yard saree (U axis)
    float unfurlFront = smoothstep(0.06, 0.96, p * 1.08);

    // Initial filament phase (0% -> 15%):
    // Cloth starts compressed tightly to a slender vertical column at X=0, Y spans [-height/2..height/2]
    float widthOpening = smoothstep(0.08, 0.32, p);
    float spreadX = mix(0.08, 1.0, widthOpening);

    // Cloth coordinate along length: unrolls from anchor (U=0) forward to pallu (U=1)
    vec3 pos = vec3(
      (uvCoord.x - 0.5) * baseWidth * spreadX,
      (uvCoord.y - 0.5) * baseHeight,
      0.0
    );

    // -------------------------------------------------------------------------
    // 1. Physical Unrolling Trailing Bundle (Leading Edge vs Rolled Fabric)
    // -------------------------------------------------------------------------
    // For fabric beyond the current unfurl front, wrap it tightly back into the
    // gathered trailing bundle in deep negative Z space
    float rollDistance = uvCoord.x - unfurlFront;
    if (rollDistance > 0.0) {
      float rollFactor = clamp(rollDistance / 0.16, 0.0, 1.0);
      float curlAngle = rollFactor * 3.14159265 * 2.2;
      // Cylindrical curl back into darkness
      pos.z -= sin(curlAngle) * 0.45 + rollFactor * 1.2;
      pos.x -= (1.0 - cos(curlAngle)) * 0.25 * spreadX;
    }

    // -------------------------------------------------------------------------
    // 2. Sculptural 3D Catenary S-Curve & Depth (Real Fabric Form)
    // -------------------------------------------------------------------------
    float activeDrape = smoothstep(0.12, 0.50, p);
    // Deep S-curve ribbon contour spanning Z from -0.85m to +0.55m
    float sCurveZ = -sin(uvCoord.x * 3.14159265 * 1.4 - 0.25) * 0.85 * activeDrape;
    // Viscous catenary sag under heavy self-weight
    float catenarySag = -sin(uvCoord.x * 3.14159265) * sin(uvCoord.y * 3.14159265) * 0.55 * activeDrape;

    // -------------------------------------------------------------------------
    // 3. Irregular Pleat Architecture (Mass, Compression & Gravitational Sag)
    // -------------------------------------------------------------------------
    // Pleats are localized in the central pleat zone (U in [0.24, 0.65])
    float pleatZoneU = (uvCoord.x - 0.24) / 0.41;
    float pleatEnvelope = smoothstep(0.20, 0.30, uvCoord.x) * (1.0 - smoothstep(0.60, 0.68, uvCoord.x));
    float pleatPhase = smoothstep(0.35, 0.82, p);

    // Dynamic amplitude boosted by instantaneous scroll velocity
    float velocityBoost = clamp(abs(uScrollVelocity) * 1.4, 0.0, 1.6);
    float dynamicAmplitude = 0.52 * (1.0 + velocityBoost * 0.40);

    // Non-uniform accordion pleats (asymmetrical fold crests and compressed shadow valleys)
    float pleatHarmonic = pleatZoneU * 16.5 + sin(pleatZoneU * 6.28) * 1.8 - cos(pleatZoneU * 3.14) * 0.5;
    float pleatWave = (sin(pleatHarmonic) * 0.58 
                    + sin(pleatHarmonic * 0.5 + 0.45) * 0.32 
                    - pow(abs(cos(pleatHarmonic * 0.5)), 2.4) * 0.28);

    // Gravity compression: pleats sag deeper and bunch closer toward lower hem
    float gravitySag = mix(0.75, 1.35, 1.0 - uvCoord.y);
    float pleatDisplacement = pleatWave * dynamicAmplitude * pleatEnvelope * pleatPhase * gravitySag;

    // -------------------------------------------------------------------------
    // 4. The Pallu Sweep (Major Reveal between 65% and 90%)
    // -------------------------------------------------------------------------
    // The Pallu (U > 0.66) is initially held in deep negative space in shadow;
    // as p reaches 0.65 -> 0.88, it sweeps forward in a majestic diagonal turn
    float isPallu = smoothstep(0.66, 0.96, uvCoord.x);
    float palluSweep = smoothstep(0.62, 0.88, p);
    
    // Sweeps from back (-0.9m) to front (+0.45m)
    float palluForwardZ = mix(-0.85, 0.45, palluSweep) * isPallu;
    float palluDiagonalTurn = isPallu * palluSweep * -0.25;

    // Natural selvedge outer edge tension curl
    float borderCurl = (pow(1.0 - uvCoord.y, 5.0) - pow(uvCoord.y, 5.0)) * 0.05 * activeDrape;

    // -------------------------------------------------------------------------
    // 5. Settled Equilibrium & Micro-Breathing (90% -> 100%)
    // -------------------------------------------------------------------------
    float settledFactor = smoothstep(0.88, 1.0, p);
    float settlingBreath = sin(uTime * 0.75 + uvCoord.x * 2.2) * (0.008 * (1.0 - settledFactor * 0.65) + 0.002);

    // Combine all spatial displacements
    pos.z += sCurveZ + catenarySag + pleatDisplacement + palluForwardZ + borderCurl + settlingBreath;
    pos.y += palluDiagonalTurn - pleatDisplacement * 0.18;

    // Subtle pointer tactile disturbance
    float distToPointer = length(uvCoord - (uPointer * 0.5 + 0.5));
    float pointerDisplacement = exp(-distToPointer * 6.5) * 0.06 * (1.0 - settledFactor * 0.6);
    pos.z += pointerDisplacement;

    return pos;
  }

  void main() {
    vUv = uv;

    vec3 currentPos = evaluateClothPosition(uv, uProgress);

    // Compute geometric tangent and normal via central differences on the deformed manifold
    float eps = 0.006;
    vec3 posDx = evaluateClothPosition(uv + vec2(eps, 0.0), uProgress);
    vec3 posDy = evaluateClothPosition(uv + vec2(0.0, eps), uProgress);

    vec3 tangentU = normalize(posDx - currentPos);
    vec3 tangentV = normalize(posDy - currentPos);
    vec3 geomNormal = normalize(cross(tangentU, tangentV));

    vNormal = normalize(normalMatrix * geomNormal);
    vTangent = normalize(normalMatrix * tangentU);
    vBitangent = normalize(normalMatrix * tangentV);

    vec4 worldPos = modelMatrix * vec4(currentPos, 1.0);
    vWorldPos = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;
