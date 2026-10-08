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

  // Analytical Sculptural 3D Drape & Plinth Contact Manifold for the 6-Yard Continuous Saree (PASS 1B)
  vec3 evaluateClothPosition(vec2 uvCoord, float p) {
    float u = uvCoord.x;
    float v = uvCoord.y;

    // Unfurling leading front along the 6-yard continuum (U axis)
    float unfurlFront = smoothstep(0.04, 0.96, p * 1.05);

    // Initial filament phase (0% -> 12%): width emerges from slender vertical column
    float widthOpening = smoothstep(0.04, 0.20, p);
    float spreadX = mix(0.18, 1.0, widthOpening);

    // Active drape activation as fabric unrolls
    float activeDrape = smoothstep(0.03, 0.22, p);

    // -------------------------------------------------------------------------
    // 1. REVISED THREE-ZONE PHYSICAL SPATIAL TRAJECTORY
    // -------------------------------------------------------------------------
    // ZONE A: Lower, heavier architectural plinth at back-left (-1.90, -0.16, -0.95)
    // Rapid gravitational plunge: hits stone floor early by u=0.25 at (-1.35, -1.08, -0.22)
    // ZONE B: Continuous grounded S-drape on stone plinth u in [0.25, 0.65] (-1.35 to -0.55, Z: -0.22 to +0.35)
    // ZONE C: Monumental foreground pallu u in [0.65, 1.00] curves into open foreground (-0.55 to -0.18, Z: +0.35 to +0.95)
    
    float spineX, spineY, spineZ;

    if (u < 0.25) {
      // Stage 1: Soft Supported Descent (Gentle 40-degree diagonal plunge, NOT a vertical wall)
      float t1 = u / 0.25;
      float s1 = t1 * t1 * (3.0 - 2.0 * t1);
      spineX = mix(-1.80, -0.95, s1) * spreadX;
      // Drops gracefully from low plinth (-0.32) down to stone floor level (-1.08)
      spineY = mix(-0.32, -1.08, s1) * activeDrape;
      spineZ = mix(-1.05, -0.25, s1) * activeDrape;
    } else if (u < 0.65) {
      // Stage 2: Continuous Grounded Central S-Drape on Stone Floor
      float t2 = (u - 0.25) / 0.40;
      float s2 = t2 * t2 * (3.0 - 2.0 * t2);
      // Sweeps forward through central sculptural zone (-0.95 to -0.50)
      spineX = mix(-0.95, -0.50, s2) * spreadX;
      // Supported on stone floor throughout (Y=-1.10)
      spineY = mix(-1.08, -1.10, s2) * activeDrape;
      spineZ = mix(-0.25, 0.35, s2) * activeDrape;
    } else {
      // Stage 3: Monumental Foreground Pallu Spreading into Open Canvas
      float t3 = (u - 0.65) / 0.35;
      float s3 = t3 * t3 * (3.0 - 2.0 * t3);
      // Curves into open center-left foreground (-0.50 to -0.30)
      spineX = mix(-0.50, -0.30, s3) * spreadX;
      // Resting on stone plinth (-1.10 to -1.10)
      spineY = mix(-1.10, -1.10, s3) * activeDrape;
      // Sweeps forward towards the viewer into foreground (+0.35 to +1.02)
      spineZ = mix(0.35, 1.02, s3) * activeDrape;
    }

    // MUCH WIDER FABRIC MASS (2.35m broad luxury silk continuum)
    // Saree spreads wide across the stone floor rather than reading as a narrow strip
    float fabricWidth = 2.35;
    float isGrounded = smoothstep(0.12, 0.30, u);
    float widthOffsetX = (v - 0.5) * fabricWidth * mix(0.55, 0.90, isGrounded);
    float widthOffsetY = (v - 0.5) * fabricWidth * mix(-0.12, 0.01, isGrounded);
    float widthOffsetZ = -(v - 0.5) * fabricWidth * mix(0.65, 0.26, isGrounded);

    vec3 pos = vec3(
      spineX + widthOffsetX,
      spineY + widthOffsetY,
      spineZ + widthOffsetZ
    );

    // -------------------------------------------------------------------------
    // 2. Physical Unrolling Trailing Bundle (Relaxes at Pallu Climax)
    // -------------------------------------------------------------------------
    float rollDistance = u - unfurlFront;
    float palluRelaxClimax = smoothstep(0.68, 0.90, p);
    float rollDamp = 1.0 - palluRelaxClimax;
    if (rollDistance > 0.0) {
      float rollFactor = clamp(rollDistance / 0.12, 0.0, 1.0);
      float curlAngle = rollFactor * 3.14159265 * 2.0;
      pos.z -= (sin(curlAngle) * 0.30 + rollFactor * 0.90) * rollDamp;
      pos.x -= ((1.0 - cos(curlAngle)) * 0.15 * spreadX) * rollDamp;
    }

    // -------------------------------------------------------------------------
    // 3. HIERARCHY OF THREE PRIMARY MASS ZONES (Heavy silk under gravity)
    // -------------------------------------------------------------------------

    // FOLD 1: The Origin Descent Plunge Fold (U in [0.03, 0.28])
    // One colossal, heavy catenary plunge fold sagging under massive silk weight
    float env1 = smoothstep(0.03, 0.10, u) * (1.0 - smoothstep(0.22, 0.30, u));
    float chutePhase = clamp((u - 0.03) / 0.25, 0.0, 1.0);
    float chute = sin(chutePhase * 3.14159265);
    float diag1 = (u - 0.03) * 4.8 + (v - 0.5) * 1.4;
    float fold1 = sin(diag1) * chute * 0.36;
    float disp1X = -fold1 * 0.14;
    float disp1Y = -chute * 0.20 + max(0.0, fold1) * 0.22;
    float disp1Z = fold1 * 0.45;

    // FOLD 2: Grounded Compression Mass & Broad Stone Pooling (U in [0.24, 0.68])
    // One HUGE, asymmetrical fold mass on the outer flank, while the inner flank pools flat on stone
    float env2 = smoothstep(0.22, 0.32, u) * (1.0 - smoothstep(0.62, 0.72, u));
    float outerFlank = smoothstep(0.32, 0.68, v);
    float phase2 = (u - 0.24) / 0.42 * 3.14159265 * 1.6 + (v - 0.5) * 1.3;
    
    // Colossal primary fold roll on outer flank
    float fold2_Massive = (sin(phase2) * 0.44 + sin(phase2 * 0.5 - 0.25) * 0.26) * outerFlank;
    
    // Single secondary split fold branching off at stone touchdown
    float splitEnv = smoothstep(0.34, 0.46, u) * (1.0 - smoothstep(0.52, 0.64, u));
    float fold2_Split = sin(phase2 * 2.0 + 0.8) * 0.16 * splitEnv * outerFlank;
    float fold2_Net = fold2_Massive + fold2_Split;

    float velBoost = clamp(abs(uScrollVelocity) * 1.2, 0.0, 1.0);
    float amp2 = (1.0 + velBoost * 0.18);

    vec3 disp2 = vec3(
      -cos(phase2) * 0.16 * outerFlank * amp2,
      max(0.0, fold2_Net) * 0.38 * amp2,
      fold2_Net * 0.52 * amp2
    );

    // FOLD 3: Monumental Foreground Pallu Wave & Spreading Relax (U in [0.62, 1.00])
    // One large relaxed roll around u in [0.65, 0.80], then FLATTENS onto stone for u in [0.82, 1.00]
    float env3 = smoothstep(0.60, 0.74, u);
    float palluProg = smoothstep(0.58, 0.86, p);
    float palluU = clamp((u - 0.62) / 0.38, 0.0, 1.0);
    // Roll active in early pallu, flattens to zero at the leading edge (u > 0.85)
    float rollWave = sin(clamp((u - 0.65) / 0.20, 0.0, 1.0) * 3.14159265);
    float fold3_Roll = rollWave * 0.28 * smoothstep(0.25, 0.65, v);

    vec3 disp3 = vec3(
      sin(palluU * 3.14159265) * 0.18 * palluProg,
      fold3_Roll * 0.24 * (1.0 - smoothstep(0.82, 0.96, u)),
      fold3_Roll * 0.40 * palluProg
    );

    pos += (vec3(disp1X, disp1Y, disp1Z) * env1 + disp2 * env2 + disp3 * env3) * activeDrape;

    // Subtle, structurally controlled selvedge edge behavior
    float bottomDist = clamp(v / 0.08, 0.0, 1.0);
    float topDist = clamp((1.0 - v) / 0.08, 0.0, 1.0);
    float bCurl = max(0.0, 1.0 - bottomDist);
    float tCurl = max(0.0, 1.0 - topDist);
    pos.z += (bCurl * bCurl * 0.035 - tCurl * tCurl * 0.025) * activeDrape;

    // -------------------------------------------------------------------------
    // 4. PHYSICAL STONE PLINTH SUPPORT & PREVENT HOVERING
    // -------------------------------------------------------------------------
    float floorRestY = -1.12;
    
    // Force grounded edges to lie flat against the stone floor rather than hovering
    float edgeRelaxInner = (1.0 - smoothstep(0.0, 0.18, v)) * isGrounded;
    float edgeRelaxOuter = smoothstep(0.88, 1.0, v) * isGrounded * smoothstep(0.80, 1.0, u);
    pos.y = mix(pos.y, floorRestY, edgeRelaxInner * 0.85);
    pos.y = mix(pos.y, floorRestY, edgeRelaxOuter * 0.75);

    if (pos.y < floorRestY) {
      float penetration = floorRestY - pos.y;
      pos.y = floorRestY; // physically flush with stone slab
      // Under gravitational compression, the cloth spreads outward laterally in X and Z
      pos.x += sign(v - 0.5) * penetration * 0.45;
      pos.z += penetration * 0.35;
    }

    // -------------------------------------------------------------------------
    // 5. Settling Relaxation (90% -> 100%) & Subtle Breathing
    // -------------------------------------------------------------------------
    float settledFactor = smoothstep(0.88, 1.0, p);
    pos.y -= settledFactor * 0.022 * env3;
    float settlingBreath = sin(uTime * 0.70 + u * 1.8) * (0.003 * (1.0 - settledFactor * 0.7) + 0.001);
    pos.z += settlingBreath;

    // Pointer disturbance
    float distToPointer = length(uvCoord - (uPointer * 0.5 + 0.5));
    float pointerDisplacement = exp(-distToPointer * 6.5) * 0.026 * (1.0 - settledFactor * 0.6);
    pos.z += pointerDisplacement;

    return pos;
  }

  void main() {
    vUv = uv;

    vec3 currentPos = evaluateClothPosition(uv, uProgress);

    // Compute geometric tangent and normal via forward finite differences on the deformed manifold
    float eps = 0.005;
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
