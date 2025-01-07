import { useQuery, useQueryClient } from '@tanstack/react-query';

const useFetchData = (key, url, options = {}, queryParams = {}, useCache = true) => {
    const queryClient = useQueryClient();

    const fetchData = async () => {
        try {
            const queryString = new URLSearchParams(queryParams).toString();
            const fullUrl = queryString ? `${url}?${queryString}` : url;

            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    if (!useCache) {
        return {
            data: null,
            isLoading: false,
            refetch: fetchData,
            error: null,
        };
    }

    return useQuery([key, queryParams], fetchData, options);
};

export default useFetchData;
