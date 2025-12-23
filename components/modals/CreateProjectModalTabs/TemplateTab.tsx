
import React, { useState, useMemo, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
/* Added ChevronRight to the lucide-react imports */
import { 
  Layout, CheckCircle2, Search, Tag as TagIcon, 
  ChevronDown, ChevronRight, Hash, Layers, Filter, Sparkles, X
} from 'lucide-react';
import { PROJECT_TEMPLATES } from '../../../data/projectTemplates';
import { ProjectTemplate } from '../../../types';

interface TemplateTabProps {
  projectName: string;
  setProjectName: (name: string) => void;
  selectedTemplate: ProjectTemplate | null;
  setSelectedTemplate: (template: ProjectTemplate | null) => void;
}

export const TemplateTab: React.FC<TemplateTabProps> = ({
  projectName, setProjectName,
  selectedTemplate, setSelectedTemplate
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(PROJECT_TEMPLATES.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredTemplates = useMemo(() => {
    return PROJECT_TEMPLATES.filter(t => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle clicking outside the category dropdown
  useEffect(() => {
    const closeDropdown = () => setIsCategoryOpen(false);
    if (isCategoryOpen) {
      window.addEventListener('click', closeDropdown);
    }
    return () => window.removeEventListener('click', closeDropdown);
  }, [isCategoryOpen]);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header Controls: Search + Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 shrink-0">
          <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search blueprints by name, tags, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm"
              />
              {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <X size={16} />
                  </button>
              )}
          </div>

          <div className="relative shrink-0 w-full sm:w-60">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsCategoryOpen(!isCategoryOpen); }}
                className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border transition-all text-sm font-bold ${
                    isCategoryOpen 
                    ? 'border-indigo-500 ring-4 ring-indigo-500/10 bg-white dark:bg-gray-800 text-indigo-600' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                  <div className="flex items-center gap-2 truncate">
                    <Filter size={16} className={activeCategory !== 'All' ? 'text-indigo-500' : 'text-gray-400'} />
                    <span className="truncate">{activeCategory}</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
                      {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setIsCategoryOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                                activeCategory === cat 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                              {cat}
                              {activeCategory === cat && <CheckCircle2 size={14} />}
                          </button>
                      ))}
                  </div>
              )}
          </div>
      </div>

      {/* Grid Browser */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {filteredTemplates.map(template => {
                    const Icon = (LucideIcons as any)[template.thumbnail] || Layout;
                    const isSelected = selectedTemplate?.id === template.id;
                    
                    return (
                        <div
                            key={template.id}
                            onClick={() => {
                                setSelectedTemplate(template);
                                setProjectName(template.name);
                            }}
                            className={`group relative flex flex-col p-6 rounded-[32px] border-2 transition-all cursor-pointer ${
                                isSelected 
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 ring-4 ring-indigo-500/5' 
                                : 'border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-850 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl hover:-translate-y-1'
                            }`}
                        >
                            <div className="flex items-start gap-6 mb-6">
                                <div className={`p-5 rounded-3xl transition-all duration-500 ${
                                    isSelected 
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 rotate-6 scale-110' 
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-500 group-hover:bg-white dark:group-hover:bg-gray-750 group-hover:rotate-3'
                                }`}>
                                    <Icon size={32} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                                            {template.category}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white truncate tracking-tight">{template.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                                        {template.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-800/50">
                                <div className="flex flex-wrap gap-1.5">
                                    {template.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-[9px] font-black text-gray-400 uppercase tracking-tighter border border-gray-100 dark:border-gray-700 transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                    {template.tags.length > 3 && <span className="text-[9px] font-black text-gray-400">+{template.tags.length - 3}</span>}
                                </div>
                                
                                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-indigo-600' : 'text-gray-300 group-hover:text-indigo-400'}`}>
                                    {isSelected ? 'Selected' : 'Preview'} 
                                    {isSelected ? <CheckCircle2 size={14} /> : <ChevronRight size={14} />}
                                </div>
                            </div>

                            {isSelected && (
                                <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full p-2 shadow-2xl shadow-indigo-600/40 animate-in zoom-in spin-in-12 duration-500">
                                    <Sparkles size={20} />
                                </div>
                            )}
                        </div>
                    );
                })}
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-32 text-gray-400 opacity-50 bg-gray-50 dark:bg-gray-900/30 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                    <Search size={40} strokeWidth={1.5} />
                  </div>
                  <p className="text-xl font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">No blueprints matched</p>
                  <p className="text-sm mt-2 font-medium">Try broadening your search or switching categories</p>
                  <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-8 px-6 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Clear all filters</button>
              </div>
          )}
      </div>

      {/* Selected Template Footer: Project Name Input */}
      {selectedTemplate && (
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom-6 duration-700 shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-indigo-600 dark:bg-indigo-600 p-6 rounded-[32px] shadow-2xl shadow-indigo-600/20 relative overflow-hidden group/footer">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                <div className="flex-1 w-full space-y-3 relative z-10">
                    <div className="flex items-center gap-2 px-1">
                        <Hash className="text-indigo-200" size={14} />
                        <label className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">Naming your Masterpiece</label>
                    </div>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Give your project a name..."
                        className="w-full px-6 py-4 bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl text-lg font-bold text-white placeholder-white/40 outline-none focus:bg-white focus:text-indigo-900 focus:placeholder-indigo-300 transition-all shadow-inner"
                        autoFocus
                    />
                </div>

                <div className="hidden sm:flex flex-col items-end gap-1 relative z-10">
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Base Structure</span>
                    <span className="text-sm font-bold text-white whitespace-nowrap">{selectedTemplate.name}</span>
                    <div className="mt-1 flex gap-1">
                        {selectedTemplate.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-[8px] px-1.5 py-0.5 bg-white/20 text-white rounded font-bold uppercase tracking-tight">#{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
