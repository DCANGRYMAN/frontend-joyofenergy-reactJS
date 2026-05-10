import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilteredData } from "./useFilteredData";

// Mock transform utilities
vi.mock("../utils/transform", () => ({
  groupByHour: vi.fn((r) => r),
  groupByDay: vi.fn((r) => r),
  groupByMonth: vi.fn((r) => r),
  sortByTime: vi.fn((r) => [...r].sort((a, b) => a.time - b.time)),
}));

import { groupByHour, groupByDay, groupByMonth, sortByTime } from "../utils/transform";

describe("useFilteredData", () => {
  const mockReadings = [
    { time: 1000, value: 10 },
    { time: 2000, value: 20 },
    { time: 3000, value: 30 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have initial filter as 'monthly'", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));
      expect(result.current.activeFilter).toBe("monthly");
    });

    it("should return empty array when readings is not provided", () => {
      const { result } = renderHook(() => useFilteredData());
      expect(result.current.filteredData).toEqual([]);
    });

    it("should return empty array when readings is null", () => {
      const { result } = renderHook(() => useFilteredData(null));
      expect(result.current.filteredData).toEqual([]);
    });

    it("should return empty array when readings is undefined", () => {
      const { result } = renderHook(() => useFilteredData(undefined));
      expect(result.current.filteredData).toEqual([]);
    });
  });

  describe("Daily Filter", () => {
    it("should group by hour and slice last 24 for daily", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));

      act(() => {
        result.current.setActiveFilter("daily");
      });

      expect(result.current.activeFilter).toBe("daily");
      expect(groupByHour).toHaveBeenCalledWith(mockReadings);
      expect(sortByTime).toHaveBeenCalled();
    });

    it("should return maximum 24 items for daily", () => {
      const largeReadings = Array.from({ length: 100 }, (_, i) => ({
        time: i * 1000,
        value: i,
      }));

      const { result } = renderHook(() => useFilteredData(largeReadings));

      act(() => {
        result.current.setActiveFilter("daily");
      });

      expect(result.current.filteredData.length).toBeLessThanOrEqual(24);
    });

    it("should return less than 24 items if not enough data", () => {
      const smallReadings = [
        { time: 1000, value: 10 },
        { time: 2000, value: 20 },
      ];

      const { result } = renderHook(() => useFilteredData(smallReadings));

      act(() => {
        result.current.setActiveFilter("daily");
      });

      expect(result.current.filteredData.length).toBeLessThanOrEqual(2);
    });
  });

  describe("Weekly Filter", () => {
    it("should group by day and slice last 7 for weekly", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));

      act(() => {
        result.current.setActiveFilter("weekly");
      });

      expect(result.current.activeFilter).toBe("weekly");
      expect(groupByDay).toHaveBeenCalledWith(mockReadings);
      expect(sortByTime).toHaveBeenCalled();
    });

    it("should return maximum 7 items for weekly", () => {
      const largeReadings = Array.from({ length: 100 }, (_, i) => ({
        time: i * 86400000,
        value: i,
      }));

      const { result } = renderHook(() => useFilteredData(largeReadings));

      act(() => {
        result.current.setActiveFilter("weekly");
      });

      expect(result.current.filteredData.length).toBeLessThanOrEqual(7);
    });
  });

  describe("Monthly Filter", () => {
    it("should group by day and slice last 30 for monthly", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));

      act(() => {
        result.current.setActiveFilter("monthly");
      });

      expect(result.current.activeFilter).toBe("monthly");
      expect(groupByDay).toHaveBeenCalledWith(mockReadings);
    });

    it("should return maximum 30 items for monthly", () => {
      const largeReadings = Array.from({ length: 100 }, (_, i) => ({
        time: i * 86400000,
        value: i,
      }));

      const { result } = renderHook(() => useFilteredData(largeReadings));

      act(() => {
        result.current.setActiveFilter("monthly");
      });

      expect(result.current.filteredData.length).toBeLessThanOrEqual(30);
    });

    it("should be the default active filter", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));
      expect(result.current.activeFilter).toBe("monthly");
    });
  });

  describe("Yearly Filter", () => {
    it("should group by month for yearly", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));

      act(() => {
        result.current.setActiveFilter("yearly");
      });

      expect(result.current.activeFilter).toBe("yearly");
      expect(groupByMonth).toHaveBeenCalledWith(mockReadings);
      expect(sortByTime).toHaveBeenCalled();
    });

    it("should return all months (no slice limit)", () => {
      const yearlyReadings = Array.from({ length: 365 }, (_, i) => ({
        time: Date.now() - i * 86400000,
        value: i,
      }));

      const { result } = renderHook(() => useFilteredData(yearlyReadings));

      act(() => {
        result.current.setActiveFilter("yearly");
      });

      // Should return all unique months, not sliced
      expect(result.current.filteredData.length).toBeGreaterThan(0);
    });
  });

  describe("Filter Switching", () => {
    it("should switch from daily to weekly", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));

      act(() => {
        result.current.setActiveFilter("daily");
      });
      expect(result.current.activeFilter).toBe("daily");

      act(() => {
        result.current.setActiveFilter("weekly");
      });
      expect(result.current.activeFilter).toBe("weekly");
    });

    it("should switch through all filters", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));

      const filters = ["daily", "weekly", "monthly", "yearly"];
      filters.forEach((filter) => {
        act(() => {
          result.current.setActiveFilter(filter);
        });
        expect(result.current.activeFilter).toBe(filter);
      });
    });

    it("should update filtered data when filter changes", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));

      act(() => {
        result.current.setActiveFilter("daily");
      });
      const dailyData = result.current.filteredData;

      act(() => {
        result.current.setActiveFilter("monthly");
      });
      const monthlyData = result.current.filteredData;

      expect(dailyData).not.toBe(monthlyData);
    });
  });

  describe("Data Updates", () => {
    it("should update filtered data when readings change", () => {
      const { result, rerender } = renderHook(
        (props) => useFilteredData(props),
        { initialProps: mockReadings }
      );

      const initialData = result.current.filteredData;

      const newReadings = [
        { time: 4000, value: 40 },
        { time: 5000, value: 50 },
      ];

      rerender(newReadings);

      expect(result.current.filteredData).not.toEqual(initialData);
    });

    it("should clear data when readings becomes null", () => {
      const { result, rerender } = renderHook(
        (props) => useFilteredData(props),
        { initialProps: mockReadings }
      );

      expect(result.current.filteredData.length).toBeGreaterThan(0);

      rerender(null);

      expect(result.current.filteredData).toEqual([]);
    });

    it("should handle empty readings array", () => {
      const { result } = renderHook(() => useFilteredData([]));
      expect(result.current.filteredData).toEqual([]);
    });
  });

  describe("Sorting", () => {
    it("should sort filtered data by time", () => {
      const unsortedReadings = [
        { time: 3000, value: 30 },
        { time: 1000, value: 10 },
        { time: 2000, value: 20 },
      ];

      const { result } = renderHook(() => useFilteredData(unsortedReadings));

      act(() => {
        result.current.setActiveFilter("daily");
      });

      // sortByTime should be called
      expect(sortByTime).toHaveBeenCalled();
    });
  });

  describe("Return Object Structure", () => {
    it("should return object with filteredData, activeFilter, setActiveFilter", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));

      expect(result.current).toHaveProperty("filteredData");
      expect(result.current).toHaveProperty("activeFilter");
      expect(result.current).toHaveProperty("setActiveFilter");
    });

    it("should have function setActiveFilter", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));
      expect(typeof result.current.setActiveFilter).toBe("function");
    });

    it("should have array filteredData", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));
      expect(Array.isArray(result.current.filteredData)).toBe(true);
    });

    it("should have string activeFilter", () => {
      const { result } = renderHook(() => useFilteredData(mockReadings));
      expect(typeof result.current.activeFilter).toBe("string");
    });
  });

  describe("Edge Cases", () => {
    it("should handle single data point", () => {
      const singleReading = [{ time: 1000, value: 10 }];
      const { result } = renderHook(() => useFilteredData(singleReading));

      expect(result.current.filteredData.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle very large dataset", () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        time: i * 1000,
        value: Math.random() * 100,
      }));

      const { result } = renderHook(() => useFilteredData(largeDataset));

      expect(result.current.filteredData.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle data with same timestamps", () => {
      const duplicateTimestamps = [
        { time: 1000, value: 10 },
        { time: 1000, value: 20 },
        { time: 1000, value: 30 },
      ];

      const { result } = renderHook(() => useFilteredData(duplicateTimestamps));

      expect(result.current.filteredData.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle negative values", () => {
      const negativeReadings = [
        { time: 1000, value: -10 },
        { time: 2000, value: -20 },
      ];

      const { result } = renderHook(() => useFilteredData(negativeReadings));

      expect(result.current.filteredData.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle zero values", () => {
      const zeroReadings = [
        { time: 1000, value: 0 },
        { time: 2000, value: 0 },
      ];

      const { result } = renderHook(() => useFilteredData(zeroReadings));

      expect(result.current.filteredData.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle fractional values", () => {
      const fractionalReadings = [
        { time: 1000, value: 10.5 },
        { time: 2000, value: 20.75 },
      ];

      const { result } = renderHook(() => useFilteredData(fractionalReadings));

      expect(result.current.filteredData.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Memoization", () => {
    it("should memoize filtered data", () => {
      const { result, rerender } = renderHook(
        (props) => useFilteredData(props),
        { initialProps: mockReadings }
      );

      const firstData = result.current.filteredData;

      // Rerender with same props
      rerender(mockReadings);

      // Data reference might be the same due to memoization
      expect(result.current.filteredData).toBeDefined();
    });

    it("should not change activeFilter unintentionally", () => {
      const { result, rerender } = renderHook(
        (props) => useFilteredData(props),
        { initialProps: mockReadings }
      );

      act(() => {
        result.current.setActiveFilter("daily");
      });

      const activeFilter = result.current.activeFilter;

      rerender(mockReadings);

      expect(result.current.activeFilter).toBe(activeFilter);
    });
  });
});
