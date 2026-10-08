import * as THREE from 'three';

// Simulate the revised 3D trajectory and deformation math
function evaluateSpine(u, v, p) {
  // Unfurling leading front along the 6-yard continuum
  const unfurlFront = THREE.MathUtils.smoothstep(p * 1.05, 0.04, 0.96);
  const widthOpening = THREE.MathUtils.smoothstep(p, 0.05, 0.22);
  const spreadX = THREE.MathUtils.lerp(0.15, 1.0, widthOpening);
  const activeDrape = THREE.MathUtils.smoothstep(p, 0.05, 0.30);

  // 1. REVISED PHYSICAL CASCADE SPATIAL TRAJECTORY
  // Origin: Elevated plinth at back-left: (-2.05, 0.40, -0.85)
  // Descent Touchdown: hits stone floor early by u=0.32 at (-1.35, -1.10, -0.20)
  // Continuous Grounded Drape: u in [0.35, 0.70] stays grounded on stone in center-left: (-0.60, -1.10, 0.35)
  // Monumental Foreground Pallu: u in [0.70, 1.00] rolls into open center-foreground: (-0.15, -1.08, 0.95)

  // Spline-like continuous analytical spine:
  let spineX, spineY, spineZ;

  if (u < 0.35) {
    // Stage 1: Origin to First Floor Contact (Steep gravitational plunge)
    const t = u / 0.35;
    const tSmooth = t * t * (3 - 2 * t);
    spineX = THREE.MathUtils.lerp(-2.05, -1.35, tSmooth) * spreadX;
    // Rapid descent: drops from +0.40 to -1.08 (floor is at -1.12)
    spineY = THREE.MathUtils.lerp(0.40, -1.08, tSmooth) * activeDrape;
    spineZ = THREE.MathUtils.lerp(-0.85, -0.20, tSmooth) * activeDrape;
  } else if (u < 0.70) {
    // Stage 2: Grounded Central Drape & Compression on Stone Plinth
    const t = (u - 0.35) / 0.35;
    const tSmooth = t * t * (3 - 2 * t);
    // Sweeps from -1.35 forward-right to -0.45 (remains safely left of center!)
    spineX = THREE.MathUtils.lerp(-1.35, -0.45, tSmooth) * spreadX;
    // Stays firmly resting on stone floor: -1.08 to -1.10
    spineY = THREE.MathUtils.lerp(-1.08, -1.10, tSmooth) * activeDrape;
    // Sweeps forward in depth: -0.20 to +0.45
    spineZ = THREE.MathUtils.lerp(-0.20, 0.45, tSmooth) * activeDrape;
  } else {
    // Stage 3: Monumental Foreground Pallu Climax (Open center-left foreground)
    const t = (u - 0.70) / 0.30;
    const tSmooth = t * t * (3 - 2 * t);
    // Curves into open center-foreground: -0.45 to -0.05
    spineX = THREE.MathUtils.lerp(-0.45, -0.05, tSmooth) * spreadX;
    // Resting on stone with slight foreground roll: -1.10 to -1.05
    spineY = THREE.MathUtils.lerp(-1.10, -1.05, tSmooth) * activeDrape;
    // Powerful forward depth: +0.45 to +1.05
    spineZ = THREE.MathUtils.lerp(0.45, 1.05, tSmooth) * activeDrape;
  }

  // Cross-section width (V in [0, 1]):
  // Saree width is angled relative to floor, tilting naturally
  const fabricWidth = 1.45;
  // Natural drape tilt: steeper at origin, flattening out on stone contact
  const tiltFactor = THREE.MathUtils.lerp(0.55, 0.18, THREE.MathUtils.smoothstep(u, 0.15, 0.50));
  const widthOffsetY = (v - 0.5) * fabricWidth * tiltFactor;
  const widthOffsetZ = -(v - 0.5) * fabricWidth * 0.75;
  const widthOffsetX = (v - 0.5) * fabricWidth * 0.25;

  let posX = spineX + widthOffsetX;
  let posY = spineY + widthOffsetY;
  let posZ = spineZ + widthOffsetZ;

  // Unrolling trailing roll bundle
  const rollDistance = u - unfurlFront;
  if (rollDistance > 0.0) {
    const rollFactor = Math.min(1.0, Math.max(0.0, rollDistance / 0.12));
    const curlAngle = rollFactor * Math.PI * 2.0;
    posZ -= Math.sin(curlAngle) * 0.35 + rollFactor * 1.1;
    posX -= (1.0 - Math.cos(curlAngle)) * 0.18 * spreadX;
  }

  // --- THREE HIERARCHICAL FOLD MASSES ---
  // Fold 1: Origin Plunge Diagonal
  const env1 = THREE.MathUtils.smoothstep(u, 0.06, 0.16) * (1.0 - THREE.MathUtils.smoothstep(u, 0.28, 0.36));
  const phase1 = Math.max(0.0, Math.min(1.0, (u - 0.08) / 0.26));
  const sin1 = Math.sin(phase1 * Math.PI);
  const disp1Z = sin1 * 0.40 * (1.0 + (1.0 - v) * 0.25);
  const disp1Y = -sin1 * Math.sqrt(sin1) * 0.15;
  const disp1X = -sin1 * 0.12;

  // Fold 2: Central Stone Compression Mass (Broad asymmetrical fold with secondary split)
  const env2 = THREE.MathUtils.smoothstep(u, 0.28, 0.42) * (1.0 - THREE.MathUtils.smoothstep(u, 0.62, 0.74));
  // Asymmetric primary roll
  const phase2 = (u - 0.32) / 0.36 * Math.PI * 2.0 + (v - 0.5) * 1.2;
  const fold2_Primary = Math.sin(phase2) * 0.55 + Math.sin(phase2 * 0.5 - 0.3) * 0.35;
  // Secondary split fold branching off
  const fold2_Secondary = Math.sin(phase2 * 2.2 + 0.8) * 0.12 * THREE.MathUtils.smoothstep(u, 0.38, 0.55);
  const fold2_Net = fold2_Primary + fold2_Secondary;
  const disp2Z = fold2_Net * 0.50;
  const disp2Y = -Math.abs(fold2_Net) * 0.18;
  const disp2X = -Math.cos(phase2) * 0.12;

  // Fold 3: Monumental Foreground Pallu Roll (Curving into open foreground)
  const env3 = THREE.MathUtils.smoothstep(u, 0.64, 0.80);
  const palluProg = THREE.MathUtils.smoothstep(p, 0.60, 0.88);
  const palluU = Math.max(0.0, Math.min(1.0, (u - 0.66) / 0.34));
  const palluPhase = palluU * Math.PI * 1.3 + (v - 0.5) * 0.7;
  const palluCurve = palluU * Math.sqrt(palluU);
  const disp3Z = (Math.sin(palluPhase) * 0.52 + palluCurve * 0.45) * palluProg;
  const disp3Y = (-Math.cos(palluPhase) * 0.18 - palluProg * 0.22) * palluProg;
  const disp3X = Math.sin(palluU * Math.PI) * 0.18 * palluProg;

  posX += (disp1X * env1 + disp2X * env2 + disp3X * env3) * activeDrape;
  posY += (disp1Y * env1 + disp2Y * env2 + disp3Y * env3) * activeDrape;
  posZ += (disp1Z * env1 + disp2Z * env2 + disp3Z * env3) * activeDrape;

  // --- STONE FLOOR CONTACT & POOLING CLAMPING ---
  const floorRestY = -1.12;
  if (posY < floorRestY) {
    const pen = floorRestY - posY;
    posY = floorRestY + Math.sin(pen * 4.0) * 0.008;
    posZ += pen * 0.30;
    posX += Math.sign(v - 0.5) * pen * 0.25;
  }

  return new THREE.Vector3(posX, posY, posZ);
}

// Camera setup for testing
const camera = new THREE.PerspectiveCamera(45, 1440 / 900, 0.1, 100);
// Cinematic 3/4 perspective focused on grounded center-left cascade
camera.position.set(0.05, 1.05, 4.70);
camera.lookAt(-0.35, -0.48, 0.10);
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

console.log('=== TEST AT p = 0.75 ===');
[0.0, 0.15, 0.32, 0.50, 0.70, 0.85, 1.0].forEach(u => {
  const ptCenter = evaluateSpine(u, 0.5, 0.75);
  const ptBottom = evaluateSpine(u, 0.0, 0.75);
  const vProj = ptCenter.clone().project(camera);
  const screenX = (vProj.x * 0.5 + 0.5) * 1440;
  const screenY = (-(vProj.y * 0.5) + 0.5) * 900;
  console.log(`u=${u.toFixed(2)} center: (${ptCenter.x.toFixed(2)}, ${ptCenter.y.toFixed(2)}, ${ptCenter.z.toFixed(2)}) floorGap=${(ptBottom.y - (-1.12)).toFixed(3)}m screen: (${screenX.toFixed(0)}, ${screenY.toFixed(0)})`);
});

console.log('\n=== TEST AT p = 0.92 ===');
[0.0, 0.15, 0.32, 0.50, 0.70, 0.85, 1.0].forEach(u => {
  const ptCenter = evaluateSpine(u, 0.5, 0.92);
  const ptBottom = evaluateSpine(u, 0.0, 0.92);
  const vProj = ptCenter.clone().project(camera);
  const screenX = (vProj.x * 0.5 + 0.5) * 1440;
  const screenY = (-(vProj.y * 0.5) + 0.5) * 900;
  console.log(`u=${u.toFixed(2)} center: (${ptCenter.x.toFixed(2)}, ${ptCenter.y.toFixed(2)}, ${ptCenter.z.toFixed(2)}) floorGap=${(ptBottom.y - (-1.12)).toFixed(3)}m screen: (${screenX.toFixed(0)}, ${screenY.toFixed(0)})`);
});
