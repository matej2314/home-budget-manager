import { useState } from 'react';
import { useAuth } from '../../store/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import useModal from '../../hooks/useModal';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import AuthModal from '../modals/AuthModal';
import LanguageSelector from '../LanguageSelector';
import { loggingOut } from '../../utils/handleLogOut';
import LogoOutModal from '../modals/LogOutModal';
import { showInfoToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';

export default function HomePageMenu() {
    const { isMobile } = useIsMobile();
    const { user, isAuthenticated, loginStatus, logout } = useAuth();
    const { t } = useTranslation("homePage");
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await loggingOut(logout, navigate);
        closeModal();
        window.location.reload();
    };

    const handleDashboardRedirect = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
            setMenuOpen(false);
        } else {
            showInfoToast(t('dashboardRedirectInfo'));
        }
    };

    const closeMobileMenu = () => setMenuOpen(false);

    if (loginStatus.isLoading) {
        return <LoadingModal isOpen={loginStatus.isLoading} />
    }

    const navItems = (
        <>
            <li>
                <Link to='/' onClick={closeMobileMenu} className="hover:text-white transition-colors">
                    {t("homePageMenu.firstEl")}
                </Link>
            </li>
            <li>
                <Link to='/aboutus' onClick={closeMobileMenu} className="hover:text-white transition-colors">
                    {t("homePageMenu.secondEl")}
                </Link>
            </li>
            <li>
                <button
                    onClick={handleDashboardRedirect}
                    type="button"
                    className="hover:text-white transition-colors"
                >
                    Dashboard
                </button>
            </li>
            <li>
                <button
                    onClick={() => { openModal('auth'); closeMobileMenu(); }}
                    className="cursor-pointer hover:text-white transition-colors"
                    type="button"
                >
                    {t("homePageMenu.authBtn")}
                </button>
            </li>
            <li>
                <Link to='/contact' onClick={closeMobileMenu} className="hover:text-white transition-colors">
                    {t("homePageMenu.contactBtn")}
                </Link>
            </li>
        </>
    );

    return (
        <>
            <motion.header
                id="mainMenu"
                className="absolute inset-x-0 top-0 z-20"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="mx-auto w-full px-3 sm:px-5 py-3 flex items-center justify-between gap-3 border-b border-white/10 bg-[#141a28]/70 backdrop-blur-md">
                    <Link to="/" className="shrink-0 font-semibold text-white tracking-wide text-sm sm:text-base">
                        budgetApp
                    </Link>

                    {!isMobile && (
                        <ul className="flex flex-1 justify-center items-center gap-4 lg:gap-8 text-slate-200/90 text-sm lg:text-base">
                            {navItems}
                        </ul>
                    )}

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <LanguageSelector isHomepage={true} />
                        {isAuthenticated && user && (
                            <span className="hidden sm:flex items-center gap-2 text-slate-200 text-sm">
                                <span className="max-w-[7rem] truncate">{user.userName}</span>
                                <button
                                    type="button"
                                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                    onClick={() => openModal('logout')}
                                    aria-label="Logout"
                                >
                                    <Icon icon='mdi:logout' width={18} height={18} />
                                </button>
                            </span>
                        )}
                        {isMobile && (
                            <button
                                type="button"
                                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                                className="p-2 rounded-lg border border-white/20 text-slate-100 hover:bg-white/10"
                                onClick={() => setMenuOpen((v) => !v)}
                            >
                                <Icon icon={menuOpen ? 'mdi:close' : 'mdi:menu'} width={20} height={20} />
                            </button>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isMobile && menuOpen && (
                        <>
                            <motion.button
                                type="button"
                                aria-label="Close overlay"
                                className="fixed inset-0 z-30 bg-black/45"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={closeMobileMenu}
                            />
                            <motion.nav
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-x-3 top-[3.6rem] z-40 rounded-xl border border-white/15 bg-[#1a2236]/95 backdrop-blur-md shadow-2xl p-4"
                            >
                                <ul className="flex flex-col gap-3 text-slate-100 text-sm">
                                    {navItems}
                                </ul>
                                {isAuthenticated && user && (
                                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-sm text-slate-200">
                                        <span className="truncate">{user.userName}</span>
                                        <button
                                            type="button"
                                            className="p-1.5 rounded-lg hover:bg-white/10"
                                            onClick={() => { openModal('logout'); closeMobileMenu(); }}
                                            aria-label="Logout"
                                        >
                                            <Icon icon='mdi:logout' width={18} height={18} />
                                        </button>
                                    </div>
                                )}
                            </motion.nav>
                        </>
                    )}
                </AnimatePresence>
            </motion.header>
            {modal && modal.isOpen && modal.type === 'auth' && <AuthModal isOpen={modal.isOpen} onRequestClose={closeModal} />}
            {modal && modal.isOpen && modal.type === 'logout' && (
                <LogoOutModal isOpen={modal.isOpen} onRequestClose={closeModal} handleLogOut={handleLogOut} />
            )}
        </>
    );
}
