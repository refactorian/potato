
import React from 'react';
import { Maximize, Palette, Grid, Hash } from 'lucide-react';

interface BlankProjectTabProps {
  projectName: string;
  setProjectName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  viewportWidth: number;
  setViewportWidth: (width: number) => void;
  viewportHeight: number;
  setViewportHeight: (height: number) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  gridVisible: boolean;
  setGridVisible: (visible: boolean) => void;
  gridSnap: boolean;
  setGridSnap: (snap: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  gridColor: string;
  setGridColor: (color: string) => void;
}

export const BlankProjectTab: React.FC<BlankProjectTabProps> = ({
  projectName, setProjectName,
  description, setDescription,
  viewportWidth, setViewportWidth,
  viewportHeight, setViewportHeight,
  backgroundColor, setBackgroundColor,
  gridVisible, setGridVisible,
  gridSnap, setGridSnap,
  gridSize, setGridSize,
  gridColor, setGridColor
}) => {
  const setPreset = (w: number, h: number) => {
    setViewportWidth(w);
    setViewportHeight(h);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Project Identity */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Identity</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg font-black text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            placeholder="Project Name"
            autoFocus
          />
        </div>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all"
          placeholder="What are you building? (Optional description)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Canvas Config */}
        <div className="p-5 bg-gray-50 dark:bg-gray-850 rounded-[24px] border border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Maximize size={12} /> Viewport
            </h4>
          </div>
          <div className="flex gap-1.5">
            {[
              { label: 'Mobile', w: 375, h: 812 },
              { label: 'Tablet', w: 768, h: 1024 },
              { label: 'Desktop', w: 1280, h: 800 }
            ].map(preset => (
              <button 
                key={preset.label}
                type="button" 
                onClick={() => setPreset(preset.w, preset.h)} 
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${viewportWidth === preset.w ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50'}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700">
              <label className="text-[8px] font-black text-gray-400 uppercase block mb-0.5">Width</label>
              <input type="number" value={viewportWidth} onChange={(e) => setViewportWidth(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white outline-none" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700">
              <label className="text-[8px] font-black text-gray-400 uppercase block mb-0.5">Height</label>
              <input type="number" value={viewportHeight} onChange={(e) => setViewportHeight(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white outline-none" />
            </div>
          </div>
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Palette size={12} className="text-gray-400" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Color</label>
            </div>
            <div className="flex gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10 rounded-xl border-none cursor-pointer p-0 overflow-hidden" />
              <div className="flex flex-1 items-center px-2">
                <Hash size={12} className="text-gray-400 mr-1" />
                <input type="text" value={backgroundColor.replace('#', '').toUpperCase()} onChange={(e) => setBackgroundColor(`#${e.target.value}`)} className="bg-transparent text-xs font-mono font-bold uppercase w-full outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Environment Config */}
        <div className="p-5 bg-gray-50 dark:bg-gray-850 rounded-[24px] border border-gray-100 dark:border-gray-800 space-y-4">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
            <Grid size={12} /> System Grid
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => setGridVisible(!gridVisible)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${gridVisible ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
            >
              <span className="text-[9px] font-black uppercase">Grid Overlay</span>
              <span className="text-[8px] font-bold mt-1 opacity-60">{gridVisible ? 'ACTIVE' : 'DISABLED'}</span>
            </button>
            <button 
              type="button"
              onClick={() => setGridSnap(!gridSnap)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${gridSnap ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
            >
              <span className="text-[9px] font-black uppercase">Snap Precision</span>
              <span className="text-[8px] font-bold mt-1 opacity-60">{gridSnap ? 'ENABLED' : 'DISABLED'}</span>
            </button>
          </div>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">Density</label>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700">{gridSize}px</span>
              </div>
              <input type="range" min="5" max="50" step="5" value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div className="flex items-center gap-3">
              <input type="color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="w-6 h-6 rounded-full border-none cursor-pointer shadow-sm" />
              <div className="flex flex-1 items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
                <Hash size={10} className="text-gray-400 mr-1" />
                <input type="text" value={gridColor.replace('#', '').toUpperCase()} onChange={(e) => setGridColor(`#${e.target.value}`)} className="bg-transparent text-[10px] font-mono font-bold uppercase w-full outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
