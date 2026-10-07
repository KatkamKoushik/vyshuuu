/**
 * VYSHUUU — The Unstitched Continuum
 * Source-of-Truth Asset Manifest
 * 
 * Classifies every visual, structural, and brand element into:
 * REAL | GENERATED | PROCEDURAL | DERIVED | PLACEHOLDER | LEGACY | MISSING
 */

export type AssetStatus =
  | 'REAL'
  | 'GENERATED'
  | 'PROCEDURAL'
  | 'DERIVED'
  | 'PLACEHOLDER'
  | 'LEGACY'
  | 'MISSING';

export type AssetCategory =
  | 'brand'
  | 'saree'
  | 'textile'
  | 'atelier'
  | 'editorial'
  | 'archive'
  | 'generated'
  | 'derived';

export interface AssetRecord {
  id: string;
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  canonical: boolean;
  source: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  aspectRatio: string | null;
  description: string;
  usedIn: string[];
  mobileVariant: string | null;
  reducedMotionVariant: string | null;
  provenanceVerified: boolean;
}

export const ASSET_MANIFEST: AssetRecord[] = [
  // ==========================================================================
  // 1. PROCEDURAL MATERIAL & BRAND ASSETS (Currently Active in Engine)
  // ==========================================================================
  {
    id: 'procedural-brand-wordmark',
    name: 'VYSHUUU Editorial Wordmark',
    category: 'brand',
    status: 'PROCEDURAL',
    canonical: true,
    source: 'src/components/brand/Wordmark.tsx',
    mimeType: 'text/html',
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Dynamic CSS-driven serif typographic wordmark set in Canela Grand with tracked letterspacing.',
    usedIn: ['ThresholdScene', 'page.tsx (Section 01)', 'Masthead.tsx', 'Footer'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: true,
  },
  {
    id: 'procedural-brand-monogram',
    name: 'VYSHUUU Crosshair Monogram',
    category: 'brand',
    status: 'PROCEDURAL',
    canonical: true,
    source: 'src/components/brand/Monogram.tsx',
    mimeType: 'image/svg+xml',
    width: 32,
    height: 32,
    aspectRatio: '1:1',
    description: 'Inline SVG architectural crosshair hairline with asymmetric V and Y glyphs.',
    usedIn: ['Masthead.tsx (Atelier Anchor)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: true,
  },
  {
    id: 'procedural-threshold-filament',
    name: 'Golden Filament Curve',
    category: 'generated',
    status: 'PROCEDURAL',
    canonical: true,
    source: 'src/experience/scenes/ThresholdScene.tsx',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Procedural 3D Catmull-Rom spline curve rendered with antique gold tube geometry, representing the unstitched silk filament.',
    usedIn: ['ThresholdScene.tsx'],
    mobileVariant: null,
    reducedMotionVariant: 'Static resting filament curve',
    provenanceVerified: true,
  },
  {
    id: 'procedural-loom-plain-weave',
    name: 'Digital Loom Plain Weave Surface',
    category: 'textile',
    status: 'PROCEDURAL',
    canonical: true,
    source: 'src/experience/shaders/loom/loomFragment.ts',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Procedural warp/weft interlacing shader with micro-normal perturbation quieted for facing-angle silk suppression.',
    usedIn: ['LoomScene.tsx', 'MaterialSpecimenScene.tsx'],
    mobileVariant: 'Low-tier density uniform reduction (65x50)',
    reducedMotionVariant: 'Static resolved interlacing',
    provenanceVerified: true,
  },
  {
    id: 'procedural-silk-anisotropic-sheen',
    name: 'Directional Silk Anisotropic Sheen',
    category: 'textile',
    status: 'PROCEDURAL',
    canonical: true,
    source: 'src/experience/shaders/loom/loomFragment.ts',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Procedural mathematical model of triangular silk fiber reflection producing continuous broad sheen along fold crests.',
    usedIn: ['LoomScene.tsx', 'MaterialSpecimenScene.tsx'],
    mobileVariant: null,
    reducedMotionVariant: 'Static directional lighting',
    provenanceVerified: true,
  },
  {
    id: 'procedural-specimen-fold-geometry',
    name: 'Asymmetric Viscous Fold & Continuum',
    category: 'textile',
    status: 'PROCEDURAL',
    canonical: true,
    source: 'src/experience/shaders/loom/loomVertex.ts',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Vertex shader analytical displacement producing heavy silk drape memory and diagonal ribbon continuum extending into darkness.',
    usedIn: ['MaterialSpecimenScene.tsx'],
    mobileVariant: 'Subdivided plane (40x32 segments)',
    reducedMotionVariant: 'Composed static resting fold perspective',
    provenanceVerified: true,
  },
  {
    id: 'procedural-raking-inspection-beam',
    name: 'Directional Raking Inspection Beam',
    category: 'atelier',
    status: 'PROCEDURAL',
    canonical: true,
    source: 'src/experience/shaders/loom/loomFragment.ts',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Analytical elongated diagonal beam profile (3:1 aspect ratio) sliding across the textile plane like an editor inspection lamp.',
    usedIn: ['LoomScene.tsx', 'MaterialSpecimenScene.tsx'],
    mobileVariant: null,
    reducedMotionVariant: 'Fixed resting raking angle (-0.35, 1.35, 2.45)',
    provenanceVerified: true,
  },
  {
    id: 'procedural-zari-accent-threads',
    name: 'Selective Antique Zari Accents',
    category: 'textile',
    status: 'PROCEDURAL',
    canonical: true,
    source: 'src/experience/shaders/loom/loomFragment.ts',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Discrete periodic accent threads catching sharp golden specular luster exclusively under grazing raking light.',
    usedIn: ['LoomScene.tsx', 'MaterialSpecimenScene.tsx'],
    mobileVariant: null,
    reducedMotionVariant: 'Static zari specular response',
    provenanceVerified: true,
  },

  // ==========================================================================
  // 2. REQUIRED CANONICAL SAREE ASSETS (MISSING — Required for SHOT 13)
  // ==========================================================================
  {
    id: 'saree-canonical-hero-reference',
    name: 'Canonical Saree Hero Full-Length Photograph',
    category: 'saree',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'High-resolution authentic photograph of the real subject saree in full unstitched form or authentic drape.',
    usedIn: ['SHOT 13 (The Six-Yard Unfurling)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'saree-canonical-pallu-detail',
    name: 'Canonical Pallu (End-Piece) Detail Photograph',
    category: 'saree',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Authentic macro/high-res photograph of the saree pallu detailing zari density, motif geometry, and fringe.',
    usedIn: ['SHOT 13 (The Six-Yard Unfurling)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'saree-canonical-border-detail',
    name: 'Canonical Selvedge Border Detail',
    category: 'saree',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Authentic photograph of the woven selvedge edge, structural contrast, and interlock technique.',
    usedIn: ['SHOT 13 (The Six-Yard Unfurling)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'saree-canonical-pleats-drape',
    name: 'Canonical Pleats Drape Geometry Reference',
    category: 'saree',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Photographic reference of natural folding behavior, gravity response, and drape memory of the actual silk weave.',
    usedIn: ['SHOT 13 (The Six-Yard Unfurling)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'textile-canonical-macro-silk',
    name: 'Canonical Silk Surface Macro Photograph',
    category: 'textile',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Direct optical macro capture of the authentic silk thread twist, yarn crowns, and natural handloom variance.',
    usedIn: ['SHOT 13 Texture Calibration', 'Anthology Specimen Card'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'textile-canonical-zari-macro',
    name: 'Canonical Zari Metal Thread Macro Photograph',
    category: 'textile',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Direct optical macro capture of authentic metallic zari thread wrapping, warm antique patina, and luster.',
    usedIn: ['SHOT 13 Material Calibration'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'brand-canonical-vector-wordmark',
    name: 'VYSHUUU Official Vector Wordmark Asset',
    category: 'brand',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Canonical master SVG asset for the VYSHUUU logotype to replace or formalize the procedural CSS wordmark.',
    usedIn: ['Brand Vault', 'Masthead', 'Threshold'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'brand-canonical-vector-monogram',
    name: 'VYSHUUU Official Vector Monogram Asset',
    category: 'brand',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Canonical master SVG monogram asset to formalize the inline SVG component.',
    usedIn: ['Brand Vault', 'Favicon / App Icon'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'archive-canonical-provenance',
    name: 'Saree Provenance & Attribution Documentation',
    category: 'archive',
    status: 'MISSING',
    canonical: true,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Verified real-world provenance documentation (weaver cluster, loom type, yardage dimensions, silk grade, acquisition date).',
    usedIn: ['Archive / Provenance Card'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },

  // ==========================================================================
  // 3. OPTIONAL EDITORIAL & ATELIER ASSETS (MISSING)
  // ==========================================================================
  {
    id: 'atelier-loom-photograph',
    name: 'Authentic Handloom Workshop Photography',
    category: 'atelier',
    status: 'MISSING',
    canonical: false,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Documentary photography of the actual handloom mechanism and warp tension frame.',
    usedIn: ['Act I Background / Editorial Overlay (Optional)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'atelier-artisan-hands',
    name: 'Artisan Shuttle & Weaving Action Photography',
    category: 'atelier',
    status: 'MISSING',
    canonical: false,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'Documentary capture of authentic weaver hand movements operating shuttle and reed.',
    usedIn: ['Act I / Anthology (Optional)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'editorial-campaign-hero',
    name: 'Editorial Campaign Portrait / Silhouette',
    category: 'editorial',
    status: 'MISSING',
    canonical: false,
    source: 'unknown',
    mimeType: null,
    width: null,
    height: null,
    aspectRatio: null,
    description: 'High-fashion editorial campaign photography featuring the subject and saree in architectural space.',
    usedIn: ['Curated Works / Private Salon (Optional)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },

  // ==========================================================================
  // 4. TEMPLATE PLACEHOLDERS (Non-Canonical — To Be Replaced)
  // ==========================================================================
  {
    id: 'placeholder-next-svg',
    name: 'Next.js Starter Icon',
    category: 'brand',
    status: 'PLACEHOLDER',
    canonical: false,
    source: 'public/next.svg',
    mimeType: 'image/svg+xml',
    width: 394,
    height: 80,
    aspectRatio: '394:80',
    description: 'Default Next.js framework template icon. Not part of the VYSHUUU design system.',
    usedIn: [],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'placeholder-vercel-svg',
    name: 'Vercel Starter Icon',
    category: 'brand',
    status: 'PLACEHOLDER',
    canonical: false,
    source: 'public/vercel.svg',
    mimeType: 'image/svg+xml',
    width: 24,
    height: 24,
    aspectRatio: '1:1',
    description: 'Default Vercel template icon. Not part of the VYSHUUU design system.',
    usedIn: [],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'placeholder-file-svg',
    name: 'File Scaffold Icon',
    category: 'brand',
    status: 'PLACEHOLDER',
    canonical: false,
    source: 'public/file.svg',
    mimeType: 'image/svg+xml',
    width: 16,
    height: 16,
    aspectRatio: '1:1',
    description: 'Starter scaffold SVG. Not part of the VYSHUUU design system.',
    usedIn: [],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'placeholder-globe-svg',
    name: 'Globe Scaffold Icon',
    category: 'brand',
    status: 'PLACEHOLDER',
    canonical: false,
    source: 'public/globe.svg',
    mimeType: 'image/svg+xml',
    width: 16,
    height: 16,
    aspectRatio: '1:1',
    description: 'Starter scaffold SVG. Not part of the VYSHUUU design system.',
    usedIn: [],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'placeholder-window-svg',
    name: 'Window Scaffold Icon',
    category: 'brand',
    status: 'PLACEHOLDER',
    canonical: false,
    source: 'public/window.svg',
    mimeType: 'image/svg+xml',
    width: 16,
    height: 16,
    aspectRatio: '1:1',
    description: 'Starter scaffold SVG. Not part of the VYSHUUU design system.',
    usedIn: [],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
  {
    id: 'placeholder-favicon-ico',
    name: 'Default Starter Favicon',
    category: 'brand',
    status: 'PLACEHOLDER',
    canonical: false,
    source: 'src/app/favicon.ico',
    mimeType: 'image/x-icon',
    width: 32,
    height: 32,
    aspectRatio: '1:1',
    description: 'Starter scaffold favicon. To be replaced with canonical VYSHUUU monogram favicon upon asset intake.',
    usedIn: ['RootLayout (browser tab)'],
    mobileVariant: null,
    reducedMotionVariant: null,
    provenanceVerified: false,
  },
];

// ============================================================================
// HELPER QUERY FUNCTIONS
// ============================================================================

export function getAssetById(id: string): AssetRecord | undefined {
  return ASSET_MANIFEST.find((a) => a.id === id);
}

export function getAssetsByCategory(category: AssetCategory): AssetRecord[] {
  return ASSET_MANIFEST.filter((a) => a.category === category);
}

export function getAssetsByStatus(status: AssetStatus): AssetRecord[] {
  return ASSET_MANIFEST.filter((a) => a.status === status);
}

export function getMissingCriticalAssets(): AssetRecord[] {
  return ASSET_MANIFEST.filter((a) => a.canonical && a.status === 'MISSING');
}

export function isShot13Ready(): { ready: boolean; blockers: string[] } {
  const missing = getMissingCriticalAssets();
  return {
    ready: missing.length === 0,
    blockers: missing.map((a) => `[${a.id}] ${a.name} is MISSING`),
  };
}
