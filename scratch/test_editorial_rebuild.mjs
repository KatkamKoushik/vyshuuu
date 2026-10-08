import * as THREE from 'three';

function evaluateClothPosition(u, v, p) {
  const unfurlFront = THREE.MathUtils.smoothstep(p * 1.05, 0.04, 0.96);
  const widthOpening = THREE.MathUtils.smoothstep(p, 0.04, 0.20);
  const spreadX = THREE.MathUtils.lerp(0.20, 1.0, widthOpening);
  const activeDrape = THREE.MathUtils.smoothstep(p, 0.03, 0.22);

  // 1. LOWER, HEAVIER PHYSICAL TRAJECTORY
  // Origin: Lower, heavier architectural plinth at back-left (-1.95, -0.25, -0.90)
  // Rapid gravitational plunge: hits stone floor early by u=0.25 at (-1.35, -1.08, -0.20)
  // Grounded S-curve across stone: u in [0.25, 0.65] sweeps across (-1.35 to -0.55, Z: -0.20 to +0.35)
  // Monumental Pallu climax: u in [0.65, 1.00] curves into open foreground (-0.55 to -0.10, Z: +0.35 to +0.95)
  
  let spineX, spineY, spineZ;

  if (u < 0.25) {
    // Stage 1: Heavy, low diagonal origin plunge
    const t = u / 0.25;
    const s = t * t * (3 - 2 * t);
    spineX = THREE.MathUtils.lerp(-1.95, -1.35, s) * spreadX;
    spineY = THREE.MathUtils.lerp(-0.25, -1.08, s) * activeDrape;
    spineZ = THREE.MathUtils.lerp(-0.90, -0.20, s) * activeDrape;
  } else if (u < 0.65) {
    // Stage 2: Continuous Grounded S-Drape on Stone
    const t = (u - 0.25) / 0.40;
    const s = t * t * (3 - 2 * t);
    spineX = THREE.MathUtils.lerp(-1.35, -0.55, s) * spreadX;
    spineY = THREE.MathUtils.lerp(-1.08, -1.10, s) * activeDrape;
    spineZ = THREE.MathUtils.lerp(-0.20, 0.35, s) * activeDrape;
  } else {
    // Stage 3: Monumental Foreground Pallu Spreading into Open Canvas
    const t = (u - 0.65) / 0.35;
    const s = t * t * (3 - 2 * t);
    spineX = THREE.MathUtils.lerp(-0.55, -0.10, s) * spreadX;
    spineY = THREE.MathUtils.lerp(-1.10, -1.08, s) * activeDrape;
    spineZ = THREE.MathUtils.lerp(0.35, 0.95, s) * activeDrape;
  }

  // MUCH WIDER FABRIC MASS (2.35m broad silk continuum)
  const fabricWidth = 2.35;
  const isGrounded = THREE.MathUtils.smoothstep(u, 0.12, 0.30);
  
  // Natural horizontal spreading bias on stone
  const widthOffsetX = (v - 0.5) * fabricWidth * THREE.MathUtils.lerp(0.55, 0.92, isGrounded);
  const widthOffsetY = (v - 0.5) * fabricWidth * THREE.MathUtils.lerp(-0.24, 0.02, isGrounded);
  const widthOffsetZ = -(v - 0.5) * fabricWidth * THREE.MathUtils.lerp(0.65, 0.32, isGrounded);

  let posX = spineX + widthOffsetX;
  let posY = spineY + widthOffsetY;
  let posZ = spineZ + widthOffsetZ;

  // Unrolling trailing bundle (relaxes at pallu climax)
  const rollDistance = u - unfurlFront;
  const palluRelaxClimax = THREE.MathUtils.smoothstep(p, 0.70, 0.92);
  const rollDamp = 1.0 - palluRelaxClimax * 0.95;
  if (rollDistance > 0.0) {
    const rollFactor = Math.min(1.0, Math.max(0.0, rollDistance / 0.12));
    const curlAngle = rollFactor * Math.PI * 2.0;
    posZ -= (Math.sin(curlAngle) * 0.35 + rollFactor * 1.05) * rollDamp;
    posX -= ((1.0 - Math.cos(curlAngle)) * 0.18 * spreadX) * rollDamp;
  }

  // --- 2-3 HUGE IRREGULAR SCULPTURAL FOLDS ---

  // FOLD 1: The Origin Descent Plunge Fold (u in [0.03, 0.28])
  // One colossal, heavy catenary plunge fold sagging under massive silk weight
  const env1 = THREE.MathUtils.smoothstep(u, 0.03, 0.10) * (1.0 - THREE.MathUtils.smoothstep(u, 0.22, 0.30));
  const chutePhase = Math.min(1.0, Math.max(0.0, (u - 0.03) / 0.25));
  const chute = Math.sin(chutePhase * Math.PI);
  // Diagonal fold across bias
  const diag1 = (u - 0.03) * 4.8 + (v - 0.5) * 1.4;
  const fold1 = Math.sin(diag1) * chute * 0.38;
  const disp1X = -fold1 * 0.16;
  const disp1Y = -chute * 0.24 + Math.max(0.0, fold1) * 0.25;
  const disp1Z = fold1 * 0.48;

  // FOLD 2: Grounded Compression Mass & Broad Stone Pooling (u in [0.24, 0.68])
  // One HUGE, asymmetrical fold mass on the outer flank, while the inner flank pools flat on stone
  const env2 = THREE.MathUtils.smoothstep(u, 0.22, 0.32) * (1.0 - THREE.MathUtils.smoothstep(u, 0.62, 0.72));
  const outerFlank = THREE.MathUtils.smoothstep(v, 0.32, 0.68); // 0 at inner, 1 at outer
  const phase2 = (u - 0.24) / 0.42 * Math.PI * 1.6 + (v - 0.5) * 1.3;
  
  // Colossal primary fold roll on outer flank
  const fold2_Massive = (Math.sin(phase2) * 0.44 + Math.sin(phase2 * 0.5 - 0.25) * 0.26) * outerFlank;
  
  // Single secondary split fold branching off at stone touchdown
  const splitEnv = THREE.MathUtils.smoothstep(u, 0.34, 0.46) * (1.0 - THREE.MathUtils.smoothstep(u, 0.52, 0.64));
  const fold2_Split = Math.sin(phase2 * 2.0 + 0.8) * 0.16 * splitEnv * outerFlank;
  const fold2_Net = fold2_Massive + fold2_Split;

  // Sculptural lift: billows up to 0.42m off stone on outer flank
  const disp2X = -Math.cos(phase2) * 0.18 * outerFlank;
  const disp2Y = Math.max(0.0, fold2_Net) * 0.42; // colossal 42cm high sculptural silk roll
  const disp2Z = fold2_Net * 0.55;

  // FOLD 3: Monumental Foreground Pallu Wave & Spreading Relax (u in [0.62, 1.00])
  // One huge sweeping fold in foreground that flattens and spreads luxuriously across stone
  const env3 = THREE.MathUtils.smoothstep(u, 0.60, 0.74);
  const palluProg = THREE.MathUtils.smoothstep(p, 0.58, 0.86);
  const palluU = Math.max(0.0, Math.min(1.0, (u - 0.62) / 0.38));
  // Flattens and relaxes onto stone at leading edge
  const palluSpread = 1.0 - THREE.MathUtils.smoothstep(u, 0.82, 0.98) * 0.85;
  const palluFlank = THREE.MathUtils.smoothstep(v, 0.25, 0.65);
  const palluPhase = palluU * Math.PI * 1.1 + (v - 0.5) * 0.55;
  const fold3_Roll = Math.sin(palluPhase) * 0.36 * palluSpread * palluFlank;
  
  const disp3X = Math.sin(palluU * Math.PI) * 0.22 * palluProg;
  const disp3Y = Math.max(0.0, fold3_Roll) * 0.30 * palluSpread;
  const disp3Z = fold3_Roll * 0.50 * palluProg;

  posX += (disp1X * env1 + disp2X * env2 + disp3X * env3) * activeDrape;
  posY += (disp1Y * env1 + disp2Y * env2 + disp3Y * env3) * activeDrape;
  posZ += (disp1Z * env1 + disp2Z * env2 + disp3Z * env3) * activeDrape;

  // Floor support & edge grounding:
  const floorRestY = -1.12;
  
  // Force edges to lie flat against the stone floor rather than hovering
  const edgeRelaxInner = (1.0 - THREE.MathUtils.smoothstep(v, 0.0, 0.18)) * isGrounded;
  const edgeRelaxOuter = THREE.MathUtils.smoothstep(v, 0.88, 1.0) * isGrounded;
  posY = THREE.MathUtils.lerp(posY, floorRestY, edgeRelaxInner * 0.85);
  posY = THREE.MathUtils.lerp(posY, floorRestY, edgeRelaxOuter * 0.75);

  if (posY < floorRestY) {
    const pen = floorRestY - posY;
    posY = floorRestY; // physically flush with stone
    posX += Math.sign(v - 0.5) * pen * 0.45;
    posZ += pen * 0.35;
  }

  return new THREE.Vector3(posX, posY, posZ);
}

// Camera setup: CLOSER TO FABRIC for physical intimacy and massive visual dominance
const camera = new THREE.PerspectiveCamera(45, 1440 / 900, 0.1, 100);
camera.position.set(-0.12, 0.72, 3.75);
camera.lookAt(-0.48, -0.68, 0.28);
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

console.log('=== TEST AT p = 0.92 (EQUILIBRIUM HERO) ===');
[0.0, 0.15, 0.30, 0.50, 0.70, 0.85, 1.0].forEach(u => {
  const ptLeft = evaluateClothPosition(u, 0.05, 0.92);
  const ptCenter = evaluateClothPosition(u, 0.50, 0.92);
  const ptRight = evaluateClothPosition(u, 0.95, 0.92);

  const projL = ptLeft.clone().project(camera);
  const projC = ptCenter.clone().project(camera);
  const projR = ptRight.clone().project(camera);

  const sxL = (projL.x * 0.5 + 0.5) * 1440;
  const sxR = (projR.x * 0.5 + 0.5) * 1440;
  const syC = (-(projC.y * 0.5) + 0.5) * 900;

  console.log(`u=${u.toFixed(2)} center: (${ptCenter.x.toFixed(2)}, ${ptCenter.y.toFixed(2)}, ${ptCenter.z.toFixed(2)}) screenWidth=${(sxR - sxL).toFixed(0)}px [${sxL.toFixed(0)} -> ${sxR.toFixed(0)}] screenY=${syC.toFixed(0)}`);
});
