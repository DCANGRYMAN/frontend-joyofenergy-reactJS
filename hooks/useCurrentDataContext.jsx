import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({
  current: {
    currentUsage: 0,
    solarProduction: 0,
    fedIntoGrid: 0,
  },
  devices: [],
});

const CACHE_TTL = 5000;

let cache = null;
let cacheTime = 0;

const defaultData = {
  current: {
    currentUsage: 0,
    solarProduction: 0,
    fedIntoGrid: 0,
  },
  devices: [],
  readings: []
};

const fetchCurrentData = async () => {
  try {
    const now = Date.now();

    if (cache && now - cacheTime < CACHE_TTL) {
      return cache;
    }

    const res = await fetch("http://localhost:3000/data");

    if (!res || !res.ok) {
      return defaultData;
    }

    const json = await res.json();

    cache = json || defaultData;
    cacheTime = now;

    return cache;
  } catch (error) {
    console.error("Failed to fetch current data:", error);
    return defaultData;
  }
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const result = await fetchCurrentData();

      if (mounted) {
        setData(result);
      }
    };

    loadData();

    const timer = setInterval(loadData, CACHE_TTL);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export const useCurrentData = () => useContext(DataContext);