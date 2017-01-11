// Preload with geoloaction if possible
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    var localUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+x+','+y+'&sensor=true&key=AIzaSyAlM9dEqJwCvY0l54lyQdvL57HqDPgOJ68';

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
  // console.log("geolocation IS NOT available");
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
