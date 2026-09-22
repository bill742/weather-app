// OpenWeatherMap gives Unix timestamps plus the city's UTC offset in seconds.
// Shifting by the offset and formatting in UTC yields the city's local time,
// independent of the viewer's own time zone.
const formatLocal = (
    unix: number,
    timezoneOffsetSeconds: number,
    options: Intl.DateTimeFormatOptions,
): string =>
    new Date((unix + timezoneOffsetSeconds) * 1000).toLocaleString('en-US', {
        ...options,
        timeZone: 'UTC',
    });

const formatTime = (unix: number, timezoneOffsetSeconds: number): string =>
    formatLocal(unix, timezoneOffsetSeconds, {
        hour: 'numeric',
        hour12: true,
        minute: '2-digit',
    });

export const formatHour = (unix: number, timezoneOffsetSeconds: number) =>
    formatLocal(unix, timezoneOffsetSeconds, { hour: 'numeric', hour12: true });

export const formatWeekday = (unix: number, timezoneOffsetSeconds: number) =>
    formatLocal(unix, timezoneOffsetSeconds, { weekday: 'short' });

export const formatLongDate = (unix: number, timezoneOffsetSeconds: number) =>
    formatLocal(unix, timezoneOffsetSeconds, {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
    });

// Calendar day in the city's local time, for "is this today?" comparisons.
export const localDayKey = (unix: number, timezoneOffsetSeconds: number) =>
    new Date((unix + timezoneOffsetSeconds) * 1000).toISOString().slice(0, 10);

export default formatTime;
