function getImages(code){
    var path ='/images/';
    var bgUrl;
    var num = (code > 950) ? 10 : Math.floor(code/100);

    // TODO: add default image for non-JS browsers

    switch (num) {
    case 1:
    case 2:
        bgUrl = `url(${path}200-thunder.jpg)`;
        break;
    case 3:
    case 4:
        bgUrl = `url(${path}500-rain.jpg)`;
        break;
    case 6:
        bgUrl = `url(${path}600-snow.jpg)`;
        break;
    case 7:
        bgUrl = `url(${path}700-fog.jpg)`;
        break;
    case 8:
        bgUrl = `url(${path}800-clouds.jpg)`;
        break;
    case 9:
        bgUrl = `url(${path}900-hurricane.jpg)`;
        break;
    case 10:
        bgUrl = `url(${path}950-sunny.jpg)`;
        break;
    default:
        bgUrl = `url(${path}950-sunny.jpg)`;
    }
    document.body.style.backgroundImage = bgUrl;
}
