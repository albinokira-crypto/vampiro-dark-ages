import React, { useState, useEffect } from 'react';
import type { User, ConfiguracaoMesa, TabelaTeste } from '../types';
import { storageService } from '../services/storage';
import { TABELAS_TESTES_PADRAO_1E } from '../data/tabelasTestes1E';
import {
  ScrollText,
  Search,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  RotateCcw,
  Flame,
  Swords,
  Dumbbell,
  HeartPulse,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface PainelTestesProps {
  usuarioAtual: User;
  config?: ConfiguracaoMesa;
  onConfigChange?: (novaConfig: ConfiguracaoMesa) => void;
  onVoltar: () => void;
}

const CATEGORIAS_META: Record<
  TabelaTeste['categoria'],
  { label: string; badgeClass: string }
> = {
  experiencia: {
    label: 'Experiência',
    badgeClass: 'text-amber-300 bg-amber-950/70 border-amber-800/80',
  },
  besta: {
    label: 'A Besta',
    badgeClass: 'text-red-300 bg-red-950/70 border-red-800/80',
  },
  combate: {
    label: 'Combate',
    badgeClass: 'text-rose-300 bg-rose-950/70 border-rose-800/80',
  },
  fisico: {
    label: 'Físico',
    badgeClass: 'text-sky-300 bg-sky-950/70 border-sky-800/80',
  },
  sobrevivencia: {
    label: 'Sobrevivência',
    badgeClass: 'text-emerald-300 bg-emerald-950/70 border-emerald-800/80',
  },
  outros: {
    label: 'Geral',
    badgeClass: 'text-[#d4af37] bg-[#241318] border-[#522228]',
  },
};

export const PainelTestes: React.FC<PainelTestesProps> = ({
  usuarioAtual,
  config,
  onConfigChange,
  onVoltar,
}) => {
  const isMestre = usuarioAtual.role === 'mestre';
  const [tabelas, setTabelas] = useState<TabelaTeste[]>(() =>
    Array.isArray(config?.tabelasTestes) && config.tabelasTestes.length > 0
      ? config.tabelasTestes
      : storageService.getTabelasTestes()
  );
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<'todas' | TabelaTeste['categoria']>('todas');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Modal de edição/criação (Exclusivo Mestre)
  const [tabelaEditando, setTabelaEditando] = useState<TabelaTeste | null>(null);
  const [isNovaTabela, setIsNovaTabela] = useState(false);

  useEffect(() => {
    if (Array.isArray(config?.tabelasTestes) && config.tabelasTestes.length > 0) {
      setTabelas(config.tabelasTestes);
    }
  }, [config?.tabelasTestes]);

  useEffect(() => {
    let ativo = true;
    storageService
      .carregarConfiguracaoMesaRemota()
      .then((remota) => {
        if (ativo && remota) {
          if (Array.isArray(remota.tabelasTestes) && remota.tabelasTestes.length > 0) {
            const idsExistentes = new Set(remota.tabelasTestes.map((t) => t.id));
            const faltantes = TABELAS_TESTES_PADRAO_1E.filter((p) => !idsExistentes.has(p.id));
            setTabelas(faltantes.length > 0 ? [...remota.tabelasTestes, ...faltantes] : remota.tabelasTestes);
          }
          if (onConfigChange) onConfigChange(remota);
        }
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  const persistirTabelas = async (novas: TabelaTeste[], msg: string) => {
    setTabelas(novas);
    if (config && onConfigChange) {
      onConfigChange({ ...config, tabelasTestes: novas });
    }
    await storageService.salvarTabelasTestes(novas);
    setMensagemSucesso(msg);
    setTimeout(() => setMensagemSucesso(null), 3500);
  };

  const handleAbrirNovaTabela = () => {
    if (!isMestre) return;
    setIsNovaTabela(true);
    setTabelaEditando({
      id: 'tab_' + Date.now().toString(36),
      titulo: '',
      subtitulo: '',
      categoria: 'outros',
      descricao: '',
      colunas: ['Situação / Teste', 'Dificuldade / Efeito'],
      linhas: [['Exemplo', '6']],
      notaRodape: '',
    });
  };

  const handleAbrirEditarTabela = (tab: TabelaTeste) => {
    if (!isMestre) return;
    setIsNovaTabela(false);
    setTabelaEditando({
      ...tab,
      colunas: [...tab.colunas],
      linhas: tab.linhas.map((l) => [...l]),
    });
  };

  const handleSalvarTabela = async () => {
    if (!isMestre || !tabelaEditando) return;
    if (!tabelaEditando.titulo.trim()) {
      alert('Informe o título da tabela.');
      return;
    }
    const limpa: TabelaTeste = {
      ...tabelaEditando,
      titulo: tabelaEditando.titulo.trim(),
      subtitulo: (tabelaEditando.subtitulo || '').trim(),
      descricao: (tabelaEditando.descricao || '').trim(),
      notaRodape: (tabelaEditando.notaRodape || '').trim(),
      colunas: tabelaEditando.colunas.map((c, idx) => c.trim() || `Coluna ${idx + 1}`),
      linhas: tabelaEditando.linhas.filter((l) => l.some((cel) => cel.trim() !== '')),
    };

    const novas = isNovaTabela
      ? [...tabelas, limpa]
      : tabelas.map((t) => (t.id === limpa.id ? limpa : t));

    await persistirTabelas(
      novas,
      isNovaTabela
        ? `✓ Nova tabela "${limpa.titulo}" adicionada e sincronizada!`
        : `✓ Tabela "${limpa.titulo}" atualizada e sincronizada!`
    );
    setTabelaEditando(null);
    setIsNovaTabela(false);
  };

  const handleExcluirTabela = async (tab: TabelaTeste) => {
    if (!isMestre) return;
    if (!confirm(`Deseja excluir a tabela "${tab.titulo}" da aba Testes?`)) return;
    const novas = tabelas.filter((t) => t.id !== tab.id);
    await persistirTabelas(novas, `Tabela "${tab.titulo}" removida.`);
  };

  const handleRestaurarPadrao = async () => {
    if (!isMestre) return;
    if (
      !confirm(
        'Deseja restaurar todas as tabelas de testes oficiais do Livro Básico da 1ª Edição?'
      )
    ) {
      return;
    }
    await persistirTabelas(
      TABELAS_TESTES_PADRAO_1E.map((t) => ({
        ...t,
        colunas: [...t.colunas],
        linhas: t.linhas.map((l) => [...l]),
      })),
      '✓ Todas as tabelas oficiais do livro foram restauradas!'
    );
  };

  const getIconeCategoria = (cat: TabelaTeste['categoria']) => {
    switch (cat) {
      case 'experiencia':
        return <Sparkles className="w-4 h-4 text-amber-300" />;
      case 'besta':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'combate':
        return <Swords className="w-4 h-4 text-rose-400" />;
      case 'fisico':
        return <Dumbbell className="w-4 h-4 text-sky-400" />;
      case 'sobrevivencia':
        return <HeartPulse className="w-4 h-4 text-emerald-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  const tabelasFiltradas = tabelas.filter((tab) => {
    const bateCat = filtroCategoria === 'todas' || tab.categoria === filtroCategoria;
    if (!bateCat) return false;
    const t = busca.toLowerCase().trim();
    if (!t) return true;
    const emMeta =
      tab.titulo.toLowerCase().includes(t) ||
      (tab.subtitulo || '').toLowerCase().includes(t) ||
      (tab.descricao || '').toLowerCase().includes(t) ||
      (tab.notaRodape || '').toLowerCase().includes(t);
    if (emMeta) return true;
    return tab.linhas.some((linha) => linha.some((cel) => cel.toLowerCase().includes(t)));
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3b181b] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xs bg-[#241116] border border-[#522228] flex items-center justify-center shrink-0">
            <ScrollText className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-gothic font-black text-[#d4af37] tracking-wider uppercase">
              Tabelas de Testes &amp; Sistemas
            </h2>
            <p className="text-xs text-[#a89f91] font-serif">
              {isMestre
                ? 'Referência oficial da 1ª Edição — você pode editar qualquer tabela, adicionar regras ou criar novas tabelas.'
                : 'Referência oficial de testes, combate, frenesi, proezas e sobrevivência da crônica (somente visualização).'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isMestre && (
            <>
              <button
                type="button"
                onClick={handleAbrirNovaTabela}
                className="px-3.5 py-2 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs bg-[#8b0000] hover:bg-[#a30d12] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Tabela</span>
              </button>
              <button
                type="button"
                onClick={handleRestaurarPadrao}
                className="px-3 py-2 text-xs text-[#a89f91] hover:text-white bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs cursor-pointer transition-colors flex items-center gap-1.5"
                title="Restaurar tabelas oficiais do Livro Básico"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onVoltar}
            className="px-3 py-2 text-xs text-[#a89f91] hover:text-white bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs cursor-pointer transition-colors"
          >
            Voltar às Fichas
          </button>
        </div>
      </div>

      {mensagemSucesso && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs rounded-xs text-center font-semibold">
          {mensagemSucesso}
        </div>
      )}

      {/* Barra de Busca e Filtros */}
      <div className="bg-[#140e11] border border-[#2d1217] p-4 rounded-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8e8273] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar tabela, teste, dificuldade, manobra, peso, torpor, fogo, queda..."
            className="w-full bg-[#1a1115] border border-[#3b181b] focus:border-[#8b0000] text-xs text-[#ded6cb] pl-9 pr-3 py-2 rounded-xs focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'todas', label: `Todas (${tabelas.length})` },
              { id: 'combate', label: 'Combate & Escudos' },
              { id: 'besta', label: 'Frenesi & Rötschreck' },
              { id: 'fisico', label: 'Escalar & Proezas' },
              { id: 'sobrevivencia', label: 'Torpor, Sol, Fogo, Cura & Queda' },
              { id: 'experiencia', label: 'Experiência (XP)' },
              { id: 'outros', label: 'Outras' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFiltroCategoria(cat.id)}
              className={`px-3 py-1 text-[11px] font-gothic font-bold uppercase tracking-wider rounded-xs border cursor-pointer transition-colors ${
                filtroCategoria === cat.id
                  ? 'bg-[#8b0000] text-white border-[#b31419]'
                  : 'bg-[#1a1115] text-[#a89f91] border-[#3b181b] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grade de Tabelas */}
      {tabelasFiltradas.length === 0 ? (
        <div className="bg-[#140e11] border border-[#2d1217] p-8 rounded-sm text-center text-xs text-[#8e8273] italic">
          Nenhuma tabela encontrada para o filtro informado.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {tabelasFiltradas.map((tab) => {
            const catMeta = CATEGORIAS_META[tab.categoria] || CATEGORIAS_META.outros;
            return (
              <div
                key={tab.id}
                className="bg-[#140e11] border border-[#3b181b] hover:border-[#63262c] rounded-sm shadow-lg flex flex-col overflow-hidden transition-colors"
              >
                {/* Cabeçalho do Card da Tabela */}
                <div className="bg-[#1b1015] px-4 py-3 border-b border-[#3b181b] flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getIconeCategoria(tab.categoria)}
                      <h3 className="font-gothic font-bold text-sm text-[#d4af37] uppercase tracking-wider">
                        {tab.titulo}
                      </h3>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${catMeta.badgeClass}`}
                      >
                        {catMeta.label}
                      </span>
                    </div>
                    {tab.subtitulo && (
                      <p className="text-[11px] text-[#8e8273] font-serif">{tab.subtitulo}</p>
                    )}
                  </div>

                  {isMestre && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAbrirEditarTabela(tab)}
                        className="px-2 py-1 bg-[#241318] hover:bg-[#381b22] border border-[#522228] text-[#d4af37] text-[11px] font-semibold rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Editar esta tabela"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExcluirTabela(tab)}
                        className="p-1 bg-[#181014] hover:bg-red-950 border border-[#3b181b] text-[#8e8273] hover:text-red-400 rounded-xs cursor-pointer transition-colors"
                        title="Excluir esta tabela"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Descrição */}
                {tab.descricao && (
                  <div className="px-4 pt-3 pb-1 text-xs text-[#c7beb2] font-serif leading-relaxed">
                    {tab.descricao}
                  </div>
                )}

                {/* Tabela de Dados */}
                <div className="p-4 overflow-x-auto flex-1">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#4a1c22] bg-[#1a0f14]">
                        {tab.colunas.map((col, cIdx) => (
                          <th
                            key={cIdx}
                            className="py-2 px-2.5 font-gothic font-bold uppercase tracking-wider text-[10px] text-[#d4af37]"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#251318]">
                      {tab.linhas.map((linha, lIdx) => (
                        <tr
                          key={lIdx}
                          className={
                            lIdx % 2 === 0
                              ? 'bg-[#120b0e] hover:bg-[#1e1217]'
                              : 'bg-[#170e13] hover:bg-[#1e1217]'
                          }
                        >
                          {tab.colunas.map((_, cIdx) => (
                            <td
                              key={cIdx}
                              className={`py-2 px-2.5 leading-snug ${
                                cIdx === 0
                                  ? 'font-semibold text-white'
                                  : 'text-[#ded6cb] font-mono text-[11px]'
                              }`}
                            >
                              {linha[cIdx] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Nota de Rodapé */}
                {tab.notaRodape && (
                  <div className="px-4 py-2.5 bg-[#110a0d] border-t border-[#281318] text-[11px] text-[#a89f91] italic font-serif">
                    {tab.notaRodape}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL DE EDIÇÃO / CRIAÇÃO DE TABELA (EXCLUSIVO MESTRE) */}
      {/* ================================================================= */}
      {isMestre && tabelaEditando && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#120a0e] border border-[#522228] rounded-sm max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#180e13] px-5 py-3.5 border-b border-[#3b181b] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-sm sm:text-base font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                  {isNovaTabela ? 'Cadastrar Nova Tabela de Testes' : `Editando: ${tabelaEditando.titulo}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTabelaEditando(null)}
                className="text-[#8e8273] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                    Título da Tabela *
                  </label>
                  <input
                    type="text"
                    value={tabelaEditando.titulo}
                    onChange={(e) =>
                      setTabelaEditando({ ...tabelaEditando, titulo: e.target.value })
                    }
                    placeholder="Ex: Teste de Furtividade"
                    className="w-full bg-[#180f14] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                    Categoria
                  </label>
                  <select
                    value={tabelaEditando.categoria}
                    onChange={(e) =>
                      setTabelaEditando({
                        ...tabelaEditando,
                        categoria: e.target.value as TabelaTeste['categoria'],
                      })
                    }
                    className="w-full bg-[#180f14] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                  >
                    <option value="combate">Combate &amp; Escudos</option>
                    <option value="besta">A Besta (Frenesi / Rötschreck)</option>
                    <option value="fisico">Físico (Escalar / Proezas)</option>
                    <option value="sobrevivencia">Sobrevivência</option>
                    <option value="experiencia">Experiência (XP)</option>
                    <option value="outros">Geral / Outros</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                    Subtítulo / Referência do Livro
                  </label>
                  <input
                    type="text"
                    value={tabelaEditando.subtitulo || ''}
                    onChange={(e) =>
                      setTabelaEditando({ ...tabelaEditando, subtitulo: e.target.value })
                    }
                    placeholder="Ex: Capítulo Sete: Sistemas (pág. 203)"
                    className="w-full bg-[#180f14] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                    Descrição / Regra Explicativa
                  </label>
                  <textarea
                    rows={2}
                    value={tabelaEditando.descricao || ''}
                    onChange={(e) =>
                      setTabelaEditando({ ...tabelaEditando, descricao: e.target.value })
                    }
                    className="w-full bg-[#180f14] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Cabeçalho das Colunas */}
              <div className="bg-[#180f14] border border-[#2d1217] p-3.5 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-gothic font-bold uppercase text-[#d4af37]">
                    Colunas da Tabela
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTabelaEditando({
                        ...tabelaEditando,
                        colunas: [...tabelaEditando.colunas, `Coluna ${tabelaEditando.colunas.length + 1}`],
                        linhas: tabelaEditando.linhas.map((l) => [...l, '']),
                      })
                    }
                    className="px-2 py-1 text-[10px] bg-[#241318] hover:bg-[#381b22] border border-[#522228] text-[#d4af37] rounded-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Coluna
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tabelaEditando.colunas.map((col, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-1 bg-[#110a0d] border border-[#3b181b] rounded-xs px-2 py-1">
                      <input
                        type="text"
                        value={col}
                        onChange={(e) => {
                          const novasCols = [...tabelaEditando.colunas];
                          novasCols[cIdx] = e.target.value;
                          setTabelaEditando({ ...tabelaEditando, colunas: novasCols });
                        }}
                        className="bg-transparent text-xs text-white focus:outline-none w-32"
                      />
                      {tabelaEditando.colunas.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const novasCols = tabelaEditando.colunas.filter((_, i) => i !== cIdx);
                            const novasLinhas = tabelaEditando.linhas.map((l) =>
                              l.filter((_, i) => i !== cIdx)
                            );
                            setTabelaEditando({
                              ...tabelaEditando,
                              colunas: novasCols,
                              linhas: novasLinhas,
                            });
                          }}
                          className="text-[#8e8273] hover:text-red-400 cursor-pointer"
                          title="Remover coluna"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Linhas Editáveis */}
              <div className="bg-[#180f14] border border-[#2d1217] p-3.5 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-gothic font-bold uppercase text-[#d4af37]">
                    Linhas e Valores ({tabelaEditando.linhas.length})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTabelaEditando({
                        ...tabelaEditando,
                        linhas: [
                          ...tabelaEditando.linhas,
                          tabelaEditando.colunas.map(() => ''),
                        ],
                      })
                    }
                    className="px-2.5 py-1 text-[10px] bg-[#8b0000] hover:bg-[#a30d12] text-white font-semibold rounded-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Linha
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {tabelaEditando.linhas.map((linha, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center gap-1.5 bg-[#110a0d] border border-[#2d1217] p-1.5 rounded-xs"
                    >
                      {tabelaEditando.colunas.map((colLabel, cIdx) => (
                        <input
                          key={cIdx}
                          type="text"
                          value={linha[cIdx] ?? ''}
                          placeholder={colLabel}
                          onChange={(e) => {
                            const novasLinhas = tabelaEditando.linhas.map((row, rI) =>
                              rI === lIdx
                                ? row.map((cel, colI) => (colI === cIdx ? e.target.value : cel))
                                : row
                            );
                            setTabelaEditando({ ...tabelaEditando, linhas: novasLinhas });
                          }}
                          className="flex-1 min-w-0 bg-[#180f14] border border-[#3b181b] focus:border-[#d4af37] px-2 py-1 text-xs text-white rounded-xs focus:outline-none"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setTabelaEditando({
                            ...tabelaEditando,
                            linhas: tabelaEditando.linhas.filter((_, i) => i !== lIdx),
                          })
                        }
                        className="p-1 text-[#8e8273] hover:text-red-400 cursor-pointer shrink-0"
                        title="Remover linha"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nota de Rodapé */}
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                  Nota de Rodapé (Opcional)
                </label>
                <input
                  type="text"
                  value={tabelaEditando.notaRodape || ''}
                  onChange={(e) =>
                    setTabelaEditando({ ...tabelaEditando, notaRodape: e.target.value })
                  }
                  placeholder="Ex: Em caso de falha crítica..."
                  className="w-full bg-[#180f14] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#180e13] px-5 py-3 border-t border-[#3b181b] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTabelaEditando(null)}
                className="px-4 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] border border-[#3b181b] rounded-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarTabela}
                className="px-5 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Tabela no Sistema</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
