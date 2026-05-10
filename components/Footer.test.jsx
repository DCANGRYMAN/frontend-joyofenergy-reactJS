import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  const mockStats = {
    totalConsumption: 250.5678,
    estimatedCost: 45.2345,
    footprint: 125.8901,
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText(/Total Consumption|Estimated Cost|Carbon Footprint/)).toBeInTheDocument();
    });

    it("should render all three stat cards", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("Total Consumption")).toBeInTheDocument();
      expect(screen.getByText("Estimated Cost")).toBeInTheDocument();
      expect(screen.getByText("Carbon Footprint")).toBeInTheDocument();
    });

    it("should render main section with correct classes", () => {
      const { container } = render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      const section = container.querySelector("section");
      expect(section).toHaveClass("flex", "gap2");
    });
  });

  describe("Total Consumption Display", () => {
    it("should display total consumption label", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("Total Consumption")).toBeInTheDocument();
    });

    it("should format total consumption to 2 decimal places", () => {
      render(
        <Footer
          totalConsumption={250.5678}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("250.57")).toBeInTheDocument();
    });

    it("should display kWh unit", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("kWh")).toBeInTheDocument();
    });

    it("should handle zero consumption", () => {
      render(
        <Footer
          totalConsumption={0}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("0.00")).toBeInTheDocument();
    });

    it("should handle very large consumption", () => {
      render(
        <Footer
          totalConsumption={999999.99}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("1000000.00")).toBeInTheDocument();
    });

    it("should handle fractional consumption", () => {
      render(
        <Footer
          totalConsumption={123.456}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("123.46")).toBeInTheDocument();
    });
  });

  describe("Estimated Cost Display", () => {
    it("should display estimated cost label", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("Estimated Cost")).toBeInTheDocument();
    });

    it("should format estimated cost to 2 decimal places", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={45.2345}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("$ 45.23")).toBeInTheDocument();
    });

    it("should display dollar sign", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      const costText = screen.getByText(/\$ \d+\.\d{2}/);
      expect(costText).toBeInTheDocument();
    });

    it("should handle zero cost", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={0}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("$ 0.00")).toBeInTheDocument();
    });

    it("should handle very large cost", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={9999.99}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("$ 10000.00")).toBeInTheDocument();
    });

    it("should handle fractional cost", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={99.999}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("$ 100.00")).toBeInTheDocument();
    });
  });

  describe("Carbon Footprint Display", () => {
    it("should display carbon footprint label", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("Carbon Footprint")).toBeInTheDocument();
    });

    it("should format carbon footprint to 2 decimal places", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={125.8901}
        />
      );
      expect(screen.getByText("125.89")).toBeInTheDocument();
    });

    it("should display kg CO₂ unit", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("kg CO₂")).toBeInTheDocument();
    });

    it("should handle zero footprint", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={0}
        />
      );
      expect(screen.getByText("0.00")).toBeInTheDocument();
    });

    it("should handle very large footprint", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={999999.99}
        />
      );
      expect(screen.getByText("1000000.00")).toBeInTheDocument();
    });

    it("should handle fractional footprint", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={50.555}
        />
      );
      expect(screen.getByText("50.56")).toBeInTheDocument();
    });
  });

  describe("CSS Classes and Structure", () => {
    it("should have correct classes on stat cards", () => {
      const { container } = render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      const cards = container.querySelectorAll(".stat-card");
      cards.forEach((card) => {
        expect(card).toHaveClass(
          "stat-card",
          "shadow-2",
          "roundedMore",
          "p3",
          "bg-white",
          "flex-auto"
        );
      });
    });

    it("should have exactly 3 stat cards", () => {
      const { container } = render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      const cards = container.querySelectorAll(".stat-card");
      expect(cards.length).toBe(3);
    });

    it("should have correct heading hierarchy", () => {
      const { container } = render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      const h2s = container.querySelectorAll("h2");
      expect(h2s.length).toBe(3);
      h2s.forEach((h2) => {
        expect(h2).toHaveClass("darkgray", "regular");
      });
    });

    it("should have correct paragraph classes for labels", () => {
      const { container } = render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      const labels = container.querySelectorAll("p");
      labels.forEach((label) => {
        expect(label).toHaveClass("h6", "grey", "mb1");
      });
    });

    it("should have unit spans with h4 class", () => {
      const { container } = render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      const units = container.querySelectorAll("span.h4");
      expect(units.length).toBe(2); // kWh and kg CO₂
    });
  });

  describe("Props Handling", () => {
    it("should accept all three props", () => {
      const { container } = render(
        <Footer
          totalConsumption={100}
          estimatedCost={20}
          footprint={50}
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle negative values gracefully", () => {
      render(
        <Footer
          totalConsumption={-50}
          estimatedCost={-10}
          footprint={-25}
        />
      );
      expect(screen.getByText("-50.00")).toBeInTheDocument();
      expect(screen.getByText("$ -10.00")).toBeInTheDocument();
      expect(screen.getByText("-25.00")).toBeInTheDocument();
    });

    it("should handle NaN values", () => {
      render(
        <Footer
          totalConsumption={NaN}
          estimatedCost={NaN}
          footprint={NaN}
        />
      );
      expect(screen.getByText("NaN")).toBeInTheDocument();
    });

    it("should handle Infinity values", () => {
      render(
        <Footer
          totalConsumption={Infinity}
          estimatedCost={Infinity}
          footprint={Infinity}
        />
      );
      expect(screen.getByText("Infinity")).toBeInTheDocument();
    });

    it("should handle decimal precision edge cases", () => {
      render(
        <Footer
          totalConsumption={0.001}
          estimatedCost={0.005}
          footprint={0.009}
        />
      );
      expect(screen.getByText("0.00")).toBeInTheDocument();
      expect(screen.getByText("$ 0.01")).toBeInTheDocument(); // rounds to 0.01
    });
  });

  describe("Data Formatting", () => {
    it("should round consumption correctly", () => {
      render(
        <Footer
          totalConsumption={100.445}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("100.45")).toBeInTheDocument();
    });

    it("should round cost correctly", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={50.445}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("$ 50.45")).toBeInTheDocument();
    });

    it("should round footprint correctly", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={75.445}
        />
      );
      expect(screen.getByText("75.45")).toBeInTheDocument();
    });

    it("should handle rounding up", () => {
      render(
        <Footer
          totalConsumption={100.456}
          estimatedCost={50.456}
          footprint={75.456}
        />
      );
      expect(screen.getByText("100.46")).toBeInTheDocument();
      expect(screen.getByText("$ 50.46")).toBeInTheDocument();
      expect(screen.getByText("75.46")).toBeInTheDocument();
    });

    it("should handle rounding down", () => {
      render(
        <Footer
          totalConsumption={100.444}
          estimatedCost={50.444}
          footprint={75.444}
        />
      );
      expect(screen.getByText("100.44")).toBeInTheDocument();
      expect(screen.getByText("$ 50.44")).toBeInTheDocument();
      expect(screen.getByText("75.44")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic section element", () => {
      const { container } = render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should have proper heading structure", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h2s.length).toBe(3);
    });

    it("should have readable units", () => {
      render(
        <Footer
          totalConsumption={mockStats.totalConsumption}
          estimatedCost={mockStats.estimatedCost}
          footprint={mockStats.footprint}
        />
      );
      expect(screen.getByText("kWh")).toBeInTheDocument();
      expect(screen.getByText("kg CO₂")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very small values close to zero", () => {
      render(
        <Footer
          totalConsumption={0.001}
          estimatedCost={0.001}
          footprint={0.001}
        />
      );
      expect(screen.getByText("0.00")).toBeInTheDocument();
      expect(screen.getByText("$ 0.00")).toBeInTheDocument();
    });

    it("should handle consistent values", () => {
      render(
        <Footer
          totalConsumption={100}
          estimatedCost={100}
          footprint={100}
        />
      );
      expect(screen.getByText("100.00")).toBeInTheDocument();
      expect(screen.getByText("$ 100.00")).toBeInTheDocument();
    });

    it("should handle mixed positive and negative values", () => {
      render(
        <Footer
          totalConsumption={100}
          estimatedCost={-50}
          footprint={200}
        />
      );
      expect(screen.getByText("100.00")).toBeInTheDocument();
      expect(screen.getByText("$ -50.00")).toBeInTheDocument();
      expect(screen.getByText("200.00")).toBeInTheDocument();
    });

    it("should render with all maximum values", () => {
      const maxValue = Number.MAX_SAFE_INTEGER;
      render(
        <Footer
          totalConsumption={maxValue}
          estimatedCost={maxValue}
          footprint={maxValue}
        />
      );
      expect(screen.getByText(/\d+\.\d{2}/)).toBeInTheDocument();
    });

    it("should render with all minimum values", () => {
      const minValue = Number.MIN_SAFE_INTEGER;
      render(
        <Footer
          totalConsumption={minValue}
          estimatedCost={minValue}
          footprint={minValue}
        />
      );
      expect(screen.getByText(/-\d+\.\d{2}/)).toBeInTheDocument();
    });
  });

  describe("Rendering Multiple Instances", () => {
    it("should render multiple Footer instances independently", () => {
      const { container, rerender } = render(
        <Footer
          totalConsumption={100}
          estimatedCost={20}
          footprint={50}
        />
      );
      
      let sections = container.querySelectorAll("section");
      expect(sections.length).toBe(1);

      rerender(
        <Footer
          totalConsumption={200}
          estimatedCost={40}
          footprint={100}
        />
      );

      expect(screen.getByText("200.00")).toBeInTheDocument();
      expect(screen.getByText("$ 40.00")).toBeInTheDocument();
      expect(screen.getByText("100.00")).toBeInTheDocument();
    });
  });
});
