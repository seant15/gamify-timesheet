
import React from 'react';
import { Reward } from '../types';

interface RewardsStoreProps {
  rewards: Reward[];
  userCredits: number;
  onClaim: (id: string) => void;
}

const RewardsStore: React.FC<RewardsStoreProps> = ({ rewards, userCredits, onClaim }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reward Store</h3>
      </div>
      
      <div className="space-y-2">
        {rewards.map(reward => {
          const canAfford = userCredits >= reward.cost;
          return (
            <button
              key={reward.id}
              onClick={() => onClaim(reward.id)}
              disabled={!canAfford || reward.claimed}
              className={`w-full flex items-center gap-2 p-2 rounded-xl border transition-all relative overflow-hidden group ${
                reward.claimed ? 'bg-emerald-50 border-emerald-200' : 
                canAfford ? 'bg-white border-slate-100 hover:border-amber-200 hover:shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60 grayscale cursor-not-allowed'
              }`}
            >
              <span className="text-lg">{reward.icon}</span>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[11px] font-bold text-slate-700 truncate">{reward.title}</p>
                <span className="text-[9px] font-black text-amber-600 tracking-tighter uppercase">💎 {reward.cost}</span>
              </div>
              
              {reward.claimed && (
                <div className="absolute inset-0 bg-emerald-500/90 flex items-center justify-center text-white font-black text-[9px] animate-in fade-in duration-300">
                  REDEEMED
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default RewardsStore;
