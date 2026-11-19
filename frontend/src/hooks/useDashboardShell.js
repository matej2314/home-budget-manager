import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/authContext';
import { useSocket } from '../store/socketContext';
import { useInvitationsStore } from '../store/invitationsStore';
import { mateOrHostRole, isHostRole, isUserRole } from '../utils/checkUserRole';
import useModal from './useModal';
import { showMessageToast } from '../configs/toastify';

/**
 * Orkiestracja shelledu dashboardu: sesja, zaproszenia, toast nowych wiadomości.
 * Reguły uprawnień egzekwuje API — tu tylko odzwierciedlenie roli w UX.
 */
export default function useDashboardShell() {
  const navigate = useNavigate();
  const { loginStatus, isAuthenticated, user } = useAuth();
  const { connected, messages } = useSocket();
  const {
    invitationsData,
    invitationsLoading,
    invitationsLoadingError,
    fetchInvitations,
    fetchedInvitations,
  } = useInvitationsStore();
  const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null, data: null });
  const { t } = useTranslation('common');

  const liveMessages = connected && messages?.newMessages;
  const invitationsMessages = connected && messages?.invitations;
  const isMateOrHost = mateOrHostRole(user);
  const isUser = isUserRole(user);
  const isHost = isHostRole(user);

  const allInvitations = useMemo(() => {
    const dbInvitations =
      (!invitationsLoading && !invitationsLoadingError && invitationsData) || [];
    return [
      ...(Array.isArray(dbInvitations) ? dbInvitations : []),
      ...(Array.isArray(invitationsMessages) ? invitationsMessages : []),
    ];
  }, [
    invitationsLoading,
    invitationsLoadingError,
    invitationsData,
    invitationsMessages,
  ]);

  useEffect(() => {
    if (connected && liveMessages?.length > 0) {
      showMessageToast(t('notifications.newMessageNotice'));
    }

    if (!loginStatus.isLoading && isAuthenticated && isUser) {
      navigate('/userDashboard');
    }

    if (!invitationsLoading && !invitationsLoadingError && !fetchedInvitations && allInvitations.length === 0) {
      fetchInvitations();
    }

    if (allInvitations.length > 0) {
      openModal('invitation', allInvitations);
    }
  }, [
    liveMessages,
    connected,
    loginStatus,
    isAuthenticated,
    isUser,
    fetchedInvitations,
    invitationsLoading,
    invitationsLoadingError,
    allInvitations,
    fetchInvitations,
    navigate,
    openModal,
    t,
  ]);

  return {
    loginStatus,
    isMateOrHost,
    isHost,
    modal,
    closeModal,
  };
}
