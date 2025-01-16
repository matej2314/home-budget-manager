const sendRequest = async (method, data, url) => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        const responseData = await response.json();

        if (responseData.status === 'error') {
            throw new Error(responseData.message || 'Błąd wysyłania danych.');
        };
        
        return responseData;
    } catch (error) {
        throw new Error(error.message || 'Błąd wysyłania danych.');
    };
};

export default sendRequest;