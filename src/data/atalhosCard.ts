import React from 'react';
import type { Personagem, AtalhoParadaDado } from '../types';
import { Swords, Zap, Flame, Shield, Footprints, Eye, Sparkles, Skull, Dices } from 'lucide-react';

export interface InfoTraco {
  label: string;
  tipo: 'atributo' | 'habilidade';
}

export const ICONES_DISPONIVEIS: { id: string; label: string; Icone: React.FC<{ className?: string }> }[] = [
  { id: 'Swords', label: 'Espadas (Combate / Armas)', Icone: Swords },
  { id: 'Flame', label: 'Fogo (Briga / Ataque)', Icone: Flame },
  { id: 'Zap', label: 'Raio (Iniciativa / Rapidez)', Icone: Zap },
  { id: 'Shield', label: 'Escudo (Defesa / Vigor)', Icone: Shield },
  { id: 'Footprints', label: 'Passos (Esquiva / Fuga)', Icone: Footprints },
  { id: 'Eye', label: 'Olho (Percepção / Alerta)', Icone: Eye },
  { id: 'Sparkles', label: 'Magia / Disciplinas', Icone: Sparkles },
  { id: 'Skull', label: 'Caveira (Letalidade / Morte)', Icone: Skull },
  { id: 'Dices', label: 'Dados (Geral)', Icone: Dices },
];

export function getIconeAtalho(nomeIcone?: string): React.FC<{ className?: string }> {
  const item = ICONES_DISPONIVEIS.find((i) => i.id.toLowerCase() === (nomeIcone || '').toLowerCase());
  return item ? item.Icone : Swords;
}

export const MAPA_TRACOS: Record<string, InfoTraco> = {
  // Atributos
  forca: { label: 'Força', tipo: 'atributo' },
  destreza: { label: 'Destreza', tipo: 'atributo' },
  vigor: { label: 'Vigor', tipo: 'atributo' },
  carisma: { label: 'Carisma', tipo: 'atributo' },
  manipulacao: { label: 'Manipulação', tipo: 'atributo' },
  aparencia: { label: 'Aparência', tipo: 'atributo' },
  percepcao: { label: 'Percepção', tipo: 'atributo' },
  inteligencia: { label: 'Inteligência', tipo: 'atributo' },
  raciocinio: { label: 'Raciocínio', tipo: 'atributo' },

  // Habilidades - Talentos (10 oficiais da 1ª Edição)
  representacao: { label: 'Representação', tipo: 'habilidade' },
  prontidao: { label: 'Prontidão', tipo: 'habilidade' },
  esportes: { label: 'Esportes', tipo: 'habilidade' },
  briga: { label: 'Briga', tipo: 'habilidade' },
  esquiva: { label: 'Esquiva', tipo: 'habilidade' },
  empatia: { label: 'Empatia', tipo: 'habilidade' },
  intimidacao: { label: 'Intimidação', tipo: 'habilidade' },
  crime: { label: 'Crime', tipo: 'habilidade' },
  lideranca: { label: 'Liderança', tipo: 'habilidade' },
  labia: { label: 'Lábia', tipo: 'habilidade' },

  // Habilidades - Perícias (10 oficiais da 1ª Edição)
  empatiaAnimais: { label: 'Empatia c/ Animais', tipo: 'habilidade' },
  arqueirismo: { label: 'Arqueirismo', tipo: 'habilidade' },
  artesanato: { label: 'Artesanato', tipo: 'habilidade' },
  etiqueta: { label: 'Etiqueta', tipo: 'habilidade' },
  herborismo: { label: 'Herborismo', tipo: 'habilidade' },
  armasBrancas: { label: 'Armas Brancas', tipo: 'habilidade' },
  musica: { label: 'Música', tipo: 'habilidade' },
  cavalgar: { label: 'Cavalgar', tipo: 'habilidade' },
  furtividade: { label: 'Furtividade', tipo: 'habilidade' },
  sobrevivencia: { label: 'Sobrevivência', tipo: 'habilidade' },

  // Habilidades - Conhecimentos (10 oficiais da 1ª Edição)
  instrucao: { label: 'Instrução', tipo: 'habilidade' },
  sabedoriaPopular: { label: 'Sabedoria Popular', tipo: 'habilidade' },
  investigacao: { label: 'Investigação', tipo: 'habilidade' },
  direito: { label: 'Direito', tipo: 'habilidade' },
  linguistica: { label: 'Lingüística', tipo: 'habilidade' },
  medicina: { label: 'Medicina', tipo: 'habilidade' },
  ocultismo: { label: 'Ocultismo', tipo: 'habilidade' },
  politica: { label: 'Política', tipo: 'habilidade' },
  ciencia: { label: 'Ciência', tipo: 'habilidade' },
  senescalia: { label: 'Senescalia', tipo: 'habilidade' },

  // Aliases legados (retrocompatibilidade)
  expressao: { label: 'Representação', tipo: 'habilidade' },
  ladinagem: { label: 'Crime', tipo: 'habilidade' },
  manha: { label: 'Lábia', tipo: 'habilidade' },
  tiroComArco: { label: 'Arqueirismo', tipo: 'habilidade' },
  cavalaria: { label: 'Cavalgar', tipo: 'habilidade' },
  herbalismo: { label: 'Herborismo', tipo: 'habilidade' },
  academicos: { label: 'Instrução', tipo: 'habilidade' },
  senescencia: { label: 'Senescalia', tipo: 'habilidade' },
};

export const ATALHOS_CARD_PADRAO: AtalhoParadaDado[] = [
  {
    id: 'iniciativa',
    nome: 'Iniciativa',
    traco1: 'prontidao',
    traco2: 'raciocinio',
    tipoExibicao: 'dados', // mostra em d10 (ex: 5d10)
    icone: 'Zap',
  },
  {
    id: 'ataque_arma_branca',
    nome: 'Ataque c/ arma branca',
    traco1: 'destreza',
    traco2: 'armasBrancas',
    tipoExibicao: 'dados', // mostra em d10 (ex: 5d10)
    icone: 'Swords',
  },
  {
    id: 'ataque_briga',
    nome: 'Ataque com briga',
    traco1: 'destreza',
    traco2: 'briga',
    tipoExibicao: 'dados',
    icone: 'Flame',
  },
  {
    id: 'esquiva',
    nome: 'Esquiva',
    traco1: 'esquiva',
    traco2: 'nenhum', // quantidade de esquiva como unidade (ex: 4)
    tipoExibicao: 'total', // mostra como unidade (ex: 4)
    icone: 'Footprints',
  },
  {
    id: 'vigorar',
    nome: 'Vigorar',
    traco1: 'destreza',
    traco2: 'vigor',
    tipoExibicao: 'dados',
    icone: 'Shield',
  },
];

export function calcularValorAtalho(p: Personagem, atalho: AtalhoParadaDado): number {
  const getValor = (traco: string | undefined): number => {
    if (!traco || traco === 'nenhum') return 0;
    if (traco in p.atributos) {
      return (p.atributos as Record<string, number>)[traco] || 0;
    }
    if (traco in p.habilidades) {
      return (p.habilidades as Record<string, number>)[traco] || 0;
    }
    const habMap: Record<string, string> = {
      expressao: 'representacao',
      ladinagem: 'crime',
      manha: 'labia',
      tiroComArco: 'arqueirismo',
      cavalaria: 'cavalgar',
      herbalismo: 'herborismo',
      academicos: 'instrucao',
      senescencia: 'senescalia',
    };
    if (traco in habMap && habMap[traco] in p.habilidades) {
      return (p.habilidades as Record<string, number>)[habMap[traco]] || 0;
    }
    const disc = p.disciplinas.find((d) => d.nome.toLowerCase() === traco.toLowerCase());
    if (disc) return disc.nivel;
    return 0;
  };

  return getValor(atalho.traco1) + getValor(atalho.traco2);
}
