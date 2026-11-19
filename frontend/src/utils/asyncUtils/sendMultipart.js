import { notifyUnauthorized, notifyForbidden } from './authFailureBridge';

/**
 * Multipart POST/PUT bez ręcznego Content-Type (boundary ustawia przeglądarka).
 * credentials: include — cookie SESSID.
 */
const sendMultipart = async (method, formData, url) => {
  const response = await fetch(url, {
    method,
    body: formData,
    credentials: 'include',
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.status === 401) {
    notifyUnauthorized(body?.message);
    throw new Error(body?.message || 'Unauthorized');
  }
  if (response.status === 403) {
    notifyForbidden(body?.message);
    throw new Error(body?.message || 'Forbidden');
  }

  if (body?.status === 'error') {
    throw new Error(body.message || 'API error');
  }

  if (!response.ok) {
    throw new Error(body?.message || `HTTP ${response.status}`);
  }

  return body;
};

export default sendMultipart;
