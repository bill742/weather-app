function GetSearchResults(dataCity){

    var searchRequest = { "phrase": dataCity }

    // var appendApiKeyHeader = function( xhr ) {
    //     xhr.setRequestHeader('Api-Key', 'sk6rmwqmf3gmxdfxt3at4rxe')
    // }

    var apiKey = 'sk6rmwqmf3gmxdfxt3at4rxe';

    // $.ajax({
    //     type: "GET",
    //     beforeSend: appendApiKeyHeader,
    //     url: "https://api.gettyimages.com/v3/search/images?fields=id,title,comp,asset_family",
    //     data: searchRequest})
    //     .success(function (data, textStatus, jqXHR) {
    //         // console.log(data);
    //         var bgUrl = "url(" + data.images[0].display_sizes[0].uri + " ) no-repeat";
    //         $("body").css("background", bgUrl);
    //         $("body").css("background-size", "cover");
    //         // console.log('new background: ' + bgUrl);
    //     })
    //     .fail(function (data, err) {
    //         console.log("error");
    //         // display some generic image
    //     });

    // http://jsfiddle.net/cmacpherson/6g9qtbtc/

    var url = "https://api.gettyimages.com/v3/search/images/creative?phrase=" + dataCity;
    // console.log(url);

    $.ajax(
    {
        type:'GET',
        url: url,
         beforeSend: function (request)
            {
                request.setRequestHeader("Api-Key", apiKey);
            }})
    .done(function(data){
        // console.log("Success with data")
        console.log(data);
        // for(var i = 0;i<data.images.length;i++)
        // {
        //    $("#dataBox").append("<img src='" + data.images[i].display_sizes[0].uri + "'/>");
        // }
        var bgUrl = "url(" + data.images[0].display_sizes[0].uri + " ) no-repeat";
        $("body").css("background", bgUrl);
        $("body").css("background-size", "cover");
    })
    .fail(function(data){
        alert(JSON.stringify(data,2))
    });
}
