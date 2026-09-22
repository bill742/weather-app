import type { Unit, WeatherBundle } from '../types/weather';
import DailyForecast from './DailyForecast';
import HourlyForecast from './HourlyForecast';
import WeatherDetails from './WeatherDetails';

interface Props {
    data: null | WeatherBundle;
    loading: boolean;
    unit: Unit;
}

// The forecast half of the sidebar: nothing to show until weather has loaded,
// and the hourly and daily rows depend on endpoints a free plan may not serve.
const ForecastPanel = ({ data, loading, unit }: Props) => {
    if (!data) return null;

    return (
        <div
            className={`flex flex-col gap-8 transition-opacity duration-300 ${
                loading ? 'opacity-60' : ''
            }`}
        >
            {data.hourly.length > 0 && (
                <HourlyForecast current={data.current} hours={data.hourly} />
            )}
            {data.daily.length > 0 && (
                <DailyForecast current={data.current} days={data.daily} />
            )}
            <WeatherDetails data={data} unit={unit} />
        </div>
    );
};

ForecastPanel.displayName = 'ForecastPanel';

export default ForecastPanel;
