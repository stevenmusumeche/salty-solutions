import React from "react";
import BeerIcon from "../assets/beer.svg";

const Donate = () => (
  <div
    className="bg-orange-100 border-l-8 border-orange-500 text-orange-700 rounded-lg shadow-md p-4 mt-4 md:mt-8 mb-4 md:mb-8"
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
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_blank"
        >
          <p className="font-bold mb-2">Like Salty Solutions?</p>
          <p className="text-sm">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input
              type="hidden"
              name="hosted_button_id"
              value="CPQ8TNMTP42NY"
            />
            I developed this site as a free service because I fish the Dularge
            area, but it takes time and money to run it. If you enjoy it, please
            consider{" "}
            <button className="underline" type="submit">
              buying me a beer
            </button>{" "}
            or sending me{" "}
            <a
              href="mailto:steven@musumeche.com"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              your top-secret fishing spots
            </a>
            . Totally optional, but very much appreciated.
          </p>
        </form>
      </div>
    </div>
  </div>
);

export default Donate;
