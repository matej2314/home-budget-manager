/**
 * Katalog serwer → klient (docs/dokumentacja_komunikacji.md, SPEC-KOMUNIKACJA K-10).
 * Klient v1 nie definiuje osobnego katalogu emitów biznesowych (K-12).
 */
export const SERVER_SOCKET_EVENTS = Object.freeze([
  'connect_success',
  'notification',
  'newMessage',
  'invitation',
  'initial_budget',
  'balance_update',
  'error',
]);

export const isServerSocketEvent = (type) => SERVER_SOCKET_EVENTS.includes(type);
