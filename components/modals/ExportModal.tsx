
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Project, ExportConfig, Screen, CanvasElement } from '../../types';
import { X, Download, FileJson, Image as ImageIcon, Loader2, Package, Archive } from 'lucide-react';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import JSZip from 'jszip';
import { ElementRenderer } from '../../canvas/ElementRenderer';

interface ExportModalProps {
  config: ExportConfig;
  project: Project;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ config, project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'json' | 'image' | 'bundle'>('json');
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg' | 'svg'>('png');
  const [scale, setScale] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref for staging hidden renders
  const stagingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (config.isOpen) {
          // Default to 'image' for non-project types, 'json' for project
          setActiveTab(config.type === 'project' ? 'json' : 'image');
      }
  }, [config.isOpen, config.type]);

  // Check ancestry for hidden state (Matches Canvas logic)
  const isElementVisible = (el: CanvasElement, allElements: CanvasElement[]): boolean => {
      if (el.hidden) return false;
      if (el.parentId) {
          const parent = allElements.find(p => p.id === el.parentId);
          if (parent) return isElementVisible(parent, allElements);
      }
      return true;
  };

  // Determine what screens to render in staging
  const screensToRender = useMemo(() => {
      if (config.type === 'screen') {
          if (config.targetIds && config.targetIds.length > 0) {
              return project.screens.filter(s => config.targetIds!.includes(s.id));
          }
          if (config.targetId) {
              return project.screens.filter(s => s.id === config.targetId);
          }
      }
      if (config.type === 'screen-group' && config.targetId) {
          return project.screens.filter(s => s.groupId === config.targetId);
      }
      if (config.type === 'project' || config.type === 'all-screens') {
          return project.screens;
      }
      return [];
  }, [config, project.screens]);

  // Prepare layer export data if exporting layers
  const layersToRender = useMemo(() => {
      if (config.type !== 'layer') return [];
      
      const targetIds = config.targetIds || (config.targetId ? [config.targetId] : []);
      if (targetIds.length === 0) return [];

      const screen = project.screens.find(s => s.id === project.activeScreenId);
      if (!screen) return [];

      return targetIds.map(id => {
          const rootEl = screen.elements.find(e => e.id === id);
          if (!rootEl) return null;

          // Note: If the root element itself is hidden, we typically still export it if the user explicitly requested it.
          // However, its descendants should respect the visibility rule.
          
          const descendants: CanvasElement[] = [];
          const findChildren = (parentId: string) => {
              const children = screen.elements.filter(e => e.parentId === parentId);
              children.forEach(c => {
                  if (isElementVisible(c, screen.elements)) {
                      descendants.push(c);
                      findChildren(c.id);
                  }
              });
          };
          findChildren(rootEl.id);
          return { root: rootEl, descendants };
      }).filter((item): item is { root: CanvasElement; descendants: CanvasElement[] } => item !== null);
  }, [config, project]);

  if (!config.isOpen) return null;

  const targetName = config.type === 'project' ? project.name : 
                     config.type === 'all-screens' ? 'All Screens' :
                     (config.targetIds && config.targetIds.length > 1) ? `${config.targetIds.length} Items` :
                     config.type === 'screen' ? project.screens.find(s => s.id === config.targetId)?.name :
                     config.type === 'screen-group' ? project.screenGroups.find(g => g.id === config.targetId)?.name || 'Group' :
                     layersToRender.length === 1 ? layersToRender[0].root.name : 'Selection';

  const sanitizeFilename = (name: string) => {
      return name.replace(/[^a-z0-9_\- ]/gi, '_').trim();
  };

  // --- Export Logic ---

  const handleJsonExport = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${sanitizeFilename(project.name)}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      onClose();
  };

  const getExportFunction = () => {
      switch(imageFormat) {
          case 'jpeg': return toJpeg;
          case 'svg': return toSvg;
          default: return toPng;
      }
  };

  const downloadImage = (dataUrl: string, fileName: string) => {
      const link = document.createElement('a');
      link.download = `${sanitizeFilename(fileName)}.${imageFormat}`;
      link.href = dataUrl;
      link.click();
  };

  const handleExport = async () => {
      setIsExporting(true);
      
      // Delay to allow DOM rendering in staging
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
          const func = getExportFunction();
          const options = imageFormat === 'jpeg' ? { backgroundColor: '#ffffff', pixelRatio: scale } : { pixelRatio: scale };

          // A: Single Layer
          if (config.type === 'layer' && layersToRender.length === 1) {
              const node = document.getElementById(`staging-layer-${layersToRender[0].root.id}`);
              if (node) {
                  const dataUrl = await func(node, options);
                  downloadImage(dataUrl, layersToRender[0].root.name);
              }
          }
          // B: Single Screen
          else if (screensToRender.length === 1 && (config.type === 'screen' || screensToRender.length === 1)) {
              const screen = screensToRender[0];
              const node = document.getElementById(`staging-screen-${screen.id}`);
              if(node) {
                  const dataUrl = await func(node, options);
                  downloadImage(dataUrl, screen.name);
              }
          }
          // C: Multiple Items -> ZIP
          else if (screensToRender.length > 0 || layersToRender.length > 0) {
              const zip = new JSZip();
              
              // Zip Screens
              for (const screen of screensToRender) {
                  const node = document.getElementById(`staging-screen-${screen.id}`);
                  if (node) {
                      const dataUrl = await func(node, options);
                      const base64Data = dataUrl.split(',')[1];
                      zip.file(`screens/${sanitizeFilename(screen.name)}.${imageFormat}`, base64Data, { base64: true });
                  }
              }

              // Zip Layers
              for (const layerSet of layersToRender) {
                  const node = document.getElementById(`staging-layer-${layerSet.root.id}`);
                  if (node) {
                      const dataUrl = await func(node, options);
                      const base64Data = dataUrl.split(',')[1];
                      zip.file(`layers/${sanitizeFilename(layerSet.root.name)}.${imageFormat}`, base64Data, { base64: true });
                  }
              }

              if (activeTab === 'bundle') {
                  zip.file(`${sanitizeFilename(project.name)}.json`, JSON.stringify(project, null, 2));
              }
              
              const content = await zip.generateAsync({ type: 'blob' });
              const url = URL.createObjectURL(content);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${sanitizeFilename(targetName || 'export')}.zip`;
              link.click();
              URL.revokeObjectURL(url);
          }
      } catch (err) {
          console.error("Export failed", err);
          alert(`Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
          setIsExporting(false);
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Staging Area for Off-screen Rendering */}
      <div 
        ref={stagingRef} 
        style={{ position: 'absolute', top: -10000, left: -10000, opacity: 0, pointerEvents: 'none' }}
      >
          {/* Render Screens */}
          {screensToRender.map(screen => (
              <div 
                key={screen.id} 
                id={`staging-screen-${screen.id}`}
                style={{ 
                    width: project.viewportWidth, 
                    height: project.viewportHeight, 
                    backgroundColor: screen.backgroundColor,
                    position: 'relative',
                    overflow: 'hidden'
                }}
              >
                  {screen.elements.map(el => {
                      // Apply visibility check here
                      if (!isElementVisible(el, screen.elements)) return null;
                      
                      return (
                        <div 
                            key={el.id}
                            style={{
                                position: 'absolute',
                                left: el.x,
                                top: el.y,
                                width: el.width,
                                height: el.height,
                                zIndex: el.zIndex
                            }}
                        >
                            <ElementRenderer element={el} isPreview={true} />
                        </div>
                      );
                  })}
              </div>
          ))}

          {/* Render Layers */}
          {layersToRender.map(layerSet => (
            <div
                key={layerSet.root.id}
                id={`staging-layer-${layerSet.root.id}`}
                style={{
                    width: layerSet.root.width,
                    height: layerSet.root.height,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Root Element Background/Container Style */}
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0}}>
                     <ElementRenderer element={{...layerSet.root, x:0, y:0, width: layerSet.root.width, height: layerSet.root.height}} isPreview={true} />
                </div>

                {/* Descendants positioned relative to root */}
                {layerSet.descendants.sort((a,b) => a.zIndex - b.zIndex).map(child => (
                    <div
                        key={child.id}
                        style={{
                            position: 'absolute',
                            left: child.x - layerSet.root.x,
                            top: child.y - layerSet.root.y,
                            width: child.width,
                            height: child.height,
                            zIndex: child.zIndex
                        }}
                    >
                        <ElementRenderer element={child} isPreview={true} />
                    </div>
                ))}
            </div>
          ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Download size={20} className="text-indigo-600 dark:text-indigo-400"/>
              Export Manager
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Tab Switcher for Project Type */}
            {config.type === 'project' && (
                <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('json')}
                        className={`flex-1 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-md transition-all ${activeTab === 'json' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        JSON Data
                    </button>
                    <button 
                        onClick={() => setActiveTab('image')}
                        className={`flex-1 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-md transition-all ${activeTab === 'image' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        Images Only
                    </button>
                    <button 
                        onClick={() => setActiveTab('bundle')}
                        className={`flex-1 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-md transition-all ${activeTab === 'bundle' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        Full Bundle
                    </button>
                </div>
            )}

            <div className="text-sm text-gray-600 dark:text-gray-300">
                Target: <span className="font-semibold text-gray-900 dark:text-white">{targetName}</span>
            </div>

            {/* Project JSON Option */}
            {config.type === 'project' && activeTab === 'json' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                    <button 
                        onClick={handleJsonExport}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                                <FileJson size={24} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-gray-800 dark:text-gray-100">Download Project File</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Save raw data (JSON) for backup.</div>
                            </div>
                        </div>
                        <Download size={18} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                    </button>
                </div>
            )}

            {/* Image / Bundle Export Options */}
            {(config.type !== 'project' || activeTab === 'image' || activeTab === 'bundle') && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Image Format</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['png', 'jpeg', 'svg'] as const).map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => setImageFormat(fmt)}
                                    className={`py-2 text-sm font-medium rounded border transition-colors uppercase ${imageFormat === fmt ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Scale</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setScale(1)} className={`py-2 text-sm font-medium rounded border transition-colors ${scale === 1 ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>1x</button>
                            <button onClick={() => setScale(2)} className={`py-2 text-sm font-medium rounded border transition-colors ${scale === 2 ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>2x</button>
                            <button onClick={() => setScale(3)} className={`py-2 text-sm font-medium rounded border transition-colors ${scale === 3 ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>3x</button>
                        </div>
                    </div>

                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isExporting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : activeTab === 'bundle' ? (
                            <Archive size={18} />
                        ) : (config.type === 'project' || config.type === 'all-screens' || (config.targetIds && config.targetIds.length > 1)) ? (
                            <Package size={18} />
                        ) : (
                            <ImageIcon size={18} />
                        )}
                        
                        {isExporting 
                            ? 'Processing...' 
                            : activeTab === 'bundle' 
                                ? 'Download Bundle' 
                                : (config.type === 'project' || config.type === 'all-screens' || (config.targetIds && config.targetIds.length > 1)) 
                                    ? 'Download ZIP' 
                                    : 'Download Image'
                        }
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
