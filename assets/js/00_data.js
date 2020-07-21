(function () {
    'use strict';

    const element = document.querySelector('.data'); // this.element = element;
    const searchBtn = document.querySelector('.search-btn');
    const unitBtn = document.querySelector('.unit-btn');

    let unit = 'metric';
    let unitIcon = '°C';

    // Preload with geoloaction if possible
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        var lat = `${crd.latitude}`;
        var lon = `${crd.longitude}`;
        getData(lat, lon, unit, unitIcon)
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

    // searchBtn.addEventListener('click', getData(city, unit, unitIcon), false);
    // unitBtn.addEventListener('click', changeUnit(unit, unitIcon), false);

    function getData(lat, lon, unit, unitIcon) {
        let output = '';
        const dataBox = document.getElementById('dataBox');

        // TODO: add loading animation
        // TODO: use async/await?
        setTimeout(() => {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&id=524901&APPID=b32c84201db94b92ed42d393cac6526b`)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                let splitTemp = JSON.stringify(json.current.temp).split('.', 1);
                let splitFeel = JSON.stringify(json.current.feels_like).split('.', 1);
                // output += `<p class="data-city">${city}</p>`;
                output += `<i class="owf owf-${json.current.weather[0].id}"></i>`;
                output += `<p class="unit-text">${json.current.weather[0].main}</p>`
                output += `<p id="unitText" class="unit-text">Current Temperature: ${splitTemp} ${unitIcon}</p>`
                output += `<p class="unit-text">Feels like: ${splitFeel} ${unitIcon}</p>`
                dataBox.innerHTML = output;
            }
            );
        }, 1000);

        unitBtn.classList.add('visible');
    };
})();
