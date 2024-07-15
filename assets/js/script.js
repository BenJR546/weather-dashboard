const apiKey = 'b47a128972f9b57f908c121df0d96dd6'; // Replace with your actual OpenWeatherMap API key

function getWeatherEmoji(weather) {
    switch (weather) {
        case 'Clear':
            return '☀️';
        case 'Clouds':
            return '☁️';
        case 'Rain':
        case 'Drizzle':
        case 'Mist':
            return '🌧️';
        case 'Thunderstorm':
            return '⛈️';
        case 'Snow':
            return '❄️';
        default:
            return '';
    }
}

function fetchWeatherData(cityName) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: url,
        type: "GET",
        success: function(data) {
            const cityDiv = $('<div class="mb-4"></div>');
            cityDiv.html(`
                <div class="rounded shadow p-4">
                    <h2 class="text-2xl">${data.name}, ${data.sys.country} ${getWeatherEmoji(data.weather[0].main)}</h2>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                </div>
            `);
            $('#weather-info').append(cityDiv);

            fetchForecastData(cityName, cityDiv);
        },
        error: function(error) {
            console.log('There was a problem with the fetch operation: ' + error.message);
        }
    });
}

function fetchForecastData(cityName, cityDiv) {
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: url,
        type: "GET",
        success: function(data) {
            const forecastDiv = $('<div class="grid grid-cols-5 gap-4"></div>');
            data.list.forEach((forecast, index) => {
                if (index % 8 === 0) {
                    forecastDiv.append(`
                        <div class="rounded shadow p-4">
                            <h2 class="text-xl">${new Date(forecast.dt_txt).toLocaleDateString()} ${getWeatherEmoji(forecast.weather[0].main)}</h2>
                            <p>Weather: ${forecast.weather[0].description}</p>
                            <p>Temperature: ${forecast.main.temp}°C</p>
                            <p>Humidity: ${forecast.main.humidity}%</p>
                            <p>Wind Speed: ${forecast.wind.speed} m/s</p>
                        </div>
                    `);
                }
            });
            cityDiv.append(forecastDiv);
        },
        error: function(error) {
            console.log('There was a problem with the fetch operation: ' + error.message);
        }
    });
}

$('#city-form').on('submit', function(event) {
    event.preventDefault();
    const cityName = $('#city-input').val();
    $('#weather-info').empty(); // Clear the weather info
    fetchWeatherData(cityName);

    // Add city to history
    const cityHistoryDiv = $('<div class="city-history-item p-2 rounded shadow bg-blue-500 text-white w-full mt-2 cursor-pointer"></div>');
    cityHistoryDiv.text(cityName);
    cityHistoryDiv.on('click', function() {
        $('#weather-info').empty(); // Clear the weather info
        fetchWeatherData(cityName);
    });
    $('#city-history').append(cityHistoryDiv);

    // Store the city name in localStorage
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
    cityHistory.push(cityName);
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
});

// On page load, load the city history from localStorage
$(document).ready(function() {
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
    cityHistory.forEach(cityName => {
        const cityHistoryDiv = $('<div class="city-history-item p-2 rounded shadow bg-blue-500 text-white w-full mt-2 cursor-pointer"></div>');
        cityHistoryDiv.text(cityName);
        cityHistoryDiv.on('click', function() {
            $('#weather-info').empty(); // Clear the weather info
            fetchWeatherData(cityName);
        });
        $('#city-history').append(cityHistoryDiv);
    });
});
