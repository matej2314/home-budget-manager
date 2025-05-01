import { useState, useRef, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import Modal from 'react-modal';
import { serverUrl } from '@configs/url';
import sendRequest from '@utils/asyncUtils/sendRequest';
import { showErrorToast, showInfoToast } from '@configs/toastify';
import { useTranslation } from 'react-i18next';
import { isValidEmail} from '@utils/validation';
import { Icon } from '@iconify/react';
import LoadingModal from './LoadingModal';
import SubmitBtn from '@components/forms/internal/SubmitBtn';
import { BaseApiResponse } from '@utils/asyncUtils/fetchData';
import { type BasicModalProps } from '@models/componentsTypes/modalsTypes';

interface EmailDataPayload {
    newEmail: string;
};

const changeMailRequest = async (emailData: EmailDataPayload) => {
return await sendRequest<EmailDataPayload, BaseApiResponse>('POST', emailData, `${serverUrl}/users/changemail`);
}

export default function ChangeEmailModal({ isOpen, onRequestClose }: BasicModalProps) {
    const [sended, setSended] = useState<boolean>(false);
    const { t } = useTranslation("modals");
    const newEmailAddr = useRef<HTMLInputElement>(null);

    const { mutate: saveMail, isPending } = useMutation({
        mutationFn: changeMailRequest,
        onMutate: () => {
            setSended(false);
        },
        onSuccess: (response: BaseApiResponse) => {
            if(response.status === 'success') {
                showInfoToast(t(response.message, { defaultValue: "changeEmail.changedCorrectlyMessage" }));
                setTimeout(onRequestClose, 500);
            } else if (response.status === 'error') {
                showErrorToast(t(response.message, { defaultValue: "changeEmail.failedError" }));
        };
        },
        onError: (error: Error | string) => {
            showErrorToast(t("changeEmail.failedError"));
            console.error(error);
        },
        onSettled: () => {
            setSended(true);
        },
    })

    const handleSaveNewEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newAddress = newEmailAddr.current?.value;

        const validNewEmail = newAddress && isValidEmail(newAddress) ? newAddress : null;

        if (!validNewEmail) {
            showErrorToast(t("changeEmail.emailInputError"));
        };

        const emailData: EmailDataPayload = {
            newEmail: newEmailAddr.current?.value as string,
        };

        await saveMail(emailData);
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
                        disabled={sended || isPending}
                    >
                        {t("changeEmail.newEmailSubmitBtn")}
                    </SubmitBtn>
                </form>
                {isPending && <LoadingModal isOpen={isPending} />}
            </div>
        </Modal>
    )
}