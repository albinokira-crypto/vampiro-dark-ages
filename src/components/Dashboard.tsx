import React, { useState, useEffect } from 'react';
import type { Personagem, User } from '../types';
import { storageService } from '../services/storage';
import {
  Skull,
  Shield,
  Trash2,
  ExternalLink,
  Settings,
  Share2,
  Check,
  Sparkles,
  RefreshCw,
  Swords,
  Flame,
  Eye,
  Zap,
  Radio,
  Users,
} from 'lucide-react';
import { FotoPersonagem } from './FotoPersonagem';
import { PainelAuditoriaMestre } from './PainelAuditoriaMestre';
import { PainelJogadoresMestre } from './PainelJogadoresMestre';

interface DashboardProps {
  usuarioAtual: User;
  onAbrirFicha: (personagemId: string) => void;
  onCriarNovo: (tipo: 'jogador' | 'npc') => void;
  onAbrirConfigMestre?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  usuarioAtual,
  onAbrirFicha,
  onCriarNovo,
  onAbrirConfigMestre,
}) => {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'jogador' | 'npc'>('todos');
  const [abaMestre, setAbaMestre] = useState<'fichas' | 'auditoria' | 'jogadores'>('fichas');
  const [copiado, setCopiado] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [personagens, setPersonagens] = useState<Personagem[]>(() =>
    storageService.getPersonagensDoUsuario(usuarioAtual)
  );

  const sincronizar = async () => {
    setSincronizando(true);
    try {
      const remotos = await storageService.sincronizarPersonagensRemotos(usuarioAtual);
      setPersonagens(remotos);
    } finally {
      setSincronizando(false);
    }
  };

  useEffect(() => {
    sincronizar();
  }, [usuarioAtual.id, usuarioAtual.role]);

  const handleExcluir = async (e: React.MouseEvent, id: string, nome: string) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja destruir a ficha de "${nome}" nas chamas da Inquisição?`)) {
      await storageService.excluirPersonagem(id);
      setPersonagens((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleCopiarConvite = () => {
    const url = `${window.location.origin}${window.location.pathname}?convite=dark-ages`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const filtrados = personagens.filter((p) => {
    const termo = busca.toLowerCase();
    const bateBusca =
      p.nome.toLowerCase().includes(termo) ||
      p.cla.toLowerCase().includes(termo) ||
      p.geracao.toLowerCase().includes(termo) ||
      p.jogador.toLowerCase().includes(termo);

    const bateTipo = filtroTipo === 'todos' ? true : p.tipo === filtroTipo;

    return bateBusca && bateTipo;
  });

  // Função auxiliar para calcular penalidade de vitalidade
  const getStatusVitalidade = (p: Personagem) => {
    const feridos = p.vitalidade.filter((v) => v.dano !== 'nenhum');
    if (feridos.length === 0)
      return { texto: 'Intacto', cor: 'text-green-400 bg-green-950/40 border-green-800' };
    const pior = feridos[feridos.length - 1];
    return {
      texto: `${pior.nome} (${pior.penalidade})`,
      cor:
        pior.penalidade === 'Incapaz'
          ? 'text-red-400 bg-red-950/80 border-red-700 animate-pulse'
          : 'text-amber-400 bg-amber-950/40 border-amber-800',
    };
  };

  // Cálculos automáticos de paradas de dados mais frequentes
  const getEstatisticasTeste = (p: Personagem) => {
    const at = p.atributos;
    const hab = p.habilidades;

    const discFortitude = p.disciplinas.find((d) =>
      d.nome.toLowerCase().includes('fortitude')
    );
    const nivelFortitude = discFortitude ? discFortitude.nivel : 0;

    const absorcao = (at.vigor || 1) + nivelFortitude;
    const iniciativa = (at.destreza || 1) + (at.raciocinio || 1);
    const percepcaoAlerta = (at.percepcao || 1) + (hab.prontidao || 0);
    const ataqueCorpo =
      (at.destreza || 1) + Math.max(hab.briga || 0, hab.armasBrancas || 0);
    const esquiva = (at.destreza || 1) + (hab.esquiva || 0);

    return {
      absorcao,
      iniciativa,
      percepcaoAlerta,
      ataqueCorpo,
      esquiva,
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3b181b] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-gothic font-black text-[#d4af37] tracking-wider">
              {usuarioAtual.role === 'mestre' ? 'Crônicas do Mestre' : 'Meus Personagens'}
            </h2>
            <button
              type="button"
              onClick={sincronizar}
              disabled={sincronizando}
              title="Sincronizar com Cloudflare D1"
              className="p-1.5 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] text-[#d4af37] rounded-xs cursor-pointer transition-transform active:rotate-180"
            >
              <RefreshCw className={`w-4 h-4 ${sincronizando ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-[#a89f91] mt-1 font-serif">
            {usuarioAtual.role === 'mestre'
              ? 'Painel Geral do Narrador: supervisão em tempo real de fichas, alterações e jogadores.'
              : `Gerenciando as linhagens pertencentes a ${usuarioAtual.nome}.`}
          </p>
        </div>

        {/* Botões de Ação para Criar Fichas e Configuração */}
        <div className="flex flex-wrap items-center gap-2">
          {usuarioAtual.role === 'mestre' && (
            <>
              <button
                type="button"
                onClick={handleCopiarConvite}
                className="px-3 py-2 text-xs font-semibold rounded-xs border border-[#522228] bg-[#1e1317] hover:bg-[#2e1c22] text-[#ded6cb] transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation"
              >
                {copiado ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>Convidar Jogador</span>
                  </>
                )}
              </button>

              {onAbrirConfigMestre && (
                <button
                  type="button"
                  onClick={onAbrirConfigMestre}
                  className="px-3 py-2 text-xs font-semibold rounded-xs border border-[#522228] bg-[#1e1317] hover:bg-[#2e1c22] text-[#d4af37] transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar Pontos</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onCriarNovo('npc')}
                className="px-3 py-2 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs border border-[#78350f] bg-[#451a03] hover:bg-[#78350f] text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-md touch-manipulation"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Novo NPC</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => onCriarNovo('jogador')}
            className="px-4 py-2 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs bg-[#8b0000] hover:bg-[#a30d12] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)] touch-manipulation"
          >
            <Skull className="w-4 h-4" />
            <span>Criar Cainita</span>
          </button>
        </div>
      </div>

      {/* ABAS DO MESTRE (Fichas vs Auditoria em Tempo Real vs Jogadores) */}
      {usuarioAtual.role === 'mestre' && (
        <div className="flex flex-wrap items-center gap-2 border-b border-[#3b181b] pb-3">
          <button
            type="button"
            onClick={() => setAbaMestre('fichas')}
            className={`px-4 py-2 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all touch-manipulation ${
              abaMestre === 'fichas'
                ? 'bg-[#8b0000] text-white shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                : 'bg-[#181115] text-[#a89f91] hover:text-white border border-[#3b181b]'
            }`}
          >
            <Skull className="w-4 h-4" />
            <span>Fichas da Mesa ({personagens.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaMestre('auditoria')}
            className={`px-4 py-2 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all touch-manipulation ${
              abaMestre === 'auditoria'
                ? 'bg-[#8b0000] text-white shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                : 'bg-[#181115] text-[#a89f91] hover:text-white border border-[#3b181b]'
            }`}
          >
            <Radio className="w-4 h-4 text-[#ef4444] animate-pulse" />
            <span>Auditoria em Tempo Real</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </button>

          <button
            type="button"
            onClick={() => setAbaMestre('jogadores')}
            className={`px-4 py-2 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all touch-manipulation ${
              abaMestre === 'jogadores'
                ? 'bg-[#8b0000] text-white shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                : 'bg-[#181115] text-[#a89f91] hover:text-white border border-[#3b181b]'
            }`}
          >
            <Users className="w-4 h-4 text-[#d4af37]" />
            <span>Jogadores & Senhas</span>
          </button>
        </div>
      )}

      {/* CONTEÚDO DA ABA SELECIONADA */}
      {usuarioAtual.role === 'mestre' && abaMestre === 'auditoria' ? (
        <PainelAuditoriaMestre
          onAbrirFicha={onAbrirFicha}
        />
      ) : usuarioAtual.role === 'mestre' && abaMestre === 'jogadores' ? (
        <PainelJogadoresMestre />
      ) : (
        /* ABA DE FICHAS */
        <div className="space-y-6">
          {/* Barra de Busca e Filtros */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#120d10] p-3 rounded-xs border border-[#251419]">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#706456]">
                <Skull className="w-4 h-4" />
              </span>
              <input
                type="search"
                placeholder="Buscar por nome, clã, geração ou jogador..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-[#1b1719] border border-[#3b181b] rounded-xs pl-9 pr-3 py-2 text-xs text-[#ded6cb] placeholder:text-[#6e645c] focus:outline-none focus:border-[#8b0000]"
              />
            </div>

            {usuarioAtual.role === 'mestre' && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFiltroTipo('todos')}
                  className={`px-3 py-1.5 rounded-xs uppercase font-bold text-[10px] transition-colors cursor-pointer touch-manipulation ${
                    filtroTipo === 'todos'
                      ? 'bg-[#8b0000] text-white'
                      : 'bg-[#1b1719] text-[#a89f91] hover:text-white'
                  }`}
                >
                  Todos ({personagens.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipo('jogador')}
                  className={`px-3 py-1.5 rounded-xs uppercase font-bold text-[10px] transition-colors cursor-pointer touch-manipulation ${
                    filtroTipo === 'jogador'
                      ? 'bg-[#8b0000] text-white'
                      : 'bg-[#1b1719] text-[#a89f91] hover:text-white'
                  }`}
                >
                  Jogadores ({personagens.filter((p) => p.tipo === 'jogador').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipo('npc')}
                  className={`px-3 py-1.5 rounded-xs uppercase font-bold text-[10px] transition-colors cursor-pointer touch-manipulation ${
                    filtroTipo === 'npc'
                      ? 'bg-[#8b0000] text-white'
                      : 'bg-[#1b1719] text-[#a89f91] hover:text-white'
                  }`}
                >
                  NPCs ({personagens.filter((p) => p.tipo === 'npc').length})
                </button>
              </div>
            )}
          </div>

          {/* Grid de Personagens */}
          {filtrados.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#3b181b] rounded-sm bg-[#120d10] p-6 space-y-4">
              <Skull className="w-12 h-12 text-[#5a242c] mx-auto animate-pulse" />
              <h3 className="text-lg font-gothic text-[#d4af37]">Nenhum cainita encontrado</h3>
              <p className="text-xs text-[#8e8273] max-w-sm mx-auto">
                {busca
                  ? 'Nenhum registro corresponde aos filtros de busca aplicados.'
                  : 'Nenhuma ficha foi forjada nas sombras ainda. Comece criando seu primeiro personagem.'}
              </p>
              <button
                type="button"
                onClick={() => onCriarNovo('jogador')}
                className="px-5 py-2.5 bg-[#8b0000] hover:bg-[#a10e14] text-white font-gothic font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg touch-manipulation"
              >
                Criar Primeiro Personagem
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filtrados.map((p) => {
                const vit = getStatusVitalidade(p);
                const sangueDisp = p.pontosDeSangueAtual;
                const sangueMax = p.pontosDeSangueMax;
                const isEmCriacao = p.criacao?.status === 'em_criacao';
                const stats = getEstatisticasTeste(p);
                const forcaVontadeAtual =
                  (p.forcaDeVontade || 1) - (p.forcaDeVontadeGasta || 0);

                return (
                  <div
                    key={p.id}
                    onClick={() => onAbrirFicha(p.id)}
                    className="group relative bg-[#130d10] border border-[#2b1418] hover:border-[#8b0000] transition-all duration-300 rounded-sm p-4 sm:p-5 shadow-lg hover:shadow-[0_4px_25px_rgba(139,0,0,0.3)] flex flex-col justify-between cursor-pointer overflow-hidden touch-manipulation"
                  >
                    {/* Linha de Sangue Decorativa no Topo */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8b0000] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-3.5">
                      {/* Cabeçalho do Card com Foto + Nome */}
                      <div className="flex items-start gap-3">
                        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                          <FotoPersonagem
                            foto={p.foto}
                            nome={p.nome}
                            tamanho="sm"
                            podeEditar={false}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="text-base sm:text-lg font-gothic font-bold text-[#d4af37] group-hover:text-white transition-colors truncate">
                              {p.nome || 'Sem Nome'}
                            </h3>
                            {isEmCriacao ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-600 shrink-0">
                                Em Criação
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-green-950/40 text-green-400 border border-green-800 shrink-0">
                                Pronto
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#8e8273] italic truncate">
                            {p.cla || 'Sem Clã'} • {p.geracao || 'Geração Indefinida'}
                          </p>

                          <p className="text-[10px] text-[#706456] truncate mt-0.5">
                            Jogador:{' '}
                            <strong className="text-[#ded6cb]">{p.jogador || p.usuarioNome}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Resumo Vital: Sangue, Vontade e Caminho */}
                      <div className="grid grid-cols-3 gap-1.5 bg-[#0b0809] p-2 rounded-xs border border-[#251419] text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-gothic uppercase text-[#ef4444] font-bold flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> Sangue
                          </span>
                          <span className="text-xs font-mono font-bold text-[#fca5a5]">
                            {sangueDisp}/{sangueMax}
                          </span>
                        </div>

                        <div className="flex flex-col items-center border-x border-[#251419]">
                          <span className="text-[9px] font-gothic uppercase text-[#d4af37] font-bold flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> Vontade
                          </span>
                          <span className="text-xs font-mono font-bold text-[#fef08a]">
                            {forcaVontadeAtual}/{p.forcaDeVontade || 1}
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-gothic uppercase text-[#a89f91] font-bold">
                            {p.caminho || 'Humanidade'}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#ded6cb]">
                            Nv. {p.caminhoNivel || 1}
                          </span>
                        </div>
                      </div>

                      {/* Resumo Numérico das Características Mais Usadas em Testes */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-gothic uppercase tracking-wider text-[#706456] block">
                          Paradas de Dados para Testes Frequentes
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                          {/* Absorção */}
                          <div className="bg-[#181115] border border-[#3b181b] rounded-xs px-2 py-1 flex items-center justify-between">
                            <span className="text-[10px] text-[#a89f91] flex items-center gap-1">
                              <Shield className="w-3 h-3 text-amber-500" /> Absorb:
                            </span>
                            <span className="font-mono text-xs font-bold text-[#d4af37]">
                              {stats.absorcao}d10
                            </span>
                          </div>

                          {/* Iniciativa */}
                          <div className="bg-[#181115] border border-[#3b181b] rounded-xs px-2 py-1 flex items-center justify-between">
                            <span className="text-[10px] text-[#a89f91] flex items-center gap-1">
                              <Zap className="w-3 h-3 text-red-400" /> Inic:
                            </span>
                            <span className="font-mono text-xs font-bold text-white">
                              +{stats.iniciativa}
                            </span>
                          </div>

                          {/* Percepção / Alerta */}
                          <div className="bg-[#181115] border border-[#3b181b] rounded-xs px-2 py-1 flex items-center justify-between">
                            <span className="text-[10px] text-[#a89f91] flex items-center gap-1">
                              <Eye className="w-3 h-3 text-blue-400" /> Alerta:
                            </span>
                            <span className="font-mono text-xs font-bold text-[#93c5fd]">
                              {stats.percepcaoAlerta}d10
                            </span>
                          </div>

                          {/* Ataque */}
                          <div className="bg-[#181115] border border-[#3b181b] rounded-xs px-2 py-1 flex items-center justify-between">
                            <span className="text-[10px] text-[#a89f91] flex items-center gap-1">
                              <Swords className="w-3 h-3 text-red-500" /> Ataque:
                            </span>
                            <span className="font-mono text-xs font-bold text-[#fca5a5]">
                              {stats.ataqueCorpo}d10
                            </span>
                          </div>

                          {/* Esquiva */}
                          <div className="bg-[#181115] border border-[#3b181b] rounded-xs px-2 py-1 flex items-center justify-between">
                            <span className="text-[10px] text-[#a89f91] flex items-center gap-1">
                              🏃 Esquiva:
                            </span>
                            <span className="font-mono text-xs font-bold text-[#86efac]">
                              {stats.esquiva}d10
                            </span>
                          </div>

                          {/* Vitalidade */}
                          <div className="bg-[#181115] border border-[#3b181b] rounded-xs px-2 py-1 flex items-center justify-between truncate">
                            <span className="text-[10px] text-[#a89f91]">Saúde:</span>
                            <span className={`text-[10px] font-bold ${vit.cor} truncate px-1 rounded`}>
                              {vit.texto}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rodapé do Card com Ações */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#251419]">
                      <span className="text-[10px] text-[#706456]">
                        Atualizado em {new Date(p.updatedAt).toLocaleDateString('pt-BR')}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Botão Excluir (somente mestre ou dono) */}
                        {(usuarioAtual.role === 'mestre' || p.usuarioId === usuarioAtual.id) && (
                          <button
                            type="button"
                            onClick={(e) => handleExcluir(e, p.id, p.nome)}
                            title="Destruir Personagem"
                            className="p-2 text-[#8e8273] hover:text-[#ef4444] hover:bg-[#251419] rounded-xs transition-colors cursor-pointer touch-manipulation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Botão Abrir Ficha */}
                        <button
                          type="button"
                          onClick={() => onAbrirFicha(p.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#241318] hover:bg-[#8b0000] text-[#d4af37] hover:text-white border border-[#522228] hover:border-[#8b0000] rounded-xs text-xs font-gothic font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm touch-manipulation"
                        >
                          <span>Abrir</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
