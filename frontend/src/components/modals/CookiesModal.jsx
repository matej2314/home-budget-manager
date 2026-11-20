import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import { apiBaseUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import { useTranslation } from 'react-i18next';

export default function CookiesModal({ isOpen, onRequestClose }) {
    const { t } = useTranslation("modals");
    const handleApiResponse = useApiResponseHandler();

    const handleSaveCookieValue = async (value) => {

        if (value === undefined || value === null) {
            showErrorToast(t("cookies.valueError"));
            return;
        };

        const data = {
            cookieValue: value,
        };

        try {
            const saveValue = await sendRequest('POST', data, `${apiBaseUrl}/cookiestour/cookie_value`);

            handleApiResponse(saveValue, {
                onSuccess: () => {
                    showInfoToast(t("cookies.successMessage"));
                    setTimeout(onRequestClose, 500);
                },
                onError: () => {
                    showErrorToast(t("cookies.internalError"));
                }
            })
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Cookies"
            className="modal-panel max-w-md"
        >
            <ModalHeader title="Cookies" onClose={onRequestClose} />
            <p className="text-sm text-ink leading-relaxed">{t("cookies.cookieTxt")}</p>
            <div className="modal-actions-center">
                <button
                    className="form-submit-modal-btn"
                    type="button"
                    onClick={() => handleSaveCookieValue(1)}
                >
                    {t("cookies.allBtn")}
                </button>
                <button
                    className="modal-btn-secondary"
                    type="button"
                    onClick={() => handleSaveCookieValue(0)}
                >
                    {t("cookies.mandatoryBtn")}
                </button>
            </div>
        </AppModal>
    )
}
