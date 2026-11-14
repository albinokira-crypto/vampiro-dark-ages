import React from 'react';

interface QuadradosStatusProps {
  total: number;
  gastos: number; // quantos estão marcados com 'X' (gastos)
  onChange?: (novosGastos: number) => void;
  readonly?: boolean;
  label?: string;
}

export const QuadradosStatus: React.FC<QuadradosStatusProps> = ({
  total,
  gastos,
  onChange,
  readonly = false,
  label,
}) => {
  const caixas = Array.from({ length: total }, (_, i) => i + 1);

  const handleClick = (idx: number) => {
    if (readonly || !onChange) return;
    // Se clicar numa caixa já gasta: se for a última, desmarca uma; senão marca até ela
    if (idx === gastos) {
      onChange(gastos - 1);
    } else {
      onChange(idx);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex justify-between items-center text-xs font-semibold text-[#a89f91]">
          <span>{label}</span>
          <span className="font-mono text-[11px] text-[#ef4444]">
            Disponível: {Math.max(0, total - gastos)} / {total}
          </span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1.5 select-none">
        {caixas.map((n) => {
          const gasto = n <= gastos;
          return (
            <button
              key={n}
              type="button"
              disabled={readonly}
              onClick={() => handleClick(n)}
              title={gasto ? `Ponto ${n}: Gasto (clique para recuperar)` : `Ponto ${n}: Disponível (clique para gastar)`}
              className={`
                w-4 h-4 sm:w-5 sm:h-5 rounded-xs border text-xs font-black flex items-center justify-center transition-all duration-150
                ${
                  gasto
                    ? 'border-[#991b1b] bg-[#3b0d10] text-[#ef4444]'
                    : 'border-[#4a3f44] bg-[#161214] text-transparent hover:border-[#8b262d]'
                }
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'}
              `}
            >
              {gasto ? '✕' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};
