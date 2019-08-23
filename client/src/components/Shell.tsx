import React, { ReactNode } from "react";
import "../css/build.css";
import HeaderWrapper from "./HeaderWrapper";
import { Link as ReachLink } from "@reach/router";
import Logo from "../assets/logo.svg";

const Shell: React.FC<{ header?: ReactNode }> = ({ children, header }) => (
  <div className="min-h-screen flex flex-col">
    <HeaderWrapper>
      <div className="container mx-auto flex items-center justify-between h-full">
        <div className="flex items-center">
          <ReachLink to="/">
            <img
              src={Logo}
              className="block mr-6 h-10"
              alt="salty solutions logo"
            />
          </ReachLink>
        </div>
        {header}
      </div>
    </HeaderWrapper>
    <div className="flex-grow my-8">{children}</div>
    <footer className="bg-gray-700 text-white w-full">
      <div className="container mx-auto py-4 flex justify-between">
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
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  </div>
);

export default Shell;

const Link: React.FC<{ to: string }> = ({ children, to }) => (
  <ReachLink
    to={to}
    className="text-lg font-light uppercase tracking-widest ml-6 hover:underline"
  >
    {children}
  </ReachLink>
);
