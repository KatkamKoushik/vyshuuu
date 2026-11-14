/**
 * VYSHUUU Cloudinary Asset Resolver
 * 
 * Maps canonical asset identifiers to verified Cloudinary secure URLs.
 * Provides fallback to semantic API routes if manifest is missing an entry.
 */

import manifest from './cloudinary-manifest.json';

export interface CloudinaryAssetRecord {
  public_id: string;
  secure_url: string;
  bytes: number;
  width?: number;
  height?: number;
}

interface ManifestStructure {
  textures?: Record<string, CloudinaryAssetRecord>;
  atelier?: Record<string, CloudinaryAssetRecord>;
  collection?: Record<string, Record<string, CloudinaryAssetRecord>>;
}

const typedManifest = manifest as ManifestStructure;

export function getTextureUrl(key: string): string {
  const item = typedManifest.textures?.[key];
  if (item?.secure_url) {
    return item.secure_url;
  }
  return `/api/textures/${key}`;
}

export function getAtelierUrl(slug: string): string {
  const normalized = slug.toLowerCase();
  const item = typedManifest.atelier?.[normalized];
  if (item?.secure_url) {
    return item.secure_url;
  }
  return `/api/atelier/${slug}`;
}

export function getCollectionUrl(sareeId: string, assetType: string): string {
  const normalizedSaree = sareeId.toLowerCase();
  const normalizedType = assetType.toLowerCase();
  const item = typedManifest.collection?.[normalizedSaree]?.[normalizedType];
  if (item?.secure_url) {
    return item.secure_url;
  }
  return `/api/collection/${sareeId}/${assetType}`;
}

/**
 * Generates an optimized Cloudinary delivery URL with automatic format and quality.
 * If url is not a Cloudinary delivery URL, returns unchanged.
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options?: { width?: number; quality?: string | number; format?: string }
): string {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const uploadMarker = '/image/upload/';
  const uploadIndex = url.indexOf(uploadMarker);
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + uploadMarker.length);
  const rest = url.substring(uploadIndex + uploadMarker.length);

  // If already contains transformations, do not stack duplicates
  if (rest.startsWith('f_auto') || rest.startsWith('w_') || rest.startsWith('c_')) {
    return url;
  }

  const format = options?.format || 'auto';
  const quality = options?.quality !== undefined ? options.quality : 'auto';
  const widthPart = options?.width ? `,w_${options.width},c_limit` : '';

  const transform = `f_${format},q_${quality}${widthPart}/`;
  return `${prefix}${transform}${rest}`;
}

/**
 * Generates a responsive srcset string for Cloudinary images.
 */
export function getCloudinarySrcSet(
  url: string,
  widths: number[] = [480, 768, 1080, 1440, 1920]
): string | undefined {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return undefined;
  }

  return widths
    .map((w) => `${getOptimizedCloudinaryUrl(url, { width: w })} ${w}w`)
    .join(', ');
}
