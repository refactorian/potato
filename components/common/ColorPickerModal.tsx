
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, Pipette, Hash, Copy, Check, Info, History, SwatchBook, Palette, SlidersHorizontal, Search, Sun, Moon } from 'lucide-react';
import { COLOR_PALETTES, ColorSwatch } from '../../data/colors';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

type Tab = 'picker' | 'swatches';
type FilterStyle = 'all' | 'flat' | 'material' | 'neo' | 'pastel' | 'brand';
type FilterTone = 'all' | 'light' | 'dark';

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
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const initialColorRef = useRef(color);
  
  // Swatch Filtering
  const [styleFilter, setStyleFilter] = useState<FilterStyle>('all');
  const [toneFilter, setToneFilter] = useState<FilterTone>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    // Load recents from localStorage
    const saved = localStorage.getItem('potato_recent_colors');
    if (saved) setRecentColors(JSON.parse(saved));
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      initialColorRef.current = color;
      setActiveTab('picker');
    }
  }, [isOpen]);

  const addToRecents = (newColor: string) => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== newColor.toLowerCase());
      const updated = [newColor, ...filtered].slice(0, 16);
      localStorage.setItem('potato_recent_colors', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        handleColorSelect(result.sRGBHex);
      } catch (e) {
        console.log("Picker cancelled");
      }
    }
  };

  const handleColorSelect = (newColor: string) => {
    onChange(newColor);
  };

  const handleCancel = () => {
    onChange(initialColorRef.current);
    onClose();
  };

  const handleSave = () => {
    addToRecents(color);
    onClose();
  };

  // --- Helper to determine if hex is "light" or "dark" ---
  const isLight = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const filteredSwatches = useMemo(() => {
    return COLOR_PALETTES.filter(s => {
      const matchesStyle = styleFilter === 'all' || s.style === styleFilter;
      const matchesTone = toneFilter === 'all' || (toneFilter === 'light' ? isLight(s.hex) : !isLight(s.hex));
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.hex.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStyle && matchesTone && matchesSearch;
    });
  }, [styleFilter, toneFilter, searchQuery]);

  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-gray-850 rounded-[28px] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.6)] w-full max-w-[380px] overflow-hidden border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-2xl shadow-inner border border-black/5 dark:border-white/10 transition-colors" 
                style={{ backgroundColor: color }} 
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{label || 'Inspector'}</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  {color.toUpperCase()}
                  <button onClick={handleCopy} className="text-gray-400 hover:text-indigo-500 transition-colors">
                    {copySuccess ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </span>
              </div>
            </div>
            <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full transition-all hover:rotate-90">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
            <button 
              onClick={() => setActiveTab('picker')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'picker' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500'}`}
            >
              <Palette size={14} /> Picker
            </button>
            <button 
              onClick={() => setActiveTab('swatches')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'swatches' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500'}`}
            >
              <SwatchBook size={14} /> Swatches
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 h-[400px] overflow-y-auto custom-scrollbar">
          {activeTab === 'picker' ? (
            <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
              {/* Visual Spectrum */}
              <div className="relative group/spectrum">
                 <div 
                    className="w-full h-44 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner relative"
                    style={{ 
                        backgroundColor: color,
                        backgroundImage: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)'
                    }}
                 >
                    <input 
                        type="color" 
                        value={color.startsWith('#') ? color : '#ffffff'} 
                        onChange={(e) => handleColorSelect(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-crosshair z-10"
                    />
                 </div>
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover/spectrum:opacity-100 transition-opacity bg-black/20 rounded-2xl backdrop-blur-[1px]">
                    <span className="bg-white/90 dark:bg-gray-900/90 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-lg tracking-widest border border-white/20">Refine Spectrum</span>
                 </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-4 flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <Hash size={14} className="text-gray-400 mr-2" />
                  <input 
                      type="text" 
                      value={color.replace('#', '').toUpperCase()} 
                      onChange={(e) => handleColorSelect(`#${e.target.value.replace('#','')}`)}
                      className="w-full bg-transparent text-sm font-mono font-bold outline-none uppercase text-gray-800 dark:text-gray-100"
                  />
                </div>
                <button 
                  onClick={handleEyeDropper}
                  className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:text-indigo-500 hover:border-indigo-500 transition-all shadow-sm"
                  title="Eye Dropper"
                >
                  <Pipette size={20} />
                </button>
              </div>

              {/* Contrast Gauge */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Info size={10} /> Accessibility</span>
                   <div className="flex gap-1">
                      <div className={`px-2 py-0.5 rounded text-[9px] font-black ${isLight(color) ? 'bg-gray-200 text-gray-600' : 'bg-indigo-500 text-white'}`}>WCAG</div>
                      <div className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[9px] font-black border border-green-500/20">AA</div>
                   </div>
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white" style={{ color }}><span className="font-bold text-sm">A</span></div>
                   <div className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center" style={{ backgroundColor: color, color: isLight(color) ? '#000' : '#fff' }}><span className="font-bold text-sm">A</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-200">
               {/* Swatch Filters */}
               <div className="space-y-3 p-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text"
                      placeholder="Search colors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'brand', 'flat', 'material', 'neo', 'pastel'] as const).map(f => (
                      <button 
                        key={f} 
                        onClick={() => setStyleFilter(f)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${styleFilter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setToneFilter('all')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 border transition-all ${toneFilter === 'all' ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600' : 'border-transparent text-gray-400'}`}><SlidersHorizontal size={12}/> All</button>
                     <button onClick={() => setToneFilter('light')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 border transition-all ${toneFilter === 'light' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'border-transparent text-gray-400'}`}><Sun size={12}/> Light</button>
                     <button onClick={() => setToneFilter('dark')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 border transition-all ${toneFilter === 'dark' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'border-transparent text-gray-400'}`}><Moon size={12}/> Dark</button>
                  </div>
               </div>

               {/* Grid */}
               <div className="grid grid-cols-6 gap-2 pt-2">
                  {filteredSwatches.map((s, idx) => (
                    <button 
                      key={`${s.hex}-${idx}`}
                      onClick={() => handleColorSelect(s.hex)}
                      title={s.name}
                      className={`aspect-square rounded-lg border transition-all hover:scale-110 active:scale-95 shadow-sm ${color.toLowerCase() === s.hex.toLowerCase() ? 'ring-2 ring-indigo-500 border-white' : 'border-gray-200 dark:border-gray-700'}`}
                      style={{ backgroundColor: s.hex }}
                    />
                  ))}
                  {filteredSwatches.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 text-xs italic">
                       No matching swatches found.
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Recently Used Section - Always Visible if not empty */}
          {recentColors.length > 0 && (
             <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={12} /> Recently Used
                  </span>
                </div>
                <div className="grid grid-cols-8 gap-2">
                   {recentColors.map((c, i) => (
                      <button 
                        key={`${c}-${i}`}
                        onClick={() => handleColorSelect(c)}
                        className={`aspect-square rounded-md border transition-all hover:scale-110 ${color.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-indigo-500 border-white' : 'border-gray-100 dark:border-gray-700'}`}
                        style={{ backgroundColor: c }}
                      />
                   ))}
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-700 flex gap-3">
           <button 
            onClick={handleCancel}
            className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] hover:bg-gray-50 dark:hover:bg-gray-700"
           >
            Discard
           </button>
           <button 
            onClick={handleSave}
            className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] hover:shadow-indigo-600/30"
           >
            Set Color
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
