import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  sanitizeAndCheckTraversal,
  verifyContainedPath,
  validateRemoteAssetUrl,
  verifyTextureRequest,
  verifyAtelierRequest,
  verifyCollectionRequest,
} from '../src/lib/security/assetPathSecurity.mjs';

const TEXTURES_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/04_TEXTURES');
const COLLECTION_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/07_COLLECTION');
const ATELIER_ROOT = path.resolve(process.cwd(), 'VYSHUUU-SOURCE-VAULT/08_ATELIER');

describe('ASSET PATH SECURITY TEST SUITE', () => {
  // Temporary symlink & sibling-dir sandbox for rigorous verification
  const tempSandboxDir = path.resolve(process.cwd(), 'scratch/security_test_sandbox');
  const tempTargetDir = path.join(tempSandboxDir, 'root_vault');
  const tempSiblingDir = path.join(tempSandboxDir, 'root_vault_sibling');
  const outsideSecretFile = path.join(tempSandboxDir, 'secret_passwords.txt');
  const symlinkEscapePath = path.join(tempTargetDir, 'symlink_escape.png');

  before(() => {
    fs.mkdirSync(tempTargetDir, { recursive: true });
    fs.mkdirSync(tempSiblingDir, { recursive: true });
    fs.writeFileSync(outsideSecretFile, 'CONFIDENTIAL_DATA', 'utf8');
    fs.writeFileSync(path.join(tempSiblingDir, 'sibling_secret.txt'), 'SIBLING_DATA', 'utf8');
    fs.writeFileSync(path.join(tempTargetDir, 'legitimate_asset.png'), 'VALID_ASSET', 'utf8');

    // Attempt to create symlink escape if filesystem allows
    try {
      if (fs.existsSync(symlinkEscapePath)) fs.unlinkSync(symlinkEscapePath);
      fs.symlinkSync(outsideSecretFile, symlinkEscapePath);
    } catch {
      // If filesystem forbids symlinks (e.g. fat32), handled gracefully
    }
  });

  after(() => {
    try {
      if (fs.existsSync(tempSandboxDir)) {
        fs.rmSync(tempSandboxDir, { recursive: true, force: true });
      }
    } catch {
      // cleanup best effort
    }
  });

  describe('1. Path Traversal & Injection Sanitization', () => {
    test('Rejects direct parent traversal (..)', () => {
      const inputs = ['../secret', '../../etc/passwd', 'folder/../../../root', '..', '../'];
      for (const input of inputs) {
        const result = sanitizeAndCheckTraversal(input);
        assert.equal(result.isSafe, false, `Expected traversal rejection for: ${input}`);
      }
    });

    test('Rejects encoded traversal (%2e, %2f, %5c)', () => {
      const inputs = [
        '%2e%2e%2fetc/passwd',
        'folder/%2e%2e/file.png',
        '%2e%2e%5cwindows',
        '..%2ffile.png',
        '%2e%2e/file.png',
        '%252e%252e%252fdouble',
        '%252froot',
      ];
      for (const input of inputs) {
        const result = sanitizeAndCheckTraversal(input);
        assert.equal(result.isSafe, false, `Expected encoded traversal rejection for: ${input}`);
      }
    });

    test('Rejects null bytes (\\0, %00)', () => {
      const inputs = ['file.png\0.jpg', 'textures/%00secret', 'test\0'];
      for (const input of inputs) {
        const result = sanitizeAndCheckTraversal(input);
        assert.equal(result.isSafe, false, `Expected null byte rejection for: ${input}`);
      }
    });

    test('Rejects backslashes and Windows path indicators', () => {
      const inputs = ['folder\\file.png', 'C:\\Windows\\system32', '\\\\unc\\share\\file'];
      for (const input of inputs) {
        const result = sanitizeAndCheckTraversal(input);
        assert.equal(result.isSafe, false, `Expected backslash rejection for: ${input}`);
      }
    });

    test('Rejects absolute paths with leading slash', () => {
      const inputs = ['/etc/shadow', '/var/log/syslog', '/VYSHUUU-SOURCE-VAULT'];
      for (const input of inputs) {
        const result = sanitizeAndCheckTraversal(input);
        assert.equal(result.isSafe, false, `Expected absolute path rejection for: ${input}`);
      }
    });

    test('Accepts valid safe relative paths', () => {
      const inputs = [
        'base-color',
        '01_BASE_COLOR/VYSHUUU-TEX-01-base-color.png',
        'vysh-arc-01/hero',
        'vysh-atl-01',
      ];
      for (const input of inputs) {
        const result = sanitizeAndCheckTraversal(input);
        assert.equal(result.isSafe, true, `Expected valid path for: ${input}`);
      }
    });
  });

  describe('2. Canonical Realpath Containment & Sibling Prefix Defense', () => {
    test('Rejects sibling-prefix directory escape (e.g. root: vault, target: vault_sibling)', () => {
      // Trying to access vault_sibling by crafting relative path to sibling
      const relToSibling = '../root_vault_sibling/sibling_secret.txt';
      const containment = verifyContainedPath(tempTargetDir, relToSibling);
      assert.equal(containment.isContained, false);
    });

    test('Rejects symlink escapes pointing outside root', () => {
      if (fs.existsSync(symlinkEscapePath)) {
        const containment = verifyContainedPath(tempTargetDir, 'symlink_escape.png');
        assert.equal(
          containment.isContained,
          false,
          'Symlink resolving outside root must be rejected'
        );
      }
    });

    test('Allows valid contained file in root', () => {
      const containment = verifyContainedPath(tempTargetDir, 'legitimate_asset.png');
      assert.equal(containment.isContained, true);
      assert.ok(containment.resolvedPath);
    });
  });

  describe('3. Production Texture Route Validation (Trusted Manifest Allowlist)', () => {
    test('Allows all 9 valid production texture shortcuts', () => {
      const shortcuts = [
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

      for (const shortcut of shortcuts) {
        const res = verifyTextureRequest(shortcut, TEXTURES_ROOT);
        assert.equal(res.isValid, true, `Texture shortcut failed: ${shortcut}`);
        assert.ok(res.canonicalPath);
        assert.equal(fs.existsSync(res.canonicalPath), true);
        assert.equal(res.asset?.mimeType, 'image/png');
        assert.equal(res.asset?.width, 1997);
        assert.equal(res.asset?.height, 787);
      }
    });

    test('Rejects unlisted texture files (even if existing in repo)', () => {
      const unlisted = [
        'package.mjson',
        '../../package.mjson',
        'random-nonexistent-texture',
        '01_BASE_COLOR/unapproved.png',
      ];

      for (const item of unlisted) {
        const res = verifyTextureRequest(item, TEXTURES_ROOT);
        assert.equal(res.isValid, false, `Expected rejection for unlisted: ${item}`);
      }
    });

    test('Handles case differences appropriately', () => {
      const upper = verifyTextureRequest('BASE-COLOR', TEXTURES_ROOT);
      assert.equal(upper.isValid, true, 'Case difference should normalize to canonical key');
    });
  });

  describe('4. Production Atelier Route Validation', () => {
    test('Allows all 5 approved atelier plates', () => {
      const slugs = ['vysh-atl-01', 'vysh-atl-02', 'vysh-atl-03', 'vysh-atl-04', 'vysh-atl-05'];

      for (const slug of slugs) {
        const res = verifyAtelierRequest(slug, ATELIER_ROOT);
        assert.equal(res.isValid, true, `Atelier slug failed: ${slug}`);
        assert.ok(res.canonicalPath);
        assert.equal(fs.existsSync(res.canonicalPath), true);
        assert.equal(res.asset?.mimeType, 'image/jpeg');
      }
    });

    test('Rejects unknown atelier slugs', () => {
      const unknownSlugs = ['vysh-atl-06', 'fake-slug', '../08_ATELIER/file'];
      for (const slug of unknownSlugs) {
        const res = verifyAtelierRequest(slug, ATELIER_ROOT);
        assert.equal(res.isValid, false);
      }
    });
  });

  describe('5. Production Collection Route Validation', () => {
    test('Allows verified saree assets across all 10 collection sarees', () => {
      const validPairs = [
        ['vysh-arc-01', 'hero'],
        ['vysh-arc-01', 'pallu'],
        ['vysh-chd-01', 'macro'],
        ['vysh-kjv-01', 'border'],
        ['vysh-bnr-01', 'flat'],
        ['vysh-pth-01', 'pleat'],
        ['vysh-jmd-01', 'fold'],
        ['vysh-kta-01', 'editorial'],
        ['vysh-tsr-01', 'hero'],
        ['vysh-ctr-01', 'macro'],
        ['vysh-kjv-02', 'edge'],
      ];

      for (const [saree, type] of validPairs) {
        const res = verifyCollectionRequest(saree, type, COLLECTION_ROOT);
        assert.equal(res.isValid, true, `Collection asset failed: ${saree}/${type}`);
        assert.ok(res.canonicalPath);
        assert.equal(fs.existsSync(res.canonicalPath), true);
        assert.equal(res.asset?.mimeType, 'image/png');
      }
    });

    test('Rejects unlisted asset types or unlisted saree IDs', () => {
      const invalidPairs = [
        ['vysh-arc-01', 'nonexistent_type'],
        ['fake-saree-99', 'hero'],
        ['vysh-arc-01', '../../package.mjson'],
      ];

      for (const [saree, type] of invalidPairs) {
        const res = verifyCollectionRequest(saree, type, COLLECTION_ROOT);
        assert.equal(res.isValid, false);
      }
    });
  });

  describe('6. SSRF & Remote URL Protection', () => {
    test('Allows trusted Cloudinary HTTPS URLs', () => {
      const goodUrl =
        'https://res.cloudinary.com/xjdxk6mg/image/upload/v1791545963/vyshuuu/textures/border-mask.png';
      const res = validateRemoteAssetUrl(goodUrl);
      assert.equal(res.isAllowed, true);
    });

    test('Rejects insecure HTTP protocol', () => {
      const httpUrl = 'http://res.cloudinary.com/xjdxk6mg/image/upload/sample.png';
      const res = validateRemoteAssetUrl(httpUrl);
      assert.equal(res.isAllowed, false);
      assert.match(res.reason ?? '', /Insecure protocol/i);
    });

    test('Rejects untrusted domains', () => {
      const badDomains = [
        'https://evil-server.com/malware.png',
        'https://cloudinary.com.attacker.com/image.png',
        'https://subdomain.res.cloudinary.com/image.png',
      ];
      for (const url of badDomains) {
        const res = validateRemoteAssetUrl(url);
        assert.equal(res.isAllowed, false, `Expected rejection for untrusted host: ${url}`);
      }
    });

    test('Rejects internal networks, localhost, and cloud metadata (SSRF defense)', () => {
      const ssrfUrls = [
        'https://localhost/admin',
        'https://127.0.0.1/etc/passwd',
        'https://169.254.169.254/latest/meta-data',
        'https://10.0.0.1/internal-api',
        'https://192.168.1.1/router',
        'https://172.16.0.1/private',
      ];
      for (const url of ssrfUrls) {
        const res = validateRemoteAssetUrl(url);
        assert.equal(res.isAllowed, false, `Expected SSRF rejection for: ${url}`);
      }
    });

    test('Rejects non-standard ports', () => {
      const badPortUrl = 'https://res.cloudinary.com:8443/image.png';
      const res = validateRemoteAssetUrl(badPortUrl);
      assert.equal(res.isAllowed, false);
      assert.match(res.reason ?? '', /Non-standard port/i);
    });
  });
});
