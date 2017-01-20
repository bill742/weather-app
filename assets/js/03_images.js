function getImages(code){

    var path ="/bill742/weather-app/master/images/"

    var randImg;
    var bgUrl;
    // var results = data.result_count;

    if (code > 199 && code < 300) {
      bgUrl = "url(" + path + "200-thunder.jpg)";
    } else if (code > 299 && code < 500) {
      bgUrl = "url(" + path + "500-rain.jpg)";
    } else if (code > 499 && code < 600) {
      bgUrl = "url(" + path + "500-rain.jpg)";
    } else if (code > 599 && code < 700) {
      bgUrl = "url(" + path + "600-snow.jpg)";
    } else if (code > 699 && code < 800) {
      bgUrl = "url(" + path + "700-fog.jpg)";
    } else if (code > 800 && code < 900) {
      bgUrl = "url(" + path + "800-clouds.jpg)";
    } else if (code > 899 && code < 950 || code > 958 && code < 970) {
      bgUrl = "url(" + path + "900-hurricane.jpg)";
    } else {
      bgUrl = "url(" + path + "950-sunny.jpg)";
    }

    $("body").css("background-image", bgUrl);

}
