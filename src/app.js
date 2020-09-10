import Header from './components/Header';
import Data from './components/Data';
import Search from './components/Search';
import './css/owfont-regular.min.css';
import './sass/app.sass';

const app = () => {
    document.getElementById('header').innerHTML = Header();
    document.getElementById('search').innerHTML = Search();
    document.getElementById('dataBox').innerHTML = Data();
};

app();
