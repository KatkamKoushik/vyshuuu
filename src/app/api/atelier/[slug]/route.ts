import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getAtelierUrl } from '@/lib/assets/cloudinaryAssets';
import {
  sanitizeAndCheckTraversal,
  verifyAtelierRequest,
  validateRemoteAssetUrl,
} from '@/lib/security/assetPathSecurity';

const ATELIER_VAULT_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/08_ATELIER');

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug || typeof slug !== 'string') {
    return new NextResponse('Atelier slug required', { status: 400 });
  }

  // 1. Guard against path traversal, encoded separators, null bytes in slug
  const sanitizeCheck = sanitizeAndCheckTraversal(slug);
  if (!sanitizeCheck.isSafe) {
    return new NextResponse(`Invalid slug sequence: ${sanitizeCheck.reason}`, { status: 400 });
  }

  const normalizedSlug = slug.toLowerCase().trim();

  // 2. Cloudinary Production Delivery (Strictly validated redirect target)
  const cloudinaryUrl = getAtelierUrl(normalizedSlug);
  if (cloudinaryUrl && cloudinaryUrl.startsWith('https://')) {
    const urlValidation = validateRemoteAssetUrl(cloudinaryUrl);
    if (urlValidation.isAllowed) {
      return NextResponse.redirect(cloudinaryUrl, 307);
    }
  }

  // 3. Verify against trusted production manifest and canonical containment
  const verification = verifyAtelierRequest(normalizedSlug, ATELIER_VAULT_ROOT);
  if (!verification.isValid || !verification.canonicalPath || !verification.asset) {
    return new NextResponse(`Access denied or atelier asset unlisted: ${verification.error}`, {
      status: verification.error?.includes('traversal') || verification.error?.includes('escape') ? 403 : 404,
    });
  }

  // 4. Read canonical verified file
  const fileBuffer = fs.readFileSync(verification.canonicalPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': verification.asset.mimeType || 'image/jpeg',
      'Content-Length': verification.asset.byteSize.toString(),
      'X-Content-Type-Options': 'nosniff',
      'X-Asset-SHA256': verification.asset.sha256,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Atelier-Vault': 'APPROVED_ATELIER_ASSETS',
    },
  });
}
