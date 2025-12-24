
import React, { useState } from 'react';
import { Project, Interaction, CanvasElement, InteractionAction, ComponentStyle } from '../../../types';
import { 
    Trash2, Link as LinkIcon, Eye, EyeOff, Lock, Unlock,
    Maximize, Palette, Sparkles, AlignLeft, 
    AlignCenter, AlignRight, Layers as LayersIcon, Info, Square, 
    Box, Zap, Baseline, Type as TypeIcon, Italic, Underline,
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, Wand2, RotateCcw
} from 'lucide-react';
import { IconPickerControl } from '../../common/IconPickerControl';
import { ColorPickerControl } from '../../common/ColorPickerControl';
import { NumberInputControl } from '../../common/NumberInputControl';

interface LayerPropertiesProps {
  project: Project;
  setProject: (p: Project) => void;
  selectedElementId: string | null;
}

const FONTS = [
    'Inter, sans-serif', 'Roboto, sans-serif', 'Playfair Display, serif',
    'Fira Code, monospace', 'system-ui, -apple-system', 'Georgia, serif'
];

type LayerSubTab = 'info' | 'layout' | 'style' | 'typography' | 'border' | 'corners' | 'shadow' | 'filters' | 'events';

export const LayerProperties: React.FC<LayerPropertiesProps> = ({
  project,
  setProject,
  selectedElementId
}) => {
  const [activeTab, setActiveTab] = useState<LayerSubTab>('info');

  const activeScreen = project.screens.find(s => s.id === project.activeScreenId);
  const element = activeScreen?.elements?.find(el => el.id === selectedElementId);

  if (!element) return null;

  const updateElement = (changes: Partial<CanvasElement> | { style: Partial<ComponentStyle> } | { props: any }) => {
    const updatedScreens = project.screens.map(s => {
      if (s.id !== project.activeScreenId) return s;
      return {
        ...s,
        elements: s.elements.map(el => {
          if (el.id !== element.id) return el;
          if ('style' in changes) return { ...el, style: { ...el.style, ...(changes as any).style } };
          if ('props' in changes) return { ...el, props: { ...el.props, ...(changes as any).props } };
          return { ...el, ...changes };
        })
      };
    });
    setProject({ ...project, screens: updatedScreens, lastModified: Date.now() });
  };

  const resetFilters = () => {
      updateElement({
          style: {
              filterBlur: 0,
              filterBrightness: 100,
              filterContrast: 100,
              filterSaturate: 100,
              filterGrayscale: 0
          }
      });
  };

  const handleUpdateInteraction = (interactionId: string, updates: Partial<Interaction>) => {
    const newInts = (element.interactions || []).map(i => i.id === interactionId ? { ...i, ...updates } : i);
    updateElement({ interactions: newInts });
  };

  const handleAddInteraction = () => {
    const newInt: Interaction = {
        id: Math.random().toString(36).substr(2, 9),
        trigger: 'onClick',
        action: 'navigate',
        payload: project.screens.find(s => s.id !== project.activeScreenId)?.id || project.screens[0]?.id || ''
    };
    updateElement({ interactions: [...(element.interactions || []), newInt] });
  };

  const handleRemoveInteraction = (id: string) => {
    updateElement({ interactions: (element.interactions || []).filter(int => int.id !== id) });
  };

  const SubTabButton = ({ id, icon: Icon, label, disabled = false }: { id: LayerSubTab, icon: any, label: string, disabled?: boolean }) => (
      <button 
        onClick={() => !disabled && setActiveTab(id)}
        disabled={disabled}
        className={`flex flex-col items-center justify-center py-2.5 transition-all gap-1 border-b border-r border-gray-100 dark:border-gray-700/50 ${
            activeTab === id 
            ? 'bg-indigo-600 text-white border-indigo-600' 
            : 'bg-white dark:bg-gray-850 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200'
        } ${disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
        title={label}
      >
          <Icon size={16} />
          <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
      </button>
  );

  const Label = ({ children }: { children?: React.ReactNode }) => (
    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-1.5 block px-1">
      {children}
    </label>
  );

  const isTextBased = ['text', 'button', 'input', 'textarea', 'badge', 'navbar', 'card'].includes(element.type);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-in fade-in duration-300">
      <div className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700 shrink-0 shadow-sm">
          <SubTabButton id="info" icon={Info} label="Identity" />
          <SubTabButton id="layout" icon={Maximize} label="Transform" />
          <SubTabButton id="style" icon={Palette} label="Style" />
          <SubTabButton id="typography" icon={TypeIcon} label="Text" disabled={!isTextBased} />
          <SubTabButton id="corners" icon={Box} label="Corners" />
          <SubTabButton id="border" icon={Square} label="Borders" />
          <SubTabButton id="shadow" icon={Sparkles} label="Shadows" />
          <SubTabButton id="filters" icon={Wand2} label="Filters" />
          <SubTabButton id="events" icon={Zap} label="Events" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
            {activeTab === 'info' && (
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <Label>Layer Name</Label>
                        <input type="text" value={element.name} onChange={(e) => updateElement({ name: e.target.value })} className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 font-bold shadow-sm" />
                    </div>
                    {isTextBased && (
                        <div className="space-y-1.5">
                            <Label>Content Text</Label>
                            <textarea 
                                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-xs bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium shadow-sm" 
                                rows={3} 
                                value={['navbar', 'card'].includes(element.type) ? (element.props.title || '') : (element.props.text || '')} 
                                onChange={e => updateElement({ props: { [['navbar', 'card'].includes(element.type) ? 'title' : 'text']: e.target.value } })} 
                            />
                        </div>
                    )}
                    {element.type === 'card' && (
                        <div className="space-y-1.5">
                            <Label>Card Subtitle</Label>
                            <input type="text" className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 font-medium" value={element.props.subtitle || ''} onChange={e => updateElement({ props: { subtitle: e.target.value } })} />
                        </div>
                    )}
                    {['input', 'textarea'].includes(element.type) && (
                         <div className="space-y-1.5">
                            <Label>Placeholder</Label>
                            <input type="text" className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 font-medium" value={element.props.placeholder || ''} onChange={e => updateElement({ props: { placeholder: e.target.value } })} />
                        </div>
                    )}
                    {['icon', 'button', 'navbar'].includes(element.type) && (
                        <div className="space-y-4">
                            <Label>Glyphs</Label>
                            {element.type === 'navbar' ? (
                                <div className="space-y-4">
                                    <IconPickerControl label="Leading Icon" iconName={element.props.leftIcon} onChange={(n) => updateElement({ props: { leftIcon: n } })} onClear={() => updateElement({ props: { leftIcon: '' } })} />
                                    <IconPickerControl label="Trailing Icon" iconName={element.props.rightIcon} onChange={(n) => updateElement({ props: { rightIcon: n } })} onClear={() => updateElement({ props: { rightIcon: '' } })} />
                                </div>
                            ) : (
                                <IconPickerControl label="Element Icon" iconName={element.props.iconName || element.props.icon} onChange={(n) => updateElement({ props: { [element.type === 'button' ? 'icon' : 'iconName']: n } })} />
                            )}
                        </div>
                    )}
                    {['image', 'video'].includes(element.type) && (
                        <div className="space-y-1.5">
                            <Label>Source URL</Label>
                            <input type="text" value={element.props.src || ''} onChange={e => updateElement({ props: { src: e.target.value } })} className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 font-mono" />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'layout' && (
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label>Position</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <NumberInputControl label="X Axis" value={Math.round(element.x)} onChange={val => updateElement({ x: val })} suffix="px" />
                            <NumberInputControl label="Y Axis" value={Math.round(element.y)} onChange={val => updateElement({ y: val })} suffix="px" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label>Size</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <NumberInputControl label="Width" value={Math.round(element.width)} onChange={val => updateElement({ width: val })} suffix="px" />
                            <NumberInputControl label="Height" value={Math.round(element.height)} onChange={val => updateElement({ height: val })} suffix="px" />
                        </div>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-3">
                            <NumberInputControl label="Z-Index" value={element.zIndex || 1} onChange={val => updateElement({ zIndex: val })} />
                            <NumberInputControl label="Padding" value={typeof element.style.padding === 'number' ? element.style.padding : 0} onChange={val => updateElement({ style: { padding: val } })} suffix="px" />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-6">
                    <ColorPickerControl label="Background Fill" value={element.style.backgroundColor || '#ffffff'} onChange={val => updateElement({ style: { backgroundColor: val } })} />
                    <ColorPickerControl label="Content Tint" value={element.style.color || '#000000'} onChange={val => updateElement({ style: { color: val } })} />
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Label>Transparency</Label>
                        <input 
                            type="range" min="0" max="100" 
                            value={Math.round((element.style.opacity ?? 1) * 100)} 
                            onChange={e => updateElement({ style: { opacity: Number(e.target.value) / 100 } })}
                            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400">
                            <span>0%</span>
                            <span>{Math.round((element.style.opacity ?? 1) * 100)}%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'typography' && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Font Family</Label>
                            <select className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 font-bold appearance-none cursor-pointer shadow-sm" value={element.style.fontFamily || ''} onChange={e => updateElement({ style: { fontFamily: e.target.value } })}>
                                <option value="">System Default</option>
                                {FONTS.map(f => <option key={f} value={f} style={{fontFamily: f}}>{f.split(',')[0]}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <NumberInputControl label="Size" value={element.style.fontSize || 14} onChange={val => updateElement({ style: { fontSize: val } })} suffix="px" />
                            <div className="space-y-1.5">
                                <Label>Weight</Label>
                                <select className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 font-bold appearance-none cursor-pointer shadow-sm" value={element.style.fontWeight || 'normal'} onChange={e => updateElement({ style: { fontWeight: e.target.value } })}>
                                    <option value="normal">Regular</option>
                                    <option value="500">Medium</option>
                                    <option value="bold">Bold</option>
                                    <option value="900">Black</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                             <div className="space-y-1.5">
                                <Label>Style</Label>
                                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                                    <button onClick={() => updateElement({ style: { fontStyle: 'normal' } })} className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${element.style.fontStyle !== 'italic' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400'}`}><TypeIcon size={14} /></button>
                                    <button onClick={() => updateElement({ style: { fontStyle: 'italic' } })} className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${element.style.fontStyle === 'italic' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400'}`}><Italic size={14} /></button>
                                </div>
                             </div>
                             <div className="space-y-1.5">
                                <Label>Decoration</Label>
                                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                                    <button onClick={() => updateElement({ style: { textDecoration: 'none' } })} className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${(!element.style.textDecoration || element.style.textDecoration === 'none') ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400'}`}><X size={12} /></button>
                                    <button onClick={() => updateElement({ style: { textDecoration: 'underline' } })} className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${element.style.textDecoration === 'underline' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400'}`}><Underline size={14} /></button>
                                </div>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <NumberInputControl label="Line Height" value={element.style.lineHeight || 1.2} step={0.1} onChange={val => updateElement({ style: { lineHeight: val } })} />
                            <NumberInputControl label="Letter Spacing" value={element.style.letterSpacing || 0} step={0.5} onChange={val => updateElement({ style: { letterSpacing: val } })} suffix="px" />
                        </div>
                        <div className="space-y-3 pt-2">
                             <Label>Text Alignment</Label>
                             <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl shadow-inner">
                                {(['left', 'center', 'right'] as const).map(align => (
                                    <button key={align} onClick={() => updateElement({ style: { textAlign: align } })} className={`flex-1 flex justify-center py-2 rounded-lg transition-all ${element.style.textAlign === align ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                                        {align === 'left' && <AlignLeft size={16}/>}
                                        {align === 'center' && <AlignCenter size={16}/>}
                                        {align === 'right' && <AlignRight size={16}/>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'corners' && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <NumberInputControl label="Global Radius" value={element.style.borderRadius || 0} min={0} onChange={val => updateElement({ style: { borderRadius: val, borderTopLeftRadius: val, borderTopRightRadius: val, borderBottomLeftRadius: val, borderBottomRightRadius: val } })} suffix="px" />
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                            <Label>Independent Corners</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <NumberInputControl label="Top Left" value={element.style.borderTopLeftRadius ?? element.style.borderRadius ?? 0} onChange={val => updateElement({ style: { borderTopLeftRadius: val } })} suffix="px" />
                                <NumberInputControl label="Top Right" value={element.style.borderTopRightRadius ?? element.style.borderRadius ?? 0} onChange={val => updateElement({ style: { borderTopRightRadius: val } })} suffix="px" />
                                <NumberInputControl label="Bottom Left" value={element.style.borderBottomLeftRadius ?? element.style.borderRadius ?? 0} onChange={val => updateElement({ style: { borderBottomLeftRadius: val } })} suffix="px" />
                                <NumberInputControl label="Bottom Right" value={element.style.borderBottomRightRadius ?? element.style.borderRadius ?? 0} onChange={val => updateElement({ style: { borderBottomRightRadius: val } })} suffix="px" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'border' && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <ColorPickerControl label="Border Color" value={element.style.borderColor || '#000000'} onChange={val => updateElement({ style: { borderColor: val } })} />
                        <div className="grid grid-cols-2 gap-3">
                            <NumberInputControl label="Thickness" value={element.style.borderWidth || 0} onChange={val => updateElement({ style: { borderWidth: val } })} suffix="px" />
                            <div className="space-y-1.5">
                                <Label>Line Style</Label>
                                <select className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 font-bold appearance-none cursor-pointer" value={element.style.borderStyle || 'solid'} onChange={e => updateElement({ style: { borderStyle: e.target.value as any } })}>
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                    <option value="dotted">Dotted</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                        <Label>Thickness per Edge</Label>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="relative group">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors"><ArrowUp size={12} /></div>
                                <input type="number" className="w-full pl-8 pr-3 py-2.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl font-bold" value={element.style.borderTopWidth ?? element.style.borderWidth ?? 0} onChange={e => updateElement({ style: { borderTopWidth: Number(e.target.value) } })} placeholder="Top" />
                             </div>
                             <div className="relative group">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors"><ArrowRight size={12} /></div>
                                <input type="number" className="w-full pl-8 pr-3 py-2.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl font-bold" value={element.style.borderRightWidth ?? element.style.borderWidth ?? 0} onChange={e => updateElement({ style: { borderRightWidth: Number(e.target.value) } })} placeholder="Right" />
                             </div>
                             <div className="relative group">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors"><ArrowDown size={12} /></div>
                                <input type="number" className="w-full pl-8 pr-3 py-2.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl font-bold" value={element.style.borderBottomWidth ?? element.style.borderWidth ?? 0} onChange={e => updateElement({ style: { borderBottomWidth: Number(e.target.value) } })} placeholder="Bottom" />
                             </div>
                             <div className="relative group">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors"><ArrowLeft size={12} /></div>
                                <input type="number" className="w-full pl-8 pr-3 py-2.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl font-bold" value={element.style.borderLeftWidth ?? element.style.borderWidth ?? 0} onChange={e => updateElement({ style: { borderLeftWidth: Number(e.target.value) } })} placeholder="Left" />
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'shadow' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-2">
                             <Sparkles size={16} className="text-indigo-500" />
                             <span className="text-xs font-black uppercase text-gray-600 dark:text-gray-300 tracking-wider">Drop Shadow</span>
                        </div>
                        <button onClick={() => updateElement({ style: { shadow: !element.style.shadow } })} className={`w-10 h-5 rounded-full relative transition-colors ${element.style.shadow ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${element.style.shadow ? 'left-5.5' : 'left-0.5'}`} />
                        </button>
                    </div>

                    {element.style.shadow && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-2 gap-3">
                                <NumberInputControl label="Offset X" value={element.style.shadowOffsetX || 0} onChange={val => updateElement({ style: { shadowOffsetX: val } })} suffix="px" />
                                <NumberInputControl label="Offset Y" value={element.style.shadowOffsetY || 4} onChange={val => updateElement({ style: { shadowOffsetY: val } })} suffix="px" />
                                <NumberInputControl label="Blur Radius" value={element.style.shadowBlur || 12} min={0} onChange={val => updateElement({ style: { shadowBlur: val } })} suffix="px" />
                                <NumberInputControl label="Spread" value={element.style.shadowSpread || 0} onChange={val => updateElement({ style: { shadowSpread: val } })} suffix="px" />
                            </div>
                            <ColorPickerControl label="Shadow Tint" value={element.style.shadowColor || 'rgba(0,0,0,0.1)'} onChange={val => updateElement({ style: { shadowColor: val } })} />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'filters' && (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                    <div className="flex items-center justify-between">
                        <Label>Visual Processing</Label>
                        <button 
                            onClick={resetFilters}
                            className="flex items-center gap-1 text-[9px] font-black uppercase text-indigo-500 hover:text-indigo-600 tracking-widest transition-colors"
                        >
                            <RotateCcw size={10} /> Reset
                        </button>
                    </div>
                    <div className="space-y-5">
                        <NumberInputSlider label="Blur" value={element.style.filterBlur || 0} min={0} max={20} step={0.5} suffix="px" onChange={val => updateElement({ style: { filterBlur: val } })} />
                        <NumberInputSlider label="Brightness" value={element.style.filterBrightness ?? 100} min={0} max={200} step={1} suffix="%" onChange={val => updateElement({ style: { filterBrightness: val } })} />
                        <NumberInputSlider label="Contrast" value={element.style.filterContrast ?? 100} min={0} max={200} step={1} suffix="%" onChange={val => updateElement({ style: { filterContrast: val } })} />
                        <NumberInputSlider label="Saturate" value={element.style.filterSaturate ?? 100} min={0} max={200} step={1} suffix="%" onChange={val => updateElement({ style: { filterSaturate: val } })} />
                        <NumberInputSlider label="Grayscale" value={element.style.filterGrayscale || 0} min={0} max={100} step={1} suffix="%" onChange={val => updateElement({ style: { filterGrayscale: val } })} />
                    </div>
                </div>
            )}

            {activeTab === 'events' && (
                <div className="space-y-6">
                    <button onClick={handleAddInteraction} className="w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 border-b-4 border-indigo-800">
                        <LinkIcon size={14} /> Link New Trigger
                    </button>

                    <div className="space-y-4">
                        {(element.interactions || []).map(i => (
                        <div key={i.id} className="p-4 bg-gray-50 dark:bg-gray-750 rounded-[28px] border border-gray-200 dark:border-gray-700 space-y-4 relative shadow-sm">
                            <button onClick={() => handleRemoveInteraction(i.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700"><Trash2 size={12} /></button>
                            <div className="space-y-4 pt-2">
                                <div className="space-y-1">
                                    <Label>Trigger Strategy</Label>
                                    <select className="w-full p-2.5 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500/20" value={i.trigger} disabled>
                                        <option value="onClick">On Click / Tap</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Action Target</Label>
                                    <select className="w-full p-2.5 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500/20" value={i.action} onChange={e => handleUpdateInteraction(i.id, { action: e.target.value as InteractionAction, payload: '' })}>
                                        <option value="navigate">Navigate Screen</option>
                                        <option value="back">Go Back</option>
                                        <option value="alert">Push Alert</option>
                                        <option value="url">External Link</option>
                                    </select>
                                </div>
                                {i.action === 'navigate' && (
                                    <div className="space-y-1">
                                        <Label>Destination</Label>
                                        <select className="w-full p-2.5 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900" value={i.payload || ''} onChange={e => handleUpdateInteraction(i.id, { payload: e.target.value })}>
                                            <option value="" disabled>Select Target...</option>
                                            {project.screens.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                )}
                                {(i.action === 'alert' || i.action === 'url') && (
                                    <div className="space-y-1">
                                        <Label>Payload Data</Label>
                                        <input type="text" className="w-full p-2.5 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900" value={i.payload || ''} placeholder={i.action === 'url' ? 'https://...' : 'Enter message...'} onChange={e => handleUpdateInteraction(i.id, { payload: e.target.value })} />
                                    </div>
                                )}
                            </div>
                        </div>
                        ))}
                        {(element.interactions || []).length === 0 && (
                            <div className="text-center py-10 text-gray-400 opacity-50 italic text-xs uppercase tracking-widest font-black">
                                No events configured
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>
      </div>

      {/* Footer Branding Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850 shrink-0">
           <div className="flex items-center gap-2">
                <div className="p-1 bg-indigo-500 rounded text-white shadow-sm"><LayersIcon size={10} /></div>
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase truncate max-w-[120px] tracking-widest">{element.name}</span>
           </div>
           <div className="flex items-center gap-1.5">
                <button onClick={() => updateElement({ locked: !element.locked })} className={`p-2 rounded-xl transition-all shadow-sm ${element.locked ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'bg-white dark:bg-gray-750 text-gray-400 hover:text-indigo-600 border border-gray-100 dark:border-gray-700'}`}>{element.locked ? <Lock size={14} /> : <Unlock size={14} />}</button>
                <button onClick={() => updateElement({ hidden: !element.hidden })} className={`p-2 rounded-xl transition-all shadow-sm ${element.hidden ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' : 'bg-white dark:bg-gray-750 text-gray-400 hover:text-indigo-600 border border-gray-100 dark:border-gray-700'}`}>{element.hidden ? <EyeOff size={14} /> : <Eye size={14} />}</button>
           </div>
      </div>
    </div>
  );
};

const NumberInputSlider = ({ label, value, min, max, step, suffix, onChange }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</label>
            <span className="text-[10px] font-mono font-black text-indigo-500">{value}{suffix}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={e => onChange(Number(e.target.value))} 
            className="w-full accent-indigo-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" 
        />
    </div>
);
