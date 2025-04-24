import { motion } from "framer-motion";
import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next";
import { messageFormVariants, contactFormVariants } from "../../../utils/animationVariants";

const messageFormClasses = "relative w-[15rem] bg-transparent p-2 rounded-xl hover:bg-slate-400 hover:text-slate-50 btn-border border-slate-500/45 overflow-hidden";

type StateType = {
    type: string;
};

type SendMessageBtnProps = {
    form: string;
    setState: (param: string) => void;
    resetState: () => void;
    state:StateType;
};


export default function SendMessageBtn({ form, state, setState, resetState }: SendMessageBtnProps) {
    const { t } = useTranslation("forms");

    const variant = form === 'sendMessage'
        ? messageFormVariants(state)
        : contactFormVariants(state);


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
                {t("sendMessageBtn.label")}
            </span>
            <motion.div
                key="submit-icon"
                className="absolute w-fit h-fit flex items-center justify-center"
                variants={variant}
                initial='initial'
                animate='animate'
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <Icon icon="fa-solid:paper-plane" width={22} height={22} className="text-slate-200" />
            </motion.div>

        </motion.button>
    )
};