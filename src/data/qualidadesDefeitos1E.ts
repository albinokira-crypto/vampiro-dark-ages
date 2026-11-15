/**
 * Catálogo Oficial de Qualidades e Defeitos - Vampiro: A Idade das Trevas (Livro Devir 1998)
 * Disponíveis exclusivamente durante a criação de personagens.
 */

export interface ModeloQualidadeDefeito {
  nome: string;
  tipo: 'qualidade' | 'defeito';
  categoria: 'fisico' | 'mental' | 'social' | 'sobrenatural';
  pontos: number;
  descricao: string;
}

export const QUALIDADES_DEFEITOS_1E: ModeloQualidadeDefeito[] = [
  // ==================== FÍSICOS: QUALIDADES ====================
  {
    nome: 'Sentidos Aguçados',
    tipo: 'qualidade',
    categoria: 'fisico',
    pontos: 1,
    descricao: 'Um dos seus cinco sentidos é excepcionalmente nítido; reduz a dificuldade de percepção desse sentido em 2.',
  },
  {
    nome: 'Ambidestria',
    tipo: 'qualidade',
    categoria: 'fisico',
    pontos: 1,
    descricao: 'Capaz de usar ambas as mãos com igual destreza, sem penalidade de mão inábil.',
  },
  {
    nome: 'Sono Leve',
    tipo: 'qualidade',
    categoria: 'fisico',
    pontos: 1,
    descricao: 'Desperta imediatamente e em alerta pleno ao menor sinal de perigo diurno.',
  },
  {
    nome: 'Ingerir Comida',
    tipo: 'qualidade',
    categoria: 'fisico',
    pontos: 1,
    descricao: 'Capaz de engolir comida mortal e fingir refeições sem vomitar de imediato.',
  },
  {
    nome: 'Mordida Indolor',
    tipo: 'qualidade',
    categoria: 'fisico',
    pontos: 1,
    descricao: 'Sua mordida e o beijo provocam êxtase sereno sem dor ou marcas evidentes de ferimento.',
  },
  {
    nome: 'Digestão Eficiente',
    tipo: 'qualidade',
    categoria: 'fisico',
    pontos: 3,
    descricao: 'Extrai mais sustento do sangue: a cada 2 pontos de sangue consumidos, ganha 3.',
  },
  {
    nome: 'Corpo Grande',
    tipo: 'qualidade',
    categoria: 'fisico',
    pontos: 4,
    descricao: 'Estatura imensa (mais de 2 metros); recebe uma caixa de Vitalidade extra do nível Escoriado.',
  },

  // ==================== FÍSICOS: DEFEITOS ====================
  {
    nome: 'Mau Olfato / Sem Paladar',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 1,
    descricao: 'Incapaz de distinguir cheiros ou sabores; falha automática em testes olfativos.',
  },
  {
    nome: 'Baixa Estatura',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 1,
    descricao: 'Tamanho consideravelmente abaixo da média; velocidade de corrida reduzida e -1 em perseguições.',
  },
  {
    nome: 'Deficiência Visual (Miopia)',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 1,
    descricao: '+2 na dificuldade para todas as jogadas que dependem exclusivamente da visão.',
  },
  {
    nome: 'Deficiência Auditiva',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 1,
    descricao: 'Audição comprometida; +2 na dificuldade em testes de Percepção auditivos.',
  },
  {
    nome: 'Desfigurado',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 2,
    descricao: 'Cicatrizes brutais ou ferimentos graves reduzem a sua Aparência para no máximo 2.',
  },
  {
    nome: 'Caolho',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 2,
    descricao: 'Perda de um dos olhos; +2 na dificuldade em ataques à distância e profundidade.',
  },
  {
    nome: 'Membro Deformado ou Manco',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 3,
    descricao: 'Um braço ou perna atrofiado; penalidades severas de mobilidade e corrida.',
  },
  {
    nome: 'Monstruoso',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 3,
    descricao: 'Aparência hedionda de pesadelo (Aparência 0 compulsória para não-Nosferatu).',
  },
  {
    nome: 'Mudo',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 4,
    descricao: 'Incapaz de emitir voz ou palavras; comunica-se apenas por gestos ou escrita.',
  },
  {
    nome: 'Cego',
    tipo: 'defeito',
    categoria: 'fisico',
    pontos: 6,
    descricao: 'Cegueira completa; todas as ações baseadas na visão tornam-se impossíveis ou sofrem +4 na dificuldade.',
  },

  // ==================== MENTAIS: QUALIDADES ====================
  {
    nome: 'Bom Senso',
    tipo: 'qualidade',
    categoria: 'mental',
    pontos: 1,
    descricao: 'O Narrador avisa o jogador quando seu personagem está prestes a cometer uma tolice evidente.',
  },
  {
    nome: 'Concentração',
    tipo: 'qualidade',
    categoria: 'mental',
    pontos: 1,
    descricao: 'Ignora penalidades de distração externa e ambientes caóticos.',
  },
  {
    nome: 'Memória Eidética',
    tipo: 'qualidade',
    categoria: 'mental',
    pontos: 2,
    descricao: 'Lembrança perfeita de cenas, rostos, textos e detalhes vistos anteriormente.',
  },
  {
    nome: 'Mente Calma',
    tipo: 'qualidade',
    categoria: 'mental',
    pontos: 3,
    descricao: 'Duas dificuldades a menos para resistir a insultos e testes de autocontrole.',
  },
  {
    nome: 'Vontade de Ferro',
    tipo: 'qualidade',
    categoria: 'mental',
    pontos: 3,
    descricao: 'Imune a Dominação quando gasta um ponto de Força de Vontade; +3 dados contra feitiços mentais.',
  },

  // ==================== MENTAIS: DEFEITOS ====================
  {
    nome: 'Pesadelos',
    tipo: 'defeito',
    categoria: 'mental',
    pontos: 1,
    descricao: 'Tormentos durante o sono diurno; noites de sobressalto podem impedir a recuperação plena.',
  },
  {
    nome: 'Fobia Leve',
    tipo: 'defeito',
    categoria: 'mental',
    pontos: 1,
    descricao: 'Pavor irracional de algum objeto, criatura ou situação comum (aranhas, altura, mar profundo).',
  },
  {
    nome: 'Timidez',
    tipo: 'defeito',
    categoria: 'mental',
    pontos: 1,
    descricao: 'Dificuldade extrema em lidar com estranhos; +1 em testes de interação social pública.',
  },
  {
    nome: 'Cabeça Quente',
    tipo: 'defeito',
    categoria: 'mental',
    pontos: 2,
    descricao: 'Fácil de provocar; +2 na dificuldade para resistir ao Frenesi sob provocação.',
  },
  {
    nome: 'Vingativo',
    tipo: 'defeito',
    categoria: 'mental',
    pontos: 2,
    descricao: 'Nunca esquece um ultraje e coloca a vingança pessoal acima da própria segurança.',
  },
  {
    nome: 'Amnésia',
    tipo: 'defeito',
    categoria: 'mental',
    pontos: 2,
    descricao: 'Sem recordação da vida mortal anterior ao Abraço e de quem realizou a transformação.',
  },
  {
    nome: 'Objetivo Condutor',
    tipo: 'defeito',
    categoria: 'mental',
    pontos: 2,
    descricao: 'Você tem uma meta pessoal e obsessiva que direciona suas ações. Deve gastar Força de Vontade para ignorar oportunidades de avançar nesse objetivo, mesmo sob perigo iminente.',
  },
  {
    nome: 'Excesso de Confiança',
    tipo: 'defeito',
    categoria: 'mental',
    pontos: 1,
    descricao: 'Acredita piamente que nunca pode ser derrotado, subestimando inimigos mortais e sobrenaturais.',
  },

  // ==================== SOCIAIS: QUALIDADES ====================
  {
    nome: 'Prestígio do Clã',
    tipo: 'qualidade',
    categoria: 'social',
    pontos: 1,
    descricao: 'Reconhecimento e honra entre os membros do seu próprio clã na região.',
  },
  {
    nome: 'Amizade Nobre',
    tipo: 'qualidade',
    categoria: 'social',
    pontos: 2,
    descricao: 'Um nobre mortal ou senhor de feudo tem laços de amizade e dívida para com você.',
  },
  {
    nome: 'Respeitado',
    tipo: 'qualidade',
    categoria: 'social',
    pontos: 2,
    descricao: 'Visto como honrado e leal perante os príncipes e nobres cainitas da região.',
  },
  {
    nome: 'Débito de Gratidão',
    tipo: 'qualidade',
    categoria: 'social',
    pontos: 2,
    descricao: 'Um cainita poderoso deve-lhe um favor substancial por atos passados.',
  },

  // ==================== SOCIAIS: DEFEITOS ====================
  {
    nome: 'Má Reputação',
    tipo: 'defeito',
    categoria: 'social',
    pontos: 1,
    descricao: 'Fama negativa precede seus passos; desconfiança em cortes e praças.',
  },
  {
    nome: 'Senhor Odiado',
    tipo: 'defeito',
    categoria: 'social',
    pontos: 2,
    descricao: 'Seu Criador cometeu graves crimes e a culpa recai injustamente sobre você.',
  },
  {
    nome: 'Inimizade de Clã',
    tipo: 'defeito',
    categoria: 'social',
    pontos: 2,
    descricao: 'Um clã inteiro da região nutre aversão e desprezo por suas ações.',
  },
  {
    nome: 'Caçado pela Inquisição / Caçadores',
    tipo: 'defeito',
    categoria: 'social',
    pontos: 3,
    descricao: 'Inquisidores ou cavaleiros fanáticos têm seu rastro e juraram destruí-lo.',
  },
  {
    nome: 'Segredo Obscuro',
    tipo: 'defeito',
    categoria: 'social',
    pontos: 2,
    descricao: 'Guarda um segredo vergonhoso ou herético que se revelado destruiria seu status.',
  },

  // ==================== SOBRENATURAIS: QUALIDADES ====================
  {
    nome: 'Médium',
    tipo: 'qualidade',
    categoria: 'sobrenatural',
    pontos: 1,
    descricao: 'Sensibilidade inata para perceber aparições e fantasmas dos mortos.',
  },
  {
    nome: 'Resistência à Magia',
    tipo: 'qualidade',
    categoria: 'sobrenatural',
    pontos: 2,
    descricao: '+2 na dificuldade de rituais e magias taumatúrgicas lançadas contra você.',
  },
  {
    nome: 'Sangue Potente',
    tipo: 'qualidade',
    categoria: 'sobrenatural',
    pontos: 3,
    descricao: 'Sua Vitae é excepcionalmente rica, equivalendo a 1 geração inferior para uso de sangue.',
  },
  {
    nome: 'Bênção Divina / Aura Sagrada',
    tipo: 'qualidade',
    categoria: 'sobrenatural',
    pontos: 4,
    descricao: 'Apesar de cainita, mantém resquícios de graça santa; reduz dano de símbolos sagrados.',
  },

  // ==================== SOBRENATURAIS: DEFEITOS ====================
  {
    nome: 'Presas Evidentes',
    tipo: 'defeito',
    categoria: 'sobrenatural',
    pontos: 1,
    descricao: 'Suas presas não retraem completamente, arriscando quebrar o silêncio entre mortais.',
  },
  {
    nome: 'Presença Sinistra',
    tipo: 'defeito',
    categoria: 'sobrenatural',
    pontos: 2,
    descricao: 'Os mortais sentem calafrios inexplicáveis e desconforto imediato ao seu redor.',
  },
  {
    nome: 'Toque da Morte',
    tipo: 'defeito',
    categoria: 'sobrenatural',
    pontos: 2,
    descricao: 'Plantas murcham e o leite azeda ao seu toque prolongado.',
  },
  {
    nome: 'Sombra Monstruosa',
    tipo: 'defeito',
    categoria: 'sobrenatural',
    pontos: 2,
    descricao: 'Sua sombra projeta formas demoníacas ou animalescas à luz de tochas e velas.',
  },
  {
    nome: 'Repelido por Cruzes e Fé Verdadeira',
    tipo: 'defeito',
    categoria: 'sobrenatural',
    pontos: 2,
    descricao: 'Não consegue se aproximar de igrejas consagradas ou pessoas com Fé Verdadeira.',
  },
  {
    nome: 'Vulnerabilidade à Prata',
    tipo: 'defeito',
    categoria: 'sobrenatural',
    pontos: 2,
    descricao: 'O toque de prata queima como fogo e causa dano agravado.',
  },
  {
    nome: 'Amaldiçoado',
    tipo: 'defeito',
    categoria: 'sobrenatural',
    pontos: 3,
    descricao: 'Alvo de uma maldição ancestral que atrai desgraças e infortúnios pontuais.',
  },
];
