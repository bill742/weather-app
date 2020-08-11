// Validate search box
// function getCity(){
//   const city = document.getElementById('search').value;
//   if (city === ''){
//     document.getElementById('dataBox').innerHTML = '<p class="unit-text">Please search for a city!</p>';
//     document.getElementById('unitBtn').style.display = 'none';
//   } else {
//     getCityData();
//   }
// }
// Allow search to work by pressing Enter
// document.getElementById('search').onkeypress = function(event){
//   if (event.keyCode == 13 || event.which == 13){
//     getCity();
//   }
// };
"use strict";
"use strict";

(function () {
  'use strict'; // TODO: decalre variables with types

  var element = document.querySelector('.data'); // this.element = element;

  var searchBtn = document.querySelector('.search-btn');
  var unitBtn = document.querySelector('.unit-btn');
  var unit;
  var unitIcon;
  var unitBtnText;
  var isCelcius = true;

  if (isCelcius === true) {
    unit = 'metric';
    unitIcon = '°C';
    unitBtnText = 'Show me Fahrenheit';
  } else {
    unitIcon = '°F';
    unit = 'imperial';
    unitBtnText = 'Show me Celcius';
  }

  var geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions); // searchBtn.addEventListener('click', getData(city, unit, unitIcon));

  function getData(lat, lon, isCelcius) {
    var output = '';
    var dataBox = document.getElementById('dataBox'); // TODO: add loading animation
    // TODO: fetch data with async/await?

    setTimeout(function () {
      fetch("https://api.openweathermap.org/data/2.5/onecall?lat=".concat(lat, "&lon=").concat(lon, "&units=").concat(unit, "&id=524901&APPID=b32c84201db94b92ed42d393cac6526b")).then(function (response) {
        return response.json();
      }).then(function (json) {
        console.log(json);
        var splitTemp = JSON.stringify(json.current.temp).split('.', 1);
        var splitFeel = JSON.stringify(json.current.feels_like).split('.', 1); // output += `<p class="data-city">${city}</p>`;

        output += "<i class=\"owf owf-".concat(json.current.weather[0].id, "\"></i>");
        output += "<p class=\"unit-text\">".concat(json.current.weather[0].main, "</p>");
        output += "<p id=\"unitText\" class=\"unit-text\">Current Temperature: ".concat(splitTemp, " ").concat(unitIcon, "</p>");
        output += "<p class=\"unit-text\">Feels like: ".concat(splitFeel, " ").concat(unitIcon, "</p>");
        dataBox.innerHTML = output;
        var code = json.current.weather[0].id;
        getImages(code);
      });
    }, 1000);
    unitBtn.classList.add('visible');
    unitBtn.addEventListener('click', function () {
      changeUnit(isCelcius);
    }, false);
  }

  ;

  function geoSuccess(pos) {
    var crd = pos.coords;
    var lat = "".concat(crd.latitude);
    var lon = "".concat(crd.longitude);
    getData(lat, lon, isCelcius);
  }

  function geoError(err) {
    console.warn("ERROR(".concat(err.code, "): ").concat(err.message));
    document.getElementById('dataBox').innerHTML = '<p>Location not available. Please search for a location.</p>';
  }

  function changeUnit(isCelcius) {
    isCelcius ? false : true;
    console.log(isCelcius);
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    return isCelcius;
  }
})();
"use strict";

function getImages(code) {
  var path = '/images/';
  var bgUrl;
  var num = code > 950 ? 10 : Math.floor(code / 100); // TODO: add default image for non-JS browsers

  switch (num) {
    case 1:
    case 2:
      bgUrl = "url(".concat(path, "200-thunder.jpg)");
      break;

    case 3:
    case 4:
      bgUrl = "url(".concat(path, "500-rain.jpg)");
      break;

    case 6:
      bgUrl = "url(".concat(path, "600-snow.jpg)");
      break;

    case 7:
      bgUrl = "url(".concat(path, "700-fog.jpg)");
      break;

    case 8:
      bgUrl = "url(".concat(path, "800-clouds.jpg)");
      break;

    case 9:
      bgUrl = "url(".concat(path, "900-hurricane.jpg)");
      break;

    case 10:
      bgUrl = "url(".concat(path, "950-sunny.jpg)");
      break;

    default:
      bgUrl = "url(".concat(path, "950-sunny.jpg)");
  }

  document.body.style.backgroundImage = bgUrl;
}