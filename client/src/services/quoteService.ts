import api from "../api/axios";
import type { AxiosResponse } from "axios";
import { QUOTE_ENDPOINTS } from "../api/urls";
import {
  getDailyQuote as getFallbackDailyQuote,
  getRandomQuote as getFallbackRandomQuote,
} from "../data/quotes";

// Define interfaces for quote data
export interface Quote {
  id: number;
  text: string;
  author: string;
  category?: string;
}

// Define the quote service
export const quoteService = {
  /**
   * Get the daily motivational quote
   * @returns Promise with daily quote
   */
  getDailyQuote: async (): Promise<Quote> => {
    try {
      const response: AxiosResponse<Quote> = await api.get(
        QUOTE_ENDPOINTS.DAILY
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching daily quote:", error);
      // Use fallback quote if API fails
      return getFallbackDailyQuote();
    }
  },

  /**
   * Get a random motivational quote
   * @returns Promise with random quote
   */
  getRandomQuote: async (): Promise<Quote> => {
    try {
      const response: AxiosResponse<Quote> = await api.get(
        QUOTE_ENDPOINTS.RANDOM
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching random quote:", error);
      // Use fallback quote if API fails
      return getFallbackRandomQuote();
    }
  },

  /**
   * Get quotes by category
   * @param category - Quote category
   * @returns Promise with array of quotes
   */
  getQuotesByCategory: async (category: string): Promise<Quote[]> => {
    try {
      const response: AxiosResponse<Quote[]> = await api.get(
        QUOTE_ENDPOINTS.BY_CATEGORY(category)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching quotes for category ${category}:`, error);
      // Return empty array if API fails
      return [];
    }
  },
};
