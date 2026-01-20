
import React from 'react';
import { DayOfWeek, DailySummary } from '../types';
import { PILLARS } from '../constants';

interface SmartAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayOfWeek;
  advice?: DailySummary;
  isLoading: boolean;
  onRefresh: () => void;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ 
  isOpen, 
  onClose, 
  day, 
  advice, 
  isLoading,
  onRefresh
}) => {
  // PILLARS is now correctly imported from constants
  const pillar = PILLARS[day];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg text-white ${pillar.accentClass}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Smart Coach</h2>
                <p className="text-xs text-slate-500">{day} - {pillar.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-medium">Analyzing your pillar schedule...</p>
              </div>
            ) : advice ? (
              <>
                <section className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pillar Insight</h3>
                  <div className={`p-4 rounded-2xl ${pillar.bgClass} border ${pillar.borderClass}`}>
                    <p className={`text-sm leading-relaxed ${pillar.textClass} font-medium`}>
                      &ldquo;{advice.focusAdvice}&rdquo;
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Suggested Actions</h3>
                    <button 
                      onClick={onRefresh}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                      Regenerate
                    </button>
                  </div>
                  <div className="space-y-3">
                    {advice.suggestedTasks.map((sTask, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 hover:border-indigo-200 transition-colors cursor-pointer group">
                        <div className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-700 flex-1">{sTask}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="p-4 bg-indigo-900 rounded-2xl text-white overflow-hidden relative">
                  <div className="relative z-10">
                    <p className="text-xs font-bold opacity-70 uppercase mb-1">Coach Pro Tip</p>
                    <p className="text-sm font-medium">To maintain flow during {pillar.title} hours, disable all notifications for 90-minute intervals.</p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                </section>
              </>
            ) : (
              <div className="text-center py-12">
                <button 
                  onClick={onRefresh}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Get AI Insights
                </button>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <p className="text-[10px] text-slate-400 text-center">
              Powered by Gemini 3. High-precision productivity analysis.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SmartAssistant;
