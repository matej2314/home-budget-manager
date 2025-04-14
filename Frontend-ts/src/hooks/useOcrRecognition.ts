import { useState } from "react";
import useApiResponseHandler from "./useApiResponseHandler";
import { serverUrl } from "url";
import { showErrorToast } from "@configs/toastify";
import { useTranslation } from 'react-i18next';

export default function useOcrRecognition() {
    const [loadingImage, setLoadingImage] = useState<boolean>(false);
    const [recognizedValue, setRecognizedValue] = useState<number>();
    const handleApiResponse = useApiResponseHandler();
    const { t: tForms } = useTranslation("forms");

    const recognizeValueFromFile = async (file: File) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('receipt', file);

        try {
            setLoadingImage(true);
        } catch (error) {

        }
    }
}