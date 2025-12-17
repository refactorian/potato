
import React from 'react';
import { Maximize, Palette, Grid } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Project Details</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configure the basic settings for your new prototype.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info */}
        <div className="space-y-4 col-span-full">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter project name..."
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Brief description of the project..."
            />
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700 col-span-full" />

        {/* Canvas Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Maximize size={16} /> Viewport Size</h4>
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setPreset(375, 812)} className={`flex-1 py-2 text-xs rounded border transition-all ${viewportWidth === 375 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Mobile</button>
            <button type="button" onClick={() => setPreset(768, 1024)} className={`flex-1 py-2 text-xs rounded border transition-all ${viewportWidth === 768 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Tablet</button>
            <button type="button" onClick={() => setPreset(1280, 800)} className={`flex-1 py-2 text-xs rounded border transition-all ${viewportWidth === 1280 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Desktop</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Width</label>
              <input type="number" value={viewportWidth} onChange={(e) => setViewportWidth(Number(e.target.value))} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Height</label>
              <input type="number" value={viewportHeight} onChange={(e) => setViewportHeight(Number(e.target.value))} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Palette size={16} /> Background</h4>
            <div className="flex gap-2">
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 uppercase" />
            </div>
          </div>
        </div>

        {/* Grid Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Grid size={16} /> Grid System</h4>
          <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Grid</span>
              <input type="checkbox" checked={gridVisible} onChange={(e) => setGridVisible(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Snap to Grid</span>
              <input type="checkbox" checked={gridSnap} onChange={(e) => setGridSnap(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
            </label>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500"><span>Grid Size</span><span>{gridSize}px</span></div>
              <input type="range" min="5" max="50" step="5" value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))} className="w-full accent-indigo-600" />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500">Grid Color</span>
              <div className="flex gap-2">
                <input type="color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="w-6 h-6 rounded border cursor-pointer" />
                <input type="text" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="flex-1 p-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
