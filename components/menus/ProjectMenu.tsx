
import React, { useState } from 'react';
import { Project, AppSettings, ExportConfig } from '../../types';
import { Smartphone, Tablet, Monitor, Plus, X } from 'lucide-react';
import { IconPickerControl } from '../common/IconPickerControl';

interface ProjectMenuProps {
  project: Project;
  setProject: (p: Project) => void;
  appSettings: AppSettings;
  onExport: (config: Omit<ExportConfig, 'isOpen'>) => void;
}

const SUGGESTED_TAGS = ['E-commerce', 'SaaS', 'Finance', 'Education', 'Social', 'MVP', 'Portfolio', 'Health'];

export const ProjectMenu: React.FC<ProjectMenuProps> = ({ project, setProject }) => {
  const [tagInput, setTagInput] = useState('');

  const updateProjectMeta = (key: keyof Project, value: any) => {
      const updatedProject = { ...project, [key]: value, lastModified: Date.now() };
      setProject(updatedProject);
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

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
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

          {/* Metadata Editing */}
          <div className="space-y-6">
              
              {/* ID & Details */}
              <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span>ID: {project.id.slice(0,8)}...</span>
                  <span>Modified: {new Date(project.lastModified).toLocaleDateString()}</span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Description</label>
                  <textarea
                      rows={4}
                      value={project.description || ''}
                      onChange={(e) => updateProjectMeta('description', e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all"
                      placeholder="Add project details..."
                  />
              </div>

              {/* Project Type */}
              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Target Device</label>
                  <div className="grid grid-cols-3 gap-2">
                      {(['mobile', 'tablet', 'desktop'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => updateProjectMeta('projectType', type)}
                            className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 transition-all group ${
                                (project.projectType || 'mobile') === type 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                                : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                              {type === 'mobile' && <Smartphone size={20} className="mb-1" />}
                              {type === 'tablet' && <Tablet size={20} className="mb-1" />}
                              {type === 'desktop' && <Monitor size={20} className="mb-1" />}
                              <span className="text-[10px] font-bold capitalize">{type}</span>
                          </button>
                      ))}
                  </div>
              </div>

              {/* Project Tags */}
              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Tags</label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                      {(project.tags || []).map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-800">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="hover:text-red-500 p-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"><X size={12} /></button>
                          </span>
                      ))}
                  </div>

                  <div className="flex gap-2 w-full">
                      <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag(tagInput)}
                        placeholder="Add a tag..."
                        className="flex-1 min-w-0 p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 outline-none"
                      />
                      <button 
                        onClick={() => addTag(tagInput)}
                        className="shrink-0 p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 transition-colors"
                      >
                          <Plus size={20} />
                      </button>
                  </div>

                  {/* Suggestions */}
                  <div className="pt-2">
                      <div className="text-[10px] text-gray-400 mb-1.5 uppercase font-bold">Suggestions</div>
                      <div className="flex flex-wrap gap-1.5">
                          {SUGGESTED_TAGS.filter(t => !(project.tags || []).includes(t)).map(tag => (
                              <button 
                                key={tag}
                                onClick={() => addTag(tag)}
                                className="px-2 py-1 rounded text-[10px] bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 hover:border-gray-300 transition-colors"
                              >
                                  {tag}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
