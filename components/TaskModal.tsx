
import React, { useState } from 'react';
import { Task, PillarDefinition } from '../types';

interface TaskModalProps {
  task: Partial<Task>;
  pillar: PillarDefinition;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, pillar, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: task.title || '',
    startTime: task.startTime || '09:00',
    endTime: task.endTime || '10:00',
    category: task.category || pillar.title,
    notes: task.notes || '',
    tags: task.tags?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...task,
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      category: formData.category,
      notes: formData.notes,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        <div className={`p-8 border-b ${pillar.borderClass} ${pillar.bgClass} flex items-center justify-between`}>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${pillar.textClass}`}>Schedule Focus</span>
            <h2 className="text-2xl font-black text-slate-800">{pillar.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Task Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="What exactly are you focusing on?"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Start Time</label>
                <input 
                  type="time" 
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">End Time</label>
                <input 
                  type="time" 
                  value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Tags (comma separated)</label>
              <input 
                type="text" 
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                placeholder="urgent, research, client-x"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Detailed Notes</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Context, links, or specific goals..."
                rows={3}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
            >
              CANCEL
            </button>
            <button 
              type="submit"
              className={`flex-[2] py-4 px-6 text-white rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-[1.02] ${pillar.accentClass}`}
            >
              SAVE STRATEGIC BLOCK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
