
import React, { useState, useEffect } from 'react';
import { Project, ProjectTemplate, AppSettings } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { X, FilePlus, Copy, Upload, Layout, Sparkles } from 'lucide-react';
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
        
        // Load existing projects for duplicate tab
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
                setExistingProjects(enrichedList.sort((a: any, b: any) => b.lastModified - a.lastModified));
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
              gridConfig: { visible: gridVisible, size: gridSize, color: gridColor, snapToGrid: gridSnap },
              screens: [{ 
                  id: 'screen-1', 
                  name: 'Home', 
                  backgroundColor: backgroundColor, 
                  elements: [],
                  viewportWidth: viewportWidth,
                  viewportHeight: viewportHeight,
                  gridConfig: { visible: gridVisible, size: gridSize, color: gridColor, snapToGrid: gridSnap },
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
              gridConfig: { visible: true, size: 20, color: '#cbd5e1', snapToGrid: true },
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

  const navItems = [
    { id: 'blank', label: 'Blank Slate', icon: FilePlus },
    { id: 'template', label: 'Blueprints', icon: Layout },
    { id: 'duplicate', label: 'Clone', icon: Copy },
    { id: 'import', label: 'Import', icon: Upload },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col animate-in zoom-in-95 duration-200"
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Header Section */}
        <div className="p-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Create New Project</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors active:scale-90">
              <X size={20} />
            </button>
          </div>

          {/* Top Horizontal Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-850 rounded-2xl gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200 dark:border-gray-600' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <item.icon size={14} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
            <div className="max-w-3xl mx-auto">
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
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Potato Design Engine v1.0</p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20 transition-all active:scale-95 border-b-4 border-indigo-800"
                >
                    {activeTab === 'import' && importedProjects.length > 1 ? `Import ${importedProjects.length} Items` : 'Get Started'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
