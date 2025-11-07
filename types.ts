export type Protocol = 12 | 16 | 24 | 36 | 48 | 72;
export type Frequency = 'daily' | 'everyOtherDay' | 'weekly' | 'custom';
export type DayOfWeek = 'Pondelok' | 'Utorok' | 'Streda' | 'Štvrtok' | 'Piatok' | 'Sobota' | 'Nedeľa';

// Type for logging emotions and difficulty
export interface FeelingRecord {
  difficulty: number; // 1-5
  feeling: string; // Emoji character
}

// Represents the data for a single day's fast.
export interface FastingData {
  isFasting: boolean;
  fastingLength?: Protocol;
  startTime?: Date;
  endTime?: Date;
  goal?: string;
  completed?: boolean; // To track if the fast was completed
  feelingRecord?: FeelingRecord; // New field for emotion/difficulty log
  note?: string; // Field for user notes
}

// The plan will now be a record mapping a date string ('YYYY-MM-DD') to fasting data.
export type Plan = Record<string, FastingData>;

// Types for filtering
export type FilterStatus = 'all' | 'completed' | 'uncompleted';
export type FilterProtocol = 'all' | Protocol;

export interface Filters {
  protocol: FilterProtocol;
  status: FilterStatus;
}

// Types for Theming
export type ThemeMode = 'light' | 'dark';
export type AccentColorName = 'sky' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'orange' | 'teal' | 'fuchsia';

export interface Theme {
  mode: ThemeMode;
  accent: AccentColorName;
}

// Types for Life Timer
export interface LifeTimerSettings {
  dob: string | null; // Date of birth 'YYYY-MM-DD'
  expectancy: number; // Life expectancy in years
  mode: 'countup' | 'countdown';
  size: 'small' | 'medium' | 'large';
}

// Types for Fasting Summary
export interface FastingSummaryStats {
    totalFasts: number;
    averageDuration: number;
    longestFast: number;
    longestStreak: number;
}

export type AppView = 'calendar' | 'history' | 'overview';