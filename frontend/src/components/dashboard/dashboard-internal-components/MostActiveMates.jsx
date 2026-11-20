import { motion } from "framer-motion"
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';

export default function MostActiveMates({ isLoading, matesData }) {
    const { isMobile } = useIsMobile();
    const { t } = useTranslation("dashboardInternal");

    return (
        <div
            id="most-active-mates"
            className="section-card w-full overflow-hidden"
        >
            <motion.div
                initial={{ x: !isMobile ? 670 : 240, opacity: 1 }}
                animate={{ x: -270, opacity: 1 }}
                exit={{ x: -270, opacity: 0 }}
                transition={{
                    duration: !isMobile ? 10.0 : 7.0,
                    type: "keyframes", repeat: Infinity,
                    repeatType: 'loop', ease: 'linear',
                    delay: 0.2,
                }}
                className="w-full flex flex-row items-center gap-4 text-sm text-ink"
            >
                <h2 className="shrink-0 font-semibold text-muted text-nowrap">{t("mostActiveMates.heading")}</h2>
                {!isLoading && matesData && matesData.map((mate, index) => {
                    return <p key={index} className="text-nowrap">{mate.userName} — {t(`mostActiveMates.${mate.role}`)}</p>
                })}
            </motion.div>
        </div>
    )
}
