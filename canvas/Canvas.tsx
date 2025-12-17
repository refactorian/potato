
import React, { useRef, useState, useEffect } from 'react';
import { CanvasElement, Project, Interaction, LibraryItem, AppSettings, LeftSidebarTab } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { executeInteraction } from '../interactions/engine';
import { v4 as uuidv4 } from 'uuid';
import { Lock, EyeOff } from 'lucide-react';

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
  setActiveLeftTab
}) => {
  const activeScreen = (project.screens || []).find((s) => s.id === project.activeScreenId);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [dragInfo, setDragInfo] = useState<{
    startX: number;
    startY: number;
    initialElements: { id: string; x: number; y: number; width: number; height: number }[];
    isResizing: boolean;
    resizeHandle?: string;
  } | null>(null);

  const snapValue = (val: number, gridSize: number, enabled: boolean) => {
    if (!enabled || gridSize <= 0) return val;
    return Math.round(val / gridSize) * gridSize;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isPreview) return;
    if (activeScreen?.locked) {
        alert("This screen is locked. Unlock it to add elements.");
        return;
    }

    const dataString = e.dataTransfer.getData('componentData');
    if (!dataString || !activeScreen) return;

    try {
        const item: LibraryItem = JSON.parse(dataString);
        
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const dropX = (e.clientX - rect.left) / scale;
        const dropY = (e.clientY - rect.top) / scale;

        const finalX = snapValue(dropX - (item.defaultWidth / 2), project.gridConfig?.size || 10, project.gridConfig?.snapToGrid);
        const finalY = snapValue(dropY - (item.defaultHeight / 2), project.gridConfig?.size || 10, project.gridConfig?.snapToGrid);

        const newElements: CanvasElement[] = [];
        const rootId = uuidv4();

        // Create Root Element
        const rootElement: CanvasElement = {
          id: rootId,
          type: item.type,
          name: `${item.label} ${activeScreen.elements.length + 1}`,
          x: finalX,
          y: finalY,
          width: item.defaultWidth,
          height: item.defaultHeight,
          zIndex: activeScreen.elements.length + 1,
          props: { ...item.defaultProps },
          style: { ...item.defaultStyle },
          interactions: [],
          // If it has children, start collapsed by default
          collapsed: !!item.children
        };
        newElements.push(rootElement);

        // Process Children if Hybrid Component
        if (item.children) {
            item.children.forEach((child, index) => {
                newElements.push({
                    id: uuidv4(),
                    type: child.type,
                    name: child.name,
                    x: finalX + child.x,
                    y: finalY + child.y,
                    width: child.width,
                    height: child.height,
                    zIndex: activeScreen.elements.length + 1 + index + 1,
                    props: { ...child.props },
                    style: { ...child.style },
                    interactions: [],
                    parentId: rootId
                });
            });
        }

        const updatedScreens = (project.screens || []).map((s) =>
          s.id === project.activeScreenId
            ? { ...s, elements: [...s.elements, ...newElements] }
            : s
        );

        setProject({ ...project, screens: updatedScreens });
        setSelectedElementIds([rootId]);
        if(setSelectedScreenIds) setSelectedScreenIds([]);
        if(setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);

    } catch (err) {
        console.error("Failed to parse dropped component data", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getDescendantIds = (parentId: string, allElements: CanvasElement[]): string[] => {
      const children = allElements.filter(e => e.parentId === parentId);
      let ids = children.map(c => c.id);
      children.forEach(child => {
          ids = [...ids, ...getDescendantIds(child.id, allElements)];
      });
      return ids;
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string, isResize: boolean = false, handleType: string = '') => {
    if (isPreview) {
      const element = activeScreen?.elements.find(el => el.id === elementId);
      if (element?.interactions?.length) {
          const context = {
            project, 
            setProject, 
            navigate: (screenId: string) => {
               setProject({...project, activeScreenId: screenId});
            }
          };
          element.interactions.forEach(i => {
              if (i.trigger === 'onClick') executeInteraction(i, context);
          });
      }
      return;
    }

    e.stopPropagation();

    if (appSettings?.autoNavigateToLayers && setActiveLeftTab) {
        setActiveLeftTab('layers');
    }

    const element = activeScreen?.elements.find((el) => el.id === elementId);
    if (!element) return;
    if (element.locked || activeScreen?.locked) return;

    // Clear Screen Selection to ensure properties panel shows layer properties
    if (setSelectedScreenIds) setSelectedScreenIds([]);
    if (setSelectedScreenGroupIds) setSelectedScreenGroupIds([]);

    let newSelection = [...selectedElementIds];
    
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
        if (newSelection.includes(elementId)) {
            newSelection = newSelection.filter(id => id !== elementId);
        } else {
            newSelection.push(elementId);
        }
    } else {
        if (!newSelection.includes(elementId)) {
            newSelection = [elementId];
        }
    }
    
    setSelectedElementIds(newSelection);

    const allMovingIds = new Set<string>(newSelection);
    
    newSelection.forEach(selId => {
        const descendants = getDescendantIds(selId, activeScreen?.elements || []);
        descendants.forEach(d => allMovingIds.add(d));
    });

    const initialElementsState = (activeScreen?.elements || [])
        .filter(el => allMovingIds.has(el.id))
        .map(el => ({ 
            id: el.id, 
            x: el.x, 
            y: el.y, 
            width: el.width, 
            height: el.height 
        }));

    setDragInfo({
      startX: e.clientX,
      startY: e.clientY,
      initialElements: initialElementsState,
      isResizing: isResize,
      resizeHandle: handleType,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragInfo || !activeScreen) return;

      const deltaX = (e.clientX - dragInfo.startX) / scale;
      const deltaY = (e.clientY - dragInfo.startY) / scale;
      
      const gridEnabled = project.gridConfig?.snapToGrid;
      const gridSize = project.gridConfig?.size || 10;

      const updatedScreens = (project.screens || []).map((s) => {
        if (s.id !== project.activeScreenId) return s;

        const updatedElements = (s.elements || []).map((el) => {
          const initialState = dragInfo.initialElements.find(init => init.id === el.id);
          if (!initialState) return el;

          if (dragInfo.isResizing) {
            if (selectedElementIds.length > 1) return el; 

            let newW = initialState.width;
            let newH = initialState.height;
            
            if (dragInfo.resizeHandle === 'se') {
              newW = Math.max(10, initialState.width + deltaX);
              newH = Math.max(10, initialState.height + deltaY);
            }
            
            if(gridEnabled) {
                newW = snapValue(newW, gridSize, true);
                newH = snapValue(newH, gridSize, true);
            }

            return { ...el, width: newW, height: newH };
          } else {
            let newX = initialState.x + deltaX;
            let newY = initialState.y + deltaY;

            if (gridEnabled) {
               newX = snapValue(newX, gridSize, true);
               newY = snapValue(newY, gridSize, true);
            }

            return { ...el, x: newX, y: newY };
          }
        });

        return { ...s, elements: updatedElements };
      });

      setProject({ ...project, screens: updatedScreens });
    };

    const handleMouseUp = () => {
      setDragInfo(null);
    };

    if (dragInfo) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragInfo, project, scale, activeScreen, setProject, selectedElementIds]);

  if (!activeScreen) return <div className="p-10 text-gray-400">No Screen Selected</div>;

  const gridStyle: React.CSSProperties = project.gridConfig?.visible ? {
      backgroundImage: `
        linear-gradient(to right, ${project.gridConfig.color} 1px, transparent 1px),
        linear-gradient(to bottom, ${project.gridConfig.color} 1px, transparent 1px)
      `,
      backgroundSize: `${project.gridConfig.size}px ${project.gridConfig.size}px`,
      opacity: 0.3
  } : {};

  // Check ancestry for hidden state
  const isElementVisible = (el: CanvasElement, allElements: CanvasElement[]): boolean => {
      if (el.hidden) return false;
      if (el.parentId) {
          const parent = allElements.find(p => p.id === el.parentId);
          if (parent) return isElementVisible(parent, allElements);
      }
      return true;
  };

  return (
    <div
      id="canvas-root"
      className="relative shadow-xl bg-white overflow-hidden transition-all duration-200"
      style={{
        width: project.viewportWidth,
        height: project.viewportHeight,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => {
          if(!isPreview) {
              setSelectedElementIds([]);
              // We do not clear screens on background click to keep sidebar context if desired,
              // but if the user wants to deselect everything, App.tsx handles the wrapper click.
              // Here we just stop propagation if needed.
          }
      }}
    >
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: activeScreen.backgroundColor }} />
      
      {!isPreview && project.gridConfig?.visible && (
        <div className="absolute inset-0 pointer-events-none z-0" style={gridStyle} />
      )}

      {/* Screen Locked Indicator */}
      {!isPreview && activeScreen.locked && (
          <div className="absolute inset-0 border-4 border-red-500/30 z-50 pointer-events-none flex items-start justify-end p-2">
              <Lock size={24} className="text-red-500/50" />
          </div>
      )}

      {/* Screen Hidden Indicator (Only in Edit Mode) */}
      {!isPreview && activeScreen.hidden && (
          <div className="absolute inset-0 border-4 border-gray-500/30 z-50 pointer-events-none flex items-start justify-start p-2">
              <EyeOff size={24} className="text-gray-500/50" />
          </div>
      )}

      {(activeScreen.elements || []).map((element) => {
        // Skip rendering if hidden
        if (!isElementVisible(element, activeScreen.elements)) return null;

        const isSelected = selectedElementIds.includes(element.id) && !isPreview;
        const isLocked = element.locked || activeScreen.locked;

        return (
          <div
            id={element.id}
            key={element.id}
            className={`absolute group ${isLocked ? 'cursor-not-allowed' : ''}`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              zIndex: element.zIndex,
              outline: !isPreview && !isSelected ? '1px dashed transparent' : undefined,
            }}
            onMouseEnter={(e) => { if(!isPreview && !isSelected) e.currentTarget.style.outline = '1px dashed #3b82f6'; }}
            onMouseLeave={(e) => { if(!isPreview && !isSelected) e.currentTarget.style.outline = 'transparent'; }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={(e) => e.stopPropagation()}
          >
            <ElementRenderer element={element} isPreview={isPreview} />

            {isSelected && (
              <>
                <div className={`absolute inset-0 border-2 ${isLocked ? 'border-red-400' : 'border-blue-500'} pointer-events-none`} />
                {!isLocked && selectedElementIds.length === 1 && (
                    <div
                    className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 cursor-se-resize z-50 rounded-full"
                    onMouseDown={(e) => handleMouseDown(e, element.id, true, 'se')}
                    />
                )}
                 <div className={`absolute -top-6 left-0 ${isLocked ? 'bg-red-500' : 'bg-blue-500'} text-white text-[10px] px-1.5 py-0.5 rounded-t font-mono truncate max-w-full flex items-center gap-1`}>
                   {isLocked && <Lock size={8} />}
                   {element.name} ({Math.round(element.x)}, {Math.round(element.y)})
                 </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
