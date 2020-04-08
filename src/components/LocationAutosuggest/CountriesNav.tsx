import Autosuggest from "react-autosuggest";

import theme from "./CountriesNav.module.css";
import { useStoreState, useStoreActions } from "../../store";
import { values, ascend, prop } from "ramda";
import { useState } from "react";
import { countryToFlagPath } from "../../data/maps";

function InputComponent(inputProps) {
  return (
    <div className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
      <div className="relative flex w-full flex-wrap items-stretch">
        <span className="z-10 h-full leading-snug font-normal absolute text-center text-gray-400 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
          <i className="far fa-flag"></i>
        </span>
        <input
          type="text"
          className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10"
          {...inputProps}
        />
      </div>
    </div>
  );
}

function useCountriesAsSelectionList() {
  const changeSelectedCountry = useStoreActions(
    (state) => state.state.changeSelectedCountry,
  );
  const countriesMap = useStoreState((state) => state.data.countries);

  const countries = values(countriesMap).sort(ascend(prop("name")));

  return { changeSelectedCountry, countries };
}

const CountriesNav = () => {
  const { changeSelectedCountry, countries } = useCountriesAsSelectionList();
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function getSuggestions(value) {
    return countries.filter((country) =>
      country.name.toLowerCase().includes(value.trim().toLowerCase()),
    );
  }
  return (
    <Autosuggest
      id="countries"
      theme={theme}
      className="text-justify"
      suggestions={suggestions}
      onSuggestionsClearRequested={() => setSuggestions([])}
      onSuggestionsFetchRequested={({ value }) => {
        setSuggestions(getSuggestions(value));
      }}
      onSuggestionSelected={(_, { suggestionValue }) => {
        changeSelectedCountry(suggestionValue);
        setValue("");
      }}
      getSuggestionValue={(suggestion) => suggestion.name}
      renderSuggestion={(suggestion) => (
        <div className="flex items-center px-1 cursor-pointer">
          <div className="flex-initial items-center mr-4">
            <img
              src={countryToFlagPath(suggestion)}
              alt={suggestion.country}
              className="w-4"
            />
          </div>
          <div className="flex-1 w-40">{suggestion.name}</div>
        </div>
      )}
      inputProps={{
        placeholder: "select country",
        value: value,
        onChange: (_, { newValue, method }) => {
          setValue(newValue);
        },
      }}
      highlightFirstSuggestion={true}
      renderInputComponent={InputComponent}
    />
  );
};

export default CountriesNav;
