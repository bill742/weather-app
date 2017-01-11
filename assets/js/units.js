var unit = "imperial";
var unitIcon = "°F";
var city;

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
  // document.getElementById('unitText').innerHTML = '<p id="unitText">Current Temperature: ' + splitTemp + unitIcon + '</p>';
  getCityData();

}
