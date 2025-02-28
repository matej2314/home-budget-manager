import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { Icon } from '@iconify/react';
import Modal from 'react-modal';
import useModal from '../../hooks/useModal';
import AuthModal from '../modals/AuthModal';
import LanguageSelector from '../dashboard/dashboard-internal-components/LanguageSelector';
import { loggingOut } from '../../utils/handleLogOut';
import LogoOutModal from '../modals/LogOutModal';
import { showInfoToast } from '../../configs/toastify';

Modal.setAppElement('#root');

export default function HomePageMenu() {
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });
    const { user, isLoading, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await loggingOut(logout, navigate);
        closeModal();
        window.location.reload();
    };

    const handleDashboardRedirect = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            showInfoToast('Aby przejść dalej musisz się zalogować!');
        };
    };

    return (
        <div id="mainMenu" className="w-full h-fit flex rounded-md">
            <img className="h-full max-w-[2rem] max-h-[2rem] flex mt-2 ml-1 opacity-60 rounded-full" src="../../public/budgetapp-600-logo.webp" alt="" />
            <ul className="w-full h-fit flex justify-between items-center py-1 text-slate-800 text-md px-2">
                <li><Link to='/'>Home Page</Link></li>
                <li><Link to='/aboutus'>About us</Link></li>
                <li>
                    <button
                        onClick={handleDashboardRedirect}
                        type="button"
                    >
                        Dashboard
                    </button>
                </li>
                <li >
                    <button
                        onClick={() => openModal('auth')}
                        className='cursor-pointer'
                    >
                        SignUp/Login
                    </button>
                </li>
                <li><Link to='/contact'>Contact</Link></li>
                <li className='h-full w-fit flex items-center gap-3'>
                    <LanguageSelector />
                    {!isLoading && isAuthenticated && user && (
                        <p className=' h-full flex justify-center items-center'>
                            User: {user.userName}
                        </p>
                    )
                    }
                    {isAuthenticated &&
                        <button
                            type="button"
                            className='w-fit h-fit'
                            onClick={() => openModal('logout')}
                        >
                            <Icon icon='mdi:logout' width={20} height={20} />
                        </button>}
                </li>
            </ul>
            {modal.isOpen && modal.type === 'auth' && <AuthModal isOpen={modal.isOpen} onRequestClose={closeModal} />}
            {modal.isOpen && modal.type === 'logout' && (
                <LogoOutModal
                    isOpen={modal.isOpen}
                    onRequestClose={closeModal}
                    handleLogOut={handleLogOut}
                />
            )}
        </div>
    )
}
