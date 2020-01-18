var city, unit, unitIcon;

console.log('test2');


function getCityData() {
  document.getElementById('unitBtn').style.display = 'block';

  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=' + unit + '&id=524901&APPID=b32c84201db94b92ed42d393cac6526b',
    data: {
      format: 'json'
    },
    error: function() {
      $('#dataBox').html('<p class="unit-text">There was an error retreiving results. Please try again.</p>');
    },
    dataType: 'jsonp',
    success: function(data) {
      $('#dataBox').empty();
      var temp = data.main.temp;
      var splitTemp = JSON.stringify(temp).split('.', 1);
      var dataCity = data.name;
      var code = data.weather[0].id;
      $('#dataBox')
        .append('<p class="data-city">' + dataCity + '</p>')
        .append('<i class="owf owf-' + data.weather[0].id + '"></i>')
        .append('<p class="unit-text">' + data.weather[0].main + '</p>')
        .append('<p id="unitText" class="unit-text">Current Temperature: ' + splitTemp + unitIcon + '</p>');
      getImages(code);
    },
    type: 'GET'
  });
}
