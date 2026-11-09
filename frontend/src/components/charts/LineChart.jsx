import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

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
    options = {}
}) => {

    const datasets = [
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

    const data = {
        labels: labels,
        datasets: datasets,
    };

    const defaultOptions = {
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
                beginAtZero: true,
                ticks: {
                    autoSkip: true,
                    maxRotation: window.innerWidth <= 768 ? 45 : 0,
                    minRotation: window.innerWidth <= 768 ? 45 : 0,
                }
            },
            y: {
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
