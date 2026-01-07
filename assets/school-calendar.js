import { DataService } from "./data/data-services.js";
import { MonthCalendarFactory } from "./month-calendar-factory.js";
import { MapDisplay } from "./map-display.js";

export class SchoolCalendar {
  constructor(
    titleElementId,
    mapElementId,
    containerElementId,
    legendElementId,
  ) {
    const ds = new DataService();
    this.dataService = ds;
    this.startYear = ds.getStartYear();
    this.endYear = ds.getEndYear();
    this.titleElement = document.getElementById(titleElementId);
    this.containerElement = document.getElementById(containerElementId);
    this.mapDisplay = new MapDisplay(mapElementId, legendElementId);
  }

  initialize() {
    document.title = `Calendar școlar ${this.startYear} - ${this.endYear}`;
    this.titleElement.innerHTML = `Calendar școlar ${this.startYear} &ndash; ${this.endYear}`;
    for (let i = 9; i <= 12; i++) {
      const calendarFactory = new MonthCalendarFactory(i, this.startYear);
      this.containerElement.appendChild(calendarFactory.create());
    }
    for (let i = 1; i <= 6; i++) {
      const calendarFactory = new MonthCalendarFactory(i, this.endYear);
      this.containerElement.appendChild(calendarFactory.create());
    }
    this.mapDisplay.initialize();
  }
}
