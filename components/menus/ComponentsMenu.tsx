
import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, ChevronDown, ChevronRight, Layout, Smartphone, Tablet, Monitor, ChevronsUp, ChevronsDown, Pin } from 'lucide-react';
import { LIBRARY_CATEGORIES } from '../../data/components';
import { LibraryItem } from '../../types';

type DeviceFilter = 'all' | 'mobile' | 'tablet' | 'desktop';

interface ComponentsMenuProps {
    isPinned?: boolean;
    onTogglePin?: () => void;
}

export const ComponentsMenu: React.FC<ComponentsMenuProps> = ({ isPinned, onTogglePin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('mobile');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    LIBRARY_CATEGORIES ? LIBRARY_CATEGORIES.map(c => c.name) : []
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
        prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
    );
  };

  const toggleAllCategories = () => {
    const allComponentCats = LIBRARY_CATEGORIES.map(c => c.name);
    if (expandedCategories.length === allComponentCats.length) {
        setExpandedCategories([]);
    } else {
        setExpandedCategories(allComponentCats);
    }
  };

  const matchesDevice = (width: number) => {
      if (deviceFilter === 'all') return true;
      if (deviceFilter === 'mobile') return width <= 480;
      if (deviceFilter === 'tablet') return width > 480 && width <= 1024;
      if (deviceFilter === 'desktop') return width > 1024;
      return true;
  };

  const filteredComponentCategories = useMemo(() => {
    return LIBRARY_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
            const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = matchesDevice(item.defaultWidth);
            return matchesSearch && matchesType;
        })
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery, deviceFilter]);

  const handleDragStart = (e: React.DragEvent, item: LibraryItem) => {
    const dragData = JSON.stringify(item);
    e.dataTransfer.setData('componentData', dragData);
  };

  const allExpanded = expandedCategories.length === LIBRARY_CATEGORIES.length;

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                Component Library
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

            {filteredComponentCategories.map((category) => (
              <div key={category.name} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleCategory(category.name)}
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
    </div>
  );
};
