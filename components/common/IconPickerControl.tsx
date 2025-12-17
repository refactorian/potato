
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Trash2, ChevronDown, Image } from 'lucide-react';
import { IconPickerModal } from '../IconPickerModal';

interface IconPickerControlProps {
  label: string;
  iconName: string | undefined;
  onChange: (name: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

export const IconPickerControl: React.FC<IconPickerControlProps> = ({
  label,
  iconName,
  onChange,
  onClear,
  disabled = false,
  variant = 'default'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const IconPreview = iconName && (LucideIcons as any)[iconName] ? (LucideIcons as any)[iconName] : null;

  if (variant === 'compact') {
      return (
        <div className="relative">
            <button
                onClick={() => !disabled && setIsModalOpen(true)}
                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all overflow-hidden ${
                    isModalOpen 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer bg-white dark:bg-gray-800'}`}
                title="Change Icon"
            >
                {IconPreview ? (
                    <IconPreview size={32} className="text-indigo-600 dark:text-indigo-400" />
                ) : (
                    <Image size={24} className="text-gray-300 dark:text-gray-600" />
                )}
            </button>
            
            {iconName && onClear && !disabled && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                    className="absolute -top-1.5 -right-1.5 bg-white dark:bg-gray-700 text-red-500 border border-gray-200 dark:border-gray-600 rounded-full p-1 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Remove Icon"
                >
                    <Trash2 size={10} />
                </button>
            )}

            <IconPickerModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(name) => {
                    onChange(name);
                    setIsModalOpen(false);
                }}
            />
        </div>
      );
  }

  // Default Variant (Control Row)
  return (
    <div className="space-y-2">
      {label && <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{label}</label>
      </div>}

      <div className="bg-gray-50 dark:bg-gray-750 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <button
            onClick={() => !disabled && setIsModalOpen(true)}
            className="w-10 h-10 shrink-0 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:border-indigo-400 transition-colors"
        >
          {IconPreview ? (
            <IconPreview size={20} className="text-indigo-600 dark:text-indigo-400" />
          ) : (
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded-full" />
          )}
        </button>

        <div 
            onClick={() => !disabled && setIsModalOpen(true)}
            className="flex-1 min-w-0 cursor-pointer"
        >
            <div className="text-xs text-gray-500 dark:text-gray-400">Icon</div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{iconName || 'None Selected'}</div>
        </div>

        {iconName && onClear && !disabled && (
          <button
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Clear Icon"
          >
            <Trash2 size={14} />
          </button>
        )}

        <button
          onClick={() => !disabled && setIsModalOpen(true)}
          className={`p-2 text-gray-400 hover:text-indigo-600 transition-colors ${disabled ? 'opacity-50' : ''}`}
          disabled={disabled}
        >
           <ChevronDown size={16} />
        </button>
      </div>

      <IconPickerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(name) => {
            onChange(name);
            setIsModalOpen(false);
        }}
      />
    </div>
  );
};
