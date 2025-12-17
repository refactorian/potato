
import React from 'react';
import { Group, FolderOutput, Image as ImageIcon, Trash2, Ungroup } from 'lucide-react';

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
    <div className="flex flex-col h-full p-4 animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
        Bulk Actions
      </div>
      <div className="text-xs text-gray-500 mb-6">{count} {label} selected</div>
      
      <div className="space-y-3">
        {label !== 'Groups' && (
          <button 
            onClick={onGroup}
            className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            <Group size={18} /> Group Selection
          </button>
        )}
        <button 
          onClick={onMove}
          className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label === 'Groups' ? <Ungroup size={18} /> : <FolderOutput size={18} />} 
          {label === 'Groups' ? 'Ungroup Selected' : 'Move to Root'}
        </button>
        {label !== 'Groups' && (
          <button 
            onClick={onExport}
            className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            <ImageIcon size={18} /> Export Selection
          </button>
        )}
        <button 
          onClick={onDelete}
          className="w-full flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium text-red-600 dark:text-red-400"
        >
          <Trash2 size={18} /> Delete Selected
        </button>
      </div>
    </div>
  );
};
