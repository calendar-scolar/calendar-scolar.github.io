export class CSSClasses {
  static get invisible() {
    return "invisible";
  }
  static get calendarDay() {
    return "calendar-day";
  }
  static get calendarDayEmpty() {
    return "calendar-day-empty";
  }
  static get calendarDayWeekend() {
    return "calendar-day-weekend";
  }
  static get calendarMonth() {
    return "calendar-month";
  }
  static get legendCaption() {
    return "legend-caption";
  }
  static get legendItemLabel() {
    return "legend-item-label";
  }
  static get legendItemText() {
    return "legend-item-text";
  }
}

export function toISOShortDate(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd}`;
}

/**
 * Returns the day of the week for a given date, where 0 is Monday, and 6 is Sunday.
 * @param {Date} date - The input date.
 * @returns {number} The day of the week, where 0 is Monday and 6 is Sunday.
 */
export function getWeekDay(date) {
  return (date.getDay() + 6) % 7;
}

export function isWeekend(date) {
  return getWeekDay(date) > 4;
}
