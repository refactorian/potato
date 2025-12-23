
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Project, ExportConfig, Screen, CanvasElement } from '../../types';
import { X, Download, FileJson, Image as ImageIcon, Loader2, Package, Archive, Check, Copy } from 'lucide-react';
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
  const [copySuccess, setCopySuccess] = useState(false);
  
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
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
          const func = getExportFunction();
          const options = imageFormat === 'jpeg' ? { backgroundColor: '#ffffff', pixelRatio: scale } : { pixelRatio: scale };

          if (config.type === 'layer' && layersToRender.length === 1) {
              const node = document.getElementById(`staging-layer-${layersToRender[0].root.id}`);
              if (node) {
                  const dataUrl = await func(node, options);
                  downloadImage(dataUrl, layersToRender[0].root.name);
              }
          }
          else if (screensToRender.length === 1 && (config.type === 'screen' || screensToRender.length === 1)) {
              const screen = screensToRender[0];
              const node = document.getElementById(`staging-screen-${screen.id}`);
              if(node) {
                  const dataUrl = await func(node, options);
                  downloadImage(dataUrl, screen.name);
              }
          }
          else if (screensToRender.length > 0 || layersToRender.length > 0) {
              const zip = new JSZip();
              
              for (const screen of screensToRender) {
                  const node = document.getElementById(`staging-screen-${screen.id}`);
                  if (node) {
                      const dataUrl = await func(node, options);
                      const base64Data = dataUrl.split(',')[1];
                      zip.file(`screens/${sanitizeFilename(screen.name)}.${imageFormat}`, base64Data, { base64: true });
                  }
              }

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-[6px] p-4 animate-in fade-in duration-300">
      
      <div 
        ref={stagingRef} 
        style={{ position: 'absolute', top: -10000, left: -10000, opacity: 0, pointerEvents: 'none' }}
      >
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
                      if (!isElementVisible(el, screen.elements)) return null;
                      return (
                        <div key={el.id} style={{ position: 'absolute', left: el.x, top: el.y, width: el.width, height: el.height, zIndex: el.zIndex }}>
                            <ElementRenderer element={el} isPreview={true} />
                        </div>
                      );
                  })}
              </div>
          ))}

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
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0}}>
                     <ElementRenderer element={{...layerSet.root, x:0, y:0, width: layerSet.root.width, height: layerSet.root.height}} isPreview={true} />
                </div>
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

      <div 
        className="bg-white dark:bg-gray-850 rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col animate-in zoom-in-95 duration-200"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-850 shrink-0">
          <div>
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Archive System</h3>
            <h2 className="text-xl font-black text-gray-900 dark:text-white leading-none">Export Asset</h2>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-all active:scale-90 border border-gray-100 dark:border-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 min-h-0">
            {config.type === 'project' && (
                <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-inner">
                    {(['json', 'image', 'bundle'] as const).map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 shadow-xl text-indigo-600 dark:text-indigo-300 border border-white dark:border-gray-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-700">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Target Selection</div>
                <div className="text-sm font-black text-gray-900 dark:text-white truncate flex items-center gap-2">
                    <Package size={14} className="text-indigo-500" />
                    {targetName}
                </div>
            </div>

            {config.type === 'project' && activeTab === 'json' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={handleJsonExport}
                        className="w-full flex items-center justify-between p-5 border-2 border-gray-100 dark:border-gray-800 rounded-[32px] bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-900 transition-all shadow-sm hover:shadow-xl group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl transition-all group-hover:scale-110">
                                <FileJson size={28} />
                            </div>
                            <div className="text-left">
                                <div className="font-black text-gray-900 dark:text-white text-sm">JSON Data Package</div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Raw system blueprint</div>
                            </div>
                        </div>
                        <Download size={18} className="text-gray-300 group-hover:text-indigo-500" />
                    </button>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Format</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['png', 'jpeg', 'svg'] as const).map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => setImageFormat(fmt)}
                                    className={`py-3 text-[11px] font-black uppercase tracking-widest rounded-2xl border-2 transition-all ${imageFormat === fmt ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50'}`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precision</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(s => (
                                <button key={s} onClick={() => setScale(s)} className={`py-3 text-[11px] font-black uppercase tracking-widest rounded-2xl border-2 transition-all ${scale === s ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50'}`}>{s}x</button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] shadow-2xl shadow-indigo-600/30 transition-all font-black uppercase text-[11px] tracking-widest disabled:opacity-30 active:scale-95 border-2 border-indigo-500"
                    >
                        {isExporting ? <Loader2 size={18} className="animate-spin" /> : activeTab === 'bundle' ? <Archive size={18} /> : (config.type === 'project' || config.type === 'all-screens' || (config.targetIds && config.targetIds.length > 1)) ? <Package size={18} /> : <ImageIcon size={18} />}
                        {isExporting ? 'Processing...' : 'Download Files'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
