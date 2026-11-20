import React, { useState } from 'react';
import type { Personagem, User } from '../types';
import { storageService } from '../services/storage';
import {
  Award,
  X,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface ModalAjustarXPProps {
  ficha: Personagem;
  usuarioAtual: User;
  onFechar: () => void;
  onSalvar: (fichaAtualizada: Personagem) => void;
}

export const ModalAjustarXP: React.FC<ModalAjustarXPProps> = ({
  ficha,
  usuarioAtual,
  onFechar,
  onSalvar,
}) => {
  const [modo, setModo] = useState<'adicionar_subtrair' | 'definir_exato'>('adicionar_subtrair');
  const [quantidadeDelta, setQuantidadeDelta] = useState<number>(5);
  const [novoSaldoExato, setNovoSaldoExato] = useState<number>(ficha.xp?.atual || 0);
  const [motivo, setMotivo] = useState<string>('');

  const saldoAtual = Number(ficha.xp?.atual) || 0;

  // Cálculo do saldo previsto
  const saldoFinalPrevisto =
    modo === 'adicionar_subtrair'
      ? Math.max(0, saldoAtual + (Number(quantidadeDelta) || 0))
      : Math.max(0, Number(novoSaldoExato) || 0);

  const diferencaEfetiva = saldoFinalPrevisto - saldoAtual;

  const handleAplicar = () => {
    if (diferencaEfetiva === 0) {
      alert('Nenhuma alteração de XP foi feita.');
      return;
    }

    const agora = new Date();
    const dataHoraFormatada = `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const autorStr = usuarioAtual.role === 'mestre' ? 'Mestre' : usuarioAtual.nome;
    const motivoFinal = motivo.trim() || (diferencaEfetiva > 0 ? 'Concessão de XP' : 'Correção / Dedução de XP');

    let linhaHistorico = '';
    if (diferencaEfetiva > 0) {
      linhaHistorico = `+ ${diferencaEfetiva} XP: ${motivoFinal} (${dataHoraFormatada} por ${autorStr})`;
    } else {
      linhaHistorico = `- ${Math.abs(diferencaEfetiva)} XP: ${motivoFinal} (${dataHoraFormatada} por ${autorStr})`;
    }

    const atualizada: Personagem = {
      ...ficha,
      xp: {
        ...ficha.xp,
        atual: saldoFinalPrevisto,
        historico: linhaHistorico + (ficha.xp?.historico ? '\n' + ficha.xp.historico : ''),
      },
      updatedAt: agora.toISOString(),
    };

    onSalvar(atualizada);
    storageService.salvarPersonagem(atualizada);

    storageService.registrarLogAlteracao({
      personagemId: ficha.id,
      personagemNome: ficha.nome,
      jogadorNome: ficha.jogador || usuarioAtual.nome,
      tipo: 'xp',
      descricao: `Ajuste de XP (${diferencaEfetiva > 0 ? '+' : ''}${diferencaEfetiva} XP): ${motivoFinal}`,
      detalhes: `Saldo anterior: ${saldoAtual} XP | Novo saldo: ${saldoFinalPrevisto} XP (por ${autorStr})`,
    });

    onFechar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#120a0e] border border-[#8b0000] w-full max-w-md rounded-sm shadow-2xl p-5 space-y-4 text-[#ded6cb] relative">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h3 className="text-sm sm:text-base font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                Ajustar Experiência (XP)
              </h3>
              <span className="text-[11px] text-[#a89f91] font-serif">
                {ficha.nome || 'Personagem'} ({ficha.jogador ? `Jogador: ${ficha.jogador}` : 'NPC'})
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-[#8e8273] hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo Atual */}
        <div className="grid grid-cols-2 gap-2 bg-[#1a0e14] border border-[#2d1217] p-3 rounded-xs text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8e8273] block">Saldo Atual</span>
            <span className="text-lg font-mono font-bold text-[#d4af37]">{saldoAtual} XP</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8e8273] block">Total Já Gasto</span>
            <span className="text-lg font-mono font-bold text-[#8e8273]">{ficha.xp?.totalGasto || 0} XP</span>
          </div>
        </div>

        {/* Alternador de Modo: Somar/Subtrair vs Definir Exato */}
        <div className="flex rounded-xs border border-[#3b181b] p-0.5 bg-[#170e13]">
          <button
            type="button"
            onClick={() => setModo('adicionar_subtrair')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              modo === 'adicionar_subtrair'
                ? 'bg-[#8b0000] text-white shadow-xs'
                : 'text-[#a89f91] hover:text-white'
            }`}
          >
            Somar / Subtrair
          </button>
          <button
            type="button"
            onClick={() => {
              setModo('definir_exato');
              setNovoSaldoExato(saldoAtual);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              modo === 'definir_exato'
                ? 'bg-[#8b0000] text-white shadow-xs'
                : 'text-[#a89f91] hover:text-white'
            }`}
          >
            Definir Saldo Exato
          </button>
        </div>

        {/* Corpo do Modo Selecionado */}
        {modo === 'adicionar_subtrair' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                Quantidade a Adicionar (+) ou Deduzir / Corrigir (-)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={quantidadeDelta}
                  onChange={(e) => setQuantidadeDelta(parseInt(e.target.value) || 0)}
                  placeholder="Ex: 5 para somar ou -5 para deduzir"
                  className="w-full bg-[#170e13] border border-[#522228] focus:border-[#d4af37] px-3 py-2 text-base font-mono font-bold text-[#ded6cb] rounded-xs focus:outline-hidden"
                />
              </div>
            </div>

            {/* Atalhos Rápidos de Concessão e Dedução */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#8e8273] block">Atalhos Rápidos:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[1, 2, 3, 5, 10].map((num) => (
                  <button
                    key={`plus_${num}`}
                    type="button"
                    onClick={() => setQuantidadeDelta(num)}
                    className="px-2 py-1 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 text-xs font-mono font-bold rounded-xs cursor-pointer transition-colors"
                  >
                    +{num}
                  </button>
                ))}
                <span className="text-zinc-600">|</span>
                {[-1, -2, -3, -5, -10].map((num) => (
                  <button
                    key={`minus_${num}`}
                    type="button"
                    onClick={() => setQuantidadeDelta(num)}
                    className="px-2 py-1 bg-rose-950/70 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-xs font-mono font-bold rounded-xs cursor-pointer transition-colors"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                Novo Saldo Final de Experiência (XP)
              </label>
              <input
                type="number"
                min={0}
                value={novoSaldoExato}
                onChange={(e) => setNovoSaldoExato(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#170e13] border border-[#522228] focus:border-[#d4af37] px-3 py-2 text-base font-mono font-bold text-[#d4af37] rounded-xs focus:outline-hidden"
              />
              <span className="text-[10px] text-[#8e8273] mt-1 block">
                Define diretamente o valor corrigido no saldo do personagem.
              </span>
            </div>
          </div>
        )}

        {/* Motivo ou Nota da Alteração */}
        <div>
          <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
            Motivo / Descrição do Ajuste (Opcional)
          </label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex: Correção de pontuação dada a mais, Sessão 3..."
            className="w-full bg-[#170e13] border border-[#3b181b] focus:border-[#d4af37] px-3 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-hidden"
          />
        </div>

        {/* Previsão do Novo Saldo */}
        <div className="bg-[#181014] border border-[#3b181b] p-3 rounded-xs flex items-center justify-between">
          <span className="text-xs text-[#a89f91]">Novo Saldo Resultante:</span>
          <div className="text-right">
            <span className="text-base font-mono font-bold text-[#d4af37]">
              {saldoFinalPrevisto} XP
            </span>
            <span
              className={`text-[11px] font-mono font-bold block ${
                diferencaEfetiva > 0
                  ? 'text-emerald-400'
                  : diferencaEfetiva < 0
                  ? 'text-rose-400'
                  : 'text-[#8e8273]'
              }`}
            >
              {diferencaEfetiva > 0 ? `(+${diferencaEfetiva} XP)` : diferencaEfetiva < 0 ? `(${diferencaEfetiva} XP)` : '(Sem alteração)'}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3b181b]">
          <button
            type="button"
            onClick={onFechar}
            className="px-3 py-1.5 bg-[#1b1216] hover:bg-[#29161d] border border-[#3b181b] text-xs font-semibold text-[#a89f91] hover:text-white rounded-xs cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAplicar}
            disabled={diferencaEfetiva === 0}
            className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.4)]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirmar Ajuste</span>
          </button>
        </div>
      </div>
    </div>
  );
};
