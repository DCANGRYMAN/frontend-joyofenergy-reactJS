import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

vi.mock("../hooks/useCurrentDataContext", () => ({
  useCurrentData: vi.fn(),
}));

import { useCurrentData } from "../hooks/useCurrentDataContext";

describe("Sidebar", () => {
  const mockData = {
    current: {
      currentUsage: 1.5234,
      solarProduction: 4.8765,
      fedIntoGrid: 3.3531,
    },
    devices: [
      { name: "Air conditioner", usage: 0.3093 },
      { name: "Wi-Fi router", usage: 0.0033 },
      { name: "Humidifer", usage: 0.0518 },
      { name: "Smart TV", usage: 0.1276 },
      { name: "Diffuser", usage: 0.0078 },
      { name: "Refrigerator", usage: 0.0923 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCurrentData).mockReturnValue(mockData);
  });

  describe("Current Power Metrics", () => {
    it("should display current power usage", () => {
      render(<Sidebar />);

      expect(screen.getByText("⚡️ 1.52kW")).toBeInTheDocument();
      expect(screen.getByText("Power draw")).toBeInTheDocument();
    });

    it("should display solar power production", () => {
      render(<Sidebar />);

      expect(screen.getByText("☀️️ 4.88kW")).toBeInTheDocument();
      expect(screen.getByText("Solar power production")).toBeInTheDocument();
    });

    it("should display energy fed into grid", () => {
      render(<Sidebar />);

      expect(screen.getByText("🔌️ 3.35kW")).toBeInTheDocument();
      expect(screen.getByText("Fed into grid")).toBeInTheDocument();
    });
  });

  describe("Device List", () => {
    it("should render 'Your devices:' heading", () => {
      render(<Sidebar />);

      expect(screen.getByText("Your devices:")).toBeInTheDocument();
    });

    it("should render all devices", () => {
      render(<Sidebar />);

      mockData.devices.forEach((device) => {
        expect(screen.getByText(device.name)).toBeInTheDocument();
      });
    });

    it("should display correct device usage values", () => {
      render(<Sidebar />);

      expect(screen.getByText("0.3093kW")).toBeInTheDocument();
      expect(screen.getByText("0.0033kW")).toBeInTheDocument();
      expect(screen.getByText("0.0518kW")).toBeInTheDocument();
      expect(screen.getByText("0.1276kW")).toBeInTheDocument();
      expect(screen.getByText("0.0078kW")).toBeInTheDocument();
      expect(screen.getByText("0.0923kW")).toBeInTheDocument();
    });

    it("should render each device with a section", () => {
      const { container } = render(<Sidebar />);

      const deviceSections = container.querySelectorAll(
        ".shadow-2.roundedMore.bg-super-light-grey"
      );

      expect(deviceSections.length).toBe(6);
    });
  });

  describe("CSS Classes and Structure", () => {
    it("should have correct h2 classes for summaries", () => {
      const { container } = render(<Sidebar />);

      const h2s = container.querySelectorAll("h2");

      h2s.forEach((h2) => {
        expect(h2).toHaveClass("h2", "greyBlue");
      });
    });

    it("should have correct section structure", () => {
      const { container } = render(<Sidebar />);

      const mainSection = container.querySelector(".h5.darkgray.mb2");

      expect(mainSection).toBeInTheDocument();
    });

    it("should have device section with correct classes", () => {
      const { container } = render(<Sidebar />);

      const deviceSection = container.querySelector(
        ".shadow-2.roundedMore"
      );

      expect(deviceSection).toHaveClass(
        "bg-super-light-grey",
        "mb1"
      );
    });
  });

  describe("Data Formatting", () => {
    it("should format current usage to 2 decimal places", () => {
      vi.mocked(useCurrentData).mockReturnValue({
        ...mockData,
        current: {
          ...mockData.current,
          currentUsage: 1.23456,
        },
      });

      render(<Sidebar />);

      expect(screen.getByText("⚡️ 1.23kW")).toBeInTheDocument();
    });

    it("should format solar production to 2 decimal places", () => {
      vi.mocked(useCurrentData).mockReturnValue({
        ...mockData,
        current: {
          ...mockData.current,
          solarProduction: 5.56789,
        },
      });

      render(<Sidebar />);

      expect(screen.getByText("☀️️ 5.57kW")).toBeInTheDocument();
    });

    it("should format fed into grid to 2 decimal places", () => {
      vi.mocked(useCurrentData).mockReturnValue({
        ...mockData,
        current: {
          ...mockData.current,
          fedIntoGrid: 2.34567,
        },
      });

      render(<Sidebar />);

      expect(screen.getByText("🔌️ 2.35kW")).toBeInTheDocument();
    });

    it("should format device usage to 4 decimal places", () => {
      vi.mocked(useCurrentData).mockReturnValue({
        ...mockData,
        devices: [{ name: "Test Device", usage: 0.123456789 }],
      });

      render(<Sidebar />);

      expect(screen.getByText("0.1235kW")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero values", () => {
      vi.mocked(useCurrentData).mockReturnValue({
        current: {
          currentUsage: 0,
          solarProduction: 0,
          fedIntoGrid: 0,
        },
        devices: [{ name: "Device 1", usage: 0 }],
      });

      render(<Sidebar />);

      expect(screen.getByText("⚡️ 0.00kW")).toBeInTheDocument();
      expect(screen.getByText("☀️️ 0.00kW")).toBeInTheDocument();
      expect(screen.getByText("🔌️ 0.00kW")).toBeInTheDocument();
      expect(screen.getByText("0.0000kW")).toBeInTheDocument();
    });

    it("should handle very large values", () => {
      vi.mocked(useCurrentData).mockReturnValue({
        current: {
          currentUsage: 9999.99,
          solarProduction: 8888.88,
          fedIntoGrid: 7777.77,
        },
        devices: [
          { name: "Powerful Device", usage: 5555.5555 },
        ],
      });

      render(<Sidebar />);

      expect(
        screen.getByText("⚡️ 9999.99kW")
      ).toBeInTheDocument();

      expect(
        screen.getByText("☀️️ 8888.88kW")
      ).toBeInTheDocument();

      expect(
        screen.getByText("🔌️ 7777.77kW")
      ).toBeInTheDocument();

      expect(
        screen.getByText("5555.5555kW")
      ).toBeInTheDocument();
    });

    it("should handle single device", () => {
      vi.mocked(useCurrentData).mockReturnValue({
        ...mockData,
        devices: [{ name: "Single Device", usage: 0.5 }],
      });

      render(<Sidebar />);

      expect(
        screen.getByText("Single Device")
      ).toBeInTheDocument();

      expect(screen.getByText("0.5000kW")).toBeInTheDocument();
    });

    it("should handle many devices", () => {
      const manyDevices = Array.from({ length: 50 }, (_, i) => ({
        name: `Device ${i + 1}`,
        usage: (i + 1) * 0.1,
      }));

      vi.mocked(useCurrentData).mockReturnValue({
        ...mockData,
        devices: manyDevices,
      });

      render(<Sidebar />);

      manyDevices.forEach((device) => {
        expect(screen.getByText(device.name)).toBeInTheDocument();
      });
    });

    it("should handle empty devices array", () => {
      vi.mocked(useCurrentData).mockReturnValue({
        ...mockData,
        devices: [],
      });

      render(<Sidebar />);

      expect(
        screen.getByText("Your devices:")
      ).toBeInTheDocument();

      mockData.devices.forEach((device) => {
        expect(
          screen.queryByText(device.name)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Rendering with Different Data", () => {
    it("should re-render with updated data", () => {
      const initialData = {
        current: {
          currentUsage: 1.0,
          solarProduction: 2.0,
          fedIntoGrid: 1.0,
        },
        devices: [{ name: "Device 1", usage: 0.5 }],
      };

      vi.mocked(useCurrentData).mockReturnValue(initialData);

      const { rerender } = render(<Sidebar />);

      expect(screen.getByText("⚡️ 1.00kW")).toBeInTheDocument();

      const updatedData = {
        current: {
          currentUsage: 3.5,
          solarProduction: 5.5,
          fedIntoGrid: 2.0,
        },
        devices: [{ name: "Device 1", usage: 0.5 }],
      };

      vi.mocked(useCurrentData).mockReturnValue(updatedData);

      rerender(<Sidebar />);

      expect(screen.getByText("⚡️ 3.50kW")).toBeInTheDocument();
    });
  });
});