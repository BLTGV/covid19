import { retrieveSource } from "./source";
import { sourceRowToSeries } from "./transforms";

export const generateData = async () => {
  const raw = await retrieveSource();
  const debug = raw.map((s) => sourceRowToSeries(s)("CUM_DEATHS"));
  const countries = [];

  return {
    raw,
    debug,
    countries,
  };
};
