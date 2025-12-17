
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Project, ComponentType, Interaction, IconStyle } from '../types';
import { Trash2, Link as LinkIcon, ExternalLink, Sliders, Lock, Eye, EyeOff } from 'lucide-react';
import { IconSelector } from './IconSelector';

interface PropertiesPanelProps {
  project: Project;
  setProject: (p: Project) => void;
  selectedElementId: string | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  project,
  setProject,
  selectedElementId
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'interactions'>('style');
  const [showIconSelectorFor, setShowIconSelectorFor] = useState<string | null>(null);

  const activeScreen = (project.screens || []).find(s => s.id === project.activeScreenId);
  const element = activeScreen?.elements?.find(el => el.id === selectedElementId);

  if (!element) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-8 text-center">
        <p>Select an element to edit properties</p>
      </div>
    );
  }

  const isLocked = element.locked || activeScreen?.locked;
  const isHidden = element.hidden;

  const updateElement = (changes: Partial<typeof element> | { style: any } | { props: any }) => {
    // Hidden items can be unhidden, but generally shouldn't be edited visually if hidden
    // Locked items can't be edited
    if (isLocked) return; 

    const updatedScreens = (project.screens || []).map(s => {
      if (s.id !== project.activeScreenId) return s;
      return {
        ...s,
        elements: (s.elements || []).map(el => {
          if (el.id !== element.id) return el;
          if ('style' in changes) {
             return { ...el, style: { ...el.style, ...changes.style } };
          }
          if ('props' in changes) {
             return { ...el, props: { ...el.props, ...changes.props } };
          }
          return { ...el, ...changes };
        })
      };
    });
    setProject({ ...project, screens: updatedScreens });
  };

  const addInteraction = () => {
    if (isLocked) return;
    const newInteraction: Interaction = {
      id: Date.now().toString(),
      trigger: 'onClick',
      action: 'navigate',
      payload: project.screens[0]?.id || ''
    };
    const currentInteractions = element.interactions || [];
    updateElement({ interactions: [...currentInteractions, newInteraction] });
  };

  const updateInteraction = (id: string, field: keyof Interaction, value: any) => {
    if (isLocked) return;
    const updated = (element.interactions || []).map(i => i.id === id ? { ...i, [field]: value } : i);
    updateElement({ interactions: updated });
  };

  const removeInteraction = (id: string) => {
    if (isLocked) return;
    const updated = (element.interactions || []).filter(i => i.id !== id);
    updateElement({ interactions: updated });
  };

  const renderIconControl = (label: string, propName: string) => {
    const iconName = element.props[propName];
    const IconPreview = iconName && (LucideIcons as any)[iconName] ? (LucideIcons as any)[iconName] : null;
    const isSelectorOpen = showIconSelectorFor === propName;
    
    const stylePropName = propName === 'iconName' ? 'iconStyle' : `${propName}Style`;
    const iconStyle: IconStyle = element.props[stylePropName] || {};

    const updateIconStyle = (updates: Partial<IconStyle>) => {
        updateElement({ props: { [stylePropName]: { ...iconStyle, ...updates } } });
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-750 p-2 rounded border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{label}</label>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 overflow-hidden">
                    {IconPreview ? (
                        <IconPreview size={20} strokeWidth={iconStyle.strokeWidth || element.style.strokeWidth || 2} />
                    ) : (
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full opacity-20" />
                    )}
                </div>
                
                <input
                    type="text"
                    disabled={isLocked}
                    className="flex-1 min-w-0 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none disabled:opacity-50"
                    value={iconName || ''}
                    onChange={e => updateElement({ props: { [propName]: e.target.value } })}
                    placeholder="Icon name..."
                />

                {iconName && !isLocked && (
                    <button 
                        onClick={() => updateElement({ props: { [propName]: '' } })}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Clear Icon"
                    >
                        <Trash2 size={14} />
                    </button>
                )}

                <button 
                  onClick={() => setShowIconSelectorFor(isSelectorOpen ? null : propName)}
                  disabled={isLocked}
                  className={`px-3 py-2 text-xs rounded font-medium transition-colors border ${isSelectorOpen ? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'} disabled:opacity-50`}
                >
                  {isSelectorOpen ? 'Close' : 'Browse'}
                </button>
            </div>

            {isSelectorOpen && !isLocked && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <IconSelector 
                        selectedIcon={iconName} 
                        onSelect={(name) => updateElement({ props: { [propName]: name } })} 
                    />
                </div>
            )}

            {iconName && (
                <div className={`grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-600 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 dark:text-gray-400">Color</label>
                        <div className="flex gap-1 items-center">
                            <input
                                type="color"
                                className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 cursor-pointer p-0"
                                value={iconStyle.color || element.style.color || '#000000'}
                                onChange={e => updateIconStyle({ color: e.target.value })}
                            />
                             <input 
                                type="text"
                                className="flex-1 p-1 text-[10px] border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={iconStyle.color || element.style.color || ''}
                                placeholder="Inherit"
                                onChange={e => updateIconStyle({ color: e.target.value })}
                            />
                        </div>
                     </div>
                     
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 dark:text-gray-400">Size (px)</label>
                        <input
                            type="number"
                            className="w-full p-1 text-[10px] border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={iconStyle.size || ''}
                            placeholder="Inherit"
                            onChange={e => updateIconStyle({ size: Number(e.target.value) })}
                        />
                     </div>

                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 dark:text-gray-400">Stroke</label>
                        <input
                            type="number"
                            step="0.5"
                            className="w-full p-1 text-[10px] border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={iconStyle.strokeWidth || ''}
                            placeholder="Inherit"
                            onChange={e => updateIconStyle({ strokeWidth: Number(e.target.value) })}
                        />
                     </div>

                     <div className="space-y-1 flex items-center justify-between">
                         <label className="text-[10px] text-gray-500 dark:text-gray-400">Abs. Stroke</label>
                         <input 
                            type="checkbox"
                            checked={iconStyle.absoluteStrokeWidth || false}
                            onChange={e => updateIconStyle({ absoluteStrokeWidth: e.target.checked })}
                            className="w-4 h-4 rounded text-indigo-600"
                        />
                     </div>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      {isLocked && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-4 py-2 flex items-center justify-center gap-2 border-b border-red-100 dark:border-red-900/50">
              <Lock size={12} /> This element is locked.
          </div>
      )}
      {isHidden && !isLocked && (
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-4 py-2 flex items-center justify-center gap-2 border-b border-gray-200 dark:border-gray-600">
              <EyeOff size={12} /> This element is hidden.
          </div>
      )}

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'style' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Properties
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'interactions' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Interactions
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar ${isLocked ? 'opacity-75 pointer-events-none grayscale-[0.5]' : ''}`}>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {element.type.toUpperCase()}
                </div>
                <button 
                    onClick={() => updateElement({ hidden: !element.hidden })}
                    className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${element.hidden ? 'text-gray-400' : 'text-indigo-500'}`}
                    title={element.hidden ? "Unhide Element" : "Hide Element"}
                >
                    {element.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
           </div>
           <div className="text-[10px] text-gray-400 font-mono">
              {Math.round(element.width)}x{Math.round(element.height)}
           </div>
        </div>

        {activeTab === 'style' && (
          <>
            {element.type === 'text' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Text Content</label>
                <textarea
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  rows={2}
                  value={element.props.text || ''}
                  onChange={e => updateElement({ props: { text: e.target.value } })}
                />
              </div>
            )}
            
            {(element.type === 'checkbox' || element.type === 'radio' || element.type === 'toggle') && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="checked-prop"
                  checked={element.props.checked || false}
                  onChange={e => updateElement({ props: { checked: e.target.checked } })}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="checked-prop" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Checked / Active
                </label>
              </div>
            )}

            {element.type === 'navbar' && (
              <div className="space-y-4">
                 <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={element.props.title || ''}
                    onChange={e => updateElement({ props: { title: e.target.value } })}
                  />
                </div>
                {renderIconControl('Left Icon', 'leftIcon')}
                {renderIconControl('Right Icon', 'rightIcon')}
              </div>
            )}

            {element.type === 'button' && (
               <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Label</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={element.props.text || ''}
                      onChange={e => updateElement({ props: { text: e.target.value } })}
                    />
                  </div>
                  {renderIconControl('Icon', 'icon')}
              </div>
            )}

             {element.type === 'icon' && (
               <div className="space-y-4">
                  {renderIconControl('Icon', 'iconName')}
              </div>
            )}

            {element.type === 'image' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Image URL</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={element.props.src || ''}
                  onChange={e => updateElement({ props: { src: e.target.value } })}
                />
              </div>
            )}
            {(element.type === 'input' || element.type === 'textarea') && (
               <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Placeholder</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={element.props.placeholder || ''}
                  onChange={e => updateElement({ props: { placeholder: e.target.value } })}
                />
              </div>
            )}
             {element.type === 'card' && (
              <>
                 <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={element.props.title || ''}
                    onChange={e => updateElement({ props: { title: e.target.value } })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Subtitle</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={element.props.subtitle || ''}
                    onChange={e => updateElement({ props: { subtitle: e.target.value } })}
                  />
                </div>
              </>
            )}

            {/* Layout Controls */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
               <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Layout</div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-300">X</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={Math.round(element.x)}
                      onChange={e => updateElement({ x: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Y</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={Math.round(element.y)}
                      onChange={e => updateElement({ y: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Width</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={Math.round(element.width)}
                      onChange={e => updateElement({ width: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Height</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={Math.round(element.height)}
                      onChange={e => updateElement({ height: Number(e.target.value) })}
                    />
                  </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Global Style</div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Background</label>
                  <div className="flex gap-2">
                     <input
                      type="color"
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      value={element.style.backgroundColor || '#ffffff'}
                      onChange={e => updateElement({ style: { backgroundColor: e.target.value } })}
                    />
                    <input 
                      type="text" 
                      className="flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded text-sm uppercase bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={element.style.backgroundColor}
                      onChange={e => updateElement({ style: { backgroundColor: e.target.value } })}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Color (Default)</label>
                   <div className="flex gap-2">
                     <input
                      type="color"
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      value={element.style.color || '#000000'}
                      onChange={e => updateElement({ style: { color: e.target.value } })}
                    />
                     <input 
                      type="text" 
                      className="flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded text-sm uppercase bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={element.style.color}
                      onChange={e => updateElement({ style: { color: e.target.value } })}
                    />
                  </div>
                </div>

                 <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Radius</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full accent-indigo-600 dark:accent-indigo-500"
                    value={element.style.borderRadius || 0}
                    onChange={e => updateElement({ style: { borderRadius: Number(e.target.value) } })}
                  />
                </div>
                 <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-full accent-indigo-600 dark:accent-indigo-500"
                    value={element.style.opacity !== undefined ? element.style.opacity : 1}
                    onChange={e => updateElement({ style: { opacity: Number(e.target.value) } })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Base Font/Icon Size</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={element.style.fontSize || 14}
                    onChange={e => updateElement({ style: { fontSize: Number(e.target.value) } })}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'interactions' && (
          <div className="space-y-4">
            <button
              onClick={addInteraction}
              disabled={isLocked}
              className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <LinkIcon size={14} /> Add Interaction
            </button>

            {(element.interactions || []).map(interaction => (
              <div key={interaction.id} className="p-3 bg-gray-50 dark:bg-gray-750 rounded border border-gray-200 dark:border-gray-600 space-y-3 relative group">
                {!isLocked && (
                    <button 
                    onClick={() => removeInteraction(interaction.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                    <Trash2 size={14} />
                    </button>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Trigger</label>
                  <select
                    className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    value={interaction.trigger}
                    disabled={isLocked}
                    onChange={e => updateInteraction(interaction.id, 'trigger', e.target.value)}
                  >
                    <option value="onClick">On Click</option>
                  </select>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Action</label>
                   <select
                    className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    value={interaction.action}
                    disabled={isLocked}
                    onChange={e => updateInteraction(interaction.id, 'action', e.target.value)}
                  >
                    <option value="navigate">Navigate to Screen</option>
                    <option value="alert">Show Alert</option>
                  </select>
                </div>

                {interaction.action === 'navigate' && (
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Target</label>
                     <select
                      className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                      value={interaction.payload}
                      disabled={isLocked}
                      onChange={e => updateInteraction(interaction.id, 'payload', e.target.value)}
                    >
                      <option value="">Select Screen...</option>
                      {(project.screens || []).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                 {interaction.action === 'alert' && (
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Message</label>
                     <input
                      type="text"
                      className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                      value={interaction.payload || ''}
                      disabled={isLocked}
                      onChange={e => updateInteraction(interaction.id, 'payload', e.target.value)}
                      placeholder="Alert message..."
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
