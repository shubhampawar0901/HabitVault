import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import HabitCard from "../../components/habits/HabitCard";
import type { ExtendedHabit } from "../../types/habit.types";

// Sample habits for demonstration
const sampleHabits: ExtendedHabit[] = [
  {
    id: 1,
    name: "Meditate",
    description: "10 minutes of mindfulness meditation",
    target_type: "daily",
    start_date: "2023-01-01",
    current_streak: 9,
    longest_streak: 15,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-05T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Drink 2L of water",
    description: "Stay hydrated throughout the day",
    target_type: "daily",
    start_date: "2023-01-01",
    current_streak: 12,
    longest_streak: 20,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-05T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Read a book",
    description: "Read at least 20 pages",
    target_type: "weekdays",
    start_date: "2023-01-01",
    current_streak: 0,
    longest_streak: 10,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-05T00:00:00.000Z"
  }
];

const HabitCardDemo = () => {
  // Track habit statuses
  const [habitStatuses, setHabitStatuses] = useState<Record<number, "completed" | "missed" | "not-marked">>({
    1: "not-marked", // Meditate - Not Marked
    2: "completed",  // Drink water - Completed
    3: "missed"      // Read a book - Missed
  });

  // Toggle habit completion status
  const toggleHabitCompletion = (id: number) => {
    setHabitStatuses(prev => {
      const currentStatus = prev[id];
      let newStatus: "completed" | "missed" | "not-marked";

      // Cycle through states: not-marked -> completed -> missed -> not-marked
      if (currentStatus === "not-marked") {
        newStatus = "completed";
      } else if (currentStatus === "completed") {
        newStatus = "missed";
      } else {
        newStatus = "not-marked";
      }

      return { ...prev, [id]: newStatus };
    });
  };

  // Delete habit (just for demo)
  const deleteHabit = (id: number) => {
    console.log(`Delete habit ${id}`);
    // In a real app, you would call an API to delete the habit
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Habit Card Component Demo</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">All Three States</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleCompletion={toggleHabitCompletion}
                isCompletedToday={habitStatuses[habit.id] === "completed"}
                isMissedToday={habitStatuses[habit.id] === "missed"}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Compact Version (No Stats)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleCompletion={toggleHabitCompletion}
                isCompletedToday={habitStatuses[habit.id] === "completed"}
                isMissedToday={habitStatuses[habit.id] === "missed"}
                showStats={false}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Mobile Layout (Single Column)</h2>
          <div className="max-w-sm mx-auto space-y-4">
            {sampleHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleCompletion={toggleHabitCompletion}
                isCompletedToday={habitStatuses[habit.id] === "completed"}
                isMissedToday={habitStatuses[habit.id] === "missed"}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HabitCardDemo;
