// Validate search box
const searchBtn = document.querySelector('.search-btn');

function getCity(unit, unitIcon) {
    const city = document.getElementById('search').value;
    if (city === '') {
        //     document.getElementById('dataBox').innerHTML = '<p class="unit-text">Please search for a city!</p>';
        //     document.getElementById('unitBtn').style.display = 'none';
        //   } else {
        //     getCityData();
        //   }
    }
    // Allow search to work by pressing Enter
    // document.getElementById('search').onkeypress = function(event){
    //   if (event.keyCode == 13 || event.which == 13){
    //     getCity();
    //   }
}

searchBtn.addEventListener(
    'click',
    () => {
        getCity(unit, unitIcon);
    },
    false
);
