import { motion } from "framer-motion"

export default function MostActiveMates({ isLoading, matesData }) {

    return (
        <div id="most-active-mates" className="w-1/2 flex flex-col justify-start items-center border-2 border-slate-400 mx-auto overflow-hidden">
            <motion.div
                initial={{ x: 670, opacity: 1 }}
                animate={{ x: -270, opacity: 1 }}
                exit={{ x: -270, opacity: 0 }}
                transition={{ duration: 10.0, type: "keyframes", repeat: Infinity, repeatType: 'loop', ease: 'linear', delay: 0.2, }}
                className="w-full h-full flex flex-row gap-3">
                <h2 className="w-fit h-fit flex justify-center">Most active mates:</h2>
                {!isLoading && matesData && matesData.map((mate, index) => {
                    return <p key={index}>{mate.userName} - {mate.role}</p>
                })}
            </motion.div>
        </div>
    )
}