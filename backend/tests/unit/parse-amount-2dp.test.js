import { describe, expect, test } from '@jest/globals';
import { parseAmount2dp } from '../../utils/validation.js';
import { nextBalance } from '../../database/transactions.js';

describe('parseAmount2dp (D-11b)', () => {
  test('akceptuje int i 1–2 dp', () => {
    expect(parseAmount2dp(10)).toBe(10);
    expect(parseAmount2dp('10.5')).toBe(10.5);
    expect(parseAmount2dp('10.55')).toBe(10.55);
  });

  test('odrzuca >2 dp, nie-liczbę, pusty', () => {
    expect(parseAmount2dp('10.555')).toBeNull();
    expect(parseAmount2dp('abc')).toBeNull();
    expect(parseAmount2dp('')).toBeNull();
    expect(parseAmount2dp(null)).toBeNull();
  });

  test('nextBalance używa round 2 dp', () => {
    expect(nextBalance(1000, 500, 'expense', '10.55')).toBe(989.45);
  });
});
