import React from "react";
import { VictoryArea } from "victory";

export const Y_PADDING = 0.3;

export const renderBackgroundColor = (
  data: any[],
  color: string,
  minValue: number,
  maxValue?: number,
  key?: any
) => {
  return (
    <VictoryArea
      key={key}
      data={data.map((datum) => {
        if (maxValue) return { x: datum.x, y: maxValue };
        return datum;
      })}
      scale={{ x: "time", y: "linear" }}
      style={{
        data: {
          strokeWidth: 0,
          fill: color,
        },
      }}
      y0={() => (minValue < 0 ? minValue - Y_PADDING : 0)}
    />
  );
};
