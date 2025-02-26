import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { Icon } from '@iconify/react';
import Modal from 'react-modal';
import useModal from '../../hooks/useModal';
import Authorization from './Authorization';
import LanguageSelector from '../dashboard/dashboard-internal-components/LanguageSelector';
import { loggingOut } from '../../utils/handleLogOut';
import LogoOutModal from '../modals/LogOutModal';
import { showInfoToast } from '../../configs/toastify';

Modal.setAppElement('#root');

export default function HomePageMenu() {
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });
    const [mode, setMode] = useState(null);
    const { user, isLoading, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    };

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
        <div id="mainMenu" className="w-[98vw] h-fit flex border-2 border-y-slate-300 rounded-md shadow-sm shadow-slate-400">
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
                    {/* <LanguageSelector /> */}
                    {!isLoading && isAuthenticated && user && <p className=' h-full flex justify-center items-center'>User: {user.userName}</p>}
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
            {modal.isOpen && modal.type === 'auth' && (
                <Modal
                    isOpen={modal.isOpen}
                    onRequestClose={closeModal}
                    className='bg-white rounded-lg p-6 w-1/3 mx-auto mt-4 shadow-lg border-4 border-slate-400'
                    overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
                >
                    {mode ? (
                        <>
                            <button onClick={closeModal} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>X</button>
                            <Authorization mode={mode} />
                        </>
                    ) : (
                        <div className='text-center'>
                            <h2 className='text-xl font-bold mb-4'>Choose option</h2>
                            <div className='flex justify-around'>
                                <button
                                    onClick={() => handleModeChange('login')}
                                    className='px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleModeChange('register')}
                                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
                                >
                                    SignUp
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            )}
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
