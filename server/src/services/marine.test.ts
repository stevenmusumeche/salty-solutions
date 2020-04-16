import { parseForecast } from "./marine";
import cases from "jest-in-case";

// around X feet/foot
// less than x foot/feet
// X feet/foot or less
// x to y feet

describe("marine forecast water condition parsing", () => {
  cases(
    "all",
    (opts) => {
      expect(parseForecast(opts.forecast).waterCondition).toBe(opts.expected);
    },
    [
      {
        forecast: "Bay waters choppy.",
        expected: "choppy",
      },
      {
        forecast: "Lake waters a light chop.",
        expected: "light chop",
      },
      {
        forecast: "Lake waters smooth.",
        expected: "smooth",
      },
      {
        forecast: "Seas around 1 foot. Nearshore waters a light chop.",
        expected: "light chop",
      },
      {
        forecast: "Seas 1 foot or less.",
        expected: "0-1",
      },
      {
        forecast: "Seas 1 to 2 feet.",
        expected: "1-2",
      },
      {
        forecast: "Seas 1 to 3 feet.",
        expected: "1-3",
      },
      {
        forecast: "Seas 2 to 4 feet.",
        expected: "2-4",
      },
      {
        forecast: "Waves 1 foot or less.",
        expected: "0-1",
      },
      {
        forecast: "Waves 1 to 2 feet.",
        expected: "1-2",
      },
      {
        forecast: "Waves 1 to 3 feet.",
        expected: "1-3",
      },
      {
        forecast: "Waves 2 to 4 feet.",
        expected: "2-4",
      },
      {
        forecast: "Seas 1 foot or less.",
        expected: "0-1",
      },
      {
        forecast: "Seas 2 feet or less.",
        expected: "0-2",
      },
      {
        forecast: "Seas less than 1 foot.",
        expected: "0-1",
      },
      {
        forecast: "Seas less than 2 feet.",
        expected: "0-2",
      },
      {
        forecast: "Seas around 3 feet.",
        expected: "3-3",
      },
      {
        forecast: "Seas around 1 foot.",
        expected: "1-1",
      },
      {
        forecast:
          "Southeast winds building to 15 to 20 knots rising to 20 knots. Seas building to 4 to 7 feet with occasional seas to 9 feet. Dominant period 9 seconds.",
        expected: "4-7",
      },
      {
        forecast:
          "Lake waters choppy decreasing to a light chop after midnight.",
        expected: "choppy",
      },
    ]
  );
});

describe.only("marine forecast wind speed parsing", () => {
  cases(
    "all",
    (opts) => {
      expect(parseForecast(opts.forecast).windSpeed).toEqual(opts.expected);
    },
    [
      {
        forecast: "Southeast winds 15 to 20 knots",
        expected: { from: 15, to: 20 },
      },
      {
        forecast: "South winds around 5 knots",
        expected: { from: 5, to: 5 },
      },
      {
        forecast: "South winds up to 5 knots",
        expected: { from: 0, to: 5 },
      },
      {
        forecast: "South winds near 5 knots",
        expected: { from: 5, to: 5 },
      },
      {
        forecast: "South winds rising to 10 knots",
        expected: { from: 0, to: 10 },
      },
      {
        forecast: "South winds building to 10 knots",
        expected: { from: 0, to: 10 },
      },
      {
        forecast: "South winds 5 to 10 knots becoming 20 knots",
        expected: { from: 5, to: 10 },
      },
      {
        forecast: "East winds 20 knots",
        expected: { from: 20, to: 20 },
      },
      {
        forecast: "East winds 20 knots easing to 15 to 20 knots",
        expected: { from: 20, to: 20 },
      },
    ]
  );
});
