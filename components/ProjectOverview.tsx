
import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { Project, LeftSidebarTab, Screen, ExportConfig, ScreenGroup } from '../types';
import { ElementRenderer } from '../canvas/ElementRenderer';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, MoreVertical, Edit2, Copy, Trash2, Lock, Unlock, Image as ImageIcon, List, LayoutGrid, Grid, Rows, Eye, EyeOff, ChevronDown, ChevronRight, FolderOpen, Filter } from 'lucide-react';
import { RenameModal } from './modals/RenameModal';
import { ConfirmationModal } from './modals/ConfirmationModal';

interface ProjectOverviewProps {
  project: Project;
  setProject: (p: Project) => void;
  setActiveTab: (tab: LeftSidebarTab) => void;
  onExport: (config: Omit<ExportConfig, 'isOpen'>) => void;
}

type ViewMode = 'list' | 'grid-sm' | 'grid-lg' | 'row';

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, setProject, setActiveTab, onExport }) => {
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); 
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  
  // Modal States
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean; id: string; currentName: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

  // Close menu on outside click
  useEffect(() => {
      const handleClick = () => setActiveMenu(null);
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleScreenClick = (screenId: string) => {
    setProject({ ...project, activeScreenId: screenId });
    setActiveTab('screens');
  };

  const handleAddScreen = (groupId?: string) => {
      const newScreen = {
          id: uuidv4(),
          name: `Screen ${(project.screens || []).length + 1}`,
          backgroundColor: '#ffffff',
          elements: [],
          groupId: groupId
      };
      setProject({ ...project, screens: [...project.screens, newScreen], activeScreenId: newScreen.id });
      setActiveTab('screens');
  };

  const toggleGroupCollapse = (groupId: string) => {
      setCollapsedGroups(prev => 
          prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
      );
  };

  // --- Filtering & Grouping Logic ---

  const { groupedScreens, ungroupedScreens } = useMemo(() => {
      const lowerSearch = search.toLowerCase();
      const allFiltered = project.screens.filter(s => s.name.toLowerCase().includes(lowerSearch));

      const grouped = (project.screenGroups || []).map(group => ({
          ...group,
          screens: allFiltered.filter(s => s.groupId === group.id)
      })).filter(g => g.screens.length > 0 || (search === '' && !g.parentId)); 

      const ungrouped = allFiltered.filter(s => !s.groupId);

      return { groupedScreens: grouped, ungroupedScreens: ungrouped };
  }, [project.screens, project.screenGroups, search]);


  /* --- Actions --- */

  const toggleLock = (e: React.MouseEvent, screenId: string) => {
      e.stopPropagation();
      const updatedScreens = project.screens.map(s => s.id === screenId ? { ...s, locked: !s.locked } : s);
      setProject({ ...project, screens: updatedScreens });
      setActiveMenu(null);
  };

  const toggleHidden = (e: React.MouseEvent, screenId: string) => {
      e.stopPropagation();
      const updatedScreens = project.screens.map(s => s.id === screenId ? { ...s, hidden: !s.hidden } : s);
      setProject({ ...project, screens: updatedScreens });
      setActiveMenu(null);
  };

  const openRename = (e: React.MouseEvent, screenId: string) => {
      e.stopPropagation();
      const screen = project.screens.find(s => s.id === screenId);
      if (screen) {
          setRenameModal({ isOpen: true, id: screenId, currentName: screen.name });
      }
      setActiveMenu(null);
  };

  const handleRename = (newName: string) => {
      if (renameModal) {
          const updatedScreens = project.screens.map(s => s.id === renameModal.id ? { ...s, name: newName } : s);
          setProject({ ...project, screens: updatedScreens });
          setRenameModal(null);
      }
  };

  const handleDuplicate = (e: React.MouseEvent, screenId: string) => {
      e.stopPropagation();
      const screen = project.screens.find(s => s.id === screenId);
      if (screen) {
          const newScreen: Screen = {
              ...JSON.parse(JSON.stringify(screen)),
              id: uuidv4(),
              name: `${screen.name} Copy`,
              elements: screen.elements.map(el => ({ ...el, id: uuidv4(), interactions: [] }))
          };
          setProject({ ...project, screens: [...project.screens, newScreen] });
      }
      setActiveMenu(null);
  };

  const handleExportScreen = (e: React.MouseEvent, screenId: string) => {
      e.stopPropagation();
      onExport({ type: 'screen', targetId: screenId });
      setActiveMenu(null);
  };

  const openDelete = (e: React.MouseEvent, screenId: string) => {
      e.stopPropagation();
      const screen = project.screens.find(s => s.id === screenId);
      if (screen) {
          setDeleteModal({ isOpen: true, id: screenId, name: screen.name });
      }
      setActiveMenu(null);
  };

  const handleDelete = () => {
      if (deleteModal) {
          if (project.screens.length <= 1) {
              alert("Cannot delete the only screen.");
              setDeleteModal(null);
              return;
          }
          const updatedScreens = project.screens.filter(s => s.id !== deleteModal.id);
          const activeId = project.activeScreenId === deleteModal.id ? updatedScreens[0].id : project.activeScreenId;
          
          setProject({ ...project, screens: updatedScreens, activeScreenId: activeId });
          setDeleteModal(null);
      }
  };

  // Helper to determine grid class
  const getGridClass = () => {
      switch(viewMode) {
          case 'list': return 'flex flex-col gap-3';
          case 'row': return 'flex flex-col gap-8';
          // Small Grid: 2 items per row
          case 'grid-sm': return 'grid grid-cols-1 md:grid-cols-2 gap-8';
          // Large Grid: 1 item per row (Maximum visibility)
          case 'grid-lg': return 'grid grid-cols-1 gap-12';
          default: return 'flex flex-col gap-2';
      }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-950 animate-in fade-in duration-300 overflow-hidden">
        
        {/* --- Top Header Area --- */}
        <div className="flex flex-col gap-6 px-8 py-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0 shadow-sm z-20">
            
            {/* Row 1: Project Identity & Primary Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        {project.name}
                        {project.projectType && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 uppercase tracking-wider border border-indigo-200 dark:border-indigo-500/30">
                                {project.projectType}
                            </span>
                        )}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{project.screens.length} Screens</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <span>Last modified {new Date(project.lastModified).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Row 2: Controls & Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search & Filter */}
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search screens..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    {/* Tags List */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-gray-700">
                            {project.tags.map(tag => (
                                <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* View Switcher */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`} title="List View"><List size={16} /></button>
                        <button onClick={() => setViewMode('grid-sm')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid-sm' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`} title="Small Grid (2 per row)"><LayoutGrid size={16} /></button>
                        <button onClick={() => setViewMode('grid-lg')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid-lg' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`} title="Large Grid (1 per row)"><Grid size={16} /></button>
                        <button onClick={() => setViewMode('row')} className={`p-1.5 rounded-md transition-all ${viewMode === 'row' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`} title="Rows"><Rows size={16} /></button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Content Area --- */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/50 dark:bg-gray-950">
            <div className="max-w-[1800px] mx-auto space-y-12 pb-20">
                
                {/* List Header (Only visible in List View) */}
                {viewMode === 'list' && (groupedScreens.length > 0 || ungroupedScreens.length > 0) && (
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 rounded-t-lg backdrop-blur-sm sticky top-0 z-10">
                        <div className="col-span-5">Screen Name</div>
                        <div className="col-span-3">Elements</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                )}

                {/* Render Groups */}
                {groupedScreens.map(groupInfo => (
                    <div key={groupInfo.id} className="space-y-6">
                        {/* Group Header */}
                        <div 
                            className="flex items-center gap-2 group cursor-pointer select-none"
                            onClick={() => toggleGroupCollapse(groupInfo.id)}
                        >
                            <div className="p-1.5 rounded bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 transition-colors">
                                {collapsedGroups.includes(groupInfo.id) ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                                {groupInfo.name}
                                <span className="text-xs font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                                    {groupInfo.screens.length}
                                </span>
                            </h3>
                            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 ml-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors" />
                        </div>

                        {/* Screens Grid */}
                        {!collapsedGroups.includes(groupInfo.id) && (
                            <div className={`${getGridClass()} animate-in fade-in slide-in-from-top-2 duration-300`}>
                                {groupInfo.screens.map(screen => (
                                    <ScreenCard 
                                        key={screen.id} 
                                        screen={screen} 
                                        viewportWidth={project.viewportWidth} 
                                        viewportHeight={project.viewportHeight}
                                        isActive={project.activeScreenId === screen.id}
                                        viewMode={viewMode}
                                        onClick={() => handleScreenClick(screen.id)}
                                        onMenuOpen={(e) => { e.stopPropagation(); setActiveMenu(screen.id); }}
                                        isMenuOpen={activeMenu === screen.id}
                                        onRename={(e) => openRename(e, screen.id)}
                                        onDuplicate={(e) => handleDuplicate(e, screen.id)}
                                        onExport={(e) => handleExportScreen(e, screen.id)}
                                        onDelete={(e) => openDelete(e, screen.id)}
                                        onLock={(e) => toggleLock(e, screen.id)}
                                        onToggleHidden={(e) => toggleHidden(e, screen.id)}
                                    />
                                ))}
                                <AddScreenCard viewMode={viewMode} onClick={() => handleAddScreen(groupInfo.id)} />
                            </div>
                        )}
                    </div>
                ))}

                {/* Render Ungrouped Screens */}
                {(ungroupedScreens.length > 0 || groupedScreens.length === 0) && (
                    <div className="space-y-6">
                        {groupedScreens.length > 0 && (
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 rounded bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                    <FolderOpen size={16} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Ungrouped Screens</h3>
                                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 ml-4" />
                            </div>
                        )}
                        
                        <div className={getGridClass()}>
                            {ungroupedScreens.map(screen => (
                                <ScreenCard 
                                    key={screen.id} 
                                    screen={screen} 
                                    viewportWidth={project.viewportWidth} 
                                    viewportHeight={project.viewportHeight}
                                    isActive={project.activeScreenId === screen.id}
                                    viewMode={viewMode}
                                    onClick={() => handleScreenClick(screen.id)}
                                    onMenuOpen={(e) => { e.stopPropagation(); setActiveMenu(screen.id); }}
                                    isMenuOpen={activeMenu === screen.id}
                                    onRename={(e) => openRename(e, screen.id)}
                                    onDuplicate={(e) => handleDuplicate(e, screen.id)}
                                    onExport={(e) => handleExportScreen(e, screen.id)}
                                    onDelete={(e) => openDelete(e, screen.id)}
                                    onLock={(e) => toggleLock(e, screen.id)}
                                    onToggleHidden={(e) => toggleHidden(e, screen.id)}
                                />
                            ))}
                            {/* Always show Add Card in Ungrouped section */}
                            <AddScreenCard viewMode={viewMode} onClick={() => handleAddScreen()} />
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Modals */}
        {renameModal && (
            <RenameModal 
                isOpen={renameModal.isOpen}
                title="Rename Screen"
                initialValue={renameModal.currentName}
                onClose={() => setRenameModal(null)}
                onSave={handleRename}
            />
        )}

        {deleteModal && (
            <ConfirmationModal 
                isOpen={deleteModal.isOpen}
                title="Delete Screen?"
                message={`Are you sure you want to delete "${deleteModal.name}"? This cannot be undone.`}
                onClose={() => setDeleteModal(null)}
                onConfirm={handleDelete}
            />
        )}
    </div>
  );
};

// --- Sub Components ---

const AddScreenCard = ({ viewMode, onClick }: { viewMode: ViewMode, onClick: () => void }) => {
    return (
        <button 
                onClick={onClick}
                className={`
                group transition-all
                ${viewMode === 'list' 
                    ? 'w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10' 
                    : ''}
                ${viewMode === 'row' 
                    ? 'w-full h-72 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10' 
                    : ''}
                ${(viewMode === 'grid-sm' || viewMode === 'grid-lg') 
                    ? 'flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all min-h-[400px] text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400' 
                    : ''}
                `}
        >
            <div className={`rounded-full border-2 border-current flex items-center justify-center transition-transform group-hover:scale-110 ${viewMode === 'list' ? 'w-5 h-5' : 'w-10 h-10'}`}>
                <Plus size={viewMode === 'list' ? 14 : 24} />
            </div>
            <span className="font-medium text-sm">Add New Screen</span>
        </button>
    )
}

interface ScreenCardProps {
    screen: Screen;
    viewportWidth: number;
    viewportHeight: number;
    isActive: boolean;
    viewMode: ViewMode;
    onClick: () => void;
    onMenuOpen: (e: React.MouseEvent) => void;
    isMenuOpen: boolean;
    onRename: (e: React.MouseEvent) => void;
    onDuplicate: (e: React.MouseEvent) => void;
    onExport: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    onLock: (e: React.MouseEvent) => void;
    onToggleHidden: (e: React.MouseEvent) => void;
}

const ScreenCard: React.FC<ScreenCardProps> = ({ 
    screen, viewportWidth, viewportHeight, isActive, viewMode, onClick, 
    onMenuOpen, isMenuOpen, onRename, onDuplicate, onExport, onDelete, onLock, onToggleHidden
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.1); // Initialize small to prevent zero-scale issues

    // Robust Scale Calculation using ResizeObserver
    useLayoutEffect(() => {
        if (viewMode === 'list') return;

        const updateScale = (entry: ResizeObserverEntry) => {
            const containerWidth = entry.contentRect.width;
            if (containerWidth > 0 && viewportWidth > 0) {
                // Calculate precise scale to fit width
                const newScale = containerWidth / viewportWidth;
                setScale(newScale);
            }
        };

        const element = containerRef.current;
        if (!element) return;

        const observer = new ResizeObserver((entries) => {
            // Use requestAnimationFrame to debounce and prevent loop limit errors
            window.requestAnimationFrame(() => {
                if (entries[0]) updateScale(entries[0]);
            });
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [viewMode, viewportWidth]);

    // Check ancestry for hidden state (Matches Canvas logic)
    const isElementVisible = (el: any, allElements: any[]): boolean => {
        if (el.hidden) return false;
        if (el.parentId) {
            const parent = allElements.find((p: any) => p.id === el.parentId);
            if (parent) return isElementVisible(parent, allElements);
        }
        return true;
    };

    // 1. LIST VIEW
    if (viewMode === 'list') {
        return (
            <div onClick={onClick} className={`grid grid-cols-12 gap-4 items-center px-6 py-4 bg-white dark:bg-gray-800 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-all shadow-sm hover:shadow ${isActive ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="col-span-5 flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <ImageIcon size={18} />
                    </div>
                    <span className={`font-semibold text-gray-800 dark:text-gray-100 truncate ${screen.hidden ? 'line-through opacity-50' : ''}`}>{screen.name}</span>
                </div>
                <div className="col-span-3 text-sm text-gray-500">{screen.elements.length} elements</div>
                <div className="col-span-2 flex flex-col gap-1">
                    {screen.locked ? <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium"><Lock size={12}/> Locked</span> : null}
                    {screen.hidden ? <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium"><EyeOff size={12}/> Hidden</span> : null}
                    {!screen.locked && !screen.hidden && <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium"><Unlock size={12}/> Active</span>}
                </div>
                <div className="col-span-2 flex justify-end relative">
                    <button onClick={onMenuOpen} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <MoreVertical size={18} />
                    </button>
                    {isMenuOpen && <ContextMenu onRename={onRename} onDuplicate={onDuplicate} onExport={onExport} onDelete={onDelete} onLock={onLock} onToggleHidden={onToggleHidden} locked={!!screen.locked} hidden={!!screen.hidden} />}
                </div>
            </div>
        );
    }

    // 2. ROW VIEW
    if (viewMode === 'row') {
        return (
            <div onClick={onClick} className={`flex h-72 bg-white dark:bg-gray-800 rounded-xl border overflow-hidden cursor-pointer hover:shadow-lg transition-all ${isActive ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-700'}`}>
                {/* Preview Section (Fixed Width) */}
                <div 
                    ref={containerRef} 
                    className="w-72 bg-gray-100 dark:bg-gray-900 relative overflow-hidden shrink-0 border-r border-gray-100 dark:border-gray-700"
                >
                     <div 
                        className={`absolute top-0 left-0 origin-top-left pointer-events-none ${screen.hidden ? 'opacity-20 grayscale' : ''}`}
                        style={{
                            width: viewportWidth,
                            height: viewportHeight,
                            transform: `scale(${scale})`,
                            backgroundColor: screen.backgroundColor
                        }}
                    >
                        {screen.elements.map(el => {
                            if (!isElementVisible(el, screen.elements)) return null;
                            return (
                                <div key={el.id} className="absolute" style={{ left: el.x, top: el.y, width: el.width, height: el.height, zIndex: el.zIndex }}>
                                    <ElementRenderer element={el} isPreview={true} />
                                </div>
                            );
                        })}
                    </div>
                    {screen.hidden && <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none"><EyeOff size={48} /></div>}
                </div>
                
                {/* Details Section */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className={`text-2xl font-bold text-gray-900 dark:text-white ${screen.hidden ? 'line-through opacity-50' : ''}`}>{screen.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-mono">ID: {screen.id.slice(0,8)}</p>
                            </div>
                            <div className="relative">
                                <button onClick={onMenuOpen} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                                    <MoreVertical size={24} />
                                </button>
                                {isMenuOpen && <ContextMenu onRename={onRename} onDuplicate={onDuplicate} onExport={onExport} onDelete={onDelete} onLock={onLock} onToggleHidden={onToggleHidden} locked={!!screen.locked} hidden={!!screen.hidden} />}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-6">
                        <span className="flex items-center gap-2"><LayoutGrid size={16}/> {screen.elements.length} Elements</span>
                        <span className="flex items-center gap-2"><ImageIcon size={16}/> {viewportWidth} x {viewportHeight}</span>
                        {screen.locked && <span className="flex items-center gap-1 text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded text-xs font-medium"><Lock size={12}/> Locked</span>}
                        {screen.hidden && <span className="flex items-center gap-1 text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-medium"><EyeOff size={12}/> Hidden</span>}
                    </div>
                </div>
            </div>
        )
    }

    // 3. GRID VIEWS (Large & Small)
    // Small: 2 cols, Large: 1 col
    const isSmall = viewMode === 'grid-sm';
    
    // Dynamic height based on aspect ratio
    const cardHeight = viewportHeight * scale;

    return (
        <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all duration-200 group/card ${isActive ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'}`}>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 overflow-hidden">
                    <h3 className={`font-bold text-gray-800 dark:text-gray-100 truncate ${isSmall ? 'text-xl' : 'text-2xl'} ${screen.hidden ? 'line-through opacity-50' : ''}`} title={screen.name}>{screen.name}</h3>
                    {screen.locked && <Lock size={14} className="text-red-400 shrink-0" />}
                    {screen.hidden && <EyeOff size={14} className="text-gray-400 shrink-0" />}
                </div>
                <div className="relative">
                    <button 
                        onClick={onMenuOpen}
                        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isMenuOpen ? 'bg-gray-100 dark:bg-gray-700 text-indigo-600' : 'text-gray-400 opacity-0 group-hover/card:opacity-100'}`}
                    >
                        <MoreVertical size={20} />
                    </button>
                    {isMenuOpen && <ContextMenu onRename={onRename} onDuplicate={onDuplicate} onExport={onExport} onDelete={onDelete} onLock={onLock} onToggleHidden={onToggleHidden} locked={!!screen.locked} hidden={!!screen.hidden} />}
                </div>
            </div>

            {/* Preview Body */}
            {/* Important: Wrapper needs explicit width for resize observer to work, height is controlled via style */}
            <div 
                className="relative bg-gray-100 dark:bg-gray-900 overflow-hidden cursor-pointer group/preview w-full"
                onClick={onClick}
                ref={containerRef} 
                style={{ height: cardHeight > 0 ? cardHeight : '300px' }} 
            >
                <div 
                    className={`absolute top-0 left-0 origin-top-left pointer-events-none transition-opacity ${screen.hidden ? 'opacity-20 grayscale' : ''}`}
                    style={{
                        width: viewportWidth,
                        height: viewportHeight,
                        transform: `scale(${scale})`,
                        backgroundColor: screen.backgroundColor,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}
                >
                    {screen.elements.map(el => {
                        if (!isElementVisible(el, screen.elements)) return null;
                        return (
                            <div key={el.id} className="absolute" style={{ left: el.x, top: el.y, width: el.width, height: el.height, zIndex: el.zIndex }}>
                                <ElementRenderer element={el} isPreview={true} />
                            </div>
                        );
                    })}
                </div>
                {screen.hidden && <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none"><EyeOff size={64} /></div>}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-indigo-900/0 group-hover/preview:bg-indigo-900/10 transition-all flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover/preview:opacity-100">
                    <div className="transform translate-y-4 group-hover/preview:translate-y-0 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-xl text-indigo-600 dark:text-indigo-400 text-sm font-bold px-6 py-3 border border-white/20">
                        Click to Edit
                    </div>
                </div>
            </div>
            
            {/* Footer Stats */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 flex justify-between items-center rounded-b-2xl px-5 py-3 text-xs uppercase font-medium tracking-wide">
               <span>{screen.elements.length} Elements</span>
               <span>{viewportWidth} x {viewportHeight}</span>
            </div>
        </div>
    );
};

// Reusable Context Menu
const ContextMenu = ({ onRename, onDuplicate, onExport, onDelete, onLock, onToggleHidden, locked, hidden }: any) => (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
        <button onClick={onRename} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
            <Edit2 size={16} /> Rename
        </button>
        <button onClick={onLock} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
            {locked ? <><Unlock size={16} /> Unlock</> : <><Lock size={16} /> Lock</>}
        </button>
        <button onClick={onToggleHidden} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
            {hidden ? <><Eye size={16} /> Show</> : <><EyeOff size={16} /> Hide</>}
        </button>
        <button onClick={onDuplicate} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
            <Copy size={16} /> Duplicate
        </button>
        <button onClick={onExport} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
            <ImageIcon size={16} /> Export Image
        </button>
        <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
        <button onClick={onDelete} className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
            <Trash2 size={16} /> Delete
        </button>
    </div>
);
