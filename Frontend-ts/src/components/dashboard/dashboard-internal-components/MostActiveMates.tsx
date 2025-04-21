import { motion } from "framer-motion"
import { useDeviceType } from '@hooks/useDeviceType';
import { useTranslation } from 'react-i18next';
import { type HouseMatesObj } from "@models/dataContextTypes";

type MostActiveMatesInput = {
    isLoading: boolean;
    matesData: HouseMatesObj[];
};

export default function MostActiveMates({ isLoading, matesData }: MostActiveMatesInput) {
    const { isMobile } = useDeviceType();
    const { t } = useTranslation("dashboardInternal");

    return (
        <div
            id="most-active-mates"
            className="w-1/2 flex flex-col justify-start items-center border-2 border-slate-400 mx-auto overflow-hidden">
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
                className="w-full h-full flex flex-row gap-3">
                <h2 className="lg:w-fit h-fit flex lg:justify-center text-nowrap">{t("mostActiveMates.heading")}</h2>
                {!isLoading && matesData && matesData.map((mate, index) => {
                    return <p key={index} className="text-nowrap">{mate.userName} - {t(`mostActiveMates.${mate.role}`)}</p>
                })}
            </motion.div>
        </div>
    )
}