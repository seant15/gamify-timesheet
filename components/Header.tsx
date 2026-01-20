
import React from 'react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ stats, onOpenSettings }) => {
  const levelProgress = (stats.lifetimeEarnings % 1000) / 10;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-100">P</div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">PillarTrack</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-4 border-l border-slate-100 pl-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Level {stats.level}</span>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm">
          <span className="text-sm">💎</span>
          <span className="text-sm font-black text-amber-700 tabular-nums">{stats.totalCredits.toLocaleString()}</span>
        </div>

        <button 
          onClick={onOpenSettings}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
