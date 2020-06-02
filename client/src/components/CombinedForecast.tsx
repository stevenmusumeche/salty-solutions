import React, { ReactNode, useContext } from "react";
// todo: fix all imports from client to use npm package if typings work
import { useCombinedForecastQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import { ForecastSkeleton } from "./ForecastSkeleton";
import Compass from "../assets/compass.svg";
import Smooth from "../assets/water-conditions/smooth.svg";
import LightChop from "../assets/water-conditions/light-chop.svg";
import Unknown from "../assets/water-conditions/unknown.svg";
import Choppy from "../assets/water-conditions/choppy.svg";
import Rough from "../assets/water-conditions/rough.svg";
import { WindowSizeContext } from "../providers/WindowSizeProvider";

interface Props {
  locationId: string;
}

const CombinedForecast: React.FC<Props> = ({ locationId }) => {
  const [forecast] = useCombinedForecastQuery({ variables: { locationId } });
  const { isSmall } = useContext(WindowSizeContext);

  const data =
    forecast.data &&
    forecast.data.location &&
    forecast.data.location.combinedForecast;

  if (forecast.fetching) {
    return (
      <Wrapper>
        <ForecastSkeleton />
      </Wrapper>
    );
  } else if (forecast.error && !data) {
    return (
      <Wrapper>
        <img
          src={ErrorIcon}
          style={{ height: 120 }}
          className="my-8 mx-auto"
          alt="error"
        />
      </Wrapper>
    );
  }

  const cardClasses = "p-2 md:p-0";

  return (
    <Wrapper>
      {data &&
        data.map((data) => {
          let windDisplay;
          let degrees;
          if (data.wind && data.wind.speed && data.wind.direction) {
            const from = data.wind.speed.from;
            const to = data.wind.speed.to;
            degrees = data.wind.direction
              ? data.wind.direction.degrees + 180
              : null;
            if (from === to) {
              windDisplay = `${to} ${data.wind.direction.text}`;
            } else {
              windDisplay = `${from}-${to} ${data.wind.direction.text}`;
            }
          }

          return (
            <div
              key={data.timePeriod}
              className={`${isSmall && "forecast-wrapper mb-4"}`}
            >
              <div className="forecast-header text-xl mb-2">
                {data.timePeriod}
              </div>
              <div className="forecast-row mb-0 md:mb-10">
                <div style={{ gridArea: "wind" }} className={cardClasses}>
                  <img
                    src={Compass}
                    alt="compass"
                    className="block m-auto h-12 w-12 md:h-20 md:w-20"
                    style={{
                      transform: `rotate(${degrees}deg)`,
                      maxWidth: "5rem",
                    }}
                  />
                  <div className="mt-2 text-xs md:text-base md:text-xl text-center text-gray-800 leading-none">
                    {windDisplay}
                  </div>
                </div>
                <div className={cardClasses} style={{ gridArea: "water" }}>
                  <>
                    <WaterConditionIcon
                      text={
                        data.waterCondition
                          ? data.waterCondition.text
                          : undefined
                      }
                    />
                    <div className="mt-2 text-xs md:text-xl text-center leading-none text-gray-800">
                      {data.waterCondition
                        ? data.waterCondition.text
                        : "unknown"}
                    </div>
                  </>
                </div>
                <div
                  className={`text-gray-800 text-left text-2xl md:text-4xl leading-none h-auto md:h-24 items-center ${cardClasses}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isSmall ? "3rem auto" : "4.5rem auto",
                    gridTemplateRows: "1fr 1fr",
                    gridArea: "temp",
                  }}
                >
                  <div>{data.temperature.degrees}°</div>
                  <div className="font-thin text-gray-600 text-xs md:text-base pl-2 -mb-3">
                    F
                  </div>
                  {data.chanceOfPrecipitation !== null && (
                    <>
                      <div className="leading-none">
                        {data.chanceOfPrecipitation}%
                      </div>
                      <div className="font-thin text-gray-600 text-xs md:text-base pl-2 -mb-3">
                        rain
                      </div>
                    </>
                  )}
                </div>

                <div style={{ gridArea: "text" }}>
                  {data.marine ? (
                    <>
                      <div className="mb-4 leading-snug">{data.marine}</div>
                      <div className="text-sm text-gray-700 leading-snug">
                        {data.detailed}
                      </div>
                    </>
                  ) : (
                    <div className="leading-snug">{data.detailed}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </Wrapper>
  );
};

export default CombinedForecast;

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

export const WaterConditionIcon: React.FC<{ text?: string }> = ({
  text = "",
}) => {
  let image = Unknown;
  const [, second] = text.split("-");

  switch (text) {
    case "smooth":
    case "0-1":
      image = Smooth;
      break;
    case "light chop":
    case "moderate chop":
    case "0-2":
    case "1-2":
      image = LightChop;
      break;
    case "choppy":
    case "2-3":
    case "2-4":
      image = Choppy;
      break;
    case "rough":
    case "very rough":
      image = Rough;
      break;
    default:
      if (text.startsWith("smooth")) {
        image = Smooth;
      }
      if (text.startsWith("light chop")) {
        image = LightChop;
      }
      if (text.startsWith("moderate chop")) {
        image = LightChop;
      }
      if (
        text.startsWith("rough") ||
        (Number(second) >= 3 && Number(second) < 6)
      ) {
        image = Rough;
      }
      if (text.startsWith("very rough") || Number(second) >= 6) {
        image = Rough;
      }
      break;
  }

  return (
    <div className="w-full h-12 md:h-20 flex items-center">
      <img src={image} alt={text} className="w-full h-auto" />
    </div>
  );
};
