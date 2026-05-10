import { useMemo, useState } from "react";
import { groupByHour, groupByDay, groupByMonth, sortByTime } from "../utils/transform";

const groupMap = {
  daily:   (r) => sortByTime(groupByHour(r)).slice(-24),
  weekly:  (r) => sortByTime(groupByDay(r)).slice(-7),
  monthly: (r) => sortByTime(groupByDay(r)).slice(-30),
  yearly:  (r) => sortByTime(groupByMonth(r)),
};

export const useFilteredData = (readings) => {
  const [activeFilter, setActiveFilter] = useState("monthly");

  const filteredData = useMemo(() => {
    if (!readings) return [];
    return groupMap[activeFilter](readings);
  }, [readings, activeFilter]);

  return { filteredData, activeFilter, setActiveFilter };
};