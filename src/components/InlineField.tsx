import React, { useState, useEffect } from 'react';

interface InlineFieldProps {
  label?: string;
  value: string | number;
  onChange: (newValue: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'number';
  readonly?: boolean;
  className?: string;
  labelCls?: string;
}

export const InlineField: React.FC<InlineFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '—',
  multiline = false,
  rows = 3,
  type = 'text',
  readonly = false,
  className = '',
  labelCls = '',
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value ?? ''));

  useEffect(() => {
    setTempValue(String(value ?? ''));
  }, [value]);

  const handleBlur = () => {
    setEditing(false);
    if (tempValue !== String(value)) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(String(value ?? ''));
      setEditing(false);
    }
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {label && (
        <span
          className={`text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-0.5 ${labelCls}`}
        >
          {label}
        </span>
      )}

      {readonly ? (
        <div className="py-1 text-sm font-medium text-[#ded6cb] border-b border-white/5">
          {value || placeholder}
        </div>
      ) : editing ? (
        multiline ? (
          <textarea
            autoFocus
            rows={rows}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-[#1b1719] text-[#ded6cb] text-sm p-2 rounded-xs border border-[#8b0000] focus:outline-none focus:ring-1 focus:ring-[#8b0000] resize-y"
          />
        ) : (
          <input
            autoFocus
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-[#1b1719] text-[#ded6cb] text-sm px-1.5 py-0.5 rounded-xs border-b-2 border-[#8b0000] focus:outline-none focus:bg-[#241e21]"
          />
        )
      ) : (
        <div
          onClick={() => setEditing(true)}
          title="Clique para editar este campo diretamente"
          className={`
            cursor-pointer py-0.5 px-1 rounded-xs border-b border-[#3b181b] hover:border-[#8b0000] hover:bg-white/5 transition-all text-sm
            ${value ? 'text-[#ded6cb] font-semibold' : 'text-[#6e645c] italic'}
            ${multiline ? 'whitespace-pre-wrap min-h-[3rem]' : 'truncate'}
          `}
        >
          {value || placeholder}
        </div>
      )}
    </div>
  );
};
