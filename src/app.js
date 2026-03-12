import Header from './components/Header';
import WeatherWidget from './components/Data';
import Search from './components/Search';
import './css/tailwind.css';
import './css/owfont-regular.min.css';
import './sass/app.sass';

const app = () => {
    document.getElementById('header').innerHTML = Header();

    const searchContainer = document.getElementById('search');
    searchContainer.innerHTML = Search();

    const weatherWidget = new WeatherWidget('dataBox');
    weatherWidget.init();

    searchContainer
        .querySelector('.search-container')
        .addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchContainer
                .querySelector('#search-input')
                .value.trim();
            if (query) weatherWidget.search(query);
        });
};

app();
