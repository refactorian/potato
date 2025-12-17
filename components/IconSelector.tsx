
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search } from 'lucide-react';
import { ICON_NAMES } from '../data/icons';

interface IconSelectorProps {
  selectedIcon: string | null;
  onSelect: (iconName: string) => void;
}

const CATEGORIES: Record<string, string[]> = {
  'All': [],
  'Arrows': ['Arrow', 'Chevron', 'Corner', 'Move', 'Rotate'],
  'UI': ['Menu', 'Search', 'User', 'Home', 'Settings', 'Check', 'Plus', 'Minus', 'X', 'Trash', 'Edit', 'List', 'Grid'],
  'Media': ['Play', 'Pause', 'Video', 'Image', 'Camera', 'Mic', 'Speaker', 'Volume', 'Music', 'Film'],
  'Device': ['Smartphone', 'Tablet', 'Monitor', 'Laptop', 'Watch', 'Tv', 'Cpu', 'Database'],
  'Weather': ['Sun', 'Moon', 'Cloud', 'Wind', 'Rain'],
  'Social': ['Github', 'Twitter', 'Facebook', 'Instagram', 'Linkedin', 'Youtube', 'Globe', 'Share'],
};

export const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const getFilteredIcons = () => {
    let icons = ICON_NAMES;
    
    // Category Filter
    if (activeCategory !== 'All') {
        const keywords = CATEGORIES[activeCategory] || [];
        icons = icons.filter(name => keywords.some(k => name.includes(k)));
    }

    // Search Filter
    const term = searchTerm.trim().toLowerCase();
    if (term) {
        icons = icons.filter(name => name.toLowerCase().includes(term));
    }

    return icons;
  };

  const filteredIcons = getFilteredIcons();

  // Safe icon renderer
  const renderIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name];
    if (!Icon) return null;
    return <Icon size={20} />;
  };

  return (
    <div className="flex flex-col h-[300px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      
      {/* Header: Search & Filter */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <input 
            type="text"
            placeholder="Search icons..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
            {Object.keys(CATEGORIES).map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 text-[10px] font-medium rounded-full whitespace-nowrap transition-colors border ${
                        activeCategory === cat 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white dark:bg-gray-800">
        <div className="grid grid-cols-6 gap-2">
          {filteredIcons.map((name) => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className={`aspect-square flex items-center justify-center rounded-lg border transition-all hover:shadow-sm ${
                selectedIcon === name 
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 text-indigo-600 dark:text-indigo-300' 
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title={name}
            >
              {renderIcon(name)}
            </button>
          ))}
          {filteredIcons.length === 0 && (
            <div className="col-span-full py-10 text-center flex flex-col items-center justify-center text-gray-400">
              <Search size={24} className="mb-2 opacity-50" />
              <span className="text-xs">No icons found</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-[10px] text-gray-400">
        <span>Lucide Icons</span>
        <span>{filteredIcons.length} results</span>
      </div>
    </div>
  );
};
