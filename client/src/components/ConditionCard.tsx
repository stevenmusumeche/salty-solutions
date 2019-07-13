import React, { ReactNode } from "react";
import { CombinedError } from "urql";
import SkeletonCharacter from "./SkeletonCharacter";
import "./SkeletonCharacter.css";
import ErrorIcon from "../assets/error.svg";

interface Props {
  label: string;
  fetching: boolean;
  error?: CombinedError;
  children: ReactNode;
}

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className="relative bg-white w-full rounded-lg shadow-md text-center flex-col flex justify-between align-center flex-grow"
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

const ConditionCard: React.FC<Props> = ({
  label,
  fetching,
  error,
  children
}) => {
  let displayValue: any = null;
  let fontSize = "7em";

  if (fetching) {
    return (
      <Wrapper>
        <SkeletonCharacter />
        <Label label={label} />
      </Wrapper>
    );
  } else if (error) {
    displayValue = <img src={ErrorIcon} style={{ height: 120 }} alt="error" />;
  } else {
    displayValue = children;
  }

  return (
    <Wrapper>
      <div
        className="text-blue-800 leading-none flex items-center justify-center flex-grow p-2 relative"
        style={{ fontSize }}
      >
        {displayValue}
      </div>
      <Label label={label} />
    </Wrapper>
  );
};

export default ConditionCard;
