/**
 * VYSHUUU Atmosphere Architecture
 * 
 * Scalable domain model for data-driven architectural gallery environments.
 * The environment transition reflects the physical character of the textile:
 * "The gallery itself changes because the textile changes."
 */

export type TextileAtmosphereCategory =
  | 'monumental'  // Heavy 3-ply silk, architectural brocade, deep chiaroscuro
  | 'diaphanous'   // Translucent kora/muslin, open khat grid, airy luminous space
  | 'tapestry'    // Interlocking oblique weft, shot silk, chromatic stone
  | 'structural';  // Minimal engineered contemporary handloom

export interface AtmospherePalette {
  /** Primary architectural canvas ground */
  background: string;
  /** Pavilion pedestal / elevated plate surface */
  backgroundSurface: string;
  /** Secondary elevated card or placard */
  backgroundElevated: string;
  /** High-contrast editorial typography */
  foreground: string;
  /** Secondary editorial annotations & specs */
  foregroundMuted: string;
  /** Master metallic / vegetal accent tone */
  accent: string;
  /** Restrained accent wash for borders and indicators */
  accentSubtle: string;
  /** Architectural separation rules */
  border: string;
  /** Subtle hairline dividing rules */
  borderSubtle: string;
}

export interface AtmosphereLighting {
  /** Ambient fill tint for 3D spatial integration */
  ambientColor: string;
  ambientIntensity: number;
  /** Directional key raking beam tint */
  keyLightColor: string;
  keyLightIntensity: number;
  /** Contact shadow depth */
  shadowColor: string;
  shadowOpacity: number;
}

export interface AtmosphereEditorial {
  /** Plate card treatment variant */
  plateVariant: 'dark' | 'light';
  /** Archival header classification */
  tagline: string;
  /** Human-readable curatorial description */
  atmosphereDescriptor: string;
  /** Architectural mood tag */
  mood: string;
  /** Art-directed signature metallic tone label */
  metallicIdentity?: string;
}

export interface AtmosphereProfile {
  id: string;
  name: string;
  sareeCode: string;
  category: TextileAtmosphereCategory;
  palette: AtmospherePalette;
  lighting: AtmosphereLighting;
  editorial: AtmosphereEditorial;
  /** Synchronized chromatic progression keyframes across the 8-9 cinematic observations */
  progression?: string[];
}

export interface AtmosphereTransition {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  gradientStop: string;
  filamentGradient: string;
  midpointColor: string;
  durationMs: number;
  description: string;
}
