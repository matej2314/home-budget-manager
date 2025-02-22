export const getData = (isLoading, error, extraVal = true, data, defaultValue) => (!isLoading && !error && extraVal && data) || defaultValue;
