import { DataService } from "./data/data-services.js";
import { CalendarDisplay } from "./calendar-display.js";
import { LocalizationService } from "./localization.js";
import {
  SchoolYearLegendDisplay,
  YearOverviewLegendDisplay,
} from "./legend-display.js";

const postalCodesMap = new Map([["BI", "B"]]);

export class MapDisplay {
  constructor(mapId, legendId, calendarContainerId, tooltipId) {
    this.map = document.getElementById(mapId);
    this.legendId = legendId;
    this.calendarContainerId = calendarContainerId;
    this.tooltipId = tooltipId;
    this.dataService = new DataService();
  }

  initialize() {
    const svgDoc = this.map.contentDocument;
    const adminUnits = MapUtils.getAllAdministrativeUnits(svgDoc);
    const adminUnitsColors = this.dataService.getAdminUnitsColorMap();
    adminUnits.forEach((unit) => {
      const postalCode = this.#getPostalCode(unit);
      AdministrativeUnit.setPostalCode(unit, postalCode);
      AdministrativeUnit.setLegendId(unit, this.legendId);
      AdministrativeUnit.setTooltipId(unit, this.tooltipId);
      AdministrativeUnit.setCalendarContainerId(unit, this.calendarContainerId);
      AdministrativeUnit.setEmphasis(unit, false);
      AdministrativeUnit.deselect(unit);

      const color = adminUnitsColors.get(postalCode);
      if (color) {
        unit.style.fill = color;
      }
    });

    adminUnits.forEach((unit) => {
      unit.addEventListener("mousemove", (e) => {
        const target = e.target;
        AdministrativeUnit.setEmphasis(target, true);
        const tooltip = document.getElementById(
          AdministrativeUnit.getTooltipId(target),
        );
        tooltip.style.transform = `translate(${e.offsetX}px, ${e.offsetY}px)`;
        const postalCode = AdministrativeUnit.getPostalCode(target);
        tooltip.innerHTML = `
        <span>
            ${LocalizationService.getLocalizedName(postalCode)}
        </span>`;
      });

      unit.addEventListener("mouseout", (e) => {
        const target = e.target;
        if (!AdministrativeUnit.isSelected(target)) {
          AdministrativeUnit.setEmphasis(target, false);
        }
        const tooltip = document.getElementById(
          AdministrativeUnit.getTooltipId(target),
        );
        // tooltip.innerHTML = "";
      });

      unit.addEventListener("click", function () {
        this.parentElement.childNodes.forEach((u) => {
          AdministrativeUnit.deselect(u);
          AdministrativeUnit.setEmphasis(u, false);
        });

        AdministrativeUnit.select(this);
        AdministrativeUnit.setEmphasis(this, true);

        const postalCode = AdministrativeUnit.getPostalCode(this);
        const calendarDisplay = new CalendarDisplay();
        calendarDisplay.initialize(
          AdministrativeUnit.getCalendarContainerId(this),
          postalCode,
        );
        const legendDisplay = new SchoolYearLegendDisplay(
          AdministrativeUnit.getLegendId(this),
        );
        legendDisplay.show(postalCode);
      });
    });

    const legendDisplay = new YearOverviewLegendDisplay(this.legendId);
    legendDisplay.show();
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

class AdministrativeUnit {
  static setEmphasis(unit, emphasis) {
    unit.style.opacity = emphasis ? 1 : 0.8;
    unit.style.strokeWidth = emphasis ? "3px" : "initial";
    unit.style.cursor = emphasis ? "pointer" : "default";
  }

  static isSelected(unit) {
    const selected = Boolean(unit.getAttribute("selected"));
    return selected;
  }

  static select(unit) {
    unit.setAttribute("selected", true);
  }

  static deselect(unit) {
    unit.removeAttribute("selected");
  }

  static getPostalCode(administrativeUnit) {
    return administrativeUnit.attributes.postal_ro.value;
  }

  static setPostalCode(administrativeUnit, postalCode) {
    administrativeUnit.setAttribute("postal_ro", postalCode);
  }

  static getLegendId(administrativeUnit) {
    return administrativeUnit.attributes.legend_id.value;
  }

  static setLegendId(administrativeUnit, legendId) {
    administrativeUnit.setAttribute("legend_id", legendId);
  }

  static getCalendarContainerId(administrativeUnit) {
    return administrativeUnit.attributes.calendar_container_id.value;
  }

  static setCalendarContainerId(administrativeUnit, calendarContainerId) {
    administrativeUnit.setAttribute(
      "calendar_container_id",
      calendarContainerId,
    );
  }

  static getTooltipId(administrativeUnit) {
    return administrativeUnit.attributes.tooltip_id.value;
  }

  static setTooltipId(administrativeUnit, tooltipId) {
    administrativeUnit.setAttribute("tooltip_id", tooltipId);
  }
}

class MapUtils {
  static getAllAdministrativeUnits(svgDoc) {
    return svgDoc.querySelectorAll("path");
  }
}
