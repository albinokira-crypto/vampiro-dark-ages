import React, { useState, useEffect, useRef } from 'react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(rows * 24, textareaRef.current.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    setTempValue(String(value ?? ''));
  }, [value]);

  useEffect(() => {
    if (editing && multiline) {
      autoResize();
    }
  }, [editing, multiline, tempValue]);

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
          className={`text-[9.5px] sm:text-[11px] font-gothic font-bold uppercase tracking-normal sm:tracking-wider text-[#a89f91] mb-0.5 truncate ${labelCls}`}
        >
          {label}
        </span>
      )}

      {readonly ? (
        <div className="py-0.5 text-xs sm:text-sm font-medium text-[#ded6cb] border-b border-white/5 whitespace-pre-wrap leading-relaxed">
          {value || placeholder}
        </div>
      ) : editing ? (
        multiline ? (
          <textarea
            ref={textareaRef}
            autoFocus
            rows={rows}
            value={tempValue}
            onChange={(e) => {
              setTempValue(e.target.value);
              autoResize();
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-[#1b1719] text-[#ded6cb] text-xs sm:text-sm p-2.5 rounded-xs border border-[#8b0000] focus:outline-none focus:ring-1 focus:ring-[#8b0000] resize-y leading-relaxed transition-[height] duration-75"
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
            className="w-full bg-[#1b1719] text-[#ded6cb] text-xs sm:text-sm px-1.5 py-0.5 rounded-xs border-b-2 border-[#8b0000] focus:outline-none focus:bg-[#241e21]"
          />
        )
      ) : (
        <div
          onClick={() => setEditing(true)}
          title="Clique para editar este campo diretamente"
          className={`
            cursor-pointer py-1 px-1.5 rounded-xs border-b border-[#3b181b] hover:border-[#8b0000] hover:bg-white/5 transition-all text-xs sm:text-sm leading-relaxed
            ${value ? 'text-[#ded6cb] font-normal' : 'text-[#6e645c] italic'}
            ${multiline ? 'whitespace-pre-wrap min-h-[3rem]' : 'truncate'}
          `}
        >
          {value || placeholder}
        </div>
      )}
    </div>
  );
};
