
import React, { useState } from 'react';
import { PillarDefinition, Reward } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillars: PillarDefinition[];
  setPillars: React.Dispatch<React.SetStateAction<PillarDefinition[]>>;
  rewards: Reward[];
  setRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
}

const COLORS = ['indigo', 'purple', 'emerald', 'amber', 'rose', 'blue', 'slate', 'pink'];

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, pillars, setPillars, rewards, setRewards 
}) => {
  if (!isOpen) return null;

  const updatePillar = (id: string, updates: Partial<PillarDefinition>) => {
    setPillars(prev => prev.map(p => {
      if (p.id === id) {
        const next = { ...p, ...updates };
        // Update styling classes if color changes
        if (updates.color) {
            next.bgClass = `bg-${updates.color}-50`;
            next.borderClass = `border-${updates.color}-200`;
            next.textClass = `text-${updates.color}-700`;
            next.accentClass = `bg-${updates.color}-600`;
        }
        return next;
      }
      return p;
    }));
  };

  const updateReward = (id: string, cost: number) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, cost } : r));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Peak Performance Setup</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Define Pillars • Asset Colors • Point Values</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Pillar Config */}
          <section className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Custom Pillar Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillars.map(pillar => (
                <div key={pillar.id} className={`flex flex-col gap-3 p-5 rounded-3xl border-2 transition-all ${pillar.bgClass} ${pillar.borderClass}`}>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase">Pillar Title</label>
                    <input 
                        type="text" 
                        value={pillar.title} 
                        onChange={(e) => updatePillar(pillar.id, { title: e.target.value })}
                        className="w-full bg-white/60 border-none rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-white/80 outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Category</label>
                        <input 
                            type="text" 
                            value={pillar.category} 
                            onChange={(e) => updatePillar(pillar.id, { category: e.target.value })}
                            className="w-full bg-white/60 border-none rounded-xl px-3 py-2 text-xs font-bold outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">💎 / Hour</label>
                        <input 
                            type="number" 
                            value={pillar.pointsPerHour} 
                            onChange={(e) => updatePillar(pillar.id, { pointsPerHour: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white/60 border-none rounded-xl px-3 py-2 text-xs font-black text-amber-600 outline-none"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase">Theme Color</label>
                    <div className="flex flex-wrap gap-1.5">
                        {COLORS.map(c => (
                            <button 
                                key={c}
                                onClick={() => updatePillar(pillar.id, { color: c })}
                                className={`w-5 h-5 rounded-full border-2 transition-all ${pillar.color === c ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-60'} bg-${c}-500`}
                            />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reward Config */}
          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Store Economy</h3>
            <div className="space-y-4">
              {rewards.map(reward => (
                <div key={reward.id} className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 bg-slate-50/30">
                  <span className="text-2xl">{reward.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700">{reward.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Cost</label>
                      <input 
                        type="number" 
                        value={reward.cost} 
                        onChange={(e) => updateReward(reward.id, parseInt(e.target.value) || 0)}
                        className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-amber-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
          <button 
            onClick={onClose}
            className="px-12 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
          >
            CONFIRM CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
