export type TemaSistemaId =
  | 'gotico'
  | 'pb_escuro'
  | 'pb_claro'
  | 'sepia_papel'
  | 'ardosia_azul';

export interface TemaSistemaInfo {
  id: TemaSistemaId;
  nome: string;
  subtitulo: string;
  tagAcessibilidade?: string;
  descricao: string;
  preview: {
    pageBg: string;
    cardBg: string;
    cardBorder: string;
    inputBg: string;
    inputText: string;
    inputBorder: string;
    textMain: string;
    textMuted: string;
    btnBg: string;
    btnText: string;
    dotFilled: string;
    dotEmptyBorder: string;
  };
}

export const STORAGE_KEY_TEMA = 'vampiro_dark_ages_tema_v1';
export const EVENTO_MUDANCA_TEMA = 'vda-tema-change';

export const TEMAS_SISTEMA: TemaSistemaInfo[] = [
  {
    id: 'gotico',
    nome: 'Gótico Clássico (Padrão)',
    subtitulo: 'Obsidiana, Carmesim e Ouro Velho',
    descricao:
      'Visual original do sistema de Vampiro: A Idade das Trevas com contraste medieval escuro.',
    preview: {
      pageBg: '#070506',
      cardBg: '#140e11',
      cardBorder: '#522228',
      inputBg: '#1e1317',
      inputText: '#ded6cb',
      inputBorder: '#522228',
      textMain: '#d4af37',
      textMuted: '#a89f91',
      btnBg: '#8b0000',
      btnText: '#ffffff',
      dotFilled: '#991b1b',
      dotEmptyBorder: '#4a3d42',
    },
  },
  {
    id: 'pb_escuro',
    nome: 'Preto & Branco — Alto Contraste Escuro',
    subtitulo: 'Monocromático Escuro Sem Vermelho',
    tagAcessibilidade: 'Recomendado • Fotofobia / Vista Sensível',
    descricao:
      'Fundo carvão fosco com letras brancas e prateadas nítidas. Elimina totalmente o vermelho e o brilho cansativo sem ofuscar.',
    preview: {
      pageBg: '#0a0a0c',
      cardBg: '#141417',
      cardBorder: '#52525b',
      inputBg: '#1a1a1f',
      inputText: '#ffffff',
      inputBorder: '#71717a',
      textMain: '#ffffff',
      textMuted: '#d4d4d8',
      btnBg: '#27272a',
      btnText: '#ffffff',
      dotFilled: '#f4f4f5',
      dotEmptyBorder: '#71717a',
    },
  },
  {
    id: 'pb_claro',
    nome: 'Preto & Branco — Papel Claro',
    subtitulo: 'Letra Preta em Fundo Papel Suave',
    tagAcessibilidade: 'Recomendado • Astigmatismo / Leitura Diurna',
    descricao:
      'Estilo ficha impressa em preto no branco fosco (anti-ofuscamento), com caixas de texto brancas de contorno forte e letras pretas.',
    preview: {
      pageBg: '#eaeae6',
      cardBg: '#ffffff',
      cardBorder: '#71717a',
      inputBg: '#ffffff',
      inputText: '#111111',
      inputBorder: '#52525b',
      textMain: '#111111',
      textMuted: '#3f3f46',
      btnBg: '#18181b',
      btnText: '#ffffff',
      dotFilled: '#18181b',
      dotEmptyBorder: '#52525b',
    },
  },
  {
    id: 'sepia_papel',
    nome: 'Pergaminho Sépia (Leitura Suave)',
    subtitulo: 'Creme Morno & Tinta Café Escuro',
    tagAcessibilidade: 'Conforto Ocular • Sem Luz Azul',
    descricao:
      'Tom de pergaminho claro tipo e-reader que reduz o brilho da tela branca pura e evita cansaço em sessões longas.',
    preview: {
      pageBg: '#e8dcc8',
      cardBg: '#faf4e8',
      cardBorder: '#9c8465',
      inputBg: '#fffdf8',
      inputText: '#24160e',
      inputBorder: '#8c7557',
      textMain: '#24160e',
      textMuted: '#574330',
      btnBg: '#3b2216',
      btnText: '#fffaf0',
      dotFilled: '#3b2216',
      dotEmptyBorder: '#8c7557',
    },
  },
  {
    id: 'ardosia_azul',
    nome: 'Azul Noturno Confortável',
    subtitulo: 'Ardósia Calma Sem Tons Vermelhos',
    tagAcessibilidade: 'Sem Vermelho • Baixa Tensão Visual',
    descricao:
      'Substitui os tons carmesim por azul noturno suave e branco-gelo, oferecendo excelente leitura com baixo contraste agressivo.',
    preview: {
      pageBg: '#0b1320',
      cardBg: '#131f30',
      cardBorder: '#3b5270',
      inputBg: '#162438',
      inputText: '#f1f5f9',
      inputBorder: '#476487',
      textMain: '#7dd3fc',
      textMuted: '#cbd5e1',
      btnBg: '#1d4ed8',
      btnText: '#ffffff',
      dotFilled: '#38bdf8',
      dotEmptyBorder: '#476487',
    },
  },
];

export function isTemaValido(valor: string | null): valor is TemaSistemaId {
  return TEMAS_SISTEMA.some((t) => t.id === valor);
}

export function getTemaSalvo(): TemaSistemaId {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY_TEMA);
    if (isTemaValido(salvo)) {
      return salvo;
    }
  } catch {
    // Fallback padrão
  }
  return 'gotico';
}

export function aplicarTema(temaId: TemaSistemaId): void {
  const finalId: TemaSistemaId = isTemaValido(temaId) ? temaId : 'gotico';
  try {
    localStorage.setItem(STORAGE_KEY_TEMA, finalId);
  } catch {
    // Ignorar indisponibilidade de storage
  }

  if (typeof document !== 'undefined') {
    if (finalId === 'gotico') {
      document.documentElement.removeAttribute('data-tema');
    } else {
      document.documentElement.setAttribute('data-tema', finalId);
    }

    const temaLight = finalId === 'pb_claro' || finalId === 'sepia_papel';
    document.documentElement.style.colorScheme = temaLight ? 'light' : 'dark';

    window.dispatchEvent(
      new CustomEvent(EVENTO_MUDANCA_TEMA, { detail: finalId })
    );
  }
}
