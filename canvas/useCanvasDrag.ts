
import React, { useState, useEffect } from 'react';
import { Project, CanvasElement, AppSettings, LeftSidebarTab } from '../types';

interface DragInfo {
    startX: number;
    startY: number;
    initialElements: { id: string; x: number; y: number; width: number; height: number }[];
    isResizing: boolean;
    resizeHandle?: string;
}

export const useCanvasDrag = (
    project: Project,
    setProject: (p: Project) => void,
    selectedElementIds: string[],
    setSelectedElementIds: (ids: string[]) => void,
    scale: number,
    isPreview: boolean,
    appSettings?: AppSettings,
    setActiveLeftTab?: (tab: LeftSidebarTab) => void,
    setSelectedScreenIds?: (ids: string[]) => void,
    setSelectedScreenGroupIds?: (ids: string[]) => void
) => {
    const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);
    const activeScreen = project.screens.find((s) => s.id === project.activeScreenId);

    const getDescendantIds = (parentId: string, allElements: CanvasElement[]): string[] => {
        const children = allElements.filter(e => e.parentId === parentId);
        let ids = children.map(c => c.id);
        children.forEach(child => {
            ids = [...ids, ...getDescendantIds(child.id, allElements)];
        });
        return ids;
    };

    const snapValue = (val: number, gridSize: number, enabled: boolean) => {
        if (!enabled || gridSize <= 0) return val;
        return Math.round(val / gridSize) * gridSize;
    };

    const handleMouseDown = (e: React.MouseEvent, elementId: string, isResize: boolean = false, handleType: string = '') => {
        if (isPreview) return;

        e.stopPropagation();

        if (appSettings?.autoNavigateToLayers && setActiveLeftTab) {
            setActiveLeftTab('layers');
        }

        const element = activeScreen?.elements.find((el) => el.id === elementId);
        if (!element) return;
        if (element.locked || activeScreen?.locked) return;

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
            
            const gridConfig = activeScreen.gridConfig || project.gridConfig;
            const gridEnabled = gridConfig?.snapToGrid;
            const gridSize = gridConfig?.size || 10;

            const updatedScreens = project.screens.map((s) => {
                if (s.id !== project.activeScreenId) return s;

                const updatedElements = s.elements.map((el) => {
                    const initialState = dragInfo.initialElements.find(init => init.id === el.id);
                    if (!initialState) return el;

                    if (dragInfo.isResizing) {
                        if (selectedElementIds.length > 1) return el; 

                        let newW = initialState.width + deltaX;
                        let newH = initialState.height + deltaY;
                        
                        if (gridEnabled) {
                            newW = snapValue(newW, gridSize, true);
                            newH = snapValue(newH, gridSize, true);
                        }

                        return { ...el, width: Math.max(10, newW), height: Math.max(10, newH) };
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

    return { handleMouseDown, dragInfo };
};
