
import React, { useRef, useState } from 'react';
import { CanvasElement, Project, AppSettings, LeftSidebarTab } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { executeInteraction } from '../interactions/engine';
import { Lock, EyeOff } from 'lucide-react';
import { useCanvasDrag } from './useCanvasDrag';
import { useCanvasDrop } from './useCanvasDrop';

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
  goBack
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

  const handleCanvasBackgroundClick = () => {
      if (isPreview) {
          if (appSettings?.showHotspots && !alwaysShowHotspots) {
              setFlashHotspots(true);
              setTimeout(() => setFlashHotspots(false), 400);
          }
      } else {
          setSelectedElementIds([]);
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
      onClick={handleCanvasBackgroundClick}
    >
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: activeScreen.backgroundColor }} />
      
      {!isPreview && project.gridConfig?.visible && (
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

      {(activeScreen.elements || []).map((element) => {
        if (!isElementVisible(element, activeScreen.elements)) return null;

        const isSelected = selectedElementIds.includes(element.id) && !isPreview;
        const isLocked = element.locked || activeScreen.locked;
        const hasInteractions = element.interactions && element.interactions.length > 0;
        
        const isFlash = isPreview && flashHotspots && hasInteractions;
        const isPersistent = isPreview && appSettings?.showHotspots && alwaysShowHotspots && hasInteractions;

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
            onClick={(e) => handleElementClick(e, element)}
          >
            <ElementRenderer element={element} isPreview={isPreview} />

            {(isFlash || isPersistent) && (
                <div className={`absolute inset-0 z-50 pointer-events-none rounded-sm transition-all duration-200 ${
                    isFlash 
                    ? 'bg-indigo-500/30 border-2 border-indigo-500 animate-pulse' 
                    : 'bg-indigo-500/10 border-2 border-indigo-500'
                }`} />
            )}

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
