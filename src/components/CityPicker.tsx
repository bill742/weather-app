import type { GeoLocation } from '../types/weather';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

interface Props {
    candidates: GeoLocation[];
    onSelect: (city: GeoLocation) => void;
}

const CityPicker = ({ candidates, onSelect }: Props) => {
    return (
        <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md">
            <p className="mb-3 text-sm font-medium tracking-widest text-white/60 uppercase">
                Multiple cities found
            </p>
            <ul className="flex flex-col gap-1">
                {candidates.map((city) => {
                    const countryName =
                        regionNames.of(city.country) ?? city.country;
                    const label = [city.name, city.state, countryName]
                        .filter(Boolean)
                        .join(', ');
                    return (
                        <li key={`${city.lat},${city.lon}`}>
                            <button
                                className="w-full cursor-pointer rounded-xl px-4 py-3 text-left text-white/80 transition hover:bg-white/15 hover:text-white"
                                onClick={() => onSelect(city)}
                                type="button"
                            >
                                {label}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

CityPicker.displayName = 'CityPicker';

export default CityPicker;
