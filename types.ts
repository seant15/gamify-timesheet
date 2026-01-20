
export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export interface PillarDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  color: string; // Base color name (e.g., 'indigo', 'emerald')
  pointsPerHour: number;
  bgClass: string;
  borderClass: string;
  textClass: string;
  accentClass: string;
}

export interface Task {
  id: string;
  title: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  durationMinutes: number;
  completed: boolean;
  pillarId: string;
  day: DayOfWeek;
  createdAt: number;
  tags: string[];
  notes?: string;
  category?: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
  claimed: boolean;
}

export interface UserStats {
  totalCredits: number;
  lifetimeEarnings: number;
  level: number;
}

export interface AppSettings {
  creditsPerMinute: number;
}

export interface DailySummary {
  focusAdvice: string;
  suggestedTasks: string[];
}
