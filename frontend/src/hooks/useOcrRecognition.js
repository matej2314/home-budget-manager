import { useState } from "react";
import useApiResponseHandler from '../hooks/useApiResponseHandler';
import { serverUrl } from "../url";
import { showErrorToast } from "../configs/toastify";
import { useTranslation } from "react-i18next";


export default function useOcrRecognition() {
    const [loadingImage, setLoadingImage] = useState(false);
    const [recognizedValue, setRecognizedValue] = useState('');
    const handleApiResponse = useApiResponseHandler();
    const { t: tForms } = useTranslation('forms');

    const recognizeValueFromFile = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('receipt', file);

        try {
            setLoadingImage(true);
            const response = await fetch(`${serverUrl}/receipt`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();

            handleApiResponse(result, {
                onSuccess: () => {
                    setRecognizedValue(result.value.replace(',', '.'));
                },
                onError: () => {
                    showErrorToast(tForms(result.message, { defaultValue: tForms("addTransaction.recognizeInternalError") }));
                }
            });
        } catch (error) {
            console.error('OCR ERROR:', error);
            showErrorToast(tForms("addTransaction.recognizeInternalError"));
        } finally {
            setLoadingImage(false);
        }
    };

    return {
        recognizeValueFromFile,
        loadingImage,
        recognizedValue,
        setRecognizedValue
    };
};