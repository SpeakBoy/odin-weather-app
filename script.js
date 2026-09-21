const API_KEY = "T4GJRJL4DW4FV6R2L5GK9CERE";

const searchForm = document.querySelector("form");
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!searchForm.checkValidity())
    {
        searchForm.reportValidity();
        return;
    }

    const location = document.querySelector("#location").value;

    const weatherData = await fetchWeatherData(location);
    const processedWeatherData = processWeatherData(weatherData);
    const weatherDataDisplayDiv = document.querySelector("#weather-data");
    weatherDataDisplayDiv.style.display = "flex";
    const toggleScaleButton = document.querySelector("#toggle-scale");
    toggleScaleButton.addEventListener("click", () => {
        Forecast.convert(processedWeatherData);
        displayProcessedWeatherData(processedWeatherData);
    });
    displayProcessedWeatherData(processedWeatherData);
});

class Forecast {
    constructor(address, currentTemp, feelsLike, conditions, icon) {
        this.address = address;
        this.currentTemp = currentTemp;
        this.feelsLike = feelsLike;
        this.conditions = conditions;
        this.icon = icon;
        this.currentScale = "°F";
    }

    static convert(data)
    {
        if (data.currentScale === "°F") {
            data.currentTemp = Math.round(((data.currentTemp - 32) * 5 / 9) * 10) / 10;
            data.feelsLike = Math.round(((data.feelsLike - 32) * 5 / 9) * 10) / 10;
        }
        else {
            data.currentTemp = Math.round(((data.currentTemp * 9 / 5) + 32) * 10) / 10;
            data.feelsLike = Math.round(((data.feelsLike * 9 / 5) + 32) * 10) / 10;
        }
        data.currentScale = data.currentScale === "°F" ? "°C" : "°F";        
    }
}

async function fetchWeatherData(location) {
    try {
        const request = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;
        const response = await fetch(request);
        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}, URL: ${response.url}`);
            return;
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log(`HTTP error occurred: ${error.message}`);
    }
}

function processWeatherData(data) {
    const address = data.address;
    const currentTemp = data.currentConditions.temp;
    const feelsLike = data.currentConditions.feelslike;
    const conditions = data.currentConditions.conditions;
    const icon = data.currentConditions.icon;

    return new Forecast(address, currentTemp, feelsLike, conditions, icon);
}

function displayProcessedWeatherData(data) {
    const addressDisplay = document.querySelector("#address");
    addressDisplay.textContent = data.address;

    const currentTempDisplay = document.querySelector("#current-temp");
    currentTempDisplay.textContent = `${data.currentTemp}°`;

    const feelsLikeDisplay = document.querySelector("#feels-like");
    feelsLikeDisplay.textContent = `Feels Like: ${data.feelsLike}°`;

    const conditionsDisplay = document.querySelector("#conditions");
    conditionsDisplay.textContent = data.conditions;

    const weatherIconDisplay = document.querySelector("#icon");
    weatherIconDisplay.src = `./icons/${data.icon}.svg`;

    const toggleScaleButton = document.querySelector("#toggle-scale");
    toggleScaleButton.textContent = data.currentScale;
}