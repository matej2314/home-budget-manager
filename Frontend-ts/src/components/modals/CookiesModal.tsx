import Modal from 'react-modal';
import { serverUrl } from '../../configs/url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { useTranslation } from 'react-i18next';
import { BaseApiResponse } from '@utils/asyncUtils/fetchData';
import { type BasicModalProps } from '@models/componentsTypes/modalsTypes';

Modal.setAppElement('#root');

interface CookieDataPayload {
    cookieValue: number;
};

export default function CookiesModal({ isOpen, onRequestClose }: BasicModalProps) {
    const { t } = useTranslation("modals");
    
    const handleSaveCookieValue = async (value: number) => {

        if (value === undefined || value === null) {
            showErrorToast(t("cookies.valueError"));
            return;
        };

        const data: CookieDataPayload = {
            cookieValue: value,
        };

        try {
            const saveValue = await sendRequest<CookieDataPayload,BaseApiResponse>('POST', data, `${serverUrl}/cookiestour/cookie_value`);

           if(saveValue.status === 'success') {
                    showInfoToast(t("cookies.successMessage"));
                    setTimeout(onRequestClose, 500);
                }else {
                    showErrorToast(t("cookies.internalError"));
            };
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="w-11/12 xl:w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-y-1/2 mx-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='w-full h-fit flex flex-col items-center gap-4'>
                <p>{t("cookies.cookieTxt")}</p>
                <div className='w-full h-fit flex justify-center gap-3'>
                    <button
                        className="form-submit-modal-btn"
                        type="button"
                        onClick={() => handleSaveCookieValue(1)}
                    >
                        {t("cookies.allBtn")}
                    </button>
                    <button
                        className="form-submit-modal-btn"
                        type="button"
                        onClick={() => handleSaveCookieValue(0)}
                    >
                        {t("cookies.mandatoryBtn")}
                    </button>
                </div>
            </div>
        </Modal>
    )
}