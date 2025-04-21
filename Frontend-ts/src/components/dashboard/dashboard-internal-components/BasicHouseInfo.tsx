import { HouseDataObj } from '@models/dataContextTypes';
import { useTranslation } from 'react-i18next';

type BasicHouseInfoProps = {
    basicHouseInfo: HouseDataObj;
}

export default function BasicHouseInfo({ basicHouseInfo }: BasicHouseInfoProps) {
    const { t } = useTranslation("dashboardInternal");
    const keysToDisplay: (keyof HouseDataObj)[] = ['houseName', 'host', 'lastBalanceDate'];

    return (
        <div id="basicHouseInfo" className="w-full lg:w-full h-full text-xs lg:text-base flex justify-center items-center gap-4">
            {keysToDisplay.map((key, index) => (
                <div key={key} className="flex h-full items-center">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-0.5 lg:gap-2">
                        <span className="text-[0.65rem] lg:text-base font-bold">
                            {t(`basicHouseInfo.keysArray.${key}`)}:
                        </span>
                        <span className="w-full lg:w-fit">{basicHouseInfo[key] || t("basicHouseInfo.noData")}</span>
                    </div>
                    {index < keysToDisplay.length - 1 && (
                        <span className="block lg:block mx-4 text-xl">|</span>
                    )}
                </div>
            ))}
        </div>
    );
}