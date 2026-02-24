const API_KEY = '9da6b78750f1c0c1973b0ce6469e4a50';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherInfo = document.getElementById('weather-info');

searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading();
    try {
        const response = await fetch(
            `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found');
            }
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        displayWeather(data);
        cityInput.value = '';
    } catch (err) {
        showError(err.message);
    }
}

function displayWeather(data) {
    const { name, sys, main, weather, wind, clouds } = data;
    const now = new Date();

    document.getElementById('city-name').textContent = 
        `${name}, ${sys.country}`;
    document.getElementById('date').textContent = 
        now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    
    document.getElementById('temperature').textContent = 
        Math.round(main.temp);
    document.getElementById('feels-like').textContent = 
        `${Math.round(main.feels_like)}°C`;
    document.getElementById('humidity').textContent = 
        `${main.humidity}%`;
    document.getElementById('wind-speed').textContent = 
        `${(wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('pressure').textContent = 
        `${main.pressure} hPa`;
    
    document.getElementById('description').textContent = 
        weather[0].description;
    document.getElementById('weather-icon').src = 
        `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    
    hideLoading();
    hideError();
    weatherInfo.classList.remove('hidden');
}

function showLoading() {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    weatherInfo.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    loading.classList.add('hidden');
    weatherInfo.classList.add('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

// Optional: Load weather for a default city on page load
window.addEventListener('load', () => {
    cityInput.value = 'London';
    searchWeather();
});
