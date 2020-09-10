const Search = () => {
    const template = `
        <div class="search-container">
            <input
                type="text"
                name="search"
                id="search"
                class="search"
                value=""
                placeholder="Enter a city"
            />
            <input
                type="button"
                name="submit"
                value="Search"
                class="search-btn"
            />
        </div>
    `;

    return template;
};

export default Search;
