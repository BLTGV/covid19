import { useStoreState, useStoreActions } from "../store";
import { useState, useReducer, useMemo } from "react";
import { LocationData } from "../types/data/series";
import { orderByLatestDateProp, latestDate } from "../data/transforms";
import { values, take } from "ramda";
import { country2toFlagPath, countryToFlagPath } from "../data/maps";
import numeral from "numeral";

type DeathsProp = "deaths" | "deathsPM";
type WeeklyDeathsProp = "weeklyDeaths" | "weeklyDeathsPM";
type DailyDeathsProp = "dailyDeaths" | "dailyDeathsPM";

type Props = DeathsProp | WeeklyDeathsProp | DailyDeathsProp;

interface TableState {
  isAsc: boolean;
  isPM: boolean;
  weeklyDeathsProp: WeeklyDeathsProp;
  dailyDeathsProp: DailyDeathsProp;
  deathsProp: DeathsProp;
  sortProp: Props;
  orderedLocations: LocationData[];
}

interface TableStateAction extends TableState {
  type: "TOGGLE_SORT" | "CHANGE_PROP" | "TOGGLE_PM";
}

const togglePropPM = (prop: Props): Props => {
  if (prop.includes("PM")) return prop.replace("PM", "") as Props;
  return (prop + "PM") as Props;
};

const reducer = (state: TableState, action: TableStateAction): TableState => {
  switch (action.type) {
    case "TOGGLE_SORT": {
      const isAsc = !state.isAsc;
      const orderedLocations = orderByLatestDateProp(
        state.sortProp,
        state.orderedLocations,
        isAsc,
      );
      return {
        ...state,
        isAsc,
        orderedLocations,
      };
    }
    case "CHANGE_PROP": {
      const isAsc = false;
      const sortProp = action.sortProp;
      const orderedLocations = orderByLatestDateProp(
        sortProp,
        state.orderedLocations,
        isAsc,
      );
      return {
        ...state,
        isAsc,
        sortProp,
        orderedLocations,
      };
    }
    case "TOGGLE_PM": {
      const isPM = !state.isPM;
      const sortProp = togglePropPM(state.sortProp);
      const orderedLocations = orderByLatestDateProp(
        sortProp,
        state.orderedLocations,
        state.isAsc,
      );
      return {
        ...state,
        isPM,
        sortProp,
        orderedLocations,
        deathsProp: togglePropPM(state.deathsProp) as DeathsProp,
        dailyDeathsProp: togglePropPM(state.dailyDeathsProp) as DailyDeathsProp,
        weeklyDeathsProp: togglePropPM(
          state.weeklyDeathsProp,
        ) as WeeklyDeathsProp,
      };
    }
  }
};

const renderArrow = (state: TableState, currProp: string) => {
  if (state.sortProp === currProp) {
    if (state.isAsc)
      return <i className="fas fa-sort-up text-grey-500 mr-2"></i>;
    return <i className="fas fa-sort-down text-grey-500 mr-2"></i>;
  }
  return <i className="fas fa-sort text-grey-500 mr-2"></i>;
};

export default function TopFiveTable() {
  const { countries } = useStoreState((state) => state.data);
  const selectedCountryName = useStoreState(
    (state) => state.state.selectedCountryName,
  );
  const changeSelectedCountry = useStoreActions(
    (state) => state.state.changeSelectedCountry,
  );

  const initState: TableState = useMemo(() => {
    const isAsc = false;
    const isPM = false;
    const deathsProp = "deaths";
    const dailyDeathsProp = "dailyDeaths";
    const weeklyDeathsProp = "weeklyDeaths";
    const sortProp = weeklyDeathsProp;
    const orderedLocations = orderByLatestDateProp(
      sortProp,
      values(countries),
      isAsc,
    );
    return {
      isAsc,
      isPM,
      sortProp,
      orderedLocations,
      deathsProp,
      dailyDeathsProp,
      weeklyDeathsProp,
    };
  }, []);

  const [state, dispatch] = useReducer(reducer, initState);

  const toggleSort = (prop) => {
    state.sortProp === prop
      ? dispatch({ ...state, type: "TOGGLE_SORT" })
      : dispatch({
          ...state,
          type: "CHANGE_PROP",
          sortProp: prop,
        });
  };

  const togglePM = () => {
    dispatch({ ...state, type: "TOGGLE_PM" });
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative px-4">
            <h3 className="font-semibold text-base text-gray-800">
              At a Glance
            </h3>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-sm">
            <a
              href="#"
              className="text-small text-gray-600 hover:text-gray-800 no-underline"
              onClick={(e) => {
                e.preventDefault();
                togglePM();
              }}
            >
              {state.isPM ? (
                <i className="far fa-check-square mr-2" />
              ) : (
                <i className="far fa-square opacity-75 mr-2" />
              )}
              per million
            </a>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <button
              className="opacity-50 cursor-not-allowed bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
              type="button"
              style={{ transition: "all .15s ease" }}
            >
              See more
            </button>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        {/* Projects table */}
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Country
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-right">
                {renderArrow(state, state.deathsProp)}
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 no-underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSort(state.deathsProp);
                  }}
                >
                  Total Deaths
                </a>
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-right">
                {renderArrow(state, state.dailyDeathsProp)}
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 no-underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSort(state.dailyDeathsProp);
                  }}
                >
                  Latest Daily Deaths
                </a>
              </th>
              <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-right">
                {renderArrow(state, state.weeklyDeathsProp)}
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 no-underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSort(state.weeklyDeathsProp);
                  }}
                >
                  Latest Weekly Deaths
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {take(5, state.orderedLocations).map((location) => {
              const [lastDate, stats] = latestDate(location);
              return (
                <tr
                  key={location.country}
                  className={
                    selectedCountryName === location.country
                      ? "bg-gray-200 hover:bg-gray-100 cursor-pointer"
                      : "hover:bg-gray-100 cursor-pointer"
                  }
                  onClick={() => changeSelectedCountry(location.country)}
                >
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                    <div className="flex items-center">
                      <div className="flex-initial items-center mr-4">
                        <img
                          src={countryToFlagPath(location)}
                          alt={location.country}
                          className="w-4"
                        />
                      </div>
                      <div className="flex-1 w-40">{location.name}</div>
                    </div>
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
                    {numeral(stats[state.deathsProp]).format("0,0")}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
                    {numeral(stats[state.dailyDeathsProp]).format("0,0")}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
                    {numeral(stats[state.weeklyDeathsProp]).format("0,0")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
