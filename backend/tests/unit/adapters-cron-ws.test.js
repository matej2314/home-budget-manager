import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tasksRoot = path.join(__dirname, '../../tasks');

describe('Faza 6 — tasks jako adaptery (B-5)', () => {
  test('żaden task nie importuje database/db ani pool', () => {
    const files = fs.readdirSync(tasksRoot).filter((f) => f.endsWith('.js'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const src = fs.readFileSync(path.join(tasksRoot, file), 'utf8');
      expect(src).not.toMatch(/database\/db/);
      expect(src).not.toMatch(/\bpool\b/);
      expect(src).not.toMatch(/\.query\s*\(/);
      expect(src).toMatch(/services\//);
      expect(src).toMatch(/node-cron/);
    }
  });
});

describe('Faza 6 — cron schedule → service', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('balanceHouseActions woła balanceHouseholdsMonthly w callbacku cron', async () => {
    const balanceHouseholdsMonthly = jest.fn(async () => {});
    let scheduledFn = null;

    jest.unstable_mockModule('node-cron', () => ({
      default: {
        schedule: jest.fn((_expr, fn) => {
          scheduledFn = fn;
        }),
      },
    }));

    jest.unstable_mockModule(
      '../../services/budget/balanceHouseholdsMonthly.js',
      () => ({ balanceHouseholdsMonthly })
    );

    const { default: balanceHouseActions } = await import(
      '../../tasks/balanceHouseTransactions.js'
    );
    const cron = (await import('node-cron')).default;

    balanceHouseActions();

    expect(cron.schedule).toHaveBeenCalledWith('58 23 * * *', expect.any(Function));
    expect(scheduledFn).toEqual(expect.any(Function));
    await scheduledFn();
    expect(balanceHouseholdsMonthly).toHaveBeenCalledTimes(1);
  });
});

describe('Faza 6 — WS push skutkiem ubocznym (K-10, K-11, K-12)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('emitNotification zapisuje notice i emituje type notification przez broadcastToHousehold', async () => {
    const saveNotification = jest.fn(async () => ({ messageKey: 'ok' }));
    const broadcastToHousehold = jest.fn(async () => {});

    jest.unstable_mockModule(
      '../../services/notifications/saveNotification.js',
      () => ({ saveNotification })
    );
    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastToHousehold,
      broadcastMessage: jest.fn(),
      initializeWebSocket: jest.fn(),
    }));

    const { emitNotification } = await import(
      '../../services/notifications/emitNotification.js'
    );

    await emitNotification({
      id: 'n-1',
      category: 'monthlyBalance',
      houseId: 'h-1',
      message: 'notifications.neMonthlyBalance',
    });

    expect(saveNotification).toHaveBeenCalledWith(
      'n-1',
      'monthlyBalance',
      expect.stringContaining('monthlyBalance'),
      'h-1'
    );
    expect(broadcastToHousehold).toHaveBeenCalledWith('h-1', {
      type: 'notification',
      data: expect.objectContaining({
        id: 'n-1',
        category: 'monthlyBalance',
        message: 'notifications.neMonthlyBalance',
      }),
    });
  });
});
