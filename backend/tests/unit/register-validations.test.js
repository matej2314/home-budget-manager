import { describe, expect, test } from '@jest/globals';
import { registerValidations } from '../../utils/validation.js';

describe('registerValidations (auth edges)', () => {
  const okPass = 'Aa1!bbbbbb';

  test('username < 5 → fail', () => {
    const v = registerValidations('ab12', 'a@b.co', okPass, 'user');
    expect(v[0].isValid).toBe(false);
  });

  test('username ze spacją → fail', () => {
    const v = registerValidations('ab cd1', 'a@b.co', okPass, 'user');
    expect(v[0].isValid).toBe(false);
  });

  test('hasło bez znaku specjalnego → fail', () => {
    const v = registerValidations('alice', 'a@b.co', 'Aa1bbbbbbb', 'user');
    expect(v[2].isValid).toBe(false);
  });

  test('hasło < 10 → fail', () => {
    const v = registerValidations('alice', 'a@b.co', 'Aa1!bb', 'user');
    expect(v[2].isValid).toBe(false);
  });

  test('rola spoza allowed → fail', () => {
    const v = registerValidations('alice', 'a@b.co', okPass, 'host');
    expect(v[3].isValid).toBe(false);
  });

  test('happy path user → wszystkie valid', () => {
    const v = registerValidations('alice', 'a@b.co', okPass, 'user');
    expect(v.every((x) => x.isValid)).toBe(true);
  });
});
