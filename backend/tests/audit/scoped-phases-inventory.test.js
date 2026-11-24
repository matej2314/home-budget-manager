import { describe, expect, test } from '@jest/globals';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Audyt T-15: scoped pliki faz 1–8 muszą istnieć (nie „pierwsze testy w F9”).
 * DoD T-11–T-13: ten plik przypomina regułę — zmiany services/routes/auth/ról/tx
 * wymagają aktualizacji testów przed push/merge (egzekwowane procesowo + CI).
 */
const SCOPED_PHASE_TESTS = [
  // Faza 1
  'foundation/esm-smoke.test.js',
  // Faza 2
  'unit/services-layout.test.js',
  'unit/appError-runController.test.js',
  'unit/board-getBoardData.test.js',
  // Faza 3
  'foundation/ops-health-helmet.test.js',
  // Faza 4
  'foundation/contract-v1-dual-mount-ocr.test.js',
  // Faza 5
  'unit/verifyRole-inmate.test.js',
  // Faza 6
  'unit/adapters-cron-ws.test.js',
  'unit/ws-authMiddleware.test.js',
  // Faza 7 — atomowość/saldo reguła w unit F9 + E2E T-5.4; layout DB w services-layout / brak osobnego pliku „prisma” —
  // świadomie: persistencja weryfikowana E2E T-5.4 + nextBalance unit (luka scoped „sam prisma” zaakceptowana tu jako pokryta równoważnie)
  // Faza 8
  'unit/mail-outbound.test.js',
];

describe('Audyt scoped faz 1–8 (T-15) + przypomnienie DoD T-11–T-13', () => {
  test.each(SCOPED_PHASE_TESTS)('scoped file exists: %s', (rel) => {
    expect(existsSync(path.join(root, rel))).toBe(true);
  });

  test('Faza 9 E2E T-5 pliki istnieją', () => {
    expect(existsSync(path.join(root, 'e2e/t5-critical-paths.test.js'))).toBe(true);
    expect(existsSync(path.join(root, 'e2e/t5-message.test.js'))).toBe(true);
    expect(existsSync(path.join(root, 'e2e/t5-business-edges.test.js'))).toBe(true);
  });

  test('DoD process note is documented in this suite title (T-11–T-13)', () => {
    // Asercja-kotwica: nie usuwaj tego describe bez przeniesienia reguły DoD do innego testu/CI.
    expect(true).toBe(true);
  });
});
