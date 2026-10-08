import * as THREE from 'three';

function evaluateSpineNew(u, v, p) {
  const unfurlFront = THREE.MathUtils.smoothstep(p * 1.05, 0.04, 0.96);
  const widthOpening = THREE.MathUtils.smoothstep(p, 0.05, 0.22);
  const spreadX = THREE.MathUtils.lerp(0.15, 1.0, widthOpening);
  const activeDrape = THREE.MathUtils.smoothstep(p, 0.04, 0.25);

  let spineX, spineY, spineZ;

  // 1. PHYSICAL CASCADE TRAJECTORY
  // Origin: Elevated low architectural plinth at back-left (-2.35, -0.35, -1.15)
  // Touchdown: Hits stone floor early at u=0.24 at (-1.55, -1.10, -0.35)
  // Continuous Grounded Drape: u in [0.24, 0.70] stays resting continuously on stone plinth (-1.55 to -0.55, Y=-1.10)
  // Monumental Foreground Pallu: u in [0.70, 1.00] curves into open center-foreground (-0.55 to -0.15, Z=0.35 to 0.95)

  if (u < 0.24) {
    // Stage 1: Soft Supported Descent (Gentle 45-degree diagonal plunge, NOT a vertical wall!)
    const t = u / 0.24;
    const s = t * t * (3 - 2 * t);
    spineX = THREE.MathUtils.lerp(-2.35, -1.55, s) * spreadX;
    // Drops from low plinth (-0.35) to stone floor (-1.10)
    spineY = THREE.MathUtils.lerp(-0.35, -1.10, s) * activeDrape;
    spineZ = THREE.MathUtils.lerp(-1.15, -0.35, s) * activeDrape;
  } else if (u < 0.70) {
    // Stage 2: Continuous Grounded Central Drape on Stone Floor
    const t = (u - 0.24) / 0.46;
    const s = t * t * (3 - 2 * t);
    // Sweeps forward-right across the open center-left canvas (-1.55 to -0.55)
    spineX = THREE.MathUtils.lerp(-1.55, -0.55, s) * spreadX;
    // Firmly supported on stone floor throughout:
    spineY = THREE.MathUtils.lerp(-1.10, -1.10, s) * activeDrape;
    spineZ = THREE.MathUtils.lerp(-0.35, 0.35, s) * activeDrape;
  } else {
    // Stage 3: Monumental Foreground Pallu Climax
    const t = (u - 0.70) / 0.30;
    const s = t * t * (3 - 2 * t);
    // Curves into open center-left foreground (-0.55 to -0.15)
    spineX = THREE.MathUtils.lerp(-0.55, -0.15, s) * spreadX;
    // Resting on stone plinth (-1.10 to -1.08)
    spineY = THREE.MathUtils.lerp(-1.10, -1.08, s) * activeDrape;
    // Sweeps forward towards viewer into foreground (+0.35 to +0.95)
    spineZ = THREE.MathUtils.lerp(0.35, 0.95, s) * activeDrape;
  }

  // Cross-Section Fabric Width & Natural Horizontal Resting Bias
  const fabricWidth = 1.48;
  
  // Saree width orientation:
  // At origin: diagonal bias tilt, NOT a vertical wall!
  // On stone floor: flattens out horizontally across the stone!
  const isGrounded = THREE.MathUtils.smoothstep(u, 0.12, 0.30);
  const widthOffsetX = (v - 0.5) * fabricWidth * THREE.MathUtils.lerp(0.55, 0.88, isGrounded);
  const widthOffsetY = (v - 0.5) * fabricWidth * THREE.MathUtils.lerp(-0.16, 0.02, isGrounded);
  const widthOffsetZ = -(v - 0.5) * fabricWidth * THREE.MathUtils.lerp(0.62, 0.24, isGrounded);

  let posX = spineX + widthOffsetX;
  let posY = spineY + widthOffsetY;
  let posZ = spineZ + widthOffsetZ;

  // Unrolling trailing roll bundle (relaxes at pallu climax)
  const rollDistance = u - unfurlFront;
  const palluRelaxClimax = THREE.MathUtils.smoothstep(p, 0.75, 0.95);
  const rollDamp = 1.0 - palluRelaxClimax * 0.90;
  if (rollDistance > 0.0) {
    const rollFactor = Math.min(1.0, Math.max(0.0, rollDistance / 0.12));
    const curlAngle = rollFactor * Math.PI * 2.0;
    posZ -= (Math.sin(curlAngle) * 0.30 + rollFactor * 0.90) * rollDamp;
    posX -= ((1.0 - Math.cos(curlAngle)) * 0.15 * spreadX) * rollDamp;
  }

  // --- THREE HIERARCHICAL FOLD MASSES ---
  // Fold 1: Diagonal Descent (u in [0.04, 0.26])
  const env1 = THREE.MathUtils.smoothstep(u, 0.04, 0.12) * (1.0 - THREE.MathUtils.smoothstep(u, 0.20, 0.28));
  const chute = Math.sin(Math.min(1.0, Math.max(0.0, (u - 0.04) / 0.22)) * Math.PI);
  const diagPhase1 = (u - 0.04) * 6.0 + (v - 0.5) * 1.6;
  const fold1 = Math.sin(diagPhase1) * chute * 0.24;
  const disp1X = -fold1 * 0.10;
  const disp1Y = -chute * 0.14 - Math.abs(fold1) * 0.08;
  const disp1Z = fold1 * 0.28;

  // Fold 2: Grounded Compression Mass & Splitting Branch (u in [0.24, 0.68])
  const env2 = THREE.MathUtils.smoothstep(u, 0.22, 0.32) * (1.0 - THREE.MathUtils.smoothstep(u, 0.62, 0.72));
  const innerRelax = THREE.MathUtils.smoothstep(v, 0.40, 0.10); // inner edge relaxed on stone
  const phase2 = (u - 0.24) / 0.44 * Math.PI * 1.8 + (v - 0.5) * 1.3;
  // Dominant broad outer fold
  const fold2_Dominant = Math.sin(phase2) * 0.34 * (1.0 - innerRelax * 0.85);
  // Secondary fold splitting off at contact
  const splitEnv = THREE.MathUtils.smoothstep(u, 0.34, 0.46) * (1.0 - THREE.MathUtils.smoothstep(u, 0.54, 0.66));
  const fold2_Split = Math.sin(phase2 * 2.1 + 0.9) * 0.10 * splitEnv * (1.0 - innerRelax * 0.85);
  const fold2_Net = fold2_Dominant + fold2_Split;
  const disp2X = -Math.cos(phase2) * 0.10 * (1.0 - innerRelax * 0.85);
  const disp2Y = Math.abs(fold2_Net) * 0.10; // lifts slightly off stone
  const disp2Z = fold2_Net * 0.36;

  // Fold 3: Monumental Foreground Pallu Roll & Spread (u in [0.65, 1.00])
  const env3 = THREE.MathUtils.smoothstep(u, 0.64, 0.78);
  const palluProg = THREE.MathUtils.smoothstep(p, 0.60, 0.88);
  const palluU = Math.max(0.0, Math.min(1.0, (u - 0.66) / 0.34));
  const palluSpread = 1.0 - THREE.MathUtils.smoothstep(u, 0.86, 0.98) * 0.75; // flattens on stone at leading edge
  const palluPhase = palluU * Math.PI * 1.2 + (v - 0.5) * 0.6;
  const fold3_Roll = Math.sin(palluPhase) * 0.26 * palluSpread;
  const disp3X = Math.sin(palluU * Math.PI) * 0.14 * palluProg;
  const disp3Y = Math.abs(fold3_Roll) * 0.08 * palluSpread;
  const disp3Z = fold3_Roll * 0.32 * palluProg;

  posX += (disp1X * env1 + disp2X * env2 + disp3X * env3) * activeDrape;
  posY += (disp1Y * env1 + disp2Y * env2 + disp3Y * env3) * activeDrape;
  posZ += (disp1Z * env1 + disp2Z * env2 + disp3Z * env3) * activeDrape;

  // Floor support & compression
  const floorRestY = -1.12;
  if (posY < floorRestY) {
    const pen = floorRestY - posY;
    posY = floorRestY + 0.003 * THREE.MathUtils.smoothstep(pen, 0.0, 0.08);
    posX += Math.sign(v - 0.5) * pen * 0.42;
    posZ += (1.0 - THREE.MathUtils.smoothstep(pen, 0.0, 0.15)) * pen * 0.32;
  }

  return new THREE.Vector3(posX, posY, posZ);
}

const camera = new THREE.PerspectiveCamera(45, 1440 / 900, 0.1, 100);
camera.position.set(0.05, 1.05, 4.70);
camera.lookAt(-0.35, -0.48, 0.10);
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

console.log('=== TEST AT p = 0.45 ===');
[0.0, 0.12, 0.24, 0.35, 0.45].forEach(u => {
  const ptCenter = evaluateSpineNew(u, 0.5, 0.45);
  const ptBottom = evaluateSpineNew(u, 0.0, 0.45);
  const vProj = ptCenter.clone().project(camera);
  const screenX = (vProj.x * 0.5 + 0.5) * 1440;
  const screenY = (-(vProj.y * 0.5) + 0.5) * 900;
  console.log(`u=${u.toFixed(2)} center: (${ptCenter.x.toFixed(2)}, ${ptCenter.y.toFixed(2)}, ${ptCenter.z.toFixed(2)}) floorGap=${(ptBottom.y - (-1.12)).toFixed(3)}m screen: (${screenX.toFixed(0)}, ${screenY.toFixed(0)})`);
});

console.log('\n=== TEST AT p = 0.75 ===');
[0.0, 0.12, 0.24, 0.45, 0.65, 0.75].forEach(u => {
  const ptCenter = evaluateSpineNew(u, 0.5, 0.75);
  const ptBottom = evaluateSpineNew(u, 0.0, 0.75);
  const vProj = ptCenter.clone().project(camera);
  const screenX = (vProj.x * 0.5 + 0.5) * 1440;
  const screenY = (-(vProj.y * 0.5) + 0.5) * 900;
  console.log(`u=${u.toFixed(2)} center: (${ptCenter.x.toFixed(2)}, ${ptCenter.y.toFixed(2)}, ${ptCenter.z.toFixed(2)}) floorGap=${(ptBottom.y - (-1.12)).toFixed(3)}m screen: (${screenX.toFixed(0)}, ${screenY.toFixed(0)})`);
});

console.log('\n=== TEST AT p = 0.92 ===');
[0.0, 0.12, 0.24, 0.45, 0.70, 0.85, 1.0].forEach(u => {
  const ptCenter = evaluateSpineNew(u, 0.5, 0.92);
  const ptBottom = evaluateSpineNew(u, 0.0, 0.92);
  const vProj = ptCenter.clone().project(camera);
  const screenX = (vProj.x * 0.5 + 0.5) * 1440;
  const screenY = (-(vProj.y * 0.5) + 0.5) * 900;
  console.log(`u=${u.toFixed(2)} center: (${ptCenter.x.toFixed(2)}, ${ptCenter.y.toFixed(2)}, ${ptCenter.z.toFixed(2)}) floorGap=${(ptBottom.y - (-1.12)).toFixed(3)}m screen: (${screenX.toFixed(0)}, ${screenY.toFixed(0)})`);
});
