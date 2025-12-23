
import React from 'react';
import { Screen, GridConfig } from '../../../types';
import { Smartphone, Tablet, Monitor, Grid, Palette, Maximize } from 'lucide-react';
import { NumberInputControl } from '../../common/NumberInputControl';

interface ScreenCanvasPropertiesProps {
  screen: Screen;
  onUpdate: (updates: Partial<Screen>) => void;
}

export const ScreenCanvasProperties: React.FC<ScreenCanvasPropertiesProps> = ({ screen, onUpdate }) => {
  const updateViewport = (width: number, height: number) => {
    onUpdate({ viewportWidth: width, viewportHeight: height });
  };

  const updateGrid = (updates: Partial<GridConfig>) => {
    onUpdate({ gridConfig: { ...screen.gridConfig, ...updates } });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              Screen Canvas
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
                  className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${screen.viewportWidth === 375 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
              >
                  <Smartphone size={16} className="mb-1" />
                  <span className="text-[10px]">Mobile</span>
              </button>
              <button 
                  onClick={() => updateViewport(768, 1024)}
                  className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${screen.viewportWidth === 768 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
              >
                  <Tablet size={16} className="mb-1" />
                  <span className="text-[10px]">Tablet</span>
              </button>
              <button 
                  onClick={() => updateViewport(1280, 800)}
                  className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${screen.viewportWidth === 1280 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
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
                      value={screen.viewportWidth} 
                      onChange={(e) => updateViewport(Number(e.target.value), screen.viewportHeight)}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                  />
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400">Height (px)</label>
                  <input 
                      type="number" 
                      value={screen.viewportHeight} 
                      onChange={(e) => updateViewport(screen.viewportWidth, Number(e.target.value))}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                  />
              </div>
          </div>
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
                  onClick={() => updateGrid({ visible: !screen.gridConfig.visible })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${screen.gridConfig.visible ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${screen.gridConfig.visible ? 'left-5.5' : 'left-0.5'}`} />
              </button>
          </div>

          <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Snap to Grid</span>
              <button 
                  onClick={() => updateGrid({ snapToGrid: !screen.gridConfig.snapToGrid })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${screen.gridConfig.snapToGrid ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${screen.gridConfig.snapToGrid ? 'left-5.5' : 'left-0.5'}`} />
              </button>
          </div>

          <div className="space-y-1">
              <NumberInputControl 
                  label="Grid Size"
                  value={screen.gridConfig.size}
                  min={5}
                  max={100}
                  step={5}
                  suffix="px"
                  onChange={(val) => updateGrid({ size: val })}
              />
          </div>

          <div className="space-y-1">
              <label className="text-[10px] text-gray-500 dark:text-gray-400">Grid Color</label>
              <div className="flex gap-2 items-center">
                  <input
                      type="color"
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      value={screen.gridConfig.color}
                      onChange={(e) => updateGrid({ color: e.target.value })}
                  />
                  <input 
                      type="text"
                      value={screen.gridConfig.color}
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
