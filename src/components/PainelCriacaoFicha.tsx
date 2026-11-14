import React, { useState } from 'react';
import type {
  Personagem,
  ConfiguracaoMesa,
  CategoriaAtributo,
  CategoriaHabilidade,
  QualidadeDefeitoItem,
} from '../types';
import {
  Sparkles,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  Trash2,
  X,
  Search,
  BookOpen,
} from 'lucide-react';
import {
  QUALIDADES_DEFEITOS_1E,
  type ModeloQualidadeDefeito,
} from '../data/qualidadesDefeitos1E';

interface PainelCriacaoFichaProps {
  ficha: Personagem;
  config: ConfiguracaoMesa;
  onAtualizarFicha: (fichaAtualizada: Personagem) => void;
  onFinalizarCriacao: () => void;
}

export const PainelCriacaoFicha: React.FC<PainelCriacaoFichaProps> = ({
  ficha,
  config,
  onAtualizarFicha,
  onFinalizarCriacao,
}) => {
  const [modalPrioridadesAberto, setModalPrioridadesAberto] = useState(
    !ficha.criacao?.prioridadesAtributos || !ficha.criacao?.prioridadesHabilidades
  );
  const [modalQualidadesAberto, setModalQualidadesAberto] = useState(false);

  // Filtros de Qualidades e Defeitos
  const [filtroTipoQD, setFiltroTipoQD] = useState<'todos' | 'qualidade' | 'defeito'>('todos');
  const [filtroCatQD, setFiltroCatQD] = useState<
    'todas' | 'fisico' | 'mental' | 'social' | 'sobrenatural'
  >('todas');
  const [buscaQD, setBuscaQD] = useState('');

  // Formulário de Qualidade/Defeito Customizada
  const [nomeCustomQD, setNomeCustomQD] = useState('');
  const [tipoCustomQD, setTipoCustomQD] = useState<'qualidade' | 'defeito'>('qualidade');
  const [catCustomQD, setCatCustomQD] = useState<
    'fisico' | 'mental' | 'social' | 'sobrenatural'
  >('fisico');
  const [pontosCustomQD, setPontosCustomQD] = useState<number>(1);
  const [descCustomQD, setDescCustomQD] = useState('');

  const criacao = ficha.criacao || {
    status: 'em_criacao',
    etapa: 'prioridades',
    disciplinasPrimariasIds: [],
    pontosBonusGastos: 0,
  };

  const etapa = criacao.etapa || 'iniciais';

  // Cálculos de gastos de Atributos (base 1)
  const gastosFisicos =
    Math.max(0, ficha.atributos.forca - 1) +
    Math.max(0, ficha.atributos.destreza - 1) +
    Math.max(0, ficha.atributos.vigor - 1);

  const gastosSociais =
    Math.max(0, ficha.atributos.carisma - 1) +
    Math.max(0, ficha.atributos.manipulacao - 1) +
    Math.max(0, ficha.atributos.aparencia - 1);

  const gastosMentais =
    Math.max(0, ficha.atributos.percepcao - 1) +
    Math.max(0, ficha.atributos.inteligencia - 1) +
    Math.max(0, ficha.atributos.raciocinio - 1);

  // Limites conforme prioridades de atributos
  const getLimiteAtributo = (cat: CategoriaAtributo) => {
    if (!criacao.prioridadesAtributos) return 0;
    if (criacao.prioridadesAtributos.primario === cat) return config.pontosAtributos.primario;
    if (criacao.prioridadesAtributos.secundario === cat) return config.pontosAtributos.secundario;
    return config.pontosAtributos.terciario;
  };

  const maxFisicos = getLimiteAtributo('fisicos');
  const maxSociais = getLimiteAtributo('sociais');
  const maxMentais = getLimiteAtributo('mentais');

  // Cálculos de gastos de Habilidades (base 0)
  const gastosTalentos =
    ficha.habilidades.prontidao +
    ficha.habilidades.esportes +
    ficha.habilidades.briga +
    ficha.habilidades.esquiva +
    ficha.habilidades.empatia +
    ficha.habilidades.expressao +
    ficha.habilidades.intimidacao +
    ficha.habilidades.lideranca +
    ficha.habilidades.ladinagem +
    ficha.habilidades.manha;

  const gastosPericias =
    ficha.habilidades.empatiaAnimais +
    ficha.habilidades.tiroComArco +
    ficha.habilidades.artesanato +
    ficha.habilidades.cavalaria +
    ficha.habilidades.etiqueta +
    ficha.habilidades.herbalismo +
    ficha.habilidades.armasBrancas +
    ficha.habilidades.musica +
    ficha.habilidades.sobrevivencia;

  const gastosConhecimentos =
    ficha.habilidades.academicos +
    ficha.habilidades.sabedoriaPopular +
    ficha.habilidades.investigacao +
    ficha.habilidades.direito +
    ficha.habilidades.linguistica +
    ficha.habilidades.medicina +
    ficha.habilidades.ocultismo +
    ficha.habilidades.politica +
    ficha.habilidades.senescencia;

  const getLimiteHabilidade = (cat: CategoriaHabilidade) => {
    if (!criacao.prioridadesHabilidades) return 0;
    if (criacao.prioridadesHabilidades.primario === cat) return config.pontosHabilidades.primario;
    if (criacao.prioridadesHabilidades.secundario === cat) return config.pontosHabilidades.secundario;
    return config.pontosHabilidades.terciario;
  };

  const maxTalentos = getLimiteHabilidade('talentos');
  const maxPericias = getLimiteHabilidade('pericias');
  const maxConhecimentos = getLimiteHabilidade('conhecimentos');

  // Disciplinas, Antecedentes e Virtudes
  const gastosDisciplinas = ficha.disciplinas.reduce((acc, d) => acc + d.nivel, 0);
  const gastosAntecedentes = ficha.antecedentes.reduce((acc, a) => acc + a.nivel, 0);
  const gastosVirtudes =
    Math.max(0, ficha.virtudes.consciencia - 1) +
    Math.max(0, ficha.virtudes.autocontrole - 1) +
    Math.max(0, ficha.virtudes.coragem - 1);

  // Status de conclusão dos pontos iniciais
  const atributosCompletos =
    gastosFisicos === maxFisicos &&
    gastosSociais === maxSociais &&
    gastosMentais === maxMentais;

  const habilidadesCompletas =
    gastosTalentos === maxTalentos &&
    gastosPericias === maxPericias &&
    gastosConhecimentos === maxConhecimentos;

  const vantagensCompletas =
    gastosDisciplinas === config.pontosDisciplinas &&
    gastosAntecedentes === config.pontosAntecedentes &&
    gastosVirtudes === config.pontosVirtudes;

  const pontosIniciaisValidos =
    atributosCompletos && habilidadesCompletas && vantagensCompletas;

  // Cálculos de Qualidades e Defeitos & Saldo de Pontos Bônus
  const listaQD = ficha.qualidadesDefeitos || [];
  const qualidades = listaQD.filter((i) => i.tipo === 'qualidade');
  const defeitos = listaQD.filter((i) => i.tipo === 'defeito');

  const pontosDefeitosGanhos = defeitos.reduce((acc, d) => acc + d.custo, 0);
  const pontosQualidadesGastos = qualidades.reduce((acc, q) => acc + q.custo, 0);

  const totalBonusDisponivel = config.pontosBonus + pontosDefeitosGanhos;
  const pontosOutrosGastos = criacao.pontosBonusGastos || 0;
  const totalBonusGasto = pontosOutrosGastos + pontosQualidadesGastos;
  const saldoBonusRestante = totalBonusDisponivel - totalBonusGasto;

  // Alternar entre Iniciais e Bônus
  const alternarEtapaBonus = () => {
    const novaEtapa = etapa === 'iniciais' ? 'bonus' : 'iniciais';
    onAtualizarFicha({
      ...ficha,
      criacao: {
        ...criacao,
        etapa: novaEtapa,
      },
    });
  };

  // Handlers de Qualidades e Defeitos
  const handleToggleQualidadeDefeito = (itemModelo: ModeloQualidadeDefeito) => {
    const jaExiste = listaQD.find(
      (q) => q.nome.toLowerCase() === itemModelo.nome.toLowerCase()
    );

    let novaLista: QualidadeDefeitoItem[];
    if (jaExiste) {
      novaLista = listaQD.filter((q) => q.id !== jaExiste.id);
    } else {
      novaLista = [
        ...listaQD,
        {
          id: 'qd_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5),
          nome: itemModelo.nome,
          tipo: itemModelo.tipo,
          categoria: itemModelo.categoria,
          custo: itemModelo.pontos,
          descricao: itemModelo.descricao,
        },
      ];
    }

    onAtualizarFicha({
      ...ficha,
      qualidadesDefeitos: novaLista,
    });
  };

  const handleRemoverQD = (id: string) => {
    onAtualizarFicha({
      ...ficha,
      qualidadesDefeitos: listaQD.filter((q) => q.id !== id),
    });
  };

  const handleAdicionarCustomQD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCustomQD.trim()) return;

    const novo: QualidadeDefeitoItem = {
      id: 'qd_cust_' + Date.now().toString(36),
      nome: nomeCustomQD.trim(),
      tipo: tipoCustomQD,
      categoria: catCustomQD,
      custo: Math.max(1, pontosCustomQD),
      descricao: descCustomQD.trim() || undefined,
    };

    onAtualizarFicha({
      ...ficha,
      qualidadesDefeitos: [...listaQD, novo],
    });

    setNomeCustomQD('');
    setDescCustomQD('');
    setPontosCustomQD(1);
  };

  // Estados locais para prioridades
  const [pAtrib, setPAtrib] = useState<{
    primario: CategoriaAtributo;
    secundario: CategoriaAtributo;
    terciario: CategoriaAtributo;
  }>({
    primario: 'fisicos',
    secundario: 'sociais',
    terciario: 'mentais',
  });

  const [pHabil, setPHabil] = useState<{
    primario: CategoriaHabilidade;
    secundario: CategoriaHabilidade;
    terciario: CategoriaHabilidade;
  }>({
    primario: 'talentos',
    secundario: 'pericias',
    terciario: 'conhecimentos',
  });

  const salvarPrioridades = () => {
    const primeiras3 = ficha.disciplinas.slice(0, 3).map((d) => d.id);
    onAtualizarFicha({
      ...ficha,
      criacao: {
        ...criacao,
        status: 'em_criacao',
        etapa: 'iniciais',
        prioridadesAtributos: pAtrib,
        prioridadesHabilidades: pHabil,
        disciplinasPrimariasIds:
          criacao.disciplinasPrimariasIds.length > 0
            ? criacao.disciplinasPrimariasIds
            : primeiras3,
      },
    });
    setModalPrioridadesAberto(false);
  };

  // Filtragem da lista do catálogo de Qualidades e Defeitos
  const listaFiltradaQD = QUALIDADES_DEFEITOS_1E.filter((item) => {
    const bateTipo = filtroTipoQD === 'todos' || item.tipo === filtroTipoQD;
    const bateCat = filtroCatQD === 'todas' || item.categoria === filtroCatQD;
    const termo = buscaQD.toLowerCase().trim();
    const bateBusca =
      !termo ||
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo);

    return bateTipo && bateCat && bateBusca;
  });

  return (
    <>
      {/* BARRA HUD DE CRIAÇÃO (Fixada no topo para acompanhar a rolagem em celular e PC) */}
      <div className="sticky top-0 z-40 bg-[#120a0e]/95 backdrop-blur-md border-b-2 border-[#8b0000] px-3 sm:px-4 py-2.5 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto space-y-2.5">
          {/* Linha Superior: Título, Passo e Ações */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-ping" />
              <h2 className="text-xs sm:text-sm font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ef4444]" />
                Modo de Criação (1ª Edição Devir 1998)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#2b1016] text-[#ef4444] border border-[#5a1e26]">
                {etapa === 'iniciais'
                  ? 'Passo 1: Pontos Iniciais'
                  : `Passo 2: Pontos Bônus (${saldoBonusRestante} restantes)`}
              </span>
              {etapa === 'iniciais' && pontosIniciaisValidos && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-950/60 text-green-400 border border-green-800">
                  ✓ Iniciais Completos
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setModalPrioridadesAberto(true)}
                className="px-2 py-1 text-xs bg-[#1e1317] hover:bg-[#2e1c22] border border-[#522228] text-[#a89f91] hover:text-white rounded-xs cursor-pointer flex items-center gap-1"
                title="Configurar ordem de prioridades"
              >
                <span>Prioridades</span>
              </button>

              {/* Botão de Qualidades e Defeitos */}
              <button
                type="button"
                onClick={() => setModalQualidadesAberto(true)}
                className="px-2.5 py-1 text-xs bg-[#221217] hover:bg-[#341822] border border-[#ef4444]/60 text-[#ded6cb] rounded-xs cursor-pointer flex items-center gap-1.5 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                title="Abrir catálogo de Qualidades e Defeitos do livro"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-semibold">Qualidades & Defeitos</span>
                <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-[#140e11] text-[#d4af37] border border-[#522228]">
                  {listaQD.length}
                </span>
              </button>

              {etapa === 'iniciais' ? (
                <button
                  type="button"
                  onClick={alternarEtapaBonus}
                  className="px-3 py-1 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                >
                  <span>Avançar p/ Bônus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={alternarEtapaBonus}
                  className="px-3 py-1 bg-[#251419] hover:bg-[#3d1820] text-[#ded6cb] text-xs font-semibold rounded-xs cursor-pointer flex items-center gap-1 border border-[#522228]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Voltar p/ Iniciais</span>
                </button>
              )}

              <button
                type="button"
                onClick={onFinalizarCriacao}
                className="px-3.5 py-1 bg-gradient-to-r from-[#8b0000] to-[#b45309] hover:from-[#a30d12] hover:to-[#d97706] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-1 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Finalizar</span>
              </button>
            </div>
          </div>

          {/* Medidores de Pontos Iniciais */}
          {etapa === 'iniciais' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 text-xs">
              {/* Atributos */}
              <div className="bg-[#181014] p-1.5 rounded-xs border border-[#2d1217]">
                <div className="text-[9px] text-[#a89f91] font-bold uppercase truncate">
                  Físicos ({criacao.prioridadesAtributos?.primario === 'fisicos' ? '1º' : criacao.prioridadesAtributos?.secundario === 'fisicos' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-xs ${gastosFisicos === maxFisicos ? 'text-green-400' : gastosFisicos > maxFisicos ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosFisicos} / {maxFisicos}
                </div>
              </div>

              <div className="bg-[#181014] p-1.5 rounded-xs border border-[#2d1217]">
                <div className="text-[9px] text-[#a89f91] font-bold uppercase truncate">
                  Sociais ({criacao.prioridadesAtributos?.primario === 'sociais' ? '1º' : criacao.prioridadesAtributos?.secundario === 'sociais' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-xs ${gastosSociais === maxSociais ? 'text-green-400' : gastosSociais > maxSociais ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosSociais} / {maxSociais}
                </div>
              </div>

              <div className="bg-[#181014] p-1.5 rounded-xs border border-[#2d1217]">
                <div className="text-[9px] text-[#a89f91] font-bold uppercase truncate">
                  Mentais ({criacao.prioridadesAtributos?.primario === 'mentais' ? '1º' : criacao.prioridadesAtributos?.secundario === 'mentais' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-xs ${gastosMentais === maxMentais ? 'text-green-400' : gastosMentais > maxMentais ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosMentais} / {maxMentais}
                </div>
              </div>

              {/* Habilidades */}
              <div className="bg-[#181014] p-1.5 rounded-xs border border-[#2d1217]">
                <div className="text-[9px] text-[#a89f91] font-bold uppercase truncate">
                  Talentos
                </div>
                <div className={`font-mono font-bold text-xs ${gastosTalentos === maxTalentos ? 'text-green-400' : gastosTalentos > maxTalentos ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosTalentos} / {maxTalentos}
                </div>
              </div>

              <div className="bg-[#181014] p-1.5 rounded-xs border border-[#2d1217]">
                <div className="text-[9px] text-[#a89f91] font-bold uppercase truncate">
                  Perícias
                </div>
                <div className={`font-mono font-bold text-xs ${gastosPericias === maxPericias ? 'text-green-400' : gastosPericias > maxPericias ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosPericias} / {maxPericias}
                </div>
              </div>

              <div className="bg-[#181014] p-1.5 rounded-xs border border-[#2d1217]">
                <div className="text-[9px] text-[#a89f91] font-bold uppercase truncate">
                  Conhecim.
                </div>
                <div className={`font-mono font-bold text-xs ${gastosConhecimentos === maxConhecimentos ? 'text-green-400' : gastosConhecimentos > maxConhecimentos ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosConhecimentos} / {maxConhecimentos}
                </div>
              </div>

              {/* Vantagens */}
              <div className="bg-[#181014] p-1.5 rounded-xs border border-[#2d1217]">
                <div className="text-[9px] text-[#a89f91] font-bold uppercase truncate">
                  Disciplinas
                </div>
                <div className={`font-mono font-bold text-xs ${gastosDisciplinas === config.pontosDisciplinas ? 'text-green-400' : gastosDisciplinas > config.pontosDisciplinas ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosDisciplinas} / {config.pontosDisciplinas}
                </div>
              </div>

              <div className="bg-[#181014] p-1.5 rounded-xs border border-[#2d1217]">
                <div className="text-[9px] text-[#a89f91] font-bold uppercase truncate">
                  Virt / Ant
                </div>
                <div className="text-[10px] font-mono">
                  <span className={gastosVirtudes === config.pontosVirtudes ? 'text-green-400 font-bold' : 'text-[#ef4444]'}>
                    V:{gastosVirtudes}/{config.pontosVirtudes}
                  </span>{' '}
                  <span className={gastosAntecedentes === config.pontosAntecedentes ? 'text-green-400 font-bold' : 'text-[#ef4444]'}>
                    A:{gastosAntecedentes}/{config.pontosAntecedentes}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* HUD DA ETAPA DE PONTOS BÔNUS (Com Qualidades & Defeitos integrados) */
            <div className="bg-[#181014] p-2.5 rounded-xs border border-[#8b0000] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Saldo Restante */}
                <div className="px-3 py-1 bg-[#251016] border border-[#ef4444] rounded-xs text-center">
                  <span className="text-[9px] uppercase font-bold text-[#a89f91] block">
                    Saldo Restante
                  </span>
                  <span
                    className={`text-lg font-black font-mono ${
                      saldoBonusRestante >= 0 ? 'text-[#d4af37]' : 'text-red-400 animate-pulse'
                    }`}
                  >
                    {saldoBonusRestante} pts
                  </span>
                </div>

                {/* Discriminação de Pontos */}
                <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
                  <span className="px-2 py-0.5 bg-[#140e11] border border-[#3b181b] rounded text-[#ded6cb]">
                    Base: <strong>{config.pontosBonus}</strong>
                  </span>
                  <span className="px-2 py-0.5 bg-green-950/40 border border-green-800 rounded text-green-300">
                    Defeitos: <strong>+{pontosDefeitosGanhos}</strong>
                  </span>
                  <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-800 rounded text-amber-300">
                    Qualidades: <strong>-{pontosQualidadesGastos}</strong>
                  </span>
                  <span className="px-2 py-0.5 bg-[#251419] border border-[#522228] rounded text-[#fca5a5]">
                    Características: <strong>-{pontosOutrosGastos}</strong>
                  </span>
                </div>
              </div>

              {/* Controle de outros gastos */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#a89f91]">Gastos em Traços:</span>
                <input
                  type="number"
                  min={0}
                  max={totalBonusDisponivel}
                  value={criacao.pontosBonusGastos || 0}
                  onChange={(e) =>
                    onAtualizarFicha({
                      ...ficha,
                      criacao: {
                        ...criacao,
                        pontosBonusGastos: Math.max(0, parseInt(e.target.value) || 0),
                      },
                    })
                  }
                  className="w-16 bg-[#100b0e] border border-[#522228] px-2 py-0.5 text-center font-bold text-xs text-[#d4af37] rounded-xs focus:outline-none focus:border-[#8b0000]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE QUALIDADES E DEFEITOS (Livro Devir 1998) */}
      {modalQualidadesAberto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-4xl bg-[#100b0e] border border-[#8b0000] rounded-sm shadow-2xl p-4 sm:p-6 space-y-4 text-[#ded6cb] max-h-[90vh] flex flex-col">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <h2 className="text-base sm:text-lg font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                    Qualidades e Defeitos (1ª Edição Devir 1998)
                  </h2>
                  <p className="text-[11px] text-[#a89f91]">
                    Qualidades custam Pontos Bônus; Defeitos concedem Pontos Bônus adicionais para a criação.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalQualidadesAberto(false)}
                className="p-1 text-[#8e8273] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resumo do Impacto de Pontos */}
            <div className="bg-[#160f13] p-3 rounded-xs border border-[#2d1217] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-[#a89f91]">
                  Qualidades Escolhidas:{' '}
                  <strong className="text-amber-400">
                    {qualidades.length} (-{pontosQualidadesGastos} pts)
                  </strong>
                </span>
                <span className="text-[#a89f91]">
                  Defeitos Escolhidos:{' '}
                  <strong className="text-green-400">
                    {defeitos.length} (+{pontosDefeitosGanhos} pts)
                  </strong>
                </span>
                <span className="text-[#a89f91]">
                  Total Bônus Disponível:{' '}
                  <strong className="text-[#d4af37]">
                    {totalBonusDisponivel} pts
                  </strong>
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#8e8273]">
                Saldo Final de Bônus: <strong className={saldoBonusRestante >= 0 ? 'text-[#d4af37]' : 'text-red-400'}>{saldoBonusRestante} pts</strong>
              </span>
            </div>

            {/* Barra de Filtros e Busca */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {/* Filtro por Tipo */}
              <div className="flex items-center gap-1 bg-[#160f13] p-1 rounded-xs border border-[#3b181b]">
                <button
                  type="button"
                  onClick={() => setFiltroTipoQD('todos')}
                  className={`flex-1 py-1 rounded-xs font-semibold ${
                    filtroTipoQD === 'todos'
                      ? 'bg-[#8b0000] text-white'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipoQD('qualidade')}
                  className={`flex-1 py-1 rounded-xs font-semibold ${
                    filtroTipoQD === 'qualidade'
                      ? 'bg-amber-900 text-amber-200'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                >
                  Qualidades
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipoQD('defeito')}
                  className={`flex-1 py-1 rounded-xs font-semibold ${
                    filtroTipoQD === 'defeito'
                      ? 'bg-green-900 text-green-200'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                >
                  Defeitos
                </button>
              </div>

              {/* Filtro por Categoria */}
              <select
                value={filtroCatQD}
                onChange={(e) =>
                  setFiltroCatQD(
                    e.target.value as 'todas' | 'fisico' | 'mental' | 'social' | 'sobrenatural'
                  )
                }
                className="bg-[#160f13] border border-[#3b181b] px-2.5 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
              >
                <option value="todas">Todas as Categorias</option>
                <option value="fisico">Físicos</option>
                <option value="mental">Mentais</option>
                <option value="social">Sociais</option>
                <option value="sobrenatural">Sobrenaturais</option>
              </select>

              {/* Busca por Nome */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8e8273] absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar qualidade ou defeito..."
                  value={buscaQD}
                  onChange={(e) => setBuscaQD(e.target.value)}
                  className="w-full bg-[#160f13] border border-[#3b181b] pl-8 pr-2.5 py-1 text-xs text-[#ded6cb] placeholder:text-[#6e645c] rounded-xs focus:outline-none focus:border-[#8b0000]"
                />
              </div>
            </div>

            {/* Listagem de Itens (Scrollável) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
              {listaFiltradaQD.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8e8273] italic">
                  Nenhuma qualidade ou defeito encontrado com os filtros aplicados.
                </div>
              ) : (
                listaFiltradaQD.map((item) => {
                  const jaSelecionado = listaQD.some(
                    (q) => q.nome.toLowerCase() === item.nome.toLowerCase()
                  );

                  return (
                    <div
                      key={item.nome}
                      className={`p-2.5 rounded-xs border text-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        jaSelecionado
                          ? 'bg-[#2b1016] border-[#ef4444]'
                          : 'bg-[#140e11] border-[#2d1217] hover:border-[#522228]'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#ded6cb] text-sm">
                            {item.nome}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                              item.tipo === 'qualidade'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-700'
                                : 'bg-green-950/80 text-green-300 border border-green-700'
                            }`}
                          >
                            {item.tipo === 'qualidade'
                              ? `Qualidade (-${item.pontos} pt${item.pontos > 1 ? 's' : ''})`
                              : `Defeito (+${item.pontos} pt${item.pontos > 1 ? 's' : ''})`}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-semibold bg-[#1f1519] text-[#8e8273] border border-[#3b181b]">
                            {item.categoria}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#a89f91]">
                          {item.descricao}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleQualidadeDefeito(item)}
                        className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                          jaSelecionado
                            ? 'bg-[#8b0000] text-white hover:bg-[#a30d12]'
                            : 'bg-[#221217] hover:bg-[#341822] text-[#d4af37] border border-[#522228]'
                        }`}
                      >
                        {jaSelecionado ? '✓ Removível' : '+ Escolher'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Traços Atualmente Selecionados */}
            {listaQD.length > 0 && (
              <div className="bg-[#140e11] p-2.5 rounded-xs border border-[#3b181b] space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] block">
                  Traços Atualmente Selecionados na Ficha ({listaQD.length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {listaQD.map((qd) => (
                    <span
                      key={qd.id}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        qd.tipo === 'qualidade'
                          ? 'bg-amber-950/50 text-amber-300 border-amber-800'
                          : 'bg-green-950/50 text-green-300 border-green-800'
                      }`}
                    >
                      <span>
                        {qd.nome} ({qd.tipo === 'qualidade' ? `-${qd.custo}` : `+${qd.custo}`} pts)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoverQD(qd.id)}
                        className="text-[#8e8273] hover:text-red-400 cursor-pointer"
                        title="Remover traço"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Adicionar Personalizado */}
            <form
              onSubmit={handleAdicionarCustomQD}
              className="bg-[#140e11] p-3 rounded-xs border border-[#3b181b] space-y-2 text-xs"
            >
              <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#d4af37] block">
                + Adicionar Qualidade ou Defeito Personalizado
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <input
                  type="text"
                  placeholder="Nome do Traço..."
                  value={nomeCustomQD}
                  onChange={(e) => setNomeCustomQD(e.target.value)}
                  className="sm:col-span-2 bg-[#1b1216] border border-[#3b181b] px-2.5 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                />
                <select
                  value={tipoCustomQD}
                  onChange={(e) =>
                    setTipoCustomQD(e.target.value as 'qualidade' | 'defeito')
                  }
                  className="bg-[#1b1216] border border-[#3b181b] px-2 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                >
                  <option value="qualidade">Qualidade (Custo)</option>
                  <option value="defeito">Defeito (Bônus)</option>
                </select>
                <select
                  value={catCustomQD}
                  onChange={(e) =>
                    setCatCustomQD(
                      e.target.value as 'fisico' | 'mental' | 'social' | 'sobrenatural'
                    )
                  }
                  className="bg-[#1b1216] border border-[#3b181b] px-2 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                >
                  <option value="fisico">Físico</option>
                  <option value="mental">Mental</option>
                  <option value="social">Social</option>
                  <option value="sobrenatural">Sobrenatural</option>
                </select>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={pontosCustomQD}
                    onChange={(e) => setPontosCustomQD(parseInt(e.target.value) || 1)}
                    className="w-14 bg-[#1b1216] border border-[#3b181b] px-1 py-1 text-center font-bold text-xs text-[#d4af37] rounded-xs"
                  />
                  <span className="text-[10px] text-[#a89f91]">pts</span>
                  <button
                    type="submit"
                    className="ml-auto px-2.5 py-1 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-semibold rounded-xs cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </form>

            {/* Rodapé do Modal com Itens Selecionados */}
            <div className="border-t border-[#3b181b] pt-3 flex items-center justify-between">
              <span className="text-xs text-[#a89f91]">
                Total Selecionado: <strong>{listaQD.length} traços</strong>
              </span>
              <button
                type="button"
                onClick={() => setModalQualidadesAberto(false)}
                className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-semibold rounded-xs cursor-pointer"
              >
                Concluir Seleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ESCOLHA DE PRIORIDADES (Exibido antes de preencher) */}
      {modalPrioridadesAberto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#100b0e] border border-[#8b0000] rounded-sm shadow-2xl p-6 space-y-6 text-[#ded6cb]">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-gothic font-black text-[#d4af37] tracking-wider uppercase">
                Definição de Prioridades
              </h2>
              <p className="text-xs text-[#a89f91]">
                Antes de iniciar a distribuição de pontos, escolha a importância das características do seu personagem conforme as regras da 1ª Edição.
              </p>
            </div>

            {/* Prioridades de Atributos */}
            <div className="bg-[#160f13] p-4 rounded-xs border border-[#2d1217] space-y-3">
              <h3 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                1. Prioridades de Atributos ({config.pontosAtributos.primario} / {config.pontosAtributos.secundario} / {config.pontosAtributos.terciario} pontos)
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Primário ({config.pontosAtributos.primario} pts)
                  </label>
                  <select
                    value={pAtrib.primario}
                    onChange={(e) =>
                      setPAtrib({ ...pAtrib, primario: e.target.value as CategoriaAtributo })
                    }
                    className="w-full bg-[#1e1317] border border-[#522228] p-1.5 rounded-xs text-xs text-[#d4af37] font-semibold"
                  >
                    <option value="fisicos">Físicos</option>
                    <option value="sociais">Sociais</option>
                    <option value="mentais">Mentais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Secundário ({config.pontosAtributos.secundario} pts)
                  </label>
                  <select
                    value={pAtrib.secundario}
                    onChange={(e) =>
                      setPAtrib({ ...pAtrib, secundario: e.target.value as CategoriaAtributo })
                    }
                    className="w-full bg-[#1e1317] border border-[#522228] p-1.5 rounded-xs text-xs text-[#d4af37] font-semibold"
                  >
                    <option value="fisicos">Físicos</option>
                    <option value="sociais">Sociais</option>
                    <option value="mentais">Mentais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Terciário ({config.pontosAtributos.terciario} pts)
                  </label>
                  <select
                    value={pAtrib.terciario}
                    onChange={(e) =>
                      setPAtrib({ ...pAtrib, terciario: e.target.value as CategoriaAtributo })
                    }
                    className="w-full bg-[#1e1317] border border-[#522228] p-1.5 rounded-xs text-xs text-[#d4af37] font-semibold"
                  >
                    <option value="fisicos">Físicos</option>
                    <option value="sociais">Sociais</option>
                    <option value="mentais">Mentais</option>
                  </select>
                </div>
              </div>
              {new Set([pAtrib.primario, pAtrib.secundario, pAtrib.terciario]).size < 3 && (
                <p className="text-[11px] text-red-400 font-semibold">
                  ⚠️ Cada categoria de Atributo deve ser atribuída a uma prioridade distinta.
                </p>
              )}
            </div>

            {/* Prioridades de Habilidades */}
            <div className="bg-[#160f13] p-4 rounded-xs border border-[#2d1217] space-y-3">
              <h3 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                2. Prioridades de Habilidades ({config.pontosHabilidades.primario} / {config.pontosHabilidades.secundario} / {config.pontosHabilidades.terciario} pontos)
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Primária ({config.pontosHabilidades.primario} pts)
                  </label>
                  <select
                    value={pHabil.primario}
                    onChange={(e) =>
                      setPHabil({ ...pHabil, primario: e.target.value as CategoriaHabilidade })
                    }
                    className="w-full bg-[#1e1317] border border-[#522228] p-1.5 rounded-xs text-xs text-[#d4af37] font-semibold"
                  >
                    <option value="talentos">Talentos</option>
                    <option value="pericias">Perícias</option>
                    <option value="conhecimentos">Conhecimentos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Secundária ({config.pontosHabilidades.secundario} pts)
                  </label>
                  <select
                    value={pHabil.secundario}
                    onChange={(e) =>
                      setPHabil({ ...pHabil, secundario: e.target.value as CategoriaHabilidade })
                    }
                    className="w-full bg-[#1e1317] border border-[#522228] p-1.5 rounded-xs text-xs text-[#d4af37] font-semibold"
                  >
                    <option value="talentos">Talentos</option>
                    <option value="pericias">Perícias</option>
                    <option value="conhecimentos">Conhecimentos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Terciária ({config.pontosHabilidades.terciario} pts)
                  </label>
                  <select
                    value={pHabil.terciario}
                    onChange={(e) =>
                      setPHabil({ ...pHabil, terciario: e.target.value as CategoriaHabilidade })
                    }
                    className="w-full bg-[#1e1317] border border-[#522228] p-1.5 rounded-xs text-xs text-[#d4af37] font-semibold"
                  >
                    <option value="talentos">Talentos</option>
                    <option value="pericias">Perícias</option>
                    <option value="conhecimentos">Conhecimentos</option>
                  </select>
                </div>
              </div>
              {new Set([pHabil.primario, pHabil.secundario, pHabil.terciario]).size < 3 && (
                <p className="text-[11px] text-red-400 font-semibold">
                  ⚠️ Cada categoria de Habilidade deve ser atribuída a uma prioridade distinta.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={
                new Set([pAtrib.primario, pAtrib.secundario, pAtrib.terciario]).size < 3 ||
                new Set([pHabil.primario, pHabil.secundario, pHabil.terciario]).size < 3
              }
              onClick={salvarPrioridades}
              className="w-full py-2.5 bg-[#8b0000] hover:bg-[#a30d12] disabled:opacity-50 disabled:cursor-not-allowed text-white font-gothic font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              Confirmar Prioridades & Iniciar Preenchimento
            </button>
          </div>
        </div>
      )}
    </>
  );
};
