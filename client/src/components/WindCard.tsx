import { hooks } from "@stevenmusumeche/salty-solutions-shared";
import {
  TideStationDetailFragment,
  UsgsSiteDetailFragment,
} from "@stevenmusumeche/salty-solutions-shared/dist/graphql";
import { subHours, differenceInHours, format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { CombinedError } from "urql";
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
} from "victory";
import ErrorIcon from "../assets/error.svg";
import { noDecimals } from "../hooks/utils";
import ConditionCard from "./ConditionCard";
import MiniGraphWrapper from "./MiniGraphWrapper";
import UsgsSiteSelect from "./UsgsSiteSelect";
import NoData from "./NoData";
import Modal from "./Modal";

interface Props {
  locationId: string;
  sites: Array<UsgsSiteDetailFragment | TideStationDetailFragment>;
}
const WindCard: React.FC<Props> = ({ locationId, sites }) => {
  const [selectedSite, setSelectedSite] = useState(() =>
    sites.length ? sites[0] : undefined
  );
  const [showModal, setShowModal] = useState(false);

  const date = useMemo(() => new Date(), []);

  const {
    curValue,
    curDetail,
    curDirectionValue,
    fetching,
    error,
  } = hooks.useCurrentWindData({
    locationId,
    startDate: subHours(date, 48),
    endDate: date,
    usgsSiteId:
      selectedSite && selectedSite.__typename === "UsgsSite"
        ? selectedSite.id
        : undefined,
    noaaStationId:
      selectedSite && selectedSite.__typename === "TidePreditionStation"
        ? selectedSite.id
        : undefined,
  });

  useEffect(() => {
    setSelectedSite(sites.length ? sites[0] : undefined);
  }, [locationId, sites]);

  return (
    <>
      <ConditionCard
        fetching={fetching}
        error={error}
        label="Wind (mph)"
        className="wind-summary"
      >
        <div className="flex flex-col justify-between h-full w-full">
          {curValue ? (
            <>
              <div>
                {curValue}
                <div className="absolute right-0 top-0 p-2 text-lg md:text-2xl">
                  {curDirectionValue}
                </div>
              </div>
              <div
                onClick={() => setShowModal(true)}
                className="cursor-pointer"
              >
                {buildGraphDisplayVal(fetching, error, curDetail)}
              </div>
            </>
          ) : (
            <NoData />
          )}
          {selectedSite ? (
            <UsgsSiteSelect
              sites={sites}
              handleChange={(e) => {
                const match = sites.find((site) => site.id === e.target.value);
                setSelectedSite(match);
              }}
              selectedId={selectedSite.id}
              fullWidth={true}
            />
          ) : (
            <div style={{ height: 40 }} />
          )}
        </div>
      </ConditionCard>
      {showModal && (
        <Modal title={`Wind (mph)`} close={() => setShowModal(false)}>
          <>
            <h3 className="text-base md:text-xl text-center">
              {selectedSite?.name}
            </h3>
            <div className="text-sm">
              {buildGraphDisplayVal(fetching, error, curDetail, true)}
            </div>
          </>
        </Modal>
      )}
    </>
  );
};

export default WindCard;

const ArrowPoint: React.FC<any> = ({
  x,
  y,
  datum,
  index,
  data,
  fullScreen,
  ...props
}) => {
  if (index % Math.floor(data.length / (fullScreen ? 20 : 10)) !== 0)
    return null;

  const offsetX = fullScreen ? x - 6 : x - 12;
  const offsetY = fullScreen ? y - 5 : y - 19;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      x={offsetX}
      y={offsetY}
      {...props}
    >
      <path
        fill="black"
        d="M412.6 227.1L278.6 89c-5.8-6-13.7-9-22.4-9h-.4c-8.7 0-16.6 3-22.4 9l-134 138.1c-12.5 12-12.5 31.3 0 43.2 12.5 11.9 32.7 11.9 45.2 0l79.4-83v214c0 16.9 14.3 30.6 32 30.6 18 0 32-13.7 32-30.6v-214l79.4 83c12.5 11.9 32.7 11.9 45.2 0s12.5-31.2 0-43.2z"
        style={{
          transformOrigin: "center",
          transform: `rotate(${Math.abs(datum.directionDegrees + 180)}deg)`,
        }}
      />
    </svg>
  );
};

function buildGraphDisplayVal(
  fetching: boolean,
  error?: CombinedError,
  curDetail?:
    | {
        y: number;
        x: string;
        directionDegrees: number;
        direction: string;
      }[]
    | null,
  fullScreen?: boolean
) {
  if (curDetail) {
    // reduce the number of data points to display on the graph
    const mod = Math.ceil(curDetail.length / 72);
    if (mod > 1) {
      curDetail = curDetail.filter((_, i) => i % mod === 0);
    }
  }

  let graphDisplayVal = null;
  if (fetching) {
    graphDisplayVal = null;
  } else if (error && !curDetail) {
    graphDisplayVal = (
      <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
    );
  } else if (curDetail && curDetail.length > 0) {
    graphDisplayVal = (
      <MiniGraphWrapper>
        <VictoryChart
          padding={{ left: 55, top: 20, right: 30, bottom: 50 }}
          domainPadding={{ y: [30, 30] }}
          style={{ parent: { touchAction: "auto" } }}
        >
          <VictoryAxis
            fixLabelOverlap={false}
            tickCount={fullScreen ? 8 : 2}
            tickFormat={(date: string) => {
              const dateObj = new Date(date);
              if (fullScreen) {
                return format(dateObj, "ccc") + "\n" + format(dateObj, "ha");
              }

              const hourDiff = Math.abs(differenceInHours(dateObj, new Date()));
              if (hourDiff >= 46) {
                return "-2d";
              } else if (hourDiff >= 18) {
                return "-1d";
              }
              return "now";
            }}
            style={{
              tickLabels: { fontSize: fullScreen ? 8 : 24 },
              grid: {
                stroke: "#a0aec0",
                strokeDasharray: "6, 6",
                strokeWidth: fullScreen ? 0.5 : 1,
              },
            }}
          />
          <VictoryAxis
            scale={{ x: "time" }}
            dependentAxis
            style={{ tickLabels: { fontSize: fullScreen ? 8 : 24 } }}
            tickFormat={noDecimals}
          />
          <VictoryGroup data={curDetail}>
            <VictoryLine
              interpolation="natural"
              style={{
                data: { stroke: "#C68E37", strokeWidth: fullScreen ? 1 : 2 },
                parent: { border: "1px solid #ccc" },
              }}
            />
            <VictoryScatter
              dataComponent={
                <ArrowPoint
                  fullScreen={fullScreen}
                  style={{ fontSize: fullScreen ? "0.75rem" : "2rem" }}
                />
              }
            />
          </VictoryGroup>
        </VictoryChart>
      </MiniGraphWrapper>
    );
  }
  return graphDisplayVal;
}
