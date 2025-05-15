import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";
import { quoteService, type Quote } from "../../services/quoteService";
import { getDailyQuote as getFallbackQuote } from "../../data/quotes";

interface QuoteSectionProps {
  /**
   * Optional className to apply to the component
   */
  className?: string;
}

/**
 * QuoteSection component for displaying a daily motivational quote
 * Respects user preference to show/hide quotes stored in localStorage
 */
const QuoteSection = ({ className = "" }: QuoteSectionProps) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has disabled quotes
    const showQuotes = localStorage.getItem("showMotivationalQuote");

    // If explicitly set to "false", don't fetch or show quotes
    if (showQuotes === "false") {
      setLoading(false);
      return;
    }

    // If not set, default to true and save preference
    if (showQuotes === null) {
      localStorage.setItem("showMotivationalQuote", "true");
    }

    const fetchQuote = async () => {
      try {
        // Try to fetch from API
        const quoteData = await quoteService.getDailyQuote();
        setQuote(quoteData);
      } catch (error) {
        console.error("Error fetching quote from API:", error);

        // Use fallback quote if API fails
        const fallbackQuote = getFallbackQuote();
        setQuote({
          id: fallbackQuote.id,
          text: fallbackQuote.text,
          author: fallbackQuote.author,
          category: fallbackQuote.category
        });

        setError("Using fallback quote due to API error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  // If quotes are disabled or there's no quote to show, return null
  if (localStorage.getItem("showMotivationalQuote") === "false" || (!loading && !quote)) {
    return null;
  }

  return (
    <motion.div
      className={`mb-6 sm:mb-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-16 h-16 text-blue-50 opacity-30">
          <QuoteIcon size={64} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-pulse text-blue-500">Loading quote...</div>
          </div>
        ) : (
          <>
            <div className="quote-container relative z-10">
              <span className="quote-icon text-4xl text-blue-400 font-serif leading-none absolute -left-1 -top-2">
                ❝
              </span>
              <p className="quote-text text-gray-700 dark:text-gray-200 text-lg sm:text-xl font-medium italic pl-6 pr-4 mb-3 max-w-3xl">
                "{quote?.text}"
              </p>
              <p className="quote-attribution text-blue-600 dark:text-blue-400 text-sm sm:text-base font-medium text-right pr-4">
                — {quote?.author}
              </p>
            </div>
            {error && (
              <p className="text-xs text-orange-500 mt-2 italic">
                {error}
              </p>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QuoteSection;
