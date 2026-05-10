import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { App } from "./App";

// Mock hooks
vi.mock("../hooks/useReadings", () => ({
  useReadings: vi.fn(),
}));

vi.mock("../hooks/useFilteredData", () => ({
  useFilteredData: vi.fn(),
}));

vi.mock("../hooks/useStats", () => ({
  useStats: vi.fn(),
}));

vi.mock("../utils/chart.js");

import { useReadings } from "../hooks/useReadings";
import { useFilteredData } from "../hooks/useFilteredData";
import { useStats } from "../hooks/useStats";

describe("App", () => {
  const mockReadings = [
    { time: 1000, value: 10 },
    { time: 2000, value: 20 },
  ];

  const mockFilteredData = [
    { time: 1000, value: 10 },
    { time: 2000, value: 20 },
  ];

  const mockStats = {
    totalConsumption: 100.5,
    estimatedCost: 15.5,
    footprint: 25.8,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useReadings).mockReturnValue({ readings: mockReadings });
    vi.mocked(useFilteredData).mockReturnValue({
      filteredData: mockFilteredData,
      activeFilter: "monthly",
      setActiveFilter: vi.fn(),
    });
    vi.mocked(useStats).mockReturnValue(mockStats);
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });

    it("should return null when readings are not loaded", () => {
      vi.mocked(useReadings).mockReturnValue({ readings: null });
      const { container } = render(<App />);
      expect(container.firstChild).toBeNull();
    });

    it("should render Sidebar component", () => {
      render(<App />);
      expect(screen.getByText("Your devices:")).toBeInTheDocument();
    });

    it("should render EnergyConsumption component", () => {
      render(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });

    it("should render Footer component", () => {
      render(<App />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Energy consumption");
    });

    it("should not render when readings is undefined", () => {
      vi.mocked(useReadings).mockReturnValue({ readings: undefined });
      const { container } = render(<App />);
      expect(container.firstChild).toBeNull();
    });

    it("should render when readings is an empty array", () => {
      vi.mocked(useReadings).mockReturnValue({ readings: [] });
      render(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("should have main background container", () => {
      const { container } = render(<App />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass("background", "shadow-2", "flex");
    });

    it("should have aside element for sidebar", () => {
      const { container } = render(<App />);
      const aside = container.querySelector("aside");
      expect(aside).toHaveClass("p3", "menuWidth", "overflow-auto");
    });

    it("should have main element for content", () => {
      const { container } = render(<App />);
      const main = container.querySelector("main");
      expect(main).toHaveClass("bg-very-light-grey", "flex-auto", "overflow-auto");
    });

    it("should have grid layout on main", () => {
      const { container } = render(<App />);
      const main = container.querySelector("main");
      const style = main?.getAttribute("style");
      expect(style).toContain("display: grid");
      expect(style).toContain("gridTemplateRows: 1fr auto");
    });

    it("should have correct overflow properties", () => {
      const { container } = render(<App />);
      expect(container.firstChild).toHaveClass("overflow-hidden");
    });
  });

  describe("Data Flow", () => {
    it("should pass filteredData to EnergyConsumption", () => {
      render(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });

    it("should pass activeFilter to EnergyConsumption", () => {
      const mockSetActiveFilter = vi.fn();
      vi.mocked(useFilteredData).mockReturnValue({
        filteredData: mockFilteredData,
        activeFilter: "daily",
        setActiveFilter: mockSetActiveFilter,
      });
      render(<App />);
      const dailyButton = screen.getByText("Daily").closest("button");
      expect(dailyButton).toHaveClass("bg-blue");
    });

    it("should update when useReadings data changes", () => {
      const { rerender } = render(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();

      vi.mocked(useReadings).mockReturnValue({
        readings: [
          { time: 3000, value: 30 },
          { time: 4000, value: 40 },
        ],
      });

      rerender(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });
  });

  describe("Hook Integration", () => {
    it("should call useReadings hook", () => {
      render(<App />);
      expect(useReadings).toHaveBeenCalled();
    });

    it("should call useFilteredData hook", () => {
      render(<App />);
      expect(useFilteredData).toHaveBeenCalled();
    });

    it("should call useStats hook", () => {
      render(<App />);
      expect(useStats).toHaveBeenCalled();
    });

    it("should pass readings to useFilteredData", () => {
      render(<App />);
      expect(useFilteredData).toHaveBeenCalledWith(mockReadings);
    });

    it("should pass filteredData to useStats", () => {
      render(<App />);
      expect(useStats).toHaveBeenCalledWith(mockFilteredData);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty filtered data", () => {
      vi.mocked(useFilteredData).mockReturnValue({
        filteredData: [],
        activeFilter: "monthly",
        setActiveFilter: vi.fn(),
      });

      render(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });

    it("should handle large datasets", () => {
      const largeReadings = Array.from({ length: 1000 }, (_, i) => ({
        time: i * 1000,
        value: Math.random() * 100,
      }));

      vi.mocked(useReadings).mockReturnValue({ readings: largeReadings });
      vi.mocked(useFilteredData).mockReturnValue({
        filteredData: largeReadings,
        activeFilter: "monthly",
        setActiveFilter: vi.fn(),
      });

      render(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });

    it("should handle all filter types", () => {
      render(<App />);

      const filters = ["Daily", "Weekly", "Monthly", "Yearly"];
      filters.forEach((filter) => {
        expect(screen.getByText(filter)).toBeInTheDocument();
      });
    });

    it("should handle zero stats", () => {
      vi.mocked(useStats).mockReturnValue({
        totalConsumption: 0,
        estimatedCost: 0,
        footprint: 0,
      });

      render(<App />);
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<App />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Energy consumption");
    });

    it("should have semantic HTML structure", () => {
      const { container } = render(<App />);
      expect(container.querySelector("aside")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it("should have all required CSS classes on root div", () => {
      const { container } = render(<App />);
      const rootDiv = container.firstChild;
      expect(rootDiv).toHaveClass("background");
      expect(rootDiv).toHaveClass("shadow-2");
      expect(rootDiv).toHaveClass("flex");
    });

    it("should have all required CSS classes on main content area", () => {
      const { container } = render(<App />);
      const main = container.querySelector("main");
      expect(main).toHaveClass("bg-very-light-grey");
      expect(main).toHaveClass("flex-auto");
      expect(main).toHaveClass("overflow-auto");
    });
  });
});
