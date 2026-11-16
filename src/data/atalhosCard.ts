import React from 'react';
import type { Personagem, AtalhoParadaDado } from '../types';
import { Swords, Zap, Flame, Shield, Footprints, Eye, Sparkles, Skull, Dices } from 'lucide-react';
import { calcularStatusCombate } from './combate1E';

export interface InfoTraco {
  label: string;
  tipo: 'atributo' | 'habilidade';
}

export const ICONES_DISPONIVEIS: { id: string; label: string; Icone: React.FC<{ className?: string }> }[] = [
  { id: 'Swords', label: 'Espadas (Combate / Armas)', Icone: Swords },
  { id: 'Flame', label: 'Fogo (Briga / Ataque)', Icone: Flame },
  { id: 'Zap', label: 'Raio (Iniciativa / Rapidez)', Icone: Zap },
  { id: 'Shield', label: 'Escudo (Defesa / Vigor)', Icone: Shield },
  { id: 'Footprints', label: 'Passos (Esquiva / Fuga)', Icone: Footprints },
  { id: 'Eye', label: 'Olho (Percepção / Alerta)', Icone: Eye },
  { id: 'Sparkles', label: 'Magia / Disciplinas', Icone: Sparkles },
  { id: 'Skull', label: 'Caveira (Letalidade / Morte)', Icone: Skull },
  { id: 'Dices', label: 'Dados (Geral)', Icone: Dices },
];

export function getIconeAtalho(nomeIcone?: string): React.FC<{ className?: string }> {
  const item = ICONES_DISPONIVEIS.find((i) => i.id.toLowerCase() === (nomeIcone || '').toLowerCase());
  return item ? item.Icone : Swords;
}

export const MAPA_TRACOS: Record<string, InfoTraco> = {
  // Atributos
  forca: { label: 'Força', tipo: 'atributo' },
  destreza: { label: 'Destreza', tipo: 'atributo' },
  vigor: { label: 'Vigor', tipo: 'atributo' },
  carisma: { label: 'Carisma', tipo: 'atributo' },
  manipulacao: { label: 'Manipulação', tipo: 'atributo' },
  aparencia: { label: 'Aparência', tipo: 'atributo' },
  percepcao: { label: 'Percepção', tipo: 'atributo' },
  inteligencia: { label: 'Inteligência', tipo: 'atributo' },
  raciocinio: { label: 'Raciocínio', tipo: 'atributo' },

  // Habilidades - Talentos (10 oficiais da 1ª Edição)
  representacao: { label: 'Representação', tipo: 'habilidade' },
  prontidao: { label: 'Prontidão', tipo: 'habilidade' },
  esportes: { label: 'Esportes', tipo: 'habilidade' },
  briga: { label: 'Briga', tipo: 'habilidade' },
  esquiva: { label: 'Esquiva', tipo: 'habilidade' },
  empatia: { label: 'Empatia', tipo: 'habilidade' },
  intimidacao: { label: 'Intimidação', tipo: 'habilidade' },
  crime: { label: 'Crime', tipo: 'habilidade' },
  lideranca: { label: 'Liderança', tipo: 'habilidade' },
  labia: { label: 'Lábia', tipo: 'habilidade' },

  // Habilidades - Perícias (10 oficiais da 1ª Edição)
  empatiaAnimais: { label: 'Empatia c/ Animais', tipo: 'habilidade' },
  arqueirismo: { label: 'Arqueirismo', tipo: 'habilidade' },
  artesanato: { label: 'Artesanato', tipo: 'habilidade' },
  etiqueta: { label: 'Etiqueta', tipo: 'habilidade' },
  herborismo: { label: 'Herborismo', tipo: 'habilidade' },
  armasBrancas: { label: 'Armas Brancas', tipo: 'habilidade' },
  musica: { label: 'Música', tipo: 'habilidade' },
  cavalgar: { label: 'Cavalgar', tipo: 'habilidade' },
  furtividade: { label: 'Furtividade', tipo: 'habilidade' },
  sobrevivencia: { label: 'Sobrevivência', tipo: 'habilidade' },

  // Habilidades - Conhecimentos (10 oficiais da 1ª Edição)
  instrucao: { label: 'Instrução', tipo: 'habilidade' },
  sabedoriaPopular: { label: 'Sabedoria Popular', tipo: 'habilidade' },
  investigacao: { label: 'Investigação', tipo: 'habilidade' },
  direito: { label: 'Direito', tipo: 'habilidade' },
  linguistica: { label: 'Lingüística', tipo: 'habilidade' },
  medicina: { label: 'Medicina', tipo: 'habilidade' },
  ocultismo: { label: 'Ocultismo', tipo: 'habilidade' },
  politica: { label: 'Política', tipo: 'habilidade' },
  ciencia: { label: 'Ciência', tipo: 'habilidade' },
  senescalia: { label: 'Senescalia', tipo: 'habilidade' },

  // Aliases legados (retrocompatibilidade)
  expressao: { label: 'Representação', tipo: 'habilidade' },
  ladinagem: { label: 'Crime', tipo: 'habilidade' },
  manha: { label: 'Lábia', tipo: 'habilidade' },
  tiroComArco: { label: 'Arqueirismo', tipo: 'habilidade' },
  cavalaria: { label: 'Cavalgar', tipo: 'habilidade' },
  herbalismo: { label: 'Herborismo', tipo: 'habilidade' },
  academicos: { label: 'Instrução', tipo: 'habilidade' },
  senescencia: { label: 'Senescalia', tipo: 'habilidade' },

  // Traços Canônicos de Combate & Proteção (1ª Edição)
  destreza_efetiva: { label: 'Destreza (com Armadura)', tipo: 'atributo' },
  absorcao: { label: 'Absorção Total (Vigor + Fort + Armadura)', tipo: 'atributo' },
  armadura: { label: 'Classe da Armadura', tipo: 'atributo' },
  fortitude: { label: 'Fortitude', tipo: 'habilidade' },
  potencia: { label: 'Potência', tipo: 'habilidade' },
  rapidez: { label: 'Rapidez', tipo: 'habilidade' },
};

export const ATALHOS_CARD_PADRAO: AtalhoParadaDado[] = [
  {
    id: 'iniciativa',
    nome: 'Iniciativa',
    traco1: 'prontidao',
    traco2: 'raciocinio',
    tipoExibicao: 'dados', // mostra em d10 (ex: 5d10)
    icone: 'Zap',
  },
  {
    id: 'ataque_arma_branca',
    nome: 'Ataque c/ arma branca',
    traco1: 'destreza',
    traco2: 'armasBrancas',
    tipoExibicao: 'dados', // mostra em d10 (ex: 5d10)
    icone: 'Swords',
  },
  {
    id: 'ataque_briga',
    nome: 'Ataque com briga',
    traco1: 'destreza',
    traco2: 'briga',
    tipoExibicao: 'dados',
    icone: 'Flame',
  },
  {
    id: 'esquiva',
    nome: 'Esquiva',
    traco1: 'destreza',
    traco2: 'esquiva',
    tipoExibicao: 'dados',
    icone: 'Footprints',
  },
  {
    id: 'vigorar',
    nome: 'Absorção de Dano',
    traco1: 'absorcao',
    traco2: 'nenhum',
    tipoExibicao: 'dados',
    icone: 'Shield',
  },
];

export interface DetalhesAtalho {
  valorTotal: number;
  valorBase: number;
  bonus: number;
  onus: number;
  temOnus: boolean;
  temBonus: boolean;
  rotuloModificador?: string;
  tipoExibicao: 'total' | 'dados';
  textoExibicao: string;
}

export function calcularDetalhesAtalho(p: Personagem, atalho: AtalhoParadaDado): DetalhesAtalho {
  const statusCombate = calcularStatusCombate(p);
  const penalidadeArmadura = statusCombate.totalPenalidadeArmadura; // ex: -1, -2, ou 0
  const rapidezNivel = statusCombate.rapidezNivel;

  const getValorBase = (traco: string | undefined): number => {
    if (!traco || traco === 'nenhum') return 0;
    if (traco === 'destreza_efetiva') return statusCombate.destrezaEfetiva;
    if (traco === 'absorcao') return statusCombate.absorcaoDanoNormal;
    if (traco === 'armadura') return statusCombate.totalClasseArmadura;
    if (traco === 'fortitude') return statusCombate.fortitudeNivel;
    if (traco === 'potencia') return statusCombate.potenciaNivel;
    if (traco === 'rapidez') return statusCombate.rapidezNivel;

    if (traco in p.atributos) {
      return (p.atributos as Record<string, number>)[traco] || 0;
    }
    if (traco in p.habilidades) {
      return (p.habilidades as Record<string, number>)[traco] || 0;
    }
    const habMap: Record<string, string> = {
      expressao: 'representacao',
      ladinagem: 'crime',
      manha: 'labia',
      tiroComArco: 'arqueirismo',
      cavalaria: 'cavalgar',
      herbalismo: 'herborismo',
      academicos: 'instrucao',
      senescencia: 'senescalia',
    };
    if (traco in habMap && habMap[traco] in p.habilidades) {
      return (p.habilidades as Record<string, number>)[habMap[traco]] || 0;
    }
    const disc = p.disciplinas.find((d) => d.nome.toLowerCase() === traco.toLowerCase());
    if (disc) return disc.nivel;
    return 0;
  };

  // Se o atalho for de Absorção / Vigorar de Dano, utiliza o cálculo canônico consolidado da 1ª Edição
  if (
    atalho.id === 'vigorar' ||
    atalho.traco1 === 'absorcao' ||
    atalho.traco2 === 'absorcao' ||
    atalho.nome.toLowerCase().includes('absorção') ||
    atalho.nome.toLowerCase().includes('absorcao')
  ) {
    const totalAbs = statusCombate.absorcaoDanoNormal;
    const vigBase = p.atributos.vigor || 1;
    return {
      valorTotal: totalAbs,
      valorBase: vigBase,
      bonus: 0,
      onus: 0,
      temOnus: false,
      temBonus: false,
      tipoExibicao: atalho.tipoExibicao,
      textoExibicao: atalho.tipoExibicao === 'total' ? `${totalAbs}` : `${totalAbs}d10`,
    };
  }

  const v1Base = getValorBase(atalho.traco1);
  const v2Base = getValorBase(atalho.traco2);
  const valorBase = v1Base + v2Base;

  let onusTotal = 0;
  let bonusTotal = 0;
  const modsDesc: string[] = [];

  // 1. DÉBITO DE ÔNUS POR EQUIPAMENTOS:
  // a) Penalidade da Armadura em testes que utilizam Destreza ou ações físicas de combate
  const usaDestreza =
    atalho.traco1 === 'destreza' ||
    atalho.traco2 === 'destreza' ||
    atalho.traco1 === 'destreza_efetiva' ||
    atalho.traco2 === 'destreza_efetiva';

  const isAcaoFisica =
    atalho.id === 'esquiva' ||
    atalho.traco1 === 'esquiva' ||
    atalho.traco2 === 'esquiva' ||
    atalho.traco1 === 'furtividade' ||
    atalho.traco2 === 'furtividade' ||
    atalho.traco1 === 'armasBrancas' ||
    atalho.traco2 === 'armasBrancas' ||
    atalho.traco1 === 'briga' ||
    atalho.traco2 === 'briga' ||
    atalho.id === 'ataque_arma_branca' ||
    atalho.id === 'ataque_briga';

  if ((usaDestreza || isAcaoFisica) && penalidadeArmadura < 0) {
    onusTotal += penalidadeArmadura;
    modsDesc.push(`${penalidadeArmadura} armadura`);
  }

  // b) Penalidade de Percepção por Elmo / Viseira fechada / Armadura Pesada (1ª Edição)
  const penalidadePercepcao = statusCombate.totalPenalidadePercepcao; // ex: -1, -2
  const usaPercepcao =
    atalho.traco1 === 'percepcao' ||
    atalho.traco2 === 'percepcao' ||
    atalho.traco1 === 'prontidao' ||
    atalho.traco2 === 'prontidao';

  if (usaPercepcao && penalidadePercepcao < 0) {
    onusTotal += penalidadePercepcao;
    modsDesc.push(`${penalidadePercepcao} elmo/armadura`);
  }

  // 2. CÁLCULO DE BÔNUS:
  // Se for atalho de Iniciativa:
  const isIniciativa = atalho.id === 'iniciativa' || atalho.nome.toLowerCase().includes('iniciativa');
  if (isIniciativa) {
    if (rapidezNivel > 0) {
      bonusTotal += rapidezNivel;
      modsDesc.push(`+${rapidezNivel} Rapidez`);
    }
    if (!usaDestreza && !isAcaoFisica && penalidadeArmadura < 0) {
      onusTotal += penalidadeArmadura;
      modsDesc.push(`${penalidadeArmadura} armadura`);
    }
    if (!usaPercepcao && penalidadePercepcao < 0) {
      onusTotal += penalidadePercepcao;
      modsDesc.push(`${penalidadePercepcao} elmo`);
    }
  }

  const valorCalculado = Math.max(valorBase > 0 ? 1 : 0, valorBase + onusTotal + bonusTotal);

  const tipoEfetivo =
    atalho.id === 'esquiva' && atalho.traco2 === 'nenhum'
      ? 'total'
      : atalho.id === 'iniciativa'
      ? 'dados'
      : atalho.tipoExibicao;

  const textoExibicao = tipoEfetivo === 'total' ? `${valorCalculado}` : `${valorCalculado}d10`;

  return {
    valorTotal: valorCalculado,
    valorBase,
    bonus: bonusTotal,
    onus: onusTotal,
    temOnus: onusTotal < 0,
    temBonus: bonusTotal > 0,
    rotuloModificador: modsDesc.length > 0 ? modsDesc.join(', ') : undefined,
    tipoExibicao: tipoEfetivo,
    textoExibicao,
  };
}

export function calcularValorAtalho(p: Personagem, atalho: AtalhoParadaDado): number {
  return calcularDetalhesAtalho(p, atalho).valorTotal;
}

/**
 * Verifica se o atalho pode ser exibido no card do personagem.
 * Se depender de uma habilidade ou disciplina que o personagem NÃO possui (0 pontos),
 * o atalho é ocultado do card.
 */
export function podeExibirAtalho(p: Personagem, atalho: AtalhoParadaDado): boolean {
  if (!p || !atalho) return false;

  const checarTraco = (traco: string | undefined): boolean => {
    if (!traco || traco === 'nenhum' || traco === 'destreza_efetiva' || traco === 'absorcao' || traco === 'armadura') {
      return true;
    }
    // Atributos base são sempre >= 1
    if (traco in p.atributos) {
      return true;
    }
    // Se for Habilidade (Talentos, Perícias, Conhecimentos)
    if (traco in p.habilidades) {
      const val = (p.habilidades as Record<string, number>)[traco] || 0;
      return val > 0;
    }
    // Mapeamento de aliases legados
    const habMap: Record<string, string> = {
      expressao: 'representacao',
      ladinagem: 'crime',
      manha: 'labia',
      tiroComArco: 'arqueirismo',
      cavalaria: 'cavalgar',
      herbalismo: 'herborismo',
      academicos: 'instrucao',
      senescencia: 'senescalia',
    };
    if (traco in habMap && habMap[traco] in p.habilidades) {
      const val = (p.habilidades as Record<string, number>)[habMap[traco]] || 0;
      return val > 0;
    }
    // Se for disciplina (ex: Fortitude, Potência, Rapidez)
    const disc = p.disciplinas.find((d) => d.nome.toLowerCase() === traco.toLowerCase());
    if (disc) {
      return disc.nivel > 0;
    }
    // Se está no mapa de traços como habilidade e não encontrou com valor > 0, oculta
    if (MAPA_TRACOS[traco]?.tipo === 'habilidade') {
      return false;
    }
    return true;
  };

  return checarTraco(atalho.traco1) && checarTraco(atalho.traco2);
}
