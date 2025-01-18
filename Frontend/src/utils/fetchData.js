const fetchData = async (url) => {
    try {
        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Błąd odpowiedzi HTTP: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.status === 'error') {
            throw new Error(responseData.message || 'Błąd pobierania danych z API.');
        }

        return responseData; 
    } catch (error) {
        throw new Error(error.message || 'Błąd pobierania danych.');
    }
};

export default fetchData;
