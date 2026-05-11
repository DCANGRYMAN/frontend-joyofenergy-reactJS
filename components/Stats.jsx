const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const Stats = ({ totalConsumption, estimatedCost, footprint }) => {
  const formatValue = (value) => {
    if (isNaN(value)) return "NaN";
    if (!isFinite(value)) return value > 0 ? "Infinity" : "-Infinity";
    return round(value).toFixed(2);
  };

  return (
    <section className="flex gap2 footer-cards">
      <div className="stat-card shadow-2 roundedMore p3 bg-white flex-auto">
        <p className="h6 grey mb1">Total Consumption</p>
        <h2 className="darkgray regular">
          {formatValue(totalConsumption)} <span className="h4">kWh</span>
        </h2>
      </div>
      <div className="stat-card shadow-2 roundedMore p3 bg-white flex-auto">
        <p className="h6 grey mb1">Estimated Cost</p>
        <h2 className="darkgray regular">
          $ {formatValue(estimatedCost)}
        </h2>
      </div>
      <div className="stat-card shadow-2 roundedMore p3 bg-white flex-auto">
        <p className="h6 grey mb1">Carbon Footprint</p>
        <h2 className="darkgray regular">
          {formatValue(footprint)} <span className="h4">kg CO₂</span>
        </h2>
      </div>
    </section>
  );
};