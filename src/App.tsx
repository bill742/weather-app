import { type CSSProperties, useState } from 'react';

import Background from './components/Background';
import CityPicker from './components/CityPicker';
import ForecastPanel from './components/ForecastPanel';
import Header from './components/Header';
import Hero from './components/Hero';
import RecentCities from './components/RecentCities';
import Search from './components/Search';
import UnitToggle from './components/UnitToggle';
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
                    <Hero
                        candidates={candidates}
                        data={data}
                        error={error}
                        geo={geo}
                        loading={loading}
                    />
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

                    <ForecastPanel data={data} loading={loading} unit={unit} />

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
