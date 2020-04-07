import { TimeSeries } from "./series";

export interface Summary {
  type: string;
  cumulativeDeaths: TimeSeries;
  cumulativeConfirmed: TimeSeries;
  computedSeries: TimeSeries[];
}

export interface ProvinceSummary extends Summary {
  type: "PROVINCE";
}

export interface CountrySummary extends Summary {
  type: "COUNTRY";
  provinces: ProvinceSummary[];
}

export interface WorldSummary extends Summary {
  type: "WORLD";
  countries: CountrySummary[];
}
