import { useRef, useState } from "react";
import sendRequest from '../../utils/sendRequest';
import { serverUrl } from '../../url';
import { showInfoToast, showErrorToast } from "../../configs/toastify";
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
                <input className="rounded-md" type="text" name="invitedUserName" id="invitedUserName" ref={invitedUser} />
                <button
                    type="submit"
                    className="bg-gray-300 p-2 rounded-xl hover:bg-slate-300 text-xl border-[1px] border-slate-500"
                    disabled={sended}
                >
                    Invite
                </button>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </div>
    )

}