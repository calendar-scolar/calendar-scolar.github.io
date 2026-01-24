import { CSSClasses } from "./calendar-utils.js";
import { DataService } from "./data/data-services.js";
import { LocalizationService } from "./localization.js";

export class SchoolYearLegendDisplay {
  constructor(legendId) {
    this.container = document.getElementById(legendId);
    this.dataService = new DataService();
  }

  show(postalCode) {
    this.container.innerText = "";
    const factory = new LegendContentsFactory(
      this.container,
      this.#loadData(postalCode),
    );
    const caption = LocalizationService.getLegendCaption(postalCode);
    factory.create(caption);
  }

  #loadData(postalCode) {
    const data = this.dataService
      .getAdministrativeUnitLegend(postalCode)
      .map((item) => {
        return { ...item, cssClass: null };
      });
    data.push({
      name: "Weekend",
      color: null,
      cssClass: CSSClasses.calendarDayWeekend,
    });
    return data;
  }
}

class LegendContentsFactory {
  constructor(container, data) {
    this.container = container;
    this.data = data;
  }

  create(caption) {
    const heading = this.container.appendChild(document.createElement("h2"));
    heading.innerText = caption;
    const list = this.container.appendChild(document.createElement("ul"));

    for (const item of this.data) {
      const li = list.appendChild(document.createElement("li"));
      const span = li.appendChild(document.createElement("span"));
      span.innerHTML = "&nbsp;";
      const { name, color, cssClass } = item;
      if (cssClass) {
        span.classList.add(cssClass);
      }
      if (color) {
        span.style.backgroundColor = color;
      }
      li.innerHTML += name;
    }
  }
}

export class YearOverviewLegendDisplay {
  constructor(legendElementId) {
    this.dataService = new DataService();
    this.legendContainer = document.getElementById(legendElementId);
  }

  show() {
    this.legendContainer.innerText = "";

    const table = this.legendContainer.appendChild(
      document.createElement("table"),
    );
    table.classList.add(CSSClasses.overviewLegend);

    const tbody = table.createTBody();
    this.#addSchoolDayRow(
      tbody,
      LocalizationService.getFirstSchoolDay(),
      this.dataService.getStartDate(),
    );
    const coloredLines = this.#addVacations(
      tbody,
      this.dataService.getVacations(),
    );
    this.#addSchoolDayRow(
      tbody,
      LocalizationService.getLastSchoolDay(),
      this.dataService.getEndDate(),
    );
    this.#formatColoredLines(coloredLines);
  }

  #formatColoredLines(coloredLines) {
    const index = Math.floor(coloredLines.length / 2);
    for (let i = 0; i < coloredLines.length; i++) {
      if (i === index) {
        continue;
      }
      const td = coloredLines[i].firstChild;
      td.innerText = "";
    }
  }

  #addVacations(tbody, vacations) {
    var coloredLines = [];
    for (const vacation of vacations) {
      const { name, start, end, unitCodes } = vacation;
      const color = unitCodes ? vacation.color : null;
      const tr = this.#addVacationRow(
        tbody,
        name,
        new Date(start),
        new Date(end),
        color,
      );
      if (color) {
        coloredLines.push(tr);
      }
    }
    return coloredLines;
  }

  #addVacationRow(tbody, text, startDate, endDate, color) {
    const tr = tbody.insertRow();
    const name = tr.insertCell();
    name.innerText = text;
    const value = tr.insertCell();
    if (color) {
      const span = value.appendChild(document.createElement("span"));
      span.innerHTML = "&nbsp;";
      span.style.backgroundColor = color;
    }
    value.innerHTML += `${this.#formatDate(startDate)} &ndash; ${this.#formatDate(endDate)}`;
    return tr;
  }

  #addSchoolDayRow(tbody, text, date) {
    const tr = tbody.insertRow();
    const nameCell = tr.insertCell();
    nameCell.innerText = text;
    const valueCell = tr.insertCell();
    valueCell.innerText = this.#formatDate(date);
  }

  #formatDate(date) {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${dd}.${MM}.${yyyy}`;
  }
}
