
import React, { useRef, useState, useMemo } from 'react';
import { CanvasElement, Project, AppSettings, LeftSidebarTab } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { executeInteraction } from '../interactions/engine';
import { Lock, Unlock, EyeOff, Copy, Trash2, Eye } from 'lucide-react';
import { useCanvasDrag } from './useCanvasDrag';
import { useCanvasDrop } from './useCanvasDrop';
import { v4 as uuidv4 } from 'uuid';

interface CanvasProps {
  project: Project;
  setProject: (p: Project) => void;
  selectedElementIds: string[];
  setSelectedElementIds: (ids: string[]) => void;
  setSelectedScreenIds?: (ids: string[]) => void;
  setSelectedScreenGroupIds?: (ids: string[]) => void;
  scale: number;
  isPreview: boolean;
  appSettings?: AppSettings;
  setActiveLeftTab?: (tab: LeftSidebarTab) => void;
  alwaysShowHotspots?: boolean;
  navigateTo?: (screenId: string) => void;
  goBack?: () => void;
  onCanvasClick?: () => void;
  onCanvasDoubleClick?: () => void;
  onElementDoubleClick?: (id: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  project,
  setProject,
  selectedElementIds,
  setSelectedElementIds,
  setSelectedScreenIds,
  setSelectedScreenGroupIds,
  scale,
  isPreview,
  appSettings,
  setActiveLeftTab,
  alwaysShowHotspots,
  navigateTo,
  goBack,
  onCanvasClick,
  onCanvasDoubleClick,
  onElementDoubleClick
}) => {
  const activeScreen = (project.screens || []).find((s) => s.id === project.activeScreenId);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [flashHotspots, setFlashHotspots] = useState(false);
  
  // Interaction/Drag Hook
  const { handleMouseDown } = useCanvasDrag(
      project, setProject, selectedElementIds, setSelectedElementIds, scale, isPreview, appSettings, setActiveLeftTab, setSelectedScreenIds, setSelectedScreenGroupIds
  );

  // Drag & Drop Hook
  const { handleDrop, handleDragOver } = useCanvasDrop(
      project, setProject, scale, canvasRef, isPreview, setSelectedElementIds, setSelectedScreenIds, setSelectedScreenGroupIds
  );

  // --- Selection Bounding Box Calculation ---
  const selectionBounds = useMemo(() => {
    if (!activeScreen || selectedElementIds.length === 0) return null;
    
    const selectedElements = activeScreen.elements.filter(el => selectedElementIds.includes(el.id));
    if (selectedElements.length === 0) return null;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    selectedElements.forEach(el => {
        minX = Math.min(minX, el.x);
        minY = Math.min(minY, el.y);
        maxX = Math.max(maxX, el.x + el.width);
        maxY = Math.max(maxY, el.y + el.height);
    });

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        // Used to determine if the whole selection is locked
        isAnyLocked: selectedElements.some(el => el.locked)
    };
  }, [selectedElementIds, activeScreen]);

  if (!activeScreen) return <div className="p-10 text-gray-400">No Screen Selected</div>;

  const currentGridConfig = activeScreen.gridConfig || project.gridConfig;

  const gridStyle: React.CSSProperties = currentGridConfig?.visible ? {
      backgroundImage: currentGridConfig.style === 'dots' 
          ? `radial-gradient(circle, ${currentGridConfig.color} 1.5px, transparent 1px)`
          : `
            linear-gradient(to right, ${currentGridConfig.color} 1px, transparent 1px),
            linear-gradient(to bottom, ${currentGridConfig.color} 1px, transparent 1px)
          `,
      backgroundSize: `${currentGridConfig.size}px ${currentGridConfig.size}px`,
      opacity: currentGridConfig.style === 'dots' ? 0.6 : 0.3
  } : {};

  const isElementVisible = (el: CanvasElement, allElements: CanvasElement[]): boolean => {
      if (el.hidden) return false;
      if (el.parentId) {
          const parent = allElements.find(p => p.id === el.parentId);
          if (parent) return isElementVisible(parent, allElements);
      }
      return true;
  };

  const handleCanvasBackgroundClick = (e: React.MouseEvent) => {
      if (isPreview) {
          if (appSettings?.showHotspots && !alwaysShowHotspots) {
              setFlashHotspots(true);
              setTimeout(() => setFlashHotspots(false), 400);
          }
      } else {
          // Select Screen logic
          if (setSelectedScreenIds) setSelectedScreenIds([activeScreen.id]);
          setSelectedElementIds([]);
          if (onCanvasClick) onCanvasClick();
      }
  };

  const handleElementClick = (e: React.MouseEvent, element: CanvasElement) => {
      if (isPreview) {
          if (element.interactions && element.interactions.length > 0) {
              e.stopPropagation();
              const context = {
                  project,
                  setProject,
                  navigate: (screenId: string) => {
                      if (navigateTo) navigateTo(screenId);
                      else setProject({ ...project, activeScreenId: screenId });
                  },
                  goBack: () => {
                      if (goBack) goBack();
                  }
              };
              element.interactions.forEach(i => {
                  if (i.trigger === 'onClick') executeInteraction(i, context);
              });
          }
      } else {
          e.stopPropagation();
      }
  };

  // --- Bulk Action Handlers ---

  const handleBulkDuplicate = () => {
    if (selectedElementIds.length === 0) return;
    
    const getDescendants = (parentId: string, allElements: CanvasElement[]): CanvasElement[] => {
      const children = allElements.filter(e => e.parentId === parentId);
      let descendants = [...children];
      children.forEach(child => {
        descendants = [...descendants, ...getDescendants(child.id, allElements)];
      });
      return descendants;
    };

    const idMap: Record<string, string> = {};
    const elementsToDuplicate = activeScreen.elements.filter(el => selectedElementIds.includes(el.id));
    
    // 1. Map all root IDs and their descendants to new unique IDs
    elementsToDuplicate.forEach(el => {
        idMap[el.id] = uuidv4();
        const descendants = getDescendants(el.id, activeScreen.elements);
        descendants.forEach(d => idMap[d.id] = uuidv4());
    });

    const offset = 10;
    const newElements: CanvasElement[] = [];

    elementsToDuplicate.forEach(el => {
        const descendants = getDescendants(el.id, activeScreen.elements);
        
        // Add cloned root
        newElements.push({
            ...JSON.parse(JSON.stringify(el)),
            id: idMap[el.id],
            name: `${el.name} Copy`,
            x: el.x + offset,
            y: el.y + offset,
            zIndex: activeScreen.elements.length + newElements.length + 1
        });

        // Add cloned descendants
        descendants.forEach(d => {
            newElements.push({
                ...JSON.parse(JSON.stringify(d)),
                id: idMap[d.id],
                parentId: idMap[d.parentId || ''],
                zIndex: activeScreen.elements.length + newElements.length + 1
            });
        });
    });

    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      return { ...s, elements: [...s.elements, ...newElements] };
    });

    setProject({ ...project, screens: updatedScreens });
    setSelectedElementIds(elementsToDuplicate.map(el => idMap[el.id]));
  };

  const handleBulkDelete = () => {
    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      const getDescendantIds = (parentId: string, allElements: CanvasElement[]): string[] => {
        const children = allElements.filter(e => e.parentId === parentId);
        let ids: string[] = children.map(c => c.id);
        children.forEach(child => ids = [...ids, ...getDescendantIds(child.id, allElements)]);
        return ids;
      };
      let allIdsToDelete: string[] = [];
      selectedElementIds.forEach(baseId => {
        allIdsToDelete.push(baseId);
        allIdsToDelete.push(...getDescendantIds(baseId, s.elements));
      });
      return { ...s, elements: s.elements.filter(el => !allIdsToDelete.includes(el.id)) };
    });
    setProject({ ...project, screens: updatedScreens });
    setSelectedElementIds([]);
  };

  const handleBulkToggleLock = () => {
    if (!selectionBounds) return;
    const shouldLock = !selectionBounds.isAnyLocked;

    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      return {
        ...s,
        elements: s.elements.map(el => 
            selectedElementIds.includes(el.id) ? { ...el, locked: shouldLock } : el
        )
      };
    });
    setProject({ ...project, screens: updatedScreens });
  };

  const handleBulkToggleHide = () => {
    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      return {
        ...s,
        elements: s.elements.map(el => 
            selectedElementIds.includes(el.id) ? { ...el, hidden: !el.hidden } : el
        )
      };
    });
    setProject({ ...project, screens: updatedScreens });
  };

  return (
    <div
      id="canvas-root"
      className="relative shadow-xl bg-white overflow-hidden transition-all duration-200"
      style={{
        width: activeScreen.viewportWidth,
        height: activeScreen.viewportHeight,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasBackgroundClick}
      onDoubleClick={onCanvasDoubleClick}
    >
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: activeScreen.backgroundColor }} />
      
      {!isPreview && currentGridConfig?.visible && (
        <div className="absolute inset-0 pointer-events-none z-0" style={gridStyle} />
      )}

      {!isPreview && activeScreen.locked && (
          <div className="absolute inset-0 border-4 border-red-500/30 z-50 pointer-events-none flex items-start justify-end p-2">
              <Lock size={24} className="text-red-500/50" />
          </div>
      )}

      {!isPreview && activeScreen.hidden && (
          <div className="absolute inset-0 border-4 border-gray-500/30 z-50 pointer-events-none flex items-start justify-start p-2">
              <EyeOff size={24} className="text-gray-500/50" />
          </div>
      )}

      {/* Pass 1: Render actual elements */}
      {(activeScreen.elements || []).map((element) => {
        if (!isElementVisible(element, activeScreen.elements)) return null;

        const hasInteractions = element.interactions && element.interactions.length > 0;
        const isFlash = isPreview && flashHotspots && hasInteractions;
        const isPersistent = isPreview && appSettings?.showHotspots && alwaysShowHotspots && hasInteractions;

        return (
          <div
            id={element.id}
            key={element.id}
            className={`absolute group ${(element.locked || activeScreen.locked) ? 'cursor-not-allowed' : ''}`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              zIndex: element.zIndex,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={(e) => handleElementClick(e, element)}
            onDoubleClick={(e) => {
              if (!isPreview) {
                e.stopPropagation();
                onElementDoubleClick?.(element.id);
              }
            }}
          >
            <ElementRenderer element={element} isPreview={isPreview} />

            {(isFlash || isPersistent) && (
                <div className={`absolute inset-0 z-50 pointer-events-none rounded-sm transition-all duration-200 ${
                    isFlash 
                    ? 'bg-indigo-500/30 border-2 border-indigo-500 animate-pulse' 
                    : 'bg-indigo-500/10 border-2 border-indigo-500'
                }`} />
            )}
          </div>
        );
      })}

      {/* Pass 2: Selection Outlines and Resize Handles (Per Element) */}
      {!isPreview && (activeScreen.elements || []).map((element) => {
          if (!selectedElementIds.includes(element.id)) return null;
          if (!isElementVisible(element, activeScreen.elements)) return null;

          const isLocked = element.locked || activeScreen.locked;
          
          return (
            <div 
                key={`selection-${element.id}`}
                className="absolute pointer-events-none"
                style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    zIndex: 9998, // Slightly below toolbar
                }}
            >
                {/* Selection Border */}
                <div className={`absolute inset-0 border-2 ${isLocked ? 'border-red-400' : 'border-blue-500'} pointer-events-none shadow-sm`} />
                
                {/* Resize Handle (Interactive) - Only if not locked and single selection */}
                {!isLocked && selectedElementIds.length === 1 && (
                    <div
                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 cursor-se-resize z-[10001] rounded-full shadow-md pointer-events-auto"
                        onMouseDown={(e) => handleMouseDown(e, element.id, true, 'se')}
                    />
                )}
            </div>
          );
      })}

      {/* Pass 3: Unified Quick Action Toolbar (Once per Selection) */}
      {!isPreview && selectionBounds && (
          <div 
            className="absolute pointer-events-none"
            style={{
                left: selectionBounds.x,
                top: selectionBounds.y,
                width: selectionBounds.width,
                height: selectionBounds.height,
                zIndex: 9999, 
            }}
          >
              <div 
                  className="absolute -top-12 left-0 flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden p-1 gap-1 z-[10000] pointer-events-auto ring-1 ring-black/5"
                  onMouseDown={(e) => e.stopPropagation()}
              >
                  {/* Badge for Multi-select */}
                  {selectedElementIds.length > 1 && (
                      <div className="px-2 py-1 text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg mr-1 border border-indigo-100 dark:border-indigo-800/50">
                          {selectedElementIds.length} ITEMS
                      </div>
                  )}

                  <button 
                      onClick={handleBulkDuplicate} 
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                      title="Duplicate"
                  >
                      <Copy size={14} />
                  </button>
                  <button 
                      onClick={handleBulkToggleLock} 
                      className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${selectionBounds.isAnyLocked ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-gray-600 dark:text-gray-300'}`}
                      title={selectionBounds.isAnyLocked ? "Unlock All" : "Lock Selection"}
                  >
                      {selectionBounds.isAnyLocked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                  <button 
                      onClick={handleBulkToggleHide} 
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                      title="Hide Selection"
                  >
                      <EyeOff size={14} />
                  </button>
                  <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
                  <button 
                      onClick={handleBulkDelete} 
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                      title="Delete Selection"
                  >
                      <Trash2 size={14} />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
