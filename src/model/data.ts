import { Action, action } from "easy-peasy";
import { WorldSummary } from "../types/data/summary";
import { CsseCovid19TimeSeriesRow } from "../types/data/source";
import { LocationData } from "../types/data/series";
import { LocationDataMap } from "../types/data/series";

export interface DataModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: any;
  countries: LocationDataMap;
}

const data: DataModel = {
  debug: null,
  countries: {},
};

export default data;
