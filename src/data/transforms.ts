import { CsseCovid19TimeSeriesRow } from "../types/data/source";
import { TimeSeries, TimeSeriesItem } from "../types/data/series";
import { isValid } from "date-fns";
import { keys } from "ramda";

const sourceRowToSeriesItems = (
  source: CsseCovid19TimeSeriesRow,
): TimeSeriesItem[] => {
  const isKeyDate = (key: string) => {
    return isValid(new Date(key));
  };

  const dateKeys = keys(source).filter(isKeyDate);

  const timeSeries: TimeSeriesItem[] = dateKeys.map((dateStamp: string) => {
    const datum = source[dateStamp];
    const value = Number.parseInt(datum);
    return {
      dateStamp,
      date: new Date(dateStamp),
      value,
    };
  });

  return timeSeries;
};

export const sourceRowToSeries = (source: CsseCovid19TimeSeriesRow) => (
  type: string,
) => {
  const items = sourceRowToSeriesItems(source);
  const minValue = items.reduce((prev, curr) => {
    if (curr.value < prev) return curr.value;
    return prev;
  }, 0);
  const maxValue = items.reduce((prev, curr) => {
    if (curr.value > prev) return curr.value;
    return prev;
  }, 0);

  return {
    type,
    items,
    source,
    minValue,
    maxValue,
  };
};
