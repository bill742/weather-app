import axios from 'axios';

const Data = () => {
    const dataBox = document.getElementById('dataBox');
    const spinner = document.getElementById('spinner');
    const unitBtn = document.querySelector('.unit-btn');
    spinner.classList.remove('hidden');
    unitBtn.classList.add('hidden');

    let unit = 'metric';
    let unitIcon = '°C';
    let unitBtnText = 'View in Fahrenheit';

    async function geoSuccess(pos) {
        const crd = pos.coords;
        const lat = `${crd.latitude}`;
        const lon = `${crd.longitude}`;

        if (unit === 'metric') {
            unitIcon = '°C';
            unitBtnText = 'View in Fahrenheit';
        } else {
            unitIcon = '°F';
            unitBtnText = 'View in Celcius';
        }

        const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&id=524901&APPID=b32c84201db94b92ed42d393cac6526b`
        );

        console.log(res.data);

        const splitTemp = JSON.stringify(res.data.current.temp).split(
            '.',
            1
        )[0];
        const splitFeel = JSON.stringify(res.data.current.feels_like).split(
            '.',
            1
        )[0];

        const template = `
            <i class="owf owf-${res.data.current.weather[0].id}"></i>
            <p class="unit-text">${res.data.current.weather[0].main}</p>
            <p id="unitText" class="unit-text">Current Temperature: ${splitTemp} ${unitIcon}</p>
            <p class="unit-text">Feels like: ${splitFeel} ${unitIcon}</p>
        `;

        spinner.classList.add('hidden');
        unitBtn.classList.remove('hidden');
        dataBox.innerHTML = template;
        unitBtn.innerHTML = unitBtnText;
    }

    function changeUnit(u) {
        if (u === 'metric') {
            unit = 'imperial';
        } else {
            unit = 'metric';
        }
        dataBox.innerHTML = '';
        unitBtn.classList.add('hidden');
        spinner.classList.remove('hidden');
        navigator.geolocation.getCurrentPosition(
            geoSuccess,
            geoError,
            geoOptions
        );
    }

    unitBtn.addEventListener(
        'click',
        () => {
            changeUnit(unit);
        },
        false
    );

    function geoError(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        document.getElementById('dataBox').innerHTML =
            '<p>Location not available. Please search for a location.</p>';
    }

    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};

export default Data;
