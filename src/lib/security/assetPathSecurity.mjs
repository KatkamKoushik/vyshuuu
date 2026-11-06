import fs from 'node:fs';
import path from 'node:path';

// Read JSON synchronously so it works across both Node.js ESM and bundlers without JSON module assert syntax differences
const manifestPath = path.resolve(process.cwd(), 'src/lib/security/trusted-manifest-data.json');
const trustedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const ALLOWED_REMOTE_HOSTS = new Set(['res.cloudinary.com']);

/**
 * Checks for prohibited path sequences including:
 * - Null bytes (\0, %00)
 * - Encoded separators (%2f, %5c, %252f, %255c)
 * - Encoded dots (%2e, %2E)
 * - Traversal sequences (..)
 * - Windows / UNC / Absolute path patterns
 * @param {string} rawInput
 * @returns {{ isSafe: boolean, reason?: string }}
 */
export function sanitizeAndCheckTraversal(rawInput) {
  if (typeof rawInput !== 'string' || rawInput.trim() === '') {
    return { isSafe: false, reason: 'Empty or invalid path input' };
  }

  // 1. Check for null bytes
  if (rawInput.includes('\0') || /%00/i.test(rawInput)) {
    return { isSafe: false, reason: 'Null byte injection detected' };
  }

  // 2. Check for encoded path separators and double-encoding
  if (
    /%2f/i.test(rawInput) ||
    /%5c/i.test(rawInput) ||
    /%252f/i.test(rawInput) ||
    /%255c/i.test(rawInput) ||
    /%252e/i.test(rawInput) ||
    /%2e/i.test(rawInput)
  ) {
    return { isSafe: false, reason: 'Encoded path separator or traversal detected' };
  }

  // 3. Reject Windows drive letters, backslashes, UNC prefixes, or multi-slashes
  if (rawInput.includes('\\') || /^[a-zA-Z]:/.test(rawInput) || /\/{2,}/.test(rawInput)) {
    return { isSafe: false, reason: 'Backslashes, drive letters, or duplicate separators forbidden' };
  }

  // 4. Reject leading slashes (absolute paths)
  if (rawInput.startsWith('/')) {
    return { isSafe: false, reason: 'Absolute paths are forbidden' };
  }

  // 5. Check decoded path segments for .. or multi-dots
  let decoded = rawInput;
  try {
    decoded = decodeURIComponent(rawInput);
  } catch {
    return { isSafe: false, reason: 'Malformed URI encoding' };
  }

  if (/\.{2,}/.test(decoded)) {
    return { isSafe: false, reason: 'Parent traversal detected' };
  }

  const segments = decoded.split('/');
  for (const seg of segments) {
    if (seg === '..' || seg.trim() === '..') {
      return { isSafe: false, reason: 'Directory traversal sequence (..) detected' };
    }
  }

  return { isSafe: true };
}

/**
 * Resolves configured root and requested relative path to canonical real paths.
 * Enforces:
 * - No traversal (..)
 * - No sibling-prefix escapes (e.g. root: /a/b, target: /a/b_evil)
 * - Canonical realpath resolution preventing symlink escapes
 * @param {string} configuredRoot
 * @param {string} relativeFilePath
 * @returns {{ isContained: boolean, resolvedPath?: string, error?: string }}
 */
export function verifyContainedPath(configuredRoot, relativeFilePath) {
  const sanitizeResult = sanitizeAndCheckTraversal(relativeFilePath);
  if (!sanitizeResult.isSafe) {
    return { isContained: false, error: sanitizeResult.reason };
  }

  // Ensure root exists and resolve its canonical real path
  if (!fs.existsSync(configuredRoot)) {
    return { isContained: false, error: 'Configured root directory not found' };
  }
  const canonicalRoot = fs.realpathSync(configuredRoot);

  // Resolve target path relative to canonical root
  const resolvedTarget = path.resolve(canonicalRoot, relativeFilePath);

  // Check sibling-prefix and containment via path.relative
  const relativeFromRoot = path.relative(canonicalRoot, resolvedTarget);
  if (
    relativeFromRoot.startsWith('..') ||
    path.isAbsolute(relativeFromRoot) ||
    (!resolvedTarget.startsWith(canonicalRoot + path.sep) && resolvedTarget !== canonicalRoot)
  ) {
    return { isContained: false, error: 'Path traversal or sibling prefix escape detected' };
  }

  // Verify file existence on disk
  if (!fs.existsSync(resolvedTarget)) {
    return { isContained: false, error: 'File does not exist' };
  }

  // Prevent symlink escape by canonicalizing target file
  const canonicalTarget = fs.realpathSync(resolvedTarget);
  const relFromRootCanonical = path.relative(canonicalRoot, canonicalTarget);
  if (
    relFromRootCanonical.startsWith('..') ||
    path.isAbsolute(relFromRootCanonical) ||
    (!canonicalTarget.startsWith(canonicalRoot + path.sep) && canonicalTarget !== canonicalRoot)
  ) {
    return { isContained: false, error: 'Symlink escape outside root directory' };
  }

  return { isContained: true, resolvedPath: canonicalTarget };
}

/**
 * Validates remote asset URLs against SSRF, unauthorized protocols, and untrusted hosts.
 * @param {string} urlString
 * @returns {{ isAllowed: boolean, reason?: string, parsedUrl?: URL }}
 */
export function validateRemoteAssetUrl(urlString) {
  if (typeof urlString !== 'string' || !urlString.trim()) {
    return { isAllowed: false, reason: 'Missing remote URL' };
  }

  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    return { isAllowed: false, reason: 'Invalid URL format' };
  }

  // 1. Restrict protocol to https only
  if (parsed.protocol !== 'https:') {
    return { isAllowed: false, reason: `Insecure protocol: ${parsed.protocol} (only https allowed)` };
  }

  // 2. Reject non-standard ports
  if (parsed.port && parsed.port !== '443') {
    return { isAllowed: false, reason: `Non-standard port rejected: ${parsed.port}` };
  }

  // 3. Validate hostname against allowed list
  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_REMOTE_HOSTS.has(host)) {
    return { isAllowed: false, reason: `Untrusted remote host: ${host}` };
  }

  // 4. Reject localhost, private IP addresses, or internal domains
  if (
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
    /^169\.254\./.test(host) || // AWS metadata / link-local
    host === '::1' ||
    host.startsWith('fe80:')
  ) {
    return { isAllowed: false, reason: 'Private/internal network address rejected' };
  }

  return { isAllowed: true, parsedUrl: parsed };
}

/**
 * Production Texture Route Verifier
 * Only serves textures listed in the trusted build-time manifest.
 * @param {string} requestedPath
 * @param {string} vaultRoot
 */
export function verifyTextureRequest(requestedPath, vaultRoot) {
  const normKey = requestedPath.toLowerCase().trim();
  const manifestEntry = trustedManifest.textures[normKey];

  if (!manifestEntry) {
    return {
      isValid: false,
      error: `Texture not found in trusted production manifest: ${requestedPath}`,
    };
  }

  const containment = verifyContainedPath(vaultRoot, manifestEntry.fileInVault);
  if (!containment.isContained || !containment.resolvedPath) {
    return {
      isValid: false,
      error: containment.error ?? 'Texture containment failure',
    };
  }

  return {
    isValid: true,
    canonicalPath: containment.resolvedPath,
    asset: manifestEntry,
  };
}

/**
 * Production Atelier Route Verifier
 * Only serves atelier plates listed in the trusted build-time manifest.
 * @param {string} requestedSlug
 * @param {string} vaultRoot
 */
export function verifyAtelierRequest(requestedSlug, vaultRoot) {
  const normSlug = requestedSlug.toLowerCase().trim();
  const manifestEntry = trustedManifest.atelier[normSlug];

  if (!manifestEntry) {
    return {
      isValid: false,
      error: `Atelier asset not found in trusted production manifest: ${requestedSlug}`,
    };
  }

  const containment = verifyContainedPath(vaultRoot, manifestEntry.fileInVault);
  if (!containment.isContained || !containment.resolvedPath) {
    return {
      isValid: false,
      error: containment.error ?? 'Atelier asset containment failure',
    };
  }

  return {
    isValid: true,
    canonicalPath: containment.resolvedPath,
    asset: manifestEntry,
  };
}

/**
 * Production Collection Route Verifier
 * Only serves collection assets listed in the trusted build-time manifest.
 * Accepts either:
 *   (sareeId, assetType, vaultRoot)
 * or:
 *   (pathStringOrArray, vaultRoot)
 */
export function verifyCollectionRequest(sareeIdOrPath, assetTypeOrVault, maybeVaultRoot) {
  let sareeId;
  let assetType;
  let vaultRoot;

  if (maybeVaultRoot !== undefined) {
    sareeId = sareeIdOrPath;
    assetType = assetTypeOrVault;
    vaultRoot = maybeVaultRoot;
  } else {
    vaultRoot = assetTypeOrVault;
    const parts = Array.isArray(sareeIdOrPath)
      ? sareeIdOrPath
      : String(sareeIdOrPath || '').split('/').filter(Boolean);
    if (parts.length !== 2) {
      return {
        isValid: false,
        error: 'Invalid collection asset path format: expected exactly 2 segments [saree-id]/[asset-type]',
      };
    }
    sareeId = parts[0];
    assetType = parts[1];
  }

  const normSaree = (sareeId || '').toLowerCase().trim();
  const normType = (assetType || '').toLowerCase().trim();

  const sareeCollection = trustedManifest.collection[normSaree];
  if (!sareeCollection) {
    return {
      isValid: false,
      error: `Unknown saree identifier: ${sareeId}`,
    };
  }

  const manifestEntry = sareeCollection[normType];
  if (!manifestEntry) {
    return {
      isValid: false,
      error: `Asset type '${assetType}' not found in trusted manifest for ${sareeId}`,
    };
  }

  const containment = verifyContainedPath(vaultRoot, manifestEntry.fileInVault);
  if (!containment.isContained || !containment.resolvedPath) {
    return {
      isValid: false,
      error: containment.error ?? 'Collection asset containment failure',
    };
  }

  return {
    isValid: true,
    canonicalPath: containment.resolvedPath,
    asset: manifestEntry,
  };
}
