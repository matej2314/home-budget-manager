import { motion, AnimatePresence, stagger } from "framer-motion";
import { useState, useEffect } from "react";

export default function FunctionalitiesSection() {
    const wrapperVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: 1.5,
                staggerChildren: 0.5
            }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        initial: { opacity: 0, scale: 1.5 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
        whileHover: {
            clipPath: 'polygon(0 0, 75% 0, 100% 100%, 0 100%)',
            transition: { duration: 0.5 }
        }
    };

    return (
        <div id="funcionalities" className="w-full h-fit flex flex-col gap-5 border-b-2 border-slate-500/25">
            <h2 className="w-full h-fit flex flex-row justify-center items-center text-black text-2xl">
                Main functionalities:
            </h2>
            <div className="w-full h-fit flex justify-center items-center mb-4">
                <AnimatePresence>
                    <motion.div
                        variants={wrapperVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-[300vw] h-fit flex flex-row items-center gap-3 p-2"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="w-1/3 h-[10rem] flex flex-col gap-3 items-center bg-slate-400 rounded-md border-2 border-slate-500 p-2"
                        >
                            <h2 className="text-2xl">Add your own household</h2>
                            <p>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti architecto quod
                                voluptatem consectetur, vel repudiandae quidem voluptas accusamus ut nesciunt.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="w-1/3 h-[10rem] flex flex-col gap-3 items-center bg-slate-400 border-2 border-slate-500 p-2"
                        >
                            <h2 className="text-2xl">Invite your housemates</h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quis consectetur quam
                                dolor ea nobis vitae maxime magni, velit enim!
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="w-1/3 h-[10rem] flex flex-col gap-3 items-center bg-slate-400 border-2 border-slate-500 p-2"
                        >
                            <h2 className="text-2xl">Take control about your household budget</h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Est voluptatum nam quaerat
                                dicta, architecto magnam unde, asperiores facere enim, perferendis sunt!
                            </p>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
