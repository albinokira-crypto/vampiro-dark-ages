import type { Personagem, ConfiguracaoMesa } from '../types';
import { CLAS_DARK_AGES_1E } from './darkAges1e';

export interface DetalhesGastosBonus {
  atributos: number;
  habilidades: number;
  disciplinas: number;
  antecedentes: number;
  virtudes: number;
  forcaDeVontade: number;
  caminho: number;
  qualidades: number;
  defeitosGanhos: number;
  totalGastoTraços: number;
  totalBonusDisponivel: number;
  saldoRestante: number;
}

/**
 * Retorna se uma disciplina é considerada de clã para o personagem.
 */
export function isDisciplinaDeClan(ficha: Personagem, nomeOuIdDisciplina: string): boolean {
  const claEncontrado = CLAS_DARK_AGES_1E.find(
    (c) => c.nome.toLowerCase() === (ficha.cla || '').toLowerCase()
  );
  if (!claEncontrado) return false;

  const disc = ficha.disciplinas.find(
    (d) => d.id === nomeOuIdDisciplina || d.nome.toLowerCase() === nomeOuIdDisciplina.toLowerCase()
  );
  const nome = disc ? disc.nome : nomeOuIdDisciplina;

  return claEncontrado.disciplinas.some(
    (cd) => cd.toLowerCase() === nome.toLowerCase()
  );
}

/**
 * Calcula o custo em pontos bônus de uma disciplina individual:
 * - Disciplina de clã: 1ª bolinha = 10 pts bônus (se começou zerada nos iniciais);
 *   próximas bolinhas custam 5 pts bônus cada.
 * - Outra disciplina (fora do clã): 1ª bolinha = 10 pts bônus;
 *   próximas bolinhas custam 7 pts bônus cada.
 */
export function calcularCustoBonusDisciplina(
  isClan: boolean,
  nivelAtual: number,
  nivelBaseInicial: number = 0
): number {
  if (nivelAtual <= nivelBaseInicial) return 0;

  let custo = 0;
  for (let n = nivelBaseInicial; n < nivelAtual; n++) {
    if (n === 0) {
      // 1ª bolinha sempre custa 10 pontos bônus se o personagem não a possuía nos iniciais
      custo += 10;
    } else if (isClan) {
      // Bolinhas seguintes na disciplina de clã custam 5 pontos cada
      custo += 5;
    } else {
      // Bolinhas seguintes em outras disciplinas custam 7 pontos cada
      custo += 7;
    }
  }
  return custo;
}

/**
 * Calcula detalhadamente todos os pontos bônus gastos em traços da ficha.
 */
export function calcularGastosPontosBonus(
  ficha: Personagem,
  config: ConfiguracaoMesa
): DetalhesGastosBonus {
  const snap = ficha.criacao?.snapshotIniciais;

  // 1. Defeitos e Qualidades
  const listaQD = ficha.qualidadesDefeitos || [];
  const qualidades = listaQD.filter((i) => i.tipo === 'qualidade');
  const defeitos = listaQD.filter((i) => i.tipo === 'defeito');

  const maxDef = config.maxPontosDefeitos ?? 7;
  const defeitosGanhosBruto = defeitos.reduce((acc, d) => acc + d.custo, 0);
  const defeitosGanhos = Math.min(maxDef, defeitosGanhosBruto);
  const qualidadesGastos = qualidades.reduce((acc, q) => acc + q.custo, 0);

  const totalBonusDisponivel = config.pontosBonus + defeitosGanhos;

  // 2. Força de Vontade (1 pt por bolinha além da base)
  const baseVontade = snap?.forcaDeVontade ?? (ficha.virtudes?.coragem || 1);
  const gastosVontade = Math.max(0, (ficha.forcaDeVontade || 1) - baseVontade) * 1;

  // 3. Trilha (1 pt por bolinha além da base Consciência + Autocontrole)
  const baseTrilha =
    snap?.caminhoNivel ??
    Math.min(10, Math.max(1, (ficha.virtudes?.consciencia || 1) + (ficha.virtudes?.autocontrole || 1)));
  const gastosCaminho = Math.max(0, (ficha.caminhoNivel || 2) - baseTrilha) * 1;

  // 4. Virtudes (2 pts por bolinha além dos 7 iniciais distribuídos)
  const totalVirtudesDistribuido =
    Math.max(0, (ficha.virtudes?.consciencia || 1) - 1) +
    Math.max(0, (ficha.virtudes?.autocontrole || 1) - 1) +
    Math.max(0, (ficha.virtudes?.coragem || 1) - 1);
  const gastosVirtudes = Math.max(0, totalVirtudesDistribuido - config.pontosVirtudes) * 2;

  // 5. Antecedentes (1 pt por bolinha além dos 5 iniciais)
  const totalAntecedentes = ficha.antecedentes.reduce((acc, a) => acc + (a.nivel || 0), 0);
  const gastosAntecedentes = Math.max(0, totalAntecedentes - config.pontosAntecedentes) * 1;

  // 6. Atributos (5 pts por bolinha além das prioridades 7/5/3)
  const prioridadesAtrib = ficha.criacao?.prioridadesAtributos || {
    primario: 'fisicos',
    secundario: 'sociais',
    terciario: 'mentais',
  };
  const getLimiteAtrib = (cat: 'fisicos' | 'sociais' | 'mentais') => {
    if (prioridadesAtrib.primario === cat) return config.pontosAtributos.primario;
    if (prioridadesAtrib.secundario === cat) return config.pontosAtributos.secundario;
    return config.pontosAtributos.terciario;
  };

  const gastosFisicos =
    Math.max(0, (ficha.atributos.forca || 1) - 1) +
    Math.max(0, (ficha.atributos.destreza || 1) - 1) +
    Math.max(0, (ficha.atributos.vigor || 1) - 1);
  const gastosSociais =
    Math.max(0, (ficha.atributos.carisma || 1) - 1) +
    Math.max(0, (ficha.atributos.manipulacao || 1) - 1) +
    Math.max(0, (ficha.atributos.aparencia || 1) - 1);
  const gastosMentais =
    Math.max(0, (ficha.atributos.percepcao || 1) - 1) +
    Math.max(0, (ficha.atributos.inteligencia || 1) - 1) +
    Math.max(0, (ficha.atributos.raciocinio || 1) - 1);

  const gastosAtributos =
    Math.max(0, gastosFisicos - getLimiteAtrib('fisicos')) * 5 +
    Math.max(0, gastosSociais - getLimiteAtrib('sociais')) * 5 +
    Math.max(0, gastosMentais - getLimiteAtrib('mentais')) * 5;

  // 7. Habilidades (2 pts por bolinha além das prioridades 13/9/5)
  const prioridadesHabil = ficha.criacao?.prioridadesHabilidades || {
    primario: 'talentos',
    secundario: 'pericias',
    terciario: 'conhecimentos',
  };
  const getLimiteHabil = (cat: 'talentos' | 'pericias' | 'conhecimentos') => {
    if (prioridadesHabil.primario === cat) return config.pontosHabilidades.primario;
    if (prioridadesHabil.secundario === cat) return config.pontosHabilidades.secundario;
    return config.pontosHabilidades.terciario;
  };

  const hab = ficha.habilidades;
  const gastosTalentos =
    (hab.prontidao || 0) +
    (hab.esportes || 0) +
    (hab.briga || 0) +
    (hab.esquiva || 0) +
    (hab.empatia || 0) +
    (hab.expressao || 0) +
    (hab.intimidacao || 0) +
    (hab.lideranca || 0) +
    (hab.ladinagem || 0) +
    (hab.manha || 0);

  const gastosPericias =
    (hab.empatiaAnimais || 0) +
    (hab.tiroComArco || 0) +
    (hab.artesanato || 0) +
    (hab.cavalaria || 0) +
    (hab.etiqueta || 0) +
    (hab.herbalismo || 0) +
    (hab.armasBrancas || 0) +
    (hab.musica || 0) +
    (hab.sobrevivencia || 0);

  const gastosConhecimentos =
    (hab.academicos || 0) +
    (hab.sabedoriaPopular || 0) +
    (hab.investigacao || 0) +
    (hab.direito || 0) +
    (hab.linguistica || 0) +
    (hab.medicina || 0) +
    (hab.ocultismo || 0) +
    (hab.politica || 0) +
    (hab.senescencia || 0);

  const gastosHabilidades =
    Math.max(0, gastosTalentos - getLimiteHabil('talentos')) * 2 +
    Math.max(0, gastosPericias - getLimiteHabil('pericias')) * 2 +
    Math.max(0, gastosConhecimentos - getLimiteHabil('conhecimentos')) * 2;

  // 8. Disciplinas
  // - Clan: 1ª bola = 10 pts (se começou com 0 nos iniciais); seguintes = 5 pts cada.
  // - Outras: 1ª bola = 10 pts; seguintes = 7 pts cada.
  let gastosDisciplinas = 0;
  const snapDisciplinas = snap?.disciplinas;

  if (snapDisciplinas && snapDisciplinas.length > 0) {
    ficha.disciplinas.forEach((d) => {
      const isClan = isDisciplinaDeClan(ficha, d.nome);
      const snapItem = snapDisciplinas.find(
        (sd) => sd.id === d.id || sd.nome.toLowerCase() === d.nome.toLowerCase()
      );
      const nivelBase = snapItem ? snapItem.nivel : 0;
      gastosDisciplinas += calcularCustoBonusDisciplina(isClan, d.nivel, nivelBase);
    });
  } else {
    // Sem snapshot registrado (ficha já criada anteriormente ou em migração):
    // As primeiras 3 bolinhas totais entre disciplinas de clã foram os 3 pontos iniciais gratuitos.
    let pontosClanTotal = 0;
    ficha.disciplinas.forEach((d) => {
      const isClan = isDisciplinaDeClan(ficha, d.nome);
      if (isClan) {
        pontosClanTotal += d.nivel;
      } else {
        // Disciplina fora do clã sem snapshot: 1ª bola = 10 pts, seguintes = 7 pts cada
        gastosDisciplinas += calcularCustoBonusDisciplina(false, d.nivel, 0);
      }
    });
    const excessoClan = Math.max(0, pontosClanTotal - config.pontosDisciplinas);
    gastosDisciplinas += excessoClan * 5;
  }

  const totalGastoTraços =
    gastosAtributos +
    gastosHabilidades +
    gastosDisciplinas +
    gastosAntecedentes +
    gastosVirtudes +
    gastosVontade +
    gastosCaminho;

  const totalGastoGeral = totalGastoTraços + qualidadesGastos;
  const saldoRestante = totalBonusDisponivel - totalGastoGeral;

  return {
    atributos: gastosAtributos,
    habilidades: gastosHabilidades,
    disciplinas: gastosDisciplinas,
    antecedentes: gastosAntecedentes,
    virtudes: gastosVirtudes,
    forcaDeVontade: gastosVontade,
    caminho: gastosCaminho,
    qualidades: qualidadesGastos,
    defeitosGanhos,
    totalGastoTraços,
    totalBonusDisponivel,
    saldoRestante,
  };
}
