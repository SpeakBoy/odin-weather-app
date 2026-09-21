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

    console.log(processedWeatherData);
});

class Forecast {
    constructor(address, currentTemp, conditions, tempHi, tempLo) {
        this.address = address;
        this.currentTemp = currentTemp;
        this.conditions = conditions;
        this.tempHi = tempHi;
        this.tempLo = tempLo;
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
    const conditions = data.currentConditions.conditions;
    const tempHi = data.days[0].tempmax;
    const tempLo = data.days[0].tempmin;

    return new Forecast(address, currentTemp, conditions, tempHi, tempLo);
}