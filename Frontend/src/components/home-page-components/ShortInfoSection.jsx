import { motion } from 'framer-motion';

export default function ShortInfoSection({ isLoading, infoData, error }) {

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
            {!isLoading && !error && infoData &&
                <motion.div
                    variants={wrapperVariants}
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    className="w-full h-fit flex flex-col items-center gap-3"
                >
                    <h2 className="w-full h-fit flex flex-row justify-center items-center text-black md:text-2xl">What is Home Budget Web Manager?</h2>
                    <div id="boxes" className="w-[100vw] h-fit flex flex-row  md:justify-center gap-3 items-center border-b-2 md:mx-0 border-slate-500/25 pb-4 px-10">
                        {infoData && Array.isArray(infoData) && infoData.map((info) => (
                            <div
                                key={info.id}
                                variants={itemVariants}
                                initial="initial"
                                animate="animate"
                                id='infoBox'
                                className="w-1/3 md:h-[12rem] flex flex-col text-sm md:text-base items-center gap-3 border-2 border-slate-400 rounded-md p-2 bg-slate-400/25 shadow-lg"
                            >
                                <h2 className="text-md font-semibold text-nowrap md:text-2xl">{info.infoTitle}</h2>
                                <p>{info.infoContent}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            }
        </>
    )
}