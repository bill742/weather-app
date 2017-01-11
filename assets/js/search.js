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
    // console.log(data);

    var temp = data.list[0].main.temp;
    var splitTemp = JSON.stringify(temp).split('.', 1);

    output = '<p class="data-city">' + data.city.name + '</p>';
    // output += '<img src=http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png  class="data-img">';
    output += '<i class="owf owf-' + data.list[0].weather[0].id + '"></i>';
    output += '<p>' + data.list[0].weather[0].main + '</p>';
    output += '<p id="unitText">Current Temperature: ' + splitTemp + unitIcon + '</p>';

    document.getElementById('dataBox').innerHTML = output;

  } else {
    output = "Error - no response";
  }

  document.getElementById('dataBox').innerHTML = output;
}

// Validate search box
function getCity(){
  city = document.getElementById('search').value;
  if (city === ""){
      document.getElementById('dataBox').innerHTML = "Please search for a city!";
  } else {
      getCityData();
  }
}

// Allow search to work by pressing Enter
document.getElementById("search").onkeypress = function(event){
  if (event.keyCode == 13 || event.which == 13){
      getCity();
  }
};
