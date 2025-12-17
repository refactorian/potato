
import React, { useState, useEffect } from 'react';
import { Project, ProjectTemplate, AppSettings } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { PROJECT_TEMPLATES } from '../../data/projectTemplates';
import { 
    X, FilePlus, Copy, Upload, Layout, FileText, CheckCircle2, 
    Grid, Palette, Maximize
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProject: Project) => void;
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
  const [importedProject, setImportedProject] = useState<Project | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

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
        setImportedProject(null);
        setImportError(null);
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
      let newProject: Project | null = null;

      if (activeTab === 'blank') {
          newProject = {
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
              screens: [{ id: 'screen-1', name: 'Home', backgroundColor: backgroundColor, elements: [] }]
          };
      } else if (activeTab === 'template' && selectedTemplate) {
          newProject = {
              ...selectedTemplate.projectData,
              id: uuidv4(),
              name: projectName !== 'New Project' ? projectName : selectedTemplate.name,
              description: selectedTemplate.description,
              lastModified: Date.now(),
              activeScreenId: selectedTemplate.projectData.screens[0]?.id || 'screen-1'
          };
      } else if (activeTab === 'duplicate' && selectedProjectIdToDuplicate) {
          const stored = localStorage.getItem(`potato_project_${selectedProjectIdToDuplicate}`);
          if (stored) {
              const parsed = JSON.parse(stored);
              newProject = {
                  ...parsed,
                  id: uuidv4(),
                  name: projectName !== 'New Project' ? projectName : `${parsed.name} (Copy)`,
                  lastModified: Date.now()
              };
          }
      } else if (activeTab === 'import' && importedProject) {
          newProject = {
              ...importedProject,
              id: uuidv4(),
              name: projectName !== 'New Project' ? projectName : importedProject.name,
              lastModified: Date.now()
          };
      }

      if (newProject) {
          onCreate(newProject);
          onClose();
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = event.target?.result as string;
              const project: Project = JSON.parse(json);
              if (!project.screens) throw new Error("Invalid format");
              setImportedProject(project);
              setProjectName(`${project.name} (Imported)`);
              setImportError(null);
          } catch (err) {
              setImportError("Invalid Project JSON file.");
              setImportedProject(null);
          }
      };
      reader.readAsText(file);
  };

  // Helper to update viewport presets
  const setPreset = (w: number, h: number) => {
      setViewportWidth(w);
      setViewportHeight(h);
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
                    <Upload size={18} /> Import JSON
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-800 custom-scrollbar">
                
                {/* BLANK PROJECT */}
                {activeTab === 'blank' && (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Project Details</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Configure the basic settings for your new prototype.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* General Info */}
                            <div className="space-y-4 col-span-full">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                                    <input 
                                        type="text" 
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Enter project name..."
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                                    <textarea 
                                        rows={2}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        placeholder="Brief description of the project..."
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-gray-200 dark:bg-gray-700 col-span-full" />

                            {/* Canvas Settings */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Maximize size={16}/> Viewport Size</h4>
                                <div className="flex gap-2 mb-2">
                                    <button type="button" onClick={() => setPreset(375, 812)} className={`flex-1 py-2 text-xs rounded border transition-all ${viewportWidth === 375 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Mobile</button>
                                    <button type="button" onClick={() => setPreset(768, 1024)} className={`flex-1 py-2 text-xs rounded border transition-all ${viewportWidth === 768 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Tablet</button>
                                    <button type="button" onClick={() => setPreset(1280, 800)} className={`flex-1 py-2 text-xs rounded border transition-all ${viewportWidth === 1280 ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Desktop</button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Width</label>
                                        <input type="number" value={viewportWidth} onChange={(e) => setViewportWidth(Number(e.target.value))} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Height</label>
                                        <input type="number" value={viewportHeight} onChange={(e) => setViewportHeight(Number(e.target.value))} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                     <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Palette size={16}/> Background</h4>
                                     <div className="flex gap-2">
                                        <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                                        <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 uppercase" />
                                     </div>
                                </div>
                            </div>

                            {/* Grid Settings */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Grid size={16}/> Grid System</h4>
                                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Show Grid</span>
                                        <input type="checkbox" checked={gridVisible} onChange={(e) => setGridVisible(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Snap to Grid</span>
                                        <input type="checkbox" checked={gridSnap} onChange={(e) => setGridSnap(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                    </label>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-gray-500"><span>Grid Size</span><span>{gridSize}px</span></div>
                                        <input type="range" min="5" max="50" step="5" value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))} className="w-full accent-indigo-600" />
                                    </div>
                                     <div className="space-y-1">
                                        <span className="text-xs text-gray-500">Grid Color</span>
                                        <div className="flex gap-2">
                                            <input type="color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="w-6 h-6 rounded border cursor-pointer" />
                                            <input type="text" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="flex-1 p-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TEMPLATE */}
                {activeTab === 'template' && (
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
                )}

                {/* DUPLICATE */}
                {activeTab === 'duplicate' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Select Project to Duplicate</h3>
                        
                        <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                            {existingProjects.length === 0 ? (
                                <div className="text-center text-gray-400 py-10">No projects found.</div>
                            ) : (
                                existingProjects.map(p => (
                                    <div 
                                        key={p.id}
                                        onClick={() => {
                                            setSelectedProjectIdToDuplicate(p.id);
                                            setProjectName(`${p.name} (Copy)`);
                                        }}
                                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${selectedProjectIdToDuplicate === p.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">
                                                <FileText size={20}/>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{p.name}</div>
                                                <div className="text-xs text-gray-500 flex gap-2">
                                                    <span>Modified: {new Date(p.lastModified).toLocaleDateString()}</span>
                                                    <span>&bull;</span>
                                                    <span>Width: {p.viewportWidth}px</span>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedProjectIdToDuplicate === p.id && <CheckCircle2 className="text-indigo-600 dark:text-indigo-400" size={20} />}
                                    </div>
                                ))
                            )}
                        </div>
                         {selectedProjectIdToDuplicate && (
                             <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Project Name</label>
                                <input 
                                    type="text" 
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* IMPORT */}
                {activeTab === 'import' && (
                    <div className="max-w-md mx-auto space-y-6 pt-10">
                         <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl mx-auto flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                                <Upload size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Import from File</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Upload a valid .json project file.</p>
                        </div>

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">JSON files only</p>
                            </div>
                            <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
                        </label>

                        {importError && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                                {importError}
                            </div>
                        )}

                        {importedProject && (
                             <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-lg flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Ready to import: <strong>{importedProject.name}</strong>
                                </div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 block">Project Name</label>
                                <input 
                                    type="text" 
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        )}
                    </div>
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
                    (activeTab === 'import' && !importedProject) ||
                    !projectName.trim()
                }
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
            >
                Create Project
            </button>
        </div>
      </div>
    </div>
  );
};
