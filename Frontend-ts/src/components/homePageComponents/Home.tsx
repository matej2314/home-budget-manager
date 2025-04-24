import { useState, useEffect, startTransition } from 'react';
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useModal } from '@hooks/useModal';
import AuthModal from '@components/modals/AuthModal';
import { getSessionStorage, setSessionStorage } from '../../utils/storageUtils';
import { wrapperVariants, elementsVariants, lastElementVariants } from '../../utils/animationVariants';

export default function Home() {
    const { t } = useTranslation("homePage");
    const [currentText, setCurrentText] = useState<number | null>(null);
    const { modal, openModal, closeModal } = useModal({ isOpen: false, modalType: 'auth', data: null });
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
            className="w-full h-full flex flex-col mb-[10rem] text-slate-200 justify-center items-center z-0"
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
                            className="opacity-0 mt-[2rem]"
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
                                    onClick={() => openModal('auth', null)}
                                >
                                    <NavLink to='#' className=" w-full h-full flex flex-row items-center">
                                        {t('discoverBtn')}
                                    </NavLink>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.span>
            </AnimatePresence>
            {modal && modal.modalType === 'auth' && <AuthModal isOpen={modal && modal.isOpen} onRequestClose={closeModal} />}
        </motion.div>
    );
}