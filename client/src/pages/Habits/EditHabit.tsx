import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Info,
  Loader,
  AlertCircle
} from "lucide-react";
import { useHabits } from "../../hooks/useHabits";
import { habitService, type Habit, type UpdateHabitRequest } from "../../services/habitService";
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

const EditHabitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateHabit } = useHabits();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState<UpdateHabitRequest>({
    name: "",
    target_type: "daily",
    target_days: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  // Fetch habit data
  useEffect(() => {
    const fetchHabit = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const habitData = await habitService.getHabitById(Number(id));
        setHabit(habitData);

        // Initialize form data
        setFormData({
          name: habitData.name,
          target_type: habitData.target_type,
          target_days: habitData.target_days || [],
        });

        // Reset form changed flag
        setFormChanged(false);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching habit:", error);
        setError("Failed to load habit. Please try again.");
        setLoading(false);
      }
    };

    fetchHabit();
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Habit name is required";
    }

    if (!formData.target_type) {
      newErrors.target_type = "Target type is required";
    }

    if (formData.target_type === "custom" && (!formData.target_days || formData.target_days.length === 0)) {
      newErrors.target_days = "Please select at least one day for custom habits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Mark form as changed
    setFormChanged(true);

    // Special handling for target_type to reset target_days when changing from custom to other types
    if (name === 'target_type' && value !== 'custom' && formData.target_type === 'custom') {
      setFormData(prev => ({
        ...prev,
        target_type: value as "daily" | "weekdays" | "custom",
        target_days: [] // Reset target_days when switching from custom to other types
      }));
    } else {
      if (name === 'target_type') {
        setFormData(prev => ({
          ...prev,
          target_type: value as "daily" | "weekdays" | "custom"
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }

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
    // Mark form as changed
    setFormChanged(true);

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

    if (!validateForm() || !id) {
      showToast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create a copy of the form data to submit
      const habitData: UpdateHabitRequest = {
        ...formData,
        // Only include target_days if target_type is custom
        target_days: formData.target_type === "custom" ? formData.target_days : undefined,
      };

      await updateHabit(Number(id), habitData);
      setFormChanged(false);
      showToast.success("Habit updated successfully");
      navigate(`/habits/${id}`);
    } catch (error) {
      console.error("Error updating habit:", error);
      showToast.error("Failed to update habit. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-6">
            <Link
              to={`/habits/${id}`}
              className="mr-4 p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Edit Habit</h1>
          </div>
          <div className="flex items-center justify-center p-12">
            <Loader size={32} className="text-blue-500 animate-spin" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !habit) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-6">
            <Link
              to="/habits"
              className="mr-4 p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Edit Habit</h1>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-red-800 flex items-start">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium">{error || "Habit not found"}</p>
              <p className="text-sm mt-1">The habit you're trying to edit could not be found or loaded.</p>
              <button
                className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors inline-flex items-center"
                onClick={() => navigate("/habits")}
              >
                <ArrowLeft size={16} className="mr-2" />
                Return to habits
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
      <div className="flex items-center mb-6">
        <Link
          to={`/habits/${id}`}
          className="mr-4 p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Edit Habit</h1>
          {formChanged && (
            <span className="ml-3 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Unsaved Changes
            </span>
          )}
        </div>
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

          {/* Start Date (read-only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={habit.start_date}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-blue-100 bg-gray-50 text-gray-500 pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Start date cannot be changed
            </p>
          </div>

          {/* Info Box */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg flex items-start">
            <Info className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-blue-700">
              Changing the habit frequency will not affect your past check-ins, but it will change which days you're expected to complete this habit going forward.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8">
            {showCancelConfirm ? (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                >
                  Keep Editing
                </button>
                <Link
                  to={`/habits/${id}`}
                  className="px-4 py-2 rounded-lg border border-red-100 bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                >
                  Discard Changes
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => formChanged ? setShowCancelConfirm(true) : navigate(`/habits/${id}`)}
                className="px-4 py-2 rounded-lg border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
            )}
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
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  Save Changes
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

export default EditHabitPage;
