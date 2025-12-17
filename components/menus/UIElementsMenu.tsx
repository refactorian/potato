
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, ChevronsUp, ChevronsDown, Eye, Layout, Smartphone, Tablet, Monitor, Pin } from 'lucide-react';
import { UI_ELEMENTS } from '../../data/ui_elements/index';
import { ScreenImage } from '../../types';

interface UIElementsMenuProps {
    onPreviewImage: (image: ScreenImage) => void;
    isPinned?: boolean;
    onTogglePin?: () => void;
}

type DeviceFilter = 'all' | 'mobile' | 'tablet' | 'desktop';

export const UIElementsMenu: React.FC<UIElementsMenuProps> = ({ onPreviewImage, isPinned, onTogglePin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('all');
  
  const categoriesList = useMemo(() => Array.from(new Set(UI_ELEMENTS.map(t => t.category))), []);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categoriesList);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
        prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
    );
  };

  const toggleAllCategories = () => {
    if (expandedCategories.length === categoriesList.length) {
        setExpandedCategories([]);
    } else {
        setExpandedCategories(categoriesList);
    }
  };

  const filteredImages = useMemo(() => {
      return UI_ELEMENTS.filter(t => {
          const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = deviceFilter === 'all' || t.screenType === deviceFilter;
          return matchesSearch && matchesType;
      });
  }, [searchQuery, deviceFilter]);

  const allExpanded = expandedCategories.length === categoriesList.length;

  return (
    <div className="flex flex-col h-full">
         <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                UI Elements
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

            {categoriesList.map((category) => {
                 const categoryImages = filteredImages.filter(t => t.category === category);
                 if (categoryImages.length === 0) return null;

                 return (
                    <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                        >
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">{category}</span>
                            {expandedCategories.includes(category) ? <ChevronDown size={14} className="text-gray-500"/> : <ChevronRight size={14} className="text-gray-500"/>}
                        </button>

                        {expandedCategories.includes(category) && (
                            <div className="p-3 bg-white dark:bg-gray-900 grid grid-cols-2 gap-3">
                                {categoryImages.map(image => (
                                    <div 
                                        key={image.id} 
                                        className="group relative border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer aspect-square"
                                        onClick={() => onPreviewImage(image)}
                                    >
                                        <img 
                                            src={image.src} 
                                            alt={image.name} 
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/70 px-2 py-1 rounded text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                <Eye size={10} /> Preview
                                            </div>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                            <div className="text-[10px] font-medium text-gray-800 dark:text-gray-100 truncate text-center">
                                                {image.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 );
             })}
             
             {filteredImages.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs">
                    No items found matching your filters.
                </div>
             )}
        </div>
    </div>
  );
};
