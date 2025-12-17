
import React, { useState, useEffect } from 'react';
import { FolderPlus, MoreVertical, Edit2, Copy, Trash2, ChevronRight, ChevronDown, File, FolderOpen, Lock, Unlock, GripVertical, Group, ListChecks, Image as ImageIcon, FolderOutput, Ungroup, CheckSquare, XSquare, Eye, EyeOff } from 'lucide-react';
import { Project, CanvasElement, AppSettings, ExportConfig } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { RenameModal } from '../modals/RenameModal';
import { ConfirmationModal } from '../modals/ConfirmationModal';

interface LayersMenuProps {
  project: Project;
  setProject: (p: Project) => void;
  selectedElementIds: string[];
  setSelectedElementIds: (ids: string[]) => void;
  setSelectedScreenIds?: (ids: string[]) => void;
  setSelectedScreenGroupIds?: (ids: string[]) => void;
  appSettings?: AppSettings;
  onExport: (config: Omit<ExportConfig, 'isOpen'>) => void;
}

type ItemType = 'layer' | 'layerGroup';

export const LayersMenu: React.FC<LayersMenuProps> = ({ 
    project, setProject, selectedElementIds, setSelectedElementIds, 
    setSelectedScreenIds, setSelectedScreenGroupIds, appSettings, onExport 
}) => {
  const activeScreen = (project.screens || []).find(s => s.id === project.activeScreenId);
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

  // Sync multi-select mode with selection count
  useEffect(() => {
    if (selectedElementIds.length >= 2) {
      setIsMultiSelectMode(true);
    } else if (selectedElementIds.length <= 1) {
      setIsMultiSelectMode(false);
    }
  }, [selectedElementIds.length]);

  const isFolderType = (el: CanvasElement) => {
      return el.type === 'group'; 
  };

  const handleLayerClick = (e: React.MouseEvent, layer: CanvasElement) => {
      e.stopPropagation();
      
      // Clear Screen Selection
      if (setSelectedScreenIds) setSelectedScreenIds([]);
      if (setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);

      const isGroup = isFolderType(layer);
      
      if (isGroup) {
          setSelectedElementIds([layer.id]);
          setIsMultiSelectMode(false);
      } else {
          const isModifier = e.ctrlKey || e.metaKey || e.shiftKey;
          let newSelection = [...selectedElementIds];

          const hasGroupSelected = activeScreen?.elements.some(el => newSelection.includes(el.id) && isFolderType(el));
          
          if (hasGroupSelected) {
              newSelection = [layer.id];
          } else if (isMultiSelectMode || isModifier) {
              if (newSelection.includes(layer.id)) {
                  newSelection = newSelection.filter(id => id !== layer.id);
              } else {
                  newSelection.push(layer.id);
              }
          } else {
              newSelection = [layer.id];
          }

          setSelectedElementIds(newSelection);
      }
  };

  const selectAllLayers = () => {
      if (!activeScreen) return;
      const allLayerIds = activeScreen.elements
          .filter(el => !isFolderType(el))
          .map(el => el.id);
      
      setSelectedElementIds(allLayerIds);
      if (setSelectedScreenIds) setSelectedScreenIds([]);
      if (setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);
      if (allLayerIds.length > 1) setIsMultiSelectMode(true);
  };

  const deselectAll = () => {
      setSelectedElementIds([]);
      setIsMultiSelectMode(false);
  };

  const addLayerGroup = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!activeScreen) return;
      const newGroupId = uuidv4();
      
      let parentId: string | undefined;
      if (selectedElementIds.length === 1) {
          const selected = activeScreen.elements.find(el => el.id === selectedElementIds[0]);
          if (selected && isFolderType(selected)) {
              parentId = selected.id;
          } else if (selected) {
              parentId = selected.parentId;
          }
      }

      const newGroup: CanvasElement = {
          id: newGroupId, type: 'group', name: 'New Group', x: 50, y: 50, width: 200, height: 200, zIndex: activeScreen.elements.length + 1,
          props: {}, style: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed' }, interactions: [], collapsed: false,
          parentId
      };
      
      const updatedScreens = project.screens.map(s => s.id === project.activeScreenId ? { ...s, elements: [...s.elements, newGroup] } : s);
      setProject({ ...project, screens: updatedScreens });
      setSelectedElementIds([newGroupId]);
      setIsMultiSelectMode(false);
      if(setSelectedScreenIds) setSelectedScreenIds([]);
      if(setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);
  };

  const toggleLayerGroup = (elementId: string) => {
      if(!activeScreen) return;
      const updatedScreens = project.screens.map(s => s.id === project.activeScreenId ? { ...s, elements: s.elements.map(el => el.id === elementId ? { ...el, collapsed: !el.collapsed } : el) } : s);
      setProject({ ...project, screens: updatedScreens });
  };

  const handleDragStart = (e: React.DragEvent, id: string, type: string) => { e.dataTransfer.setData('dragId', id); e.dataTransfer.setData('dragType', type); e.stopPropagation(); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDropLayer = (e: React.DragEvent, targetId?: string) => {
       e.preventDefault(); e.stopPropagation();
       setIsDragOverUnsorted(false); // Reset highlight

       const dragId = e.dataTransfer.getData('dragId');
       if (dragId === targetId || !activeScreen) return;
       
       let checkParent = activeScreen.elements.find(el => el.id === targetId)?.parentId;
       while (checkParent) {
           if (checkParent === dragId) return;
           checkParent = activeScreen.elements.find(el => el.id === checkParent)?.parentId;
       }
       
       let newElements = JSON.parse(JSON.stringify(activeScreen.elements)) as CanvasElement[];
       const draggedElementIndex = newElements.findIndex(e => e.id === dragId);
       if (draggedElementIndex === -1) return;
       const draggedElement = newElements[draggedElementIndex];
       newElements.splice(draggedElementIndex, 1);

       if (!targetId) {
           draggedElement.parentId = undefined;
           newElements.push(draggedElement);
       } else {
           const targetElement = activeScreen.elements.find(e => e.id === targetId);
           if (!targetElement) return;
           
           const isTargetGroup = isFolderType(targetElement);
           
           if (isTargetGroup) {
               draggedElement.parentId = targetId;
               const targetInNew = newElements.find(e => e.id === targetId);
               if(targetInNew) targetInNew.collapsed = false;
               newElements.push(draggedElement); 
           } else {
               draggedElement.parentId = targetElement.parentId;
               const newTargetIndex = newElements.findIndex(e => e.id === targetId);
               if (newTargetIndex !== -1) newElements.splice(newTargetIndex, 0, draggedElement);
               else newElements.push(draggedElement);
           }
       }
       
       newElements.forEach((el, index) => el.zIndex = index + 1);
       
       const updatedScreens = project.screens.map(s => s.id === project.activeScreenId ? { ...s, elements: newElements } : s);
       setProject({ ...project, screens: updatedScreens });
  };

  const handleMenuTrigger = (e: React.MouseEvent, id: string, type: ItemType) => {
    e.stopPropagation(); e.preventDefault();
    
    // Select this item and ensure screen selections are cleared
    if (!selectedElementIds.includes(id)) {
        setSelectedElementIds([id]);
    }
    if (setSelectedScreenIds) setSelectedScreenIds([]);
    if (setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setActiveMenu({ id, type, x: rect.right + 5, y: rect.top });
  };

  const toggleLock = () => {
      if (!activeMenu) return;
      const idsToLock = selectedElementIds.includes(activeMenu.id) ? selectedElementIds : [activeMenu.id];
      const updatedScreens = project.screens.map(s => {
          if (s.id !== project.activeScreenId) return s;
          return {
              ...s,
              elements: s.elements.map(el => idsToLock.includes(el.id) ? { ...el, locked: !el.locked } : el)
          };
      });
      setProject({ ...project, screens: updatedScreens });
      setActiveMenu(null);
  };

  const toggleHidden = (e?: React.MouseEvent, layerId?: string) => {
      e?.stopPropagation();
      const idsToHide = layerId 
        ? [layerId] 
        : (activeMenu && selectedElementIds.includes(activeMenu.id) ? selectedElementIds : (activeMenu ? [activeMenu.id] : []));
      
      if (idsToHide.length === 0) return;

      const updatedScreens = project.screens.map(s => {
          if (s.id !== project.activeScreenId) return s;
          return {
              ...s,
              elements: s.elements.map(el => idsToHide.includes(el.id) ? { ...el, hidden: !el.hidden } : el)
          };
      });
      setProject({ ...project, screens: updatedScreens });
      if (activeMenu) setActiveMenu(null);
  };

  const handleGroupSelected = () => {
      if (!activeScreen || selectedElementIds.length < 2) return;
      const selectedEls = activeScreen.elements.filter(el => selectedElementIds.includes(el.id));
      
      const minX = Math.min(...selectedEls.map(el => el.x));
      const minY = Math.min(...selectedEls.map(el => el.y));
      const maxX = Math.max(...selectedEls.map(el => el.x + el.width));
      const maxY = Math.max(...selectedEls.map(el => el.y + el.height));

      const commonParent = selectedEls.every(el => el.parentId === selectedEls[0].parentId) ? selectedEls[0].parentId : undefined;

      const newGroup: CanvasElement = {
          id: uuidv4(), type: 'group', name: 'Group', x: minX, y: minY, width: maxX - minX, height: maxY - minY,
          zIndex: Math.max(...selectedEls.map(el => el.zIndex)) + 1, props: {}, style: { backgroundColor: 'transparent' }, 
          interactions: [], collapsed: false, parentId: commonParent
      };

      const updatedElements = activeScreen.elements.map(el => selectedElementIds.includes(el.id) ? { ...el, parentId: newGroup.id } : el);
      const updatedScreens = project.screens.map(s => s.id === project.activeScreenId ? { ...s, elements: [...updatedElements, newGroup] } : s);
      setProject({ ...project, screens: updatedScreens });
      setSelectedElementIds([newGroup.id]);
      setIsMultiSelectMode(false);
      setActiveMenu(null);
  };

  const handleMoveToRoot = () => {
      const updatedScreens = project.screens.map(s => {
          if (s.id !== project.activeScreenId) return s;
          return {
              ...s,
              elements: s.elements.map(el => selectedElementIds.includes(el.id) ? { ...el, parentId: undefined } : el)
          };
      });
      setProject({ ...project, screens: updatedScreens });
      setActiveMenu(null);
  };

  const handleExportLayer = () => {
      if (!activeMenu) return;
      if (selectedElementIds.length > 1) {
          onExport({ type: 'layer', targetIds: selectedElementIds });
      } else {
          onExport({ type: 'layer', targetId: activeMenu.id });
      }
      setActiveMenu(null);
  };

  const triggerRename = () => { if(activeMenu) setRenameModal({isOpen:true, id:activeMenu.id, type:activeMenu.type, currentName: activeScreen?.elements.find(e=>e.id===activeMenu.id)?.name||''}); setActiveMenu(null); };
  
  const executeRename = (n: string) => { if(renameModal) { const updatedScreens = project.screens.map(s => s.id === project.activeScreenId ? { ...s, elements: s.elements.map(el => el.id === renameModal.id ? { ...el, name: n } : el) } : s); setProject({...project, screens: updatedScreens}); setRenameModal(null); }};
  
  const triggerDelete = () => { 
      if(activeMenu) {
          const isMultiDelete = selectedElementIds.length > 1 && selectedElementIds.includes(activeMenu.id);
          const name = isMultiDelete ? `${selectedElementIds.length} Layers` : activeScreen?.elements.find(e=>e.id===activeMenu.id)?.name || 'Layer';
          setDeleteModal({isOpen:true, id:activeMenu.id, type:activeMenu.type, name}); 
          setActiveMenu(null); 
      }
  };

  const executeDelete = () => {
      if (!deleteModal) return;
      const { id } = deleteModal;
      const idsToDeleteBase = selectedElementIds.includes(id) ? selectedElementIds : [id];
      
      const updatedScreens = project.screens.map(s => {
            if (s.id !== project.activeScreenId) return s;
            const getDescendantIds = (parentId: string, allElements: CanvasElement[]): string[] => {
                const children = allElements.filter(e => e.parentId === parentId);
                let ids = children.map(c => c.id);
                children.forEach(child => ids = [...ids, ...getDescendantIds(child.id, allElements)]);
                return ids;
            };
            let allIdsToDelete: string[] = [];
            idsToDeleteBase.forEach(baseId => {
                allIdsToDelete.push(baseId);
                allIdsToDelete.push(...getDescendantIds(baseId, s.elements));
            });
            return { ...s, elements: s.elements.filter(el => !allIdsToDelete.includes(el.id)) };
      });

      setProject({ ...project, screens: updatedScreens });
      setSelectedElementIds([]);
      setDeleteModal(null);
  };

  const executeUngroup = () => {
      if (!deleteModal) return;
      const updatedScreens = project.screens.map(s => {
          if (s.id !== project.activeScreenId) return s;
          const groupEl = s.elements.find(e => e.id === deleteModal.id);
          if (!groupEl) return s;
          
          return {
              ...s,
              elements: s.elements.filter(el => el.id !== deleteModal.id).map(el => {
                  if (el.parentId === deleteModal.id) {
                      return { ...el, parentId: groupEl.parentId };
                  }
                  return el;
              })
          };
      });
      setProject({ ...project, screens: updatedScreens });
      setDeleteModal(null);
  };

  const handleDuplicate = () => {
        if (!activeMenu) return;
        const { id } = activeMenu;
        const el = activeScreen?.elements.find(e => e.id === id);
        if(!el) return;
        
        const getDescendants = (parentId: string, allElements: CanvasElement[]): CanvasElement[] => {
            const children = allElements.filter(e => e.parentId === parentId);
            let descendants = [...children];
            children.forEach(child => {
                descendants = [...descendants, ...getDescendants(child.id, allElements)];
            });
            return descendants;
        };

        const descendants = getDescendants(id, activeScreen?.elements || []);
        const idMap: Record<string, string> = { [id]: uuidv4() };
        descendants.forEach(d => idMap[d.id] = uuidv4());

        const newRoot = {
            ...JSON.parse(JSON.stringify(el)),
            id: idMap[id],
            name: `${el.name} Copy`,
            x: el.x + 10,
            y: el.y + 10
        };

        const newDescendants = descendants.map(d => ({
            ...JSON.parse(JSON.stringify(d)),
            id: idMap[d.id],
            parentId: idMap[d.parentId || '']
        }));

        const updatedScreens = project.screens.map(s => {
            if(s.id !== project.activeScreenId) return s;
            return { ...s, elements: [...s.elements, newRoot, ...newDescendants] };
        });
        setProject({ ...project, screens: updatedScreens });
        setSelectedElementIds([newRoot.id]);
        if(setSelectedScreenIds) setSelectedScreenIds([]);
        if(setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);
        setActiveMenu(null);
  };

  const renderLayerRow = (layer: CanvasElement, depth: number) => {
        const isGroup = isFolderType(layer);
        const isSelected = selectedElementIds.includes(layer.id);
        
        return (
            <div key={layer.id} className="" onDragOver={handleDragOver} onDrop={(e) => handleDropLayer(e, layer.id)}>
                <div 
                    className={`flex items-center group px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-l-2 transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-medium' : 'border-transparent text-gray-600 dark:text-gray-300'}`}
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                    onClick={(e) => handleLayerClick(e, layer)}
                    draggable={!layer.locked}
                    onDragStart={(e) => handleDragStart(e, layer.id, isGroup ? 'layerGroup' : 'layer')}
                >
                    <GripVertical size={10} className={`mr-1 text-gray-300 opacity-0 group-hover:opacity-100 ${layer.locked ? 'cursor-not-allowed text-red-300' : 'cursor-grab'}`} />
                    
                    {isMultiSelectMode && !isGroup && (
                        <div className={`w-3 h-3 mr-2 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400 bg-white dark:bg-gray-800'}`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                    )}

                    {isGroup ? (
                        <button onClick={(e) => { e.stopPropagation(); toggleLayerGroup(layer.id); }} className="mr-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                            {layer.collapsed ? <ChevronRight size={14}/> : <ChevronDown size={14} />}
                        </button>
                    ) : <span className="w-4 mr-1" />}
                    <span className={`mr-2 ${isGroup ? 'text-indigo-400' : 'opacity-70'}`}>{isGroup ? <FolderOpen size={14} /> : <File size={14} />}</span>
                    <span className={`flex-1 truncate select-none flex items-center gap-1 ${layer.hidden ? 'opacity-50 line-through' : ''}`}>
                        {layer.name} {layer.locked && <Lock size={10} className="text-gray-400" />}
                    </span>
                    
                    {/* Visibility Toggle on Hover */}
                    <button 
                        onClick={(e) => toggleHidden(e, layer.id)}
                        className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 mr-1 ${layer.hidden ? 'text-gray-400' : 'text-transparent group-hover:text-gray-300'}`}
                    >
                        {layer.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>

                    <button onClick={(e) => handleMenuTrigger(e, layer.id, isGroup ? 'layerGroup' : 'layer')} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded"><MoreVertical size={14} /></button>
                </div>
                {isGroup && !layer.collapsed && renderLayerList(layer.id, depth + 1)}
            </div>
        );
  };

  const renderLayerList = (parentId: string | undefined, depth = 0) => {
      if (!activeScreen) return null;
      const layers = activeScreen.elements.filter(el => el.parentId === parentId).slice().reverse();
      if (layers.length === 0) return null;
      return <div className="flex flex-col">{layers.map(layer => renderLayerRow(layer, depth))}</div>;
  };

  const ActionButton = ({ onClick, icon: Icon, title, active }: any) => (
      <button 
        onClick={onClick} 
        className={`p-1.5 rounded-md transition-colors ${active ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-300'}`}
        title={title}
      >
          <Icon size={16} />
      </button>
  );

  const rootElements = activeScreen?.elements.filter(el => !el.parentId) || [];
  const sortedRoot = rootElements.slice().reverse();
  const rootGroups = sortedRoot.filter(el => isFolderType(el));
  const rootLayers = sortedRoot.filter(el => !isFolderType(el));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
         <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Layers</h2>
            <div className="text-xs text-gray-400 font-mono">{(activeScreen?.elements || []).length} total</div>
        </div>

        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0">
             <ActionButton onClick={addLayerGroup} icon={FolderPlus} title="Add Group" />
             <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0" />
             <ActionButton onClick={() => setIsMultiSelectMode(!isMultiSelectMode)} icon={ListChecks} title="Toggle Multi-Select Mode" active={isMultiSelectMode} />
             <ActionButton onClick={selectAllLayers} icon={CheckSquare} title="Select All Layers" />
             <ActionButton onClick={deselectAll} icon={XSquare} title="Deselect All" />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
            {/* Groups Section */}
            <div className="overflow-y-auto custom-scrollbar p-2 space-y-1 flex-shrink-0 max-h-[60%]">
                {rootGroups.map(g => renderLayerRow(g, 0))}
            </div>
            
            {/* Unsorted Section */}
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <div 
                    className={`flex-1 flex flex-col rounded-lg border-2 border-dashed transition-all p-2 overflow-hidden ${
                        isDragOverUnsorted 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 hover:border-indigo-400 dark:hover:border-indigo-500'
                    }`}
                    onDragOver={(e) => { handleDragOver(e); setIsDragOverUnsorted(true); }} 
                    onDragLeave={() => setIsDragOverUnsorted(false)}
                    onDrop={(e) => handleDropLayer(e, undefined)}
                >
                    <div className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-2 select-none flex-shrink-0 ${isDragOverUnsorted ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                        <FolderOutput size={12} /> Unsorted Layers
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-0.5">
                        {rootLayers.map(layer => renderLayerRow(layer, 0))}
                        {rootLayers.length === 0 && (
                            <div className="h-full flex items-center justify-center text-[10px] text-gray-400 italic pointer-events-none">
                                Drop layers here to ungroup
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        {activeMenu && (
            <div className="fixed z-50 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 animate-in fade-in zoom-in-95 duration-100" style={{ top: activeMenu.y, left: activeMenu.x }} onClick={(e) => e.stopPropagation()}>
                <div className="px-4 py-1 text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">{selectedElementIds.length > 1 ? `${selectedElementIds.length} Layers` : activeMenu.type}</div>
                <button onClick={toggleLock} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Lock size={14} /> Lock/Unlock</button>
                <button onClick={(e) => toggleHidden(e)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><EyeOff size={14} /> Hide/Show</button>
                
                {selectedElementIds.length > 1 && (
                    <>
                        <button onClick={handleGroupSelected} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Group size={14} /> Group Items</button>
                        <button onClick={handleExportLayer} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><ImageIcon size={14} /> Export (Zip)</button>
                        <button onClick={handleMoveToRoot} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><FolderOutput size={14} /> Move to Unsorted</button>
                    </>
                )}
                
                {selectedElementIds.length <= 1 && (
                    <>
                        {activeScreen?.elements.find(e => e.id === activeMenu.id)?.parentId && (
                            <button onClick={handleMoveToRoot} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><FolderOutput size={14} /> Move to Unsorted</button>
                        )}
                        <button onClick={handleExportLayer} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><ImageIcon size={14} /> Export Image</button>
                        <button onClick={triggerRename} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Edit2 size={14} /> Rename</button>
                        <button onClick={handleDuplicate} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Copy size={14} /> Duplicate</button>
                        {activeMenu.type === 'layerGroup' && (
                            <button onClick={() => { setDeleteModal({isOpen:true, id:activeMenu.id, type:'layerGroup', name:'Group'}); executeUngroup(); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><Ungroup size={14} /> Ungroup Only</button>
                        )}
                    </>
                )}
                
                <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                <button onClick={triggerDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
            </div>
        )}
        {renameModal && <RenameModal isOpen={renameModal.isOpen} title={`Rename ${renameModal.type}`} initialValue={renameModal.currentName} onClose={() => setRenameModal(null)} onSave={executeRename} />}
        {deleteModal && (
            <ConfirmationModal 
                isOpen={deleteModal.isOpen} 
                title={`Delete ${deleteModal.type}?`} 
                message={`Are you sure you want to delete "${deleteModal.name}"?`} 
                confirmText={deleteModal.type === 'layerGroup' ? "Delete Group" : "Delete"}
                secondaryText={deleteModal.type === 'layerGroup' ? "Ungroup" : undefined}
                onClose={() => setDeleteModal(null)} 
                onConfirm={executeDelete}
                onSecondary={executeUngroup}
            />
        )}
    </div>
  );
};
