function GetSearchResults(dataCity){

    var searchRequest = { "phrase": dataCity }

    var appendApiKeyHeader = function( xhr ) {
        xhr.setRequestHeader('Api-Key', 'sk6rmwqmf3gmxdfxt3at4rxe')
    }

    $.ajax({
        type: "GET",
        beforeSend: appendApiKeyHeader,
        url: "https://api.gettyimages.com/v3/search/images?fields=id,title,comp,asset_family",
        data: searchRequest})
        .success(function (data, textStatus, jqXHR) {
            // console.log(data);
            var bgUrl = "url(" + data.images[0].display_sizes[0].uri + " ) no-repeat";
            $(".container").css("background", bgUrl);
            $(".container").css("background-size", "cover");
            // console.log('new background: ' + bgUrl);
        })
        .fail(function (data, err) {
            console.log("error");
            // display some generic image
        });

}
