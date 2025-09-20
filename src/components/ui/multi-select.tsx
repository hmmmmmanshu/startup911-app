"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className = "",
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== option));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Input */}
      <div
        className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-pointer transition-colors ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'focus:border-green-500 hover:border-gray-500'
        } ${isOpen ? 'border-green-500' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap items-center gap-1 min-h-[20px]">
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            <>
              {value.map(option => (
                <span
                  key={option}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-300 text-sm rounded-md border border-green-600/30"
                >
                  {option}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => removeOption(option, e)}
                      className="hover:text-green-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </>
          )}
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map(option => {
            const isSelected = value.includes(option);
            return (
              <div
                key={option}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                  isSelected 
                    ? 'bg-green-600/20 text-green-300' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => toggleOption(option)}
              >
                <span>{option}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
