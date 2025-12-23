
import React, { useMemo, useState, useEffect } from 'react';
import { Project, TemplateDefinition, Screen } from '../types';
import { ElementRenderer } from '../canvas/ElementRenderer';
import { X, Plus, ZoomIn, ZoomOut } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TemplatePreviewAreaProps {
  template: TemplateDefinition;
  project: Project;
  setProject: (p: Project) => void;
  onClose: () => void;
}

export const TemplatePreviewArea: React.FC<TemplatePreviewAreaProps> = ({
  template,
  project,
  setProject,
  onClose,
}) => {
    // Determine dimensions for rendering the preview
    const dimensions = useMemo(() => {
        const navbar = template.elements.find(el => el.type === 'navbar');
        // Default based on type logic if available, else heuristic
        let width = 375;
        let height = 812;

        if (navbar && navbar.width) {
            width = navbar.width;
        } else {
             const maxX = Math.max(...template.elements.map(el => el.x + el.width), 375);
             const maxY = Math.max(...template.elements.map(el => el.y + el.height), 812);
             width = maxX;
             height = maxY;
        }
        
        // Adjust for desktop templates
        if (width > 1000) height = 800;
        else if (width > 600) height = 1024; // Tabletish
        
        return { width, height };
    }, [template]);

    // Zoom State
    const [scale, setScale] = useState(1);

    // Initial Auto-fit logic
    useEffect(() => {
        if (dimensions.width > 1200) {
            setScale(0.65);
        } else if (dimensions.width > 600) {
            setScale(0.75);
        } else {
            setScale(0.85);
        }
    }, [dimensions]);

    // Logic to add template
    const handleAdd = () => {
         // Create unique name
        let baseName = template.name;
        let counter = 1;
        let newName = `${baseName}`;
        while ((project.screens || []).some(s => s.name === newName)) {
            newName = `${baseName} (${counter})`;
            counter++;
        }

        // Fix: Added missing viewportWidth, viewportHeight, and gridConfig to Screen definition
        const newScreen: Screen = {
            id: uuidv4(),
            name: newName,
            backgroundColor: template.backgroundColor,
            viewportWidth: project.viewportWidth,
            viewportHeight: project.viewportHeight,
            gridConfig: { ...project.gridConfig },
            elements: template.elements.map(el => ({
                ...el,
                id: uuidv4(),
                interactions: []
            }))
        };

        setProject({
            ...project,
            screens: [...(project.screens || []), newScreen],
            activeScreenId: newScreen.id
        });
        onClose();
    };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 dark:bg-gray-950 animate-in fade-in duration-300">
        {/* Header / Toolbar */}
        <div className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                Previewing: <span className="text-indigo-600 dark:text-indigo-400">{template.name}</span>
            </h2>
            
            <div className="flex items-center gap-4">
                 {/* Zoom Controls */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200 border border-gray-200 dark:border-gray-600">
                  <button onClick={() => setScale(Math.max(0.1, scale - 0.1))} className="hover:text-indigo-600 dark:hover:text-indigo-400 p-1">
                     <ZoomOut size={16} />
                  </button>
                  <span className="w-12 text-center font-mono">{Math.round(scale * 100)}%</span>
                  <button onClick={() => setScale(Math.min(3, scale + 0.1))} className="hover:text-indigo-600 dark:hover:text-indigo-400 p-1">
                     <ZoomIn size={16} />
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

                <button 
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                    <X size={16} /> Cancel
                </button>
                <button 
                    onClick={handleAdd}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> Add to Project
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-10">
            <div 
                className="relative bg-white shadow-2xl transition-all duration-200 overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    flexShrink: 0
                }}
            >
                <div className="absolute inset-0" style={{ backgroundColor: template.backgroundColor }} />
                {template.elements.map((el, i) => (
                    <div 
                        key={i} 
                        className="absolute" 
                        style={{ left: el.x, top: el.y, width: el.width, height: el.height, zIndex: el.zIndex }}
                    >
                        <ElementRenderer element={{...el, id: `preview-${i}`}} isPreview={true} />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
