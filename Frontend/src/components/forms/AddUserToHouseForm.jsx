import { useRef, useState } from "react";
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from "../../configs/toastify";
import { Icon } from '@iconify/react';
import LoadingModal from '../modals/LoadingModal';

export default function AddUserToHouseForm({ onClose }) {
    const [sended, setSended] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const invitedUser = useRef();

    const handleAddUser = async (e) => {
        e.preventDefault();

        const data = { userName: invitedUser.current.value };

        try {
            setSended(false);
            setIsLoading(true)
            const inviteUser = await sendRequest('POST', data, `${serverUrl}/users/invite`)

            if (inviteUser.status === 'success') {
                showInfoToast(inviteUser.message);
                inviteUser.current.value = '';
                setTimeout(() => {
                    onClose();
                }, 500);
            } else if (inviteUser.status === 'error') {
                showErrorToast(inviteUser.message);
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
                    Type invited user name:
                </label>
                <div className="relative w-fit">
                    <input
                        className="input-base flex items-center"
                        type="text"
                        name="invitedUserName"
                        id="invitedUserName"
                        ref={invitedUser}
                        placeholder="username"
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="icon-base text-gray-500 text-xl text-opacity-55"
                    />
                </div>

                <button
                    type="submit"
                    className="form-submit-modal-btn"
                    disabled={sended}
                >
                    Invite
                </button>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </div>
    )

}