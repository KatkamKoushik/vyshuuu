import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const ATELIER_VAULT_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/08_ATELIER');

// Canonical mapping for all 5 approved Atelier cinematic plates
const ATELIER_ASSET_MAP: Record<string, string> = {
  'vysh-atl-01': 'VYSH-ATL-01-warp-tension.jpg',
  'vysh-atl-02': 'VYSH-ATL-02-weft-cadence.jpg',
  'vysh-atl-03': 'VYSH-ATL-03-structural-interlock.jpg',
  'vysh-atl-04': 'VYSH-ATL-04-tactile-weight.jpg',
  'vysh-atl-05': 'VYSH-ATL-05-living-heirloom.jpg',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  const fileName = ATELIER_ASSET_MAP[normalizedSlug];
  if (!fileName) {
    return new NextResponse(`Unknown Atelier asset slug: ${slug}`, { status: 404 });
  }

  const absolutePath = path.resolve(ATELIER_VAULT_ROOT, fileName);

  // Security barrier: prevent directory traversal outside vault root
  if (!absolutePath.startsWith(ATELIER_VAULT_ROOT)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  if (!fs.existsSync(absolutePath)) {
    return new NextResponse(`Atelier asset not found: ${fileName}`, { status: 404 });
  }

  const stat = fs.statSync(absolutePath);
  const fileBuffer = fs.readFileSync(absolutePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': stat.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Atelier-Vault': 'APPROVED_ATELIER_ASSETS',
    },
  });
}
