const getReadings = (length = 8760) => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const hour = 1000 * 60 * 60;

  return [...new Array(length)].map((_, index) => ({
    time: oneYearAgo.getTime() + index * hour,
    value: Math.random() * 0.7 + 0.4,
  }));
};

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(getReadings());
}