
import React, { useState, useEffect } from 'react';
import { MonitorPlay, ZoomIn, ZoomOut, Moon, Sun, ChevronDown, Plus, Check, Folder, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Project } from '../types';

interface ToolbarProps {
  scale: number;
  setScale: (s: number) => void;
  isPreview: boolean;
  setIsPreview: (b: boolean) => void;
  project: Project;
  setProject: (p: Project) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  onOpenCreateModal: () => void;
}

interface ProjectMetadata {
    id: string;
    name: string;
    lastModified: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  scale,
  setScale,
  isPreview,
  setIsPreview,
  project,
  setProject,
  theme,
  setTheme,
  onOpenCreateModal
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [projectsList, setProjectsList] = useState<ProjectMetadata[]>([]);

  useEffect(() => {
    const loadProjects = () => {
       const str = localStorage.getItem('potato_projects_index');
       if (str) {
         try {
            const list = JSON.parse(str);
            setProjectsList(list.sort((a: any, b: any) => b.lastModified - a.lastModified));
         } catch(e) {
             console.error("Failed to parse project list", e);
         }
       }
    };
    loadProjects();
  }, [project.id, project.lastModified, isSwitcherOpen]); // Re-load when current project updates or menu opens

  useEffect(() => {
    const handleClickOutside = () => setIsSwitcherOpen(false);
    if (isSwitcherOpen) {
        window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isSwitcherOpen]);

  const switchProject = (id: string) => {
      if (id === project.id) {
          setIsSwitcherOpen(false);
          return;
      }
      const storedData = localStorage.getItem(`potato_project_${id}`);
      if (storedData) {
          try {
              const loadedProject: Project = JSON.parse(storedData);
              setProject(loadedProject);
          } catch (e) {
              alert("Failed to load project data.");
          }
      }
      setIsSwitcherOpen(false);
  };

  const ProjectIcon = project.icon && (LucideIcons as any)[project.icon] ? (LucideIcons as any)[project.icon] : null;

  return (
    <div className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50 transition-colors duration-200 shrink-0 relative">
      
      {/* Left Section: Branding & Project Switcher */}
      <div className="flex items-center gap-4">
        {/* Branding Logo */}
        <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-xl mr-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm overflow-hidden">
            {ProjectIcon ? <ProjectIcon size={20} /> : <span className="font-mono text-lg">P</span>}
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Project Switcher */}
        <div className="relative">
            <button 
                onClick={(e) => { e.stopPropagation(); setIsSwitcherOpen(!isSwitcherOpen); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                title="Switch Project"
            >
                <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-none">Project</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight max-w-[150px] truncate">{project.name}</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isSwitcherOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden flex flex-col">
                    <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
                        Recent Projects
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                        {projectsList.map(p => (
                            <button
                                key={p.id}
                                onClick={() => switchProject(p.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors ${p.id === project.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`p-1.5 rounded ${p.id === project.id ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                        <Folder size={14} />
                                    </div>
                                    <div className="truncate">
                                        <div className={`text-sm font-medium truncate ${p.id === project.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200'}`}>{p.name}</div>
                                        <div className="text-[10px] text-gray-400">Edited {new Date(p.lastModified).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                {p.id === project.id && <Check size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />}
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
                        <button 
                            onClick={() => { setIsSwitcherOpen(false); onOpenCreateModal(); }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
                        >
                            <Plus size={14} /> New Project
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Quick Create Action */}
        <button 
            onClick={onOpenCreateModal}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-colors flex items-center justify-center"
            title="Create New Project"
        >
            <Plus size={16} />
        </button>
      </div>

      {/* Right Section: Tools & Settings */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Toggle Theme"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
          <button onClick={() => setScale(Math.max(0.25, scale - 0.1))} className="hover:text-indigo-600 dark:hover:text-indigo-400 p-1">
             <ZoomOut size={16} />
          </button>
          <span className="w-12 text-center font-mono text-xs">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(Math.min(2, scale + 0.1))} className="hover:text-indigo-600 dark:hover:text-indigo-400 p-1">
             <ZoomIn size={16} />
          </button>
        </div>

        {/* Preview Button */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm ${
            isPreview 
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <MonitorPlay size={16} />
          {isPreview ? 'Edit Mode' : 'Preview'}
        </button>
      </div>
    </div>
  );
};
