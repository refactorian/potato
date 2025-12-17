
import React from 'react';
import { AppSettings } from '../types';
import { ToggleRight, ToggleLeft, Monitor, Grid, HelpCircle, Sliders, MousePointerClick } from 'lucide-react';

interface AppSettingsPageProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

export const AppSettingsPage: React.FC<AppSettingsPageProps> = ({ settings, setSettings }) => {
  const toggleSetting = (key: keyof AppSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const SettingCard = ({ title, description, icon: Icon, isOn, onClick }: any) => (
      <div 
        onClick={onClick}
        className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all cursor-pointer ${isOn ? 'bg-white dark:bg-gray-800 border-indigo-500 shadow-sm' : 'bg-white dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
      >
          <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${isOn ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                  <Icon size={24} />
              </div>
              <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>
          </div>
          <button className={`text-4xl transition-colors ${isOn ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}>
              {isOn ? <ToggleRight /> : <ToggleLeft />}
          </button>
      </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-950 animate-in fade-in duration-300 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full p-10 space-y-10">
            
            <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <Sliders size={24} />
                    </div>
                    Application Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-2xl">Configure your workspace preferences and default behaviors.</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                
                {/* Workflow */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">Workflow & Navigation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingCard 
                            title="Auto-navigate to Layers" 
                            description="Automatically switch to the Layers tab in the sidebar when you select an element on the canvas."
                            icon={Monitor}
                            isOn={settings.autoNavigateToLayers}
                            onClick={() => toggleSetting('autoNavigateToLayers')}
                        />
                         <SettingCard 
                            title="Show Tooltips" 
                            description="Display helpful tooltips when hovering over interface elements and buttons."
                            icon={HelpCircle}
                            isOn={settings.showTooltips}
                            onClick={() => toggleSetting('showTooltips')}
                        />
                    </div>
                </section>

                {/* Presentation */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">Presentation & Preview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingCard 
                            title="Show Hotspots" 
                            description="Briefly highlight interactive elements when clicking an empty area in Preview Mode."
                            icon={MousePointerClick}
                            isOn={settings.showHotspots}
                            onClick={() => toggleSetting('showHotspots')}
                        />
                    </div>
                </section>

                {/* Defaults */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">New Project Defaults</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingCard 
                            title="Show Grid by Default" 
                            description="Enable the grid overlay automatically when creating a new project."
                            icon={Grid}
                            isOn={settings.defaultGridVisible}
                            onClick={() => toggleSetting('defaultGridVisible')}
                        />
                        <SettingCard 
                            title="Snap to Grid by Default" 
                            description="Enable snap-to-grid behavior for elements in new projects."
                            icon={Grid}
                            isOn={settings.defaultSnapToGrid}
                            onClick={() => toggleSetting('defaultSnapToGrid')}
                        />
                    </div>
                </section>

            </div>
        </div>
    </div>
  );
};
