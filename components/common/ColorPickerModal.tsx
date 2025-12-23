
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { 
    X, Pipette, Hash, Copy, Check, History as HistoryIcon, 
    SwatchBook, Palette, Search, Ghost, Plus, Trash2, Bookmark, FolderPlus, 
    LayoutGrid, Heart, Eye as EyeIcon, MoreHorizontal
} from 'lucide-react';
import { COLOR_PALETTES } from '../../data/colors';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

type Tab = 'picker' | 'palettes' | 'custom';

interface ColorGroup {
    id: string;
    name: string;
    colors: string[];
}

// Predefined multi-color palettes for the 'Palettes' tab to match the requested design
const SYSTEM_PALETTES = [
    { name: 'Olive Garden Feast', colors: ['#556b2f', '#2d3319', '#fffbe6', '#d99c52', '#b8621e'], likes: '98.6K' },
    { name: 'Pastel Dreamland', colors: ['#cbb2e0', '#f7d1e3', '#ffafcc', '#bde0fe', '#a2d2ff'], likes: '88.9K' },
    { name: 'Fiery Ocean', colors: ['#800000', '#c21807', '#fffbe6', '#002633', '#6699bc'], likes: '35.8K' },
    { name: 'Golden Summer', colors: ['#ccd5ae', '#e9edc9', '#fefae0', '#faedcd', '#d4a373'], likes: '85.7K' },
    { name: 'Deep Blue Sea', colors: ['#1b4332', '#081c15', '#001219', '#8ecae6', '#f1f5f9'], likes: '7.9K' },
    { name: 'Ocean Breeze', colors: ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'], likes: '29K' },
];

const FALLBACK_HISTORY = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', 
    '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', 
    '#d946ef', '#f43f5e', '#64748b', '#94a3b8'
];

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  color,
  onChange,
  label
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('picker');
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [internalColor, setInternalColor] = useState(color);
  const [history, setHistory] = useState<string[]>([]);
  const [customGroups, setCustomGroups] = useState<ColorGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('potato_global_color_history');
    const savedGroups = localStorage.getItem('potato_global_custom_groups');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedGroups) setCustomGroups(JSON.parse(savedGroups));
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setInternalColor(color || '#ffffff');
      setNewGroupName('');
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
  }, [isOpen, color]);

  const saveGlobalState = (newHistory: string[], newGroups: ColorGroup[]) => {
      localStorage.setItem('potato_global_color_history', JSON.stringify(newHistory));
      localStorage.setItem('potato_global_custom_groups', JSON.stringify(newGroups));
  };

  const handleSave = () => {
    onChange(internalColor);
    if (internalColor !== 'transparent') {
        const filtered = history.filter(c => c.toLowerCase() !== internalColor.toLowerCase());
        const updatedHistory = [internalColor, ...filtered].slice(0, 14);
        setHistory(updatedHistory);
        saveGlobalState(updatedHistory, customGroups);
    }
    onClose();
  };

  const createGroup = () => {
      if (!newGroupName.trim()) return;
      const newGroup: ColorGroup = {
          id: Math.random().toString(36).substr(2, 9),
          name: newGroupName.trim(),
          colors: []
      };
      const updated = [...customGroups, newGroup];
      setCustomGroups(updated);
      saveGlobalState(history, updated);
      setNewGroupName('');
  };

  const deleteGroup = (id: string) => {
      const updated = customGroups.filter(g => g.id !== id);
      setCustomGroups(updated);
      saveGlobalState(history, updated);
  };

  const addColorToGroup = (groupId: string) => {
      if (internalColor === 'transparent') return;
      const updated = customGroups.map(g => {
          if (g.id === groupId && !g.colors.includes(internalColor)) {
              return { ...g, colors: [...g.colors, internalColor] };
          }
          return g;
      });
      setCustomGroups(updated);
      saveGlobalState(history, updated);
  };

  const removeColorFromGroup = (groupId: string, colorToRemove: string) => {
      const updated = customGroups.map(g => {
          if (g.id === groupId) {
              return { ...g, colors: g.colors.filter(c => c !== colorToRemove) };
          }
          return g;
      });
      setCustomGroups(updated);
      saveGlobalState(history, updated);
  };

  const handleCopy = () => {
    if (internalColor === 'transparent') return;
    navigator.clipboard.writeText(internalColor);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        setInternalColor(result.sRGBHex);
      } catch (e) {
        console.log("Picker cancelled");
      }
    }
  };

  const isLight = (hex: string) => {
    if (hex === 'transparent' || !hex.startsWith('#')) return true;
    try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    } catch {
        return true;
    }
  };

  const activeHistory = history.length > 0 ? history : FALLBACK_HISTORY;

  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-[4px] animate-in fade-in duration-300 px-4">
      <div 
        className="bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl w-full max-w-[440px] max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Inspector</h3>
                <h2 className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">{label || 'Color System'}</h2>
            </div>
            <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-800 rounded-2xl transition-all active:scale-90 border border-gray-100 dark:border-gray-700">
              <X size={18} />
            </button>
          </div>

          <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-[20px] mb-6 shadow-inner">
            {(['picker', 'palettes', 'custom'] as const).map(tab => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-2xl transition-all ${
                        activeTab === tab 
                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-lg border border-white dark:border-gray-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                 >
                    {tab === 'picker' && <Palette size={14} />}
                    {tab === 'palettes' && <SwatchBook size={14} />}
                    {tab === 'custom' && <LayoutGrid size={14} />}
                    <span>{tab}</span>
                 </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 min-h-0 pb-4">
          
          {/* PICKER TAB */}
          {activeTab === 'picker' && (
            <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
              <div 
                className="w-full h-40 rounded-[28px] overflow-hidden border-2 border-white dark:border-gray-700 shadow-xl relative group"
                style={{ 
                    backgroundColor: internalColor === 'transparent' ? '#fff' : internalColor,
                    backgroundImage: internalColor === 'transparent' 
                        ? 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)'
                        : 'none',
                    backgroundSize: '12px 12px'
                }}
              >
                <input 
                    type="color" 
                    value={internalColor.startsWith('#') ? internalColor : '#ffffff'} 
                    onChange={(e) => setInternalColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-crosshair z-10"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                    <div className="bg-white/90 dark:bg-gray-900/90 p-3 rounded-full shadow-lg border border-white dark:border-gray-700">
                        <Pipette size={20} className="text-indigo-600" />
                    </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <Hash size={16} className="text-gray-400 mr-2" />
                  <input 
                      type="text" 
                      value={internalColor === 'transparent' ? 'TRANSPARENT' : internalColor.replace('#', '').toUpperCase()} 
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setInternalColor(val === 'TRANSPARENT' ? 'transparent' : (val.startsWith('#') ? val : `#${val}`));
                      }}
                      className="w-full bg-transparent text-sm font-mono font-black outline-none uppercase text-gray-800 dark:text-gray-100"
                  />
                </div>
                <button 
                  onClick={handleEyeDropper}
                  className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm active:scale-90"
                >
                  <Pipette size={20} />
                </button>
              </div>

              <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <HistoryIcon size={12} className="text-indigo-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2.5">
                    {activeHistory.map((c, i) => (
                        <button 
                            key={`${c}-${i}`}
                            onClick={() => setInternalColor(c)}
                            className={`aspect-square rounded-xl border-2 transition-all hover:scale-110 shadow-sm ${internalColor.toLowerCase() === c.toLowerCase() ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-white dark:border-gray-800'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    </div>
              </div>
            </div>
          )}

          {/* PALETTES TAB (CARD DESIGN) */}
          {activeTab === 'palettes' && (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-300 pr-1">
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text"
                    placeholder="Search blueprints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold"
                  />
               </div>

               <div className="space-y-6">
                  {SYSTEM_PALETTES.map((pal) => (
                    <div key={pal.name} className="space-y-2 group/pal">
                        <div className="flex h-20 w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800">
                            {pal.colors.map((c, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setInternalColor(c)}
                                    className="flex-1 hover:flex-[1.5] transition-all duration-300 relative group/color"
                                    style={{ backgroundColor: c }}
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/10 transition-colors" />
                                    <span className="absolute bottom-1 left-1 opacity-0 group-hover/color:opacity-100 transition-opacity text-[7px] font-mono text-white bg-black/20 px-1 rounded backdrop-blur-sm">{c}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 tracking-tight">{pal.name}</span>
                            <div className="flex items-center gap-3 text-gray-400">
                                <span className="flex items-center gap-1 text-[9px] font-bold"><Heart size={10} /> {pal.likes}</span>
                                <span className="flex items-center gap-1 text-[9px] font-bold"><EyeIcon size={10} /></span>
                                <MoreHorizontal size={10} />
                            </div>
                        </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* CUSTOM TAB (COLLECTIONS) */}
          {activeTab === 'custom' && (
            <div className="space-y-6 animate-in fade-in duration-300 pr-1">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-800/40 space-y-3">
                    <div className="flex items-center gap-3">
                        <FolderPlus size={16} className="text-indigo-500" />
                        <input 
                            type="text" 
                            placeholder="New Collection Name..."
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && createGroup()}
                            className="flex-1 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-indigo-400"
                        />
                        <button onClick={createGroup} disabled={!newGroupName.trim()} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-30 active:scale-90 shadow-lg shadow-indigo-600/20">
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <div className="space-y-6 pb-2">
                    {customGroups.length > 0 ? customGroups.map(group => (
                        <div key={group.id} className="bg-gray-50/50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bookmark size={12} className="text-amber-500" />
                                    <span className="text-xs font-black uppercase text-gray-600 dark:text-gray-300">{group.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => addColorToGroup(group.id)} disabled={internalColor === 'transparent'} className="p-1.5 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors disabled:opacity-20" title="Add staged color">
                                        <Plus size={14} strokeWidth={3} />
                                    </button>
                                    <button onClick={() => deleteGroup(group.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-6 gap-2">
                                {group.colors.map((c, i) => (
                                    <div key={`${c}-${i}`} className="relative group/color">
                                        <button 
                                            onClick={() => setInternalColor(c)}
                                            className={`aspect-square w-full rounded-lg border-2 transition-all hover:scale-110 ${internalColor === c ? 'border-indigo-500 scale-105 shadow-md' : 'border-white dark:border-gray-700'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                        <button onClick={() => removeColorFromGroup(group.id, c)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/color:opacity-100 shadow-md">
                                            <X size={8} strokeWidth={4} />
                                        </button>
                                    </div>
                                ))}
                                {group.colors.length === 0 && (
                                    <div className="col-span-6 flex items-center justify-center py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">No Colors</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 opacity-50 bg-gray-50/50 dark:bg-gray-800/20 rounded-[32px] border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <LayoutGrid size={32} strokeWidth={1} className="mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-center">Collections list empty</p>
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-800 space-y-5 shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div 
                        className="w-14 h-14 rounded-2xl shadow-xl border-4 border-white dark:border-gray-700 shrink-0 relative overflow-hidden" 
                        style={{ 
                            backgroundColor: internalColor === 'transparent' ? 'transparent' : internalColor,
                            backgroundImage: internalColor === 'transparent' 
                                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                                : 'none',
                            backgroundSize: '8px 8px'
                        }} 
                    >
                        {internalColor === 'transparent' && <div className="absolute inset-0 flex items-center justify-center text-gray-400"><Ghost size={20}/></div>}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight font-mono leading-none">
                                {internalColor === 'transparent' ? 'NONE' : internalColor.toUpperCase()}
                            </span>
                            {internalColor !== 'transparent' && (
                                <button onClick={handleCopy} className="p-1 text-gray-400 hover:text-indigo-500 active:scale-90" title="Copy Hex">
                                    {copySuccess ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border shadow-sm ${isLight(internalColor) ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30' : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30'}`}>
                                {isLight(internalColor) ? 'Light' : 'Dark'}
                            </div>
                            <div className="px-2 py-0.5 rounded-lg bg-green-50 text-green-600 text-[8px] font-black border border-green-100 dark:bg-green-900/30 uppercase tracking-tighter shadow-sm">
                                AA COMPLIANT
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setInternalColor('transparent')}
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all active:scale-95 ${internalColor === 'transparent' ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-400'}`}
                >
                    <Ghost size={20} />
                    <span className="text-[8px] font-black uppercase mt-0.5">NONE</span>
                </button>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={onClose}
                    className="flex-1 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 active:scale-95 shadow-sm"
                >
                    Discard
                </button>
                <button 
                    onClick={handleSave}
                    className="flex-[1.5] py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 active:scale-95 border border-indigo-500"
                >
                    Set Color
                </button>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
