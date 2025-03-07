export const getLocalStorage = (key) => {
    return localStorage.getItem(key);
};

export const setLocalStorage = (key, value) => {
    return localStorage.setItem(key, value);
};

export const getSessionStorage = (key) => {
    return sessionStorage.getItem(key);
};

export const setSessionStorage = (key, value) => {
    return sessionStorage.setItem(key, value);
};

