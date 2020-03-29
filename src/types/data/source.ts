/**
 * Sourced from https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series
 * Compatable with ./time_series_covid19_confirmed_global.csv and ./time_series_covid19_deaths_global.csv
 */
export interface CsseCovid19TimeSeriesRow {
  "Provence/State": string;
  "Country/Region": string;
  Lat: string;
  Long: string;
  [date: string]: string;
}
