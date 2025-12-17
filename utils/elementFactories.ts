
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, Project } from '../types';

export const createNewElement = (tool: string, project: Project): CanvasElement | null => {
    const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
    if (!activeScreen) return null;

    const centerX = (project.viewportWidth / 2) - 50;
    const centerY = (project.viewportHeight / 2) - 50;
    
    const commonProps = {
        id: uuidv4(),
        name: tool.charAt(0).toUpperCase() + tool.slice(1),
        x: centerX,
        y: centerY,
        width: 100,
        height: 100,
        zIndex: activeScreen.elements.length + 1,
        interactions: [],
        props: {},
        style: { backgroundColor: '#e2e8f0' }
    };

    switch (tool) {
        case 'text':
            return {
                ...commonProps,
                type: 'text',
                width: 150,
                height: 40,
                style: { fontSize: 16, color: '#000000', backgroundColor: 'transparent' },
                props: { text: 'Type something...' }
            };
        case 'rectangle':
            return {
                ...commonProps,
                type: 'container',
                style: { backgroundColor: '#cbd5e1', borderRadius: 0 }
            };
        case 'rounded':
            return {
                ...commonProps,
                name: 'Rounded Rect',
                type: 'container',
                style: { backgroundColor: '#cbd5e1', borderRadius: 16 }
            };
        case 'ellipse':
            return {
                ...commonProps,
                type: 'circle',
                style: { backgroundColor: '#cbd5e1', borderRadius: 50 }
            };
        case 'line':
            return {
                ...commonProps,
                type: 'container',
                width: 200,
                height: 2,
                style: { backgroundColor: '#000000', borderRadius: 0 }
            };
        case 'arrow':
            return {
                ...commonProps,
                type: 'icon',
                width: 50,
                height: 50,
                style: { backgroundColor: 'transparent', color: '#000000' },
                props: { iconName: 'MoveRight' }
            };
        case 'polygon':
            return {
                ...commonProps,
                type: 'icon',
                width: 100,
                height: 100,
                style: { backgroundColor: 'transparent', color: '#cbd5e1' },
                props: { iconName: 'Triangle' }
            };
        default:
            return null;
    }
};
