
import React, { useState, useEffect } from 'react';
import { DayOfWeek, Task, PillarDefinition, Reward, UserStats, AppSettings } from './types';
import { WEEK_DAYS, INITIAL_PILLARS, INITIAL_REWARDS } from './constants';
import Header from './components/Header';
import PillarLibrary from './components/PillarLibrary';
import WeeklyGrid from './components/WeeklyGrid';
import RewardsStore from './components/RewardsStore';
import SettingsModal from './components/SettingsModal';
import TaskModal from './components/TaskModal';

const App: React.FC = () => {
  // --- State ---
  const [pillars, setPillars] = useState<PillarDefinition[]>(INITIAL_PILLARS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [stats, setStats] = useState<UserStats>({ totalCredits: 0, lifetimeEarnings: 0, level: 1 });
  const [claimedDays, setClaimedDays] = useState<Record<string, boolean>>({}); // Tracking "claimed" status per day (e.g. "2023-W12-Monday")
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [draggedPillarId, setDraggedPillarId] = useState<string | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const data = localStorage.getItem('pillartrack_v4');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.tasks) setTasks(parsed.tasks);
      if (parsed.stats) setStats(parsed.stats);
      if (parsed.pillars) setPillars(parsed.pillars);
      if (parsed.rewards) setRewards(parsed.rewards);
      if (parsed.claimedDays) setClaimedDays(parsed.claimedDays);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pillartrack_v4', JSON.stringify({ tasks, stats, pillars, rewards, claimedDays }));
  }, [tasks, stats, pillars, rewards, claimedDays]);

  // --- Calculations ---
  const getPendingCreditsForDay = (day: DayOfWeek) => {
    if (claimedDays[day]) return 0;
    
    return tasks
      .filter(t => t.day === day && t.completed)
      .reduce((acc, t) => {
        const pillar = pillars.find(p => p.id === t.pillarId);
        if (!pillar) return acc;
        return acc + Math.floor((t.durationMinutes / 60) * pillar.pointsPerHour);
      }, 0);
  };

  // --- Logic ---
  const handleClaimDaily = (day: DayOfWeek) => {
    const amount = getPendingCreditsForDay(day);
    if (amount <= 0) return;

    setStats(s => ({
      ...s,
      totalCredits: s.totalCredits + amount,
      lifetimeEarnings: s.lifetimeEarnings + amount,
      level: Math.floor((s.lifetimeEarnings + amount) / 1000) + 1
    }));

    setClaimedDays(prev => ({ ...prev, [day]: true }));
    
    // In a real app, we might reset the 'claimed' status next week. 
    // For now, we just mark it claimed to show the interaction.
  };

  const handleDrop = (day: DayOfWeek, time?: string) => {
    if (!draggedPillarId) return;
    const pillar = pillars.find(p => p.id === draggedPillarId);
    if (!pillar) return;

    const startTime = time || "09:00";
    const startParts = startTime.split(':').map(Number);
    const endHour = startParts[0] + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:${startParts[1].toString().padStart(2, '0')}`;

    setEditingTask({
      pillarId: pillar.id,
      day,
      title: `${pillar.title} Block`,
      startTime,
      endTime,
      tags: [],
      notes: "",
      category: pillar.category
    });
    setDraggedPillarId(null);
  };

  const saveTask = (taskData: Partial<Task>) => {
    const isNew = !taskData.id;
    const startParts = taskData.startTime!.split(':').map(Number);
    const endParts = taskData.endTime!.split(':').map(Number);
    const duration = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1]);
    const finalDuration = duration > 0 ? duration : 60;

    // Reset claimed status if we modify tasks for that day
    if (taskData.day) {
        setClaimedDays(prev => ({ ...prev, [taskData.day as string]: false }));
    }

    if (isNew) {
      const newTask: Task = {
        ...(taskData as Task),
        id: Math.random().toString(36).substr(2, 9),
        durationMinutes: finalDuration,
        completed: false,
        createdAt: Date.now(),
      };
      setTasks(prev => [...prev, newTask]);
    } else {
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData, durationMinutes: finalDuration } : t));
    }
    setEditingTask(null);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        // Reset claimed status when task completion changes
        setClaimedDays(prevClaimed => ({ ...prevClaimed, [t.day]: false }));
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const claimReward = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (!reward || stats.totalCredits < reward.cost) return;
    setStats(s => ({ ...s, totalCredits: s.totalCredits - reward.cost }));
    setRewards(prev => prev.map(r => r.id === id ? { ...r, claimed: true } : r));
    setTimeout(() => {
      setRewards(prev => prev.map(r => r.id === id ? { ...r, claimed: false } : r));
    }, 3000);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
      <Header stats={stats} onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <PillarLibrary 
              pillars={pillars} 
              onDragStart={(id) => setDraggedPillarId(id)} 
            />
            <hr className="border-slate-100" />
            <RewardsStore 
              rewards={rewards} 
              userCredits={stats.totalCredits} 
              onClaim={claimReward} 
            />
          </div>
        </aside>

        <section className="flex-1 overflow-hidden relative">
          <WeeklyGrid 
            days={WEEK_DAYS}
            tasks={tasks}
            pillars={pillars}
            onDrop={handleDrop}
            onToggleTask={toggleTask}
            onEditTask={(task) => setEditingTask(task)}
            onDeleteTask={(id) => {
                const task = tasks.find(t => t.id === id);
                if (task) setClaimedDays(prev => ({ ...prev, [task.day]: false }));
                setTasks(prev => prev.filter(t => t.id !== id));
            }}
            getPendingCredits={getPendingCreditsForDay}
            onClaimDaily={handleClaimDaily}
            claimedDays={claimedDays}
          />
        </section>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pillars={pillars}
        setPillars={setPillars}
        rewards={rewards}
        setRewards={setRewards}
      />

      {editingTask && (
        <TaskModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
          onSave={saveTask}
          pillar={pillars.find(p => p.id === editingTask.pillarId)!}
        />
      )}
    </div>
  );
};

export default App;
