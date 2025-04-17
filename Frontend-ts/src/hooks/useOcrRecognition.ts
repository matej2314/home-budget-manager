import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import useApiResponseHandler from "./useApiResponseHandler";
import { serverUrl } from "url";
import { showErrorToast } from "@configs/toastify";
import { useTranslation } from 'react-i18next';

export default function useOcrRecognition() {
    const [recognizedValue, setRecognizedValue] = useState<number>();
    const handleApiResponse = useApiResponseHandler();
    const { t: tForms } = useTranslation("forms");

    const mutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('receipt', file);

            const response = await fetch(`${serverUrl}/receipt`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();
            return result;
        },
        onSuccess: (result) => {
            handleApiResponse(result, {
                onSuccess: () => {
                    setRecognizedValue(result.value.replace(',', '.'));
                },
                onError: () => {
                    showErrorToast(
                        tForms(result.message, {
                            defaultValue: tForms("addTransaction.recognizeInternalError")
                        })
                    );
                }
            });
        },
        onError: (error) => {
            console.error('OCR ERROR', error);
            showErrorToast(tForms("addTransaction.recognizeInternalError"));
        }
    });

    return {
        recognizedValueFromFile: mutation.mutate,
        loadingImage: mutation.isPending,
        recognizedValue,
        setRecognizedValue
    };
};