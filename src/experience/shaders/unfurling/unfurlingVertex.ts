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

  // Analytical displacement function for the 6-Yard Continuous Textile
  vec3 evaluateClothPosition(vec2 uvCoord, float p) {
    // Canvas dimensions: width 7.2m, height 2.84m (matching canonical 2.538:1)
    float baseWidth = 7.2;
    float baseHeight = 2.84;

    // Centered baseline coordinates [-width/2..width/2, -height/2..height/2]
    vec3 pos = vec3(
      (uvCoord.x - 0.5) * baseWidth,
      (uvCoord.y - 0.5) * baseHeight,
      0.0
    );

    // -------------------------------------------------------------------------
    // Phase 1: 0% -> 15% (Filament to Loom Width Expansion)
    // At p=0, fabric is compressed to a slender vertical column at X=0
    // -------------------------------------------------------------------------
    float widthOpening = smoothstep(0.08, 0.35, p);
    // Unfurl reveals cloth along U axis from left to right as p increases
    float revealU = smoothstep(0.05, 0.95, p * 1.05);
    
    // Smooth compression for unopened portion
    float compressionFactor = mix(0.12, 1.0, widthOpening);
    pos.x *= compressionFactor;

    // -------------------------------------------------------------------------
    // Phase 2: 15% -> 45% (Continuous Fabric Unfurling & Catenary Drape)
    // -------------------------------------------------------------------------
    float unfurlArc = smoothstep(0.15, 0.65, p);
    // Continuous S-curve spatial arc through the 3D scene
    float sCurveZ = -sin(uvCoord.x * 3.14159265 * 1.5 - 0.3) * 0.85 * unfurlArc;
    float catenarySag = -sin(uvCoord.x * 3.14159265) * sin(uvCoord.y * 3.14159265) * uContinuumSag;

    // -------------------------------------------------------------------------
    // Phase 3: 45% -> 70% (Traveling Pleats & Heavy Silk Drape Memory)
    // Pleat waves travel through cloth length; amplitude energized by scroll velocity
    // -------------------------------------------------------------------------
    float pleatPhase = smoothstep(0.35, 0.85, p);
    float velocityBoost = clamp(abs(uScrollVelocity) * 1.2, 0.0, 1.8);
    float dynamicAmplitude = uFoldAmplitude * (1.0 + velocityBoost * 0.45);

    // Rhythmic cascade of asymmetrical pleats (resembling traditional hand-folded pleats)
    float pleatWave1 = sin(uvCoord.x * 3.14159265 * uPleatDensity + p * 3.14159265);
    float pleatWave2 = sin(uvCoord.x * 3.14159265 * (uPleatDensity * 1.8) + 0.8) * 0.4;
    float pleatDisplacement = (pleatWave1 + pleatWave2) * dynamicAmplitude * pleatPhase;

    // Pleats are deeper near the center and drape down gracefully with gravity
    float verticalTension = cos((uvCoord.y - 0.5) * 2.2);
    pleatDisplacement *= max(0.2, verticalTension);

    // -------------------------------------------------------------------------
    // Phase 4: 70% -> 90% (Pallu Sweep & Raking Forward Tilt)
    // The Pallu (U > 0.66) swoops toward the camera to catch lateral raking light
    // -------------------------------------------------------------------------
    float palluWeight = smoothstep(0.66, 0.95, uvCoord.x);
    float palluForwardArc = smoothstep(0.60, 0.90, p) * palluWeight;
    float palluTiltZ = palluForwardArc * 0.75;
    float palluDropY = -palluForwardArc * 0.28;

    // Selvedge outer border curling (natural unstitched edge tension)
    float borderCurl = (pow(1.0 - uvCoord.y, 5.0) - pow(uvCoord.y, 5.0)) * 0.045 * unfurlArc;

    // -------------------------------------------------------------------------
    // Phase 5: 90% -> 100% (Settling Inertia & Harmonic Breathing)
    // -------------------------------------------------------------------------
    float settledFactor = smoothstep(0.85, 1.0, p);
    float settlingBreath = sin(uTime * 0.75 + uvCoord.x * 2.0) * (0.012 * (1.0 - settledFactor * 0.65) + 0.003);

    // Combine all Z deformations
    pos.z += sCurveZ + catenarySag + pleatDisplacement + palluTiltZ + borderCurl + settlingBreath;
    pos.y += palluDropY - pleatDisplacement * 0.15;

    // Subtle pointer disturbance (tactile inspection push)
    float distToPointer = length(uvCoord - (uPointer * 0.5 + 0.5));
    float pointerDisplacement = exp(-distToPointer * 6.0) * 0.08 * (1.0 - settledFactor * 0.5);
    pos.z += pointerDisplacement;

    return pos;
  }

  void main() {
    vUv = uv;

    vec3 currentPos = evaluateClothPosition(uv, uProgress);

    // Calculate analytical normal using central finite differences on the cloth manifold
    float eps = 0.008;
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
