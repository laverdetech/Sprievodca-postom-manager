export const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const numDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= numDays; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
};

export const formatToYYYYMMDD = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const getCalendarGridDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const gridDays: Date[] = [];

    // Slovak weeks start on Monday (1). getDay() is Sun=0, Mon=1...Sat=6.
    let startDayOfWeek = firstDayOfMonth.getDay();
    if (startDayOfWeek === 0) startDayOfWeek = 7; // Convert Sunday to 7

    // Days from previous month
    for (let i = 1; i < startDayOfWeek; i++) {
        const prevMonthDay = new Date(firstDayOfMonth);
        prevMonthDay.setDate(prevMonthDay.getDate() - (startDayOfWeek - i));
        gridDays.push(prevMonthDay);
    }
    
    // Days of current month
    const daysInMonth = lastDayOfMonth.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        gridDays.push(new Date(year, month, i));
    }

    // Days from next month to fill the grid
    let nextMonthDayCount = 1;
    while (gridDays.length < 42) { // Ensure 6 rows (42 days) for consistent layout
       gridDays.push(new Date(year, month + 1, nextMonthDayCount++));
    }

    return gridDays;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export const formatDateToICS = (date: Date): string => {
    return date.getUTCFullYear() +
        (date.getUTCMonth() + 1).toString().padStart(2, '0') +
        date.getUTCDate().toString().padStart(2, '0') +
    'T' +
        date.getUTCHours().toString().padStart(2, '0') +
        date.getUTCMinutes().toString().padStart(2, '0') +
        date.getUTCSeconds().toString().padStart(2, '0') +
    'Z';
};
