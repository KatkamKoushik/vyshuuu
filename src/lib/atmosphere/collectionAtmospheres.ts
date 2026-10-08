import React from 'react';
import {
  AtmosphereProfile,
  AtmosphereTransition,
} from './atmosphereModel';

/**
 * Neutral Archive Atmosphere Profile
 * The baseline nocturnal obsidian state of the gallery wall.
 */
export const NEUTRAL_ARCHIVE_ATMOSPHERE: AtmosphereProfile = {
  id: 'neutral',
  name: 'Pure Nocturnal Obsidian',
  sareeCode: 'ARCHIVE-NEUTRAL',
  category: 'monumental',
  palette: {
    background: '#0B0A09',
    backgroundSurface: '#121110',
    backgroundElevated: '#1A1816',
    foreground: '#F5F2EB',
    foregroundMuted: '#9E9689',
    accent: '#C5A869',
    accentSubtle: 'rgba(197, 168, 105, 0.16)',
    border: 'rgba(197, 168, 105, 0.18)',
    borderSubtle: 'rgba(245, 242, 235, 0.08)',
  },
  lighting: {
    ambientColor: '#0F0E10',
    ambientIntensity: 0.16,
    keyLightColor: '#F9E8C8',
    keyLightIntensity: 1.5,
    shadowColor: '#060505',
    shadowOpacity: 0.85,
  },
  editorial: {
    plateVariant: 'dark',
    tagline: 'PURE NOCTURNAL OBSIDIAN',
    atmosphereDescriptor:
      'Neutral obsidian darkroom gallery environment before textile-driven atmosphere activation.',
    mood: 'nocturnal-obsidian',
    metallicIdentity: 'ANTIQUE GOLD LIGHT',
  },
  progression: ['#0B0A09', '#0D0C0A', '#100F0D', '#0E0D0B', '#0B0A09'],
};

/**
 * Registry of Curated Collection Atmosphere Profiles
 * 
 * Scalable to all 10 collection concepts defined in SHOT-14A.
 * Art-directed digital textile identities where the saree sculpts the room lighting.
 */
export const APPROVED_ATMOSPHERES: Record<string, AtmosphereProfile> = {
  // 01: Continuum Archetype (Obsidian / Antique Gold)
  'vysh-arc-01': {
    id: 'vysh-arc-01',
    name: 'The Continuum Archetype',
    sareeCode: 'VYSH-ARC-01',
    category: 'monumental',
    palette: {
      background: '#0B0A09',
      backgroundSurface: '#121110',
      backgroundElevated: '#1A1816',
      foreground: '#F5F2EB',
      foregroundMuted: '#9E9689',
      accent: '#C5A869',
      accentSubtle: 'rgba(197, 168, 105, 0.18)',
      border: 'rgba(197, 168, 105, 0.22)',
      borderSubtle: 'rgba(245, 242, 235, 0.08)',
    },
    lighting: {
      ambientColor: '#0F0E10',
      ambientIntensity: 0.16,
      keyLightColor: '#F9E8C8',
      keyLightIntensity: 1.6,
      shadowColor: '#060505',
      shadowOpacity: 0.85,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'OBSIDIAN / ANTIQUE GOLD',
      atmosphereDescriptor:
        'Monumental obsidian darkness sculpted by acute lateral raking chiaroscuro light.',
      mood: 'monumental-sacred',
      metallicIdentity: 'ANTIQUE GOLD LIGHT',
    },
    progression: ['#0B0A09', '#0E0D0A', '#13120E', '#181510', '#14120E', '#0C0B09'],
  },

  // 02: Obsidian Korvai (Charcoal / Burnished Bronze)
  'vysh-kjv-01': {
    id: 'vysh-kjv-01',
    name: 'Obsidian Korvai',
    sareeCode: 'VYSH-KJV-01',
    category: 'monumental',
    palette: {
      background: '#0A0908',
      backgroundSurface: '#141210',
      backgroundElevated: '#1D1A16',
      foreground: '#F4EFE6',
      foregroundMuted: '#968E80',
      accent: '#A0804D',
      accentSubtle: 'rgba(160, 128, 77, 0.18)',
      border: 'rgba(160, 128, 77, 0.24)',
      borderSubtle: 'rgba(244, 239, 230, 0.08)',
    },
    lighting: {
      ambientColor: '#0E0D0B',
      ambientIntensity: 0.14,
      keyLightColor: '#F6E4C4',
      keyLightIntensity: 1.7,
      shadowColor: '#050404',
      shadowOpacity: 0.88,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'CHARCOAL / BURNISHED BRONZE',
      atmosphereDescriptor:
        'Heavy ritual gravitas with 9-inch stepped temple korvai borders and deep molten luster.',
      mood: 'monumental-sacred',
      metallicIdentity: 'BURNISHED BRONZE',
    },
    progression: ['#0A0908', '#0F0D0A', '#15110B', '#18130C', '#14100B', '#090807'],
  },

  // 03: Shikar Gah in Shadow (Graphite / Blackened Silver)
  'vysh-bnr-01': {
    id: 'vysh-bnr-01',
    name: 'Shikar Gah in Shadow',
    sareeCode: 'VYSH-BNR-01',
    category: 'monumental',
    palette: {
      background: '#0B0C0E',
      backgroundSurface: '#121417',
      backgroundElevated: '#181A1F',
      foreground: '#F0F0F2',
      foregroundMuted: '#8C8E94',
      accent: '#A8A9AD',
      accentSubtle: 'rgba(168, 169, 173, 0.18)',
      border: 'rgba(168, 169, 173, 0.22)',
      borderSubtle: 'rgba(240, 240, 242, 0.08)',
    },
    lighting: {
      ambientColor: '#0C0D10',
      ambientIntensity: 0.15,
      keyLightColor: '#EDE5D5',
      keyLightIntensity: 1.5,
      shadowColor: '#060608',
      shadowOpacity: 0.86,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'GRAPHITE / BLACKENED SILVER',
      atmosphereDescriptor:
        'Dense Kinkhwab brocade featuring botanical hunting reserves in silvered moire sheen.',
      mood: 'monumental-sacred',
      metallicIdentity: 'BLACKENED SILVER',
    },
    progression: ['#0B0C0E', '#0E1015', '#12151D', '#161922', '#12141C', '#090A0D'],
  },

  // 04: Gossamer Kora (Ecru / Pale Champagne)
  'vysh-chd-01': {
    id: 'vysh-chd-01',
    name: 'Gossamer Kora',
    sareeCode: 'VYSH-CHD-01',
    category: 'diaphanous',
    palette: {
      background: '#141311',
      backgroundSurface: '#1C1A17',
      backgroundElevated: '#24221D',
      foreground: '#FAF6EE',
      foregroundMuted: '#968E80',
      accent: '#D4C7AC',
      accentSubtle: 'rgba(212, 199, 172, 0.18)',
      border: 'rgba(212, 199, 172, 0.22)',
      borderSubtle: 'rgba(250, 246, 238, 0.08)',
    },
    lighting: {
      ambientColor: '#1A1814',
      ambientIntensity: 0.24,
      keyLightColor: '#FFF6E5',
      keyLightIntensity: 1.4,
      shadowColor: '#090807',
      shadowOpacity: 0.82,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'ECRU / PALE CHAMPAGNE',
      atmosphereDescriptor:
        'Diaphanous architectural atmosphere celebrating optical transparency and weightless float.',
      mood: 'diaphanous-luminous',
      metallicIdentity: 'PALE CHAMPAGNE',
    },
    progression: ['#141311', '#1A1814', '#211E18', '#29251D', '#201D17', '#151411'],
  },

  // 05: Tapestry Dusk (Deep Brown / Copper)
  'vysh-pth-01': {
    id: 'vysh-pth-01',
    name: 'Tapestry Dusk',
    sareeCode: 'VYSH-PTH-01',
    category: 'tapestry',
    palette: {
      background: '#100D0B',
      backgroundSurface: '#181411',
      backgroundElevated: '#221C18',
      foreground: '#F5EFE6',
      foregroundMuted: '#9E9080',
      accent: '#BA7A48',
      accentSubtle: 'rgba(186, 122, 72, 0.18)',
      border: 'rgba(186, 122, 72, 0.22)',
      borderSubtle: 'rgba(245, 239, 230, 0.08)',
    },
    lighting: {
      ambientColor: '#120F0C',
      ambientIntensity: 0.16,
      keyLightColor: '#F8E9C9',
      keyLightIntensity: 1.6,
      shadowColor: '#080605',
      shadowOpacity: 0.85,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'DEEP BROWN / COPPER',
      atmosphereDescriptor:
        'Dhoop-chhaon shot silk ground with oblique-weft interlocked solid gold tapestry panels.',
      mood: 'tapestry',
      metallicIdentity: 'WARM COPPER',
    },
    progression: ['#100D0B', '#16110D', '#1D140E', '#221710', '#1B120D', '#0D0A08'],
  },

  // 06: Vapor Inlay (Mist / Raw Ecru / Silver)
  'vysh-jmd-01': {
    id: 'vysh-jmd-01',
    name: 'Vapor Inlay',
    sareeCode: 'VYSH-JMD-01',
    category: 'diaphanous',
    palette: {
      background: '#0D0E10',
      backgroundSurface: '#15171A',
      backgroundElevated: '#1D2024',
      foreground: '#F2F0EB',
      foregroundMuted: '#929496',
      accent: '#C8C4B7',
      accentSubtle: 'rgba(200, 196, 183, 0.18)',
      border: 'rgba(200, 196, 183, 0.20)',
      borderSubtle: 'rgba(242, 240, 235, 0.08)',
    },
    lighting: {
      ambientColor: '#101214',
      ambientIntensity: 0.20,
      keyLightColor: '#F5EFE4',
      keyLightIntensity: 1.3,
      shadowColor: '#070809',
      shadowOpacity: 0.80,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'MIST / RAW ECRU / SILVER',
      atmosphereDescriptor:
        'Featherlight muslin ground holding suspended non-continuous botanical inlays like vapor.',
      mood: 'diaphanous-luminous',
      metallicIdentity: 'RAW ECRU / SILVER',
    },
    progression: ['#0D0E10', '#111317', '#16191E', '#1A1E24', '#15181D', '#0A0B0E'],
  },

  // 07: Obsidian Khat Grid (Charcoal / Antique Gold)
  'vysh-kta-01': {
    id: 'vysh-kta-01',
    name: 'Obsidian Khat Grid',
    sareeCode: 'VYSH-KTA-01',
    category: 'structural',
    palette: {
      background: '#0E0D0C',
      backgroundSurface: '#161513',
      backgroundElevated: '#1F1D1A',
      foreground: '#F4EFE6',
      foregroundMuted: '#948D80',
      accent: '#BFAA72',
      accentSubtle: 'rgba(191, 170, 114, 0.18)',
      border: 'rgba(191, 170, 114, 0.22)',
      borderSubtle: 'rgba(244, 239, 230, 0.08)',
    },
    lighting: {
      ambientColor: '#100F0E',
      ambientIntensity: 0.18,
      keyLightColor: '#F5EACB',
      keyLightIntensity: 1.4,
      shadowColor: '#070605',
      shadowOpacity: 0.82,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'CHARCOAL / ANTIQUE GOLD',
      atmosphereDescriptor:
        'Rigorous geometric square khat grid transparency with structured cotton cord resilience.',
      mood: 'structural',
      metallicIdentity: 'ANTIQUE GOLD',
    },
    progression: ['#0E0D0C', '#12110E', '#171512', '#1C1914', '#161411', '#0A0908'],
  },

  // 08: Raw Honeycomb Slub (Smoked Honey / Copper-Bronze)
  'vysh-tsr-01': {
    id: 'vysh-tsr-01',
    name: 'Raw Honeycomb Slub',
    sareeCode: 'VYSH-TSR-01',
    category: 'tapestry',
    palette: {
      background: '#120F0C',
      backgroundSurface: '#1A1612',
      backgroundElevated: '#241E19',
      foreground: '#F5EFE6',
      foregroundMuted: '#998D7E',
      accent: '#B88B4A',
      accentSubtle: 'rgba(184, 139, 74, 0.18)',
      border: 'rgba(184, 139, 74, 0.22)',
      borderSubtle: 'rgba(245, 239, 230, 0.08)',
    },
    lighting: {
      ambientColor: '#14110E',
      ambientIntensity: 0.17,
      keyLightColor: '#F7E6C6',
      keyLightIntensity: 1.5,
      shadowColor: '#090705',
      shadowOpacity: 0.86,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'SMOKED HONEY / COPPER-BRONZE',
      atmosphereDescriptor:
        'Tactile wild forest silk with non-uniform fiber grain, organic slubs, and raw gicha borders.',
      mood: 'tapestry',
      metallicIdentity: 'COPPER-BRONZE',
    },
    progression: ['#120F0C', '#17120D', '#1E160F', '#231911', '#1C140E', '#0C0A07'],
  },

  // 09: Liquid Metal Continuum (Titanium Black / Palladium)
  'vysh-ctr-01': {
    id: 'vysh-ctr-01',
    name: 'Liquid Metal Continuum',
    sareeCode: 'VYSH-CTR-01',
    category: 'structural',
    palette: {
      background: '#0A0A0C',
      backgroundSurface: '#121216',
      backgroundElevated: '#1A1A20',
      foreground: '#F2F2F5',
      foregroundMuted: '#8E8E96',
      accent: '#9FA4AD',
      accentSubtle: 'rgba(159, 164, 173, 0.18)',
      border: 'rgba(159, 164, 173, 0.22)',
      borderSubtle: 'rgba(242, 242, 245, 0.08)',
    },
    lighting: {
      ambientColor: '#0D0D10',
      ambientIntensity: 0.16,
      keyLightColor: '#F0ECE4',
      keyLightIntensity: 1.6,
      shadowColor: '#060608',
      shadowOpacity: 0.88,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'TITANIUM BLACK / PALLADIUM',
      atmosphereDescriptor:
        'Futuristic micro-wire couture holding sculptural origami free-space folds like molten metal.',
      mood: 'structural',
      metallicIdentity: 'PALLADIUM',
    },
    progression: ['#0A0A0C', '#0E0F14', '#12141C', '#161822', '#111219', '#08080A'],
  },

  // 10: Madder Petni (Deep Madder / Wine-Black / Antique Gold)
  'vysh-kjv-02': {
    id: 'vysh-kjv-02',
    name: 'Madder Petni',
    sareeCode: 'VYSH-KJV-02',
    category: 'monumental',
    palette: {
      background: '#12070A',
      backgroundSurface: '#1A0B0F',
      backgroundElevated: '#240F15',
      foreground: '#F5EFE8',
      foregroundMuted: '#A08D88',
      accent: '#C8A85E',
      accentSubtle: 'rgba(200, 168, 94, 0.18)',
      border: 'rgba(200, 168, 94, 0.22)',
      borderSubtle: 'rgba(245, 239, 232, 0.08)',
    },
    lighting: {
      ambientColor: '#140A0C',
      ambientIntensity: 0.15,
      keyLightColor: '#F9E7C5',
      keyLightIntensity: 1.7,
      shadowColor: '#090304',
      shadowOpacity: 0.88,
    },
    editorial: {
      plateVariant: 'dark',
      tagline: 'DEEP MADDER / WINE-BLACK / ANTIQUE GOLD',
      atmosphereDescriptor:
        'Sacred natural dye heritage with 12-inch contrasting charcoal borders and tiered petni spires.',
      mood: 'monumental-sacred',
      metallicIdentity: 'ANTIQUE GOLD',
    },
    progression: ['#0B0A09', '#12070A', '#1B090E', '#220B12', '#18070C', '#0F0508'],
  },
};

/**
 * Retrieves an atmosphere profile by its collection ID.
 * Returns the Neutral Obsidian Archive profile if null, undefined, or 'neutral'.
 */
export function getAtmosphere(id?: string | null): AtmosphereProfile {
  if (!id || id === 'neutral') {
    return NEUTRAL_ARCHIVE_ATMOSPHERE;
  }
  const normalized = id.toLowerCase().trim();
  return APPROVED_ATMOSPHERES[normalized] || NEUTRAL_ARCHIVE_ATMOSPHERE;
}

/**
 * Calculates a data-driven chromatic and spatial transition between any two atmospheres.
 */
export function getAtmosphereTransition(
  fromId: string = 'vysh-arc-01',
  toId: string = 'vysh-chd-01'
): AtmosphereTransition {
  const from = getAtmosphere(fromId);
  const to = getAtmosphere(toId);

  return {
    fromId: from.id,
    toId: to.id,
    fromName: from.name,
    toName: to.name,
    gradientStop: `from-[${from.palette.background}] via-[#221e1a] via-60% to-[${to.palette.background}]`,
    filamentGradient: `from-[${from.palette.accent}] via-[#cbb17b] to-[${to.palette.accent}]`,
    midpointColor: '#221e1a',
    durationMs: 1400,
    description: `The continuum breathes between ${from.name} and ${to.name}. ${from.editorial.mood} transforms into ${to.editorial.mood}.`,
  };
}

/**
 * Returns the specific synchronized background color for a given progression progress (0.0 to 1.0).
 */
export function getProgressionColor(profile: AtmosphereProfile, progress: number): string {
  const steps = profile.progression || [profile.palette.background];
  if (steps.length === 1) return steps[0];
  const clamped = Math.max(0, Math.min(1, progress));
  const index = Math.min(steps.length - 1, Math.floor(clamped * (steps.length - 1)));
  return steps[index];
}

/**
 * Generates inline CSS custom properties for a given atmosphere profile.
 */
export function generateAtmosphereCSSVars(profile: AtmosphereProfile): React.CSSProperties {
  return {
    ['--atmo-bg' as string]: profile.palette.background,
    ['--atmo-surface' as string]: profile.palette.backgroundSurface,
    ['--atmo-surface-elevated' as string]: profile.palette.backgroundElevated,
    ['--atmo-fg' as string]: profile.palette.foreground,
    ['--atmo-fg-muted' as string]: profile.palette.foregroundMuted,
    ['--atmo-accent' as string]: profile.palette.accent,
    ['--atmo-accent-subtle' as string]: profile.palette.accentSubtle,
    ['--atmo-border' as string]: profile.palette.border,
    ['--atmo-border-subtle' as string]: profile.palette.borderSubtle,
    ['--atmo-glow' as string]: profile.lighting.keyLightColor,
  };
}
