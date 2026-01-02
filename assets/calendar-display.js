import { DataService } from "./data/data-services.js";
import { CSSClasses } from "./calendar-utils.js";
import { toISOShortDate, isWeekend } from "./calendar-utils.js";

export class CalendarDisplay {
  constructor() {
    this.dataService = new DataService();
  }

  initialize(postalCode) {
    const calendarDays = document.getElementsByClassName(
      CSSClasses.calendarDay,
    );
    const schoolCalendar = this.dataService.getAdministrativeUnitData(
      postalCode,
      toISOShortDate,
    );

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
    return isWeekend(date);
  }
}
