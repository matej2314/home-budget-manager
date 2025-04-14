import type { ApiResponse, CallbackOptions } from "@models/useApiResponseTypes";

export default function useApiResponseHandler() {
    const handleApiResponse = async (
        response: ApiResponse, { onSuccess, onError }: CallbackOptions = {}): Promise<void> => {
        try {
            if (response.status === 'success') {
                onSuccess?.(response);
            } else if (response.status === 'error') {
                onError?.(response);
            }
        } catch (error) {
            console.error(error);
        };
    };
    return handleApiResponse;
};
