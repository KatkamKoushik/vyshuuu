export interface AtelierPlateData {
  id: string;
  slug: string;
  index: string;
  title: string;
  emotionalPhase: string;
  shortCuratorialLine: string;
  assetSrc: string;
  alt: string;
  layoutVariant: 'abstract' | 'offset' | 'central' | 'intimate' | 'monumental';
}

export const ATELIER_PLATES: AtelierPlateData[] = [
  {
    id: 'vysh-atl-01',
    slug: 'warp-tension',
    index: '01',
    title: 'WARP TENSION',
    emotionalPhase: 'PRECISION',
    shortCuratorialLine:
      'Continuous raw silk filaments held under measured tension across the loom beam. An architecture of parallel lines before human touch.',
    assetSrc: '/api/atelier/vysh-atl-01',
    alt: 'Parallel raw silk filaments held under measured tension on a dark loom beam',
    layoutVariant: 'abstract',
  },
  {
    id: 'vysh-atl-02',
    slug: 'weft-cadence',
    index: '02',
    title: 'WEFT CADENCE',
    emotionalPhase: 'RHYTHM',
    shortCuratorialLine:
      'The ebony shuttle passing through the open shed. A single metallic thread guiding the steady human pulse of the weave.',
    assetSrc: '/api/atelier/vysh-atl-02',
    alt: 'Anonymous artisan hand guiding an ebony shuttle with antique gold thread through the loom shed',
    layoutVariant: 'offset',
  },
  {
    id: 'vysh-atl-03',
    slug: 'structural-interlock',
    index: '03',
    title: 'STRUCTURAL INTERLOCK',
    emotionalPhase: 'INTELLIGENCE',
    shortCuratorialLine:
      'Two textile planes becoming one. The obsidian body and antique gold border joined thread by thread through synchronized interlock.',
    assetSrc: '/api/atelier/vysh-atl-03',
    alt: 'Two pairs of artisan hands executing interlocking weave joinery between black silk and gold border',
    layoutVariant: 'central',
  },
  {
    id: 'vysh-atl-04',
    slug: 'tactile-weight',
    index: '04',
    title: 'TACTILE WEIGHT',
    emotionalPhase: 'KNOWLEDGE',
    shortCuratorialLine:
      'The weaver calibrates the textile through pressure and rebound. Measuring fluid mass, fold memory, and gravity by touch.',
    assetSrc: '/api/atelier/vysh-atl-04',
    alt: 'Artisan fingers gently testing the fold memory and weight of heavy obsidian silk over stone',
    layoutVariant: 'intimate',
  },
  {
    id: 'vysh-atl-05',
    slug: 'living-heirloom',
    index: '05',
    title: 'THE LIVING HEIRLOOM',
    emotionalPhase: 'PERMANENCE',
    shortCuratorialLine:
      'Six unbroken yards formally settled on dark volcanic stone. A single resting hand marks human origin before custody yields to time.',
    assetSrc: '/api/atelier/vysh-atl-05',
    alt: 'Completed six-yard handloom silk saree formally folded on dark stone plinth with a single resting hand',
    layoutVariant: 'monumental',
  },
];
