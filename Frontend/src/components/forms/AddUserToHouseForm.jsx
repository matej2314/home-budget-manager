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
                        className="w-full pl-2 rounded-md border-2 border-slate-300 flex items-center"
                        type="text"
                        name="invitedUserName"
                        id="invitedUserName"
                        ref={invitedUser}
                        placeholder="username"
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="absolute inset-y-1 right-1 text-gray-500 text-xl pointer-events-none text-opacity-55"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-gray-300 p-2 rounded-xl hover:bg-slate-400 hover:text-slate-50 text-xl border-2 border-slate-500/45"
                    disabled={sended}
                >
                    Invite
                </button>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </div>
    )

}