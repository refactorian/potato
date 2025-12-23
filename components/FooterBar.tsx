
import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Monitor, Maximize2, MousePointer2, Layout, ChevronUp, Check, Undo2, Redo2 } from 'lucide-react';
import { Project } from '../types';

interface FooterBarProps {
  scale: number;
  setScale: (s: number) => void;
  project: Project;
  setProject: (p: Project) => void;
  isPreview: boolean;
  onFitCanvas: () => void;
  // History props
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  scale,
  setScale,
  project,
  setProject,
  isPreview,
  onFitCanvas,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsSwitcherOpen(false);
      }
    };
    if (isSwitcherOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isSwitcherOpen]);

  const handleSwitchScreen = (screenId: string) => {
    setProject({ ...project, activeScreenId: screenId });
    setIsSwitcherOpen(false);
  };

  return (
    <div className="h-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center px-5 z-[60] transition-colors duration-200 shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] relative">
      
      {/* Centered Unified Console */}
      <div className="flex items-center gap-4">
        
        {/* Screen Switcher Dropdown */}
        <div className="relative" ref={switcherRef}>
          <button 
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors group cursor-pointer"
          >
            <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                {isPreview ? <Monitor size={14} /> : <Layout size={14} />}
            </div>
            <div className="flex items-baseline gap-2 leading-none">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[120px]">
                  {activeScreen?.name || 'Select Screen'}
                </span>
                {!isPreview && activeScreen && (
                  <span className="text-[10px] font-mono font-medium text-gray-400">
                      {activeScreen.viewportWidth}×{activeScreen.viewportHeight}
                  </span>
                )}
            </div>
            <ChevronUp size={14} className={`text-gray-400 transition-transform duration-200 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSwitcherOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                Switch Screen
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
                {project.screens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => handleSwitchScreen(screen.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      screen.id === project.activeScreenId 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                       <Layout size={14} className={screen.id === project.activeScreenId ? 'text-indigo-500' : 'text-gray-400'} />
                       <span className="text-xs font-medium truncate">{screen.name}</span>
                    </div>
                    {screen.id === project.activeScreenId && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

        {/* Status Group */}
        <div className="flex items-center">
            {isPreview ? (
                <div className="flex items-center gap-2 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-100 dark:border-indigo-800/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Preview</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                    <MousePointer2 size={10} className="text-gray-400" />
                    <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Design</span>
                </div>
            )}
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

        {/* Zoom Controls Group */}
        <div className="flex items-center gap-1">
            <button 
                onClick={() => setScale(Math.max(0.1, scale - 0.1))} 
                className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all active:scale-90"
                title="Zoom Out"
            >
                <ZoomOut size={14} />
            </button>
            
            <button 
                onClick={() => setScale(1)}
                className="px-2 min-w-[45px] text-center hover:text-indigo-600 transition-colors group"
                title="Reset to 100%"
            >
                <span className="text-[10px] font-black font-mono text-gray-600 dark:text-gray-300 group-hover:text-indigo-600">
                    {Math.round(scale * 100)}%
                </span>
            </button>
            
            <button 
                onClick={() => setScale(Math.min(3, scale + 0.1))} 
                className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all active:scale-90"
                title="Zoom In"
            >
                <ZoomIn size={14} />
            </button>

            <button 
                className="ml-1 p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all active:scale-95"
                onClick={onFitCanvas}
                title="Fit to Screen"
            >
                <Maximize2 size={14} />
            </button>
        </div>

        {/* History Controls - Right of Zoom, Edit mode only */}
        {!isPreview && (
          <>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-1">
               <button 
                 onClick={onUndo}
                 disabled={!canUndo}
                 className={`p-1.5 rounded transition-all active:scale-90 ${canUndo ? 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'}`}
                 title="Undo (Ctrl+Z)"
               >
                 <Undo2 size={16} />
               </button>
               <button 
                 onClick={onRedo}
                 disabled={!canRedo}
                 className={`p-1.5 rounded transition-all active:scale-90 ${canRedo ? 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'}`}
                 title="Redo (Ctrl+Y)"
               >
                 <Redo2 size={16} />
               </button>
            </div>
          </>
        )}

      </div>

      {/* Bottom Accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all ${isPreview ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-transparent'}`} />
    </div>
  );
};
