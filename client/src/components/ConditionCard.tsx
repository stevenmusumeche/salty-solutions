import React, { ReactNode, useContext } from "react";
import { CombinedError, OperationContext } from "urql";
import SkeletonCharacter from "./SkeletonCharacter";
import "./SkeletonCharacter.css";
import ErrorIcon from "../assets/error.svg";
import { WindowSizeContext } from "../providers/WindowSizeProvider";
import EmptyBox from "./EmptyBox";

interface Props {
  label: string;
  fetching: boolean;
  error?: CombinedError | boolean;
  children: ReactNode;
  fontSize?: string;
  className?: string;
  refresh?: (opts?: Partial<OperationContext> | undefined) => void;
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
  className,
  refresh
}) => {
  let displayValue: any = null;
  const { isSmall } = useContext(WindowSizeContext);

  if (fetching) {
    return (
      <Wrapper>
        <div className="flex justify-center mt-4">
          <EmptyBox w={100} h={100} />
        </div>
        <div className="flex justify-center mt-2">
          <EmptyBox w={"90%"} h={180} />
        </div>
        <div className="flex justify-center my-4">
          <EmptyBox w={"70%"} h={24} />
        </div>
        <Label label={label} />
      </Wrapper>
    );
  } else if (error && !children) {
    displayValue = (
      <div className="flex flex-col">
        <img src={ErrorIcon} style={{ height: 120 }} alt="error" />
        {refresh && (
          <button
            onClick={() => refresh({ requestPolicy: "network-only" })}
            type="button"
            className={"text-black text-sm hover:underline mt-2 mb-1"}
          >
            retry
          </button>
        )}
      </div>
    );
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
