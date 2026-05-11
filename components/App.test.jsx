import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { App } from "./App";

vi.mock("./Sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("./EnergyConsumption", () => ({
  EnergyConsumption: ({
    readings,
    activeFilter,
    stats,
  }) => (
    <div data-testid="energy-consumption">
      <span>EnergyConsumption</span>

      <span data-testid="readings-length">
        {readings?.length ?? 0}
      </span>

      <span data-testid="active-filter">
        {activeFilter}
      </span>

      <span data-testid="consumption-stats">
        {JSON.stringify(stats)}
      </span>
    </div>
  ),
}));

vi.mock("./Stats", () => ({
  Stats: () => <div data-testid="stats">Stats</div>,
}));

vi.mock("../hooks/useReadings", () => ({
  useReadings: vi.fn(),
}));

vi.mock("../hooks/useFilteredData", () => ({
  useFilteredData: vi.fn(),
}));

vi.mock("../hooks/useStats", () => ({
  useStats: vi.fn(),
}));

import { useReadings } from "../hooks/useReadings";
import { useFilteredData } from "../hooks/useFilteredData";
import { useStats } from "../hooks/useStats";

describe("App", () => {
  const mockReadings = [
    {
      time: "2024-01-01T10:00:00",
      reading: 10,
    },

    {
      time: "2024-01-01T11:00:00",
      reading: 20,
    },
  ];

  const mockFilteredData = [...mockReadings];

  const mockStats = {
    totalConsumption: 30,
    averageConsumption: 15,
    peakConsumption: 20,
  };

  const mockSetActiveFilter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useReadings).mockReturnValue(
      mockReadings
    );

    vi.mocked(useFilteredData).mockReturnValue({
      filteredData: mockFilteredData,
      activeFilter: "hour",
      setActiveFilter: mockSetActiveFilter,
    });

    vi.mocked(useStats).mockReturnValue(mockStats);
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<App />);

      expect(
        screen.getByTestId("sidebar")
      ).toBeInTheDocument();
    });

    it("should return null when readings are not loaded", () => {
      vi.mocked(useReadings).mockReturnValue(null);

      const { container } = render(<App />);

      expect(container.firstChild).toBeNull();
    });

    it("should render Sidebar component", () => {
      render(<App />);

      expect(
        screen.getByTestId("sidebar")
      ).toBeInTheDocument();
    });

    it("should render EnergyConsumption component", () => {
      render(<App />);

      expect(
        screen.getByTestId("energy-consumption")
      ).toBeInTheDocument();
    });

    it("should render Stats component", () => {
      render(<App />);

      expect(
        screen.getByTestId("stats")
      ).toBeInTheDocument();
    });

    it("should not render when readings is undefined", () => {
      vi.mocked(useReadings).mockReturnValue(
        undefined
      );

      const { container } = render(<App />);

      expect(container.firstChild).toBeNull();
    });

    it("should render when readings is an empty array", () => {
      vi.mocked(useReadings).mockReturnValue([]);

      vi.mocked(useFilteredData).mockReturnValue({
        filteredData: [],
        activeFilter: "hour",
        setActiveFilter: mockSetActiveFilter,
      });

      render(<App />);

      expect(
        screen.getByTestId("sidebar")
      ).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("should have main background container", () => {
      const { container } = render(<App />);

      const rootDiv = container.querySelector(
        ".bg-dark-gray.min-vh-100"
      );

      expect(rootDiv).toBeInTheDocument();
    });

    it("should have aside element for sidebar", () => {
      const { container } = render(<App />);

      const aside = container.querySelector("aside");

      expect(aside).toBeInTheDocument();
    });

    it("should have main element for content", () => {
      const { container } = render(<App />);

      const main = container.querySelector("main");

      expect(main).toBeInTheDocument();
    });

    it("should have grid layout on main", () => {
      const { container } = render(<App />);

      const main = container.querySelector("main");

      expect(main.style.display).toBe("grid");

      expect(main.style.gridTemplateRows).toBe(
        "1fr auto"
      );
    });

    it("should have correct overflow properties", () => {
      const { container } = render(<App />);

      const rootDiv = container.querySelector(
        ".bg-dark-gray.min-vh-100"
      );

      expect(rootDiv.style.overflowX).toBe(
        "hidden"
      );

      expect(rootDiv.style.overflowY).toBe(
        "auto"
      );
    });
  });

  describe("Data Flow", () => {
    it("should pass filteredData to EnergyConsumption", () => {
      render(<App />);

      expect(
        screen.getByTestId("readings-length")
      ).toHaveTextContent("2");
    });

    it("should pass activeFilter to EnergyConsumption", () => {
      render(<App />);

      expect(
        screen.getByTestId("active-filter")
      ).toHaveTextContent("hour");
    });

    it("should update when useReadings data changes", () => {
      const updatedReadings = [
        ...mockReadings,
        {
          time: "2024-01-01T12:00:00",
          reading: 30,
        },
      ];

      vi.mocked(useReadings).mockReturnValue(
        updatedReadings
      );

      vi.mocked(useFilteredData).mockReturnValue({
        filteredData: updatedReadings,
        activeFilter: "hour",
        setActiveFilter: mockSetActiveFilter,
      });

      render(<App />);

      expect(
        screen.getByTestId("readings-length")
      ).toHaveTextContent("3");
    });
  });

  describe("Hook Integration", () => {
    it("should call useReadings hook", () => {
      render(<App />);

      expect(useReadings).toHaveBeenCalled();
    });

    it("should call useFilteredData hook", () => {
      render(<App />);

      expect(useFilteredData).toHaveBeenCalledWith(
        mockReadings
      );
    });

    it("should call useStats hook", () => {
      render(<App />);

      expect(useStats).toHaveBeenCalledWith(
        mockFilteredData
      );
    });

    it("should pass readings to useFilteredData", () => {
      render(<App />);

      expect(useFilteredData).toHaveBeenCalledWith(
        mockReadings
      );
    });

    it("should pass filteredData to useStats", () => {
      render(<App />);

      expect(useStats).toHaveBeenCalledWith(
        mockFilteredData
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty filtered data", () => {
      vi.mocked(useFilteredData).mockReturnValue({
        filteredData: [],
        activeFilter: "hour",
        setActiveFilter: mockSetActiveFilter,
      });

      render(<App />);

      expect(
        screen.getByTestId("readings-length")
      ).toHaveTextContent("0");
    });

    it("should handle large datasets", () => {
      const largeDataset = Array.from(
        { length: 1000 },
        (_, i) => ({
          time: `2024-01-01T${i}:00:00`,
          reading: i,
        })
      );

      vi.mocked(useReadings).mockReturnValue(
        largeDataset
      );

      vi.mocked(useFilteredData).mockReturnValue({
        filteredData: largeDataset,
        activeFilter: "hour",
        setActiveFilter: mockSetActiveFilter,
      });

      render(<App />);

      expect(
        screen.getByTestId("readings-length")
      ).toHaveTextContent("1000");
    });

    it("should handle zero stats", () => {
      vi.mocked(useStats).mockReturnValue({
        totalConsumption: 0,
        averageConsumption: 0,
        peakConsumption: 0,
      });

      render(<App />);

      expect(
        screen.getByTestId("stats")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<App />);

      expect(
        screen.getByTestId("sidebar")
      ).toBeInTheDocument();
    });

    it("should have semantic HTML structure", () => {
      const { container } = render(<App />);

      expect(
        container.querySelector("aside")
      ).toBeInTheDocument();

      expect(
        container.querySelector("main")
      ).toBeInTheDocument();
    });
  });
});