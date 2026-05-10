import { useEffect } from "react";
import { renderChart } from "../utils/chart.js";

const filters = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export const EnergyConsumption = ({
  filteredData,
  activeFilter,
  setActiveFilter,
}) => {
  const containerId = "usageChart";

  useEffect(() => {
    if (filteredData.length) {
      renderChart(containerId, filteredData, activeFilter);
    }
  }, [filteredData]);

  return (
    <>
      <h1 className="regular darkgray line-height-1 mb3">Energy consumption</h1>
      <section className="mb3" style={{ display: "flex", gap: "0.5rem" }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`h5 inline-block shadow-2 pl2 pr2 pt1 pb1 roundedMore border-grey bold ${
              activeFilter === f.value ? "bg-blue white" : "bg-white darkgray"
            }`}
            style={{ cursor: "pointer" }}
          >
            {f.label}
          </button>
        ))}
      </section>
      <section className="chartHeight mb3">
        <canvas id={containerId} />
      </section>
    </>
  );
};
