import type { GeoLocation, WeatherBundle } from '../types/weather';
import CurrentConditions from './CurrentConditions';

export interface Props {
    candidates: GeoLocation[];
    data: null | WeatherBundle;
    error: null | string;
    geo: GeoLocation | null;
    loading: boolean;
}

// The left-hand panel is in one of four states: the weather itself, a spinner,
// a nudge towards the city list, or the error/empty message.
const HeroContent = ({ candidates, data, error, geo, loading }: Props) => {
    if (data) return <CurrentConditions data={data} geo={geo} />;

    if (loading)
        return (
            <output aria-label="Loading weather" className="sk-chase">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div className="sk-chase-dot" key={i} />
                ))}
            </output>
        );

    if (candidates.length > 0)
        return (
            <p className="max-w-md text-2xl text-white">
                Choose a place from the list to see its weather.
            </p>
        );

    return (
        <p className="max-w-lg text-3xl leading-snug font-light text-white">
            {error ?? 'Search for a city to see its weather.'}
        </p>
    );
};

HeroContent.displayName = 'HeroContent';

export default HeroContent;
