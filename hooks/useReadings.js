import { useState, useEffect } from "react";

export const useReadings = () => {
  const [readings, setReadings] = useState();

  useEffect(() => {
    fetch("http://localhost:3000/readings")
      .then((res) => res.json())
      .then(setReadings);
  }, []);

  return { readings };
};