type ResponseData<T> = {
    status: 'error' | 'success';
    message: string;
    data: T;
};

const fetchData = async <T>(url: string): Promise<T> => {
    try {
        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Błąd odpowiedzi HTTP: ${response.status}`);
        }

        const responseData: ResponseData<T> = await response.json();

        if (responseData.status === 'error') {
            throw new Error(responseData.message || "Błąd pobierania danych z API.");
        }

        return responseData.data;
    } catch (error) {
        throw new Error("Błąd pobierania danych.");
    }
};

export default fetchData;
