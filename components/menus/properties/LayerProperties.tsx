
import React, { useState } from 'react';
import { Project, Interaction, IconStyle, CanvasElement, InteractionAction, ComponentStyle } from '../../../types';
import { 
    Trash2, Link as LinkIcon, Eye, EyeOff, Lock, Unlock, ExternalLink, 
    MessageCircle, ArrowLeft, Type, Maximize, Palette, Layers, 
    Image as ImageIcon, Square, ChevronDown, ChevronRight, Sparkles, 
    Baseline, AlignLeft, AlignCenter, AlignRight, Italic, Bold, CaseUpper, Smartphone, Globe
} from 'lucide-react';
import { IconPickerControl } from '../../common/IconPickerControl';

interface LayerPropertiesProps {
  project: Project;
  setProject: (p: Project) => void;
  selectedElementId: string | null;
}

const FONTS = [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Playfair Display, serif',
    'Fira Code, monospace',
    'system-ui, -apple-system',
    'Georgia, serif',
    'Courier New, monospace'
];

export const LayerProperties: React.FC<LayerPropertiesProps> = ({
  project,
  setProject,
  selectedElementId
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'interactions'>('style');
  const [expandedSections, setExpandedSections] = useState<string[]>(['layout', 'appearance', 'typography', 'image', 'border', 'effects']);

  const activeScreen = (project.screens || []).find(s => s.id === project.activeScreenId);
  const element = activeScreen?.elements?.find(el => el.id === selectedElementId);

  if (!element) return null;

  const toggleSection = (id: string) => {
      setExpandedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const updateElement = (changes: Partial<CanvasElement> | { style: Partial<ComponentStyle> } | { props: any }) => {
    const updatedScreens = (project.screens || []).map(s => {
      if (s.id !== project.activeScreenId) return s;
      return {
        ...s,
        elements: (s.elements || []).map(el => {
          if (el.id !== element.id) return el;
          if ('style' in changes) return { ...el, style: { ...el.style, ...changes.style } };
          if ('props' in changes) return { ...el, props: { ...el.props, ...changes.props } };
          return { ...el, ...changes };
        })
      };
    });
    setProject({ ...project, screens: updatedScreens, lastModified: Date.now() });
  };

  const updateInteraction = (interactionId: string, updates: Partial<Interaction>) => {
    const currentInteractions = element.interactions || [];
    const newInteractions = currentInteractions.map(i => 
      i.id === interactionId ? { ...i, ...updates } : i
    );
    updateElement({ interactions: newInteractions });
  };

  const addInteraction = () => {
    const current = element.interactions || [];
    const newInt: Interaction = {
        id: Date.now().toString(),
        trigger: 'onClick',
        action: 'navigate',
        payload: project.screens.find(s => s.id !== project.activeScreenId)?.id || project.screens[0]?.id || ''
    };
    updateElement({ interactions: [...current, newInt] });
  };

  const removeInteraction = (id: string) => {
    const updated = (element.interactions || []).filter(int => int.id !== id);
    updateElement({ interactions: updated });
  };

  const renderIconControl = (label: string, propName: string) => {
    const iconName = element.props[propName];
    const stylePropName = propName === 'iconName' ? 'iconStyle' : `${propName}Style`;
    const iconStyle: IconStyle = element.props[stylePropName] || {};

    return (
        <div className="space-y-3">
            <IconPickerControl 
                label={label}
                iconName={iconName}
                onChange={(name) => updateElement({ props: { [propName]: name } })}
                onClear={() => updateElement({ props: { [propName]: '' } })}
            />
            {iconName && (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-3 shadow-sm">
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Icon Color</label>
                        <input type="color" className="w-full h-8 rounded border-none cursor-pointer overflow-hidden" value={iconStyle.color || element.style.color || '#000000'} onChange={e => updateElement({ props: { [stylePropName]: { ...iconStyle, color: e.target.value } } })} />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Size (px)</label>
                        <input type="number" className="w-full p-1.5 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={iconStyle.size || ''} onChange={e => updateElement({ props: { [stylePropName]: { ...iconStyle, size: Number(e.target.value) } } })} />
                     </div>
                </div>
            )}
        </div>
    );
  };

  const PropertySection = ({ id, label, icon: Icon, children, isVisible = true }: any) => {
    if (!isVisible) return null;
    const isExpanded = expandedSections.includes(id);
    return (
        <div className="border-b border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
            <button 
                onClick={() => toggleSection(id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <Icon size={14} className="text-gray-400 group-hover:text-indigo-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{label}</span>
                </div>
                {isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
            </button>
            {isExpanded && <div className="px-4 pb-4 pt-1 space-y-4 animate-in slide-in-from-top-1 duration-200">{children}</div>}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-in fade-in duration-200">
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 shrink-0">
        <button onClick={() => setActiveTab('style')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'style' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Design</button>
        <button onClick={() => setActiveTab('interactions')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'interactions' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Events</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'style' ? (
          <>
            <PropertySection id="layout" label="Position & Size" icon={Maximize}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">X</label>
                        <input type="number" className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={Math.round(element.x)} onChange={e => updateElement({ x: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Y</label>
                        <input type="number" className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={Math.round(element.y)} onChange={e => updateElement({ y: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">W</label>
                        <input type="number" className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={Math.round(element.width)} onChange={e => updateElement({ width: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">H</label>
                        <input type="number" className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={Math.round(element.height)} onChange={e => updateElement({ height: Number(e.target.value) })} />
                    </div>
                </div>
            </PropertySection>

            <PropertySection id="appearance" label="Appearance" icon={Palette}>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Background</label>
                        <div className="flex gap-2">
                            <input type="color" className="w-8 h-8 rounded border cursor-pointer p-0" value={element.style.backgroundColor || '#ffffff'} onChange={e => updateElement({ style: { backgroundColor: e.target.value } })} />
                            <input type="text" className="flex-1 p-2 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 uppercase font-mono" value={element.style.backgroundColor} onChange={e => updateElement({ style: { backgroundColor: e.target.value } })} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Opacity</label>
                            <span className="text-[10px] text-gray-500">{Math.round((element.style.opacity ?? 1) * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={element.style.opacity ?? 1} onChange={e => updateElement({ style: { opacity: Number(e.target.value) } })} />
                    </div>
                </div>
            </PropertySection>

            <PropertySection id="typography" label="Typography" icon={Type} isVisible={['text', 'button', 'input', 'textarea', 'navbar', 'card'].includes(element.type)}>
                <div className="space-y-4">
                    {element.type === 'text' && (
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Content</label>
                            <textarea className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" rows={3} value={element.props.text || ''} onChange={e => updateElement({ props: { text: e.target.value } })} />
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Font Family</label>
                        <select className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={element.style.fontFamily || ''} onChange={e => updateElement({ style: { fontFamily: e.target.value } })}>
                            <option value="">Default System</option>
                            {FONTS.map(f => <option key={f} value={f} style={{fontFamily: f}}>{f.split(',')[0]}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Size</label>
                            <input type="number" className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={element.style.fontSize || 14} onChange={e => updateElement({ style: { fontSize: Number(e.target.value) } })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Weight</label>
                            <select className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-medium" value={element.style.fontWeight || 'normal'} onChange={e => updateElement({ style: { fontWeight: e.target.value } })}>
                                <option value="100">Thin</option>
                                <option value="300">Light</option>
                                <option value="normal">Normal</option>
                                <option value="500">Medium</option>
                                <option value="bold">Bold</option>
                                <option value="900">Black</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700 flex-1">
                            {(['left', 'center', 'right'] as const).map(align => (
                                <button key={align} onClick={() => updateElement({ style: { textAlign: align } })} className={`flex-1 flex justify-center py-1 rounded-md transition-all ${element.style.textAlign === align ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                                    {align === 'left' && <AlignLeft size={14}/>}
                                    {align === 'center' && <AlignCenter size={14}/>}
                                    {align === 'right' && <AlignRight size={14}/>}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => updateElement({ style: { fontStyle: element.style.fontStyle === 'italic' ? 'normal' : 'italic' } })} className={`p-2 px-3 rounded-lg border transition-all ${element.style.fontStyle === 'italic' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                            <Italic size={14} />
                        </button>
                        <button onClick={() => updateElement({ style: { textTransform: element.style.textTransform === 'uppercase' ? 'none' : 'uppercase' } })} className={`p-2 px-3 rounded-lg border transition-all ${element.style.textTransform === 'uppercase' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                            <CaseUpper size={14} />
                        </button>
                    </div>
                </div>
            </PropertySection>

            <PropertySection id="image" label="Image Source" icon={ImageIcon} isVisible={element.type === 'image'}>
                <div className="space-y-4">
                     <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <button 
                            onClick={() => updateElement({ props: { _srcMode: 'url' } })}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${element.props._srcMode !== 'assets' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600' : 'text-gray-400'}`}
                        >
                            <Globe size={12} /> URL
                        </button>
                        <button 
                            onClick={() => updateElement({ props: { _srcMode: 'assets' } })}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${element.props._srcMode === 'assets' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600' : 'text-gray-400'}`}
                        >
                            <Smartphone size={12} /> Assets
                        </button>
                    </div>

                    {element.props._srcMode === 'assets' ? (
                        <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                            {project.assets.filter(a => a.type === 'image').map(asset => (
                                <button key={asset.id} onClick={() => updateElement({ props: { src: asset.src } })} className={`aspect-square rounded overflow-hidden border-2 transition-all ${element.props.src === asset.src ? 'border-indigo-500 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                    <img src={asset.src} className="w-full h-full object-cover" />
                                </button>
                            ))}
                            {project.assets.length === 0 && <div className="col-span-4 py-4 text-[10px] text-gray-400 text-center italic">No images in library</div>}
                        </div>
                    ) : (
                        <input type="text" className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 font-mono" placeholder="https://..." value={element.props.src || ''} onChange={e => updateElement({ props: { src: e.target.value } })} />
                    )}
                </div>
            </PropertySection>

            <PropertySection id="border" label="Borders & Radius" icon={Square}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Border Width</label>
                            <input type="number" className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={element.style.borderWidth || 0} onChange={e => updateElement({ style: { borderWidth: Number(e.target.value) } })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Style</label>
                            <select className="w-full p-2 text-xs border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={element.style.borderStyle || 'solid'} onChange={e => updateElement({ style: { borderStyle: e.target.value as any } })}>
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Radius</label>
                        <input type="range" min="0" max="100" className="w-full accent-indigo-600 h-1 bg-gray-200 rounded-full" value={element.style.borderRadius || 0} onChange={e => updateElement({ style: { borderRadius: Number(e.target.value) } })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Border Color</label>
                        <div className="flex gap-2">
                             <input type="color" className="w-8 h-8 rounded border-none cursor-pointer" value={element.style.borderColor || '#000000'} onChange={e => updateElement({ style: { borderColor: e.target.value } })} />
                             <input type="text" className="flex-1 p-2 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 uppercase font-mono" value={element.style.borderColor} onChange={e => updateElement({ style: { borderColor: e.target.value } })} />
                        </div>
                    </div>
                </div>
            </PropertySection>

            <PropertySection id="effects" label="Effects" icon={Sparkles}>
                <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer p-2 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Enable Shadow</span>
                        <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={!!element.style.shadow} onChange={e => updateElement({ style: { shadow: e.target.checked } })} />
                    </label>

                    {element.style.shadow && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg animate-in fade-in duration-200">
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400">Offset X</label>
                                <input type="number" className="w-full p-1.5 text-[10px] border rounded dark:bg-gray-700" value={element.style.shadowOffsetX ?? 0} onChange={e => updateElement({ style: { shadowOffsetX: Number(e.target.value) } })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400">Offset Y</label>
                                <input type="number" className="w-full p-1.5 text-[10px] border rounded dark:bg-gray-700" value={element.style.shadowOffsetY ?? 4} onChange={e => updateElement({ style: { shadowOffsetY: Number(e.target.value) } })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400">Blur</label>
                                <input type="number" className="w-full p-1.5 text-[10px] border rounded dark:bg-gray-700" value={element.style.shadowBlur ?? 6} onChange={e => updateElement({ style: { shadowBlur: Number(e.target.value) } })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400">Spread</label>
                                <input type="number" className="w-full p-1.5 text-[10px] border rounded dark:bg-gray-700" value={element.style.shadowSpread ?? -1} onChange={e => updateElement({ style: { shadowSpread: Number(e.target.value) } })} />
                            </div>
                             <div className="space-y-1 col-span-2 pt-2">
                                <label className="text-[10px] text-gray-400">Shadow Color</label>
                                <input type="color" className="w-full h-8 rounded-md border-none cursor-pointer" value={element.style.shadowColor || '#000000'} onChange={e => updateElement({ style: { shadowColor: e.target.value } })} />
                            </div>
                        </div>
                    )}
                </div>
            </PropertySection>

            {element.type === 'navbar' && (
                <PropertySection id="navbar" label="Navbar Props" icon={Baseline}>
                    <div className="space-y-4">
                        <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Nav Title</label>
                        <input type="text" className="w-full p-2 border rounded text-xs dark:bg-gray-700" value={element.props.title || ''} onChange={e => updateElement({ props: { title: e.target.value } })} />
                        </div>
                        {renderIconControl('Left Icon', 'leftIcon')}
                        {renderIconControl('Right Icon', 'rightIcon')}
                    </div>
                </PropertySection>
            )}

            {element.type === 'button' && (
               <PropertySection id="button" label="Button Config" icon={Smartphone}>
                  <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Label</label>
                        <input type="text" className="w-full p-2 border rounded text-xs dark:bg-gray-700" value={element.props.text || ''} onChange={e => updateElement({ props: { text: e.target.value } })} />
                    </div>
                    {renderIconControl('Leading Icon', 'icon')}
                  </div>
               </PropertySection>
            )}
          </>
        ) : (
          <div className="p-4 space-y-4">
            <button 
                onClick={addInteraction} 
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <LinkIcon size={14} /> Add Interaction
            </button>

            {(element.interactions || []).map(i => (
              <div key={i.id} className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 relative group/interaction animate-in slide-in-from-top-2 duration-200">
                <button 
                    onClick={() => removeInteraction(i.id)} 
                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1 rounded transition-colors"
                >
                    <Trash2 size={14} />
                </button>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Trigger</label>
                  <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-700 dark:text-gray-300 font-bold">
                    TAP / CLICK
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Action</label>
                  <select 
                    className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" 
                    value={i.action} 
                    onChange={e => updateInteraction(i.id, { action: e.target.value as InteractionAction, payload: '' })}
                  >
                    <option value="navigate">Navigate To</option>
                    <option value="back">Go Back</option>
                    <option value="alert">Show Alert</option>
                    <option value="url">External Link</option>
                  </select>
                </div>

                {i.action === 'navigate' && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Destination</label>
                        <select 
                            className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" 
                            value={i.payload} 
                            onChange={e => updateInteraction(i.id, { payload: e.target.value })}
                        >
                            <option value="">Select Screen...</option>
                            {project.screens.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {i.action === 'alert' && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                            <MessageCircle size={10} /> Message
                        </label>
                        <input 
                            type="text" 
                            className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                            placeholder="Type a message..."
                            value={i.payload || ''}
                            onChange={e => updateInteraction(i.id, { payload: e.target.value })}
                        />
                    </div>
                )}

                {i.action === 'url' && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Globe size={10} /> URL
                        </label>
                        <input 
                            type="text" 
                            className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 font-mono"
                            placeholder="https://..."
                            value={i.payload || ''}
                            onChange={e => updateInteraction(i.id, { payload: e.target.value })}
                        />
                    </div>
                )}
              </div>
            ))}

            {(!element.interactions || element.interactions.length === 0) && (
                <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-850 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <LinkIcon size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">No Events Defined</p>
                </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
           <div className="flex items-center gap-2">
                <Layers size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase">{element.id.slice(0, 8)}</span>
           </div>
           {/* Fix: Use 'Unlock' which is now imported from lucide-react */}
           <button onClick={() => updateElement({ locked: !element.locked })} className={`p-1.5 rounded-lg transition-colors ${element.locked ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:text-indigo-600'}`}>
                {element.locked ? <Lock size={14} /> : <Unlock size={14} />}
           </button>
      </div>
    </div>
  );
};
