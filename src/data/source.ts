import fetch from "node-fetch";
import Papa from "papaparse";
import { existsSync, readFileSync, writeFileSync } from "fs";

import { CsseCovid19TimeSeriesRow } from "../types/data/source";
import {
  mapObjIndexed,
  omit,
  pickBy,
  keys,
  reduce,
  lensProp,
  isNil,
  pipe,
  over,
  map,
  mean,
  last,
  length,
  reverse,
  dissoc,
  slice,
  append,
  values,
  sortBy,
  prop,
  descend,
  sort,
  defaultTo,
} from "ramda";
import { trail, valuesASC } from "../utils";
import { LocationData, LocationDataMap } from "../types/data/series";
import { generateCountryData, orderByLatestDateProp } from "./transforms";

const URL_PATH =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";
const URL_FILE_DEATHS = "time_series_covid19_deaths_global.csv";
const URL_FILE_CONFIRMED = "time_series_covid19_confirmed_global.csv";
const URL_DEATHS = `${URL_PATH}${URL_FILE_DEATHS}`;
const URL_CONFIRMED = `${URL_PATH}${URL_FILE_CONFIRMED}`;

const URL_CDS_TIMESERIES =
  "https://coronadatascraper.com/timeseries-byLocation.json";

const retrieveSource = async (
  url: string,
): Promise<CsseCovid19TimeSeriesRow[]> => {
  const res = await fetch(url);
  const rows = await res.text();

  const data = Papa.parse(rows, { header: true });

  return data.data;
};

export const retrieveTimeSeriesJson = async () => {
  const file = "./cached_timeseries.json";
  let json;
  if (existsSync(file)) {
    const res = readFileSync(file);
    json = JSON.parse(res.toString());
  } else {
    const res = await fetch(URL_CDS_TIMESERIES);
    json = await res.json();
    writeFileSync(file, JSON.stringify(json));
  }
  const dataReduced = mapObjIndexed(
    omit([
      "url",
      "maintainers",
      "curators",
      "tz",
      "rating",
      "coordinates",
      "sources",
      "featureId",
    ]),
    json,
  );

  const countries = generateCountryData(dataReduced as LocationDataMap);

  const countriesList = values(countries);

  const byWeeklyDeathsDESC = countriesList
    .map(
      (o: {
        country: string;
        dates: { [keys: string]: { deaths: number } };
      }) => {
        const latestValue = last(valuesASC(o.dates));
        return {
          country: o.country,
          deaths: defaultTo(-1, latestValue.weeklyDeaths),
        };
      },
    )
    .sort(descend(prop("deaths")));

  const byWeeklyDeathsPPDESC = countriesList
    .map((o: LocationData) => {
      const latestValue = last(valuesASC(o.dates));
      const deaths = defaultTo(-1, latestValue.weeklyDeaths);
      return {
        country: o.country,
        deaths,
        population: o.population,
        deathsPP: deaths / o.population,
      };
    })
    .sort(descend(prop("deathsPP")));

  const byWeeklyDeathsAltDESC = orderByLatestDateProp(
    "weeklyDeaths",
    countriesList,
  );

  const provinces = pickBy((v, k: string) => k.includes(","), dataReduced);
  return {
    countries,
    byWeeklyDeathsDESC,
    // provinces,
  };
};

export const retrieveSourceDeaths = () => retrieveSource(URL_DEATHS);
export const retrieveSourceConfirmed = () => retrieveSource(URL_CONFIRMED);
