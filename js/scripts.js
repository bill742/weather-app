function getCityData(){document.getElementById("unitBtn").style.display="block",$.ajax({url:"http://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+unit+"&id=524901&APPID=b32c84201db94b92ed42d393cac6526b",data:{format:"json"},error:function(){$("#dataBox").html('<p class="unit-text">There was an error retreiving results. Please try again.</p>')},dataType:"jsonp",success:function(t){$("#dataBox").empty();var e=t.main.temp,n=JSON.stringify(e).split(".",1),a=t.name,i=t.weather[0].id;$("#dataBox").append('<p class="data-city">'+a+"</p>").append('<i class="owf owf-'+t.weather[0].id+'"></i>').append('<p class="unit-text">'+t.weather[0].main+"</p>").append('<p id="unitText" class="unit-text">Current Temperature: '+n+unitIcon+"</p>"),getImages(i)},type:"GET"})}function getCity(){city=document.getElementById("search").value,""===city?(document.getElementById("dataBox").innerHTML='<p class="unit-text">Please search for a city!</p>',document.getElementById("unitBtn").style.display="none"):getCityData()}function getImages(t){var e,n="https://raw.githubusercontent.com/bill742/weather-app/master/images/";e=t>199&&t<300?"url("+n+"200-thunder.jpg)":t>299&&t<500?"url("+n+"500-rain.jpg)":t>499&&t<600?"url("+n+"500-rain.jpg)":t>599&&t<700?"url("+n+"600-snow.jpg)":t>699&&t<800?"url("+n+"700-fog.jpg)":t>800&&t<900?"url("+n+"800-clouds.jpg)":t>899&&t<950||t>958&&t<970?"url("+n+"900-hurricane.jpg)":"url("+n+"950-sunny.jpg)",$("body").css("background-image",e)}function changeUnit(){var t=document.getElementById("unitBtn");"Show me Celcius"==t.value?(unitIcon="°C",unit="metric",t.value="Show me Fahrenheit"):(unitIcon="°F",unit="imperial",t.value="Show me Celcius"),getCityData()}var city,unit,unitIcon;if(document.getElementById("search").onkeypress=function(t){13!=t.keyCode&&13!=t.which||getCity()},"geolocation"in navigator){var localInfo="http://ip-api.com/json/?callback=?";$.getJSON(localInfo,function(t){$.each(t,function(t,e){"city"===t&&(city=e,document.getElementById("unitBtn").style.display="block",getCityData(city))})})}unit="imperial",unitIcon="°F";