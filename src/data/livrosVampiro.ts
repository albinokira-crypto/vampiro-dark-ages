/**
 * Biblioteca Canônica dos Vampiros
 * Acervo digital completo, estruturado e particionado para leitura instantânea no sistema:
 * 1. Vampiro: A Idade das Trevas (Livro Básico de 1996 - 1ª Edição com regras e disciplinas completas de nível 1 ao 5)
 * 2. Compêndio de Livros de Clã (Assamita, Brujah, Capadócio com Mortis, Gangrel, Lasombra, Malkaviano, Nosferatu, Ravnos, Setita, Toreador, Tremere, Tzimisce, Ventrue, Salubri)
 * 3. O Livro de Nod (Crônicas de Caim, Crônica das Sombras e Profecia da Gehenna)
 * 4. Vampiro: A Máscara (Noites Modernas, Guerrilha Urbana e Primeira Tradição)
 * 5. Guia da Camarilla (A Paz de Thorns, Oficiais da Corte Urbana e Leis do Elísio)
 */

import { LIVRO_DARK_AGES_1E } from './livrosDarkAges';
import { LIVROS_MODERNOS_E_NOD } from './livrosMascaraCamarillaNod';
import { LIVROS_CLANS_VAMPIRO } from './livrosCla';
import { LIVROS_OUTROS_CLAS } from './livrosOutrosClas';

export interface CapituloLivro {
  id: string;
  numero: string;
  titulo: string;
  subtitulo?: string;
  conteudo: string; // Texto formatado em Markdown com seções, citações e listas
}

export interface LivroVampiro {
  id: string;
  titulo: string;
  subtitulo: string;
  edicao: string;
  ano: string;
  categoria: 'dark_ages' | 'mascara' | 'camarilla' | 'lore_nod' | 'cla' | 'outros_clas';
  capaIcon: string;
  corTema: string;
  descricaoBreve: string;
  sinopse: string;
  capitulos: CapituloLivro[];
}

export const LIVROS_BIBLIOTECA_VAMPIRO: LivroVampiro[] = [
  // 1. Livro Básico Canônico da 1ª Edição (1197) com Disciplinas e Sistemas Completos
  LIVRO_DARK_AGES_1E,

  // 2. Os Livros de Clã (Libellus Sanguinis & Clanbooks Canônicos)
  ...LIVROS_CLANS_VAMPIRO,

  // 3. Outros Clãs (Linhagens Raras, Derivados e Criações de Fãs)
  ...LIVROS_OUTROS_CLAS,

  // 4. Obras de Lore Ancestrais e Cenário Contemporâneo / Camarilla
  ...LIVROS_MODERNOS_E_NOD,
];
