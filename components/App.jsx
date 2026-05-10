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
    <div
      className="bg-dark-gray min-vh-100"
      style={{ overflowX: "hidden", overflowY: "auto" }}
    >
      <div className="mw9 center ph3">
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside style={{ width: "20%", flexShrink: 0 }}>
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
    </div>
  );
};