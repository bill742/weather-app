import type { GeoLocation, WeatherBundle, WeatherData } from '../types/weather';
import formatTime, { formatLongDate } from '../utils/formatTime';
import WeatherIcon from './WeatherIcon';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

interface Props {
    data: WeatherBundle;
    geo: GeoLocation | null;
}

const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

// A plain sentence about the rest of the day, e.g. "Expect a high of 18° and
// a low of 11°, with a 70% chance of rain."
const summarize = ({ daily }: WeatherBundle) => {
    const today = daily[0];
    if (!today) return null;

    const isSnow = today.weatherId >= 600 && today.weatherId < 700;
    const chance =
        today.pop >= 0.3
            ? `, with a ${Math.round(today.pop * 100)}% chance of ${isSnow ? 'snow' : 'rain'}`
            : '';
    return `Expect a high of ${Math.round(today.max)}° and a low of ${Math.round(today.min)}° today${chance}.`;
};

// True when the geocoded place is the one this weather report is for.
const isSamePlace = (geo: GeoLocation, current: WeatherData) =>
    !current.coord ||
    (Math.abs(geo.lat - current.coord.lat) < 0.1 &&
        Math.abs(geo.lon - current.coord.lon) < 0.1);

const CurrentConditions = ({ data, geo: geoProp }: Props) => {
    const { current } = data;
    const geo = geoProp && isSamePlace(geoProp, current) ? geoProp : null;
    const { description, icon, id } = current.weather[0];
    // Prefer the geocoded name: the weather API often returns a district
    // (e.g. "City of Westminster") rather than the city that was searched.
    const city = geo?.name ?? current.name;
    const country = geo?.country || current.sys.country;
    // Skip parts that repeat the city (Singapore, Singapore; Cairo, Cairo).
    const region = [geo?.state, regionNames.of(country) ?? country]
        .filter((part) => part && part !== city)
        .join(', ');
    const summary = summarize(data);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
                <p
                    className="-ml-[0.06em] text-[clamp(7rem,22vw,15rem)] leading-[0.8] font-extralight tracking-[-0.06em] text-white tabular-nums"
                    data-testid="current-temp"
                >
                    {Math.round(current.main.temp)}°
                </p>
                <div className="flex flex-col gap-1 pb-1">
                    <h2 className="text-4xl font-normal tracking-tight text-white sm:text-5xl">
                        {city}
                    </h2>
                    {region && <p className="text-white/75">{region}</p>}
                    <p className="text-sm text-white/65">
                        {formatLongDate(current.dt, current.timezone)},{' '}
                        {formatTime(current.dt, current.timezone)} local time
                    </p>
                </div>
            </div>
            <div className="flex max-w-xl items-start gap-4">
                <WeatherIcon
                    className="mt-0.5 text-4xl text-(--accent)"
                    icon={icon}
                    id={id}
                />
                <div>
                    <p className="text-xl text-white">
                        {capitalize(description)}
                    </p>
                    {summary && (
                        <p className="mt-1 text-pretty text-white/75">
                            {summary}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

CurrentConditions.displayName = 'CurrentConditions';

export default CurrentConditions;
