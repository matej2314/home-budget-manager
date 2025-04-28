export interface AddUserToHouseFormProps {
    onClose: () => void;
};

export interface InviteStatusType {
    sended: boolean;
    isLoading: boolean;
};

export type AddUserPayload = {
    userName: string;
};