
import { v4 as uuidv4 } from 'uuid';
import { Project, CanvasElement } from '../types';

export const performBooleanOperation = (
    op: 'union' | 'subtract' | 'intersect' | 'exclude',
    selectedElementIds: string[],
    project: Project
): Project => {
    if (selectedElementIds.length < 2) return project;

    const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
    if (!activeScreen) return project;

    if (op === 'union') {
        const selectedEls = activeScreen.elements.filter(el => selectedElementIds.includes(el.id));
        if (selectedEls.length === 0) return project;

        const minX = Math.min(...selectedEls.map(el => el.x));
        const minY = Math.min(...selectedEls.map(el => el.y));
        const maxX = Math.max(...selectedEls.map(el => el.x + el.width));
        const maxY = Math.max(...selectedEls.map(el => el.y + el.height));

        const newGroup: CanvasElement = {
            id: uuidv4(),
            type: 'group',
            name: 'Union Group',
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

        return { ...project, screens: updatedScreens };
    } else {
        alert(`The '${op}' operation requires vector path capabilities which are not supported on standard HTML elements.`);
        return project;
    }
};
