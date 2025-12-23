import React, { useState, useEffect } from 'react';
import { Project, Interaction, IconStyle, CanvasElement, InteractionAction, ComponentStyle } from '../../../types';
import { 
    Trash2, Link as LinkIcon, Eye, EyeOff, Lock, Unlock, ExternalLink, 
    MessageCircle, ArrowLeft, Type, Maximize, Palette, Layers, 
    Image as ImageIcon, Square, ChevronDown, ChevronRight, Sparkles, 
    Baseline, AlignLeft, AlignCenter, AlignRight, Italic, Bold, CaseUpper, 
    Smartphone, Globe, LayoutList, TextCursor, Underline, Strikethrough,
    Layers as LayersIcon, PanelTop, PanelBottom, PanelLeft, PanelRight, FileCode, AlertCircle
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
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Playfair Display, serif',
    'Fira Code, monospace',
    'system-ui, -apple-system',
    'Georgia, serif',
    'Courier New, monospace'
];

const ALL_SECTIONS = ['layout', 'appearance', 'typography', 'image', 'border', 'effects', 'navbar', 'button', 'icon-settings'];

export const LayerProperties: React.FC<LayerPropertiesProps> = ({
  project,
  setProject,
  selectedElementId
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'interactions'>('style');
  const [expandedSections, setExpandedSections] = useState<string[]>(['layout', 'appearance', 'typography']);

  const activeScreen = (project.screens || []).find(s => s.id === project.activeScreenId);
  const element = activeScreen?.elements?.find(el => el.id === selectedElementId);

  useEffect(() => {
    if (element) {
        setExpandedSections(prev => {
            const next = new Set(['layout', 'appearance', ...prev]);
            if (element.type === 'image') next.add('image');
            if (element.type === 'text') next.add('typography');
            if (element.type === 'navbar') next.add('navbar');
            if (element.type === 'button') next.add('button');
            if (element.type === 'icon') next.add('icon-settings');
            return Array.from(next);
        });
    }
  }, [selectedElementId, element?.type]);

  if (!element) return null;

  const toggleSection = (id: string) => {
      setExpandedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAllSections = () => {
      if (expandedSections.length > 0) {
          setExpandedSections([]);
      } else {
          setExpandedSections(ALL_SECTIONS);
      }
  };

  const updateElement = (changes: Partial<CanvasElement> | { style: Partial<ComponentStyle> } | { props: any }) => {
    const updatedScreens = (project.screens || []).map(s => {
      if (s.id !== project.activeScreenId) return s;
      return {
        ...s,
        elements: (s.elements || []).map(el => {
          if (el.id !== element.id) return el;
          if ('style' in changes) return { ...el, style: { ...el.style, ...(changes as any).style } };
          if ('props' in changes) return { ...el, props: { ...el.props, ...(changes as any).props } };
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
    // VALIDATION: Check if an onClick interaction already exists
    if (current.some(i => i.trigger === 'onClick')) {
        return; // Prevent duplicate events of the same trigger type
    }

    const newInt: Interaction = {
        id: Math.random().toString(36).substr(2, 9),
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
        <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <IconPickerControl 
                label={label}
                iconName={iconName}
                onChange={(name) => updateElement({ props: { [propName]: name } })}
                onClear={() => updateElement({ props: { [propName]: '' } })}
            />
            {iconName && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                     <ColorPickerControl 
                        label="Icon Color" 
                        value={iconStyle.color || element.style.color || '#000000'} 
                        onChange={val => updateElement({ props: { [stylePropName]: { ...iconStyle, color: val } } })} 
                     />
                     <NumberInputControl 
                        label="Size (px)" 
                        value={iconStyle.size || 0} 
                        onChange={val => updateElement({ props: { [stylePropName]: { ...iconStyle, size: val } } })} 
                     />
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
            {isExpanded && <div className="px-4 pb-4 pt-1 space-y-4">{children}</div>}
        </div>
    );
  };

  const hasClickEvent = element.interactions?.some(i => i.trigger === 'onClick');

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 shrink-0">
        <button onClick={() => setActiveTab('style')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'style' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Design</button>
        <button onClick={() => setActiveTab('interactions')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'interactions' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Events</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'style' ? (
          <>
            <PropertySection id="layout" label="Position & Size" icon={Maximize}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <NumberInputControl label="X" value={Math.round(element.x)} onChange={val => updateElement({ x: val })} />
                    <NumberInputControl label="Y" value={Math.round(element.y)} onChange={val => updateElement({ y: val })} />
                    <NumberInputControl label="W" value={Math.round(element.width)} onChange={val => updateElement({ width: val })} />
                    <NumberInputControl label="H" value={Math.round(element.height)} onChange={val => updateElement({ height: val })} />
                </div>
            </PropertySection>

            <PropertySection id="appearance" label="Appearance" icon={Palette}>
                <div className="space-y-4">
                    <ColorPickerControl label="Background" value={element.style.backgroundColor || '#ffffff'} onChange={val => updateElement({ style: { backgroundColor: val } })} />
                    <NumberInputControl label="Opacity" value={Math.round((element.style.opacity ?? 1) * 100)} suffix="%" min={0} max={100} onChange={val => updateElement({ style: { opacity: val / 100 } })} />
                </div>
            </PropertySection>

            <PropertySection id="icon-settings" label="Icon Details" icon={Sparkles} isVisible={element.type === 'icon'}>
                {renderIconControl('Active Icon', 'iconName')}
            </PropertySection>

            <PropertySection id="typography" label="Typography" icon={Type} isVisible={['text', 'button', 'input', 'textarea', 'navbar', 'card'].includes(element.type)}>
                <div className="space-y-4">
                    {element.type === 'text' && (
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Content</label>
                            <textarea className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" rows={3} value={element.props.text || ''} onChange={e => updateElement({ props: { text: e.target.value } })} />
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Font Family</label>
                        <select className="w-full p-2 text-xs border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700" value={element.style.fontFamily || ''} onChange={e => updateElement({ style: { fontFamily: e.target.value } })}>
                            <option value="">Default System</option>
                            {FONTS.map(f => <option key={f} value={f} style={{fontFamily: f}}>{f.split(',')[0]}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <NumberInputControl label="Size" value={element.style.fontSize || 14} onChange={val => updateElement({ style: { fontSize: val } })} />
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Weight</label>
                            <select className="w-full p-2 text-xs border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 font-medium" value={element.style.fontWeight || 'normal'} onChange={e => updateElement({ style: { fontWeight: e.target.value } })}>
                                <option value="100">Thin</option>
                                <option value="300">Light</option>
                                <option value="normal">Normal</option>
                                <option value="500">Medium</option>
                                <option value="bold">Bold</option>
                                <option value="900">Black</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2">
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-w-[120px]">
                            {(['left', 'center', 'right'] as const).map(align => (
                                <button key={align} onClick={() => updateElement({ style: { textAlign: align } })} className={`flex-1 flex justify-center py-1 rounded-md transition-all ${element.style.textAlign === align ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                                    {align === 'left' && <AlignLeft size={14}/>}
                                    {align === 'center' && <AlignCenter size={14}/>}
                                    {align === 'right' && <AlignRight size={14}/>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </PropertySection>

            <PropertySection id="border" label="Borders & Radius" icon={Square}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                         <NumberInputControl label="Width" value={element.style.borderWidth || 0} onChange={val => updateElement({ style: { borderWidth: val } })} />
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Style</label>
                            <select className="w-full p-2 text-xs border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700" value={element.style.borderStyle || 'solid'} onChange={e => updateElement({ style: { borderStyle: e.target.value as any } })}>
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>
                    <NumberInputControl label="Corner Radius" value={element.style.borderRadius || 0} min={0} max={100} onChange={val => updateElement({ style: { borderRadius: val } })} />
                    <ColorPickerControl label="Border Color" value={element.style.borderColor || '#000000'} onChange={val => updateElement({ style: { borderColor: val } })} />
                </div>
            </PropertySection>
          </>
        ) : (
          <div className="p-4 space-y-6">
            <div className="space-y-1">
                <button 
                    onClick={addInteraction} 
                    disabled={hasClickEvent}
                    className={`w-full py-3 text-xs font-black uppercase tracking-widest rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all ${hasClickEvent ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/20'}`}
                >
                    <LinkIcon size={14} /> Add Tap Event
                </button>
                {hasClickEvent && (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold uppercase px-2 py-1">
                        <AlertCircle size={10} /> Max 1 Event Per Trigger
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {(element.interactions || []).map(i => (
                  <div key={i.id} className="p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-5 relative group/interaction animate-in slide-in-from-top-2 duration-200">
                    <button onClick={() => removeInteraction(i.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 p-1 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"><Trash2 size={14} /></button>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Trigger</label>
                        <div className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 font-black tracking-widest">ON TAP / CLICK</div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Action</label>
                        <select 
                            className="w-full p-2.5 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" 
                            value={i.action} 
                            onChange={e => updateInteraction(i.id, { action: e.target.value as InteractionAction, payload: '' })}
                        >
                            <option value="navigate">Navigate To Screen</option>
                            <option value="back">Go Back</option>
                            <option value="alert">Show Notification</option>
                            <option value="url">Open External URL</option>
                        </select>
                    </div>

                    {i.action === 'navigate' && (
                        <div className="space-y-1.5 animate-in fade-in zoom-in-95">
                             <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Target Screen</label>
                             <select 
                                className="w-full p-2.5 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                                value={i.payload || ''}
                                onChange={e => updateInteraction(i.id, { payload: e.target.value })}
                             >
                                <option value="" disabled>Select target...</option>
                                {project.screens.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} {s.id === project.activeScreenId ? '(Current)' : ''}</option>
                                ))}
                             </select>
                        </div>
                    )}

                    {(i.action === 'alert' || i.action === 'url') && (
                        <div className="space-y-1.5 animate-in fade-in zoom-in-95">
                             <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{i.action === 'alert' ? 'Message Text' : 'URL Endpoint'}</label>
                             <input 
                                type="text"
                                className="w-full p-2.5 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                                value={i.payload || ''}
                                placeholder={i.action === 'alert' ? "Hello world!" : "https://google.com"}
                                onChange={e => updateInteraction(i.id, { payload: e.target.value })}
                             />
                        </div>
                    )}
                  </div>
                ))}
                {(!element.interactions || element.interactions.length === 0) && (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200 dark:border-gray-800">
                            <LinkIcon size={24} className="text-gray-300 dark:text-gray-700" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium italic">No events configured for this layer.</p>
                    </div>
                )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850 shrink-0">
           <div className="flex items-center gap-2"><LayersIcon size={14} className="text-gray-400" /><span className="text-[10px] font-black text-gray-400 uppercase">{element.id.slice(0, 8)}</span></div>
           <div className="flex items-center gap-2">
                <button onClick={() => updateElement({ locked: !element.locked })} className={`p-1.5 rounded-lg transition-colors ${element.locked ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'text-gray-400 hover:text-indigo-600'}`}>{element.locked ? <Lock size={16} /> : <Unlock size={16} />}</button>
                <button onClick={() => updateElement({ hidden: !element.hidden })} className={`p-1.5 rounded-lg transition-colors ${element.hidden ? 'bg-gray-100 text-gray-400 dark:bg-gray-700' : 'text-gray-400 hover:text-indigo-600'}`}>{element.hidden ? <EyeOff size={16} /> : <Eye size={16} />}</button>
           </div>
      </div>
    </div>
  );
};