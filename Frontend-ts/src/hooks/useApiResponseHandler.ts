export type ApiResponse<T = unknown> = {
    status: 'success' | 'error';
    message: string;
} & T;

export type CallbackOptions<T = unknown> = {
    onSuccess?: (response?: ApiResponse<T>) => void;
    onError?: (response?: ApiResponse<T>) => void;
};

export default function useApiResponseHandler<T = unknown>() {
    const handleApiResponse = async (
        response: ApiResponse<T>, 
        { onSuccess, onError }: CallbackOptions<T> = {}
    ): Promise<void> => {
        try {
            if (response.status === 'success') {
                onSuccess?.(response);
            } else if (response.status === 'error') {
                onError?.(response);
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    return handleApiResponse;
}
