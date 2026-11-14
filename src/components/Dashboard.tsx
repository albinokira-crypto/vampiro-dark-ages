import React, { useState } from 'react';
import type { Personagem, User } from '../types';
import { storageService } from '../services/storage';

interface DashboardProps {
  usuarioAtual: User;
  onAbrirFicha: (personagemId: string) => void;
  onCriarNovo: (tipo: 'jogador' | 'npc') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  usuarioAtual,
  onAbrirFicha,
  onCriarNovo,
}) => {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'jogador' | 'npc'>('todos');
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

        {/* Botões de Ação para Criar Fichas */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCriarNovo('jogador')}
            className="px-4 py-2 text-xs sm:text-sm font-gothic font-bold uppercase rounded-xs bg-[#8b0000] text-white hover:bg-[#a10e14] transition-all shadow-[0_0_12px_rgba(139,0,0,0.5)] active:scale-95"
          >
            ＋ Novo Personagem
          </button>
          {usuarioAtual.role === 'mestre' && (
            <button
              type="button"
              onClick={() => onCriarNovo('npc')}
              className="px-4 py-2 text-xs sm:text-sm font-gothic font-bold uppercase rounded-xs border border-[#3b181b] bg-[#1a1417] text-[#d4af37] hover:border-[#8b0000] hover:bg-[#2b1013] transition-all active:scale-95"
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
              className={`px-2.5 py-1 rounded-xs uppercase font-bold text-[10px] transition-colors ${
                filtroTipo === 'todos'
                  ? 'bg-[#8b0000] text-white'
                  : 'bg-[#1b1719] text-muted hover:text-white'
              }`}
            >
              Todos ({personagens.length})
            </button>
            <button
              type="button"
              onClick={() => setFiltroTipo('jogador')}
              className={`px-2.5 py-1 rounded-xs uppercase font-bold text-[10px] transition-colors ${
                filtroTipo === 'jogador'
                  ? 'bg-[#8b0000] text-white'
                  : 'bg-[#1b1719] text-muted hover:text-white'
              }`}
            >
              Jogadores
            </button>
            <button
              type="button"
              onClick={() => setFiltroTipo('npc')}
              className={`px-2.5 py-1 rounded-xs uppercase font-bold text-[10px] transition-colors ${
                filtroTipo === 'npc'
                  ? 'bg-[#8b0000] text-white'
                  : 'bg-[#1b1719] text-muted hover:text-white'
              }`}
            >
              NPCs
            </button>
          </div>
        )}
      </div>

      {/* Lista de Fichas / Tabela de Resumo */}
      {filtrados.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#3b181b] rounded-xs bg-[#131012]">
          <span className="text-4xl block mb-2">⚰️</span>
          <p className="text-base font-gothic font-bold text-[#ded6cb]">
            Nenhuma ficha encontrada
          </p>
          <p className="text-xs text-[#a89f91] mt-1">
            {busca
              ? 'Nenhum Caimita corresponde aos termos buscados.'
              : 'Clique em "+ Novo Personagem" para iniciar sua linhagem.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((p) => {
            const vitalidade = getStatusVitalidade(p);
            return (
              <div
                key={p.id}
                onClick={() => onAbrirFicha(p.id)}
                className="group relative bg-[#151214] border border-[#3b181b] hover:border-[#8b0000] rounded-xs p-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(139,0,0,0.25)] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Topo do Card: Tipo & Dono */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs border ${
                        p.tipo === 'npc'
                          ? 'border-purple-800 bg-purple-950/60 text-purple-300'
                          : 'border-red-800 bg-red-950/60 text-red-300'
                      }`}
                    >
                      {p.tipo === 'npc' ? 'NPC / Antagonista' : 'Personagem de Jogador'}
                    </span>
                    <span className="text-[10px] text-muted truncate max-w-[120px]">
                      {p.jogador || p.usuarioNome}
                    </span>
                  </div>

                  {/* Nome do Personagem */}
                  <h3 className="text-lg font-gothic font-bold text-[#ded6cb] group-hover:text-[#ef4444] transition-colors truncate">
                    {p.nome || 'Sem Nome'}
                  </h3>

                  {/* Clã e Geração */}
                  <div className="flex items-center gap-2 text-xs text-[#d4af37] mt-0.5 font-medium">
                    <span>{p.cla || 'Sem Clã'}</span>
                    <span>·</span>
                    <span className="text-[#a89f91]">{p.geracao || 'Geração desconhecida'}</span>
                  </div>

                  {/* Detalhes de Resumo Exigidos: Vitalidade e Pontos de Sangue */}
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-gothic text-muted uppercase">Vitalidade:</span>
                      <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold border ${vitalidade.cor}`}>
                        {vitalidade.texto}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-gothic text-muted uppercase">Pontos de Sangue:</span>
                      <div className="flex items-center gap-1 font-mono text-xs">
                        <span className="text-red-400 font-bold">{p.pontosDeSangueAtual}</span>
                        <span className="text-muted">/</span>
                        <span className="text-[#ded6cb]">{p.pontosDeSangueMax}</span>
                        <span className="text-red-500 text-xs">🩸</span>
                      </div>
                    </div>

                    {p.caminho && (
                      <div className="flex items-center justify-between text-xs text-muted pt-1">
                        <span className="text-[10px] font-gothic uppercase">Trilha:</span>
                        <span className="text-[11px] text-[#ded6cb] truncate max-w-[150px]">
                          {p.caminho}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rodapé do Card com Ação "Abrir Ficha" */}
                <div className="mt-4 pt-3 border-t border-[#261517] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onAbrirFicha(p.id)}
                    className="flex-1 py-1.5 px-3 rounded-xs bg-[#241518] hover:bg-[#8b0000] text-[#d4af37] hover:text-white text-xs font-gothic font-bold uppercase transition-colors text-center border border-[#3b181b] hover:border-[#8b0000]"
                  >
                    Abrir Ficha 📜
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleExcluir(e, p.id, p.nome)}
                    title="Excluir Ficha"
                    className="p-1.5 text-xs text-muted hover:text-red-400 hover:bg-red-950/40 rounded-xs transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
