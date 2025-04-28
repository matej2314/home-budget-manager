export type ApiResponse<T = {}> = {
    status: 'success' | 'error';
    message: string;
    [key: string]: string | undefined | T;
    data?: T;

};

export type CallbackOptions = {
    onSuccess?: <T>(response?: ApiResponse<T>) => void;
    onError?: <T>(response?: ApiResponse<T>) => void;
}