import type { GeoLocation, Unit, WeatherData } from '../types/weather';

const apiUrl = import.meta.env.VITE_OPENWEATHER_API_URL as string;
const geoUrl = import.meta.env.VITE_OPENWEATHER_GEO_URL as string;
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string;

const fetchWeather = async (
    url: string,
    signal: AbortSignal,
): Promise<WeatherData | undefined> => {
    try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        return (await response.json()) as WeatherData;
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            throw error;
        }
    }
};

export const fetchWeatherByCity = (
    q: string,
    unit: Unit,
    signal: AbortSignal,
): Promise<WeatherData | undefined> => {
    const url = `${apiUrl}?q=${encodeURIComponent(q)}&units=${unit}&appid=${apiKey}`;
    return fetchWeather(url, signal);
};

export const fetchWeatherByCoords = (
    coords: GeolocationCoordinates,
    unit: Unit,
    signal: AbortSignal,
): Promise<WeatherData | undefined> => {
    const url = `${apiUrl}?lat=${coords.latitude}&lon=${coords.longitude}&units=${unit}&appid=${apiKey}`;
    return fetchWeather(url, signal);
};

export const fetchGeoByCoords = async (
    coords: GeolocationCoordinates,
    signal: AbortSignal,
): Promise<GeoLocation | undefined> => {
    try {
        const url = `${geoUrl}/reverse?lat=${coords.latitude}&lon=${coords.longitude}&limit=1&appid=${apiKey}`;
        const response = await fetch(url, { signal });
        if (!response.ok) return undefined;
        const results = (await response.json()) as GeoLocation[];
        return results[0];
    } catch {
        return undefined;
    }
};

export const fetchGeoByCity = async (
    q: string,
    signal: AbortSignal,
): Promise<GeoLocation | undefined> => {
    try {
        const url = `${geoUrl}/direct?q=${encodeURIComponent(q)}&limit=1&appid=${apiKey}`;
        const response = await fetch(url, { signal });
        if (!response.ok) return undefined;
        const results = (await response.json()) as GeoLocation[];
        return results[0];
    } catch {
        return undefined;
    }
};
