import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface OpcaoSelect {
  valor: string;
  label: string;
  grupo?: string;
  subtexto?: string;
}

interface SelectDarkAgesFieldProps {
  label: string;
  value: string;
  opcoes: (string | OpcaoSelect)[];
  onChange: (novoValor: string) => void;
  placeholder?: string;
  permitirPersonalizado?: boolean;
  readonly?: boolean;
  className?: string;
  badge?: string;
  dica?: string;
}

export const SelectDarkAgesField: React.FC<SelectDarkAgesFieldProps> = ({
  label,
  value,
  opcoes,
  onChange,
  placeholder = 'Selecione...',
  permitirPersonalizado = true,
  readonly = false,
  className = '',
  badge,
  dica,
}) => {
  // Normalizar opções
  const opcoesNormalizadas: OpcaoSelect[] = opcoes.map((op) => {
    if (typeof op === 'string') {
      return { valor: op, label: op };
    }
    return op;
  });

  const ehOpcaoConhecida = opcoesNormalizadas.some(
    (op) => op.valor.toLowerCase() === (value || '').toLowerCase()
  );

  const [modoCustom, setModoCustom] = useState<boolean>(
    !ehOpcaoConhecida && Boolean(value) && value.trim() !== ''
  );
  const [customTexto, setCustomTexto] = useState<string>(
    !ehOpcaoConhecida ? value || '' : ''
  );

  useEffect(() => {
    const conhecida = opcoesNormalizadas.some(
      (op) => op.valor.toLowerCase() === (value || '').toLowerCase()
    );
    if (!conhecida && Boolean(value) && value.trim() !== '') {
      setModoCustom(true);
      setCustomTexto(value);
    } else {
      setModoCustom(false);
    }
  }, [value, opcoesNormalizadas]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setModoCustom(true);
      onChange(customTexto || '');
    } else {
      setModoCustom(false);
      onChange(val);
    }
  };

  const handleCustomBlur = () => {
    if (customTexto.trim() !== value) {
      onChange(customTexto.trim());
    }
  };

  const grupos = Array.from(
    new Set(opcoesNormalizadas.map((op) => op.grupo).filter(Boolean))
  ) as string[];

  return (
    <div className={`relative flex flex-col ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91]">
            {label}
          </span>
          {badge && (
            <span className="text-[9px] font-sans text-[#d4af37] bg-[#2b1016] border border-[#5a1e26] px-1 rounded-xs">
              {badge}
            </span>
          )}
        </div>
      )}

      {readonly ? (
        <div className="w-full bg-[#140e11] border border-[#2d1217] px-2.5 py-1 text-xs text-[#ded6cb] font-semibold rounded-xs truncate">
          {value || placeholder}
        </div>
      ) : (
        <div className="space-y-1">
          <div className="relative">
            {/* Caixa visual: mostra apenas o nome limpo (ex: Brujah) quando fechada */}
            <div className="w-full bg-[#1e1317] hover:bg-[#251419] border border-[#522228] text-xs font-semibold text-[#ded6cb] px-2.5 py-1.5 rounded-xs flex items-center justify-between pr-8 transition-colors pointer-events-none truncate min-h-[30px]">
              <span className={value ? 'text-[#ded6cb]' : 'text-[#706456]'}>
                {modoCustom ? customTexto || 'Personalizado' : (value || placeholder)}
              </span>
            </div>

            {/* Select real invisível sobreposto para acionar as opções nativas completas */}
            <select
              value={modoCustom ? '__custom__' : value || ''}
              onChange={handleSelectChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
              <option value="" disabled className="bg-[#120a0e] text-[#706456]">
                {placeholder}
              </option>

              {grupos.length > 0 ? (
                <>
                  {grupos.map((grupo) => (
                    <optgroup
                      key={grupo}
                      label={`─── ${grupo.toUpperCase()} ───`}
                      className="bg-[#181115] text-[#d4af37] font-gothic font-bold"
                    >
                      {opcoesNormalizadas
                        .filter((op) => op.grupo === grupo)
                        .map((op) => (
                          <option
                            key={op.valor}
                            value={op.valor}
                            className="bg-[#120a0e] text-[#ded6cb] font-sans font-normal py-1"
                          >
                            {op.label}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                  {/* Opções sem grupo */}
                  {opcoesNormalizadas
                    .filter((op) => !op.grupo)
                    .map((op) => (
                      <option
                        key={op.valor}
                        value={op.valor}
                        className="bg-[#120a0e] text-[#ded6cb] font-sans font-normal py-1"
                      >
                        {op.label}
                      </option>
                    ))}
                </>
              ) : (
                opcoesNormalizadas.map((op) => (
                  <option
                    key={op.valor}
                    value={op.valor}
                    className="bg-[#120a0e] text-[#ded6cb] font-sans font-normal py-1"
                  >
                    {op.label}
                  </option>
                ))
              )}

              {permitirPersonalizado && (
                <option
                  value="__custom__"
                  className="bg-[#241318] text-[#ef4444] font-bold py-1"
                >
                  ✍️ Outro (Digitar personalizado...)
                </option>
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-[#d4af37] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {modoCustom && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <input
                type="text"
                value={customTexto}
                onChange={(e) => setCustomTexto(e.target.value)}
                onBlur={handleCustomBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCustomBlur();
                }}
                placeholder="Digite o nome personalizado..."
                className="w-full bg-[#181115] border border-[#ef4444]/60 focus:border-[#ef4444] text-xs text-white px-2 py-1 rounded-xs focus:outline-hidden"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCustomBlur}
                className="p-1 bg-[#8b0000] text-white rounded-xs hover:bg-[#a30d12] cursor-pointer"
                title="Confirmar"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {dica && <p className="text-[10px] text-[#8e8273] italic">{dica}</p>}
        </div>
      )}
    </div>
  );
};
