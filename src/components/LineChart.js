import React, { useRef } from "react";
import Chart from "chart.js";
import { useStoreState } from "../store";
import { keys, values, isNil, dropWhile } from "ramda";
import { countryToFlagPath } from "../data/maps";

export default function LineChart() {
  const country = useStoreState((state) => state.state.selectedCountry);
  const chartContainer = useRef(null);

  const flagPath = countryToFlagPath(country);

  const dates = dropWhile(
    (k) =>
      isNil(country.dates[k].dailyDeaths) || country.dates[k].dailyDeaths === 0,
    keys(country.dates).sort(),
  );
  const items = dates.map((k) => country.dates[k]);

  const seriesDD = items.map((v) => v.dailyDeaths);
  const seriesD7 = items.map((v) => v.dd7ma);

  React.useEffect(() => {
    const config = {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Daily Deaths",
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: seriesDD,
            fill: false,
          },
          {
            label: "Daily Deaths, 7-Day Moving Average",
            fill: false,
            backgroundColor: "#ed64a6",
            borderColor: "#ed64a6",
            data: seriesD7,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Sales Charts",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
                fontColor: "white",
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
                fontColor: "white",
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    // const ctx = document.getElementById("line-chart").getContext("2d");
    const chart = new Chart(chartContainer.current, config);
    return () => {
      chart.destroy();
    };
  }, [dates, seriesD7, seriesDD]);
  return (
    <>
      <div className="w-full xl:w-12/12 mb-12 xl:mb-0 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-gray-900">
          <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full max-w-full flex-grow flex-1">
                <h6 className="uppercase text-gray-200 mb-1 text-xs font-semibold">
                  Daily Deaths
                </h6>
                <h2 className="text-white text-xl font-semibold">
                  {country.country}
                </h2>
              </div>
              <img className="w-16" src={flagPath} />
            </div>
          </div>
          <div className="p-4 flex-auto">
            {/* Chart */}
            <div className="relative" style={{ height: "350px" }}>
              {/* <canvas id="line-chart"></canvas> */}
              <canvas ref={chartContainer}></canvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
