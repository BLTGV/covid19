import { CsseCovid19TimeSeriesRow } from "./source";

export interface TimeSeriesItem {
  dateStamp: string;
  date: Date;
  value: number;
}

export interface TimeSeries {
  type: string;
  items: TimeSeriesItem[];
  source?: CsseCovid19TimeSeriesRow[];
  minValue: number;
  maxValue: number;
}
