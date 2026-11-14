export type UserRole = 'mestre' | 'jogador';

export interface User {
  id: string;
  nome: string;
  nick: string;
  email?: string;
  role: UserRole;
  senha?: string;
}

export interface AtalhoParadaDado {
  id: string;
  nome: string;
  traco1: string;
  traco2?: string;
  tipoExibicao: 'total' | 'dados';
  icone?: string;
}

export interface ConfiguracaoMesa {
  pontosAtributos: {
    primario: number; // 7
    secundario: number; // 5
    terciario: number; // 3
  };
  pontosHabilidades: {
    primario: number; // 13
    secundario: number; // 7
    terciario: number; // 5
  };
  pontosDisciplinas: number; // 3
  pontosAntecedentes: number; // 5
  pontosVirtudes: number; // 7
  pontosBonus: number; // 15
  atalhosCard?: AtalhoParadaDado[];
}

export type CategoriaAtributo = 'fisicos' | 'sociais' | 'mentais';
export type CategoriaHabilidade = 'talentos' | 'pericias' | 'conhecimentos';

export interface DadosCriacaoFicha {
  status: 'em_criacao' | 'finalizada';
  etapa: 'prioridades' | 'iniciais' | 'bonus' | 'concluida';
  prioridadesAtributos?: {
    primario: CategoriaAtributo;
    secundario: CategoriaAtributo;
    terciario: CategoriaAtributo;
  };
  prioridadesHabilidades?: {
    primario: CategoriaHabilidade;
    secundario: CategoriaHabilidade;
    terciario: CategoriaHabilidade;
  };
  disciplinasPrimariasIds: string[]; // as 3 primeiras disciplinas travadas (disciplinas de clã)
  pontosBonusGastos: number; // 0 a 15
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

export interface QualidadeDefeitoItem {
  id: string;
  nome: string;
  tipo: 'qualidade' | 'defeito';
  categoria: 'fisico' | 'mental' | 'social' | 'sobrenatural';
  custo: number; // Valor positivo: se qualidade gasta pontos bônus; se defeito concede pontos bônus
  descricao?: string;
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

  // Controle do Modo de Criação (Passo a passo com pontos iniciais e bônus)
  criacao?: DadosCriacaoFicha;

  // SEÇÃO 1: CARACTERÍSTICAS PRINCIPAIS
  // Cabeçalho
  foto?: string; // Imagem em Base64 comprimida
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
  qualidadesDefeitos?: QualidadeDefeitoItem[];
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

export interface LogAlteracao {
  id: string;
  personagemId: string;
  personagemNome: string;
  jogadorNome: string;
  tipo: 'xp' | 'atributo' | 'habilidade' | 'sangue' | 'vitalidade' | 'disciplina' | 'vontade' | 'caminho' | 'geral';
  descricao: string;
  detalhes?: string;
  criadoEm: string;
}
