function updateInfo(state){

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

    if (state==='low'){
        buttons[0].classList.add('bg-color-3', 'text-light');
        buttons[0].classList.remove('btn-light', 'text-dark');
        estValText.textContent = low;

        energyPrediction = prediction*low
        energyPredText.textContent = energyPrediction.toLocaleString();
        
        getSupplyInfo(energyPrediction)
        homeText.textContent = homeValue;
        industryText.textContent = industryValue;
        evText.textContent = evValue;
        bulbText.textContent = bulbValue;
        
    }
    else if (state==='medium'){
        buttons[1].classList.add('bg-color-3', 'text-light');
        buttons[1].classList.remove('btn-light', 'text-dark');
        estValText.textContent = medium;

        energyPrediction = prediction*medium
        energyPredText.textContent = energyPrediction.toLocaleString();
        
        getSupplyInfo(energyPrediction)
        homeText.textContent = homeValue;
        industryText.textContent = industryValue;
        evText.textContent = evValue;
        bulbText.textContent = bulbValue;
    }
    else if (state==="high"){
        buttons[2].classList.add('bg-color-3', 'text-light');
        buttons[2].classList.remove('btn-light', 'text-dark');
        estValText.textContent = high;
        
        energyPrediction = prediction*high
        energyPredText.textContent = energyPrediction.toLocaleString();
        
        getSupplyInfo(energyPrediction)
        homeText.textContent = homeValue;
        industryText.textContent = industryValue;
        evText.textContent = evValue;
        bulbText.textContent = bulbValue;
    }
}

function getSupplyInfo(energyPrediction){
    homeValue = formatToMillions(energyPrediction/3000);
    industryValue = convertToYears(energyPrediction/5555600000);
    evValue = formatToMillions(energyPrediction/1000);
    bulbValue = (energyPrediction/0.5).toLocaleString();

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