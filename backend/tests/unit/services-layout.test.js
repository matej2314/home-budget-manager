import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const servicesRoot = path.join(__dirname, '../../services');

describe('Blok B services map', () => {
  test('required area folders exist', () => {
    const required = [
      'auth',
      'household',
      'invitations',
      'transactions',
      'categories',
      'budget',
      'board',
      'messages',
      'notifications',
      'users',
      'receipt',
      'shell',
    ];
    for (const name of required) {
      expect(fs.existsSync(path.join(servicesRoot, name))).toBe(true);
    }
    expect(fs.existsSync(path.join(servicesRoot, 'shell', 'homepage'))).toBe(true);
    expect(fs.existsSync(path.join(servicesRoot, 'board'))).toBe(true);
  });
});
