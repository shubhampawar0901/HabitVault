import type { Habit as BaseHabit } from "../services/habitService";

// Extended Habit type with additional UI-specific properties
export interface ExtendedHabit extends BaseHabit {
  description?: string; // Optional description field for UI display
  completion_rate?: number; // Optional completion rate percentage
}
