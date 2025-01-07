import { useMutation, useQueryClient } from '@tanstack/react-query';

const useSendRequest = (url, method = 'POST', options = {}) => {
    const queryClient = useQueryClient();

    const mutateData = async (data) => {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ERROR: ${response.status} - ${errorText}`);
        }

        return await response.json();
    };

    return useMutation(mutateData, {
        ...options,
        onSuccess: (data, variables, context) => {

            queryClient.invalidateQueries();


            if (options.onSuccess) {
                options.onSuccess(data, variables, context);
            }
        },
    });
};

export default useSendRequest;
