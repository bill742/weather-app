function GetSearchResults(dataCity){

    var apiKey = 'sk6rmwqmf3gmxdfxt3at4rxe';

    // http://jsfiddle.net/cmacpherson/6g9qtbtc/

    var url = "https://api.gettyimages.com/v3/search/images/creative?license_models=royaltyfree&orientations=Horizontal&fields=comp&phrase=" + dataCity;

    $.ajax(
    {
        type:'GET',
        url: url,
         beforeSend: function (request)
            {
                request.setRequestHeader("Api-Key", apiKey);
            }})
    .done(function(data){
        // console.log(data);
        // for(var i = 0;i<data.images.length;i++)
        // {
        //    $("#dataBox").append("<img src='" + data.images[i].display_sizes[0].uri + "'/>");
        // }
        var bgUrl = "url(" + data.images[0].display_sizes[0].uri + " ) no-repeat";
        $(".content").css("background", bgUrl);
        $(".content").css("background-size", "cover");
    })
    .fail(function(data){
        alert(JSON.stringify(data,2));
    });
}
