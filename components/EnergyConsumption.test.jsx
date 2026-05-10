import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { EnergyConsumption } from "./EnergyConsumption";

vi.mock("../utils/chart.js", () => ({
  renderChart: vi.fn(),
}));

import { renderChart } from "../utils/chart.js";

describe("EnergyConsumption", () => {
  const mockSetActiveFilter = vi.fn();

  const mockFilteredData = [
    { time: 1000, value: 10 },
    { time: 2000, value: 20 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the title", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      expect(
        screen.getByText("Energy consumption")
      ).toBeInTheDocument();
    });

    it("should render all filter buttons", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      expect(
        screen.getByText("Daily")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Weekly")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Monthly")
      ).toBeInTheDocument();

    });

    it("should render canvas element with correct id", () => {
      const { container } = render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      const canvas =
        container.querySelector("#usageChart");

      expect(canvas).toBeInTheDocument();

      expect(canvas?.tagName).toBe("CANVAS");
    });
  });

  describe("Active Filter Styling", () => {
    it("should highlight Daily filter when active", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="daily"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      const dailyButton =
        screen.getByText("Daily").closest(
          "button"
        );

      expect(dailyButton).toHaveClass(
        "bg-blue"
      );

      expect(dailyButton).toHaveClass(
        "white"
      );
    });

    it("should style inactive filters correctly", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="daily"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      const monthlyButton =
        screen.getByText("Monthly").closest(
          "button"
        );

      expect(monthlyButton).toHaveClass(
        "bg-white"
      );

      expect(monthlyButton).toHaveClass(
        "darkgray"
      );
    });
  });

  describe("Filter Button Clicks", () => {
    it("should call setActiveFilter with daily", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      fireEvent.click(
        screen.getByText("Daily")
      );

      expect(
        mockSetActiveFilter
      ).toHaveBeenCalledWith("daily");
    });

    it("should call setActiveFilter with weekly", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      fireEvent.click(
        screen.getByText("Weekly")
      );

      expect(
        mockSetActiveFilter
      ).toHaveBeenCalledWith("weekly");
    });

    it("should call setActiveFilter with monthly", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="daily"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      fireEvent.click(
        screen.getByText("Monthly")
      );

      expect(
        mockSetActiveFilter
      ).toHaveBeenCalledWith("monthly");
    });

  });

  describe("Chart Rendering", () => {
    it("should call renderChart when filteredData is not empty", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      expect(renderChart).toHaveBeenCalledWith(
        "usageChart",
        mockFilteredData,
        "monthly"
      );
    });

    it("should not call renderChart when filteredData is empty", () => {
      render(
        <EnergyConsumption
          filteredData={[]}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      expect(renderChart).not.toHaveBeenCalled();
    });

    it("should re-render chart when filteredData changes", () => {
      const newFilteredData = [
        { time: 3000, value: 30 },
        { time: 4000, value: 40 },
      ];

      const { rerender } = render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      vi.clearAllMocks();

      rerender(
        <EnergyConsumption
          filteredData={newFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      expect(renderChart).toHaveBeenCalledWith(
        "usageChart",
        newFilteredData,
        "monthly"
      );
    });
  });

  describe("CSS Classes", () => {
    it("should have correct CSS classes on buttons", () => {
      const { container } = render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      const buttons =
        container.querySelectorAll("button");

      buttons.forEach((button) => {
        expect(button).toHaveClass(
          "h5",
          "inline-block",
          "shadow-2"
        );
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle large dataset", () => {
      const largeDataset = Array.from(
        { length: 1000 },
        (_, i) => ({
          time: i * 1000,
          value: i,
        })
      );

      render(
        <EnergyConsumption
          filteredData={largeDataset}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      expect(renderChart).toHaveBeenCalledWith(
        "usageChart",
        largeDataset,
        "monthly"
      );
    });
  });
});