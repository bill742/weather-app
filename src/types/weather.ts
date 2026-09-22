export interface GeoLocation {
    country: string;
    lat: number;
    lon: number;
    name: string;
    state?: string;
}

export interface Coords {
    lat: number;
    lon: number;
}

export interface WeatherCondition {
    description: string;
    icon: string;
    id: number;
    main: string;
}

// Shape of the OpenWeatherMap /data/2.5/weather response (fields we use).
export interface WeatherData {
    coord?: Coords;
    dt: number;
    main: {
        feels_like: number;
        humidity: number;
        temp: number;
        temp_max: number;
        temp_min: number;
    };
    name: string;
    rain?: { '1h'?: number };
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    visibility?: number;
    weather: WeatherCondition[];
    wind: {
        deg: number;
        gust?: number;
        speed: number;
    };
}

export interface HourlyForecast {
    dt: number;
    icon: string;
    pop: number;
    temp: number;
    weatherId: number;
}

export interface DailyForecast {
    dt: number;
    icon: string;
    max: number;
    min: number;
    pop: number;
    rain?: number;
    weatherId: number;
}

// Everything the dashboard renders. Current conditions are required; the
// forecast and UV endpoints are optional extras that degrade to empty/null.
export interface WeatherBundle {
    current: WeatherData;
    daily: DailyForecast[];
    hourly: HourlyForecast[];
    uvi: null | number;
}

export type Unit = 'imperial' | 'metric';
