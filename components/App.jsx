import { Sidebar } from "./Sidebar.jsx";
import { EnergyConsumption } from "./EnergyConsumption.jsx";
import { Footer } from "./Footer.jsx";
import { useReadings } from "../hooks/useReadings";
import { useFilteredData } from "../hooks/useFilteredData";
import { useStats } from "../hooks/useStats";

export const App = () => {
  const { readings } = useReadings();
  const { filteredData, activeFilter, setActiveFilter } = useFilteredData(readings);
  const { totalConsumption, estimatedCost, footprint } = useStats(filteredData);

  if (!readings) return null;

  return (
    <div className="background shadow-2 flex overflow-hidden">
      <aside className="p3 menuWidth overflow-auto">
        <Sidebar />
      </aside>
      <main
        className="bg-very-light-grey flex-auto overflow-auto"
        style={{ display: "grid", gridTemplateRows: "1fr auto", gap: "1rem", padding: "2rem" }}
      >
        <EnergyConsumption
          filteredData={filteredData}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <Footer
          totalConsumption={totalConsumption}
          estimatedCost={estimatedCost}
          footprint={footprint}
        />
      </main>
    </div>
  );
};