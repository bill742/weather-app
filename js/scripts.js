function getCityData(){var t="http://api.openweathermap.org/data/2.5/forecast/weather?q="+city+"&units="+unit+"&id=524901&APPID=b32c84201db94b92ed42d393cac6526b",e="",n=$.getJSON(t,function(){if(4===n.readyState){var t=JSON.parse(n.responseText),i=t.list[0].main.temp,a=JSON.stringify(i).split(".",1),c=t.city.name,o=t.list[0].weather[0].id;e='<p class="data-city">'+c+"</p>",e+='<i class="owf owf-'+t.list[0].weather[0].id+'"></i>',e+='<p class="unit-text">'+t.list[0].weather[0].main+"</p>",e+='<p id="unitText" class="unit-text">Current Temperature: '+a+unitIcon+"</p>",getImages(o),document.getElementById("dataBox").innerHTML=e}else e='<p class="unit-text">Error - no response</p>'});document.getElementById("dataBox").innerHTML=e}function getCity(){city=document.getElementById("search").value,""===city?document.getElementById("dataBox").innerHTML='<p class="unit-text">Please search for a city!</p>':getCityData()}function getImages(t){var e,n="/bill742/weather-app/master/images/";e=t>199&&t<300?"url("+n+"200-thunder.jpg)":t>299&&t<500?"url("+n+"500-rain.jpg)":t>499&&t<600?"url("+n+"500-rain.jpg)":t>599&&t<700?"url("+n+"600-snow.jpg)":t>699&&t<800?"url("+n+"700-fog.jpg)":t>800&&t<900?"url("+n+"800-clouds.jpg)":t>899&&t<950||t>958&&t<970?"url("+n+"900-hurricane.jpg)":"url("+n+"950-sunny.jpg)",$("body").css("background-image",e)}function changeUnit(){var t=document.getElementById("unitBtn");"Show me Celcius"==t.value?(unitIcon="°C",unit="metric",t.value="Show me Fahrenheit"):(unitIcon="°F",unit="imperial",t.value="Show me Celcius"),getCityData()}if(document.getElementById("search").onkeypress=function(t){13!=t.keyCode&&13!=t.which||getCity()},"geolocation"in navigator){var localInfo="http://ip-api.com/json/?callback=?";$.getJSON(localInfo,function(t){$.each(t,function(t,e){"city"===t&&(city=e,document.getElementById("nogeo").style.display="none",document.getElementById("unitBtn").style.display="block",getCityData(city))})})}var unit="imperial",unitIcon="°F";