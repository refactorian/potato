
import React, { useState } from 'react';
import { 
    Palette, Maximize, Grid, Info, Lock, Unlock,
    Layout, Eye, EyeOff, Image as ImageIcon, Trash2,
    Settings2, Layers, Smartphone
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

type ScreenSubTab = 'info' | 'layout' | 'style' | 'grid';

export const ScreenProperties: React.FC<ScreenPropertiesProps> = ({
  screen,
  onUpdate,
  onExport,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<ScreenSubTab>('info');

  const updateGrid = (updates: Partial<GridConfig>) => {
    onUpdate({ gridConfig: { ...screen.gridConfig, ...updates } });
  };

  const updateViewport = (width: number, height: number) => {
    onUpdate({ viewportWidth: width, viewportHeight: height });
  };

  const SubTabButton = ({ id, icon: Icon, label }: { id: ScreenSubTab, icon: any, label: string }) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex-1 flex items-center justify-center py-2.5 transition-all border-b-2 ${
            activeTab === id 
            ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10' 
            : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-200'
        }`}
        title={label}
      >
          <Icon size={18} />
      </button>
  );

  const Label = ({ children }: { children?: React.ReactNode }) => (
    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-1.5 block px-1">
      {children}
    </label>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-in fade-in duration-300">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                <Layout size={14} />
            </div>
            <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">Screen Settings</span>
        </div>
      </div>

      <div className="flex border-b border-gray-100 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800">
          <SubTabButton id="info" icon={Info} label="Identity" />
          <SubTabButton id="layout" icon={Maximize} label="Viewport" />
          <SubTabButton id="style" icon={Palette} label="Appearance" />
          <SubTabButton id="grid" icon={Grid} label="Grid System" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === 'info' && (
            <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                <div className="space-y-1.5">
                    <Label>Screen Name</Label>
                    <input 
                        type="text" 
                        value={screen.name} 
                        onChange={(e) => onUpdate({ name: e.target.value })} 
                        className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold shadow-sm"
                    />
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                    <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5">Active Context</div>
                    <p className="text-[11px] text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed">This screen is the primary focus of your current navigation flow.</p>
                </div>
            </div>
        )}

        {activeTab === 'layout' && (
            <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                <div className="grid grid-cols-2 gap-3">
                    <NumberInputControl label="Width" value={screen.viewportWidth} onChange={val => updateViewport(val, screen.viewportHeight)} suffix="px" />
                    <NumberInputControl label="Height" value={screen.viewportHeight} onChange={val => updateViewport(screen.viewportWidth, val)} suffix="px" />
                </div>
                <div className="space-y-3">
                    <Label>Presets</Label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        <button onClick={() => updateViewport(375, 812)} className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${screen.viewportWidth === 375 ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>Mobile</button>
                        <button onClick={() => updateViewport(768, 1024)} className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${screen.viewportWidth === 768 ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>Tablet</button>
                        <button onClick={() => updateViewport(1280, 800)} className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${screen.viewportWidth === 1280 ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>Desktop</button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'style' && (
            <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                <ColorPickerControl label="Background Fill" value={screen.backgroundColor} onChange={val => onUpdate({ backgroundColor: val })} />
            </div>
        )}

        {activeTab === 'grid' && (
            <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateGrid({ visible: !screen.gridConfig.visible })} className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${screen.gridConfig.visible ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30' : 'bg-gray-50 border-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-500'}`}>
                        <span className="text-[10px] font-black uppercase">Visible</span>
                        <div className={`w-2 h-2 rounded-full ${screen.gridConfig.visible ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                    </button>
                    <button onClick={() => updateGrid({ snapToGrid: !screen.gridConfig.snapToGrid })} className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${screen.gridConfig.snapToGrid ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30' : 'bg-gray-50 border-gray-100 dark:bg-gray-900 dark:border-gray-700 text-gray-500'}`}>
                        <span className="text-[10px] font-black uppercase">Snap</span>
                        <div className={`w-2 h-2 rounded-full ${screen.gridConfig.snapToGrid ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                    </button>
                </div>
                <NumberInputControl label="Cell Size" value={screen.gridConfig.size} min={5} max={100} step={5} suffix="px" onChange={val => updateGrid({ size: val })} />
                <ColorPickerControl label="Guide Color" value={screen.gridConfig.color} onChange={val => updateGrid({ color: val })} />
            </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850 shrink-0">
           <div className="flex items-center gap-1.5">
                <button onClick={() => onUpdate({ locked: !screen.locked })} className={`p-2 rounded-xl transition-all shadow-sm ${screen.locked ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'bg-white dark:bg-gray-750 text-gray-400 hover:text-indigo-600 border border-gray-100 dark:border-gray-700'}`}>
                    {screen.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
                <button onClick={() => onUpdate({ hidden: !screen.hidden })} className={`p-2 rounded-xl transition-all shadow-sm ${screen.hidden ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' : 'bg-white dark:bg-gray-750 text-gray-400 hover:text-indigo-600 border border-gray-100 dark:border-gray-700'}`}>
                    {screen.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
           </div>
           
           <div className="flex items-center gap-1.5">
                <button onClick={onExport} className="p-2 bg-white dark:bg-gray-750 rounded-xl text-gray-400 hover:text-indigo-600 border border-gray-100 dark:border-gray-700 transition-all shadow-sm" title="Export Image"><ImageIcon size={14} /></button>
                <button onClick={onDelete} className="p-2 bg-white dark:bg-gray-750 rounded-xl text-gray-400 hover:text-red-500 border border-gray-100 dark:border-gray-700 transition-all shadow-sm" title="Delete Screen"><Trash2 size={14} /></button>
           </div>
      </div>
    </div>
  );
};
