import { Line } from 'react-chartjs-2';  // Komponent wykresu liniowego z react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Rejestrujemy komponenty wykresu liniowego
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = ({ labels, dataValues, secondDataValues = null, title = 'Wykres liniowy', secondTitle = '', colors = ['rgba(75, 192, 192, 0.2)'], borderColors = ['rgba(75, 192, 192, 1)'], secondColors = ['rgba(153, 102, 255, 0.2)'], secondBorderColors = ['rgba(153, 102, 255, 1)'], options = {} }) => {

    // Przygotowujemy dane do wykresu na podstawie propsów
    const datasets = [
        {
            label: title,  // Tytuł wykresu
            data: dataValues,  // Wartości na osi Y
            backgroundColor: colors,  // Kolory obszaru pod wykresem
            borderColor: borderColors,  // Kolor linii wykresu
            borderWidth: 2,  // Grubość linii
            pointRadius: 5,  // Rozmiar punktów na wykresie
            fill: true,  // Wypełnienie obszaru pod wykresem
        },
    ];

    // Dodajemy opcjonalnie drugą linię, jeśli `secondDataValues` zostało przekazane
    if (secondDataValues) {
        datasets.push({
            label: secondTitle || 'Porównanie',  // Tytuł drugiej linii
            data: secondDataValues,  // Wartości drugiej linii
            backgroundColor: secondColors,  // Kolor obszaru pod drugą linią
            borderColor: secondBorderColors,  // Kolor drugiej linii
            borderWidth: 2,
            pointRadius: 5,
            fill: false,  // Możemy zdecydować, że druga linia nie ma wypełnienia pod wykresem
        });
    }

    // Dane wykresu
    const data = {
        labels: labels,  // Etykiety na osi X
        datasets: datasets,  // Zestawy danych (pierwszy i opcjonalnie drugi)
    };

    // Opcje wykresu (z możliwością nadpisania)
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

    // Łączenie opcji domyślnych z opcjami przekazanymi przez propsy
    const chartOptions = { ...defaultOptions, ...options };

    return <Line data={data} options={chartOptions} />;
};

export default LineChart;
