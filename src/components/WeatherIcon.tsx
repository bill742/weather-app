interface Props {
    className?: string;
    // OpenWeatherMap icon code, e.g. "04d" — only the day/night suffix is used.
    icon: string;
    id: number;
}

const WeatherIcon = ({ className = '', icon, id }: Props) => (
    <i
        aria-hidden="true"
        className={`owf owf-${id}-${icon.endsWith('n') ? 'n' : 'd'} ${className}`}
    />
);

WeatherIcon.displayName = 'WeatherIcon';

export default WeatherIcon;
