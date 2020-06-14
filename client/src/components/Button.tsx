import React from "react";

const Button: React.FC<{
  onClick: (e: any) => void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`block shadow-md flex items-center justify-between bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg px-4 py-2 uppercase tracking-widest ${className}`}
      style={{ transition: "all .1s ease-out" }}
    >
      {children}
    </button>
  );
};

export default Button;
