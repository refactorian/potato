
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberInputControlProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
}

export const NumberInputControl: React.FC<NumberInputControlProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "",
  className = ""
}) => {
  const handleIncrement = (delta: number) => {
    let newVal = value + delta;
    if (min !== undefined) newVal = Math.max(min, newVal);
    if (max !== undefined) newVal = Math.min(max, newVal);
    onChange(newVal);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>}
      <div className="flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
        <button
          onClick={() => handleIncrement(-step)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Minus size={12} />
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0 px-1">
            <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-transparent text-center text-xs font-bold text-gray-800 dark:text-gray-200 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {suffix && <span className="text-[10px] font-bold text-gray-400 ml-0.5">{suffix}</span>}
        </div>
        <button
          onClick={() => handleIncrement(step)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
};
