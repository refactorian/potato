
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
                setExistingProjects(enrichedList);
            }
        } catch (e) {
            console.error("Failed to load projects", e);
        }
    }
  }, [isOpen, appSettings]);

  if (!isOpen) return null;

  const handleCreate = () => {
      if (activeTab === 'blank') {
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
              viewportWidth: 375,
              viewportHeight: 812,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-[6px] p-4 md:p-6 animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-gray-850 rounded-[40px] shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col animate-in zoom-in-95 duration-200"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-850 shrink-0">
          <div>
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Getting Started</h3>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none">New Project</h2>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-all active:scale-90 border border-gray-100 dark:border-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Sidebar Navigation */}
            <div className="w-20 md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-4 md:p-5 space-y-3 shrink-0 overflow-y-auto">
                <button 
                    onClick={() => setActiveTab('blank')}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all shadow-sm ${activeTab === 'blank' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-100 dark:border-gray-700'}`}
                >
                    <FilePlus size={22} className="shrink-0" /> <span className="hidden md:inline font-black uppercase text-[11px] tracking-widest">Blank Slate</span>
                </button>
                <button 
                    onClick={() => setActiveTab('template')}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all shadow-sm ${activeTab === 'template' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-100 dark:border-gray-700'}`}
                >
                    <Layout size={22} className="shrink-0" /> <span className="hidden md:inline font-black uppercase text-[11px] tracking-widest">Blueprint Gallery</span>
                </button>
                <button 
                    onClick={() => setActiveTab('duplicate')}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all shadow-sm ${activeTab === 'duplicate' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-100 dark:border-gray-700'}`}
                >
                    <Copy size={22} className="shrink-0" /> <span className="hidden md:inline font-black uppercase text-[11px] tracking-widest">Clone Existing</span>
                </button>
                <button 
                    onClick={() => setActiveTab('import')}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all shadow-sm ${activeTab === 'import' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-100 dark:border-gray-700'}`}
                >
                    <Upload size={22} className="shrink-0" /> <span className="hidden md:inline font-black uppercase text-[11px] tracking-widest">Import Package</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white dark:bg-gray-850 custom-scrollbar min-h-0">
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

                {activeTab === 'template' && (
                    <TemplateTab 
                        projectName={projectName} 
                        setProjectName={setProjectName}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                    />
                )}

                {activeTab === 'duplicate' && (
                    <DuplicateTab 
                        projectName={projectName}
                        setProjectName={setProjectName}
                        existingProjects={existingProjects}
                        selectedProjectIdToDuplicate={selectedProjectIdToDuplicate}
                        setSelectedProjectIdToDuplicate={setSelectedProjectIdToDuplicate}
                    />
                )}

                {activeTab === 'import' && (
                    <ImportTab 
                        setImportedProjects={setImportedProjects}
                    />
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-end gap-4 shrink-0">
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all border border-transparent"
            >
                Discard
            </button>
            <button 
                onClick={handleCreate}
                disabled={
                    (activeTab === 'template' && !selectedTemplate) ||
                    (activeTab === 'duplicate' && !selectedProjectIdToDuplicate) ||
                    (activeTab === 'import' && importedProjects.length === 0) ||
                    (activeTab === 'blank' && !projectName.trim())
                }
                className="px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-indigo-600/30 transition-all border-2 border-indigo-500 active:scale-95"
            >
                {activeTab === 'import' && importedProjects.length > 1 ? `Import ${importedProjects.length} Items` : 'Launch Project'}
            </button>
        </div>
      </div>
    </div>
  );
};
