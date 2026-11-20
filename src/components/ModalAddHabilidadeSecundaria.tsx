import React, { useState, useMemo } from 'react';
import type { Personagem, User, HabilidadeSecundariaItem, CategoriaHabilidadeSecundaria } from '../types';
import {
  SUGESTOES_HABILIDADES_SECUNDARIAS_1E,
  type SugestaoHabilidadeSecundaria,
} from '../data/habilidadesSecundarias1E';
import {
  X,
  Plus,
  Search,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface ModalAddHabilidadeSecundariaProps {
  ficha: Personagem;
  usuarioAtual: User;
  maxBolinhas: number;
  modoEdicaoLivre: boolean;
  onFechar: () => void;
  onAdicionar: (habilidade: HabilidadeSecundariaItem, custoXP: number) => void;
}

export const ModalAddHabilidadeSecundaria: React.FC<ModalAddHabilidadeSecundariaProps> = ({
  ficha,
  maxBolinhas,
  modoEdicaoLivre,
  onFechar,
  onAdicionar,
}) => {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<'todas' | CategoriaHabilidadeSecundaria>('todas');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaHabilidadeSecundaria>('talento');
  const [nivelInicial, setNivelInicial] = useState<number>(1);
  const [observacao, setObservacao] = useState('');
  const [sugestaoSelecionada, setSugestaoSelecionada] = useState<SugestaoHabilidadeSecundaria | null>(null);

  const isEmCriacao = ficha.criacao?.status === 'em_criacao';
  const isGratis = modoEdicaoLivre || isEmCriacao;

  // Cálculo canônico do custo em XP para Habilidade Secundária:
  // 1º ponto (1ª bola) = 2 XP; Pontos seguintes (2ª a 5ª) = nível atual x 1
  const calcularCustoXP = (nivel: number): number => {
    if (isGratis || nivel <= 0) return 0;
    let total = 0;
    for (let n = 0; n < nivel; n++) {
      total += n === 0 ? 2 : n * 1;
    }
    return total;
  };

  const custoXP = calcularCustoXP(nivelInicial);
  const saldoXP = ficha.xp?.atual || 0;
  const temXPSuficiente = isGratis || saldoXP >= custoXP;

  // Filtragem das sugestões canônicas
  const sugestoesFiltradas = useMemo(() => {
    return SUGESTOES_HABILIDADES_SECUNDARIAS_1E.filter((sug) => {
      const matchCategoria = categoriaFiltro === 'todas' || sug.categoria === categoriaFiltro;
      const matchBusca =
        !busca.trim() ||
        sug.nome.toLowerCase().includes(busca.toLowerCase()) ||
        sug.descricao.toLowerCase().includes(busca.toLowerCase());
      return matchCategoria && matchBusca;
    });
  }, [busca, categoriaFiltro]);

  const handleSelecionarSugestao = (sug: SugestaoHabilidadeSecundaria) => {
    setSugestaoSelecionada(sug);
    setNome(sug.nome);
    setCategoria(sug.categoria);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      alert('Informe o nome da habilidade secundária.');
      return;
    }

    if (!temXPSuficiente) {
      alert(`XP Insuficiente! Adquirir ${nomeLimpo} nível ${nivelInicial} custa ${custoXP} XP, mas você possui apenas ${saldoXP} XP.`);
      return;
    }

    const nova: HabilidadeSecundariaItem = {
      id: 'habsec_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      nome: nomeLimpo,
      categoria,
      nivel: Math.max(1, Math.min(maxBolinhas, nivelInicial)),
      observacao: observacao.trim() || undefined,
    };

    onAdicionar(nova, custoXP);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#120a0e] border border-[#8b0000] w-full max-w-2xl rounded-sm shadow-2xl p-5 space-y-4 text-[#ded6cb] relative max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#3b181b] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h3 className="text-base sm:text-lg font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                Adicionar Habilidade Secundária
              </h3>
              <p className="text-xs text-[#8e8273]">
                1ª Edição (1996) • Escolha do catálogo de sugestões ou digite manualmente
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

        {/* Conteúdo com rolagem interna se necessário */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {/* Card informativo de regras de custo */}
          <div className="bg-[#190f14] border border-[#3b181b] p-3 rounded-xs text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#d4af37] block">Regra Canônica de Custo em XP:</span>
              <p className="text-[#a89f91]">
                O primeiro ponto (1ª bolinha) custa <strong className="text-emerald-400">2 XP</strong>. Cada evolução subsequente custa <strong className="text-emerald-400">Nível Atual × 1 XP</strong> (ex: nv 1→2: 1 XP, nv 2→3: 2 XP, nv 3→4: 3 XP, nv 4→5: 4 XP).
              </p>
              {isGratis ? (
                <span className="text-amber-300 font-bold block pt-0.5">
                  ✓ Modo Livre / Criação Ativo: custo em XP isento.
                </span>
              ) : (
                <span className="text-[#8e8273] block pt-0.5">
                  Saldo de XP disponível nesta ficha: <strong className="text-[#d4af37]">{saldoXP} XP</strong>.
                </span>
              )}
            </div>
          </div>

          {/* Sugestões Canônicas Rápidas */}
          <div className="bg-[#170e13] border border-[#2d1217] p-3 rounded-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-gothic font-bold uppercase text-[#d4af37] tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Sugestões Canônicas da 1ª Edição
              </span>
              {/* Filtro por categoria */}
              <div className="flex items-center gap-1 text-[10px]">
                {(['todas', 'talento', 'pericia', 'conhecimento'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoriaFiltro(cat)}
                    className={`px-2 py-0.5 rounded-xs uppercase font-bold transition-colors cursor-pointer ${
                      categoriaFiltro === cat
                        ? 'bg-[#8b0000] text-white'
                        : 'bg-[#221318] text-[#8e8273] hover:text-white border border-[#3b181b]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Barra de busca */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#706456]" />
              <input
                type="search"
                placeholder="Buscar sugestão (ex: Saque Rápido, Artesanato Corporal, Heráldica)..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-[#110b0e] border border-[#3b181b] rounded-xs pl-8 pr-3 py-1.5 text-xs text-[#ded6cb] placeholder:text-[#5e544c] focus:outline-hidden focus:border-[#8b0000]"
              />
            </div>

            {/* Lista compacta de sugestões com clique para autopreencher */}
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
              {sugestoesFiltradas.map((sug) => {
                const selecionado = nome.toLowerCase().trim() === sug.nome.toLowerCase().trim();
                return (
                  <button
                    key={sug.nome}
                    type="button"
                    onClick={() => handleSelecionarSugestao(sug)}
                    className={`w-full text-left p-1.5 rounded-xs text-xs flex items-center justify-between border cursor-pointer transition-colors ${
                      selecionado
                        ? 'bg-[#3b1820] border-[#d4af37] text-white'
                        : 'bg-[#120a0e] border-[#251419] text-[#a89f91] hover:text-[#ded6cb] hover:bg-[#1f1016]'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-white block">{sug.nome}</span>
                      <span className="text-[10px] text-[#706456] block line-clamp-1">{sug.descricao}</span>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-xs bg-[#241318] text-[#d4af37] border border-[#3b181b] shrink-0 ml-2">
                      {sug.categoria}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulário de Criação / Edição do Item */}
          <form id="form-hab-secundaria" onSubmit={handleSubmit} className="space-y-3">
            {/* Campo Nome */}
            <div>
              <label className="block text-[11px] font-gothic font-bold uppercase text-[#a89f91] mb-1">
                Nome da Habilidade Secundária *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Saque Rápido, Artesanato Corporal, Teologia..."
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setSugestaoSelecionada(null);
                }}
                className="w-full bg-[#170e13] border border-[#522228] focus:border-[#d4af37] px-3 py-2 text-sm font-semibold text-white rounded-xs focus:outline-hidden"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-[11px] font-gothic font-bold uppercase text-[#a89f91] mb-1">
                Categoria *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'talento', label: 'Talento Secundário' },
                  { id: 'pericia', label: 'Perícia Secundária' },
                  { id: 'conhecimento', label: 'Conhecimento Secundário' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategoria(item.id as CategoriaHabilidadeSecundaria)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xs border text-center transition-colors cursor-pointer ${
                      categoria === item.id
                        ? 'bg-[#8b0000] text-white border-[#ef4444]'
                        : 'bg-[#180e13] text-[#8e8273] hover:text-white border-[#3b181b]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nível Inicial */}
            <div>
              <label className="block text-[11px] font-gothic font-bold uppercase text-[#a89f91] mb-1">
                Nível Inicial (Pontos / Bolinhas)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={maxBolinhas}
                  value={nivelInicial}
                  onChange={(e) => setNivelInicial(Math.max(1, Math.min(maxBolinhas, parseInt(e.target.value) || 1)))}
                  className="w-24 bg-[#170e13] border border-[#522228] focus:border-[#d4af37] px-3 py-1.5 text-base font-mono font-bold text-[#d4af37] rounded-xs text-center focus:outline-hidden"
                />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNivelInicial(lvl)}
                      className={`w-7 h-7 rounded-xs font-mono text-xs font-bold transition-colors cursor-pointer ${
                        nivelInicial === lvl
                          ? 'bg-[#d4af37] text-black shadow-xs'
                          : 'bg-[#1c1015] text-[#8e8273] hover:text-white border border-[#3b181b]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Observação / Especialidade */}
            <div>
              <label className="block text-[11px] font-gothic font-bold uppercase text-[#a89f91] mb-1">
                Observação / Especialidade / Atributo Sugerido (Opcional)
              </label>
              <input
                type="text"
                placeholder={sugestaoSelecionada?.atributoSugerido ? `Sugerido: ${sugestaoSelecionada.atributoSugerido}` : 'Ex: Clã Tzimisce, Espadas medievais, Heresias cátaras...'}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full bg-[#170e13] border border-[#3b181b] focus:border-[#d4af37] px-3 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-hidden"
              />
            </div>

            {/* Previsão do Custo em XP */}
            <div className="bg-[#1a0e14] border border-[#3b181b] p-3 rounded-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[#a89f91] block">Custo de Aquisição:</span>
                <span className="text-xs text-[#706456]">
                  {isGratis
                    ? 'Isento (Modo Livre / Criação)'
                    : nivelInicial === 1
                    ? '1ª Bolinha = 2 XP'
                    : `1ª Bolinha (2 XP) + ${nivelInicial - 1} evolução(ões)`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-mono font-bold text-[#d4af37]">
                  {custoXP} XP
                </span>
                {!temXPSuficiente && (
                  <span className="text-[11px] text-rose-400 font-bold block flex items-center gap-1 justify-end">
                    <AlertTriangle className="w-3 h-3" /> Saldo insuficiente ({saldoXP} XP)
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Rodapé / Ações */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#3b181b] shrink-0">
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-2 bg-[#1b1216] hover:bg-[#29161d] border border-[#3b181b] text-xs font-semibold text-[#a89f91] hover:text-white rounded-xs cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-hab-secundaria"
            disabled={!nome.trim() || !temXPSuficiente}
            className="px-5 py-2 bg-[#8b0000] hover:bg-[#a30d12] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.4)]"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar ({custoXP} XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
