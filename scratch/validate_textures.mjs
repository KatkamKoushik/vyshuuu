import fs from 'node:fs';
import path from 'node:path';

const TEXTURES_VAULT_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/04_TEXTURES');

const SHORTCUT_MAP = {
  'base-color': '01_BASE_COLOR/VYSHUUU-TEX-01-base-color.png',
  'zari-mask': '02_ZARI_MASK/VYSHUUU-TEX-02-zari-mask.png',
  'border-mask': '03_BORDER_MASK/VYSHUUU-TEX-03-border-mask.png',
  'pallu-mask': '04_PALLU_MASK/VYSHUUU-TEX-04-pallu-mask.png',
  'red-accent': '05_RED_ACCENT/VYSHUUU-TEX-05-red-accent.png',
  'weave-direction': '06_WEAVE_DIRECTION/VYSHUUU-TEX-06-weave-direction.png',
  'roughness': '07_ROUGHNESS/VYSHUUU-TEX-07-roughness.png',
  'micro-normal': '08_MICRO_NORMAL/VYSHUUU-TEX-08-micro-normal.png',
  'edge-fringe': '09_EDGE_FRINGE/VYSHUUU-TEX-09-edge-fringe.png',
};

async function validate() {
  console.log('=== VALIDATING 9 LOCKED PRODUCTION MAPS ===');
  let allValid = true;

  for (const [key, relPath] of Object.entries(SHORTCUT_MAP)) {
    const fullPath = path.resolve(TEXTURES_VAULT_ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`[FAIL] File missing: ${fullPath}`);
      allValid = false;
      continue;
    }
    const stat = fs.statSync(fullPath);
    const apiRes = await fetch(`http://localhost:3000/api/textures/${key}`);
    const is200 = apiRes.status === 200;
    const header = apiRes.headers.get('x-texture-vault');

    if (is200 && header === 'LOCKED_PRODUCTION_MAPS' && stat.size > 0) {
      console.log(`[PASS] ${key.padEnd(16)} | File: ${stat.size.toString().padStart(8)} bytes | HTTP 200 OK`);
    } else {
      console.error(`[FAIL] ${key}: HTTP ${apiRes.status}, size ${stat.size}`);
      allValid = false;
    }
  }

  if (allValid) {
    console.log('ALL 9 LOCKED PRODUCTION TEXTURE MAPS VERIFIED INTACT & SERVING 200 OK.');
  } else {
    process.exit(1);
  }
}

validate().catch(err => {
  console.error(err);
  process.exit(1);
});
