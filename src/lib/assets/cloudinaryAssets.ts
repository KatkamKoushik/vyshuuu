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
