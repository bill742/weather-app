function getImages(dataCity){

    var apiKey = 'sk6rmwqmf3gmxdfxt3at4rxe';

    var url = "https://api.gettyimages.com:443/v3/search/images/creative?file_types=jpg&graphical_styles=photography&license_models=royaltyfree&number_of_people=none&orientations=Horizontal%2CPanoramicHorizontal&fields=comp&phrase=" + dataCity;

    $.ajax(
    {
        type:'GET',
        url: url,
         beforeSend: function (request)
            {
                request.setRequestHeader("Api-Key", apiKey);
            }})
    .done(function(data){

        var randImg;
        var bgUrl;
        var results = data.result_count;

        if (results > 30) {
          randImg = Math.floor(Math.random() * 29) + 1;
          bgUrl = "url(" + data.images[randImg].display_sizes[0].uri + " )";
          $("body").css("background-image", bgUrl);
        } else if (results > 0) {
          randImg = Math.floor(Math.random() * data.result_count) + 1;
          bgUrl = "url(" + data.images[randImg].display_sizes[0].uri + " )";
          $("body").css("background-image", bgUrl);
        } else {
        //   console.log("no images found");
        }
    })
    .fail(function(data){
        // todo: add default image to load
    });
}
