export const getLocalStorage = (key: string) => {
    return localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string) => {
    return localStorage.setItem(key, value);
};

export const getSessionStorage = (key: string) => {
    return sessionStorage.getItem(key);
};

export const setSessionStorage = (key: string, value: string) => {
    return sessionStorage.setItem(key, value);
};
