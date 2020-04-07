import {
  keys,
  length,
  map,
  reverse,
  isNil,
  dissoc,
  reduce,
  mean,
  last,
  lensProp,
  pipe,
  pickBy,
  mapObjIndexed,
  over,
  compose,
  prop,
  values,
  descend,
  sort,
  ascend,
  path,
  lensPath,
  defaultTo,
  nth,
  identity,
} from "ramda";
import { WithKeysInOrder, trail, valuesASC, keysASC } from "../utils";
import {
  DateSeries,
  LocationDataMap,
  LocationData,
  DateItem,
} from "../types/data/series";

const removeIncoming = (dateSeries: DateSeries): DateSeries => {
  const { lastKey, prevValuesOf } = WithKeysInOrder(dateSeries);
  const [prevValue] = reverse(prevValuesOf(lastKey, 1));
  if (isNil(prevValue)) return dateSeries;
  const lastValue = dateSeries[lastKey];

  if (lastValue.cases < prevValue.cases || lastValue.deaths < prevValue.deaths)
    return dissoc(lastKey, dateSeries);
  return dateSeries;
};

const appendPeriodicDeaths = (dateSeries: DateSeries): DateSeries => {
  const { keysInOrder } = WithKeysInOrder(dateSeries);
  const datesTrail = trail(8, keysInOrder);
  return reduce(
    (acc, d) => {
      const [curr, prev] = reverse(d);
      const [lastWeek] = d;
      if (isNil(prev))
        return {
          ...acc,
          [curr]: { ...dateSeries[curr], dailyDeaths: 0, weeklyDeaths: 0 },
        };
      if (length(d) < 8)
        return {
          ...acc,
          [curr]: {
            ...dateSeries[curr],
            dailyDeaths: dateSeries[curr].deaths - dateSeries[prev].deaths,
            ddGR:
              (dateSeries[curr].deaths - dateSeries[prev].deaths) /
              dateSeries[prev].deaths,
            weeklyDeaths: dateSeries[curr].deaths - dateSeries[prev].deaths,
          },
        };
      return {
        ...acc,
        [curr]: {
          ...dateSeries[curr],
          dailyDeaths: dateSeries[curr].deaths - dateSeries[prev].deaths,
          ddGR:
            (dateSeries[curr].deaths - dateSeries[prev].deaths) /
            dateSeries[prev].deaths,
          weeklyDeaths: dateSeries[curr].deaths - dateSeries[lastWeek].deaths,
          wdGR:
            (dateSeries[curr].deaths - dateSeries[lastWeek].deaths) /
            dateSeries[lastWeek].deaths,
        },
      };
    },
    {},
    datesTrail,
  );
};

const appendDdSevenDayMA = (dateSeries: DateSeries): DateSeries => {
  const { keysInOrder } = WithKeysInOrder(dateSeries);
  const datesTrail = trail(8, keysInOrder);
  return reduce(
    (acc, d) => {
      const curr = last(d);
      const deaths = map((k) => dateSeries[k].dailyDeaths, d);
      const dd7ma = Math.round((mean(deaths) + Number.EPSILON) * 100) / 100;
      return {
        ...acc,
        [curr]: {
          ...dateSeries[curr],
          dd7ma,
        },
      };
    },
    {},
    datesTrail,
  );
};

const appendDeathsPerMillion = (population: number) => (
  dateSeries: DateSeries,
): DateSeries => {
  if (isNil(population)) return dateSeries;
  return mapObjIndexed((datum) => {
    const dpm = (d: number) => (d / population) * 1000000;
    return {
      ...datum,
      deathsPM: dpm(defaultTo(0, datum.deaths)),
      dailyDeathsPM: dpm(defaultTo(0, datum.dailyDeaths)),
      weeklyDeathsPM: dpm(defaultTo(0, datum.weeklyDeaths)),
    };
  }, dateSeries);
};

const dateLens = lensProp("dates");

const daysFromLatestDate = (
  numOfDays: number,
  locationData: LocationData,
): [string, DateItem] => {
  const dateSeriesKey = compose(
    nth(numOfDays),
    (l: string[]) => reverse(l),
    keysASC,
    prop("dates"),
  )(locationData);
  const dateSeries = locationData.dates[dateSeriesKey];
  return [dateSeriesKey, dateSeries];
};

export const latestDate = (locationData: LocationData): [string, DateItem] => {
  return daysFromLatestDate(0, locationData);
};

export const withSliceInTime = (locationData: LocationData): LocationData => ({
  ...locationData,
  dateSlices: {
    latest: latestDate(locationData),
    daysPrior1: daysFromLatestDate(1, locationData),
    daysPrior2: daysFromLatestDate(2, locationData),
    daysPrior7: daysFromLatestDate(7, locationData),
    daysPrior14: daysFromLatestDate(14, locationData),
  },
});

export const appendSliceInTime = (
  locationData: LocationDataMap,
): LocationDataMap => {
  return mapObjIndexed((datum) => {
    return withSliceInTime(datum);
  }, locationData);
};

export const generateCountryData: (
  locationData: LocationDataMap,
) => LocationDataMap = pipe(
  pickBy((_v, k) => {
    return !k.includes(",");
  }),
  mapObjIndexed((v) => over(dateLens, removeIncoming, v)),
  mapObjIndexed((v) => over(dateLens, appendPeriodicDeaths, v)),
  mapObjIndexed((v) => over(dateLens, appendDdSevenDayMA, v)),
  mapObjIndexed((v: LocationData) =>
    over(dateLens, appendDeathsPerMillion(v.population), v),
  ),
  appendSliceInTime,
);

export const orderByLatestDateProp = (
  propName: string,
  locations: LocationData[],
  isASC = false,
): LocationData[] => {
  const order = isASC ? ascend : descend;
  const sortedLocations = locations
    .map(
      over(lensPath(["dateSlices", "latest", "1", propName]), defaultTo(NaN)),
    )
    .sort(order(path(["dateSlices", "latest", "1", propName])));
  return sortedLocations;
};
