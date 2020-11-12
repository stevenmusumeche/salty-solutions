import React from "react";

interface Props {
  close: () => void;
  title?: string;
}

const Modal: React.FC<Props> = ({ close, title, children }) => {
  return (
    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
      <div
        className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        onClick={close}
      ></div>
      <div className="modal-container bg-white w-11/12 md:max-w-5xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content p-3 md:py-4 md:px-6 text-left">
          <div className="flex justify-between items-center pb-3">
            <p className="text-xl md:text-3xl">{title}</p>
            <button type="button" onClick={close} className="modal-close z-50">
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
