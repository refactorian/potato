
import React, { useState } from 'react';
import { 
    Palette, Image as ImageIcon, Trash2, FolderOutput, Eye, EyeOff, 
    Maximize, Smartphone, Tablet, Monitor, Grid, Info, Lock, Unlock,
    ChevronDown, ChevronRight, Layout, Hash, CircleDot
} from 'lucide-react';
import { Screen, GridConfig } from '../../../types';
import { ColorPickerControl } from '../../common/ColorPickerControl';
import { NumberInputControl } from '../../common/NumberInputControl';

interface ScreenPropertiesProps {
  screen: Screen;
  onUpdate: (updates: Partial<Screen>) => void;
  onExport: () => void;
  onDelete: () => void;
  onMoveToRoot: () => void;
}

export const ScreenProperties: React.FC<ScreenPropertiesProps> = ({
  screen,
  onUpdate,
  onExport,
  onDelete,
  onMoveToRoot,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['info', 'dimensions', 'appearance', 'grid']);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const updateGrid = (updates: Partial<GridConfig>) => {
    onUpdate({ gridConfig: { ...screen.gridConfig, ...updates } });
  };

  const updateViewport = (width: number, height: number) => {
    onUpdate({ viewportWidth: width, viewportHeight: height });
  };

  const PropertySection = ({ id, label, icon: Icon, children }: any) => {
    const isExpanded = expandedSections.includes(id);
    return (
        <div className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 overflow-hidden transition-all">
            <button 
                onClick={() => toggleSection(id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <Icon size={14} className={`${isExpanded ? 'text-indigo-500' : 'text-gray-400'} group-hover:text-indigo-500 transition-colors`} />
                    <span className="text-[11px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest">{label}</span>
                </div>
                {isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
            </button>
            {isExpanded && (
                <div className="px-4 pb-5 pt-1 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <Layout size={14} className="text-indigo-500" />
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Screen Inspector</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <PropertySection id="info" label="General" icon={Info}>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</label>
                <input 
                    type="text" 
                    value={screen.name} 
                    onChange={(e) => onUpdate({ name: e.target.value })} 
                    className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                    placeholder="Untitled Screen"
                />
            </div>
        </PropertySection>

        <PropertySection id="dimensions" label="Viewport" icon={Maximize}>
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button onClick={() => updateViewport(375, 812)} className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all ${screen.viewportWidth === 375 ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Smartphone size={14} className="mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Mobile</span>
                    </button>
                    <button onClick={() => updateViewport(768, 1024)} className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all ${screen.viewportWidth === 768 ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Tablet size={14} className="mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Tablet</span>
                    </button>
                    <button onClick={() => updateViewport(1280, 800)} className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all ${screen.viewportWidth === 1280 ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Monitor size={14} className="mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Desktop</span>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <NumberInputControl label="Width" value={screen.viewportWidth} onChange={val => updateViewport(val, screen.viewportHeight)} />
                    <NumberInputControl label="Height" value={screen.viewportHeight} onChange={val => updateViewport(screen.viewportWidth, val)} />
                </div>
            </div>
        </PropertySection>

        <PropertySection id="appearance" label="Appearance" icon={Palette}>
            <ColorPickerControl label="Background Color" value={screen.backgroundColor} onChange={val => onUpdate({ backgroundColor: val })} />
        </PropertySection>

        <PropertySection id="grid" label="Grid & Guides" icon={Grid}>
            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateGrid({ visible: !screen.gridConfig.visible })} className={`flex items-center justify-between p-2.5 rounded-lg border-2 transition-all ${screen.gridConfig.visible ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30' : 'bg-gray-50 border-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-500'}`}>
                        <span className="text-[10px] font-black uppercase">Visible</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${screen.gridConfig.visible ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    </button>
                    <button onClick={() => updateGrid({ snapToGrid: !screen.gridConfig.snapToGrid })} className={`flex items-center justify-between p-2.5 rounded-lg border-2 transition-all ${screen.gridConfig.snapToGrid ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30' : 'bg-gray-50 border-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-500'}`}>
                        <span className="text-[10px] font-black uppercase">Snap</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${screen.gridConfig.snapToGrid ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    </button>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Style</label>
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button onClick={() => updateGrid({ style: 'lines' })} className={`flex-1 py-1.5 flex items-center justify-center gap-2 rounded-md transition-all text-[10px] font-bold uppercase ${screen.gridConfig.style !== 'dots' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600' : 'text-gray-400'}`}>
                            <Hash size={12} /> Lines
                        </button>
                        <button onClick={() => updateGrid({ style: 'dots' })} className={`flex-1 py-1.5 flex items-center justify-center gap-2 rounded-md transition-all text-[10px] font-bold uppercase ${screen.gridConfig.style === 'dots' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600' : 'text-gray-400'}`}>
                            <CircleDot size={12} /> Dots
                        </button>
                    </div>
                </div>

                <NumberInputControl label="Grid Density" value={screen.gridConfig.size} min={5} max={100} step={5} suffix="px" onChange={val => updateGrid({ size: val })} />
                <ColorPickerControl label="Grid Color" value={screen.gridConfig.color} onChange={val => updateGrid({ color: val })} />
            </div>
        </PropertySection>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850 shrink-0">
           <div className="flex items-center gap-2">
                <Layout size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase truncate max-w-[100px]">{screen.name}</span>
           </div>
           
           <div className="flex items-center gap-2">
                <button onClick={() => onUpdate({ locked: !screen.locked })} className={`p-1.5 rounded-lg transition-colors ${screen.locked ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'text-gray-400 hover:text-indigo-600'}`}>
                    {screen.locked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
                <button onClick={() => onUpdate({ hidden: !screen.hidden })} className={`p-1.5 rounded-lg transition-colors ${screen.hidden ? 'bg-gray-100 text-gray-400 dark:bg-gray-700' : 'text-gray-400 hover:text-indigo-600'}`}>
                    {screen.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                <button onClick={onExport} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors" title="Export Image"><ImageIcon size={16} /></button>
                <button onClick={onMoveToRoot} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 transition-colors" title="Move to Root"><FolderOutput size={16} /></button>
                <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete Screen"><Trash2 size={16} /></button>
           </div>
      </div>
    </div>
  );
};
