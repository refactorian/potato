
import React, { useState, useEffect } from 'react';
import { Project, ProjectTemplate, AppSettings } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { X, FilePlus, Copy, Upload, Layout } from 'lucide-react';
import { BlankProjectTab } from './CreateProjectModalTabs/BlankProjectTab';
import { TemplateTab } from './CreateProjectModalTabs/TemplateTab';
import { DuplicateTab } from './CreateProjectModalTabs/DuplicateTab';
import { ImportTab } from './CreateProjectModalTabs/ImportTab';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProject: Project | Project[]) => void;
  appSettings: AppSettings;
}

type Tab = 'blank' | 'template' | 'duplicate' | 'import';

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate, appSettings }) => {
  const [activeTab, setActiveTab] = useState<Tab>('blank');
  
  // -- Common State --
  const [projectName, setProjectName] = useState('New Project');

  // -- Blank Project State --
  const [description, setDescription] = useState('');
  const [viewportWidth, setViewportWidth] = useState(375);
  const [viewportHeight, setViewportHeight] = useState(812);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [gridVisible, setGridVisible] = useState(appSettings.defaultGridVisible);
  const [gridSnap, setGridSnap] = useState(appSettings.defaultSnapToGrid);
  const [gridSize, setGridSize] = useState(20);
  const [gridColor, setGridColor] = useState('#cbd5e1');

  // -- Template / Duplicate State --
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [existingProjects, setExistingProjects] = useState<{ id: string; name: string; lastModified: number; viewportWidth: number }[]>([]);
  const [selectedProjectIdToDuplicate, setSelectedProjectIdToDuplicate] = useState<string | null>(null);
  
  // -- Import State (Refactored for Multiple) --
  const [importedProjects, setImportedProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (isOpen) {
        // Reset state on open
        setProjectName('New Project');
        setDescription('');
        setViewportWidth(375);
        setViewportHeight(812);
        setBackgroundColor('#ffffff');
        setGridVisible(appSettings.defaultGridVisible);
        setGridSnap(appSettings.defaultSnapToGrid);
        setGridSize(20);
        setGridColor('#cbd5e1');

        setSelectedTemplate(null);
        setSelectedProjectIdToDuplicate(null);
        setImportedProjects([]);
        setActiveTab('blank');
        
        // Load existing projects for duplicate tab with viewport info for display
        try {
            const indexStr = localStorage.getItem('potato_projects_index');
            if (indexStr) {
                const list = JSON.parse(indexStr);
                // Enrich list with viewport data for display
                const enrichedList = list.map((meta: any) => {
                    try {
                        const fullData = localStorage.getItem(`potato_project_${meta.id}`);
                        if (fullData) {
                            const p = JSON.parse(fullData);
                            return { ...meta, viewportWidth: p.viewportWidth || 375 };
                        }
                    } catch (e) {}
                    return { ...meta, viewportWidth: 375 };
                });

                const sortedList = enrichedList.sort((a: any, b: any) => b.lastModified - a.lastModified);
                setExistingProjects(sortedList);
            }
        } catch (e) {
            console.error("Failed to load projects", e);
        }
    }
  }, [isOpen, appSettings]);

  if (!isOpen) return null;

  const handleCreate = () => {
      if (activeTab === 'blank') {
          // Fix: Added missing mandatory Screen properties to the initial screen
          const newProject: Project = {
              id: uuidv4(),
              name: projectName,
              description: description,
              lastModified: Date.now(),
              viewportWidth: viewportWidth,
              viewportHeight: viewportHeight,
              activeScreenId: 'screen-1',
              assets: [],
              screenGroups: [],
              gridConfig: { 
                  visible: gridVisible, 
                  size: gridSize, 
                  color: gridColor, 
                  snapToGrid: gridSnap 
              },
              screens: [{ 
                  id: 'screen-1', 
                  name: 'Home', 
                  backgroundColor: backgroundColor, 
                  elements: [],
                  viewportWidth: viewportWidth,
                  viewportHeight: viewportHeight,
                  gridConfig: { 
                      visible: gridVisible, 
                      size: gridSize, 
                      color: gridColor, 
                      snapToGrid: gridSnap 
                  },
              }]
          };
          onCreate(newProject);
          onClose();
      } else if (activeTab === 'template' && selectedTemplate) {
          const newProject: Project = {
              viewportWidth: 375, // Default if missing in template
              viewportHeight: 812, // Default if missing in template
              assets: [],
              screenGroups: [],
              gridConfig: { 
                  visible: true, 
                  size: 20, 
                  color: '#cbd5e1', 
                  snapToGrid: true 
              },
              ...selectedTemplate.projectData,
              id: uuidv4(),
              name: projectName !== 'New Project' ? projectName : selectedTemplate.name,
              description: selectedTemplate.description,
              lastModified: Date.now(),
              activeScreenId: selectedTemplate.projectData.screens[0]?.id || 'screen-1'
          } as Project;
          onCreate(newProject);
          onClose();
      } else if (activeTab === 'duplicate' && selectedProjectIdToDuplicate) {
          const stored = localStorage.getItem(`potato_project_${selectedProjectIdToDuplicate}`);
          if (stored) {
              const parsed = JSON.parse(stored);
              const newProject: Project = {
                  ...parsed,
                  id: uuidv4(),
                  name: projectName !== 'New Project' ? projectName : `${parsed.name} (Copy)`,
                  lastModified: Date.now()
              };
              onCreate(newProject);
              onClose();
          }
      } else if (activeTab === 'import' && importedProjects.length > 0) {
          // Process all valid imported projects
          // Assign new IDs to ensure no collision if re-importing the same file
          const processedProjects = importedProjects.map(p => ({
              ...p,
              id: uuidv4(),
              lastModified: Date.now()
          }));
          onCreate(processedProjects);
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl h-[700px] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create New Project</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 space-y-2 shrink-0">
                <button 
                    onClick={() => setActiveTab('blank')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeTab === 'blank' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                >
                    <FilePlus size={18} /> Blank Project
                </button>
                <button 
                    onClick={() => setActiveTab('template')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeTab === 'template' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                >
                    <Layout size={18} /> From Template
                </button>
                <button 
                    onClick={() => setActiveTab('duplicate')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeTab === 'duplicate' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                >
                    <Copy size={18} /> Duplicate Existing
                </button>
                <button 
                    onClick={() => setActiveTab('import')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeTab === 'import' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                >
                    <Upload size={18} /> Import JSON / ZIP
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-800 custom-scrollbar">
                
                {/* BLANK PROJECT */}
                {activeTab === 'blank' && (
                    <BlankProjectTab 
                        projectName={projectName} setProjectName={setProjectName}
                        description={description} setDescription={setDescription}
                        viewportWidth={viewportWidth} setViewportWidth={setViewportWidth}
                        viewportHeight={viewportHeight} setViewportHeight={setViewportHeight}
                        backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor}
                        gridVisible={gridVisible} setGridVisible={setGridVisible}
                        gridSnap={gridSnap} setGridSnap={setGridSnap}
                        gridSize={gridSize} setGridSize={setGridSize}
                        gridColor={gridColor} setGridColor={setGridColor}
                    />
                )}

                {/* TEMPLATE */}
                {activeTab === 'template' && (
                    <TemplateTab 
                        projectName={projectName} 
                        setProjectName={setProjectName}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                    />
                )}

                {/* DUPLICATE */}
                {activeTab === 'duplicate' && (
                    <DuplicateTab 
                        projectName={projectName}
                        setProjectName={setProjectName}
                        existingProjects={existingProjects}
                        selectedProjectIdToDuplicate={selectedProjectIdToDuplicate}
                        setSelectedProjectIdToDuplicate={setSelectedProjectIdToDuplicate}
                    />
                )}

                {/* IMPORT */}
                {activeTab === 'import' && (
                    <ImportTab 
                        setImportedProjects={setImportedProjects}
                    />
                )}

            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleCreate}
                disabled={
                    (activeTab === 'template' && !selectedTemplate) ||
                    (activeTab === 'duplicate' && !selectedProjectIdToDuplicate) ||
                    (activeTab === 'import' && importedProjects.length === 0) ||
                    (activeTab === 'blank' && !projectName.trim())
                }
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
            >
                {activeTab === 'import' && importedProjects.length > 1 ? `Create ${importedProjects.length} Projects` : 'Create Project'}
            </button>
        </div>
      </div>
    </div>
  );
};
