import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
const CACHE_TTL = 5000;

let cache = null;
let cacheTime = 0;

const fetchCurrentData = async () => {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) return cache;

  const res = await fetch("http://localhost:3000/data");
  cache = await res.json();
  cacheTime = now;
  return cache;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    current: { currentUsage: 0, solarProduction: 0, fedIntoGrid: 0 },
    devices: [],
  });

  useEffect(() => {
    fetchCurrentData().then(setData);
    const timer = setInterval(() => fetchCurrentData().then(setData), CACHE_TTL);
    return () => clearInterval(timer);
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useCurrentData = () => useContext(DataContext);
