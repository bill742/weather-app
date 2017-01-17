function getImages(code){

    // var apiKey = 'sk6rmwqmf3gmxdfxt3at4rxe';
    //
    // var url = "https://api.gettyimages.com:443/v3/search/images/creative?file_types=jpg&graphical_styles=photography&license_models=royaltyfree&number_of_people=none&orientations=Horizontal%2CPanoramicHorizontal&fields=comp&phrase=" + dataCity;

    var path ="/images/"
    console.log(code);


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
    } else {
      console.log("no images found");
      bgUrl="";
    }

    $("body").css("background-image", bgUrl);

}
