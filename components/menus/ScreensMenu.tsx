
import React, { useState, useEffect } from 'react';
import { Plus, FolderPlus, MoreVertical, Edit2, Copy, Trash2, GripVertical, ChevronRight, ChevronDown, FolderOpen, Lock, Unlock, Group, ListChecks, Image as ImageIcon, FolderOutput, Ungroup, CheckSquare, XSquare, MousePointer2, Eye, EyeOff } from 'lucide-react';
import { Project, Screen, ScreenGroup, AppSettings, ExportConfig } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { RenameModal } from '../modals/RenameModal';
import { ConfirmationModal } from '../modals/ConfirmationModal';

interface ScreensMenuProps {
  project: Project;
  setProject: (p: Project) => void;
  setSelectedElementIds: (ids: string[]) => void;
  selectedScreenIds: string[];
  setSelectedScreenIds: (ids: string[]) => void;
  selectedGroupIds: string[];
  setSelectedGroupIds: (ids: string[]) => void;
  appSettings?: AppSettings;
  onExport: (config: Omit<ExportConfig, 'isOpen'>) => void;
}

type ItemType = 'screen' | 'screenGroup';

export const ScreensMenu: React.FC<ScreensMenuProps> = ({ 
    project, setProject, setSelectedElementIds, selectedScreenIds, setSelectedScreenIds, selectedGroupIds, setSelectedGroupIds, appSettings, onExport
}) => {
  const [activeMenu, setActiveMenu] = useState<{ id: string; type: ItemType; x: number; y: number } | null>(null);
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean; id: string; type: ItemType; currentName: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; type: ItemType; name: string } | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isDragOverUnsorted, setIsDragOverUnsorted] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
      if (selectedScreenIds.length > 1 && !isMultiSelectMode) {
          setIsMultiSelectMode(true);
      }
  }, [selectedScreenIds.length]);

  const handleSelection = (e: React.MouseEvent, id: string, type: ItemType) => {
      e.stopPropagation();
      const isModifier = e.ctrlKey || e.metaKey || e.shiftKey;
      
      if (type === 'screen') {
          let newSelection = [...selectedScreenIds];
          
          if (isMultiSelectMode || isModifier) {
              if (newSelection.includes(id)) {
                  newSelection = newSelection.filter(sid => sid !== id);
              } else {
                  newSelection.push(id);
              }
          } else {
              newSelection = [id];
              setSelectedGroupIds([]);
          }
          setSelectedScreenIds(newSelection);
          
          if (newSelection.length === 1 && !isModifier) {
              setProject({ ...project, activeScreenId: id });
              setSelectedElementIds([]); 
          }
      } else {
          setSelectedGroupIds([id]);
          setSelectedScreenIds([]);
      }
  };

  const selectAllScreens = () => {
      const allIds = project.screens.map(s => s.id);
      setSelectedScreenIds(allIds);
      setSelectedGroupIds([]);
      setIsMultiSelectMode(true);
  };

  const deselectAll = () => {
      setSelectedScreenIds([]);
      setSelectedGroupIds([]);
      setIsMultiSelectMode(false);
  };

  const addScreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const targetGroupId = selectedGroupIds.length === 1 ? selectedGroupIds[0] : undefined;
    
    const newScreen: Screen = {
      id: uuidv4(),
      name: `Screen ${(project.screens || []).length + 1}`,
      backgroundColor: '#ffffff',
      elements: [],
      groupId: targetGroupId
    };
    setProject({
      ...project,
      screens: [...(project.screens || []), newScreen],
      activeScreenId: newScreen.id
    });
  };

  const addScreenGroup = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const targetParentId = selectedGroupIds.length === 1 ? selectedGroupIds[0] : undefined;

      const newGroup: ScreenGroup = {
          id: uuidv4(),
          name: 'New Group',
          collapsed: false,
          parentId: targetParentId
      };
      setProject({
          ...project,
          screenGroups: [...(project.screenGroups || []), newGroup]
      });
  };

  const toggleScreenGroup = (groupId: string) => {
      const updatedGroups = (project.screenGroups || []).map(g => 
        g.id === groupId ? { ...g, collapsed: !g.collapsed } : g
      );
      setProject({ ...project, screenGroups: updatedGroups });
  };

  const handleMenuTrigger = (e: React.MouseEvent, id: string, type: ItemType) => {
    e.stopPropagation();
    e.preventDefault();
    if (type === 'screen' && !selectedScreenIds.includes(id)) {
        setSelectedScreenIds([id]);
        setSelectedGroupIds([]);
    }
    if (type === 'screenGroup' && !selectedGroupIds.includes(id)) {
        setSelectedGroupIds([id]);
        setSelectedScreenIds([]);
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setActiveMenu({
      id,
      type,
      x: rect.right + 5,
      y: rect.top
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string, type: string) => {
      e.dataTransfer.setData('dragId', id);
      e.dataTransfer.setData('dragType', type);
      e.stopPropagation();
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  
  const handleDrop = (e: React.DragEvent, targetId?: string, targetType?: ItemType) => {
      e.preventDefault(); e.stopPropagation();
      setIsDragOverUnsorted(false); // Reset highlight
      
      const dragId = e.dataTransfer.getData('dragId');
      const dragType = e.dataTransfer.getData('dragType');
      if(dragId === targetId) return;

      if (dragType === 'screen') {
          const screens = [...project.screens];
          const draggedIndex = screens.findIndex(s => s.id === dragId);
          if (draggedIndex === -1) return;
          const draggedScreen = { ...screens[draggedIndex] };

          if (targetType === 'screenGroup') {
              draggedScreen.groupId = targetId; 
          } else if (targetType === 'screen') {
              const targetScreen = screens.find(s => s.id === targetId);
              draggedScreen.groupId = targetScreen?.groupId;
          } else {
              draggedScreen.groupId = undefined;
          }
          screens[draggedIndex] = draggedScreen;
          setProject({ ...project, screens });
      } else if (dragType === 'screenGroup') {
          if (dragId === targetId) return;
          const groups = [...project.screenGroups];
          const draggedIndex = groups.findIndex(g => g.id === dragId);
          if (draggedIndex === -1) return;
          
          const draggedGroup = { ...groups[draggedIndex] };

          let currentCheckId = targetId;
          let isCycle = false;
          while (currentCheckId) {
              if (currentCheckId === dragId) { isCycle = true; break; }
              const p = groups.find(g => g.id === currentCheckId);
              currentCheckId = p?.parentId;
          }
          if (isCycle) return;

          if (targetType === 'screenGroup') {
              draggedGroup.parentId = targetId;
          } else {
              draggedGroup.parentId = undefined;
          }
          
          groups[draggedIndex] = draggedGroup;
          setProject({ ...project, screenGroups: groups });
      }
  };

  const toggleLock = () => {
      if (!activeMenu) return;
      if (activeMenu.type === 'screen') {
          const updatedScreens = project.screens.map(s => 
              selectedScreenIds.includes(s.id) ? { ...s, locked: !s.locked } : s
          );
          setProject({ ...project, screens: updatedScreens });
      } else {
          const updatedGroups = project.screenGroups.map(g => 
              selectedGroupIds.includes(g.id) ? { ...g, locked: !g.locked } : g
          );
          setProject({ ...project, screenGroups: updatedGroups });
      }
      setActiveMenu(null);
  };

  const toggleHidden = (e?: React.MouseEvent, targetId?: string, targetType?: ItemType) => {
      e?.stopPropagation();
      const id = targetId || activeMenu?.id;
      const type = targetType || activeMenu?.type;
      if (!id || !type) return;

      if (type === 'screen') {
          const idsToToggle = selectedScreenIds.length > 0 && selectedScreenIds.includes(id) ? selectedScreenIds : [id];
          const updatedScreens = project.screens.map(s => 
              idsToToggle.includes(s.id) ? { ...s, hidden: !s.hidden } : s
          );
          setProject({ ...project, screens: updatedScreens });
      } else {
          const idsToToggle = selectedGroupIds.length > 0 && selectedGroupIds.includes(id) ? selectedGroupIds : [id];
          const updatedGroups = project.screenGroups.map(g => 
              idsToToggle.includes(g.id) ? { ...g, hidden: !g.hidden } : g
          );
          setProject({ ...project, screenGroups: updatedGroups });
      }
      if (activeMenu) setActiveMenu(null);
  };

  const groupSelectedScreens = () => {
      if (selectedScreenIds.length > 0) {
          const newGroupId = uuidv4();
          const firstScreen = project.screens.find(s => s.id === selectedScreenIds[0]);
          const parentId = firstScreen?.groupId; 

          const newGroup: ScreenGroup = { id: newGroupId, name: 'Group', collapsed: false, parentId };
          
          const updatedScreens = project.screens.map(s => 
              selectedScreenIds.includes(s.id) ? { ...s, groupId: newGroupId } : s
          );
          
          setProject({
              ...project,
              screenGroups: [...project.screenGroups, newGroup],
              screens: updatedScreens
          });
          setActiveMenu(null);
          setSelectedScreenIds([]);
      }
  };

  const moveSelectedToUnsorted = () => {
      if (activeMenu?.type === 'screen') {
          const updatedScreens = project.screens.map(s => 
              selectedScreenIds.includes(s.id) ? { ...s, groupId: undefined } : s
          );
          setProject({ ...project, screens: updatedScreens });
      } else {
          const updatedGroups = project.screenGroups.map(g => 
              selectedGroupIds.includes(g.id) ? { ...g, parentId: undefined } : g
          );
          setProject({ ...project, screenGroups: updatedGroups });
      }
      setActiveMenu(null);
  };

  const triggerRename = () => {
    if (!activeMenu) return;
    const { id, type } = activeMenu;
    let currentName = '';
    if (type === 'screen') {
        currentName = project.screens.find(s => s.id === id)?.name || '';
    } else {
        currentName = project.screenGroups.find(g => g.id === id)?.name || '';
    }
    setRenameModal({ isOpen: true, id, type, currentName });
    setActiveMenu(null);
  };

  const triggerDelete = () => {
      if (!activeMenu) return;
      let name = '';
      if (activeMenu.type === 'screen') {
          name = selectedScreenIds.length > 1 ? `${selectedScreenIds.length} Screens` : project.screens.find(s => s.id === activeMenu.id)?.name || 'Screen';
      } else {
          name = selectedGroupIds.length > 1 ? `${selectedGroupIds.length} Groups` : project.screenGroups.find(g => g.id === activeMenu.id)?.name || 'Group';
      }
      setDeleteModal({ isOpen: true, id: activeMenu.id, type: activeMenu.type, name });
      setActiveMenu(null);
  };

  const executeDelete = () => {
      if (!deleteModal) return;
      const { type } = deleteModal;

      if (type === 'screen') {
        const idsToDelete = selectedScreenIds.length > 0 ? selectedScreenIds : [deleteModal.id];
        const remainingScreens = project.screens.filter(s => !idsToDelete.includes(s.id));
        if (remainingScreens.length === 0) {
             remainingScreens.push({ id: uuidv4(), name: 'Home', backgroundColor: '#fff', elements: [] });
        }
        let newActiveId = project.activeScreenId;
        if (idsToDelete.includes(project.activeScreenId)) {
            newActiveId = remainingScreens[0].id;
        }
        setProject({ ...project, screens: remainingScreens, activeScreenId: newActiveId });
        setSelectedScreenIds([]);
    } else {
        const idsToDelete = selectedGroupIds.length > 0 ? selectedGroupIds : [deleteModal.id];
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
        setProject({ ...project, screenGroups: updatedGroups, screens: updatedScreens, activeScreenId: updatedScreens[0].id });
        setSelectedGroupIds([]);
    }
    setDeleteModal(null);
  };

  const executeUngroup = () => {
      if (!deleteModal || deleteModal.type !== 'screenGroup') return;
      const idsToUngroup = selectedGroupIds.length > 0 ? selectedGroupIds : [deleteModal.id];

      let updatedScreens = [...project.screens];
      let updatedGroups = [...project.screenGroups];

      idsToUngroup.forEach(groupId => {
          const group = project.screenGroups.find(g => g.id === groupId);
          const parentId = group?.parentId; 

          updatedScreens = updatedScreens.map(s => s.groupId === groupId ? { ...s, groupId: parentId } : s);
          updatedGroups = updatedGroups.map(g => g.parentId === groupId ? { ...g, parentId: parentId } : g);
      });

      updatedGroups = updatedGroups.filter(g => !idsToUngroup.includes(g.id));

      setProject({ ...project, screenGroups: updatedGroups, screens: updatedScreens });
      setDeleteModal(null);
      setSelectedGroupIds([]);
  };

  const handleDuplicate = () => {
    if (!activeMenu || activeMenu.type !== 'screen') return;
    const screensToDup = selectedScreenIds.length > 0 ? selectedScreenIds : [activeMenu.id];
    const newScreens: Screen[] = [];
    
    screensToDup.forEach(sid => {
        const screen = project.screens.find(s => s.id === sid);
        if (screen) {
            newScreens.push({ 
                ...JSON.parse(JSON.stringify(screen)), 
                id: uuidv4(), 
                name: `${screen.name} Copy` 
            });
        }
    });
    setProject({ ...project, screens: [...project.screens, ...newScreens] });
    setActiveMenu(null);
  };

  const handleExport = () => {
      if (!activeMenu) return;
      if (activeMenu.type === 'screen') {
          if (selectedScreenIds.length > 1) {
              onExport({ type: 'screen', targetIds: selectedScreenIds });
          } else {
              onExport({ type: 'screen', targetId: activeMenu.id });
          }
      } else if (activeMenu.type === 'screenGroup') {
          onExport({ type: 'screen-group', targetId: activeMenu.id });
      }
      setActiveMenu(null);
  };

  const executeRename = (newName: string) => {
      if (!renameModal) return;
      if (renameModal.type === 'screen') {
        const updatedScreens = project.screens.map(s => s.id === renameModal.id ? { ...s, name: newName } : s);
        setProject({ ...project, screens: updatedScreens });
      } else {
        const updatedGroups = project.screenGroups.map(g => g.id === renameModal.id ? { ...g, name: newName } : g);
        setProject({ ...project, screenGroups: updatedGroups });
    }
    setRenameModal(null);
  };

  const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  );

  const renderScreen = (screen: Screen, depth: number) => {
      const isSelected = selectedScreenIds.includes(screen.id);
      const isActive = project.activeScreenId === screen.id;
      return (
        <div key={screen.id} draggable={!screen.locked}
            onDragStart={(e) => handleDragStart(e, screen.id, 'screen')}
            onClick={(e) => handleSelection(e, screen.id, 'screen')}
            className={`flex items-center px-2 py-1.5 text-xs rounded cursor-pointer transition-colors group relative ${
                isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium' : 
                isSelected ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            style={{ marginLeft: depth * 12 }}
        >
            <GripVertical size={10} className={`mr-1 text-gray-300 opacity-0 group-hover:opacity-100 ${screen.locked ? 'cursor-not-allowed text-red-300' : 'cursor-grab'}`} />
            
            {isMultiSelectMode && (
                <div className={`w-3 h-3 mr-2 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400 bg-white dark:bg-gray-800'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
            )}

            <span className={`truncate flex-1 select-none flex items-center gap-1 ${screen.hidden ? 'opacity-50 line-through' : ''}`}>
                {screen.name} {screen.locked && <Lock size={10} className="text-gray-400" />}
            </span>

            {/* Visibility Toggle on Hover */}
            <button 
                onClick={(e) => toggleHidden(e, screen.id, 'screen')}
                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 mr-1 opacity-0 group-hover:opacity-100 transition-opacity ${screen.hidden ? 'text-gray-400 opacity-100' : 'text-gray-400'}`}
            >
                {screen.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>

            <button onClick={(e) => handleMenuTrigger(e, screen.id, 'screen')} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 transition-all rounded"><MoreVertical size={14} /></button>
            {isSelected && !isActive && !isMultiSelectMode && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-400"></div>}
        </div>
      );
  };

  const renderGroup = (group: ScreenGroup, depth: number) => {
      const isSelected = selectedGroupIds.includes(group.id);
      const childGroups = project.screenGroups.filter(g => g.parentId === group.id);
      const childScreens = project.screens.filter(s => s.groupId === group.id);

      return (
          <div key={group.id} className="mb-1">
              <div 
                className={`flex items-center group px-2 py-1.5 rounded cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                draggable={!group.locked}
                onDragStart={(e) => handleDragStart(e, group.id, 'screenGroup')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, group.id, 'screenGroup')}
                onClick={(e) => handleSelection(e, group.id, 'screenGroup')}
                style={{ marginLeft: depth * 12 }}
              >
                  <button onClick={(e) => { e.stopPropagation(); toggleScreenGroup(group.id); }} className="mr-1 text-gray-400">
                      {group.collapsed ? <ChevronRight size={14}/> : <ChevronDownIcon />}
                  </button>
                  <FolderOpen size={14} className={`mr-2 ${isSelected ? 'text-indigo-600' : 'text-indigo-400'}`} />
                  
                  <span className={`flex-1 text-xs font-semibold text-gray-600 dark:text-gray-300 truncate select-none flex items-center gap-1 ${group.hidden ? 'opacity-50 line-through' : ''}`}>
                      {group.name} {group.locked && <Lock size={10} className="text-gray-400" />}
                  </span>

                  {/* Visibility Toggle on Hover */}
                  <button 
                      onClick={(e) => toggleHidden(e, group.id, 'screenGroup')}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 mr-1 opacity-0 group-hover:opacity-100 transition-opacity ${group.hidden ? 'text-gray-400 opacity-100' : 'text-gray-400'}`}
                  >
                      {group.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  <button onClick={(e) => handleMenuTrigger(e, group.id, 'screenGroup')} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 transition-all"><MoreVertical size={14} /></button>
              </div>
              {!group.collapsed && (
                  <div className="border-l border-gray-200 dark:border-gray-700 ml-2">
                      {childGroups.map(g => renderGroup(g, depth + 1))}
                      {childScreens.map(s => renderScreen(s, depth + 1))}
                  </div>
              )}
          </div>
      );
  };

  const rootGroups = project.screenGroups.filter(g => !g.parentId);
  const rootScreens = project.screens.filter(s => !s.groupId);

  const ActionButton = ({ onClick, icon: Icon, title, active }: any) => (
      <button 
        onClick={onClick} 
        className={`p-1.5 rounded-md transition-colors ${active ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-300'}`}
        title={title}
      >
          <Icon size={16} />
      </button>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Screens</h2>
            <div className="text-xs text-gray-400 font-mono">{project.screens.length} total</div>
        </div>
        
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0">
             <ActionButton onClick={addScreen} icon={Plus} title="Add Screen" />
             <ActionButton onClick={addScreenGroup} icon={FolderPlus} title="Add Group" />
             <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0" />
             <ActionButton onClick={() => setIsMultiSelectMode(!isMultiSelectMode)} icon={ListChecks} title="Toggle Multi-Select Mode" active={isMultiSelectMode} />
             <ActionButton onClick={selectAllScreens} icon={CheckSquare} title="Select All Screens" />
             <ActionButton onClick={deselectAll} icon={XSquare} title="Deselect All" />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
            <div className="overflow-y-auto custom-scrollbar p-2 space-y-1 flex-shrink-0 max-h-[60%]">
                {rootGroups.map(g => renderGroup(g, 0))}
            </div>
            
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <div 
                    className={`flex-1 flex flex-col rounded-lg border-2 border-dashed transition-all p-2 overflow-hidden ${
                        isDragOverUnsorted 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 hover:border-indigo-400 dark:hover:border-indigo-500'
                    }`}
                    onDragOver={(e) => { handleDragOver(e); setIsDragOverUnsorted(true); }}
                    onDragLeave={() => setIsDragOverUnsorted(false)}
                    onDrop={(e) => handleDrop(e, undefined)}
                >
                    <div className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-2 select-none flex-shrink-0 ${isDragOverUnsorted ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                        <FolderOutput size={12} /> Unsorted / Root
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                        {rootScreens.map(s => renderScreen(s, 0))}
                        {rootScreens.length === 0 && (
                            <div className="h-full flex items-center justify-center text-[10px] text-gray-400 italic pointer-events-none">
                                Drop screens here to ungroup
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {activeMenu && (
            <div className="fixed z-50 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 animate-in fade-in zoom-in-95 duration-100" style={{ top: activeMenu.y, left: activeMenu.x }} onClick={(e) => e.stopPropagation()}>
                <div className="px-4 py-1 text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
                    {activeMenu.type === 'screenGroup' ? 
                        (selectedGroupIds.length > 1 ? `${selectedGroupIds.length} Groups` : 'Group') : 
                        (selectedScreenIds.length > 1 ? `${selectedScreenIds.length} Screens` : 'Screen')
                    }
                </div>
                
                <button onClick={toggleLock} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Lock size={14} /> Lock/Unlock</button>
                <button onClick={(e) => toggleHidden(e)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><EyeOff size={14} /> Hide/Show</button>
                
                {selectedScreenIds.length > 1 && (
                    <>
                        <button onClick={groupSelectedScreens} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Group size={14} /> Group Items</button>
                        <button onClick={handleExport} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><ImageIcon size={14} /> Export (Zip)</button>
                        <button onClick={moveSelectedToUnsorted} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><FolderOutput size={14} /> Move to Unsorted</button>
                        <button onClick={triggerDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><Trash2 size={14} /> Delete Selected</button>
                    </>
                )}

                {selectedScreenIds.length <= 1 && (
                    <>
                        {activeMenu.type === 'screen' && project.screens.find(s=>s.id === activeMenu.id)?.groupId && (
                            <button onClick={moveSelectedToUnsorted} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><FolderOutput size={14} /> Move to Unsorted</button>
                        )}
                        {activeMenu.type === 'screenGroup' && project.screenGroups.find(g=>g.id === activeMenu.id)?.parentId && (
                            <button onClick={moveSelectedToUnsorted} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><FolderOutput size={14} /> Move to Root</button>
                        )}
                        
                        {activeMenu.type !== 'screenGroup' && <button onClick={handleExport} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><ImageIcon size={14} /> Export Image</button>}
                        
                        <button onClick={triggerRename} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Edit2 size={14} /> Rename</button>
                        {activeMenu.type === 'screen' && (
                            <button onClick={handleDuplicate} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Copy size={14} /> Duplicate</button>
                        )}
                        
                        <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                        <button onClick={triggerDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                        {activeMenu.type === 'screenGroup' && (
                            <button onClick={() => { setDeleteModal({isOpen:true, id:activeMenu.id, type:'screenGroup', name: 'Group'}); executeUngroup(); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Ungroup size={14} /> Ungroup Only</button>
                        )}
                    </>
                )}
            </div>
        )}

        {renameModal && <RenameModal isOpen={renameModal.isOpen} title={`Rename ${renameModal.type}`} initialValue={renameModal.currentName} onClose={() => setRenameModal(null)} onSave={executeRename} />}
        {deleteModal && (
            <ConfirmationModal 
                isOpen={deleteModal.isOpen} 
                title={`Delete ${deleteModal.type === 'screenGroup' ? 'Group' : 'Screen'}?`} 
                message={`Are you sure you want to delete "${deleteModal.name}"?`}
                confirmText={deleteModal.type === 'screenGroup' ? "Delete Group" : "Delete"}
                secondaryText={deleteModal.type === 'screenGroup' ? "Ungroup" : undefined}
                onClose={() => setDeleteModal(null)} 
                onConfirm={executeDelete} 
                onSecondary={executeUngroup}
            />
        )}
    </div>
  );
};
