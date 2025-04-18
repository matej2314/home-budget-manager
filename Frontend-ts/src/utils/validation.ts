export const isValidPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*!#^%$@?_+\[\]='"|,.<>?])[a-zA-Z\d*!#^%$@?_+\[\]='"|,.<>?]{10,30}$/;
    return regex.test(password);
};

export const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const isValidUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9]{5,20}$/;
    return regex.test(username);
};

export const isValidNumber = (value: unknown): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
};