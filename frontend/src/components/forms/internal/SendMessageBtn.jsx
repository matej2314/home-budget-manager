import { motion } from "framer-motion";
import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next";
import { messageFormVariants, contactFormVariants } from "../../../utils/animationVariants";

const messageFormClasses =
    "relative inline-flex items-center justify-center gap-2 min-w-[11rem] px-4 py-2.5 rounded-lg bg-accent text-white font-medium shadow-sm hover:bg-accent/90 active:scale-[0.98] transition-all overflow-hidden disabled:opacity-60 disabled:pointer-events-none";

export default function SendMessageBtn({ form, state, setState, resetState }) {
    const { t } = useTranslation("forms");

    const messageVariants = messageFormVariants(state);
    const contactVariants = contactFormVariants(state);


    return (
        <motion.button
            type="submit"
            onHoverStart={() => setState('hover')}
            onHoverEnd={resetState}
            className={form === 'sendMessage' ? messageFormClasses : 'contact-form-submit-btn'}
            disabled={state.type === 'sended'}
        >
            <span className="relative z-[1]">
                {t("sendMessageBtn.label")}
            </span>
            <motion.div
                key="submit-icon"
                className="absolute w-fit h-fit flex items-center justify-center"
                variants={form === 'sendMessage' ? messageVariants : contactVariants}
                initial='initial'
                animate='animate'
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <Icon icon="fa-solid:paper-plane" width={18} height={18} className="text-white/90" />
            </motion.div>

        </motion.button>
    )
};
