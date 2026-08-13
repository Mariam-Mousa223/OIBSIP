const tempInput = document.getElementById('tempInput');
const unitSelect = document.getElementById('unitSelect');
const convertBtn = document.getElementById('convertBtn');
const errorText = document.getElementById('errorText');

const celsiusResult = document.getElementById('celsiusResult');
const fahrenheitResult = document.getElementById('fahrenheitResult');
const kelvinResult = document.getElementById('kelvinResult');

function convertTemperature() {
    const rawValue = tempInput.value.trim();
    const value = parseFloat(rawValue);
    const unit = unitSelect.value;

    errorText.style.display = 'none';
    errorText.textContent = '';

    if (rawValue === '' || isNaN(value)) {
        showError('Please enter a valid numeric value.');
        clearResults();
        return;
    }

    let celsius;

    if (unit === 'celsius') {
        celsius = value;
    } else if (unit === 'fahrenheit') {
        celsius = (value - 32) * (5 / 9);
    } else if (unit === 'kelvin') {
        celsius = value - 273.15;
    }

    if (celsius < -273.15) {
        showError('Temperature cannot be below absolute zero (-273.15°C / 0K).');
        clearResults();
        return;
    }

    const fahrenheit = (celsius * (9 / 5)) + 32;
    const kelvin = celsius + 273.15;

    celsiusResult.textContent = `${celsius.toFixed(2)} °C`;
    fahrenheitResult.textContent = `${fahrenheit.toFixed(2)} °F`;
    kelvinResult.textContent = `${kelvin.toFixed(2)} K`;
}

function showError(message) {
    errorText.textContent = message;
    errorText.style.display = 'block';
}

function clearResults() {
    celsiusResult.textContent = '-- °C';
    fahrenheitResult.textContent = '-- °F';
    kelvinResult.textContent = '-- K';
}

tempInput.addEventListener('input', convertTemperature);
unitSelect.addEventListener('change', convertTemperature);
convertBtn.addEventListener('click', convertTemperature);
