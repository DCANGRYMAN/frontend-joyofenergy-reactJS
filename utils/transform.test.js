import { describe, it, expect, beforeEach } from "vitest";
import { groupByHour, groupByDay, groupByMonth, sortByTime } from "./transform";

describe("Transform Utilities", () => {
  const mockReadings = [
    { time: new Date("2024-01-15 08:00").getTime(), value: 10 },
    { time: new Date("2024-01-15 09:00").getTime(), value: 20 },
    { time: new Date("2024-01-15 08:30").getTime(), value: 5 },
    { time: new Date("2024-01-16 08:00").getTime(), value: 15 },
    { time: new Date("2024-02-15 08:00").getTime(), value: 12 },
  ];

  describe("groupByHour", () => {
    it("should group readings by hour", () => {
      const grouped = groupByHour(mockReadings);
      expect(grouped.length).toBeGreaterThan(0);
    });

    it("should return array of objects with time and value", () => {
      const grouped = groupByHour(mockReadings);
      grouped.forEach((item) => {
        expect(item).toHaveProperty("time");
        expect(item).toHaveProperty("value");
        expect(typeof item.time).toBe("number");
        expect(typeof item.value).toBe("number");
      });
    });

    it("should sum values for same hour", () => {
      const grouped = groupByHour(mockReadings);
      // Find the hour group that should have 08:00 readings
      const hourGroups = grouped.filter(
        (g) => new Date(g.time).getHours() === 8 && new Date(g.time).getDate() === 15
      );
      expect(hourGroups.length).toBeGreaterThan(0);
    });

    it("should handle empty readings", () => {
      const grouped = groupByHour([]);
      expect(grouped).toEqual([]);
    });

    it("should handle single reading", () => {
      const grouped = groupByHour([mockReadings[0]]);
      expect(grouped.length).toBe(1);
    });

    it("should preserve hour information in time", () => {
      const grouped = groupByHour(mockReadings);
      grouped.forEach((item) => {
        const date = new Date(item.time);
        expect(date.getMinutes()).toBe(0);
        expect(date.getSeconds()).toBe(0);
      });
    });

    it("should handle readings from different hours", () => {
      const diverse = [
        { time: new Date("2024-01-15 08:00").getTime(), value: 10 },
        { time: new Date("2024-01-15 12:00").getTime(), value: 20 },
        { time: new Date("2024-01-15 14:00").getTime(), value: 30 },
      ];
      const grouped = groupByHour(diverse);
      expect(grouped.length).toBe(3);
    });
  });

  describe("groupByDay", () => {
    it("should group readings by day", () => {
      const grouped = groupByDay(mockReadings);
      expect(grouped.length).toBeGreaterThan(0);
    });

    it("should return array of objects with time and value", () => {
      const grouped = groupByDay(mockReadings);
      grouped.forEach((item) => {
        expect(item).toHaveProperty("time");
        expect(item).toHaveProperty("value");
      });
    });

    it("should sum values for same day", () => {
      const dailyReadings = [
        { time: new Date("2024-01-15 08:00").getTime(), value: 10 },
        { time: new Date("2024-01-15 12:00").getTime(), value: 20 },
        { time: new Date("2024-01-15 18:00").getTime(), value: 5 },
      ];
      const grouped = groupByDay(dailyReadings);
      expect(grouped.length).toBe(1);
      expect(grouped[0].value).toBe(35); // 10 + 20 + 5
    });

    it("should separate different days", () => {
      const grouped = groupByDay(mockReadings);
      const uniqueDays = new Set(grouped.map((g) => new Date(g.time).getDate()));
      expect(uniqueDays.size).toBeGreaterThanOrEqual(2);
    });

    it("should handle empty readings", () => {
      const grouped = groupByDay([]);
      expect(grouped).toEqual([]);
    });

    it("should reset time to midnight", () => {
      const grouped = groupByDay(mockReadings);
      grouped.forEach((item) => {
        const date = new Date(item.time);
        expect(date.getHours()).toBe(0);
        expect(date.getMinutes()).toBe(0);
        expect(date.getSeconds()).toBe(0);
      });
    });

    it("should handle readings spanning multiple days", () => {
      const diverse = [
        { time: new Date("2024-01-15 08:00").getTime(), value: 10 },
        { time: new Date("2024-01-16 08:00").getTime(), value: 20 },
        { time: new Date("2024-01-17 08:00").getTime(), value: 30 },
      ];
      const grouped = groupByDay(diverse);
      expect(grouped.length).toBe(3);
    });
  });

  describe("groupByMonth", () => {
    it("should group readings by month", () => {
      const grouped = groupByMonth(mockReadings);
      expect(grouped.length).toBeGreaterThan(0);
    });

    it("should return array of objects with time and value", () => {
      const grouped = groupByMonth(mockReadings);
      grouped.forEach((item) => {
        expect(item).toHaveProperty("time");
        expect(item).toHaveProperty("value");
      });
    });

    it("should sum values for same month", () => {
      const monthlyReadings = [
        { time: new Date("2024-01-15 08:00").getTime(), value: 10 },
        { time: new Date("2024-01-20 12:00").getTime(), value: 20 },
        { time: new Date("2024-01-25 18:00").getTime(), value: 5 },
      ];
      const grouped = groupByMonth(monthlyReadings);
      expect(grouped.length).toBe(1);
      expect(grouped[0].value).toBe(35);
    });

    it("should separate different months", () => {
      const grouped = groupByMonth(mockReadings);
      expect(grouped.length).toBeGreaterThanOrEqual(2);
    });

    it("should handle empty readings", () => {
      const grouped = groupByMonth([]);
      expect(grouped).toEqual([]);
    });

    it("should reset time to first day of month at midnight", () => {
      const grouped = groupByMonth(mockReadings);
      grouped.forEach((item) => {
        const date = new Date(item.time);
        expect(date.getDate()).toBe(1);
        expect(date.getHours()).toBe(0);
        expect(date.getMinutes()).toBe(0);
        expect(date.getSeconds()).toBe(0);
      });
    });

    it("should handle readings spanning multiple years", () => {
      const diverse = [
        { time: new Date("2023-12-15 08:00").getTime(), value: 10 },
        { time: new Date("2024-01-15 08:00").getTime(), value: 20 },
        { time: new Date("2024-02-15 08:00").getTime(), value: 30 },
      ];
      const grouped = groupByMonth(diverse);
      expect(grouped.length).toBe(3);
    });

    it("should handle readings from same month but different years", () => {
      const sameMonthDifferentYears = [
        { time: new Date("2023-01-15 08:00").getTime(), value: 10 },
        { time: new Date("2024-01-15 08:00").getTime(), value: 20 },
      ];
      const grouped = groupByMonth(sameMonthDifferentYears);
      expect(grouped.length).toBe(2);
    });
  });

  describe("sortByTime", () => {
    it("should sort readings by time in ascending order", () => {
      const unsorted = [
        { time: 3000, value: 30 },
        { time: 1000, value: 10 },
        { time: 2000, value: 20 },
      ];
      const sorted = sortByTime(unsorted);
      expect(sorted[0].time).toBe(1000);
      expect(sorted[1].time).toBe(2000);
      expect(sorted[2].time).toBe(3000);
    });

    it("should not modify original array", () => {
      const original = [
        { time: 3000, value: 30 },
        { time: 1000, value: 10 },
      ];
      const originalCopy = JSON.parse(JSON.stringify(original));
      sortByTime(original);
      expect(original).toEqual(originalCopy);
    });

    it("should handle empty array", () => {
      const sorted = sortByTime([]);
      expect(sorted).toEqual([]);
    });

    it("should handle single element", () => {
      const sorted = sortByTime([{ time: 5000, value: 50 }]);
      expect(sorted.length).toBe(1);
      expect(sorted[0].time).toBe(5000);
    });

    it("should handle already sorted array", () => {
      const sorted = [
        { time: 1000, value: 10 },
        { time: 2000, value: 20 },
        { time: 3000, value: 30 },
      ];
      const result = sortByTime(sorted);
      expect(result).toEqual(sorted);
    });

    it("should handle reverse sorted array", () => {
      const unsorted = [
        { time: 3000, value: 30 },
        { time: 2000, value: 20 },
        { time: 1000, value: 10 },
      ];
      const sorted = sortByTime(unsorted);
      expect(sorted[0].time).toBe(1000);
      expect(sorted[2].time).toBe(3000);
    });

    it("should handle duplicate times", () => {
      const unsorted = [
        { time: 2000, value: 20 },
        { time: 1000, value: 10 },
        { time: 1000, value: 15 },
      ];
      const sorted = sortByTime(unsorted);
      expect(sorted[0].time).toBe(1000);
      expect(sorted[1].time).toBe(1000);
      expect(sorted[2].time).toBe(2000);
    });

    it("should preserve all values", () => {
      const unsorted = [
        { time: 3000, value: 30 },
        { time: 1000, value: 10 },
        { time: 2000, value: 20 },
      ];
      const sorted = sortByTime(unsorted);
      const values = sorted.map((r) => r.value).sort((a, b) => a - b);
      expect(values).toEqual([10, 20, 30]);
    });
  });

  describe("Integration", () => {
    it("should chain groupByDay and sortByTime", () => {
      const grouped = groupByDay(mockReadings);
      const sorted = sortByTime(grouped);
      expect(sorted.length).toBeGreaterThan(0);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].time).toBeGreaterThanOrEqual(sorted[i - 1].time);
      }
    });

    it("should chain groupByMonth and sortByTime", () => {
      const grouped = groupByMonth(mockReadings);
      const sorted = sortByTime(grouped);
      expect(sorted.length).toBeGreaterThan(0);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].time).toBeGreaterThanOrEqual(sorted[i - 1].time);
      }
    });

    it("should chain groupByHour and sortByTime", () => {
      const grouped = groupByHour(mockReadings);
      const sorted = sortByTime(grouped);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].time).toBeGreaterThanOrEqual(sorted[i - 1].time);
      }
    });

    it("should handle large datasets efficiently", () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        time: Date.now() - i * 3600000,
        value: Math.random() * 100,
      }));

      const grouped = groupByDay(largeDataset);
      const sorted = sortByTime(grouped);

      expect(sorted.length).toBeGreaterThan(0);
      expect(sorted.length).toBeLessThanOrEqual(largeDataset.length);
    });
  });
});
