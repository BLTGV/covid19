import React, { useEffect, useMemo } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { StoreProvider, Store, EasyPeasyConfig } from "easy-peasy";
import { NextPageContext } from "next";

import createStore from "../src/store";
import model, { StoreModel } from "../src/model";
import { CsseCovid19TimeSeriesRow } from "../src/types/data/source";
import { generateData } from "../src/data";

import "../styles/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { LocationData, LocationDataMap } from "../src/types/data/series";

interface CustomAppProps extends AppProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: any;
  countries: {
    countries: LocationDataMap;
    [summaries: string]: any;
  };
}

export default function CustomApp(props: CustomAppProps) {
  const { Component, pageProps, countries } = props;

  const store = useMemo(() => {
    const worst: {
      country: string;
      deaths: any;
    } = countries.byWeeklyDeathsDESC[0];
    return createStore({
      ...model,
      state: { ...model.state, selectedCountryName: worst.country },
      data: { ...model.data, countries: countries.countries },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cs = store.getState().data.countries;

  useEffect(() => {
    console.log("initial load debug: ", countries);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Covid-19 Supplimental Presentation</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StoreProvider store={store}>
        <Component {...pageProps} />
      </StoreProvider>
    </React.Fragment>
  );
}

/**
 * This function is used only becuase this application is designed to run via static export via `next export`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
CustomApp.getInitialProps = async (context: NextPageContext) => {
  const generated = await generateData();
  return generated;
};
