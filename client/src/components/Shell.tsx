import React, { ReactNode } from "react";
import "../css/build.css";
import HeaderWrapper from "./HeaderWrapper";
import { Link as ReachLink } from "@reach/router";
import Logo from "../assets/logos/logo.svg";

const Shell: React.FC<{ header?: ReactNode }> = ({ children, header }) => (
  <div className="min-h-screen flex flex-col">
    <HeaderWrapper>
      <div className="container mx-auto flex items-stretch justify-between h-full">
        <div className="">
          <ReachLink to="/">
            <img
              src={Logo}
              className="block mr-6 w-full md:w-auto md:h-12 md:-ml-1"
              style={{ maxWidth: "40vw" }}
              alt="salty solutions logo"
            />
          </ReachLink>
        </div>
        {header}
      </div>
    </HeaderWrapper>
    <div className="flex-grow">{children}</div>
    <footer className="bg-gray-700 text-white w-full">
      <div className="container mx-auto p-2 md:px-0 md:py-4 flex justify-between text-sm md:text-base">
        <div>
          Engineered by{" "}
          <a
            href="https://www.musumeche.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Steven Musumeche
          </a>
        </div>
        <div>
          <Link to="/about">About</Link>
        </div>
      </div>
    </footer>
  </div>
);

export default Shell;

const Link: React.FC<{ to: string }> = ({ children, to }) => (
  <ReachLink
    to={to}
    onClick={() => window.scrollTo({ top: 0 })}
    className="text-sm md:text-lg font-light uppercase tracking-widest ml-6 md:hover:underline"
  >
    {children}
  </ReachLink>
);
