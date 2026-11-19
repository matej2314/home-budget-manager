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

/**
 * Resolver UI do czasu ns `api`: spróbuj t(key); jeśli brak — surowy message (docs i18n fallback).
 */
export const resolveApiMessage = (t, messageKey, defaultValue) => {
  if (!messageKey) return defaultValue ?? '';
  return t(messageKey, { defaultValue: defaultValue ?? messageKey });
};
