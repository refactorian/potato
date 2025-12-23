
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface SliderControlProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "",
  className = ""
}) => {
  const handleTicker = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    const newVal = Math.min(max, Math.max(min, value + delta));
    onChange(newVal);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>}
        <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
              {value}{suffix}
            </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 group/slider bg-gray-50 dark:bg-gray-900 p-1 rounded-lg border border-gray-100 dark:border-gray-700">
        <button 
            onClick={(e) => handleTicker(e, -step)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-md transition-all active:scale-90 shadow-sm"
            title="Decrease"
        >
            <Minus size={12} />
        </button>
        
        <div className="relative flex-1 h-6 flex items-center mx-1">
            <div className="absolute inset-0 flex items-center">
                 <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all z-10"
            />
        </div>

        <button 
            onClick={(e) => handleTicker(e, step)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-md transition-all active:scale-90 shadow-sm"
            title="Increase"
        >
            <Plus size={12} />
        </button>
      </div>
    </div>
  );
};
