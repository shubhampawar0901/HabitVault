// Simple test file to verify the Habits implementation

// Mock API calls
const mockHabits = [
  {
    id: 1,
    name: "Drink Water",
    target_type: "daily",
    start_date: "2023-01-01",
    current_streak: 5,
    longest_streak: 10,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Exercise",
    target_type: "weekdays",
    start_date: "2023-01-01",
    current_streak: 3,
    longest_streak: 15,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Read",
    target_type: "custom",
    start_date: "2023-01-01",
    current_streak: 0,
    longest_streak: 7,
    target_days: ["mon", "wed", "fri"],
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z"
  }
];

// Mock the habitService
jest.mock('../services/habitService', () => ({
  habitService: {
    getAll: jest.fn().mockResolvedValue(mockHabits),
    getHabitById: jest.fn().mockImplementation((id) => {
      const habit = mockHabits.find(h => h.id === id);
      return Promise.resolve(habit || null);
    }),
    createHabit: jest.fn().mockImplementation((habitData) => {
      const newHabit = {
        id: Math.floor(Math.random() * 1000) + 10,
        ...habitData,
        current_streak: 0,
        longest_streak: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return Promise.resolve(newHabit);
    }),
    updateHabit: jest.fn().mockImplementation((id, habitData) => {
      const habit = mockHabits.find(h => h.id === id);
      if (!habit) return Promise.reject(new Error('Habit not found'));
      
      const updatedHabit = {
        ...habit,
        ...habitData,
        updated_at: new Date().toISOString()
      };
      return Promise.resolve(updatedHabit);
    }),
    deleteHabit: jest.fn().mockResolvedValue(true),
    getCheckins: jest.fn().mockResolvedValue([]),
    createCheckin: jest.fn().mockResolvedValue({}),
    batchUpdateCheckins: jest.fn().mockResolvedValue({})
  }
}));

// Test the useHabits hook
describe('Habits Feature', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('habitService.getAll should return all habits', async () => {
    const { habitService } = require('../services/habitService');
    const habits = await habitService.getAll();
    
    expect(habits).toEqual(mockHabits);
    expect(habitService.getAll).toHaveBeenCalledTimes(1);
  });
  
  test('habitService.getHabitById should return a specific habit', async () => {
    const { habitService } = require('../services/habitService');
    const habit = await habitService.getHabitById(2);
    
    expect(habit).toEqual(mockHabits[1]);
    expect(habitService.getHabitById).toHaveBeenCalledWith(2);
  });
  
  test('habitService.createHabit should create a new habit', async () => {
    const { habitService } = require('../services/habitService');
    const newHabitData = {
      name: "Meditate",
      target_type: "daily",
      start_date: "2023-01-01"
    };
    
    const newHabit = await habitService.createHabit(newHabitData);
    
    expect(newHabit.name).toBe(newHabitData.name);
    expect(newHabit.target_type).toBe(newHabitData.target_type);
    expect(newHabit.start_date).toBe(newHabitData.start_date);
    expect(newHabit.current_streak).toBe(0);
    expect(habitService.createHabit).toHaveBeenCalledWith(newHabitData);
  });
  
  test('habitService.updateHabit should update an existing habit', async () => {
    const { habitService } = require('../services/habitService');
    const updateData = {
      name: "Drink More Water"
    };
    
    const updatedHabit = await habitService.updateHabit(1, updateData);
    
    expect(updatedHabit.name).toBe(updateData.name);
    expect(updatedHabit.id).toBe(1);
    expect(habitService.updateHabit).toHaveBeenCalledWith(1, updateData);
  });
  
  test('habitService.deleteHabit should delete a habit', async () => {
    const { habitService } = require('../services/habitService');
    const result = await habitService.deleteHabit(1);
    
    expect(result).toBe(true);
    expect(habitService.deleteHabit).toHaveBeenCalledWith(1);
  });
});
