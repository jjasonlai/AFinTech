// import node module libraries
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import React from "react";
import { ApplicationChartOptions } from "./charData";

const ApexCharts = (props) => {
  // ** Props
  const { options, series, type } = props;
  return <Chart options={options} series={series} type={type} />;
};

// ** PropTypes
ApexCharts.propTypes = {
  options: PropTypes.instanceOf(ApplicationChartOptions).isRequired,
  series: PropTypes.isRequired,
  type: PropTypes.string.isRequired,
};

// ** Default Props
ApexCharts.defaultProps = {
  type: "line",
};

export default ApexCharts;
