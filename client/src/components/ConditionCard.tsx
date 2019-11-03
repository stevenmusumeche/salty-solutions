import React, { ReactNode, useContext } from "react";
import { CombinedError } from "urql";
import SkeletonCharacter from "./SkeletonCharacter";
import "./SkeletonCharacter.css";
import ErrorIcon from "../assets/error.svg";
import { WindowSizeContext } from "../providers/WindowSizeProvider";

interface Props {
  label: string;
  fetching: boolean;
  error?: CombinedError | boolean;
  children: ReactNode;
  fontSize?: string;
  className?: string;
}

const Wrapper: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className
}) => {
  const { isSmall } = useContext(WindowSizeContext);
  return (
    <div
      className={`${className &&
        className} relative bg-white w-full rounded-lg shadow-md text-center flex-col flex justify-between align-center flex-grow`}
      style={{ minHeight: isSmall ? "8rem" : "12rem" }}
    >
      {children}
    </div>
  );
};

const Label: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-gray-200 p-2 overflow-hidden rounded-lg rounded-t-none flex-grow-0 flex-shrink-0 text-xs md:text-base">
    {label}
  </div>
);

const ConditionCard: React.FC<Props> = ({
  label,
  fetching,
  error,
  children,
  fontSize = "7em",
  className
}) => {
  let displayValue: any = null;
  const { isSmall } = useContext(WindowSizeContext);

  if (fetching) {
    return (
      <Wrapper>
        <SkeletonCharacter />
        <Label label={label} />
      </Wrapper>
    );
  } else if (error && !children) {
    displayValue = <img src={ErrorIcon} style={{ height: 120 }} alt="error" />;
  } else {
    displayValue = children;
  }

  return (
    <Wrapper className={className}>
      <div
        className="condition-card-value text-blue-800 leading-none flex items-center justify-center flex-grow p-2 relative"
        style={{ fontSize: isSmall ? "4em" : fontSize }}
      >
        {displayValue}
      </div>
      <Label label={label} />
    </Wrapper>
  );
};

export default ConditionCard;
