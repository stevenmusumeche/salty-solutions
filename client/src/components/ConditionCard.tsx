import React, { ReactNode } from "react";
import { CombinedError } from "urql";
import SkeletonCharacter from "./SkeletonCharacter";
import "./SkeletonCharacter.css";
import ErrorIcon from "../assets/error.svg";

interface Props {
  label: string;
  value?: string;
  fetching: boolean;
  error?: CombinedError;
}

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className="relative bg-white w-full mr-8 rounded-lg shadow-md text-center margin-killer flex-col flex justify-between align-center flex-grow"
    style={{ minHeight: "12rem" }}
  >
    {children}
  </div>
);

const Label: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-gray-200 p-2 overflow-hidden rounded-lg rounded-t-none flex-grow-0 flex-shrink-0">
    {label}
  </div>
);

const ConditionCard: React.FC<Props> = ({ label, value, fetching, error }) => {
  let displayValue: any = null;
  let fontSize = "6em";

  if (fetching) {
    return (
      <Wrapper>
        <SkeletonCharacter />
        <Label label={label} />
      </Wrapper>
    );
  } else if (error) {
    displayValue = (
      <img src={ErrorIcon} style={{ height: "75%" }} alt="error" />
    );
  } else {
    displayValue = value;
    if (displayValue.length > 3) {
      fontSize = "5.5em";
    }
  }

  return (
    <Wrapper>
      <div
        className="text-blue-800 leading-none flex items-center justify-center flex-grow p-2"
        style={{ fontSize }}
      >
        {displayValue}
      </div>
      <Label label={label} />
    </Wrapper>
  );
};

export default ConditionCard;
