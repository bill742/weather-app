/**
 * WeatherWidget - Modern class-based weather display component
 * Handles geolocation, weather API fetching, and temperature unit toggling
 */
class WeatherWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.unit = 'metric';
        this.abortController = null;
    }

    /**
     * Initialize the widget and fetch weather data
     */
    async init() {
        this.render(this.getSpinner());

        try {
            const position = await this.getGeolocation();
            await this.fetchAndDisplayWeather(position.coords);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Promisified geolocation API
     * @returns {Promise<GeolocationPosition>}
     */
    getGeolocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        });
    }

    /**
     * Fetch weather data from OpenWeatherMap API and display it
     * @param {GeolocationCoordinates} coords - User's coordinates
     */
    async fetchAndDisplayWeather(coords) {
        // Cancel previous request if exists
        if (this.abortController) {
            this.abortController.abort();
        }
        this.abortController = new AbortController();

        try {
            const apiKey = process.env.OPENWEATHER_API_KEY;
            const { latitude: lat, longitude: lon } = coords;

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${this.unit}&appid=${apiKey}`,
                { signal: this.abortController.signal },
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            this.render(this.getWeatherTemplate(data));
            this.attachEventListeners();
        } catch (error) {
            if (error.name !== 'AbortError') {
                throw error;
            }
        }
    }

    /**
     * Generate loading spinner HTML
     * @returns {string} Spinner HTML
     */
    getSpinner() {
        return `<div id="spinner" class="sk-chase">
            ${Array(6).fill('<div class="sk-chase-dot"></div>').join('')}
        </div>`;
    }

    /**
     * Generate weather display template
     * @param {Object} data - Weather API response data
     * @returns {string} Weather HTML template
     */
    getWeatherTemplate(data) {
        const { temp, feels_like } = data.main;
        const { main, id } = data.weather[0];
        const unitIcon = this.unit === 'metric' ? '°C' : '°F';
        const unitBtnText =
            this.unit === 'metric' ? 'View in Fahrenheit' : 'View in Celsius';

        return `
            <i class="owf owf-${id}" aria-hidden="true"></i>
            <p class="unit-text">${this.escapeHtml(main)}</p>
            <p class="unit-text">Current Temperature: ${Math.round(
                temp,
            )} ${unitIcon}</p>
            <p class="unit-text">Feels like: ${Math.round(
                feels_like,
            )} ${unitIcon}</p>
            <button id="unitBtn" class="unit-btn" type="button">
                ${unitBtnText}
            </button>
        `;
    }

    /**
     * Attach event listeners to the unit toggle button
     * Prevents memory leaks by replacing the button element
     */
    attachEventListeners() {
        const btn = this.container.querySelector('#unitBtn');
        if (btn) {
            // Remove old listener by replacing the element
            const newBtn = btn.cloneNode(true);
            btn.replaceWith(newBtn);

            newBtn.addEventListener('click', () => this.toggleUnit());
        }
    }

    /**
     * Toggle between metric and imperial units
     */
    async toggleUnit() {
        this.unit = this.unit === 'metric' ? 'imperial' : 'metric';

        try {
            const position = await this.getGeolocation();
            await this.fetchAndDisplayWeather(position.coords);
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Render HTML content to the container
     * @param {string} html - HTML content to render
     */
    render(html) {
        this.container.innerHTML = html;
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Handle errors with user-friendly messages
     * @param {Error} error - Error object
     */
    handleError(error) {
        console.error('Weather widget error:', error);

        let message = 'Unable to load weather data. Please try again.';

        if (error.code === 1) {
            message =
                'Location permission denied. Please enable location access.';
        } else if (error.code === 2) {
            message = 'Location information is unavailable.';
        } else if (error.code === 3) {
            message = 'Location request timed out. Please try again.';
        }

        this.render(`<p class="error-text">${message}</p>`);
    }

    /**
     * Clean up resources and event listeners
     */
    destroy() {
        if (this.abortController) {
            this.abortController.abort();
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default WeatherWidget;
