import { CSSClasses } from "./constants.js";

export class MonthCalendarFactory {
  // Month starts from 1, e.g.: `const calendar = new MonthCalendar(12, 2025);`
  constructor(month, year) {
    this.startDate = new Date(year, month - 1, 1);
    this.endDate = new Date(year, month, 0);
    this.weekDays = ["L", "M", "Mi", "J", "V", "S", "D"];
    this.monthNames = [
      "Ianuarie",
      "Februarie",
      "Martie",
      "Aprilie",
      "Mai",
      "Iunie",
      "Iulie",
      "August",
      "Septembrie",
      "Octombrie",
      "Noiembrie",
      "Decembrie",
    ];
  }

  create() {
    let wrapper = document.createElement("div");
    wrapper.classList.add(CSSClasses.calendarMonth);
    let table = document.createElement("table");
    wrapper.appendChild(table);
    this.#addTableCaption(table);
    this.#addTableHeading(table);
    this.#addTableBody(table);
    return wrapper;
  }

  #addTableCaption(table) {
    let caption = document.createElement("caption");
    caption.textContent = `${this.monthNames[this.startDate.getMonth()]} ${this.startDate.getFullYear()}`;
    table.appendChild(caption);
  }

  #addTableHeading(table) {
    let thead = document.createElement("thead");
    table.appendChild(thead);
    let headerRow = thead.appendChild(document.createElement("tr"));

    this.weekDays.forEach((day) => {
      let th = headerRow.appendChild(document.createElement("th"));
      th.textContent = day;
    });
  }

  #addTableBody(table) {
    let tBody = table.appendChild(document.createElement("tbody"));
    var currentDate = this.startDate;
    while (currentDate <= this.endDate) {
      currentDate = this.#createCalendarWeekRow(tBody, currentDate);
    }
  }

  #createCalendarWeekRow(tBody, startDate) {
    var tr = tBody.appendChild(document.createElement("tr"));

    var currentDate = startDate;
    const startWeekday = this.#getWeekDay(currentDate);
    var currentWeekDay = 0;
    while (
      currentWeekDay < this.weekDays.length &&
      currentWeekDay < startWeekday
    ) {
      this.#createCalendarDayCell(tr, null);
      currentWeekDay++;
    }

    while (
      currentWeekDay < this.weekDays.length &&
      currentDate <= this.endDate
    ) {
      this.#createCalendarDayCell(tr, currentDate);
      currentWeekDay++;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    while (currentWeekDay < this.weekDays.length) {
      this.#createCalendarDayCell(tr, null);
      currentWeekDay++;
    }
    return currentDate;
  }

  #getWeekDay(date) {
    let day = date.getDay();
    if (day === 0) {
      return 6;
    }
    return day - 1;
  }

  #createCalendarDayCell(parentRow, date) {
    let td = parentRow.appendChild(document.createElement("td"));
    td.classList.add(CSSClasses.calendarDay);
    if (!date) {
      td.classList.add(CSSClasses.calendarDayEmpty);
      td.innerHTML = "&nbsp;";
      return td;
    }

    if (this.#isWeekend(date)) {
      td.classList.add(CSSClasses.calendarDayWeekend);
    }

    td.textContent = `${date.getDate()}`;
    td.dataset.date = date.toLocaleDateString();

    return td;
  }

  #isWeekend(date) {
    return this.#getWeekDay(date) > 4;
  }
}
