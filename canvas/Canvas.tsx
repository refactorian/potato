
import React, { useRef, useState } from 'react';
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

  // Quick Action Handlers
  const handleDuplicate = (id: string) => {
    const el = activeScreen.elements.find(e => e.id === id);
    if (!el) return;

    const getDescendants = (parentId: string, allElements: CanvasElement[]): CanvasElement[] => {
      const children = allElements.filter(e => e.parentId === parentId);
      let descendants = [...children];
      children.forEach(child => {
        descendants = [...descendants, ...getDescendants(child.id, allElements)];
      });
      return descendants;
    };

    const descendants = getDescendants(id, activeScreen.elements);
    const idMap: Record<string, string> = { [id]: uuidv4() };
    descendants.forEach(d => idMap[d.id] = uuidv4());

    const offset = 10;
    const newRoot = {
      ...JSON.parse(JSON.stringify(el)),
      id: idMap[id],
      name: `${el.name} Copy`,
      x: el.x + offset,
      y: el.y + offset,
      zIndex: activeScreen.elements.length + 1
    };

    const newDescendants = descendants.map(d => ({
      ...JSON.parse(JSON.stringify(d)),
      id: idMap[d.id],
      parentId: idMap[d.parentId || ''],
      zIndex: activeScreen.elements.length + 1 + descendants.indexOf(d) + 1
    }));

    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      return { ...s, elements: [...s.elements, newRoot, ...newDescendants] };
    });

    setProject({ ...project, screens: updatedScreens });
    setSelectedElementIds([newRoot.id]);
  };

  const handleDelete = (ids: string[]) => {
    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      const getDescendantIds = (parentId: string, allElements: CanvasElement[]): string[] => {
        const children = allElements.filter(e => e.parentId === parentId);
        let ids: string[] = children.map(c => c.id);
        children.forEach(child => ids = [...ids, ...getDescendantIds(child.id, allElements)]);
        return ids;
      };
      let allIdsToDelete: string[] = [];
      ids.forEach(baseId => {
        allIdsToDelete.push(baseId);
        allIdsToDelete.push(...getDescendantIds(baseId, s.elements));
      });
      return { ...s, elements: s.elements.filter(el => !allIdsToDelete.includes(el.id)) };
    });
    setProject({ ...project, screens: updatedScreens });
    setSelectedElementIds([]);
  };

  const handleToggleLock = (id: string) => {
    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      return {
        ...s,
        elements: s.elements.map(el => el.id === id ? { ...el, locked: !el.locked } : el)
      };
    });
    setProject({ ...project, screens: updatedScreens });
  };

  const handleToggleHide = (id: string) => {
    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      return {
        ...s,
        elements: s.elements.map(el => el.id === id ? { ...el, hidden: !el.hidden } : el)
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

      {/* Pass 2: Selection Overlays (Always on top of elements) */}
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
                    zIndex: 9999, // Extremely high Z-index
                }}
            >
                {/* Selection Border */}
                <div className={`absolute inset-0 border-2 ${isLocked ? 'border-red-400' : 'border-blue-500'} pointer-events-none shadow-sm`} />
                
                {/* Resize Handle (Interactive) */}
                {!isLocked && selectedElementIds.length === 1 && (
                    <div
                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 cursor-se-resize z-[10001] rounded-full shadow-md pointer-events-auto"
                        onMouseDown={(e) => handleMouseDown(e, element.id, true, 'se')}
                    />
                )}
                 
                 {/* Quick Action Toolbar (Interactive) */}
                 <div 
                  className="absolute -top-12 left-0 flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden p-1 gap-1 z-[10000] pointer-events-auto ring-1 ring-black/5"
                  onMouseDown={(e) => e.stopPropagation()}
                 >
                    <button 
                      onClick={() => handleDuplicate(element.id)} 
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                    <button 
                      onClick={() => handleToggleLock(element.id)} 
                      className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${element.locked ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-gray-600 dark:text-gray-300'}`}
                      title={element.locked ? "Unlock" : "Lock"}
                    >
                      {element.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                    <button 
                      onClick={() => handleToggleHide(element.id)} 
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                      title="Hide"
                    >
                      <EyeOff size={14} />
                    </button>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
                    <button 
                      onClick={() => handleDelete(selectedElementIds)} 
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
            </div>
          );
      })}
    </div>
  );
};
