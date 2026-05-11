import { useEffect } from "react";
import { renderChart } from "../utils/chart.js";

const filters = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export const EnergyConsumption = ({ filteredData, activeFilter, setActiveFilter }) => {
  const containerId = "usageChart";

  useEffect(() => {
    if (filteredData.length) {
      renderChart(containerId, filteredData, activeFilter);
    }
  }, [filteredData, activeFilter]);

  return (
    <>
      <h1 className="regular darkgray line-height-1 mb3">Energy consumption</h1>
      <section className="filter-bar mb3">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`h5 inline-block shadow-2 pl2 pr2 pt1 pb1 roundedMore border-grey bold ${
              activeFilter === f.value ? "bg-blue white" : "bg-white darkgray"
            }`}
          >
            {f.label}
          </button>
        ))}
      </section>
      <section className="chart-wrapper mb3">
        <canvas id={containerId} />
      </section>
    </>
  );
};