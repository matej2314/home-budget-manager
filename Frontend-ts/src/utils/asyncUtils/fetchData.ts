export interface BaseApiResponse {
    status: 'error' | 'success';
    message: string;
};

const fetchData = async <T extends BaseApiResponse>(url: string): Promise<T> => {
    try {
        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Błąd odpowiedzi HTTP: ${response.status}`);
        }

        const responseData: T = await response.json();

        if (responseData.status === 'error') {
            throw new Error(responseData.message || "Błąd pobierania danych z API.");
        }

        return responseData;
    } catch (error) {
        throw new Error("Błąd pobierania danych.");
    }
};

export default fetchData;
