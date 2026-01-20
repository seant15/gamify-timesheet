
import React from 'react';
import { Task, PillarDefinition } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PILLARS } from '../constants';

interface StatsPanelProps {
  tasks: Task[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ tasks }) => {
  // PILLARS is now correctly typed as Record<DayOfWeek, PillarDefinition>
  const data = Object.values(PILLARS).filter((p: PillarDefinition, idx, self) => 
    self.findIndex(other => other.title === p.title) === idx
  ).map(pillar => {
    const pillarMinutes = tasks
      .filter(t => PILLARS[t.day].title === pillar.title)
      .reduce((sum, t) => sum + t.durationMinutes, 0);
    return {
      name: pillar.title,
      value: pillarMinutes,
      color: pillar.color
    };
  }).filter(d => d.value > 0);

  const totalHours = (tasks.reduce((sum, t) => sum + t.durationMinutes, 0) / 60).toFixed(1);
  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h3 className="font-semibold text-slate-800">Weekly Performance</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Hours Logged</p>
          <p className="text-2xl font-bold text-slate-800">{totalHours}h</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Completion</p>
          <p className="text-2xl font-bold text-emerald-600">{completionRate}%</p>
        </div>
      </div>

      <div className="h-48 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${(value/60).toFixed(1)}h`, 'Allocation']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
            Add tasks to see allocation.
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500">Allocation Goal</p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full rounded-full" style={{ width: '75%' }}></div>
        </div>
        <p className="text-[10px] text-slate-400">Targeting 35h of focused work per week.</p>
      </div>
    </div>
  );
};

export default StatsPanel;
