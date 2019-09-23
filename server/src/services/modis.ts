import { format, subDays } from "date-fns";
import { LocationEntity } from "./location";

// todo: fix SSL errors
export const getMaps = async (location: LocationEntity, numDays: number) => {
  const result = [];
  for (let i = 0; i < numDays; i++) {
    const date = subDays(new Date(), i);
    // format: "http://ge.ssec.wisc.edu/modis-today/images/aqua/true_color/[YEAR]_[MONTH]_[DATE]_[DAY_OF_YEAR]/a1.[YEAR2][DAY_OF_YEAR].USA7.143.250m.jpg";
    result.push({
      date: date.toISOString(),
      url: `http://ge.ssec.wisc.edu/modis-today/images/aqua/true_color/${format(
        date,
        "yyyy"
      )}_${format(date, "MM")}_${format(date, "dd")}_${format(
        date,
        "DDD"
      )}/a1.${format(date, "yy")}${format(date, "DDD")}.${
        location.modisArea
      }.143.250m.jpg`
    });
  }

  return result;
};
