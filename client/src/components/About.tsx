import React from "react";
import UrStupidFace from "../assets/steven.jpg";
import Shell from "./Shell";
import { RouteComponentProps } from "@reach/router";
import Link from "./Link";

const About: React.FC<RouteComponentProps> = () => (
  <Shell>
    <div className="container mx-auto">
      <div className="forecast-wrapper">
        <img
          src={UrStupidFace}
          alt="steven musumeche"
          className="block float-right m-8 rounded-full w-48 border border-gray-300 shadow-md"
        />
        <h1 className="text-4xl mb-4">About</h1>

        <p className="">
          Hi, I'm{" "}
          <a
            href="https://musumeche.com"
            target="_blank"
            className="text-blue-600"
            rel="noopener noreferrer"
          >
            Steven Musumeche
          </a>
          , a resident of Lafayette, LA and avid saltwater fisherman. I created
          Salty Solutions to answer a question that I'm always asking myself:
        </p>
        <h2 className="text-2xl my-4 uppercase tracking-wide text-gray-700">
          When should I go fishing?
        </h2>
        <p className="mb-4">
          Like most of you, I have a limited amount of time that I can devote to
          fishing. When I plan my next fishing trip, I want to make sure the
          conditions are conducive to a productive day on the water.
        </p>
        <p className="mb-4">
          There are lots of great websites and apps available with information
          about weather, tides, and more. However, none of them gave me
          everything that I wanted to know in a way that could be quickly viewed
          and easily digested.
        </p>
        <p className="mb-4">
          I'm a software engineer by trade, so I thought, "hey, I can make
          something decent enough for personal use." After showing it to a few
          fellow fisherman, I decided to release it publically for anyone to use
          for free.
        </p>
        <p className="mb-4">
          I hope you find it useful - please{" "}
          <a href="mailto:steven@musumeche.com" className="text-blue-600">
            contact me
          </a>{" "}
          with any suggestions or comments.
        </p>
        <h2 className="text-3xl mb-4">Contact Me</h2>
        <p className="mb-4">
          I'd love to hear your feedback about this tool or to connect and swap
          fishing stories.
        </p>
        <ul className="mb-4 flex">
          <li className="mr-4">
            {" "}
            <Link
              to="mailto:steven@musumeche.com?subject=Salty Solutions Feedback"
              target="_blank"
              rel="noopener nofollow"
            >
              steven@musumeche.com
            </Link>
          </li>
          <li className="mr-4">•</li>
          <li className="mr-4">
            {" "}
            <Link
              to="https://www.facebook.com/musumeche"
              target="_blank"
              rel="noopener nofollow"
            >
              Facebook
            </Link>
          </li>
          <li className="mr-4">•</li>
          <li className="mr-4">
            {" "}
            <Link
              to="https://twitter.com/smusumeche"
              target="_blank"
              rel="noopener nofollow"
            >
              Twitter
            </Link>
          </li>
          <li className="mr-4">•</li>
          <li className="mr-4">
            {" "}
            <Link
              to="https://www.linkedin.com/in/smusumeche/"
              target="_blank"
              rel="noopener nofollow"
            >
              LinkedIn
            </Link>
          </li>
          <li className="mr-4">•</li>
          <li className="mr-4">
            {" "}
            <Link
              to="https://github.com/stevenmusumeche"
              target="_blank"
              rel="noopener nofollow"
            >
              GitHub
            </Link>
          </li>
        </ul>
        <h2 className="text-3xl mb-4">Technical Details</h2>
        <p>
          The code used to run this site is{" "}
          <a
            href="https://github.com/stevenmusumeche/salty-solutions"
            target="_blank"
            className="text-blue-600"
            rel="noopener noreferrer"
          >
            completely open-source
          </a>
          . Feel free to look around if you're curious. The API that powers the
          site is a GraphQL server, written in TypeScript, and hosted on AWS
          Lambda. The browser application is a React app, also written in
          TypeScript, and hosted on Netlify.
        </p>
      </div>
    </div>
  </Shell>
);

export default About;
