// Preload with geoloaction if possible
if ("geolocation" in navigator) {

    var localInfo = "http://ip-api.com/json/?callback=?";

    $.getJSON(localInfo, function(data) {
        $.each(data, function(k, v) {
            if (k === "city"){
                city = v;

                document.getElementById('nogeo').style.display = 'none';
                document.getElementById('unitBtn').style.display = 'block';

                getCityData(city);
            }
        });
    });
} else {
  // console.log("geolocation IS NOT available");
}
