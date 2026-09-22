import type { HourlyForecast as Hour, WeatherData } from '../types/weather';
import { formatHour } from '../utils/formatTime';
import WeatherIcon from './WeatherIcon';

interface Props {
    current: WeatherData;
    hours: Hour[];
}

const HourlyForecast = ({ current, hours }: Props) => {
    // Lead with the current reading, then the 3-hourly forecast.
    const slots = [
        {
            dt: current.dt,
            icon: current.weather[0].icon,
            label: 'Now',
            pop: 0,
            temp: current.main.temp,
            weatherId: current.weather[0].id,
        },
        ...hours.map((hour) => ({
            ...hour,
            label: formatHour(hour.dt, current.timezone),
        })),
    ];

    return (
        <section>
            <h2 className="mb-3 text-sm text-white/70" id="hourly-heading">
                Next 24 hours
            </h2>
            <div
                aria-labelledby="hourly-heading"
                className="scrollbar-thin fade-right -mx-1 overflow-x-auto pb-2"
                role="region"
                tabIndex={0}
            >
                <ol className="flex min-w-max gap-1">
                    {slots.map((slot) => (
                        <li
                            className="flex w-16 flex-col items-center gap-2 rounded-xl py-3 first:bg-white/10"
                            key={slot.dt}
                        >
                            <span className="text-xs text-white/70">
                                {slot.label}
                            </span>
                            <WeatherIcon
                                className="text-2xl text-white"
                                icon={slot.icon}
                                id={slot.weatherId}
                            />
                            <span className="text-white tabular-nums">
                                {Math.round(slot.temp)}°
                            </span>
                            <span className="h-4 text-xs text-(--accent) tabular-nums">
                                {slot.pop >= 0.2 &&
                                    `${Math.round(slot.pop * 100)}%`}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

HourlyForecast.displayName = 'HourlyForecast';

export default HourlyForecast;
