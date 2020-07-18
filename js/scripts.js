"use strict";

(function () {
  function init() {
    var element = document.querySelector('.data'); // this.element = element;

    var unit = 'metric';
    var unitIcon = '°C'; // TODO: get location data from browser

    var city = 'Toronto';
    var searchBtn = document.querySelector('.search-btn');
    var unitBtn = document.querySelector('.unit-btn');
    searchBtn.addEventListener('click', getData(city, unit, unitIcon), false);
    unitBtn.addEventListener('click', changeUnit(unit, unitIcon), false);
    getData(city);
  }

  function getData(city, unit, unitIcon) {
    var output = '';
    var dataBox = document.getElementById('dataBox'); // TODO: add loading animation
    // TODO: use async/await?

    setTimeout(function () {
      fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=' + unit + '&id=524901&APPID=b32c84201db94b92ed42d393cac6526b').then(function (response) {
        return response.json();
      }).then(function (json) {
        console.log(json);
        var splitTemp = JSON.stringify(json.main.temp).split('.', 1);
        output += "<p class=\"data-city\">".concat(city, "</p>");
        output += "<i class=\"owf owf-".concat(json.weather[0].id, "\"></i>");
        output += "<p class=\"unit-text\">".concat(json.weather[0].main, "</p>");
        output += "<p id=\"unitText\" class=\"unit-text\">Current Temperature: ".concat(splitTemp, " ").concat(unitIcon, "</p>");
        dataBox.innerHTML = output;
      });
    }, 1000);
    unitBtn.classList.add('visible');
  }

  ;
  init();
})();
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
// Preload with geoloaction if possible
// if ('geolocation' in navigator) {
//   var localInfo = 'http://ip-api.com/json/?callback=?';
//   $.getJSON(localInfo, function(data) {
//     $.each(data, function(k, v) {
//       if (k === 'city'){
//         city = v;
//         document.getElementById('unitBtn').style.display = 'block';
//         getCityData(city);
//       }
//     });
//   });
// } else {
//   // console.log("geolocation IS NOT available");
// }
"use strict";
// function getImages(code){
//   var path ='https://raw.githubusercontent.com/bill742/weather-app/master/images/';
//   var bgUrl;
//   // var randImg;
//   // var results = data.result_count;
//   if (code > 199 && code < 300) {
//     bgUrl = 'url(' + path + '200-thunder.jpg)';
//   } else if (code > 299 && code < 500) {
//     bgUrl = 'url(' + path + '500-rain.jpg)';
//   } else if (code > 499 && code < 600) {
//     bgUrl = 'url(' + path + '500-rain.jpg)';
//   } else if (code > 599 && code < 700) {
//     bgUrl = 'url(' + path + '600-snow.jpg)';
//   } else if (code > 699 && code < 800) {
//     bgUrl = 'url(' + path + '700-fog.jpg)';
//   } else if (code > 800 && code < 900) {
//     bgUrl = 'url(' + path + '800-clouds.jpg)';
//   } else if (code > 899 && code < 950 || code > 958 && code < 970) {
//     bgUrl = 'url(' + path + '900-hurricane.jpg)';
//   } else {
//     bgUrl = 'url(' + path + '950-sunny.jpg)';
//   }
//   $('body').css('background-image', bgUrl);
// }
"use strict";
"use strict";

// Swtich between celcius and Fahrenheit
function changeUnit(unit, unitIcon) {
  console.log('click!');
  var elem = document.getElementById('unitBtn');

  if (elem.value == 'Show me Celcius') {
    // unitIcon = '°C';
    unit = 'metric';
    elem.value = 'Show me Fahrenheit';
  } else {
    unitIcon = '°F';
    unit = 'imperial';
    elem.value = 'Show me Celcius';
  }

  getData();
}