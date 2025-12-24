
import React from 'react';
import { Group, FolderOutput, Image as ImageIcon, Trash2, Ungroup, ListChecks, Layers, LayoutGrid } from 'lucide-react';

interface BulkActionsProps {
  label: 'Screens' | 'Layers' | 'Groups';
  count: number;
  onGroup: () => void;
  onMove: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  label,
  count,
  onGroup,
  onMove,
  onExport,
  onDelete,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-in fade-in duration-300">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                <ListChecks size={14} />
            </div>
            <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">Multi-Action</span>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-[28px] border border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center text-center space-y-2">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">{count}</div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{label} Selected</div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Workflow</label>
          
          {label !== 'Groups' && (
            <button 
                onClick={onGroup}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all shadow-sm active:scale-[0.98] group"
            >
                <div className="flex items-center gap-3">
                    <Group size={18} className="text-gray-400 group-hover:text-indigo-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Group Selection</span>
                </div>
            </button>
          )}

          <button 
            onClick={onMove}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all shadow-sm active:scale-[0.98] group"
          >
            <div className="flex items-center gap-3">
                {label === 'Groups' ? <Ungroup size={18} className="text-gray-400 group-hover:text-indigo-500" /> : <FolderOutput size={18} className="text-gray-400 group-hover:text-indigo-500" />} 
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{label === 'Groups' ? 'Release Content' : 'Elevate to Root'}</span>
            </div>
          </button>

          {label !== 'Groups' && (
            <button 
                onClick={onExport}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all shadow-sm active:scale-[0.98] group"
            >
                <div className="flex items-center gap-3">
                    <ImageIcon size={18} className="text-gray-400 group-hover:text-indigo-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Export Selection</span>
                </div>
            </button>
          )}

          <div className="h-px bg-gray-100 dark:bg-gray-700 my-6" />

          <button 
            onClick={onDelete}
            className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/40 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-100 transition-all shadow-sm active:scale-[0.98] group"
          >
            <div className="flex items-center gap-3">
                <Trash2 size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Delete All</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
