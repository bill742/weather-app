import { useCallback, useEffect, useReducer, useRef } from 'react';

import type {
    Coords,
    GeoLocation,
    Unit,
    WeatherBundle,
} from '../types/weather';
import {
    fetchGeoByCity,
    fetchGeoByCoords,
    fetchWeatherBundle,
} from '../utils/fetchWeather';
import getGeolocation from '../utils/getGeolocation';

type State = {
    candidates: GeoLocation[];
    data: null | WeatherBundle;
    error: null | string;
    geo: GeoLocation | null;
    loading: boolean;
    unit: Unit;
};

type Action =
    | { payload: GeoLocation | null; type: 'SET_GEO' }
    | { payload: GeoLocation[]; type: 'SET_CANDIDATES' }
    | { payload: string; type: 'FETCH_ERROR' }
    | { payload: Unit; type: 'SET_UNIT' }
    | { payload: WeatherBundle; type: 'FETCH_SUCCESS' }
    | { type: 'FETCH_DONE' }
    | { type: 'FETCH_START' };

const initialState: State = {
    candidates: [],
    data: null,
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
                return 'Location access is off. Search for a city to see its weather.';
            case GeolocationPositionError.POSITION_UNAVAILABLE:
                return 'Your location isn’t available. Search for a city instead.';
            case GeolocationPositionError.TIMEOUT:
                return 'Finding your location timed out. Search for a city instead.';
        }
    }
    return 'Weather data couldn’t be loaded. Check your connection and try again.';
};

// `onPlaceLoaded` fires when weather for a searched or picked place loads
// (not for the device location or a unit change).
const useWeather = (
    searchQuery: null | string,
    onPlaceLoaded?: (place: GeoLocation) => void,
) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const abortControllerRef = useRef<AbortController | null>(null);
    // Coordinates of whatever is on screen (device location or chosen city),
    // so a unit toggle can re-fetch the same place.
    const coordsRef = useRef<Coords | null>(null);
    // Once the user searches, a slow geolocation lookup must not overwrite it.
    const hasSearchedRef = useRef(false);

    // Latest-value ref so the mount/search effects can read the current unit
    // without making `unit` a reactive dependency (toggling the unit is handled
    // by setUnit, which re-fetches; the effects must not re-run on it).
    const unitRef = useRef(state.unit);
    useEffect(() => {
        unitRef.current = state.unit;
    }, [state.unit]);

    const onPlaceLoadedRef = useRef(onPlaceLoaded);
    useEffect(() => {
        onPlaceLoadedRef.current = onPlaceLoaded;
    }, [onPlaceLoaded]);

    const load = useCallback(
        async (coords: Coords, unit: Unit, place?: GeoLocation) => {
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();
            coordsRef.current = coords;

            dispatch({ type: 'FETCH_START' });

            try {
                const result = await fetchWeatherBundle(
                    coords,
                    unit,
                    abortControllerRef.current.signal,
                );
                if (result) {
                    dispatch({ payload: result, type: 'FETCH_SUCCESS' });
                    if (place) onPlaceLoadedRef.current?.(place);
                } else dispatch({ type: 'FETCH_DONE' });
            } catch (err) {
                dispatch({
                    payload: getErrorMessage(err),
                    type: 'FETCH_ERROR',
                });
            }
        },
        [],
    );

    // Geolocation fetch on mount
    useEffect(() => {
        const initGeolocation = async () => {
            try {
                const position = await getGeolocation();
                if (hasSearchedRef.current) return;
                const coords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };
                const [, geoResult] = await Promise.all([
                    load(coords, unitRef.current),
                    fetchGeoByCoords(coords, new AbortController().signal),
                ]);
                if (geoResult && !hasSearchedRef.current)
                    dispatch({ payload: geoResult, type: 'SET_GEO' });
            } catch (err) {
                if (hasSearchedRef.current) return;
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
    }, [load]);

    // Search query changes
    useEffect(() => {
        if (!searchQuery) return;
        hasSearchedRef.current = true;
        dispatch({ payload: [], type: 'SET_CANDIDATES' });
        dispatch({ type: 'FETCH_START' });

        const controller = new AbortController();

        void fetchGeoByCity(searchQuery, controller.signal).then((results) => {
            if (controller.signal.aborted) return;
            if (results.length === 0) {
                dispatch({
                    payload: `No city called “${searchQuery}” was found. Check the spelling or try a nearby city.`,
                    type: 'FETCH_ERROR',
                });
            } else if (results.length === 1) {
                const [city] = results;
                dispatch({ payload: city, type: 'SET_GEO' });
                void load(
                    { lat: city.lat, lon: city.lon },
                    unitRef.current,
                    city,
                );
            } else {
                dispatch({ payload: results, type: 'SET_CANDIDATES' });
                dispatch({ type: 'FETCH_DONE' });
            }
        });

        return () => controller.abort();
    }, [searchQuery, load]);

    // Load a known place directly: a city-picker choice or a recent city.
    const selectPlace = useCallback(
        (city: GeoLocation) => {
            hasSearchedRef.current = true;
            dispatch({ payload: [], type: 'SET_CANDIDATES' });
            dispatch({ payload: city, type: 'SET_GEO' });
            void load({ lat: city.lat, lon: city.lon }, unitRef.current, city);
        },
        [load],
    );

    const setUnit = useCallback(
        (unit: Unit) => {
            if (unit === unitRef.current) return;
            dispatch({ payload: unit, type: 'SET_UNIT' });
            if (coordsRef.current) void load(coordsRef.current, unit);
        },
        [load],
    );

    return { ...state, selectPlace, setUnit };
};

export default useWeather;
