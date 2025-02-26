import { motion, AnimatePresence } from "framer-motion";

export default function FunctionalitiesSection({ isLoading, error, functionsData }) {
    const wrapperVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.3,
            }
        },
    };

    const itemVariants = {
        initial: { opacity: 0, },
        animate: {
            opacity: 1,
            transition: { duration: 0.8 }
        },
    };

    return (
        <>
            {!isLoading && !error && functionsData ?
                <motion.div
                    id="funcionalities"
                    className="w-full h-fit flex flex-col gap-5 border-b-2 border-slate-500/25"
                    variants={wrapperVariants}
                    initial="initial"
                    animate="animate"
                    exit="initial"
                >
                    <h2 className="w-full h-fit flex flex-row justify-center items-center text-black text-2xl">
                        Main functionalities:
                    </h2>
                    <div className="w-full h-fit flex justify-center items-center mb-4">
                        <AnimatePresence>
                            <div
                                className="w-[100vw] h-fit flex flex-row items-center gap-3 p-2"
                            >
                                {functionsData && Array.isArray(functionsData) && functionsData.map((func) => {
                                    return (
                                        <motion.div
                                            key={func.id}
                                            variants={itemVariants}
                                            initial="initial"
                                            animate="animate"
                                            className="w-1/3 h-[20rem] md:h-[10rem] flex flex-col gap-3 items-center bg-slate-400 rounded-md border-2 border-slate-500 p-2"
                                        >
                                            <h2 className="w-full h-fit text-md font-semibold text-justify md:text-2xl">{func.functionTitle}</h2>
                                            <p>{func.functionContent}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </AnimatePresence>
                    </div>
                </motion.div>
                : <p></p>
            }
        </>
    );
}
