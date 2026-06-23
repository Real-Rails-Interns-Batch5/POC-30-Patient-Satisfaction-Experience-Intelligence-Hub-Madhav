import fallback from "@/public/mock_data.json";
import type { DashboardData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getDashboard(filters: { hospital: string; department: string; month: string }, signal?: AbortSignal) {
  const params = new URLSearchParams(filters);
  try {
    const response = await fetch(`${API_URL}/api/dashboard?${params}`, { signal, cache: "no-store" });
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    return { data: (await response.json()) as DashboardData, isFallback: false };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return {
      data: {
        ...(fallback as DashboardData),
        selected_hospital: filters.hospital,
        selected_department: filters.department,
        selected_month: filters.month,
      },
      isFallback: true,
    };
  }
}

export const sampleDownloadUrls = {
  csv: `${API_URL}/api/sample.csv`,
  json: `${API_URL}/api/sample.json`,
};
