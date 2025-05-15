/**
 * Utility functions for working with localStorage
 */

// Keys for localStorage
export const STORAGE_KEYS = {
  DARK_MODE: 'darkMode',
  ANALYTICS_DATE_RANGE: 'analyticsDateRange',
  ANALYTICS_PERIOD: 'analyticsPeriod',
};

/**
 * Save a value to localStorage with the given key
 * @param key The key to store the value under
 * @param value The value to store
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage with key "${key}":`, error);
  }
};

/**
 * Get a value from localStorage by key
 * @param key The key to retrieve the value for
 * @param defaultValue The default value to return if the key doesn't exist
 * @returns The stored value or the default value
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Error retrieving from localStorage with key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Remove a value from localStorage by key
 * @param key The key to remove
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage with key "${key}":`, error);
  }
};

/**
 * Save date range to localStorage
 * @param startDate The start date
 * @param endDate The end date
 */
export const saveDateRangeToLocalStorage = (startDate: Date, endDate: Date): void => {
  saveToLocalStorage(STORAGE_KEYS.ANALYTICS_DATE_RANGE, {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
};

/**
 * Get date range from localStorage
 * @param defaultStartDate Default start date if not found in localStorage
 * @param defaultEndDate Default end date if not found in localStorage
 * @returns The stored date range or the default values
 */
export const getDateRangeFromLocalStorage = (
  defaultStartDate: Date,
  defaultEndDate: Date
): { startDate: Date; endDate: Date } => {
  const dateRange = getFromLocalStorage<{ startDate: string; endDate: string }>(
    STORAGE_KEYS.ANALYTICS_DATE_RANGE,
    {
      startDate: defaultStartDate.toISOString(),
      endDate: defaultEndDate.toISOString(),
    }
  );

  try {
    // Parse dates from stored strings
    const parsedStartDate = new Date(dateRange.startDate);
    const parsedEndDate = new Date(dateRange.endDate);

    // Validate dates
    const isStartDateValid = !isNaN(parsedStartDate.getTime());
    const isEndDateValid = !isNaN(parsedEndDate.getTime());

    // If both dates are valid, ensure start date is before or equal to end date
    if (isStartDateValid && isEndDateValid) {
      if (parsedStartDate <= parsedEndDate) {
        return {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        };
      } else {
        console.warn('Invalid date range: start date is after end date. Using defaults.');
      }
    } else {
      console.warn('Invalid date(s) in localStorage. Using defaults.');
    }

    // Return defaults if validation fails
    return {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    };
  } catch (error) {
    console.error('Error parsing date range from localStorage:', error);
    return {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    };
  }
};

/**
 * Save analytics period to localStorage
 * @param period The period value
 */
export const savePeriodToLocalStorage = (
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
): void => {
  saveToLocalStorage(STORAGE_KEYS.ANALYTICS_PERIOD, period);
};

/**
 * Get analytics period from localStorage
 * @param defaultPeriod Default period if not found in localStorage
 * @returns The stored period or the default value
 */
export const getPeriodFromLocalStorage = (
  defaultPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly'
): 'daily' | 'weekly' | 'monthly' | 'yearly' => {
  const storedPeriod = getFromLocalStorage<string>(
    STORAGE_KEYS.ANALYTICS_PERIOD,
    defaultPeriod
  );

  // Validate that the stored period is one of the allowed values
  const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
  if (validPeriods.includes(storedPeriod)) {
    return storedPeriod as 'daily' | 'weekly' | 'monthly' | 'yearly';
  }

  // Return default if validation fails
  console.warn(`Invalid period "${storedPeriod}" in localStorage. Using default.`);
  return defaultPeriod;
};
