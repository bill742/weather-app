import type { ReactNode } from 'react';

import type { Unit, WeatherBundle } from '../types/weather';
import formatTime from '../utils/formatTime';
import {
    compassPoint,
    dewPoint,
    formatPrecip,
    formatVisibility,
    formatWind,
    uvCategory,
} from '../utils/units';

interface Props {
    data: WeatherBundle;
    unit: Unit;
}

interface ItemProps {
    children: ReactNode;
    label: string;
    note?: ReactNode;
}

const Item = ({ children, label, note }: ItemProps) => (
    <div className="border-t border-white/10 py-4">
        <dt className="text-sm text-white/70">{label}</dt>
        <dd className="mt-1">
            <span className="text-2xl text-white tabular-nums">{children}</span>
            {note && (
                <span className="mt-1 block text-sm text-pretty text-white/65">
                    {note}
                </span>
            )}
        </dd>
    </div>
);

// Arrow points the way the wind is blowing (meteorological degrees give the
// direction it comes from, hence the 180° turn).
const Compass = ({ deg }: { deg: number }) => (
    <svg
        aria-hidden="true"
        className="size-20 shrink-0 text-white"
        viewBox="-50 -50 100 100"
    >
        <circle
            className="stroke-white/25"
            fill="none"
            r="44"
            strokeWidth="1"
        />
        {Array.from({ length: 36 }, (_, i) => (
            <line
                className={i % 9 === 0 ? 'stroke-white/70' : 'stroke-white/25'}
                key={i}
                strokeWidth="1"
                transform={`rotate(${i * 10})`}
                x1="0"
                x2="0"
                y1="-44"
                y2={i % 9 === 0 ? '-37' : '-40'}
            />
        ))}
        {(['N', 'E', 'S', 'W'] as const).map((point, i) => (
            <text
                className="fill-white/70 text-[9px]"
                dominantBaseline="central"
                key={point}
                textAnchor="middle"
                transform={`rotate(${i * 90}) translate(0 -29) rotate(${-i * 90})`}
            >
                {point}
            </text>
        ))}
        <g transform={`rotate(${deg + 180})`}>
            <line
                className="stroke-(--accent)"
                strokeLinecap="round"
                strokeWidth="2.5"
                x1="0"
                x2="0"
                y1="20"
                y2="-16"
            />
            <path className="fill-(--accent)" d="M0 -24 L6 -13 L-6 -13 Z" />
        </g>
    </svg>
);

const UV_MAX = 11;
// WHO UV colour bands: low, moderate, high, very high, extreme.
const UV_GRADIENT =
    'linear-gradient(to right, #5fd38a, #f5d04c 30%, #f59a4c 55%, #ec5a5a 75%, #b77cf2)';

const UvScale = ({ uvi }: { uvi: number }) => (
    <div
        aria-hidden="true"
        className="relative mt-3 h-1.5 rounded-full"
        style={{ backgroundImage: UV_GRADIENT }}
    >
        <span
            className="absolute top-1/2 size-3.5 -translate-1/2 rounded-full border-2 border-slate-900/70 bg-white"
            style={{ left: `${(Math.min(uvi, UV_MAX) / UV_MAX) * 100}%` }}
        />
    </div>
);

const WeatherDetails = ({ data, unit }: Props) => {
    const { current, daily, uvi } = data;
    const { feels_like, humidity, temp } = current.main;
    const today = daily[0];

    const feelsDiff = Math.round(feels_like) - Math.round(temp);
    const feelsNote =
        Math.abs(feelsDiff) < 2
            ? 'About the same as the actual temperature'
            : feelsDiff > 0
              ? 'Warmer than the actual temperature'
              : 'Colder than the actual temperature';

    const wind = formatWind(current.wind.speed, unit);
    const gust =
        current.wind.gust !== undefined
            ? formatWind(current.wind.gust, unit)
            : null;
    const visibility =
        current.visibility !== undefined
            ? formatVisibility(current.visibility, unit)
            : null;
    const uv = uvi !== null ? uvCategory(uvi) : null;

    return (
        <section aria-labelledby="details-heading">
            <h2 className="mb-1 text-sm text-white/70" id="details-heading">
                Details
            </h2>
            <dl className="grid grid-cols-2 gap-x-6">
                <Item label="Feels like" note={feelsNote}>
                    {Math.round(feels_like)}°
                </Item>
                <Item
                    label="Humidity"
                    note={`Dew point ${dewPoint(temp, humidity, unit)}°`}
                >
                    {humidity}%
                </Item>

                <div className="col-span-2 border-t border-white/10 py-4">
                    <dt className="text-sm text-white/70">Wind</dt>
                    <dd className="mt-1 flex items-center justify-between gap-4">
                        <span>
                            <span className="text-2xl text-white tabular-nums">
                                {wind.value}
                            </span>{' '}
                            <span className="text-white/75">{wind.label}</span>
                            <span className="mt-1 block text-sm text-white/65">
                                From the {compassPoint(current.wind.deg)}
                                {gust &&
                                    `, gusting to ${gust.value} ${gust.label}`}
                            </span>
                        </span>
                        <Compass deg={current.wind.deg} />
                    </dd>
                </div>

                {uv && uvi !== null && (
                    <div className="col-span-2 border-t border-white/10 py-4">
                        <dt className="text-sm text-white/70">
                            UV index, today’s peak
                        </dt>
                        <dd className="mt-1">
                            <span className="text-2xl text-white tabular-nums">
                                {Math.round(uvi)}
                            </span>{' '}
                            <span className="text-white/75">{uv.label}</span>
                            <UvScale uvi={uvi} />
                            <span className="mt-2 block text-sm text-white/65">
                                {uv.advice}
                            </span>
                        </dd>
                    </div>
                )}

                {visibility && (
                    <Item label="Visibility">
                        {visibility.value}{' '}
                        <span className="text-base text-white/75">
                            {visibility.label}
                        </span>
                    </Item>
                )}
                {today && (
                    <Item
                        label="Precipitation"
                        note={
                            today.rain
                                ? `${formatPrecip(today.rain, unit)} expected today`
                                : 'Chance today'
                        }
                    >
                        {Math.round(today.pop * 100)}%
                    </Item>
                )}
                <Item label="Sunrise">
                    {formatTime(current.sys.sunrise, current.timezone)}
                </Item>
                <Item label="Sunset">
                    {formatTime(current.sys.sunset, current.timezone)}
                </Item>
            </dl>
        </section>
    );
};

WeatherDetails.displayName = 'WeatherDetails';

export default WeatherDetails;
