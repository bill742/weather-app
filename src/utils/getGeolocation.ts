const getGeolocation = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }),
    );

export default getGeolocation;
