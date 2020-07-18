(function () {
    function init() {
        var element = document.querySelector('.data'); // this.element = element;

        var unit = 'metric';
        var unitIcon = '°C';
        // TODO: get location data from browser
        var city = 'Toronto';

        const searchBtn = document.querySelector('.search-btn');
        const unitBtn = document.querySelector('.unit-btn');

        searchBtn.addEventListener('click', getData(city, unit, unitIcon), false);
        unitBtn.addEventListener('click', changeUnit(unit, unitIcon), false)

        getData(city);
    }

    function getData(city, unit, unitIcon) {
        let output = '';
        const dataBox = document.getElementById('dataBox');

        // TODO: add loading animation

        // TODO: use async/await?
        setTimeout(() => {
            fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=' + unit + '&id=524901&APPID=b32c84201db94b92ed42d393cac6526b')
            .then(response => response.json())
            .then(json => {
                console.log(json);
                let splitTemp = JSON.stringify(json.main.temp).split('.', 1);
                output += `<p class="data-city">${city}</p>`;
                output += `<i class="owf owf-${json.weather[0].id}"></i>`;
                output += `<p class="unit-text">${json.weather[0].main}</p>`
                output += `<p id="unitText" class="unit-text">Current Temperature: ${splitTemp} ${unitIcon}</p>`
                dataBox.innerHTML = output;
            }
            );
        }, 1000);

        unitBtn.classList.add('visible');
    };

    init();
})();
