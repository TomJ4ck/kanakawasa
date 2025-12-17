import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  id: string;
  label: string;
  value: number | '';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  type?: 'number' | 'text';
  placeholder?: string;
  min?: number;
  max?: number;
  helperText?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  icon: Icon,
  type = 'number',
  placeholder = ' ',
  min,
  max,
  helperText,
}) => {
  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444746] pointer-events-none z-10">
        <Icon size={20} />
      </div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="peer block w-full rounded-[4px] border border-[#747775] bg-transparent pl-10 pr-4 py-3.5 text-[16px] text-[#1F1F1F] outline-none transition-colors focus:border-[#0B57D0] focus:ring-1 focus:ring-[#0B57D0]"
      />
      <label
        htmlFor={id}
        className="absolute left-10 top-3.5 z-10 origin-[0] -translate-y-6 scale-75 transform bg-white px-1 text-sm text-[#444746] duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#0B57D0]"
      >
        {label}
      </label>
      {helperText && (
        <div className="mt-1.5 pl-1">
          {helperText}
        </div>
      )}
    </div>
  );
};

