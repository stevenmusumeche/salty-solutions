import { useCombinedForecastV2Query } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import React, { FC, ReactNode } from "react";
import useBreakpoints from "../hooks/useBreakpoints";
import ForecastChart from "./ForecastChart";
import ForecastTimeBuckets from "./ForecastTimeBuckets";
import EmptyBox from "./EmptyBox";
import ErrorIcon from "../assets/error.svg";
import { format, startOfDay, addDays } from "date-fns";
import { ISO_FORMAT } from "./tide/Tides";
import { endOfDay } from "date-fns/esm";

const NUM_DAYS = 9;

interface Props {
  locationId: string;
}

const CombinedForecastV2: FC<Props> = ({ locationId }) => {
  const [forecast] = useCombinedForecastV2Query({
    variables: {
      locationId,
      startDate: format(startOfDay(new Date()), ISO_FORMAT),
      endDate: format(addDays(endOfDay(new Date()), 10), ISO_FORMAT),
    },
  });
  let data =
    forecast.data?.location?.combinedForecastV2?.slice(0, NUM_DAYS) || [];

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
      {data.map((data) => {
        return (
          <CardWrapper key={data.name}>
            <Header>{data.name}</Header>
            <div className="p-4">
              <ForecastChart data={data} date={new Date(data.date)} />
              <ForecastTimeBuckets data={data} date={new Date(data.date)} />

              <div className="" style={{ gridArea: "text" }}>
                {data.day.detailed && (
                  <div className="mb-4 leading-snug text-gray-700 text-sm">
                    <div className="tracking-wide uppercase text-gray-600 text-sm leading-none uppercase mb-1 font-semibold">
                      Day
                    </div>
                    {data.day.detailed}
                  </div>
                )}
                {data.night.detailed && (
                  <div className="leading-snug text-gray-700 text-sm">
                    <div className="tracking-wide uppercase text-gray-600 text-sm leading-none uppercase mb-1 font-semibold">
                      Night
                    </div>
                    {data.night.detailed}
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
