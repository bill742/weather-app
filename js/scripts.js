function displayLocation(e,t){var a=new XMLHttpRequest;a.onreadystatechange=function(){if(4==a.readyState&&200==a.status){var e=JSON.parse(a.responseText);e.results[0]}else console.log("no data!")}}function changeUnit(){var e=document.getElementById("unitBtn");"Show me Celcius"==e.value?(unitIcon="°C",unit="metric",e.value="Show me Fahrenheit"):(unitIcon="°F",unit="imperial",e.value="Show me Celcius")}function getCity(){var e=document.getElementById("search").value;if(""===e)document.getElementById("dataBox").innerHTML="Please search for a city!";else{var t="http://api.openweathermap.org/data/2.5/forecast/weather?q="+e+"&units="+unit+"&id=524901&APPID=b32c84201db94b92ed42d393cac6526b",a=new XMLHttpRequest;a.open("GET",t,!1),a.send(null);var n;if(4===a.readyState){var o=JSON.parse(a.responseText),i=o.list[0].main.temp,r=JSON.stringify(i).split(".",1);n="<p>City: "+o.city.name+"</p>",n+="<img src=http://openweathermap.org/img/w/"+o.list[0].weather[0].icon+".png>",n+=o.list[0].weather[0].main,n+="<p>Current Temperature: "+r+unitIcon+"</p>",document.getElementById("dataBox").innerHTML=n}else n="Error - no response";document.getElementById("dataBox").innerHTML=n}}var unit="imperial",unitIcon="°F",successCallback=function(e){var t=e.coords.latitude,a=e.coords.longitude;console.log(t,a);var n="http://maps.googleapis.com/maps/api/geocode/json?latlng="+t+","+a+"&sensor=true&key=AIzaSyAlM9dEqJwCvY0l54lyQdvL57HqDPgOJ68";console.log(n)},errorCallback=function(e){var t="Unknown error";switch(e.code){case 1:t="Permission denied";break;case 2:t="Position unavailable";break;case 3:t="Timeout"}},options={enableHighAccuracy:!0,timeout:1e3,maximumAge:0};navigator.geolocation.getCurrentPosition(successCallback,errorCallback,options),"geolocation"in navigator?displayLocation():console.log("geolocation IS NOT available");