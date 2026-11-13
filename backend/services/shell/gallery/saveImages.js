import { AppError } from '../../../utils/errors/AppError.js';

export async function saveImages(files) {
  if (!files || files.length === 0) {
    throw new AppError({
      code: 'GALLERY_NO_FILES',
      messageKey: 'Invalid input data. Files not found.',
      httpStatus: 400,
    });
  }
  const uploadedFiles = files.map((file) => ({
    fileName: file.filename,
    path: file.path,
  }));
  return {
    messageKey: 'Files saved correctly.',
    files: uploadedFiles,
  };
}
