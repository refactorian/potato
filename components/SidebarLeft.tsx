
import React, { useState, useEffect } from 'react';
import { Layout, Layers, ChevronLeft, ChevronRight, Cog, FolderKanban } from 'lucide-react';
import { Project, LeftSidebarTab, AppSettings, ExportConfig } from '../types';
import { ScreensMenu } from './menus/ScreensMenu';
import { LayersMenu } from './menus/LayersMenu';
import { ProjectMenu } from './menus/ProjectMenu';

interface SidebarLeftProps {
  project: Project;
  setProject: (p: Project) => void;
  selectedElementIds: string[];
  setSelectedElementIds: (ids: string[]) => void;
  selectedScreenIds: string[];
  setSelectedScreenIds: (ids: string[]) => void;
  selectedScreenGroupIds?: string[];
  setSelectedScreenGroupIds?: (ids: string[]) => void;
  activeTab: LeftSidebarTab;
  setActiveTab: (tab: LeftSidebarTab) => void;
  appSettings: AppSettings;
  setAppSettings: (s: AppSettings) => void;
  onExport: (config: Omit<ExportConfig, 'isOpen'>) => void;
  autoCollapse?: boolean;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  project,
  setProject,
  selectedElementIds,
  setSelectedElementIds,
  selectedScreenIds,
  setSelectedScreenIds,
  selectedScreenGroupIds = [],
  setSelectedScreenGroupIds = () => {},
  activeTab,
  setActiveTab,
  appSettings,
  setAppSettings,
  onExport,
  autoCollapse
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
      if (autoCollapse) {
          setIsCollapsed(true);
      }
  }, [autoCollapse]);

  const toggleTab = (tab: LeftSidebarTab) => {
    if (activeTab === tab && !isCollapsed) {
        if (tab !== 'settings') {
            setIsCollapsed(true);
        }
    } else {
        setActiveTab(tab);
        if (tab !== 'settings') {
            setIsCollapsed(false);
        }
    }
  };

  return (
    <div className="flex h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-30 transition-all">
      
      {/* Vertical Rail */}
      <div className="w-12 flex flex-col items-center py-2 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 z-20">
         
         <NavButton 
            active={activeTab === 'project'} 
            onClick={() => toggleTab('project')} 
            icon={FolderKanban} 
            label="Project Info" 
            showTooltips={appSettings.showTooltips}
         />

         <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-2" />

         <NavButton 
            active={activeTab === 'screens'} 
            onClick={() => toggleTab('screens')} 
            icon={Layout} 
            label="Screens" 
            showTooltips={appSettings.showTooltips}
         />
         <NavButton 
            active={activeTab === 'layers'} 
            onClick={() => toggleTab('layers')} 
            icon={Layers} 
            label="Layers" 
            showTooltips={appSettings.showTooltips}
         />

        <div className="mt-auto flex flex-col items-center pb-2 gap-2">
            <NavButton 
                active={activeTab === 'settings'} 
                onClick={() => toggleTab('settings')} 
                icon={Cog} 
                label="App Settings" 
                showTooltips={appSettings.showTooltips}
            />
            
             {activeTab !== 'settings' && (
                 <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
                 >
                     {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                 </button>
             )}
        </div>
      </div>

      {/* Panel Content */}
      <div className={`${(isCollapsed || activeTab === 'settings') ? 'w-0' : 'w-64'} transition-all duration-300 overflow-hidden flex flex-col bg-white dark:bg-gray-800`}>
          {!isCollapsed && activeTab !== 'settings' && (
             <>
                {activeTab === 'project' && (
                    <ProjectMenu 
                        project={project}
                        setProject={setProject}
                        appSettings={appSettings}
                        onExport={onExport}
                    />
                )}

                {activeTab === 'screens' && (
                    <ScreensMenu 
                        project={project} 
                        setProject={setProject} 
                        setSelectedElementIds={setSelectedElementIds} 
                        selectedScreenIds={selectedScreenIds}
                        setSelectedScreenIds={setSelectedScreenIds}
                        selectedGroupIds={selectedScreenGroupIds}
                        setSelectedGroupIds={setSelectedScreenGroupIds}
                        appSettings={appSettings}
                        onExport={onExport}
                    />
                )}

                {activeTab === 'layers' && (
                    <LayersMenu 
                        project={project} 
                        setProject={setProject} 
                        selectedElementIds={selectedElementIds}
                        setSelectedElementIds={setSelectedElementIds} 
                        selectedScreenIds={selectedScreenIds}
                        setSelectedScreenIds={setSelectedScreenIds}
                        setSelectedScreenGroupIds={setSelectedScreenGroupIds}
                        appSettings={appSettings}
                        onExport={onExport}
                    />
                )}
             </>
          )}
      </div>
    </div>
  );
};

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    showTooltips: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon: Icon, label, showTooltips }) => (
    <button
        onClick={onClick}
        className={`p-3 mb-2 rounded-lg transition-all relative group ${
            active 
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
    >
        <Icon size={20} />
        {showTooltips && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-gray-700">
                {label}
            </div>
        )}
    </button>
);
