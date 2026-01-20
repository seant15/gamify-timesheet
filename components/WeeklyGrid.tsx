
import React, { useRef } from 'react';
import { DayOfWeek, Task, PillarDefinition } from '../types';

interface WeeklyGridProps {
  days: DayOfWeek[];
  tasks: Task[];
  pillars: PillarDefinition[];
  onDrop: (day: DayOfWeek, time?: string) => void;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  getPendingCredits: (day: DayOfWeek) => number;
  onClaimDaily: (day: DayOfWeek) => void;
  claimedDays: Record<string, boolean>;
}

const HOUR_HEIGHT = 60; 
const START_HOUR = 6;
const END_HOUR = 23;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ 
  days, tasks, pillars, onDrop, onToggleTask, onEditTask, onDeleteTask, 
  getPendingCredits, onClaimDaily, claimedDays 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getTimeFromY = (y: number) => {
    const totalMinutes = (y / HOUR_HEIGHT) * 60;
    const hour = Math.floor(totalMinutes / 60) + START_HOUR;
    const min = Math.floor(totalMinutes % 60);
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex border-b border-slate-200 pl-16">
        {days.map(day => (
          <div key={day} className="flex-1 py-3 text-center border-r border-slate-100 bg-slate-50/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{day.substring(0, 3)}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto relative" ref={containerRef}>
        <div className="flex min-h-full" style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}>
          <div className="w-16 flex-shrink-0 border-r border-slate-100 bg-white sticky left-0 z-10">
            {HOURS.map(hour => (
              <div key={hour} className="relative" style={{ height: `${HOUR_HEIGHT}px` }}>
                <span className="absolute -top-2.5 right-2 text-[9px] font-bold text-slate-400 uppercase">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>

          {days.map(day => (
            <DayColumn 
              key={day}
              day={day}
              tasks={tasks.filter(t => t.day === day)}
              pillars={pillars}
              onDrop={(y) => onDrop(day, getTimeFromY(y))}
              onToggleTask={onToggleTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </div>

      {/* Grid Footer - Claim Row */}
      <div className="flex border-t border-slate-200 pl-16 bg-slate-50">
        {days.map(day => {
          const pending = getPendingCredits(day);
          const isClaimed = claimedDays[day];
          return (
            <div key={day} className="flex-1 p-3 border-r border-slate-100 flex flex-col items-center gap-2">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Day's Earnings</div>
               {isClaimed ? (
                 <div className="text-emerald-600 font-black text-xs bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-200">CLAIMED ✓</div>
               ) : (
                 <button 
                  disabled={pending <= 0}
                  onClick={() => onClaimDaily(day)}
                  className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-black transition-all ${
                    pending > 0 
                    ? 'bg-amber-500 text-white shadow-md hover:bg-amber-600 active:scale-95' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                  }`}
                 >
                   CLAIM 💎 {pending}
                 </button>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DayColumn: React.FC<{
  day: DayOfWeek;
  tasks: Task[];
  pillars: PillarDefinition[];
  onDrop: (y: number) => void;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}> = ({ day, tasks, pillars, onDrop, onToggleTask, onEditTask, onDeleteTask }) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    onDrop(y);
  };

  return (
    <div 
      className="flex-1 border-r border-slate-50 relative group transition-colors hover:bg-slate-50/30"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {HOURS.map(h => (
        <div key={h} className="border-b border-slate-50 w-full" style={{ height: `${HOUR_HEIGHT}px` }} />
      ))}

      {tasks.map(task => {
        const pillar = pillars.find(p => p.id === task.pillarId);
        const startParts = task.startTime.split(':').map(Number);
        const endParts = task.endTime.split(':').map(Number);
        const startMin = (startParts[0] - START_HOUR) * 60 + startParts[1];
        const endMin = (endParts[0] - START_HOUR) * 60 + endParts[1];
        const top = (startMin / 60) * HOUR_HEIGHT;
        const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;

        return (
          <div
            key={task.id}
            onClick={() => onEditTask(task)}
            style={{ top: `${top}px`, height: `${height}px` }}
            className={`absolute left-1 right-1 rounded-xl border-2 p-2 shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] overflow-hidden group/task ${pillar?.bgClass} ${pillar?.borderClass}`}
          >
            <div className="flex items-start gap-2">
               <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                  className="mt-0.5 w-3.5 h-3.5 rounded-md text-indigo-600 focus:ring-0 cursor-pointer border-2"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-black leading-tight truncate ${task.completed ? 'line-through opacity-40' : 'text-slate-800'}`}>
                    {task.title}
                  </p>
                  <p className="text-[9px] font-bold opacity-50 uppercase tracking-tighter mt-0.5">
                    {task.startTime} — {task.endTime}
                  </p>
                </div>
            </div>
            
            {height > 40 && task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-0.5 mt-1">
                {task.tags.slice(0, 1).map(tag => (
                  <span key={tag} className="text-[8px] px-1.5 py-0 bg-white/50 rounded-full font-black text-slate-500">#{tag}</span>
                ))}
              </div>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
              className="absolute top-1 right-1 opacity-0 group-hover/task:opacity-100 hover:text-red-500 text-slate-300 p-0.5 transition-opacity"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyGrid;
