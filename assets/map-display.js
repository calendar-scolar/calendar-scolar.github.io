import { DataService } from "./data/data-services.js";
import { CalendarDisplay } from "./calendar-display.js";
import { LegendDisplay } from "./legend-display.js";

const postalCodesMap = new Map([["BI", "B"]]);

export class MapDisplay {
  constructor(mapId, legendId) {
    this.map = document.getElementById(mapId);
    this.legendId = legendId;
    this.dataService = new DataService();
  }

  initialize() {
    const svgDoc = this.map.contentDocument;
    const adminUnits = svgDoc.querySelectorAll("path");
    const adminUnitsColors = this.dataService.getAdminUnitsColorMap();
    adminUnits.forEach((unit) => {
      const postalCode = this.#getPostalCode(unit);
      unit.setAttribute("postal_ro", postalCode);
      unit.setAttribute("legend_id", this.legendId);

      const color = adminUnitsColors.get(postalCode);
      if (color) {
        unit.style.fill = color;
      }
    });

    adminUnits.forEach((unit) => {
      unit.addEventListener("mousemove", (e) => {
        const target = e.target;
        target.style.opacity = 0.7;
        target.style.cursor = "pointer";
      });

      unit.addEventListener("mouseout", (e) => {
        const target = e.target;
        target.style.cursor = "default";
        target.style.opacity = 1;
      });

      unit.addEventListener("click", function () {
        const data = this.attributes;
        const postalCode = data.postal_ro.value;
        const calendarDisplay = new CalendarDisplay();
        calendarDisplay.initialize(postalCode);
        const legendDisplay = new LegendDisplay(data.legend_id.value);
        legendDisplay.initialize(postalCode);
      });
    });
  }

  #getPostalCode(adminUnit) {
    const data = adminUnit.attributes;
    const postalCode = data.postal.value;
    const normalizedPostalCode = postalCodesMap.get(postalCode);
    if (normalizedPostalCode) {
      return normalizedPostalCode;
    }
    return postalCode;
  }
}
