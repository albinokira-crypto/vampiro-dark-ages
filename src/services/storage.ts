import type {
  Personagem,
  User,
  NivelVitalidade,
  ConfiguracaoMesa,
} from '../types';

const STORAGE_KEY_PERSONAGENS = 'vampiro_dark_ages_personagens_v1';
const STORAGE_KEY_USERS = 'vampiro_dark_ages_users_v1';
const STORAGE_KEY_AUTH = 'vampiro_dark_ages_auth_v1';
const STORAGE_KEY_CONFIG = 'vampiro_dark_ages_config_v1';

export const CONFIGURACAO_MESA_PADRAO: ConfiguracaoMesa = {
  pontosAtributos: {
    primario: 7,
    secundario: 5,
    terciario: 3,
  },
  pontosHabilidades: {
    primario: 13,
    secundario: 7,
    terciario: 5,
  },
  pontosDisciplinas: 4,
  pontosAntecedentes: 5,
  pontosVirtudes: 7,
  pontosBonus: 15,
};

export const NIVEIS_VITALIDADE_PADRAO: NivelVitalidade[] = [
  { id: '1', nome: 'Escoriado', penalidade: '0', dano: 'nenhum' },
  { id: '2', nome: 'Machucado', penalidade: '-1', dano: 'nenhum' },
  { id: '3', nome: 'Ferido', penalidade: '-1', dano: 'nenhum' },
  { id: '4', nome: 'Ferido Gravemente', penalidade: '-2', dano: 'nenhum' },
  { id: '5', nome: 'Espancado', penalidade: '-2', dano: 'nenhum' },
  { id: '6', nome: 'Aleijado', penalidade: '-5', dano: 'nenhum' },
  { id: '7', nome: 'Incapacitado', penalidade: 'Incapaz', dano: 'nenhum' },
];

export const USUARIOS_PADRAO: User[] = [
  {
    id: 'usr_mestre',
    nome: 'Mestre da Crônica',
    email: 'mestre@darkages.com',
    role: 'mestre',
    senha: '123',
  },
  {
    id: 'usr_jogador1',
    nome: 'Lady Eléonore',
    email: 'eleonore@darkages.com',
    role: 'jogador',
    senha: '123',
  },
  {
    id: 'usr_jogador2',
    nome: 'Irmão Guy de Lusignan',
    email: 'guy@darkages.com',
    role: 'jogador',
    senha: '123',
  },
];

export const PERSONAGEM_ZERADO_MODELO: Omit<Personagem, 'id' | 'createdAt' | 'updatedAt'> = {
  usuarioId: 'usr_mestre',
  usuarioNome: 'Mestre da Crônica',
  tipo: 'jogador',
  nome: 'Novo Cainita',
  jogador: '',
  cronica: 'Idade das Trevas',
  comportamento: '',
  cla: '',
  natureza: '',
  geracao: '12ª Geração',
  refugio: '',
  conceito: '',
  senhor: '',
  criacao: {
    status: 'em_criacao',
    etapa: 'prioridades',
    disciplinasPrimariasIds: [],
    pontosBonusGastos: 0,
  },
  atributos: {
    // Todos começam com a primeira bolinha preenchida obrigatoriamente
    forca: 1,
    destreza: 1,
    vigor: 1,
    carisma: 1,
    manipulacao: 1,
    aparencia: 1,
    percepcao: 1,
    inteligencia: 1,
    raciocinio: 1,
  },
  habilidades: {
    // Todas habilidades começam zeradas
    prontidao: 0,
    esportes: 0,
    briga: 0,
    esquiva: 0,
    empatia: 0,
    expressao: 0,
    intimidacao: 0,
    lideranca: 0,
    ladinagem: 0,
    manha: 0,
    empatiaAnimais: 0,
    tiroComArco: 0,
    artesanato: 0,
    cavalaria: 0,
    etiqueta: 0,
    herbalismo: 0,
    armasBrancas: 0,
    musica: 0,
    sobrevivencia: 0,
    academicos: 0,
    sabedoriaPopular: 0,
    investigacao: 0,
    direito: 0,
    linguistica: 0,
    medicina: 0,
    ocultismo: 0,
    politica: 0,
    senescencia: 0,
  },
  disciplinas: [],
  antecedentes: [],
  virtudes: {
    tipoConsciencia: 'consciencia',
    consciencia: 1, // começa com 1 bolinha preenchida
    tipoAutocontrole: 'autocontrole',
    autocontrole: 1, // começa com 1 bolinha preenchida
    coragem: 1, // começa com 1 bolinha preenchida
  },
  caminho: 'Humanidade',
  caminhoNivel: 2, // Consciência (1) + Autocontrole (1)
  forcaDeVontade: 1, // Igual à Coragem (1)
  forcaDeVontadeGasta: 0,
  pontosDeSangueMax: 10,
  pontosDeSangueAtual: 10,
  fraqueza: '',
  vitalidade: NIVEIS_VITALIDADE_PADRAO.map((n) => ({ ...n })),
  xp: {
    atual: 0,
    totalGasto: 0,
    historico: 'Criação inicial da ficha.',
  },
  armas: [],
  armaduras: [],
  lacosDeSangue: [],
  perturbacoes: [],
  linhasTaumaturgia: [],
  rituais: [],
  aparencia: {
    idade: '',
    idadeAparente: '',
    abraco: '',
    cabelos: '',
    raca: '',
    olhos: '',
    sexo: '',
    nacionalidade: '',
    altura: '',
    peso: '',
  },
  biografia: {
    historia: '',
    preludio: '',
    objetivos: '',
    notas: '',
  },
};

export const storageService = {
  // Configuração da Mesa pelo Mestre
  getConfiguracaoMesa(): ConfiguracaoMesa {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) {
      this.salvarConfiguracaoMesa(CONFIGURACAO_MESA_PADRAO);
      return CONFIGURACAO_MESA_PADRAO;
    }
    try {
      return { ...CONFIGURACAO_MESA_PADRAO, ...JSON.parse(raw) };
    } catch {
      return CONFIGURACAO_MESA_PADRAO;
    }
  },

  salvarConfiguracaoMesa(config: ConfiguracaoMesa): void {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  },

  // Autenticação e Usuários
  getUsuarios(): User[] {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(USUARIOS_PADRAO));
      return USUARIOS_PADRAO;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : USUARIOS_PADRAO;
    } catch {
      return USUARIOS_PADRAO;
    }
  },

  salvarUsuario(user: User): void {
    const todos = this.getUsuarios();
    const idx = todos.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      todos[idx] = user;
    } else {
      todos.push(user);
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(todos));
  },

  login(email: string, senha?: string): User | null {
    const usuarios = this.getUsuarios();
    const encontrado = usuarios.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (!encontrado) return null;
    // Se tiver senha cadastrada, verifica (ou aceita se estiver vazia para testes)
    if (encontrado.senha && senha && encontrado.senha !== senha) {
      return null;
    }
    this.setUsuarioAtual(encontrado);
    return encontrado;
  },

  cadastrar(nome: string, email: string, senha?: string): User {
    const usuarios = this.getUsuarios();
    const jaExiste = usuarios.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (jaExiste) {
      throw new Error('Já existe um jogador registrado com este e-mail.');
    }
    const novo: User = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5),
      nome,
      email,
      role: 'jogador',
      senha: senha || '123',
    };
    this.salvarUsuario(novo);
    this.setUsuarioAtual(novo);
    return novo;
  },

  getUsuarioAtual(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setUsuarioAtual(user: User): void {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  // Personagens
  getPersonagens(): Personagem[] {
    const raw = localStorage.getItem(STORAGE_KEY_PERSONAGENS);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  getPersonagensDoUsuario(user: User): Personagem[] {
    const todos = this.getPersonagens();
    if (user.role === 'mestre') {
      return todos;
    }
    return todos.filter((p) => p.usuarioId === user.id);
  },

  getPersonagem(id: string): Personagem | null {
    const todos = this.getPersonagens();
    return todos.find((p) => p.id === id) ?? null;
  },

  salvarPersonagem(personagem: Personagem): void {
    const todos = this.getPersonagens();
    const idx = todos.findIndex((p) => p.id === personagem.id);
    const atualizado = {
      ...personagem,
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) {
      todos[idx] = atualizado;
    } else {
      todos.unshift(atualizado);
    }
    localStorage.setItem(STORAGE_KEY_PERSONAGENS, JSON.stringify(todos));
  },

  criarNovoPersonagem(autor: User, tipo: 'jogador' | 'npc' = 'jogador'): Personagem {
    const novo: Personagem = {
      ...PERSONAGEM_ZERADO_MODELO,
      id: 'char_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      usuarioId: autor.id,
      usuarioNome: autor.nome,
      jogador: autor.role === 'jogador' ? autor.nome : '',
      tipo,
      nome: tipo === 'npc' ? 'Novo NPC da Crônica' : 'Novo Cainita',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vitalidade: NIVEIS_VITALIDADE_PADRAO.map((n) => ({ ...n })),
      criacao: {
        status: 'em_criacao',
        etapa: 'prioridades',
        disciplinasPrimariasIds: [],
        pontosBonusGastos: 0,
      },
    };
    this.salvarPersonagem(novo);
    return novo;
  },

  excluirPersonagem(id: string): boolean {
    const todos = this.getPersonagens();
    const filtrados = todos.filter((p) => p.id !== id);
    if (filtrados.length !== todos.length) {
      localStorage.setItem(STORAGE_KEY_PERSONAGENS, JSON.stringify(filtrados));
      return true;
    }
    return false;
  },

  exportarBackup(): string {
    const dados = {
      usuarios: this.getUsuarios(),
      personagens: this.getPersonagens(),
      configuracaoMesa: this.getConfiguracaoMesa(),
      exportadoEm: new Date().toISOString(),
    };
    return JSON.stringify(dados, null, 2);
  },

  importarBackup(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed.personagens)) {
        localStorage.setItem(STORAGE_KEY_PERSONAGENS, JSON.stringify(parsed.personagens));
      }
      if (Array.isArray(parsed.usuarios)) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsed.usuarios));
      }
      if (parsed.configuracaoMesa) {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(parsed.configuracaoMesa));
      }
      return true;
    } catch {
      return false;
    }
  },
};
