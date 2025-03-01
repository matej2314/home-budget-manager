import { NavLink } from "react-router-dom";
import { motion, AnimatePresence, delay } from "framer-motion";
import { useState, useEffect } from 'react';

export default function Home() {
    const [currentText, setCurrentText] = useState(null);

    useEffect(() => {
        const timer1 = setTimeout(() => setCurrentText(0), 500);
        const timer2 = setTimeout(() => setCurrentText(1), 3500);
        const timer3 = setTimeout(() => setCurrentText(2), 5700);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
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
            className="w-full h-full flex flex-col text-slate-200 justify-around items-center gap-3 pt-[5rem] relative z-0"
        >
            <div>
                <h2 className="text-center text-2xl indirect:text-3xl sm:text-4xl lg:text-5xl font-urbanist font-normal mb-[10rem]">
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
                            Add your housemates, analyze incomes and costs, take control.
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
                            <h3 className="text-base indirect:text-lg sm:text-xl lg:text-2xl text-center font-urbanist font-medium">
                                Your personal tool to control house finances
                            </h3>
                            <div className="w-full h-fit flex justify-center items-start gap-3">
                                <button
                                    className="w-fit h-fit border-[3px] border-slate-300 text-sm px-2 py-3 rounded-xl shadow-md shadow-slate-400 active:shadow-sm"
                                    type="button"
                                >
                                    <NavLink to="aboutus">
                                        About project
                                    </NavLink>
                                </button>
                                <button
                                    className="w-fit h-fit text-sm border-[3px] border-slate-300 p-2 rounded-xl shadow-md shadow-slate-400 active:shadow-sm"
                                    type="button"
                                >
                                    <NavLink className="w-fit h-fit flex items-center gap-1">
                                        Discover
                                        <span className="w-fit h-fit text-lg">
                                            &rarr;
                                        </span>
                                    </NavLink>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.span>
            </AnimatePresence>
        </motion.div>
    );
}