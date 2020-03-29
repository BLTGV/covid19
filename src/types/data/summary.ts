import { TimeSeries } from "./series";

export interface Summary {
  type: string;
  cumulativeDeaths: TimeSeries;
  cumulativeConfirmed: TimeSeries;
  computedSeries: TimeSeries[];
}

export interface ProvenceSummary extends Summary {
  type: "PROVENCE";
}

export interface CountrySummary extends Summary {
  type: "COUNTRY";
  provences: ProvenceSummary[];
}

export interface WorldSummary extends Summary {
  type: "WORLD";
  countries: CountrySummary[];
}
