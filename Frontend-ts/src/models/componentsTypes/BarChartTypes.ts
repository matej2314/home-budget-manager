import { type ChartOptions } from "chart.js";

export interface BarChartProps {
    labels: string[];
    dataValues: number[];
    secondDataValues?: number[];
    title?: string;
    secondTitle?: string;
    colors?: string[];
    borderColors?: string[];
    secondColors?: string[];
    secondBorderColors?: string[];
    options?: ChartOptions<"bar">;
    width?: number;
    height?: number;
};