import { useState, useRef } from 'react';
import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import { apiBaseUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showErrorToast, showInfoToast } from '../../configs/toastify';
import { useTranslation } from 'react-i18next';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import { isValidEmail, isNoXSS } from '../../utils/validation';
import { Icon } from '@iconify/react';
import LoadingModal from '../modals/LoadingModal';
import SubmitBtn from '../forms/internal/SubmitBtn';

export default function ChangeEmailModal({ isOpen, onRequestClose }) {
    const [requestState, setRequestState] = useState({
        sended: false,
        isLoading: false,
    });
    const handleApiResponse = useApiResponseHandler();
    const { t } = useTranslation("modals");
    const newEmailAddr = useRef();

    const handleSaveNewEmail = async (e) => {
        e.preventDefault();

        const newAddress = newEmailAddr.current.value;

        const validNewEmail = newAddress && isValidEmail(newAddress) && !isNoXSS(newAddress)

        if (!validNewEmail) {
            showErrorToast(t("changeEmail.emailInputError"));
        };

        const emailData = {
            newEmail: newEmailAddr.current.value,
        };

        try {
            setRequestState({ sended: false, isLoading: true });
            const saveEmail = await sendRequest('POST', emailData, `${apiBaseUrl}/users/changemail`);

            handleApiResponse(saveEmail, {
                onSuccess: () => {
                    showInfoToast(t(saveEmail.message, { defaultValue: "changeEmail.changedCorrectlyMessage" }));
                    setTimeout(onRequestClose, 500);
                },
                onError: () => {
                    showErrorToast(t(saveEmail.message, { defaultValue: "changeEmail.failedError" }));
                }
            })

        } catch (error) {
            console.error(error);
        } finally {
            setRequestState({ sended: true, isLoading: false });
        };
    };

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={t("changeEmail.formHeading")}
            className="modal-panel max-w-md"
        >
            <ModalHeader title={t("changeEmail.formHeading")} onClose={onRequestClose} />
            <form
                onSubmit={handleSaveNewEmail}
                className="w-full flex flex-col gap-4"
            >
                <label htmlFor="newEmailAddr" className="text-sm font-medium text-ink">{t("changeEmail.emailLabel")}</label>
                <div className="relative w-full">
                    <input
                        type="email"
                        name="newEmailAddr"
                        id="newEmailAddr"
                        placeholder={t("changeEmail.emailPlaceholder")}
                        className="input-base pr-9"
                        ref={newEmailAddr}
                    />
                    <Icon
                        icon='entypo:email'
                        className="icon-base top-2.5 text-muted text-lg"
                    />
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={onRequestClose} className="modal-btn-secondary">
                        {t("cancel")}
                    </button>
                    <SubmitBtn
                        className='form-submit-modal-btn'
                        disabled={requestState.sended}
                    >
                        {t("changeEmail.newEmailSubmitBtn")}
                    </SubmitBtn>
                </div>
            </form>
            {requestState.isLoading && <LoadingModal isOpen={requestState.isLoading} />}
        </AppModal>
    )
}
