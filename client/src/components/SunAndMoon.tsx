import React from "react";
import { useSunAndMoonQuery, SunAndMoonQuery } from "../generated/graphql";
import { format, startOfDay, addDays } from "date-fns";
import { UseQueryState } from "urql";
import ConditionCard from "./ConditionCard";
import MoonPhase from "./MoonPhase";

interface Props {
  locationId: string;
  date: Date;
}
const ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";

// todo: add error retry ability

const SunAndMoon: React.FC<Props> = ({ locationId, date }) => {
  const [result, refresh] = useSunAndMoonQuery({
    variables: {
      locationId,
      startDate: format(startOfDay(date), ISO_FORMAT),
      endDate: format(addDays(startOfDay(date), 1), ISO_FORMAT)
    }
  });

  const { sun, moon } = extractData(result);

  return (
    <div className="sun-and-moon-grid">
      <ConditionCard
        fetching={result.fetching}
        error={result.error && !sun}
        label="Nautical Dawn"
        fontSize="5rem"
        refresh={refresh}
      >
        {sun && format(new Date(sun.nauticalDawn), "h:mm")}
      </ConditionCard>
      <ConditionCard
        fetching={result.fetching}
        error={result.error && !sun}
        label="Sunrise"
        fontSize="5rem"
        refresh={refresh}
      >
        {sun && format(new Date(sun.sunrise), "h:mm")}
      </ConditionCard>
      <ConditionCard
        fetching={result.fetching}
        error={result.error && !sun}
        label="Sunset"
        fontSize="5rem"
        refresh={refresh}
      >
        {sun && format(new Date(sun.sunset), "h:mm")}
      </ConditionCard>
      <ConditionCard
        fetching={result.fetching}
        error={result.error && !sun}
        label="Nautical Dusk"
        fontSize="5rem"
        refresh={refresh}
      >
        {sun && format(new Date(sun.nauticalDusk), "h:mm")}
      </ConditionCard>
      <ConditionCard
        fetching={result.fetching}
        error={result.error && !moon}
        label={moon ? `${moon.phase} (${moon.illumination}%)` : "Moon Phase"}
        fontSize="5rem"
        refresh={refresh}
      >
        {moon && <MoonPhase phase={moon.phase} />}
      </ConditionCard>
    </div>
  );
};

export default SunAndMoon;

const extractData = (result: UseQueryState<SunAndMoonQuery>) => {
  const sun =
    result.data &&
    result.data &&
    result.data.location &&
    result.data.location.sun &&
    result.data.location.sun[result.data.location.sun.length - 1];

  const moon =
    result.data &&
    result.data.location &&
    result.data.location.moon &&
    result.data.location.moon[result.data.location.moon.length - 1];

  return { sun, moon };
};
