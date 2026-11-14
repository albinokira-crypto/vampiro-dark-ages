import React from 'react';
import type { NivelVitalidade, TipoDanoVitalidade } from '../types';

interface VitalidadeSelectorProps {
  niveis: NivelVitalidade[];
  onChange?: (novosNiveis: NivelVitalidade[]) => void;
  readonly?: boolean;
}

export const VitalidadeSelector: React.FC<VitalidadeSelectorProps> = ({
  niveis,
  onChange,
  readonly = false,
}) => {
  const proximoTipo = (atual: TipoDanoVitalidade): TipoDanoVitalidade => {
    switch (atual) {
      case 'nenhum':
        return 'contusao'; // /
      case 'contusao':
        return 'letal'; // X
      case 'letal':
        return 'agravado'; // *
      case 'agravado':
        return 'nenhum';
      default:
        return 'nenhum';
    }
  };

  const handleAlternarDano = (id: string) => {
    if (readonly || !onChange) return;
    const atualizados = niveis.map((n) => {
      if (n.id === id) {
        return { ...n, dano: proximoTipo(n.dano) };
      }
      return n;
    });
    onChange(atualizados);
  };

  const simboloDano = (dano: TipoDanoVitalidade) => {
    switch (dano) {
      case 'contusao':
        return '/';
      case 'letal':
        return 'X';
      case 'agravado':
        return '✱';
      default:
        return '';
    }
  };

  const corDano = (dano: TipoDanoVitalidade) => {
    switch (dano) {
      case 'contusao':
        return 'text-amber-500 border-amber-600 bg-amber-950/40';
      case 'letal':
        return 'text-red-500 border-red-600 bg-red-950/40';
      case 'agravado':
        return 'text-purple-400 border-purple-500 bg-purple-950/60 font-black';
      default:
        return 'text-transparent border-[#4a3f44] bg-[#161214]';
    }
  };

  // Calcula o pior status de penalidade atual
  const nivelAfetado = [...niveis].reverse().find((n) => n.dano !== 'nenhum');
  const penalidadeAtual = nivelAfetado ? nivelAfetado.penalidade : '0';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
        <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
          Nível de Vitalidade
        </span>
        <span className="text-[11px] font-mono text-red-400">
          Penalidade Atual: <strong className="text-white text-xs">{penalidadeAtual}</strong>
        </span>
      </div>

      <div className="space-y-1">
        {niveis.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between py-0.5 px-2 rounded-xs hover:bg-white/5 transition-colors text-xs"
          >
            <span className="text-[#ded6cb] font-medium">{n.nome}</span>
            <div className="flex items-center gap-3">
              <span className="w-14 text-right font-mono text-[11px] text-[#a89f91]">
                {n.penalidade}
              </span>
              <button
                type="button"
                disabled={readonly}
                onClick={() => handleAlternarDano(n.id)}
                title={`Clique para alternar dano: ${n.dano} (Nenhum -> / Contusão -> X Letal -> ✱ Agravado)`}
                className={`
                  w-5 h-5 rounded-xs border text-xs font-black flex items-center justify-center transition-all
                  ${corDano(n.dano)}
                  ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-115 active:scale-95'}
                `}
              >
                {simboloDano(n.dano)}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted pt-1 border-t border-white/5">
        <span>Legenda:</span>
        <div className="flex items-center gap-2">
          <span className="text-amber-400">/ Contusão</span>
          <span className="text-red-400">X Letal</span>
          <span className="text-purple-400">✱ Agravado</span>
        </div>
      </div>
    </div>
  );
};
