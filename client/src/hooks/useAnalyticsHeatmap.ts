import { useState, useEffect } from "react";
import {
  analyticsService,
  type HeatmapData,
} from "../services/analyticsService";
import { showToast } from "../components/common/Toast";

interface UseAnalyticsHeatmapResult {
  heatmapData: HeatmapData | null;
  heatmapLoading: boolean;
  heatmapError: string | null;
  refetch: (
    startDate?: string,
    endDate?: string,
    period?: string
  ) => Promise<void>;
}

export const useAnalyticsHeatmap = (
  startDate?: string,
  endDate?: string,
  period?: "daily" | "weekly" | "monthly" | "yearly"
): UseAnalyticsHeatmapResult => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [heatmapLoading, setHeatmapLoading] = useState<boolean>(true);
  const [heatmapError, setHeatmapError] = useState<string | null>(null);

  const fetchHeatmap = async (
    start?: string,
    end?: string,
    periodFilter?: string
  ) => {
    try {
      setHeatmapLoading(true);
      setHeatmapError(null);

      const data = await analyticsService.getHeatmap(
        start || startDate,
        end || endDate,
        periodFilter || period
      );
      setHeatmapData(data);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch heatmap data";
      setHeatmapError(errorMessage);
      showToast({
        type: "error",
        message: "Failed to load heatmap data. Please try again later.",
      });
    } finally {
      setHeatmapLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, [startDate, endDate, period]);

  return {
    heatmapData,
    heatmapLoading,
    heatmapError,
    refetch: fetchHeatmap,
  };
};
