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
    <main className="w-full min-h-screen min-w-[320px] flex flex-row items-stretch overflow-hidden bg-page">
      <DashBoardMenu />
      <div className="flex-1 min-w-0 h-screen overflow-y-auto no-scrollbar">
        <Outlet />
      </div>
      {isHost && modal && modal.type === 'invitation' ? (
        <InvitationModal isOpen={modal.isOpen} onRequestClose={closeModal} invitationsData={modal.data} />
      ) : null}
    </main>
  ) : null;
}
