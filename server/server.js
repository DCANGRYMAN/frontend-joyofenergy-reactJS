const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const devices = [
  { name: "Air conditioner", baseUsage: 0.3093 },
  { name: "Wi-Fi router", baseUsage: 0.0033 },
  { name: "Humidifer", baseUsage: 0.0518 },
  { name: "Smart TV", baseUsage: 0.1276 },
  { name: "Diffuser", baseUsage: 0.0078 },
  { name: "Refrigerator", baseUsage: 0.0923 },
];

const getReadings = (length = 8760) => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const hour = 1000 * 60 * 60;

  return [...new Array(length)].map((_, index) => ({
    time: oneYearAgo.getTime() + index * hour,
    value: Math.random() * 0.7 + 0.4,
  }));
};

const getCurrentData = () => {
  const now = new Date();
  const hour = now.getHours();
  const dayFactor = Math.sin((hour - 6) * Math.PI / 12) * 0.5 + 0.5;
  const currentUsage = devices.reduce((total, device) => {
    const variation = Math.random() * 0.3 + 0.85;
    return total + (device.baseUsage * variation * dayFactor);
  }, 0);

  const solarProduction = Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 5.8);
  const fedIntoGrid = Math.max(0, solarProduction - currentUsage);

  return {
    currentUsage: parseFloat(currentUsage.toFixed(4)),
    solarProduction: parseFloat(solarProduction.toFixed(4)),
    fedIntoGrid: parseFloat(fedIntoGrid.toFixed(4)),
  };
};

const getDevicesData = () => {
  const now = new Date();
  const hour = now.getHours();
  const dayFactor = Math.sin((hour - 6) * Math.PI / 12) * 0.5 + 0.5;

  return devices.map((device) => ({
    name: device.name,
    usage: parseFloat((device.baseUsage * (Math.random() * 0.3 + 0.85) * dayFactor).toFixed(4)),
  }));
};

app.get("/readings", async (_, res) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  res.json(getReadings());
});

app.get("/data", async (_, res) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const current = getCurrentData();
  const devicesData = getDevicesData();

  res.json({
    current,
    devices: devicesData,
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
