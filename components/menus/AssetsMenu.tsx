
import React from 'react';
import { Upload, Trash2, Plus, Eye, Pin } from 'lucide-react';
import { Project, Asset, LibraryItem, CanvasElement, ScreenImage } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface AssetsMenuProps {
  project: Project;
  setProject: (p: Project) => void;
  onPreviewImage?: (image: ScreenImage) => void;
  activeLeftTab?: string;
  isPinned?: boolean;
  onTogglePin?: () => void;
}

export const AssetsMenu: React.FC<AssetsMenuProps> = ({ project, setProject, onPreviewImage, activeLeftTab, isPinned, onTogglePin }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file: File) => {
          const reader = new FileReader();
          reader.onload = (event) => {
              const src = event.target?.result as string;
              if (src) {
                  const newAsset: Asset = {
                      id: uuidv4(),
                      name: file.name,
                      type: file.type.startsWith('video') ? 'video' : 'image',
                      src
                  };
                  setProject({
                      ...project,
                      assets: [...(project.assets || []), newAsset]
                  });
              }
          };
          reader.readAsDataURL(file);
      });
  };

  const deleteAsset = (assetId: string) => {
      setProject({
          ...project,
          assets: (project.assets || []).filter(a => a.id !== assetId)
      });
  };

  const handleAssetDragStart = (e: React.DragEvent, asset: Asset) => {
      const item: LibraryItem = {
          type: asset.type === 'video' ? 'video' : 'image',
          label: asset.name,
          icon: asset.type === 'video' ? 'Video' : 'Image',
          defaultWidth: 200,
          defaultHeight: 150,
          defaultProps: { src: asset.src },
          defaultStyle: { borderRadius: 0 }
      };
      const dragData = JSON.stringify(item);
      e.dataTransfer.setData('componentData', dragData);
  };

  const handleAddToScreen = (e: React.MouseEvent, asset: Asset) => {
      e.stopPropagation();
      const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
      if (!activeScreen) return;

      const newElement: CanvasElement = {
          id: uuidv4(),
          type: asset.type === 'video' ? 'video' : 'image',
          name: asset.name,
          x: (project.viewportWidth / 2) - 100, // Center horizontally approx
          y: (project.viewportHeight / 2) - 75, // Center vertically approx
          width: 200,
          height: 150,
          zIndex: activeScreen.elements.length + 1,
          props: { src: asset.src },
          style: { borderRadius: 0 },
          interactions: []
      };

      const updatedScreens = project.screens.map(s => 
          s.id === project.activeScreenId 
          ? { ...s, elements: [...s.elements, newElement] }
          : s
      );
      setProject({ ...project, screens: updatedScreens });
  };

  const handlePreview = (asset: Asset) => {
      if (asset.type !== 'image' || !onPreviewImage) return;
      onPreviewImage({
          id: asset.id,
          name: asset.name,
          src: asset.src,
          category: 'Assets'
      });
  };

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                Project Assets
            </h2>
            {onTogglePin && (
                <button 
                    onClick={onTogglePin}
                    className={`p-1.5 rounded-md transition-colors ${isPinned ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    title={isPinned ? "Unpin Tab" : "Pin Tab"}
                >
                    <Pin size={16} className={isPinned ? 'fill-current' : ''} />
                </button>
            )}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> media</p>
                </div>
                <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={handleFileUpload} />
            </label>

            <div className="grid grid-cols-2 gap-3">
                {project.assets && project.assets.map(asset => (
                    <div 
                        key={asset.id}
                        draggable
                        onDragStart={(e) => handleAssetDragStart(e, asset)}
                        onClick={() => handlePreview(asset)}
                        className={`group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${asset.type === 'image' ? 'cursor-pointer' : ''}`}
                    >
                        {asset.type === 'video' ? (
                            <video src={asset.src} className="w-full h-full object-cover" />
                        ) : (
                            <img src={asset.src} alt={asset.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        
                        {/* Preview Indicator (Icon) */}
                        {asset.type === 'image' && (
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/50 text-white rounded-full p-1.5">
                                    <Eye size={16} />
                                </div>
                             </div>
                        )}

                        {/* Actions (Top Right) */}
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Add Button - Only if Screens tab is active */}
                            {activeLeftTab === 'screens' && (
                                <button 
                                    onClick={(e) => handleAddToScreen(e, asset)}
                                    className="p-1.5 bg-white/90 dark:bg-black/70 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-white dark:hover:bg-black shadow-sm"
                                    title="Add to Screen"
                                >
                                    <Plus size={12} />
                                </button>
                            )}
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                                className="p-1.5 bg-white/90 dark:bg-black/70 text-red-500 rounded-md hover:bg-white dark:hover:bg-black shadow-sm"
                                title="Delete Asset"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-white/90 dark:bg-black/80 text-[9px] truncate px-2 text-gray-700 dark:text-gray-300">
                            {asset.name}
                        </div>
                    </div>
                ))}
                {(!project.assets || project.assets.length === 0) && (
                    <div className="col-span-2 py-8 text-center text-xs text-gray-400 dark:text-gray-500 italic">
                        No assets uploaded yet.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
