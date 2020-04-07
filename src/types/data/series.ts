import { CsseCovid19TimeSeriesRow } from "./source";

export interface TimeSeriesItem {
  dateStamp: string;
  date: Date;
  value: number;
}

export interface TimeSeries {
  type: string;
  items: TimeSeriesItem[];
  source?: CsseCovid19TimeSeriesRow;
  country: string;
  province: string;
  // minValue: number;
  // maxValue: number;
}
export interface DateItem {
  cases: number;
  deaths: number;
  [series: string]: number;
}

export interface DateSeries {
  [date: string]: DateItem;
}

export interface LocationData {
  dates: DateSeries;
  country: string;
  aggregate: string;
  name: string;
  level: string;
  countryId?: string;
  population?: number;
  dateSlices?: {
    [slices: string]: [string, DateItem];
  };
}

export interface LocationDataMap {
  [location: string]: LocationData;
}
