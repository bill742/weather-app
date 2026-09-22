import { useCallback, useState } from 'react';

import type { GeoLocation } from '../types/weather';

const STORAGE_KEY = 'city-weather:recent';
const MAX_RECENT = 5;

// Two geocoding results within ~1 km are the same place.
export const isSamePlace = (a: GeoLocation, b: GeoLocation) =>
    Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lon - b.lon) < 0.01;

const isPlace = (value: unknown): value is GeoLocation => {
    const place = value as GeoLocation;
    return (
        typeof place?.name === 'string' &&
        typeof place.country === 'string' &&
        typeof place.lat === 'number' &&
        typeof place.lon === 'number'
    );
};

// Storage can be unavailable (private mode, blocked site data) or hold
// anything, so every access is guarded and the data is validated.
const read = (): GeoLocation[] => {
    try {
        const parsed: unknown = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? '[]',
        );
        return Array.isArray(parsed)
            ? parsed.filter(isPlace).slice(0, MAX_RECENT)
            : [];
    } catch {
        return [];
    }
};

const write = (places: GeoLocation[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch {
        // Not persisted; the list still works for this visit.
    }
};

const useRecentCities = () => {
    const [recent, setRecent] = useState(read);

    const addRecent = useCallback((place: GeoLocation) => {
        const { country, lat, lon, name, state } = place;
        setRecent((prev) => {
            const next = [
                { country, lat, lon, name, state },
                ...prev.filter((p) => !isSamePlace(p, place)),
            ].slice(0, MAX_RECENT);
            write(next);
            return next;
        });
    }, []);

    const clearRecent = useCallback(() => {
        write([]);
        setRecent([]);
    }, []);

    return { addRecent, clearRecent, recent };
};

export default useRecentCities;
