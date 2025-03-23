export default function useApiResponseHandler() {

    const handleApiResponse = async (response, { onSuccess, onError } = {}) => {
        try {
            if (response.status === 'success') {
                onSuccess();
            } else if (response.status === 'error') {
                onError();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return handleApiResponse;
};

