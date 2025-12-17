
import React from 'react';
import { Download, Trash2, FolderKanban, Calendar, Layout } from 'lucide-react';
// Fix: Import Project type from types.ts instead of assuming it's in lucide-react
import { Project } from '../../../types';

interface ProjectPropertiesProps {
  project: Project;
  onExport: () => void;
  onDelete: () => void;
}

export const ProjectProperties: React.FC<ProjectPropertiesProps> = ({
  project,
  onExport,
  onDelete,
}) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Project Actions</div>
        <FolderKanban className="text-gray-400" size={16} />
      </div>
      
      <div className="flex-1 p-4 space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200 truncate mb-1">{project.name}</h3>
            <p className="text-xs text-indigo-700/70 dark:text-indigo-300/50 line-clamp-2 leading-relaxed">
              {project.description || 'No description provided for this project.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Modified</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <Calendar size={12}/> {new Date(project.lastModified).toLocaleDateString()}
                </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Canvas</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                    <Layout size={12}/> {project.viewportWidth} x {project.viewportHeight}
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase">Management</div>
          <button 
            onClick={onExport}
            className="w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors font-semibold shadow-sm"
          >
            <Download size={18} /> Export Project Bundle
          </button>
          <button 
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors font-semibold shadow-sm"
          >
            <Trash2 size={18} /> Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};
