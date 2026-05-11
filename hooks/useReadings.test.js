import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReadings } from "./useReadings";

global.fetch = vi.fn();

describe("useReadings Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return data correctly after the API call", async () => {
    const mockData = [{ id: 1, name: "Test Reading", value: 100 }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useReadings());
    expect(result.current).toBeUndefined();
    await waitFor(() => {
      expect(result.current).toEqual(mockData);
    });

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/readings");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  
  it("should remain undefined if the fetch fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    });

    const { result } = renderHook(() => useReadings());
    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });
});
