import { useTranslation } from 'react-i18next';

export default function DescriptionSection() {
    const { t } = useTranslation("aboutUs");

    return (
        <div id='welcome-text' className="w-full max-w-3xl mx-auto h-full flex flex-col justify-center items-center text-slate-100 gap-4 mb-6 px-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-white text-center tracking-tight">{t("mainHeading")}</h2>
            <p className="text-center text-sm sm:text-base lg:text-lg text-slate-300/95 leading-relaxed">
                {t("appDescription")}
            </p>
        </div >
    )
}