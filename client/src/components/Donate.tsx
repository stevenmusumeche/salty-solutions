import React from "react";
import BeerIcon from "../assets/beer.svg";

const Donate = () => (
  <div
    className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 rounded-r-lg shadow-md p-4 mt-8 mb-4 md:mt-12 md:mb-8"
    role="alert"
  >
    <div className="md:flex md:items-center">
      <div className="hidden md:block">
        <img
          src={BeerIcon}
          alt="beer"
          className="h-12 h-12 mr-12 md:h-24 md:w-24 md:mr-20"
        />
      </div>
      <div>
        <p className="font-bold mb-2">Like Salty Solutions?</p>
        <p className="text-sm">
          <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_blank"
          >
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input
              type="hidden"
              name="hosted_button_id"
              value="CPQ8TNMTP42NY"
            />
            I developed this site as a free service, but it takes time and money
            to run it. If you enjoy it, please consider{" "}
            <button className="underline" type="submit">
              buying me a beer
            </button>{" "}
            or sending me{" "}
            <a
              href="https://www.facebook.com/musumeche"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              your top-secret fishing spots
            </a>
            . Totally optional, but very much appreciated.
          </form>
        </p>
      </div>
    </div>
  </div>
);

export default Donate;
