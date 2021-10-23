import React, { useMemo, useState } from "react";
import ConditionCard from "./ConditionCard";
import { hooks } from "@stevenmusumeche/salty-solutions-shared";
import { subHours } from "date-fns";
import MiniGraph from "./MiniGraph";
import { noDecimals } from "../hooks/utils";
import NoData from "./NoData";
import Modal from "./Modal";

interface Props {
  locationId: string;
  allowZoom?: boolean;
}

const AirTempCard: React.FC<Props> = ({ locationId, allowZoom = true }) => {
  const date = useMemo(() => new Date(), []);
  const [showModal, setShowModal] = useState(false);

  const { curValue, curDetail, fetching, error } = hooks.useTemperatureData({
    locationId,
    startDate: subHours(date, 48),
    endDate: date,
  });

  return (
    <>
      <ConditionCard
        label="Air Temperature (F)"
        fetching={fetching}
        error={error}
        className="air-temp-summary"
      >
        <div className="flex flex-col justify-between h-full w-full">
          {curValue ? (
            <>
              <div>{curValue}</div>

              <div
                onClick={() => allowZoom && setShowModal(true)}
                className={`${allowZoom ? "cursor-pointer" : ""}`}
              >
                <MiniGraph
                  fetching={fetching}
                  error={error}
                  data={curDetail}
                  dependentAxisTickFormat={noDecimals}
                  className="air-temp-graph"
                />
              </div>
            </>
          ) : (
            <NoData />
          )}
          <div style={{ height: 40 }} />
        </div>
      </ConditionCard>
      {showModal && (
        <Modal title="Air Temperature (F)" close={() => setShowModal(false)}>
          <MiniGraph
            fetching={fetching}
            error={error}
            data={curDetail}
            dependentAxisTickFormat={noDecimals}
            fullScreen={true}
            tickCount={8}
          />
        </Modal>
      )}
    </>
  );
};

export default AirTempCard;
