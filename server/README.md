# Mock Energy API Server

This server simulates energy consumption and solar production data for the JOI Energy dashboard project.

The goal is not to provide perfectly accurate electrical engineering calculations, but to generate realistic and dynamic data patterns that behave similarly to a real smart-home energy system.

---

# How the simulation works

## Device Consumption

Each device contains a `baseUsage` value:

```js
{ name: "Air conditioner", baseUsage: 0.3093 }
```

This represents the average hourly energy usage of the device.

The values were chosen to roughly simulate realistic household devices:

| Device          | Approximate Usage             |
| --------------- | ----------------------------- |
| Air conditioner | High consumption              |
| Refrigerator    | Medium continuous consumption |
| Smart TV        | Medium consumption            |
| Wi-Fi router    | Very low constant consumption |

The final usage is dynamically adjusted during runtime.

---

# Dynamic Daily Usage Curve

The server simulates different energy usage levels throughout the day using a sine wave:

```js
const dayFactor =
  Math.sin((hour - 6) * Math.PI / 12) * 0.5 + 0.5;
```

This creates a natural daily cycle:

* lower consumption during the night
* increasing activity in the morning
* peak usage around midday
* decreasing activity in the evening

This makes charts and dashboard metrics feel more realistic than purely random values.

---

# Usage Variation

A small random variation is applied to each device:

```js
Math.random() * 0.3 + 0.85
```

This prevents the API from returning identical values on every request and simulates natural fluctuations in power usage.

---

# Solar Production Simulation

Solar generation follows another sine-based curve:

```js
const solarProduction =
  Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 5.8);
```

This creates realistic solar behavior:

* zero production during nighttime
* gradual increase after sunrise
* peak production near midday
* decreasing generation in the evening

---

# Energy Fed Back Into the Grid

The API also simulates homes with solar panels connected to the power grid.

When solar production exceeds current energy usage, the excess energy is returned to the grid:

```js
const fedIntoGrid =
  Math.max(0, solarProduction - currentUsage);
```

This mirrors how real residential solar systems work.

---

# Historical Readings

The `/readings` endpoint generates hourly readings for an entire year:

```js
getReadings(8760)
```

Since:

```txt
24 hours × 365 days = 8760 readings
```

Each reading contains:

```js
{
  time,
  value
}
```

These readings are intended for charts, analytics, and consumption history visualizations.

---

# Artificial Network Delay

The API intentionally adds a small delay before responding:

```js
await new Promise(resolve => setTimeout(resolve, 300));
```

This helps simulate real-world API behavior and allows the frontend to properly handle:

* loading states
* async requests
* skeletons/spinners
* error handling

---

# Why this approach?

The API was designed to provide:

* realistic dashboard behavior
* non-static charts
* dynamic frontend testing
* better UI demonstrations
* a more production-like development experience

without requiring a real smart-meter infrastructure or external energy APIs.
