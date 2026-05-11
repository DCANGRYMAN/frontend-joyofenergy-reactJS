import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  renderHook,
} from "@testing-library/react";

import {
  DataProvider,
  useCurrentData,
  clearCache,
} from "./useCurrentDataContext";

// ─── Mock global fetch ────────────────────────────────────────────────────────

global.fetch = vi.fn();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockData = {
  current: {
    currentUsage: 1.5,
    solarProduction: 4.8,
    fedIntoGrid: 3.3,
  },
  devices: [
    { name: "Device 1", usage: 0.5 },
    { name: "Device 2", usage: 0.3 },
  ],
  readings: [
    { time: "2024-01-01T10:00:00", value: 10 },
    { time: "2024-01-01T11:00:00", value: 20 },
  ],
};

const defaultData = {
  current: {
    currentUsage: 0,
    solarProduction: 0,
    fedIntoGrid: 0,
  },
  devices: [],
  readings: [],
};

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();

  clearCache();

  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Suites ───────────────────────────────────────────────────────────────────

describe("useCurrentDataContext", () => {
  describe("DataProvider - Initial Rendering", () => {
    it("should render children correctly", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(
        <DataProvider>
          <div data-testid="test-child">Test Child</div>
        </DataProvider>
      );

      expect(screen.getByTestId("test-child")).toBeInTheDocument();
    });

    it("should render with default data initially", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    it("should use default data structure", () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      expect(result.current).toHaveProperty("current");
      expect(result.current).toHaveProperty("devices");
      expect(result.current).toHaveProperty("readings");
    });
  });

  describe("DataProvider - Data Fetching", () => {
    it("should fetch data from API on mount", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:3000/data"
        );
      });
    });

    it("should fetch data and update state with API response", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(result.current).toEqual(mockData);
      });
    });

    it("should handle empty response from API", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(result.current).toEqual(defaultData);
      });
    });

    it("should handle undefined response from API", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => undefined,
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(result.current).toEqual(defaultData);
      });
    });
  });

  describe("DataProvider - Lifecycle", () => {
    it("should cleanup interval on unmount", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      const { unmount } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it("should not crash after unmount", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { unmount } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      unmount();

      expect(true).toBe(true);
    });
  });

  describe("DataProvider - Error Handling", () => {
    it("should display error screen when fetch fails", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <DataProvider>
          <div>Content</div>
        </DataProvider>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Could not load energy data.")
        ).toBeInTheDocument();
      });
    });

    it("should display error screen when response is not ok", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      render(
        <DataProvider>
          <div>Content</div>
        </DataProvider>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Could not load energy data.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("ErrorScreen", () => {
    it("should render retry button", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <DataProvider>
          <div>Content</div>
        </DataProvider>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", {
            name: /try again/i,
          })
        ).toBeInTheDocument();
      });
    });

    it("should retry fetch when retry button is clicked", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <DataProvider>
          <div>Content</div>
        </DataProvider>
      );

      const retryButton = await screen.findByRole("button", {
        name: /try again/i,
      });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      retryButton.click();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("useCurrentData Hook", () => {
    it("should return context value inside provider", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(result.current).toEqual(mockData);
      });
    });

    it("should return null outside provider", () => {
      const { result } = renderHook(() => useCurrentData());

      expect(result.current).toBeNull();
    });
  });

  describe("Integration Tests", () => {
    it("should provide data to multiple consumers", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const Consumer1 = () => {
        const data = useCurrentData();

        return (
          <div data-testid="consumer1">
            {data?.current?.currentUsage}
          </div>
        );
      };

      const Consumer2 = () => {
        const data = useCurrentData();

        return (
          <div data-testid="consumer2">
            {data?.current?.solarProduction}
          </div>
        );
      };

      render(
        <DataProvider>
          <Consumer1 />
          <Consumer2 />
        </DataProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("consumer1")).toBeInTheDocument();
        expect(screen.getByTestId("consumer2")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty devices array", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: mockData.current,
          devices: [],
          readings: [],
        }),
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(result.current.devices).toEqual([]);
      });
    });

    it("should handle empty readings array", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: mockData.current,
          devices: [{ name: "Device 1" }],
          readings: [],
        }),
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(result.current.readings).toEqual([]);
      });
    });

    it("should handle partial data structure", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            currentUsage: 1.5,
          },
        }),
      });

      const { result } = renderHook(() => useCurrentData(), {
        wrapper: DataProvider,
      });

      await waitFor(() => {
        expect(result.current.current.currentUsage).toBe(1.5);
      });
    });
  });
});