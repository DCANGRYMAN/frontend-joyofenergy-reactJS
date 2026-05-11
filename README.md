# Introducing JOI Energy

JOI Energy is a new start-up in the energy industry. They provide their customers with smart meters that record their
energy usage, enabling them to save both money and the environment. The smart meters also record the energy that
a customer feeds back into the power grid via solar panels installed on their property.

You have been placed into the development team, whose current goal is to build a dashboard which will display the information gathered from the smart meters.

Unfortunately, two members of the team are on annual leave, and another one has called in sick! You are left with
another ThoughtWorker to progress with the current user stories. This is your chance to make an impact on the business, improve the code base and deliver value.

## Requirements

The project requires [Node v20](https://nodejs.org/en/download/) or higher.

### Styling

The application uses a "utility" CSS pattern from [BassCSS](https://basscss.com/).

### Run the application

```console
$ npm start
```

The application will launch at `http://localhost:5173`.

### Run the tests

```console
$ npm test
```

## Architecture Improvements

### Overview
Refactored React application to consolidate state management and eliminate duplicate logic. Implemented a stats footer with Total Consumption, Estimated Cost, and Carbon Footprint displays matching the Angular version.

### Key Changes

#### 1. Custom Hook: useReadings
Single source of truth for all energy data and calculations.
Centralizes data fetching, filter state, chart rendering, and derived calculations.
Replaces scattered useEffect calls that previously existed across multiple components.
Exposes: readings, filteredData, activeFilter, setActiveFilter, totalConsumption, estimatedCost, footprint.

#### 2. Stats Component
New Stats.jsx with three stat cards:
- Total Consumption: sum of energy values across filtered days (kWh)
- Estimated Cost: calculated as totalConsumption multiplied by 0.85 (USD)
- Carbon Footprint: calculated as totalConsumption multiplied by 0.233 (kg CO2, UK average intensity)
Matches Angular layout using Basscss utility classes.

#### 3. EnergyConsumption Component
Removed internal data transformation logic (groupByDay/sortByTime).
Now receives pre-filtered data directly from useReadings hook.
Filter buttons (Daily, Weekly, Monthly) are fully dynamic and reactive.
Chart updates automatically when filter or data changes.

#### 4. Layout Refactoring (App.jsx)
Replaced two separate article columns with single main element using CSS Grid.
Footer stats positioned below chart with consistent spacing (1rem gap).
Removed Cost, Consumption, and Footprint components.
Stats now consolidated into single Footer component.

#### 5. Architecture Pattern
useReadings hook serves same purpose as ApiService in Angular version.
Single place for state, side effects, and data calculations.
Components are now thin presentational layers that receive all data as props.
No component performs its own data fetching or calculations.