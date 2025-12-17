
import React, { useState, useEffect } from 'react';
import { Project, TemplateDefinition, LeftSidebarTab, AppSettings, ExportConfig, CanvasElement, ScreenGroup, ScreenImage } from './types';
import { Toolbar } from './components/Toolbar';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { FloatingToolbar } from './components/FloatingToolbar';
import { Canvas } from './canvas/Canvas';
import { ProjectOverview } from './components/ProjectOverview';
import { TemplatePreviewArea } from './components/TemplatePreviewArea';
import { ImagePreviewArea } from './components/ImagePreviewArea';
import { ExportModal } from './components/modals/ExportModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_PROJECT: Project = {
  id: uuidv4(),
  name: 'New Project',
  projectType: 'mobile',
  tags: [],
  lastModified: Date.now(),
  viewportWidth: 375,
  viewportHeight: 812,
  activeScreenId: 'screen-1',
  assets: [],
  screenGroups: [], // Initialized empty groups
  gridConfig: {
    visible: true,
    size: 20,
    color: '#cbd5e1', // Slate-300
    snapToGrid: true,
  },
  screens: [
    {
      id: 'screen-1',
      name: 'Home Screen',
      backgroundColor: '#ffffff',
      elements: [],
    },
  ],
};

const DEFAULT_SETTINGS: AppSettings = {
    autoNavigateToLayers: false,
    showTooltips: true,
    defaultGridVisible: true,
    defaultSnapToGrid: true,
    deleteScreensWithGroup: true,
    deleteLayersWithGroup: true
};

const App: React.FC = () => {
  // Load initial project from LocalStorage or use default
  const [project, setProject] = useState<Project>(() => {
      try {
          const indexStr = localStorage.getItem('potato_projects_index');
          if (indexStr) {
              const list = JSON.parse(indexStr);
              if (list.length > 0) {
                  // Load the most recently modified project
                  const lastProject = list.sort((a: any, b: any) => b.lastModified - a.lastModified)[0];
                  const projectData = localStorage.getItem(`potato_project_${lastProject.id}`);
                  if (projectData) {
                      return JSON.parse(projectData);
                  }
              }
          }
      } catch (e) {
          console.error("Error loading initial project", e);
      }
      return INITIAL_PROJECT;
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
      const saved = localStorage.getItem('potato_app_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  // Multi-selection states
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [selectedScreenIds, setSelectedScreenIds] = useState<string[]>([]);
  const [selectedScreenGroupIds, setSelectedScreenGroupIds] = useState<string[]>([]);

  const [scale, setScale] = useState(0.75);
  const [isPreview, setIsPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [previewImage, setPreviewImage] = useState<ScreenImage | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Export Modal State
  const [exportConfig, setExportConfig] = useState<ExportConfig>({ isOpen: false, type: 'project' });

  // Lifted state from SidebarLeft - Default to 'project' tab
  const [activeLeftTab, setActiveLeftTab] = useState<LeftSidebarTab>('project');
  
  // Floating Toolbar State
  const [activeTool, setActiveTool] = useState<string>('select');
  
  // Default to dark mode
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Persist App Settings
  useEffect(() => {
      localStorage.setItem('potato_app_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  // Auto-Save Effect
  useEffect(() => {
      const saveProject = () => {
          try {
              // Save full project data
              localStorage.setItem(`potato_project_${project.id}`, JSON.stringify(project));
              
              // Update Index
              const indexStr = localStorage.getItem('potato_projects_index');
              let list = indexStr ? JSON.parse(indexStr) : [];
              
              const newMeta = { id: project.id, name: project.name, lastModified: Date.now() };
              // Remove existing entry for this id if present
              list = list.filter((p: any) => p.id !== project.id);
              // Add to top
              list.unshift(newMeta);
              
              localStorage.setItem('potato_projects_index', JSON.stringify(list));
          } catch (e) {
              console.error("Auto-save failed", e);
          }
      };

      const timeoutId = setTimeout(saveProject, 1000); // Debounce 1s
      return () => clearTimeout(timeoutId);
  }, [project]);

  // Apply theme class to a wrapper or body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleOpenExport = (config: Omit<ExportConfig, 'isOpen'>) => {
      setExportConfig({ ...config, isOpen: true });
  };

  const handleProjectCreate = (newProject: Project) => {
      // Immediate save to ensure persistence
      localStorage.setItem(`potato_project_${newProject.id}`, JSON.stringify(newProject));
      
      // Update index immediately
      const indexStr = localStorage.getItem('potato_projects_index');
      let list = indexStr ? JSON.parse(indexStr) : [];
      const newMeta = { id: newProject.id, name: newProject.name, lastModified: Date.now() };
      list = list.filter((p: any) => p.id !== newProject.id);
      list.unshift(newMeta);
      localStorage.setItem('potato_projects_index', JSON.stringify(list));

      setProject(newProject);
  };

  /* --- Tool Handling --- */

  const handleInsertElement = (tool: string) => {
      // 1. If tool is 'select', just switch mode
      if (tool === 'select') {
          setActiveTool('select');
          return;
      }

      // 2. Identify Active Screen
      const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
      if (!activeScreen) return;
      if (activeScreen.locked) {
          alert("Screen is locked. Unlock to add elements.");
          setActiveTool('select');
          return;
      }

      // 3. Define Defaults for quick insertion (center of screen)
      const centerX = (project.viewportWidth / 2) - 50;
      const centerY = (project.viewportHeight / 2) - 50;
      
      let newElement: CanvasElement | null = null;
      const commonProps = {
          id: uuidv4(),
          name: tool.charAt(0).toUpperCase() + tool.slice(1),
          x: centerX,
          y: centerY,
          width: 100,
          height: 100,
          zIndex: activeScreen.elements.length + 1,
          interactions: [],
          props: {},
          style: { backgroundColor: '#e2e8f0' } // Default style
      };

      switch (tool) {
          case 'text':
              newElement = {
                  ...commonProps,
                  type: 'text',
                  width: 150,
                  height: 40,
                  style: { fontSize: 16, color: '#000000', backgroundColor: 'transparent' },
                  props: { text: 'Type something...' }
              };
              break;
          case 'rectangle':
              newElement = {
                  ...commonProps,
                  type: 'container',
                  style: { backgroundColor: '#cbd5e1', borderRadius: 0 }
              };
              break;
          case 'rounded':
              newElement = {
                  ...commonProps,
                  name: 'Rounded Rect',
                  type: 'container',
                  style: { backgroundColor: '#cbd5e1', borderRadius: 16 }
              };
              break;
          case 'ellipse':
              newElement = {
                  ...commonProps,
                  type: 'circle', // Maps to circle/ellipse in renderer
                  style: { backgroundColor: '#cbd5e1', borderRadius: 50 }
              };
              break;
          case 'line':
              newElement = {
                  ...commonProps,
                  type: 'container',
                  width: 200,
                  height: 2,
                  style: { backgroundColor: '#000000', borderRadius: 0 }
              };
              break;
          case 'arrow':
                newElement = {
                    ...commonProps,
                    type: 'icon',
                    width: 50,
                    height: 50,
                    style: { backgroundColor: 'transparent', color: '#000000' },
                    props: { iconName: 'MoveRight' }
                };
                break;
          case 'polygon':
              newElement = {
                  ...commonProps,
                  type: 'icon',
                  width: 100,
                  height: 100,
                  style: { backgroundColor: 'transparent', color: '#cbd5e1' },
                  props: { iconName: 'Triangle' } // Placeholder for polygon
              };
              break;
          case 'pen':
              alert("Pen tool is not supported in this version. Try using shapes or icons.");
              setActiveTool('select');
              return;
          default:
              break;
      }

      if (newElement) {
          const updatedScreens = project.screens.map(s => 
              s.id === project.activeScreenId 
              ? { ...s, elements: [...s.elements, newElement!] }
              : s
          );
          setProject({ ...project, screens: updatedScreens });
          setSelectedElementIds([newElement.id]);
          
          // Switch back to select after quick insert
          setActiveTool('select');
      }
  };

  const handleBooleanOperation = (op: 'union' | 'subtract' | 'intersect' | 'exclude') => {
      if (selectedElementIds.length < 2) return;

      const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
      if (!activeScreen) return;

      if (op === 'union') {
          // Implement Union as "Group"
          const selectedEls = activeScreen.elements.filter(el => selectedElementIds.includes(el.id));
          const minX = Math.min(...selectedEls.map(el => el.x));
          const minY = Math.min(...selectedEls.map(el => el.y));
          const maxX = Math.max(...selectedEls.map(el => el.x + el.width));
          const maxY = Math.max(...selectedEls.map(el => el.y + el.height));

          const newGroup: CanvasElement = {
              id: uuidv4(),
              type: 'group',
              name: 'Union Group',
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY,
              zIndex: Math.max(...selectedEls.map(el => el.zIndex)) + 1,
              props: {},
              style: { backgroundColor: 'transparent' },
              interactions: [],
              collapsed: false
          };

          const updatedElements = activeScreen.elements.map(el => {
              if (selectedElementIds.includes(el.id)) {
                  return { ...el, parentId: newGroup.id };
              }
              return el;
          });

          const updatedScreens = project.screens.map(s => {
              if (s.id !== project.activeScreenId) return s;
              return { ...s, elements: [...updatedElements, newGroup] };
          });

          setProject({ ...project, screens: updatedScreens });
      } else {
          // Other operations are complex geometry ops not supported on pure DOM divs
          alert(`The '${op}' operation requires vector path capabilities which are not supported on standard HTML elements.`);
      }
  };

  // Determine Main Content View
  const renderMainContent = () => {
      if (previewTemplate) {
          return (
             <TemplatePreviewArea 
                template={previewTemplate}
                project={project}
                setProject={setProject}
                onClose={() => setPreviewTemplate(null)}
             />
          );
      }

      if (previewImage) {
          return (
              <ImagePreviewArea
                  image={previewImage}
                  project={project}
                  setProject={setProject}
                  onClose={() => setPreviewImage(null)}
              />
          );
      }
      
      if (activeLeftTab === 'project' && !isPreview) {
           return (
              <ProjectOverview 
                project={project}
                setProject={setProject}
                setActiveTab={setActiveLeftTab}
                onExport={handleOpenExport}
              />
           );
      }

      return (
         <div 
           className="relative m-auto p-10 transition-shadow duration-200 h-full flex items-center justify-center"
           onClick={(e) => {
               if(!isPreview) {
                   setSelectedElementIds([]);
                   // Important: Clear screen selections when clicking on canvas background to focus on canvas context
                   setSelectedScreenIds([]);
                   setSelectedScreenGroupIds([]);
               }
           }}
         >
            <Canvas
              project={project}
              setProject={setProject}
              selectedElementIds={selectedElementIds}
              setSelectedElementIds={setSelectedElementIds}
              setSelectedScreenIds={setSelectedScreenIds}
              setSelectedScreenGroupIds={setSelectedScreenGroupIds}
              scale={scale}
              isPreview={isPreview}
              appSettings={appSettings}
              setActiveLeftTab={setActiveLeftTab}
            />
            
            {/* Floating Toolbar (Only visible in Edit Mode & Canvas View) */}
            {!isPreview && (
                <FloatingToolbar 
                    activeTool={activeTool}
                    onSelectTool={handleInsertElement}
                    onBooleanOp={handleBooleanOperation}
                    selectionCount={selectedElementIds.length}
                />
            )}
         </div>
      );
  };

  return (
    <div className={`flex flex-col h-screen w-full bg-gray-100 dark:bg-gray-900 overflow-hidden text-gray-800 dark:text-gray-100 font-sans transition-colors duration-200`}>
      <Toolbar
        scale={scale}
        setScale={setScale}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        project={project}
        setProject={setProject}
        theme={theme}
        setTheme={setTheme}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (Editor Mode Only) */}
        {!isPreview && (
          <SidebarLeft
            project={project}
            setProject={setProject}
            selectedElementIds={selectedElementIds}
            setSelectedElementIds={setSelectedElementIds}
            selectedScreenIds={selectedScreenIds}
            setSelectedScreenIds={setSelectedScreenIds}
            selectedScreenGroupIds={selectedScreenGroupIds}
            setSelectedScreenGroupIds={setSelectedScreenGroupIds}
            activeTab={activeLeftTab}
            setActiveTab={setActiveLeftTab}
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            onExport={handleOpenExport}
          />
        )}

        {/* Main Content Area */}
        <div 
          className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 relative flex flex-col transition-colors duration-200"
          onClick={() => {
              if(!isPreview) {
                  setSelectedElementIds([]);
                  setSelectedScreenIds([]);
                  setSelectedScreenGroupIds([]);
              }
          }}
        >
           {renderMainContent()}
        </div>

        {/* Right Sidebar (Editor Mode Only) */}
        {!isPreview && (
          <SidebarRight
            project={project}
            setProject={setProject}
            selectedElementIds={selectedElementIds}
            selectedScreenIds={selectedScreenIds}
            selectedScreenGroupIds={selectedScreenGroupIds}
            onPreviewTemplate={(template) => setPreviewTemplate(template)}
            onPreviewScreenImage={(image) => setPreviewImage(image)}
            appSettings={appSettings}
            onExport={handleOpenExport}
            activeLeftTab={activeLeftTab}
          />
        )}
      </div>

      <ExportModal 
        config={exportConfig}
        project={project}
        onClose={() => setExportConfig(prev => ({ ...prev, isOpen: false }))}
      />

      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleProjectCreate}
        appSettings={appSettings}
      />
    </div>
  );
};

export default App;
