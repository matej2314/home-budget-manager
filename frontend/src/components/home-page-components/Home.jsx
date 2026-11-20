import { useState, useEffect, startTransition } from 'react';
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import useModal from '../../hooks/useModal';
import AuthModal from '../modals/AuthModal';
import { getSessionStorage, setSessionStorage } from '../../utils/storageUtils';
import { wrapperVariants, elementsVariants, lastElementVariants } from '../../utils/animationVariants';

export default function Home() {
    const { t } = useTranslation("homePage");
    const [currentText, setCurrentText] = useState(null);
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: 'auth' });
    const visited = getSessionStorage('hasVisited');

    useEffect(() => {
        if (!visited) {
            setSessionStorage('hasVisited', 'true');
            const timer1 = setTimeout(() => {
                startTransition(() => {
                    setCurrentText(0);
                });
            }, 500);

            const timer2 = setTimeout(() => {
                startTransition(() => {
                    setCurrentText(1);
                });
            }, 3500);

            const timer3 = setTimeout(() => {
                startTransition(() => {
                    setCurrentText(2);
                });
            }, 5700);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } else {
            startTransition(() => {
                setCurrentText(2);
            });
        }
    }, [visited]);

    return (
        <motion.div
            key="home-container"
            variants={wrapperVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col mb-16 text-slate-100 justify-center items-center px-4 sm:px-6 z-0"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute bottom-10 right-0 w-56 h-56 rounded-full bg-sky-400/10 blur-3xl" />
            </div>

            <div className="relative">
                <p className="text-center text-accent/90 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-3">
                    budgetApp
                </p>
                <h1 className="text-center text-3xl indirect:text-4xl sm:text-5xl lg:text-6xl font-urbanist font-semibold tracking-tight mb-10 sm:mb-16 lg:mb-24 text-white">
                    Web household budget manager
                </h1>
            </div>

            <AnimatePresence>
                <motion.span
                    key="animateText"
                    variants={elementsVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative text-base indirect:text-lg sm:text-xl lg:text-2xl text-center font-urbanist font-medium text-slate-200/95 max-w-xl"
                >
                    {currentText === 0 && t("firstSlogan")}
                    {currentText === 1 && (
                        <>
                            {t('mainSlogan')}
                        </>
                    )}
                    {currentText === 2 && (
                        <motion.div
                            key="animateEl3"
                            variants={lastElementVariants}
                            initial="initial"
                            animate="animate"
                            className="opacity-0 mt-4 sm:mt-8"
                        >
                            <h2 className="text-base indirect:text-lg sm:text-xl lg:text-2xl text-center font-urbanist font-medium mb-5 text-slate-100">
                                {t("buttonsHeading")}
                            </h2>
                            <div className="w-full h-fit flex flex-col indirect:flex-row justify-center items-center gap-3">
                                <NavLink to="aboutus" className="home-cta-ghost">
                                    {t('aboutProjectBtn')}
                                </NavLink>
                                <button
                                    className="home-cta-primary"
                                    type="button"
                                    onClick={() => openModal('auth')}
                                >
                                    {t('discoverBtn')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.span>
            </AnimatePresence>
            {modal && modal.type === 'auth' && <AuthModal isOpen={modal && modal.isOpen} onRequestClose={closeModal} />}
        </motion.div>
    );
}
