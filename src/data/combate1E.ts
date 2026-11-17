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
  penalidadePercepcao?: number; // Penalidade em Percepção (visão e audição obstruídas por elmo/placas)
  descricao?: string;
}

// Catálogo Canônico de Armas da 1ª Edição (Vampiro: A Idade das Trevas — Livro Básico Devir)
export const ARMAS_CATALOGO_1E: ModeloArma1E[] = [
  // =========================================================================
  // ARMAS BRANCAS (Tabela Oficial do Livro — 15 armas)
  // =========================================================================
  {
    nome: 'Faca',
    categoria: 'branca',
    dificuldade: '5',
    dano: 'Força + 1',
    ocultacao: 'B',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 1,
    descricao: 'Ocultabilidade B: pode ser escondida num bolso.',
  },
  {
    nome: 'Adaga',
    categoria: 'branca',
    dificuldade: '4',
    dano: 'Força + 1',
    ocultacao: 'T',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 1,
    descricao: 'Ocultabilidade T: pode ser escondida nas dobras de roupas como túnica ou manto pequeno.',
  },
  {
    nome: 'Espada de Lâmina Larga',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'Força + 4',
    ocultacao: 'M',
    alcance: 'Corpo a corpo',
    forcaMinima: 2,
    recursosMinimo: 2,
    descricao: 'Ocultabilidade M: pode ser escondida num manto ou casaco longo.',
  },
  {
    nome: 'Espada de Mão-e-meia',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'Força + 5',
    ocultacao: 'M',
    alcance: 'Corpo a corpo',
    forcaMinima: 4,
    recursosMinimo: 3,
    descricao: 'Ocultabilidade M: pode ser escondida num manto ou casaco longo.',
  },
  {
    nome: 'Espada Longa',
    categoria: 'branca',
    dificuldade: '5',
    dano: 'Força + 6',
    ocultacao: 'N',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 3,
    descricao: 'Ocultabilidade N: não pode ser escondida.',
  },
  {
    nome: 'Bastão',
    categoria: 'branca',
    dificuldade: '4',
    dano: 'Força + 1 ou + 3',
    ocultacao: 'N',
    alcance: 'Corpo a corpo',
    forcaMinima: 2,
    recursosMinimo: 0,
    descricao: 'Dano Força + 1 (uma mão) ou Força + 3 (duas mãos). Ocultabilidade N.',
  },
  {
    nome: 'Lança, uma mão (*1)',
    categoria: 'branca',
    dificuldade: '7',
    dano: 'Força + 1',
    ocultacao: 'N',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 1,
    descricao: 'Lança empunhada com uma mão (*1). Ocultabilidade N.',
  },
  {
    nome: 'Lança, duas mãos (*1)',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'Força + 3',
    ocultacao: 'N',
    alcance: 'Corpo a corpo',
    forcaMinima: 2,
    recursosMinimo: 1,
    descricao: 'Lança empunhada com duas mãos (*1). Ocultabilidade N.',
  },
  {
    nome: 'Lança de Justa (*2)',
    categoria: 'branca',
    dificuldade: '8',
    dano: 'Força + 6',
    ocultacao: 'N',
    alcance: 'Montado',
    forcaMinima: 1,
    recursosMinimo: 3,
    descricao: 'Lança de justa para combate montado (*2). Ocultabilidade N.',
  },
  {
    nome: 'Forcado (2 mãos)',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'Força + 1',
    ocultacao: 'N',
    alcance: 'Corpo a corpo',
    forcaMinima: 3,
    recursosMinimo: 0,
    descricao: 'Arma agrícola de duas mãos. Ocultabilidade N.',
  },
  {
    nome: 'Machado de Mão',
    categoria: 'branca',
    dificuldade: '7',
    dano: 'Força + 5',
    ocultacao: 'M',
    alcance: 'Corpo a corpo',
    forcaMinima: 3,
    recursosMinimo: 1,
    descricao: 'Machado curto de combate. Ocultabilidade M.',
  },
  {
    nome: 'Machado de Batalha',
    categoria: 'branca',
    dificuldade: '7',
    dano: 'Força + 6',
    ocultacao: 'N',
    alcance: 'Corpo a corpo',
    forcaMinima: 3,
    recursosMinimo: 2,
    descricao: 'Machado pesado de guerra. Ocultabilidade N.',
  },
  {
    nome: 'Acha (*3)',
    categoria: 'branca',
    dificuldade: '7',
    dano: 'Força + 6',
    ocultacao: 'N',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 2,
    descricao: 'Arma de haste pesada (*3). Ocultabilidade N.',
  },
  {
    nome: 'Maça',
    categoria: 'branca',
    dificuldade: '6',
    dano: 'Força + 4',
    ocultacao: 'T',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 2,
    descricao: 'Arma contundente contra armaduras. Ocultabilidade T.',
  },
  {
    nome: 'Mangual (*4)',
    categoria: 'branca',
    dificuldade: '7',
    dano: 'Força + 6',
    ocultacao: 'M',
    alcance: 'Corpo a corpo',
    forcaMinima: 1,
    recursosMinimo: 2,
    descricao: 'Arma articulada de impacto (*4). Ocultabilidade M.',
  },

  // =========================================================================
  // ARMAS DE LONGO ALCANCE (Tabela Oficial do Livro — 7 armas)
  // =========================================================================
  {
    nome: 'Arco Curto',
    categoria: 'distancia',
    dificuldade: 'variável',
    dano: '2',
    ocultacao: 'T',
    alcance: '60 m.',
    forcaMinima: 2,
    recursosMinimo: 1,
    descricao: 'CDT: 1/2 (1 disparo a cada 2 turnos; tiro rápido usa metade da Parada de Dados). Ocultabilidade T.',
  },
  {
    nome: 'Arco Longo',
    categoria: 'distancia',
    dificuldade: 'variável',
    dano: '4',
    ocultacao: 'N',
    alcance: '120 m.',
    forcaMinima: 4,
    recursosMinimo: 2,
    descricao: 'CDT: 1/2 (1 disparo a cada 2 turnos; tiro rápido usa metade da Parada de Dados). Ocultabilidade N.',
  },
  {
    nome: 'Besta',
    categoria: 'distancia',
    dificuldade: 'variável',
    dano: '3',
    ocultacao: 'N',
    alcance: '90 m.',
    forcaMinima: 2,
    recursosMinimo: 3,
    descricao: 'CDT: 1/4 (requer 3 turnos inteiros para ser recarregada). Ocultabilidade N.',
  },
  {
    nome: 'Lança (arremessada)',
    categoria: 'distancia',
    dificuldade: 'variável',
    dano: 'Força + 2',
    ocultacao: 'N',
    alcance: 'N/D',
    forcaMinima: 2,
    recursosMinimo: 1,
    descricao: 'CDT: N/D. Arremesso de lança. Ocultabilidade N.',
  },
  {
    nome: 'Faca (arremessada)',
    categoria: 'distancia',
    dificuldade: 'variável',
    dano: 'Força',
    ocultacao: 'B',
    alcance: '10 m.',
    forcaMinima: 2,
    recursosMinimo: 1,
    descricao: 'CDT: N/D. Arremesso até 10 m. Ocultabilidade B.',
  },
  {
    nome: 'Pedras',
    categoria: 'distancia',
    dificuldade: 'variável',
    dano: 'Força - 1',
    ocultacao: 'B',
    alcance: '10 m.',
    forcaMinima: 2,
    recursosMinimo: 0,
    descricao: 'CDT: N/D. Arremesso até 10 m. Ocultabilidade B.',
  },
  {
    nome: 'Machadinha',
    categoria: 'distancia',
    dificuldade: '+1',
    dano: 'Força + 1',
    ocultacao: 'T',
    alcance: '12 m.',
    forcaMinima: 2,
    recursosMinimo: 1,
    descricao: 'CDT: N/D. Dificuldade +1. Arremesso até 12 m. Ocultabilidade T.',
  },
];

// Catálogo Canônico de Armaduras da 1ª Edição (Vampiro: A Idade das Trevas — Pág. 193)
export const ARMADURAS_CATALOGO_1E: ModeloArmadura1E[] = [
  {
    nome: 'Armadura Leve',
    classe: '1',
    penalidade: '0',
    forcaMinima: 1,
    recursosMinimo: 1,
    penalidadePercepcao: 0,
    descricao:
      'Peças de couro, talvez endurecidas ou forradas, talvez com um capuz. Usada por guardas de portões, fora-da-lei, vigias de cidades e soldados em guarnição (também usada por cavaleiros sob armaduras de metal).',
  },
  {
    nome: 'Armadura Composta',
    classe: '2',
    penalidade: '-1',
    forcaMinima: 1,
    recursosMinimo: 2,
    penalidadePercepcao: 0,
    descricao:
      'Mistura de peças de couro reforçado por tachas e anéis, elmo surrado e pedaços de cota de malha enferrujada. Normalmente usada por bandos de mercenários ou bandidos bem-sucedidos.',
  },
  {
    nome: 'Armadura Pesada',
    classe: '3',
    penalidade: '-1',
    forcaMinima: 2,
    recursosMinimo: 3,
    penalidadePercepcao: -1,
    descricao:
      'Cotas de malha ou couras muito reforçadas com cobertura de metal semelhante a um elmo e acolchoamento por baixo (rosto exposto; pesa ~45 kg). Vestida por soldados e nobres empobrecidos em combate.',
  },
  {
    nome: 'Armadura de Cavaleiro',
    classe: '4',
    penalidade: '-2',
    forcaMinima: 3,
    recursosMinimo: 4,
    penalidadePercepcao: -2,
    descricao:
      'Cota de malha cobrindo todo o corpo e pescoço, manoplas volumosas e grande elmo fechado sobre a cabeça (pesa >90 kg). Apenas os nobres mais ricos têm recursos para comprar e manter.',
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
    // Procura por bônus ou penalidade como "+3", "+ 2", "- 1"
    const match = texto.match(/([+-])\s*(\d+)/);
    const bonus = match ? parseInt(match[1] + match[2], 10) : 0;
    const totalDados = Math.max(1, forca + bonus);
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
  totalPenalidadePercepcao: number;
  destrezaBase: number;
  destrezaEfetiva: number;
  percepcaoBase: number;
  percepcaoEfetiva: number;
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
  let totalPenalidadePercepcao = 0;

  for (const arm of armadurasEquipadas) {
    totalClasseArmadura += extrairClasseArmadura(arm.classe);
    totalPenalidadeArmadura += extrairPenalidadeArmadura(arm.penalidade);
    if (typeof arm.penalidadePercepcao === 'number' && arm.penalidadePercepcao !== 0) {
      totalPenalidadePercepcao += arm.penalidadePercepcao;
    }
    // Sobrecarga por Força insuficiente: se Força for inferior à forcaMinima da armadura, -1 Destreza extra por ponto faltante
    const forcaMin = arm.forcaMinima || 1;
    if (forcaBase < forcaMin) {
      totalPenalidadeArmadura -= (forcaMin - forcaBase);
    }
  }

  const destrezaBase = ficha.atributos.destreza || 1;
  const destrezaEfetiva = Math.max(1, destrezaBase + totalPenalidadeArmadura);
  const percepcaoBase = ficha.atributos.percepcao || 1;
  const percepcaoEfetiva = Math.max(1, percepcaoBase + totalPenalidadePercepcao);
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
    totalPenalidadePercepcao,
    destrezaBase,
    destrezaEfetiva,
    percepcaoBase,
    percepcaoEfetiva,
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
