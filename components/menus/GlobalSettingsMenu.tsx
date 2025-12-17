
import React from 'react';
import { AppSettings } from '../../types';
import { ToggleRight, ToggleLeft, Monitor, Grid, HelpCircle, Trash2 } from 'lucide-react';

interface GlobalSettingsMenuProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

export const GlobalSettingsMenu: React.FC<GlobalSettingsMenuProps> = ({ settings, setSettings }) => {
  
  const toggleSetting = (key: keyof AppSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              App Settings
          </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        
        {/* Workflow Section */}
        <section className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Workflow
            </h3>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded text-indigo-500 shadow-sm">
                        <Monitor size={18} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">Auto-navigate Layers</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight max-w-[150px]">
                            Switch to Layers tab when selecting an element.
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => toggleSetting('autoNavigateToLayers')}
                    className={`text-2xl transition-colors ${settings.autoNavigateToLayers ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}
                >
                    {settings.autoNavigateToLayers ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
            </div>
        </section>

        <div className="h-px bg-gray-100 dark:bg-gray-700" />

        {/* Defaults Section */}
        <section className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                New Project Defaults
            </h3>

            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                    <Grid size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Grid</span>
                </div>
                <button 
                    onClick={() => toggleSetting('defaultGridVisible')}
                    className={`transition-colors ${settings.defaultGridVisible ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}
                >
                    {settings.defaultGridVisible ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
            </div>

            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                    <Grid size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Snap to Grid</span>
                </div>
                <button 
                    onClick={() => toggleSetting('defaultSnapToGrid')}
                    className={`transition-colors ${settings.defaultSnapToGrid ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}
                >
                    {settings.defaultSnapToGrid ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
            </div>
        </section>

        <div className="h-px bg-gray-100 dark:bg-gray-700" />

        {/* Deletion Behavior */}
        <section className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Deletion Logic
            </h3>

            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                    <Trash2 size={16} className="text-gray-400" />
                    <div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">Delete Group Content</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">Screens in Group</div>
                    </div>
                </div>
                <button 
                    onClick={() => toggleSetting('deleteScreensWithGroup')}
                    className={`transition-colors ${settings.deleteScreensWithGroup ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}
                >
                    {settings.deleteScreensWithGroup ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
            </div>

            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                    <Trash2 size={16} className="text-gray-400" />
                    <div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">Delete Layer Children</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">Elements in Group</div>
                    </div>
                </div>
                <button 
                    onClick={() => toggleSetting('deleteLayersWithGroup')}
                    className={`transition-colors ${settings.deleteLayersWithGroup ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}
                >
                    {settings.deleteLayersWithGroup ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
            </div>
        </section>

        <div className="h-px bg-gray-100 dark:bg-gray-700" />
        
        {/* Help Section */}
        <section className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Interface
            </h3>
             <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Tooltips</span>
                </div>
                <button 
                    onClick={() => toggleSetting('showTooltips')}
                    className={`transition-colors ${settings.showTooltips ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}
                >
                    {settings.showTooltips ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
            </div>
        </section>

      </div>
    </div>
  );
};
