import { useState, useEffect, useMemo } from "react";
import { getReadings, groupByDay, sortByTime } from "../utils/reading";
import { renderChart } from "../utils/chart";

export const useReadings = () => {
  const [readings, setReadings] = useState();
  const [activeFilter, setActiveFilter] = useState("monthly");

  const sliceMap = { daily: 1, weekly: 7, monthly: 30 };

  const filteredData = useMemo(() => {
    if (!readings) return [];
    return sortByTime(groupByDay(readings)).slice(-sliceMap[activeFilter]);
  }, [readings, activeFilter]);

  useEffect(() => {
    getReadings().then(setReadings);
  }, []);

  useEffect(() => {
    if (filteredData.length) {
      renderChart("usageChart", filteredData);
    }
  }, [filteredData]);

  const totalConsumption = useMemo(
    () => filteredData.reduce((sum, r) => sum + r.value, 0),
    [filteredData],
  );

  const estimatedCost = useMemo(
    () => totalConsumption * 0.85,
    [totalConsumption],
  );

  const carbonIntensity = 0.233;
  const footprint = useMemo(
    () => totalConsumption * carbonIntensity,
    [totalConsumption],
  );

  const averageDailyConsumption = useMemo(
    () => (filteredData.length ? totalConsumption / filteredData.length : 0),
    [filteredData, totalConsumption],
  );

  return {
    readings,
    filteredData,
    activeFilter,
    setActiveFilter,
    totalConsumption,
    estimatedCost,
    footprint,
    averageDailyConsumption,
  };
};
