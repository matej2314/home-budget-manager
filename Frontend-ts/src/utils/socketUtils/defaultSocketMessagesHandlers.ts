import { type SetConnectedType, SetErrorType } from "@models/socketContextTypes";

export const handleSetConnected = (value: boolean, setConnected: SetConnectedType) => {
    setConnected(value);
};

export const handleSocketError = (error: unknown, setError: SetErrorType) => {
    const message = error instanceof Error ? error.message : String(error);
    setError(message);
};