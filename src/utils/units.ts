import type { Unit } from '../types/weather';

// OpenWeatherMap returns wind in m/s for metric and mph for imperial.
export const formatWind = (speed: number, unit: Unit) =>
    unit === 'metric'
        ? { label: 'km/h', value: Math.round(speed * 3.6) }
        : { label: 'mph', value: Math.round(speed) };

// Visibility is always metres, capped at 10 km by the API.
export const formatVisibility = (metres: number, unit: Unit) =>
    unit === 'metric'
        ? { label: 'km', value: +(metres / 1000).toFixed(1) }
        : { label: 'mi', value: +(metres / 1609.344).toFixed(1) };

// Precipitation is always millimetres.
export const formatPrecip = (mm: number, unit: Unit) =>
    unit === 'metric'
        ? `${+mm.toFixed(1)} mm`
        : `${+(mm / 25.4).toFixed(2)} in`;

// Magnus approximation, computed in °C and converted back for imperial.
export const dewPoint = (temp: number, humidity: number, unit: Unit) => {
    const c = unit === 'metric' ? temp : ((temp - 32) * 5) / 9;
    const gamma = Math.log(humidity / 100) + (17.62 * c) / (243.12 + c);
    const dew = (243.12 * gamma) / (17.62 - gamma);
    return Math.round(unit === 'metric' ? dew : (dew * 9) / 5 + 32);
};

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export const compassPoint = (deg: number) =>
    COMPASS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];

export const uvCategory = (uvi: number) => {
    if (uvi < 3) return { advice: 'No protection needed', label: 'Low' };
    if (uvi < 6)
        return { advice: 'Wear sunscreen around midday', label: 'Moderate' };
    if (uvi < 8) return { advice: 'Seek shade around midday', label: 'High' };
    if (uvi < 11)
        return { advice: 'Limit time in the sun', label: 'Very high' };
    return { advice: 'Avoid the midday sun', label: 'Extreme' };
};
