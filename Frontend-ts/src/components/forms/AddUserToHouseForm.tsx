import { FormEvent, useRef, useState } from "react";
import { serverUrl } from "url";
import { useMutation } from "@tanstack/react-query";
import sendRequest from '@utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from "@configs/toastify";
import { isValidUsername } from "@utils/validation";
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import LoadingModal from '@components/modals/LoadingModal';
import SubmitBtn from "./internal/SubmitBtn";
import { BaseApiResponse } from "@utils/asyncUtils/fetchData";
import { type AddUserToHouseFormProps, InviteStatusType, AddUserPayload } from "@models/componentsTypes/AddUserToHouseFormTypes";

const addUserRequest = async (userName: string) => {
    const data: AddUserPayload = { userName };
    return await sendRequest<AddUserPayload, BaseApiResponse>('POST', data, `${serverUrl}/users/invite`);
};

export default function AddUserToHouseForm({ onClose }: AddUserToHouseFormProps) {
    const { t } = useTranslation("forms");
    const invitedUser = useRef<HTMLInputElement>(null);

    const [inviteStatus, setInviteStatus] = useState<InviteStatusType>({
        sended: false,
        isLoading: false,
    });

    const mutation = useMutation({
        mutationFn: addUserRequest,
        onMutate: () => {
            setInviteStatus({ sended: false, isLoading: true });
        },
        onSuccess: (data: BaseApiResponse) => {
            if (data.status === 'success') {
                showInfoToast(t(data.message));
                invitedUser.current!.value = '';
                setTimeout(onClose, 500);
            } else {
                showErrorToast(t(data.message));
            }
        },
        onError: () => {
            showErrorToast(t("addUserToHouse.error"));
        },
        onSettled: () => {
            setInviteStatus({ sended: true, isLoading: false });
        },
    });

    const handleAddUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const invitedUserName = invitedUser.current?.value;

        if (!isValidUsername(invitedUserName as string)) {
            showErrorToast(t("addUserToHouse.invalidInputError"));
            return;
        }

        mutation.mutate(invitedUserName as string);
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
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            const icon = input.nextSibling as HTMLElement;
                            icon.style.display = input.value ? 'none' : 'block';
                        }}
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="icon-base top-0.5 text-gray-500 text-xl text-opacity-55"
                    />
                </div>
                <SubmitBtn
                    className='form-submit-modal-btn'
                    disabled={mutation.isPending || inviteStatus.sended}
                >
                    {t("addUserToHouse.inviteUserSubmitBtn")}
                </SubmitBtn>
            </form>
            {mutation.isPending && <LoadingModal isOpen={mutation.isPending} />}
        </div>
    );
}
