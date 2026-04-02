import { useCallback, useEffect, useReducer, useRef } from 'react';
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
    fetchWeatherByCoords,
    fetchWeatherByLatLon,
} from '../utils/fetchWeather';
import formatTime from '../utils/formatTime';
import getGeolocation from '../utils/getGeolocation';
import CityPicker from './CityPicker';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

type WeatherFetcher = (signal: AbortSignal) => Promise<WeatherData | undefined>;

interface Props {
    searchQuery: string | null;
}

type State = {
    candidates: GeoLocation[];
    data: WeatherData | null;
    dataSource: DataSource;
    error: string | null;
    geo: GeoLocation | null;
    loading: boolean;
    unit: Unit;
};

type Action =
    | { type: 'FETCH_DONE' }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: WeatherData }
    | { type: 'SET_CANDIDATES'; payload: GeoLocation[] }
    | { type: 'SET_DATA_SOURCE'; payload: DataSource }
    | { type: 'SET_GEO'; payload: GeoLocation | null }
    | { type: 'SET_UNIT'; payload: Unit };

const initialState: State = {
    candidates: [],
    data: null,
    dataSource: 'geolocation',
    error: null,
    geo: null,
    loading: true,
    unit: 'metric',
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'FETCH_DONE':
            return { ...state, loading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'FETCH_START':
            return { ...state, error: null, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, data: action.payload, loading: false };
        case 'SET_CANDIDATES':
            return { ...state, candidates: action.payload };
        case 'SET_DATA_SOURCE':
            return { ...state, dataSource: action.payload };
        case 'SET_GEO':
            return { ...state, geo: action.payload };
        case 'SET_UNIT':
            return { ...state, unit: action.payload };
    }
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
    const [state, dispatch] = useReducer(reducer, initialState);
    const { candidates, data, dataSource, error, geo, loading, unit } = state;
    const abortControllerRef = useRef<AbortController | null>(null);
    const coordsRef = useRef<GeolocationCoordinates | null>(null);
    const selectedCoordsRef = useRef<{ lat: number; lon: number } | null>(null);

    const fetchAndSet = useCallback(async (fetcher: WeatherFetcher) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        dispatch({ type: 'FETCH_START' });

        try {
            const result = await fetcher(abortControllerRef.current.signal);
            if (result) dispatch({ payload: result, type: 'FETCH_SUCCESS' });
            else dispatch({ type: 'FETCH_DONE' });
        } catch (err) {
            dispatch({ payload: getErrorMessage(err), type: 'FETCH_ERROR' });
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
                if (geoResult)
                    dispatch({ payload: geoResult, type: 'SET_GEO' });
            } catch (err) {
                dispatch({
                    payload: getErrorMessage(err),
                    type: 'FETCH_ERROR',
                });
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
        dispatch({ payload: 'search', type: 'SET_DATA_SOURCE' });
        dispatch({ payload: [], type: 'SET_CANDIDATES' });
        dispatch({ type: 'FETCH_START' });

        const controller = new AbortController();

        void fetchGeoByCity(searchQuery, controller.signal).then((results) => {
            if (results.length === 0) {
                dispatch({
                    payload: 'City not found.',
                    type: 'FETCH_ERROR',
                });
            } else if (results.length === 1) {
                const [city] = results;
                selectedCoordsRef.current = { lat: city.lat, lon: city.lon };
                dispatch({ payload: city, type: 'SET_GEO' });
                void fetchAndSet((signal) =>
                    fetchWeatherByLatLon(city.lat, city.lon, unit, signal),
                );
            } else {
                dispatch({ payload: results, type: 'SET_CANDIDATES' });
                dispatch({ type: 'FETCH_DONE' });
            }
        });

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const handleCandidateSelect = useCallback(
        (city: GeoLocation) => {
            selectedCoordsRef.current = { lat: city.lat, lon: city.lon };
            dispatch({ payload: [], type: 'SET_CANDIDATES' });
            dispatch({ payload: city, type: 'SET_GEO' });
            void fetchAndSet((signal) =>
                fetchWeatherByLatLon(city.lat, city.lon, unit, signal),
            );
        },
        [fetchAndSet, unit],
    );

    const toggleUnit = useCallback(() => {
        const newUnit: Unit = unit === 'metric' ? 'imperial' : 'metric';
        dispatch({ payload: newUnit, type: 'SET_UNIT' });

        if (dataSource === 'geolocation' && coordsRef.current) {
            fetchAndSet((signal) =>
                fetchWeatherByCoords(coordsRef.current!, newUnit, signal),
            );
        } else if (dataSource === 'search' && selectedCoordsRef.current) {
            const { lat, lon } = selectedCoordsRef.current;
            fetchAndSet((signal) =>
                fetchWeatherByLatLon(lat, lon, newUnit, signal),
            );
        }
    }, [dataSource, fetchAndSet, unit]);

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

    if (candidates.length > 0) {
        return (
            <CityPicker
                candidates={candidates}
                onSelect={handleCandidateSelect}
            />
        );
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
