import { describe, expect, test } from '@jest/globals';
import { nextBalance } from '../../database/transactions.js';

describe('nextBalance (T-1 saldo)', () => {
  test('expense odejmuje od currentBalance', () => {
    expect(nextBalance(1000, 500, 'expense', 100)).toBe(900);
  });

  test('income dodaje do currentBalance', () => {
    expect(nextBalance(1000, 500, 'income', 50)).toBe(1050);
  });

  test('gdy currentBalance null — fallback do initBudget', () => {
    expect(nextBalance(null, 800, 'expense', 50)).toBe(750);
  });

  test('gdy currentBalance i initBudget puste — start od 0', () => {
    expect(nextBalance(null, null, 'income', 10)).toBe(10);
  });

  test('nieznany type nie zmienia salda', () => {
    expect(nextBalance(1000, 500, 'transfer', 100)).toBe(1000);
  });

  test('ujemna kwota income zmniejsza saldo', () => {
    expect(nextBalance(1000, 500, 'income', -50)).toBe(950);
  });

  test('value nieparowalne → NaN (brak walidacji w regule)', () => {
    expect(Number.isNaN(nextBalance(1000, 500, 'expense', 'abc'))).toBe(true);
  });
});
