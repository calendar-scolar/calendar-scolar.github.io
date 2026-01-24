import { DataService } from "./data/data-services.js";
import { CSSClasses } from "./calendar-utils.js";
import { toISOShortDate, isWeekend } from "./calendar-utils.js";

export class CalendarDisplay {
  constructor() {
    this.dataService = new DataService();
  }

  initialize(calendarContainerId, postalCode) {
    const calendarDays = document.getElementsByClassName(
      CSSClasses.calendarDay,
    );
    const calendarColors = this.dataService.getAdministrativeUnitData(
      postalCode,
      toISOShortDate,
    );
    this.#setColors(calendarDays, calendarColors);

    this.#makeCalendarVisible(calendarContainerId);
  }

  #setColors(calendarDays, calendarColors) {
    for (const day of calendarDays) {
      if (!day.dataset.date) {
        continue;
      }

      if (this.#isWeekend(day)) {
        continue;
      }

      const color = calendarColors.get(day.dataset.date);
      if (color) {
        day.style.backgroundColor = color;
      }
    }
  }

  #isWeekend(day) {
    const date = new Date(day.dataset.date);
    return isWeekend(date);
  }

  #makeCalendarVisible(containerElementId) {
    const calendarContainer = document.getElementById(containerElementId);
    calendarContainer.classList.remove(CSSClasses.invisible);
  }
}
