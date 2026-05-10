import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { DataProvider, useCurrentData } from "./useCurrentDataContext";
import React from "react";

// Mock fetch
global.fetch = vi.fn();

describe("useCurrentDataContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockDataResponse = {
    current: {
      currentUsage: 1.5,
      solarProduction: 4.8,
      fedIntoGrid: 3.3,
    },
    devices: [
      { name: "Device 1", usage: 0.5 },
      { name: "Device 2", usage: 0.3 },
    ],
  };

  describe("Initial State", () => {
    it("should provide initial data structure", () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      expect(result.current).toEqual({
        current: {
          currentUsage: 0,
          solarProduction: 0,
          fedIntoGrid: 0,
        },
        devices: [],
      });
    });

    it("should have empty devices array initially", () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      expect(Array.isArray(result.current.devices)).toBe(true);
      expect(result.current.devices.length).toBe(0);
    });
  });

  describe("Fetching Data", () => {
    it("should fetch data from correct endpoint", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith("http://localhost:3000/data");
      });
    });

    it("should update state with fetched data", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      await waitFor(() => {
        expect(result.current.current.currentUsage).toBe(1.5);
        expect(result.current.current.solarProduction).toBe(4.8);
        expect(result.current.devices.length).toBe(2);
      });
    });

    it("should parse JSON response correctly", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      await waitFor(() => {
        expect(result.current).toEqual(mockDataResponse);
      });
    });
  });

  describe("Caching", () => {
    it("should not fetch if cache is still valid", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result: result1 } = renderHook(() => useCurrentData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.current.currentUsage).toBe(1.5);
      });

      expect(fetch).toHaveBeenCalledTimes(1);

      const { result: result2 } = renderHook(() => useCurrentData(), {
        wrapper,
      });

      expect(fetch).toHaveBeenCalledTimes(1); // Should not fetch again
      expect(result2.current).toEqual(mockDataResponse);
    });

    it("should re-fetch after cache expires", async () => {
      const firstResponse = { ...mockDataResponse };
      const secondResponse = {
        ...mockDataResponse,
        current: { ...mockDataResponse.current, currentUsage: 2.0 },
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          json: async () => firstResponse,
        } as Response)
        .mockResolvedValueOnce({
          json: async () => secondResponse,
        } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      await waitFor(() => {
        expect(result.current.current.currentUsage).toBe(1.5);
      });

      // Advance time past cache TTL (5000ms)
      vi.advanceTimersByTime(5100);

      await waitFor(() => {
        expect(result.current.current.currentUsage).toBe(2.0);
      });

      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("should respect CACHE_TTL constant", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      renderHook(() => useCurrentData(), { wrapper });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      // Advance less than TTL
      vi.advanceTimersByTime(3000);

      const { result } = renderHook(() => useCurrentData(), { wrapper });
      expect(result.current).toEqual(mockDataResponse);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Handling", () => {
    it("should handle fetch errors gracefully", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      // Should maintain initial state on error
      await waitFor(() => {
        expect(result.current).toEqual({
          current: {
            currentUsage: 0,
            solarProduction: 0,
            fedIntoGrid: 0,
          },
          devices: [],
        });
      });
    });

    it("should handle JSON parse errors", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => {
          throw new Error("JSON parse error");
        },
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      await waitFor(() => {
        // Should keep initial state
        expect(result.current.current.currentUsage).toBe(0);
      });
    });
  });

  describe("Multiple Hook Instances", () => {
    it("should share cache between multiple hook instances", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);

      const { result: result1 } = renderHook(() => useCurrentData(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useCurrentData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current).toEqual(mockDataResponse);
        expect(result2.current).toEqual(mockDataResponse);
      });

      // Should have fetched only once due to caching
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("should update all instances when cache is invalidated", async () => {
      const firstResponse = { ...mockDataResponse };
      const secondResponse = {
        ...mockDataResponse,
        current: { ...mockDataResponse.current, currentUsage: 2.5 },
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          json: async () => firstResponse,
        } as Response)
        .mockResolvedValueOnce({
          json: async () => secondResponse,
        } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);

      const { result: result1 } = renderHook(() => useCurrentData(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useCurrentData(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.current.currentUsage).toBe(1.5);
        expect(result2.current.current.currentUsage).toBe(1.5);
      });

      vi.advanceTimersByTime(5100);

      await waitFor(() => {
        expect(result1.current.current.currentUsage).toBe(2.5);
        expect(result2.current.current.currentUsage).toBe(2.5);
      });
    });
  });

  describe("Promise Deduplication", () => {
    it("should reuse pending promise for simultaneous requests", async () => {
      let resolveJson;
      vi.mocked(fetch).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveJson = () =>
            resolve({
              json: async () => mockDataResponse,
            } as Response);
        })
      );

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);

      const { result: result1 } = renderHook(() => useCurrentData(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useCurrentData(), {
        wrapper,
      });

      expect(fetch).toHaveBeenCalledTimes(1);

      resolveJson();

      await waitFor(() => {
        expect(result1.current).toEqual(mockDataResponse);
        expect(result2.current).toEqual(mockDataResponse);
      });
    });
  });

  describe("Data Structure", () => {
    it("should have current object with required properties", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      await waitFor(() => {
        expect(result.current.current).toHaveProperty("currentUsage");
        expect(result.current.current).toHaveProperty("solarProduction");
        expect(result.current.current).toHaveProperty("fedIntoGrid");
      });
    });

    it("should have devices array with correct structure", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => mockDataResponse,
      } as Response);

      const wrapper = ({ children }) =>
        React.createElement(DataProvider, null, children);
      const { result } = renderHook(() => useCurrentData(), { wrapper });

      await waitFor(() => {
        expect(Array.isArray(result.current.devices)).toBe(true);
        result.current.devices.forEach((device) => {
          expect(device).toHaveProperty("name");
          expect(device).toHaveProperty("usage");
        });
      });
    });
  });
});
