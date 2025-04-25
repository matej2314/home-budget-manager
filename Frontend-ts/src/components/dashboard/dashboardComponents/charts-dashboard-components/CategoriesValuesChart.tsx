import BarChart from "../../../charts/BarChart";
import { useTranslation } from 'react-i18next';

interface CategoriesValuesChartProps {
    labels: string[];
    values: number[];
};

export default function CategoriesValuesChart({ labels, values }: CategoriesValuesChartProps) {
    const { t } = useTranslation("dashboardComponents");

    return (
        <div className="w-full flex flex-col items-center justify-center gap-7">
            <h2 className="text-xl">{t("categoriesValues.heading")}</h2>
            <div className="w-full h-[15rem] lg:h-[35rem]">
                <BarChart
                    labels={labels}
                    dataValues={values}
                    title="Transaction Categories"
                    colors={['rgba(255, 99, 132, 0.2)']}
                    borderColors={['rgba(255, 99, 132, 1)']}
                />
            </div>
        </div>
    );
}