import { useCallback, useEffect, useRef, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

import type {
    DataSource,
    GeoLocation,
    Unit,
    WeatherData,
} from '../types/weather';
import {
    fetchGeoByCity,
    fetchGeoByCoords,
    fetchWeatherByCity,
    fetchWeatherByCoords,
} from '../utils/fetchWeather';
import formatTime from '../utils/formatTime';
import getGeolocation from '../utils/getGeolocation';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

type WeatherFetcher = (signal: AbortSignal) => Promise<WeatherData | undefined>;

interface Props {
    searchQuery: string | null;
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof GeolocationPositionError) {
        switch (error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
                return 'Location permission denied. Please enable location access.';
            case GeolocationPositionError.POSITION_UNAVAILABLE:
                return 'Location information is unavailable.';
            case GeolocationPositionError.TIMEOUT:
                return 'Location request timed out. Please try again.';
        }
    }
    return 'Unable to load weather data. Please try again.';
};

const WeatherCard = ({ searchQuery }: Props) => {
    const [data, setData] = useState<WeatherData | null>(null);
    const [geo, setGeo] = useState<GeoLocation | null>(null);
    const [dataSource, setDataSource] = useState<DataSource>('geolocation');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [unit, setUnit] = useState<Unit>('metric');
    const abortControllerRef = useRef<AbortController | null>(null);
    const coordsRef = useRef<GeolocationCoordinates | null>(null);

    const fetchAndSet = useCallback(async (fetcher: WeatherFetcher) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            const result = await fetcher(abortControllerRef.current.signal);
            if (result) setData(result);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    // Geolocation fetch on mount
    useEffect(() => {
        const initGeolocation = async () => {
            try {
                const position = await getGeolocation();
                coordsRef.current = position.coords;
                const [, geoResult] = await Promise.all([
                    fetchAndSet((signal) =>
                        fetchWeatherByCoords(position.coords, unit, signal),
                    ),
                    fetchGeoByCoords(
                        position.coords,
                        new AbortController().signal,
                    ),
                ]);
                if (geoResult) setGeo(geoResult);
            } catch (err) {
                setError(getErrorMessage(err));
                setLoading(false);
            }
        };

        initGeolocation();

        return () => {
            abortControllerRef.current?.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Search query changes
    useEffect(() => {
        if (!searchQuery) return;
        setDataSource('search');
        void Promise.all([
            fetchAndSet((signal) =>
                fetchWeatherByCity(searchQuery, unit, signal),
            ),
            fetchGeoByCity(searchQuery, new AbortController().signal),
        ]).then(([, geoResult]) => {
            setGeo(geoResult ?? null);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const toggleUnit = useCallback(() => {
        const newUnit: Unit = unit === 'metric' ? 'imperial' : 'metric';
        setUnit(newUnit);

        if (dataSource === 'geolocation' && coordsRef.current) {
            fetchAndSet((signal) =>
                fetchWeatherByCoords(coordsRef.current!, newUnit, signal),
            );
        } else if (dataSource === 'search' && searchQuery) {
            fetchAndSet((signal) =>
                fetchWeatherByCity(searchQuery, newUnit, signal),
            );
        }
    }, [dataSource, fetchAndSet, searchQuery, unit]);

    if (loading) {
        return (
            <div
                aria-label="Loading weather"
                className="sk-chase"
                role="status"
            >
                {Array.from({ length: 6 }).map((_, i) => (
                    <div className="sk-chase-dot" key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-sm text-white/80">{error}</p>;
    }

    if (!data) return null;

    const { feels_like, temp } = data.main;
    const { id, main } = data.weather[0];
    const { sunrise, sunset } = data.sys;
    const { timezone } = data;
    const country = geo?.country || '';
    const countryName = regionNames.of(country) ?? country;
    const locationParts = [data.name, geo?.state, countryName].filter(Boolean);
    const unitIcon = unit === 'metric' ? '°C' : '°F';
    const unitBtnText =
        unit === 'metric' ? 'View in Fahrenheit' : 'View in Celsius';

    return (
        <div className="flex w-full flex-col items-center gap-1 text-center">
            <p className="text-sm font-medium tracking-widest text-white/60 uppercase">
                Current conditions
            </p>
            <h2 className="mb-2 text-2xl font-semibold text-white">
                {locationParts.join(', ')}
            </h2>
            <i
                aria-hidden="true"
                className={`owf owf-${id} text-8xl text-white`}
            />
            <p className="mt-2 text-lg text-white/80">{main}</p>
            <p className="text-6xl font-bold text-white">
                {Math.round(temp)}
                {unitIcon}
            </p>
            <p className="text-sm text-white/60">
                Feels like {Math.round(feels_like)}
                {unitIcon}
            </p>
            <div className="flex flex-row gap-x-2 items-center mt-4">
                <div className="flex flex-row gap-x-2 items-center">
                    <FaSun className="text-white" />{' '}
                    <p className="text-white/80 text-sm">
                        Sunrise: {formatTime(sunrise, timezone)}
                    </p>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                    <FaMoon className="text-white" />
                    <p className="text-white/80 text-sm">
                        Sunset: {formatTime(sunset, timezone)}
                    </p>
                </div>
            </div>
            <button
                className="mt-6 cursor-pointer rounded-full border border-white/30 bg-white/15 px-5 py-2 text-sm text-white/80 backdrop-blur-sm transition hover:bg-white/25 hover:text-white active:scale-95"
                onClick={toggleUnit}
                type="button"
            >
                {unitBtnText}
            </button>
        </div>
    );
};

WeatherCard.displayName = 'WeatherCard';

export default WeatherCard;
