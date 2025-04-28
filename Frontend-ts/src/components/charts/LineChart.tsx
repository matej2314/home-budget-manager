import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from 'chart.js';
import { LineChartProps } from '@models/componentsTypes/LineChartTypes';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = ({
    labels,
    dataValues,
    secondDataValues = null,
    title = 'Wykres liniowy',
    secondTitle = '',
    colors = ['rgba(75, 192, 192, 0.2)'],
    borderColors = ['rgba(75, 192, 192, 1)'],
    secondColors = ['rgba(153, 102, 255, 0.2)'],
    secondBorderColors = ['rgba(153, 102, 255, 1)'],
    options = {},
}: LineChartProps) => {

    const datasets: ChartData<'line'>['datasets'] = [
        {
            label: title,
            data: dataValues,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 2,
            pointRadius: 5,
            fill: true,
        },
    ];

    if (secondDataValues) {
        datasets.push({
            label: secondTitle || 'Porównanie',
            data: secondDataValues,
            backgroundColor: secondColors,
            borderColor: secondBorderColors,
            borderWidth: 2,
            pointRadius: 5,
            fill: false,
        });
    }

    const data: ChartData<'line'> = {
        labels: labels,
        datasets: datasets,
    };

    const defaultOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                beginAtZero: true,
                ticks: {
                    autoSkip: true,
                    maxRotation: typeof window !== 'undefined' && window.innerWidth <= 768 ? 45 : 0,
                    minRotation: typeof window !== 'undefined' && window.innerWidth <= 768 ? 45 : 0,
                },
            },
            y: {
                type: 'linear',
                beginAtZero: true,
            },
        },
    };

    const chartOptions = { ...defaultOptions, ...options };

    return (
        <div className="w-full h-full">
            <Line data={data} options={chartOptions} />
        </div>
    );
};

export default LineChart;
