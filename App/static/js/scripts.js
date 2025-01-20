const low = 500;
const medium = 600;
const high = 700;

function updateInfo(state) {

    const buttons = document.querySelectorAll('.btn-group .btn');
    const estValText = document.getElementById('estimation-value');
    const energyPredText = document.getElementById('energyGen');
    const homeText = document.getElementById('homeCount');
    const industryText = document.getElementById('industryCount');
    const evText = document.getElementById('evCount');
    const bulbText = document.getElementById('bulbCount');

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

        var countUp = new CountUp('energyGen', '0', energyPrediction, 0, 2, options);
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }

        var countUp2 = new CountUp('bulbCount', 0, parseFloat(bulbValue.replace(/,/g, '')), 0, 2, options2);
        if (!countUp2.error) {
            countUp2.start();
        } else {
            console.error(countUp2.error);
        }

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

        var countUp = new CountUp('energyGen', '0', energyPrediction, 0, 2, options);
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }

        var countUp2 = new CountUp('bulbCount', 0, parseFloat(bulbValue.replace(/,/g, '')), 0, 2, options2);
        if (!countUp2.error) {
            countUp2.start();
        } else {
            console.error(countUp2.error);
        }
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

        var countUp = new CountUp('energyGen', '0', energyPrediction, 0, 2, options);
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }

        var countUp2 = new CountUp('bulbCount', 0, parseFloat(bulbValue.replace(/,/g, '')), 0, 2, options2);
        if (!countUp2.error) {
            countUp2.start();
        } else {
            console.error(countUp2.error);
        }
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

// Function to fetch data and render the graph
function fetchGraphData(selectedYear) {
    // Fetch data from the Flask endpoint
    fetch(`/graph-data?year=${selectedYear}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log('Graph Data:', data); // Debug: Log the data

            // Prepare the labels and datasets for the graph
            const historicalYears = data.historical.years;
            const historicalWaste = data.historical.waste;

            const predictedYears = data.predicted.years;
            const predictedWaste = data.predicted.waste;

            // Combine all years for the X-axis
            const allYears = [...historicalYears, ...predictedYears];

            // Render the graph
            renderLineGraph(allYears, historicalYears, historicalWaste, predictedYears, predictedWaste);
        })
        .catch(error => {
            console.error('Error fetching graph data:', error);
        });
}

var options = {
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.'
};

var options2 = {
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.'
};


// Function to render the line graph using Chart.js
function renderLineGraph(allYears, historicalYears, historicalWaste, predictedYears, predictedWaste) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Create the line graph
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: allYears,
            datasets: [
                {
                    label: 'Historical Waste',
                    data: historicalYears.map((year, index) => ({ x: year, y: historicalWaste[index] })),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Predicted Waste',
                    data: predictedYears.map((year, index) => ({ x: year, y: predictedWaste[index] })),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    borderWidth: 2,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Historical and Predicted Waste Data'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Waste (in tons)'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: "'Poppins'",
                            size: 14,
                        }
                    }
                }
            },

        },
    });
}


document.getElementById('load-more').addEventListener('click', function () {
    const target = document.getElementById('info-section');
    const homeText = document.getElementById('homeCount');
    const industryText = document.getElementById('industryCount');
    const evText = document.getElementById('evCount');
    const bulbText = document.getElementById('bulbCount');
    
    target.classList.remove('hidden');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const energyPredText = document.getElementById('energyGen');

    energyPrediction = prediction * medium
    energyPredText.textContent = energyPrediction.toLocaleString();

    getSupplyInfo(energyPrediction)
    homeText.textContent = homeValue;
    industryText.textContent = industryValue;
    evText.textContent = evValue;
    bulbText.textContent = bulbValue;

    var countUp = new CountUp('energyGen', '0', energyPrediction, 0, 2, options);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error(countUp.error);
    }

    var countUp2 = new CountUp('bulbCount', 0, parseFloat(bulbValue.replace(/,/g, '')), 0, 2, options2);
    if (!countUp2.error) {
        countUp2.start();
    } else {
        console.error(countUp2.error);
    }
});

document.getElementById('graphButton').addEventListener('click', function () {
    const target = document.getElementById('graphSection');
    const spin = document.getElementById('loadSpin');
    target.classList.remove('graphHidden');
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
        spin.classList.add('hidden');

    }, 2000);
    setTimeout(() => {
        fetchGraphData(targetYear);
    }, 1300);
});    