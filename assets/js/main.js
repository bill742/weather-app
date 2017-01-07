var unit = "imperial";
var unitIcon = "°F";

// Preload with geoloaction if possible
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    // displayLocation(x,y);
    console.log(x, y);
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+x+','+y+'&sensor=true&key=AIzaSyAlM9dEqJwCvY0l54lyQdvL57HqDPgOJ68';
    console.log(url);
  });
} else {
  console.log("geolocation IS NOT available");
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

function getCity(){
  // changeUnit();

  var city = document.getElementById('search').value;
  if (city === ""){
      document.getElementById('dataBox').innerHTML = "Please search for a city!";
  } else {
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
        // console.log(data);

        var temp = data.list[0].main.temp;
        var splitTemp = JSON.stringify(temp).split('.', 1);

        output = '<p>City: ' + data.city.name + '</p>';
        output += '<img src=http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png>';
        output += data.list[0].weather[0].main;
        output += '<p>Current Temperature: ' + splitTemp + unitIcon + '</p>';

        document.getElementById('dataBox').innerHTML = output;

      } else {
        output = "Error - no response";
      }

      document.getElementById('dataBox').innerHTML = output;
  }
}

document.getElementById("search").onkeypress = function(event){
  if (event.keyCode == 13 || event.which == 13){
      getCity();
  }
};
