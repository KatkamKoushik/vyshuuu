import fs from 'fs';

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

  const spineX = mix(-2.40, 1.50, u) * spreadX;
  const descentT = smoothstep(0.06, 0.55, u);
  const spineY = mix(0.55, -0.78, descentT) * activeDrape;
  const spineZ = mix(-0.85, 0.85, u) * activeDrape;

  const fabricWidth = 1.40;
  const widthOffsetY = (v - 0.5) * fabricWidth * 0.55;
  const widthOffsetZ = -(v - 0.5) * fabricWidth * 0.70;

  let pos = {
    x: spineX,
    y: spineY + widthOffsetY,
    z: spineZ + widthOffsetZ
  };

  const massA_Env = smoothstep(0.06, 0.16, u) * (1.0 - smoothstep(0.28, 0.38, u));
  const massA_Phase = (u - 0.08) / 0.28;
  const safePhaseA = Math.max(0, Math.min(1, massA_Phase));
  const safeSinA = Math.sin(safePhaseA * Math.PI);
  pos.x += -safeSinA * 0.14 * massA_Env * activeDrape;
  pos.y += -Math.pow(safeSinA, 1.6) * 0.18 * massA_Env * activeDrape;
  pos.z += safeSinA * 0.48 * (1.0 + (1.0 - v) * 0.30) * massA_Env * activeDrape;

  const massB_Env = smoothstep(0.32, 0.44, u) * (1.0 - smoothstep(0.66, 0.76, u));
  const diagB = (u - 0.36) / 0.36 * Math.PI * 2.0 + (v - 0.5) * 1.35;
  const foldB_Raw = Math.sin(diagB) * 0.65 + Math.sin(diagB * 0.5 - 0.25) * 0.40;
  const foldB_Profile = Math.sign(foldB_Raw) * Math.pow(Math.abs(foldB_Raw), 0.78);
  const ampB = 0.58 * mix(1.22, 0.82, v);

  pos.x += -Math.cos(diagB) * 0.15 * ampB * massB_Env * activeDrape;
  pos.y += -Math.abs(foldB_Profile) * 0.20 * ampB * massB_Env * activeDrape;
  pos.z += foldB_Profile * ampB * massB_Env * activeDrape;

  const massC_Env = smoothstep(0.66, 0.82, u);
  const palluProgress = smoothstep(0.60, 0.88, p);
  const palluLocalU = (u - 0.68) / 0.32;
  const safePalluU = Math.max(0, Math.min(1, palluLocalU));

  const palluRollPhase = safePalluU * Math.PI * 1.35 + (v - 0.5) * 0.75;
  const palluRollZ = (Math.sin(palluRollPhase) * 0.50 + Math.pow(safePalluU, 1.6) * 0.42) * palluProgress;
  const palluRollY = (-Math.cos(palluRollPhase) * 0.22 - palluProgress * 0.25) * palluProgress;
  const palluRollX = Math.sin(safePalluU * Math.PI) * 0.22 * palluProgress;

  pos.x += palluRollX * massC_Env * activeDrape;
  pos.y += palluRollY * massC_Env * activeDrape;
  pos.z += palluRollZ * massC_Env * activeDrape;

  const floorRestY = -1.12;
  if (pos.y < floorRestY) {
    const pen = floorRestY - pos.y;
    pos.y = floorRestY + Math.sin(pen * 8.0) * 0.015;
    pos.z += pen * 0.35;
    pos.x += Math.sign(pos.x + 0.1) * pen * 0.15;
  }

  return pos;
}

const eps = 0.005;
const p = 0.75;
const camPos = { x: 0.35, y: 1.05, z: 4.60 };

console.log("=== CHECKING NORMALS AND LIGHTING AT p = 0.75 ===");
for (let u = 0.0; u <= 1.0; u += 0.1) {
  const uv = { x: u, y: 0.5 };
  const currentPos = evaluateClothPosition(uv, p);
  const posDx = evaluateClothPosition({ x: uv.x + eps, y: uv.y }, p);
  const posDy = evaluateClothPosition({ x: uv.x, y: uv.y + eps }, p);

  const tU = { x: posDx.x - currentPos.x, y: posDx.y - currentPos.y, z: posDx.z - currentPos.z };
  const tV = { x: posDy.x - currentPos.x, y: posDy.y - currentPos.y, z: posDy.z - currentPos.z };

  const norm = {
    x: tU.y * tV.z - tU.z * tV.y,
    y: tU.z * tV.x - tU.x * tV.z,
    z: tU.x * tV.y - tU.y * tV.x
  };
  const len = Math.hypot(norm.x, norm.y, norm.z);
  norm.x /= len; norm.y /= len; norm.z /= len;

  const viewDir = {
    x: camPos.x - currentPos.x,
    y: camPos.y - currentPos.y,
    z: camPos.z - currentPos.z
  };
  const vLen = Math.hypot(viewDir.x, viewDir.y, viewDir.z);
  viewDir.x /= vLen; viewDir.y /= vLen; viewDir.z /= vLen;

  const dotNV = norm.x * viewDir.x + norm.y * viewDir.y + norm.z * viewDir.z;
  console.log(`u=${u.toFixed(2)} pos=(${currentPos.x.toFixed(2)}, ${currentPos.y.toFixed(2)}, ${currentPos.z.toFixed(2)}) norm=(${norm.x.toFixed(2)}, ${norm.y.toFixed(2)}, ${norm.z.toFixed(2)}) dotNV=${dotNV.toFixed(3)}`);
}
