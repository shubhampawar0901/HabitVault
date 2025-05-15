import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Info
} from "lucide-react";
import { useHabits } from "../../hooks/useHabits";
import type { CreateHabitRequest } from "../../services/habitService";
import { showToast } from "../../components/common/Toast";
import AppLayout from "../../components/layout/AppLayout";

const daysOfWeek = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

const AddHabitPage: React.FC = () => {
  const navigate = useNavigate();
  const { createHabit } = useHabits();

  const [formData, setFormData] = useState<CreateHabitRequest>({
    name: "",
    target_type: "daily",
    start_date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    target_days: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Habit name is required";
    }

    if (!formData.target_type) {
      newErrors.target_type = "Target type is required";
    }

    if (formData.target_type === "custom" && (!formData.target_days || formData.target_days.length === 0)) {
      newErrors.target_days = "Please select at least one day for custom habits";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const currentDays = prev.target_days || [];
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];

      return { ...prev, target_days: newDays };
    });

    // Clear target_days error if days are selected
    if (errors.target_days) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.target_days;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create a copy of the form data to submit
      const habitData: CreateHabitRequest = {
        ...formData,
        // Only include target_days if target_type is custom
        target_days: formData.target_type === "custom" ? formData.target_days : undefined,
      };

      await createHabit(habitData);
      navigate("/habits");
    } catch (error) {
      console.error("Error creating habit:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            to="/habits"
            className="mr-4 p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Add New Habit</h1>
        </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm max-w-2xl mx-auto"
      >
        <form onSubmit={handleSubmit}>
          {/* Habit Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Habit Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Drink Water, Read, Exercise"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? "border-red-300 focus:ring-red-500" : "border-blue-100 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300`}
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {50 - (formData.name?.length || 0)} characters remaining
            </p>
          </div>

          {/* Target Type */}
          <div className="mb-6">
            <label htmlFor="target_type" className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              id="target_type"
              name="target_type"
              value={formData.target_type}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.target_type ? "border-red-300 focus:ring-red-500" : "border-blue-100 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 bg-white`}
            >
              <option value="daily">Daily (Every day)</option>
              <option value="weekdays">Weekdays (Monday-Friday)</option>
              <option value="custom">Custom (Select specific days)</option>
            </select>
            {errors.target_type && (
              <p className="mt-1 text-sm text-red-500">{errors.target_type}</p>
            )}
          </div>

          {/* Custom Days Selection */}
          {formData.target_type === "custom" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => handleDayToggle(day.key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.target_days?.includes(day.key)
                        ? "bg-blue-500 text-white"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.target_days && (
                <p className="mt-1 text-sm text-red-500">{errors.target_days}</p>
              )}
            </div>
          )}

          {/* Start Date */}
          <div className="mb-6">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.start_date ? "border-red-300 focus:ring-red-500" : "border-blue-100 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pl-10`}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={16} />
            </div>
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg flex items-start">
            <Info className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-blue-700">
              Habits work best when they're specific and actionable. For example, "Read for 20 minutes" is better than just "Read".
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8">
            <Link
              to="/habits"
              className="px-4 py-2 rounded-lg border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  Create Habit
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
      </div>
    </AppLayout>
  );
};

export default AddHabitPage;
