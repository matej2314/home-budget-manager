import { BaseApiResponse } from "@utils/asyncUtils/fetchData";

type Invitation = {
    id: string;
    status: string;
    hostId: string;
    invitedUser: string;
    invitingUser: string;
    date: string;
    invitingUserName: string;
    inviteduserName: string;
};

type Invitations = Invitation[] | [];


export type InvitationsApiResponse = BaseApiResponse & {
    invitations: Invitations;
};




export type InvitationsStore = {
    invitationsData: Invitations;
    invitationsLoading: boolean;
    invitationsLoadingError: string;
    fetchedInvitations: boolean;
    fetchInvitations: () => Promise<void>;
}