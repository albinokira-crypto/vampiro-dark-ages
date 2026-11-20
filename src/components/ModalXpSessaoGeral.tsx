import React, { useState, useMemo } from 'react';
import type { Personagem, User } from '../types';
import { storageService } from '../services/storage';
import {
  Award,
  X,
  Plus,
  Minus,
  Check,
  CheckSquare,
  Square,
  Users,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface ModalXpSessaoGeralProps {
  usuarioAtual: User;
  personagens: Personagem[];
  onFechar: () => void;
  onPersonagensAtualizados: (personagensAtualizados: Personagem[]) => void;
}

export const ModalXpSessaoGeral: React.FC<ModalXpSessaoGeralProps> = ({
  usuarioAtual,
  personagens,
  onFechar,
  onPersonagensAtualizados,
}) => {
  // Filtra por padrão todos os personagens pertencentes a jogadores
  const personagensJogadores = useMemo(() => {
    return personagens.filter((p) => p.tipo === 'jogador');
  }, [personagens]);

  const [quantidadeXP, setQuantidadeXP] = useState<number>(5);
  const [motivoSessao, setMotivoSessao] = useState<string>('');
  const [selecionadosIds, setSelecionadosIds] = useState<string[]>(() =>
    personagensJogadores.map((p) => p.id)
  );
  const [processando, setProcessando] = useState(false);

  const toggleSelecionarTodos = () => {
    if (selecionadosIds.length === personagensJogadores.length) {
      setSelecionadosIds([]);
    } else {
      setSelecionadosIds(personagensJogadores.map((p) => p.id));
    }
  };

  const toggleSelecionar = (id: string) => {
    setSelecionadosIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDistribuir = async () => {
    if (quantidadeXP === 0) {
      alert('Informe uma quantidade de XP diferente de zero.');
      return;
    }

    if (selecionadosIds.length === 0) {
      alert('Selecione pelo menos um personagem para receber ou ajustar o XP.');
      return;
    }

    const agora = new Date();
    const dataHoraFormatada = `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const motivoFinal = motivoSessao.trim() || 'Sessão Geral';
    const acaoTexto = quantidadeXP > 0 ? `+ ${quantidadeXP} XP` : `- ${Math.abs(quantidadeXP)} XP`;

    setProcessando(true);
    try {
      const mapaAtualizados = new Map<string, Personagem>();

      for (const p of personagens) {
        if (selecionadosIds.includes(p.id)) {
          const saldoAnterior = Number(p.xp?.atual) || 0;
          const novoSaldo = Math.max(0, saldoAnterior + quantidadeXP);

          const linhaLog = `${acaoTexto}: ${motivoFinal} (${dataHoraFormatada} por Mestre ${usuarioAtual.nome})`;

          const atualizado: Personagem = {
            ...p,
            xp: {
              ...p.xp,
              atual: novoSaldo,
              historico: linhaLog + (p.xp?.historico ? '\n' + p.xp.historico : ''),
            },
            updatedAt: agora.toISOString(),
          };

          await storageService.salvarPersonagem(atualizado);

          storageService.registrarLogAlteracao({
            personagemId: p.id,
            personagemNome: p.nome,
            jogadorNome: p.jogador || 'Jogador',
            tipo: 'xp',
            descricao: `XP da Sessão Geral (${acaoTexto}): ${motivoFinal}`,
            detalhes: `Saldo: ${saldoAnterior} XP -> ${novoSaldo} XP (Mestre: ${usuarioAtual.nome})`,
          });

          mapaAtualizados.set(p.id, atualizado);
        }
      }

      const listaFinal = personagens.map((p) => mapaAtualizados.get(p.id) || p);
      onPersonagensAtualizados(listaFinal);

      alert(
        `✓ Sucesso!\n${acaoTexto} aplicado(s) para ${selecionadosIds.length} personagem(ns) de jogadores e sincronizado no banco de dados!`
      );
      onFechar();
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#120a0e] border border-[#8b0000] w-full max-w-lg rounded-sm shadow-2xl p-5 space-y-4 text-[#ded6cb] relative max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h3 className="text-base sm:text-lg font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                Distribuir XP da Sessão Geral
              </h3>
              <p className="text-xs text-[#a89f91] font-serif">
                Exclusivo Mestre: concede ou corrige pontuação para todos os jogadores simultaneamente.
              </p>
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

        {/* Quantidade de XP e Motivo */}
        <div className="space-y-3 bg-[#180f14] border border-[#2d1217] p-3.5 rounded-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-44">
              <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                Quantidade de XP *
              </label>
              <input
                type="number"
                value={quantidadeXP}
                onChange={(e) => setQuantidadeXP(parseInt(e.target.value) || 0)}
                placeholder="Ex: 5 ou -3"
                className="w-full bg-[#120a0e] border border-[#522228] focus:border-[#d4af37] px-3 py-2 text-base font-mono font-bold text-[#d4af37] rounded-xs focus:outline-hidden"
              />
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                Identificação da Sessão / Motivo
              </label>
              <input
                type="text"
                value={motivoSessao}
                onChange={(e) => setMotivoSessao(e.target.value)}
                placeholder="Ex: Sessão 3 - A Emboscada dos Tzimisce, Sessão de 20/11..."
                className="w-full bg-[#120a0e] border border-[#3b181b] focus:border-[#d4af37] px-3 py-2 text-xs text-[#ded6cb] rounded-xs focus:outline-hidden"
              />
            </div>
          </div>

          {/* Atalhos Rápidos de XP */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#251015]">
            <span className="text-[10px] uppercase font-bold text-[#8e8273] mr-1">Atalhos:</span>
            {[1, 2, 3, 4, 5, 8, 10].map((num) => (
              <button
                key={`p_${num}`}
                type="button"
                onClick={() => setQuantidadeXP(num)}
                className="px-2 py-0.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 text-xs font-mono font-bold rounded-xs cursor-pointer transition-colors"
              >
                +{num}
              </button>
            ))}
            <span className="text-zinc-600">|</span>
            {[-1, -2, -3, -5].map((num) => (
              <button
                key={`m_${num}`}
                type="button"
                onClick={() => setQuantidadeXP(num)}
                title="Corrigir / Deduzir se concedeu a mais por engano"
                className="px-2 py-0.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-xs font-mono font-bold rounded-xs cursor-pointer transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de Personagens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#ef4444]" />
              <span>Personagens de Jogadores ({selecionadosIds.length}/{personagensJogadores.length})</span>
            </span>
            <button
              type="button"
              onClick={toggleSelecionarTodos}
              className="text-xs text-[#a89f91] hover:text-white cursor-pointer underline decoration-dotted"
            >
              {selecionadosIds.length === personagensJogadores.length ? 'Desmarcar Todos' : 'Marcar Todos'}
            </button>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {personagensJogadores.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#8e8273] italic bg-[#170e13] rounded-xs">
                Nenhum personagem de jogador cadastrado na crônica.
              </div>
            ) : (
              personagensJogadores.map((p) => {
                const marcado = selecionadosIds.includes(p.id);
                const saldoAtual = Number(p.xp?.atual) || 0;
                const saldoPrevisto = Math.max(0, saldoAtual + quantidadeXP);

                return (
                  <div
                    key={p.id}
                    onClick={() => toggleSelecionar(p.id)}
                    className={`p-2.5 rounded-xs border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      marcado
                        ? 'bg-[#201217] border-[#8b0000] text-white shadow-xs'
                        : 'bg-[#150d11] border-[#2d1217] text-[#8e8273] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {marcado ? (
                        <CheckSquare className="w-4 h-4 text-[#ef4444] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#8e8273] shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-xs font-bold text-[#ded6cb] truncate block">
                          {p.nome || 'Sem Nome'}
                        </span>
                        <span className="text-[10px] text-[#a89f91] truncate block">
                          {p.cla} • Jogador: {p.jogador || 'Desconhecido'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#8e8273] block">
                        Saldo: {saldoAtual} XP
                      </span>
                      {marcado && quantidadeXP !== 0 && (
                        <span
                          className={`text-xs font-mono font-bold ${
                            quantidadeXP > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          → {saldoPrevisto} XP ({quantidadeXP > 0 ? `+${quantidadeXP}` : quantidadeXP})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="flex items-center justify-between pt-3 border-t border-[#3b181b]">
          <span className="text-[11px] text-[#a89f91]">
            {quantidadeXP > 0 ? 'Conceder' : 'Deduzir'} {Math.abs(quantidadeXP)} XP para {selecionadosIds.length} jogador(es)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onFechar}
              disabled={processando}
              className="px-3 py-1.5 bg-[#1b1216] hover:bg-[#29161d] border border-[#3b181b] text-xs font-semibold text-[#a89f91] hover:text-white rounded-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDistribuir}
              disabled={processando || selecionadosIds.length === 0 || quantidadeXP === 0}
              className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.4)]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{processando ? 'Aplicando...' : 'Aplicar XP para Todos'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
