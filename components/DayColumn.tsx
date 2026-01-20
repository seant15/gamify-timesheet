
import React, { useState } from 'react';
import { DayOfWeek, PillarDefinition, Task } from '../types';

interface DayColumnProps {
  day: DayOfWeek;
  pillar: PillarDefinition;
  tasks: Task[];
  onAddTask: (title: string, duration: number) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onGetAdvice: () => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ 
  day, 
  pillar, 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask, 
  onGetAdvice 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [duration, setDuration] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask(taskTitle, duration);
      setTaskTitle('');
      setIsAdding(false);
    }
  };

  const totalMinutes = tasks.reduce((acc, t) => acc + t.durationMinutes, 0);

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${pillar.borderClass} ${pillar.bgClass} transition-all hover:shadow-lg group overflow-hidden`}>
      {/* Header */}
      <div className={`p-4 border-b ${pillar.borderClass} bg-white/40`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold uppercase tracking-wider ${pillar.textClass}`}>{day}</span>
          <button 
            onClick={onGetAdvice}
            className={`p-1 rounded-md hover:bg-white/60 transition-colors text-slate-400 hover:${pillar.textClass}`}
            title="AI Strategic Advice"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </button>
        </div>
        <h3 className="font-bold text-slate-800 leading-tight mb-1">{pillar.title}</h3>
        <p className="text-[10px] text-slate-500 line-clamp-1">{pillar.description}</p>
      </div>

      {/* Task List */}
      <div className="flex-1 p-3 space-y-2 min-h-[300px] max-h-[500px] overflow-y-auto">
        {tasks.map(task => (
          <div key={task.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-start gap-2 group/item">
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => onToggleTask(task.id)}
              className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-400">{task.durationMinutes}m</span>
              </div>
            </div>
            <button 
              onClick={() => onDeleteTask(task.id)}
              className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        ))}

        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-white p-3 rounded-xl shadow-md border-2 border-indigo-100 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <input 
              autoFocus
              type="text" 
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task name..."
              className="w-full text-sm border-none focus:ring-0 p-0"
            />
            <div className="flex items-center justify-between">
              <select 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="text-[10px] bg-slate-50 border-none rounded focus:ring-0 py-1"
              >
                <option value={15}>15m</option>
                <option value={30}>30m</option>
                <option value={60}>1h</option>
                <option value={120}>2h</option>
              </select>
              <div className="flex gap-1">
                <button type="button" onClick={() => setIsAdding(false)} className="px-2 py-1 text-[10px] text-slate-400 hover:text-slate-600">Cancel</button>
                <button type="submit" className={`px-2 py-1 text-[10px] text-white rounded font-medium ${pillar.accentClass}`}>Add</button>
              </div>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-medium hover:border-slate-400 hover:bg-white transition-all flex items-center justify-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Task
          </button>
        )}
      </div>

      {/* Footer */}
      <div className={`p-3 bg-white/40 border-t ${pillar.borderClass} flex justify-between items-center`}>
        <span className="text-[10px] font-medium text-slate-500">{tasks.length} tasks</span>
        <span className="text-[10px] font-bold text-slate-700">{(totalMinutes / 60).toFixed(1)}h</span>
      </div>
    </div>
  );
};

export default DayColumn;
