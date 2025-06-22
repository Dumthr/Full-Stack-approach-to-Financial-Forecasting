import React from "react";
import { SimpleBarChart } from "@carbon/charts-react";

export const BarChart = ({ data }) => {
  const options = {
    axes: {
      left: {
        mapsTo: "value",
        title: "Forecasted Value",
      },
      bottom: {
        mapsTo: "group",
        scaleType: "labels",
        title: "Group ID",
      },
    },
    title: "Prediction History",
    resizable: true,
    height: "400px",
  };

  return <SimpleBarChart data={data} options={options} />;
};

export default BarChart;
