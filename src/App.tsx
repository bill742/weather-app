import { useState } from 'react';

import Header from './components/Header';
import Search from './components/Search';
import WeatherCard from './components/WeatherCard';

const App = () => {
    const [searchQuery, setSearchQuery] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 flex flex-col items-center px-4 py-10">
            <div className="w-full max-w-md">
                <Header />
                <Search onSubmit={setSearchQuery} />
                <section>
                    <div
                        className="flex flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md min-h-124"
                        id="dataBox"
                    >
                        <WeatherCard searchQuery={searchQuery} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default App;
