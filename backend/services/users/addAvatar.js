import { AppError } from '../../utils/errors/AppError.js';

export async function addAvatar(file) {
  if (!file) {
    throw new AppError({
      code: 'AVATAR_NO_FILE',
      messageKey: 'Upload the correct file.',
      httpStatus: 400,
    });
  }
  return {
    messageKey: 'Avatar saved correctly.',
    avatarName: file.filename,
  };
}
