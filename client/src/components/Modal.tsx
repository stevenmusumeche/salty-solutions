import React, { ReactNode } from "react";

interface Props {
  close: () => void;
  children: ReactNode;
}

const Modal: React.FC<Props> = ({ close, children }) => (
  <div
    className="fixed z-50 inset-0 w-full h-full overflow-auto flex items-start justify-center"
    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
  >
    <div
      className="bg-white p-8 border shadow-xl rounded w-1/2 relative mt-24 overflow-auto"
      style={{ maxHeight: "80vh" }}
    >
      <button
        className="absolute top-0 right-0 text-3xl font-bold p-4 leading-none text-gray-800 hover:text-black"
        type="button"
        onClick={close}
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
