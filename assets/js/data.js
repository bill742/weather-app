(function () {
    // TODO: decalre variables with types
    const element = document.querySelector('.data'); // this.element = element;
    const searchBtn = document.querySelector('.search-btn');

    let unit;
    let unitIcon;
    let unitBtnText;
    const unitBtn = document.querySelector('.unit-btn');

    let isCelcius = true;

    if (isCelcius === true) {
        unit = 'metric';
        unitIcon = '°C';
        unitBtnText = 'Fahrenheit';
    } else {
        unitIcon = '°F';
        unit = 'imperial';
        unitBtnText = 'Celcius';
    }

    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    function geoSuccess(pos) {
        const crd = pos.coords;
        const lat = `${crd.latitude}`;
        const lon = `${crd.longitude}`;
        // getData(lat, lon, isCelcius);
        let output = '';
        const dataBox = document.getElementById('dataBox');

        // TODO: add loading animation
        // TODO: fetch data with async/await?
        setTimeout(() => {
            fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&id=524901&APPID=b32c84201db94b92ed42d393cac6526b`
            )
                .then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    const splitTemp = JSON.stringify(json.current.temp).split(
                        '.',
                        1
                    );
                    const splitFeel = JSON.stringify(
                        json.current.feels_like
                    ).split('.', 1);
                    // output += `<p class="data-city">${city}</p>`;
                    output += `<i class="owf owf-${json.current.weather[0].id}"></i>`;
                    output += `<p class="unit-text">${json.current.weather[0].main}</p>`;
                    output += `<p id="unitText" class="unit-text">Current Temperature: ${splitTemp} ${unitIcon}</p>`;
                    output += `<p class="unit-text">Feels like: ${splitFeel} ${unitIcon}</p>`;
                    dataBox.innerHTML = output;

                    // const unitVal = isCelcius;
                    const code = json.current.weather[0].id;
                    getImages(code);
                });
        }, 1000);
    }

    function geoError(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        document.getElementById('dataBox').innerHTML =
            '<p>Location not available. Please search for a location.</p>';
    }

    unitBtn.addEventListener(
        'click',
        () => {
            changeUnit(isCelcius);
        },
        false
    );

    function changeUnit(unitVal) {
        if (unitVal === true) {
            isCelcius = false;
        } else {
            isCelcius = true;
        }
        navigator.geolocation.getCurrentPosition(
            geoSuccess,
            geoError,
            geoOptions
        );
        return isCelcius;
    }

    // searchBtn.addEventListener('click', getData(city, unit, unitIcon))

    // function getData(lat, lon, isCelcius) {}

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
})();
