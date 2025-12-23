
import React, { useState } from 'react';
import { Hash, ChevronRight } from 'lucide-react';
import { ColorPickerModal } from './ColorPickerModal';

interface ColorPickerControlProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ColorPickerControl: React.FC<ColorPickerControlProps> = ({
  label,
  value = '#ffffff',
  onChange,
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>}
      
      <div 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm group cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
      >
        <div
          className="w-7 h-7 rounded border border-gray-200 dark:border-gray-600 shadow-inner shrink-0"
          style={{ backgroundColor: value }}
        />
        <div className="flex flex-1 items-center min-w-0 px-1">
            <span className="text-gray-400 mr-1 text-[10px] font-mono"><Hash size={10} /></span>
            <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 uppercase truncate">
              {value.replace('#', '')}
            </span>
        </div>
        <div className="p-1 text-gray-300 group-hover:text-indigo-500 transition-colors">
          <ChevronRight size={14} />
        </div>
      </div>

      <ColorPickerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        color={value}
        onChange={onChange}
        label={label}
      />
    </div>
  );
};
