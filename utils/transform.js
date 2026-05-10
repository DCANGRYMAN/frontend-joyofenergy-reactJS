const toArray = (readings) => (Array.isArray(readings) ? readings : []);

export const groupByHour = (readings) => {
  const grouped = toArray(readings).reduce((curr, { time, value }) => {
    const date = new Date(time);
    const hour = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours()
    ).getTime();
    if (!curr[hour]) curr[hour] = 0;
    curr[hour] += value;
    return curr;
  }, {});

  return Object.entries(grouped).map(([hour, value]) => ({
    time: Number(hour),
    value,
  }));
};

export const groupByDay = (readings) => {
  const grouped = toArray(readings).reduce((curr, { time, value }) => {
    const date = new Date(time);
    const day = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    if (!curr[day]) curr[day] = 0;
    curr[day] += value;
    return curr;
  }, {});

  return Object.entries(grouped).map(([day, value]) => ({
    time: Number(day),
    value,
  }));
};

export const groupByMonth = (readings) => {
  const grouped = toArray(readings).reduce((curr, { time, value }) => {
    const date = new Date(time);
    const month = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getTime();
    if (!curr[month]) curr[month] = 0;
    curr[month] += value;
    return curr;
  }, {});

  return Object.entries(grouped).map(([month, value]) => ({
    time: Number(month),
    value,
  }));
};

export const sortByTime = (readings) => {
  return [...toArray(readings)].sort(
    (readingA, readingB) => readingA.time - readingB.time
  );
};