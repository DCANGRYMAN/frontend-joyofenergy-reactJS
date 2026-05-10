import * as chartJs from "chart.js";

let chart;

export const formatDateLabel = (timestamp, filter = "monthly") => {
  const date = new Date(timestamp);
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const year = date.getFullYear();

  const pad = (v) => (v < 10 ? `0${v}` : `${v}`);

  if (filter === "daily")  return `${pad(hour)}:00`;
  if (filter === "yearly") return `${pad(month + 1)}/${year}`;
  return `${pad(day)}/${pad(month + 1)}`;
};

export const renderChart = (containerId, readings, filter = "monthly") => {
  chartJs.Chart.defaults.font.size = "10px";

  chartJs.Chart.register.apply(
    null,
    Object.values(chartJs).filter((chartClass) => chartClass.id)
  );

  const labels = readings.map(({ time }) => formatDateLabel(time, filter));
  const values = readings.map(({ value }) => value);

  const data = {
    labels,
    datasets: [
      {
        label: "kWh usage",
        data: values,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        borderWidth: 0.2,
        backgroundColor: "#5A8EDA",
        borderRadius: 10,
      },
    ],
  };

  if (chart) chart.destroy();

  chart = new chartJs.Chart(containerId, {
    type: "bar",
    data,
    options: {
      scales: {
        y: { grid: { display: false } },
        x: { grid: { display: false } },
      },
      plugins: { legend: { display: false } },
      maintainAspectRatio: false,
    },
  });
};