import React from "react";

import UserDropdown from "./UserDropdown.js";
import CountriesNav from "./LocationAutosuggest/CountriesNav";
import { countryToFlagPath } from "../data/maps";
import { useStoreState } from "../store";

export default function Navbar() {
  const selectedCountry = useStoreState((state) => state.state.selectedCountry);
  const flagPath = countryToFlagPath(selectedCountry);
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
          <div className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <img
              src={flagPath}
              alt={selectedCountry.country}
              className="w-20 mr-4"
            />
            <CountriesNav />
          </div>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
