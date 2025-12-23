
import React, { useState, useEffect, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { LIBRARY_CATEGORIES } from '../data/components';
import { TEMPLATES } from '../data/templates/index';
import { Project, Screen, LibraryItem, Asset, TemplateDefinition } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
    ChevronDown, ChevronRight, Upload, Trash2, 
    Image as ImageIcon, Box, LayoutTemplate, Plus, Eye,
    Search, Smartphone, Tablet, Monitor, Layout, ChevronsUp, ChevronsDown
} from 'lucide-react';

export type LibraryTab = 'assets' | 'components' | 'templates';

interface LibraryPanelProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  activeTab: LibraryTab;
  onPreviewTemplate: (template: TemplateDefinition) => void;
}

type DeviceFilter = 'all' | 'mobile' | 'tablet' | 'desktop';

export const LibraryPanel: React.FC<LibraryPanelProps> = ({ project, setProject, activeTab, onPreviewTemplate }) => {
  
  // -- State for Search & Filter --
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('mobile');

  // -- State for Categories --
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    LIBRARY_CATEGORIES ? LIBRARY_CATEGORIES.map(c => c.name) : []
  );
  
  const templateCategoriesList = useMemo(() => Array.from(new Set(TEMPLATES.map(t => t.category))), []);
  const [expandedTemplateCategories, setExpandedTemplateCategories] = useState<string[]>(templateCategoriesList);
  
  // -- Reset filters when tab changes --
  useEffect(() => {
      setSearchQuery('');
      setDeviceFilter('mobile');
  }, [activeTab]);

  // -- Helper: Toggle Single Category --
  const toggleCategory = (categoryName: string, isTemplate: boolean) => {
    if (isTemplate) {
        setExpandedTemplateCategories(prev => 
            prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
        );
    } else {
        setExpandedCategories(prev => 
            prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
        );
    }
  };

  // -- Helper: Toggle All Categories --
  const toggleAllCategories = (isTemplate: boolean) => {
    if (isTemplate) {
        if (expandedTemplateCategories.length === templateCategoriesList.length) {
            setExpandedTemplateCategories([]); // Collapse all
        } else {
            setExpandedTemplateCategories(templateCategoriesList); // Expand all
        }
    } else {
        const allComponentCats = LIBRARY_CATEGORIES.map(c => c.name);
        if (expandedCategories.length === allComponentCats.length) {
            setExpandedCategories([]);
        } else {
            setExpandedCategories(allComponentCats);
        }
    }
  };

  // -- Helper: Check Device Fit --
  const matchesDevice = (width: number) => {
      if (deviceFilter === 'all') return true;
      if (deviceFilter === 'mobile') return width <= 480;
      if (deviceFilter === 'tablet') return width > 480 && width <= 1024;
      if (deviceFilter === 'desktop') return width > 1024;
      return true;
  };

  // -- Filtered Data: Components --
  const filteredComponentCategories = useMemo(() => {
    return LIBRARY_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
            const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = matchesDevice(item.defaultWidth);
            return matchesSearch && matchesType;
        })
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery, deviceFilter, LIBRARY_CATEGORIES]);

  // -- Filtered Data: Templates --
  const filteredTemplates = useMemo(() => {
      return TEMPLATES.filter(t => {
          const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
          const navbar = t.elements.find(e => e.type === 'navbar');
          const estimatedWidth = navbar ? navbar.width : 375; 
          
          const matchesType = matchesDevice(estimatedWidth);
          return matchesSearch && matchesType;
      });
  }, [searchQuery, deviceFilter, TEMPLATES]);

  // -- Auto-expand on search --
  useEffect(() => {
      if (searchQuery) {
          if (activeTab === 'components') {
              setExpandedCategories(LIBRARY_CATEGORIES.map(c => c.name));
          } else if (activeTab === 'templates') {
              setExpandedTemplateCategories(templateCategoriesList);
          }
      }
  }, [searchQuery, activeTab, templateCategoriesList]);


  const handleDragStart = (e: React.DragEvent, item: LibraryItem) => {
    const dragData = JSON.stringify(item);
    e.dataTransfer.setData('componentData', dragData);
  };

  const handleAssetDragStart = (e: React.DragEvent, asset: Asset) => {
      const item: LibraryItem = {
          type: asset.type === 'video' ? 'video' : 'image',
          label: asset.name,
          icon: asset.type === 'video' ? 'Video' : 'Image',
          defaultWidth: 200,
          defaultHeight: 150,
          defaultProps: { src: asset.src },
          defaultStyle: { borderRadius: 0 }
      };
      const dragData = JSON.stringify(item);
      e.dataTransfer.setData('componentData', dragData);
  };

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
      viewportWidth: project.viewportWidth,
      viewportHeight: project.viewportHeight,
      gridConfig: { ...project.gridConfig },
      elements: template.elements.map(el => ({
        ...el,
        id: uuidv4(),
        interactions: []
      }))
    };

    setProject(prev => ({
      ...prev,
      screens: [...prev.screens, newScreen],
      activeScreenId: newScreen.id
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file: File) => {
          const reader = new FileReader();
          reader.onload = (event) => {
              const src = event.target?.result as string;
              if (src) {
                  const newAsset: Asset = {
                      id: uuidv4(),
                      name: file.name,
                      type: file.type.startsWith('video') ? 'video' : 'image',
                      src
                  };
                  setProject(prev => ({
                      ...prev,
                      assets: [...(prev.assets || []), newAsset]
                  }));
              }
          };
          reader.readAsDataURL(file);
      });
  };

  const deleteAsset = (assetId: string) => {
      setProject(prev => ({
          ...prev,
          assets: (prev.assets || []).filter(a => a.id !== assetId)
      }));
  };

  // -- Render Toolbar UI --
  const renderToolbar = (isTemplate: boolean) => {
      const allExpanded = isTemplate 
        ? expandedTemplateCategories.length === templateCategoriesList.length
        : expandedCategories.length === LIBRARY_CATEGORIES.length;

      return (
        <div className="flex flex-col gap-2 mb-4 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Search */}
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
            
            {/* Filters Row */}
            <div className="flex items-center justify-between">
                <div className="flex bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-700 p-0.5">
                    <button 
                        onClick={() => setDeviceFilter('all')}
                        className={`p-1 rounded ${deviceFilter === 'all' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                        title="All Sizes"
                    >
                        <Layout size={14} />
                    </button>
                    <button 
                        onClick={() => setDeviceFilter('mobile')}
                        className={`p-1 rounded ${deviceFilter === 'mobile' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                        title="Mobile"
                    >
                        <Smartphone size={14} />
                    </button>
                    <button 
                        onClick={() => setDeviceFilter('tablet')}
                        className={`p-1 rounded ${deviceFilter === 'tablet' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                        title="Tablet"
                    >
                        <Tablet size={14} />
                    </button>
                    <button 
                        onClick={() => setDeviceFilter('desktop')}
                        className={`p-1 rounded ${deviceFilter === 'desktop' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                        title="Desktop"
                    >
                        <Monitor size={14} />
                    </button>
                </div>

                <button 
                    onClick={() => toggleAllCategories(isTemplate)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title={allExpanded ? "Collapse All" : "Expand All"}
                >
                    {allExpanded ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />}
                </button>
            </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header for the specific tab */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
            {activeTab === 'assets' && 'Project Assets'}
            {activeTab === 'components' && 'Component Library'}
            {activeTab === 'templates' && 'Screen Templates'}
          </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        
        {/* Assets Tab */}
        {activeTab === 'assets' && (
            <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> media</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={handleFileUpload} />
                </label>

                <div className="grid grid-cols-2 gap-3">
                    {project.assets && project.assets.map(asset => (
                        <div 
                            key={asset.id}
                            draggable
                            onDragStart={(e) => handleAssetDragStart(e, asset)}
                            className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                        >
                            {asset.type === 'video' ? (
                                <video src={asset.src} className="w-full h-full object-cover" />
                            ) : (
                                <img src={asset.src} alt={asset.name} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            <button 
                                onClick={() => deleteAsset(asset.id)}
                                className="absolute top-1 right-1 p-1 bg-white/90 dark:bg-black/70 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black"
                                title="Delete Asset"
                            >
                                <Trash2 size={12} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-1 bg-white/80 dark:bg-black/60 text-[9px] truncate px-2 text-gray-700 dark:text-gray-300">
                                {asset.name}
                            </div>
                        </div>
                    ))}
                    {(!project.assets || project.assets.length === 0) && (
                        <div className="col-span-2 py-8 text-center text-xs text-gray-400 dark:text-gray-500 italic">
                            No assets uploaded yet.
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div className="space-y-4">
            
            {renderToolbar(false)}

            {filteredComponentCategories.map((category) => (
              <div key={category.name} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleCategory(category.name, false)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">{category.name}</span>
                  {expandedCategories.includes(category.name) ? <ChevronDown size={14} className="text-gray-500"/> : <ChevronRight size={14} className="text-gray-500"/>}
                </button>
                
                {expandedCategories.includes(category.name) && (
                  <div className="p-3 bg-white dark:bg-gray-900 grid grid-cols-2 gap-3">
                     {category.items?.map((item, idx) => {
                        const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Box;
                        return (
                          <div
                            key={`${category.name}-${idx}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 cursor-grab active:cursor-grabbing transition-all group"
                          >
                            <Icon className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 mb-2 transition-colors" size={20} />
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300 text-center leading-tight">{item.label}</span>
                          </div>
                        );
                     })}
                  </div>
                )}
              </div>
            ))}
            {filteredComponentCategories.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs">
                    No components found matching your filters.
                </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
             
             {renderToolbar(true)}

             {templateCategoriesList.map((category) => {
                 const categoryTemplates = filteredTemplates.filter(t => t.category === category);
                 if (categoryTemplates.length === 0) return null;

                 return (
                    <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleCategory(category, true)}
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
        )}
      </div>
    </div>
  );
};
