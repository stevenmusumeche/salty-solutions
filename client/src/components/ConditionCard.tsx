import React, { ReactNode } from "react";
import { CombinedError } from "urql";
import SkeletonCharacter from "./SkeletonCharacter";
import "./SkeletonCharacter.css";

interface Props {
  label: string;
  value?: string;
  fetching: boolean;
  error?: CombinedError;
}

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className="relative bg-white w-full mr-8 rounded-lg shadow-md text-center margin-killer"
    style={{ paddingBottom: "2.5em" }}
  >
    {children}
  </div>
);

const Label: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-gray-200 p-2 overflow-hidden rounded-lg rounded-t-none absolute bottom-0 inset-x-0">
    {label}
  </div>
);

const ConditionCard: React.FC<Props> = ({ label, value, fetching, error }) => {
  let displayValue;
  if (fetching) {
    return (
      <Wrapper>
        <SkeletonCharacter />
        <Label label={label} />
      </Wrapper>
    );
  } else if (error) {
    // todo
    displayValue = "X";
  } else {
    displayValue = value;
  }
  return (
    <Wrapper>
      <div
        className="text-blue-800 leading-none my-8"
        style={{ fontSize: "6em" }}
      >
        {displayValue}
      </div>
      <Label label={label} />
    </Wrapper>
  );
};

export default ConditionCard;
