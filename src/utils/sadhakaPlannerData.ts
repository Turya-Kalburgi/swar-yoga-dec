// Sadhaka Planner Data Management - Local Storage + Supabase Integration

import axios from 'axios';

const API_URL = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL 
  ? (import.meta as any).env.VITE_API_URL 
  : 'https://swar-yoga-dec.onrender.com/api';

// Local storage keys
const STORAGE_KEY_VISIONS = 'sadhaka_visions';
const STORAGE_KEY_GOALS = 'sadhaka_goals';
const STORAGE_KEY_MILESTONES = 'sadhaka_milestones';
const STORAGE_KEY_TASKS = 'sadhaka_tasks';
const STORAGE_KEY_MYWORDS = 'sadhaka_mywords';
const STORAGE_KEY_TODOS = 'sadhaka_todos';
const STORAGE_KEY_REMINDERS = 'sadhaka_reminders';
const STORAGE_KEY_DAILY_PLANS = 'sadhaka_daily_plans';
const STORAGE_KEY_HEALTH = 'sadhaka_health';

// Helper function to generate ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to get user-specific storage key
const getUserStorageKey = (key: string, userId: string) => {
  if (!userId) {
    console.warn('⚠️ WARNING: getUserStorageKey called without userId');
  }
  return `${key}_${userId}`;
};

// ============ TYPE DEFINITIONS ============

export interface Vision {
  id?: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  timelineMonths: number;
  startDate: string;
  targetDate: string;
  status: 'Active' | 'Completed' | 'On Hold';
  createdAt?: string;
  updatedAt?: string;
}

export interface Goal {
  id?: string;
  userId: string;
  visionId: string;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Milestone {
  id?: string;
  userId: string;
  goalId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  dueDate: string;
  recurrence: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  status: 'Pending' | 'In Progress' | 'Completed';
  isOverdue?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyWord {
  id?: string;
  userId: string;
  commitment: string;
  committedDate: string;
  completionDeadline: string;
  recurrence: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  status: 'Pending' | 'In Progress' | 'Completed';
  isOverdue?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Todo {
  id?: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reminder {
  id?: string;
  userId: string;
  title: string;
  description: string;
  reminderDate: string;
  reminderTime: string;
  notificationType: 'Email' | 'Push' | 'In-App';
  status: 'Pending' | 'Sent' | 'Dismissed';
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyPlan {
  id?: string;
  userId: string;
  date: string;
  routine: string;
  waterIntake: number;
  sadhanaMinutes: number;
  exerciseMinutes: number;
  exerciseType: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthTracker {
  id?: string;
  userId: string;
  date: string;
  weight: number;
  bloodPressure: string;
  sleepHours: number;
  mood: string;
  energyLevel: number;
  hydration: number;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============ UTILITY FUNCTIONS ============

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
};

export const daysUntilDue = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

// ============ API FUNCTIONS ============

// VISIONS API
export const visionAPI = {
  getAll: async (userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_VISIONS, userId);
      const stored = localStorage.getItem(storageKey);
      const visions = stored ? JSON.parse(stored) : [];
      console.log(`📂 Loaded ${visions.length} visions for user ${userId}`);
      return visions;
    } catch (error) {
      console.error('❌ Error fetching visions:', error);
      return [];
    }
  },

  create: async (data: Vision) => {
    try {
      if (!data.userId) {
        console.error('❌ Cannot create vision: userId is required');
        throw new Error('userId is required for creating vision');
      }
      
      const storageKey = getUserStorageKey(STORAGE_KEY_VISIONS, data.userId);
      const visions = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newVision = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      visions.push(newVision);
      localStorage.setItem(storageKey, JSON.stringify(visions));
      
      console.log(`✅ Vision created successfully:`, newVision);
      console.log(`💾 Saved to localStorage key: ${storageKey}`);
      return newVision;
    } catch (error: any) {
      console.error('❌ Error creating vision:', error.message);
      throw new Error(error.message || 'Failed to create vision');
    }
  },

  update: async (id: string, data: Partial<Vision>) => {
    try {
      if (!data.userId) {
        console.error('❌ Cannot update vision: userId is required');
        throw new Error('userId is required');
      }
      
      const storageKey = getUserStorageKey(STORAGE_KEY_VISIONS, data.userId);
      const visions = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = visions.findIndex((v: Vision) => v.id === id);
      if (index === -1) {
        console.error(`❌ Vision not found with id: ${id}`);
        throw new Error('Vision not found');
      }
      
      visions[index] = { ...visions[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(visions));
      
      console.log(`✅ Vision updated successfully:`, visions[index]);
      return visions[index];
    } catch (error: any) {
      console.error('❌ Error updating vision:', error.message);
      throw new Error(error.message || 'Failed to update vision');
    }
  },

  delete: async (id: string, userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_VISIONS, userId);
      const visions = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const initialCount = visions.length;
      const filtered = visions.filter((v: Vision) => v.id !== id);
      
      if (filtered.length === initialCount) {
        console.warn(`⚠️ Vision not found with id: ${id}`);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      console.log(`✅ Vision deleted. Remaining: ${filtered.length}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error deleting vision:', error.message);
      throw new Error(error.message || 'Failed to delete vision');
    }
  }
};

// GOALS API
export const goalAPI = {
  getAll: async (userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_GOALS, userId);
      const stored = localStorage.getItem(storageKey);
      const goals = stored ? JSON.parse(stored) : [];
      console.log(`📂 Loaded ${goals.length} goals for user ${userId}`);
      return goals;
    } catch (error) {
      console.error('❌ Error fetching goals:', error);
      return [];
    }
  },

  create: async (data: Goal) => {
    try {
      if (!data.userId) {
        console.error('❌ Cannot create goal: userId is required');
        throw new Error('userId is required for creating goal');
      }
      
      const storageKey = getUserStorageKey(STORAGE_KEY_GOALS, data.userId);
      const goals = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newGoal = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      goals.push(newGoal);
      localStorage.setItem(storageKey, JSON.stringify(goals));
      
      console.log(`✅ Goal created successfully:`, newGoal);
      console.log(`💾 Saved to localStorage key: ${storageKey}`);
      return newGoal;
    } catch (error: any) {
      console.error('❌ Error creating goal:', error.message);
      throw new Error(error.message || 'Failed to create goal');
    }
  },

  update: async (id: string, data: Partial<Goal>) => {
    try {
      if (!data.userId) {
        console.error('❌ Cannot update goal: userId is required');
        throw new Error('userId is required');
      }
      
      const storageKey = getUserStorageKey(STORAGE_KEY_GOALS, data.userId);
      const goals = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = goals.findIndex((g: Goal) => g.id === id);
      if (index === -1) {
        console.error(`❌ Goal not found with id: ${id}`);
        throw new Error('Goal not found');
      }
      
      goals[index] = { ...goals[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(goals));
      
      console.log(`✅ Goal updated successfully:`, goals[index]);
      return goals[index];
    } catch (error: any) {
      console.error('❌ Error updating goal:', error.message);
      throw new Error(error.message || 'Failed to update goal');
    }
  },

  delete: async (id: string, userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_GOALS, userId);
      const goals = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const initialCount = goals.length;
      const filtered = goals.filter((g: Goal) => g.id !== id);
      
      if (filtered.length === initialCount) {
        console.warn(`⚠️ Goal not found with id: ${id}`);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      console.log(`✅ Goal deleted. Remaining: ${filtered.length}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error deleting goal:', error.message);
      throw new Error(error.message || 'Failed to delete goal');
    }
  }
};

// MILESTONES API
export const milestoneAPI = {
  getAll: async (userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_MILESTONES, userId);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
  },

  create: async (data: Milestone) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_MILESTONES, data.userId);
      const milestones = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newMilestone = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      milestones.push(newMilestone);
      localStorage.setItem(storageKey, JSON.stringify(milestones));
      return newMilestone;
    } catch (error: any) {
      console.error('Error creating milestone:', error);
      throw new Error(error.message || 'Failed to create milestone');
    }
  },

  update: async (id: string, data: Partial<Milestone>) => {
    try {
      if (!data.userId) throw new Error('userId is required');
      const storageKey = getUserStorageKey(STORAGE_KEY_MILESTONES, data.userId);
      const milestones = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = milestones.findIndex((m: Milestone) => m.id === id);
      if (index === -1) throw new Error('Milestone not found');
      milestones[index] = { ...milestones[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(milestones));
      return milestones[index];
    } catch (error: any) {
      console.error('Error updating milestone:', error);
      throw new Error(error.message || 'Failed to update milestone');
    }
  },

  delete: async (id: string, userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_MILESTONES, userId);
      const milestones = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = milestones.filter((m: Milestone) => m.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      return true;
    } catch (error: any) {
      console.error('Error deleting milestone:', error);
      throw new Error(error.message || 'Failed to delete milestone');
    }
  }
};

// TASKS API
export const taskAPI = {
  getAll: async (userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_TASKS, userId);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  getTodaysTasks: async (userId: string) => {
    try {
      const tasks = await taskAPI.getAll(userId);
      const today = new Date().toDateString();
      return tasks.filter((t: Task) => new Date(t.dueDate).toDateString() === today);
    } catch (error) {
      console.error('Error fetching today tasks:', error);
      return [];
    }
  },

  getOverdueTasks: async (userId: string) => {
    try {
      const tasks = await taskAPI.getAll(userId);
      return tasks.filter((t: Task) => isOverdue(t.dueDate) && t.status !== 'Completed');
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      return [];
    }
  },

  create: async (data: Task) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_TASKS, data.userId);
      const tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newTask = {
        ...data,
        id: generateId(),
        isOverdue: isOverdue(data.dueDate),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      tasks.push(newTask);
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      return newTask;
    } catch (error: any) {
      console.error('Error creating task:', error);
      throw new Error(error.message || 'Failed to create task');
    }
  },

  update: async (id: string, data: Partial<Task>) => {
    try {
      if (!data.userId) throw new Error('userId is required');
      const storageKey = getUserStorageKey(STORAGE_KEY_TASKS, data.userId);
      const tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = tasks.findIndex((t: Task) => t.id === id);
      if (index === -1) throw new Error('Task not found');
      tasks[index] = {
        ...tasks[index],
        ...data,
        isOverdue: data.dueDate ? isOverdue(data.dueDate) : tasks[index].isOverdue,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      return tasks[index];
    } catch (error: any) {
      console.error('Error updating task:', error);
      throw new Error(error.message || 'Failed to update task');
    }
  },

  delete: async (id: string, userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_TASKS, userId);
      const tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = tasks.filter((t: Task) => t.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw new Error(error.message || 'Failed to delete task');
    }
  }
};

// MY WORD API
export const myWordAPI = {
  getAll: async (userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_MYWORDS, userId);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error fetching my words:', error);
      return [];
    }
  },

  getOverdueCommitments: async (userId: string) => {
    try {
      const words = await myWordAPI.getAll(userId);
      return words.filter((w: MyWord) => isOverdue(w.completionDeadline) && w.status !== 'Completed');
    } catch (error) {
      console.error('Error fetching overdue commitments:', error);
      return [];
    }
  },

  create: async (data: MyWord) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_MYWORDS, data.userId);
      const words = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newWord = {
        ...data,
        id: generateId(),
        isOverdue: isOverdue(data.completionDeadline),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      words.push(newWord);
      localStorage.setItem(storageKey, JSON.stringify(words));
      return newWord;
    } catch (error: any) {
      console.error('Error creating my word:', error);
      throw new Error(error.message || 'Failed to create commitment');
    }
  },

  update: async (id: string, data: Partial<MyWord>) => {
    try {
      if (!data.userId) throw new Error('userId is required');
      const storageKey = getUserStorageKey(STORAGE_KEY_MYWORDS, data.userId);
      const words = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = words.findIndex((w: MyWord) => w.id === id);
      if (index === -1) throw new Error('Commitment not found');
      words[index] = {
        ...words[index],
        ...data,
        isOverdue: data.completionDeadline ? isOverdue(data.completionDeadline) : words[index].isOverdue,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(words));
      return words[index];
    } catch (error: any) {
      console.error('Error updating my word:', error);
      throw new Error(error.message || 'Failed to update commitment');
    }
  },

  delete: async (id: string, userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_MYWORDS, userId);
      const words = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = words.filter((w: MyWord) => w.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      return true;
    } catch (error: any) {
      console.error('Error deleting my word:', error);
      throw new Error(error.message || 'Failed to delete commitment');
    }
  }
};

// TODOS API
export const todoAPI = {
  getAll: async (userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_TODOS, userId);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
  },

  create: async (data: Todo) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_TODOS, data.userId);
      const todos = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newTodo = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      todos.push(newTodo);
      localStorage.setItem(storageKey, JSON.stringify(todos));
      return newTodo;
    } catch (error: any) {
      console.error('Error creating todo:', error);
      throw new Error(error.message || 'Failed to create todo');
    }
  },

  update: async (id: string, data: Partial<Todo>) => {
    try {
      if (!data.userId) throw new Error('userId is required');
      const storageKey = getUserStorageKey(STORAGE_KEY_TODOS, data.userId);
      const todos = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = todos.findIndex((t: Todo) => t.id === id);
      if (index === -1) throw new Error('Todo not found');
      todos[index] = { ...todos[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(todos));
      return todos[index];
    } catch (error: any) {
      console.error('Error updating todo:', error);
      throw new Error(error.message || 'Failed to update todo');
    }
  },

  delete: async (id: string, userId: string) => {
    try {
      const storageKey = getUserStorageKey(STORAGE_KEY_TODOS, userId);
      const todos = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = todos.filter((t: Todo) => t.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      return true;
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      throw new Error(error.message || 'Failed to delete todo');
    }
  }
};

// REMINDERS API - Using Backend
export const reminderAPI = {
  getAll: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/reminders`, {
        headers: { 'X-User-ID': userId }
      });
      console.log(`📂 Loaded ${response.data.length || 0} reminders for user ${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  },

  getUpcoming: async (userId: string) => {
    try {
      const reminders = await reminderAPI.getAll(userId);
      return reminders.filter((r: Reminder) => r.status !== 'Sent' && r.status !== 'Dismissed');
    } catch (error) {
      console.error('Error fetching upcoming reminders:', error);
      return [];
    }
  },

  create: async (data: Reminder) => {
    try {
      const response = await axios.post(`${API_URL}/reminders`, data, {
        headers: { 'X-User-ID': data.userId }
      });
      console.log('✅ Reminder created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating reminder:', error);
      throw new Error(error.response?.data?.message || 'Failed to create reminder');
    }
  },

  update: async (id: string, data: Partial<Reminder>) => {
    try {
      const response = await axios.put(`${API_URL}/reminders/${id}`, data, {
        headers: { 'X-User-ID': data.userId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating reminder:', error);
      throw new Error(error.response?.data?.message || 'Failed to update reminder');
    }
  },

  delete: async (id: string, userId: string) => {
    try {
      await axios.delete(`${API_URL}/reminders/${id}`, {
        headers: { 'X-User-ID': userId }
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting reminder:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete reminder');
    }
  }
};

// DAILY PLAN API - Using Backend
export const dailyPlanAPI = {
  getByDate: async (userId: string, date: string) => {
    try {
      const response = await axios.get(`${API_URL}/dailyplans/${date}`, {
        headers: { 'X-User-ID': userId }
      });
      return response.data || null;
    } catch (error) {
      console.error('Error fetching daily plan:', error);
      return null;
    }
  },

  create: async (data: DailyPlan) => {
    try {
      const response = await axios.post(`${API_URL}/dailyplans`, data, {
        headers: { 'X-User-ID': data.userId }
      });
      console.log('✅ Daily plan created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating daily plan:', error);
      throw new Error(error.response?.data?.message || 'Failed to create daily plan');
    }
  },

  update: async (id: string, data: Partial<DailyPlan>) => {
    try {
      const response = await axios.put(`${API_URL}/dailyplans/${id}`, data, {
        headers: { 'X-User-ID': data.userId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating daily plan:', error);
      throw new Error(error.response?.data?.message || 'Failed to update daily plan');
    }
  }
};

// HEALTH TRACKER API - Using Backend
export const healthTrackerAPI = {
  getByDate: async (userId: string, date: string) => {
    try {
      const response = await axios.get(`${API_URL}/health/${date}`, {
        headers: { 'X-User-ID': userId }
      });
      return response.data || null;
    } catch (error) {
      console.error('Error fetching health data:', error);
      return null;
    }
  },

  getRange: async (userId: string, startDate: string, endDate: string) => {
    try {
      const response = await axios.get(`${API_URL}/health`, {
        params: { startDate, endDate },
        headers: { 'X-User-ID': userId }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching health range:', error);
      return [];
    }
  },

  create: async (data: HealthTracker) => {
    try {
      const response = await axios.post(`${API_URL}/health`, data, {
        headers: { 'X-User-ID': data.userId }
      });
      console.log('✅ Health record created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating health record:', error);
      throw new Error(error.response?.data?.message || 'Failed to create health record');
    }
  },

  update: async (id: string, data: Partial<HealthTracker>) => {
    try {
      const response = await axios.put(`${API_URL}/health/${id}`, data, {
        headers: { 'X-User-ID': data.userId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating health record:', error);
      throw new Error(error.response?.data?.message || 'Failed to update health record');
    }
  }
};
