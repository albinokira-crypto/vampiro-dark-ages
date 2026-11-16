/**
 * Módulo de Regras Oficiais de Combate, Armas e Armaduras da 1ª Edição
 * Vampiro: A Idade das Trevas (Livro Básico de 1996 / Devir 1998, Cap. 9 - pág. 208-212)
 */

import type { Arma, Personagem } from '../types';

export interface ModeloArma1E {
  nome: string;
  categoria: 'branca' | 'briga' | 'distancia';
  dificuldade: string;
  dano: string;
  ocultacao: string;
  alcance: string;
  forcaMinima: number; // Requisito mínimo de Força para empunhar sem penalidade
  recursosMinimo: number; // Nível mínimo no Antecedente Recursos para possuir/comprar
  descricao?: string;
}

export interface ModeloArmadura1E {
  nome: string;
  classe: string; // Dados extras de absorção
  penalidade: string; // Penalidade em testes de Destreza (ex: -1, -2)
  forcaMinima: number; // Requisito mínimo de Força para suportar o peso
  recursosMinimo: number; // Nível mínimo no Antecedente Recursos
  descricao?: string;
}

// Catálogo Canônico de Armas da 1ª Edição (Dark Ages 1996)
export const ARMAS_CATALOGO_1E: ModeloArma1E[] = [
  // Armas Brancas
  {
    nome: 'Adaga / Punhal',
    categoria: 'branca',
    dificuldade: '5',
    dano: 'For+1',
    ocultacao: 'Bolso / Cinto',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 1,
    descricao: 'Pequena e rápida de sacar. Dificuldade 5.',
  },
  {
    nome: 'Espada Curta',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'For+2',
    ocultacao: 'Capa / Bainha',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 2,
    descricao: 'Arma ágil e equilibrada para escaramuças.',
  },
  {
    nome: 'Espada Longa',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'For+3',
    ocultacao: 'Bainha no cinto',
    alcance: 'Corpo a corpo',
    forcaMinima: 2,
    recursosMinimo: 3,
    descricao: 'A clássica lâmina nobre dos cavaleiros feudais.',
  },
  {
    nome: 'Espadão / Montante (Duas Mãos)',
    categoria: 'branca',
    dificuldade: '7',
    dano: 'For+5',
    ocultacao: 'Nenhuma',
    alcance: '2 metros',
    forcaMinima: 3,
    recursosMinimo: 4,
    descricao: 'Exige duas mãos e Força 3+. Golpe devastador.',
  },
  {
    nome: 'Machado de Batalha',
    categoria: 'branca',
    dificuldade: '7',
    dano: 'For+4',
    ocultacao: 'Nenhuma',
    alcance: 'Corpo a corpo',
    forcaMinima: 2,
    recursosMinimo: 2,
    descricao: 'Capaz de fender escudos e cotas de malha.',
  },
  {
    nome: 'Maça de Armas / Mangual',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'For+3',
    ocultacao: 'Bainha',
    alcance: 'Corpo a corpo',
    forcaMinima: 2,
    recursosMinimo: 2,
    descricao: 'Arma de impacto letal contra armaduras pesadas.',
  },
  {
    nome: 'Lança de Cavalaria / Infantaria',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'For+3',
    ocultacao: 'Nenhuma',
    alcance: '3 metros',
    forcaMinima: 2,
    recursosMinimo: 2,
    descricao: 'Alcance avantajado para manter adversários à distância.',
  },
  {
    nome: 'Cajado de Madeira / Bastão',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'For+1',
    ocultacao: 'Nenhuma',
    alcance: '2 metros',
    forcaMinima: 1,
    recursosMinimo: 0,
    descricao: 'Dano contusivo, discreto para viajantes e monges.',
  },

  // Armas de Fogo e Projéteis medievais
  {
    nome: 'Arco Curto',
    categoria: 'distancia',
    dificuldade: '6',
    dano: '3',
    ocultacao: 'Nenhuma',
    alcance: '50 metros',
    forcaMinima: 1,
    recursosMinimo: 1,
    descricao: 'Arma de caça ágil e leve.',
  },
  {
    nome: 'Arco Longo Galês',
    categoria: 'distancia',
    dificuldade: '7',
    dano: 'For+1',
    ocultacao: 'Nenhuma',
    alcance: '90 metros',
    forcaMinima: 3,
    recursosMinimo: 3,
    descricao: 'Exige Força 3. Flechas perfurantes de longo alcance.',
  },
  {
    nome: 'Besta Pesada Medieval',
    categoria: 'distancia',
    dificuldade: '6',
    dano: '5',
    ocultacao: 'Nenhuma',
    alcance: '60 metros',
    forcaMinima: 2,
    recursosMinimo: 3,
    descricao: 'Dano 5 fixo. Perfura armaduras; recarga de 1 turno.',
  },

  // Ataques Naturais e Sobrenaturais
  {
    nome: 'Golpe Desarmado (Soco/Chute)',
    categoria: 'briga',
    dificuldade: '6',
    dano: 'For',
    ocultacao: '-',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 0,
    descricao: 'Dano contusivo. Absorvido normalmente por mortais e cainitas.',
  },
  {
    nome: 'Mordida Vampírica',
    categoria: 'briga',
    dificuldade: '5',
    dano: 'For+1',
    ocultacao: '-',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 0,
    descricao: 'Dano Agravado. Requer manobra de agarrar prévia ou ataque surpresa.',
  },
  {
    nome: 'Garras da Fera (Metamorfose ••)',
    categoria: 'briga',
    dificuldade: '6',
    dano: 'For+1',
    ocultacao: '-',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 0,
    descricao: 'Dano Agravado por garras caims Gangrel.',
  },
];

// Catálogo Canônico de Armaduras da 1ª Edição (Dark Ages 1996)
export const ARMADURAS_CATALOGO_1E: ModeloArmadura1E[] = [
  {
    nome: 'Couro Reforçado / Acolchoado',
    classe: '1',
    penalidade: '0',
    forcaMinima: 1,
    recursosMinimo: 1,
    descricao: 'Proteção leve e flexível sem penalidade de movimento.',
  },
  {
    nome: 'Couro Batido com Rebites',
    classe: '2',
    penalidade: '-1',
    forcaMinima: 2,
    recursosMinimo: 2,
    descricao: 'Couro fervido rígido com rebites metálicos. -1 na Destreza.',
  },
  {
    nome: 'Cota de Malha Medieval',
    classe: '3',
    penalidade: '-1',
    forcaMinima: 2,
    recursosMinimo: 3,
    descricao: 'Anéis de aço entrelaçados. +3 dados de absorção, -1 Destreza.',
  },
  {
    nome: 'Cota de Malha Reforçada com Peitoral',
    classe: '3',
    penalidade: '-1',
    forcaMinima: 3,
    recursosMinimo: 3,
    descricao: 'Malha com reforço de placas no torso. +3 dados, -1 Destreza.',
  },
  {
    nome: 'Meia Armadura de Placas',
    classe: '4',
    penalidade: '-2',
    forcaMinima: 3,
    recursosMinimo: 4,
    descricao: 'Placas de aço sobre cota de malha. +4 dados de absorção, -2 Destreza.',
  },
  {
    nome: 'Armadura Completa de Placas de Cavaleiro',
    classe: '5',
    penalidade: '-2',
    forcaMinima: 4,
    recursosMinimo: 5,
    descricao: 'Arnês completo de cavaleiro. +5 dados de absorção, -2 Destreza.',
  },
];

/**
 * Converte strings de penalidade como "-1", "-2", "1", "- 1" para número negativo/zero.
 */
export function extrairPenalidadeArmadura(penalidadeStr?: string): number {
  if (!penalidadeStr) return 0;
  const limpo = penalidadeStr.trim();
  const match = limpo.match(/-?\d+/);
  if (!match) return 0;
  const n = parseInt(match[0], 10);
  if (isNaN(n)) return 0;
  return n > 0 ? -n : n;
}

/**
 * Converte strings de classe de armadura como "3", "3 dados" para número positivo.
 */
export function extrairClasseArmadura(classeStr?: string): number {
  if (!classeStr) return 0;
  const limpo = classeStr.trim();
  const match = limpo.match(/\d+/);
  if (!match) return 0;
  const n = parseInt(match[0], 10);
  return isNaN(n) ? 0 : Math.max(0, n);
}

/**
 * Extrai o bônus e total de dano de armas da 1ª Edição.
 * Suporta notações como: "For+3", "For + 2", "Força+4", "5", "For", etc.
 */
export function calcularDanoArma(
  danoStr: string,
  forcaPersonagem: number,
  potenciaNivel: number = 0
): {
  dadosTotais: number;
  bonusForca: number;
  isBaseadoEmForca: boolean;
  sucessosAutomaticosPotencia: number;
  resumoVisual: string;
} {
  const texto = (danoStr || '').toLowerCase().trim();
  const forca = Math.max(1, forcaPersonagem);
  const potencia = Math.max(0, potenciaNivel);

  if (texto.includes('for')) {
    // Procura por bônus como "+3", "+ 2", etc.
    const match = texto.match(/\+\s*(\d+)/);
    const bonus = match ? parseInt(match[1], 10) : 0;
    const totalDados = forca + bonus;
    const potStr = potencia > 0 ? ` + ${potencia} aut. (Potência)` : '';
    return {
      dadosTotais: totalDados,
      bonusForca: bonus,
      isBaseadoEmForca: true,
      sucessosAutomaticosPotencia: potencia,
      resumoVisual: `${totalDados}d10${potStr}`,
    };
  }

  // Dano numérico fixo (ex: Arco 3, Besta 5)
  const matchNum = texto.match(/\d+/);
  const fixo = matchNum ? parseInt(matchNum[0], 10) : forca;
  return {
    dadosTotais: fixo,
    bonusForca: 0,
    isBaseadoEmForca: false,
    sucessosAutomaticosPotencia: 0,
    resumoVisual: `${fixo}d10`,
  };
}

/**
 * Calcula a Parada de Ataque da arma somando Destreza Efetiva + Habilidade Adequada
 */
export function calcularParadaAtaqueArma(
  arma: Arma,
  destrezaEfetiva: number,
  habilidades: Personagem['habilidades'],
  forcaPersonagem: number = 1
): {
  paradaDados: number;
  habilidadeUsada: string;
  habilidadeNivel: number;
  dificuldade: number;
  penalidadeForca: number;
  resumoVisual: string;
} {
  const nome = (arma.nome || '').toLowerCase();
  const alcance = (arma.alcance || '').toLowerCase();
  const destreza = Math.max(1, destrezaEfetiva);

  let habilidadeUsada = 'Armas Brancas';
  let habilidadeNivel = habilidades.armasBrancas || 0;

  if (
    nome.includes('arco') ||
    nome.includes('besta') ||
    nome.includes('flecha') ||
    nome.includes('projétil') ||
    (alcance.includes('m') && !alcance.includes('corpo'))
  ) {
    habilidadeUsada = 'Arquearia';
    habilidadeNivel =
      (habilidades.arqueirismo ?? (habilidades as any).tiroComArco) || 0;
  } else if (
    nome.includes('soco') ||
    nome.includes('chute') ||
    nome.includes('mordida') ||
    nome.includes('garra') ||
    nome.includes('desarmado') ||
    nome.includes('briga')
  ) {
    habilidadeUsada = 'Briga';
    habilidadeNivel = habilidades.briga || 0;
  }

  const paradaDados = destreza + habilidadeNivel;
  const difBase = parseInt(arma.dificuldade, 10) || 6;

  // Regra de Força Mínima (1ª Edição): se Força for menor que a exigida, penalidade na Dificuldade (+1 por ponto faltante)
  const forcaExigida = arma.forcaMinima || 1;
  const penalidadeForca = Math.max(0, forcaExigida - forcaPersonagem);
  const difFinal = Math.min(10, difBase + penalidadeForca);

  const detalheDif = penalidadeForca > 0
    ? `Dif ${difFinal} (+${penalidadeForca} por Força < ${forcaExigida})`
    : `Dif ${difFinal}`;

  return {
    paradaDados,
    habilidadeUsada,
    habilidadeNivel,
    dificuldade: difFinal,
    penalidadeForca,
    resumoVisual: `${paradaDados}d10 (${detalheDif})`,
  };
}

/**
 * Calcula o Status Consolidado de Combate do Personagem
 */
export function calcularStatusCombate(ficha: Personagem): {
  totalClasseArmadura: number;
  totalPenalidadeArmadura: number;
  destrezaBase: number;
  destrezaEfetiva: number;
  vigorBase: number;
  forcaBase: number;
  fortitudeNivel: number;
  potenciaNivel: number;
  rapidezNivel: number;
  absorcaoDanoNormal: number;
  absorcaoDanoAgravado: number;
  iniciativaBase: number;
  esquivaEfetiva: number;
} {
  const armaduras = ficha.armaduras || [];
  // Armaduras ativas (por padrão todas que não tiverem equipada === false)
  const armadurasEquipadas = armaduras.filter(
    (a) => (a as any).equipada !== false
  );

  const forcaBase = ficha.atributos.forca || 1;
  let totalClasseArmadura = 0;
  let totalPenalidadeArmadura = 0;

  for (const arm of armadurasEquipadas) {
    totalClasseArmadura += extrairClasseArmadura(arm.classe);
    totalPenalidadeArmadura += extrairPenalidadeArmadura(arm.penalidade);
    // Sobrecarga por Força insuficiente: se Força for inferior à forcaMinima da armadura, -1 Destreza extra por ponto faltante
    const forcaMin = arm.forcaMinima || 1;
    if (forcaBase < forcaMin) {
      totalPenalidadeArmadura -= (forcaMin - forcaBase);
    }
  }

  const destrezaBase = ficha.atributos.destreza || 1;
  const destrezaEfetiva = Math.max(1, destrezaBase + totalPenalidadeArmadura);
  const vigorBase = ficha.atributos.vigor || 1;

  // Disciplinas Físicas
  const disc = ficha.disciplinas || [];
  const fortitudeNivel =
    disc.find((d) => d.nome.toLowerCase().includes('fortitude'))?.nivel || 0;
  const potenciaNivel =
    disc.find(
      (d) =>
        d.nome.toLowerCase().includes('potência') ||
        d.nome.toLowerCase().includes('potencia')
    )?.nivel || 0;
  const rapidezNivel =
    disc.find((d) => d.nome.toLowerCase().includes('rapidez'))?.nivel || 0;

  // Absorção canônica de Vampiro: A Idade das Trevas 1ª Edição:
  // Dano Letal e Contusivo: Vigor + Fortitude + Armadura
  const absorcaoDanoNormal = vigorBase + fortitudeNivel + totalClasseArmadura;
  // Dano Agravado (Fogo/Luz Solar): Somente Fortitude (a menos que proteja especificamente)
  const absorcaoDanoAgravado = fortitudeNivel;

  // Esquiva com destreza penalizada pela armadura
  const esquivaEfetiva =
    destrezaEfetiva + (ficha.habilidades?.esquiva || 0);

  // Iniciativa: Destreza Efetiva + Raciocínio + Rapidez
  const raciocinio = ficha.atributos.raciocinio || 1;
  const iniciativaBase = destrezaEfetiva + raciocinio + rapidezNivel;

  return {
    totalClasseArmadura,
    totalPenalidadeArmadura,
    destrezaBase,
    destrezaEfetiva,
    vigorBase,
    forcaBase,
    fortitudeNivel,
    potenciaNivel,
    rapidezNivel,
    absorcaoDanoNormal,
    absorcaoDanoAgravado,
    iniciativaBase,
    esquivaEfetiva,
  };
}
