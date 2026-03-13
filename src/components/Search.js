const Search = () => {
    const template = `
        <form class="search-container" method="get" action="">
            <input
                type="text"
                name="search"
                id="search-input"
                class="search"
                value=""
                placeholder="Enter a city"
                required
            />
            <input
                type="submit"
                name="submit"
                value="Search"
                class="search-btn"
            />
        </form>
    `;

    return template;
};

export default Search;
