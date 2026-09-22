import type { DailyForecast as Day, WeatherData } from '../types/weather';
import { formatWeekday, localDayKey } from '../utils/formatTime';
import WeatherIcon from './WeatherIcon';

interface Props {
    current: WeatherData;
    days: Day[];
}

const DailyForecast = ({ current, days }: Props) => {
    const { timezone } = current;
    const todayKey = localDayKey(current.dt, timezone);

    // Every bar shares one scale — the week's coldest low to warmest high —
    // so days can be compared at a glance.
    const weekMin = Math.min(...days.map((d) => d.min));
    const weekMax = Math.max(...days.map((d) => d.max));
    const span = Math.max(weekMax - weekMin, 1);
    const toPercent = (t: number) => ((t - weekMin) / span) * 100;

    return (
        <section aria-labelledby="daily-heading">
            <h2 className="mb-1 text-sm text-white/70" id="daily-heading">
                {days.length}-day forecast
            </h2>
            <ol className="divide-y divide-white/10">
                {days.map((day) => {
                    const isToday = localDayKey(day.dt, timezone) === todayKey;
                    const label = isToday
                        ? 'Today'
                        : formatWeekday(day.dt, timezone);
                    const low = Math.round(day.min);
                    const high = Math.round(day.max);
                    return (
                        <li
                            className="grid grid-cols-[3.25rem_2.75rem_2rem_1fr_2rem] items-center gap-3 py-2.5"
                            key={day.dt}
                        >
                            <span className="text-white">{label}</span>
                            <span className="flex flex-col items-center">
                                <WeatherIcon
                                    className="text-xl text-white"
                                    icon={day.icon}
                                    id={day.weatherId}
                                />
                                {day.pop >= 0.2 && (
                                    <span className="text-[0.6875rem] leading-none text-(--accent) tabular-nums">
                                        {Math.round(day.pop * 100)}%
                                        <span className="sr-only">
                                            {' '}
                                            chance of precipitation
                                        </span>
                                    </span>
                                )}
                            </span>
                            <span className="text-right text-white/60 tabular-nums">
                                <span className="sr-only">Low </span>
                                {low}°
                            </span>
                            <span
                                aria-hidden="true"
                                className="relative h-1.5 rounded-full bg-white/15"
                            >
                                <span
                                    className="absolute inset-y-0 rounded-full bg-(--accent)"
                                    style={{
                                        left: `${toPercent(day.min)}%`,
                                        right: `${100 - toPercent(day.max)}%`,
                                    }}
                                />
                                {isToday && (
                                    <span
                                        className="absolute top-1/2 size-2.5 -translate-1/2 rounded-full border-2 border-slate-900/60 bg-white"
                                        style={{
                                            left: `${Math.min(Math.max(toPercent(current.main.temp), 0), 100)}%`,
                                        }}
                                        title="Now"
                                    />
                                )}
                            </span>
                            <span className="text-white tabular-nums">
                                <span className="sr-only">High </span>
                                {high}°
                            </span>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};

DailyForecast.displayName = 'DailyForecast';

export default DailyForecast;
