import fetch from "node-fetch";
import Papa from "papaparse";

import { CsseCovid19TimeSeriesRow } from "../types/data/source";

const URL_PATH =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";
const URL_FILE = "time_series_covid19_deaths_global.csv";
const URL = `${URL_PATH}${URL_FILE}`;

export const retrieveSource = async (): Promise<CsseCovid19TimeSeriesRow[]> => {
  const res = await fetch(URL);
  const rows = await res.text();

  const data = Papa.parse(rows, { header: true });

  return data.data;
};
