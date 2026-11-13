import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function resolveAvatarPath(userId) {
  const avatarDir = path.join(__dirname, '../../public/user-photos');
  const avatarExtensions = ['.jpg', '.jpeg', '.png'];
  for (const ext of avatarExtensions) {
    const filePath = `${avatarDir}/${userId}/${userId}${ext}`;
    try {
      await fs.access(filePath);
      return { avatarPath: filePath, defaultPath: null };
    } catch {
      continue;
    }
  }
  return { avatarPath: null, defaultPath: path.join(avatarDir, 'default.jpg') };
}
