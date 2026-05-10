import { useCurrentData } from "../hooks/useCurrentData";

const DeviceSection = ({ title, usage }) => (
  <div className="shadow-2 roundedMore bg-super-light-grey mb1">
    <p className="darkgray pl2 pt1 pb1">{title}</p>
    <p className="h5 darkgray bold pl2 pb1 pt1 bg-very-light-grey">{usage}kW</p>
  </div>
);

const SummarySection = ({ summary, subtitle }) => (
  <>
    <h2 className="h2 greyBlue">{summary}</h2>
    <p className="darkgray mb2">{subtitle}</p>
  </>
);

export const Sidebar = () => {
  const data = useCurrentData();
  const { current, devices } = data;

  return (
    <>
      <SummarySection
        summary={`⚡️ ${current.currentUsage.toFixed(2)}kW`}
        subtitle="Power draw"
      />
      <SummarySection
        summary={`☀️️ ${current.solarProduction.toFixed(2)}kW`}
        subtitle="Solar power production"
      />
      <SummarySection
        summary={`🔌️ ${current.fedIntoGrid.toFixed(2)}kW`}
        subtitle="Fed into grid"
      />

      <section className="h5 darkgray mb2">
        <h4 className="h4 mb1">Your devices:</h4>
        {devices.map((device) => (
          <DeviceSection
            key={device.name}
            title={device.name}
            usage={device.usage.toFixed(4)}
          />
        ))}
      </section>
    </>
  );
};
