import { InvitationSocketType } from "@models/socketContextTypes";

export type ConvertedInvitation = {
    id: string;
    status: string;
    inviteduserName: string;
    invitingUserName: string;
    date?: string;
};

export const convertSocketInvitation = (socketData: InvitationSocketType[]): ConvertedInvitation[] => {
    
    return socketData.map((data) => ({
        id: data.data.invitationId,
        status: 'new',
        inviteduserName: data.data.invitedUser,
        invitingUserName: data.data.invitingUser,
        date: data.data.date ? data.data.date : undefined,
    }));
};