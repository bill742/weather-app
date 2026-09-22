import type {
    Coords,
    DailyForecast,
    GeoLocation,
    HourlyForecast,
    Unit,
    WeatherBundle,
    WeatherCondition,
    WeatherData,
} from '../types/weather';

const apiUrl = import.meta.env.VITE_OPENWEATHER_API_URL as string;
const geoUrl = import.meta.env.VITE_OPENWEATHER_GEO_URL as string;
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string;

// VITE_OPENWEATHER_API_URL points at the current-weather endpoint
// (…/data/2.5/weather); the forecast and UV endpoints live alongside it.
const dataUrl = apiUrl.replace(/\/weather\/?$/, '');

const HOURLY_SLOTS = 8; // 8 × 3h = the next 24 hours
const DAILY_DAYS = 7;

interface ThreeHourResponse {
    city: { timezone: number };
    list: Array<{
        dt: number;
        main: { temp: number; temp_max: number; temp_min: number };
        pop: number;
        weather: WeatherCondition[];
    }>;
}

interface DailyResponse {
    list: Array<{
        dt: number;
        pop: number;
        rain?: number;
        temp: { max: number; min: number };
        weather: WeatherCondition[];
    }>;
}

const isAbort = (error: unknown) =>
    error instanceof Error && error.name === 'AbortError';

const getJson = async <T>(url: string, signal: AbortSignal): Promise<T> => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }
    return (await response.json()) as T;
};

// Optional endpoints: a failure (other than an abort) resolves to `fallback`
// so the dashboard still renders current conditions.
const getOptional = async <T>(
    url: string,
    signal: AbortSignal,
    fallback: T,
): Promise<T> => {
    try {
        return await getJson<T>(url, signal);
    } catch (error) {
        if (isAbort(error)) throw error;
        return fallback;
    }
};

// The daily endpoint isn't on every OpenWeatherMap plan. If it's unavailable,
// roll the 3-hour forecast (5 days) up into days in the city's local time.
const dailyFromThreeHour = (forecast: ThreeHourResponse): DailyForecast[] => {
    const offset = forecast.city.timezone;
    const days = new Map<string, ThreeHourResponse['list']>();

    for (const slot of forecast.list) {
        const key = new Date((slot.dt + offset) * 1000)
            .toISOString()
            .slice(0, 10);
        days.set(key, [...(days.get(key) ?? []), slot]);
    }

    return [...days.values()].map((slots) => {
        // Represent the day by the slot closest to local midday.
        const midday = slots.reduce((best, slot) => {
            const hour = new Date((slot.dt + offset) * 1000).getUTCHours();
            const bestHour = new Date((best.dt + offset) * 1000).getUTCHours();
            return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? slot : best;
        });
        return {
            dt: midday.dt,
            icon: midday.weather[0].icon,
            max: Math.max(...slots.map((s) => s.main.temp_max)),
            min: Math.min(...slots.map((s) => s.main.temp_min)),
            pop: Math.max(...slots.map((s) => s.pop)),
            weatherId: midday.weather[0].id,
        };
    });
};

export const fetchWeatherBundle = async (
    { lat, lon }: Coords,
    unit: Unit,
    signal: AbortSignal,
): Promise<undefined | WeatherBundle> => {
    const query = `lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

    try {
        const [current, threeHour, daily, uv] = await Promise.all([
            getJson<WeatherData>(`${apiUrl}?${query}`, signal),
            getOptional<null | ThreeHourResponse>(
                `${dataUrl}/forecast?${query}`,
                signal,
                null,
            ),
            getOptional<DailyResponse | null>(
                `${dataUrl}/forecast/daily?${query}&cnt=${DAILY_DAYS}`,
                signal,
                null,
            ),
            getOptional<null | { value: number }>(
                `${dataUrl}/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
                signal,
                null,
            ),
        ]);

        const hourly: HourlyForecast[] = (threeHour?.list ?? [])
            .slice(0, HOURLY_SLOTS)
            .map((slot) => ({
                dt: slot.dt,
                icon: slot.weather[0].icon,
                pop: slot.pop,
                temp: slot.main.temp,
                weatherId: slot.weather[0].id,
            }));

        let days: DailyForecast[] = [];
        if (daily?.list.length) {
            days = daily.list.map((day) => ({
                dt: day.dt,
                icon: day.weather[0].icon,
                max: day.temp.max,
                min: day.temp.min,
                pop: day.pop,
                rain: day.rain,
                weatherId: day.weather[0].id,
            }));
        } else if (threeHour) {
            days = dailyFromThreeHour(threeHour);
        }

        return {
            current,
            daily: days.slice(0, DAILY_DAYS),
            hourly,
            uvi: typeof uv?.value === 'number' ? uv.value : null,
        };
    } catch (error) {
        if (!isAbort(error)) throw error;
    }
};

export const fetchGeoByCoords = async (
    { lat, lon }: Coords,
    signal: AbortSignal,
): Promise<GeoLocation | undefined> => {
    try {
        const url = `${geoUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
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
): Promise<GeoLocation[]> => {
    try {
        const url = `${geoUrl}/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`;
        const response = await fetch(url, { signal });
        if (!response.ok) return [];
        return (await response.json()) as GeoLocation[];
    } catch {
        return [];
    }
};
