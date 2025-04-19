import { type BaseApiResponse } from './fetchData';

const sendRequest = async <T, R extends BaseApiResponse>(method: string, data: T, url: string, dataFieldName?: string): Promise<R> => {
    try {
        const payload = dataFieldName ? { [dataFieldName]: data } : data;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            credentials: 'include',
        });
        const responseData: R = await response.json();

        if (responseData.status === 'error') {
            throw new Error(responseData.message || "Błąd wysyłania danych.");
        };

        return responseData;
    } catch (error: unknown) {
        const err = error as Error;
        console.error(err.message);
        throw new Error("Błąd wysyłania danych");
    };
};

export default sendRequest;