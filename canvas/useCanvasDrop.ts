
import { RefObject } from 'react';
import { Project, LibraryItem, CanvasElement } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useCanvasDrop = (
    project: Project,
    setProject: (p: Project) => void,
    scale: number,
    canvasRef: RefObject<HTMLDivElement>,
    isPreview: boolean,
    setSelectedElementIds: (ids: string[]) => void,
    setSelectedScreenIds?: (ids: string[]) => void,
    setSelectedScreenGroupIds?: (ids: string[]) => void
) => {
    const activeScreen = project.screens.find((s) => s.id === project.activeScreenId);

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
                collapsed: !!item.children
            };
            newElements.push(rootElement);

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

            const updatedScreens = project.screens.map((s) =>
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

    return { handleDrop, handleDragOver };
};
