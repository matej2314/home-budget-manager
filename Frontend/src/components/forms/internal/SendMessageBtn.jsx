import { motion } from "framer-motion";
import { Icon } from '@iconify/react';

const messageFormClasses = "relative w-[15rem] bg-transparent p-2 rounded-xl hover:bg-slate-400 hover:text-slate-50 btn-border border-slate-500/45 overflow-hidden";

export default function SendMessageBtn({ form, state, setState, resetState }) {

    const messageFormVariants = {
        initial: { x: -50, y: -25, opacity: 0 },
        animate: state.type === 'sended' ? { y: -170, x: 250, opacity: 1 }
            : state.type === 'hover'
                ? { x: 175, rotate: 22, opacity: 1 }
                : { opacity: 1 }
    };

    const contactFormVariants = {
        initial: { x: -150, y: 0 },
        animate: state.type === 'sended'
            ? { x: 150, y: -50, opacity: 0 }
            : {
                x: state.type === 'hover' ? 75 : -150,
                rotate: state.type === 'hover' ? 22 : 0
            }
    }

    return (
        <motion.button
            type="submit"
            onHoverStart={() => setState('hover')}
            onHoverEnd={resetState}
            className={form === 'sendMessage' ? messageFormClasses : 'contact-form-submit-btn'}
            disabled={state.type === 'sended'}
        >
            <span
                className="w-full h-full justify-center"
            >
                Send message
            </span>
            <motion.div
                key="submit-icon"
                className="absolute w-fit h-fit flex items-center justify-center"
                variants={form === 'sendMessage' ? messageFormVariants : contactFormVariants}
                initial='initial'
                animate='animate'
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <Icon icon="fa-solid:paper-plane" width={22} height={22} className="text-slate-200" />
            </motion.div>

        </motion.button>
    )
};