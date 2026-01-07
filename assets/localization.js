export class LocalizationService {
  static getDocumentTitle(startYear, endYear) {
    return `Calendar școlar ${startYear} - ${endYear}`;
  }

  static getCalendarTitle(startYear, endYear) {
    return `Calendar școlar ${startYear} &ndash; ${endYear}`;
  }

  static getLegendCaption(postalCode) {
    const type = postalCode == "B" ? "municipiul" : "județul";
    const name = localizedNames.get(postalCode);
    return `Calendarul școlar pentru ${type} ${name}`;
  }
}

const localizedNames = new Map([
  ["AB", "Alba"],
  ["AG", "Argeș"],
  ["AR", "Arad"],
  ["BC", "Bacău"],
  ["BH", "Bihor"],
  ["B", "București"],
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
