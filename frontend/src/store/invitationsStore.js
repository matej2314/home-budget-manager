import { create } from "zustand";
import { apiBaseUrl } from "../url";
import fetchData from "../utils/asyncUtils/fetchData";
import { isHostRole } from "../utils/checkUserRole";


export const useInvitationsStore = create((set) => ({
    invitationsData: [],
    invitationsLoading: false,
    invitationsLoadingError: null,
    fetchedInvitations: false,

    fetchInvitations: async (user) => {
        // kontrakt API: GET /invitation/collection = host-only
        if (!isHostRole(user)) {
            set({
                invitationsData: [],
                invitationsLoading: false,
                invitationsLoadingError: null,
                fetchedInvitations: true,
            });
            return;
        }

        set({ invitationsLoading: true, invitationsLoadingError: null, fetchedInvitations: false });

        try {
            const invitations = await fetchData(`${apiBaseUrl}/invitation/collection`);
            set({ invitationsData: invitations.invitations });
        } catch (error) {
            set({ invitationsData: [], invitationsLoadingError: error, fetchedInvitations: false });
        } finally {
            set({ invitationsLoading: false, fetchedInvitations: true });
        }
    }
}));
