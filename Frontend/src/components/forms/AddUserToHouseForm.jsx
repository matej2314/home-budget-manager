import { useRef, useState } from "react";
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from "../../configs/toastify";
import { isValidUsername, isNoSQL } from "../../utils/validation";
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import LoadingModal from '../modals/LoadingModal';
import SubmitBtn from "./internal/SubmitBtn";

export default function AddUserToHouseForm({ onClose }) {
    const [sended, setSended] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            setSended(false);
            setIsLoading(true)
            const inviteUser = await sendRequest('POST', data, `${serverUrl}/users/invite`)

            if (inviteUser.status === 'success') {
                showInfoToast(t(inviteUser.message, { defaulValue: "addUserToHouse.inviteSuccessMessage" }));
                inviteUser.current.value = '';
                setTimeout(() => {
                    onClose();
                }, 500);
            } else if (inviteUser.status === 'error') {
                showErrorToast(t(inviteUser.message, { defaultValue: "addUserToHouse.inviteUserInternalError" }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSended(true);
            setIsLoading(false);
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
                    disabled={sended}
                >
                    {t("addUserToHouse.inviteUserSubmitBtn")}
                </SubmitBtn>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </div>
    )

}