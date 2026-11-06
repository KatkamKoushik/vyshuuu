import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getTextureUrl } from '@/lib/assets/cloudinaryAssets';
import {
  sanitizeAndCheckTraversal,
  verifyTextureRequest,
  validateRemoteAssetUrl,
} from '@/lib/security/assetPathSecurity';

const TEXTURES_VAULT_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/04_TEXTURES');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path: pathSegments } = await context.params;

  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse('Texture path required', { status: 400 });
  }

  const requestedPath = pathSegments.join('/');

  // 1. Guard against path traversal, encoded separators, null bytes in requested path
  const sanitizeCheck = sanitizeAndCheckTraversal(requestedPath);
  if (!sanitizeCheck.isSafe) {
    return new NextResponse(`Invalid path sequence: ${sanitizeCheck.reason}`, { status: 400 });
  }

  // 2. Cloudinary Production Delivery (Strictly validated redirect target)
  const cloudinaryUrl = getTextureUrl(requestedPath);
  if (cloudinaryUrl && cloudinaryUrl.startsWith('https://')) {
    const urlValidation = validateRemoteAssetUrl(cloudinaryUrl);
    if (urlValidation.isAllowed) {
      return NextResponse.redirect(cloudinaryUrl, 307);
    }
  }

  // 3. Verify against trusted production manifest and canonical containment
  const verification = verifyTextureRequest(requestedPath, TEXTURES_VAULT_ROOT);
  if (!verification.isValid || !verification.canonicalPath || !verification.asset) {
    return new NextResponse(`Access denied or texture unlisted: ${verification.error}`, {
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
      'X-Texture-Vault': 'LOCKED_PRODUCTION_MAPS',
    },
  });
}
