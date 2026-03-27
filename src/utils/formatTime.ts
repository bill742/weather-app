const formatTime = (unix: number, timezoneOffsetSeconds: number): string =>
    new Date((unix + timezoneOffsetSeconds) * 1000).toLocaleTimeString(
        'en-US',
        {
            hour: 'numeric',
            hour12: true,
            minute: '2-digit',
            timeZone: 'UTC',
        },
    );

export default formatTime;
