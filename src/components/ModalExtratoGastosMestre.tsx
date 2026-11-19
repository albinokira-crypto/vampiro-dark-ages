import React, { useState, useEffect } from 'react';
import type { Personagem, ConfiguracaoMesa, LogAlteracao } from '../types';
import { calcularGastosPontosBonus } from '../data/calculosPontosBonus';
import { storageService } from '../services/storage';
import {
  FileText,
  X,
  Sparkles,
  BookOpen,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface ModalExtratoGastosMestreProps {
  ficha: Personagem;
  config: ConfiguracaoMesa;
  onFechar: () => void;
  onReabrirCriacao?: (id: string, nome: string) => void;
}

export const ModalExtratoGastosMestre: React.FC<ModalExtratoGastosMestreProps> = ({
  ficha,
  config,
  onFechar,
  onReabrirCriacao,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'todos' | 'criacao' | 'xp'>('todos');
  const [logsXP, setLogsXP] = useState<LogAlteracao[]>([]);
  const [carregandoLogs, setCarregandoLogs] = useState<boolean>(true);

  const extrato = calcularGastosPontosBonus(ficha, config);
  const snap = ficha.criacao?.snapshotIniciais;
  const isEmCriacao = ficha.criacao?.status === 'em_criacao';

  // Carregar histórico de logs de XP do banco/servidor
  useEffect(() => {
    let ativo = true;
    storageService
      .carregarLogs()
      .then((todosLogs) => {
        if (!ativo) return;
        const filtrados = (todosLogs || []).filter(
          (l) => l.personagemId === ficha.id && l.tipo === 'xp'
        );
        setLogsXP(filtrados);
        setCarregandoLogs(false);
      })
      .catch(() => {
        if (ativo) setCarregandoLogs(false);
      });
    return () => {
      ativo = false;
    };
  }, [ficha.id]);

  // Linhas do histórico salvas diretamente no JSON do personagem
  const linhasHistoricoFicha = (ficha.xp?.historico || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const xpAtual = ficha.xp?.atual || 0;
  const xpTotalGasto = ficha.xp?.totalGasto || 0;
  const xpTotalRecebido = xpAtual + xpTotalGasto;

  // Gastos iniciais de Atributos
  const gastosFisicosIniciais =
    Math.max(0, (snap?.atributos?.forca ?? ficha.atributos.forca) - 1) +
    Math.max(0, (snap?.atributos?.destreza ?? ficha.atributos.destreza) - 1) +
    Math.max(0, (snap?.atributos?.vigor ?? ficha.atributos.vigor) - 1);

  const gastosSociaisIniciais =
    Math.max(0, (snap?.atributos?.carisma ?? ficha.atributos.carisma) - 1) +
    Math.max(0, (snap?.atributos?.manipulacao ?? ficha.atributos.manipulacao) - 1) +
    Math.max(0, (snap?.atributos?.aparencia ?? ficha.atributos.aparencia) - 1);

  const gastosMentaisIniciais =
    Math.max(0, (snap?.atributos?.percepcao ?? ficha.atributos.percepcao) - 1) +
    Math.max(0, (snap?.atributos?.inteligencia ?? ficha.atributos.inteligencia) - 1) +
    Math.max(0, (snap?.atributos?.raciocinio ?? ficha.atributos.raciocinio) - 1);

  const prioridadesAtrib = ficha.criacao?.prioridadesAtributos || {
    primario: 'fisicos',
    secundario: 'sociais',
    terciario: 'mentais',
  };
  const getLimiteAtrib = (cat: 'fisicos' | 'sociais' | 'mentais') => {
    if (prioridadesAtrib.primario === cat) return config.pontosAtributos.primario;
    if (prioridadesAtrib.secundario === cat) return config.pontosAtributos.secundario;
    return config.pontosAtributos.terciario;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#100b0e] border border-[#8b0000] rounded-sm shadow-2xl p-4 sm:p-6 space-y-4 text-[#ded6cb] max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#251015] border border-[#8b0000] rounded-xs shadow-[0_0_8px_rgba(239,68,68,0.3)]">
              <FileText className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-gothic font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
                <span>Extrato Completo do Personagem</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#331c12] text-amber-300 border border-amber-600">
                  Exclusivo Mestre
                </span>
              </h2>
              <p className="text-xs text-[#a89f91]">
                {ficha.nome || 'Sem nome'} • {ficha.cla || 'Sem clã'} • {ficha.geracao || '12ª Geração'} • Jogador: {ficha.jogador || 'Narrador'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="p-1 hover:bg-[#2e151a] rounded text-[#a89f91] hover:text-white cursor-pointer transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banners Resumo: Bônus de Criação & Experiência (XP) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {/* Card Bônus de Criação */}
          <div className="bg-[#181014] p-2.5 rounded-xs border border-[#8b0000] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#d4af37] border-b border-[#2d1217] pb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Criação & Pontos Bônus</span>
              </span>
              <span className="font-mono text-[10px] text-[#a89f91]">
                Saldo: <strong className={extrato.saldoRestante >= 0 ? 'text-[#d4af37]' : 'text-red-400'}>{extrato.saldoRestante} pts</strong>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center font-mono">
              <div className="bg-[#120d10] p-1 rounded-xs border border-[#3b181b]">
                <div className="text-[9px] text-[#a89f91] uppercase">Total Bônus</div>
                <div className="text-xs font-bold text-[#ded6cb]">{extrato.totalBonusDisponivel} pts</div>
              </div>
              <div className="bg-[#120d10] p-1 rounded-xs border border-red-900/60">
                <div className="text-[9px] text-red-400 uppercase">Gastos</div>
                <div className="text-xs font-bold text-red-400">-{extrato.totalGastoGeral} pts</div>
              </div>
              <div className="bg-[#120d10] p-1 rounded-xs border border-green-900/60">
                <div className="text-[9px] text-green-400 uppercase">Defeitos</div>
                <div className="text-xs font-bold text-green-400">+{extrato.defeitosGanhos} pts</div>
              </div>
            </div>
          </div>

          {/* Card Experiência (XP nas Sessões) */}
          <div className="bg-[#181014] p-2.5 rounded-xs border border-purple-900/70 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-purple-300 border-b border-[#2d1217] pb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Experiência (XP das Sessões)</span>
              </span>
              <span className="font-mono text-[10px] text-[#a89f91]">
                Acumulado: <strong className="text-purple-200">{xpTotalRecebido} XP</strong>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center font-mono">
              <div className="bg-[#120d10] p-1 rounded-xs border border-purple-800/60">
                <div className="text-[9px] text-purple-300 uppercase">XP Atual</div>
                <div className="text-xs font-bold text-[#d4af37]">{xpAtual} XP</div>
              </div>
              <div className="bg-[#120d10] p-1 rounded-xs border border-red-900/60">
                <div className="text-[9px] text-red-400 uppercase">XP Gasto</div>
                <div className="text-xs font-bold text-red-400">-{xpTotalGasto} XP</div>
              </div>
              <div className="bg-[#120d10] p-1 rounded-xs border border-[#3b181b]">
                <div className="text-[9px] text-[#a89f91] uppercase">Evoluções</div>
                <div className="text-xs font-bold text-[#ded6cb]">
                  {Math.max(logsXP.length, linhasHistoricoFicha.length)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Filtro / Abas do Extrato */}
        <div className="flex items-center gap-1.5 border-b border-[#3b181b] pb-2 text-xs">
          <button
            type="button"
            onClick={() => setAbaAtiva('todos')}
            className={`px-3 py-1 rounded-xs font-semibold cursor-pointer transition-colors ${
              abaAtiva === 'todos'
                ? 'bg-[#8b0000] text-white shadow-xs'
                : 'bg-[#181014] text-[#a89f91] hover:text-[#ded6cb] border border-[#2d1217]'
            }`}
          >
            Visão Geral (Todos)
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('xp')}
            className={`px-3 py-1 rounded-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
              abaAtiva === 'xp'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'bg-[#181014] text-[#a89f91] hover:text-[#ded6cb] border border-[#2d1217]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Gastos de XP (Sessões)</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-black/40 text-purple-300">
              {Math.max(logsXP.length, linhasHistoricoFicha.length)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('criacao')}
            className={`px-3 py-1 rounded-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
              abaAtiva === 'criacao'
                ? 'bg-[#3b1c23] text-amber-300 border border-amber-600/60 shadow-xs'
                : 'bg-[#181014] text-[#a89f91] hover:text-[#ded6cb] border border-[#2d1217]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pontos Bônus & Cotas</span>
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {/* SEÇÃO: HISTÓRICO DE GASTOS DE EXPERIÊNCIA (XP NAS SESSÕES) */}
          {(abaAtiva === 'todos' || abaAtiva === 'xp') && (
            <div className="bg-[#140e11] p-3 rounded-xs border border-purple-900/60 space-y-2">
              <h3 className="font-gothic font-bold text-purple-300 uppercase tracking-wide flex items-center justify-between border-b border-[#2d1217] pb-1.5">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>Gastos de Experiência Durante as Sessões (XP)</span>
                </span>
                <span className="font-mono text-[10px] text-[#a89f91]">
                  Total Gasto: <strong className="text-red-400">-{xpTotalGasto} XP</strong> • Saldo Disponível: <strong className="text-[#d4af37]">{xpAtual} XP</strong>
                </span>
              </h3>

              {carregandoLogs ? (
                <div className="py-4 text-center text-[#a89f91] italic">
                  Carregando registros de experiência...
                </div>
              ) : logsXP.length > 0 ? (
                <div className="divide-y divide-[#241318]">
                  {logsXP.map((log) => {
                    const dataHora = new Date(log.criadoEm).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div key={log.id} className="py-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-mono bg-purple-950 text-purple-300 border border-purple-800">
                              XP
                            </span>
                            <strong className="text-[#ded6cb]">{log.descricao}</strong>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#8c8273] mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#706456]" />
                              <span>{dataHora}</span>
                            </span>
                            {log.detalhes && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-[#a89f91]">{log.detalhes}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="font-mono font-bold shrink-0 text-xs px-2 py-0.5 rounded-xs bg-red-950/40 border border-red-800 text-red-400">
                          {log.descricao.match(/-\d+\s*XP/i)?.[0] || 'Gasto'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : linhasHistoricoFicha.length > 0 ? (
                <div className="divide-y divide-[#241318]">
                  {linhasHistoricoFicha.map((linha, idx) => {
                    const matchXP = linha.match(/-?\s*(\d+)\s*XP/i);
                    const valorXP = matchXP ? `-${matchXP[1]} XP` : 'Gasto XP';
                    const descricaoLimpa = linha.replace(/^-\s*\d+\s*XP:\s*/i, '').replace(/^-\s*/, '');
                    return (
                      <div key={idx} className="py-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-mono bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                            XP
                          </span>
                          <span className="text-[#ded6cb] text-xs">{descricaoLimpa}</span>
                        </div>
                        <div className="font-mono font-bold shrink-0 text-xs px-2 py-0.5 rounded-xs bg-red-950/40 border border-red-800 text-red-400">
                          {valorXP}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-4 text-center text-[#736a5e] italic">
                  Nenhum gasto de experiência registrado nas sessões até o momento.
                </div>
              )}

              {/* Guia Rápido dos Custos Oficiais de XP (1ª Edição) */}
              <div className="mt-3 pt-2.5 border-t border-[#241318]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-purple-400" />
                  <span>Referência Canônica: Custos de XP (1ª Edição 1996)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono">
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Atributo:</span>{' '}
                    <strong className="text-amber-300">atual x 4</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Hab. Nova:</span>{' '}
                    <strong className="text-amber-300">3 XP</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Habilidade:</span>{' '}
                    <strong className="text-amber-300">atual x 2</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Virtude:</span>{' '}
                    <strong className="text-amber-300">atual x 3</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Caminho:</span>{' '}
                    <strong className="text-amber-300">atual x 2</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Força Vontade:</span>{' '}
                    <strong className="text-amber-300">atual x 2</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Disc. do Clã:</span>{' '}
                    <strong className="text-purple-300">atual x 5</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Outra Disc.:</span>{' '}
                    <strong className="text-purple-300">atual x 7</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Nova Disc.:</span>{' '}
                    <strong className="text-purple-300">10 XP</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Trilha Nova:</span>{' '}
                    <strong className="text-rose-300">7 XP</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Trilha Prim.:</span>{' '}
                    <strong className="text-rose-300">atual x 4</strong>
                  </div>
                  <div className="bg-[#100b0e] p-1.5 rounded-xs border border-[#2b1720]">
                    <span className="text-[#a89f91]">Trilha Sec.:</span>{' '}
                    <strong className="text-rose-300">atual x 5</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: EXTRATO DISCRIMINADO DE PONTOS BÔNUS (CRIAÇÃO) */}
          {(abaAtiva === 'todos' || abaAtiva === 'criacao') && (
            <div className="bg-[#140e11] p-3 rounded-xs border border-[#3b181b] space-y-2">
              <h3 className="font-gothic font-bold text-[#d4af37] uppercase tracking-wide flex items-center justify-between border-b border-[#2d1217] pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Extrato Analítico de Pontos Bônus (Criação da Ficha)</span>
                </span>
                <span className="font-mono text-[10px] text-[#a89f91]">
                  Total de Itens: {extrato.itensDetalhados.length}
                </span>
              </h3>

              {extrato.itensDetalhados.length === 0 ? (
                <div className="py-4 text-center text-[#736a5e] italic">
                  Nenhum ponto bônus foi gasto em traços ou qualidades (saldo permanece intacto).
                </div>
              ) : (
                <div className="divide-y divide-[#241318]">
                  {extrato.itensDetalhados.map((item, idx) => {
                    const isPositivo = item.pontos > 0;
                    return (
                      <div key={idx} className="py-1.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1 py-0.2 rounded text-[9px] font-bold uppercase font-mono ${
                                item.categoria === 'defeito'
                                  ? 'bg-green-950 text-green-300 border border-green-800'
                                  : item.categoria === 'qualidade'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : item.categoria === 'disciplina'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : 'bg-[#2b1217] text-[#ded6cb] border border-[#522228]'
                              }`}
                            >
                              {item.categoria}
                            </span>
                            <strong className="text-[#ded6cb] truncate">{item.nome}</strong>
                          </div>
                          <div className="text-[10px] text-[#8c8273] truncate pl-0.5">
                            {item.detalhe}
                          </div>
                        </div>

                        <div
                          className={`font-mono font-bold shrink-0 text-xs px-2 py-0.5 rounded-xs ${
                            isPositivo
                              ? 'text-green-400 bg-green-950/40 border border-green-800'
                              : 'text-red-400 bg-red-950/40 border border-red-800'
                          }`}
                        >
                          {isPositivo ? `+${item.pontos} pts` : `${item.pontos} pts`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SEÇÃO: DISTRIBUIÇÃO DOS PONTOS INICIAIS DA CRIAÇÃO */}
          {(abaAtiva === 'todos' || abaAtiva === 'criacao') && (
            <div className="bg-[#140e11] p-3 rounded-xs border border-[#3b181b] space-y-2">
              <h3 className="font-gothic font-bold text-[#d4af37] uppercase tracking-wide flex items-center gap-1.5 border-b border-[#2d1217] pb-1.5">
                <BookOpen className="w-4 h-4 text-[#d4af37]" />
                <span>Pontos Iniciais da Criação (Cotas do Livro)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Atributos Iniciais */}
                <div className="bg-[#1a1115] p-2 rounded-xs border border-[#2d1217] space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#d4af37] flex items-center justify-between">
                    <span>Atributos</span>
                    <span className="text-[9px] font-mono text-[#a89f91]">7 / 5 / 3</span>
                  </div>
                  <div className="space-y-0.5 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#a89f91]">Físicos:</span>
                      <strong className={gastosFisicosIniciais === getLimiteAtrib('fisicos') ? 'text-green-400' : 'text-[#d4af37]'}>
                        {gastosFisicosIniciais} / {getLimiteAtrib('fisicos')}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a89f91]">Sociais:</span>
                      <strong className={gastosSociaisIniciais === getLimiteAtrib('sociais') ? 'text-green-400' : 'text-[#d4af37]'}>
                        {gastosSociaisIniciais} / {getLimiteAtrib('sociais')}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a89f91]">Mentais:</span>
                      <strong className={gastosMentaisIniciais === getLimiteAtrib('mentais') ? 'text-green-400' : 'text-[#d4af37]'}>
                        {gastosMentaisIniciais} / {getLimiteAtrib('mentais')}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Habilidades Iniciais */}
                <div className="bg-[#1a1115] p-2 rounded-xs border border-[#2d1217] space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#d4af37] flex items-center justify-between">
                    <span>Habilidades</span>
                    <span className="text-[9px] font-mono text-[#a89f91]">13 / 9 / 5</span>
                  </div>
                  <div className="space-y-0.5 text-[11px] font-mono text-[#ded6cb]">
                    <div className="text-[10px] text-[#a89f91]">
                      Prioridade: {ficha.criacao?.prioridadesHabilidades?.primario || 'talentos'} (13) • {ficha.criacao?.prioridadesHabilidades?.secundario || 'pericias'} (9) • {ficha.criacao?.prioridadesHabilidades?.terciario || 'conhecimentos'} (5)
                    </div>
                  </div>
                </div>

                {/* Vantagens Iniciais */}
                <div className="bg-[#1a1115] p-2 rounded-xs border border-[#2d1217] space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#d4af37]">
                    Vantagens Iniciais
                  </div>
                  <div className="space-y-0.5 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#a89f91]">Disciplinas:</span>
                      <strong className="text-green-400">{config.pontosDisciplinas} pts</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a89f91]">Antecedentes:</span>
                      <strong className="text-green-400">{config.pontosAntecedentes} pts</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a89f91]">Virtudes:</span>
                      <strong className="text-green-400">{config.pontosVirtudes} pts</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="flex items-center justify-between border-t border-[#3b181b] pt-3">
          {onReabrirCriacao ? (
            <button
              type="button"
              onClick={() => {
                onReabrirCriacao(ficha.id, ficha.nome);
                onFechar();
              }}
              className="px-3 py-1.5 bg-[#331c12] hover:bg-[#4d2919] text-amber-300 border border-amber-600 rounded-xs text-xs font-bold uppercase cursor-pointer transition-colors"
            >
              🔄 Reabrir Modo de Criação
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-1.5 bg-[#251015] hover:bg-[#38151c] text-[#ded6cb] border border-[#522228] rounded-xs text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
