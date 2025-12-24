
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TemplateDefinition, LeftSidebarTab, ExportConfig, ScreenImage } from './types';
import { Toolbar } from './components/Toolbar';
import { FooterBar } from './components/FooterBar';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight, RightTab } from './components/SidebarRight';
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
import { useHistory } from './hooks/useHistory';

const App: React.FC = () => {
  // State Hooks
  const { project, setProject, handleProjectCreate } = useProject();
  const { appSettings, setAppSettings } = useAppSettings();
  const { 
      selectedElementIds, setSelectedElementIds,
      selectedScreenIds, setSelectedScreenIds,
      selectedScreenGroupIds, setSelectedScreenGroupIds,
  } = useSelection();

  // History System (Project-based)
  const { 
      undo, redo, canUndo, canRedo, history, jumpToHistory, clearHistory 
  } = useHistory(project, setProject);

  // Local State
  const [scale, setScale] = useState(0.75);
  const [isPreview, setIsPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [previewImage, setPreviewImage] = useState<ScreenImage | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showHotspotsPersistent, setShowHotspotsPersistent] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({ isOpen: false, type: 'project' });
  const [activeLeftTab, setActiveLeftTab] = useState<LeftSidebarTab>('project');
  const [activeRightTab, setActiveRightTab] = useState<RightTab>('components');
  const [activeProjectSubTab, setActiveProjectSubTab] = useState<'screens' | 'task'>('screens');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [navHistory, setNavHistory] = useState<string[]>([]);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Helper for visibility logic used in fitToCanvas
  const isTaskPageActive = activeLeftTab === 'project' && activeProjectSubTab === 'task';

  // Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Zoom with Mouse Wheel Effect
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const factor = 0.001;
        setScale((prev) => {
          const newScale = prev + delta * factor;
          return Math.min(Math.max(0.1, newScale), 3);
        });
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Keyboard Shortcuts (Undo/Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isPreview) return;

        // Undo: Ctrl/Cmd + Z
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }
        // Redo: Ctrl/Cmd + Y OR Ctrl/Cmd + Shift + Z
        if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
            e.preventDefault();
            redo();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, isPreview]);

  // Handlers
  const handleOpenExport = (config: Omit<ExportConfig, 'isOpen'>) => {
      setExportConfig({ ...config, isOpen: true });
  };

  const handleTogglePreview = (value: boolean) => {
      setIsPreview(value);
      if (!value) {
          setActiveLeftTab('screens');
          setShowHotspotsPersistent(false);
          setNavHistory([]);
      }
  };

  const navigateTo = useCallback((screenId: string) => {
    setNavHistory(prev => [...prev, project.activeScreenId]);
    setProject(prev => ({ ...prev, activeScreenId: screenId }));
    setSelectedScreenIds([screenId]);
    setSelectedElementIds([]);
  }, [project.activeScreenId, setProject, setSelectedScreenIds, setSelectedElementIds]);

  const goBack = useCallback(() => {
    if (navHistory.length > 0) {
      const newHistory = [...navHistory];
      const prevId = newHistory.pop();
      if (prevId) {
        setNavHistory(newHistory);
        setProject(prev => ({ ...prev, activeScreenId: prevId }));
        setSelectedScreenIds([prevId]);
        setSelectedElementIds([]);
      }
    }
  }, [navHistory, setProject, setSelectedScreenIds, setSelectedElementIds]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
      if (!isPreview) {
          // Instead of clearing everything, select the active screen when clicking blank space
          setSelectedScreenIds([project.activeScreenId]);
          setSelectedElementIds([]);
          setSelectedScreenGroupIds([]);
          setActiveRightTab('properties');
      }
  };

  // Logic to perfectly fit the canvas within the remaining workspace
  const handleFitCanvas = useCallback(() => {
    const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
    if (!activeScreen) return;

    // Header (14*4=56), Footer (10*4=40), Padding (80 total)
    const headerH = 56;
    const footerH = 40;
    const padding = 120; // Extra buffer

    let leftW = 0;
    let rightW = 0;

    if (!isPreview) {
        // Left: Rail (48) + Panel (256). Collapsed if task or settings.
        const leftPanelVisible = activeLeftTab !== 'settings' && !isTaskPageActive;
        leftW = 48 + (leftPanelVisible ? 256 : 0);

        // Right: Rail (48) + Panel (288). Collapsed if task or settings.
        const rightPanelVisible = activeLeftTab !== 'settings' && !isTaskPageActive;
        rightW = 48 + (rightPanelVisible ? 288 : 0);
    }

    const availW = window.innerWidth - leftW - rightW - padding;
    const availH = window.innerHeight - headerH - footerH - padding;

    const scaleW = availW / activeScreen.viewportWidth;
    const scaleH = availH / activeScreen.viewportHeight;

    const newScale = Math.min(scaleW, scaleH);
    // Clamp between 10% and 200%
    setScale(Math.max(0.1, Math.min(2, newScale)));
  }, [project, isPreview, activeLeftTab, isTaskPageActive]);

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
                setSelectedScreenIds={setSelectedScreenIds}
                setSelectedElementIds={setSelectedElementIds}
              />
           );
      }

      return (
         <div 
           className="relative mx-auto py-[150px] px-[200px] transition-shadow duration-200 min-h-full flex items-center justify-center"
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
              onCanvasClick={() => {
                // Clicking canvas background selects the screen and focuses properties
                setSelectedScreenIds([project.activeScreenId]);
                setSelectedElementIds([]);
                setActiveRightTab('properties');
              }}
              onCanvasDoubleClick={() => {
                // Modified: Now switches to 'layers' tab to show the base layer selection
                setActiveLeftTab('layers');
                setActiveRightTab('properties');
                setSelectedScreenIds([project.activeScreenId]);
                setSelectedElementIds([]);
              }}
              onElementDoubleClick={(id) => {
                setActiveLeftTab('layers');
                setActiveRightTab('properties');
                setSelectedElementIds([id]);
                setSelectedScreenIds([]);
              }}
            />

            {/* Preview Hotspots Toggle */}
            {isPreview && appSettings.showHotspots && (
                <div className="fixed bottom-14 right-6 z-50">
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
          ref={scrollContainerRef}
          className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 relative flex flex-col transition-colors duration-200 custom-scrollbar"
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
            activeTab={activeRightTab}
            setActiveTab={setActiveRightTab}
            // History props
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onClearHistory={clearHistory}
            history={history}
            onJump={jumpToHistory}
          />
        )}
      </div>

      {/* Full Width Footer Bar */}
      <FooterBar 
        scale={scale}
        setScale={setScale}
        project={project}
        setProject={setProject}
        isPreview={isPreview}
        onFitCanvas={handleFitCanvas}
        // History props
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

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
