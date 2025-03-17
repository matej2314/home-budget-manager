import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export default function TechnologiesSection({ technologies, isMobile }) {

    const { t } = useTranslation("aboutUs");

    return (
        <div className="w-full h-fit flex flex-col justify-center items-center text-slate-100 gap-7 mb-4">
            <h2 className="text-2xl font-semibold text-stone-400/80">{t("technologiesHeading")}</h2>
            <ol className="w-fit md:w-fit grid grid-cols-2 indirect:text-base indirectxl:grid-cols-3 sm:grid-cols-3 sm:text-lg md:grid md:grid-cols-3 text-[0.83rem] md:text-lg gap-y-4 gap-x-[7.5rem] indirectxl:gap-x-[2rem] sm:gap-x-[5rem] md:gap-x-[6rem] md:mx-auto">
                {technologies.map((tech, index) => (
                    <li
                        key={tech.id}
                        className={`w-[10rem] md:w-fit flex md:items-center justify-center items-center gap-[0.5rem] indirect:gap-2 ${index === technologies.length - 1 ? "col-span-3 mx-auto flex pr-7" : ''}`}>
                        <Icon icon={tech.icon} width={isMobile ? 25 : 50} height={isMobile ? 25 : 50} />
                        {tech.name}
                    </li>

                ))}
            </ol>
        </div>
    )
}