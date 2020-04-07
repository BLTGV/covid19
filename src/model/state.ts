import { Action, action, Computed, computed } from "easy-peasy";
import { LocationData } from "../types/data/series";
import { StoreModel } from ".";

export interface StateModel {
  selectedCountryName: string;
  selectedCountry: Computed<StateModel, LocationData>;
  changeSelectedCountry: Action<StateModel, string>;
}

const state: StateModel = {
  selectedCountryName: null,
  selectedCountry: computed(
    [
      (state) => state.selectedCountryName,
      (state, storeState: StoreModel) => storeState.data.countries,
    ],
    (selected, country) => country[selected],
  ),
  changeSelectedCountry: action((state, payload) => {
    state.selectedCountryName = payload;
  }),
};

export default state;
