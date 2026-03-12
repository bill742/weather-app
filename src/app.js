import Header from './components/Header';
import WeatherWidget from './components/Data';
import Search from './components/Search';
import './css/tailwind.css';
import './css/owfont-regular.min.css';
import './sass/app.sass';

const app = () => {
    document.getElementById('header').innerHTML = Header();
    document.getElementById('search').innerHTML = Search();

    const weatherWidget = new WeatherWidget('dataBox');
    weatherWidget.init();
};

app();
