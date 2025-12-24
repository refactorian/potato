
import React, { useState } from 'react';
import { 
    History, Undo2, Redo2, ChevronRight, 
    Box, FolderKanban, Activity, Trash2, 
    Type, Maximize, Palette, MousePointer2, Settings2, Zap, Smartphone, Monitor
} from 'lucide-react';
import { Project } from '../../types';
import { HistoryItem } from '../../hooks/useHistory';
import { ConfirmationModal } from '../modals/ConfirmationModal';

interface HistoryMenuProps {
  project: Project;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  history: { past: HistoryItem[], future: HistoryItem[] };
  onJump: (index: number, type: 'past' | 'future') => void;
  onClearHistory?: () => void;
}

export const HistoryMenu: React.FC<HistoryMenuProps> = ({
  project,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  history,
  onJump,
  onClearHistory
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  const formatRelativeTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 10000) return 'just now';
    if (diff < 60000) return `${Math.floor(diff/1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActionIcon = (label: string) => {
      const l = label.toLowerCase();
      if (l.includes('style')) return Palette;
      if (l.includes('move') || l.includes('transform')) return Maximize;
      if (l.includes('text') || l.includes('typography')) return Type;
      if (l.includes('screen')) return Smartphone;
      if (l.includes('layer') || l.includes('create')) return Box;
      if (l.includes('switch')) return MousePointer2;
      if (l.includes('rename')) return Settings2;
      return Zap;
  };

  const isEmpty = history.past.length === 0 && history.future.length === 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                    <History size={14} />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-gray-100">
                      Timeline
                  </h2>
              </div>
              {!isEmpty && (
                  <button 
                    onClick={() => setConfirmClear(true)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Clear All History"
                  >
                      <Trash2 size={14} />
                  </button>
              )}
          </div>
      </div>

      {/* Undo/Redo Quick Controls */}
      <div className="grid grid-cols-2 border-b border-gray-100 dark:border-gray-700 shrink-0 shadow-inner">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className={`flex items-center justify-center gap-2 py-2.5 border-r border-gray-100 dark:border-gray-700 transition-all ${canUndo ? 'text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50' : 'opacity-20 grayscale'}`}
          >
              <Undo2 size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            className={`flex items-center justify-center gap-2 py-2.5 transition-all ${canRedo ? 'text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50' : 'opacity-20 grayscale'}`}
          >
              <span className="text-[10px] font-black uppercase tracking-widest">Forward</span>
              <Redo2 size={14} strokeWidth={3} />
          </button>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {!isEmpty ? (
              <div className="p-4 pl-6 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-700" />
                  
                  <div className="space-y-1">
                      {/* Redo States (Future) */}
                      {history.future.map((item, idx) => {
                          const Icon = getActionIcon(item.label);
                          return (
                            <div 
                                key={`future-${idx}`} 
                                onClick={() => onJump(idx, 'future')}
                                className="relative py-1.5 pl-6 group cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
                            >
                                <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 border border-white dark:border-gray-800 z-10" />
                                <div className="flex items-center justify-between group-hover:bg-gray-50 dark:group-hover:bg-gray-900/50 p-1 rounded-lg transition-colors">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-400">
                                            <Icon size={12} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 truncate">{item.label}</div>
                                            <div className="text-[9px] text-gray-400 uppercase tracking-tighter">Future State</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            </div>
                          );
                      })}

                      {/* Current Active Point */}
                      <div className="relative py-3 pl-6">
                          <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-gray-800 shadow-[0_0_0_4px_rgba(99,102,241,0.15)] z-20" />
                          <div className="bg-indigo-600 dark:bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-600/20 relative overflow-hidden group">
                              <div className="flex items-center justify-between relative z-10">
                                  <div className="flex items-center gap-2">
                                      <Activity size={12} className="animate-pulse" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">Active State</span>
                                  </div>
                                  <span className="text-[9px] font-bold opacity-80">NOW</span>
                              </div>
                              <div className="mt-2 text-[10px] font-bold flex items-center gap-3 relative z-10 opacity-90">
                                  <span className="flex items-center gap-1"><Monitor size={10} /> {project.screens.length} Screens</span>
                                  <div className="w-1 h-1 rounded-full bg-white/30" />
                                  <span className="truncate">{project.activeScreenId ? project.screens.find(s=>s.id===project.activeScreenId)?.name : 'Workspace'}</span>
                              </div>
                              {/* Background Pattern */}
                              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)', backgroundSize: '8px 8px' }} />
                          </div>
                      </div>

                      {/* Past States */}
                      {history.past.slice().reverse().map((item, idx) => {
                          const Icon = getActionIcon(item.label);
                          const originalIdx = history.past.length - 1 - idx;
                          return (
                            <div 
                                key={`past-${idx}`} 
                                onClick={() => onJump(originalIdx, 'past')}
                                className="relative py-1.5 pl-6 group cursor-pointer"
                            >
                                <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 border border-white dark:border-gray-800 z-10 group-hover:scale-150 transition-transform" />
                                <div className="flex items-center justify-between group-hover:bg-gray-50 dark:group-hover:bg-gray-900/50 p-1.5 rounded-xl transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Icon size={12} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{item.label}</div>
                                            <div className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">{formatRelativeTime(item.timestamp)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[9px] font-black text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">RESTORE</div>
                                        <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
                                    </div>
                                </div>
                            </div>
                          );
                      })}
                  </div>
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700 mb-4 border border-dashed border-gray-200 dark:border-gray-800">
                      <History size={24} />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Timeline Empty</h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2 leading-relaxed">No changes recorded in the current session stack.</p>
              </div>
          )}
      </div>

      {/* Footer Meta */}
      <div className="p-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-700 shrink-0">
          <div className="flex items-center justify-between text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-1"><FolderKanban size={10} /> Blueprint v1.0</span>
              <span>Stack: {history.past.length + history.future.length}/100</span>
          </div>
      </div>

      <ConfirmationModal 
          isOpen={confirmClear}
          title="Purge Timeline?"
          message="This will clear all undo/redo history for the current session. Your canvas state will remain preserved."
          confirmText="Purge History"
          onClose={() => setConfirmClear(false)}
          onConfirm={() => {
              onClearHistory?.();
              setConfirmClear(false);
          }}
      />
    </div>
  );
};
