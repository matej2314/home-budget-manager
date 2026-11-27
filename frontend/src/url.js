/** Publiczny origin API/socket — build-time z VITE_BACKEND_ORIGIN (F-14 / docs/katalog_env). */
const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN;

if (typeof backendOrigin !== 'string' || backendOrigin.length === 0) {
  throw new Error(
    'Missing VITE_BACKEND_ORIGIN. Set it in frontend/.env (local) or pass --build-arg VITE_BACKEND_ORIGIN from Vault/Jenkins (deploy).',
  );
}

export const serverUrl = backendOrigin;
export const socketPath = backendOrigin;

/** Prefiks normy docs / SPEC-KOMUNIKACJA K-1 — jedyny base dla JSON/multipart API SPA. */
export const apiBaseUrl = `${serverUrl}/api/v1`;
