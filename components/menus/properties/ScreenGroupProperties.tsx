
import React from 'react';
import { Eye, EyeOff, Ungroup, Image as ImageIcon, Trash2 } from 'lucide-react';
// Fix: Import ScreenGroup type from types.ts instead of assuming it's in lucide-react
import { ScreenGroup } from '../../../types';

interface ScreenGroupPropertiesProps {
  group: ScreenGroup;
  childCounts: { screens: number; groups: number };
  onUpdate: (updates: Partial<ScreenGroup>) => void;
  onUngroup: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export const ScreenGroupProperties: React.FC<ScreenGroupPropertiesProps> = ({
  group,
  childCounts,
  onUpdate,
  onUngroup,
  onExport,
  onDelete,
}) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Group Details</div>
          <button 
            onClick={() => onUpdate({ hidden: !group.hidden })}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${group.hidden ? 'text-gray-400' : 'text-indigo-600 dark:text-indigo-400'}`}
          >
            {group.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Group Name</label>
            <input 
              type="text" 
              value={group.name} 
              onChange={(e) => onUpdate({ name: e.target.value })} 
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 outline-none font-medium"
            />
          </div>
          
          <div className="pt-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Contains</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                    <div className="font-bold text-gray-800 dark:text-gray-200">{childCounts.screens}</div>
                    <div>Screens</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                    <div className="font-bold text-gray-800 dark:text-gray-200">{childCounts.groups}</div>
                    <div>Sub-groups</div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-850 mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className="text-[10px] font-bold text-gray-400 uppercase mb-3">Actions</div>
        <div className="space-y-2">
          <button onClick={onUngroup} className="w-full flex items-center justify-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
            <Ungroup size={14} /> Ungroup Content
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onExport} className="flex items-center justify-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
              <ImageIcon size={14} /> Export
            </button>
            <button onClick={onDelete} className="flex items-center justify-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors shadow-sm">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
