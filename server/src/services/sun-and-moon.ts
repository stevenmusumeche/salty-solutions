import { getSolunarData } from "@stevenmusumeche/solunar";
import { addDays, formatISO, startOfDay } from "date-fns";
import suncalc from "suncalc";

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
  let cur = startOfDay(start);

  while (cur <= end) {
    const result = suncalc.getTimes(cur, lat, long);
    results.push({
      date: cur.toISOString(),
      sunrise: result.sunrise.toISOString(),
      nauticalDawn: result.nauticalDawn.toISOString(),
      sunset: result.sunset.toISOString(),
      dawn: result.dawn.toISOString(),
      dusk: result.dusk.toISOString(),
      nauticalDusk: result.nauticalDusk.toISOString(),
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
  const data = suncalc.getMoonIllumination(date);

  return {
    date: date.toISOString(),
    phase: calcPhaseName(data.phase),
    illumination: Math.round(data.fraction * 100),
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
  const promises = dates.map((date) => getMoonInfoForDate(date, lat, long));
  return Promise.all(promises);
};

export const getSolunarInfo = (
  start: Date,
  end: Date,
  lat: number,
  lon: number
) => {
  let dates = [];
  let cur = start;
  while (cur <= end) {
    dates.push(cur);
    cur = addDays(cur, 1);
  }
  return dates.map((date) => {
    const data = getSolunarData(date, { lat, lon });
    return {
      date: formatISO(data.day.start),
      score: data.dayScore,
      saltyScore: data.dayScore,
      majorPeriods: data.majorPeriods.map((x) => ({
        ...x,
        start: formatISO(x.start),
        end: formatISO(x.end),
      })),
      minorPeriods: data.minorPeriods.map((x) => ({
        ...x,
        start: formatISO(x.start),
        end: formatISO(x.end),
      })),
    };
  });
};

function calcPhaseName(phase: number): string {
  if (phase >= 0 && phase < 0.125) {
    return "New Moon";
  } else if (phase >= 0.125 && phase < 0.25) {
    return "Waxing Crescent";
  } else if (phase >= 0.25 && phase < 0.325) {
    return "First Quarter";
  } else if (phase >= 0.325 && phase < 0.5) {
    return "Waxing Gibbous";
  } else if (phase >= 0.5 && phase < 0.625) {
    return "Full Moon";
  } else if (phase >= 0.625 && phase < 0.75) {
    return "Waning Gibbous";
  } else if (phase >= 0.75 && phase < 0.825) {
    return "Last Quarter";
  } else if (phase >= 0.825 && phase <= 1) {
    return "Waning Crescent";
  }

  throw new Error("Out of bounds fraction");
}
