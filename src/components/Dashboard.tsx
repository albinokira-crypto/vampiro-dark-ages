import React, { useState } from 'react';
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
} from 'lucide-react';

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
  const [copiado, setCopiado] = useState(false);
  const [personagens, setPersonagens] = useState<Personagem[]>(() =>
    storageService.getPersonagensDoUsuario(usuarioAtual)
  );

  const handleExcluir = (e: React.MouseEvent, id: string, nome: string) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja destruir a ficha de "${nome}" nas chamas da Inquisição?`)) {
      storageService.excluirPersonagem(id);
      setPersonagens(storageService.getPersonagensDoUsuario(usuarioAtual));
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

    const bateTipo =
      filtroTipo === 'todos' ? true : p.tipo === filtroTipo;

    return bateBusca && bateTipo;
  });

  // Função auxiliar para calcular penalidade de vitalidade
  const getStatusVitalidade = (p: Personagem) => {
    const feridos = p.vitalidade.filter((v) => v.dano !== 'nenhum');
    if (feridos.length === 0) return { texto: 'Intacto', cor: 'text-green-400 bg-green-950/40 border-green-800' };
    const pior = feridos[feridos.length - 1];
    return {
      texto: `${pior.nome} (${pior.penalidade})`,
      cor: pior.penalidade === 'Incapaz' ? 'text-red-400 bg-red-950/80 border-red-700 animate-pulse' : 'text-amber-400 bg-amber-950/40 border-amber-800',
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3b181b] pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-gothic font-black text-[#d4af37] tracking-wider">
            {usuarioAtual.role === 'mestre' ? 'Crônicas do Mestre' : 'Meus Personagens'}
          </h2>
          <p className="text-xs sm:text-sm text-[#a89f91] mt-1 font-serif">
            {usuarioAtual.role === 'mestre'
              ? 'Acesso irrestrito a todos os Caimitas, carniçais e NPCs da Idade das Trevas.'
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
                className="px-3 py-2 text-xs font-semibold rounded-xs border border-[#522228] bg-[#1e1317] hover:bg-[#2e1c22] text-[#ded6cb] transition-all flex items-center gap-1.5 cursor-pointer"
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
                  className="px-3 py-2 text-xs font-gothic font-bold uppercase rounded-xs border border-[#8b0000] bg-[#251016] text-[#d4af37] hover:bg-[#3d1820] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                >
                  <Settings className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Pontuação Inicial</span>
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => onCriarNovo('jogador')}
            className="px-4 py-2 text-xs sm:text-sm font-gothic font-bold uppercase rounded-xs bg-[#8b0000] text-white hover:bg-[#a10e14] transition-all shadow-[0_0_12px_rgba(139,0,0,0.5)] active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Novo Personagem</span>
          </button>
          {usuarioAtual.role === 'mestre' && (
            <button
              type="button"
              onClick={() => onCriarNovo('npc')}
              className="px-3 py-2 text-xs sm:text-sm font-gothic font-bold uppercase rounded-xs border border-[#3b181b] bg-[#1a1417] text-[#d4af37] hover:border-[#8b0000] hover:bg-[#2b1013] transition-all active:scale-95 cursor-pointer"
            >
              ＋ Novo NPC
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131012] p-3 rounded-xs border border-[#3b181b]">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted">
            🔍
          </span>
          <input
            type="search"
            placeholder="Buscar por nome, clã, geração ou jogador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-[#1b1719] border border-[#3b181b] rounded-xs pl-9 pr-3 py-1.5 text-xs text-[#ded6cb] placeholder:text-[#6e645c] focus:outline-none focus:border-[#8b0000]"
          />
        </div>

        {usuarioAtual.role === 'mestre' && (
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setFiltroTipo('todos')}
              className={`px-2.5 py-1 rounded-xs uppercase font-bold text-[10px] transition-colors cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-xs uppercase font-bold text-[10px] transition-colors cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-xs uppercase font-bold text-[10px] transition-colors cursor-pointer ${
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
              : 'Nenhuma ficha foi forjada nas sombras ainda. Comece criando um novo personagem.'}
          </p>
          <button
            type="button"
            onClick={() => onCriarNovo('jogador')}
            className="px-4 py-2 bg-[#8b0000] hover:bg-[#a10e14] text-white font-gothic font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg"
          >
            Criar Primeiro Personagem
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtrados.map((p) => {
            const vit = getStatusVitalidade(p);
            const sangueDisp = p.pontosDeSangueAtual;
            const sangueMax = p.pontosDeSangueMax;
            const isEmCriacao = p.criacao?.status === 'em_criacao';

            return (
              <div
                key={p.id}
                onClick={() => onAbrirFicha(p.id)}
                className="group relative bg-[#130d10] border border-[#2b1418] hover:border-[#8b0000] transition-all duration-300 rounded-sm p-5 shadow-lg hover:shadow-[0_4px_25px_rgba(139,0,0,0.3)] flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                {/* Linha de Sangue Decorativa no Topo */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8b0000] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-gothic font-bold text-[#d4af37] group-hover:text-white transition-colors truncate max-w-[200px]">
                          {p.nome || 'Sem Nome'}
                        </h3>
                        {p.tipo === 'npc' ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/60 text-amber-300 border border-amber-800">
                            NPC
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950/60 text-red-300 border border-red-800">
                            Jogador
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8e8273] italic">
                        {p.cla || 'Sem Clã'} • {p.geracao || 'Geração Indefinida'}
                      </p>
                    </div>

                    {/* Badge de Status de Criação */}
                    <div>
                      {isEmCriacao ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-600 animate-pulse">
                          Em Criação
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-950/40 text-green-400 border border-green-800">
                          Pronto
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Informações Resumidas */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#251419]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#706456] block">
                        Jogador / Dono
                      </span>
                      <span className="text-[#ded6cb] font-semibold truncate block">
                        {p.jogador || p.usuarioNome}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#706456] block">
                        Natureza / Comp.
                      </span>
                      <span className="text-[#ded6cb] truncate block">
                        {p.natureza || '—'} / {p.comportamento || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Status de Vitalidade e Sangue */}
                  <div className="space-y-2 pt-2 border-t border-[#251419]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#a89f91] flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-amber-500" /> Vitalidade:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${vit.cor}`}
                      >
                        {vit.texto}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#a89f91] flex items-center gap-1">
                        🩸 Reserva de Sangue:
                      </span>
                      <span className="font-mono text-xs font-bold text-[#ef4444]">
                        {sangueDisp} / {sangueMax}
                      </span>
                    </div>

                    {/* Barra visual de sangue */}
                    <div className="w-full bg-[#1e1317] h-1.5 rounded-full overflow-hidden border border-[#3b181b]">
                      <div
                        className="bg-gradient-to-r from-[#8b0000] to-[#ef4444] h-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(0, (sangueDisp / sangueMax) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Rodapé do Card com Ações */}
                <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-[#251419]">
                  <span className="text-[10px] text-[#706456]">
                    Atualizado em {new Date(p.updatedAt).toLocaleDateString('pt-BR')}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Botão Excluir (somente mestre ou dono) */}
                    {(usuarioAtual.role === 'mestre' || p.usuarioId === usuarioAtual.id) && (
                      <button
                        type="button"
                        onClick={(e) => handleExcluir(e, p.id, p.nome)}
                        title="Destruir Personagem"
                        className="p-1.5 text-[#8e8273] hover:text-[#ef4444] hover:bg-[#251419] rounded-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Botão Abrir Ficha */}
                    <button
                      type="button"
                      onClick={() => onAbrirFicha(p.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#241318] hover:bg-[#8b0000] text-[#d4af37] hover:text-white border border-[#522228] hover:border-[#8b0000] rounded-xs text-xs font-gothic font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
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
  );
};
