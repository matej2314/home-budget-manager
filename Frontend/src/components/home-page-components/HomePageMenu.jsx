import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/authContext';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import useModal from '../../hooks/useModal';
import { useIsMobile } from '../../hooks/useIsMobile';
import AuthModal from '../modals/AuthModal';
import LanguageSelector from '../LanguageSelector';
import { loggingOut } from '../../utils/handleLogOut';
import LogoOutModal from '../modals/LogOutModal';
import { showInfoToast } from '../../configs/toastify';
import OpenMenuButton from '../dashboard/dashboard-internal-components/OpenMenuButton';

Modal.setAppElement('#root');

export default function HomePageMenu() {
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });
    const { user, isLoading, isAuthenticated, logout } = useContext(AuthContext);
    const [isOpened, setIsOpened] = useState(false);
    const navigate = useNavigate();
    const { isMobile, isTablet } = useIsMobile();

    const menuVariants = {
        mobile: {
            initial: { opacity: 0, x: '-100%' },
            animate: { opacity: 1, x: isOpened ? -11 : '-100%' },
            transition: { type: 'tween', stiffness: 250, damping: 100, duration: 0.6, delay: 0.5 },
        },
        desktop: {
            initial: { opacity: 1, x: 0 },
            animate: { opacity: 1, x: 0 },
            transition: { type: 'tween', duration: 0.3 },
        }
    };


    const handleLogOut = async () => {
        await loggingOut(logout, navigate);
        closeModal();
        window.location.reload();
    };

    const handleToggleMenu = () => {
        setIsOpened(prevState => !prevState);
    };

    const handleDashboardRedirect = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            showInfoToast('Aby przejść dalej musisz się zalogować!');
        };
    };

    return (
        <>
            {<motion.div
                id="mainMenu"
                className="absolute w-full h-fit flex rounded-md z-10 mb-4"
                variants={isTablet || isMobile ? menuVariants.mobile : menuVariants.desktop}
                initial='initial'
                animate='animate'
            >
                <ul className={`w-full h-fit flex justify-center gap-2 items-center ml-2 py-1 text-slate-200 text-[0.7rem] sm:text-[1rem] sm:gap-8 indirect:gap-2.5 indirectxl:text-[1.05rem] md:gap-0 indirect:text-[0.85rem]  md:text-sm md:justify-around lg:text-lg px-2 transition-all duration-300`}>
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
                    <li className='h-full w-fit flex items-center gap-2 md:gap-3'>
                        <span className={`${isMobile && !isOpened ? 'hidden' : 'block'}`}>
                            < LanguageSelector isHomepage={true} />
                        </span>
                        {!isLoading && isAuthenticated && user && !isMobile && (
                            <p className=' h-full flex md:justify-center items-center'>
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
            </motion.div>}
            {(isTablet || isMobile) && <OpenMenuButton isOpened={isOpened} actionCallback={handleToggleMenu} home={true} />}
        </>
    )
}
