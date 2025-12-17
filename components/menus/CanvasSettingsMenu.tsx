
import React from 'react';
import { Project } from '../../types';
import { Smartphone, Tablet, Monitor, Grid, Palette, Maximize } from 'lucide-react';

interface CanvasSettingsMenuProps {
  project: Project;
  setProject: (p: Project) => void;
}

export const CanvasSettingsMenu: React.FC<CanvasSettingsMenuProps> = ({ project, setProject }) => {
  const activeScreen = (project.screens || []).find(s => s.id === project.activeScreenId);

  const updateViewport = (width: number, height: number) => {
    setProject({ ...project, viewportWidth: width, viewportHeight: height });
  };

  const updateGrid = (updates: Partial<typeof project.gridConfig>) => {
    setProject({ ...project, gridConfig: { ...project.gridConfig, ...updates } });
  };

  const updateScreenBg = (color: string) => {
    const updatedScreens = project.screens.map(s => 
      s.id === project.activeScreenId ? { ...s, backgroundColor: color } : s
    );
    setProject({ ...project, screens: updatedScreens });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              Canvas Settings
          </h2>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        
        {/* Viewport Settings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Maximize size={12} /> Viewport Size
          </h3>
          
          <div className="grid grid-cols-3 gap-2">
              <button 
                  onClick={() => updateViewport(375, 812)}
                  className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${project.viewportWidth === 375 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
              >
                  <Smartphone size={16} className="mb-1" />
                  <span className="text-[10px]">Mobile</span>
              </button>
              <button 
                  onClick={() => updateViewport(768, 1024)}
                  className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${project.viewportWidth === 768 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
              >
                  <Tablet size={16} className="mb-1" />
                  <span className="text-[10px]">Tablet</span>
              </button>
              <button 
                  onClick={() => updateViewport(1280, 800)}
                  className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${project.viewportWidth === 1280 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
              >
                  <Monitor size={16} className="mb-1" />
                  <span className="text-[10px]">Desktop</span>
              </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400">Width (px)</label>
                  <input 
                      type="number" 
                      value={project.viewportWidth} 
                      onChange={(e) => updateViewport(Number(e.target.value), project.viewportHeight)}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                  />
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400">Height (px)</label>
                  <input 
                      type="number" 
                      value={project.viewportHeight} 
                      onChange={(e) => updateViewport(project.viewportWidth, Number(e.target.value))}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                  />
              </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Screen Background */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Palette size={12} /> Screen Background
          </h3>
          {activeScreen ? (
              <div className="flex gap-2 items-center">
                  <input
                      type="color"
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      value={activeScreen.backgroundColor}
                      onChange={(e) => updateScreenBg(e.target.value)}
                  />
                  <input 
                      type="text"
                      value={activeScreen.backgroundColor}
                      onChange={(e) => updateScreenBg(e.target.value)}
                      className="flex-1 p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none uppercase"
                  />
              </div>
          ) : (
              <div className="text-xs text-gray-400 italic">No screen active</div>
          )}
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Grid Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Grid size={12} /> Grid System
          </h3>

          <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Grid</span>
              <button 
                  onClick={() => updateGrid({ visible: !project.gridConfig.visible })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${project.gridConfig.visible ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${project.gridConfig.visible ? 'left-5.5' : 'left-0.5'}`} />
              </button>
          </div>

          <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Snap to Grid</span>
              <button 
                  onClick={() => updateGrid({ snapToGrid: !project.gridConfig.snapToGrid })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${project.gridConfig.snapToGrid ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${project.gridConfig.snapToGrid ? 'left-5.5' : 'left-0.5'}`} />
              </button>
          </div>

          <div className="space-y-1">
              <div className="flex justify-between items-center">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400">Grid Size (px)</label>
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">{project.gridConfig.size}px</span>
              </div>
              <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5"
                  value={project.gridConfig.size}
                  onChange={(e) => updateGrid({ size: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
              />
          </div>

          <div className="space-y-1">
              <label className="text-[10px] text-gray-500 dark:text-gray-400">Grid Color</label>
              <div className="flex gap-2 items-center">
                  <input
                      type="color"
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      value={project.gridConfig.color}
                      onChange={(e) => updateGrid({ color: e.target.value })}
                  />
                  <input 
                      type="text"
                      value={project.gridConfig.color}
                      onChange={(e) => updateGrid({ color: e.target.value })}
                      className="flex-1 p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none uppercase"
                  />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
