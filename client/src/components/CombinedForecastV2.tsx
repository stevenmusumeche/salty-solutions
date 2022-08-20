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
import ForecastText from "./ForecastText";
import { useAuth0 } from "@auth0/auth0-react";
import LoginTeaser from "./LoginTeaser";

const NUM_DAYS_LOGGED_IN = 9;
const NUM_DAYS_LOGGED_OUT = 2;

interface Props {
  locationId: string;
}

const CombinedForecastV2: FC<Props> = ({ locationId }) => {
  const { isAuthenticated } = useAuth0();
  const [forecast] = useCombinedForecastV2Query({
    variables: {
      locationId,
      startDate: format(startOfDay(new Date()), ISO_FORMAT),
      endDate: format(
        addDays(
          endOfDay(new Date()),
          isAuthenticated ? NUM_DAYS_LOGGED_IN : NUM_DAYS_LOGGED_OUT
        ),
        ISO_FORMAT
      ),
    },
  });
  let data =
    forecast.data?.location?.combinedForecastV2?.slice(0, NUM_DAYS_LOGGED_IN) ||
    [];

  let sunData = forecast.data?.location?.sun || [];
  let tideData = forecast.data?.location?.tidePreditionStations[0]?.tides || [];
  let solunarData = forecast.data?.location?.solunar || [];
  let tideStationName =
    forecast.data?.location?.tidePreditionStations?.[0]?.name || "";

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
      {data.map((datum, i) => {
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
                solunarData={solunarData}
              />
              <ForecastSun
                sunData={sunData}
                solunarData={solunarData}
                date={date}
              />
              <ForecastText day={datum.day} night={datum.night} />
            </div>
          </CardWrapper>
        );
      })}
      {!isAuthenticated && (
        <CardWrapper stretch={false}>
          <Header>Want our extended forecast?</Header>
          <div className="p-8 md:py-16">
            <LoginTeaser message="Login for free to access the full 9-day forecast." />
          </div>
        </CardWrapper>
      )}
    </Wrapper>
  );
};

export default CombinedForecastV2;

const Wrapper: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8`}
    >
      {children}
    </div>
  );
};

const CardWrapper: React.FC<{ stretch?: boolean }> = ({
  children,
  stretch = true,
}) => {
  const { isSmall } = useBreakpoints();

  return (
    <div
      className={`forecast-wrapper p-0 bg-white ${
        stretch ? "self-stretch" : "self-start"
      }`}
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
          <div className="p-4">
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
