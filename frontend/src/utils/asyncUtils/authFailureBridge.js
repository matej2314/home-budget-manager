let unauthorizedHandler = null;
let forbiddenHandler = null;
let unauthorizedInFlight = false;

export const registerAuthFailureHandlers = ({ onUnauthorized, onForbidden }) => {
  unauthorizedHandler = onUnauthorized;
  forbiddenHandler = onForbidden;
};

export const notifyUnauthorized = (messageKey) => {
  // unikaj pętli 401 → logout → 401 na /auth/logout
  if (unauthorizedInFlight) return;
  unauthorizedInFlight = true;
  Promise.resolve(unauthorizedHandler?.(messageKey)).finally(() => {
    unauthorizedInFlight = false;
  });
};

export const notifyForbidden = (messageKey) => {
  forbiddenHandler?.(messageKey);
};
