/**
 * Fallback quotes data for when the API is not available
 */
export interface QuoteData {
  id: number;
  text: string;
  author: string;
  category?: string;
}

/**
 * Fallback quotes data
 */
export const FALLBACK_QUOTES: QuoteData[] = [
  {
    id: 1,
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "motivation",
  },
  {
    id: 2,
    text: "It's not about perfect. It's about effort.",
    author: "Jillian Michaels",
    category: "motivation",
  },
  {
    id: 3,
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "motivation",
  },
  {
    id: 4,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
  },
  {
    id: 5,
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation",
  },
  {
    id: 6,
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation",
  },
  {
    id: 7,
    text: "Your habits will determine your future.",
    author: "Jack Canfield",
    category: "habits",
  },
  {
    id: 8,
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "habits",
  },
  {
    id: 9,
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun",
    category: "habits",
  },
  {
    id: 10,
    text: "Habits are the compound interest of self-improvement.",
    author: "James Clear",
    category: "habits",
  },
  {
    id: 11,
    text: "Small habits make a big difference.",
    author: "James Clear",
    category: "habits",
  },
  {
    id: 12,
    text: "The quality of your life depends on the quality of your habits.",
    author: "Brian Tracy",
    category: "habits",
  },
  {
    id: 13,
    text: "You'll never change your life until you change something you do daily.",
    author: "John C. Maxwell",
    category: "habits",
  },
  {
    id: 14,
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: "discipline",
  },
  {
    id: 15,
    text: "The difference between who you are and who you want to be is what you do.",
    author: "Unknown",
    category: "motivation",
  },
];

/**
 * Get a quote for the current day from the fallback quotes
 * @returns A quote for today based on the day of the year
 */
export const getDailyQuote = (): QuoteData => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const quoteIndex = dayOfYear % FALLBACK_QUOTES.length;
  return FALLBACK_QUOTES[quoteIndex];
};
/**
 * Get a random quote from the fallback quotes
 * @returns A random quote
 */
export const getRandomQuote = (): QuoteData => {
  const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
  return FALLBACK_QUOTES[randomIndex];
};
