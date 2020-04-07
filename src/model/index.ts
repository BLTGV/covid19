import data, { DataModel } from "./data";
import state, { StateModel } from "./state";

export interface StoreModel {
  data: DataModel;
  state: StateModel;
}

const model: StoreModel = {
  data,
  state,
};

export default model;
