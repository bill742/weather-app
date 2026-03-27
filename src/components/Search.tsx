import { useState } from 'react';

interface Props {
    onSubmit: (query: string) => void;
}

const Search = ({ onSubmit }: Props) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) onSubmit(trimmed);
    };

    return (
        <form className="mb-6 flex gap-2" method="get" onSubmit={handleSubmit}>
            <input
                className="flex-1 rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm outline-none transition focus:border-white/60 focus:bg-white/25"
                id="search-input"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a city"
                required
                type="text"
                value={query}
            />
            <button
                className="cursor-pointer rounded-xl border border-white/30 bg-white/20 px-5 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/30 active:scale-95"
                type="submit"
            >
                Search
            </button>
        </form>
    );
};

Search.displayName = 'Search';

export default Search;
