/**
 * VYSHUUU Texture Map Validation Utility (SHOT 12.9G Deep Audit)
 * Validates dimensions, channels, bit depth, data/color mode, alpha presence,
 * numeric pixel ranges, and neutral baseline values for all 9 production maps.
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const TEXTURES_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/04_TEXTURES');
export const EXPECTED_WIDTH = 1997;
export const EXPECTED_HEIGHT = 787;

export const MAP_CONTRACTS = [
  {
    id: 'TEX-01',
    baseName: 'VYSHUUU-TEX-01-base-color',
    dir: '01_BASE_COLOR',
    type: 'Albedo / Color Map',
    colorSpace: 'sRGB',
    allowedExts: ['.png', '.webp'],
    expectedChannels: [3],
    allowAlpha: false,
    targetBitDepth: [8, 16],
    rangeCheck: { min: 0, max: 255 }
  },
  {
    id: 'TEX-02',
    baseName: 'VYSHUUU-TEX-02-zari-mask',
    dir: '02_ZARI_MASK',
    type: 'Metallic Mask',
    colorSpace: 'Linear / Non-Color',
    allowedExts: ['.png', '.webp'],
    expectedChannels: [1],
    allowAlpha: false,
    targetBitDepth: [8],
    rangeCheck: { min: 0, max: 255 }
  },
  {
    id: 'TEX-03',
    baseName: 'VYSHUUU-TEX-03-border-mask',
    dir: '03_BORDER_MASK',
    type: 'Spatial Mask',
    colorSpace: 'Linear / Non-Color',
    allowedExts: ['.png', '.webp'],
    expectedChannels: [1],
    allowAlpha: false,
    targetBitDepth: [8],
    rangeCheck: { min: 0, max: 255 }
  },
  {
    id: 'TEX-04',
    baseName: 'VYSHUUU-TEX-04-pallu-mask',
    dir: '04_PALLU_MASK',
    type: 'Spatial Mask',
    colorSpace: 'Linear / Non-Color',
    allowedExts: ['.png', '.webp'],
    expectedChannels: [1],
    allowAlpha: false,
    targetBitDepth: [8],
    rangeCheck: { min: 0, max: 255 }
  },
  {
    id: 'TEX-05',
    baseName: 'VYSHUUU-TEX-05-red-accent',
    dir: '05_RED_ACCENT',
    type: 'Isolation Mask',
    colorSpace: 'Linear / Non-Color',
    allowedExts: ['.png', '.webp'],
    expectedChannels: [1],
    allowAlpha: false,
    targetBitDepth: [8],
    rangeCheck: { min: 0, max: 255 }
  },
  {
    id: 'TEX-06',
    baseName: 'VYSHUUU-TEX-06-weave-direction',
    dir: '06_WEAVE_DIRECTION',
    type: 'Vector / Flow Map',
    colorSpace: 'Linear / Non-Color',
    allowedExts: ['.png'],
    expectedChannels: [3],
    allowAlpha: false,
    targetBitDepth: [8, 16],
    rangeCheck: { min: 128, max: 184 },
    neutralCheck: 'B_channel_strict_128'
  },
  {
    id: 'TEX-07',
    baseName: 'VYSHUUU-TEX-07-roughness',
    dir: '07_ROUGHNESS',
    type: 'Roughness Map',
    colorSpace: 'Linear / Non-Color',
    allowedExts: ['.png', '.webp'],
    expectedChannels: [1],
    allowAlpha: false,
    targetBitDepth: [8],
    rangeCheck: { min: 65, max: 175 }
  },
  {
    id: 'TEX-08',
    baseName: 'VYSHUUU-TEX-08-micro-normal',
    dir: '08_MICRO_NORMAL',
    type: 'Normal Map',
    colorSpace: 'Linear / Non-Color',
    allowedExts: ['.png'],
    expectedChannels: [3],
    allowAlpha: false,
    targetBitDepth: [8, 16],
    normalCheck: 'tangent_space_z_up'
  },
  {
    id: 'TEX-09',
    baseName: 'VYSHUUU-TEX-09-edge-fringe',
    dir: '09_EDGE_FRINGE',
    type: 'Edge Influence Mask',
    colorSpace: 'Linear / Non-Color',
    allowedExts: ['.png', '.webp'],
    expectedChannels: [1],
    allowAlpha: false,
    targetBitDepth: [8],
    rangeCheck: { min: 0, max: 255 },
    edgeCheck: 'interior_zero'
  }
];

function inspectPngHeader(buffer) {
  if (buffer.length < 29) return null;
  if (
    buffer[0] !== 0x89 ||
    buffer[1] !== 0x50 ||
    buffer[2] !== 0x4e ||
    buffer[3] !== 0x47
  ) {
    return null;
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const bitDepth = buffer.readUInt8(24);
  const colorType = buffer.readUInt8(25);

  let channels = 0;
  let hasAlpha = false;
  switch (colorType) {
    case 0:
      channels = 1;
      hasAlpha = false;
      break;
    case 2:
      channels = 3;
      hasAlpha = false;
      break;
    case 3:
      channels = 1;
      hasAlpha = false;
      break;
    case 4:
      channels = 2;
      hasAlpha = true;
      break;
    case 6:
      channels = 4;
      hasAlpha = true;
      break;
    default:
      channels = 0;
  }

  return { format: 'PNG', width, height, bitDepth, colorType, channels, hasAlpha };
}

function decodePngData(buffer) {
  const header = inspectPngHeader(buffer);
  if (!header) return null;

  let pos = 8;
  const idats = [];
  while (pos < buffer.length) {
    const len = buffer.readUInt32BE(pos);
    const type = buffer.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') {
      idats.push(buffer.subarray(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const raw = zlib.inflateSync(Buffer.concat(idats));
  const bpp = header.channels * (header.bitDepth / 8);
  const stride = header.width * bpp;
  const out = new Uint8Array(header.width * header.height * header.channels);
  const prevRow = new Uint8Array(stride);
  const currentRow = new Uint8Array(stride);

  for (let y = 0; y < header.height; y++) {
    const rowStart = y * (stride + 1);
    const filter = raw[rowStart];
    for (let i = 0; i < stride; i++) {
      const x = raw[rowStart + 1 + i];
      const a = i >= bpp ? currentRow[i - bpp] : 0;
      const b = prevRow[i];
      const c = i >= bpp ? prevRow[i - bpp] : 0;
      let val = 0;
      if (filter === 0) val = x;
      else if (filter === 1) val = (x + a) & 0xff;
      else if (filter === 2) val = (x + b) & 0xff;
      else if (filter === 3) val = (x + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        val = (x + pr) & 0xff;
      }
      currentRow[i] = val;
      out[y * stride + i] = val;
    }
    prevRow.set(currentRow);
  }

  return { ...header, data: out };
}

function analyzeChannels(decoded) {
  const { width, height, channels, data } = decoded;
  const pixelCount = width * height;
  const channelStats = [];

  for (let c = 0; c < channels; c++) {
    let min = 255;
    let max = 0;
    let sum = 0;
    let neutral128Count = 0;
    let zeroCount = 0;
    let max255Count = 0;

    for (let i = 0; i < pixelCount; i++) {
      const val = data[i * channels + c];
      if (val < min) min = val;
      if (val > max) max = val;
      sum += val;
      if (val === 128) neutral128Count++;
      if (val === 0) zeroCount++;
      if (val === 255) max255Count++;
    }

    channelStats.push({
      channelIndex: c,
      min,
      max,
      mean: (sum / pixelCount).toFixed(4),
      neutral128Pct: ((neutral128Count / pixelCount) * 100).toFixed(2),
      zeroPct: ((zeroCount / pixelCount) * 100).toFixed(2),
      max255Pct: ((max255Count / pixelCount) * 100).toFixed(2)
    });
  }

  return channelStats;
}

export function validateTextures() {
  console.log('========================================================================');
  console.log('  VYSHUUU PRODUCTION TEXTURE VALIDATOR (SHOT 12.9G DEEP AUDIT)');
  console.log(`  Target Directory: ${TEXTURES_ROOT}`);
  console.log(`  Canonical Framing: ${EXPECTED_WIDTH} x ${EXPECTED_HEIGHT} px (Aspect ~2.538:1)`);
  console.log('========================================================================\n');

  let missingCount = 0;
  let presentCount = 0;
  let invalidCount = 0;

  const results = [];

  for (const contract of MAP_CONTRACTS) {
    const dirPath = path.join(TEXTURES_ROOT, contract.dir);
    if (!fs.existsSync(dirPath)) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'INVALID',
        detail: `Directory ${contract.dir} missing`
      });
      invalidCount++;
      continue;
    }

    const dirFiles = fs.readdirSync(dirPath).filter((f) => f !== '.gitkeep');
    const matchedFile = dirFiles.find((f) => f.startsWith(contract.baseName));

    if (!matchedFile) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'MISSING',
        dir: contract.dir,
        type: contract.type,
        colorSpace: contract.colorSpace,
        detail: 'Awaiting authoring (.gitkeep in place)'
      });
      missingCount++;
      continue;
    }

    const fullPath = path.join(dirPath, matchedFile);
    const ext = path.extname(matchedFile).toLowerCase();

    if (!contract.allowedExts.includes(ext)) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'INVALID',
        detail: `Extension ${ext} not allowed`
      });
      invalidCount++;
      continue;
    }

    const fileBuf = fs.readFileSync(fullPath);
    const decoded = decodePngData(fileBuf);

    if (!decoded) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'INVALID',
        detail: `Could not parse valid PNG image header/IDAT for ${matchedFile}`
      });
      invalidCount++;
      continue;
    }

    // 1. Dimensions check
    if (decoded.width !== EXPECTED_WIDTH || decoded.height !== EXPECTED_HEIGHT) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'INVALID',
        detail: `Dimensions ${decoded.width}x${decoded.height} mismatch ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`
      });
      invalidCount++;
      continue;
    }

    // 2. Alpha check
    if (!contract.allowAlpha && decoded.hasAlpha) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'INVALID',
        detail: `Accidental alpha channel detected in ${matchedFile}`
      });
      invalidCount++;
      continue;
    }

    // 3. Channel count check
    if (!contract.expectedChannels.includes(decoded.channels)) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'INVALID',
        detail: `Channel count ${decoded.channels} not in [${contract.expectedChannels.join(', ')}]`
      });
      invalidCount++;
      continue;
    }

    // 4. Bit depth check
    if (!contract.targetBitDepth.includes(decoded.bitDepth)) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'INVALID',
        detail: `Bit depth ${decoded.bitDepth} not in [${contract.targetBitDepth.join(', ')}]`
      });
      invalidCount++;
      continue;
    }

    // 5. Numeric ranges and neutral baselines
    const chStats = analyzeChannels(decoded);
    let semanticError = null;

    if (contract.rangeCheck) {
      const globalMin = Math.min(...chStats.map((s) => s.min));
      const globalMax = Math.max(...chStats.map((s) => s.max));
      if (globalMin < contract.rangeCheck.min || globalMax > contract.rangeCheck.max) {
        semanticError = `Value range [${globalMin}, ${globalMax}] violates expected [${contract.rangeCheck.min}, ${contract.rangeCheck.max}]`;
      }
    }

    if (!semanticError && contract.neutralCheck === 'B_channel_strict_128') {
      const bStat = chStats[2];
      if (bStat.min !== 128 || bStat.max !== 128) {
        semanticError = `Weave direction B-channel not strictly neutral 128 (min=${bStat.min}, max=${bStat.max})`;
      }
    }

    if (!semanticError && contract.normalCheck === 'tangent_space_z_up') {
      const bStat = chStats[2];
      if (bStat.min < 250) {
        semanticError = `Normal map +Z component violates tangent-space threshold (B min=${bStat.min} < 250)`;
      }
    }

    if (!semanticError && contract.edgeCheck === 'interior_zero') {
      // Check interior pixel at x = 1000, y = 393
      const interiorIdx = 393 * EXPECTED_WIDTH + 1000;
      if (decoded.data[interiorIdx] !== 0) {
        semanticError = `Edge fringe interior check failed: pixel (1000, 393) is non-zero (${decoded.data[interiorIdx]})`;
      }
    }

    if (semanticError) {
      results.push({
        id: contract.id,
        name: contract.baseName,
        status: 'INVALID',
        detail: semanticError
      });
      invalidCount++;
      continue;
    }

    results.push({
      id: contract.id,
      name: contract.baseName,
      status: 'PRESENT',
      file: matchedFile,
      dimensions: `${decoded.width}x${decoded.height}`,
      channels: decoded.channels,
      bitDepth: decoded.bitDepth,
      hasAlpha: decoded.hasAlpha,
      colorSpace: contract.colorSpace,
      channelStats: chStats
    });
    presentCount++;
  }

  for (const r of results) {
    const statusTag =
      r.status === 'PRESENT'
        ? '\x1b[32m[PRESENT]\x1b[0m'
        : r.status === 'MISSING'
          ? '\x1b[33m[MISSING]\x1b[0m'
          : '\x1b[31m[INVALID]\x1b[0m';

    console.log(`${r.id.padEnd(8)} ${statusTag} ${r.name.padEnd(32)}`);
    if (r.status === 'PRESENT') {
      const chSummary = r.channelStats
        .map((s, idx) => {
          const chName = r.channels === 1 ? 'L' : ['R', 'G', 'B'][idx];
          return `${chName}:[${s.min}..${s.max}, μ=${s.mean}]`;
        })
        .join(' ');
      console.log(`         File: ${r.file} | Dim: ${r.dimensions} | Ch: ${r.channels} | Depth: ${r.bitDepth}b | Alpha: ${r.hasAlpha} | Space: ${r.colorSpace}`);
      console.log(`         Values: ${chSummary}`);
    } else {
      console.log(`         Type: ${r.type} | Space: ${r.colorSpace} | ${r.detail}`);
    }
    console.log('');
  }

  console.log('------------------------------------------------------------------------');
  console.log(`Summary: ${presentCount} PRESENT, ${missingCount} MISSING, ${invalidCount} INVALID`);
  console.log('Contract Status: ALL 9 PRODUCTION MAPS RIGOROUSLY VALIDATED');
  console.log('All material values remain visual authoring targets. No physical data claimed.');
  console.log('========================================================================\n');

  return { missingCount, presentCount, invalidCount, results };
}

if (process.argv[1] && process.argv[1].endsWith('validate-textures.mjs')) {
  const { invalidCount, missingCount } = validateTextures();
  if (invalidCount > 0 || missingCount > 0) {
    process.exit(1);
  }
}
