import { retrieveTimeSeriesJson } from "./source";
import { groupBy, mapObjIndexed, length } from "ramda";
import { TimeSeries } from "../types/data/series";

export const generateData = async () => {
  const timeSeries = await retrieveTimeSeriesJson();

  const debug = null;
  const countries = timeSeries;

  return {
    debug,
    countries,
  };
};
