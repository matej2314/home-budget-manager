type ResponseData = {
    status: 'error' | 'success';
    message: string;
};

type DataToSend<T> = {
    data: T;
};

const sendRequest = async <T, R>(method: string, data: DataToSend<T>, url: string): Promise<R> => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        const responseData: ResponseData & R = await response.json();

        if (responseData.status === 'error') {
            throw new Error(responseData.message || "Błąd wysyłania danych.");
        };

        return responseData as R;
    } catch (error) {
        throw new Error("Błąd wysyłania danych");
    };
};

export default sendRequest;