import React from 'react';
import type { Personagem, ConfiguracaoMesa } from '../types';
import { calcularGastosPontosBonus } from '../data/calculosPontosBonus';
import {
  FileText,
  X,
  Sparkles,
  BookOpen,
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
  const extrato = calcularGastosPontosBonus(ficha, config);
  const snap = ficha.criacao?.snapshotIniciais;
  const isEmCriacao = ficha.criacao?.status === 'em_criacao';

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
                <span>Extrato de Gastos do Personagem</span>
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

        {/* Resumo Financeiro de Pontos Bônus (Banner Destaque) */}
        <div className="bg-[#181014] p-3 rounded-xs border border-[#8b0000] space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-[#120d10] p-2 rounded-xs border border-[#3b181b]">
              <div className="text-[10px] uppercase font-bold text-[#a89f91]">Base Inicial</div>
              <div className="text-sm sm:text-base font-mono font-black text-[#ded6cb]">
                {config.pontosBonus} pts
              </div>
            </div>

            <div className="bg-[#120d10] p-2 rounded-xs border border-green-900/60">
              <div className="text-[10px] uppercase font-bold text-green-400">Defeitos (+Bônus)</div>
              <div className="text-sm sm:text-base font-mono font-black text-green-400">
                +{extrato.defeitosGanhos} / {config.maxPontosDefeitos ?? 7} pts
              </div>
            </div>

            <div className="bg-[#120d10] p-2 rounded-xs border border-red-900/60">
              <div className="text-[10px] uppercase font-bold text-red-400">Bônus Gastos</div>
              <div className="text-sm sm:text-base font-mono font-black text-red-400">
                -{extrato.totalGastoGeral} pts
              </div>
            </div>

            <div className={`p-2 rounded-xs border ${extrato.saldoRestante >= 0 ? 'bg-amber-950/40 border-amber-600/70' : 'bg-red-950/80 border-red-600 animate-pulse'}`}>
              <div className="text-[10px] uppercase font-bold text-[#d4af37]">Saldo Restante</div>
              <div className={`text-sm sm:text-base font-mono font-black ${extrato.saldoRestante >= 0 ? 'text-[#d4af37]' : 'text-red-300'}`}>
                {extrato.saldoRestante} pts
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 text-[#a89f91] border-t border-[#2d1217]">
            <span>
              Status da Ficha: <strong className={isEmCriacao ? 'text-amber-400' : 'text-green-400'}>{isEmCriacao ? 'Em Criação' : 'Finalizada'}</strong>
            </span>
            <span className="text-[10px] font-mono">
              Total Disponível: {extrato.totalBonusDisponivel} pts • Débito Geral: -{extrato.totalGastoGeral} pts
            </span>
          </div>
        </div>

        {/* Corpo com Scroll */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {/* SEÇÃO 1: EXTRATO DISCRIMINADO DE PONTOS BÔNUS */}
          <div className="bg-[#140e11] p-3 rounded-xs border border-[#3b181b] space-y-2">
            <h3 className="font-gothic font-bold text-[#d4af37] uppercase tracking-wide flex items-center justify-between border-b border-[#2d1217] pb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Extrato Analítico de Pontos Bônus (Item a Item)</span>
              </span>
              <span className="font-mono text-[10px] text-[#a89f91]">
                Total de Linhas: {extrato.itensDetalhados.length}
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

          {/* SEÇÃO 2: DISTRIBUIÇÃO DOS PONTOS INICIAIS DA CRIAÇÃO */}
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
