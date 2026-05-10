import { Sidebar } from "./Sidebar";
import { EnergyConsumption } from "./EnergyConsumption";
import { Footer } from "./Footer";

import { useReadings } from "../hooks/useReadings";
import { useFilteredData } from "../hooks/useFilteredData";
import { useStats } from "../hooks/useStats";

export const App = () => {
  const readings = useReadings();

  if (!readings) {
    return null;
  }

  const { filteredData, activeFilter, setActiveFilter } =
    useFilteredData(readings);

  const stats = useStats(filteredData);

  return (
    <div
      className="bg-dark-gray min-vh-100"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <div className="mw9 center ph3">
        <div className="flex flex-column flex-row-l">
          <aside className="w-100 w-30-l pr4-l mb4 mb0-l">
            <Sidebar />
          </aside>

          <main
            className="w-100 w-70-l"
            style={{
              display: "grid",
              gridTemplateRows: "1fr auto",
            }}
          >
            <EnergyConsumption
              readings={filteredData}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              stats={stats}
            />

            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
};
