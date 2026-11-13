import { runController } from '../utils/http/runController.js';
import { saveImages } from '../services/shell/gallery/saveImages.js';

export async function saveImagesHandler(req, res) {
  return runController(res, () => saveImages(req.files));
}

export { saveImagesHandler as saveImages };
