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
