
import React from 'react';
import { Project, GridConfig, Screen } from '../../types';
import { Smartphone, Tablet, Monitor, Grid, Maximize, Palette } from 'lucide-react';
import { NumberInputControl } from '../common/NumberInputControl';

interface CanvasSettingsMenuProps {
  project: Project;
  setProject: (p: Project) => void;
}

export const CanvasSettingsMenu: React.FC<CanvasSettingsMenuProps> = ({ project, setProject }) => {
  const activeScreen = project.screens.find(s => s.id === project.activeScreenId);

  const updateScreen = (updates: Partial<Screen>) => {
    if (!activeScreen) return;
    const updatedScreens = project.screens.map(s => 
      s.id === project.activeScreenId ? { ...s, ...updates } : s
    );
    setProject({ ...project, screens: updatedScreens });
  };

  const updateGrid = (updates: Partial<GridConfig>) => {
    if (!activeScreen) return;
    updateScreen({ gridConfig: { ...activeScreen.gridConfig, ...updates } });
  };

  if (!activeScreen) {
    return (
        <div className="p-8 text-center text-gray-400">
            <Maximize size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm">Select a screen to view canvas settings.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              Screen Canvas
          </h2>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1 truncate">{activeScreen.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        
        {/* Viewport Size */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Maximize size={12} /> Dimensions
          </h3>
          
          <div className="grid grid-cols-3 gap-2">
              <button 
                  onClick={() => updateScreen({ viewportWidth: 375, viewportHeight: 812 })}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all ${activeScreen.viewportWidth === 375 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-600 text-gray-500'}`}
              >
                  <Smartphone size={16} className="mb-1" />
                  <span className="text-[10px] font-bold">Mobile</span>
              </button>
              <button 
                  onClick={() => updateScreen({ viewportWidth: 768, viewportHeight: 1024 })}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all ${activeScreen.viewportWidth === 768 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-600 text-gray-500'}`}
              >
                  <Tablet size={16} className="mb-1" />
                  <span className="text-[10px] font-bold">Tablet</span>
              </button>
              <button 
                  onClick={() => updateScreen({ viewportWidth: 1280, viewportHeight: 800 })}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all ${activeScreen.viewportWidth === 1280 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-600 text-gray-500'}`}
              >
                  <Monitor size={16} className="mb-1" />
                  <span className="text-[10px] font-bold">Desktop</span>
              </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Width</label>
                  <input type="number" value={activeScreen.viewportWidth} onChange={e => updateScreen({ viewportWidth: Number(e.target.value) })} className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Height</label>
                  <input type="number" value={activeScreen.viewportHeight} onChange={e => updateScreen({ viewportHeight: Number(e.target.value) })} className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-700" />

        {/* Background Color */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Palette size={12} /> Screen Color
          </h3>
          <div className="flex gap-2">
              <input type="color" value={activeScreen.backgroundColor} onChange={e => updateScreen({ backgroundColor: e.target.value })} className="w-10 h-10 rounded border-none cursor-pointer p-0" />
              <input type="text" value={activeScreen.backgroundColor} onChange={e => updateScreen({ backgroundColor: e.target.value })} className="flex-1 p-2 text-xs border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono uppercase" />
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-700" />

        {/* Grid System */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Grid size={12} /> Grid Settings
          </h3>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-100 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Visible</span>
              <button 
                  onClick={() => updateGrid({ visible: !activeScreen.gridConfig.visible })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${activeScreen.gridConfig.visible ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${activeScreen.gridConfig.visible ? 'left-5.5' : 'left-0.5'}`} />
              </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-100 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Snap to Grid</span>
              <button 
                  onClick={() => updateGrid({ snapToGrid: !activeScreen.gridConfig.snapToGrid })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${activeScreen.gridConfig.snapToGrid ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${activeScreen.gridConfig.snapToGrid ? 'left-5.5' : 'left-0.5'}`} />
              </button>
          </div>

          <div className="space-y-2">
              <NumberInputControl 
                  label="Grid Size" 
                  value={activeScreen.gridConfig.size} 
                  min={5} max={100} step={5} 
                  suffix="px"
                  onChange={val => updateGrid({ size: val })} 
              />
          </div>

          <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Grid Color</label>
              <div className="flex gap-2">
                <input type="color" value={activeScreen.gridConfig.color} onChange={e => updateGrid({ color: e.target.value })} className="w-6 h-6 rounded p-0 border-none cursor-pointer" />
                <input type="text" value={activeScreen.gridConfig.color} onChange={e => updateGrid({ color: e.target.value })} className="flex-1 p-1 text-[10px] border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono uppercase" />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
