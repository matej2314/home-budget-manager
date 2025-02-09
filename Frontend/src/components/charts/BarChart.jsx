import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({
    labels,
    dataValues,
    secondDataValues = [],
    title = 'Wykres słupkowy',
    secondTitle = 'Drugi zestaw danych',
    colors = ['rgba(75, 192, 192, 0.2)'],
    borderColors = ['rgba(75, 192, 192, 1)'],
    secondColors = ['rgba(255, 99, 132, 0.2)'],
    secondBorderColors = ['rgba(255, 99, 132, 1)'],
    options = {},
    width = 350,
    height = 500,
}) => {
    const datasets = [
        {
            label: title,
            data: dataValues,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
        },
    ];

    if (secondDataValues.length > 0) {
        datasets.push({
            label: secondTitle,
            data: secondDataValues,
            backgroundColor: secondColors,
            borderColor: secondBorderColors,
            borderWidth: 1,
        });
    }

    const data = { labels, datasets };

    const minY = Math.min(...dataValues);
    const maxY = Math.max(...dataValues);

    const hasNegativeValues = minY < 0;

    const yMin = hasNegativeValues ? minY : 0;
    const yMax = maxY;

    const yBuffer = hasNegativeValues ? Math.abs(maxY - minY) * 0.1 : 0;

    const defaultOptions = {
        responsive: true,
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
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                min: yMin - yBuffer,
                max: yMax + yBuffer,
                ticks: {
                    callback: function (value) {
                        return value;
                    },
                },
            },
        },
    };

    const chartOptions = { ...defaultOptions, ...options };

    return <Bar data={data} options={chartOptions} width={width} height={height} />;
};

export default BarChart;
