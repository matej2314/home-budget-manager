import { notifyUnauthorized, notifyForbidden } from './authFailureBridge';

const sendRequest = async (method, data, url) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(data),
      credentials: 'include',
    });

    let responseData = null;
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (response.status === 401) {
      notifyUnauthorized(responseData?.message);
      throw new Error(responseData?.message || 'Unauthorized');
    }
    if (response.status === 403) {
      notifyForbidden(responseData?.message);
      throw new Error(responseData?.message || 'Forbidden');
    }

    if (responseData?.status === 'error') {
      throw new Error(responseData.message || 'Błąd wysyłania danych.');
    }

    if (!response.ok) {
      throw new Error(responseData?.message || `HTTP ${response.status}`);
    }

    return responseData;
  } catch (error) {
    throw new Error(error.message || 'Błąd wysyłania danych.');
  }
};

export default sendRequest;
