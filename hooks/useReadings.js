import { useState, useEffect } from "react";

export const useReadings = () => {
  const [readings, setReadings] = useState();

  useEffect(() => {
    fetch("http://localhost:3000/readings")
      .then((res) => res.json())
      .then(setReadings)
      // .catch(() => {});
      .catch((err) => console.log(err));
  }, []);

  return readings;
};
