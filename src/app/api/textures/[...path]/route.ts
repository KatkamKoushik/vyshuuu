import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const TEXTURES_VAULT_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/04_TEXTURES');

const SHORTCUT_MAP: Record<string, string> = {
  'base-color': '01_BASE_COLOR/VYSHUUU-TEX-01-base-color.png',
  'zari-mask': '02_ZARI_MASK/VYSHUUU-TEX-02-zari-mask.png',
  'border-mask': '03_BORDER_MASK/VYSHUUU-TEX-03-border-mask.png',
  'pallu-mask': '04_PALLU_MASK/VYSHUUU-TEX-04-pallu-mask.png',
  'red-accent': '05_RED_ACCENT/VYSHUUU-TEX-05-red-accent.png',
  'weave-direction': '06_WEAVE_DIRECTION/VYSHUUU-TEX-06-weave-direction.png',
  'roughness': '07_ROUGHNESS/VYSHUUU-TEX-07-roughness.png',
  'micro-normal': '08_MICRO_NORMAL/VYSHUUU-TEX-08-micro-normal.png',
  'edge-fringe': '09_EDGE_FRINGE/VYSHUUU-TEX-09-edge-fringe.png',
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path: pathSegments } = await context.params;

  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse('Texture path required', { status: 400 });
  }

  const requestedPath = pathSegments.join('/');
  const relativeFilePath = SHORTCUT_MAP[requestedPath] || requestedPath;

  // Resolve absolute path and guard against directory traversal
  const absolutePath = path.resolve(TEXTURES_VAULT_ROOT, relativeFilePath);
  if (!absolutePath.startsWith(TEXTURES_VAULT_ROOT)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  if (!fs.existsSync(absolutePath)) {
    return new NextResponse(`Texture not found: ${requestedPath}`, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Texture-Vault': 'LOCKED_PRODUCTION_MAPS',
    },
  });
}
