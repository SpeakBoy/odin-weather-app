const API_KEY = "T4GJRJL4DW4FV6R2L5GK9CERE";

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