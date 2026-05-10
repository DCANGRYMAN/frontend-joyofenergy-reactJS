import { useState, useEffect } from "react";

export const useReadings = () => {
  const [readings, setReadings] = useState();

  useEffect(() => {
    fetch("/api/readings")
      .then((res) => res.json())
      .then(setReadings);
  }, []);

  return readings;
};