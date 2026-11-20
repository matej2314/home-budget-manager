import { describe, expect, test, jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import verifyRole from '../../middlewares/verifyRole.js';

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('verifyRole — R1 inmate / household (S-7, S-8)', () => {
  test('household: host → next()', () => {
    const mw = verifyRole('household');
    const req = { role: 'host' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('household: inmate → next()', () => {
    const mw = verifyRole('household');
    const req = { role: 'inmate' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('household: mate (legacy) → 403, bez next', () => {
    const mw = verifyRole('household');
    const req = { role: 'mate' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error' })
    );
  });

  test('household: user → 403 z kluczem authz.household.denied.user', () => {
    const mw = verifyRole('household');
    const req = { role: 'user' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'authz.household.denied.user',
    });
  });

  test('host: inmate → 403 authz.host.denied.inmate', () => {
    const mw = verifyRole('host');
    const req = { role: 'inmate' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'authz.host.denied.inmate',
    });
  });

  test('brak req.role → 403 authz.roleMissing', () => {
    const mw = verifyRole('household');
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'authz.roleMissing',
    });
  });
});
