(function () {
    // TODO: decalre variables with types

    let unit = 'metric';
    let unitIcon = '°C';
    let unitBtnText = 'View in Fahrenheit';
    const unitBtn = document.querySelector('.unit-btn');

    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    function geoSuccess(pos) {
        const crd = pos.coords;
        const lat = `${crd.latitude}`;
        const lon = `${crd.longitude}`;
        let output = '';
        const dataBox = document.getElementById('dataBox');

        if (unit === 'metric') {
            unitIcon = '°C';
            unitBtnText = 'View in Fahrenheit';
        } else {
            unitIcon = '°F';
            unitBtnText = 'View in Celcius';
        }

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
                    unitBtn.innerHTML = unitBtnText;

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

    function changeUnit(u) {
        if (u === 'metric') {
            unit = 'imperial';
        } else {
            unit = 'metric';
        }
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

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
})();
