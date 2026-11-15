import type {
  Personagem,
  User,
  UserRole,
  NivelVitalidade,
  ConfiguracaoMesa,
  LogAlteracao,
} from '../types';
import { ATALHOS_CARD_PADRAO } from '../data/atalhosCard';
import { calcularGeracaoEpoolSangue } from '../data/darkAges1e';

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
    secundario: 9,
    terciario: 5,
  },
  pontosDisciplinas: 4, // CANÔNICO 1ª EDIÇÃO (4 pontos para disciplinas na criação!)
  pontosAntecedentes: 5,
  pontosVirtudes: 7,
  pontosBonus: 15,
  maxPontosDefeitos: 7,
  atalhosCard: ATALHOS_CARD_PADRAO,
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
    id: 'mestre_demo',
    nome: 'Mestre Alucard',
    nick: 'alucard',
    email: 'mestre@darkages.com',
    role: 'mestre',
    senha: '123',
  },
  {
    id: 'jogador_demo',
    nome: 'Julian, o Cavaleiro',
    nick: 'julian',
    email: 'jogador@darkages.com',
    role: 'jogador',
    senha: '123',
  },
];

export const PERSONAGEM_ZERADO_MODELO: Omit<Personagem, 'id' | 'createdAt' | 'updatedAt'> = {
  usuarioId: 'mestre_demo',
  usuarioNome: 'Mestre Alucard',
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
    // Todos começam com 1 ponto base obrigatório
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
    // Talentos (10 no livro)
    representacao: 0,
    prontidao: 0,
    esportes: 0,
    briga: 0,
    esquiva: 0,
    empatia: 0,
    intimidacao: 0,
    crime: 0,
    lideranca: 0,
    labia: 0,

    // Perícias (10 no livro)
    empatiaAnimais: 0,
    arqueirismo: 0,
    artesanato: 0,
    etiqueta: 0,
    herborismo: 0,
    armasBrancas: 0,
    musica: 0,
    cavalgar: 0,
    furtividade: 0,
    sobrevivencia: 0,

    // Conhecimentos (10 no livro)
    instrucao: 0,
    sabedoriaPopular: 0,
    investigacao: 0,
    direito: 0,
    linguistica: 0,
    medicina: 0,
    ocultismo: 0,
    politica: 0,
    ciencia: 0,
    senescalia: 0,
  },
  disciplinas: [],
  antecedentes: [],
  qualidadesDefeitos: [],
  virtudes: {
    tipoConsciencia: 'consciencia',
    consciencia: 1,
    tipoAutocontrole: 'autocontrole',
    autocontrole: 1,
    coragem: 1,
  },
  caminho: 'Caminho da Humanidade',
  caminhoNivel: 2,
  forcaDeVontade: 1,
  forcaDeVontadeGasta: 0,
  pontosDeSangueMax: 11,
  pontosDeSangueAtual: 11,
  fraqueza: '',
  vitalidade: NIVEIS_VITALIDADE_PADRAO.map((n) => ({ ...n })),
  xp: {
    atual: 0,
    totalGasto: 0,
    historico: '',
  },
  armas: [
    {
      id: 'arma_espada',
      nome: 'Espada Larga',
      dificuldade: '6',
      dano: 'For+4',
      ocultacao: 'Bainha no cinto',
      alcance: 'Corpo a corpo',
    },
    {
      id: 'arma_adaga',
      nome: 'Adaga de Aço',
      dificuldade: '4',
      dano: 'For+1',
      ocultacao: 'Manga / Bota',
      alcance: 'Corpo a corpo',
    },
  ],
  armaduras: [
    {
      id: 'arm_cota',
      nome: 'Cota de Malha',
      classe: '2',
      penalidade: '-1',
    },
  ],
  lacosDeSangue: [],
  perturbacoes: [],
  linhasTaumaturgia: [],
  rituais: [],
  aparencia: {
    idade: '28 anos',
    idadeAparente: '25 anos',
    abraco: '1230 d.C.',
    cabelos: 'Negros',
    raca: 'Caucasiana',
    olhos: 'Castanhos profundos',
    sexo: 'Masculino',
    nacionalidade: 'França Medieval',
    altura: '1,80 m',
    peso: '78 kg',
  },
  biografia: {
    historia: 'Cavaleiro errante que cruzou a Europa durante as Cruzadas...',
    preludio: 'Abraçado em uma cripta sob uma catedral em ruínas.',
    objetivos: 'Proteger seu refúgio e descobrir os segredos de seu senhor.',
    notas: 'Porta um anel com o brasão de sua antiga linhagem mortal.',
  },
};

/**
 * Normaliza e sincroniza retroativamente regras canônicas da 1ª Edição (1996/Devir 1998):
 * 1. Trilha = Consciência + Autocontrole (Mínimo igual à soma, máx 10).
 * 2. Força de Vontade = Coragem (Mínimo igual à Coragem, máx 10).
 * 3. Geração e Reserva de Sangue sincronizadas com o Antecedente Geração.
 */
export function normalizarPersonagem(p: Personagem): Personagem {
  if (!p) return p;
  const copia = { ...p };

  const c = copia.virtudes?.consciencia ?? 1;
  const a = copia.virtudes?.autocontrole ?? 1;
  const cor = copia.virtudes?.coragem ?? 1;

  const trilhaEsperada = Math.min(10, Math.max(1, c + a));
  const vontadeEsperada = Math.min(10, Math.max(1, cor));

  const isEmCriacao = copia.criacao?.status === 'em_criacao';
  const isEtapaIniciais =
    copia.criacao?.etapa === 'iniciais' || copia.criacao?.etapa === 'prioridades';

  if (isEmCriacao && isEtapaIniciais) {
    if (copia.caminhoNivel !== trilhaEsperada) {
      copia.caminhoNivel = trilhaEsperada;
    }
    if (copia.forcaDeVontade !== vontadeEsperada) {
      copia.forcaDeVontade = vontadeEsperada;
    }
  } else {
    // Para fichas na etapa de bônus ou criadas anteriormente,
    // Trilha e Força de Vontade nunca podem ser menores que os valores base das virtudes
    if (!copia.caminhoNivel || copia.caminhoNivel < trilhaEsperada) {
      copia.caminhoNivel = trilhaEsperada;
    }
    if (!copia.forcaDeVontade || copia.forcaDeVontade < vontadeEsperada) {
      copia.forcaDeVontade = vontadeEsperada;
    }

    // Se estiver em modo de bônus mas ainda sem snapshot registrado (retrocompatibilidade)
    if (isEmCriacao && copia.criacao?.etapa === 'bonus' && !copia.criacao.snapshotIniciais) {
      copia.criacao.snapshotIniciais = {
        atributos: { ...copia.atributos },
        habilidades: { ...copia.habilidades },
        disciplinas: copia.disciplinas?.map((d) => ({ id: d.id, nome: d.nome, nivel: Math.min(d.nivel, 1) })),
        antecedentes: copia.antecedentes?.map((a) => ({ id: a.id, nome: a.nome, nivel: a.nivel })),
        virtudes: { ...copia.virtudes },
        forcaDeVontade: vontadeEsperada,
        caminhoNivel: trilhaEsperada,
      };
    }
  }

  // Sincronizar Antecedente Geração se presente
  if (copia.antecedentes && Array.isArray(copia.antecedentes)) {
    const antGeracao = copia.antecedentes.find(
      (ant) =>
        ant.nome.toLowerCase().trim() === 'geração' ||
        ant.nome.toLowerCase().trim() === 'geracao'
    );
    const pontos = antGeracao ? antGeracao.nivel : 0;
    const info = calcularGeracaoEpoolSangue(pontos);
    if (!copia.geracao || copia.geracao !== info.geracaoNome) {
      copia.geracao = info.geracaoNome;
    }
    if (!copia.pontosDeSangueMax || copia.pontosDeSangueMax !== info.reservaSangueMax) {
      copia.pontosDeSangueMax = info.reservaSangueMax;
    }
  } else {
    if (!copia.geracao) copia.geracao = '12ª Geração';
    if (!copia.pontosDeSangueMax || copia.pontosDeSangueMax === 10) {
      copia.pontosDeSangueMax = 11;
    }
  }

  // Migração e normalização de habilidades para o padrão oficial da 1ª Edição (Devir 1998)
  if (copia.habilidades) {
    const h = copia.habilidades as any;
    copia.habilidades = {
      // Talentos (10 no livro)
      representacao: h.representacao ?? h.expressao ?? 0,
      prontidao: h.prontidao ?? 0,
      esportes: h.esportes ?? 0,
      briga: h.briga ?? 0,
      esquiva: h.esquiva ?? 0,
      empatia: h.empatia ?? 0,
      intimidacao: h.intimidacao ?? 0,
      crime: h.crime ?? h.ladinagem ?? 0,
      lideranca: h.lideranca ?? 0,
      labia: h.labia ?? h.manha ?? 0,

      // Perícias (10 no livro)
      empatiaAnimais: h.empatiaAnimais ?? 0,
      arqueirismo: h.arqueirismo ?? h.tiroComArco ?? 0,
      artesanato: h.artesanato ?? 0,
      etiqueta: h.etiqueta ?? 0,
      herborismo: h.herborismo ?? h.herbalismo ?? 0,
      armasBrancas: h.armasBrancas ?? 0,
      musica: h.musica ?? 0,
      cavalgar: h.cavalgar ?? h.cavalaria ?? 0,
      furtividade: h.furtividade ?? 0,
      sobrevivencia: h.sobrevivencia ?? 0,

      // Conhecimentos (10 no livro)
      instrucao: h.instrucao ?? h.academicos ?? 0,
      sabedoriaPopular: h.sabedoriaPopular ?? 0,
      investigacao: h.investigacao ?? 0,
      direito: h.direito ?? 0,
      linguistica: h.linguistica ?? 0,
      medicina: h.medicina ?? 0,
      ocultismo: h.ocultismo ?? 0,
      politica: h.politica ?? 0,
      ciencia: h.ciencia ?? 0,
      senescalia: h.senescalia ?? h.senescencia ?? 0,
    };
  }

  return copia;
}

export const storageService = {
  // Configurações da Mesa
  getConfiguracaoMesa(): ConfiguracaoMesa {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) {
      return CONFIGURACAO_MESA_PADRAO;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.atalhosCard || parsed.atalhosCard.length === 0) {
        parsed.atalhosCard = ATALHOS_CARD_PADRAO;
      } else {
        // Auto-sincronizar tipos de exibição canônicos: Esquiva (unidade) e Iniciativa (d10)
        parsed.atalhosCard = parsed.atalhosCard.map((a: any) => {
          if (a.id === 'esquiva' && a.tipoExibicao === 'dados') {
            return { ...a, tipoExibicao: 'total' };
          }
          if (a.id === 'iniciativa' && a.tipoExibicao === 'total') {
            return { ...a, tipoExibicao: 'dados' };
          }
          return a;
        });
      }
      if (parsed.maxPontosDefeitos === undefined) {
        parsed.maxPontosDefeitos = 7;
      }
      // Corrige caso estivesse com 3 legado do V:TM para o canônico 4 de Dark Ages 1ª Edição
      if (parsed.pontosDisciplinas === 3) {
        parsed.pontosDisciplinas = 4;
      }
      return { ...CONFIGURACAO_MESA_PADRAO, ...parsed };
    } catch {
      return CONFIGURACAO_MESA_PADRAO;
    }
  },

  async carregarConfiguracaoMesaRemota(): Promise<ConfiguracaoMesa> {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const config = await res.json();
        if (config) {
          if (config.pontosDisciplinas === 3) {
            config.pontosDisciplinas = 4;
          }
          const mesclado = { ...CONFIGURACAO_MESA_PADRAO, ...config };
          if (mesclado.pontosDisciplinas === 3) {
            mesclado.pontosDisciplinas = 4;
          }
          if (Array.isArray(mesclado.atalhosCard)) {
            mesclado.atalhosCard = mesclado.atalhosCard.map((a: any) => {
              if (a.id === 'esquiva' && a.tipoExibicao === 'dados') {
                return { ...a, tipoExibicao: 'total' };
              }
              if (a.id === 'iniciativa' && a.tipoExibicao === 'total') {
                return { ...a, tipoExibicao: 'dados' };
              }
              return a;
            });
          }
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(mesclado));
          return mesclado;
        }
      }
    } catch {
      // Falha de rede: usa cache local
    }
    return this.getConfiguracaoMesa();
  },

  async salvarConfiguracaoMesa(config: ConfiguracaoMesa): Promise<void> {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
    } catch {
      // Ignora erro se estiver offline
    }
  },

  // Usuários e Autenticação
  getUsuarios(): User[] {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      return USUARIOS_PADRAO;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : USUARIOS_PADRAO;
    } catch {
      return USUARIOS_PADRAO;
    }
  },

  salvarUsuarioLocal(user: User): void {
    const todos = this.getUsuarios();
    const idx = todos.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      todos[idx] = user;
    } else {
      todos.push(user);
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(todos));
  },

  async login(identificador: string, senha?: string): Promise<User> {
    const clean = identificador.toLowerCase().trim();

    // 1. Tentar login direto na nuvem (Cloudflare D1) por Nick ou Email
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick: clean, senha: senha || '' }),
      });

      if (res.ok) {
        const user: User = await res.json();
        this.salvarUsuarioLocal(user);
        this.setUsuarioAtual(user);
        return user;
      } else {
        const erroJson = await res.json().catch(() => null);
        if (erroJson?.erro) {
          throw new Error(erroJson.erro);
        }
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('fetch')) {
        throw err;
      }
    }

    // 2. Fallback local se offline
    const usuarios = this.getUsuarios();
    const encontrado = usuarios.find(
      (u) =>
        (u.nick && u.nick.toLowerCase().trim() === clean) ||
        (u.email && u.email.toLowerCase().trim() === clean) ||
        u.nome.toLowerCase().trim() === clean
    );
    if (!encontrado) {
      throw new Error('Nick não encontrado ou credenciais inválidas.');
    }
    if (encontrado.senha && senha && encontrado.senha !== senha) {
      throw new Error('Senha incorreta.');
    }
    this.setUsuarioAtual(encontrado);
    return encontrado;
  },

  async cadastrar(
    nome: string,
    nick: string,
    senha?: string,
    role: UserRole = 'jogador',
    email?: string
  ): Promise<User> {
    const cleanNick = nick.toLowerCase().trim().replace(/\s+/g, '');

    // 1. Tentar cadastro na nuvem (Cloudflare D1)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          nick: cleanNick,
          senha: senha || '123',
          role,
          email: email || '',
        }),
      });

      if (res.ok) {
        const novo: User = await res.json();
        this.salvarUsuarioLocal(novo);
        this.setUsuarioAtual(novo);
        return novo;
      } else {
        const erroJson = await res.json().catch(() => null);
        throw new Error(erroJson?.erro || 'Erro ao registrar usuário no servidor.');
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes('fetch')) {
        throw err;
      }
      // Fallback local se estiver offline
      const usuarios = this.getUsuarios();
      if (usuarios.some((u) => u.nick && u.nick.toLowerCase() === cleanNick)) {
        throw new Error('Já existe um jogador com este Nick no cache local.');
      }
      if (role === 'mestre' && usuarios.some((u) => u.role === 'mestre')) {
        throw new Error('A Crônica já possui um Mestre ativo. Só pode haver 1 único Mestre no sistema.');
      }
      const novo: User = {
        id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5),
        nome: nome.trim(),
        nick: cleanNick,
        email: email || `${cleanNick}@darkages.local`,
        role,
        senha: senha || '123',
      };
      this.salvarUsuarioLocal(novo);
      this.setUsuarioAtual(novo);
      return novo;
    }
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

  async recuperarSenha(identificador: string, novaSenha: string): Promise<string> {
    const clean = identificador.toLowerCase().trim();
    try {
      const res = await fetch('/api/auth/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick: clean, novaSenha }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.erro || 'Falha ao redefinir senha.');
      }
      return data.mensagem || 'Senha redefinida com sucesso!';
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error('Erro ao se comunicar com o servidor.');
    }
  },

  async buscarLogin(nome: string): Promise<Array<{ nome: string; nick: string; email?: string; role: string }>> {
    try {
      const res = await fetch('/api/auth/buscar-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim() }),
      });
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch {
      return [];
    }
  },

  async excluirUsuario(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Limpar do cache local
        const todos = this.getUsuarios().filter((u) => u.id !== id);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(todos));
        // Limpar personagens desse usuário
        const personagens = this.getPersonagens().filter((p) => p.usuarioId !== id);
        localStorage.setItem(STORAGE_KEY_PERSONAGENS, JSON.stringify(personagens));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  async checarStatusMestre(): Promise<{ temMestre: boolean; mestreNome?: string; mestreNick?: string }> {
    try {
      const res = await fetch('/api/auth/status-mestre');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Ignora erro de rede e cai no local
    }
    const localMestre = this.getUsuarios().find((u) => u.role === 'mestre');
    return {
      temMestre: Boolean(localMestre),
      mestreNome: localMestre?.nome,
      mestreNick: localMestre?.nick,
    };
  },

  async transferirMestre(
    mestreAtualId: string,
    novoMestreId: string
  ): Promise<{ success: boolean; mensagem: string }> {
    try {
      const res = await fetch('/api/usuarios/transferir-mestre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mestreAtualId, novoMestreId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.erro || 'Falha ao transferir privilégios de Mestre.');
      }

      // Atualizar cache local
      const usuarios = this.getUsuarios().map((u) => {
        if (u.id === mestreAtualId) return { ...u, role: 'jogador' as UserRole };
        if (u.id === novoMestreId) return { ...u, role: 'mestre' as UserRole };
        return u;
      });
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usuarios));

      // Se o usuário logado for o mestre antigo, atualiza seu auth para jogador
      const atual = this.getUsuarioAtual();
      if (atual && atual.id === mestreAtualId) {
        this.setUsuarioAtual({ ...atual, role: 'jogador' });
      }

      return { success: true, mensagem: data.mensagem };
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error('Erro ao se comunicar com o servidor.');
    }
  },

  async registrarLogAlteracao(log: {
    personagemId: string;
    personagemNome: string;
    jogadorNome: string;
    tipo: 'xp' | 'atributo' | 'habilidade' | 'sangue' | 'vitalidade' | 'disciplina' | 'vontade' | 'caminho' | 'geral';
    descricao: string;
    detalhes?: string;
  }): Promise<void> {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
    } catch {
      // offline / silently ignored
    }
  },

  async carregarLogs(): Promise<LogAlteracao[]> {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch {
      return [];
    }
  },

  async limparLogs(): Promise<void> {
    try {
      await fetch('/api/logs', { method: 'DELETE' });
    } catch {
      // offline
    }
  },

  // Personagens (Sincronização em Nuvem e Cache Local)
  getPersonagens(): Personagem[] {
    const raw = localStorage.getItem(STORAGE_KEY_PERSONAGENS);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      let precisouSalvar = false;
      const normalizados = parsed.map((p: Personagem) => {
        const norm = normalizarPersonagem(p);
        if (
          norm.caminhoNivel !== p.caminhoNivel ||
          norm.forcaDeVontade !== p.forcaDeVontade ||
          norm.pontosDeSangueMax !== p.pontosDeSangueMax
        ) {
          precisouSalvar = true;
        }
        return norm;
      });
      if (precisouSalvar) {
        localStorage.setItem(STORAGE_KEY_PERSONAGENS, JSON.stringify(normalizados));
      }
      return normalizados;
    } catch {
      return [];
    }
  },

  async sincronizarPersonagensRemotos(user: User): Promise<Personagem[]> {
    try {
      const res = await fetch(`/api/personagens?usuarioId=${user.id}&role=${user.role}`);
      if (res.ok) {
        const remotos: Personagem[] = await res.json();
        if (Array.isArray(remotos)) {
          const normalizados = remotos.map(normalizarPersonagem);
          localStorage.setItem(STORAGE_KEY_PERSONAGENS, JSON.stringify(normalizados));

          // Se algum personagem remoto estava desatualizado no Cloudflare D1, atualiza no D1
          normalizados.forEach(async (p, idx) => {
            const original = remotos[idx];
            if (
              p.caminhoNivel !== original.caminhoNivel ||
              p.forcaDeVontade !== original.forcaDeVontade ||
              p.pontosDeSangueMax !== original.pontosDeSangueMax
            ) {
              try {
                await fetch('/api/personagens', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(p),
                });
              } catch {}
            }
          });

          return normalizados;
        }
      }
    } catch {
      // Ignora erro e cai para os locais
    }
    return this.getPersonagensDoUsuario(user);
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
    const p = todos.find((item) => item.id === id) ?? null;
    return p ? normalizarPersonagem(p) : null;
  },

  async salvarPersonagem(personagem: Personagem): Promise<void> {
    const todos = this.getPersonagens();
    const idx = todos.findIndex((p) => p.id === personagem.id);
    const anterior = idx >= 0 ? todos[idx] : null;
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

    // Detectar alterações importantes para registrar log em tempo real para o Mestre
    if (anterior) {
      if (anterior.pontosDeSangueAtual !== atualizado.pontosDeSangueAtual) {
        this.registrarLogAlteracao({
          personagemId: atualizado.id,
          personagemNome: atualizado.nome,
          jogadorNome: atualizado.jogador || atualizado.usuarioNome,
          tipo: 'sangue',
          descricao: `Reserva de Sangue alterada: ${anterior.pontosDeSangueAtual} → ${atualizado.pontosDeSangueAtual} (Máx: ${atualizado.pontosDeSangueMax})`,
        });
      }
      if (anterior.forcaDeVontadeGasta !== atualizado.forcaDeVontadeGasta) {
        const restoAnt = anterior.forcaDeVontade - (anterior.forcaDeVontadeGasta || 0);
        const restoAtu = atualizado.forcaDeVontade - (atualizado.forcaDeVontadeGasta || 0);
        this.registrarLogAlteracao({
          personagemId: atualizado.id,
          personagemNome: atualizado.nome,
          jogadorNome: atualizado.jogador || atualizado.usuarioNome,
          tipo: 'vontade',
          descricao: `Força de Vontade modificada: Restam ${restoAtu}/${atualizado.forcaDeVontade} (anterior: ${restoAnt})`,
        });
      }
      const danosAnt = anterior.vitalidade.filter((v) => v.dano !== 'nenhum').length;
      const danosAtu = atualizado.vitalidade.filter((v) => v.dano !== 'nenhum').length;
      if (danosAnt !== danosAtu) {
        this.registrarLogAlteracao({
          personagemId: atualizado.id,
          personagemNome: atualizado.nome,
          jogadorNome: atualizado.jogador || atualizado.usuarioNome,
          tipo: 'vitalidade',
          descricao: `Níveis de Vitalidade alterados: ${danosAtu} caixas de dano marcadas`,
        });
      }
    } else {
      this.registrarLogAlteracao({
        personagemId: atualizado.id,
        personagemNome: atualizado.nome,
        jogadorNome: atualizado.jogador || atualizado.usuarioNome,
        tipo: 'geral',
        descricao: `Nova ficha criada na crônica: ${atualizado.nome} (${atualizado.cla || 'Sem Clã'})`,
      });
    }

    // Sincronizar com Cloudflare D1 em segundo plano
    try {
      await fetch('/api/personagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atualizado),
      });
    } catch {
      // Fica gravado no cache local se estiver offline
    }
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

  async excluirPersonagem(id: string): Promise<boolean> {
    const todos = this.getPersonagens();
    const filtrados = todos.filter((p) => p.id !== id);
    if (filtrados.length !== todos.length) {
      localStorage.setItem(STORAGE_KEY_PERSONAGENS, JSON.stringify(filtrados));
    }

    try {
      await fetch(`/api/personagens/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return true;
    }
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
