export class CSSClasses {
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
}

export function toISOShortDate(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd}`;
}
