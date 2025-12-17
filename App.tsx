
import React, { useState, useEffect, useCallback } from 'react';
import { TemplateDefinition, LeftSidebarTab, ExportConfig, ScreenImage } from './types';
import { Toolbar } from './components/Toolbar';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Canvas } from './canvas/Canvas';
import { ProjectOverview } from './components/ProjectOverview';
import { TemplatePreviewArea } from './components/TemplatePreviewArea';
import { ImagePreviewArea } from './components/ImagePreviewArea';
import { ExportModal } from './components/modals/ExportModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { AppSettingsPage } from './components/AppSettingsPage';
import { MousePointerClick } from 'lucide-react';

// Custom Hooks & Utils
import { useProject } from './hooks/useProject';
import { useAppSettings } from './hooks/useAppSettings';
import { useSelection } from './hooks/useSelection';
import { createNewElement } from './utils/elementFactories';
import { performBooleanOperation } from './utils/booleanOperations';

const App: React.FC = () => {
  // State Hooks
  const { project, setProject, handleProjectCreate } = useProject();
  const { appSettings, setAppSettings } = useAppSettings();
  const { 
      selectedElementIds, setSelectedElementIds,
      selectedScreenIds, setSelectedScreenIds,
      selectedScreenGroupIds, setSelectedScreenGroupIds,
      clearAllSelections 
  } = useSelection();

  // Local State
  const [scale, setScale] = useState(0.75);
  const [isPreview, setIsPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [previewImage, setPreviewImage] = useState<ScreenImage | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showHotspotsPersistent, setShowHotspotsPersistent] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({ isOpen: false, type: 'project' });
  const [activeLeftTab, setActiveLeftTab] = useState<LeftSidebarTab>('project');
  const [activeProjectSubTab, setActiveProjectSubTab] = useState<'screens' | 'task'>('screens');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [navHistory, setNavHistory] = useState<string[]>([]);

  // Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handlers
  const handleOpenExport = (config: Omit<ExportConfig, 'isOpen'>) => {
      setExportConfig({ ...config, isOpen: true });
  };

  const handleTogglePreview = (value: boolean) => {
      setIsPreview(value);
      if (!value) {
          setActiveLeftTab('screens');
          setShowHotspotsPersistent(false);
          setNavHistory([]); // Clear history when leaving preview
      }
  };

  const navigateTo = useCallback((screenId: string) => {
    setNavHistory(prev => [...prev, project.activeScreenId]);
    setProject(prev => ({ ...prev, activeScreenId: screenId }));
  }, [project.activeScreenId, setProject]);

  const goBack = useCallback(() => {
    if (navHistory.length > 0) {
      const newHistory = [...navHistory];
      const prevId = newHistory.pop();
      if (prevId) {
        setNavHistory(newHistory);
        setProject(prev => ({ ...prev, activeScreenId: prevId }));
      }
    }
  }, [navHistory, setProject]);

  const handleBooleanOperation = (op: 'union' | 'subtract' | 'intersect' | 'exclude') => {
      const updatedProject = performBooleanOperation(op, selectedElementIds, project);
      setProject(updatedProject);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
      if (!isPreview) {
          // Clear selections only when clicking on app background, 
          // though Canvas typically handles its own background clicks.
          // This captures clicks on the gray area around the canvas.
          clearAllSelections();
      }
  };

  const isTaskPageActive = activeLeftTab === 'project' && activeProjectSubTab === 'task';

  // Render Main Content Logic
  const renderMainContent = () => {
      if (activeLeftTab === 'settings' && !isPreview) {
          return <AppSettingsPage settings={appSettings} setSettings={setAppSettings} />;
      }

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
                activeSubTab={activeProjectSubTab}
                setActiveSubTab={setActiveProjectSubTab}
              />
           );
      }

      return (
         <div 
           className="relative m-auto p-10 transition-shadow duration-200 h-full flex items-center justify-center"
           onClick={handleBackgroundClick}
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
              alwaysShowHotspots={showHotspotsPersistent}
              navigateTo={navigateTo}
              goBack={goBack}
            />

            {/* Preview Hotspots Toggle */}
            {isPreview && appSettings.showHotspots && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={() => setShowHotspotsPersistent(!showHotspotsPersistent)}
                        className={`p-4 rounded-full shadow-lg transition-all flex items-center gap-2 font-medium ${
                            showHotspotsPersistent 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        title="Toggle Always Show Hotspots"
                    >
                        <MousePointerClick size={20} />
                        {showHotspotsPersistent && <span className="text-sm font-bold animate-in fade-in slide-in-from-right-2 duration-200">Hotspots On</span>}
                    </button>
                </div>
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
        setIsPreview={handleTogglePreview}
        project={project}
        setProject={setProject}
        theme={theme}
        setTheme={setTheme}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
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
            autoCollapse={isTaskPageActive}
          />
        )}

        {/* Main Content */}
        <div 
          className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 relative flex flex-col transition-colors duration-200"
          onClick={handleBackgroundClick}
        >
           {renderMainContent()}
        </div>

        {/* Right Sidebar - Hidden if Settings Active */}
        {!isPreview && activeLeftTab !== 'settings' && (
          <SidebarRight
            project={project}
            setProject={setProject}
            selectedElementIds={selectedElementIds}
            setSelectedElementIds={setSelectedElementIds}
            selectedScreenIds={selectedScreenIds}
            setSelectedScreenIds={setSelectedScreenIds}
            selectedScreenGroupIds={selectedScreenGroupIds}
            setSelectedScreenGroupIds={setSelectedScreenGroupIds}
            onPreviewTemplate={(template) => setPreviewTemplate(template)}
            onPreviewScreenImage={(image) => setPreviewImage(image)}
            appSettings={appSettings}
            onExport={handleOpenExport}
            activeLeftTab={activeLeftTab}
            autoCollapse={isTaskPageActive}
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
