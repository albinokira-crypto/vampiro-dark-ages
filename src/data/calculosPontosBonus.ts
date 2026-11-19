import type { Personagem, ConfiguracaoMesa } from '../types';
import { CLAS_DARK_AGES_1E } from './darkAges1e';

export interface ItemGastoBonus {
  id: string;
  categoria:
    | 'qualidade'
    | 'defeito'
    | 'atributo'
    | 'habilidade'
    | 'disciplina'
    | 'antecedente'
    | 'virtude'
    | 'vontade'
    | 'caminho';
  nome: string;
  pontos: number;
  detalhe: string;
}

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
  totalGastoGeral: number; // qualidades + traços
  totalBonusDisponivel: number;
  saldoRestante: number;
  itensDetalhados: ItemGastoBonus[];
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
 * Retorna os valores de base inicial de cada traço para saber quais bolinhas foram da cota inicial
 * e quais foram compradas com Pontos Bônus.
 */
export function obterValoresIniciaisTraços(ficha: Personagem, config?: ConfiguracaoMesa) {
  const isEmIniciais = ficha.criacao?.status === 'em_criacao' && ficha.criacao?.etapa === 'iniciais';
  const snap = ficha.criacao?.snapshotIniciais;
  const maxDisc = config?.pontosDisciplinas ?? 5;

  // Total de disciplinas de clã
  const clanDiscs = ficha.disciplinas.filter((d) => isDisciplinaDeClan(ficha, d.nome));
  const totalClan = clanDiscs.reduce((acc, d) => acc + d.nivel, 0);

  return {
    getAtributo: (chave: string): number => {
      if (isEmIniciais) return (ficha.atributos as any)[chave] ?? 1;
      if (snap?.atributos && typeof snap.atributos[chave] === 'number') {
        return snap.atributos[chave];
      }
      return (ficha.atributos as any)[chave] ?? 1;
    },
    getHabilidade: (chave: string): number => {
      if (isEmIniciais) return (ficha.habilidades as any)[chave] ?? 0;
      if (snap?.habilidades && typeof snap.habilidades[chave] === 'number') {
        return snap.habilidades[chave];
      }
      return (ficha.habilidades as any)[chave] ?? 0;
    },
    getDisciplina: (idOuNome: string): number => {
      const d = ficha.disciplinas.find(
        (item) => item.id === idOuNome || item.nome.toLowerCase() === idOuNome.toLowerCase()
      );
      if (!d) return 0;
      if (isEmIniciais) return d.nivel;

      const isClan = isDisciplinaDeClan(ficha, d.nome);
      // Se é de clã e o total de clã não ultrapassou os pontos iniciais da mesa, todas as bolinhas são iniciais!
      if (isClan && totalClan <= maxDisc) {
        return d.nivel;
      }

      if (snap?.disciplinas) {
        const item = snap.disciplinas.find(
          (sd) => sd.id === idOuNome || sd.nome.toLowerCase() === idOuNome.toLowerCase()
        );
        if (item) return item.nivel;
      }
      return isClan ? Math.min(d.nivel, maxDisc) : 0;
    },
    getAntecedente: (idOuNome: string): number => {
      const a = ficha.antecedentes.find(
        (item) => item.id === idOuNome || item.nome.toLowerCase() === idOuNome.toLowerCase()
      );
      if (!a) return 0;
      if (isEmIniciais) return a.nivel;

      if (snap?.antecedentes) {
        const item = snap.antecedentes.find(
          (sa) => sa.id === idOuNome || sa.nome.toLowerCase() === idOuNome.toLowerCase()
        );
        if (item) return item.nivel;
      }
      return a.nivel;
    },
    getVirtude: (chave: 'consciencia' | 'autocontrole' | 'coragem'): number => {
      if (isEmIniciais) return ficha.virtudes[chave] ?? 1;
      if (snap?.virtudes && typeof snap.virtudes[chave] === 'number') {
        return snap.virtudes[chave];
      }
      return ficha.virtudes[chave] ?? 1;
    },
    getForcaDeVontade: (): number => {
      if (isEmIniciais) return ficha.forcaDeVontade ?? (ficha.virtudes?.coragem || 1);
      if (snap && typeof snap.forcaDeVontade === 'number') {
        return snap.forcaDeVontade;
      }
      return ficha.virtudes?.coragem || 1;
    },
    getCaminho: (): number => {
      if (isEmIniciais) return ficha.caminhoNivel ?? 2;
      if (snap && typeof snap.caminhoNivel === 'number') {
        return snap.caminhoNivel;
      }
      const c = ficha.virtudes?.consciencia || 1;
      const a = ficha.virtudes?.autocontrole || 1;
      return Math.min(10, Math.max(1, c + a));
    },
  };
}

/**
 * Calcula detalhadamente todos os pontos bônus gastos em traços da ficha,
 * gerando um extrato analítico para o Mestre e para o painel de criação.
 */
export function calcularGastosPontosBonus(
  ficha: Personagem,
  config: ConfiguracaoMesa
): DetalhesGastosBonus {
  const snap = ficha.criacao?.snapshotIniciais;
  const itensDetalhados: ItemGastoBonus[] = [];

  // 1. Defeitos e Qualidades
  const listaQD = ficha.qualidadesDefeitos || [];
  const qualidades = listaQD.filter((i) => i.tipo === 'qualidade');
  const defeitos = listaQD.filter((i) => i.tipo === 'defeito');

  const maxDef = config.maxPontosDefeitos ?? 7;
  const defeitosGanhosBruto = defeitos.reduce((acc, d) => acc + d.custo, 0);
  const defeitosGanhos = Math.min(maxDef, defeitosGanhosBruto);
  const qualidadesGastos = qualidades.reduce((acc, q) => acc + q.custo, 0);

  defeitos.forEach((d) => {
    itensDetalhados.push({
      id: d.id,
      categoria: 'defeito',
      nome: d.nome,
      pontos: d.custo,
      detalhe: `Defeito (${d.categoria}) = +${d.custo} pts`,
    });
  });

  qualidades.forEach((q) => {
    itensDetalhados.push({
      id: q.id,
      categoria: 'qualidade',
      nome: q.nome,
      pontos: -q.custo,
      detalhe: `Qualidade (${q.categoria}) = -${q.custo} pts`,
    });
  });

  const totalBonusDisponivel = config.pontosBonus + defeitosGanhos;

  // 2. Força de Vontade (1 pt por bolinha além da base)
  const baseVontade = snap?.forcaDeVontade ?? (ficha.virtudes?.coragem || 1);
  const diffVontade = Math.max(0, (ficha.forcaDeVontade || 1) - baseVontade);
  const gastosVontade = diffVontade * 1;
  if (gastosVontade > 0) {
    itensDetalhados.push({
      id: 'vontade_extra',
      categoria: 'vontade',
      nome: 'Força de Vontade',
      pontos: -gastosVontade,
      detalhe: `+${diffVontade} bolinha${diffVontade > 1 ? 's' : ''} acima da base ${baseVontade} (1 pt cada) = -${gastosVontade} pts`,
    });
  }

  // 3. Trilha (1 pt por bolinha além da base Consciência + Autocontrole)
  const baseTrilha =
    snap?.caminhoNivel ??
    Math.min(10, Math.max(1, (ficha.virtudes?.consciencia || 1) + (ficha.virtudes?.autocontrole || 1)));
  const diffTrilha = Math.max(0, (ficha.caminhoNivel || 2) - baseTrilha);
  const gastosCaminho = diffTrilha * 1;
  if (gastosCaminho > 0) {
    itensDetalhados.push({
      id: 'caminho_extra',
      categoria: 'caminho',
      nome: 'Trilha / Caminho',
      pontos: -gastosCaminho,
      detalhe: `+${diffTrilha} bolinha${diffTrilha > 1 ? 's' : ''} acima da base ${baseTrilha} (1 pt cada) = -${gastosCaminho} pts`,
    });
  }

  // 4. Virtudes (2 pts por bolinha além dos iniciais distribuídos)
  const totalVirtudesDistribuido =
    Math.max(0, (ficha.virtudes?.consciencia || 1) - 1) +
    Math.max(0, (ficha.virtudes?.autocontrole || 1) - 1) +
    Math.max(0, (ficha.virtudes?.coragem || 1) - 1);
  const diffVirtudes = Math.max(0, totalVirtudesDistribuido - config.pontosVirtudes);
  const gastosVirtudes = diffVirtudes * 2;
  if (gastosVirtudes > 0) {
    itensDetalhados.push({
      id: 'virt_extra',
      categoria: 'virtude',
      nome: 'Virtudes',
      pontos: -gastosVirtudes,
      detalhe: `+${diffVirtudes} bolinha${diffVirtudes > 1 ? 's' : ''} acima dos ${config.pontosVirtudes} iniciais (2 pts cada) = -${gastosVirtudes} pts`,
    });
  }

  // 5. Antecedentes (1 pt por bolinha além dos iniciais)
  const totalAntecedentes = ficha.antecedentes.reduce((acc, a) => acc + (a.nivel || 0), 0);
  const diffAntecedentes = Math.max(0, totalAntecedentes - config.pontosAntecedentes);
  const gastosAntecedentes = diffAntecedentes * 1;
  if (gastosAntecedentes > 0) {
    itensDetalhados.push({
      id: 'ant_extra',
      categoria: 'antecedente',
      nome: 'Antecedentes',
      pontos: -gastosAntecedentes,
      detalhe: `+${diffAntecedentes} bolinha${diffAntecedentes > 1 ? 's' : ''} acima dos ${config.pontosAntecedentes} iniciais (1 pt cada) = -${gastosAntecedentes} pts`,
    });
  }

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

  const diffFisicos = Math.max(0, gastosFisicos - getLimiteAtrib('fisicos'));
  const diffSociais = Math.max(0, gastosSociais - getLimiteAtrib('sociais'));
  const diffMentais = Math.max(0, gastosMentais - getLimiteAtrib('mentais'));

  const gastosAtributos = diffFisicos * 5 + diffSociais * 5 + diffMentais * 5;

  if (diffFisicos > 0) {
    itensDetalhados.push({
      id: 'atrib_fisicos',
      categoria: 'atributo',
      nome: 'Atributos Físicos',
      pontos: -diffFisicos * 5,
      detalhe: `+${diffFisicos} bolinha${diffFisicos > 1 ? 's' : ''} além do limite de ${getLimiteAtrib('fisicos')} (5 pts cada) = -${diffFisicos * 5} pts`,
    });
  }
  if (diffSociais > 0) {
    itensDetalhados.push({
      id: 'atrib_sociais',
      categoria: 'atributo',
      nome: 'Atributos Sociais',
      pontos: -diffSociais * 5,
      detalhe: `+${diffSociais} bolinha${diffSociais > 1 ? 's' : ''} além do limite de ${getLimiteAtrib('sociais')} (5 pts cada) = -${diffSociais * 5} pts`,
    });
  }
  if (diffMentais > 0) {
    itensDetalhados.push({
      id: 'atrib_mentais',
      categoria: 'atributo',
      nome: 'Atributos Mentais',
      pontos: -diffMentais * 5,
      detalhe: `+${diffMentais} bolinha${diffMentais > 1 ? 's' : ''} além do limite de ${getLimiteAtrib('mentais')} (5 pts cada) = -${diffMentais * 5} pts`,
    });
  }

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
    ((hab.representacao ?? (hab as any).expressao) || 0) +
    (hab.prontidao || 0) +
    (hab.esportes || 0) +
    (hab.briga || 0) +
    (hab.esquiva || 0) +
    (hab.empatia || 0) +
    (hab.intimidacao || 0) +
    ((hab.crime ?? (hab as any).ladinagem) || 0) +
    (hab.lideranca || 0) +
    ((hab.labia ?? (hab as any).manha) || 0);

  const gastosPericias =
    (hab.empatiaAnimais || 0) +
    ((hab.arqueirismo ?? (hab as any).tiroComArco) || 0) +
    (hab.artesanato || 0) +
    (hab.etiqueta || 0) +
    ((hab.herborismo ?? (hab as any).herbalismo) || 0) +
    (hab.armasBrancas || 0) +
    (hab.musica || 0) +
    ((hab.cavalgar ?? (hab as any).cavalaria) || 0) +
    (hab.furtividade || 0) +
    (hab.sobrevivencia || 0);

  const gastosConhecimentos =
    ((hab.instrucao ?? (hab as any).academicos) || 0) +
    (hab.sabedoriaPopular || 0) +
    (hab.investigacao || 0) +
    (hab.direito || 0) +
    (hab.linguistica || 0) +
    (hab.medicina || 0) +
    (hab.ocultismo || 0) +
    (hab.politica || 0) +
    (hab.ciencia || 0) +
    ((hab.senescalia ?? (hab as any).senescencia) || 0);

  const diffTalentos = Math.max(0, gastosTalentos - getLimiteHabil('talentos'));
  const diffPericias = Math.max(0, gastosPericias - getLimiteHabil('pericias'));
  const diffConhecimentos = Math.max(0, gastosConhecimentos - getLimiteHabil('conhecimentos'));

  const gastosHabilidades = diffTalentos * 2 + diffPericias * 2 + diffConhecimentos * 2;

  if (diffTalentos > 0) {
    itensDetalhados.push({
      id: 'hab_talentos',
      categoria: 'habilidade',
      nome: 'Talentos',
      pontos: -diffTalentos * 2,
      detalhe: `+${diffTalentos} bolinha${diffTalentos > 1 ? 's' : ''} além do limite de ${getLimiteHabil('talentos')} (2 pts cada) = -${diffTalentos * 2} pts`,
    });
  }
  if (diffPericias > 0) {
    itensDetalhados.push({
      id: 'hab_pericias',
      categoria: 'habilidade',
      nome: 'Perícias',
      pontos: -diffPericias * 2,
      detalhe: `+${diffPericias} bolinha${diffPericias > 1 ? 's' : ''} além do limite de ${getLimiteHabil('pericias')} (2 pts cada) = -${diffPericias * 2} pts`,
    });
  }
  if (diffConhecimentos > 0) {
    itensDetalhados.push({
      id: 'hab_conhecimentos',
      categoria: 'habilidade',
      nome: 'Conhecimentos',
      pontos: -diffConhecimentos * 2,
      detalhe: `+${diffConhecimentos} bolinha${diffConhecimentos > 1 ? 's' : ''} além do limite de ${getLimiteHabil('conhecimentos')} (2 pts cada) = -${diffConhecimentos * 2} pts`,
    });
  }

  // 8. Disciplinas
  // - Disciplinas de Clã: até config.pontosDisciplinas pertencem à cota inicial gratuita (0 pts bônus).
  //   Apenas o excesso além da cota inicial custa 5 pts bônus por bolinha.
  // - Outras Disciplinas (fora do clã): 1ª bolinha = 10 pts bônus; seguintes = 7 pts cada.
  let gastosDisciplinas = 0;
  let pontosClanTotal = 0;

  ficha.disciplinas.forEach((d) => {
    const isClan = isDisciplinaDeClan(ficha, d.nome);
    if (isClan) {
      pontosClanTotal += d.nivel;
    } else {
      const custoOutra = calcularCustoBonusDisciplina(false, d.nivel, 0);
      if (custoOutra > 0) {
        gastosDisciplinas += custoOutra;
        itensDetalhados.push({
          id: 'disc_outra_' + d.id,
          categoria: 'disciplina',
          nome: d.nome,
          pontos: -custoOutra,
          detalhe: `Disciplina fora do clã (${d.nome} nível ${d.nivel}) = -${custoOutra} pts`,
        });
      }
    }
  });

  const excessoClan = Math.max(0, pontosClanTotal - config.pontosDisciplinas);
  if (excessoClan > 0) {
    const custoClan = excessoClan * 5;
    gastosDisciplinas += custoClan;
    itensDetalhados.push({
      id: 'disc_clan_excesso',
      categoria: 'disciplina',
      nome: 'Disciplinas de Clã',
      pontos: -custoClan,
      detalhe: `+${excessoClan} bolinha${excessoClan > 1 ? 's' : ''} além dos ${config.pontosDisciplinas} iniciais (5 pts cada) = -${custoClan} pts`,
    });
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
    totalGastoGeral,
    totalBonusDisponivel,
    saldoRestante,
    itensDetalhados,
  };
}
