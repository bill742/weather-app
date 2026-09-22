import clear from '../assets/backgrounds/clear.jpg';
import fog from '../assets/backgrounds/fog.jpg';
import night from '../assets/backgrounds/night.jpg';
import overcast from '../assets/backgrounds/overcast.jpg';
import partlyCloudy from '../assets/backgrounds/partly-cloudy.jpg';
import rain from '../assets/backgrounds/rain.jpg';
import snow from '../assets/backgrounds/snow.jpg';
import thunderstorm from '../assets/backgrounds/thunderstorm.jpg';
import type { WeatherData } from '../types/weather';

export interface Scene {
    // Accent colour that tints the UI to match the photo.
    accent: string;
    // Photographer, for the on-page credit. All photos are CC0 or public
    // domain via Wikimedia Commons (sources listed in the README).
    credit: string;
    image: string;
    name: string;
}

const SCENES = {
    clear: {
        accent: '#f7c566',
        credit: 'unknown photographer',
        image: clear,
        name: 'clear',
    },
    fog: { accent: '#dcd3c2', credit: 'JustinH', image: fog, name: 'fog' },
    night: {
        accent: '#a5b2ff',
        credit: 'Nathan Anderson',
        image: night,
        name: 'night',
    },
    overcast: {
        accent: '#c5d0dc',
        credit: 'Free Nature Stock',
        image: overcast,
        name: 'overcast',
    },
    partlyCloudy: {
        accent: '#9fd0ff',
        credit: 'US Forest Service, Northern Region',
        image: partlyCloudy,
        name: 'partly-cloudy',
    },
    rain: { accent: '#8fd1c7', credit: 'W.carter', image: rain, name: 'rain' },
    snow: {
        accent: '#d4ecff',
        credit: 'George Chernilevsky',
        image: snow,
        name: 'snow',
    },
    thunderstorm: {
        accent: '#c3a8ff',
        credit: 'Leonhard Lenz',
        image: thunderstorm,
        name: 'thunderstorm',
    },
} satisfies Record<string, Scene>;

export const DEFAULT_SCENE: Scene = SCENES.partlyCloudy;

// Map an OpenWeatherMap condition code to a scene.
// https://openweathermap.org/weather-conditions
const getScene = (current: WeatherData): Scene => {
    const { id } = current.weather[0];
    const isNight =
        current.dt < current.sys.sunrise || current.dt > current.sys.sunset;

    if (id >= 200 && id < 300) return SCENES.thunderstorm;
    if (id >= 300 && id < 600) return SCENES.rain;
    if (id >= 600 && id < 700) return SCENES.snow;
    if (id >= 700 && id < 800) return SCENES.fog;
    if (id <= 802 && isNight) return SCENES.night;
    if (id === 800) return SCENES.clear;
    if (id <= 802) return SCENES.partlyCloudy;
    return SCENES.overcast;
};

export default getScene;
