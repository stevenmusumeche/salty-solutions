import React, { FC, ReactNode, useContext } from "react";
import { WindowSizeContext } from "../providers/WindowSizeProvider";
import { ForecastSkeleton } from "./ForecastSkeleton";
import { useCombinedForecastV2Query } from "../generated/graphql";
import ForecastChart from "./ForecastChart";

interface Props {
  locationId: string;
}

const CombinedForecastV2: React.FC<Props> = ({ locationId }) => {
  const [forecast] = useCombinedForecastV2Query({ variables: { locationId } });
  const { isSmall } = useContext(WindowSizeContext);

  let data = forecast.data?.location?.combinedForecastV2;

  if (forecast.fetching) {
    return (
      <Wrapper>
        {/* todo */}
        <div>loading</div>
      </Wrapper>
    );
  } else if (forecast.error && !data) {
    return (
      <Wrapper>
        {/* todo */}
        <div>error</div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {data &&
        data.slice(0, 1000).map((data) => {
          return (
            <div
              key={data.date}
              className={`${isSmall && "forecast-wrapper mb-4"}`}
            >
              <div className="forecast-header text-xl mb-2 flex items-center justify-between">
                <div>{data.name}</div>
                <div>
                  <div className="flex" style={{ marginBottom: 2 }}>
                    <div className="w-3 h-3 mr-1 rounded-sm bg-blue-700 flex-shrink-0"></div>
                    <div className="uppercase tracking-tight font-normal text-gray-600 text-xs leading-none">
                      Wind
                    </div>
                  </div>
                  <div className="flex">
                    <div
                      className="w-3 h-3 mr-1 rounded-sm bg-blue-700 flex-shrink-0"
                      style={{ opacity: 0.15 }}
                    ></div>
                    <div className="uppercase tracking-tight font-normal text-gray-600 text-xs leading-none">
                      Gusts
                    </div>
                  </div>
                </div>
              </div>

              <ForecastChart data={data} date={new Date(data.date)} />

              <div style={{ gridArea: "text" }}>
                {data.day.detailed && (
                  <div className="mb-4 leading-snug text-gray-700 text-sm">
                    <div className="text-black text-base">Day</div>
                    {data.day.detailed}
                  </div>
                )}
                {data.night.detailed && (
                  <div className="leading-snug text-gray-700 text-sm">
                    <div className="text-black text-base">Night</div>
                    {data.night.detailed}
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </Wrapper>
  );
};

export default CombinedForecastV2;

const Wrapper: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { isSmall } = useContext(WindowSizeContext);
  return (
    <div
      className={`${!isSmall &&
        "forecast-wrapper"} scroller-vertical mb-0 md:mb-8`}
    >
      {children}
    </div>
  );
};
