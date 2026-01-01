import { DataService } from "./data/data-services.js";
import { CalendarDisplay } from "./calendar-display.js";

const localizedNames = new Map([
  ["AB", "Alba"],
  ["AG", "Argeș"],
  ["AR", "Arad"],
  ["BC", "Bacău"],
  ["BH", "Bihor"],
  ["BI", "București"],
  ["BN", "Bistrița-Năsăud"],
  ["BR", "Brăila"],
  ["BT", "Botoșani"],
  ["BV", "Brașov"],
  ["BZ", "Buzău"],
  ["CJ", "Cluj"],
  ["CL", "Călărași"],
  ["CS", "Caraș-Severin"],
  ["CT", "Constanța"],
  ["CV", "Covasna"],
  ["DB", "Dâmbovița"],
  ["DJ", "Dolj"],
  ["GJ", "Gorj"],
  ["GL", "Galați"],
  ["GR", "Giurgiu"],
  ["HD", "Hunedoara"],
  ["HR", "Harghita"],
  ["IF", "Ilfov"],
  ["IL", "Ialomița"],
  ["IS", "Iași"],
  ["MH", "Mehedinți"],
  ["MM", "Maramureș"],
  ["MS", "Mureș"],
  ["NT", "Neamț"],
  ["OT", "Olt"],
  ["PH", "Prahova"],
  ["SB", "Sibiu"],
  ["SJ", "Sălaj"],
  ["SM", "Satu Mare"],
  ["SV", "Suceava"],
  ["TL", "Tulcea"],
  ["TM", "Timiș"],
  ["TR", "Teleorman"],
  ["VL", "Vâlcea"],
  ["VN", "Vrancea"],
  ["VS", "Vaslui"],
]);

const postalCodesMap = new Map([["BI", "B"]]);

export class MapDisplay {
  constructor(mapId) {
    this.map = document.getElementById(mapId);
    this.map.addEventListener("load", this.#onMapLoaded);
    this.dataService = new DataService();
  }

  initialize() {
    const svgDoc = this.map.contentDocument;
    const adminUnits = svgDoc.querySelectorAll("path");
    const adminUnitsColors = this.dataService.getAdminUnitsColorMap();
    adminUnits.forEach((unit) => {
      const postalCode = this.#getPostalCode(unit);
      unit.setAttribute("postal_ro", postalCode);
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

  #onMapLoaded() {
    const svgDoc = this.contentDocument;
    const adminUnits = svgDoc.querySelectorAll("path");
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
    });
  }
}
