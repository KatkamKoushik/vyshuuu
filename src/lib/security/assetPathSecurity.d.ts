export interface TrustedAssetRecord {
  key?: string;
  slug?: string;
  sareeId?: string;
  assetType?: string;
  relativePath: string;
  vaultSubdir: string;
  fileInVault: string;
  mimeType: string;
  byteSize: number;
  sha256: string;
  width?: number | null;
  height?: number | null;
}

export interface PathValidationResult {
  isValid: boolean;
  error?: string;
  canonicalPath?: string;
  asset?: TrustedAssetRecord;
}

export interface RemoteUrlValidationResult {
  isAllowed: boolean;
  reason?: string;
  parsedUrl?: URL;
}

export function sanitizeAndCheckTraversal(rawInput: string): { isSafe: boolean; reason?: string };

export function verifyContainedPath(
  configuredRoot: string,
  relativeFilePath: string
): { isContained: boolean; resolvedPath?: string; error?: string };

export function validateRemoteAssetUrl(urlString: string): RemoteUrlValidationResult;

export function verifyTextureRequest(
  requestedPath: string,
  vaultRoot: string
): PathValidationResult;

export function verifyAtelierRequest(
  requestedSlug: string,
  vaultRoot: string
): PathValidationResult;

export function verifyCollectionRequest(
  sareeId: string,
  assetType: string,
  vaultRoot: string
): PathValidationResult;
