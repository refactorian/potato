
import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, ChevronDown, ChevronRight, Layout, Smartphone, Tablet, Monitor, ChevronsUp, ChevronsDown, LayoutTemplate, Eye, Plus, Pin } from 'lucide-react';
import { TEMPLATES } from '../../data/templates/index';
import { Project, Screen, TemplateDefinition } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface TemplatesMenuProps {
    project: Project;
    setProject: (p: Project) => void;
    onPreviewTemplate: (template: TemplateDefinition) => void;
    isPinned?: boolean;
    onTogglePin?: () => void;
}

type DeviceFilter = 'all' | 'mobile' | 'tablet' | 'desktop';

export const TemplatesMenu: React.FC<TemplatesMenuProps> = ({ project, setProject, onPreviewTemplate, isPinned, onTogglePin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('mobile');
  
  const templateCategoriesList = useMemo(() => Array.from(new Set(TEMPLATES.map(t => t.category))), []);
  const [expandedTemplateCategories, setExpandedTemplateCategories] = useState<string[]>(templateCategoriesList);

  const toggleCategory = (categoryName: string) => {
    setExpandedTemplateCategories(prev => 
        prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
    );
  };

  const toggleAllCategories = () => {
    if (expandedTemplateCategories.length === templateCategoriesList.length) {
        setExpandedTemplateCategories([]);
    } else {
        setExpandedTemplateCategories(templateCategoriesList);
    }
  };

  const matchesDevice = (width: number) => {
      if (deviceFilter === 'all') return true;
      if (deviceFilter === 'mobile') return width <= 480;
      if (deviceFilter === 'tablet') return width > 480 && width <= 1024;
      if (deviceFilter === 'desktop') return width > 1024;
      return true;
  };

  const filteredTemplates = useMemo(() => {
      return TEMPLATES.filter(t => {
          const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
          const navbar = t.elements.find(e => e.type === 'navbar');
          const estimatedWidth = navbar ? navbar.width : 375; 
          const matchesType = matchesDevice(estimatedWidth);
          return matchesSearch && matchesType;
      });
  }, [searchQuery, deviceFilter]);

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    let baseName = template.name;
    let counter = 1;
    let newName = `${baseName}`;
    while (project.screens.some(s => s.name === newName)) {
        newName = `${baseName} (${counter})`;
        counter++;
    }

    const newScreen: Screen = {
      id: uuidv4(),
      name: newName,
      backgroundColor: template.backgroundColor,
      elements: template.elements.map(el => ({
        ...el,
        id: uuidv4(),
        interactions: []
      }))
    };

    setProject({
      ...project,
      screens: [...project.screens, newScreen],
      activeScreenId: newScreen.id
    });
  };

  const allExpanded = expandedTemplateCategories.length === templateCategoriesList.length;

  return (
    <div className="flex flex-col h-full">
         <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                Screen Templates
            </h2>
            {onTogglePin && (
                <button 
                    onClick={onTogglePin}
                    className={`p-1.5 rounded-md transition-colors ${isPinned ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title={isPinned ? "Unpin Tab" : "Pin Tab"}
                >
                    <Pin size={16} className={isPinned ? 'fill-current' : ''} />
                </button>
            )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
             {/* Toolbar */}
             <div className="flex flex-col gap-2 mb-4 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-0.5">
                        <button onClick={() => setDeviceFilter('all')} className={`p-1 rounded ${deviceFilter === 'all' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`} title="All Sizes"><Layout size={14} /></button>
                        <button onClick={() => setDeviceFilter('mobile')} className={`p-1 rounded ${deviceFilter === 'mobile' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`} title="Mobile"><Smartphone size={14} /></button>
                        <button onClick={() => setDeviceFilter('tablet')} className={`p-1 rounded ${deviceFilter === 'tablet' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`} title="Tablet"><Tablet size={14} /></button>
                        <button onClick={() => setDeviceFilter('desktop')} className={`p-1 rounded ${deviceFilter === 'desktop' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`} title="Desktop"><Monitor size={14} /></button>
                    </div>

                    <button 
                        onClick={toggleAllCategories}
                        className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        title={allExpanded ? "Collapse All" : "Expand All"}
                    >
                        {allExpanded ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />}
                    </button>
                </div>
            </div>

            {templateCategoriesList.map((category) => {
                 const categoryTemplates = filteredTemplates.filter(t => t.category === category);
                 if (categoryTemplates.length === 0) return null;

                 return (
                    <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                        >
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">{category}</span>
                            {expandedTemplateCategories.includes(category) ? <ChevronDown size={14} className="text-gray-500"/> : <ChevronRight size={14} className="text-gray-500"/>}
                        </button>

                        {expandedTemplateCategories.includes(category) && (
                            <div className="p-3 bg-white dark:bg-gray-900 space-y-3">
                                {categoryTemplates.map(template => (
                                    <div 
                                        key={template.id} 
                                        className="group relative border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-all"
                                    >
                                        <div 
                                            className="cursor-pointer"
                                            onClick={() => onPreviewTemplate(template)}
                                        >
                                            <div className="h-20 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:bg-indigo-50 dark:group-hover:bg-gray-600 group-hover:text-indigo-400 transition-colors">
                                                {(LucideIcons as any)[template.thumbnail] ? React.createElement((LucideIcons as any)[template.thumbnail], {size: 24}) : <LayoutTemplate size={24} />}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    <div className="bg-white/90 dark:bg-black/70 px-2 py-1 rounded text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                        <Eye size={10} /> Preview
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-white dark:bg-gray-750">
                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate pr-6">{template.name}</div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400">{template.elements.length} elements</div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                applyTemplate(template.id);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-indigo-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:bg-indigo-700 transition-all transform hover:scale-110 z-10"
                                            title="Add Screen to Project"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 );
             })}
             
             {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs">
                    No templates found matching your filters.
                </div>
             )}
        </div>
    </div>
  );
};
