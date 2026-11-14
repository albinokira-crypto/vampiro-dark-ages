import type { Personagem, User, NivelVitalidade } from '../types';

const STORAGE_KEY_PERSONAGENS = 'vampiro_dark_ages_personagens_v1';
const STORAGE_KEY_USERS = 'vampiro_dark_ages_users_v1';
const STORAGE_KEY_AUTH = 'vampiro_dark_ages_auth_v1';

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
  },
  {
    id: 'usr_jogador1',
    nome: 'Lady Eléonore',
    email: 'eleonore@darkages.com',
    role: 'jogador',
  },
  {
    id: 'usr_jogador2',
    nome: 'Irmão Guy de Lusignan',
    email: 'guy@darkages.com',
    role: 'jogador',
  },
];

export const PERSONAGEM_MODELO: Omit<Personagem, 'id' | 'createdAt' | 'updatedAt'> = {
  usuarioId: 'usr_mestre',
  usuarioNome: 'Mestre da Crônica',
  tipo: 'jogador',
  nome: 'Novo Personagem',
  jogador: '',
  cronica: 'Sombras da Europa Feudal',
  comportamento: 'Sobrevivente',
  cla: 'Lasombra',
  natureza: 'Autocrata',
  geracao: '8ª Geração',
  refugio: 'Cripta da Abadia de Saint-Denis',
  conceito: 'Nobre Banido',
  senhor: 'Lorde Guillaume de Montmirail',
  atributos: {
    forca: 2,
    destreza: 3,
    vigor: 3,
    carisma: 3,
    manipulacao: 4,
    aparencia: 2,
    percepcao: 3,
    inteligencia: 3,
    raciocinio: 3,
  },
  habilidades: {
    prontidao: 2,
    esportes: 1,
    briga: 2,
    esquiva: 2,
    empatia: 1,
    expressao: 2,
    intimidacao: 3,
    lideranca: 3,
    ladinagem: 1,
    manha: 1,
    empatiaAnimais: 0,
    tiroComArco: 1,
    artesanato: 0,
    cavalaria: 3,
    etiqueta: 3,
    herbalismo: 0,
    armasBrancas: 3,
    musica: 1,
    sobrevivencia: 2,
    academicos: 2,
    sabedoriaPopular: 1,
    investigacao: 2,
    direito: 2,
    linguistica: 2,
    medicina: 1,
    ocultismo: 2,
    politica: 3,
    senescencia: 1,
  },
  disciplinas: [
    { id: '1', nome: 'Obtenebracao', nivel: 3 },
    { id: '2', nome: 'Potencia', nivel: 2 },
    { id: '3', nome: 'Dominacao', nivel: 2 },
  ],
  antecedentes: [
    { id: '1', nome: 'Recursos', nivel: 3 },
    { id: '2', nome: 'Lacaios', nivel: 2 },
    { id: '3', nome: 'Geracao', nivel: 5 },
    { id: '4', nome: 'Status', nivel: 2 },
  ],
  virtudes: {
    tipoConsciencia: 'conviccao',
    consciencia: 3,
    tipoAutocontrole: 'instinto',
    autocontrole: 4,
    coragem: 4,
  },
  caminho: 'Caminho dos Reis (Via Regalis)',
  caminhoNivel: 7,
  forcaDeVontade: 7,
  forcaDeVontadeGasta: 0,
  pontosDeSangueMax: 15,
  pontosDeSangueAtual: 12,
  fraqueza: 'Não produz reflexo em espelhos nem superfícies reflexivas, e sombras ao seu redor tremulam.',
  vitalidade: NIVEIS_VITALIDADE_PADRAO,
  xp: {
    atual: 6,
    totalGasto: 24,
    historico: 'Sessão 1: +4 XP (Sobrevivência ao cerco)\nSessão 2: +3 XP (Negociação com o Príncipe de Paris)\nGasto: -10 XP para Obtenebração 3\nGasto: -14 XP para Dominação 2',
  },
  armas: [
    {
      id: '1',
      nome: 'Espada Bastarda Forjada em Toledo',
      dificuldade: '6',
      dano: 'Força + 4',
      ocultacao: 'Sob o Manto',
      alcance: 'Corpo a Corpo',
    },
    {
      id: '2',
      nome: 'Adaga de Misericórdia',
      dificuldade: '4',
      dano: 'Força + 1',
      ocultacao: 'Bolso/Bota',
      alcance: 'Curto',
    },
  ],
  armaduras: [
    {
      id: '1',
      nome: 'Cota de Malha Nobre',
      classe: '3 (Absorção +3)',
      penalidade: '-1 Destreza',
    },
  ],
  lacosDeSangue: [
    { id: '1', regente: 'Gaspard, Escudeiro Fiel (Ghoule)', nivel: 3 },
    { id: '2', regente: 'Padre Thomas de Bayeux (Influência)', nivel: 1 },
  ],
  perturbacoes: [
    {
      id: '1',
      nome: 'Orgulho Desmedido da Linhagem',
      descricao: 'Não aceita ser contrariado por vampiros de gerações mais novas sem uma demonstração de força.',
    },
  ],
  linhasTaumaturgia: [
    { id: '1', nome: 'Senda do Sangue', nivel: 1 },
  ],
  rituais: [
    {
      id: '1',
      nome: 'Defesa do Refúgio Sagrado',
      nivel: '1',
      anotacoes: 'Impede a entrada de luz solar por 24h na câmara (VDA Livro Básico p. 182)',
    },
  ],
  aparencia: {
    idade: '142 anos',
    idadeAparente: '28 anos',
    abraco: 'Ano do Senhor de 1184',
    cabelos: 'Negros como corvo, longos até os ombros',
    raca: 'Franco / Normando',
    olhos: 'Cinza gélido',
    sexo: 'Feminino',
    nacionalidade: 'Reino da França',
    altura: '1.74 m',
    peso: '60 kg',
  },
  biografia: {
    historia: 'Nascida em berço de prata na corte de Champagne, Eléonore descobriu as conspirações da noite ao ser prometida em casamento político. O Senhor Guillaume viu nela a frieza e sagacidade necessárias para governar nas sombras do século XII.',
    preludio: 'Na noite em que sua carruagem foi emboscada por salteadores perto de Troyes, Guillaume emergiu das névoas. Não para salvá-la pela virtude, mas para testar se ela imploraria ou lutaria. Ela pegou a adaga de seu cocheiro caído.',
    objetivos: 'Estabelecer um domínio seguro nas catedrais góticas em construção ao norte da França e desafiar a hegemonia dos Ventrue locais.',
    notas: 'Aliada em potencial: Abadessa Hildegarda. Inimigo jurado: Barão Valerius do Clã Ventrue.',
  },
};

export const storageService = {
  getUsuarios(): User[] {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(USUARIOS_PADRAO));
      return USUARIOS_PADRAO;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return USUARIOS_PADRAO;
    }
  },

  salvarUsuario(user: User): void {
    const usuarios = this.getUsuarios();
    const idx = usuarios.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      usuarios[idx] = user;
    } else {
      usuarios.push(user);
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usuarios));
  },

  getUsuarioAtual(): User {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    const padrao = this.getUsuarios()[0];
    this.setUsuarioAtual(padrao);
    return padrao;
  },

  setUsuarioAtual(user: User): void {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
  },

  getPersonagens(): Personagem[] {
    const raw = localStorage.getItem(STORAGE_KEY_PERSONAGENS);
    if (!raw) {
      const inicial: Personagem = {
        ...PERSONAGEM_MODELO,
        id: 'char_inicial_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const inicial2: Personagem = {
        ...PERSONAGEM_MODELO,
        id: 'char_inicial_2',
        usuarioId: 'usr_jogador2',
        usuarioNome: 'Irmão Guy de Lusignan',
        nome: 'Irmão Guy de Lusignan',
        cla: 'Capadócio',
        natureza: 'Penitente',
        comportamento: 'Erudito',
        geracao: '9ª Geração',
        caminho: 'Caminho dos Ossos (Via Ossis)',
        tipo: 'jogador',
        pontosDeSangueMax: 14,
        pontosDeSangueAtual: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const npc1: Personagem = {
        ...PERSONAGEM_MODELO,
        id: 'char_npc_1',
        usuarioId: 'usr_mestre',
        usuarioNome: 'Mestre da Crônica',
        nome: 'Barão Valerius von Thuringen',
        cla: 'Ventrue',
        geracao: '7ª Geração',
        tipo: 'npc',
        pontosDeSangueMax: 20,
        pontosDeSangueAtual: 18,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const lista = [inicial, inicial2, npc1];
      localStorage.setItem(STORAGE_KEY_PERSONAGENS, JSON.stringify(lista));
      return lista;
    }
    try {
      return JSON.parse(raw);
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
      ...PERSONAGEM_MODELO,
      id: 'char_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      usuarioId: autor.id,
      usuarioNome: autor.nome,
      tipo,
      nome: tipo === 'npc' ? 'Novo NPC da Crônica' : 'Novo Vampiro',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vitalidade: NIVEIS_VITALIDADE_PADRAO.map((n) => ({ ...n })),
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
      return true;
    } catch {
      return false;
    }
  },
};
