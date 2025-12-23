

import React, { useState, useEffect } from 'react';
import { Project, Interaction, IconStyle, CanvasElement, InteractionAction, ComponentStyle } from '../../../types';
import { 
    Trash2, Link as LinkIcon, Eye, EyeOff, Lock, Unlock, ExternalLink, 
    MessageCircle, ArrowLeft, Type, Maximize, Palette, Layers, 
    Image as ImageIcon, Square, ChevronDown, ChevronRight, Sparkles, 
    Baseline, AlignLeft, AlignCenter, AlignRight, Italic, Bold, CaseUpper, 
    Smartphone, Globe, LayoutList, TextCursor, Underline, Strikethrough,
    Layers as LayersIcon, PanelTop, PanelBottom, PanelLeft, PanelRight, FileCode, AlertCircle,
    Activity, CheckCircle, ToggleRight, Type as TypeIcon, Info
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

export const LayerProperties: React.FC<LayerPropertiesProps> = ({
  project,
  setProject,
  selectedElementId
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'interactions'>('style');
  const [expandedSections, setExpandedSections] = useState<string[]>(['general', 'layout', 'appearance', 'typography']);

  const activeScreen = (project.screens || []).find(s => s.id === project.activeScreenId);
  const element = activeScreen?.elements?.find(el => el.id === selectedElementId);

  useEffect(() => {
    if (element) {
        setExpandedSections(prev => {
            const next = new Set(['general', 'layout', 'appearance', ...prev]);
            if (element.type === 'image' || element.type === 'video') next.add('image');
            /* Added 'navbar' and 'card' to typography and icon sections */
            if (['text', 'button', 'input', 'textarea', 'badge', 'navbar', 'card'].includes(element.type)) next.add('typography');
            if (['icon', 'button', 'navbar'].includes(element.type)) next.add('icon-settings');
            if (['checkbox', 'radio', 'toggle'].includes(element.type)) next.add('controls');
            if (element.type === 'progress') next.add('status');
            next.add('border');
            next.add('effects');
            return Array.from(next);
        });
    }
  }, [selectedElementId, element?.type]);

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
    if (current.some(i => i.trigger === 'onClick')) return;

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

  const PropertySection = ({ id, label, icon: Icon, children, isVisible = true }: any) => {
    if (!isVisible) return null;
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
            {isExpanded && <div className="px-4 pb-5 pt-1 space-y-5">{children}</div>}
        </div>
    );
  };

  const hasClickEvent = element.interactions?.some(i => i.trigger === 'onClick');

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 shrink-0">
        <button onClick={() => setActiveTab('style')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'style' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Style</button>
        <button onClick={() => setActiveTab('interactions')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'interactions' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Events</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'style' ? (
          <>
            <PropertySection id="general" label="Identification" icon={Info}>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Layer Name</label>
                    <input 
                        type="text" 
                        value={element.name} 
                        onChange={(e) => updateElement({ name: e.target.value })} 
                        className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                        placeholder="Layer Name"
                    />
                </div>
            </PropertySection>

            <PropertySection id="layout" label="Dimensions" icon={Maximize}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <NumberInputControl label="X" value={Math.round(element.x)} onChange={val => updateElement({ x: val })} />
                    <NumberInputControl label="Y" value={Math.round(element.y)} onChange={val => updateElement({ y: val })} />
                    <NumberInputControl label="Width" value={Math.round(element.width)} onChange={val => updateElement({ width: val })} />
                    <NumberInputControl label="Height" value={Math.round(element.height)} onChange={val => updateElement({ height: val })} />
                </div>
            </PropertySection>

            <PropertySection id="appearance" label="Appearance" icon={Palette}>
                <div className="space-y-5">
                    <ColorPickerControl label="Background" value={element.style.backgroundColor || '#ffffff'} onChange={val => updateElement({ style: { backgroundColor: val } })} />
                    <ColorPickerControl label="Text Color" value={element.style.color || '#000000'} onChange={val => updateElement({ style: { color: val } })} />
                    <NumberInputControl 
                        label="Opacity" 
                        value={Math.round((element.style.opacity ?? 1) * 100)} 
                        min={0} max={100} suffix="%"
                        onChange={val => updateElement({ style: { opacity: val / 100 } })} 
                    />
                </div>
            </PropertySection>

            {/* Added 'navbar' and 'card' to typography section isVisible list */}
            <PropertySection id="typography" label="Typography" icon={Type} isVisible={['text', 'button', 'input', 'textarea', 'badge', 'navbar', 'card'].includes(element.type)}>
                <div className="space-y-5">
                    {/* Handle Title/Content editing for navbar and card */}
                    {['text', 'button', 'badge', 'navbar', 'card'].includes(element.type) && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                {['navbar', 'card'].includes(element.type) ? 'Title' : 'Content'}
                            </label>
                            <textarea 
                                className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium" 
                                rows={2} 
                                value={['navbar', 'card'].includes(element.type) ? (element.props.title || '') : (element.props.text || '')} 
                                onChange={e => updateElement({ props: { [['navbar', 'card'].includes(element.type) ? 'title' : 'text']: e.target.value } })} 
                            />
                        </div>
                    )}
                    {/* Handle Subtitle editing for card type */}
                    {element.type === 'card' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Subtitle</label>
                            <textarea 
                                className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium" 
                                rows={2} 
                                value={element.props.subtitle || ''} 
                                onChange={e => updateElement({ props: { subtitle: e.target.value } })} 
                            />
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Font Family</label>
                        <select className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-medium" value={element.style.fontFamily || ''} onChange={e => updateElement({ style: { fontFamily: e.target.value } })}>
                            <option value="">System Default</option>
                            {FONTS.map(f => <option key={f} value={f} style={{fontFamily: f}}>{f.split(',')[0]}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <NumberInputControl label="Size" value={element.style.fontSize || 14} onChange={val => updateElement({ style: { fontSize: val } })} />
                         <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Weight</label>
                            <select className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-bold" value={element.style.fontWeight || 'normal'} onChange={e => updateElement({ style: { fontWeight: e.target.value } })}>
                                <option value="100">Thin</option>
                                <option value="300">Light</option>
                                <option value="normal">Regular</option>
                                <option value="500">Medium</option>
                                <option value="600">Semibold</option>
                                <option value="bold">Bold</option>
                                <option value="900">Black</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <NumberInputControl label="Line Height" value={element.style.lineHeight || 1.2} step={0.1} onChange={val => updateElement({ style: { lineHeight: val } })} />
                         <NumberInputControl label="Letter Spacing" value={element.style.letterSpacing || 0} step={0.5} onChange={val => updateElement({ style: { letterSpacing: val } })} />
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                            {(['left', 'center', 'right'] as const).map(align => (
                                <button key={align} onClick={() => updateElement({ style: { textAlign: align } })} className={`flex-1 flex justify-center py-2 rounded-lg transition-all ${element.style.textAlign === align ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}>
                                    {align === 'left' && <AlignLeft size={16}/>}
                                    {align === 'center' && <AlignCenter size={16}/>}
                                    {align === 'right' && <AlignRight size={16}/>}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                             <button 
                                onClick={() => updateElement({ style: { textDecoration: element.style.textDecoration === 'underline' ? 'none' : 'underline' } })} 
                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all text-[10px] font-black uppercase ${element.style.textDecoration === 'underline' ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40' : 'bg-gray-50 border-transparent text-gray-400'}`}
                             >
                                <Underline size={14} /> Underline
                             </button>
                             <button 
                                onClick={() => updateElement({ style: { textDecoration: element.style.textDecoration === 'line-through' ? 'none' : 'line-through' } })} 
                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all text-[10px] font-black uppercase ${element.style.textDecoration === 'line-through' ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/40' : 'bg-gray-50 border-transparent text-gray-400'}`}
                             >
                                <Strikethrough size={14} /> Strike
                             </button>
                        </div>

                        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                            {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map(transform => (
                                <button key={transform} onClick={() => updateElement({ style: { textTransform: transform } })} className={`flex-1 flex justify-center py-2 rounded-lg transition-all text-[10px] font-black uppercase ${element.style.textTransform === transform ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}>
                                    {transform === 'none' ? 'Ab' : transform === 'uppercase' ? 'AB' : transform === 'lowercase' ? 'ab' : 'Aa'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </PropertySection>

            {/* Added 'navbar' to icon-settings section for dual icon controls */}
            <PropertySection id="icon-settings" label="Icon Control" icon={Sparkles} isVisible={['icon', 'button', 'navbar'].includes(element.type)}>
                <div className="space-y-5">
                    {element.type === 'navbar' ? (
                        <>
                            <IconPickerControl 
                                label="Left Icon"
                                iconName={element.props.leftIcon}
                                onChange={(name) => updateElement({ props: { leftIcon: name } })}
                                onClear={() => updateElement({ props: { leftIcon: '' } })}
                            />
                            <IconPickerControl 
                                label="Right Icon"
                                iconName={element.props.rightIcon}
                                onChange={(name) => updateElement({ props: { rightIcon: name } })}
                                onClear={() => updateElement({ props: { rightIcon: '' } })}
                            />
                        </>
                    ) : (
                        <IconPickerControl 
                            label="Selected Icon"
                            iconName={element.props.iconName || element.props.icon}
                            onChange={(name) => updateElement({ props: { [element.type === 'button' ? 'icon' : 'iconName']: name } })}
                        />
                    )}
                    
                    {(element.props.iconName || element.props.icon || element.props.leftIcon || element.props.rightIcon) && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-5">
                            <ColorPickerControl label="Icon Tint" value={(element.props.iconStyle as IconStyle)?.color || element.style.color || '#000'} onChange={val => updateElement({ props: { iconStyle: { ...element.props.iconStyle, color: val } } })} />
                            <div className="grid grid-cols-2 gap-3">
                                <NumberInputControl label="Icon Size" value={(element.props.iconStyle as IconStyle)?.size || 24} onChange={val => updateElement({ props: { iconStyle: { ...element.props.iconStyle, size: val } } })} />
                                <NumberInputControl label="Stroke" step={0.5} value={(element.props.iconStyle as IconStyle)?.strokeWidth || 2} onChange={val => updateElement({ props: { iconStyle: { ...element.props.iconStyle, strokeWidth: val } } })} />
                            </div>
                        </div>
                    )}
                </div>
            </PropertySection>

            <PropertySection id="image" label="Image Settings" icon={ImageIcon} isVisible={['image', 'video'].includes(element.type)}>
                 <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{element.type === 'video' ? 'Video Endpoint' : 'Image Endpoint'}</label>
                    <input type="text" className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-medium" value={element.props.src || ''} onChange={e => updateElement({ props: { src: e.target.value } })} />
                </div>
            </PropertySection>

            <PropertySection id="controls" label="Interactive State" icon={CheckCircle} isVisible={['checkbox', 'radio', 'toggle'].includes(element.type)}>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Checked / On</span>
                    <button onClick={() => updateElement({ props: { checked: !element.props.checked } })} className={`w-12 h-6 rounded-full relative transition-colors ${element.props.checked ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${element.props.checked ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </PropertySection>

            <PropertySection id="status" label="Progress Value" icon={Activity} isVisible={element.type === 'progress'}>
                 <NumberInputControl label="Completion" value={element.props.value || 0} min={0} max={100} suffix="%" onChange={val => updateElement({ props: { value: val } })} />
            </PropertySection>

            <PropertySection id="border" label="Frame & Radius" icon={Square}>
                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                         <NumberInputControl label="Thickness" value={element.style.borderWidth || 0} onChange={val => updateElement({ style: { borderWidth: val } })} />
                         <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Style</label>
                            <select className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900" value={element.style.borderStyle || 'solid'} onChange={e => updateElement({ style: { borderStyle: e.target.value as any } })}>
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>
                    <ColorPickerControl label="Border Color" value={element.style.borderColor || '#000000'} onChange={val => updateElement({ style: { borderColor: val } })} />
                    
                    <div className="space-y-3">
                         <NumberInputControl label="Uniform Radius" value={element.style.borderRadius || 0} min={0} max={100} onChange={val => updateElement({ style: { borderRadius: val, borderTopLeftRadius: undefined, borderTopRightRadius: undefined, borderBottomLeftRadius: undefined, borderBottomRightRadius: undefined } })} />
                         <div className="grid grid-cols-2 gap-2 pt-1 opacity-60">
                             <NumberInputControl label="Top Left" value={element.style.borderTopLeftRadius ?? element.style.borderRadius ?? 0} onChange={val => updateElement({ style: { borderTopLeftRadius: val, borderRadius: undefined } })} />
                             <NumberInputControl label="Top Right" value={element.style.borderTopRightRadius ?? element.style.borderRadius ?? 0} onChange={val => updateElement({ style: { borderTopRightRadius: val, borderRadius: undefined } })} />
                             <NumberInputControl label="Bottom Left" value={element.style.borderBottomLeftRadius ?? element.style.borderRadius ?? 0} onChange={val => updateElement({ style: { borderBottomLeftRadius: val, borderRadius: undefined } })} />
                             <NumberInputControl label="Bottom Right" value={element.style.borderBottomRightRadius ?? element.style.borderRadius ?? 0} onChange={val => updateElement({ style: { borderBottomRightRadius: val, borderRadius: undefined } })} />
                         </div>
                    </div>
                </div>
            </PropertySection>

            <PropertySection id="effects" label="Drop Shadow" icon={Sparkles}>
                 <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Enable Shadow</span>
                        <button onClick={() => updateElement({ style: { shadow: !element.style.shadow } })} className={`w-12 h-6 rounded-full relative transition-colors ${element.style.shadow ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${element.style.shadow ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                    {element.style.shadow && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-2 gap-3">
                                <NumberInputControl label="Offset X" value={element.style.shadowOffsetX || 0} onChange={val => updateElement({ style: { shadowOffsetX: val } })} />
                                <NumberInputControl label="Offset Y" value={element.style.shadowOffsetY || 4} onChange={val => updateElement({ style: { shadowOffsetY: val } })} />
                                <NumberInputControl label="Blur" value={element.style.shadowBlur || 10} onChange={val => updateElement({ style: { shadowBlur: val } })} />
                                <NumberInputControl label="Spread" value={element.style.shadowSpread || 0} onChange={val => updateElement({ style: { shadowSpread: val } })} />
                            </div>
                            <ColorPickerControl label="Shadow Color" value={element.style.shadowColor || 'rgba(0,0,0,0.2)'} onChange={val => updateElement({ style: { shadowColor: val } })} />
                        </div>
                    )}
                 </div>
            </PropertySection>
          </>
        ) : (
          <div className="p-5 space-y-6">
            <button 
                onClick={addInteraction} 
                disabled={hasClickEvent}
                className={`w-full py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all ${hasClickEvent ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'}`}
            >
                <LinkIcon size={16} /> Create Tap Action
            </button>

            <div className="space-y-4">
                {(element.interactions || []).map(i => (
                  <div key={i.id} className="p-5 bg-gray-50 dark:bg-gray-750 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-5 relative animate-in slide-in-from-top-4 duration-300">
                    <button onClick={() => removeInteraction(i.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Action</label>
                        <select 
                            className="w-full p-3 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/20" 
                            value={i.action} 
                            onChange={e => updateInteraction(i.id, { action: e.target.value as InteractionAction, payload: '' })}
                        >
                            <option value="navigate">Go to Screen</option>
                            <option value="back">Previous Screen</option>
                            <option value="alert">System Alert</option>
                            <option value="url">External Link</option>
                        </select>
                    </div>

                    {i.action === 'navigate' && (
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Destination</label>
                             <select className="w-full p-3 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" value={i.payload || ''} onChange={e => updateInteraction(i.id, { payload: e.target.value })}>
                                <option value="" disabled>Select screen...</option>
                                {project.screens.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                             </select>
                        </div>
                    )}
                    {(i.action === 'alert' || i.action === 'url') && (
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{i.action === 'alert' ? 'Message Text' : 'Target URL'}</label>
                             <input type="text" className="w-full p-3 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800" value={i.payload || ''} placeholder={i.action === 'alert' ? "Hello!" : "https://"} onChange={e => updateInteraction(i.id, { payload: e.target.value })} />
                        </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850 shrink-0">
           <div className="flex items-center gap-2">
                <LayersIcon size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase truncate max-w-[120px] tracking-tight">{element.name}</span>
           </div>
           <div className="flex items-center gap-2">
                <button onClick={() => updateElement({ locked: !element.locked })} className={`p-2 rounded-xl transition-colors ${element.locked ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>{element.locked ? <Lock size={16} /> : <Unlock size={16} />}</button>
                <button onClick={() => updateElement({ hidden: !element.hidden })} className={`p-2 rounded-xl transition-colors ${element.hidden ? 'bg-gray-100 text-gray-400 dark:bg-gray-700' : 'text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>{element.hidden ? <EyeOff size={16} /> : <Eye size={16} />}</button>
           </div>
      </div>
    </div>
  );
};