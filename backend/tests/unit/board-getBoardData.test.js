import { describe, expect, test, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
  default: async () => null,
}));

jest.unstable_mockModule('../../database/db.js', () => ({
  default: {
    getConnection: async () => ({
      beginTransaction: async () => {},
      rollback: async () => {},
      release: () => {},
      query: async () => [[]],
    }),
  },
}));

const { getBoardData } = await import('../../services/board/getBoardData.js');
const { AppError } = await import('../../utils/errors/AppError.js');

describe('getBoardData service', () => {
  test('throws AppError 404 when user has no household', async () => {
    await expect(getBoardData('user-1')).rejects.toMatchObject({
      httpStatus: 404,
      messageKey: `No user's household.`,
    });
    await expect(getBoardData('user-1')).rejects.toBeInstanceOf(AppError);
  });
});
