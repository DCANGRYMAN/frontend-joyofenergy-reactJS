import { useMemo } from "react";

export const useStats = (filteredData) => {
  const totalConsumption = useMemo(
    () => filteredData.reduce((sum, r) => sum + r.value, 0),
    [filteredData]
  );

  const estimatedCost = useMemo(
    () => totalConsumption * 0.85,
    [totalConsumption]
  );

  const footprint = useMemo(
    () => totalConsumption * 0.233,
    [totalConsumption]
  );

  const averageDailyConsumption = useMemo(
    () => (filteredData.length ? totalConsumption / filteredData.length : 0),
    [filteredData, totalConsumption]
  );

  return { totalConsumption, estimatedCost, footprint, averageDailyConsumption };
};