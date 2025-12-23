
import React from 'react';
import { History, Undo2, Redo2, Clock, CheckCircle2, ChevronRight, MousePointer2, Type, Box } from 'lucide-react';
import { Project } from '../../types';
import { HistoryItem } from '../../hooks/useHistory';

interface HistoryMenuProps {
  project: Project;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  history: { past: HistoryItem[], future: HistoryItem[] };
  onJump: (index: number, type: 'past' | 'future') => void;
}

export const HistoryMenu: React.FC<HistoryMenuProps> = ({
  project,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  history,
  onJump
}) => {
  const activeScreen = project.screens.find(s => s.id === project.activeScreenId);

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <History size={16} className="text-indigo-500" />
              Action History
          </h2>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest truncate">
            {activeScreen?.name || 'No Active Screen'}
          </p>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-2 gap-2 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${canUndo ? 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-600 hover:border-indigo-400 text-gray-700 dark:text-gray-200 shadow-sm' : 'opacity-50 grayscale cursor-not-allowed text-gray-400'}`}
          >
              <Undo2 size={18} className="mb-1" />
              <span className="text-[10px] font-black uppercase">Undo</span>
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${canRedo ? 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-600 hover:border-indigo-400 text-gray-700 dark:text-gray-200 shadow-sm' : 'opacity-50 grayscale cursor-not-allowed text-gray-400'}`}
          >
              <Redo2 size={18} className="mb-1" />
              <span className="text-[10px] font-black uppercase">Redo</span>
          </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700" />
              
              <div className="space-y-4">
                  {/* Future (Redo items) - Listed in order they would be applied */}
                  {history.future.map((item, idx) => (
                      <div 
                        key={`future-${idx}`} 
                        onClick={() => onJump(idx, 'future')}
                        className="relative pl-10 opacity-40 grayscale group cursor-pointer hover:opacity-100 hover:grayscale-0 transition-all"
                      >
                          <div className="absolute left-[13px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-indigo-300 bg-white dark:bg-gray-800 z-10 group-hover:bg-indigo-500" />
                          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1 mb-1">
                              <Clock size={10} /> Future State
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl group-hover:border-indigo-300 transition-all">
                              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                                  {item.label}
                                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                              </div>
                              <div className="text-[9px] text-gray-400 mt-1 uppercase tracking-tighter">Revert to this</div>
                          </div>
                      </div>
                  ))}

                  {/* Current State Indicator */}
                  <div className="relative pl-10">
                      <div className="absolute left-[10px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-800 shadow-md z-10" />
                      <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                          <CheckCircle2 size={10} /> Now Active
                      </div>
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl">
                          <div className="text-xs font-black text-indigo-900 dark:text-indigo-200">Current View</div>
                          <div className="text-[10px] text-indigo-700/60 dark:text-indigo-300/50 mt-1 flex items-center gap-2">
                            <Box size={10} /> {activeScreen?.elements.length} Components
                            <span className="opacity-30">|</span>
                            {formatTime(Date.now())}
                          </div>
                      </div>
                  </div>

                  {/* Past (Undo items) - Reversed to show most recent first */}
                  {history.past.slice().reverse().map((item, idx) => {
                      const realIdx = history.past.length - 1 - idx;
                      return (
                        <div 
                            key={`past-${idx}`} 
                            onClick={() => onJump(realIdx, 'past')}
                            className="relative pl-10 group cursor-pointer"
                        >
                            <div className="absolute left-[13px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-indigo-500 transition-colors z-10" />
                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1 mb-1">
                                <History size={10} /> {formatTime(item.timestamp)}
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl group-hover:border-indigo-300 group-hover:shadow-sm transition-all">
                                <div className="text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center justify-between">
                                    {item.label}
                                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                    <MousePointer2 size={8} /> Snapshot with {item.state.elements.length} elements
                                </div>
                            </div>
                        </div>
                      );
                  })}

                  {history.past.length === 0 && history.future.length === 0 && (
                      <div className="relative pl-10">
                          <div className="absolute left-[13px] top-1.5 w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                          <div className="text-xs text-gray-400 italic py-2 leading-relaxed">
                            Every time you tweak a component, move a layer, or change colors, we'll save a snapshot here.
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 shrink-0">
          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">
              Per-Screen Undo Stack
          </div>
      </div>
    </div>
  );
};
