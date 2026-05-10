const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const getReadings = (length = 8760) => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const hour = 1000 * 60 * 60;

  return [...new Array(length)].map((_, index) => ({
    time: oneYearAgo.getTime() + index * hour,
    value: Math.random() * 0.7 + 0.4,
  }));
};

app.get("/readings", async (_, res) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  res.json(getReadings());
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
