import DashBoardMenu from '../components/dashboard/dashboardComponents/DashBoardMenu';
import { InvitationModal } from '../components/modals/invitationModal';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useDashboardShell from '../hooks/useDashboardShell';
import { Outlet } from 'react-router-dom';
import LoadingModal from '../components/modals/LoadingModal';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { loginStatus, isMateOrHost, isHost, modal, closeModal } = useDashboardShell();

  if (loginStatus.isLoading) return <LoadingModal isOpen={loginStatus.isLoading} />;

  return isMateOrHost ? (
    <main className="w-full h-full flex flex-row justify-around items-stretch overflow-y-hidden bg-slate-200">
      <DashBoardMenu />
      <Outlet />
      {isHost && modal && modal.type === 'invitation' ? (
        <InvitationModal isOpen={modal.isOpen} onRequestClose={closeModal} invitationsData={modal.data} />
      ) : null}
    </main>
  ) : null;
}
