import suncalc from "suncalc";
import { addDays, format } from "date-fns";
import axios from "axios";

export const getSunInfo = (
  start: Date,
  end: Date,
  lat: number,
  long: number
): {
  date: string;
  sunrise: string;
  nauticalDawn: string;
  sunset: string;
  dawn: string;
  dusk: string;
  nauticalDusk: string;
}[] => {
  let results = [];
  let cur = start;

  while (cur <= end) {
    const result = suncalc.getTimes(cur, lat, long);
    results.push({
      date: cur.toISOString(),
      sunrise: result.sunrise.toISOString(),
      nauticalDawn: result.nauticalDawn.toISOString(),
      sunset: result.sunset.toISOString(),
      dawn: result.dawn.toISOString(),
      dusk: result.dusk.toISOString(),
      nauticalDusk: result.nauticalDusk.toISOString()
    });
    cur = addDays(cur, 1);
  }
  return results;
};

const getMoonInfoForDate = async (
  date: Date,
  lat: number,
  long: number
): Promise<{ date: string; phase: string; illumination: number }> => {
  // http://aa.usno.navy.mil/data/docs/api.php
  const url = `https://api.usno.navy.mil/rstt/oneday?date=${format(
    date,
    "M/d/yyyy"
  )}&coords=${lat},${long}`;
  const { data } = await axios.get(url);
  const phase = data.curphase || data.closestphase.phase;

  return {
    date: date.toISOString(),
    phase,
    illumination: data.fracillum
      ? Number(data.fracillum.replace("%", ""))
      : calcIlluminationFromPhase(phase)
  };
};

export const getMoonInfo = async (
  start: Date,
  end: Date,
  lat: number,
  long: number
): Promise<{ date: string; phase: string; illumination: number }[]> => {
  let dates = [];
  let cur = start;
  while (cur <= end) {
    dates.push(cur);
    cur = addDays(cur, 1);
  }
  const promises = dates.map(date => getMoonInfoForDate(date, lat, long));
  return Promise.all(promises);
};

function calcIlluminationFromPhase(phase: string): number {
  if (phase.toLowerCase() === "new moon") {
    return 0;
  } else if (
    phase.toLowerCase() === "last quarter" ||
    phase.toLowerCase() === "first quarter"
  ) {
    return 50;
  } else if (phase.toLowerCase() === "full moon") {
    return 100;
  }

  return 0;
}
