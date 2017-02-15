function getCityData() {
  // Ajax request data
  var wapi = "http://api.openweathermap.org/data/2.5/forecast/weather?q=" + city + "&units=" + unit + "&id=524901&APPID=b32c84201db94b92ed42d393cac6526b";

  var output="";

  // check for connection
  var xhr = $.getJSON( wapi, function() {
    if (xhr.readyState === 4) {

      var data = JSON.parse(xhr.responseText);
      var status = data.cod;

      if (status === "0") {
        output = '<p class="unit-text">Error - no response. Please try again.</p>';
        document.getElementById('dataBox').innerHTML = output;
      } else {
          var temp = data.list[0].main.temp;
          var splitTemp = JSON.stringify(temp).split('.', 1);
          var dataCity = data.city.name;
          var code = data.list[0].weather[0].id;

          output = '<p class="data-city">' + dataCity + '</p>';
          output += '<i class="owf owf-' + data.list[0].weather[0].id + '"></i>';
          output += '<p class="unit-text">' + data.list[0].weather[0].main + '</p>';
          output += '<p id="unitText" class="unit-text">Current Temperature: ' + splitTemp + unitIcon + '</p>';

          getImages(code);

          document.getElementById('dataBox').innerHTML = output;
      }
    }
  });
}

// Validate search box
function getCity(){
  city = document.getElementById('search').value;
  if (city === ""){
      document.getElementById('dataBox').innerHTML = '<p class="unit-text">Please search for a city!</p>';
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
