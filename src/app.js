import Header from './components/Header';
import Data from './components/Data';
import Search from './components/Search';
import './css/tailwind.css';
import './css/owfont-regular.min.css';
import './sass/app.sass';

const app = () => {
    document.getElementById('header').innerHTML = Header();
    document.getElementById('search').innerHTML = Search();
    // todo: add async/await to remove undefined message
    document.getElementById('dataBox').innerHTML = Data();
};

app();
