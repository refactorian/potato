
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Layout, CheckCircle2 } from 'lucide-react';
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
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Choose a Template</h3>

        <div className="grid grid-cols-2 gap-4">
          {PROJECT_TEMPLATES.map(template => {
            const Icon = (LucideIcons as any)[template.thumbnail || 'Layout'] || Layout;
            const isSelected = selectedTemplate?.id === template.id;
            return (
              <div
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setProjectName(template.name);
                }}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isSelected ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{template.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{template.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {selectedTemplate && (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      )}
    </div>
  );
};
