/**
 * VYSHUUU Saree Collection Registry & Data Model
 * 
 * Authoritative registry of all 10 curated saree concepts in the digital atelier.
 * Adheres strictly to docs/SHOT-14A-SAREE-COLLECTION-BIBLE.md.
 * 
 * Governance Notice:
 * All specifications describe art-directed digital textile interpretations.
 * Zero unverified physical, laboratory, or provenance claims are asserted.
 */

export type CollectionChapterId =
  | 'all'
  | 'obsidian-foundation'
  | 'shadows-varanasi-paithan'
  | 'diaphanous-weaves'
  | 'earth-temple-sanctum';

export interface CollectionChapter {
  id: CollectionChapterId;
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface SareeAssetMeta {
  src: string;
  label: string;
  movementTag: string;
  aspectRatio: '4/5' | '16/9' | '3/4' | '1/1';
  caption: string;
  metadata: string;
  notes: string;
}

export interface SareeConcept {
  id: string; // e.g. 'vysh-arc-01'
  code: string; // e.g. 'VYSH-ARC-01'
  number: number; // 1 to 10
  name: string;
  tagline: string;
  lineage: string;
  textileFamily: string;
  chapterId: 'obsidian-foundation' | 'shadows-varanasi-paithan' | 'diaphanous-weaves' | 'earth-temple-sanctum';
  weightHand: string;
  opacity: string;
  primaryZari: string;
  accentHue: string;
  keyFeature: string;
  curatorialStatement: string;
  themeVariant: 'dark' | 'light';
  palette: {
    background: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
  };
  assets: {
    hero: SareeAssetMeta;
    flat: SareeAssetMeta;
    fold: SareeAssetMeta;
    pleat: SareeAssetMeta;
    border: SareeAssetMeta;
    pallu: SareeAssetMeta;
    macro: SareeAssetMeta;
    editorial: SareeAssetMeta;
    edge?: SareeAssetMeta;
  };
}

export const COLLECTION_CHAPTERS: CollectionChapter[] = [
  {
    id: 'all',
    number: '00',
    title: 'THE COMPLETE CONTINUUM',
    subtitle: 'Ten Studies in Unbroken Tension',
    description: 'The complete archival spectrum of the unstitched six yards, from monumental architectural silks to weightless open grids.',
  },
  {
    id: 'obsidian-foundation',
    number: '01',
    title: 'THE OBSIDIAN FOUNDATION',
    subtitle: 'Monumental Mass & Architectural Tension',
    description: 'Heavy 3-ply mulberry grounds, stepped interlocking korvai joints, and flexible micro-wire origami folds.',
  },
  {
    id: 'shadows-varanasi-paithan',
    number: '02',
    title: 'SHADOWS OF VARANASI & PAITHAN',
    subtitle: 'Dense Brocade & Interlocked Tapestry',
    description: 'Blackened silver kadwa hunting scrolls and oblique-weft dhoop-chhaon shot silk grounds.',
  },
  {
    id: 'diaphanous-weaves',
    number: '03',
    title: 'THE DIAPHANOUS WEAVES',
    subtitle: 'Translucency & Open Atmospheric Grids',
    description: 'Open khat grids, featherlight muslin with vapor inlays, and de-gummed airy silk-cotton sheers.',
  },
  {
    id: 'earth-temple-sanctum',
    number: '04',
    title: 'EARTH & TEMPLE SANCTUM',
    subtitle: 'Wild Forest Slub & Sacred Madder Petni',
    description: 'Tactile forest tussar honeycomb grain and sacred rubia madder temple borders steeped in architectural gravitas.',
  },
];

export const SAREE_COLLECTION: SareeConcept[] = [
  // --------------------------------------------------------------------------
  // CONCEPT 01 — THE CONTINUUM ARCHETYPE
  // --------------------------------------------------------------------------
  {
    id: 'vysh-arc-01',
    code: 'VYSH-ARC-01',
    number: 1,
    name: 'The Continuum Archetype',
    tagline: 'Signature Monumental Silk',
    lineage: 'Contemporary Architectural Handloom',
    textileFamily: 'Contemporary Architectural Silk',
    chapterId: 'obsidian-foundation',
    weightHand: 'Heavy / Liquid',
    opacity: '100% Opaque',
    primaryZari: 'Antique Handloom Gold',
    accentHue: '#C5A869',
    keyFeature: 'Flagship 9-map hero textile; architectural S-curve drape',
    curatorialStatement: 'The core design plate of VYSHUUU: dense obsidian charcoal ground framed by antique gold geometric brocade ribbons and auspicious madder isolation lines.',
    themeVariant: 'dark',
    palette: {
      background: '#0B0A09',
      surface: '#121110',
      border: 'rgba(197, 168, 105, 0.20)',
      text: '#F5F2EB',
      textMuted: '#9E9689',
      accent: '#C5A869',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-arc-01/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Dramatic Black and Gold Silk Drapery',
        metadata: 'VYSH-ARC-01 · Hero Specimen',
        notes: 'Monumental raking chiaroscuro grazing across heavy 3-ply twisted silk.',
      },
      flat: {
        src: '/api/collection/vysh-arc-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Flat Topological Plane',
        metadata: 'Planar Layout · 6-Yard Continuous Field',
        notes: 'Full unstitched planar layout showing longitudinal body and transverse brocade boundaries.',
      },
      fold: {
        src: '/api/collection/vysh-arc-01/fold',
        label: 'Viscous Fold Memory',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Viscous Drape & Brocade Folds',
        metadata: '3-Ply Twisted Mulberry Silk',
        notes: 'Compound asymmetrical S-fold dynamics reflecting self-weight and gravitational inertia.',
      },
      pleat: {
        src: '/api/collection/vysh-arc-01/pleat',
        label: 'Cascading Pleats',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Antique Gold Silk Pleats',
        metadata: 'Repetitive Wave Tension',
        notes: 'Rhythmic knife-pleats responding to grazing directional illumination.',
      },
      border: {
        src: '/api/collection/vysh-arc-01/border',
        label: 'Brocade Selvedge Ribbon',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Antique Gold Brocade Sari Border',
        metadata: 'Solid Brocade Ribbon · Madder Line',
        notes: 'Transverse gold brocade selvedge framed by fine madder red boundary picks.',
      },
      pallu: {
        src: '/api/collection/vysh-arc-01/pallu',
        label: 'Monumental Pallu Field',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Black Silk and Gold Geometric Brocade',
        metadata: 'Transverse Weft Dominance',
        notes: 'Architectural diamond-lattice gold insertion terminating in knotted fringe boundary.',
      },
      macro: {
        src: '/api/collection/vysh-arc-01/macro',
        label: 'Weave Microstructure',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Luxurious Black and Gold Woven Textile',
        metadata: 'Micro-Normal · Longitudinal Tangent',
        notes: 'Thread-level plain-weave warp and weft intersections with anisotropic highlight crown.',
      },
      editorial: {
        src: '/api/collection/vysh-arc-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Black and Gold Silk in Shadow',
        metadata: 'Grazing Lateral Key · Obsidian Floor',
        notes: 'Textile as architectural installation draped in deep chiaroscuro stone atmosphere.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 02 — OBSIDIAN KORVAI
  // --------------------------------------------------------------------------
  {
    id: 'vysh-kjv-01',
    code: 'VYSH-KJV-01',
    number: 2,
    name: 'Obsidian Korvai',
    tagline: 'Classical South Indian Weight',
    lineage: 'South Indian Heavy Silk (Kanchipuram Tradition)',
    textileFamily: 'South Indian Heavy Silk',
    chapterId: 'obsidian-foundation',
    weightHand: 'Rigid / Sculptural',
    opacity: '100% Opaque',
    primaryZari: 'Burnished Bronze Antique Zari',
    accentHue: '#9E824C',
    keyFeature: '9-inch stepped temple korvai interlocked border',
    curatorialStatement: 'Inspired by classical three-shuttle korvai interlocking where body and borders are woven separately and locked with zig-zag petni joins. Heavy murukku pattu silk with deep sculptural fold memory.',
    themeVariant: 'dark',
    palette: {
      background: '#0A0908',
      surface: '#141210',
      border: 'rgba(158, 130, 76, 0.22)',
      text: '#F4EFE6',
      textMuted: '#968E80',
      accent: '#9E824C',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-kjv-01/hero',
        label: 'Hero Cascade',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Black and Bronze Saree Cascade',
        metadata: 'VYSH-KJV-01 · Hero Specimen',
        notes: 'Monumental bronze-woven cascade draped over architectural steps under focused key light.',
      },
      flat: {
        src: '/api/collection/vysh-kjv-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Ornate Black and Gold Woven Saree',
        metadata: 'Planar Layout · Interlocking Fields',
        notes: 'Complete 6-yard layout demonstrating the stepped temple korvai boundary lines.',
      },
      fold: {
        src: '/api/collection/vysh-kjv-01/fold',
        label: 'Rigid Fold Memory',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Antique Gold Brocade on Black',
        metadata: 'Murukku Pattu · Sculptural Stiffness',
        notes: 'Deep, crisp fold creases characteristic of heavy high-twist South Indian silk yarn.',
      },
      pleat: {
        src: '/api/collection/vysh-kjv-01/pleat',
        label: 'Stepped Pleat Geometry',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Antique Gold Saree on Stone Steps',
        metadata: 'Temple Step Alignment',
        notes: 'Architectural pleating reflecting the stepped temple spire geometry of the korvai borders.',
      },
      border: {
        src: '/api/collection/vysh-kjv-01/border',
        label: 'Stepped Korvai Border',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Lustrous Goldwork on Dark Brocade',
        metadata: '9-Inch Korvai Interlock',
        notes: 'Dense supplementary bronze zari border with interlocked rudraksha and gopuram motifs.',
      },
      pallu: {
        src: '/api/collection/vysh-kjv-01/pallu',
        label: 'Seer Pallu Trellis',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Bronze Geometric Brocade on Black',
        metadata: 'Mayilkan Diamond Trellis',
        notes: 'Traditional dense seer pallu featuring horizontal diamond checks and hand-twisted silk knots.',
      },
      macro: {
        src: '/api/collection/vysh-kjv-01/macro',
        label: 'Material Interstices',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Antique Gold Brocade Texture',
        metadata: 'Murukku Ribbed Ground',
        notes: 'Tactile ribbed ground showing the dense intersection of twisted silk and bronze wire.',
      },
      editorial: {
        src: '/api/collection/vysh-kjv-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Bronze-Woven Saree in Shadowed Stone',
        metadata: '3200K Directional Rake · Basalt Plinth',
        notes: 'Dramatic architectural pedestal composition highlighting the heavy burnished bronze drape.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 03 — SHIKAR GAH IN SHADOW
  // --------------------------------------------------------------------------
  {
    id: 'vysh-bnr-01',
    code: 'VYSH-BNR-01',
    number: 3,
    name: 'Shikar Gah in Shadow',
    tagline: 'Varanasi Kinkhwab Brocade',
    lineage: 'Banarasi Dense Brocade (Varanasi Tradition)',
    textileFamily: 'Banarasi Brocade',
    chapterId: 'shadows-varanasi-paithan',
    weightHand: 'Heavy / Dense Satin',
    opacity: '100% Opaque',
    primaryZari: 'Blackened Antique Silver (Rupa-Kairi)',
    accentHue: '#8C867D',
    keyFeature: 'Continuous botanical hunting jaal; blackened silver sheen',
    curatorialStatement: 'A reimagining of the historical Kinkhwab brocade: midnight graphite ground woven with blackened antique silver thread and intricate botanical shadow motifs with zero reverse floats.',
    themeVariant: 'dark',
    palette: {
      background: '#0B0C0E',
      surface: '#131518',
      border: 'rgba(140, 134, 125, 0.20)',
      text: '#F2F2F0',
      textMuted: '#909194',
      accent: '#B59A57',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-bnr-01/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Midnight Brocade on Stone Steps',
        metadata: 'VYSH-BNR-01 · Hero Specimen',
        notes: 'Dense liquid drape cascading over architectural stone under cool raking gallery light.',
      },
      flat: {
        src: '/api/collection/vysh-bnr-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Antique Charcoal Brocade Saree with Floral Pallu',
        metadata: 'Planar Layout · Kadwa Jaal',
        notes: 'Continuous floral scroll field traversing from body to monumental botanical pallu.',
      },
      fold: {
        src: '/api/collection/vysh-bnr-01/fold',
        label: 'Dense Satin Drape',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Luxurious Black Brocade Textile in Dramatic Light',
        metadata: 'Pithambari Ground · Zero Float',
        notes: 'Substantial, viscous fold lines showing dense multi-layered supplementary weft weight.',
      },
      pleat: {
        src: '/api/collection/vysh-bnr-01/pleat',
        label: 'Chiaroscuro Pleats',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Charcoal Brocade Draped in Chiaroscuro',
        metadata: 'Shadowed Botanical Relief',
        notes: 'Deep shadow intervals revealing the blackened silver floral highlights on each fold crest.',
      },
      border: {
        src: '/api/collection/vysh-bnr-01/border',
        label: 'Winding Bel Selvedge',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Luxurious Silver Floral Brocade Close-Up',
        metadata: 'Continuous Floral Vine · Bel Ribbon',
        notes: 'Continuous winding floral vine with miniature kalka finials in oxidized silver zari.',
      },
      pallu: {
        src: '/api/collection/vysh-bnr-01/pallu',
        label: 'Kadwa Jaal Pallu',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Luxurious Dark Brocade with Metallic Florals',
        metadata: 'Hunting Reserve Tapestry Panel',
        notes: 'Architectural cusped arches framing micro-scaled botanical hunting reserves in silver and dull gold.',
      },
      macro: {
        src: '/api/collection/vysh-bnr-01/macro',
        label: 'Metallic Brocade Macro',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Metallic Brocade Flower Close-Up',
        metadata: 'Thread-Level Silver Curls',
        notes: 'High-magnification capture of silver thread curls woven into the matte satin ground.',
      },
      editorial: {
        src: '/api/collection/vysh-bnr-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Draped Brocade in a Shadowed Gallery',
        metadata: 'Lateral Gallery Light · Obsidian Floor',
        notes: 'Shadowy baroque elegance celebrating peak decorative density in quiet architectural space.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 04 — GOSSAMER KORA
  // --------------------------------------------------------------------------
  {
    id: 'vysh-chd-01',
    code: 'VYSH-CHD-01',
    number: 4,
    name: 'Gossamer Kora',
    tagline: 'Diaphanous Sheer Architectural Study',
    lineage: 'Chanderi Translucent Lightweight (Madhya Pradesh Tradition)',
    textileFamily: 'Chanderi Sheer',
    chapterId: 'diaphanous-weaves',
    weightHand: 'Weightless / Crisp',
    opacity: '65% Translucent',
    primaryZari: 'Pale Champagne Gold',
    accentHue: '#8C7443',
    keyFeature: 'Transparent silk-cotton ground with 5-bar gold ribbon pallu',
    curatorialStatement: 'Madhya Pradesh kora silk-cotton sheer weaving celebrating breathability and optical transparency: de-gummed raw silk warp with superfine cotton weft holding crisp, paper-like floating folds.',
    themeVariant: 'light',
    palette: {
      background: '#F5F1E8',
      surface: '#EAE4D7',
      border: 'rgba(140, 116, 67, 0.20)',
      text: '#1E1B18',
      textMuted: '#6D6457',
      accent: '#8C7443',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-chd-01/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Golden Sari Draped in Shadows',
        metadata: 'VYSH-CHD-01 · Hero Specimen',
        notes: 'Sheer translucent ecru drapery caught in sunlit stone gallery shadows.',
      },
      flat: {
        src: '/api/collection/vysh-chd-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Sheer Ivory Saree with Golden Weave',
        metadata: 'Planar Layout · Khat Transparency',
        notes: 'Sheer planar layout revealing open thread interstices and pale champagne bands.',
      },
      fold: {
        src: '/api/collection/vysh-chd-01/fold',
        label: 'Airy Grid Fold',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Golden Grid on Sheer Ivory Fabric',
        metadata: 'De-gummed Silk · Superfine Cotton',
        notes: 'Crisp, airy folds holding geometric tension without heavy gravitational pooling.',
      },
      pleat: {
        src: '/api/collection/vysh-chd-01/pleat',
        label: 'Sunlit Pleats',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Sunlit Champagne Sheer Textile Drapery',
        metadata: 'Fluid Light Interstices',
        notes: 'Sunlit sheer pleats passing ambient light directly through the woven interstices.',
      },
      border: {
        src: '/api/collection/vysh-chd-01/border',
        label: 'Tissue Gold Selvedge',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Golden Woven Fabric in Soft Folds',
        metadata: 'Narrow Tissue Ribbon · Micro-Picks',
        notes: 'Narrow 2-inch tissue gold selvedge ribbon delineating the transparent body plane.',
      },
      pallu: {
        src: '/api/collection/vysh-chd-01/pallu',
        label: 'Luminous Pallu Ribbons',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Golden Light on Flowing Ivory Fabric',
        metadata: 'Five-Bar Gold Ribbon Repeat',
        notes: 'Minimalist gold ribbon repeat spaced by wide sheer intervals with delicate eyelash fringe.',
      },
      macro: {
        src: '/api/collection/vysh-chd-01/macro',
        label: 'Material Macro Waves',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Golden Woven Sheer Fabric Waves',
        metadata: 'Optical Translucency · Champagne Filament',
        notes: 'Optical transparency showing the minute gap between de-gummed warp and fine weft yarns.',
      },
      editorial: {
        src: '/api/collection/vysh-chd-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Ethereal Linen in Sunlit Stone',
        metadata: 'Architectural Daylight · Honed Limestone',
        notes: 'Weightless floating study celebrating optical transparency and serene daylight.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 05 — TAPESTRY DUSK
  // --------------------------------------------------------------------------
  {
    id: 'vysh-pth-01',
    code: 'VYSH-PTH-01',
    number: 5,
    name: 'Tapestry Dusk',
    tagline: 'Yeola Interlocked Tapestry Weave',
    lineage: 'Paithani Interlocked Tapestry (Maharashtra Tradition)',
    textileFamily: 'Paithani Tapestry',
    chapterId: 'shadows-varanasi-paithan',
    weightHand: 'Medium / Shot Silk',
    opacity: '100% Opaque',
    primaryZari: 'Solid 24k Gold Luster',
    accentHue: '#CCA852',
    keyFeature: 'Dhoop-chhaon iridescent color shift & tapestry-woven pallu',
    curatorialStatement: 'Inspired by classical Paithan tapestry weaving where oblique interlocked wefts create kaleidoscopic geometric motifs on a dual-tone dhoop-chhaon shot silk ground shifting from anthracite to burnt ochre.',
    themeVariant: 'dark',
    palette: {
      background: '#100D0B',
      surface: '#181411',
      border: 'rgba(204, 168, 82, 0.22)',
      text: '#F5EFE6',
      textMuted: '#9E9080',
      accent: '#CCA852',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-pth-01/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Luxurious Bronze Woven Saree Draped in Shadows',
        metadata: 'VYSH-PTH-01 · Hero Specimen',
        notes: 'Oblique view demonstrating the chromatic shift of the shot-silk ground as the fold rolls over.',
      },
      flat: {
        src: '/api/collection/vysh-pth-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Antique Gold Brocade Textile',
        metadata: 'Planar Layout · Tapestry Reserves',
        notes: 'Complete planar view highlighting the solid gold tapestry border and intricate pallu field.',
      },
      fold: {
        src: '/api/collection/vysh-pth-01/fold',
        label: 'Shot-Silk Fold Dynamics',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Luxurious Gold-Brocaded Silk Saree',
        metadata: 'Pure Filature Warp · Heavy Weft',
        notes: 'Dual-tone Fresnel reflection shifting between anthracite and ochre along the fold crest.',
      },
      pleat: {
        src: '/api/collection/vysh-pth-01/pleat',
        label: 'Tapestry Pleat Wave',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Luxurious Brown and Gold Woven Sari',
        metadata: 'Oblique Interlock Weight',
        notes: 'Substantial rhythmic pleats holding physical weight from the dense tapestry-woven weft.',
      },
      border: {
        src: '/api/collection/vysh-pth-01/border',
        label: 'Narali Sawtooth Border',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Luxurious Gold-Brocade Textile Folds',
        metadata: 'Narali Sawtooth Tapestry Border',
        notes: 'Solid gold tapestry border featuring traditional coconut-flower sawtooth geometry.',
      },
      pallu: {
        src: '/api/collection/vysh-pth-01/pallu',
        label: 'Mor-Kamal Tapestry Pallu',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Luxurious Bronze Brocade Textile',
        metadata: 'Interlocked Weft Tapestry Panel',
        notes: 'Heavy tapestry-woven peacock and lotus panel created with interlocked wefts; thick sculptural hanging weight.',
      },
      macro: {
        src: '/api/collection/vysh-pth-01/macro',
        label: 'Tapestry Macro Interstices',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Lustrous Bronze Brocade in Soft Folds',
        metadata: 'Oblique Dhaap Interlock',
        notes: 'Micro-inspection of the hand-interlocked weft boundary where gold thread locks with dyed silk.',
      },
      editorial: {
        src: '/api/collection/vysh-pth-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Golden-Brocade Draped in Shadow',
        metadata: 'Candle-lit Tungsten Grazing · Basalt Ground',
        notes: 'Majestic cultural centerpiece celebrating rare interlocking tapestry craftsmanship.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 06 — VAPOR INLAY
  // --------------------------------------------------------------------------
  {
    id: 'vysh-jmd-01',
    code: 'VYSH-JMD-01',
    number: 6,
    name: 'Vapor Inlay',
    tagline: 'Discontinuous Supplementary Weft Muslin',
    lineage: 'Jamdani Discontinuous Weave (Bengal Tradition)',
    textileFamily: 'Jamdani Muslin',
    chapterId: 'diaphanous-weaves',
    weightHand: 'Featherlight / Soft',
    opacity: '75% Semi-Sheer',
    primaryZari: 'Dull Silver Zari & Raw Ecru Silk',
    accentHue: '#E5DEC9',
    keyFeature: 'Discontinuous supplementary weft inlay floating in misty dark ground',
    curatorialStatement: 'Ancient Bengal muslin Jamdani logic where ornamental botanical motifs are inlaid by hand with non-continuous shuttles like embroidery on the loom, suspended inside the sheer mist-black ground.',
    themeVariant: 'dark',
    palette: {
      background: '#0D0E10',
      surface: '#15171A',
      border: 'rgba(229, 222, 201, 0.18)',
      text: '#F2F0EB',
      textMuted: '#929496',
      accent: '#E5DEC9',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-jmd-01/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Graphite Sari Cascading Through Light',
        metadata: 'VYSH-JMD-01 · Hero Specimen',
        notes: 'Misty graphite muslin cascading softly, caught in diffuse architectural light.',
      },
      flat: {
        src: '/api/collection/vysh-jmd-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Charcoal Handwoven Saree with Ivory Motifs',
        metadata: 'Planar Layout · Floating Motifs',
        notes: 'Planar view demonstrating isolated botanical inlays floating on the dark sheer ground.',
      },
      fold: {
        src: '/api/collection/vysh-jmd-01/fold',
        label: 'Soft Botanical Folds',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Cinematic Botanical Textile',
        metadata: 'Ultra-Fine Muslin Hand',
        notes: 'Featherlight drape gathering into soft, weightless cloud-like folds.',
      },
      pleat: {
        src: '/api/collection/vysh-jmd-01/pleat',
        label: 'Handloom Warm Pleats',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Charcoal Handloom Textile in Warm Light',
        metadata: 'Discontinuous Motif Alignment',
        notes: 'Subtle pleating where floating ivory botanical motifs emerge and vanish as light shifts.',
      },
      border: {
        src: '/api/collection/vysh-jmd-01/border',
        label: 'Panna Hazar Border',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Charcoal Cloth with Ivory Woven Embroidery',
        metadata: 'Broken Panna Hazar Repeat',
        notes: 'Scattered micro-floral repeat fading softly toward the untreated cotton selvedge hem.',
      },
      pallu: {
        src: '/api/collection/vysh-jmd-01/pallu',
        label: 'Jhalar Weeping Fringe',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Draped Midnight Botanical Textile',
        metadata: 'Asymmetric Floral Inlay Field',
        notes: 'Diagonal weeping willow arrangement of descending floral sprigs with asymmetric spacing.',
      },
      macro: {
        src: '/api/collection/vysh-jmd-01/macro',
        label: 'Inlay Microstructure',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Charcoal Sheer Fabric with Woven Botanical Motifs',
        metadata: 'Non-Continuous Inlay Pickup',
        notes: 'Micro-inspection showing the individual picks where supplementary threads start and stop.',
      },
      editorial: {
        src: '/api/collection/vysh-jmd-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Charcoal Textile in Stone and Light',
        metadata: 'Soft Lateral Key · Monolithic Stone',
        notes: 'Poetic, quiet study embodying the peak of artisanal manual thread insertion.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 07 — OBSIDIAN KHAT GRID
  // --------------------------------------------------------------------------
  {
    id: 'vysh-kta-01',
    code: 'VYSH-KTA-01',
    number: 7,
    name: 'Obsidian Khat Grid',
    tagline: 'Architectural Geometric Transparency',
    lineage: 'Kota Doria Geometric Transparency (Rajasthan Tradition)',
    textileFamily: 'Kota Doria',
    chapterId: 'diaphanous-weaves',
    weightHand: 'Crisp / Structural',
    opacity: '80% Grid-Open',
    primaryZari: 'Pale Antique Gold Cord',
    accentHue: '#BFAB75',
    keyFeature: 'Geometric 14x8 square khat grid transparency',
    curatorialStatement: 'Traditional Rajasthani khat weaving with alternating counts of silk and cotton yarns forming a square checkered grid, giving crisp structural resilience to a transparent dark textile.',
    themeVariant: 'dark',
    palette: {
      background: '#0E0D0C',
      surface: '#161513',
      border: 'rgba(191, 171, 117, 0.20)',
      text: '#F4EFE6',
      textMuted: '#948D80',
      accent: '#BFAB75',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-kta-01/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Sheer Black and Gold Textile on Marble Steps',
        metadata: 'VYSH-KTA-01 · Hero Specimen',
        notes: 'Architectural square khat grid rendered in crisp black and gold over stone steps.',
      },
      flat: {
        src: '/api/collection/vysh-kta-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Golden-Thread Charcoal Woven Textile',
        metadata: 'Planar Layout · Modular Khat Grid',
        notes: 'Planar view demonstrating the mathematical precision of the repeating square checkered grid.',
      },
      fold: {
        src: '/api/collection/vysh-kta-01/fold',
        label: 'Geometric Grid Folds',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Antique Gold Woven Textile on Marble',
        metadata: 'Crisp Structured Resilience',
        notes: 'Crisp geometric folds that maintain architectural angles rather than fluid sagging.',
      },
      pleat: {
        src: '/api/collection/vysh-kta-01/pleat',
        label: 'Structured Pleat Grid',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Black and Gold Pleated Textile',
        metadata: 'Tailored Pleat Memory',
        notes: 'Tailored geometric pleats held cleanly in place by the structural khat cotton yarn cords.',
      },
      border: {
        src: '/api/collection/vysh-kta-01/border',
        label: 'Gilded Geometry Border',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Gilded Geometry on Black Sheer Fabric',
        metadata: 'Compressed Grid Border Ribbon',
        notes: 'Strict grid compression border with solid gold thread cord reinforcement along the selvedge.',
      },
      pallu: {
        src: '/api/collection/vysh-kta-01/pallu',
        label: 'Modular Grid Pallu',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Black and Gold Woven Drapery',
        metadata: 'Open Squares to Solid Gold Checks',
        notes: 'Modular grid progression transitioning from open squares into solid gold checks with cord fringe.',
      },
      macro: {
        src: '/api/collection/vysh-kta-01/macro',
        label: 'Khat Square Microstructure',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Golden Threads in Charcoal Weave',
        metadata: '14 Cotton × 8 Silk Filaments',
        notes: 'High-magnification view showing the crisp bundle of yarns that delineate each square khat opening.',
      },
      editorial: {
        src: '/api/collection/vysh-kta-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Sheer Gold-Grid Textile on Dark Stone',
        metadata: 'Overhead 45° Raking Key · Basalt Pedestal',
        notes: 'Modern minimalist study appealing to collectors seeking rigorous geometric discipline.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 08 — RAW HONEYCOMB SLUB
  // --------------------------------------------------------------------------
  {
    id: 'vysh-tsr-01',
    code: 'VYSH-TSR-01',
    number: 8,
    name: 'Raw Honeycomb Slub',
    tagline: 'Wild Forest Tussar & Muga Slub',
    lineage: 'Wild Silk / Tussar Slub (Central Indian Tradition)',
    textileFamily: 'Wild Tussar / Muga',
    chapterId: 'earth-temple-sanctum',
    weightHand: 'Coarse / Substantial',
    opacity: '100% Opaque',
    primaryZari: 'Deep Copper-Bronze Zari',
    accentHue: '#A6874E',
    keyFeature: 'Natural forest silk slubs, knots, and organic golden flecks',
    curatorialStatement: 'Wild forest silks celebrating non-uniform hand-reeled wild yarns, natural golden-amber slub fibers, tactile knots, and organic honeycomb texture with copper-bronze zari.',
    themeVariant: 'dark',
    palette: {
      background: '#120F0C',
      surface: '#1A1612',
      border: 'rgba(166, 135, 78, 0.22)',
      text: '#F5EFE6',
      textMuted: '#998D7E',
      accent: '#A6874E',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-tsr-01/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Copper-Threaded Woven Textile in Moody Light',
        metadata: 'VYSH-TSR-01 · Hero Specimen',
        notes: 'Substantial, raw forest silk cascade draped heavily under moody chiaroscuro tungsten light.',
      },
      flat: {
        src: '/api/collection/vysh-tsr-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Charcoal Handwoven Textile with Fringe',
        metadata: 'Planar Layout · Wild Fiber Slub',
        notes: 'Complete planar view revealing the non-uniform organic grain and raw unspun tussar fringe.',
      },
      fold: {
        src: '/api/collection/vysh-tsr-01/fold',
        label: 'Moody Copper Folds',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Moody Copper-Woven Textile Folds',
        metadata: 'Irregular Wild Weft Grain',
        notes: 'Dry, substantial, rustic-luxe hand creating heavy, grounded architectural folds.',
      },
      pleat: {
        src: '/api/collection/vysh-tsr-01/pleat',
        label: 'Grounded Stone Pleats',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Moody Copper-Woven Textile Draped Over Stone',
        metadata: 'Substantial Earth Gravity',
        notes: 'Heavy pleats settling naturally on stone without synthetic springback or ribbon float.',
      },
      border: {
        src: '/api/collection/vysh-tsr-01/border',
        label: 'Gicha Fringe Border',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Luxurious Bronze Woven Textile Fringe',
        metadata: 'Ribbed Gicha Border · Copper Wire',
        notes: 'Heavy ribbed gicha border woven with untwisted wild silk and narrow copper-gold selvedge wire.',
      },
      pallu: {
        src: '/api/collection/vysh-tsr-01/pallu',
        label: 'Block-Woven Tribal Pallu',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Copper-Thread Textile in Shadow',
        metadata: 'Raw Unspun Tussar Slub Panels',
        notes: 'Block-woven geometric panels interspersed with raw unspun tussar slub bands and frayed raw fringe.',
      },
      macro: {
        src: '/api/collection/vysh-tsr-01/macro',
        label: 'Honeycomb Slub Macro',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Rustic Copper-Thread Woven Texture',
        metadata: 'Tactile Fiber Grain · Natural Flecks',
        notes: 'Extreme raking light catching the rough fiber slubs and natural golden flecks against charcoal ground.',
      },
      editorial: {
        src: '/api/collection/vysh-tsr-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Bronze-Woven Shawl on Stone Steps',
        metadata: 'Weathered Basalt Setting · Organic Luxury',
        notes: 'The organic textural counterpoint to smooth mulberry silks, physically grounded in stone.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 09 — LIQUID METAL CONTINUUM
  // --------------------------------------------------------------------------
  {
    id: 'vysh-ctr-01',
    code: 'VYSH-CTR-01',
    number: 9,
    name: 'Liquid Metal Continuum',
    tagline: 'Experimental Haute Couture Micro-Wire',
    lineage: 'Experimental Haute Couture Textile',
    textileFamily: 'Experimental Couture',
    chapterId: 'obsidian-foundation',
    weightHand: 'Pliable / Metallic',
    opacity: '100% Opaque',
    primaryZari: 'Palladium Gold & Platinum Flare',
    accentHue: '#877964',
    keyFeature: 'Woven micro-wire holding sculptural origami free-space folds',
    curatorialStatement: 'Avant-garde handloom haute couture exploring ultra-fine flexible metallic micro-wire interwoven with charcoal microfiber, creating a textile that holds sculptural origami folds in free space like liquid metal.',
    themeVariant: 'dark',
    palette: {
      background: '#0B0B0C',
      surface: '#131316',
      border: 'rgba(224, 217, 204, 0.20)',
      text: '#F2F2F5',
      textMuted: '#8E8E96',
      accent: '#877964',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-ctr-01/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Silver-Threaded Textile on Marble Steps',
        metadata: 'VYSH-CTR-01 · Hero Specimen',
        notes: 'Liquid titanium black and silver-wire textile cascading down stark marble pedestals.',
      },
      flat: {
        src: '/api/collection/vysh-ctr-01/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Black and Silver Geometric Woven Textile',
        metadata: 'Planar Layout · Micro-Wire Matrix',
        notes: 'Planar view demonstrating graduating metallic wire pick density across the six yards.',
      },
      fold: {
        src: '/api/collection/vysh-ctr-01/fold',
        label: 'Origami Free-Space Folds',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Dramatic Black and Silver Woven Drapes',
        metadata: '0.04mm Micro-Wire Hybrid',
        notes: 'Sculptural origami folds holding position in space like molten architectural metal.',
      },
      pleat: {
        src: '/api/collection/vysh-ctr-01/pleat',
        label: 'Metallic Brocade Pleats',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Luxurious Black and Silver Brocade Folds',
        metadata: 'Metallic Reflectance Waves',
        notes: 'High-mirror platinum flares grazing the ridge lines of razor-sharp metallic pleats.',
      },
      border: {
        src: '/api/collection/vysh-ctr-01/border',
        label: 'Laser-Cut Micro-Hem',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Metallic Jacquard Fabric in Dramatic Light',
        metadata: 'Seamless Self-Selvedge',
        notes: 'Seamless self-selvedge with zero added ribbons; edge terminates in continuous micro-hem.',
      },
      pallu: {
        src: '/api/collection/vysh-ctr-01/pallu',
        label: 'Solid Palladium Pallu',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Metallic Black Textile on Marble Steps',
        metadata: '90% Wire Pick Ratio Density',
        notes: 'Solid flexible sheet of blackened gold and palladium wire settling on honed stone.',
      },
      macro: {
        src: '/api/collection/vysh-ctr-01/macro',
        label: 'Micro-Wire Macro',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Black and Silver Woven Textile Macro',
        metadata: 'High Anisotropic Curvature',
        notes: 'Extreme close-up of metallic wire warp and weft intersections reflecting stark directional light.',
      },
      editorial: {
        src: '/api/collection/vysh-ctr-01/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Metallic Drape in a Shadowed Gallery',
        metadata: 'Stark Lateral Strobes · Charcoal Limestone',
        notes: 'The outer boundary of digital textile innovation, celebrating futuristic sculptural couture.',
      },
    },
  },

  // --------------------------------------------------------------------------
  // CONCEPT 10 — MADDER PETNI
  // --------------------------------------------------------------------------
  {
    id: 'vysh-kjv-02',
    code: 'VYSH-KJV-02',
    number: 10,
    name: 'Madder Petni',
    tagline: 'Classical Temple Silk & Sacred Rubia',
    lineage: 'South Indian Classical Temple Silk (Kanchipuram Tradition)',
    textileFamily: 'Classical Temple Silk',
    chapterId: 'earth-temple-sanctum',
    weightHand: 'Heavy / Rhythmic',
    opacity: '100% Opaque',
    primaryZari: '22k Classical Antique Temple Gold',
    accentHue: '#CBB06B',
    keyFeature: 'Sacred madder red body with contrasting 12-inch charcoal border & dedicated edge asset',
    curatorialStatement: 'Classical Kanchipuram temple saree steeped in sacred natural dye heritage (Rubia cordifolia roots), featuring stepped interlocking petni spires, deep wine grounds, and an authoritative 12-inch charcoal border.',
    themeVariant: 'dark',
    palette: {
      background: '#12080A',
      surface: '#1C0D11',
      border: 'rgba(203, 176, 107, 0.22)',
      text: '#F5EFE8',
      textMuted: '#A08D88',
      accent: '#CBB06B',
    },
    assets: {
      hero: {
        src: '/api/collection/vysh-kjv-02/hero',
        label: 'Hero Specimen',
        movementTag: 'Hero Cascade',
        aspectRatio: '4/5',
        caption: '01 // Burgundy Silk Draped Over Marble',
        metadata: 'VYSH-KJV-02 · Hero Specimen',
        notes: 'Sacred rubia madder wine ground cascading over marble with authoritative temple weight.',
      },
      flat: {
        src: '/api/collection/vysh-kjv-02/flat',
        label: 'Flat Topological Plane',
        movementTag: 'Movement I — Planar Grid',
        aspectRatio: '16/9',
        caption: '02 // Ornate Burgundy and Gold Silk Saree',
        metadata: 'Planar Layout · 12-Inch Border',
        notes: 'Full planar layout revealing contrasting 12-inch charcoal borders and tiered petni spires.',
      },
      fold: {
        src: '/api/collection/vysh-kjv-02/fold',
        label: 'Deep Rubia Drapery Folds',
        movementTag: 'Movement II — Drape Dynamics',
        aspectRatio: '3/4',
        caption: '03 // Luxurious Crimson and Gold Brocade Drapery',
        metadata: 'Heavy 3-Ply Mulberry Silk',
        notes: 'Deep, rhythmic floor folds burning with ruby richness under directional warm grazing light.',
      },
      pleat: {
        src: '/api/collection/vysh-kjv-02/pleat',
        label: 'Temple Petni Pleats',
        movementTag: 'Movement III — Pleat Wave',
        aspectRatio: '3/4',
        caption: '04 // Burgundy Silk and Gold Brocade Folds',
        metadata: 'Stepped Petni Alignment',
        notes: 'Heavy pleats holding disciplined spacing with alternating rows of stylized temple motifs.',
      },
      border: {
        src: '/api/collection/vysh-kjv-02/border',
        label: '12-Inch Interlocking Petni Border',
        movementTag: 'Movement IV — Selvedge Detail',
        aspectRatio: '1/1',
        caption: '05 // Luxurious Maroon and Gold Brocade Textile',
        metadata: 'Tiered Petni Spires · Mayil Motifs',
        notes: 'Broad 12-inch interlocking charcoal border adorned with tiered triangular petni spires.',
      },
      pallu: {
        src: '/api/collection/vysh-kjv-02/pallu',
        label: 'Dense Gold Mundhi Pallu',
        movementTag: 'Movement V — Pallu Terminus',
        aspectRatio: '16/9',
        caption: '06 // Burgundy and Gold Woven Saree on Marble',
        metadata: 'Nine Continuous Temple Bands',
        notes: 'Traditional dense gold tissue mundhi panel featuring nine continuous rows of temple bands.',
      },
      macro: {
        src: '/api/collection/vysh-kjv-02/macro',
        label: 'Petni Interlocking Macro',
        movementTag: 'Movement VI — Weave Macro',
        aspectRatio: '1/1',
        caption: '07 // Luxury Maroon and Gold Brocade Weave',
        metadata: 'Dense Twill Body Interstices',
        notes: 'High-magnification view showing the dual-tone dye absorptance and interlocking border joint.',
      },
      editorial: {
        src: '/api/collection/vysh-kjv-02/editorial',
        label: 'Editorial Campaign Study',
        movementTag: 'Movement VII — Chiaroscuro Horizon',
        aspectRatio: '16/9',
        caption: '08 // Luxurious Burgundy and Gold Sari Draped in Shadow',
        metadata: 'Warm 2800K Temple Atmosphere',
        notes: 'Ceremonial color triumph of the collection balancing deep obsidian pieces with sacred madder warmth.',
      },
      edge: {
        src: '/api/collection/vysh-kjv-02/edge',
        label: 'Dedicated Selvedge Slate Edge',
        movementTag: 'Movement VIII — Edge & Selvedge Terminus',
        aspectRatio: '1/1',
        caption: '09 // Maroon and Gold Brocade Draped on Slate',
        metadata: 'Braided Madder Tassel Fringe Boundary',
        notes: 'Detailed selvedge terminus asset showing hand-braided madder tassel fringe resting against dark slate.',
      },
    },
  },
];

export function getSareeById(id: string): SareeConcept | undefined {
  const norm = id.toLowerCase().trim();
  return SAREE_COLLECTION.find((s) => s.id === norm || s.code.toLowerCase() === norm);
}

export function getSareesByChapter(chapterId: CollectionChapterId): SareeConcept[] {
  if (chapterId === 'all') return SAREE_COLLECTION;
  return SAREE_COLLECTION.filter((s) => s.chapterId === chapterId);
}
