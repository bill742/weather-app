/**
 * Fetch weather data from OpenWeatherMap API
 * @param {GeolocationCoordinates} coords - User's coordinates
 * @param {string} unit - Temperature unit ('metric' or 'imperial')
 * @param {AbortSignal} signal - Signal to cancel the request
 * @returns {Promise<Object|undefined>} Weather API response data, or undefined if aborted
 */

const apiUrl = process.env.OPENWEATHER_API_URL;
const apiKey = process.env.OPENWEATHER_API_KEY;

const fetchAndDisplayWeather = async (url, signal) => {
    try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        if (error.name !== 'AbortError') {
            throw error;
        }
    }
};

export const displayWeatherByGeoLocation = (coords, unit, signal) => {
    const { latitude: lat, longitude: lon } = coords;
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    const data = fetchAndDisplayWeather(url, signal);
    return data;
};

export const displayWeatherSearchResults = (q, unit, signal) => {
    const url = `${apiUrl}?q=${q}&units=${unit}&appid=${apiKey}`;
    const data = fetchAndDisplayWeather(url, signal);
    return data;
};
