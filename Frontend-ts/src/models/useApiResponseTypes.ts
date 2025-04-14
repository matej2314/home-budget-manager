export type ApiResponse = {
    status: 'success' | 'error';
    message: string;
    [key: string]: string;
};

export type CallbackOptions = {
    onSuccess?: (response?: ApiResponse) => void;
    onError?: (response?: ApiResponse) => void;
}