import { create } from "zustand";
import { serverUrl } from "../url";
import fetchData from "../utils/asyncUtils/fetchData";


export const useInvitationsStore = create((set) => ({
    invitationsData: [],
    invitationsLoading: false,
    invitationsLoadingError: null,
    fetchedInvitations: false,

    fetchInvitations: async () => {
        set({ invitationsLoading: true, invitationsLoadingError: null, fetchInvitations: false });

        try {
            const invitations = await fetchData(`${serverUrl}/invitation/collection`);
            set({ invitationsData: invitations.invitations });
        } catch (error) {
            set({ invitationsData: [], invitationsLoadingError: error, fetchedInvitations: false });
        } finally {
            set({ invitationsLoading: false, fetchedInvitations: true });
        }
    }
}));