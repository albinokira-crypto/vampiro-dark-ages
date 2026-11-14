/**
 * Tabelas e Regras Oficiais de Vampiro: A Idade das Trevas (1ª Edição - 1996)
 * Livro Básico Oficial (White Wolf / Devir Livraria)
 */

export interface ClaDarkAges1e {
  nome: string;
  disciplinas: [string, string, string];
  tipo: 'alto_cla' | 'baixo_cla';
  descricaoBreve?: string;
  fraqueza?: string;
}

export const CLAS_DARK_AGES_1E: ClaDarkAges1e[] = [
  // Altos Clãs (High Clans)
  {
    nome: 'Brujah',
    disciplinas: ['Rapidez', 'Potência', 'Presença'],
    tipo: 'alto_cla',
    descricaoBreve: 'Filósofos guerreiros e cavaleiros apaixonados',
    fraqueza: 'A fúria arde intensamente; a dificuldade para resistir ao Frenesi é sempre 2 mais alta (máximo 10).',
  },
  {
    nome: 'Capadócio',
    disciplinas: ['Auspícios', 'Fortitude', 'Mortis'],
    tipo: 'alto_cla',
    descricaoBreve: 'Eruditos da morte e necromantes cadavéricos',
    fraqueza: 'Aparência cadavérica; a pele fica pálida e fria como a de um cadáver (Aparência máx 2 ou dif +2 em sociais com mortais).',
  },
  {
    nome: 'Lasombra',
    disciplinas: ['Dominação', 'Potência', 'Tenebrosidade'],
    tipo: 'alto_cla',
    descricaoBreve: 'Senhores nobres das sombras e manipuladores da Igreja',
    fraqueza: 'Não projetam reflexo em espelhos, água ou superfícies refletoras; sofrem 1 nível de dano extra por fogo e sol.',
  },
  {
    nome: 'Toreador',
    disciplinas: ['Auspícios', 'Rapidez', 'Presença'],
    tipo: 'alto_cla',
    descricaoBreve: 'Artistas, cortesãos e patronos da cavalaria cortês',
    fraqueza: 'Fascinam-se em transe estético diante de beleza sublime ou arte arrebatadora (teste de Autocontrole para não paralisar).',
  },
  {
    nome: 'Tzimisce',
    disciplinas: ['Animalismo', 'Auspícios', 'Vicissitude'],
    tipo: 'alto_cla',
    descricaoBreve: 'Voivodas e senhores feudais do Leste Europeu',
    fraqueza: 'Conexão mística com a terra natal; devem repousar com pelo menos dois punhados da terra de seu solo de origem.',
  },
  {
    nome: 'Ventrue',
    disciplinas: ['Dominação', 'Fortitude', 'Presença'],
    tipo: 'alto_cla',
    descricaoBreve: 'Reis, suseranos e guardiões da lei cainita',
    fraqueza: 'Paladar refinado e restrito; só podem se alimentar de um tipo específico e exclusivo de presa (ex: nobres virgens, guerreiros, monges).',
  },

  // Baixos Clãs (Low Clans)
  {
    nome: 'Assamita',
    disciplinas: ['Rapidez', 'Ofuscação', 'Quietus'],
    tipo: 'baixo_cla',
    descricaoBreve: 'Guerreiros saracenos, juízes e assassinos de Alamut',
    fraqueza: 'Devem pagar 10% de todo sangue coletado aos Anciões de Alamut e sofrem vício incontrolável de Diablerie ao provar vitae cainita.',
  },
  {
    nome: 'Gangrel',
    disciplinas: ['Animalismo', 'Fortitude', 'Metamorfose'],
    tipo: 'baixo_cla',
    descricaoBreve: 'Nômades selvagens e metamorfos das florestas escuras',
    fraqueza: 'A cada Frenesi que sucumbem, adquirem uma característica física ou comportamental animal permanente.',
  },
  {
    nome: 'Malkaviano',
    disciplinas: ['Auspícios', 'Dominação', 'Ofuscação'],
    tipo: 'baixo_cla',
    descricaoBreve: 'Oráculos loucos e videntes visionários',
    fraqueza: 'Todos sofrem de pelo menos uma Perturbação mental incurável desde o Abraço.',
  },
  {
    nome: 'Nosferatu',
    disciplinas: ['Animalismo', 'Ofuscação', 'Potência'],
    tipo: 'baixo_cla',
    descricaoBreve: 'Espiões desfigurados e habitantes dos subterrâneos',
    fraqueza: 'Aparência 0 permanente e automática devido a deformidades monstruosas e grotescas causadas pela Maldição.',
  },
  {
    nome: 'Ravnos',
    disciplinas: ['Animalismo', 'Fortitude', 'Quimerismo'],
    tipo: 'baixo_cla',
    descricaoBreve: 'Trapaceiros errantes e mestres da ilusão',
    fraqueza: 'Compulsão incontrolável por um crime, vício ou trapaça específico (roubo, jogo, blefe, mentira, traição).',
  },
  {
    nome: 'Seguidores de Set',
    disciplinas: ['Ofuscação', 'Presença', 'Serpentis'],
    tipo: 'baixo_cla',
    descricaoBreve: 'Corruptores religiosos e devotos de Set',
    fraqueza: 'Sensibilidade extrema à luz; sofrem 2 níveis extras de dano agravado pela luz solar e têm penalidade em tochas brilhantes.',
  },
  {
    nome: 'Tremere',
    disciplinas: ['Auspícios', 'Dominação', 'Taumaturgia'],
    tipo: 'baixo_cla',
    descricaoBreve: 'Usurpadores herméticos e feiticeiros de sangue',
    fraqueza: 'Estrutura rígida de lealdade; todos já iniciam o Abraço com o primeiro passo de um Laço de Sangue com os Sete Anciões de Viena.',
  },
];

export const DISCIPLINAS_LIVRO_1E: string[] = [
  'Animalismo',
  'Auspícios',
  'Dominação',
  'Fortitude',
  'Metamorfose',
  'Mortis',
  'Ofuscação',
  'Potência',
  'Presença',
  'Quimerismo',
  'Quietus',
  'Rapidez',
  'Serpentis',
  'Taumaturgia',
  'Tenebrosidade',
  'Vicissitude',
];

export const ARQUETIPOS_PERSONALIDADE_1E: string[] = [
  'Arquiteto',
  'Autocrata',
  'Bárbaro',
  'Bon Vivant',
  'Bravo (Valentão)',
  'Celebrante',
  'Conformista',
  'Criança',
  'Cuidador',
  'Diretor',
  'Fanático',
  'Galante',
  'Juiz',
  'Líder',
  'Mártir',
  'Monstro',
  'Rebelde',
  'Sobrevivente',
  'Solitário',
  'Tradicionalista',
  'Trapaceiro',
  'Visionário',
];

export const ANTECEDENTES_LIVRO_1E: string[] = [
  'Aliados',
  'Contatos',
  'Criados',
  'Geração',
  'Influência',
  'Mentor',
  'Rebanho',
  'Recursos',
  'Status',
];

/**
 * Tabela Oficial de Geração - Vampiro: A Idade das Trevas 1ª Edição (pág. 125 e 140)
 * Geração inicial padrão: 12ª geração (0 pontos no antecedente Geração)
 * Cada ponto no antecedente Geração reduz um nível na geração do Cainita (máx 5 pontos = 7ª Geração)
 */
export interface InfoGeracao {
  pontosAntecedente: number;
  geracaoNome: string;
  reservaSangueMax: number;
  pontosPorTurno: number;
  maxAtributo: number;
}

export const TABELA_GERACAO_1E: Record<number, InfoGeracao> = {
  0: {
    pontosAntecedente: 0,
    geracaoNome: '12ª Geração',
    reservaSangueMax: 11,
    pontosPorTurno: 1,
    maxAtributo: 5,
  },
  1: {
    pontosAntecedente: 1,
    geracaoNome: '11ª Geração',
    reservaSangueMax: 12,
    pontosPorTurno: 1,
    maxAtributo: 5,
  },
  2: {
    pontosAntecedente: 2,
    geracaoNome: '10ª Geração',
    reservaSangueMax: 13,
    pontosPorTurno: 1,
    maxAtributo: 5,
  },
  3: {
    pontosAntecedente: 3,
    geracaoNome: '9ª Geração',
    reservaSangueMax: 14,
    pontosPorTurno: 2,
    maxAtributo: 5,
  },
  4: {
    pontosAntecedente: 4,
    geracaoNome: '8ª Geração',
    reservaSangueMax: 15,
    pontosPorTurno: 3,
    maxAtributo: 5,
  },
  5: {
    pontosAntecedente: 5,
    geracaoNome: '7ª Geração',
    reservaSangueMax: 20,
    pontosPorTurno: 4,
    maxAtributo: 6,
  },
};

/**
 * Calcula a geração e a reserva de sangue baseando-se no antecedente 'Geração'
 */
export function calcularGeracaoEpoolSangue(pontosAntecedenteGeracao: number = 0): InfoGeracao {
  const pontosClamped = Math.max(0, Math.min(5, Math.floor(pontosAntecedenteGeracao)));
  return TABELA_GERACAO_1E[pontosClamped] || TABELA_GERACAO_1E[0];
}

/**
 * Trilhas de Moralidade Oficiais - Vampiro: A Idade das Trevas (Livro Devir 1998)
 */
export interface TrilhaDarkAges1e {
  nome: string;
  viaLatin: string;
  descricao: string;
  virtudes: string;
}

export const TRILHAS_DARK_AGES_1E: TrilhaDarkAges1e[] = [
  {
    nome: 'Caminho da Besta',
    viaLatin: 'Via Bestiae',
    descricao: 'Abraça a natureza predatória, sobrevivendo como fera astuta e instintiva em harmonia com a Besta.',
    virtudes: 'Convicção e Instinto',
  },
  {
    nome: 'Caminho do Sangue',
    viaLatin: 'Via Sanguinis',
    descricao: 'Código de Alamut e dos Assamitas: purificação pelo sangue, honra e fidelidade estrita a Haqim.',
    virtudes: 'Convicção e Autocontrole',
  },
  {
    nome: 'Caminho do Cavaleiro',
    viaLatin: 'Via Equitis',
    descricao: 'O código cavalheiresco de honra, nobreza feudal, lealdade inabalável e proteção aos fracos.',
    virtudes: 'Consciência e Autocontrole',
  },
  {
    nome: 'Caminho do Diabo',
    viaLatin: 'Via Diabolis',
    descricao: 'Abraça a maldade e a corrupção consciente, assumindo o papel de emissário do inferno na Terra.',
    virtudes: 'Convicção e Instinto',
  },
  {
    nome: 'Caminho do Paraíso',
    viaLatin: 'Via Caeli',
    descricao: 'A crença cainita na fé divina e na expiação: o vampiro como instrumento ou anjo vingador de Deus.',
    virtudes: 'Consciência e Autocontrole',
  },
  {
    nome: 'Caminho da Humanidade',
    viaLatin: 'Via Humanitatis',
    descricao: 'Preserva a empatia mortal, a razão humana e os laços afetivos para sufocar a Besta interior.',
    virtudes: 'Consciência e Autocontrole',
  },
  {
    nome: 'Caminho do Paradoxo',
    viaLatin: 'Via Paradoxi',
    descricao: 'A filosofia cármica dos Ravnos: desiludir os tolos e quebrar as correntes da ilusão mundana (Maya).',
    virtudes: 'Convicção e Autocontrole',
  },
  {
    nome: 'Caminho de Tífon',
    viaLatin: 'Via Typhonis',
    descricao: 'A via milenar dos Setitas: corrupção espiritual e quebra das amarras para o despertar do deus Set.',
    virtudes: 'Convicção e Instinto',
  },
];
