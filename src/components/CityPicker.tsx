import type { GeoLocation } from '../types/weather';
import PlaceList from './PlaceList';

interface Props {
    candidates: GeoLocation[];
    onSelect: (city: GeoLocation) => void;
}

const CityPicker = ({ candidates, onSelect }: Props) => (
    <section aria-labelledby="city-picker-heading">
        <h2 className="mb-2 text-sm text-white/70" id="city-picker-heading">
            More than one place matches. Which did you mean?
        </h2>
        <PlaceList onSelect={onSelect} places={candidates} />
    </section>
);

CityPicker.displayName = 'CityPicker';

export default CityPicker;
