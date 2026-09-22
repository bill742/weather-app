import type { GeoLocation } from '../types/weather';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

interface Props {
    onSelect: (place: GeoLocation) => void;
    places: GeoLocation[];
}

// A list of places, each a button showing the name over its state/country.
const PlaceList = ({ onSelect, places }: Props) => (
    <ul className="divide-y divide-white/10">
        {places.map((place) => {
            const countryName = regionNames.of(place.country) ?? place.country;
            const region = [place.state, countryName]
                .filter((part) => part && part !== place.name)
                .join(', ');
            return (
                <li key={`${place.lat},${place.lon}`}>
                    <button
                        aria-label={[place.name, region]
                            .filter(Boolean)
                            .join(', ')}
                        className="flex w-full cursor-pointer flex-col py-3 text-left text-white transition-colors hover:text-(--accent)"
                        onClick={() => onSelect(place)}
                        type="button"
                    >
                        <span>{place.name}</span>
                        {region && (
                            <span className="text-sm text-white/60">
                                {region}
                            </span>
                        )}
                    </button>
                </li>
            );
        })}
    </ul>
);

PlaceList.displayName = 'PlaceList';

export default PlaceList;
