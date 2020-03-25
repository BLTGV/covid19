import React from "react";
import App from "next/app";
import Head from "next/head";

import "../src/argon/assets/plugins/nucleo/css/nucleo.css";
import "../src/argon/assets/scss/argon-dashboard-react.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    // const jssStyles = document.querySelector("#jss-server-side");
    // if (jssStyles) {
    //   jssStyles.parentElement.removeChild(jssStyles);
    // }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Corona Tracker</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </React.Fragment>
    );
  }
}
