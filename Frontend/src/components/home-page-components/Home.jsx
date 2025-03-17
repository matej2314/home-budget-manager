import { NavLink } from "react-router-dom";
import { motion, AnimatePresence, delay } from "framer-motion";
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import useModal from '../../hooks/useModal';
import AuthModal from '../modals/AuthModal';
import { getSessionStorage, setSessionStorage } from '../../utils/storageUtils';

export default function Home() {
    const [currentText, setCurrentText] = useState(null);
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: 'auth' });
    const { t } = useTranslation("homePage");

    useEffect(() => {
        const visited = getSessionStorage('hasVisited');

        if (!visited) {
            setSessionStorage('hasVisited', 'true');
            const timer1 = setTimeout(() => setCurrentText(0), 500);
            const timer2 = setTimeout(() => setCurrentText(1), 3500);
            const timer3 = setTimeout(() => setCurrentText(2), 5700);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };

        } else {
            setCurrentText(2);
        }
    }, []);

    const wrapperVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.3,
                type: 'tween',
                ease: 'easeInOut',
            },
        },
    };

    const elementsVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 2, ease: 'easeInOut' } },
        exit: { opacity: 0, transition: { duration: 1, delay: 1, ease: 'easeInOut' } },
    };

    const lastElementVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 1, delay: 1.3, ease: 'easeInOut' },
        },
    };

    return (
        <motion.div
            key="home-container"
            variants={wrapperVariants}
            initial="initial"
            animate="animate"
            className="w-full h-full flex flex-col mb-[10rem] text-slate-200 justify-center items-center gap-3 z-0"
        >
            <div>
                <h2 className="text-center text-2xl indirect:text-3xl sm:text-4xl lg:text-5xl font-urbanist font-normal mb-28 lg:mb-[12rem]">
                    Web household budget manager
                </h2>
            </div>

            <AnimatePresence>
                <motion.span
                    key="animateText"
                    variants={elementsVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute text-base indirect:text-lg sm:text-xl lg:text-2xl text-center font-urbanist font-medium"
                >
                    {currentText === 0 && "Easy signup, easy to use, functional."}
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
                            className="opacity-0"
                        >
                            <h3 className="text-base indirect:text-lg sm:text-xl lg:text-2xl text-center font-urbanist font-medium mb-4">
                                {t("buttonsHeading")}
                            </h3>
                            <div className="w-full h-fit flex justify-center items-start gap-3">
                                <button
                                    className="w-fit h-fit border-[3px] border-slate-300 text-sm px-2 py-3 rounded-xl shadow-md shadow-slate-400 hover:text-slate-300 hover:shadow-slate-800 active:shadow-sm"
                                    type="button"
                                >
                                    <NavLink to="aboutus">
                                        {t('aboutProjectBtn')}
                                    </NavLink>
                                </button>
                                <button
                                    className="w-fit h-fit px-2 py-3 text-sm border-[3px] border-slate-300 p-2 rounded-xl shadow-md shadow-slate-400 hover:text-slate-300 hover:shadow-slate-800 active:shadow-sm"
                                    type="button"
                                    onClick={() => openModal('auth')}
                                >
                                    <NavLink className=" w-full h-full flex flex-row items-center">
                                        {t('discoverBtn')}
                                    </NavLink>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.span>
            </AnimatePresence>
            {modal && modal.type === 'auth' && <AuthModal isOpen={modal.isOpen} onRequestClose={closeModal} />}
        </motion.div>
    );
}