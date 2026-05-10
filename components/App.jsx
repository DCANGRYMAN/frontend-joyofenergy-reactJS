import { Sidebar } from "./Sidebar";
import { EnergyConsumption } from "./EnergyConsumption";
import { Footer } from "./Footer";

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
    <div className="app-root">
      <div className="app-container">
        <aside className="app-sidebar">
          <Sidebar />
        </aside>
        <main className="app-main">
          <EnergyConsumption
            filteredData={filteredData}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <Footer
            totalConsumption={stats.totalConsumption}
            estimatedCost={stats.estimatedCost}
            footprint={stats.footprint}
          />
        </main>
      </div>
    </div>
  );
};