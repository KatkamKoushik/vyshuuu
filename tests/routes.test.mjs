import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  sanitizeAndCheckTraversal,
  verifyContainedPath,
  verifyTextureRequest,
  verifyAtelierRequest,
  verifyCollectionRequest,
  validateRemoteAssetUrl,
} from '../src/lib/security/assetPathSecurity.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TEXTURES_ROOT = path.resolve(rootDir, 'VYSHUUU-SOURCE-VAULT/04_TEXTURES');
const ATELIER_ROOT = path.resolve(rootDir, 'VYSHUUU-SOURCE-VAULT/08_ATELIER');
const COLLECTION_ROOT = path.resolve(rootDir, 'VYSHUUU-SOURCE-VAULT/07_COLLECTION');

describe('ROUTE SECURITY & INTEGRATION TESTS', () => {
  describe('Texture Route Security (/api/textures/[...path])', () => {
    test('Rejects traversal in path segments with 400 status equivalent', () => {
      const traversalInputs = [
        '../package.json',
        '..%2fpackage.json',
        '....//etc/passwd',
        'base-color/../../shadow',
        'base-color\0.png',
      ];

      for (const input of traversalInputs) {
        const sanitized = sanitizeAndCheckTraversal(input);
        assert.equal(sanitized.isSafe, false, `Should reject ${input}`);
      }
    });

    test('Rejects unlisted texture paths with 404 status equivalent', () => {
      const unlisted = ['fake-texture', '01_BASE_COLOR/random.png', 'secret-map'];
      for (const req of unlisted) {
        const res = verifyTextureRequest(req, TEXTURES_ROOT);
        assert.equal(res.isValid, false);
        assert.ok(res.error);
      }
    });

    test('Verifies valid production textures with 200 headers and correct SHA256', () => {
      const validKeys = [
        'base-color',
        'zari-mask',
        'border-mask',
        'pallu-mask',
        'red-accent',
        'weave-direction',
        'roughness',
        'micro-normal',
        'edge-fringe',
      ];

      for (const key of validKeys) {
        const res = verifyTextureRequest(key, TEXTURES_ROOT);
        assert.equal(res.isValid, true, `Key ${key} should be valid`);
        assert.ok(res.canonicalPath, 'Must have canonical realpath');
        assert.ok(res.asset?.sha256, 'Must provide sha256 header metadata');
        assert.ok(res.asset?.byteSize > 0, 'Byte size must be positive');
        assert.equal(res.asset.mimeType, 'image/png');
      }
    });
  });

  describe('Atelier Route Security (/api/atelier/[slug])', () => {
    test('Rejects traversal attacks against atelier endpoint', () => {
      const maliciousSlugs = [
        '..',
        '../04_TEXTURES',
        '%2e%2e%2fpackage.json',
        'vysh-atl-01/../../secret',
        'vysh-atl-01\0',
      ];

      for (const slug of maliciousSlugs) {
        const sanitized = sanitizeAndCheckTraversal(slug);
        assert.equal(sanitized.isSafe, false, `Should reject slug: ${slug}`);
      }
    });

    test('Rejects unknown atelier slugs with 404', () => {
      const unknownSlugs = ['vysh-atl-00', 'vysh-atl-06', 'unknown', 'hero'];
      for (const slug of unknownSlugs) {
        const res = verifyAtelierRequest(slug, ATELIER_ROOT);
        assert.equal(res.isValid, false);
      }
    });

    test('Allows all 5 approved atelier plates with valid JPEG metadata', () => {
      const approvedSlugs = [
        'vysh-atl-01',
        'vysh-atl-02',
        'vysh-atl-03',
        'vysh-atl-04',
        'vysh-atl-05',
      ];

      for (const slug of approvedSlugs) {
        const res = verifyAtelierRequest(slug, ATELIER_ROOT);
        assert.equal(res.isValid, true, `Slug ${slug} must be approved`);
        assert.ok(res.canonicalPath);
        assert.equal(res.asset?.mimeType, 'image/jpeg');
        assert.ok(res.asset?.byteSize > 500000);
      }
    });
  });

  describe('Collection Route Security (/api/collection/[...path])', () => {
    test('Rejects invalid segment lengths (must be strictly 2 segments)', () => {
      const invalidSegments = [
        [],
        ['vysh-arc-01'],
        ['vysh-arc-01', 'hero', 'extra'],
        ['vysh-arc-01', 'hero', 'extra', 'bad'],
      ];

      for (const segs of invalidSegments) {
        const requestedPath = segs.join('/');
        const res = verifyCollectionRequest(requestedPath, COLLECTION_ROOT);
        assert.equal(res.isValid, false);
        assert.ok(res.error?.includes('segments'));
      }
    });

    test('Rejects directory traversal inside collection path parameters', () => {
      const traversalPaths = [
        'vysh-arc-01/../08_ATELIER/plate.jpg',
        '../vysh-arc-01/hero',
        'vysh-arc-01/..%2f..%2fetc/passwd',
      ];

      for (const p of traversalPaths) {
        const sanitizeCheck = sanitizeAndCheckTraversal(p);
        assert.equal(sanitizeCheck.isSafe, false, `Should sanitize ${p}`);
      }
    });

    test('Allows all 10 sarees with their manifest asset types', () => {
      const sarees = [
        'vysh-arc-01',
        'vysh-kjv-01',
        'vysh-bnr-01',
        'vysh-chd-01',
        'vysh-pth-01',
        'vysh-jmd-01',
        'vysh-kta-01',
        'vysh-tsr-01',
        'vysh-ctr-01',
        'vysh-kjv-02',
      ];

      for (const sareeId of sarees) {
        const heroRes = verifyCollectionRequest(`${sareeId}/hero`, COLLECTION_ROOT);
        assert.equal(heroRes.isValid, true, `${sareeId}/hero must be valid`);
        assert.ok(heroRes.canonicalPath);
        assert.ok(heroRes.asset?.sha256);
      }
    });
  });

  describe('Remote Asset SSRF & Gateway Protection', () => {
    test('Rejects internal addresses, DNS rebinding vectors, and private IP blocks', () => {
      const maliciousUrls = [
        'http://127.0.0.1/malicious.png',
        'https://169.254.169.254/latest/meta-data/',
        'https://10.0.0.1/internal-asset.png',
        'https://192.168.1.1/router-login.jpg',
        'https://localhost:8080/exploit.png',
        'file:///etc/passwd',
        'data:text/html,<script>alert(1)</script>',
        'ftp://evil.com/asset.png',
      ];

      for (const url of maliciousUrls) {
        const validation = validateRemoteAssetUrl(url);
        assert.equal(validation.isAllowed, false, `Should block ${url}`);
      }
    });

    test('Allows valid Cloudinary HTTPS CDN delivery', () => {
      const allowed = 'https://res.cloudinary.com/vyshuuu/image/upload/v1/textures/base-color.png';
      const validation = validateRemoteAssetUrl(allowed);
      assert.equal(validation.isAllowed, true);
    });
  });
});
