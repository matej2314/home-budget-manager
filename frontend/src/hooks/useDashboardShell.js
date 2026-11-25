import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/authContext';
import { useSocket } from '../store/socketContext';
import { useInvitationsStore } from '../store/invitationsStore';
import { inmateOrHostRole, isHostRole, isUserRole } from '../utils/checkUserRole';
import useModal from './useModal';
import { showMessageToast } from '../configs/toastify';

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
  const isInmateOrHost = inmateOrHostRole(user);
  const isUser = isUserRole(user);
  const isHost = isHostRole(user);

  const pendingInvitations = useMemo(() => {
    const rows = Array.isArray(invitationsData) ? invitationsData : [];
    return rows.filter((invitation) => invitation.status === 'new');
  }, [invitationsData]);

  useEffect(() => {
    if (connected && liveMessages?.length > 0) {
      showMessageToast(t('notifications.newMessageNotice'));
    }

    if (!loginStatus.isLoading && isAuthenticated && isUser) {
      navigate('/userDashboard');
    }

    if (
      isHost &&
      !invitationsLoading &&
      !invitationsLoadingError &&
      !fetchedInvitations &&
      pendingInvitations.length === 0
    ) {
      fetchInvitations(user);
    }

    if (pendingInvitations.length > 0) {
      openModal('invitation');
    }
  }, [
    liveMessages,
    connected,
    loginStatus,
    isAuthenticated,
    isUser,
    isHost,
    user,
    fetchedInvitations,
    invitationsLoading,
    invitationsLoadingError,
    pendingInvitations,
    fetchInvitations,
    navigate,
    openModal,
    t,
  ]);

  return {
    loginStatus,
    isInmateOrHost,
    isHost,
    modal,
    closeModal,
  };
}
