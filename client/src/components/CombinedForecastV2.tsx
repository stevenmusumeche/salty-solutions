import { useCombinedForecastV2Query } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { addDays, format, startOfDay } from "date-fns";
import { endOfDay } from "date-fns/esm";
import React, { FC, ReactNode } from "react";
import ErrorIcon from "../assets/error.svg";
import useBreakpoints from "../hooks/useBreakpoints";
import EmptyBox from "./EmptyBox";
import ForecastChart from "./ForecastChart";
import ForecastTide from "./ForecastTide";
import ForecastTimeBuckets from "./ForecastTimeBuckets";
import { ISO_FORMAT } from "./tide/Tides";
import ForecastSun from "./ForecastSun";

const NUM_DAYS = 9;

interface Props {
  locationId: string;
}

const CombinedForecastV2: FC<Props> = ({ locationId }) => {
  const [forecast] = useCombinedForecastV2Query({
    variables: {
      locationId,
      startDate: format(startOfDay(new Date()), ISO_FORMAT),
      endDate: format(addDays(endOfDay(new Date()), NUM_DAYS), ISO_FORMAT),
    },
  });
  let data =
    forecast.data?.location?.combinedForecastV2?.slice(0, NUM_DAYS) || [];

  let sunData = forecast.data?.location?.sun || [];
  let tideData = forecast.data?.location?.tidePreditionStations[0]?.tides || [];
  let tideStationName =
    forecast.data?.location?.tidePreditionStations[0].name || "";

  if (forecast.fetching) {
    return (
      <Wrapper>
        <ForecastLoading />
      </Wrapper>
    );
  } else if (forecast.error && !data) {
    return (
      <Wrapper>
        <ForecastError />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {data.map((datum) => {
        const date = new Date(datum.date);

        return (
          <CardWrapper key={datum.name}>
            <Header>{datum.name}</Header>
            <div className="py-4">
              <ForecastChart data={datum} date={date} />
              <ForecastTimeBuckets data={datum} date={date} />
              <ForecastTide
                tideData={tideData}
                stationName={tideStationName}
                date={date}
                sunData={sunData}
              />
              <ForecastSun sunData={sunData} date={date} />
              {/* todo: https://github.com/pablosichert/react-truncate */}
              <div className="mt-4 px-4" style={{ gridArea: "text" }}>
                {datum.day.detailed && (
                  <div className="mb-4 leading-snug text-gray-700 text-sm">
                    <div className="tracking-wide uppercase text-gray-600 text-sm leading-none uppercase mb-1 font-semibold">
                      Day
                    </div>
                    {datum.day.detailed}
                  </div>
                )}
                {datum.night.detailed && (
                  <div className="leading-snug text-gray-700 text-sm">
                    <div className="tracking-wide uppercase text-gray-600 text-sm leading-none uppercase mb-1 font-semibold">
                      Night
                    </div>
                    {datum.night.detailed}
                  </div>
                )}
              </div>
            </div>
          </CardWrapper>
        );
      })}
    </Wrapper>
  );
};

export default CombinedForecastV2;

const Wrapper: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <div className={`mb-0 md:mb-8 md:flex md:flex-wrap md:justify-between`}>
      {children}
    </div>
  );
};

const CardWrapper: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { isSmall } = useBreakpoints();

  return (
    <div
      className={`mb-4 md:mb-8 forecast-wrapper p-0 bg-white`}
      style={{ flexBasis: isSmall ? "auto" : "calc(33.3% - 1.3rem)" }}
    >
      {children}
    </div>
  );
};

export const ForecastLoading: React.FC = () => {
  return (
    <>
      {[...Array(9)].map((x, i) => (
        <CardWrapper key={i}>
          <Header>
            <EmptyBox w={"55%"} h={24} className="bg-gray-400 mx-auto my-1" />
          </Header>
          <div className="m-4">
            <EmptyBox w="100%" h={600} className="" />
          </div>
        </CardWrapper>
      ))}
    </>
  );
};

export const ForecastError: React.FC = () => {
  const { isSmall } = useBreakpoints();

  return (
    <>
      {[...Array(isSmall ? 1 : 3)].map((x, i) => (
        <CardWrapper key={i}>
          <div className="h-48 flex items-center justify-center">
            <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
          </div>
        </CardWrapper>
      ))}
    </>
  );
};

const Header: React.FC = ({ children }) => (
  <div className="bg-gray-200 p-2 overflow-hidden rounded-lg rounded-b-none flex-grow-0 flex-shrink-0 text-base md:text-lg text-center">
    {children}
  </div>
);
