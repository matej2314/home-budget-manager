import { Line } from 'react-chartjs-2';  // Komponent wykresu liniowego z react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = ({ labels, dataValues, secondDataValues = null, title = 'Wykres liniowy', secondTitle = '', colors = ['rgba(75, 192, 192, 0.2)'], borderColors = ['rgba(75, 192, 192, 1)'], secondColors = ['rgba(153, 102, 255, 0.2)'], secondBorderColors = ['rgba(153, 102, 255, 1)'], width, height, options = {} }) => {

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
            },
        },
    };

    const chartOptions = { ...defaultOptions, ...options };

    return <Line data={data} options={chartOptions} width={width} height={height} />;
};

export default LineChart;
