import React, { ReactNode } from "react";
import { useCombinedForecastQuery } from "../generated/graphql";
import ErrorIcon from "../assets/error.svg";
import ForecastSkeleton from "./ForecastSkeleton";
import Compass from "../assets/compass.svg";
import Smooth from "../assets/water-conditions/smooth.svg";
import LightChop from "../assets/water-conditions/light-chop.svg";
import Unknown from "../assets/water-conditions/unknown.svg";
import Choppy from "../assets/water-conditions/choppy.svg";
import Rough from "../assets/water-conditions/rough.svg";

interface Props {
  locationId: string;
}

const CombinedForecast: React.FC<Props> = ({ locationId }) => {
  const [forecast] = useCombinedForecastQuery({ variables: { locationId } });

  if (forecast.fetching) {
    return (
      <Wrapper>
        <ForecastSkeleton />
      </Wrapper>
    );
  } else if (forecast.error) {
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

  const data =
    forecast.data &&
    forecast.data.location &&
    forecast.data.location.combinedForecast;

  return (
    <Wrapper>
      {data &&
        data.map(data => {
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
            <div key={data.timePeriod}>
              <div className="forecast-header text-xl mb-2">
                {data.timePeriod}
              </div>
              <div className="forecast-row mb-10">
                <div>
                  <img
                    src={Compass}
                    alt="compass"
                    className="block m-auto h-20 w-20"
                    style={{
                      transform: `rotate(${degrees}deg)`,
                      maxWidth: "5rem"
                    }}
                  />
                  <div className="mt-2 text-xl text-center text-gray-800 leading-none ">
                    {windDisplay}
                  </div>
                </div>
                <div className="">
                  <>
                    <WaterConditionIcon
                      text={
                        data.waterCondition
                          ? data.waterCondition.text
                          : undefined
                      }
                    />
                    <div className="mt-2 text-xl text-center leading-none text-gray-800">
                      {data.waterCondition && data.waterCondition.text}
                    </div>
                  </>
                </div>
                <div
                  className="text-gray-800 text-left text-4xl leading-none h-24 items-center"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "4.5rem auto",
                    gridTemplateRows: "1fr 1fr"
                  }}
                >
                  <div>{data.temperature.degrees}°</div>
                  <div className="font-thin text-gray-600 text-base pl-2 -mb-3">
                    F
                  </div>
                  {data.chanceOfPrecipitation && (
                    <>
                      <div className="leading-none">
                        {data.chanceOfPrecipitation}%
                      </div>
                      <div className="font-thin text-gray-600 text-base pl-2 -mb-3">
                        rain
                      </div>
                    </>
                  )}
                </div>

                <div>
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
}> = ({ children }) => (
  <div className="forecast-wrapper scroller-vertical mb-8">{children}</div>
);

const WaterConditionIcon: React.FC<{ text?: string }> = ({ text = "" }) => {
  let image = Unknown;
  switch (text) {
    case "smooth":
      image = Smooth;
      break;
    case "light chop":
    case "moderate chop":
      image = LightChop;
      break;
    case "choppy":
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
      if (text.startsWith("rough")) {
        image = Rough;
      }
      if (text.startsWith("very rough")) {
        image = Rough;
      }
      break;
  }

  return (
    <div className="w-full h-20 flex items-center">
      <img src={image} alt={text} className="w-full h-auto" />
    </div>
  );
};
