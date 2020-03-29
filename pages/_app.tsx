import React, { useEffect } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { StoreProvider } from "easy-peasy";
import { NextPageContext } from "next";

import "../src/argon/assets/plugins/nucleo/css/nucleo.css";
import "../src/argon/assets/scss/argon-dashboard-react.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

import store from "../src/store";
import { CsseCovid19TimeSeriesRow } from "../src/types/data/source";
import { generateData } from "../src/data";

interface CustomAppProps extends AppProps {
  raw: CsseCovid19TimeSeriesRow[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: any;
}

export default function CustomApp(props: CustomAppProps) {
  const { Component, pageProps, raw, debug } = props;
  useEffect(() => {
    console.log("initial load debug: ", debug);

    // Can't use hooks because store context is not yet initialized
    store.getActions().data.loadRaw(raw);
    store.getActions().data.loadDebug(debug);
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
