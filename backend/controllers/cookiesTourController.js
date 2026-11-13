import { runController } from '../utils/http/runController.js';
import { AppError } from '../utils/errors/AppError.js';
import { setAcceptCookies } from '../services/shell/cookiesTour/setAcceptCookiesValue.js';
import { setCompleteTour } from '../services/shell/cookiesTour/setCompleteTourValue.js';

export async function setCookieValue(req, res) {
  const userId = req.userId;
  const cookieValue = req.body.cookieValue;
  return runController(res, async () => {
    if (!cookieValue) {
      throw new AppError({
        code: 'SHELL_CT_INPUT',
        messageKey: 'cookies.valueError',
        httpStatus: 400,
      });
    }
    return setAcceptCookies(cookieValue, userId);
  });
}

export async function setTourValue(req, res) {
  return runController(res, () => setCompleteTour(req.userId));
}
