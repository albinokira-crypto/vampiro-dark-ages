import React, { useState } from 'react';
import type {
  Personagem,
  ConfiguracaoMesa,
  CategoriaAtributo,
  CategoriaHabilidade,
} from '../types';
import {
  Sparkles,
  ChevronRight,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';

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

  // Mapeamento de limites conforme prioridades de atributos
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

  // Estados locais para modal de prioridades
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
    // Salvar as 3 primeiras disciplinas se houver
    const primeiras3 = ficha.disciplinas.slice(0, 3).map((d) => d.id);

    onAtualizarFicha({
      ...ficha,
      criacao: {
        ...criacao,
        status: 'em_criacao',
        etapa: 'iniciais',
        prioridadesAtributos: pAtrib,
        prioridadesHabilidades: pHabil,
        disciplinasPrimariasIds: primeiras3,
      },
    });
    setModalPrioridadesAberto(false);
  };

  const alternarEtapaBonus = () => {
    // Ao avançar para pontos bônus, salva as 3 primeiras disciplinas como as disciplinas de clã travadas
    const primeiras3 = ficha.disciplinas.slice(0, 3).map((d) => d.id);
    onAtualizarFicha({
      ...ficha,
      criacao: {
        ...criacao,
        etapa: etapa === 'iniciais' ? 'bonus' : 'iniciais',
        disciplinasPrimariasIds:
          criacao.disciplinasPrimariasIds.length > 0
            ? criacao.disciplinasPrimariasIds
            : primeiras3,
      },
    });
  };

  return (
    <>
      {/* BARRA HUD DE CRIAÇÃO (Fixada logo abaixo do menu) */}
      <div className="bg-[#120a0e] border-b-2 border-[#8b0000] px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Título e Ações */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444] animate-ping" />
              <h2 className="text-sm sm:text-base font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ef4444]" />
                Modo de Criação de Personagem
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#2b1016] text-[#ef4444] border border-[#5a1e26]">
                {etapa === 'iniciais' ? 'Passo 1: Pontos Iniciais' : 'Passo 2: Pontos Bônus (15 pts)'}
              </span>
              {etapa === 'iniciais' && pontosIniciaisValidos && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-950/60 text-green-400 border border-green-800">
                  ✓ Distribuição Completa
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalPrioridadesAberto(true)}
                className="px-2.5 py-1 text-xs bg-[#1e1317] hover:bg-[#2e1c22] border border-[#522228] text-[#a89f91] hover:text-white rounded-xs cursor-pointer flex items-center gap-1"
              >
                <span>Prioridades</span>
              </button>

              {etapa === 'iniciais' ? (
                <button
                  type="button"
                  onClick={alternarEtapaBonus}
                  className="px-3 py-1 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                >
                  <span>Avançar p/ Pontos Bônus</span>
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
                className="px-4 py-1.5 bg-gradient-to-r from-[#8b0000] to-[#b45309] hover:from-[#a30d12] hover:to-[#d97706] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Finalizar Personagem</span>
              </button>
            </div>
          </div>

          {/* Medidores de Pontos Iniciais */}
          {etapa === 'iniciais' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
              {/* Atributos */}
              <div className="bg-[#181014] p-2 rounded-xs border border-[#2d1217]">
                <div className="text-[10px] text-[#a89f91] font-bold uppercase truncate">
                  Físicos ({criacao.prioridadesAtributos?.primario === 'fisicos' ? '1º' : criacao.prioridadesAtributos?.secundario === 'fisicos' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-sm ${gastosFisicos === maxFisicos ? 'text-green-400' : gastosFisicos > maxFisicos ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosFisicos} / {maxFisicos}
                </div>
              </div>

              <div className="bg-[#181014] p-2 rounded-xs border border-[#2d1217]">
                <div className="text-[10px] text-[#a89f91] font-bold uppercase truncate">
                  Sociais ({criacao.prioridadesAtributos?.primario === 'sociais' ? '1º' : criacao.prioridadesAtributos?.secundario === 'sociais' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-sm ${gastosSociais === maxSociais ? 'text-green-400' : gastosSociais > maxSociais ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosSociais} / {maxSociais}
                </div>
              </div>

              <div className="bg-[#181014] p-2 rounded-xs border border-[#2d1217]">
                <div className="text-[10px] text-[#a89f91] font-bold uppercase truncate">
                  Mentais ({criacao.prioridadesAtributos?.primario === 'mentais' ? '1º' : criacao.prioridadesAtributos?.secundario === 'mentais' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-sm ${gastosMentais === maxMentais ? 'text-green-400' : gastosMentais > maxMentais ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosMentais} / {maxMentais}
                </div>
              </div>

              {/* Habilidades */}
              <div className="bg-[#181014] p-2 rounded-xs border border-[#2d1217]">
                <div className="text-[10px] text-[#a89f91] font-bold uppercase truncate">
                  Talentos ({criacao.prioridadesHabilidades?.primario === 'talentos' ? '1º' : criacao.prioridadesHabilidades?.secundario === 'talentos' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-sm ${gastosTalentos === maxTalentos ? 'text-green-400' : gastosTalentos > maxTalentos ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosTalentos} / {maxTalentos}
                </div>
              </div>

              <div className="bg-[#181014] p-2 rounded-xs border border-[#2d1217]">
                <div className="text-[10px] text-[#a89f91] font-bold uppercase truncate">
                  Perícias ({criacao.prioridadesHabilidades?.primario === 'pericias' ? '1º' : criacao.prioridadesHabilidades?.secundario === 'pericias' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-sm ${gastosPericias === maxPericias ? 'text-green-400' : gastosPericias > maxPericias ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosPericias} / {maxPericias}
                </div>
              </div>

              <div className="bg-[#181014] p-2 rounded-xs border border-[#2d1217]">
                <div className="text-[10px] text-[#a89f91] font-bold uppercase truncate">
                  Conhecim. ({criacao.prioridadesHabilidades?.primario === 'conhecimentos' ? '1º' : criacao.prioridadesHabilidades?.secundario === 'conhecimentos' ? '2º' : '3º'})
                </div>
                <div className={`font-mono font-bold text-sm ${gastosConhecimentos === maxConhecimentos ? 'text-green-400' : gastosConhecimentos > maxConhecimentos ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosConhecimentos} / {maxConhecimentos}
                </div>
              </div>

              {/* Vantagens */}
              <div className="bg-[#181014] p-2 rounded-xs border border-[#2d1217]">
                <div className="text-[10px] text-[#a89f91] font-bold uppercase truncate">
                  Disciplinas
                </div>
                <div className={`font-mono font-bold text-sm ${gastosDisciplinas === config.pontosDisciplinas ? 'text-green-400' : gastosDisciplinas > config.pontosDisciplinas ? 'text-red-500 animate-pulse' : 'text-[#ef4444]'}`}>
                  {gastosDisciplinas} / {config.pontosDisciplinas}
                </div>
              </div>

              <div className="bg-[#181014] p-2 rounded-xs border border-[#2d1217]">
                <div className="text-[10px] text-[#a89f91] font-bold uppercase truncate">
                  Virtudes / Anteced.
                </div>
                <div className="text-[11px] font-mono">
                  <span className={gastosVirtudes === config.pontosVirtudes ? 'text-green-400' : 'text-[#ef4444]'}>
                    Virt: {gastosVirtudes}/{config.pontosVirtudes}
                  </span>{' '}
                  <span className={gastosAntecedentes === config.pontosAntecedentes ? 'text-green-400' : 'text-[#ef4444]'}>
                    Ant: {gastosAntecedentes}/{config.pontosAntecedentes}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* HUD DA ETAPA DE PONTOS BÔNUS (15 PONTOS) */
            <div className="bg-[#181014] p-3 rounded-xs border border-[#8b0000] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-[#251016] border border-[#ef4444] rounded-xs">
                  <span className="text-[10px] uppercase font-bold text-[#a89f91] block">
                    Pontos Bônus Disponíveis
                  </span>
                  <span className="text-xl font-black font-mono text-[#d4af37]">
                    {Math.max(0, config.pontosBonus - (criacao.pontosBonusGastos || 0))} / {config.pontosBonus} pts
                  </span>
                </div>

                <div className="text-xs text-[#a89f91] hidden sm:block">
                  <p>
                    <strong>Tabela de Custos Bônus:</strong> Atributos: <strong>5 pts</strong> • Habilidades: <strong>2 pts</strong> • Antecedentes: <strong>1 pt</strong>
                  </p>
                  <p>
                    Força de Vontade: <strong>1 pt</strong> • Virtudes: <strong>2 pts</strong> • Caminho: <strong>1 pt</strong> • 3 Disciplinas de Clã: <strong>5 pts</strong> • Outras Disciplinas: <strong>7 pts</strong> (1ª bola: <strong>10 pts</strong>)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={config.pontosBonus}
                  value={criacao.pontosBonusGastos || 0}
                  onChange={(e) =>
                    onAtualizarFicha({
                      ...ficha,
                      criacao: {
                        ...criacao,
                        pontosBonusGastos: Math.min(
                          config.pontosBonus,
                          Math.max(0, parseInt(e.target.value) || 0)
                        ),
                      },
                    })
                  }
                  className="w-16 bg-[#100b0e] border border-[#522228] px-2 py-1 text-center font-bold text-sm text-[#d4af37] rounded-xs"
                />
                <span className="text-xs text-[#a89f91]">gastos</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE ESCOLHA DE PRIORIDADES (Exibido antes de preencher) */}
      {modalPrioridadesAberto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#100b0e] border border-[#8b0000] rounded-sm shadow-2xl p-6 space-y-6 text-[#ded6cb]">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-gothic font-black text-[#d4af37] tracking-wider uppercase">
                Definição de Prioridades
              </h2>
              <p className="text-xs text-[#a89f91]">
                Antes de iniciar a distribuição de pontos, escolha a importância das características do seu personagem.
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
