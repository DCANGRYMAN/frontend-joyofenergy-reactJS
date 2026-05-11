import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReadings } from "./useReadings";

global.fetch = vi.fn();

describe("useStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and update data correctly", async () => {
    const mockData = [{ id: 1, value: 10, label: "Test" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useReadings());
    await waitFor(() => {
      expect(result.current).toEqual(mockData);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch errors gracefully", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Error" }),
    });

    const { result } = renderHook(() => useReadings());

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });
});
