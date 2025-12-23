
import React, { useState, useEffect } from 'react';
import { Project, TemplateDefinition, AppSettings, ExportConfig, ScreenImage } from '../types';
import { SlidersHorizontal, Image as ImageIcon, Box, LayoutTemplate, ChevronRight, ChevronLeft, Images, Component, PenTool } from 'lucide-react';
import { LayerProperties } from './menus/properties/LayerProperties';
import { ScreenProperties } from './menus/properties/ScreenProperties';
import { ScreenGroupProperties } from './menus/properties/ScreenGroupProperties';
import { ProjectProperties } from './menus/properties/ProjectProperties';
import { BulkActions } from './menus/properties/BulkActions';
import { AssetsMenu } from './menus/AssetsMenu';
import { ComponentsMenu } from './menus/ComponentsMenu';
import { TemplatesMenu } from './menus/TemplatesMenu';
import { WireframeTemplatesMenu } from './menus/WireframeTemplatesMenu';
import { ScreenImagesMenu } from './menus/ScreenImagesMenu';
import { UIElementsMenu } from './menus/UIElementsMenu';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { v4 as uuidv4 } from 'uuid';

export type RightTab = 'properties' | 'assets' | 'components' | 'templates' | 'wireframes' | 'screen-images' | 'ui-elements';

interface SidebarRightProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  selectedElementIds: string[];
  setSelectedElementIds: (ids: string[]) => void;
  selectedScreenIds: string[];
  setSelectedScreenIds: (ids: string[]) => void;
  selectedScreenGroupIds?: string[];
  setSelectedScreenGroupIds?: (ids: string[]) => void;
  onPreviewTemplate: (template: TemplateDefinition) => void;
  onPreviewScreenImage: (image: ScreenImage) => void;
  appSettings?: AppSettings;
  onExport?: (config: Omit<ExportConfig, 'isOpen'>) => void;
  activeLeftTab?: string;
  autoCollapse?: boolean;
  activeTab: RightTab;
  setActiveTab: (tab: RightTab) => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  project,
  setProject,
  selectedElementIds,
  setSelectedElementIds,
  selectedScreenIds,
  setSelectedScreenIds,
  selectedScreenGroupIds = [],
  setSelectedScreenGroupIds,
  onPreviewTemplate,
  onPreviewScreenImage,
  appSettings,
  onExport,
  activeLeftTab,
  autoCollapse,
  activeTab,
  setActiveTab
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'layers' | 'screens' | 'project' | 'screenGroups'>('layers');

  useEffect(() => {
    if (autoCollapse) setIsCollapsed(true);
  }, [autoCollapse]);

  useEffect(() => {
    if (isPinned) return;
    // Automatically switch to properties when something is selected or the active screen changes
    if (selectedElementIds.length > 0 || selectedScreenIds.length > 0 || selectedScreenGroupIds.length > 0 || activeLeftTab === 'project') {
      setActiveTab('properties');
      if (!autoCollapse) setIsCollapsed(false);
    }
  }, [selectedElementIds, selectedScreenIds, selectedScreenGroupIds, activeLeftTab, isPinned, autoCollapse, project.activeScreenId]);

  // --- Actions ---

  const handleDeleteLayers = () => {
    setProject(prev => ({
      ...prev,
      screens: prev.screens.map(s => s.id === prev.activeScreenId ? { ...s, elements: s.elements.filter(el => !selectedElementIds.includes(el.id)) } : s)
    }));
    setSelectedElementIds([]);
  };

  const handleMoveLayersToRoot = () => {
    setProject(prev => ({
        ...prev,
        screens: prev.screens.map(s => s.id === prev.activeScreenId ? { 
            ...s, 
            elements: s.elements.map(el => selectedElementIds.includes(el.id) ? { ...el, parentId: undefined } : el) 
        } : s)
    }));
  };

  const handleGroupLayers = () => {
    const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
    if (!activeScreen || selectedElementIds.length < 2) return;
    const selectedEls = activeScreen.elements.filter(el => selectedElementIds.includes(el.id));
    const minX = Math.min(...selectedEls.map(el => el.x));
    const minY = Math.min(...selectedEls.map(el => el.y));
    const newGroup = {
      id: uuidv4(), type: 'group' as const, name: 'New Group', x: minX, y: minY,
      width: Math.max(...selectedEls.map(e => e.x + e.width)) - minX,
      height: Math.max(...selectedEls.map(e => e.y + e.height)) - minY,
      zIndex: Math.max(...selectedEls.map(e => e.zIndex)) + 1,
      props: {}, style: { backgroundColor: 'transparent' }, interactions: [], collapsed: false
    };
    setProject(prev => ({
      ...prev,
      screens: prev.screens.map(s => s.id === prev.activeScreenId ? { ...s, elements: [...s.elements.map(el => selectedElementIds.includes(el.id) ? { ...el, parentId: newGroup.id } : el), newGroup] } : s)
    }));
    setSelectedElementIds([newGroup.id]);
  };

  const handleDeleteScreens = () => {
    const remaining = project.screens.filter(s => !selectedScreenIds.includes(s.id));
    const nextActive = remaining.length > 0 ? remaining[0].id : uuidv4();
    const finalScreens = remaining.length > 0 ? remaining : [{ 
        id: nextActive, 
        name: 'Home', 
        backgroundColor: '#fff', 
        elements: [], 
        viewportWidth: project.viewportWidth, 
        viewportHeight: project.viewportHeight, 
        gridConfig: project.gridConfig 
    }];
    setProject(prev => ({ ...prev, screens: finalScreens, activeScreenId: nextActive }));
    setSelectedScreenIds([]);
  };

  const handleMoveScreensToRoot = () => {
      setProject(prev => ({
          ...prev,
          screens: prev.screens.map(s => selectedScreenIds.includes(s.id) ? { ...s, groupId: undefined } : s)
      }));
  };

  const handleDeleteGroups = () => {
    setProject(prev => ({
      ...prev,
      screenGroups: prev.screenGroups.filter(g => !selectedScreenGroupIds.includes(g.id)),
      screens: prev.screens.map(s => s.groupId && selectedScreenGroupIds.includes(s.groupId) ? { ...s, groupId: undefined } : s)
    }));
    if (setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);
  };

  const confirmDelete = () => {
    if (deleteType === 'project') {
      localStorage.removeItem(`potato_project_${project.id}`);
      window.location.reload();
    } else if (deleteType === 'layers') handleDeleteLayers();
    else if (deleteType === 'screens') handleDeleteScreens();
    else if (deleteType === 'screenGroups') handleDeleteGroups();
    setDeleteConfirmOpen(false);
  };

  const renderSelectionProperties = () => {
    // 1. Bulk Actions for multiple layers
    if (selectedElementIds.length > 1) {
      return (
        <BulkActions 
          label="Layers" count={selectedElementIds.length} 
          onGroup={handleGroupLayers} 
          onDelete={() => { setDeleteType('layers'); setDeleteConfirmOpen(true); }}
          onExport={() => onExport?.({ type: 'layer', targetIds: selectedElementIds })}
          onMove={handleMoveLayersToRoot}
        />
      );
    }
    
    // 2. Single Layer Properties
    if (selectedElementIds.length === 1) {
      return <LayerProperties project={project} setProject={setProject} selectedElementId={selectedElementIds[0]} />;
    }

    // 3. Bulk Actions for multiple screens
    if (selectedScreenIds.length > 1) {
      return (
        <BulkActions 
          label="Screens" count={selectedScreenIds.length}
          onGroup={() => {}} 
          onDelete={() => { setDeleteType('screens'); setDeleteConfirmOpen(true); }}
          onExport={() => onExport?.({ type: 'screen', targetIds: selectedScreenIds })}
          onMove={handleMoveScreensToRoot}
        />
      );
    }

    // 4. Single Screen Properties (Explicitly selected)
    if (selectedScreenIds.length === 1) {
      const screen = project.screens.find(s => s.id === selectedScreenIds[0]);
      if (screen) {
          return (
            <ScreenProperties 
              screen={screen} 
              onUpdate={(upd) => setProject(p => ({ ...p, screens: p.screens.map(s => s.id === screen.id ? { ...s, ...upd } : s) }))}
              onExport={() => onExport?.({ type: 'screen', targetId: screen.id })}
              onDelete={() => { setDeleteType('screens'); setDeleteConfirmOpen(true); }}
              onMoveToRoot={() => {
                  setProject(prev => ({ ...prev, screens: prev.screens.map(s => s.id === screen.id ? { ...s, groupId: undefined } : s) }));
              }}
            />
          );
      }
    }

    // 5. Screen Group Properties
    if (selectedScreenGroupIds.length === 1) {
      const group = project.screenGroups.find(g => g.id === selectedScreenGroupIds[0]);
      if (group) return (
        <ScreenGroupProperties 
          group={group} 
          childCounts={{ screens: project.screens.filter(s => s.groupId === group.id).length, groups: project.screenGroups.filter(g => g.parentId === group.id).length }}
          onUpdate={(upd) => setProject(p => ({ ...p, screenGroups: p.screenGroups.map(g => g.id === group.id ? { ...g, ...upd } : g) }))}
          onUngroup={() => {
               setProject(prev => ({
                   ...prev,
                   screenGroups: prev.screenGroups.filter(g => g.id !== group.id),
                   screens: prev.screens.map(s => s.groupId === group.id ? { ...s, groupId: group.parentId } : s)
               }));
               if (setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);
          }}
          onExport={() => onExport?.({ type: 'screen-group', targetId: group.id })}
          onDelete={() => { setDeleteType('screenGroups'); setDeleteConfirmOpen(true); }}
        />
      );
    }

    // 6. Project Properties (Left sidebar context)
    if (activeLeftTab === 'project') {
      return <ProjectProperties project={project} onExport={() => onExport?.({ type: 'project' })} onDelete={() => { setDeleteType('project'); setDeleteConfirmOpen(true); }} />;
    }

    // 7. DEFAULT: Auto-show active screen properties if nothing else is selected
    const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
    if (activeScreen) {
        return (
            <ScreenProperties 
              screen={activeScreen} 
              onUpdate={(upd) => setProject(p => ({ ...p, screens: p.screens.map(s => s.id === activeScreen.id ? { ...s, ...upd } : s) }))}
              onExport={() => onExport?.({ type: 'screen', targetId: activeScreen.id })}
              onDelete={() => { setDeleteType('screens'); setDeleteConfirmOpen(true); }}
              onMoveToRoot={() => {
                  setProject(prev => ({ ...prev, screens: prev.screens.map(s => s.id === activeScreen.id ? { ...s, groupId: undefined } : s) }));
              }}
            />
          );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
        <Box size={40} className="mb-4 opacity-20" />
        <p className="text-sm">Select an object on the canvas to edit its properties.</p>
      </div>
    );
  };

  return (
    <div className="flex h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 transition-colors duration-200">
      <div className="w-12 flex flex-col items-center py-2 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 z-20">
        <NavButton active={activeTab === 'properties'} onClick={() => { setActiveTab('properties'); setIsCollapsed(false); }} icon={SlidersHorizontal} label="Properties" />
        <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-2" />
        <NavButton active={activeTab === 'assets'} onClick={() => { setActiveTab('assets'); setIsCollapsed(false); }} icon={ImageIcon} label="Assets" />
        <NavButton active={activeTab === 'components'} onClick={() => { setActiveTab('components'); setIsCollapsed(false); }} icon={Box} label="Components" />
        <NavButton active={activeTab === 'wireframes'} onClick={() => { setActiveTab('wireframes'); setIsCollapsed(false); }} icon={PenTool} label="Wireframes" />
        <NavButton active={activeTab === 'templates'} onClick={() => { setActiveTab('templates'); setIsCollapsed(false); }} icon={LayoutTemplate} label="Templates" />
        <NavButton active={activeTab === 'ui-elements'} onClick={() => { setActiveTab('ui-elements'); setIsCollapsed(false); }} icon={Component} label="UI Elements" />
        <NavButton active={activeTab === 'screen-images'} onClick={() => { setActiveTab('screen-images'); setIsCollapsed(false); }} icon={Images} label="Images" />
        <div className="mt-auto">
             <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                 {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
             </button>
        </div>
      </div>

      <div className={`transition-all duration-300 overflow-hidden flex flex-col ${isCollapsed ? 'w-0' : 'w-72'}`}>
        {!isCollapsed && (
            <div className="flex-1 overflow-hidden animate-in fade-in duration-200" key={activeTab}>
                {activeTab === 'properties' && renderSelectionProperties()}
                {activeTab === 'assets' && <AssetsMenu project={project} setProject={setProject} onPreviewImage={onPreviewScreenImage} isPinned={isPinned} onTogglePin={() => setIsPinned(!isPinned)} />}
                {activeTab === 'components' && <ComponentsMenu isPinned={isPinned} onTogglePin={() => setIsPinned(!isPinned)} />}
                {activeTab === 'wireframes' && <WireframeTemplatesMenu project={project} setProject={setProject} onPreviewTemplate={onPreviewTemplate} isPinned={isPinned} onTogglePin={() => setIsPinned(!isPinned)} />}
                {activeTab === 'templates' && <TemplatesMenu project={project} setProject={setProject} onPreviewTemplate={onPreviewTemplate} isPinned={isPinned} onTogglePin={() => setIsPinned(!isPinned)} />}
                {activeTab === 'ui-elements' && <UIElementsMenu onPreviewImage={onPreviewScreenImage} isPinned={isPinned} onTogglePin={() => setIsPinned(!isPinned)} />}
                {activeTab === 'screen-images' && <ScreenImagesMenu onPreviewImage={onPreviewScreenImage} isPinned={isPinned} onTogglePin={() => setIsPinned(!isPinned)} />}
            </div>
        )}

        <ConfirmationModal 
            isOpen={deleteConfirmOpen}
            title={deleteType === 'project' ? "Delete Project?" : `Delete Selection?`}
            message={`Are you sure? This cannot be undone.`}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button onClick={onClick} className={`p-3 mb-2 rounded-lg transition-all relative group ${active ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
        <Icon size={20} />
        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{label}</div>
    </button>
);
