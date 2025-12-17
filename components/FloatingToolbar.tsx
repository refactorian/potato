
import React from 'react';
import { 
    MousePointer2, Type, Square, Circle, Minus, MoveRight, 
    Triangle, Layout
} from 'lucide-react';
import { LibraryItem } from '../types';

interface FloatingToolbarProps {
    onSelectTool: (tool: string) => void;
    activeTool: string;
    onBooleanOp: (op: 'union' | 'subtract' | 'intersect' | 'exclude') => void;
    selectionCount: number;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ 
    onSelectTool, 
    activeTool, 
}) => {
    
    // Construct data for Drag and Drop operations that matches LibraryItem structure
    // This allows the existing Canvas onDrop handler to process these items
    const getToolData = (toolId: string): LibraryItem | null => {
        const commonStyle = { backgroundColor: '#cbd5e1' };
        
        switch (toolId) {
            case 'text':
                return { 
                    type: 'text', 
                    label: 'Text', 
                    icon: 'Type', 
                    defaultWidth: 150, 
                    defaultHeight: 40, 
                    defaultProps: { text: 'Type something...' }, 
                    defaultStyle: { fontSize: 16, color: '#000000', backgroundColor: 'transparent' } 
                };
            case 'rectangle':
                return { 
                    type: 'container', 
                    label: 'Rectangle', 
                    icon: 'Square', 
                    defaultWidth: 100, 
                    defaultHeight: 100, 
                    defaultProps: {}, 
                    defaultStyle: { ...commonStyle, borderRadius: 0 } 
                };
            case 'rounded':
                return { 
                    type: 'container', 
                    label: 'Rounded Rect', 
                    icon: 'Layout', 
                    defaultWidth: 100, 
                    defaultHeight: 100, 
                    defaultProps: {}, 
                    defaultStyle: { ...commonStyle, borderRadius: 16 } 
                };
            case 'ellipse':
                return { 
                    type: 'circle', 
                    label: 'Ellipse', 
                    icon: 'Circle', 
                    defaultWidth: 100, 
                    defaultHeight: 100, 
                    defaultProps: {}, 
                    defaultStyle: { ...commonStyle, borderRadius: 50 } 
                };
            case 'polygon':
                return { 
                    type: 'icon', 
                    label: 'Polygon', 
                    icon: 'Triangle', 
                    defaultWidth: 100, 
                    defaultHeight: 100, 
                    defaultProps: { iconName: 'Triangle' }, 
                    defaultStyle: { backgroundColor: 'transparent', color: '#cbd5e1' } 
                };
            case 'line':
                return { 
                    type: 'container', 
                    label: 'Line', 
                    icon: 'Minus', 
                    defaultWidth: 200, 
                    defaultHeight: 4, 
                    defaultProps: {}, 
                    defaultStyle: { backgroundColor: '#000000', borderRadius: 0 } 
                };
            case 'arrow':
                return { 
                    type: 'icon', 
                    label: 'Arrow', 
                    icon: 'MoveRight', 
                    defaultWidth: 50, 
                    defaultHeight: 50, 
                    defaultProps: { iconName: 'MoveRight' }, 
                    defaultStyle: { backgroundColor: 'transparent', color: '#000000' } 
                };
            default:
                return null;
        }
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        const item = getToolData(id);
        if (item) {
            // "componentData" is the key the Canvas component listens for
            e.dataTransfer.setData('componentData', JSON.stringify(item));
            e.dataTransfer.effectAllowed = 'copy';
        }
    };

    // Helper to render a tool button
    const ToolBtn = ({ id, icon: Icon, tooltip, disabled = false }: { id: string, icon: any, tooltip: string, disabled?: boolean }) => {
        const isDraggable = id !== 'select'; // Select tool is not draggable

        return (
            <button
                onClick={() => !disabled && onSelectTool(id)}
                draggable={isDraggable && !disabled}
                onDragStart={(e) => isDraggable && handleDragStart(e, id)}
                className={`p-2.5 rounded-lg transition-all relative group flex items-center justify-center cursor-pointer
                    ${activeTool === id 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }
                    ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
                    active:scale-95
                `}
                title={tooltip}
                disabled={disabled}
            >
                <Icon size={20} strokeWidth={activeTool === id ? 2.5 : 2} />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {tooltip}
                </div>
            </button>
        );
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-1 px-2 py-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                
                {/* Primary Tools */}
                <ToolBtn id="select" icon={MousePointer2} tooltip="Select (V)" />
                
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                
                {/* Creation Tools */}
                <ToolBtn id="text" icon={Type} tooltip="Text (T)" />
                
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

                <ToolBtn id="rectangle" icon={Square} tooltip="Rectangle (R)" />
                <ToolBtn id="rounded" icon={Layout} tooltip="Rounded Rectangle" />
                <ToolBtn id="ellipse" icon={Circle} tooltip="Ellipse (O)" />
                <ToolBtn id="polygon" icon={Triangle} tooltip="Polygon" />
                
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

                <ToolBtn id="line" icon={Minus} tooltip="Line (L)" />
                <ToolBtn id="arrow" icon={MoveRight} tooltip="Arrow (Shift+L)" />

            </div>
        </div>
    );
};
