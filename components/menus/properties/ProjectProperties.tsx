
import React, { useState } from 'react';
import { Download, Trash2, FolderKanban, Calendar, Layout, Info, Settings2, ShieldAlert } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'info' | 'ops'>('info');

  const Label = ({ children }: { children?: React.ReactNode }) => (
    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-1.5 block px-1">
      {children}
    </label>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-in fade-in duration-300">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                <FolderKanban size={14} />
            </div>
            <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">Project Global</span>
        </div>
      </div>

      <div className="flex border-b border-gray-100 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-2.5 flex items-center justify-center transition-all border-b-2 ${activeTab === 'info' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-gray-400 border-transparent'}`} title="System Info">
              <Info size={18} />
          </button>
          <button onClick={() => setActiveTab('ops')} className={`flex-1 py-2.5 flex items-center justify-center transition-all border-b-2 ${activeTab === 'ops' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-gray-400 border-transparent'}`} title="Danger Zone">
              <ShieldAlert size={18} />
          </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === 'info' ? (
          <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                <h3 className="text-lg font-black text-indigo-950 dark:text-indigo-100 truncate mb-1.5">{project.name}</h3>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-300/60 leading-relaxed font-medium">
                    {project.description || 'System blueprint for this prototyping session.'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <Label>Last Compiled</Label>
                    <div className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-500"/> {new Date(project.lastModified).toLocaleString()}
                    </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <Label>Canvas Resolution</Label>
                    <div className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Layout size={14} className="text-indigo-500"/> {project.viewportWidth} x {project.viewportHeight} px
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-2 duration-200">
            <Label>Critical Operations</Label>
            <button onClick={onExport} className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] text-gray-800 dark:text-gray-200 hover:border-indigo-300 transition-all shadow-sm active:scale-[0.98]">
                <span>Backup JSON Package</span>
                <Download size={18} className="text-indigo-500" />
            </button>
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-4" />
            <button onClick={onDelete} className="w-full flex items-center justify-between p-3.5 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/40 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] text-red-600 dark:text-red-400 hover:bg-red-100 transition-all shadow-sm active:scale-[0.98]">
                <span>Destroy Project</span>
                <Trash2 size={18} />
            </button>
            <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed font-bold uppercase mt-2">Caution: This will purge all project assets and history.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center bg-gray-50 dark:bg-gray-850 shrink-0">
           <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Potato Design Engine v1.0</span>
      </div>
    </div>
  );
};
