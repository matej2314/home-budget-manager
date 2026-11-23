/**
 * Norma K-2 / docs: { status: 'success'|'error', message: <messageKey>, … }.
 * message = kandydat na klucz i18n; pełne ns `api` = major Faza 6.
 */
export const parseApiEnvelope = (body) => {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 'error', messageKey: null, data: null };
  }
  const status = body.status;
  const messageKey = typeof body.message === 'string' ? body.message : null;
  const { status: _s, message: _m, ...data } = body;
  return {
    ok: status === 'success',
    status,
    messageKey,
    data,
  };
};

import i18n from '../../configs/i18n';

/**
 * Konwencja v1 (zatwierdzona): zawsze ns `api`.
 * Prefiks `api:` w kluczu z BE jest obcinany. Brak klucza → surowy string (docs i18n fallback).
 */
export const resolveApiMessage = (messageKey, defaultValue) => {
  if (!messageKey) return defaultValue ?? '';
  const key = messageKey.startsWith('api:') ? messageKey.slice(4) : messageKey;
  if (i18n.exists(key, { ns: 'api' })) {
    return i18n.t(key, { ns: 'api' });
  }
  return defaultValue ?? messageKey;
};
