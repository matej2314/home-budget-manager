import { create } from 'zustand';
import { serverUrl } from '@configs/url';
import fetchData from '@utils/asyncUtils/fetchData';
import { type InvitationsApiResponse, InvitationsStore } from '@models/invitationsStoreTypes';

export const useInvitationsStore = create<InvitationsStore>((set) => ({
    invitationsData: [],
    invitationsLoading: false,
    invitationsLoadingError: '',
    fetchedInvitations: false,

    fetchInvitations: async () => {
        set({ invitationsLoading: true, invitationsLoadingError: '', fetchedInvitations: false });

        try {
            const invitations = await fetchData<InvitationsApiResponse>(`${serverUrl}/invitation/collection`);
            set({ invitationsData: invitations.invitations });
        } catch (error: unknown) {
            const err = error as Error;
            set({ invitationsData: [], invitationsLoadingError: err.message, fetchedInvitations: false });
        } finally {
            set({ invitationsLoading: false, fetchedInvitations: true });
        }
    }
}));