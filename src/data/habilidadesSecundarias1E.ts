export interface SugestaoHabilidadeSecundaria {
  nome: string;
  categoria: 'talento' | 'pericia' | 'conhecimento';
  descricao: string;
  atributoSugerido?: string;
}

export const SUGESTOES_HABILIDADES_SECUNDARIAS_1E: SugestaoHabilidadeSecundaria[] = [
  // TALENTOS SECUNDÁRIOS
  {
    nome: 'Saque Rápido',
    categoria: 'talento',
    descricao: 'Capacidade de desembainhar espadas, adagas ou preparar armas instantaneamente em combate antes do adversário.',
    atributoSugerido: 'Destreza',
  },
  {
    nome: 'Graça',
    categoria: 'talento',
    descricao: 'Elegância natural em movimentos, postura nobre e compostura sob os olhares da alta corte feudal.',
    atributoSugerido: 'Aparência / Destreza',
  },
  {
    nome: 'Interrogatório',
    categoria: 'talento',
    descricao: 'Arte de extrair informações, confissões e segredos através de pressão psicológica e intimidação velada.',
    atributoSugerido: 'Manipulação',
  },
  {
    nome: 'Sedução',
    categoria: 'talento',
    descricao: 'Fascínio e atração carnal ou romântica para dobrar vontades mortais e cainitas.',
    atributoSugerido: 'Carisma / Aparência',
  },
  {
    nome: 'Provocação',
    categoria: 'talento',
    descricao: 'Habilidade de enfurecer o oponente, induzindo erros táticos ou forçando testes de Frenesi por insultos calculados.',
    atributoSugerido: 'Manipulação',
  },
  {
    nome: 'Luta às Cegas',
    categoria: 'talento',
    descricao: 'Combater no escuro total, neblina ou cegado, guiando-se pela audição e instinto sobrenatural.',
    atributoSugerido: 'Percepção',
  },
  {
    nome: 'Intuição',
    categoria: 'talento',
    descricao: 'Pressentimentos e leitura rápida de intenções hostis ocultas nas sombras medievais.',
    atributoSugerido: 'Percepção',
  },
  {
    nome: 'Arremesso',
    categoria: 'talento',
    descricao: 'Precisão e força ao arremessar facas, machadinhas, lanças ou tochas em combate.',
    atributoSugerido: 'Destreza',
  },
  {
    nome: 'Sentido de Orientação',
    categoria: 'talento',
    descricao: 'Nunca perder o rumo em labirintos de catacumbas, florestas fechadas ou estradas escuras.',
    atributoSugerido: 'Percepção',
  },

  // PERÍCIAS SECUNDÁRIAS
  {
    nome: 'Artesanato Corporal',
    categoria: 'pericia',
    descricao: 'Esculpir, moldar e suturar ossos, pele e carne. Perícia indispensável para praticantes da Disciplina Vicissitude (Clã Tzimisce).',
    atributoSugerido: 'Destreza / Inteligência',
  },
  {
    nome: 'Falcoaria',
    categoria: 'pericia',
    descricao: 'Treinamento, caça e comunicação com falcões, gaviões e aves de rapina na Idade Média.',
    atributoSugerido: 'Empatia c/ Animais',
  },
  {
    nome: 'Arrombamento',
    categoria: 'pericia',
    descricao: 'Abertura de fechaduras medievais, cofres arcaicos e portas trancadas com ganzas rudimentares.',
    atributoSugerido: 'Destreza',
  },
  {
    nome: 'Dança',
    categoria: 'pericia',
    descricao: 'Execução de danças palacianas, bailes medievais e coreografias sociais em festejos nobres e Elísios.',
    atributoSugerido: 'Destreza / Carisma',
  },
  {
    nome: 'Tortura',
    categoria: 'pericia',
    descricao: 'Aplicação metódica de dor física para arrancar confissões sem matar prematuramente a vítima.',
    atributoSugerido: 'Inteligência / Manipulação',
  },
  {
    nome: 'Camuflagem',
    categoria: 'pericia',
    descricao: 'Ocultar-se na vegetação, ruínas medievais ou túmulos usando elementos do próprio ambiente.',
    atributoSugerido: 'Raciocínio',
  },
  {
    nome: 'Avaliação',
    categoria: 'pericia',
    descricao: 'Determinar a autenticidade, qualidade e valor comercial de joias, armas nobres, relíquias e obras de arte.',
    atributoSugerido: 'Percepção',
  },
  {
    nome: 'Ferraria',
    categoria: 'pericia',
    descricao: 'Forjar e reparar armas de aço, armaduras de placas e malhas, ferraduras e implementos medievais.',
    atributoSugerido: 'Força / Destreza',
  },
  {
    nome: 'Armadilhas',
    categoria: 'pericia',
    descricao: 'Construção e desarme de fossos pontiagudos, laços, alçapões e ciladas nas matas ou masmorras.',
    atributoSugerido: 'Destreza / Raciocínio',
  },
  {
    nome: 'Justa & Combate Montado',
    categoria: 'pericia',
    descricao: 'Técnicas especializadas de carga com lança de cavalaria e manobras ofensivas montadas.',
    atributoSugerido: 'Destreza',
  },
  {
    nome: 'Navegação Fluvial & Marítima',
    categoria: 'pericia',
    descricao: 'Conduzir embarcações medievais, ler correntes fluviais e ventos noturnos.',
    atributoSugerido: 'Raciocínio',
  },

  // CONHECIMENTOS SECUNDÁRIOS
  {
    nome: 'Heráldica',
    categoria: 'conhecimento',
    descricao: 'Reconhecimento de brasões nobres, linhagens dinásticas feudais, ordens de cavalaria e casas reais.',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'Teologia',
    categoria: 'conhecimento',
    descricao: 'Conhecimento profundo das Escrituras, doutrinas católicas, cismas ortodoxos, teologia islâmica e heresias medievais.',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'Alquimia',
    categoria: 'conhecimento',
    descricao: 'Estudo de transmutação de metais, destilação de ácidos, elixires herméticos e pólvoras primitivas.',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'Filosofia',
    categoria: 'conhecimento',
    descricao: 'Domínio da filosofia clássica greco-romana e escolástica medieval (Aristóteles, Platão, Santo Agostinho).',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'Astronomia / Astrologia',
    categoria: 'conhecimento',
    descricao: 'Mapeamento de constelações celestes, conjunções astrais e horóscopos medievais.',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'Venenos & Toxinas',
    categoria: 'conhecimento',
    descricao: 'Identificação, extração e dosagem letal de venenos vegetais (cicuta, beladona) e animais.',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'Direito Canônico',
    categoria: 'conhecimento',
    descricao: 'Leis da Igreja, decretos papais e jurisprudência dos tribunais eclesiásticos e inquisitoriais.',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'Genealogia Cainita',
    categoria: 'conhecimento',
    descricao: 'Rastreamento de senhores, progênies e linhagens dos 13 Clãs a partir de Enoque e da Segunda Geração.',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'Demonologia & Angelologia',
    categoria: 'conhecimento',
    descricao: 'Estudo dos nomes, hierarquias e ritos de invocação de espíritos infernais e celestiais.',
    atributoSugerido: 'Inteligência',
  },
  {
    nome: 'História & Crônicas Antigas',
    categoria: 'conhecimento',
    descricao: 'Conhecimento das grandes guerras feudais, queda de Roma, impérios bizantino e islâmico.',
    atributoSugerido: 'Inteligência',
  },
];
