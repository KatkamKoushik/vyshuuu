import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load trusted manifest
const manifestPath = path.join(rootDir, 'src/lib/security/trusted-manifest-data.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

const vaultDir = path.join(rootDir, 'VYSHUUU-SOURCE-VAULT');
const texturesPublicDir = path.join(rootDir, 'public/textures/unfurling');

let totalChecked = 0;
let totalPassed = 0;
let totalFailed = 0;
const results = {
  textures: [],
  atelier: [],
  collection: [],
};

console.log('================================================================');
console.log('VYSHUUU AUTOMATED ASSET MANIFEST & SECURITY VERIFICATION');
console.log('================================================================\n');

// 1. Textures (9 assets)
console.log('[SECTION 1] Verifying 9 Production Unfurling Textures...');
for (const [key, item] of Object.entries(manifest.textures)) {
  totalChecked++;
  const primaryVaultPath = path.join(vaultDir, item.vaultSubdir, item.fileInVault);
  const fallbackPublicPath = path.join(texturesPublicDir, path.basename(item.fileInVault));

  let resolvedPath = null;
  if (fs.existsSync(primaryVaultPath)) {
    resolvedPath = primaryVaultPath;
  } else if (fs.existsSync(fallbackPublicPath)) {
    resolvedPath = fallbackPublicPath;
  }

  if (!resolvedPath) {
    totalFailed++;
    results.textures.push({ key, status: 'MISSING', expectedSize: item.byteSize });
    console.error(`  FAIL: Texture ${key} missing at ${primaryVaultPath}`);
    continue;
  }

  const stat = fs.statSync(resolvedPath);
  const buffer = fs.readFileSync(resolvedPath);
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  const sizeMatches = stat.size === item.byteSize;
  const hashMatches = sha256 === item.sha256;

  if (sizeMatches && hashMatches) {
    totalPassed++;
    results.textures.push({
      key,
      status: 'VERIFIED',
      path: resolvedPath,
      size: stat.size,
      sha256: sha256.slice(0, 16) + '...',
      dimensions: `${item.width}x${item.height}`,
    });
    console.log(`  PASS: [${key}] (${stat.size} bytes, sha256: ${sha256.slice(0, 8)}...)`);
  } else {
    totalFailed++;
    results.textures.push({
      key,
      status: 'MISMATCH',
      expectedSize: item.byteSize,
      actualSize: stat.size,
      hashMatches,
    });
    console.error(`  FAIL: [${key}] Size or hash mismatch! Expected: ${item.byteSize}, Actual: ${stat.size}`);
  }
}

// 2. Atelier Plates (5 assets)
console.log('\n[SECTION 2] Verifying 5 Cinematic Atelier Plates...');
for (const [key, item] of Object.entries(manifest.atelier)) {
  totalChecked++;
  const filePath = path.join(vaultDir, item.vaultSubdir, item.fileInVault);

  if (!fs.existsSync(filePath)) {
    totalFailed++;
    results.atelier.push({ key, status: 'MISSING' });
    console.error(`  FAIL: Atelier plate ${key} missing at ${filePath}`);
    continue;
  }

  const stat = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  const sizeMatches = stat.size === item.byteSize;
  const hashMatches = sha256 === item.sha256;

  if (sizeMatches && hashMatches) {
    totalPassed++;
    results.atelier.push({
      key,
      status: 'VERIFIED',
      size: stat.size,
      sha256: sha256.slice(0, 16) + '...',
      title: item.title,
    });
    console.log(`  PASS: [${key}] "${item.title}" (${stat.size} bytes)`);
  } else {
    totalFailed++;
    results.atelier.push({ key, status: 'MISMATCH' });
    console.error(`  FAIL: [${key}] Size or hash mismatch!`);
  }
}

// 3. Collection Assets (81 assets across 10 sarees)
console.log('\n[SECTION 3] Verifying 81 Curated Saree Collection Assets...');
let collectionPassed = 0;
for (const [sareeId, sareeAssets] of Object.entries(manifest.collection)) {
  for (const [assetKey, item] of Object.entries(sareeAssets)) {
    totalChecked++;
    const filePath = path.join(vaultDir, item.vaultSubdir, item.fileInVault);

    if (!fs.existsSync(filePath)) {
      totalFailed++;
      results.collection.push({ sareeId, assetKey, status: 'MISSING' });
      console.error(`  FAIL: Collection asset ${sareeId}/${assetKey} missing at ${filePath}`);
      continue;
    }

    const stat = fs.statSync(filePath);
    const buffer = fs.readFileSync(filePath);
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

    const sizeMatches = stat.size === item.byteSize;
    const hashMatches = sha256 === item.sha256;

    if (sizeMatches && hashMatches) {
      totalPassed++;
      collectionPassed++;
      results.collection.push({
        sareeId,
        assetKey,
        status: 'VERIFIED',
        size: stat.size,
        mime: item.mimeType,
      });
    } else {
      totalFailed++;
      results.collection.push({ sareeId, assetKey, status: 'MISMATCH' });
      console.error(`  FAIL: [${sareeId}/${assetKey}] Size or hash mismatch!`);
    }
  }
}
console.log(`  Verified ${collectionPassed}/81 collection assets with cryptographic integrity.`);

console.log('\n================================================================');
console.log(`SUMMARY: ${totalPassed} / ${totalChecked} assets strictly verified.`);
console.log(`Failed: ${totalFailed}`);
console.log('================================================================');

if (totalFailed > 0 || totalChecked !== 95) {
  process.exit(1);
} else {
  console.log('\nALL 95 PRODUCTION ASSETS MATCH TRUSTED MANIFEST 100%.');
}
