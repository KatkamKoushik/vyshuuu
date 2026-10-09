/**
 * VYSHUUU Production Asset Uploader for Cloudinary
 * 
 * Safely uploads all 95 canonical production assets:
 * - 9 Canonical WebGL Textures (5.10 MB)
 * - 5 Atelier Photographic Plates (3.40 MB)
 * - 81 Saree Collection Plates (235.10 MB)
 * 
 * Generates src/lib/assets/cloudinary-manifest.json with verified secure_urls.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'xjdxk6mg';

if (!API_KEY || !API_SECRET) {
  console.error('Error: CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables are required.');
  console.error('Please configure them in your environment or CI/CD secrets before running this script.');
  process.exit(1);
}

const ROOT = process.cwd();
const VAULT = path.resolve(ROOT, 'VYSHUUU-SOURCE-VAULT');
const MANIFEST_PATH = path.resolve(ROOT, 'src/lib/assets/cloudinary-manifest.json');

function generateSignature(params, secret) {
  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + secret;
  return crypto.createHash('sha1').update(stringToSign).digest('hex');
}

// 1. Define the 9 Textures
const TEXTURE_ITEMS = [
  { id: 'base-color', publicId: 'vyshuuu/textures/base-color', relPath: '04_TEXTURES/01_BASE_COLOR/VYSHUUU-TEX-01-base-color.png' },
  { id: 'zari-mask', publicId: 'vyshuuu/textures/zari-mask', relPath: '04_TEXTURES/02_ZARI_MASK/VYSHUUU-TEX-02-zari-mask.png' },
  { id: 'border-mask', publicId: 'vyshuuu/textures/border-mask', relPath: '04_TEXTURES/03_BORDER_MASK/VYSHUUU-TEX-03-border-mask.png' },
  { id: 'pallu-mask', publicId: 'vyshuuu/textures/pallu-mask', relPath: '04_TEXTURES/04_PALLU_MASK/VYSHUUU-TEX-04-pallu-mask.png' },
  { id: 'red-accent', publicId: 'vyshuuu/textures/red-accent', relPath: '04_TEXTURES/05_RED_ACCENT/VYSHUUU-TEX-05-red-accent.png' },
  { id: 'weave-direction', publicId: 'vyshuuu/textures/weave-direction', relPath: '04_TEXTURES/06_WEAVE_DIRECTION/VYSHUUU-TEX-06-weave-direction.png' },
  { id: 'roughness', publicId: 'vyshuuu/textures/roughness', relPath: '04_TEXTURES/07_ROUGHNESS/VYSHUUU-TEX-07-roughness.png' },
  { id: 'micro-normal', publicId: 'vyshuuu/textures/micro-normal', relPath: '04_TEXTURES/08_MICRO_NORMAL/VYSHUUU-TEX-08-micro-normal.png' },
  { id: 'edge-fringe', publicId: 'vyshuuu/textures/edge-fringe', relPath: '04_TEXTURES/09_EDGE_FRINGE/VYSHUUU-TEX-09-edge-fringe.png' },
];

// 2. Define the 5 Atelier Plates
const ATELIER_ITEMS = [
  { id: 'vysh-atl-01', publicId: 'vyshuuu/atelier/vysh-atl-01', relPath: '08_ATELIER/VYSH-ATL-01-warp-tension.jpg' },
  { id: 'vysh-atl-02', publicId: 'vyshuuu/atelier/vysh-atl-02', relPath: '08_ATELIER/VYSH-ATL-02-weft-cadence.jpg' },
  { id: 'vysh-atl-03', publicId: 'vyshuuu/atelier/vysh-atl-03', relPath: '08_ATELIER/VYSH-ATL-03-structural-interlock.jpg' },
  { id: 'vysh-atl-04', publicId: 'vyshuuu/atelier/vysh-atl-04', relPath: '08_ATELIER/VYSH-ATL-04-tactile-weight.jpg' },
  { id: 'vysh-atl-05', publicId: 'vyshuuu/atelier/vysh-atl-05', relPath: '08_ATELIER/VYSH-ATL-05-living-heirloom.jpg' },
];

// 3. Define the 81 Collection Plates from route.ts
const COLLECTION_MAP = {
  'vysh-arc-01': {
    hero: 'VYSH-ARC-01-CONTINUUM-ARCHETYPE/hero/Dramatic Black and Gold Silk Drapery.png',
    flat: 'VYSH-ARC-01-CONTINUUM-ARCHETYPE/flat/Luxurious Black and Gold Geometric Saree.png',
    fold: 'VYSH-ARC-01-CONTINUUM-ARCHETYPE/fold/Luxurious Black and Gold Brocade Folds.png',
    pleat: 'VYSH-ARC-01-CONTINUUM-ARCHETYPE/pleat/Antique Gold Silk Pleats.png',
    border: 'VYSH-ARC-01-CONTINUUM-ARCHETYPE/border/Antique Gold Brocade Sari Border.png',
    pallu: 'VYSH-ARC-01-CONTINUUM-ARCHETYPE/pallu/Black Silk and Gold Geometric Brocade.png',
    macro: 'VYSH-ARC-01-CONTINUUM-ARCHETYPE/WEAVE MACRO/Luxurious Black and Gold Woven Textile.png',
    editorial: 'VYSH-ARC-01-CONTINUUM-ARCHETYPE/EDITORIAL CAMPAIGN/Black and Gold Silk in Shadow.png',
  },
  'vysh-chd-01': {
    hero: 'YSH-CHD-01 — GOSSAMER KORA/hero/Golden Sari Draped in Shadows.png',
    flat: 'YSH-CHD-01 — GOSSAMER KORA/flat/Sheer Ivory Saree with Golden Weave.png',
    fold: 'YSH-CHD-01 — GOSSAMER KORA/fold/Golden Grid on Sheer Ivory Fabric.png',
    pleat: 'YSH-CHD-01 — GOSSAMER KORA/pleat/Sunlit Champagne Sheer Textile Drapery.png',
    border: 'YSH-CHD-01 — GOSSAMER KORA/BORDER/Golden Woven Fabric in Soft Folds.png',
    pallu: 'YSH-CHD-01 — GOSSAMER KORA/pallu/Golden Light on Flowing Ivory Fabric.png',
    macro: 'YSH-CHD-01 — GOSSAMER KORA/MATERIAL MACRO/Golden Woven Sheer Fabric Waves.png',
    editorial: 'YSH-CHD-01 — GOSSAMER KORA/EDITORIAL CAMPAIGN/Ethereal Linen in Sunlit Stone.png',
  },
  'vysh-kjv-01': {
    hero: 'VYSH-KJV-01 Obsidian Korvai/hero/Black and Bronze Saree Cascade.png',
    flat: 'VYSH-KJV-01 Obsidian Korvai/flat/Ornate Black and Gold Woven Saree.png',
    fold: 'VYSH-KJV-01 Obsidian Korvai/fold/Antique Gold Brocade on Black.png',
    pleat: 'VYSH-KJV-01 Obsidian Korvai/pleat/Antique Gold Saree on Stone Steps.png',
    border: 'VYSH-KJV-01 Obsidian Korvai/BORDER/Lustrous Goldwork on Dark Brocade.png',
    pallu: 'VYSH-KJV-01 Obsidian Korvai/pallu/Bronze Geometric Brocade on Black.png',
    macro: 'VYSH-KJV-01 Obsidian Korvai/MATERIAL MACRO/Antique Gold Brocade Texture.png',
    editorial: 'VYSH-KJV-01 Obsidian Korvai/EDITORIAL CAMPAIGN/Bronze-Woven Saree in Shadowed Stone.png',
  },
  'vysh-bnr-01': {
    hero: 'VYSH-BNR-01 Shikar Gah/hero/Midnight Brocade on Stone Steps.png',
    flat: 'VYSH-BNR-01 Shikar Gah/flat/Antique Charcoal Brocade Saree with Floral Pallu.png',
    fold: 'VYSH-BNR-01 Shikar Gah/fold/Luxurious Black Brocade Textile in Dramatic Light.png',
    pleat: 'VYSH-BNR-01 Shikar Gah/pleat/Charcoal Brocade Draped in Chiaroscuro.png',
    border: 'VYSH-BNR-01 Shikar Gah/BORDER/Luxurious Silver Floral Brocade Close-Up.png',
    pallu: 'VYSH-BNR-01 Shikar Gah/pallu/Luxurious Dark Brocade with Metallic Florals.png',
    macro: 'VYSH-BNR-01 Shikar Gah/MATERIAL MACRO/Metallic Brocade Flower Close-Up.png',
    editorial: 'VYSH-BNR-01 Shikar Gah/EDITORIAL CAMPAIGN/Draped Brocade in a Shadowed Gallery.png',
  },
  'vysh-pth-01': {
    hero: 'VYSH-PTH-01 — Tapestry Dusk/hero/Luxurious Bronze Woven Saree Draped in Shadows.png',
    flat: 'VYSH-PTH-01 — Tapestry Dusk/flat/Antique Gold Brocade Textile.png',
    fold: 'VYSH-PTH-01 — Tapestry Dusk/fold/Luxurious Gold-Brocaded Silk Saree.png',
    pleat: 'VYSH-PTH-01 — Tapestry Dusk/pleat/Luxurious Brown and Gold Woven Sari.png',
    border: 'VYSH-PTH-01 — Tapestry Dusk/border/Luxurious Gold-Brocade Textile Folds.png',
    pallu: 'VYSH-PTH-01 — Tapestry Dusk/pallu/Luxurious Bronze Brocade Textile.png',
    macro: 'VYSH-PTH-01 — Tapestry Dusk/WEAVE MACRO/Lustrous Bronze Brocade in Soft Folds.png',
    editorial: 'VYSH-PTH-01 — Tapestry Dusk/EDITORIAL CAMPAIGN/Golden-Brocade Draped in Shadow.png',
  },
  'vysh-jmd-01': {
    hero: 'VYSH-JMD-01 Vapor Inlay/hero/Graphite Sari Cascading Through Light.png',
    flat: 'VYSH-JMD-01 Vapor Inlay/flat/Charcoal Handwoven Saree with Ivory Motifs.png',
    fold: 'VYSH-JMD-01 Vapor Inlay/fold/Cinematic Folded Botanical Textile.png',
    pleat: 'VYSH-JMD-01 Vapor Inlay/pleat/Charcoal Handloom Textile in Warm Light.png',
    border: 'VYSH-JMD-01 Vapor Inlay/BORDER/Charcoal Cloth with Ivory Woven Embroidery.png',
    pallu: 'VYSH-JMD-01 Vapor Inlay/pallu/Draped Midnight Botanical Textile.png',
    macro: 'VYSH-JMD-01 Vapor Inlay/MATERIAL MACRO/Charcoal Sheer Fabric with Woven Botanical Motifs.png',
    editorial: 'VYSH-JMD-01 Vapor Inlay/EDITORIAL CAMPAIGN/Charcoal Textile in Stone and Light.png',
  },
  'vysh-kta-01': {
    hero: 'VYSH-KTA-01 — Obsidian Khat Grid/hero/Sheer Black and Gold Textile on Marble Steps.png',
    flat: 'VYSH-KTA-01 — Obsidian Khat Grid/flat/Golden-Thread Charcoal Woven Textile.png',
    fold: 'VYSH-KTA-01 — Obsidian Khat Grid/fold/Antique Gold Woven Textile on Marble.png',
    pleat: 'VYSH-KTA-01 — Obsidian Khat Grid/pleat/Black and Gold Pleated Textile.png',
    border: 'VYSH-KTA-01 — Obsidian Khat Grid/BORDER/Gilded Geometry on Black Sheer Fabric.png',
    pallu: 'VYSH-KTA-01 — Obsidian Khat Grid/pallu/Black and Gold Woven Drapery.png',
    macro: 'VYSH-KTA-01 — Obsidian Khat Grid/MATERIAL MACRO/Golden Threads in Charcoal Weave.png',
    editorial: 'VYSH-KTA-01 — Obsidian Khat Grid/EDITORIAL CAMPAIGN/Sheer Gold-Grid Textile on Dark Stone.png',
  },
  'vysh-tsr-01': {
    hero: 'VYSH-TSR-01 Raw Honeycomb Slub/hero/Copper-Threaded Woven Textile in Moody Light.png',
    flat: 'VYSH-TSR-01 Raw Honeycomb Slub/flat/Charcoal Handwoven Textile with Fringe.png',
    fold: 'VYSH-TSR-01 Raw Honeycomb Slub/fold/Moody Copper-Woven Textile Folds.png',
    pleat: 'VYSH-TSR-01 Raw Honeycomb Slub/pleat/Moody Copper-Woven Textile Draped Over Stone.png',
    border: 'VYSH-TSR-01 Raw Honeycomb Slub/BORDER/Luxurious Bronze Woven Textile Fringe.png',
    pallu: 'VYSH-TSR-01 Raw Honeycomb Slub/pallu/Copper-Thread Textile in Shadow.png',
    macro: 'VYSH-TSR-01 Raw Honeycomb Slub/MATERIAL MACRO/Rustic Copper-Thread Woven Texture.png',
    editorial: 'VYSH-TSR-01 Raw Honeycomb Slub/EDITORIAL CAMPAIGN/Bronze-Woven Shawl on Stone Steps.png',
  },
  'vysh-ctr-01': {
    hero: 'VYSH-CTR-01 — Liquid Metal Continuum/hero/Silver-Threaded Textile on Marble Steps.png',
    flat: 'VYSH-CTR-01 — Liquid Metal Continuum/flat/Black and Silver Geometric Woven Textile.png',
    fold: 'VYSH-CTR-01 — Liquid Metal Continuum/fold/Dramatic Black and Silver Woven Drapes.png',
    pleat: 'VYSH-CTR-01 — Liquid Metal Continuum/pleat/Luxurious Black and Silver Brocade Folds.png',
    border: 'VYSH-CTR-01 — Liquid Metal Continuum/BORDER/Metallic Jacquard Fabric in Dramatic Light.png',
    pallu: 'VYSH-CTR-01 — Liquid Metal Continuum/pallu/Metallic Black Textile on Marble Steps.png',
    macro: 'VYSH-CTR-01 — Liquid Metal Continuum/MATERIAL MACRO/Black and Silver Woven Textile Macro.png',
    editorial: 'VYSH-CTR-01 — Liquid Metal Continuum/EDITORIAL CAMPAIGN/Metallic Drape in a Shadowed Gallery.png',
  },
  'vysh-kjv-02': {
    hero: 'VYSH-KJV-02 — Madder Petni/hero/Burgundy Silk Draped Over Marble.png',
    flat: 'VYSH-KJV-02 — Madder Petni/flat/Ornate Burgundy and Gold Silk Saree.png',
    fold: 'VYSH-KJV-02 — Madder Petni/fold/Luxurious Crimson and Gold Brocade Drapery.png',
    pleat: 'VYSH-KJV-02 — Madder Petni/pleat/Burgundy Silk and Gold Brocade Folds.png',
    border: 'VYSH-KJV-02 — Madder Petni/BORDER/Luxurious Maroon and Gold Brocade Textile.png',
    pallu: 'VYSH-KJV-02 — Madder Petni/pallu/Burgundy and Gold Woven Saree on Marble.png',
    macro: 'VYSH-KJV-02 — Madder Petni/MATERIAL MACRO/Luxury Maroon and Gold Brocade Weave.png',
    editorial: 'VYSH-KJV-02 — Madder Petni/EDITORIAL CAMPAIGN/Luxurious Burgundy and Gold Sari Draped in Shadow.png',
    edge: 'VYSH-KJV-02 — Madder Petni/edge/Luxurious Maroon and Gold Brocade Draped on Slate.png',
  },
};

const COLLECTION_ITEMS = [];
for (const [sareeId, assets] of Object.entries(COLLECTION_MAP)) {
  for (const [assetType, rel] of Object.entries(assets)) {
    COLLECTION_ITEMS.push({
      sareeId,
      assetType,
      publicId: `vyshuuu/collection/${sareeId}/${assetType}`,
      relPath: `07_COLLECTION/${rel}`,
    });
  }
}

const ALL_ITEMS = [
  ...TEXTURE_ITEMS.map(item => ({ ...item, category: 'texture' })),
  ...ATELIER_ITEMS.map(item => ({ ...item, category: 'atelier' })),
  ...COLLECTION_ITEMS.map(item => ({ ...item, category: 'collection' })),
];

console.log(`\n======================================================`);
console.log(`  VYSHUUU PRODUCTION CLOUDINARY UPLOADER`);
console.log(`  Cloud Name: ${CLOUD_NAME} | Total Assets: ${ALL_ITEMS.length}`);
console.log(`======================================================\n`);

// Load existing manifest to enable fast resume/idempotency
let manifest = { textures: {}, atelier: {}, collection: {} };
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    console.log(`Loaded existing manifest with ${Object.keys(manifest.textures || {}).length + Object.keys(manifest.atelier || {}).length + Object.keys(manifest.collection || {}).length} recorded items.`);
  } catch {
    console.warn('Could not parse existing manifest, creating new.');
  }
}

async function uploadFile(item, retries = 3) {
  const absolutePath = path.resolve(VAULT, item.relPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Local file missing: ${absolutePath}`);
  }

  // Check if already in manifest
  let alreadyUploaded = false;
  if (item.category === 'texture' && manifest.textures?.[item.id]?.secure_url) alreadyUploaded = true;
  if (item.category === 'atelier' && manifest.atelier?.[item.id]?.secure_url) alreadyUploaded = true;
  if (item.category === 'collection' && manifest.collection?.[item.sareeId]?.[item.assetType]?.secure_url) alreadyUploaded = true;

  if (alreadyUploaded) {
    return { status: 'SKIPPED', publicId: item.publicId };
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const mimeType = item.relPath.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
  const fileBlob = new Blob([fileBuffer], { type: mimeType });

  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    overwrite: 'true',
    public_id: item.publicId,
    timestamp: timestamp.toString()
  };
  const signature = generateSignature(params, API_SECRET);

  const formData = new FormData();
  formData.append('file', fileBlob, path.basename(absolutePath));
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('public_id', item.publicId);
  formData.append('overwrite', 'true');
  formData.append('signature', signature);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      return {
        status: 'UPLOADED',
        publicId: data.public_id,
        secure_url: data.secure_url,
        bytes: data.bytes,
        format: data.format,
        width: data.width,
        height: data.height,
      };
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  Attempt ${attempt} failed for ${item.publicId}, retrying in 2s... (${err.message})`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

// Upload in batches of 4 concurrency
async function main() {
  const CONCURRENCY = 4;
  let completed = 0;
  let uploadedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < ALL_ITEMS.length; i += CONCURRENCY) {
    const chunk = ALL_ITEMS.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (item) => {
      try {
        const result = await uploadFile(item);
        completed++;
        if (result.status === 'UPLOADED') {
          uploadedCount++;
          console.log(`[${completed}/${ALL_ITEMS.length}] UPLOADED: ${item.publicId} (${(result.bytes / (1024*1024)).toFixed(2)} MB)`);

          // Update manifest
          if (item.category === 'texture') {
            manifest.textures = manifest.textures || {};
            manifest.textures[item.id] = {
              public_id: result.publicId,
              secure_url: result.secure_url,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
            };
          } else if (item.category === 'atelier') {
            manifest.atelier = manifest.atelier || {};
            manifest.atelier[item.id] = {
              public_id: result.publicId,
              secure_url: result.secure_url,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
            };
          } else if (item.category === 'collection') {
            manifest.collection = manifest.collection || {};
            manifest.collection[item.sareeId] = manifest.collection[item.sareeId] || {};
            manifest.collection[item.sareeId][item.assetType] = {
              public_id: result.publicId,
              secure_url: result.secure_url,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
            };
          }

          // Persist manifest every upload
          fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
        } else {
          skippedCount++;
          console.log(`[${completed}/${ALL_ITEMS.length}] SKIPPED (Already in manifest): ${item.publicId}`);
        }
      } catch (err) {
        console.error(`[ERROR] Failed to upload ${item.publicId}:`, err);
      }
    }));
  }

  console.log(`\n======================================================`);
  console.log(`  UPLOAD COMPLETE!`);
  console.log(`  Total: ${completed} | Uploaded: ${uploadedCount} | Skipped: ${skippedCount}`);
  console.log(`  Manifest saved to: ${MANIFEST_PATH}`);
  console.log(`======================================================\n`);
}

main().catch(console.error);
