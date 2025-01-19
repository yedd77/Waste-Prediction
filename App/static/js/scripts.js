function updateInfo(state) {

    const buttons = document.querySelectorAll('.btn-group .btn');
    const estValText = document.getElementById('estimation-value');
    const energyPredText = document.getElementById('energyGen');
    const homeText = document.getElementById('homeCount');
    const industryText = document.getElementById('industryCount');
    const evText = document.getElementById('evCount');
    const bulbText = document.getElementById('bulbCount');

    const low = 500;
    const medium = 600;
    const high = 700;

    buttons.forEach((button) => {
        button.classList.remove('bg-color-3', 'text-light');
        button.classList.add('btn-light', 'text-pur');
    });

    if (state === 'low') {
        buttons[0].classList.add('bg-color-3', 'text-light');
        buttons[0].classList.remove('btn-light', 'text-dark');
        estValText.textContent = low;

        energyPrediction = prediction * low
        energyPredText.textContent = energyPrediction.toLocaleString();

        getSupplyInfo(energyPrediction)
        homeText.textContent = homeValue;
        industryText.textContent = industryValue;
        evText.textContent = evValue;
        bulbText.textContent = bulbValue;

    }
    else if (state === 'medium') {
        buttons[1].classList.add('bg-color-3', 'text-light');
        buttons[1].classList.remove('btn-light', 'text-dark');
        estValText.textContent = medium;

        energyPrediction = prediction * medium
        energyPredText.textContent = energyPrediction.toLocaleString();

        getSupplyInfo(energyPrediction)
        homeText.textContent = homeValue;
        industryText.textContent = industryValue;
        evText.textContent = evValue;
        bulbText.textContent = bulbValue;
    }
    else if (state === "high") {
        buttons[2].classList.add('bg-color-3', 'text-light');
        buttons[2].classList.remove('btn-light', 'text-dark');
        estValText.textContent = high;

        energyPrediction = prediction * high
        energyPredText.textContent = energyPrediction.toLocaleString();

        getSupplyInfo(energyPrediction)
        homeText.textContent = homeValue;
        industryText.textContent = industryValue;
        evText.textContent = evValue;
        bulbText.textContent = bulbValue;
    }
}

function getSupplyInfo(energyPrediction) {

    const bulbwatt = 5;
    const lightTime = 100;

    homeValue = formatToMillions(energyPrediction / 3000);
    industryValue = convertToYears(energyPrediction / 5555600000);
    evValue = formatToMillions(energyPrediction / 1000);
    //convert energy to watt hour and divide by wattage needed for light up the bulb times light time
    bulbValue = ((energyPrediction * 1000) / (bulbwatt * lightTime)).toLocaleString();

    return homeValue, industryValue, evValue;
}

function formatToMillions(number) {
    if (number >= 1_000_000) {
        return (number / 1_000_000).toFixed(1) + 'm';
    }
    return number.toLocaleString();
}

function convertToYears(decimalValue) {

    const wholeYears = Math.floor(decimalValue);
    const fractionalPart = decimalValue - wholeYears;

    if (fractionalPart === 0) {
        return `${wholeYears} years`;
    } else {
        const formattedYears = (wholeYears + fractionalPart).toFixed(1);
        return `${formattedYears} years`;
    }
}

// Fetch the data from the server
fetch('/graph-data?year=2025') // Replace 2030 with the desired year
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        console.log('Historical Data:', data.historical);
        console.log('Predicted Data:', data.predicted);

        // Extract historical and predicted data for the chart
        const historicalYears = data.historical.years;
        const historicalWaste = data.historical.waste;

        const predictedYears = data.predicted.years;
        const predictedWaste = data.predicted.waste;

        // Prepare the data for Google Charts
        const chartDataArray = prepareChartData(historicalYears, historicalWaste, predictedYears, predictedWaste);

        // Render the chart
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => drawChart(chartDataArray));
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Prepare the data for Google Charts
function prepareChartData(historicalYears, historicalWaste, predictedYears, predictedWaste) {
    const chartDataArray = [['Year', 'Historical Waste', 'Predicted Waste']];

    const historicalWasteMap = new Map(historicalYears.map((year, index) => [year, historicalWaste[index]]));
    const predictedWasteMap = new Map(predictedYears.map((year, index) => [year, predictedWaste[index]]));

    const allYears = [...historicalYears, ...predictedYears];
    allYears.forEach(year => {
        chartDataArray.push([
            year,
            historicalWasteMap.get(year) || null, // Historical data or null
            predictedWasteMap.get(year) || null  // Predicted data or null
        ]);
    });

    return chartDataArray;
}

// Draw the Google Chart
function drawChart(chartDataArray) {
    const data = google.visualization.arrayToDataTable(chartDataArray);

    const options = {
        hAxis: {
            title: 'Year', // Label for the x-axis
            format: '####', // Ensure years are displayed as full numbers
            gridlines: {
                count: chartDataArray.length - 1 // Match gridlines to the number of data points
            },
            ticks: chartDataArray.slice(1).map(row => row[0]) // Dynamically set ticks to the years
        },
        vAxis: {
            title: 'Waste (tons)', // Label for the y-axis
            gridlines: { count: 5 }
        },
        legend: { position: 'bottom' },
        backgroundColor: '#f8f8f8',
        series: {
            0: { color: 'blue' }, // Historical line color
            1: { color: 'green', lineDashStyle: [4, 4] } // Predicted line color and style
        }
    };

    const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

