function loadJSON(e,t,n){var a=new XMLHttpRequest;a.onreadystatechange=function(){a.readyState===XMLHttpRequest.DONE&&(200===a.status?t&&t(JSON.parse(a.responseText)):n&&n(a))},a.open("GET",e,!0),a.send()}function GetSearchResults(e){var t="sk6rmwqmf3gmxdfxt3at4rxe",n="https://api.gettyimages.com/v3/search/images/creative?license_models=royaltyfree&orientations=Horizontal&fields=comp&phrase="+e;$.ajax({type:"GET",url:n,beforeSend:function(e){e.setRequestHeader("Api-Key",t)}}).done(function(e){var t="url("+e.images[0].display_sizes[0].uri+" ) no-repeat";$(".content").css("background",t),$(".content").css("background-size","cover")}).fail(function(e){alert(JSON.stringify(e,2))})}function getCityData(){var e="http://api.openweathermap.org/data/2.5/forecast/weather?q="+city+"&units="+unit+"&id=524901&APPID=b32c84201db94b92ed42d393cac6526b",t=new XMLHttpRequest;t.open("GET",e,!1),t.send(null);var n;if(4===t.readyState){var a=JSON.parse(t.responseText),i=a.list[0].main.temp,o=JSON.stringify(i).split(".",1),s=a.city.name;n='<p class="data-city">'+s+"</p>",n+='<i class="owf owf-'+a.list[0].weather[0].id+'"></i>',n+="<p>"+a.list[0].weather[0].main+"</p>",n+='<p id="unitText" class="unit-text">Current Temperature: '+o+unitIcon+"</p>",GetSearchResults(s),document.getElementById("dataBox").innerHTML=n}else n="Error - no response";document.getElementById("dataBox").innerHTML=n}function getCity(){city=document.getElementById("search").value,""===city?document.getElementById("dataBox").innerHTML="Please search for a city!":getCityData()}function changeUnit(){var e=document.getElementById("unitBtn");"Show me Celcius"==e.value?(unitIcon="°C",unit="metric",e.value="Show me Fahrenheit"):(unitIcon="°F",unit="imperial",e.value="Show me Celcius"),getCityData()}"geolocation"in navigator&&navigator.geolocation.getCurrentPosition(function(e){var t=e.coords.latitude,n=e.coords.longitude,a="https://maps.googleapis.com/maps/api/geocode/json?latlng="+t+","+n+"&sensor=true&key=AIzaSyAlM9dEqJwCvY0l54lyQdvL57HqDPgOJ68";loadJSON(a,function(e){city=e.results[5].address_components[0].long_name,getCityData(city)})}),document.getElementById("search").onkeypress=function(e){13!=e.keyCode&&13!=e.which||getCity()};var unit="imperial",unitIcon="°F",city;