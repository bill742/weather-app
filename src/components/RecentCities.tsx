import type { GeoLocation } from '../types/weather';
import PlaceList from './PlaceList';

interface Props {
    onClear: () => void;
    onSelect: (place: GeoLocation) => void;
    places: GeoLocation[];
}

const RecentCities = ({ onClear, onSelect, places }: Props) => (
    <section aria-labelledby="recent-heading">
        <div className="flex items-baseline justify-between">
            <h2 className="text-sm text-white/70" id="recent-heading">
                Recent searches
            </h2>
            <button
                className="cursor-pointer text-sm text-white/60 transition-colors hover:text-white"
                onClick={onClear}
                type="button"
            >
                Clear
            </button>
        </div>
        <PlaceList onSelect={onSelect} places={places} />
    </section>
);

RecentCities.displayName = 'RecentCities';

export default RecentCities;
