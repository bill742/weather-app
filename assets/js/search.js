function getCityData() {
  // Ajax request data

  var wapi = "http://api.openweathermap.org/data/2.5/forecast/weather?q=" + city + "&units=" + unit + "&id=524901&APPID=b32c84201db94b92ed42d393cac6526b";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', wapi, false);
  xhr.send(null);

  // console.log(wapi);

  // navigator.geolocation.getCurrentPosition(function(position) {
  //   var x = position.coords.latitude;
  //   var y = position.coords.longitude;
  //   var photoUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&location='+x+','+y+'&key=AIzaSyAlM9dEqJwCvY0l54lyQdvL57HqDPgOJ68'
  //   console.log(photoUrl);
  // }

  var output;

  // check for connection
  if (xhr.readyState === 4) {

    var data = JSON.parse(xhr.responseText);
    // console.log(data);

    var temp = data.list[0].main.temp;
    var splitTemp = JSON.stringify(temp).split('.', 1);
    var dataCity = data.city.name;

    output = '<p class="data-city">' + dataCity + '</p>';

    // output += '<img src=http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png  class="data-img">';
    output += '<i class="owf owf-' + data.list[0].weather[0].id + '"></i>';
    output += '<p>' + data.list[0].weather[0].main + '</p>';
    output += '<p id="unitText">Current Temperature: ' + splitTemp + unitIcon + '</p>';
    // output += '<img src="' + photoUrl + '">'

    GetSearchResults(dataCity);

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
