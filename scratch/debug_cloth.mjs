function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
function mix(x, y, a) {
  return x * (1 - a) + y * a;
}

function evaluateClothPosition(uvCoord, p) {
  const u = uvCoord.x;
  const v = uvCoord.y;

  const unfurlFront = smoothstep(0.04, 0.96, p * 1.05);
  const widthOpening = smoothstep(0.05, 0.22, p);
  const spreadX = mix(0.06, 1.0, widthOpening);
  const activeDrape = smoothstep(0.06, 0.35, p);

  const spineX = mix(-2.35, 1.45, u) * spreadX;
  const descentT = smoothstep(0.06, 0.55, u);
  const spineY = mix(0.55, -0.92, descentT) * activeDrape;
  const spineZ = mix(-0.85, 0.82, u) * activeDrape;

  const fabricWidth = 1.60;
  const widthOffsetY = (v - 0.5) * fabricWidth * 0.75;
  const widthOffsetZ = -(v - 0.5) * fabricWidth * 0.55;

  let pos = {
    x: spineX,
    y: spineY + widthOffsetY,
    z: spineZ + widthOffsetZ
  };

  // Mass A
  const massA_Env = smoothstep(0.06, 0.16, u) * (1.0 - smoothstep(0.28, 0.38, u));
  const massA_Phase = (u - 0.08) / 0.28;
  const safePhaseA = Math.max(0, Math.min(1, massA_Phase));
  const safeSinA = Math.sin(safePhaseA * Math.PI);
  const massA_RollZ = safeSinA * 0.48 * (1.0 + (1.0 - v) * 0.30);
  const massA_SagY = -Math.pow(safeSinA, 1.6) * 0.18;
  const massA_PullX = -safeSinA * 0.14;

  pos.x += massA_PullX * massA_Env * activeDrape;
  pos.y += massA_SagY * massA_Env * activeDrape;
  pos.z += massA_RollZ * massA_Env * activeDrape;

  // Mass B
  const massB_Env = smoothstep(0.32, 0.44, u) * (1.0 - smoothstep(0.66, 0.76, u));
  const diagB = (u - 0.36) / 0.36 * Math.PI * 2.0 + (v - 0.5) * 1.35;
  const foldB_Raw = Math.sin(diagB) * 0.65 + Math.sin(diagB * 0.5 - 0.25) * 0.40;
  const foldB_Profile = Math.sign(foldB_Raw) * Math.pow(Math.abs(foldB_Raw), 0.78);
  const ampB = 0.64 * mix(1.22, 0.82, v);

  pos.x += -Math.cos(diagB) * 0.15 * ampB * massB_Env * activeDrape;
  pos.y += -Math.abs(foldB_Profile) * 0.22 * ampB * massB_Env * activeDrape;
  pos.z += foldB_Profile * ampB * massB_Env * activeDrape;

  // Mass C
  const massC_Env = smoothstep(0.66, 0.82, u);
  const palluProgress = smoothstep(0.60, 0.88, p);
  const palluLocalU = (u - 0.68) / 0.32;
  const safePalluU = Math.max(0, Math.min(1, palluLocalU));

  const palluRollPhase = safePalluU * Math.PI * 1.35 + (v - 0.5) * 0.75;
  const palluRollZ = (Math.sin(palluRollPhase) * 0.52 + Math.pow(safePalluU, 1.6) * 0.45) * palluProgress;
  const palluRollY = (-Math.cos(palluRollPhase) * 0.24 - palluProgress * 0.28) * palluProgress;
  const palluRollX = Math.sin(safePalluU * Math.PI) * 0.25 * palluProgress;

  pos.x += palluRollX * massC_Env * activeDrape;
  pos.y += palluRollY * massC_Env * activeDrape;
  pos.z += palluRollZ * massC_Env * activeDrape;

  // Floor contact
  const floorPlinthY = -0.96;
  if (pos.y < floorPlinthY) {
    const penetration = floorPlinthY - pos.y;
    pos.y = floorPlinthY + Math.sin(penetration * 8.0) * 0.012;
    pos.z += penetration * 0.38;
    pos.x += Math.sign(pos.x + 0.1) * penetration * 0.18;
  }

  return pos;
}

const eps = 0.005;
const p = 0.45;
const camPos = { x: 0.35, y: 1.05, z: 4.60 };

console.log("=== CHECKING ALL U FROM 0.0 TO 1.0 ===");
let hasNaN = false;
for (let u = 0.0; u <= 1.001; u += 0.05) {
  const uv = { x: u, y: 0.5 };
  const currentPos = evaluateClothPosition(uv, p);
  if (isNaN(currentPos.x) || isNaN(currentPos.y) || isNaN(currentPos.z)) {
    console.error(`NaN AT u=${u.toFixed(2)}`);
    hasNaN = true;
  } else {
    console.log(`u=${u.toFixed(2)} pos=(${currentPos.x.toFixed(2)}, ${currentPos.y.toFixed(2)}, ${currentPos.z.toFixed(2)})`);
  }
}
if (!hasNaN) {
  console.log("ALL POSITIONS ARE 100% VALID NUMBERS! NO NaNs!");
}
