/**
 * VYSHUUU Cloudinary Asset Resolver
 * 
 * Maps canonical asset identifiers to verified Cloudinary secure URLs.
 * Enforces protocol, hostname, and SSRF restrictions.
 * Provides fallback to semantic API routes if manifest is missing an entry or URL fails validation.
 */

import manifest from './cloudinary-manifest.json';
import { validateRemoteAssetUrl } from '@/lib/security/assetPathSecurity';

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

function getValidatedSecureUrl(candidateUrl: string | undefined): string | null {
  if (!candidateUrl) return null;
  const validation = validateRemoteAssetUrl(candidateUrl);
  if (validation.isAllowed) {
    return candidateUrl;
  }
  return null;
}

export function getTextureUrl(key: string): string {
  const normKey = key.toLowerCase();
  const item = typedManifest.textures?.[normKey];
  const secureUrl = getValidatedSecureUrl(item?.secure_url);
  if (secureUrl) {
    return secureUrl;
  }
  return `/api/textures/${key}`;
}

export function getAtelierUrl(slug: string): string {
  const normalized = slug.toLowerCase();
  const item = typedManifest.atelier?.[normalized];
  const secureUrl = getValidatedSecureUrl(item?.secure_url);
  if (secureUrl) {
    return secureUrl;
  }
  return `/api/atelier/${slug}`;
}

export function getCollectionUrl(sareeId: string, assetType: string): string {
  const normalizedSaree = sareeId.toLowerCase();
  const normalizedType = assetType.toLowerCase();
  const item = typedManifest.collection?.[normalizedSaree]?.[normalizedType];
  const secureUrl = getValidatedSecureUrl(item?.secure_url);
  if (secureUrl) {
    return secureUrl;
  }
  return `/api/collection/${sareeId}/${assetType}`;
}
