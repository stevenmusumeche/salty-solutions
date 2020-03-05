import React from "react";
import Caret from "../assets/caret.svg";

interface Props {
  title: string;
  visible: boolean;
  toggleVisible: () => void;
}

const CollapsibleSection: React.FC<Props> = ({
  title,
  children,
  visible,
  toggleVisible
}) => {
  return (
    <>
      <button
        type="button"
        onClick={toggleVisible}
        className="focus:outline-none block"
      >
        <div className="flex items-center mb-4 md:mb-8">
          <h2 className="text-2xl md:text-4xl text-center md:text-left">
            {title}
          </h2>

          <img
            src={Caret}
            className="block w-6 h-6 ml-2"
            alt=""
            style={{
              transform: `rotate(${visible ? 90 : 0}deg`,
              transition: "transform .15s ease-in-out"
            }}
          />
        </div>
      </button>
      {visible && children}
    </>
  );
};

export default CollapsibleSection;
