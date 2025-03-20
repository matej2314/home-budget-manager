export const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*!#^%$@?_+\[\]='"|,.<>?])[a-zA-Z\d*!#^%$@?_+\[\]='"|,.<>?]{10,30}$/;
    return regex.test(password);
};

export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const isValidUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{5,10}$/;
    return regex.test(username);
};

export const isNoSQL = (str) => {
    const sqlRegex = /(?:--|;|\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE|SHOW|GRANT|REVOKE)\b|\b(UNION|EXEC|TRUNCATE|SLEEP|BENCHMARK|OR)\b)/i;

    return !sqlRegex.test(str);
};

export const isNoXSS = (str) => {
    const xssRegex = /(<([^>]+)>|javascript:|<script|<\/script|on\w+=)/i;

    return !xssRegex.test(str);
};

export const isValidNumber = (value) => {
    const isNumber = !isNaN(value) && isFinite(value);

    const isFloatOrInt = /^-?\d+(\.\d+)?$/.test(value);

    return isNumber && isFloatOrInt;
};
