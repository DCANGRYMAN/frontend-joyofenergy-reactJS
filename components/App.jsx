import { Sidebar } from "./Sidebar";
import { EnergyConsumption } from "./EnergyConsumption";
import { Stats } from "./Stats";

import { useReadings } from "../hooks/useReadings";
import { useFilteredData } from "../hooks/useFilteredData";
import { useStats } from "../hooks/useStats";

export const App = () => {
  const readings = useReadings();

  const { filteredData, activeFilter, setActiveFilter } =
    useFilteredData(readings);

  const stats = useStats(filteredData);

  if (!readings) {
    return null;
  }

  return (
    <div
      className="bg-dark-gray min-vh-100"
      style={{ overflowX: "hidden", overflowY: "auto" }}
    >
      <div className="app-container">
        <aside className="app-sidebar">
          <Sidebar />
        </aside>
        <main
          style={{
            width: "80%",
            display: "grid",
            gridTemplateRows: "1fr auto",
          }}
        >
          <EnergyConsumption
            readings={filteredData}
            filteredData={filteredData}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            stats={stats}
          />
          <Stats
            totalConsumption={stats.totalConsumption}
            estimatedCost={stats.estimatedCost}
            footprint={stats.footprint}
          />
        </main>
      </div>
    </div>
  );
};