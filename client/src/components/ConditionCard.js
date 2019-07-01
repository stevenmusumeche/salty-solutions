import React from "react";

const ConditionCard = ({ label, value }) => {
  return (
    <div className="bg-white w-full mr-16 rounded-lg shadow-md text-center margin-killer">
      <div
        className="text-blue-800 leading-none my-8"
        style={{ fontSize: "6em" }}
      >
        {value}
      </div>
      <div className="bg-gray-200 p-2 overflow-hidden rounded-lg rounded-t-none">
        {label}
      </div>
    </div>
  );
};

export default ConditionCard;
