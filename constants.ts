
import { DayOfWeek, PillarDefinition, Reward } from './types';

export const INITIAL_PILLARS: PillarDefinition[] = [
  {
    id: 'p1',
    title: 'Team & Mgmt',
    category: 'Management',
    description: 'Meetings & reports',
    color: 'indigo',
    pointsPerHour: 100,
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-200',
    textClass: 'text-indigo-700',
    accentClass: 'bg-indigo-600',
  },
  {
    id: 'p2',
    title: 'Deep Work',
    category: 'Creative',
    description: 'Strategy & Creative',
    color: 'purple',
    pointsPerHour: 200,
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-700',
    accentClass: 'bg-purple-600',
  },
  {
    id: 'p3',
    title: 'Sales & Growth',
    category: 'Revenue',
    description: 'Outreach & BizDev',
    color: 'emerald',
    pointsPerHour: 150,
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-700',
    accentClass: 'bg-emerald-600',
  },
  {
    id: 'p4',
    title: 'Admin/Overflow',
    category: 'Logistics',
    description: 'Cleanup & Logistics',
    color: 'amber',
    pointsPerHour: 80,
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-700',
    accentClass: 'bg-amber-600',
  },
];

export const PILLARS: Record<DayOfWeek, PillarDefinition> = {
  [DayOfWeek.Monday]: INITIAL_PILLARS[0],
  [DayOfWeek.Tuesday]: INITIAL_PILLARS[1],
  [DayOfWeek.Wednesday]: INITIAL_PILLARS[2],
  [DayOfWeek.Thursday]: INITIAL_PILLARS[1],
  [DayOfWeek.Friday]: INITIAL_PILLARS[3],
  [DayOfWeek.Saturday]: INITIAL_PILLARS[3],
  [DayOfWeek.Sunday]: INITIAL_PILLARS[3],
};

export const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', title: 'Specialty Coffee', cost: 120, icon: '☕', claimed: false },
  { id: 'r2', title: 'New Video Game', cost: 1500, icon: '🎮', claimed: false },
  { id: 'r3', title: 'Weekend Getaway', cost: 10000, icon: '✈️', claimed: false },
  { id: 'r4', title: 'Cheat Meal', cost: 500, icon: '🍕', claimed: false },
  { id: 'r5', title: 'Buy a Book', cost: 300, icon: '📚', claimed: false },
];

export const WEEK_DAYS: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];
