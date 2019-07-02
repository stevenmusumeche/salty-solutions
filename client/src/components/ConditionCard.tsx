import React from "react";
import { CombinedError } from "urql";

interface Props {
  label: string;
  value?: string;
  fetching: boolean;
  error?: CombinedError;
}

const ConditionCard: React.FC<Props> = ({ label, value, fetching, error }) => {
  let displayValue;
  if (fetching) {
    // todo
    displayValue = "L";
  } else if (error) {
    // todo
    displayValue = "X";
  } else {
    displayValue = value;
  }
  return (
    <div className=" bg-white w-full mr-8 rounded-lg shadow-md text-center margin-killer">
      <div
        className="text-blue-800 leading-none my-8"
        style={{ fontSize: "5em" }}
      >
        {displayValue}
      </div>
      <div className="bg-gray-200 p-2 overflow-hidden rounded-lg rounded-t-none">
        {label}
      </div>
    </div>
  );
};

export default ConditionCard;
