import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

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
        <form
            className="flex items-center gap-3"
            method="get"
            onSubmit={handleSubmit}
            role="search"
        >
            <div className="relative flex-1">
                <input
                    aria-label="Search for a city"
                    className="w-full border-b border-white/25 bg-transparent py-3 pr-9 text-white placeholder-white/55 outline-none transition-colors focus:border-(--accent)"
                    id="search-input"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a city"
                    required
                    type="text"
                    value={query}
                />
                {query && (
                    <button
                        aria-label="Clear text"
                        className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-white/60 transition-colors hover:text-white"
                        onClick={() => setQuery('')}
                        type="button"
                    >
                        <FiX aria-hidden="true" />
                    </button>
                )}
            </div>
            <button
                aria-label="Search"
                className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-xl bg-(--accent) text-slate-900 transition active:scale-95"
                type="submit"
            >
                <FiSearch aria-hidden="true" className="size-5" />
            </button>
        </form>
    );
};

Search.displayName = 'Search';

export default Search;
