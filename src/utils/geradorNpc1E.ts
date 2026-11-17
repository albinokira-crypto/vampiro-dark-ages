import type {
  Personagem,
  User,
  Arma,
  Armadura,
  ItemSimplesNivel,
  QualidadeDefeitoItem,
  CatalogoArmaItem,
  CatalogoArmaduraItem,
} from '../types';
import {
  CLAS_DARK_AGES_1E,
  DISCIPLINAS_LIVRO_1E,
  ARQUETIPOS_PERSONALIDADE_1E,
  TABELA_GERACAO_1E,
} from '../data/darkAges1e';
import { QUALIDADES_DEFEITOS_1E } from '../data/qualidadesDefeitos1E';
import { NIVEIS_VITALIDADE_PADRAO, ajustarVitalidadeCorpoGrande } from '../services/storage';
import { ARMAS_CATALOGO_1E, ARMADURAS_CATALOGO_1E } from '../data/combate1E';

export type ArquetipoNpc =
  | 'aleatorio'
  | 'cavaleiro'
  | 'assassino'
  | 'nobre'
  | 'ocultista'
  | 'inquisidor'
  | 'cacador'
  | 'cortesao'
  | 'senescal'
  | 'guarda_elite';

export type OrigemMedieval =
  | 'aleatoria'
  | 'franca'
  | 'germania'
  | 'italia'
  | 'iberia'
  | 'inglaterra'
  | 'bizancio'
  | 'leste_europeu'
  | 'oriente_medio';

export interface RequisitosGeradorNpc {
  geracaoNum: number; // 12 até 4
  cla: string; // 'aleatorio' ou nome do clã
  arquetipo: ArquetipoNpc;
  foco: 'equilibrado' | 'fisico' | 'social' | 'mental';
  genero: 'aleatorio' | 'masculino' | 'feminino';
  origem: OrigemMedieval;
  nomePersonalizado?: string;
  tituloPersonalizado?: string;
  incluirEquipamento: boolean;
  incluirQualidadesDefeitos: boolean;
  incluirDisciplinasExtras: boolean;
}

export interface InfoPatamarGeracao {
  geracaoNum: number;
  pontosAntecedente: number;
  patamar: string;
  maxTraco: number;
  sangueMax: number;
  sanguePorTurno: number;
  atributosExtras: number;
  habilidadesPontos: number;
  disciplinasPontos: number;
  antecedentesPontos: number;
  virtudesExtras: number;
  forcaVontadeBase: number;
  idadeAnosMin: number;
  idadeAnosMax: number;
}

export const PATAMARES_GERACAO_1E: Record<number, InfoPatamarGeracao> = {
  12: {
    geracaoNum: 12,
    pontosAntecedente: 0,
    patamar: 'Neófito',
    maxTraco: 5,
    sangueMax: 11,
    sanguePorTurno: 1,
    atributosExtras: 15,
    habilidadesPontos: 27,
    disciplinasPontos: 4,
    antecedentesPontos: 5,
    virtudesExtras: 7,
    forcaVontadeBase: 5,
    idadeAnosMin: 3,
    idadeAnosMax: 35,
  },
  11: {
    geracaoNum: 11,
    pontosAntecedente: 1,
    patamar: 'Neófito Veterano',
    maxTraco: 5,
    sangueMax: 12,
    sanguePorTurno: 1,
    atributosExtras: 17,
    habilidadesPontos: 32,
    disciplinasPontos: 5,
    antecedentesPontos: 6,
    virtudesExtras: 7,
    forcaVontadeBase: 5,
    idadeAnosMin: 15,
    idadeAnosMax: 60,
  },
  10: {
    geracaoNum: 10,
    pontosAntecedente: 2,
    patamar: 'Ancilla Jovem',
    maxTraco: 5,
    sangueMax: 13,
    sanguePorTurno: 1,
    atributosExtras: 19,
    habilidadesPontos: 38,
    disciplinasPontos: 7,
    antecedentesPontos: 8,
    virtudesExtras: 8,
    forcaVontadeBase: 6,
    idadeAnosMin: 40,
    idadeAnosMax: 120,
  },
  9: {
    geracaoNum: 9,
    pontosAntecedente: 3,
    patamar: 'Ancilla Influente',
    maxTraco: 5,
    sangueMax: 14,
    sanguePorTurno: 2,
    atributosExtras: 22,
    habilidadesPontos: 45,
    disciplinasPontos: 9,
    antecedentesPontos: 10,
    virtudesExtras: 9,
    forcaVontadeBase: 7,
    idadeAnosMin: 90,
    idadeAnosMax: 220,
  },
  8: {
    geracaoNum: 8,
    pontosAntecedente: 4,
    patamar: 'Ancião Menor',
    maxTraco: 5,
    sangueMax: 15,
    sanguePorTurno: 3,
    atributosExtras: 25,
    habilidadesPontos: 54,
    disciplinasPontos: 12,
    antecedentesPontos: 13,
    virtudesExtras: 10,
    forcaVontadeBase: 7,
    idadeAnosMin: 180,
    idadeAnosMax: 380,
  },
  7: {
    geracaoNum: 7,
    pontosAntecedente: 5,
    patamar: 'Ancião da Corte',
    maxTraco: 6,
    sangueMax: 20,
    sanguePorTurno: 4,
    atributosExtras: 30,
    habilidadesPontos: 66,
    disciplinasPontos: 16,
    antecedentesPontos: 17,
    virtudesExtras: 11,
    forcaVontadeBase: 8,
    idadeAnosMin: 320,
    idadeAnosMax: 650,
  },
  6: {
    geracaoNum: 6,
    pontosAntecedente: 6,
    patamar: 'Ancião Supremo',
    maxTraco: 7,
    sangueMax: 30,
    sanguePorTurno: 6,
    atributosExtras: 37,
    habilidadesPontos: 82,
    disciplinasPontos: 22,
    antecedentesPontos: 22,
    virtudesExtras: 12,
    forcaVontadeBase: 9,
    idadeAnosMin: 550,
    idadeAnosMax: 1100,
  },
  5: {
    geracaoNum: 5,
    pontosAntecedente: 7,
    patamar: 'Matusalém Desperto',
    maxTraco: 8,
    sangueMax: 40,
    sanguePorTurno: 8,
    atributosExtras: 46,
    habilidadesPontos: 102,
    disciplinasPontos: 30,
    antecedentesPontos: 28,
    virtudesExtras: 12,
    forcaVontadeBase: 9,
    idadeAnosMin: 950,
    idadeAnosMax: 1800,
  },
  4: {
    geracaoNum: 4,
    pontosAntecedente: 8,
    patamar: 'Matusalém Lendário',
    maxTraco: 9,
    sangueMax: 50,
    sanguePorTurno: 10,
    atributosExtras: 56,
    habilidadesPontos: 124,
    disciplinasPontos: 40,
    antecedentesPontos: 35,
    virtudesExtras: 12,
    forcaVontadeBase: 10,
    idadeAnosMin: 1600,
    idadeAnosMax: 3200,
  },
};

export const ARQUETIPOS_META: Record<
  Exclude<ArquetipoNpc, 'aleatorio'>,
  {
    label: string;
    conceito: string;
    prioridadeAtributos: ['fisicos' | 'sociais' | 'mentais', 'fisicos' | 'sociais' | 'mentais', 'fisicos' | 'sociais' | 'mentais'];
    habilidadesChave: (keyof Personagem['habilidades'])[];
    naturezas: string[];
    comportamentos: string[];
    caminhos: string[];
    antecedentesPref: string[];
    disciplinasExtrasPref: string[];
    equipamentoPerfil: 'pesado' | 'leve_furtivo' | 'corte' | 'distancia' | 'erudito';
  }
> = {
  cavaleiro: {
    label: 'Cavaleiro / Guerreiro Feudal',
    conceito: 'Cavaleiro Juramentado das Trevas',
    prioridadeAtributos: ['fisicos', 'sociais', 'mentais'],
    habilidadesChave: ['armasBrancas', 'cavalgar', 'esquiva', 'prontidao', 'briga', 'intimidacao', 'lideranca', 'etiqueta', 'esportes'],
    naturezas: ['Bravo (Valentão)', 'Tradicionalista', 'Mártir', 'Líder', 'Juiz'],
    comportamentos: ['Galante', 'Tradicionalista', 'Autocrata', 'Bravo (Valentão)'],
    caminhos: ['Caminho do Cavaleiro', 'Caminho dos Reis', 'Caminho da Humanidade'],
    antecedentesPref: ['Recursos', 'Status', 'Criados', 'Aliados'],
    disciplinasExtrasPref: ['Fortitude', 'Potência', 'Rapidez', 'Presença'],
    equipamentoPerfil: 'pesado',
  },
  assassino: {
    label: 'Assassino / Espião das Sombras',
    conceito: 'Lâmina Silenciosa da Noite',
    prioridadeAtributos: ['fisicos', 'mentais', 'sociais'],
    habilidadesChave: ['furtividade', 'armasBrancas', 'prontidao', 'esquiva', 'crime', 'esportes', 'investigacao', 'arqueirismo', 'briga'],
    naturezas: ['Sobrevivente', 'Solitário', 'Monstro', 'Fanático', 'Ladino (Malandro)'],
    comportamentos: ['Solitário', 'Conformista', 'Sobrevivente', 'Ladino (Malandro)'],
    caminhos: ['Caminho do Sangue', 'Caminho da Noite', 'Caminho da Besta'],
    antecedentesPref: ['Contatos', 'Recursos', 'Mentor', 'Aliados'],
    disciplinasExtrasPref: ['Ofuscação', 'Rapidez', 'Auspícios', 'Quietus', 'Potência'],
    equipamentoPerfil: 'leve_furtivo',
  },
  nobre: {
    label: 'Nobre / Político da Corte',
    conceito: 'Aristocrata Manipulador do Elísio',
    prioridadeAtributos: ['sociais', 'mentais', 'fisicos'],
    habilidadesChave: ['politica', 'etiqueta', 'lideranca', 'labia', 'senescalia', 'intimidacao', 'empatia', 'direito', 'instrucao'],
    naturezas: ['Autocrata', 'Diretor', 'Arquiteto', 'Trampista (Conspirador)', 'Líder'],
    comportamentos: ['Bon Vivant', 'Galante', 'Tradicionalista', 'Diretor'],
    caminhos: ['Caminho dos Reis', 'Caminho da Humanidade', 'Caminho do Pecado'],
    antecedentesPref: ['Recursos', 'Influência', 'Status', 'Rebanho', 'Criados', 'Aliados'],
    disciplinasExtrasPref: ['Dominação', 'Presença', 'Auspícios', 'Fortitude'],
    equipamentoPerfil: 'corte',
  },
  ocultista: {
    label: 'Ocultista / Erudito Arcano',
    conceito: 'Estudioso dos Segredos Proibidos',
    prioridadeAtributos: ['mentais', 'sociais', 'fisicos'],
    habilidadesChave: ['ocultismo', 'instrucao', 'investigacao', 'linguistica', 'medicina', 'herborismo', 'sabedoriaPopular', 'ciencia', 'prontidao'],
    naturezas: ['Visionário', 'Arquiteto', 'Solitário', 'Penitente', 'Juiz'],
    comportamentos: ['Solitário', 'Conformista', 'Tradicionalista', 'Visionário'],
    caminhos: ['Caminho do Céu', 'Caminho do Paradoxo', 'Caminho da Humanidade'],
    antecedentesPref: ['Mentor', 'Recursos', 'Criados', 'Contatos', 'Rebanho'],
    disciplinasExtrasPref: ['Auspícios', 'Taumaturgia', 'Mortis', 'Dominação', 'Ofuscação'],
    equipamentoPerfil: 'erudito',
  },
  inquisidor: {
    label: 'Inquisidor / Fanático Cainita',
    conceito: 'Juiz Implacável das Tradições',
    prioridadeAtributos: ['mentais', 'fisicos', 'sociais'],
    habilidadesChave: ['investigacao', 'intimidacao', 'prontidao', 'armasBrancas', 'direito', 'ocultismo', 'empatia', 'esquiva', 'lideranca'],
    naturezas: ['Fanático', 'Juiz', 'Autocrata', 'Penitente', 'Mártir'],
    comportamentos: ['Juiz', 'Tradicionalista', 'Fanático', 'Autocrata'],
    caminhos: ['Caminho do Céu', 'Caminho dos Reis', 'Caminho do Sangue'],
    antecedentesPref: ['Status', 'Influência', 'Criados', 'Aliados', 'Recursos'],
    disciplinasExtrasPref: ['Auspícios', 'Dominação', 'Fortitude', 'Potência'],
    equipamentoPerfil: 'pesado',
  },
  cacador: {
    label: 'Caçador / Selvagem das Fronteiras',
    conceito: 'Predador das Florestas e Estradas',
    prioridadeAtributos: ['fisicos', 'mentais', 'sociais'],
    habilidadesChave: ['sobrevivencia', 'arqueirismo', 'empatiaAnimais', 'furtividade', 'prontidao', 'esportes', 'briga', 'esquiva', 'armasBrancas'],
    naturezas: ['Sobrevivente', 'Bárbaro', 'Solitário', 'Monstro', 'Rebelde'],
    comportamentos: ['Solitário', 'Bárbaro', 'Resmungão (Ranzinza)', 'Sobrevivente'],
    caminhos: ['Caminho da Besta', 'Caminho da Humanidade'],
    antecedentesPref: ['Rebanho', 'Contatos', 'Aliados', 'Recursos'],
    disciplinasExtrasPref: ['Animalismo', 'Metamorfose', 'Fortitude', 'Rapidez', 'Ofuscação'],
    equipamentoPerfil: 'distancia',
  },
  cortesao: {
    label: 'Cortesão / Artista / Hárpia',
    conceito: 'Voz Sedutora dos Salões Nobres',
    prioridadeAtributos: ['sociais', 'mentais', 'fisicos'],
    habilidadesChave: ['etiqueta', 'representacao', 'labia', 'empatia', 'musica', 'politica', 'artesanato', 'prontidao', 'esquiva'],
    naturezas: ['Celebrante', 'Bon Vivant', 'Galante', 'Trapaceiro', 'Bobo da Corte (Bufão)'],
    comportamentos: ['Bon Vivant', 'Galante', 'Celebrante', 'Cuidador'],
    caminhos: ['Caminho da Humanidade', 'Caminho do Pecado', 'Caminho dos Reis'],
    antecedentesPref: ['Status', 'Rebanho', 'Recursos', 'Contatos', 'Influência'],
    disciplinasExtrasPref: ['Presença', 'Auspícios', 'Rapidez', 'Dominação'],
    equipamentoPerfil: 'corte',
  },
  senescal: {
    label: 'Senescal / Mercador / Conselheiro',
    conceito: 'Mestre das Finanças e Segredos do Domínio',
    prioridadeAtributos: ['mentais', 'sociais', 'fisicos'],
    habilidadesChave: ['senescalia', 'politica', 'direito', 'labia', 'instrucao', 'investigacao', 'etiqueta', 'empatia', 'linguistica'],
    naturezas: ['Arquiteto', 'Diretor', 'Trampista (Conspirador)', 'Juiz', 'Conformista'],
    comportamentos: ['Conformista', 'Tradicionalista', 'Cuidador', 'Diretor'],
    caminhos: ['Caminho dos Reis', 'Caminho da Humanidade', 'Caminho do Paradoxo'],
    antecedentesPref: ['Recursos', 'Influência', 'Contatos', 'Criados', 'Status'],
    disciplinasExtrasPref: ['Dominação', 'Auspícios', 'Ofuscação', 'Presença'],
    equipamentoPerfil: 'corte',
  },
  guarda_elite: {
    label: 'Soldado de Elite / Executor do Príncipe',
    conceito: 'Lança Juramentada da Guarda do Elísio',
    prioridadeAtributos: ['fisicos', 'mentais', 'sociais'],
    habilidadesChave: ['armasBrancas', 'briga', 'esquiva', 'prontidao', 'esportes', 'intimidacao', 'furtividade', 'cavalgar', 'sobrevivencia'],
    naturezas: ['Bravo (Valentão)', 'Sobrevivente', 'Tradicionalista', 'Fanático', 'Solitário'],
    comportamentos: ['Conformista', 'Bravo (Valentão)', 'Solitário', 'Tradicionalista'],
    caminhos: ['Caminho do Cavaleiro', 'Caminho do Sangue', 'Caminho dos Reis'],
    antecedentesPref: ['Status', 'Recursos', 'Aliados', 'Criados'],
    disciplinasExtrasPref: ['Fortitude', 'Potência', 'Rapidez', 'Auspícios'],
    equipamentoPerfil: 'pesado',
  },
};

const ORIGENS_DADOS: Record<
  Exclude<OrigemMedieval, 'aleatoria'>,
  {
    label: string;
    nacionalidade: string;
    nomesMasc: string[];
    nomesFem: string[];
    sobrenomes: string[];
    cidades: string[];
    refugios: string[];
    cabelos: string[];
    olhos: string[];
  }
> = {
  franca: {
    label: 'Reino da França',
    nacionalidade: 'Francesa',
    nomesMasc: ['Henri', 'Gaspard', 'Thibault', 'Amaury', 'Gilles', 'René', 'Guillaume', 'Etienne', 'Baudouin'],
    nomesFem: ['Isabeau', 'Margaux', 'Blanche', 'Geneviève', 'Céleste', 'Aliénor', 'Yolande', 'Delphine'],
    sobrenomes: ['de Montclair', 'de Valois', 'de Rochefort', 'de Saint-Clair', 'de Beaumont', 'de Lacroix', 'd’Anjou'],
    cidades: ['Paris', 'Lyon', 'Rouen', 'Orléans', 'Marselha', 'Avignon'],
    refugios: ['Abadia arruinada nas margens do Sena', 'Solar de pedra nos arredores da muralha', 'Cripta familiar sob uma catedral gótica'],
    cabelos: ['Negros longos', 'Castanhos ondulados', 'Loiros acinzentados', 'Ruivos escuros'],
    olhos: ['Cinzentos gélidos', 'Negros profundos', 'Verdes esmeralda', 'Castanhos penetrantes'],
  },
  germania: {
    label: 'Sacro Império (Germânia)',
    nacionalidade: 'Germânica',
    nomesMasc: ['Dietrich', 'Konrad', 'Wolfram', 'Siegfried', 'Albrecht', 'Ulrich', 'Heinrich', 'Lothar'],
    nomesFem: ['Adelheid', 'Hildegard', 'Kriemhild', 'Gertrud', 'Brunhilde', 'Isolde', 'Mathilde'],
    sobrenomes: ['von Falkenstein', 'von Eisenberg', 'von Ravensburg', 'von Drachenfels', 'von Hohenstein', 'von Adler'],
    cidades: ['Colônia', 'Nuremberg', 'Viena', 'Praga', 'Aachen', 'Estrasburgo'],
    refugios: ['Fortaleza escarpada sobre a Floresta Negra', 'Torre de vigia em pedra cinza', 'Catacumbas sob um mosteiro beneditino'],
    cabelos: ['Loiros platinados', 'Castanhos escuros', 'Grisalhos compridos', 'Pretos lisos'],
    olhos: ['Azuis glaciais', 'Cinzentos metálicos', 'Castanhos escuros', 'Âmbar sombrio'],
  },
  italia: {
    label: 'Estados Italianos',
    nacionalidade: 'Italiana',
    nomesMasc: ['Lorenzo', 'Matteo', 'Niccolò', 'Galeazzo', 'Cesare', 'Dante', 'Federico', 'Valerio'],
    nomesFem: ['Lucrezia', 'Bianca', 'Caterina', 'Fiorenza', 'Beatrice', 'Livia', 'Vittoria'],
    sobrenomes: ['Visconti', 'Montefeltro', 'Sforza', 'di Montalto', 'Orsini', 'Malatesta', 'di Venezia'],
    cidades: ['Veneza', 'Florença', 'Roma', 'Milão', 'Gênova', 'Nápoles'],
    refugios: ['Palazzo sombrio à beira dos canais', 'Villa de mármore oculta entre ciprestes', 'Porão abobadado de uma antiga guilda mercantil'],
    cabelos: ['Negros corvo', 'Castanhos cacheados', 'Acobreados', 'Escuros com mechas prateadas'],
    olhos: ['Negros faiscantes', 'Castanhos quentes', 'Verdes oliva', 'Avelã'],
  },
  iberia: {
    label: 'Península Ibérica',
    nacionalidade: 'Ibérica',
    nomesMasc: ['Rodrigo', 'Alfonso', 'Sancho', 'Fernán', 'Esteban', 'Diego', 'Íñigo', 'Martín'],
    nomesFem: ['Jimena', 'Elvira', 'Urraca', 'Beatriz', 'Solange', 'Inês', 'Leonor'],
    sobrenomes: ['de Mendoza', 'de Castela', 'de Córdoba', 'de Toledo', 'de Aguilar', 'de Navarra', 'de Vargas'],
    cidades: ['Toledo', 'Córdoba', 'Sevilha', 'Burgos', 'Lisboa', 'Granada'],
    refugios: ['Alcázar antigo de paredes espessas', 'Cripta moçárabe abaixo da praça central', 'Quinta fortificada nas colinas'],
    cabelos: ['Negros espessos', 'Castanhos escuros', 'Ouro velho', 'Pretos trançados'],
    olhos: ['Negros intensos', 'Castanhos escuros', 'Âmbar profundo', 'Verdes escuros'],
  },
  inglaterra: {
    label: 'Ilhas Britânicas',
    nacionalidade: 'Inglesa',
    nomesMasc: ['Godfrey', 'Aldric', 'Rowan', 'Edmund', 'Wulfric', 'Gareth', 'Alistair', 'Osric'],
    nomesFem: ['Eleanor', 'Rowena', 'Morgana', 'Aethel', 'Gwendolyn', 'Beatrix', 'Millicent'],
    sobrenomes: ['of Blackwood', 'of York', 'of Ashworth', 'of Lancaster', 'of Thornhill', 'of Ravenscroft'],
    cidades: ['Londres', 'York', 'Canterbury', 'Edimburgo', 'Winchester', 'Bath'],
    refugios: ['Mansão envolta em névoa nos pântanos', 'Priorado abandonado perto das docas', 'Mausoléu normando coberto de hera'],
    cabelos: ['Ruivos escuros', 'Castanhos claros', 'Loiros pálidos', 'Negros desgrenhados'],
    olhos: ['Cinzentos tempestade', 'Azuis pálidos', 'Verdes musgo', 'Castanhos frios'],
  },
  bizancio: {
    label: 'Império Bizantino',
    nacionalidade: 'Bizantina',
    nomesMasc: ['Nikephoros', 'Alexios', 'Konstantinos', 'Basileios', 'Theodoros', 'Ioannes', 'Demetrios'],
    nomesFem: ['Theodora', 'Zoe', 'Eirene', 'Anna', 'Eudokia', 'Helena', 'Kassandra'],
    sobrenomes: ['Komnenos', 'Palaiologos', 'Doukas', 'Phokas', 'Angelos', 'Kantakouzenos'],
    cidades: ['Constantinopla', 'Tessalônica', 'Niceia', 'Trebizonda', 'Atenas'],
    refugios: ['Cisterna subterrânea sob o Hipódromo', 'Palácio de mármore púrpura perto do Bósforo', 'Mosteiro ortodoxo escavado na rocha'],
    cabelos: ['Negros ondulados', 'Castanhos profundos', 'Escuros adornados com fios de ouro'],
    olhos: ['Negros ônix', 'Castanhos profundos', 'Cinzentos antigos'],
  },
  leste_europeu: {
    label: 'Leste Europeu / Cárpatos',
    nacionalidade: 'Valáquia / Eslava',
    nomesMasc: ['Vladislav', 'Radu', 'Dragomir', 'Bogdan', 'Mircea', 'Milosz', 'Casimir', 'Soren'],
    nomesFem: ['Mirela', 'Viorica', 'Katarina', 'Danica', 'Zora', 'Anastasia', 'Irina'],
    sobrenomes: ['Draculesti', 'Basarab', 'Kowalski', 'Vukovic', 'Morozov', 'Széchenyi', 'Voronin'],
    cidades: ['Târgoviște', 'Cracóvia', 'Buda', 'Brasov', 'Kiev', 'Novgorod'],
    refugios: ['Castelo erguido em desfiladeiro nevado nos Cárpatos', 'Solar fortificado cercado por lobos', 'Cripta de pedra negra sob a floresta'],
    cabelos: ['Negros como a noite', 'Brancos precoces', 'Castanhos escuros', 'Ruivos acobreados'],
    olhos: ['Vermelho-escuro sob a penumbra', 'Cinzentos lupinos', 'Negros gélidos', 'Verdes pálidos'],
  },
  oriente_medio: {
    label: 'Levante / Oriente Médio',
    nacionalidade: 'Árabe / Levantina',
    nomesMasc: ['Tariq', 'Salim', 'Rashid', 'Kamil', 'Farid', 'Zayd', 'Malik', 'Hakim'],
    nomesFem: ['Layla', 'Yasmin', 'Soraya', 'Nadia', 'Zahara', 'Amina', 'Samira'],
    sobrenomes: ['al-Mansur', 'ibn-Sina', 'al-Qahiri', 'al-Rashid', 'al-Hakim', 'al-Dimashqi', 'al-Nasser'],
    cidades: ['Damasco', 'Jerusalém', 'Cairo', 'Bagdá', 'Alepo', 'Acre'],
    refugios: ['Cidadela oculta entre rochedos áridos', 'Riad silencioso de pátios sombreados', 'Câmara secreta sob uma antiga biblioteca'],
    cabelos: ['Negros brilhantes', 'Castanhos muito escuros', 'Raspados sob turbante escuro'],
    olhos: ['Negros como obsidiana', 'Âmbar dourado', 'Castanhos profundos'],
  },
};

function escolher<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function escolherCaminhoCoerente(claNome: string, arquetipo: Exclude<ArquetipoNpc, 'aleatorio'>): string {
  const mapaCla: Record<string, string[]> = {
    Assamita: ['Caminho do Sangue'],
    Gangrel: ['Caminho da Besta'],
    Lasombra: ['Caminho da Noite', 'Caminho dos Reis'],
    Ventrue: ['Caminho dos Reis', 'Caminho do Cavaleiro'],
    Tzimisce: ['Caminho da Metamorfose', 'Caminho dos Reis'],
    'Seguidores de Set': ['Caminho da Serpente', 'Caminho do Pecado'],
    Capadócio: ['Caminho do Céu', 'Caminho da Humanidade'],
    Ravnos: ['Caminho do Paradoxo'],
    Toreador: ['Caminho da Humanidade', 'Caminho do Pecado'],
    Brujah: ['Caminho da Humanidade', 'Caminho do Cavaleiro'],
    Tremere: ['Caminho da Humanidade', 'Caminho dos Reis'],
    Nosferatu: ['Caminho da Humanidade', 'Caminho da Besta'],
    Malkaviano: ['Caminho da Humanidade', 'Caminho do Paradoxo'],
  };
  const opcoesCla = mapaCla[claNome] || ['Caminho da Humanidade'];
  const opcoesArq = ARQUETIPOS_META[arquetipo].caminhos;
  if (Math.random() < 0.6) {
    return escolher(opcoesCla);
  }
  return escolher(opcoesArq);
}

export function gerarNpcElaborado1E(
  req: RequisitosGeradorNpc,
  mestre: User,
  catalogoArmas: CatalogoArmaItem[] = ARMAS_CATALOGO_1E,
  catalogoArmaduras: CatalogoArmaduraItem[] = ARMADURAS_CATALOGO_1E
): Personagem {
  const geracaoNum = Math.max(4, Math.min(12, Math.floor(req.geracaoNum || 10)));
  const patamar = PATAMARES_GERACAO_1E[geracaoNum] || PATAMARES_GERACAO_1E[10];
  const infoGeracao = TABELA_GERACAO_1E[patamar.pontosAntecedente] || TABELA_GERACAO_1E[2];

  // 1. Resolver Clã (13 clãs oficiais 1ª Edição)
  const claObj =
    req.cla && req.cla !== 'aleatorio'
      ? CLAS_DARK_AGES_1E.find((c) => c.nome === req.cla) || escolher(CLAS_DARK_AGES_1E)
      : escolher(CLAS_DARK_AGES_1E);

  // 2. Resolver Arquétipo
  const todosArquetipos = Object.keys(ARQUETIPOS_META) as Exclude<ArquetipoNpc, 'aleatorio'>[];
  const arquetipoKey: Exclude<ArquetipoNpc, 'aleatorio'> =
    req.arquetipo === 'aleatorio' ? escolher(todosArquetipos) : req.arquetipo;
  const arq = ARQUETIPOS_META[arquetipoKey];

  // 3. Resolver Gênero e Origem Medieval
  const generoFinal: 'masculino' | 'feminino' =
    req.genero === 'aleatorio' ? (Math.random() < 0.55 ? 'masculino' : 'feminino') : req.genero;
  const todasOrigens = Object.keys(ORIGENS_DADOS) as Exclude<OrigemMedieval, 'aleatoria'>[];
  const origemKey: Exclude<OrigemMedieval, 'aleatoria'> =
    req.origem === 'aleatoria'
      ? claObj.nome === 'Assamita' || claObj.nome === 'Seguidores de Set'
        ? 'oriente_medio'
        : claObj.nome === 'Tzimisce'
        ? 'leste_europeu'
        : escolher(todasOrigens)
      : req.origem;
  const origemInfo = ORIGENS_DADOS[origemKey];

  // 4. Nome, Senhor e Refúgio
  const primeiroNome = escolher(
    generoFinal === 'masculino' ? origemInfo.nomesMasc : origemInfo.nomesFem
  );
  const sobrenome = escolher(origemInfo.sobrenomes);
  const nomeGerado = req.nomePersonalizado?.trim() || `${primeiroNome} ${sobrenome}`;
  const nomeSenhor = `${escolher(
    Math.random() < 0.5 ? origemInfo.nomesMasc : origemInfo.nomesFem
  )} ${escolher(origemInfo.sobrenomes)}`;
  const cidadeOrigem = escolher(origemInfo.cidades);
  const refugio = `${escolher(origemInfo.refugios)} (${cidadeOrigem})`;

  // 5. Distribuir Atributos (respeitando teto da Geração e Nosferatu Aparência 0 / Capadócio Aparência máx 2)
  const atributos: Personagem['atributos'] = {
    forca: 1,
    destreza: 1,
    vigor: 1,
    carisma: 1,
    manipulacao: 1,
    aparencia: claObj.nome === 'Nosferatu' ? 0 : 1,
    percepcao: 1,
    inteligencia: 1,
    raciocinio: 1,
  };

  let ordemCat: ('fisicos' | 'sociais' | 'mentais')[] = [...arq.prioridadeAtributos];
  if (req.foco === 'fisico') ordemCat = ['fisicos', 'mentais', 'sociais'];
  if (req.foco === 'social') ordemCat = ['sociais', 'mentais', 'fisicos'];
  if (req.foco === 'mental') ordemCat = ['mentais', 'sociais', 'fisicos'];

  const mapaGrupoAtrib: Record<'fisicos' | 'sociais' | 'mentais', (keyof Personagem['atributos'])[]> = {
    fisicos: ['forca', 'destreza', 'vigor'],
    sociais: ['carisma', 'manipulacao', 'aparencia'],
    mentais: ['percepcao', 'inteligencia', 'raciocinio'],
  };

  const totalAtrib = patamar.atributosExtras;
  const cotas: Record<'fisicos' | 'sociais' | 'mentais', number> = {
    [ordemCat[0]]: Math.round(totalAtrib * 0.46),
    [ordemCat[1]]: Math.round(totalAtrib * 0.33),
    [ordemCat[2]]: totalAtrib - Math.round(totalAtrib * 0.46) - Math.round(totalAtrib * 0.33),
  } as Record<'fisicos' | 'sociais' | 'mentais', number>;

  (['fisicos', 'sociais', 'mentais'] as const).forEach((cat) => {
    let restante = cotas[cat];
    const chaves = mapaGrupoAtrib[cat];
    let tentativas = 0;
    while (restante > 0 && tentativas < 300) {
      tentativas++;
      const ch = escolher(chaves);
      const tetoCampo =
        ch === 'aparencia' && claObj.nome === 'Nosferatu'
          ? 0
          : ch === 'aparencia' && claObj.nome === 'Capadócio'
          ? 2
          : patamar.maxTraco;
      if (atributos[ch] < tetoCampo) {
        atributos[ch] += 1;
        restante -= 1;
      }
    }
  });

  // 6. Distribuir Habilidades (30 habilidades oficiais da 1ª Edição)
  const habilidades: Personagem['habilidades'] = {
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
  };

  const todasHabs = Object.keys(habilidades) as (keyof Personagem['habilidades'])[];
  const habsChave = arq.habilidadesChave;
  const habsSecundarias = embaralhar(todasHabs.filter((h) => !habsChave.includes(h))).slice(0, 8);
  let pontosHab = patamar.habilidadesPontos;

  // Garantir base sólida nas 4 principais habilidades do arquétipo
  habsChave.slice(0, 4).forEach((h) => {
    const base = Math.min(patamar.maxTraco, geracaoNum <= 7 ? 4 : geracaoNum <= 9 ? 3 : 2);
    const gastar = Math.min(base, pontosHab);
    habilidades[h] = (habilidades[h] || 0) + gastar;
    pontosHab -= gastar;
  });

  let guardHab = 0;
  while (pontosHab > 0 && guardHab < 500) {
    guardHab++;
    const pool = Math.random() < 0.78 ? habsChave : habsSecundarias;
    const h = escolher(pool);
    const tetoHab = habsChave.includes(h) ? patamar.maxTraco : Math.min(3, patamar.maxTraco);
    if ((habilidades[h] || 0) < tetoHab) {
      habilidades[h] = (habilidades[h] || 0) + 1;
      pontosHab -= 1;
    }
  }

  // 7. Disciplinas (sempre começa com as 3 disciplinas oficiais de Clã da 1ª Edição!)
  const disciplinasMapa = new Map<string, number>();
  claObj.disciplinas.forEach((d) => disciplinasMapa.set(d, 1));
  let pontosDisc = Math.max(0, patamar.disciplinasPontos - 3);

  // Disciplinas fora de Clã se solicitado (e coerente com a idade/geração)
  if (req.incluirDisciplinasExtras && pontosDisc > 2) {
    const qtdExtras =
      geracaoNum <= 5 ? 3 : geracaoNum <= 7 ? 2 : geracaoNum <= 9 ? 1 : 0;
    const candidatas = [
      ...arq.disciplinasExtrasPref,
      ...embaralhar(DISCIPLINAS_LIVRO_1E),
    ].filter((d) => !disciplinasMapa.has(d));
    const extrasEscolhidas = Array.from(new Set(candidatas)).slice(0, qtdExtras);
    extrasEscolhidas.forEach((d) => {
      if (pontosDisc > 0) {
        disciplinasMapa.set(d, 1);
        pontosDisc -= 1;
      }
    });
  }

  const nomesDisc = Array.from(disciplinasMapa.keys());
  let guardDisc = 0;
  while (pontosDisc > 0 && guardDisc < 300) {
    guardDisc++;
    const escolherCla = Math.random() < 0.72;
    const d = escolher(escolherCla ? [...claObj.disciplinas] : nomesDisc);
    const atual = disciplinasMapa.get(d) || 0;
    const tetoD = claObj.disciplinas.includes(d)
      ? patamar.maxTraco
      : Math.max(2, patamar.maxTraco - 2);
    if (atual < tetoD) {
      disciplinasMapa.set(d, atual + 1);
      pontosDisc -= 1;
    }
  }

  const disciplinas: ItemSimplesNivel[] = Array.from(disciplinasMapa.entries()).map(
    ([nome, nivel], i) => ({
      id: `disc_gen_${Date.now().toString(36)}_${i}`,
      nome,
      nivel,
    })
  );

  // 8. Antecedentes (incluindo Geração exata para manter a tabela 1ª Edição coerente)
  const antecedentesMapa = new Map<string, number>();
  if (patamar.pontosAntecedente > 0) {
    antecedentesMapa.set('Geração', patamar.pontosAntecedente);
  }
  let pontosAnt = Math.max(3, patamar.antecedentesPontos - patamar.pontosAntecedente);
  const antPool = [...arq.antecedentesPref, 'Recursos', 'Status', 'Influência', 'Rebanho', 'Aliados', 'Criados', 'Contatos'];
  const antUnicos = Array.from(new Set(antPool)).slice(0, geracaoNum <= 7 ? 6 : 4);
  const tetoAnt = Math.min(5, patamar.maxTraco);

  let guardAnt = 0;
  while (pontosAnt > 0 && guardAnt < 250) {
    guardAnt++;
    const a = escolher(antUnicos);
    const atual = antecedentesMapa.get(a) || 0;
    if (atual < tetoAnt) {
      antecedentesMapa.set(a, atual + 1);
      pontosAnt -= 1;
    }
  }

  const antecedentes: ItemSimplesNivel[] = Array.from(antecedentesMapa.entries()).map(
    ([nome, nivel], i) => ({
      id: `ant_gen_${Date.now().toString(36)}_${i}`,
      nome,
      nivel,
    })
  );
  const nivelRecursos = antecedentesMapa.get('Recursos') || 0;

  // 9. Virtudes, Caminho Medieval e Força de Vontade
  const caminhoEscolhido = escolherCaminhoCoerente(claObj.nome, arquetipoKey);
  const usaConviccao = !caminhoEscolhido.includes('Humanidade') && !caminhoEscolhido.includes('Céu');
  const usaInstinto = caminhoEscolhido.includes('Besta') || caminhoEscolhido.includes('Metamorfose');

  const virtudes: Personagem['virtudes'] = {
    tipoConsciencia: usaConviccao ? 'conviccao' : 'consciencia',
    consciencia: 1,
    tipoAutocontrole: usaInstinto ? 'instinto' : 'autocontrole',
    autocontrole: 1,
    coragem: 1,
  };
  let vRest = patamar.virtudesExtras;
  const vKeys: ('consciencia' | 'autocontrole' | 'coragem')[] = [
    'consciencia',
    'autocontrole',
    'coragem',
  ];
  let guardV = 0;
  while (vRest > 0 && guardV < 100) {
    guardV++;
    const k = escolher(vKeys);
    if (virtudes[k] < 5) {
      virtudes[k] += 1;
      vRest -= 1;
    }
  }

  const caminhoNivel = Math.min(10, Math.max(4, virtudes.consciencia + virtudes.autocontrole));
  const forcaDeVontade = Math.min(
    10,
    Math.max(virtudes.coragem, patamar.forcaVontadeBase + randomInt(-1, 1))
  );

  // 10. Qualidades & Defeitos temáticos
  const qualidadesDefeitos: QualidadeDefeitoItem[] = [];
  if (req.incluirQualidadesDefeitos) {
    const qualidades = embaralhar(
      QUALIDADES_DEFEITOS_1E.filter((q) => q.tipo === 'qualidade' && q.pontos <= 3)
    );
    const defeitos = embaralhar(
      QUALIDADES_DEFEITOS_1E.filter((q) => q.tipo === 'defeito' && q.pontos <= 3)
    );
    const qtdQual = geracaoNum <= 7 ? 3 : 2;
    const qtdDef = geracaoNum <= 7 ? 2 : 1;
    qualidades.slice(0, qtdQual).forEach((q, i) => {
      qualidadesDefeitos.push({
        id: `qd_q_${Date.now().toString(36)}_${i}`,
        nome: q.nome,
        tipo: 'qualidade',
        categoria: q.categoria,
        custo: q.pontos,
        descricao: q.descricao,
      });
    });
    defeitos.slice(0, qtdDef).forEach((d, i) => {
      qualidadesDefeitos.push({
        id: `qd_d_${Date.now().toString(36)}_${i}`,
        nome: d.nome,
        tipo: 'defeito',
        categoria: d.categoria,
        custo: d.pontos,
        descricao: d.descricao,
      });
    });
  }

  // 11. Equipamento Automático (Armas, Escudo e Armadura do Catálogo Oficial)
  const armas: Arma[] = [];
  const armaduras: Armadura[] = [];

  if (req.incluirEquipamento) {
    const armasDisp = catalogoArmas.length > 0 ? catalogoArmas : ARMAS_CATALOGO_1E;
    const armadurasDisp = catalogoArmaduras.length > 0 ? catalogoArmaduras : ARMADURAS_CATALOGO_1E;

    const compatArma = (a: CatalogoArmaItem) =>
      (a.forcaMinima || 1) <= atributos.forca &&
      (a.recursosMinimo || 0) <= Math.max(nivelRecursos, 2) &&
      !a.magica;

    const brancas = armasDisp.filter((a) => a.categoria === 'branca' && compatArma(a));
    const distancias = armasDisp.filter((a) => a.categoria === 'distancia' && compatArma(a));
    const escudos = armasDisp.filter((a) => a.categoria === 'escudo' && compatArma(a));

    const converterArma = (m: CatalogoArmaItem, idx: number): Arma => ({
      id: `arma_gen_${Date.now().toString(36)}_${idx}`,
      nome: m.nome,
      categoria: m.categoria,
      dificuldade: m.dificuldade,
      dano: m.dano,
      ocultacao: m.ocultacao,
      alcance: m.alcance,
      forcaMinima: m.forcaMinima,
      recursosMinimo: m.recursosMinimo,
      magica: m.magica,
      danoAgravado: m.danoAgravado,
      bonusMagico: m.bonusMagico,
      poderMagico: m.poderMagico,
    });

    if (arq.equipamentoPerfil === 'pesado') {
      const principal =
        brancas.find((a) => a.nome.includes('Espada') || a.nome.includes('Machado') || a.nome.includes('Maça')) ||
        escolher(brancas.length ? brancas : armasDisp);
      if (principal) armas.push(converterArma(principal, 1));
      const secundaria = brancas.find((a) => a.nome === 'Adaga' || a.nome === 'Faca');
      if (secundaria) armas.push(converterArma(secundaria, 2));
      if (escudos.length > 0) {
        armas.push(converterArma(escolher(escudos), 3));
      }
    } else if (arq.equipamentoPerfil === 'distancia') {
      const arco = escolher(distancias.length ? distancias : armasDisp);
      if (arco) armas.push(converterArma(arco, 1));
      const faca = brancas.find((a) => a.nome === 'Adaga' || a.nome === 'Faca') || brancas[0];
      if (faca) armas.push(converterArma(faca, 2));
    } else if (arq.equipamentoPerfil === 'leve_furtivo') {
      const adaga = brancas.find((a) => a.nome === 'Adaga') || brancas[0];
      if (adaga) armas.push(converterArma(adaga, 1));
      const arremesso = distancias.find((a) => a.nome.includes('Faca'));
      if (arremesso) armas.push(converterArma(arremesso, 2));
    } else {
      const discreta =
        brancas.find((a) => a.nome === 'Adaga' || a.nome === 'Faca' || a.nome === 'Bastão') ||
        brancas[0];
      if (discreta) armas.push(converterArma(discreta, 1));
    }

    // Armadura compatível com o perfil e Força
    const armCompat = armadurasDisp.filter(
      (arm) => (arm.forcaMinima || 1) <= atributos.forca && !arm.magica
    );
    if (armCompat.length > 0 && arq.equipamentoPerfil !== 'erudito') {
      let escolhidaArm: CatalogoArmaduraItem | undefined;
      if (arq.equipamentoPerfil === 'pesado') {
        escolhidaArm =
          armCompat.find((a) => a.nome.includes('Cavaleiro') || a.nome.includes('Pesada')) ||
          armCompat[armCompat.length - 1];
      } else if (arq.equipamentoPerfil === 'leve_furtivo' || arq.equipamentoPerfil === 'distancia') {
        escolhidaArm =
          armCompat.find((a) => a.nome.includes('Leve') || a.nome.includes('Composta')) ||
          armCompat[0];
      } else if (arq.equipamentoPerfil === 'corte' && Math.random() < 0.5) {
        escolhidaArm = armCompat.find((a) => a.nome.includes('Leve'));
      }

      if (escolhidaArm) {
        armaduras.push({
          id: `arm_gen_${Date.now().toString(36)}`,
          nome: escolhidaArm.nome,
          classe: escolhidaArm.classe,
          penalidade: escolhidaArm.penalidade,
          equipada: arq.equipamentoPerfil === 'pesado' || arq.equipamentoPerfil === 'distancia',
          forcaMinima: escolhidaArm.forcaMinima,
          recursosMinimo: escolhidaArm.recursosMinimo,
          penalidadePercepcao: escolhidaArm.penalidadePercepcao || 0,
        });
      }
    }
  }

  // 12. Identidade, Aparência e Biografia Narrativa Rica
  const natureza = escolher(arq.naturezas.length ? arq.naturezas : ARQUETIPOS_PERSONALIDADE_1E);
  const comportamento = escolher(
    arq.comportamentos.length ? arq.comportamentos : ARQUETIPOS_PERSONALIDADE_1E
  );

  const anosComoVampiro = randomInt(patamar.idadeAnosMin, patamar.idadeAnosMax);
  const idadeAparenteNum = randomInt(22, 46);
  const anoCronica = 1197;
  const anoAbraco = anoCronica - anosComoVampiro;
  const anoAbracoTxt = anoAbraco > 0 ? `${anoAbraco} d.C.` : `${Math.abs(anoAbraco)} a.C.`;

  const perturbacoes =
    claObj.nome === 'Malkaviano'
      ? [
          {
            id: `pert_gen_${Date.now().toString(36)}`,
            nome: escolher([
              'Paranoia Profética',
              'Megalomania Sombria',
              'Vozes do Sangue Antigo',
              'Obsessão Compulsiva por Presságios',
            ]),
            descricao: 'Perturbação inerente à Maldição do Clã Malkaviano (1ª Edição).',
          },
        ]
      : [];

  const pronomeArt = generoFinal === 'masculino' ? 'o' : 'a';
  const pronomeEle = generoFinal === 'masculino' ? 'Ele' : 'Ela';
  const pronomeSeu = generoFinal === 'masculino' ? 'seu' : 'sua';

  const historia = `Nascid${pronomeArt} em ${cidadeOrigem} (${origemInfo.label}), ${nomeGerado} viveu como mortal sob a marca da disciplina e da sobrevivência até alcançar os ${idadeAparenteNum} anos. Conhecid${pronomeArt} entre os mortais pela reputação de ${arq.label.toLowerCase()}, destacou-se pela combinação rara de frieza estratégica e determinação implacável, atraindo atenção muito além dos salões mundanos.`;

  const preludio = `No ano de ${anoAbracoTxt}, ${nomeSenhor} — um cainita poderoso do clã ${claObj.nome} — reconheceu em ${nomeGerado} o molde ideal para perpetuar sua linhagem. O Abraço ocorreu em circunstâncias solenes e sangrentas, legando-lhe o sangue potente da ${infoGeracao.geracaoNome}. Ao longo de ${anosComoVampiro} anos de não-vida como ${patamar.patamar.toLowerCase()}, sobreviveu a guerras feudais, expurgos da Inquisição e conspirações de corte, trilhando o ${caminhoEscolhido}.`;

  const objetivos = `Hoje, operando a partir de ${pronomeSeu} refúgio (${refugio}), ${nomeGerado} busca consolidar influência na crônica e ampliar o domínio de ${pronomeSeu} clã ${claObj.nome}. ${pronomeEle} observa atentamente as disputas no Elísio, mantendo lealdades calculadas enquanto prepara os próximos movimentos na Jyhad medieval.`;

  const tituloJogador = req.tituloPersonalizado?.trim() || `${patamar.patamar} • ${arq.label}`;

  const vitalidadeAjustada = ajustarVitalidadeCorpoGrande(
    NIVEIS_VITALIDADE_PADRAO.map((n) => ({ ...n })),
    qualidadesDefeitos
  );

  const nowIso = new Date().toISOString();

  return {
    id: 'char_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    usuarioId: mestre.id,
    usuarioNome: mestre.nome,
    tipo: 'npc',
    createdAt: nowIso,
    updatedAt: nowIso,
    nome: nomeGerado,
    jogador: tituloJogador,
    cronica: 'Idade das Trevas',
    comportamento,
    cla: claObj.nome,
    natureza,
    geracao: infoGeracao.geracaoNome,
    refugio,
    conceito: arq.conceito,
    senhor: nomeSenhor,
    criacao: {
      status: 'finalizada',
      etapa: 'concluida',
      disciplinasPrimariasIds: disciplinas.slice(0, 3).map((d) => d.id),
      pontosBonusGastos: 0,
    },
    atributos,
    habilidades,
    disciplinas,
    antecedentes,
    qualidadesDefeitos,
    virtudes,
    caminho: caminhoEscolhido,
    caminhoNivel,
    forcaDeVontade,
    forcaDeVontadeGasta: 0,
    pontosDeSangueMax: infoGeracao.reservaSangueMax,
    pontosDeSangueAtual: infoGeracao.reservaSangueMax,
    fraqueza: claObj.fraqueza || '',
    vitalidade: vitalidadeAjustada,
    xp: {
      atual: 0,
      totalGasto: 0,
      historico: `NPC gerado automaticamente (${infoGeracao.geracaoNome} • ${patamar.patamar} • ${claObj.nome})`,
    },
    armas,
    armaduras,
    lacosDeSangue: [],
    perturbacoes,
    linhasTaumaturgia:
      disciplinas.some((d) => d.nome === 'Taumaturgia')
        ? [
            {
              id: `taum_gen_${Date.now().toString(36)}`,
              nome: 'Linha do Sangue',
              nivel: disciplinas.find((d) => d.nome === 'Taumaturgia')?.nivel || 1,
            },
          ]
        : [],
    rituais: [],
    aparencia: {
      idade: `${anosComoVampiro + idadeAparenteNum} anos (${anosComoVampiro} como cainita)`,
      idadeAparente: `${idadeAparenteNum} anos`,
      abraco: anoAbracoTxt,
      cabelos: escolher(origemInfo.cabelos),
      raca: origemInfo.label,
      olhos: escolher(origemInfo.olhos),
      sexo: generoFinal === 'masculino' ? 'Masculino' : 'Feminino',
      nacionalidade: origemInfo.nacionalidade,
      altura: generoFinal === 'masculino' ? `1,${randomInt(72, 92)}m` : `1,${randomInt(60, 78)}m`,
      peso: generoFinal === 'masculino' ? `${randomInt(70, 96)} kg` : `${randomInt(54, 72)} kg`,
    },
    biografia: {
      historia,
      preludio,
      objetivos,
      notas: `Perfil gerado: ${patamar.patamar} (${infoGeracao.geracaoNome}) • Arquétipo: ${arq.label} • Teto de características: ${patamar.maxTraco} • Reserva de Sangue: ${infoGeracao.reservaSangueMax} (${infoGeracao.pontosPorTurno}/turno).`,
    },
  };
}
