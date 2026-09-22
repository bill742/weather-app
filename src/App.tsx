import { type CSSProperties, useState } from 'react';

import Background from './components/Background';
import CityPicker from './components/CityPicker';
import CurrentConditions from './components/CurrentConditions';
import DailyForecast from './components/DailyForecast';
import Header from './components/Header';
import HourlyForecast from './components/HourlyForecast';
import RecentCities from './components/RecentCities';
import Search from './components/Search';
import UnitToggle from './components/UnitToggle';
import WeatherDetails from './components/WeatherDetails';
import useRecentCities, { isSamePlace } from './hooks/useRecentCities';
import useWeather from './hooks/useWeather';
import getScene, { DEFAULT_SCENE } from './utils/getScene';

const App = () => {
    const [searchQuery, setSearchQuery] = useState<null | string>(null);
    const { addRecent, clearRecent, recent } = useRecentCities();
    const {
        candidates,
        data,
        error,
        geo,
        loading,
        selectPlace,
        setUnit,
        unit,
    } = useWeather(searchQuery, addRecent);

    const scene = data ? getScene(data.current) : DEFAULT_SCENE;
    // Leave out the place already on screen.
    const otherRecent = recent.filter(
        (place) => !(data && geo && isSamePlace(place, geo)),
    );

    let hero;
    if (data) {
        hero = <CurrentConditions data={data} geo={geo} />;
    } else if (loading) {
        hero = (
            <output aria-label="Loading weather" className="sk-chase">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div className="sk-chase-dot" key={i} />
                ))}
            </output>
        );
    } else if (candidates.length > 0) {
        hero = (
            <p className="max-w-md text-2xl text-white">
                Choose a place from the list to see its weather.
            </p>
        );
    } else {
        hero = (
            <p className="max-w-lg text-3xl leading-snug font-light text-white">
                {error ?? 'Search for a city to see its weather.'}
            </p>
        );
    }

    return (
        <div
            className="min-h-svh text-white lg:h-svh"
            data-scene={scene.name}
            style={{ '--accent': scene.accent } as CSSProperties}
        >
            <Background image={scene.image} />
            <main
                aria-busy={loading}
                className="grid min-h-svh grid-cols-[minmax(0,1fr)] lg:h-full lg:grid-cols-[minmax(0,1fr)_minmax(24rem,27rem)]"
            >
                <section
                    aria-label="Current conditions"
                    className="flex min-h-[78svh] flex-col justify-between gap-12 px-5 pt-6 pb-10 sm:px-10 lg:min-h-0 lg:px-14 lg:pt-10 lg:pb-14"
                >
                    <Header>
                        <UnitToggle onChange={setUnit} unit={unit} />
                    </Header>
                    <div
                        className={`transition-opacity duration-300 ${
                            loading && data ? 'opacity-60' : ''
                        }`}
                    >
                        {hero}
                    </div>
                </section>

                <aside
                    aria-label="Search and forecast"
                    className="flex flex-col gap-8 bg-[rgb(12_18_26/0.55)] px-5 py-6 backdrop-blur-2xl sm:px-8 lg:overflow-y-auto lg:border-l lg:border-white/10 lg:py-10"
                >
                    <Search onSubmit={setSearchQuery} />

                    {error && data && (
                        <p className="-mt-4 text-sm text-white" role="alert">
                            {error}
                        </p>
                    )}

                    {candidates.length > 0 && (
                        <CityPicker
                            candidates={candidates}
                            onSelect={selectPlace}
                        />
                    )}

                    {candidates.length === 0 && otherRecent.length > 0 && (
                        <RecentCities
                            onClear={clearRecent}
                            onSelect={selectPlace}
                            places={otherRecent}
                        />
                    )}

                    {data && (
                        <div
                            className={`flex flex-col gap-8 transition-opacity duration-300 ${
                                loading ? 'opacity-60' : ''
                            }`}
                        >
                            {data.hourly.length > 0 && (
                                <HourlyForecast
                                    current={data.current}
                                    hours={data.hourly}
                                />
                            )}
                            {data.daily.length > 0 && (
                                <DailyForecast
                                    current={data.current}
                                    days={data.daily}
                                />
                            )}
                            <WeatherDetails data={data} unit={unit} />
                        </div>
                    )}

                    <footer className="mt-auto pt-4 text-xs text-white/55">
                        Weather data from OpenWeather. Photo: {scene.credit},
                        via Wikimedia Commons.
                    </footer>
                </aside>
            </main>
        </div>
    );
};

App.displayName = 'App';

export default App;
