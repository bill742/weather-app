var unit = document.querySelector('input[name="unit"]:checked').value;
var unitIcon = "°C";
if (unit == "imperial") {
  unitIcon = "°F";
}
console.log("Units: " + unit + unitIcon);

function getCity(){
  var city = document.getElementById('cityBox').value;

  // Ajax request data
  var wapi = "http://api.openweathermap.org/data/2.5/forecast/weather?q=" + city + "&units=" + unit + "&id=524901&APPID=b32c84201db94b92ed42d393cac6526b";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', wapi, false);
  xhr.send(null);

  console.log(wapi);

  var output;

  // check for connection
  if (xhr.response == 200) {

    var data = JSON.parse(xhr.responseText);
    //console.log(data);

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

}
