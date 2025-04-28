import { type ChartOptions } from "chart.js";

export interface LineChartProps {
    labels: string[];
    dataValues: number[];
    secondDataValues?: number[] | null;
    title?: string;
    secondTitle?: string;
    colors?: string[];
    borderColors?: string[];
    secondColors?: string[];
    secondBorderColors?: string[];
    options?: ChartOptions<'line'>;
};