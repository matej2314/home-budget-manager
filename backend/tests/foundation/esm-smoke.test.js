import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

describe('backend ESM foundation', () => {
  test('logger exports default winston-like API', async () => {
    const { default: logger } = await import('../../configs/logger.js');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  test('setupRoutes is a default-exported function', async () => {
    const { default: setupRoutes } = await import('../../routes/index.js');
    expect(typeof setupRoutes).toBe('function');
  });

  test('package type is module', () => {
    const pkgPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.type).toBe('module');
  });
});
