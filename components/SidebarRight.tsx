
import React, { useState, useEffect } from 'react';
import { Project, TemplateDefinition, AppSettings, ExportConfig, ScreenGroup, LeftSidebarTab, ScreenImage } from '../types';
import { SlidersHorizontal, Image as ImageIcon, Box, LayoutTemplate, ChevronRight, ChevronLeft, Group, Trash2, FolderOutput, Smartphone, Palette, Download, Monitor, Tablet, Plus, X, FolderKanban, Ungroup, Eye, EyeOff, Images, Component, PenTool } from 'lucide-react';
import { PropertiesMenu } from './menus/PropertiesMenu';
import { AssetsMenu } from './menus/AssetsMenu';
import { ComponentsMenu } from './menus/ComponentsMenu';
import { TemplatesMenu } from './menus/TemplatesMenu';
import { WireframeTemplatesMenu } from './menus/WireframeTemplatesMenu';
import { ScreenImagesMenu } from './menus/ScreenImagesMenu';
import { UIElementsMenu } from './menus/UIElementsMenu';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { v4 as uuidv4 } from 'uuid';

interface SidebarRightProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  selectedElementIds: string[];
  selectedScreenIds: string[];
  selectedScreenGroupIds?: string[];
  onPreviewTemplate: (template: TemplateDefinition) => void;
  onPreviewScreenImage: (image: ScreenImage) => void;
  appSettings?: AppSettings;
  onExport?: (config: Omit<ExportConfig, 'isOpen'>) => void;
  activeLeftTab?: LeftSidebarTab;
}

type RightTab = 'properties' | 'assets' | 'components' | 'templates' | 'wireframes' | 'screen-images' | 'ui-elements';

export const SidebarRight: React.FC<SidebarRightProps> = ({
  project,
  setProject,
  selectedElementIds,
  selectedScreenIds,
  selectedScreenGroupIds = [],
  onPreviewTemplate,
  onPreviewScreenImage,
  appSettings,
  onExport,
  activeLeftTab
}) => {
  const [activeTab, setActiveTab] = useState<RightTab>('components');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'layers' | 'screens' | 'project' | 'screenGroups'>('layers');

  // Auto-switch to properties tab when elements/screens are selected
  useEffect(() => {
    if (isPinned) return;

    if (selectedElementIds.length > 0 || selectedScreenIds.length > 0 || selectedScreenGroupIds.length > 0 || activeLeftTab === 'project') {
      setActiveTab('properties');
      setIsCollapsed(false); 
    }
  }, [selectedElementIds, selectedScreenIds, selectedScreenGroupIds, activeLeftTab, isPinned]);

  const toggleTab = (tab: RightTab) => {
    if (activeTab === tab && !isCollapsed) {
        setIsCollapsed(true);
    } else {
        if (activeTab !== tab) {
            setIsPinned(false);
        }
        setActiveTab(tab);
        setIsCollapsed(false);
    }
  };

  const handleDeleteProject = () => {
      localStorage.removeItem(`potato_project_${project.id}`);
      
      const indexStr = localStorage.getItem('potato_projects_index');
      let remainingProjects: any[] = [];
      if (indexStr) {
          const list = JSON.parse(indexStr);
          remainingProjects = list.filter((p: any) => p.id !== project.id);
          localStorage.setItem('potato_projects_index', JSON.stringify(remainingProjects));
      }
      
      setDeleteConfirmOpen(false);

      if (remainingProjects.length > 0) {
          const nextId = remainingProjects[0].id;
          const storedData = localStorage.getItem(`potato_project_${nextId}`);
          if (storedData) {
              setProject(JSON.parse(storedData));
          }
      } else {
          const blankId = uuidv4();
          const blankProject: Project = {
              id: blankId,
              name: 'First Project',
              lastModified: Date.now(),
              viewportWidth: 375, viewportHeight: 812,
              activeScreenId: 'screen-1', assets: [], screenGroups: [],
              gridConfig: { 
                  visible: appSettings?.defaultGridVisible ?? true, 
                  size: 20, 
                  color: '#cbd5e1', 
                  snapToGrid: appSettings?.defaultSnapToGrid ?? true 
              },
              screens: [{ id: 'screen-1', name: 'Home', backgroundColor: '#ffffff', elements: [] }]
          };
          localStorage.setItem(`potato_project_${blankId}`, JSON.stringify(blankProject));
          const newIndexList = [{ id: blankId, name: blankProject.name, lastModified: blankProject.lastModified }];
          localStorage.setItem('potato_projects_index', JSON.stringify(newIndexList));
          setProject(blankProject);
      }
  };

  /* --- Layer Actions --- */
  const handleDeleteLayers = () => {
      const updatedScreens = project.screens.map(s => {
          if (s.id !== project.activeScreenId) return s;
          const remainingElements = s.elements.filter(el => !selectedElementIds.includes(el.id));
          return { ...s, elements: remainingElements };
      });
      setProject({ ...project, screens: updatedScreens });
  };

  const confirmDelete = () => {
      if (deleteType === 'project') {
          handleDeleteProject();
      } else if (deleteType === 'layers') {
          handleDeleteLayers();
      } else if (deleteType === 'screens') {
          handleDeleteScreens();
      } else if (deleteType === 'screenGroups') {
          handleDeleteScreenGroups();
      }
      setDeleteConfirmOpen(false);
  };

  const handleGroupLayers = () => {
      const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
      if (!activeScreen || selectedElementIds.length < 1) return; 

      const selectedEls = activeScreen.elements.filter(el => selectedElementIds.includes(el.id));
      if (selectedEls.length === 0) return;

      const minX = Math.min(...selectedEls.map(el => el.x));
      const minY = Math.min(...selectedEls.map(el => el.y));
      const maxX = Math.max(...selectedEls.map(el => el.x + el.width));
      const maxY = Math.max(...selectedEls.map(el => el.y + el.height));

      const newGroup = {
          id: uuidv4(),
          type: 'group' as const,
          name: 'Group',
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          zIndex: Math.max(...selectedEls.map(el => el.zIndex)) + 1,
          props: {},
          style: { backgroundColor: 'transparent' },
          interactions: [],
          collapsed: false
      };

      const updatedElements = activeScreen.elements.map(el => {
          if (selectedElementIds.includes(el.id)) {
              return { ...el, parentId: newGroup.id };
          }
          return el;
      });

      const updatedScreens = project.screens.map(s => {
          if (s.id !== project.activeScreenId) return s;
          return { ...s, elements: [...updatedElements, newGroup] };
      });

      setProject({ ...project, screens: updatedScreens });
  };

  const handleExportLayers = () => {
      if (onExport) {
          if (selectedElementIds.length > 1) {
              onExport({ type: 'layer', targetIds: selectedElementIds });
          } else {
              onExport({ type: 'layer', targetId: selectedElementIds[0] });
          }
      }
  };

  const handleMoveLayersToRoot = () => {
      const updatedScreens = project.screens.map(s => {
          if (s.id !== project.activeScreenId) return s;
          const updatedElements = s.elements.map(el => selectedElementIds.includes(el.id) ? { ...el, parentId: undefined } : el);
          return { ...s, elements: updatedElements };
      });
      setProject({ ...project, screens: updatedScreens });
  };

  /* --- Screen Actions --- */
  const handleGroupScreens = () => {
      if (selectedScreenIds.length > 0) {
          const newGroupId = uuidv4();
          const firstScreen = project.screens.find(s => s.id === selectedScreenIds[0]);
          const parentId = firstScreen?.groupId;
          const newGroup: ScreenGroup = { id: newGroupId, name: 'Group', collapsed: false, parentId };
          
          const updatedScreens = project.screens.map(s => selectedScreenIds.includes(s.id) ? { ...s, groupId: newGroupId } : s);
          setProject({ ...project, screenGroups: [...project.screenGroups, newGroup], screens: updatedScreens });
      }
  };

  const handleDeleteScreens = () => {
      if (selectedScreenIds.length > 0) {
          const remainingScreens = project.screens.filter(s => !selectedScreenIds.includes(s.id));
          if (remainingScreens.length === 0) remainingScreens.push({ id: uuidv4(), name: 'Home', backgroundColor: '#fff', elements: [] });
          setProject({ ...project, screens: remainingScreens, activeScreenId: remainingScreens[0].id });
      }
  };

  const handleExportScreens = () => {
      if (!onExport) return;
      if (selectedScreenIds.length > 0) {
          onExport({ type: 'screen', targetIds: selectedScreenIds });
      }
  };

  const handleMoveScreensToRoot = () => {
      if (selectedScreenIds.length > 0) {
          const updatedScreens = project.screens.map(s => selectedScreenIds.includes(s.id) ? { ...s, groupId: undefined } : s);
          setProject({ ...project, screens: updatedScreens });
      }
  };

  const updateScreenColor = (screenId: string, color: string) => {
      const updatedScreens = project.screens.map(s => s.id === screenId ? { ...s, backgroundColor: color } : s);
      setProject({ ...project, screens: updatedScreens });
  };

  const updateScreenName = (screenId: string, name: string) => {
      const updatedScreens = project.screens.map(s => s.id === screenId ? { ...s, name: name } : s);
      setProject({ ...project, screens: updatedScreens });
  };

  const toggleScreenVisibility = (screenId: string) => {
      const updatedScreens = project.screens.map(s => s.id === screenId ? { ...s, hidden: !s.hidden } : s);
      setProject({ ...project, screens: updatedScreens });
  };

  /* --- Screen Group Actions --- */
  const handleUngroupScreens = () => {
      if (selectedScreenGroupIds.length === 0) return;
      
      let updatedScreens = [...project.screens];
      let updatedGroups = [...project.screenGroups];
      
      selectedScreenGroupIds.forEach(groupId => {
          const group = project.screenGroups.find(g => g.id === groupId);
          const parentId = group?.parentId;
          
          updatedScreens = updatedScreens.map(s => s.groupId === groupId ? { ...s, groupId: parentId } : s);
          updatedGroups = updatedGroups.map(g => g.parentId === groupId ? { ...g, parentId: parentId } : g);
      });
      
      updatedGroups = updatedGroups.filter(g => !selectedScreenGroupIds.includes(g.id));
      
      setProject({ ...project, screenGroups: updatedGroups, screens: updatedScreens });
      // We don't necessarily need to clear selection here, but it's cleaner
  };

  const handleDeleteScreenGroups = () => {
        const idsToDelete = selectedScreenGroupIds;
        const getAllDescendants = (groupIds: string[]) => {
            const childGroups = project.screenGroups.filter(g => g.parentId && groupIds.includes(g.parentId)).map(g => g.id);
            if (childGroups.length > 0) {
                return [...childGroups, ...getAllDescendants(childGroups)];
            }
            return [];
        };
        const allGroupIdsToDelete = [...idsToDelete, ...getAllDescendants(idsToDelete)];
        
        const updatedGroups = project.screenGroups.filter(g => !allGroupIdsToDelete.includes(g.id));
        const updatedScreens = project.screens.filter(s => !s.groupId || !allGroupIdsToDelete.includes(s.groupId));
        
        if (updatedScreens.length === 0) {
             updatedScreens.push({ id: uuidv4(), name: 'Home', backgroundColor: '#fff', elements: [] });
        }
        
        setProject({ ...project, screenGroups: updatedGroups, screens: updatedScreens, activeScreenId: updatedScreens[0]?.id || 'screen-1' });
  };

  const updateGroupName = (groupId: string, name: string) => {
      const updatedGroups = project.screenGroups.map(g => g.id === groupId ? { ...g, name } : g);
      setProject({ ...project, screenGroups: updatedGroups });
  };

  const toggleGroupVisibility = (groupId: string) => {
      const updatedGroups = project.screenGroups.map(g => g.id === groupId ? { ...g, hidden: !g.hidden } : g);
      setProject({ ...project, screenGroups: updatedGroups });
  };

  const handleExportGroup = () => {
      if (!onExport) return;
      if (selectedScreenGroupIds.length === 1) {
          onExport({ type: 'screen-group', targetId: selectedScreenGroupIds[0] });
      }
  };

  /* --- Render Helpers --- */
  const renderActionButtons = (
      onGroup: () => void, 
      onDelete: () => void, 
      onExport: () => void, 
      onMove: () => void,
      label: string,
      count: number
  ) => (
      <div className="flex flex-col h-full p-4">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Bulk Actions
          </div>
          <div className="text-xs text-gray-500 mb-6">{count} {label} selected</div>
          
          <div className="space-y-3">
              {label !== 'Groups' && (
                  <button 
                      onClick={onGroup}
                      className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                      <Group size={18} /> Group Selection
                  </button>
              )}
              <button 
                  onClick={onMove}
                  className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                  {label === 'Groups' ? <Ungroup size={18} /> : <FolderOutput size={18} />} {label === 'Groups' ? 'Ungroup Selected' : 'Move to Unsorted'}
              </button>
              {label !== 'Groups' && (
                  <button 
                      onClick={onExport}
                      className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                      <ImageIcon size={18} /> Export as ZIP
                  </button>
              )}
              <button 
                  onClick={() => { 
                      if (label === 'Screens') setDeleteType('screens');
                      else if (label === 'Groups') setDeleteType('screenGroups');
                      else setDeleteType('layers'); 
                      setDeleteConfirmOpen(true); 
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium text-red-600 dark:text-red-400"
              >
                  <Trash2 size={18} /> Delete Selected
              </button>
          </div>
      </div>
  );

  return (
    <div className="flex h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 transition-colors duration-200">
      
      {/* Vertical Navigation Rail */}
      <div className="w-12 flex flex-col items-center py-2 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 z-20">
        <NavButton 
            active={activeTab === 'properties'} 
            onClick={() => toggleTab('properties')} 
            icon={SlidersHorizontal} 
            label="Properties" 
            showTooltips={appSettings?.showTooltips}
        />
        <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 my-2" />
        <NavButton 
            active={activeTab === 'assets'} 
            onClick={() => toggleTab('assets')} 
            icon={ImageIcon} 
            label="Assets" 
            showTooltips={appSettings?.showTooltips}
        />
        <NavButton 
            active={activeTab === 'components'} 
            onClick={() => toggleTab('components')} 
            icon={Box} 
            label="Components" 
            showTooltips={appSettings?.showTooltips}
        />
        <NavButton 
            active={activeTab === 'wireframes'} 
            onClick={() => toggleTab('wireframes')} 
            icon={PenTool} 
            label="Wireframe Templates" 
            showTooltips={appSettings?.showTooltips}
        />
        <NavButton 
            active={activeTab === 'templates'} 
            onClick={() => toggleTab('templates')} 
            icon={LayoutTemplate} 
            label="Screen Templates" 
            showTooltips={appSettings?.showTooltips}
        />
        <NavButton 
            active={activeTab === 'ui-elements'} 
            onClick={() => toggleTab('ui-elements')} 
            icon={Component} 
            label="UI Elements" 
            showTooltips={appSettings?.showTooltips}
        />
        <NavButton 
            active={activeTab === 'screen-images'} 
            onClick={() => toggleTab('screen-images')} 
            icon={Images} 
            label="Screen Images" 
            showTooltips={appSettings?.showTooltips}
        />
        
        <div className="mt-auto">
             <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
             >
                 {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
             </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`transition-all duration-300 overflow-hidden flex flex-col ${isCollapsed ? 'w-0' : 'w-72'}`}>
        {!isCollapsed && (
            <>
                {activeTab === 'properties' && (
                    <>
                        {/* 1. Multiple Screen Selection */}
                        {selectedScreenIds.length > 1 ? (
                            renderActionButtons(
                                handleGroupScreens, 
                                handleDeleteScreens, 
                                handleExportScreens, 
                                handleMoveScreensToRoot, 
                                'Screens', 
                                selectedScreenIds.length
                            )
                        ) 
                        /* 2. Single Screen Selection */
                        : selectedScreenIds.length === 1 ? (
                            (() => {
                                const screen = project.screens.find(s => s.id === selectedScreenIds[0]);
                                if (!screen) return null;
                                return (
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Screen Details</div>
                                                <button 
                                                    onClick={() => toggleScreenVisibility(screen.id)}
                                                    className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${screen.hidden ? 'text-gray-400' : 'text-indigo-600 dark:text-indigo-400'}`}
                                                    title={screen.hidden ? "Unhide Screen" : "Hide Screen"}
                                                >
                                                    {screen.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500 dark:text-gray-400">Name</label>
                                                    <input 
                                                        type="text" 
                                                        value={screen.name} 
                                                        onChange={(e) => updateScreenName(screen.id, e.target.value)} 
                                                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2"><Palette size={12}/> Background Color</label>
                                                    <div className="flex gap-2">
                                                        <input type="color" value={screen.backgroundColor} onChange={(e) => updateScreenColor(screen.id, e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
                                                        <input type="text" value={screen.backgroundColor} onChange={(e) => updateScreenColor(screen.id, e.target.value)} className="flex-1 p-2 text-xs border rounded bg-white dark:bg-gray-700 dark:border-gray-600 uppercase" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                                                    <span>Elements: {screen.elements.length}</span>
                                                    <span>ID: {screen.id.slice(0,6)}...</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-850 mt-auto border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Actions</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button onClick={handleExportScreens} className="flex items-center justify-center gap-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors" title="Export Image">
                                                    <ImageIcon size={14} /> Export
                                                </button>
                                                <button onClick={() => { setDeleteType('screens'); setDeleteConfirmOpen(true); }} className="flex items-center justify-center gap-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded text-xs hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors" title="Delete Screen">
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                                <button onClick={handleMoveScreensToRoot} className="col-span-2 flex items-center justify-center gap-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                                                    <FolderOutput size={14} /> Move to Unsorted
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()
                        )
                        /* 3. Screen Group Selection */
                        : selectedScreenGroupIds.length > 0 ? (
                            selectedScreenGroupIds.length === 1 ? (
                                (() => {
                                    const group = project.screenGroups.find(g => g.id === selectedScreenGroupIds[0]);
                                    if (!group) return null;
                                    const childScreens = project.screens.filter(s => s.groupId === group.id);
                                    const childGroups = project.screenGroups.filter(g => g.parentId === group.id);
                                    
                                    return (
                                        <div className="flex flex-col h-full">
                                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Group Details</div>
                                                    <button 
                                                        onClick={() => toggleGroupVisibility(group.id)}
                                                        className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${group.hidden ? 'text-gray-400' : 'text-indigo-600 dark:text-indigo-400'}`}
                                                        title={group.hidden ? "Unhide Group" : "Hide Group"}
                                                    >
                                                        {group.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-gray-500 dark:text-gray-400">Name</label>
                                                        <input 
                                                            type="text" 
                                                            value={group.name} 
                                                            onChange={(e) => updateGroupName(group.id, e.target.value)} 
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 pt-2">
                                                        <span>Contains:</span>
                                                        <ul className="list-disc pl-4 space-y-0.5">
                                                            <li>{childScreens.length} Screens</li>
                                                            <li>{childGroups.length} Sub-groups</li>
                                                        </ul>
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-mono pt-2">ID: {group.id.slice(0,8)}...</div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-850 mt-auto border-t border-gray-200 dark:border-gray-700">
                                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Actions</div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button onClick={handleUngroupScreens} className="col-span-2 flex items-center justify-center gap-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                                                        <Ungroup size={14} /> Ungroup
                                                    </button>
                                                    <button onClick={handleExportGroup} className="flex items-center justify-center gap-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors" title="Export Group">
                                                        <ImageIcon size={14} /> Export
                                                    </button>
                                                    <button onClick={() => { setDeleteType('screenGroups'); setDeleteConfirmOpen(true); }} className="flex items-center justify-center gap-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded text-xs hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors" title="Delete Group">
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })()
                            ) : (
                                renderActionButtons(
                                    () => {}, // No group grouping
                                    () => { setDeleteType('screenGroups'); setDeleteConfirmOpen(true); },
                                    () => {}, // Export logic for multiple groups not yet implemented
                                    handleUngroupScreens, // Ungroup
                                    'Groups',
                                    selectedScreenGroupIds.length
                                )
                            )
                        )
                        /* 4. Multiple Layer Selection */
                        : selectedElementIds.length > 1 ? (
                            renderActionButtons(
                                handleGroupLayers, 
                                handleDeleteLayers, 
                                handleExportLayers, 
                                handleMoveLayersToRoot, 
                                'Layers', 
                                selectedElementIds.length
                            )
                        ) 
                        /* 5. Single Layer Selection */
                        : selectedElementIds.length === 1 ? (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-hidden">
                                    <PropertiesMenu
                                        project={project}
                                        setProject={setProject}
                                        selectedElementId={selectedElementIds[0] || null}
                                    />
                                </div>
                                {/* Append Action Buttons for Single Selection at the bottom */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
                                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Actions</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={handleGroupLayers} className="flex items-center justify-center gap-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors" title="Group Item">
                                            <Group size={14} /> Group
                                        </button>
                                        <button onClick={handleMoveLayersToRoot} className="flex items-center justify-center gap-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors" title="Move to Unsorted">
                                            <FolderOutput size={14} /> Unsort
                                        </button>
                                        <button onClick={handleExportLayers} className="flex items-center justify-center gap-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors" title="Export Image">
                                            <ImageIcon size={14} /> Export
                                        </button>
                                        <button onClick={() => { setDeleteType('layers'); setDeleteConfirmOpen(true); }} className="flex items-center justify-center gap-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded text-xs hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors" title="Delete Item">
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) 
                        /* 6. Project Actions (Only if nothing selected) */
                        : activeLeftTab === 'project' ? (
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <div className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Project Actions</div>
                                    <FolderKanban className="text-gray-400" size={16} />
                                </div>
                                <div className="flex-1 p-4 space-y-6">
                                    <div className="space-y-3">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Manage the entire project lifecycle here.</div>
                                        <div className="flex flex-col gap-3">
                                            <button 
                                                onClick={() => onExport && onExport({ type: 'project' })}
                                                className="w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors font-medium shadow-sm"
                                            >
                                                <Download size={18} /> Export Project
                                            </button>
                                            <button 
                                                onClick={() => { setDeleteType('project'); setDeleteConfirmOpen(true); }}
                                                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors font-medium shadow-sm"
                                            >
                                                <Trash2 size={18} /> Delete Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        /* 7. No Selection & No Project Tab Active */
                        : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-8 text-center">
                                <p>Select an element to edit properties</p>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'assets' && (
                    <AssetsMenu 
                        project={project} 
                        setProject={setProject} 
                        onPreviewImage={onPreviewScreenImage}
                        activeLeftTab={activeLeftTab}
                        isPinned={isPinned}
                        onTogglePin={() => setIsPinned(!isPinned)}
                    />
                )}
                {activeTab === 'components' && (
                    <ComponentsMenu 
                        isPinned={isPinned}
                        onTogglePin={() => setIsPinned(!isPinned)}
                    />
                )}
                {activeTab === 'wireframes' && (
                    <WireframeTemplatesMenu 
                        project={project}
                        setProject={setProject}
                        onPreviewTemplate={onPreviewTemplate}
                        isPinned={isPinned}
                        onTogglePin={() => setIsPinned(!isPinned)}
                    />
                )}
                {activeTab === 'templates' && (
                    <TemplatesMenu 
                        project={project}
                        setProject={setProject}
                        onPreviewTemplate={onPreviewTemplate}
                        isPinned={isPinned}
                        onTogglePin={() => setIsPinned(!isPinned)}
                    />
                )}
                {activeTab === 'ui-elements' && (
                    <UIElementsMenu 
                        onPreviewImage={onPreviewScreenImage}
                        isPinned={isPinned}
                        onTogglePin={() => setIsPinned(!isPinned)}
                    />
                )}
                {activeTab === 'screen-images' && (
                    <ScreenImagesMenu 
                        onPreviewImage={onPreviewScreenImage}
                        isPinned={isPinned}
                        onTogglePin={() => setIsPinned(!isPinned)}
                    />
                )}
            </>
        )}

        <ConfirmationModal 
            isOpen={deleteConfirmOpen}
            title={deleteType === 'project' ? "Delete Project?" : `Delete Selected ${deleteType === 'layers' ? 'Layers' : deleteType === 'screenGroups' ? 'Groups' : 'Screens'}?`}
            message={deleteType === 'project' ? `Are you sure you want to delete "${project.name}"? This cannot be undone.` : `Are you sure you want to delete the selected items? This cannot be undone.`}
            confirmText={deleteType === 'project' ? "Delete Forever" : "Delete"}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    showTooltips?: boolean;
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
        {/* Tooltip on Hover */}
        {showTooltips && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-gray-700">
                {label}
            </div>
        )}
    </button>
);
