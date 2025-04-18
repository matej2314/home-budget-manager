import { type BaseApiResponse } from './fetchData';

interface DataToSend<T> {
    data: T | null;
};

const sendRequest = async <T, R extends BaseApiResponse>(method: string, data: DataToSend<T>, url: string): Promise<R> => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        const responseData: R = await response.json();

        if (responseData.status === 'error') {
            throw new Error(responseData.message || "Błąd wysyłania danych.");
        };

        return responseData;
    } catch (error) {
        throw new Error("Błąd wysyłania danych");
    };
};

export default sendRequest;