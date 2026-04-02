export interface GeoLocation {
    country: string;
    lat: number;
    lon: number;
    name: string;
    state?: string;
}

export interface WeatherData {
    main: {
        feels_like: number;
        temp: number;
    };
    name: string;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    weather: Array<{
        id: number;
        main: string;
    }>;
}

export type DataSource = 'geolocation' | 'search';
export type Unit = 'imperial' | 'metric';
