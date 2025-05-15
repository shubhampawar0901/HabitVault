import { useState, useEffect } from "react";
import {
  analyticsService,
  type AnalyticsSummary,
} from "../services/analyticsService";
import { showToast } from "../components/common/Toast";

interface UseAnalyticsSummaryResult {
  summary: AnalyticsSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  refetch: (
    startDate?: string,
    endDate?: string,
    period?: string
  ) => Promise<void>;
}

export const useAnalyticsSummary = (
  startDate?: string,
  endDate?: string,
  period?: "daily" | "weekly" | "monthly" | "yearly"
): UseAnalyticsSummaryResult => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchSummary = async (
    start?: string,
    end?: string,
    periodFilter?: string
  ) => {
    try {
      setSummaryLoading(true);
      setSummaryError(null);

      const data = await analyticsService.getSummary(
        start || startDate,
        end || endDate,
        periodFilter || period
      );
      setSummary(data);
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch analytics summary";
      setSummaryError(errorMessage);
      showToast.error(
        "Failed to load analytics summary. Please try again later."
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [startDate, endDate, period]);

  return {
    summary,
    summaryLoading,
    summaryError,
    refetch: fetchSummary,
  };
};
