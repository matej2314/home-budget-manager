import { useRef, useState } from "react";
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from "../../configs/toastify";
import { isValidUsername, isNoSQL } from "../../utils/validation";
import { useTranslation } from 'react-i18next';
import useApiResponseHandler from "../../hooks/useApiResponseHandler";
import { Icon } from '@iconify/react';
import LoadingModal from '../modals/LoadingModal';
import SubmitBtn from "./internal/SubmitBtn";

export default function AddUserToHouseForm({ onClose }) {
    const [inviteStatus, setInviteStatus] = useState({
        sended: false,
        isLoading: false,
    })
    const handleApiResponse = useApiResponseHandler();
    const { t } = useTranslation("forms");
    const invitedUser = useRef();

    const handleAddUser = async (e) => {
        e.preventDefault();
        const invitedUserName = invitedUser.current.value;

        if (!isValidUsername(invitedUserName) || !isNoSQL(invitedUserName)) {
            showErrorToast(t("addUserToHouse.invalidInputError"));
            return;
        }

        const data = { userName: invitedUserName };

        try {
            setInviteStatus({ sended: false, isLoading: true });
            const inviteUser = await sendRequest('POST', data, `${serverUrl}/users/invite`)

            handleApiResponse(inviteUser, {
                onSuccess: () => {
                    showInfoToast(t(inviteUser.message));
                    invitedUser.current.value = '';
                    setTimeout(onClose, 500);
                },
                onError: () => {
                    showErrorToast(t(inviteUser.message));
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            setInviteStatus({ sended: true, isLoading: false });
        };

    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <form onSubmit={handleAddUser} className="w-full h-fit flex flex-col justify-start items-center gap-5">
                <label
                    className="w-full h-fit flex justify-center"
                    htmlFor="invitedUserName"
                >
                    {t("addUserToHouse.invitedUsernameLabel")}
                </label>
                <div className="relative w-fit">
                    <input
                        className="input-base flex items-center"
                        type="text"
                        name="invitedUserName"
                        id="invitedUserName"
                        ref={invitedUser}
                        placeholder={t("addUserToHouse.invitedUsernameInputPlaceholder")}
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="icon-base top-0.5 text-gray-500 text-xl text-opacity-55"
                    />
                </div>
                <SubmitBtn
                    className='form-submit-modal-btn'
                    disabled={inviteStatus.sended}
                >
                    {t("addUserToHouse.inviteUserSubmitBtn")}
                </SubmitBtn>
            </form>
            {inviteStatus.isLoading && <LoadingModal isOpen={inviteStatus.isLoading} />}
        </div>
    )

}