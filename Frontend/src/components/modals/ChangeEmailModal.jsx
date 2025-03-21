import { useState, useRef } from 'react';
import Modal from 'react-modal';
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showErrorToast, showInfoToast } from '../../configs/toastify';
import { useTranslation } from 'react-i18next';
import { isValidEmail, isNoXSS } from '../../utils/validation';
import { Icon } from '@iconify/react';
import LoadingModal from '../modals/LoadingModal';
import SubmitBtn from '../forms/internal/SubmitBtn';


export default function ChangeEmailModal({ isOpen, onRequestClose }) {
    const [sended, setSended] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            setSended(false);
            setIsLoading(true);
            const saveEmail = await sendRequest('POST', emailData, `${serverUrl}/users/changemail`);

            if (saveEmail.status === 'error') {
                showErrorToast(t(saveEmail.message, { defaultValue: "changeEmail.failedError" }));
            } else if (saveEmail.status === 'success') {
                showInfoToast(t(saveEmail.message, { defaultValue: "changeEmail.changedCorrectlyMessage" }));
                setTimeout(() => {
                    onRequestClose();
                }, 500);
            };

        } catch (error) {
            console.error(error);
        } finally {
            setSended(true);
            setIsLoading(false);
        };
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className='w-11/12 md:w-1/3 mt-[19rem] md:mt-[17rem] bg-slate-200 rounded-lg p-6 mx-auto shadow-lg border-4 border-slate-400'
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='w-full flex justify-end'>
                <button onClick={onRequestClose}
                    className='relative left-3 bottom-6 text-black hover:text-gray-600'
                >X</button>
            </div>
            <h2 className='w-full h-fit flex justify-center text-xl font-semibold'>{t("changeEmail.formHeading")}</h2>
            <div className='w-full flex justify-center'>
                <form
                    onSubmit={handleSaveNewEmail}
                    className='w-3/4 h-fit flex flex-col justify-start items-center gap-4 mt-5'
                >
                    <label htmlFor="newEmailAddr">{t("changeEmail.emailLabel")}</label>
                    <div className='relative w-full flex justify-center items-center'>
                        <input
                            type="email"
                            name="newEmailAddr"
                            id="newEmailAddr"
                            placeholder={t("changeEmail.emailPlaceholder")}
                            className='input-base'
                            ref={newEmailAddr}
                        />
                        <Icon
                            icon='entypo:email'
                            className="icon-base text-gray-500 text-xl text-opacity-30"
                        />
                    </div>
                    <SubmitBtn
                        className='form-submit-modal-btn'
                        disabled={sended}
                    >
                        {t("changeEmail.newEmailSubmitBtn")}
                    </SubmitBtn>
                </form>
                {isLoading && <LoadingModal isOpen={isLoading} />}
            </div>
        </Modal>
    )
}