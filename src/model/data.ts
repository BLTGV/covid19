import { Action, action } from "easy-peasy";
import { WorldSummary } from "../types/data/summary";
import { CsseCovid19TimeSeriesRow } from "../types/data/source";

export interface DataModel {
  raw: CsseCovid19TimeSeriesRow[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: any;
  world?: WorldSummary;
  loadCount: number;
  loadWorld: Action<DataModel, WorldSummary>;
  loadRaw: Action<DataModel, CsseCovid19TimeSeriesRow[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadDebug: Action<DataModel, any>;
}

const data: DataModel = {
  raw: [],
  debug: null,
  world: null,
  loadCount: 0,
  loadWorld: action((state, payload) => {
    // ensure data is only updated once into the model
    if (state.loadCount === 0) {
      state.world = payload;
      state.loadCount = 1;
    }
  }),
  loadRaw: action((state, payload) => {
    state.raw = payload;
  }),
  loadDebug: action((state, payload) => {
    state.debug = payload;
  }),
};

export default data;
