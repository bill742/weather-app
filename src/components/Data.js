import axios from 'axios';

const Data = () => {
    const template = '';
    const spinner = `<div id="spinner" class='sk-chase'>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    </div>`;
    let unit = 'metric';
    let unitIcon = '°C';
    let unitBtnText = 'View in Fahrenheit';

    async function geoSuccess(pos) {
        document.getElementById('dataBox').innerHTML = spinner;
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

        const splitTemp = JSON.stringify(res.data.current.temp).split(
            '.',
            1
        )[0];
        const splitFeel = JSON.stringify(res.data.current.feels_like).split(
            '.',
            1
        )[0];

        const template = `<i class="owf owf-${res.data.current.weather[0].id}"></i>
        <p class="unit-text">${res.data.current.weather[0].main}</p>
        <p id="unitText" class="unit-text">Current Temperature: ${splitTemp} ${unitIcon}</p>
        <p class="unit-text">Feels like: ${splitFeel} ${unitIcon}</p>

        <button
            id="unitBtn"
            class="unit-btn"
            name="units"
            value=${unitBtnText}
        >${unitBtnText}</button>`;

        document.getElementById('dataBox').innerHTML = template;

        document.getElementById('unitBtn').addEventListener(
            'click',
            () => {
                unit = unit === 'metric' ? 'imperial' : 'metric';
                navigator.geolocation.getCurrentPosition(
                    geoSuccess,
                    geoError,
                    geoOptions
                );
            },
            false
        );
    }

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

    return template;
};

export default Data;
