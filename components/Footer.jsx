export const Footer = ({ totalConsumption, estimatedCost, footprint }) => {
  return (
    <section className="flex gap2">
      <div className="stat-card shadow-2 roundedMore p3 bg-white flex-auto">
        <p className="h6 grey mb1">Total Consumption</p>
        <h2 className="darkgray regular">
          {totalConsumption.toFixed(2)} <span className="h4">kWh</span>
        </h2>
      </div>
      <div className="stat-card shadow-2 roundedMore p3 bg-white flex-auto">
        <p className="h6 grey mb1">Estimated Cost</p>
        <h2 className="darkgray regular">
          $ {estimatedCost.toFixed(2)}
        </h2>
      </div>
      <div className="stat-card shadow-2 roundedMore p3 bg-white flex-auto">
        <p className="h6 grey mb1">Carbon Footprint</p>
        <h2 className="darkgray regular">
          {footprint.toFixed(2)} <span className="h4">kg CO₂</span>
        </h2>
      </div>
    </section>
  );
};