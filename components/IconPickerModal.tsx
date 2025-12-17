
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as LucideIcons from 'lucide-react';
import { X, Search, Shuffle } from 'lucide-react';
import { ICON_NAMES } from '../data/icons';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All', keywords: [] },
  { id: 'interface', label: 'Interface', keywords: ['menu', 'home', 'settings', 'user', 'bell', 'search', 'check', 'plus', 'x', 'trash', 'edit', 'filter', 'list', 'grid', 'more', 'loader', 'toggle', 'mouse', 'keyboard', 'login', 'logout'] },
  { id: 'arrows', label: 'Arrows', keywords: ['arrow', 'chevron', 'caret', 'corner', 'move', 'refresh', 'rotate', 'undo', 'redo', 'maximize', 'minimize', 'expand', 'shrink'] },
  { id: 'communication', label: 'Communication', keywords: ['mail', 'message', 'chat', 'phone', 'send', 'share', 'link', 'at-sign', 'inbox', 'rss', 'wifi'] },
  { id: 'media', label: 'Media', keywords: ['image', 'video', 'camera', 'music', 'play', 'pause', 'mic', 'volume', 'film', 'cast', 'headphones', 'speaker', 'radio', 'tv'] },
  { id: 'social', label: 'Brands & Social', keywords: ['facebook', 'twitter', 'instagram', 'github', 'linkedin', 'youtube', 'twitch', 'chrome', 'slack', 'dribbble', 'figma', 'gitlab', 'codepen'] },
  { id: 'devices', label: 'Devices', keywords: ['monitor', 'smartphone', 'tablet', 'laptop', 'watch', 'battery', 'cpu', 'database', 'server', 'hard-drive', 'printer'] },
  { id: 'files', label: 'Files', keywords: ['file', 'folder', 'save', 'upload', 'download', 'archive', 'copy', 'clipboard', 'paperclip', 'book', 'bookmark'] },
  { id: 'editor', label: 'Editor', keywords: ['align', 'bold', 'italic', 'type', 'link', 'code', 'quote', 'list', 'indent', 'outdent', 'underline', 'strikethrough'] },
  { id: 'commerce', label: 'Commerce', keywords: ['shopping', 'cart', 'credit', 'card', 'dollar', 'tag', 'gift', 'percent', 'wallet', 'bank', 'coins', 'currency'] },
  { id: 'time', label: 'Time & Date', keywords: ['clock', 'calendar', 'timer', 'watch', 'history', 'alarm', 'hourglass'] },
  { id: 'location', label: 'Map & Location', keywords: ['map', 'pin', 'globe', 'compass', 'navigation', 'flag', 'locate', 'route', 'landmark'] },
  { id: 'data', label: 'Data & Charts', keywords: ['chart', 'graph', 'activity', 'bar-chart', 'pie-chart', 'trending', 'database', 'table'] },
  { id: 'security', label: 'Security', keywords: ['lock', 'unlock', 'shield', 'key', 'eye', 'fingerprint'] },
  { id: 'weather', label: 'Weather', keywords: ['sun', 'moon', 'cloud', 'rain', 'wind', 'snow', 'thermometer'] },
  { id: 'health', label: 'Health', keywords: ['heart', 'activity', 'pulse', 'thermometer', 'pill', 'stethoscope'] },
  { id: 'shapes', label: 'Shapes', keywords: ['circle', 'square', 'triangle', 'octagon', 'star', 'hexagon', 'diamond'] }
];

const BATCH_SIZE = 100;

export const IconPickerModal: React.FC<IconPickerModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(BATCH_SIZE);
  const [mounted, setMounted] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Ensure we are mounted before using Portal (Next.js hydration safety)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        setSearchTerm('');
        setActiveCategory('all');
        setDisplayLimit(BATCH_SIZE);
        setHoveredIcon(null);
    }
  }, [isOpen]);

  // Auto-scroll to top when category or search changes
  useEffect(() => {
      if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
      }
  }, [activeCategory, searchTerm]);

  // Filtering Logic with Relevance Sorting
  const filteredIcons = useMemo(() => {
    // 1. Deduplicate source icons immediately to prevent duplicates in rendering
    let icons = Array.from(new Set(ICON_NAMES));
    
    const term = searchTerm.trim().toLowerCase();

    if (term) {
        // Global Search with relevance sorting
        let matches = icons.filter(name => name.toLowerCase().includes(term));
        matches.sort((a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();
            
            // 1. Exact match
            if (aLower === term && bLower !== term) return -1;
            if (bLower === term && aLower !== term) return 1;
            
            // 2. Starts with
            const aStarts = aLower.startsWith(term);
            const bStarts = bLower.startsWith(term);
            if (aStarts && !bStarts) return -1;
            if (bStarts && !aStarts) return 1;
            
            // 3. Length (shorter names often more relevant/generic)
            return a.length - b.length;
        });
        return matches;
    }

    if (activeCategory !== 'all') {
        const category = CATEGORIES.find(c => c.id === activeCategory);
        if (category) {
            // Filter by keywords
            icons = icons.filter(name => {
                const lowerName = name.toLowerCase();
                return category.keywords.some(k => lowerName.includes(k));
            });
            // Sort by length to bring simpler/base icons to the top (e.g., 'User' before 'UserCheck')
            icons.sort((a, b) => a.length - b.length);
        }
    }

    return icons;
  }, [searchTerm, activeCategory]);

  const displayedIcons = useMemo(() => {
      return filteredIcons.slice(0, displayLimit);
  }, [filteredIcons, displayLimit]);

  // Infinite Scroll Handler
  const handleScroll = () => {
      if (scrollContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
          // If scrolled near bottom
          if (scrollTop + clientHeight >= scrollHeight - 200) {
              if (displayLimit < filteredIcons.length) {
                  setDisplayLimit(prev => prev + BATCH_SIZE);
              }
          }
      }
  };

  const handleCategoryClick = (id: string) => {
      setActiveCategory(id);
      setSearchTerm(''); // Clear search when switching categories
      setDisplayLimit(BATCH_SIZE); // Reset limit to ensure infinite scroll starts fresh
  };

  const handleRandomSelect = () => {
      if (ICON_NAMES.length > 0) {
          const randomIndex = Math.floor(Math.random() * ICON_NAMES.length);
          onSelect(ICON_NAMES[randomIndex]);
          onClose();
      }
  };

  // Prevent rendering if not open or not mounted
  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              Select Icon
          </h3>
          <div className="flex items-center gap-2">
              <button
                  onClick={handleRandomSelect}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                  title="Pick a random icon"
              >
                  <Shuffle size={14} />
                  Random
              </button>
              <button 
                  onClick={onClose} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                  <X size={20} />
              </button>
          </div>
        </div>
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 space-y-4 shrink-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            <input 
              type="text"
              placeholder="Search icons (e.g. 'user', 'arrow', 'calendar')..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDisplayLimit(BATCH_SIZE);
              }}
              autoFocus
            />
            {searchTerm && (
                <button 
                    onClick={() => {
                        setSearchTerm('');
                        setDisplayLimit(BATCH_SIZE);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                >
                    <X size={14} />
                </button>
            )}
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                        activeCategory === cat.id && !searchTerm
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-300'
                    }`}
                >
                    {cat.label}
                </button>
            ))}
          </div>
        </div>

        {/* Icon Grid */}
        <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-gray-900 min-h-0"
            onScroll={handleScroll}
        >
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
            {displayedIcons.map((name) => {
              const IconComponent = (LucideIcons as any)[name];
              if (!IconComponent) return null;

              return (
                <button
                  key={name}
                  onClick={() => { onSelect(name); onClose(); }}
                  onMouseEnter={() => setHoveredIcon(name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className="aspect-square flex flex-col items-center justify-center p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-700 border border-transparent transition-all gap-2 group text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  title={name}
                >
                  <IconComponent size={24} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
                </button>
              );
            })}
            
            {filteredIcons.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                    <Search size={48} className="mb-4 opacity-20"/>
                    <p className="text-sm">No icons found for "{searchTerm}"</p>
                    <button onClick={() => setSearchTerm('')} className="mt-4 text-xs text-indigo-500 hover:underline">Clear Search</button>
                </div>
            )}
          </div>
          
          {/* Loading Indicator for Infinite Scroll */}
          {filteredIcons.length > displayLimit && (
              <div className="py-4 flex justify-center">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin opacity-50"></div>
              </div>
          )}
        </div>

        {/* Footer Info Bar */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 shrink-0">
            <div className="font-mono">
                {hoveredIcon ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{hoveredIcon}</span>
                ) : (
                    <span>{filteredIcons.length} icons available</span>
                )}
            </div>
            <div>
               {activeCategory !== 'all' && <span className="opacity-70 capitalize">{CATEGORIES.find(c=>c.id===activeCategory)?.label}</span>}
            </div>
        </div>
        
      </div>
    </div>,
    document.body
  );
};
