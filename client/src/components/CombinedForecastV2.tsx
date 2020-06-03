import { useCombinedForecastV2Query } from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import React, { FC, ReactNode } from "react";
import useBreakpoints from "../hooks/useBreakpoints";
import ForecastChart from "./ForecastChart";
import ForecastTimeBuckets from "./ForecastTimeBuckets";
import EmptyBox from "./EmptyBox";
import ErrorIcon from "../assets/error.svg";

interface Props {
  locationId: string;
}

const CombinedForecastV2: FC<Props> = ({ locationId }) => {
  const [forecast] = useCombinedForecastV2Query({ variables: { locationId } });
  const { isSmall } = useBreakpoints();

  let data = forecast.data?.location?.combinedForecastV2;

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
      {data &&
        data.slice(0, 9).map((data) => {
          return (
            <CardWrapper key={data.name}>
              <div className="forecast-header text-xl mb-2 flex items-center justify-between">
                <div>{data.name}</div>
                <div
                  className="md:flex tracking-tight md:tracking-wide uppercase font-normal text-gray-600 leading-none uppercase"
                  style={{ fontSize: ".65rem" }}
                >
                  <div
                    className="flex items-center h-3"
                    style={{ marginBottom: isSmall ? 2 : 0 }}
                  >
                    <div className="w-3 h-3 mr-1 rounded-sm bg-blue-700 flex-shrink-0"></div>
                    <div className="">Wind</div>
                  </div>
                  <div className="flex items-center h-3">
                    <div
                      className="w-3 h-3 mr-1 md:ml-2 rounded-sm bg-blue-700 flex-shrink-0"
                      style={{ opacity: 0.15 }}
                    ></div>
                    <div className="">Gusts</div>
                  </div>
                </div>
              </div>

              <div className="">
                <ForecastChart data={data} date={new Date(data.date)} />
                <ForecastTimeBuckets data={data} date={new Date(data.date)} />
              </div>

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
      className={`mb-4 md:mb-8 forecast-wrapper`}
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
          <EmptyBox w={180} h="2rem" className="mb-2" />
          <EmptyBox w="100%" h={600} className="" />
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
