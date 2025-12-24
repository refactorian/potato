
import React, { useState } from 'react';
import { Eye, EyeOff, Ungroup, Image as ImageIcon, Trash2, Info, FolderOpen, MoreHorizontal, Settings2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'info' | 'ops'>('info');

  const Label = ({ children }: { children?: React.ReactNode }) => (
    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-1.5 block px-1">
      {children}
    </label>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 animate-in fade-in duration-300">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                <FolderOpen size={14} />
            </div>
            <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">Group Settings</span>
        </div>
      </div>

      <div className="flex border-b border-gray-100 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-2.5 flex items-center justify-center transition-all border-b-2 ${activeTab === 'info' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-gray-400 border-transparent'}`} title="General Info">
              <Info size={18} />
          </button>
          <button onClick={() => setActiveTab('ops')} className={`flex-1 py-2.5 flex items-center justify-center transition-all border-b-2 ${activeTab === 'ops' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-gray-400 border-transparent'}`} title="Maintenance">
              <Settings2 size={18} />
          </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === 'info' ? (
          <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
            <div className="space-y-1.5">
                <Label>Folder Identity</Label>
                <input 
                    type="text" 
                    value={group.name} 
                    onChange={(e) => onUpdate({ name: e.target.value })} 
                    className="w-full p-2.5 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold shadow-sm"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                    <div className="font-black text-gray-900 dark:text-gray-200 text-lg">{childCounts.screens}</div>
                    <div className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Screens</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                    <div className="font-black text-gray-900 dark:text-gray-200 text-lg">{childCounts.groups}</div>
                    <div className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Sub-groups</div>
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-2 duration-200">
            <Label>Management Actions</Label>
            <button onClick={onUngroup} className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm">
                <span>Release Children</span>
                <Ungroup size={16} className="text-indigo-500" />
            </button>
            <button onClick={onExport} className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm">
                <span>Export Package</span>
                <ImageIcon size={16} className="text-indigo-500" />
            </button>
            <button onClick={onDelete} className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-100 transition-all shadow-sm">
                <span>Destroy Group</span>
                <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850 shrink-0">
           <div className="flex items-center gap-1.5">
                <button onClick={() => onUpdate({ hidden: !group.hidden })} className={`p-2 rounded-xl transition-all shadow-sm ${group.hidden ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' : 'bg-white dark:bg-gray-750 text-gray-400 hover:text-indigo-600 border border-gray-100 dark:border-gray-700'}`}>
                    {group.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase truncate tracking-widest">{group.name}</span>
      </div>
    </div>
  );
};
