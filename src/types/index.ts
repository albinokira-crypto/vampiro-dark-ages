export type UserRole = 'mestre' | 'jogador';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export type TipoDanoVitalidade = 'nenhum' | 'contusao' | 'letal' | 'agravado';

export interface NivelVitalidade {
  id: string;
  nome: string;
  penalidade: string;
  dano: TipoDanoVitalidade;
}

export interface ItemSimplesNivel {
  id: string;
  nome: string;
  nivel: number;
}

export interface Arma {
  id: string;
  nome: string;
  dificuldade: string;
  dano: string;
  ocultacao: string;
  alcance: string;
}

export interface Armadura {
  id: string;
  nome: string;
  classe: string;
  penalidade: string;
}

export interface LacoDeSangue {
  id: string;
  regente: string;
  nivel: number; // 1, 2 ou 3
}

export interface Perturbacao {
  id: string;
  nome: string;
  descricao: string;
}

export interface Ritual {
  id: string;
  nome: string;
  nivel: string;
  anotacoes: string;
}

export interface Personagem {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  tipo: 'jogador' | 'npc';
  createdAt: string;
  updatedAt: string;

  // SEÇÃO 1: CARACTERÍSTICAS PRINCIPAIS
  // Cabeçalho
  nome: string;
  jogador: string;
  cronica: string;
  comportamento: string;
  cla: string;
  natureza: string;
  geracao: string;
  refugio: string;
  conceito: string;
  senhor: string;

  // Atributos (1 a 8)
  atributos: {
    // Físicos
    forca: number;
    destreza: number;
    vigor: number;
    // Sociais
    carisma: number;
    manipulacao: number;
    aparencia: number;
    // Mentais
    percepcao: number;
    inteligencia: number;
    raciocinio: number;
  };

  // Habilidades (0 a 8)
  habilidades: {
    // Talentos
    prontidao: number;
    esportes: number;
    briga: number;
    esquiva: number;
    empatia: number;
    expressao: number;
    intimidacao: number;
    lideranca: number;
    ladinagem: number;
    manha: number;
    // Perícias
    empatiaAnimais: number;
    tiroComArco: number;
    artesanato: number;
    cavalaria: number;
    etiqueta: number;
    herbalismo: number;
    armasBrancas: number;
    musica: number;
    sobrevivencia: number;
    // Conhecimentos
    academicos: number;
    sabedoriaPopular: number;
    investigacao: number;
    direito: number;
    linguistica: number;
    medicina: number;
    ocultismo: number;
    politica: number;
    senescencia: number;
  };

  // Vantagens
  disciplinas: ItemSimplesNivel[];
  antecedentes: ItemSimplesNivel[];
  virtudes: {
    tipoConsciencia: 'consciencia' | 'conviccao';
    consciencia: number; // 1 a 5/8
    tipoAutocontrole: 'autocontrole' | 'instinto';
    autocontrole: number; // 1 a 5/8
    coragem: number; // 1 a 5/8
  };

  // Status Atuais
  caminho: string;
  caminhoNivel: number; // 1 a 10
  forcaDeVontade: number; // permanente (1 a 10)
  forcaDeVontadeGasta: number; // caixas gastas (0 a 10)
  pontosDeSangueMax: number; // pool de sangue máximo pela geração
  pontosDeSangueAtual: number; // pontos atuais
  fraqueza: string;

  // Vitalidade
  vitalidade: NivelVitalidade[];

  // SEÇÃO 2: EXPERIÊNCIA, COMBATE E LAÇOS
  xp: {
    atual: number;
    totalGasto: number;
    historico: string;
  };
  armas: Arma[];
  armaduras: Armadura[];
  lacosDeSangue: LacoDeSangue[];
  perturbacoes: Perturbacao[];

  // SEÇÃO 3: MAGIA, BIOGRAFIA E APARÊNCIA
  linhasTaumaturgia: ItemSimplesNivel[];
  rituais: Ritual[];
  aparencia: {
    idade: string;
    idadeAparente: string;
    abraco: string;
    cabelos: string;
    raca: string;
    olhos: string;
    sexo: string;
    nacionalidade: string;
    altura: string;
    peso: string;
  };
  biografia: {
    historia: string;
    preludio: string;
    objetivos: string;
    notas: string;
  };
}
