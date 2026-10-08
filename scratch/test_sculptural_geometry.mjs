import * as THREE from 'three';

function evaluateClothPosition(u, v, p) {
  const unfurlFront = THREE.MathUtils.smoothstep(p * 1.05, 0.04, 0.96);
  const widthOpening = THREE.MathUtils.smoothstep(p, 0.05, 0.22);
  const spreadX = THREE.MathUtils.lerp(0.15, 1.0, widthOpening);
  const activeDrape = THREE.MathUtils.smoothstep(p, 0.04, 0.25);

  let spineX, spineY, spineZ;

  // 1. PHYSICAL CASCADE 3D CURVILINEAR TRAJECTORY
  // Origin: Elevated plinth at back-left (-2.20, 0.16, -0.95)
  // Descent: Cascades diagonally forward-right under gravity
  // Touchdown: First contact with stone floor at u=0.28 at (-1.45, -1.08, -0.25)
  // Continuous Grounded Drape: u in [0.28, 0.70] sweeps gracefully across stone (-1.45 to -0.65, Z: -0.25 to +0.35)
  // Monumental Pallu: u in [0.70, 1.00] curves into open center-foreground (-0.65 to -0.15, Z: +0.35 to +0.92)

  if (u < 0.28) {
    // Stage 1: Soft Supported Descent (Gentle diagonal plunge)
    const t = u / 0.28;
    const s = t * t * (3 - 2 * t);
    spineX = THREE.MathUtils.lerp(-2.20, -1.45, s) * spreadX;
    spineY = THREE.MathUtils.lerp(0.16, -1.08, s) * activeDrape;
    spineZ = THREE.MathUtils.lerp(-0.95, -0.25, s) * activeDrape;
  } else if (u < 0.70) {
    // Stage 2: Continuous Grounded Drape on Stone Floor
    const t = (u - 0.28) / 0.42;
    const s = t * t * (3 - 2 * t);
    spineX = THREE.MathUtils.lerp(-1.45, -0.65, s) * spreadX;
    spineY = THREE.MathUtils.lerp(-1.08, -1.10, s) * activeDrape;
    spineZ = THREE.MathUtils.lerp(-0.25, 0.35, s) * activeDrape;
  } else {
    // Stage 3: Monumental Foreground Pallu Climax
    const t = (u - 0.70) / 0.30;
    const s = t * t * (3 - 2 * t);
    spineX = THREE.MathUtils.lerp(-0.65, -0.15, s) * spreadX;
    spineY = THREE.MathUtils.lerp(-1.10, -1.08, s) * activeDrape;
    spineZ = THREE.MathUtils.lerp(0.35, 0.92, s) * activeDrape;
  }

  // Cross-Section Fabric Width & Natural Horizontal Resting Bias
  const fabricWidth = 1.48;
  const isGrounded = THREE.MathUtils.smoothstep(u, 0.15, 0.32);
  
  // At origin: diagonal bias tilt (NOT a vertical wall!)
  // On stone floor: flattens horizontally across the stone plinth!
  const widthOffsetX = (v - 0.5) * fabricWidth * THREE.MathUtils.lerp(0.52, 0.88, isGrounded);
  const widthOffsetY = (v - 0.5) * fabricWidth * THREE.MathUtils.lerp(-0.26, 0.02, isGrounded);
  const widthOffsetZ = -(v - 0.5) * fabricWidth * THREE.MathUtils.lerp(0.66, 0.28, isGrounded);

  let posX = spineX + widthOffsetX;
  let posY = spineY + widthOffsetY;
  let posZ = spineZ + widthOffsetZ;

  // Unrolling trailing bundle (relaxes at pallu climax)
  const rollDistance = u - unfurlFront;
  const palluRelaxClimax = THREE.MathUtils.smoothstep(p, 0.72, 0.94);
  const rollDamp = 1.0 - palluRelaxClimax * 0.92;
  if (rollDistance > 0.0) {
    const rollFactor = Math.min(1.0, Math.max(0.0, rollDistance / 0.12));
    const curlAngle = rollFactor * Math.PI * 2.0;
    posZ -= (Math.sin(curlAngle) * 0.32 + rollFactor * 0.95) * rollDamp;
    posX -= ((1.0 - Math.cos(curlAngle)) * 0.16 * spreadX) * rollDamp;
  }

  // --- HIERARCHY OF ASYMMETRIC FOLD MASSES ---

  // FOLD 1: The Origin Descent Chute (u in [0.04, 0.28])
  const env1 = THREE.MathUtils.smoothstep(u, 0.04, 0.12) * (1.0 - THREE.MathUtils.smoothstep(u, 0.22, 0.30));
  const chutePhase = Math.min(1.0, Math.max(0.0, (u - 0.04) / 0.24));
  const chute = Math.sin(chutePhase * Math.PI);
  const diag1 = (u - 0.04) * 5.5 + (v - 0.5) * 1.6;
  const fold1 = Math.sin(diag1) * chute * 0.32;
  const disp1X = -fold1 * 0.14;
  const disp1Y = -chute * 0.18 + Math.max(0.0, fold1) * 0.20;
  const disp1Z = fold1 * 0.42;

  // FOLD 2: Grounded Compression Mass & Splitting Fold (u in [0.26, 0.72])
  // Strongly localized asymmetric fold mass: outer flank (v > 0.45) rolls high into a sculptural crest,
  // while inner flank (v < 0.40) rests flat on the stone floor!
  const env2 = THREE.MathUtils.smoothstep(u, 0.24, 0.34) * (1.0 - THREE.MathUtils.smoothstep(u, 0.64, 0.74));
  const outerFlank = THREE.MathUtils.smoothstep(v, 0.35, 0.65); // 0 at inner, 1 at outer
  const phase2 = (u - 0.26) / 0.44 * Math.PI * 1.8 + (v - 0.5) * 1.4;
  
  // Dominant broad fold roll on outer flank
  const fold2_Dominant = (Math.sin(phase2) * 0.38 + Math.sin(phase2 * 0.5 - 0.3) * 0.22) * outerFlank;
  
  // Secondary splitting fold branching off at contact area
  const splitEnv = THREE.MathUtils.smoothstep(u, 0.36, 0.48) * (1.0 - THREE.MathUtils.smoothstep(u, 0.54, 0.66));
  const fold2_Split = Math.sin(phase2 * 2.2 + 0.9) * 0.14 * splitEnv * outerFlank;
  const fold2_Net = fold2_Dominant + fold2_Split;

  // Sculptural lift: billows up to 0.32m off floor on the outer flank
  const disp2X = -Math.cos(phase2) * 0.14 * outerFlank;
  const disp2Y = Math.max(0.0, fold2_Net) * 0.35; // 0.35m high crest on outer flank!
  const disp2Z = fold2_Net * 0.48;

  // FOLD 3: Monumental Foreground Pallu Roll & Relaxed Spread (u in [0.65, 1.00])
  const env3 = THREE.MathUtils.smoothstep(u, 0.64, 0.78);
  const palluProg = THREE.MathUtils.smoothstep(p, 0.60, 0.88);
  const palluU = Math.max(0.0, Math.min(1.0, (u - 0.66) / 0.34));
  // Flattens and spreads on stone at leading edge
  const palluSpread = 1.0 - THREE.MathUtils.smoothstep(u, 0.84, 0.98) * 0.80;
  const palluFlank = THREE.MathUtils.smoothstep(v, 0.30, 0.60);
  const palluPhase = palluU * Math.PI * 1.2 + (v - 0.5) * 0.6;
  const fold3_Roll = Math.sin(palluPhase) * 0.32 * palluSpread * palluFlank;
  
  const disp3X = Math.sin(palluU * Math.PI) * 0.16 * palluProg;
  const disp3Y = Math.max(0.0, fold3_Roll) * 0.26 * palluSpread;
  const disp3Z = fold3_Roll * 0.42 * palluProg;

  posX += (disp1X * env1 + disp2X * env2 + disp3X * env3) * activeDrape;
  posY += (disp1Y * env1 + disp2Y * env2 + disp3Y * env3) * activeDrape;
  posZ += (disp1Z * env1 + disp2Z * env2 + disp3Z * env3) * activeDrape;

  // Edge tension and curl
  const bottomDist = Math.min(1.0, Math.max(0.0, v / 0.08));
  const topDist = Math.min(1.0, Math.max(0.0, (1.0 - v) / 0.08));
  const bCurl = Math.max(0.0, 1.0 - bottomDist);
  const tCurl = Math.max(0.0, 1.0 - topDist);
  posZ += (bCurl * bCurl * 0.040 - tCurl * tCurl * 0.030) * activeDrape;

  // Physical stone plinth contact support & lateral compression
  const floorRestY = -1.12;
  if (posY < floorRestY) {
    const pen = floorRestY - posY;
    posY = floorRestY + 0.003 * THREE.MathUtils.smoothstep(pen, 0.0, 0.08);
    posX += Math.sign(v - 0.5) * pen * 0.42;
    posZ += (1.0 - THREE.MathUtils.smoothstep(pen, 0.0, 0.15)) * pen * 0.32;
  }

  return new THREE.Vector3(posX, posY, posZ);
}

console.log('=== TEST ASYMMETRY AT u = 0.45 (p = 0.75) ===');
[0.1, 0.3, 0.5, 0.75, 0.9].forEach(v => {
  const pt = evaluateClothPosition(0.45, v, 0.75);
  console.log(`v=${v.toFixed(2)}: Y=${pt.y.toFixed(3)} Z=${pt.z.toFixed(3)} heightAboveFloor=${(pt.y - (-1.12)).toFixed(3)}m`);
});

console.log('\n=== TEST ASYMMETRY AT u = 0.75 (p = 0.75) ===');
[0.1, 0.3, 0.5, 0.75, 0.9].forEach(v => {
  const pt = evaluateClothPosition(0.75, v, 0.75);
  console.log(`v=${v.toFixed(2)}: Y=${pt.y.toFixed(3)} Z=${pt.z.toFixed(3)} heightAboveFloor=${(pt.y - (-1.12)).toFixed(3)}m`);
});
