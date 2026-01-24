import { CSSClasses } from "./calendar-utils.js";
import { DataService } from "./data/data-services.js";
import { LocalizationService } from "./localization.js";

export class SchoolYearLegendDisplay {
  constructor(legendId) {
    this.container = document.getElementById(legendId);
    this.dataService = new DataService();
  }

  initialize(postalCode) {
    this.container.innerText = "";
    const factory = new LegendTableFactory(
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

class LegendTableFactory {
  constructor(container, data) {
    this.container = container;
    this.data = data;
  }

  create(caption) {
    const table = this.container.appendChild(document.createElement("table"));
    const tableCaption = table.createCaption();
    tableCaption.textContent = caption;
    tableCaption.classList.add(CSSClasses.legendCaption);

    const body = table.createTBody();
    const data = this.data;
    let tr = null;
    for (let i = 0; i < data.length; i++) {
      if (i % 4 === 0) {
        tr = body.insertRow(-1);
      }
      this.#addLegendItem(tr, data[i]);
    }
  }

  #addLegendItem(tr, props) {
    const labelCell = tr.insertCell();
    const { name, color, cssClass } = props;
    labelCell.innerHTML = "&nbsp;";
    labelCell.classList.add(CSSClasses.legendItemLabel);
    if (cssClass) {
      labelCell.classList.add(cssClass);
    }
    if (color) {
      labelCell.style.backgroundColor = color;
    }

    const nameCell = tr.insertCell(-1);
    nameCell.textContent = name;
    nameCell.classList.add(CSSClasses.legendItemText);
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
