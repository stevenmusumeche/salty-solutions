import React, { ReactNode, useContext } from "react";
import { CombinedError, OperationContext } from "urql";
import ErrorIcon from "../assets/error.svg";
import { WindowSizeContext } from "../providers/WindowSizeProvider";
import EmptyBox from "./EmptyBox";
import useBreakpoints from "../hooks/useBreakpoints";

interface Props {
  label: string;
  fetching: boolean;
  error?: CombinedError | boolean;
  children: ReactNode;
  fontSize?: string;
  className?: string;
  refresh?: (opts?: Partial<OperationContext> | undefined) => void;
  loadingComponent?: any;
}

const Wrapper: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { isSmall } = useBreakpoints();
  return (
    <div
      className={`${
        className ? className : ""
      } relative bg-white w-full rounded-lg shadow-md text-center flex-col flex justify-between align-center flex-grow`}
      style={{ minHeight: isSmall ? "8rem" : "12rem" }}
    >
      {children}
    </div>
  );
};

const Label: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-gray-200 p-2 overflow-hidden rounded-lg rounded-b-none flex-grow-0 flex-shrink-0 text-xs md:text-base">
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
  refresh,
  loadingComponent: LoadingComponent,
}) => {
  let displayValue: any = null;
  const { isSmall } = useContext(WindowSizeContext);

  if (fetching) {
    return (
      <Wrapper>
        <Label label={label} />
        {LoadingComponent ? (
          <LoadingComponent isSmall={isSmall} />
        ) : (
          <>
            <div className="flex justify-center items-center flex-grow my-8">
              <EmptyBox w={"80%"} h={isSmall ? 180 : 295} />
            </div>
          </>
        )}
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
      <Label label={label} />
      <div
        className="condition-card-value text-blue-800 leading-none flex justify-center flex-grow p-2 relative items-start"
        style={{ fontSize: isSmall ? "4em" : fontSize }}
      >
        {displayValue}
      </div>
    </Wrapper>
  );
};

export default ConditionCard;
