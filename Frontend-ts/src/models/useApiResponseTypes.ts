export type ApiResponse = {
    status: 'success' | 'error';
    message: string;
    [key: string]: string | undefined;
};

export type CallbackOptions = {
    onSuccess?: (response?: ApiResponse) => void;
    onError?: (response?: ApiResponse) => void;
}