import React, { useState, useEffect } from 'react';
import type { LogAlteracao } from '../types';
import { storageService } from '../services/storage';
import {
  Flame,
  Zap,
  Shield,
  RefreshCw,
  Trash2,
  ExternalLink,
  Clock,
  Radio,
  Search,
} from 'lucide-react';

interface PainelAuditoriaMestreProps {
  onAbrirFicha: (personagemId: string) => void;
}

export const PainelAuditoriaMestre: React.FC<PainelAuditoriaMestreProps> = ({
  onAbrirFicha,
}) => {
  const [logs, setLogs] = useState<LogAlteracao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [autoAtualizar, setAutoAtualizar] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());

  const carregarLogs = async (silencioso = false) => {
    if (!silencioso) setCarregando(true);
    try {
      const novosLogs = await storageService.carregarLogs();
      setLogs(novosLogs);
      setUltimaAtualizacao(new Date());
    } finally {
      if (!silencioso) setCarregando(false);
    }
  };

  useEffect(() => {
    carregarLogs();
    if (!autoAtualizar) return;

    // Polling a cada 4 segundos para feed em tempo real
    const intervalo = setInterval(() => {
      carregarLogs(true);
    }, 4000);

    return () => clearInterval(intervalo);
  }, [autoAtualizar]);

  const handleLimparLogs = async () => {
    if (confirm('Deseja realmente limpar todos os registros de auditoria da crônica?')) {
      await storageService.limparLogs();
      setLogs([]);
    }
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'xp':
        return <Zap className="w-4 h-4 text-[#ef4444]" />;
      case 'sangue':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'vitalidade':
        return <Shield className="w-4 h-4 text-amber-500" />;
      case 'vontade':
        return <Zap className="w-4 h-4 text-[#d4af37]" />;
      default:
        return <Radio className="w-4 h-4 text-[#a89f91]" />;
    }
  };

  const getCorBadge = (tipo: string) => {
    switch (tipo) {
      case 'xp':
        return 'bg-red-950/80 text-red-300 border-red-700';
      case 'sangue':
        return 'bg-[#3d0e12] text-[#ef4444] border-[#8b0000]';
      case 'vitalidade':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      case 'vontade':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-700';
      default:
        return 'bg-[#1e1317] text-[#ded6cb] border-[#522228]';
    }
  };

  const formatarHoraRelativa = (dataStr: string) => {
    try {
      const data = new Date(dataStr.replace(' ', 'T') + 'Z');
      const agora = new Date();
      const diffSeg = Math.floor((agora.getTime() - data.getTime()) / 1000);

      if (isNaN(diffSeg) || diffSeg < 5) return 'agora mesmo';
      if (diffSeg < 60) return `há ${diffSeg} seg`;
      const diffMin = Math.floor(diffSeg / 60);
      if (diffMin < 60) return `há ${diffMin} min`;
      const diffHoras = Math.floor(diffMin / 60);
      if (diffHoras < 24) return `há ${diffHoras}h`;
      return data.toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dataStr;
    }
  };

  const logsFiltrados = logs.filter((log) => {
    const bateTipo = filtroTipo === 'todos' ? true : log.tipo === filtroTipo;
    const termo = busca.toLowerCase();
    const bateBusca =
      log.personagemNome.toLowerCase().includes(termo) ||
      log.jogadorNome.toLowerCase().includes(termo) ||
      log.descricao.toLowerCase().includes(termo);
    return bateTipo && bateBusca;
  });

  return (
    <div className="space-y-4">
      {/* Barra de Controle de Tempo Real */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#130d10] p-4 rounded-xs border border-[#3b181b]">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-3 h-3 rounded-full ${
                autoAtualizar ? 'bg-red-500 animate-ping' : 'bg-gray-500'
              }`}
            />
            <span
              className={`absolute w-2 h-2 rounded-full ${
                autoAtualizar ? 'bg-red-600' : 'bg-gray-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                Feed de Auditoria em Tempo Real
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-950/60 text-[#ef4444] border border-[#8b0000]">
                {autoAtualizar ? '🔴 Ao Vivo (4s)' : 'Pausado'}
              </span>
            </div>
            <p className="text-[11px] text-[#a89f91] flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>
                Última checagem às {ultimaAtualizacao.toLocaleTimeString('pt-BR')} • {logs.length} eventos
                registrados
              </span>
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoAtualizar(!autoAtualizar)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors cursor-pointer touch-manipulation ${
              autoAtualizar
                ? 'bg-[#2b1016] border-[#8b0000] text-[#ef4444]'
                : 'bg-[#181115] border-[#3b181b] text-[#a89f91] hover:text-white'
            }`}
          >
            {autoAtualizar ? 'Pausar Ao Vivo' : 'Ativar Ao Vivo'}
          </button>

          <button
            type="button"
            onClick={() => carregarLogs(false)}
            disabled={carregando}
            title="Atualizar agora"
            className="p-2 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] text-[#d4af37] rounded-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${carregando ? 'animate-spin' : ''}`} />
          </button>

          {logs.length > 0 && (
            <button
              type="button"
              onClick={handleLimparLogs}
              title="Limpar logs antigos"
              className="p-2 bg-[#181115] hover:bg-red-950/50 border border-[#3b181b] text-[#8e8273] hover:text-[#ef4444] rounded-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#0e090b] p-2.5 rounded-xs border border-[#251419]">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setFiltroTipo('todos')}
            className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-colors cursor-pointer touch-manipulation ${
              filtroTipo === 'todos'
                ? 'bg-[#8b0000] text-white'
                : 'bg-[#181115] text-[#a89f91] hover:text-white'
            }`}
          >
            Todos ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo('xp')}
            className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-colors cursor-pointer touch-manipulation flex items-center gap-1 ${
              filtroTipo === 'xp'
                ? 'bg-[#8b0000] text-white'
                : 'bg-[#181115] text-[#a89f91] hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-[#ef4444]" />
            <span>XP ({logs.filter((l) => l.tipo === 'xp').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo('sangue')}
            className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-colors cursor-pointer touch-manipulation flex items-center gap-1 ${
              filtroTipo === 'sangue'
                ? 'bg-[#8b0000] text-white'
                : 'bg-[#181115] text-[#a89f91] hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-red-500" />
            <span>Sangue ({logs.filter((l) => l.tipo === 'sangue').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo('vitalidade')}
            className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-colors cursor-pointer touch-manipulation flex items-center gap-1 ${
              filtroTipo === 'vitalidade'
                ? 'bg-[#8b0000] text-white'
                : 'bg-[#181115] text-[#a89f91] hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3 text-amber-500" />
            <span>Vitalidade ({logs.filter((l) => l.tipo === 'vitalidade').length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-60">
          <input
            type="search"
            placeholder="Filtrar por jogador ou ficha..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-[#181115] border border-[#3b181b] rounded-xs pl-8 pr-3 py-1 text-xs text-[#ded6cb] placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
          />
          <Search className="w-3.5 h-3.5 text-[#706456] absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Lista de Registros em Tempo Real */}
      {logsFiltrados.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#3b181b] rounded-xs bg-[#120d10] p-6 space-y-2">
          <Radio className="w-8 h-8 text-[#522228] mx-auto animate-pulse" />
          <h4 className="text-sm font-gothic text-[#d4af37]">Nenhuma alteração registrada ainda</h4>
          <p className="text-xs text-[#8e8273] max-w-sm mx-auto">
            Assim que qualquer jogador gastar XP, alterar atributos, marcar dano ou gastar pontos de
            sangue na ficha, a alteração surgirá aqui em tempo real.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {logsFiltrados.map((log) => (
            <div
              key={log.id}
              className="bg-[#120d10] hover:bg-[#1a1216] border border-[#251419] hover:border-[#8b0000] transition-colors rounded-xs p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-xs bg-[#1e1317] border border-[#3b181b] shrink-0">
                  {getIconeTipo(log.tipo)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      onClick={() =>
                        log.personagemId !== 'desconhecido' && onAbrirFicha(log.personagemId)
                      }
                      className="text-sm font-gothic font-bold text-[#d4af37] hover:underline cursor-pointer"
                    >
                      {log.personagemNome}
                    </span>

                    <span className="text-[11px] text-[#a89f91]">
                      por <strong className="text-white">{log.jogadorNome}</strong>
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${getCorBadge(
                        log.tipo
                      )}`}
                    >
                      {log.tipo}
                    </span>
                  </div>

                  <p className="text-xs text-[#ded6cb] font-medium">{log.descricao}</p>

                  {log.detalhes && (
                    <p className="text-[11px] text-[#8e8273] italic">{log.detalhes}</p>
                  )}
                </div>
              </div>

              {/* Timestamp e Botão Abrir */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#251419]">
                <span className="text-[11px] text-[#706456] font-mono">
                  {formatarHoraRelativa(log.criadoEm)}
                </span>

                {log.personagemId !== 'desconhecido' && (
                  <button
                    type="button"
                    onClick={() => onAbrirFicha(log.personagemId)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1e1317] hover:bg-[#8b0000] text-[#d4af37] hover:text-white border border-[#522228] hover:border-[#8b0000] rounded-xs text-[11px] font-gothic font-bold uppercase transition-colors cursor-pointer"
                  >
                    <span>Ver Ficha</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
