import { useContext } from 'react';
import { AuthContext } from '../../store/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import useModal from '../../hooks/useModal';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import AuthModal from '../modals/AuthModal';
import LanguageSelector from '../LanguageSelector';
import { loggingOut } from '../../utils/handleLogOut';
import LogoOutModal from '../modals/LogOutModal';
import { showInfoToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';

Modal.setAppElement('#root');

export default function HomePageMenu() {
    const { isMobile, isTablet } = useIsMobile();
    const { user, isAuthenticated, isLoading, logout } = useContext(AuthContext);
    const { t } = useTranslation("homePage");
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });
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
            showInfoToast(t('dashboardRedirectInfo'));
        }
    };

    if (isLoading) {
        return <LoadingModal isOpen={isLoading} />
    }

    return (
        <>
            <motion.div
                id="mainMenu"
                className="absolute w-full h-fit items-center z-10"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 1, x: 0 }}
            >
                <ul className="w-full h-fit flex justify-around items-center py-1 text-slate-200 text-[0.6rem] sm:text-[0.95rem] sm:justify-around indirect:gap-3 indirectxl:text-[0.9rem] indirectxl:gap-4 indirect:text-[0.74rem] md:text-[0.9rem] lg:text-lg lg:justify-around xl:text-xl xl:gap-[3rem] transition-all duration-300">
                    <li className='text-nowrap'><Link to='/'>{t("homePageMenu.firstEl")}</Link></li>
                    {!isMobile && <li><Link to='/aboutus'>{t("homePageMenu.secondEl")}</Link></li>}
                    <li>
                        <button onClick={handleDashboardRedirect} type="button">Dashboard</button>
                    </li>
                    <li>
                        <button onClick={() => openModal('auth')} className='cursor-pointer'>
                            {t("homePageMenu.authBtn")}
                        </button>
                    </li>
                    <li><Link to='/contact'>{t("homePageMenu.contactBtn")}</Link></li>
                    <li className='h-full w-fit flex items-center gap-4 md:gap-3'>
                        <LanguageSelector isHomepage={true} />
                        {isAuthenticated && (
                            <span className='w-full flex flex-col xl:flex-row items-center gap-0.5 ml-0.5 xl:gap-3'>
                                <p>
                                    {user && user.userName}
                                </p>
                                <button type="button" className='w-fit h-fit' onClick={() => openModal('logout')}>
                                    <Icon icon='mdi:logout' width={!isMobile ? 20 : 17} height={!isMobile ? 20 : 17} />
                                </button>
                            </span>

                        )}
                    </li>
                </ul>
                {modal && modal.isOpen && modal.type === 'auth' && <AuthModal isOpen={modal.isOpen} onRequestClose={closeModal} />}
                {modal && modal.isOpen && modal.type === 'logout' && (
                    <LogoOutModal isOpen={modal.isOpen} onRequestClose={closeModal} handleLogOut={handleLogOut} />
                )}
            </motion.div>
        </>
    );
}
