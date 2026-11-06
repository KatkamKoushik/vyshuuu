import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getCollectionUrl } from '@/lib/assets/cloudinaryAssets';
import {
  sanitizeAndCheckTraversal,
  verifyCollectionRequest,
  validateRemoteAssetUrl,
} from '@/lib/security/assetPathSecurity';

const COLLECTION_VAULT_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/07_COLLECTION');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path: pathSegments } = await context.params;

  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse('Collection asset path required', { status: 400 });
  }

  const rawPath = pathSegments.join('/');

  // 1. Guard against path traversal, encoded separators, null bytes in requested path
  const sanitizeCheck = sanitizeAndCheckTraversal(rawPath);
  if (!sanitizeCheck.isSafe) {
    return new NextResponse(`Invalid path sequence: ${sanitizeCheck.reason}`, { status: 400 });
  }

  // Canonical collection pattern is: /api/collection/[saree-id]/[asset-type]
  if (pathSegments.length !== 2) {
    return new NextResponse(
      'Invalid collection asset path format. Expected format: /api/collection/[saree-id]/[asset-type]',
      { status: 400 }
    );
  }

  const sareeKey = pathSegments[0].toLowerCase().trim();
  const assetType = pathSegments[1].toLowerCase().trim();

  // 2. Cloudinary Production Delivery (Strictly validated redirect target)
  const cloudinaryUrl = getCollectionUrl(sareeKey, assetType);
  if (cloudinaryUrl && cloudinaryUrl.startsWith('https://')) {
    const urlValidation = validateRemoteAssetUrl(cloudinaryUrl);
    if (urlValidation.isAllowed) {
      return NextResponse.redirect(cloudinaryUrl, 307);
    }
  }

  // 3. Verify against trusted production manifest and canonical containment
  const verification = verifyCollectionRequest(sareeKey, assetType, COLLECTION_VAULT_ROOT);
  if (!verification.isValid || !verification.canonicalPath || !verification.asset) {
    return new NextResponse(`Access denied or collection asset unlisted: ${verification.error}`, {
      status: verification.error?.includes('traversal') || verification.error?.includes('escape') ? 403 : 404,
    });
  }

  // 4. Read canonical verified file
  const fileBuffer = fs.readFileSync(verification.canonicalPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': verification.asset.mimeType || 'image/png',
      'Content-Length': verification.asset.byteSize.toString(),
      'X-Content-Type-Options': 'nosniff',
      'X-Asset-SHA256': verification.asset.sha256,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Collection-Vault': 'APPROVED_COLLECTION_ASSETS',
    },
  });
}
