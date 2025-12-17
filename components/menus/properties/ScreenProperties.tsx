
import React from 'react';
import { Palette, Image as ImageIcon, Trash2, FolderOutput, Eye, EyeOff } from 'lucide-react';
// Fix: Import Screen type from types.ts instead of assuming it's in lucide-react
import { Screen } from '../../../types';

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
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Screen Details</div>
          <button 
            onClick={() => onUpdate({ hidden: !screen.hidden })}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${screen.hidden ? 'text-gray-400' : 'text-indigo-600 dark:text-indigo-400'}`}
            title={screen.hidden ? "Unhide Screen" : "Hide Screen"}
          >
            {screen.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Name</label>
            <input 
              type="text" 
              value={screen.name} 
              onChange={(e) => onUpdate({ name: e.target.value })} 
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 outline-none"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2"><Palette size={12}/> Background Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={screen.backgroundColor} 
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })} 
                className="w-8 h-8 rounded border cursor-pointer p-0" 
              />
              <input 
                type="text" 
                value={screen.backgroundColor} 
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })} 
                className="flex-1 p-2 text-xs border rounded bg-white dark:bg-gray-700 dark:border-gray-600 uppercase font-mono" 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700 font-mono">
            <span>Layers: {screen.elements.length}</span>
            <span>ID: {screen.id.slice(0,8)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-850 mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className="text-[10px] font-bold text-gray-400 uppercase mb-3">Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onExport} className="flex items-center justify-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
            <ImageIcon size={14} /> Export
          </button>
          <button onClick={onDelete} className="flex items-center justify-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors shadow-sm">
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={onMoveToRoot} className="col-span-2 flex items-center justify-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
            <FolderOutput size={14} /> Move to Root
          </button>
        </div>
      </div>
    </div>
  );
};
