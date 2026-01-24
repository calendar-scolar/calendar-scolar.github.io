import { SchoolYear } from "./app-data.js";

export class DataService {
  getAdminUnitsColorMap() {
    const vacations = SchoolYear.calendar
      .filter((x) => x.type == "vacation")
      .filter((x) => x.hasOwnProperty("unitCodes"))
      .filter((x) => x.unitCodes.length > 0);
    const clusters = vacations.flatMap((v) => {
      const color = v.color;
      const unitCodes = v.unitCodes.split(",");
      return unitCodes.map((code) => [code.trim(), color]);
    });

    return new Map(clusters);
  }

  getStartYear() {
    return new Date(SchoolYear.start).getFullYear();
  }

  getEndYear() {
    return this.getStartYear() + 1;
  }

  getStartDate() {
    return new Date(SchoolYear.start);
  }

  getEndDate() {
    return new Date(SchoolYear.end.all);
  }

  getAdministrativeUnitData(postalCode, dateFormat) {
    const data = this.#getSortedIntervals(postalCode).flatMap((period) => {
      var date = new Date(period.start);
      var end = new Date(period.end);
      const result = [];
      while (date <= end) {
        result.push([dateFormat(date), period.color]);
        date.setDate(date.getDate() + 1);
      }
      return result;
    });
    const map = new Map(data);
    return map;
  }

  getVacations() {
    const vacations = SchoolYear.calendar
      .filter((module) => {
        const moduleType = module.type;
        return moduleType === "vacation";
      })
      .toSorted((a, b) => a.start.localeCompare(b.start));
    return vacations;
  }

  getAdministrativeUnitLegend(postalCode) {
    const data = this.#getSortedIntervals(postalCode).map((period) => {
      return { color: period.color, name: period.name };
    });
    return data;
  }

  #getSortedIntervals(postalCode) {
    return SchoolYear.calendar
      .filter((x) => {
        const unitCodes = x.unitCodes;
        if (!unitCodes) {
          return true;
        }
        return unitCodes
          .split(",")
          .map((code) => code.trim())
          .includes(postalCode);
      })
      .toSorted((a, b) => a.start.localeCompare(b.start));
  }
}
