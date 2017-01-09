var unit = "imperial";
var unitIcon = "°F";
var city;

// Preload with geoloaction if possible
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    // displayLocation(x,y);
    // console.log(x, y);
    var localUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+x+','+y+'&sensor=true&key=AIzaSyAlM9dEqJwCvY0l54lyQdvL57HqDPgOJ68';
    // console.log(localUrl);

    // Retreive JSON data from Google Maps URL
    loadJSON(localUrl,
         function(data) {
           city = data.results[5].address_components[0].long_name;
        //    console.log(city);
           getCityData(city);
        }
        //  ,function(xhr) { console.error(xhr);}
    );

  });
} else {
  console.log("geolocation IS NOT available");
}

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

// Swtich between celcius and Fahrenheit
function changeUnit() {
  var elem = document.getElementById("unitBtn");

  if (elem.value == 'Show me Celcius') {
      unitIcon = "°C";
      unit = "metric";
      elem.value = 'Show me Fahrenheit';
  } else {
      unitIcon = "°F";
      unit = "imperial";
      elem.value = 'Show me Celcius';
  }
}

function getCityData() {
  // Ajax request data

  var wapi = "http://api.openweathermap.org/data/2.5/forecast/weather?q=" + city + "&units=" + unit + "&id=524901&APPID=b32c84201db94b92ed42d393cac6526b";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', wapi, false);
  xhr.send(null);

  // console.log(wapi);

  var output;

  // check for connection
  if (xhr.readyState === 4) {

    var data = JSON.parse(xhr.responseText);
    console.log(data);

    var temp = data.list[0].main.temp;
    var splitTemp = JSON.stringify(temp).split('.', 1);

    output = '<p class="data-city">' + data.city.name + '</p>';
    // output += '<img src=http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png  class="data-img">';
    output += '<i class="owf owf-' + data.list[0].weather[0].id + '"></i>';
    output += '<p>' + data.list[0].weather[0].main + '</p>';
    output += '<p>Current Temperature: ' + splitTemp + unitIcon + '</p>';

    document.getElementById('dataBox').innerHTML = output;

  } else {
    output = "Error - no response";
  }

  document.getElementById('dataBox').innerHTML = output;
}

function getCity(){
  // changeUnit();

  city = document.getElementById('search').value;
  if (city === ""){
      document.getElementById('dataBox').innerHTML = "Please search for a city!";
  } else {
      getCityData();
  }
}

document.getElementById("search").onkeypress = function(event){
  if (event.keyCode == 13 || event.which == 13){
      getCity();
  }
};
