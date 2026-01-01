import { DataService } from "./data/data-services.js";
import { CSSClasses } from "./constants.js";

export class CalendarDisplay {
  constructor() {
    this.dataService = new DataService();
  }

  initialize(postalCode) {
    const calendarDays = document.getElementsByClassName(
      CSSClasses.calendarDay,
    );
    const schoolCalendar =
      this.dataService.getAdministrativeUnitData(postalCode);

    console.debug(schoolCalendar);
    for (const day of calendarDays) {
      if (!day.dataset.date) {
        continue;
      }

      if (this.#isWeekend(day)) {
        continue;
      }

      const color = schoolCalendar.get(day.dataset.date);
      if (color) {
        day.style.backgroundColor = color;
      }
    }
  }

  #isWeekend(day) {
    const date = new Date(day.dataset.date);
    const weekDay = date.getDay();
    return weekDay === 0 || weekDay === 6;
  }
}
