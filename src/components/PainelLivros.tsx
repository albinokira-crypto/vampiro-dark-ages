import React, { useState, useEffect, useMemo } from 'react';
import type { User } from '../types';
import {
  LIVROS_BIBLIOTECA_VAMPIRO,
  type LivroVampiro,
} from '../data/livrosVampiro';
import {
  BookOpen,
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  List,
  X,
} from 'lucide-react';

interface PainelLivrosProps {
  usuarioAtual: User;
  onVoltar: () => void;
}

const STORAGE_KEY_ULTIMA_LEITURA = 'vampiro_dark_ages_ultima_leitura';

export const PainelLivros: React.FC<PainelLivrosProps> = ({
  usuarioAtual: _usuarioAtual,
  onVoltar,
}) => {
  const [livroAtivoId, setLivroAtivoId] = useState<string | null>(null);
  const [capituloAtivoId, setCapituloAtivoId] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<
    'todos' | LivroVampiro['categoria']
  >('todos');
  const [tamanhoFonte, setTamanhoFonte] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [estiloFonte, setEstiloFonte] = useState<'serif' | 'sans'>('serif');
  const [gavetaSumarioAberta, setGavetaSumarioAberta] = useState(false);

  // Carregar última leitura salva
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY_ULTIMA_LEITURA);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (parsed.livroId) {
          const livroExiste = LIVROS_BIBLIOTECA_VAMPIRO.some((l) => l.id === parsed.livroId);
          if (livroExiste) {
            // Não abre automaticamente para não desorientar, mas deixa registrado
          }
        }
      }
    } catch {}
  }, []);

  const livroAtivo = useMemo(
    () => LIVROS_BIBLIOTECA_VAMPIRO.find((l) => l.id === livroAtivoId) || null,
    [livroAtivoId]
  );

  const capituloAtivo = useMemo(() => {
    if (!livroAtivo) return null;
    return (
      livroAtivo.capitulos.find((c) => c.id === capituloAtivoId) ||
      livroAtivo.capitulos[0] ||
      null
    );
  }, [livroAtivo, capituloAtivoId]);

  // Salvar progresso
  useEffect(() => {
    if (livroAtivo && capituloAtivo) {
      localStorage.setItem(
        STORAGE_KEY_ULTIMA_LEITURA,
        JSON.stringify({ livroId: livroAtivo.id, capituloId: capituloAtivo.id })
      );
    }
  }, [livroAtivo, capituloAtivo]);

  // Filtragem de livros
  const livrosFiltrados = useMemo(() => {
    return LIVROS_BIBLIOTECA_VAMPIRO.filter((l) => {
      const matchCat = filtroCategoria === 'todos' || l.categoria === filtroCategoria;
      if (!matchCat) return false;
      if (!busca.trim()) return true;

      const q = busca.toLowerCase();
      const matchMeta =
        l.titulo.toLowerCase().includes(q) ||
        l.subtitulo.toLowerCase().includes(q) ||
        l.descricaoBreve.toLowerCase().includes(q) ||
        l.edicao.toLowerCase().includes(q);

      const matchCapitulo = l.capitulos.some(
        (c) =>
          c.titulo.toLowerCase().includes(q) ||
          c.numero.toLowerCase().includes(q) ||
          c.conteudo.toLowerCase().includes(q)
      );

      return matchMeta || matchCapitulo;
    });
  }, [busca, filtroCategoria]);

  const handleAbrirLivro = (livroId: string, capId?: string) => {
    const livro = LIVROS_BIBLIOTECA_VAMPIRO.find((l) => l.id === livroId);
    if (!livro) return;
    setLivroAtivoId(livroId);
    setCapituloAtivoId(capId || livro.capitulos[0]?.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMudarCapitulo = (capId: string) => {
    setCapituloAtivoId(capId);
    setGavetaSumarioAberta(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indiceCapAtual = useMemo(() => {
    if (!livroAtivo || !capituloAtivo) return 0;
    return livroAtivo.capitulos.findIndex((c) => c.id === capituloAtivo.id);
  }, [livroAtivo, capituloAtivo]);

  const temAnterior = indiceCapAtual > 0;
  const temProximo = livroAtivo ? indiceCapAtual < livroAtivo.capitulos.length - 1 : false;

  const handleCapituloAnterior = () => {
    if (!livroAtivo || !temAnterior) return;
    const anterior = livroAtivo.capitulos[indiceCapAtual - 1];
    if (anterior) handleMudarCapitulo(anterior.id);
  };

  const handleCapituloProximo = () => {
    if (!livroAtivo || !temProximo) return;
    const proximo = livroAtivo.capitulos[indiceCapAtual + 1];
    if (proximo) handleMudarCapitulo(proximo.id);
  };

  // Parser leve e seguro de Markdown
  const renderMarkdownConteudo = (texto: string) => {
    const linhas = texto.split('\n');
    const elementos: React.ReactNode[] = [];
    let blocoCitacao: string[] = [];
    let blocoLista: string[] = [];

    const flushCitacao = (key: string) => {
      if (blocoCitacao.length > 0) {
        elementos.push(
          <blockquote
            key={key}
            className="my-3 pl-4 py-2 border-l-2 border-[#d4af37] bg-[#1a0e12]/80 rounded-r-xs italic text-[#ded6cb] text-sm leading-relaxed"
          >
            {blocoCitacao.map((c, i) => (
              <p key={i} className="mb-1 last:mb-0">
                {formatarTrechoTexto(c)}
              </p>
            ))}
          </blockquote>
        );
        blocoCitacao = [];
      }
    };

    const flushLista = (key: string) => {
      if (blocoLista.length > 0) {
        elementos.push(
          <ul key={key} className="my-2 space-y-1 list-disc list-inside text-sm text-[#ded6cb] pl-2">
            {blocoLista.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {formatarTrechoTexto(item)}
              </li>
            ))}
          </ul>
        );
        blocoLista = [];
      }
    };

    linhas.forEach((linha, idx) => {
      const l = linha.trim();

      // Citação em bloco (> ...)
      if (l.startsWith('>')) {
        flushLista(`fl_${idx}`);
        blocoCitacao.push(l.replace(/^>\s*/, ''));
        return;
      }
      flushCitacao(`fc_${idx}`);

      // Listas (- ... ou * ...)
      if (l.startsWith('- ') || l.startsWith('* ')) {
        blocoLista.push(l.replace(/^[-*]\s*/, ''));
        return;
      }
      // Listas numeradas (1. ...)
      if (/^\d+\.\s/.test(l)) {
        flushLista(`fl_num_${idx}`);
        elementos.push(
          <div key={`num_${idx}`} className="my-1.5 flex items-start gap-2 text-sm text-[#ded6cb] pl-1">
            <span className="font-mono font-bold text-[#d4af37] text-xs px-1.5 py-0.5 rounded-xs bg-[#241318] border border-[#522228] shrink-0">
              {l.match(/^\d+/)?.[0]}
            </span>
            <div className="leading-relaxed">{formatarTrechoTexto(l.replace(/^\d+\.\s*/, ''))}</div>
          </div>
        );
        return;
      }
      flushLista(`fl_end_${idx}`);

      // Cabeçalhos H3 (### ...)
      if (l.startsWith('### ')) {
        elementos.push(
          <h3
            key={`h3_${idx}`}
            className="text-base sm:text-lg font-gothic font-bold text-[#d4af37] uppercase tracking-wider mt-5 mb-2 border-b border-[#3b181b] pb-1 flex items-center gap-2"
          >
            <span>{l.replace('### ', '')}</span>
          </h3>
        );
        return;
      }

      // Cabeçalhos H4 (#### ...)
      if (l.startsWith('#### ')) {
        elementos.push(
          <h4
            key={`h4_${idx}`}
            className="text-sm font-gothic font-bold text-rose-300 uppercase tracking-wide mt-3 mb-1"
          >
            {l.replace('#### ', '')}
          </h4>
        );
        return;
      }

      // Linhas em branco
      if (!l) {
        elementos.push(<div key={`sp_${idx}`} className="h-2" />);
        return;
      }

      // Parágrafos normais
      elementos.push(
        <p key={`p_${idx}`} className="leading-relaxed my-1.5 text-inherit">
          {formatarTrechoTexto(l)}
        </p>
      );
    });

    flushCitacao('fc_final');
    flushLista('fl_final');

    return elementos;
  };

  // Helper para formatar negritos (**...**) e itálicos (*...*)
  const formatarTrechoTexto = (str: string): React.ReactNode => {
    // Processamento simples de **negrito** e *itálico*
    const partes = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return partes.map((parte, i) => {
      if (parte.startsWith('**') && parte.endsWith('**')) {
        return (
          <strong key={i} className="text-[#f5e6d3] font-bold">
            {parte.slice(2, -2)}
          </strong>
        );
      }
      if (parte.startsWith('*') && parte.endsWith('*')) {
        return (
          <em key={i} className="text-amber-200/90 italic">
            {parte.slice(1, -1)}
          </em>
        );
      }
      return parte;
    });
  };

  return (
    <div className="space-y-4">
      {/* ===================================================================== */}
      {/* MODO 1: LEITOR ABERTO                                                 */}
      {/* ===================================================================== */}
      {livroAtivo && capituloAtivo ? (
        <div className="space-y-4 animate-fadeIn">
          {/* BARRA SUPERIOR DE CONTROLES DO LEITOR */}
          <div className="bg-[#140e11] border border-[#8b0000] p-3 rounded-sm shadow-xl flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLivroAtivoId(null)}
                className="px-2.5 py-1.5 text-xs font-semibold bg-[#241318] hover:bg-[#3d1820] text-[#d4af37] border border-[#522228] rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                title="Voltar ao catálogo de livros"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Biblioteca</span>
              </button>

              <button
                type="button"
                onClick={() => setGavetaSumarioAberta(!gavetaSumarioAberta)}
                className="px-2.5 py-1.5 text-xs font-semibold bg-[#1a1115] hover:bg-[#28141c] text-[#ded6cb] border border-[#3b181b] rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Abrir sumário de capítulos"
              >
                <List className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">Sumário</span>
                <span className="text-[10px] text-[#a89f91] font-mono">
                  ({indiceCapAtual + 1}/{livroAtivo.capitulos.length})
                </span>
              </button>
            </div>

            <div className="text-center min-w-0 flex-1 max-w-md hidden md:block">
              <div className="text-[11px] font-gothic font-bold text-[#d4af37] uppercase tracking-wider truncate">
                {livroAtivo.titulo}
              </div>
              <div className="text-[10px] text-[#a89f91] truncate font-serif">
                {capituloAtivo.numero}: {capituloAtivo.titulo}
              </div>
            </div>

            {/* CONTROLES DE LEITURA (TAMANHO DE FONTE & ESTILO) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#1a1115] border border-[#3b181b] rounded-xs p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setEstiloFonte('serif')}
                  className={`px-2 py-0.5 rounded-xs text-[11px] font-serif cursor-pointer transition-colors ${
                    estiloFonte === 'serif'
                      ? 'bg-[#3b1820] text-[#d4af37] font-bold shadow-xs'
                      : 'text-[#8c8273] hover:text-white'
                  }`}
                  title="Fonte Clássica Serifada"
                >
                  Serif
                </button>
                <button
                  type="button"
                  onClick={() => setEstiloFonte('sans')}
                  className={`px-2 py-0.5 rounded-xs text-[11px] font-sans cursor-pointer transition-colors ${
                    estiloFonte === 'sans'
                      ? 'bg-[#3b1820] text-[#d4af37] font-bold shadow-xs'
                      : 'text-[#8c8273] hover:text-white'
                  }`}
                  title="Fonte Moderna Sem Serifa"
                >
                  Sans
                </button>
              </div>

              <div className="flex items-center bg-[#1a1115] border border-[#3b181b] rounded-xs p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTamanhoFonte('sm')}
                  className={`px-2 py-0.5 rounded-xs text-[10px] font-mono cursor-pointer transition-colors ${
                    tamanhoFonte === 'sm' ? 'bg-[#8b0000] text-white font-bold' : 'text-[#8c8273]'
                  }`}
                  title="Texto Pequeno"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setTamanhoFonte('base')}
                  className={`px-2 py-0.5 rounded-xs text-[11px] font-mono cursor-pointer transition-colors ${
                    tamanhoFonte === 'base' ? 'bg-[#8b0000] text-white font-bold' : 'text-[#8c8273]'
                  }`}
                  title="Texto Padrão"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setTamanhoFonte('lg')}
                  className={`px-2 py-0.5 rounded-xs text-xs font-mono cursor-pointer transition-colors ${
                    tamanhoFonte === 'lg' ? 'bg-[#8b0000] text-white font-bold' : 'text-[#8c8273]'
                  }`}
                  title="Texto Grande"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* GAVETA LATERAL DO SUMÁRIO */}
          {gavetaSumarioAberta && (
            <div className="bg-[#120a0e] border border-[#522228] p-4 rounded-sm shadow-2xl space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                  <List className="w-4 h-4 text-[#ef4444]" />
                  <span>Sumário — {livroAtivo.titulo}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setGavetaSumarioAberta(false)}
                  className="text-[#a89f91] hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                {livroAtivo.capitulos.map((cap) => {
                  const isAtual = cap.id === capituloAtivo.id;
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => handleMudarCapitulo(cap.id)}
                      className={`text-left p-2.5 rounded-xs border transition-all cursor-pointer ${
                        isAtual
                          ? 'bg-[#3b1820] border-[#d4af37] text-white shadow-md'
                          : 'bg-[#181014] border-[#251015] hover:border-[#522228] text-[#a89f91] hover:text-[#ded6cb]'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase text-[#d4af37]/80">
                        {cap.numero}
                      </div>
                      <div className="text-xs font-semibold truncate">{cap.titulo}</div>
                      {cap.subtitulo && (
                        <div className="text-[10px] text-[#706456] truncate mt-0.5">
                          {cap.subtitulo}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ÁREA DE LEITURA (FOLHA MEDIEVAL / E-READER) */}
          <div className="bg-[#100a0d] border border-[#3b181b] rounded-sm p-5 sm:p-8 md:p-12 shadow-2xl space-y-6 max-w-4xl mx-auto">
            {/* CABEÇALHO DO CAPÍTULO */}
            <div className="text-center border-b border-[#3b181b] pb-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-widest bg-[#241318] border border-[#522228] text-[#d4af37]">
                <Bookmark className="w-3 h-3 text-[#ef4444]" />
                <span>{capituloAtivo.numero}</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                {capituloAtivo.titulo}
              </h1>
              {capituloAtivo.subtitulo && (
                <p className="text-xs sm:text-sm text-[#a89f91] italic font-serif max-w-2xl mx-auto">
                  {capituloAtivo.subtitulo}
                </p>
              )}
            </div>

            {/* CONTEÚDO DO CAPÍTULO */}
            <article
              className={`text-[#ded6cb] ${
                estiloFonte === 'serif' ? 'font-serif' : 'font-sans'
              } ${
                tamanhoFonte === 'sm'
                  ? 'text-xs leading-relaxed'
                  : tamanhoFonte === 'base'
                  ? 'text-sm leading-relaxed sm:text-[15px]'
                  : tamanhoFonte === 'lg'
                  ? 'text-base leading-relaxed sm:text-lg'
                  : 'text-lg leading-relaxed sm:text-xl'
              }`}
            >
              {renderMarkdownConteudo(capituloAtivo.conteudo)}
            </article>

            {/* BARRA DE NAVEGAÇÃO INFERIOR */}
            <div className="pt-8 border-t border-[#3b181b] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCapituloAnterior}
                disabled={!temAnterior}
                className={`px-3 py-2 text-xs font-semibold rounded-xs border flex items-center gap-1.5 transition-colors ${
                  temAnterior
                    ? 'bg-[#1e1317] hover:bg-[#2d1820] text-[#d4af37] border-[#522228] cursor-pointer'
                    : 'bg-[#120a0e] text-[#554b42] border-[#221014] cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Capítulo Anterior</span>
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-[11px] text-[#a89f91] hover:text-[#d4af37] font-mono cursor-pointer transition-colors"
                title="Voltar ao início da página"
              >
                ↑ Início
              </button>

              <button
                type="button"
                onClick={handleCapituloProximo}
                disabled={!temProximo}
                className={`px-3 py-2 text-xs font-semibold rounded-xs border flex items-center gap-1.5 transition-colors ${
                  temProximo
                    ? 'bg-[#8b0000] hover:bg-[#a30d12] text-white border-[#b91c1c] cursor-pointer shadow-md'
                    : 'bg-[#120a0e] text-[#554b42] border-[#221014] cursor-not-allowed opacity-40'
                }`}
              >
                <span>Próximo Capítulo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* MODO 2: CATÁLOGO DA BIBLIOTECA (GALERIA DE LIVROS)                   */
        /* ===================================================================== */
        <div className="space-y-5 animate-fadeIn">
          {/* CABEÇALHO DA BIBLIOTECA */}
          <div className="bg-[#140e11] border border-[#3b181b] p-4 sm:p-5 rounded-sm shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#251015] border border-[#8b0000] rounded-xs shadow-[0_0_12px_rgba(239,68,68,0.35)]">
                  <BookOpen className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-gothic font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
                    <span>Biblioteca & Códices da Noite</span>
                  </h2>
                  <p className="text-xs text-[#a89f91]">
                    Acervo completo: Livros de Clã, Outros Clãs (Linhagens, Derivados e Criações de Fãs), Idade das Trevas (1ª Edição), A Máscara, Guia da Camarilla e Livro de Nod.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onVoltar}
                className="px-3 py-1.5 text-xs font-semibold bg-[#1e1317] hover:bg-[#2e1820] text-[#a89f91] hover:text-white border border-[#3b181b] rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors self-end sm:self-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Painel</span>
              </button>
            </div>

            {/* BARRA DE PESQUISA E FILTROS */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 pt-2 border-t border-[#251015]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8e8273] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Pesquisar nos livros por título, capítulo ou tema..."
                  className="w-full bg-[#181014] border border-[#3b181b] focus:border-[#d4af37] rounded-xs text-xs text-[#ded6cb] pl-9 pr-8 py-2 focus:outline-hidden transition-colors"
                />
                {busca && (
                  <button
                    type="button"
                    onClick={() => setBusca('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8273] hover:text-white text-xs cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs shrink-0">
                {(
                  [
                    ['todos', 'Todos os Livros'],
                    ['cla', 'Livros de Clã'],
                    ['outros_clas', 'Outros Clãs'],
                    ['dark_ages', 'Idade das Trevas'],
                    ['mascara', 'A Máscara'],
                    ['camarilla', 'Camarilla'],
                    ['lore_nod', 'Livro de Nod'],
                  ] as const
                ).map(([catKey, label]) => (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setFiltroCategoria(catKey)}
                    className={`px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
                      filtroCategoria === catKey
                        ? 'bg-[#8b0000] text-white shadow-xs'
                        : 'bg-[#181014] text-[#a89f91] hover:text-[#ded6cb] border border-[#2d1217]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GRADE DE LIVROS */}
          {livrosFiltrados.length === 0 ? (
            <div className="bg-[#140e11] border border-[#3b181b] p-8 text-center text-[#8e8273] rounded-sm italic">
              Nenhum livro ou capítulo encontrado para o termo pesquisado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {livrosFiltrados.map((livro) => (
                <div
                  key={livro.id}
                  className={`bg-gradient-to-br ${livro.corTema} p-5 rounded-sm border shadow-xl flex flex-col justify-between space-y-4 hover:border-[#d4af37] transition-all group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl p-2 bg-black/40 rounded-xs border border-white/10 group-hover:scale-105 transition-transform">
                          {livro.capaIcon}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37]/80 block">
                            {filtroCategoria === 'todos'
                              ? `${
                                  {
                                    cla: 'Livro de Clã',
                                    outros_clas: 'Outros Clãs',
                                    dark_ages: 'Idade das Trevas',
                                    mascara: 'A Máscara',
                                    camarilla: 'Camarilla',
                                    lore_nod: 'Livro de Nod',
                                  }[livro.categoria]
                                } • `
                              : ''}
                            {livro.ano} • {livro.edicao}
                          </span>
                          <h3 className="text-base sm:text-lg font-gothic font-bold text-[#f5e6d3] uppercase tracking-wide group-hover:text-[#d4af37] transition-colors">
                            {livro.titulo}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#a89f91] italic font-serif leading-relaxed">
                      "{livro.subtitulo}"
                    </p>

                    <p className="text-xs text-[#ded6cb] leading-relaxed line-clamp-3">
                      {livro.sinopse}
                    </p>

                    {/* PRÉVIA DOS CAPÍTULOS */}
                    <div className="pt-2 border-t border-white/10 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-[#a89f91] tracking-wider">
                        Capítulos ({livro.capitulos.length}):
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {livro.capitulos.slice(0, 4).map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 rounded-xs text-[10px] bg-black/50 text-[#ded6cb] border border-white/5 truncate max-w-[160px]"
                          >
                            {c.numero}
                          </span>
                        ))}
                        {livro.capitulos.length > 4 && (
                          <span className="text-[10px] text-[#a89f91] font-mono">
                            +{livro.capitulos.length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="text-[10px] text-[#8e8273] font-mono">
                      Formato E-Reader Leve
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAbrirLivro(livro.id)}
                      className="px-4 py-2 text-xs font-gothic font-bold uppercase tracking-wider bg-[#8b0000] hover:bg-[#a30d12] text-white rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all group-hover:shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Abrir Tomo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
