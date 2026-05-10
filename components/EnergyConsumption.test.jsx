import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
      expect(screen.getByText("Energy consumption")).toBeInTheDocument();
    });

    it("should render all filter buttons", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      expect(screen.getByText("Daily")).toBeInTheDocument();
      expect(screen.getByText("Weekly")).toBeInTheDocument();
      expect(screen.getByText("Monthly")).toBeInTheDocument();
      expect(screen.getByText("Yearly")).toBeInTheDocument();
    });

    it("should render canvas element with correct id", () => {
      const { container } = render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      const canvas = container.querySelector("#usageChart");
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
      const dailyButton = screen.getByText("Daily").closest("button");
      expect(dailyButton).toHaveClass("bg-blue");
      expect(dailyButton).toHaveClass("white");
    });

    it("should highlight Monthly filter when active", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      const monthlyButton = screen.getByText("Monthly").closest("button");
      expect(monthlyButton).toHaveClass("bg-blue");
      expect(monthlyButton).toHaveClass("white");
    });

    it("should highlight Yearly filter when active", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="yearly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      const yearlyButton = screen.getByText("Yearly").closest("button");
      expect(yearlyButton).toHaveClass("bg-blue");
      expect(yearlyButton).toHaveClass("white");
    });

    it("should style inactive filters with white background", () => {
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="daily"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      const monthlyButton = screen.getByText("Monthly").closest("button");
      expect(monthlyButton).toHaveClass("bg-white");
      expect(monthlyButton).toHaveClass("darkgray");
      expect(monthlyButton).not.toHaveClass("bg-blue");
    });
  });

  describe("Filter Button Clicks", () => {
    it("should call setActiveFilter with 'daily' when Daily button clicked", async () => {
      const user = userEvent.setup();
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      await user.click(screen.getByText("Daily"));
      expect(mockSetActiveFilter).toHaveBeenCalledWith("daily");
      expect(mockSetActiveFilter).toHaveBeenCalledTimes(1);
    });

    it("should call setActiveFilter with 'weekly' when Weekly button clicked", async () => {
      const user = userEvent.setup();
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      await user.click(screen.getByText("Weekly"));
      expect(mockSetActiveFilter).toHaveBeenCalledWith("weekly");
    });

    it("should call setActiveFilter with 'monthly' when Monthly button clicked", async () => {
      const user = userEvent.setup();
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="daily"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      await user.click(screen.getByText("Monthly"));
      expect(mockSetActiveFilter).toHaveBeenCalledWith("monthly");
    });

    it("should call setActiveFilter with 'yearly' when Yearly button clicked", async () => {
      const user = userEvent.setup();
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="daily"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      await user.click(screen.getByText("Yearly"));
      expect(mockSetActiveFilter).toHaveBeenCalledWith("yearly");
    });

    it("should call setActiveFilter only on clicked button", async () => {
      const user = userEvent.setup();
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      await user.click(screen.getByText("Daily"));
      await user.click(screen.getByText("Weekly"));
      expect(mockSetActiveFilter).toHaveBeenCalledTimes(2);
      expect(mockSetActiveFilter).toHaveBeenNthCalledWith(1, "daily");
      expect(mockSetActiveFilter).toHaveBeenNthCalledWith(2, "weekly");
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

    it("should call renderChart with correct parameters for different filters", () => {
      const { rerender } = render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="daily"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      expect(renderChart).toHaveBeenCalledWith(
        "usageChart",
        mockFilteredData,
        "daily"
      );

      vi.clearAllMocks();

      rerender(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="weekly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      expect(renderChart).toHaveBeenCalledWith(
        "usageChart",
        mockFilteredData,
        "weekly"
      );
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
      expect(renderChart).toHaveBeenCalledTimes(1);

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

    it("should not re-call renderChart if filteredData is empty on update", () => {
      const { rerender } = render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      expect(renderChart).toHaveBeenCalledTimes(1);

      vi.clearAllMocks();

      rerender(
        <EnergyConsumption
          filteredData={[]}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      expect(renderChart).not.toHaveBeenCalled();
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
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("h5", "inline-block", "shadow-2");
        expect(button).toHaveClass("pl2", "pr2", "pt1", "pb1");
        expect(button).toHaveClass("roundedMore", "border-grey", "bold");
      });
    });

    it("should have correct CSS classes on sections", () => {
      const { container } = render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      const sections = container.querySelectorAll("section");
      expect(sections[0]).toHaveClass("mb3");
      expect(sections[1]).toHaveClass("chartHeight", "mb3");
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple rapid filter changes", async () => {
      const user = userEvent.setup();
      render(
        <EnergyConsumption
          filteredData={mockFilteredData}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );

      await user.click(screen.getByText("Daily"));
      await user.click(screen.getByText("Weekly"));
      await user.click(screen.getByText("Yearly"));

      expect(mockSetActiveFilter).toHaveBeenCalledTimes(3);
    });

    it("should handle single data point in filteredData", () => {
      const singleDataPoint = [{ time: 1000, value: 10 }];
      render(
        <EnergyConsumption
          filteredData={singleDataPoint}
          activeFilter="monthly"
          setActiveFilter={mockSetActiveFilter}
        />
      );
      expect(renderChart).toHaveBeenCalledWith(
        "usageChart",
        singleDataPoint,
        "monthly"
      );
    });

    it("should handle large dataset", () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        time: i * 1000,
        value: Math.random() * 100,
      }));
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
