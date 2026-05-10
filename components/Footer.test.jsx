import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Footer } from "./Footer";

describe("Footer", () => {
  const mockStats = {
    totalConsumption: 250.5678,
    averageConsumption: 125.2345,
    peakConsumption: 300.9876,
    carbonFootprint: 75.456,
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<Footer stats={mockStats} />);
      expect(screen.getByText(/carbon footprint/i)).toBeInTheDocument();
    });

    it("should render footer section", () => {
      const { container } = render(<Footer stats={mockStats} />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should render carbon footprint label", () => {
      render(<Footer stats={mockStats} />);

      expect(screen.getByText(/carbon footprint/i)).toBeInTheDocument();
    });
  });
});
