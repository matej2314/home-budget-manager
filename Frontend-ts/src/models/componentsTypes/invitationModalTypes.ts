import { type BasicModalProps } from "./modalsTypes";
import { type Invitation } from "@models/invitationsStoreTypes";
import { type ConvertedInvitation } from "@utils/convertSocketInvitation";

export type InvitationModalProps = BasicModalProps & {
    invitationsData: (Invitation | ConvertedInvitation)[] | null;
};

type InvitationId = {
    invitationId: string;
};

export type InvitationData = InvitationId & {
    invitedUserId: string;
};

export type DeclineInvitationPayload = InvitationId;