import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext(null);

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
  readings: [],
};

const fetchCurrentData = async () => {
  const now = Date.now();

  if (cache && now - cacheTime < CACHE_TTL) {
    return cache;
  }

  const res = await fetch("http://localhost:3000/data");

  if (!res.ok) throw new Error("Failed to fetch");

  const json = await res.json();

  cache = json || defaultData;
  cacheTime = now;

  return cache;
};

const ErrorScreen = ({ onRetry }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "1rem",
    color: "#ccc",
  }}>
    <p style={{ fontSize: "1.2rem", color: "black" }}>
      Could not load energy data.
    </p>
    <button
      onClick={onRetry}
      style={{
        padding: "0.5rem 1.5rem",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#5A8EDA",
        color: "white",
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      Try again
    </button>
  </div>
);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(false);

  const loadData = async (mounted = true) => {
    try {
      setError(false);
      const result = await fetchCurrentData();
      if (mounted) setData(result);
    } catch (err) {
      console.error("Failed to fetch current data:", err);
      if (mounted) setError(true);
    }
  };

  useEffect(() => {
    let mounted = true;

    loadData(mounted);

    const timer = setInterval(() => loadData(mounted), CACHE_TTL);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  if (error) {
    return (
      <ErrorScreen
        onRetry={() => {
          cache = null;
          loadData();
        }}
      />
    );
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export const useCurrentData = () => useContext(DataContext);