import data, { DataModel } from "./data";

export interface StoreModel {
  data: DataModel;
}

const model: StoreModel = {
  data,
};

export default model;
