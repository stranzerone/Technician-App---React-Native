// hooks/useConvertToSystemTime.js
import { useMemo } from 'react';

const useConvertToSystemTime = (utcDate) => {
  const convertToSystemTime = useMemo(() => {
    if (!utcDate) return '';

    try {
      // Detect the system's time zone
      const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Parse the UTC date
      const [datePart, timePart, period] = utcDate.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute, second] = timePart.split(':');

      // Convert to 24-hour format if period is provided (AM/PM)
      let hours = parseInt(hour, 10);
      if (period) {
        if (period.toLowerCase() === 'pm' && hours !== 12) {
          hours += 12;
        } else if (period.toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }
      }

      // Create a UTC Date object
      const utcDateObj = new Date(Date.UTC(year, month - 1, day, hours, minute, second));

      // Convert to the system's local time
      const systemTime = utcDateObj.toLocaleString('en-US', {
        timeZone: systemTimeZone,
        hour12: true,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
       
      });

      return systemTime;
    } catch (error) {
      console.error('Error parsing UTC date:', error);
      return 'Invalid Date';
    }
  }, [utcDate]);

  return convertToSystemTime;
};

export default useConvertToSystemTime;
