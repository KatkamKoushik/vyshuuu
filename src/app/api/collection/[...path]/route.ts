import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const COLLECTION_VAULT_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/07_COLLECTION');

// Canonical mapping for all 10 approved sarees (81 production assets)
const ASSET_MAP: Record<string, Record<string, string>> = {
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path: pathSegments } = await context.params;

  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse('Collection asset path required', { status: 400 });
  }

  let relativeFilePath: string | undefined;

  // Pattern 1: /api/collection/[saree-id]/[asset-type]
  if (pathSegments.length === 2) {
    const sareeKey = pathSegments[0].toLowerCase();
    const assetType = pathSegments[1].toLowerCase();
    if (ASSET_MAP[sareeKey] && ASSET_MAP[sareeKey][assetType]) {
      relativeFilePath = ASSET_MAP[sareeKey][assetType];
    }
  }

  // Fallback to direct path segments
  if (!relativeFilePath) {
    relativeFilePath = pathSegments.join('/');
  }

  // Guard against directory traversal
  const absolutePath = path.resolve(COLLECTION_VAULT_ROOT, relativeFilePath);
  if (!absolutePath.startsWith(COLLECTION_VAULT_ROOT)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  if (!fs.existsSync(absolutePath)) {
    return new NextResponse(`Collection asset not found: ${pathSegments.join('/')}`, {
      status: 404,
    });
  }

  const stat = fs.statSync(absolutePath);
  const fileBuffer = fs.readFileSync(absolutePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': stat.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Collection-Vault': 'APPROVED_COLLECTION_ASSETS',
    },
  });
}
