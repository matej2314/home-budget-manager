import { useTranslation } from 'react-i18next';

export default function DescriptionSection() {
    const { t } = useTranslation("aboutUs");

    return (
        <div id='welcome-text' className="w-fit h-full flex flex-col justify-center items-center text-slate-100 gap-6 mb-4">
            <h2 className="text-2xl font-semibold text-stone-400/80 text-center">{t("mainHeading")}</h2>
            <p className="px-2 text-center lg:text-xl">
                {t("appDescription")}
            </p>
        </div >
    )
}