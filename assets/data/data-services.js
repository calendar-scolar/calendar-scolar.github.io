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

  getAdministrativeUnitData(postalCode, dateFormat) {
    const data = SchoolYear.calendar
      .filter((x) => {
        const unitCodes = x.unitCodes;
        if (!unitCodes) {
          return true;
        }
        return unitCodes.includes(postalCode);
      })
      .toSorted((a, b) => a.start.localeCompare(b.start))
      .flatMap((period) => {
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
}
