
import React, { useState } from 'react';
import { Project, AppSettings, ExportConfig, GridConfig } from '../../types';
import { Smartphone, Tablet, Monitor, Plus, X, Maximize, Grid, Palette } from 'lucide-react';
import { IconPickerControl } from '../common/IconPickerControl';

interface ProjectMenuProps {
  project: Project;
  setProject: (p: Project) => void;
  appSettings: AppSettings;
  onExport: (config: Omit<ExportConfig, 'isOpen'>) => void;
}

const SUGGESTED_TAGS = ['E-commerce', 'SaaS', 'Finance', 'Education', 'Social', 'MVP', 'Portfolio', 'Health'];

export const ProjectMenu: React.FC<ProjectMenuProps> = ({ project, setProject, onExport }) => {
  const [tagInput, setTagInput] = useState('');

  const updateProjectMeta = (key: keyof Project, value: any) => {
      const updatedProject = { ...project, [key]: value, lastModified: Date.now() };
      setProject(updatedProject);
  };

  const updateViewport = (width: number, height: number) => {
    updateProjectMeta('viewportWidth', width);
    updateProjectMeta('viewportHeight', height);
  };

  const updateGrid = (updates: Partial<GridConfig>) => {
    updateProjectMeta('gridConfig', { ...project.gridConfig, ...updates });
  };

  const addTag = (tag: string) => {
      if (!tag.trim()) return;
      const currentTags = project.tags || [];
      if (!currentTags.includes(tag)) {
          updateProjectMeta('tags', [...currentTags, tag]);
      }
      setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
      const currentTags = project.tags || [];
      updateProjectMeta('tags', currentTags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              Project Info
          </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
          
          {/* Header Section: Icon & Name */}
          <div className="flex gap-4 items-start">
             <div className="shrink-0">
                <IconPickerControl 
                    label="" 
                    iconName={project.icon} 
                    onChange={(name) => updateProjectMeta('icon', name)}
                    onClear={() => updateProjectMeta('icon', undefined)}
                    variant="compact"
                />
             </div>
             <div className="flex-1 space-y-1 pt-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Project Name</label>
                <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProjectMeta('name', e.target.value)}
                    className="w-full text-xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-500 outline-none transition-colors text-gray-800 dark:text-white placeholder-gray-300"
                    placeholder="Untitled Project"
                />
             </div>
          </div>

          {/* Project Details */}
          <div className="space-y-6">
              <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span>ID: {project.id.slice(0,8)}...</span>
                  <span>Modified: {new Date(project.lastModified).toLocaleDateString()}</span>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Description</label>
                  <textarea
                      rows={3}
                      value={project.description || ''}
                      onChange={(e) => updateProjectMeta('description', e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all"
                      placeholder="Add project details..."
                  />
              </div>

              {/* Default Canvas Settings Moved Here */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Maximize size={12} /> Default Canvas Settings
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                      {(['mobile', 'tablet', 'desktop'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => {
                                updateProjectMeta('projectType', type);
                                if(type === 'mobile') updateViewport(375, 812);
                                if(type === 'tablet') updateViewport(768, 1024);
                                if(type === 'desktop') updateViewport(1280, 800);
                            }}
                            className={`flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all ${
                                (project.projectType || 'mobile') === type 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                                : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                            }`}
                          >
                              {type === 'mobile' && <Smartphone size={16} className="mb-1" />}
                              {type === 'tablet' && <Tablet size={16} className="mb-1" />}
                              {type === 'desktop' && <Monitor size={16} className="mb-1" />}
                              <span className="text-[10px] font-bold capitalize">{type}</span>
                          </button>
                      ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase">Def. Width</label>
                        <input type="number" value={project.viewportWidth} onChange={(e) => updateViewport(Number(e.target.value), project.viewportHeight)} className="w-full p-1.5 text-xs border rounded bg-white dark:bg-gray-700" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase">Def. Height</label>
                        <input type="number" value={project.viewportHeight} onChange={(e) => updateViewport(project.viewportWidth, Number(e.target.value))} className="w-full p-1.5 text-xs border rounded bg-white dark:bg-gray-700" />
                    </div>
                  </div>

                  <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                          <span className="flex items-center gap-1"><Grid size={10}/> Default Grid</span>
                          <input type="checkbox" checked={project.gridConfig.visible} onChange={e => updateGrid({ visible: e.target.checked })} className="w-3 h-3 text-indigo-600 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <input type="color" value={project.gridConfig.color} onChange={e => updateGrid({ color: e.target.value })} className="w-6 h-6 rounded cursor-pointer p-0" />
                        <input type="number" value={project.gridConfig.size} onChange={e => updateGrid({ size: Number(e.target.value) })} className="flex-1 p-1 text-[10px] border rounded bg-white dark:bg-gray-700" />
                      </div>
                  </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                      {(project.tags || []).map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-800">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="hover:text-red-500 p-0.5 rounded-full"><X size={12} /></button>
                          </span>
                      ))}
                  </div>
                  <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag(tagInput)}
                        placeholder="Add a tag..."
                        className="flex-1 min-w-0 p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 outline-none"
                      />
                      <button onClick={() => addTag(tagInput)} className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Plus size={20} /></button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
