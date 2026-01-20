
import React from 'react';
import { PillarDefinition } from '../types';

interface PillarLibraryProps {
  pillars: PillarDefinition[];
  onDragStart: (id: string) => void;
}

const PillarLibrary: React.FC<PillarLibraryProps> = ({ pillars, onDragStart }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pillar Assets</h3>
      </div>
      
      <div className="space-y-2">
        {pillars.map(pillar => (
          <div
            key={pillar.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('pillarId', pillar.id);
              onDragStart(pillar.id);
            }}
            className={`${pillar.bgClass} ${pillar.borderClass} ${pillar.textClass} p-3 rounded-xl border border-2 cursor-grab active:cursor-grabbing transition-all hover:border-slate-300 hover:shadow-sm flex items-center gap-3 group relative overflow-hidden`}
          >
            <div className={`w-1.5 h-6 rounded-full ${pillar.accentClass}`} />
            <div className="flex flex-col">
              <span className="font-bold text-xs tracking-tight">{pillar.title}</span>
              <span className="text-[9px] font-medium opacity-60 truncate max-w-[120px]">{pillar.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PillarLibrary;
