import React, { useState, useEffect, useCallback } from 'react';
import type {
  Personagem,
  User,
  ItemSimplesNivel,
  Arma,
  Armadura,
  LacoDeSangue,
  Perturbacao,
  Ritual,
  CategoriaAtributo,
  CategoriaHabilidade,
  QualidadeDefeitoItem,
} from '../types';
import { Bolinhas } from './Bolinhas';
import { QuadradosStatus } from './QuadradosStatus';
import { VitalidadeSelector } from './VitalidadeSelector';
import { InlineField } from './InlineField';
import { SelectDarkAgesField } from './SelectDarkAgesField';
import { PainelCriacaoFicha } from './PainelCriacaoFicha';
import { FotoPersonagem } from './FotoPersonagem';
import { storageService, normalizarPersonagem, ajustarVitalidadeCorpoGrande } from '../services/storage';
import {
  CLAS_DARK_AGES_1E,
  ARQUETIPOS_PERSONALIDADE_1E,
  ANTECEDENTES_LIVRO_1E,
  DISCIPLINAS_LIVRO_1E,
  TABELA_GERACAO_1E,
  TRILHAS_DARK_AGES_1E,
  calcularGeracaoEpoolSangue,
} from '../data/darkAges1e';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Shield,
  Swords,
  Scroll,
  Sparkles,
  BookOpen,
  UserCircle,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  X,
  ChevronDown,
  SlidersHorizontal,
  Pencil,
} from 'lucide-react';
import { ModalConfigAtalhosPersonagem } from './ModalConfigAtalhosPersonagem';

interface FichaPersonagemProps {
  personagem: Personagem;
  usuarioAtual: User;
  onSalvar: (personagemAtualizado: Personagem) => void;
  onVoltar: () => void;
}

export const FichaPersonagem: React.FC<FichaPersonagemProps> = ({
  personagem,
  usuarioAtual,
  onSalvar,
  onVoltar,
}) => {
  const [ficha, setFicha] = useState<Personagem>(() => normalizarPersonagem(personagem));
  const [configMesa, setConfigMesa] = useState(() => storageService.getConfiguracaoMesa());
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [abaAtiva, setAbaAtiva] = useState<'secao1' | 'secao2' | 'secao3'>('secao1');
  const [mensagemSalvo, setMensagemSalvo] = useState<boolean>(false);
  const [feedbackSincronizacao, setFeedbackSincronizacao] = useState<string | null>(null);

  // Sistema de Transações de XP e Desfazer
  interface TransacaoXP {
    id: string;
    descricao: string;
    custoXP: number;
    estadoAnterior: Personagem;
  }
  const [historicoTransacoesXP, setHistoricoTransacoesXP] = useState<TransacaoXP[]>([]);
  const [avisoXP, setAvisoXP] = useState<string | null>(null);
  const [sucessoXP, setSucessoXP] = useState<string | null>(null);

  useEffect(() => {
    storageService.carregarConfiguracaoMesaRemota().then((remoto) => {
      if (remoto) setConfigMesa(remoto);
    });
  }, []);

  // Estados dos Modais de Disciplina e Antecedente (1ª Edição)
  const [modalAddDisciplinaAberto, setModalAddDisciplinaAberto] = useState(false);
  const [discSelecionada, setDiscSelecionada] = useState<string>('');
  const [discCustomNome, setDiscCustomNome] = useState<string>('');
  const [discNivelInicial, setDiscNivelInicial] = useState<number>(1);

  const [modalAddAntecedenteAberto, setModalAddAntecedenteAberto] = useState(false);
  const [antSelecionado, setAntSelecionado] = useState<string>('Aliados');
  const [antCustomNome, setAntCustomNome] = useState<string>('');
  const [antNivelInicial, setAntNivelInicial] = useState<number>(1);

  // Modal de Configuração de Atalhos do Card
  const [modalAtalhosAberto, setModalAtalhosAberto] = useState(false);

  // Cálculo de Custo Exato em XP
  const calcularCustoXP = (
    tipo: 'atributo' | 'habilidade' | 'disciplina' | 'trilha' | 'vontade' | 'caminho',
    atual: number,
    novo: number,
    extra?: { isPrimaria?: boolean; isClan?: boolean }
  ): number => {
    if (novo <= atual) return 0;
    let total = 0;
    for (let n = atual; n < novo; n++) {
      switch (tipo) {
        case 'atributo':
          // Atributo: Nível Atual x 4
          total += n * 4;
          break;
        case 'habilidade':
          // Habilidade nova 1ª bola = 3 XP; Nível atual x 2
          total += n === 0 ? 3 : n * 2;
          break;
        case 'disciplina':
          // Nova disciplina 1ª bola = 10 XP; Clan = nivel * 5; Outras = nivel * 7
          if (n === 0) {
            total += 10;
          } else if (extra?.isClan) {
            total += n * 5;
          } else {
            total += n * 7;
          }
          break;
        case 'trilha':
          // Nova trilha 1ª bola = 7 XP; Primária = nivel * 4; Outras = nivel * 5
          if (n === 0) {
            total += 7;
          } else if (extra?.isPrimaria) {
            total += n * 4;
          } else {
            total += n * 5;
          }
          break;
        case 'vontade':
          // Próximo nível custa o nível atual
          total += n;
          break;
        case 'caminho':
          // Nível atual x 2
          total += n * 2;
          break;
      }
    }
    return total;
  };

  const tentarEvoluirComXP = (
    tipo: 'atributo' | 'habilidade' | 'disciplina' | 'trilha' | 'vontade' | 'caminho',
    nomeItem: string,
    valorAtual: number,
    novoValor: number,
    aplicarMudanca: (prev: Personagem) => Personagem,
    extra?: { isPrimaria?: boolean; isClan?: boolean }
  ) => {
    const isEmCriacao = ficha.criacao?.status === 'em_criacao';
    const isNpc = ficha.tipo === 'npc';

    // Se estiver em modo de criação, for NPC ou diminuindo o valor diretamente
    if (isNpc || isEmCriacao || novoValor < valorAtual) {
      updateFicha(aplicarMudanca);
      return;
    }

    if (novoValor === valorAtual) return;

    const custo = calcularCustoXP(tipo, valorAtual, novoValor, extra);
    const xpDisponivel = ficha.xp.atual || 0;

    if (xpDisponivel < custo) {
      setAvisoXP(
        `XP Insuficiente! Você possui ${xpDisponivel} XP, mas evoluir ${nomeItem} de ${valorAtual} para ${novoValor} custa ${custo} XP.`
      );
      setTimeout(() => setAvisoXP(null), 5000);
      return;
    }

    const estadoAnterior = JSON.parse(JSON.stringify(ficha));
    const descricao = `${nomeItem} de ${valorAtual} para ${novoValor}`;
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const novaLinhaHistorico = `- ${custo} XP: ${descricao} às ${hora}`;

    setFicha((prev) => {
      const mutada = aplicarMudanca(prev);
      return {
        ...mutada,
        xp: {
          ...mutada.xp,
          atual: Math.max(0, mutada.xp.atual - custo),
          totalGasto: mutada.xp.totalGasto + custo,
          historico: novaLinhaHistorico + (mutada.xp.historico ? '\n' + mutada.xp.historico : ''),
        },
      };
    });

    setHistoricoTransacoesXP((prev) => [
      {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 4),
        descricao,
        custoXP: custo,
        estadoAnterior,
      },
      ...prev,
    ]);
    setHasChanges(true);
    setSucessoXP(`✓ ${descricao} (-${custo} XP).`);
    setTimeout(() => setSucessoXP(null), 4000);

    // Registrar log em tempo real para o Mestre da Mesa
    storageService.registrarLogAlteracao({
      personagemId: ficha.id,
      personagemNome: ficha.nome,
      jogadorNome: ficha.jogador || usuarioAtual.nome,
      tipo: 'xp',
      descricao: `Gasto de XP: ${descricao} (-${custo} XP)`,
      detalhes: `XP Restante: ${xpDisponivel - custo}`,
    });
  };

  const handleDesfazerUltimaCompra = () => {
    if (historicoTransacoesXP.length === 0) return;
    const [ultima, ...resto] = historicoTransacoesXP;
    setFicha(ultima.estadoAnterior);
    setHistoricoTransacoesXP(resto);
    setHasChanges(true);
    setSucessoXP(`↩ Revertido: ${ultima.descricao} (+${ultima.custoXP} XP devolvido).`);
    setTimeout(() => setSucessoXP(null), 4000);

    // Registrar log em tempo real da reversão para o Mestre
    storageService.registrarLogAlteracao({
      personagemId: ficha.id,
      personagemNome: ficha.nome,
      jogadorNome: ficha.jogador || usuarioAtual.nome,
      tipo: 'xp',
      descricao: `Reversão de Ponto: ${ultima.descricao} (+${ultima.custoXP} XP devolvido)`,
    });
  };

  // Permissão de edição: Mestre pode editar tudo; Jogador só pode editar a sua própria ficha
  const podeEditar =
    usuarioAtual.role === 'mestre' || ficha.usuarioId === usuarioAtual.id;

  // Atualizar quando mudar o personagem passado por prop e normalizar automaticamente
  useEffect(() => {
    const norm = normalizarPersonagem(personagem);
    setFicha(norm);
    setHasChanges(false);

    // Se a ficha existente no banco/storage tinha valores antigos (ex: 2 de caminho ou 1 de força de vontade),
    // salvar imediatamente a correção no Cloudflare D1 e cache local!
    if (
      norm.caminhoNivel !== personagem.caminhoNivel ||
      norm.forcaDeVontade !== personagem.forcaDeVontade ||
      norm.pontosDeSangueMax !== personagem.pontosDeSangueMax
    ) {
      storageService.salvarPersonagem(norm);
    }
  }, [personagem.id]);

  // Listener para atalho de teclado Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (podeEditar) {
          handleSalvar();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ficha, podeEditar]);

  const handleSalvar = useCallback(() => {
    if (!podeEditar) return;
    onSalvar(ficha);
    setHasChanges(false);
    setMensagemSalvo(true);
    setTimeout(() => setMensagemSalvo(false), 3000);
  }, [ficha, onSalvar, podeEditar]);

  const handleVoltarComAviso = () => {
    if (hasChanges) {
      if (
        confirm(
          'Você tem alterações não salvas nesta ficha. Deseja sair mesmo assim e perder as modificações?'
        )
      ) {
        onVoltar();
      }
    } else {
      onVoltar();
    }
  };

  // Funções genéricas de mutação com marcação de alterações
  const updateFicha = (updater: (prev: Personagem) => Personagem) => {
    if (!podeEditar) return;
    setFicha((prev) => {
      const nova = updater(prev);
      return nova;
    });
    setHasChanges(true);
  };

  // Atualização de campos simples no topo
  const handleHeaderChange = (campo: keyof Personagem, valor: string) => {
    updateFicha((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // Atualização de atributos com cálculo automático de XP
  const handleAtributoChange = (
    nome: keyof Personagem['atributos'],
    valor: number
  ) => {
    const atual = ficha.atributos[nome];
    tentarEvoluirComXP(
      'atributo',
      `Atributo ${nome.toUpperCase()}`,
      atual,
      valor,
      (prev) => ({
        ...prev,
        atributos: {
          ...prev.atributos,
          [nome]: valor,
        },
      })
    );
  };

  // Atualização de habilidades com cálculo automático de XP
  const handleHabilidadeChange = (
    nome: keyof Personagem['habilidades'],
    valor: number
  ) => {
    const atual = ficha.habilidades[nome] ?? 0;
    tentarEvoluirComXP(
      'habilidade',
      `Habilidade ${nome.toUpperCase()}`,
      atual,
      valor,
      (prev) => ({
        ...prev,
        habilidades: {
          ...prev.habilidades,
          [nome]: valor,
        },
      })
    );
  };

  // Sincronizar geração e reserva de sangue baseando-se no antecedente 'Geração' (1ª Edição 1996)
  const sincronizarGeracaoPorAntecedente = (
    antecedentes: ItemSimplesNivel[]
  ): { geracao: string; sangueMax: number } => {
    const antGeracao = antecedentes.find(
      (a) =>
        a.nome.toLowerCase().trim() === 'geração' ||
        a.nome.toLowerCase().trim() === 'geracao'
    );
    const pontos = antGeracao ? antGeracao.nivel : 0;
    const info = calcularGeracaoEpoolSangue(pontos);
    return {
      geracao: info.geracaoNome,
      sangueMax: info.reservaSangueMax,
    };
  };

  // Seleção e troca de Clã com inclusão automática das 3 disciplinas canônicas da 1ª Edição
  const handleClanChange = (novoClaNome: string) => {
    const claEncontrado = CLAS_DARK_AGES_1E.find(
      (c) => c.nome.toLowerCase() === novoClaNome.toLowerCase()
    );

    updateFicha((prev) => {
      let novasDisciplinas = [...prev.disciplinas];
      const novasPrimariasIds: string[] = [];

      if (claEncontrado) {
        const claAnterior = CLAS_DARK_AGES_1E.find(
          (c) => c.nome.toLowerCase() === (prev.cla || '').toLowerCase()
        );
        const ehPadrao =
          prev.disciplinas.length === 0 ||
          (claAnterior &&
            prev.disciplinas.length <= 3 &&
            prev.disciplinas.every(
              (d) =>
                claAnterior.disciplinas.some(
                  (cd) => cd.toLowerCase() === d.nome.toLowerCase()
                ) && d.nivel <= 1
            ));

        if (ehPadrao) {
          // Substitui diretamente pelas 3 disciplinas canônicas do novo clã (zeradas para distribuição livre)
          novasDisciplinas = claEncontrado.disciplinas.map((discNome) => {
            const id = 'disc_' + Math.random().toString(36).substring(2, 9);
            novasPrimariasIds.push(id);
            return {
              id,
              nome: discNome,
              nivel: 0,
            };
          });
        } else {
          // Garante que as 3 disciplinas do novo clã estejam na lista
          claEncontrado.disciplinas.forEach((discNome) => {
            const existente = novasDisciplinas.find(
              (d) => d.nome.toLowerCase() === discNome.toLowerCase()
            );
            if (existente) {
              novasPrimariasIds.push(existente.id);
            } else {
              const novoId = 'disc_' + Math.random().toString(36).substring(2, 9);
              novasDisciplinas.push({
                id: novoId,
                nome: discNome,
                nivel: 0,
              });
              novasPrimariasIds.push(novoId);
            }
          });
        }
      }

      // Auto-preenche fraqueza se estiver vazia ou pertencer ao clã anterior
      let novaFraqueza = prev.fraqueza;
      if (claEncontrado?.fraqueza) {
        const claAnterior = CLAS_DARK_AGES_1E.find(
          (c) => c.nome.toLowerCase() === (prev.cla || '').toLowerCase()
        );
        if (!prev.fraqueza || (claAnterior?.fraqueza && prev.fraqueza === claAnterior.fraqueza)) {
          novaFraqueza = claEncontrado.fraqueza;
        }
      }

      return {
        ...prev,
        cla: novoClaNome,
        fraqueza: novaFraqueza,
        disciplinas: novasDisciplinas,
        criacao: prev.criacao
          ? {
              ...prev.criacao,
              disciplinasPrimariasIds:
                novasPrimariasIds.length > 0
                  ? novasPrimariasIds
                  : prev.criacao.disciplinasPrimariasIds,
            }
          : prev.criacao,
      };
    });
  };

  // Alteração de geração sincronizada com o Antecedente Geração
  const handleGeracaoChange = (novaGeracaoStr: string) => {
    let pontos = 0;
    for (let p = 0; p <= 9; p++) {
      if (TABELA_GERACAO_1E[p] && novaGeracaoStr.includes(TABELA_GERACAO_1E[p].geracaoNome)) {
        pontos = p;
        break;
      }
    }

    const info = calcularGeracaoEpoolSangue(pontos);

    updateFicha((prev) => {
      let novosAntecedentes = [...prev.antecedentes];
      const indexGeracao = novosAntecedentes.findIndex(
        (a) =>
          a.nome.toLowerCase().trim() === 'geração' ||
          a.nome.toLowerCase().trim() === 'geracao'
      );

      if (pontos > 0) {
        if (indexGeracao >= 0) {
          novosAntecedentes[indexGeracao] = {
            ...novosAntecedentes[indexGeracao],
            nome: 'Geração',
            nivel: pontos,
          };
        } else {
          novosAntecedentes.push({
            id: 'ant_geracao_' + Date.now().toString(36),
            nome: 'Geração',
            nivel: pontos,
          });
        }
      } else {
        if (indexGeracao >= 0) {
          novosAntecedentes = novosAntecedentes.filter((_, i) => i !== indexGeracao);
        }
      }

      return {
        ...prev,
        geracao: info.geracaoNome,
        pontosDeSangueMax: info.reservaSangueMax,
        pontosDeSangueAtual: Math.min(prev.pontosDeSangueAtual, info.reservaSangueMax),
        antecedentes: novosAntecedentes,
      };
    });
  };

  // Disciplinas
  const handleAbrirModalAddDisciplina = () => {
    const disponiveis = DISCIPLINAS_LIVRO_1E.filter(
      (d) => !ficha.disciplinas.some((fd) => fd.nome.toLowerCase() === d.toLowerCase())
    );
    setDiscSelecionada(disponiveis.length > 0 ? disponiveis[0] : '__custom__');
    setDiscCustomNome('');
    setDiscNivelInicial(1);
    setModalAddDisciplinaAberto(true);
  };

  const handleConfirmarNovaDisciplina = () => {
    const nomeFinal =
      discSelecionada === '__custom__'
        ? discCustomNome.trim()
        : discSelecionada || 'Nova Disciplina';
    if (!nomeFinal) return;

    const nova: ItemSimplesNivel = {
      id: 'disc_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      nome: nomeFinal,
      nivel: Math.max(1, Math.min(isNpc ? 10 : 8, discNivelInicial)),
    };

    updateFicha((prev) => ({
      ...prev,
      disciplinas: [...prev.disciplinas, nova],
    }));

    setModalAddDisciplinaAberto(false);
    setDiscCustomNome('');
    setDiscNivelInicial(1);
  };

  const handleRemoverDisciplina = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      disciplinas: prev.disciplinas.filter((d) => d.id !== id),
    }));
  };

  const handleEditarDisciplina = (
    id: string,
    campo: 'nome' | 'nivel',
    valor: string | number
  ) => {
    if (campo === 'nivel') {
      const disc = ficha.disciplinas.find((d) => d.id === id);
      if (!disc) return;
      const claEncontrado = CLAS_DARK_AGES_1E.find(
        (c) => c.nome.toLowerCase() === (ficha.cla || '').toLowerCase()
      );
      const isClan =
        ficha.criacao?.disciplinasPrimariasIds?.includes(id) ||
        (claEncontrado &&
          claEncontrado.disciplinas.some(
            (cd) => cd.toLowerCase() === disc.nome.toLowerCase()
          )) ||
        ficha.disciplinas.findIndex((d) => d.id === id) < 3;

      tentarEvoluirComXP(
        'disciplina',
        `Disciplina ${disc.nome || 'Sem Nome'}`,
        disc.nivel,
        Number(valor),
        (prev) => ({
          ...prev,
          disciplinas: prev.disciplinas.map((d) =>
            d.id === id ? { ...d, nivel: Number(valor) } : d
          ),
        }),
        { isClan }
      );
    } else {
      updateFicha((prev) => ({
        ...prev,
        disciplinas: prev.disciplinas.map((d) =>
          d.id === id ? { ...d, nome: String(valor) } : d
        ),
      }));
    }
  };

  // Antecedentes
  const handleAbrirModalAddAntecedente = () => {
    setAntSelecionado('Aliados');
    setAntCustomNome('');
    setAntNivelInicial(1);
    setModalAddAntecedenteAberto(true);
  };

  const handleConfirmarNovoAntecedente = () => {
    const nomeFinal =
      antSelecionado === '__custom__'
        ? antCustomNome.trim()
        : antSelecionado || 'Novo Antecedente';
    if (!nomeFinal) return;

    const ehGeracao = nomeFinal.toLowerCase().includes('geração') || nomeFinal.toLowerCase().includes('geracao');
    const maxPermitido = ehGeracao ? (isNpc ? 9 : 5) : (isNpc ? 10 : 5);
    const nivelFinal = Math.max(1, Math.min(maxPermitido, antNivelInicial));
    const novo: ItemSimplesNivel = {
      id: 'ant_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      nome: nomeFinal,
      nivel: nivelFinal,
    };

    updateFicha((prev) => {
      const novosAntecedentes = [...prev.antecedentes, novo];
      const { geracao, sangueMax } = sincronizarGeracaoPorAntecedente(novosAntecedentes);
      return {
        ...prev,
        antecedentes: novosAntecedentes,
        geracao,
        pontosDeSangueMax: sangueMax,
        pontosDeSangueAtual: Math.min(prev.pontosDeSangueAtual, sangueMax),
      };
    });

    setModalAddAntecedenteAberto(false);
    setAntCustomNome('');
    setAntNivelInicial(1);
  };

  const handleRemoverAntecedente = (id: string) => {
    updateFicha((prev) => {
      const novosAntecedentes = prev.antecedentes.filter((a) => a.id !== id);
      const { geracao, sangueMax } = sincronizarGeracaoPorAntecedente(novosAntecedentes);
      return {
        ...prev,
        antecedentes: novosAntecedentes,
        geracao,
        pontosDeSangueMax: sangueMax,
        pontosDeSangueAtual: Math.min(prev.pontosDeSangueAtual, sangueMax),
      };
    });
  };

  const handleEditarAntecedente = (
    id: string,
    campo: 'nome' | 'nivel',
    valor: string | number
  ) => {
    updateFicha((prev) => {
      const novosAntecedentes = prev.antecedentes.map((a) =>
        a.id === id ? { ...a, [campo]: valor } : a
      );
      const { geracao, sangueMax } = sincronizarGeracaoPorAntecedente(novosAntecedentes);
      return {
        ...prev,
        antecedentes: novosAntecedentes,
        geracao,
        pontosDeSangueMax: sangueMax,
        pontosDeSangueAtual: Math.min(prev.pontosDeSangueAtual, sangueMax),
      };
    });
  };

  // Opções dos 13 Clãs da 1ª Edição (Altos Clãs e Baixos Clãs)
  const opcoesClas = [
    ...CLAS_DARK_AGES_1E.filter((c) => c.tipo === 'alto_cla').map((c) => ({
      valor: c.nome,
      label: `${c.nome} (${c.disciplinas.join(', ')})`,
      grupo: 'Altos Clãs',
    })),
    ...CLAS_DARK_AGES_1E.filter((c) => c.tipo === 'baixo_cla').map((c) => ({
      valor: c.nome,
      label: `${c.nome} (${c.disciplinas.join(', ')})`,
      grupo: 'Baixos Clãs',
    })),
  ];

  const isNpc = ficha.tipo === 'npc';
  const maxBolinhasTraço = isNpc ? 10 : 8;

  // Opções de Geração da 1ª Edição (12ª à 3ª geração para NPCs / Mestre)
  const opcoesGeracao = [
    {
      valor: '12ª Geração',
      label: '12ª Geração (Base padrão • 0 pts Antecedente • Reserva: 11)',
    },
    {
      valor: '11ª Geração',
      label: '11ª Geração (1 pt no Antecedente • Reserva: 12)',
    },
    {
      valor: '10ª Geração',
      label: '10ª Geração (2 pts no Antecedente • Reserva: 13)',
    },
    {
      valor: '9ª Geração',
      label: '9ª Geração (3 pts no Antecedente • Reserva: 14 • 2 sangues/turno)',
    },
    {
      valor: '8ª Geração',
      label: '8ª Geração (4 pts no Antecedente • Reserva: 15 • 3 sangues/turno)',
    },
    {
      valor: '7ª Geração',
      label: '7ª Geração (5 pts no Antecedente • Reserva: 20 • 4 sangues/turno • Atrib máx 6)',
    },
    ...(isNpc || usuarioAtual.role === 'mestre'
      ? [
          {
            valor: '6ª Geração',
            label: '6ª Geração (6 pts no Antecedente • Reserva: 30 • 6 sangues/turno • Traço máx 7)',
          },
          {
            valor: '5ª Geração',
            label: '5ª Geração (7 pts no Antecedente • Reserva: 40 • 8 sangues/turno • Traço máx 8)',
          },
          {
            valor: '4ª Geração',
            label: '4ª Geração (Matusalém • 8 pts no Antecedente • Reserva: 50 • 10 sangues/turno • Traço máx 9)',
          },
          {
            valor: '3ª Geração',
            label: '3ª Geração (Antediluviano • 9 pts no Antecedente • Reserva: 100 • 10 sangues/turno • Traço máx 10)',
          },
        ]
      : []),
  ];

  const discDisponiveis = DISCIPLINAS_LIVRO_1E.filter(
    (d) => !ficha.disciplinas.some((fd) => fd.nome.toLowerCase() === d.toLowerCase())
  );

  // Configuração da Mesa e Regras de Prioridades
  const dadosCriacao = ficha.criacao;
  const isEmCriacao = !isNpc && ficha.criacao?.status === 'em_criacao';

  const listaQD = ficha.qualidadesDefeitos || [];
  const qualidadesEscolhidas = listaQD.filter((q) => q.tipo === 'qualidade');
  const defeitosEscolhidos = listaQD.filter((d) => d.tipo === 'defeito');
  const totalPontosDefeitos = defeitosEscolhidos.reduce((acc, d) => acc + d.custo, 0);
  const totalPontosQualidades = qualidadesEscolhidas.reduce((acc, q) => acc + q.custo, 0);
  const maxDefeitosConfig = configMesa.maxPontosDefeitos ?? 7;

  const handleRemoverQualidadeDefeito = (id: string) => {
    if (!isEmCriacao && usuarioAtual.role !== 'mestre' && !podeEditar) return;
    const novaLista = (ficha.qualidadesDefeitos || []).filter((q) => q.id !== id);
    const novaVitalidade = ajustarVitalidadeCorpoGrande(ficha.vitalidade, novaLista);
    updateFicha((prev) => ({
      ...prev,
      qualidadesDefeitos: novaLista,
      vitalidade: novaVitalidade,
    }));
  };

  // Estado e handler para cadastro manual de Qualidades / Defeitos
  const [mostrarFormCustomQD, setMostrarFormCustomQD] = useState(false);
  const [nomeCustomQD, setNomeCustomQD] = useState('');
  const [tipoCustomQD, setTipoCustomQD] = useState<'qualidade' | 'defeito'>('qualidade');
  const [catCustomQD, setCatCustomQD] = useState<'fisico' | 'mental' | 'social' | 'sobrenatural'>('fisico');
  const [pontosCustomQD, setPontosCustomQD] = useState<number>(1);
  const [descCustomQD, setDescCustomQD] = useState('');

  // Estado e handlers para edição de Qualidades/Defeitos (Exclusivo Mestre)
  const [itemEditandoQD, setItemEditandoQD] = useState<QualidadeDefeitoItem | null>(null);
  const [formEditQD, setFormEditQD] = useState<{
    nome: string;
    tipo: 'qualidade' | 'defeito';
    custo: number;
    categoria: 'fisico' | 'mental' | 'social' | 'sobrenatural';
    descricao: string;
  }>({
    nome: '',
    tipo: 'qualidade',
    custo: 1,
    categoria: 'fisico',
    descricao: '',
  });

  const handleAbrirEdicaoQD = (item: QualidadeDefeitoItem) => {
    setItemEditandoQD(item);
    setFormEditQD({
      nome: item.nome,
      tipo: item.tipo,
      custo: item.custo,
      categoria: item.categoria,
      descricao: item.descricao || '',
    });
  };

  const handleSalvarEdicaoQD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemEditandoQD || !formEditQD.nome.trim()) return;

    const novaLista = (ficha.qualidadesDefeitos || []).map((q) => {
      if (q.id === itemEditandoQD.id) {
        return {
          ...q,
          nome: formEditQD.nome.trim(),
          tipo: formEditQD.tipo,
          custo: Math.max(1, formEditQD.custo),
          categoria: formEditQD.categoria,
          descricao: formEditQD.descricao.trim() || undefined,
        };
      }
      return q;
    });

    const novaVitalidade = ajustarVitalidadeCorpoGrande(ficha.vitalidade, novaLista);

    updateFicha((prev) => ({
      ...prev,
      qualidadesDefeitos: novaLista,
      vitalidade: novaVitalidade,
    }));

    setItemEditandoQD(null);
  };

  const handleAdicionarCustomQD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCustomQD.trim() || !podeEditar) return;
    const custoFinal = Math.max(1, pontosCustomQD);
    const novo: QualidadeDefeitoItem = {
      id: 'qd_cust_' + Date.now().toString(36),
      nome: nomeCustomQD.trim(),
      tipo: tipoCustomQD,
      categoria: catCustomQD,
      custo: custoFinal,
      descricao: descCustomQD.trim() || undefined,
    };
    const novaLista = [...(ficha.qualidadesDefeitos || []), novo];
    const novaVitalidade = ajustarVitalidadeCorpoGrande(ficha.vitalidade, novaLista);
    updateFicha((prev) => ({
      ...prev,
      qualidadesDefeitos: novaLista,
      vitalidade: novaVitalidade,
    }));
    setNomeCustomQD('');
    setDescCustomQD('');
    setPontosCustomQD(1);
    setMostrarFormCustomQD(false);
  };

  // Limites e Gastos de Atributos (Base 1 em cada)
  const getLimiteAtributo = (cat: CategoriaAtributo): { max: number; prioridade: string } => {
    const prioridades = dadosCriacao?.prioridadesAtributos || {
      primario: 'fisicos',
      secundario: 'sociais',
      terciario: 'mentais',
    };
    if (prioridades.primario === cat) return { max: configMesa.pontosAtributos.primario, prioridade: 'Primário' };
    if (prioridades.secundario === cat) return { max: configMesa.pontosAtributos.secundario, prioridade: 'Secundário' };
    return { max: configMesa.pontosAtributos.terciario, prioridade: 'Terciário' };
  };

  const limiteFisicos = getLimiteAtributo('fisicos');
  const limiteSociais = getLimiteAtributo('sociais');
  const limiteMentais = getLimiteAtributo('mentais');

  const gastosFisicos =
    Math.max(0, ficha.atributos.forca - 1) +
    Math.max(0, ficha.atributos.destreza - 1) +
    Math.max(0, ficha.atributos.vigor - 1);

  const gastosSociais =
    Math.max(0, ficha.atributos.carisma - 1) +
    Math.max(0, ficha.atributos.manipulacao - 1) +
    Math.max(0, ficha.atributos.aparencia - 1);

  const gastosMentais =
    Math.max(0, ficha.atributos.percepcao - 1) +
    Math.max(0, ficha.atributos.inteligencia - 1) +
    Math.max(0, ficha.atributos.raciocinio - 1);

  // Limites e Gastos de Habilidades (Base 0)
  const getLimiteHabilidade = (cat: CategoriaHabilidade): { max: number; prioridade: string } => {
    const prioridades = dadosCriacao?.prioridadesHabilidades || {
      primario: 'talentos',
      secundario: 'pericias',
      terciario: 'conhecimentos',
    };
    if (prioridades.primario === cat) return { max: configMesa.pontosHabilidades.primario, prioridade: 'Primário' };
    if (prioridades.secundario === cat) return { max: configMesa.pontosHabilidades.secundario, prioridade: 'Secundário' };
    return { max: configMesa.pontosHabilidades.terciario, prioridade: 'Terciário' };
  };

  const limiteTalentos = getLimiteHabilidade('talentos');
  const limitePericias = getLimiteHabilidade('pericias');
  const limiteConhecimentos = getLimiteHabilidade('conhecimentos');

  const gastosTalentos =
    (ficha.habilidades.representacao ?? (ficha.habilidades as any).expressao ?? 0) +
    ficha.habilidades.prontidao +
    ficha.habilidades.esportes +
    ficha.habilidades.briga +
    ficha.habilidades.esquiva +
    ficha.habilidades.empatia +
    ficha.habilidades.intimidacao +
    (ficha.habilidades.crime ?? (ficha.habilidades as any).ladinagem ?? 0) +
    ficha.habilidades.lideranca +
    (ficha.habilidades.labia ?? (ficha.habilidades as any).manha ?? 0);

  const gastosPericias =
    ficha.habilidades.empatiaAnimais +
    (ficha.habilidades.arqueirismo ?? (ficha.habilidades as any).tiroComArco ?? 0) +
    ficha.habilidades.artesanato +
    ficha.habilidades.etiqueta +
    (ficha.habilidades.herborismo ?? (ficha.habilidades as any).herbalismo ?? 0) +
    ficha.habilidades.armasBrancas +
    ficha.habilidades.musica +
    (ficha.habilidades.cavalgar ?? (ficha.habilidades as any).cavalaria ?? 0) +
    (ficha.habilidades.furtividade ?? 0) +
    ficha.habilidades.sobrevivencia;

  const gastosConhecimentos =
    (ficha.habilidades.instrucao ?? (ficha.habilidades as any).academicos ?? 0) +
    ficha.habilidades.sabedoriaPopular +
    ficha.habilidades.investigacao +
    ficha.habilidades.direito +
    ficha.habilidades.linguistica +
    ficha.habilidades.medicina +
    ficha.habilidades.ocultismo +
    ficha.habilidades.politica +
    (ficha.habilidades.ciencia ?? 0) +
    (ficha.habilidades.senescalia ?? (ficha.habilidades as any).senescencia ?? 0);

  // Limites e Gastos de Vantagens (Disciplinas 4 canônico 1ª Edição, Antecedentes 5, Virtudes 7)
  const maxDisciplinas = configMesa.pontosDisciplinas || 4;
  const gastosDisciplinas = ficha.disciplinas.reduce((acc, d) => acc + d.nivel, 0);

  const maxAntecedentes = configMesa.pontosAntecedentes || 5;
  const gastosAntecedentes = ficha.antecedentes.reduce((acc, a) => acc + a.nivel, 0);

  const maxVirtudes = configMesa.pontosVirtudes || 7;
  const gastosVirtudes =
    Math.max(0, ficha.virtudes.consciencia - 1) +
    Math.max(0, ficha.virtudes.autocontrole - 1) +
    Math.max(0, ficha.virtudes.coragem - 1);

  // Helper visual para exibir o contador de pontos ao lado de cada seção
  const renderBadgePontos = (gastos: number, max: number, prioridadeNome?: string) => {
    const atingiu = gastos === max;
    const excedeu = gastos > max;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-sans font-bold tracking-wide transition-all ${
          atingiu
            ? 'bg-green-950/80 text-green-400 border border-green-700/80 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
            : excedeu
            ? 'bg-red-950 text-red-300 border border-red-600 animate-pulse'
            : 'bg-[#251015] text-[#d4af37] border border-[#5a1e26]'
        }`}
        title={prioridadeNome ? `Prioridade: ${prioridadeNome} (${max} pontos)` : undefined}
      >
        <span>{gastos} / {max} pts</span>
        {atingiu && <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />}
      </span>
    );
  };

  // Armas
  const handleAdicionarArma = () => {
    const nova: Arma = {
      id: 'arma_' + Date.now().toString(36),
      nome: 'Espada Longa',
      dificuldade: '6',
      dano: 'For+3',
      ocultacao: 'Sobretudo',
      alcance: 'Corpo a corpo',
    };
    updateFicha((prev) => ({
      ...prev,
      armas: [...prev.armas, nova],
    }));
  };

  const handleRemoverArma = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      armas: prev.armas.filter((a) => a.id !== id),
    }));
  };

  const handleEditarArma = (id: string, campo: keyof Arma, valor: string) => {
    updateFicha((prev) => ({
      ...prev,
      armas: prev.armas.map((a) => (a.id === id ? { ...a, [campo]: valor } : a)),
    }));
  };

  // Armaduras
  const handleAdicionarArmadura = () => {
    const nova: Armadura = {
      id: 'armadura_' + Date.now().toString(36),
      nome: 'Cota de Malha Reforçada',
      classe: '3',
      penalidade: '-1',
    };
    updateFicha((prev) => ({
      ...prev,
      armaduras: [...prev.armaduras, nova],
    }));
  };

  const handleRemoverArmadura = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      armaduras: prev.armaduras.filter((a) => a.id !== id),
    }));
  };

  const handleEditarArmadura = (
    id: string,
    campo: keyof Armadura,
    valor: string
  ) => {
    updateFicha((prev) => ({
      ...prev,
      armaduras: prev.armaduras.map((a) =>
        a.id === id ? { ...a, [campo]: valor } : a
      ),
    }));
  };

  // Laços de Sangue
  const handleAdicionarLaco = () => {
    const novo: LacoDeSangue = {
      id: 'laco_' + Date.now().toString(36),
      regente: 'Nome do Regente ou Vassalo',
      nivel: 1,
    };
    updateFicha((prev) => ({
      ...prev,
      lacosDeSangue: [...prev.lacosDeSangue, novo],
    }));
  };

  const handleRemoverLaco = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      lacosDeSangue: prev.lacosDeSangue.filter((l) => l.id !== id),
    }));
  };

  const handleEditarLaco = (
    id: string,
    campo: keyof LacoDeSangue,
    valor: string | number
  ) => {
    updateFicha((prev) => ({
      ...prev,
      lacosDeSangue: prev.lacosDeSangue.map((l) =>
        l.id === id ? { ...l, [campo]: valor } : l
      ),
    }));
  };

  // Perturbações
  const handleAdicionarPerturbacao = () => {
    const nova: Perturbacao = {
      id: 'pert_' + Date.now().toString(36),
      nome: 'Paranoia Sombria',
      descricao: 'Acredita que sombras nos cantos conspiram contra ele.',
    };
    updateFicha((prev) => ({
      ...prev,
      perturbacoes: [...prev.perturbacoes, nova],
    }));
  };

  const handleRemoverPerturbacao = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      perturbacoes: prev.perturbacoes.filter((p) => p.id !== id),
    }));
  };

  const handleEditarPerturbacao = (
    id: string,
    campo: keyof Perturbacao,
    valor: string
  ) => {
    updateFicha((prev) => ({
      ...prev,
      perturbacoes: prev.perturbacoes.map((p) =>
        p.id === id ? { ...p, [campo]: valor } : p
      ),
    }));
  };

  // Linhas Taumatúrgicas
  const handleAdicionarLinha = () => {
    const nova: ItemSimplesNivel = {
      id: 'linha_' + Date.now().toString(36),
      nome: 'Trilha do Sangue',
      nivel: 1,
    };
    updateFicha((prev) => ({
      ...prev,
      linhasTaumaturgia: [...prev.linhasTaumaturgia, nova],
    }));
  };

  const handleRemoverLinha = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      linhasTaumaturgia: prev.linhasTaumaturgia.filter((l) => l.id !== id),
    }));
  };

  const handleEditarLinha = (
    id: string,
    campo: 'nome' | 'nivel',
    valor: string | number
  ) => {
    if (campo === 'nivel') {
      const linha = ficha.linhasTaumaturgia.find((l) => l.id === id);
      if (!linha) return;
      const isPrimaria = ficha.linhasTaumaturgia.findIndex((l) => l.id === id) === 0;
      tentarEvoluirComXP(
        'trilha',
        `Trilha Taumatúrgica ${linha.nome || 'Sem Nome'}`,
        linha.nivel,
        Number(valor),
        (prev) => ({
          ...prev,
          linhasTaumaturgia: prev.linhasTaumaturgia.map((l) =>
            l.id === id ? { ...l, nivel: Number(valor) } : l
          ),
        }),
        { isPrimaria }
      );
    } else {
      updateFicha((prev) => ({
        ...prev,
        linhasTaumaturgia: prev.linhasTaumaturgia.map((l) =>
          l.id === id ? { ...l, nome: String(valor) } : l
        ),
      }));
    }
  };

  const handleForcaDeVontadeChange = (novoValor: number) => {
    const coragemBase = ficha.virtudes?.coragem || 1;
    const isEmCriacao = ficha.criacao?.status === 'em_criacao';
    const valorAjustado = isEmCriacao ? Math.max(coragemBase, novoValor) : novoValor;
    const atual = ficha.forcaDeVontade;
    tentarEvoluirComXP(
      'vontade',
      'Força de Vontade',
      atual,
      valorAjustado,
      (prev) => ({
        ...prev,
        forcaDeVontade: valorAjustado,
      })
    );
  };

  const handleCaminhoChange = (novoValor: number) => {
    const trilhaBase = Math.min(
      10,
      Math.max(1, (ficha.virtudes?.consciencia || 1) + (ficha.virtudes?.autocontrole || 1))
    );
    const isEmCriacao = ficha.criacao?.status === 'em_criacao';
    const valorAjustado = isEmCriacao ? Math.max(trilhaBase, novoValor) : novoValor;
    const atual = ficha.caminhoNivel;
    tentarEvoluirComXP(
      'caminho',
      `Caminho (${ficha.caminho || 'Humanidade'})`,
      atual,
      valorAjustado,
      (prev) => ({
        ...prev,
        caminhoNivel: valorAjustado,
      })
    );
  };

  const handleVirtudeChange = (
    tipo: 'consciencia' | 'autocontrole' | 'coragem',
    novoValor: number
  ) => {
    updateFicha((prev) => {
      const novasVirtudes = {
        ...prev.virtudes,
        [tipo]: novoValor,
      };

      const c = tipo === 'consciencia' ? novoValor : (novasVirtudes.consciencia || 1);
      const a = tipo === 'autocontrole' ? novoValor : (novasVirtudes.autocontrole || 1);
      const cor = tipo === 'coragem' ? novoValor : (novasVirtudes.coragem || 1);

      const trilhaBase = Math.min(10, Math.max(1, c + a));
      const vontadeBase = Math.min(10, Math.max(1, cor));

      let novoCaminhoNivel = prev.caminhoNivel;
      let novaForcaVontade = prev.forcaDeVontade;

      if (prev.criacao?.status === 'em_criacao') {
        if (prev.criacao.etapa === 'iniciais' || prev.criacao.etapa === 'prioridades') {
          novoCaminhoNivel = trilhaBase;
          novaForcaVontade = vontadeBase;
        } else {
          // Na etapa bônus, não pode ser menor que a base das virtudes
          novoCaminhoNivel = Math.max(prev.caminhoNivel || 0, trilhaBase);
          novaForcaVontade = Math.max(prev.forcaDeVontade || 0, vontadeBase);
        }
      } else {
        novoCaminhoNivel = Math.max(prev.caminhoNivel || 0, trilhaBase);
        novaForcaVontade = Math.max(prev.forcaDeVontade || 0, vontadeBase);
      }

      return {
        ...prev,
        virtudes: novasVirtudes,
        caminhoNivel: novoCaminhoNivel,
        forcaDeVontade: novaForcaVontade,
      };
    });
  };

  const handleSincronizarTrilhaEVontade = () => {
    const c = ficha.virtudes?.consciencia || 1;
    const a = ficha.virtudes?.autocontrole || 1;
    const cor = ficha.virtudes?.coragem || 1;
    const trilhaCalc = Math.min(10, Math.max(1, c + a));
    const vontadeCalc = Math.min(10, Math.max(1, cor));

    const isEtapaIniciais =
      ficha.criacao?.status === 'em_criacao' &&
      (ficha.criacao?.etapa === 'iniciais' || ficha.criacao?.etapa === 'prioridades');

    const novoCaminho = isEtapaIniciais
      ? trilhaCalc
      : Math.max(ficha.caminhoNivel || 0, trilhaCalc);
    const novaVontade = isEtapaIniciais
      ? vontadeCalc
      : Math.max(ficha.forcaDeVontade || 0, vontadeCalc);

    const fichaAtualizada: Personagem = {
      ...ficha,
      caminhoNivel: novoCaminho,
      forcaDeVontade: novaVontade,
    };

    setFicha(fichaAtualizada);
    setHasChanges(true);
    storageService.salvarPersonagem(fichaAtualizada);

    setFeedbackSincronizacao(
      `✓ Sincronizado com sucesso! Trilha: ${novoCaminho} (Consciência ${c} + Autocontrole ${a}) • Força de Vontade: ${novaVontade} (Coragem ${cor})`
    );
    setTimeout(() => setFeedbackSincronizacao(null), 5000);
  };

  // Rituais
  const handleAdicionarRitual = () => {
    const novo: Ritual = {
      id: 'rit_' + Date.now().toString(36),
      nome: 'Defesa do Refúgio Sagrado',
      nivel: 'Nível I',
      anotacoes: 'VDA pág. 214',
    };
    updateFicha((prev) => ({
      ...prev,
      rituais: [...prev.rituais, novo],
    }));
  };

  const handleRemoverRitual = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      rituais: prev.rituais.filter((r) => r.id !== id),
    }));
  };

  const handleEditarRitual = (
    id: string,
    campo: keyof Ritual,
    valor: string
  ) => {
    updateFicha((prev) => ({
      ...prev,
      rituais: prev.rituais.map((r) =>
        r.id === id ? { ...r, [campo]: valor } : r
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-[#070506] pb-28 text-[#ded6cb]">
      {/* Barra Superior de Navegação da Ficha */}
      <div className="sticky top-0 z-30 bg-[#0e0a0d]/95 backdrop-blur-md border-b border-[#3b181b] shadow-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleVoltarComAviso}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#1e1317] hover:bg-[#2e1c22] border border-[#522228] text-xs font-semibold text-[#ded6cb] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#ef4444]" />
              <span>Painel</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-gothic font-black text-[#d4af37] tracking-wider truncate max-w-xs sm:max-w-md">
                  {ficha.nome || 'Sem Nome'}
                </h1>
                {ficha.tipo === 'npc' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/60 text-amber-300 border border-amber-800">
                    NPC
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8e8273]">
                {ficha.cla || 'Sem Clã'} • {ficha.geracao || 'Geração Indefinida'} • Criado por: {ficha.usuarioNome}
              </p>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="flex items-center gap-1 bg-[#160d11] p-1 rounded-sm border border-[#3b181b]">
            <button
              type="button"
              onClick={() => setAbaAtiva('secao1')}
              className={`px-3 py-1.5 rounded-xs text-xs font-gothic tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                abaAtiva === 'secao1'
                  ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-[#a89f91] hover:text-white hover:bg-[#251419]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Características</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('secao2')}
              className={`px-3 py-1.5 rounded-xs text-xs font-gothic tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                abaAtiva === 'secao2'
                  ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-[#a89f91] hover:text-white hover:bg-[#251419]'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>2. Combate & XP</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('secao3')}
              className={`px-3 py-1.5 rounded-xs text-xs font-gothic tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                abaAtiva === 'secao3'
                  ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-[#a89f91] hover:text-white hover:bg-[#251419]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3. Magia & Biografia</span>
            </button>
          </div>

          {/* Botão de Atalhos do Card Resumido */}
          {podeEditar && (
            <button
              type="button"
              onClick={() => setModalAtalhosAberto(true)}
              title="Configurar os atalhos exibidos no card resumido do Dashboard"
              className="px-2.5 py-1.5 rounded-xs text-xs font-semibold text-[#d4af37] hover:text-white bg-[#1a1014] hover:bg-[#8b0000] border border-[#522228] hover:border-[#8b0000] flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Atalhos do Card</span>
            </button>
          )}
        </div>
      </div>

      {/* Alertas Flutuantes de Compra e Erro de XP */}
      {avisoXP && (
        <div className="max-w-4xl mx-auto px-4 mt-3 animate-fadeIn">
          <div className="bg-red-950/90 border border-red-700 text-red-200 px-4 py-2.5 rounded-xs text-xs flex items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{avisoXP}</span>
            </div>
            <button
              type="button"
              onClick={() => setAvisoXP(null)}
              className="text-red-400 hover:text-white text-xs cursor-pointer px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {sucessoXP && (
        <div className="max-w-4xl mx-auto px-4 mt-3 animate-fadeIn">
          <div className="bg-[#1f1016]/95 border border-[#8b0000] text-[#fca5a5] px-4 py-2.5 rounded-xs text-xs flex items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ef4444] shrink-0" />
              <span>{sucessoXP}</span>
            </div>
            {historicoTransacoesXP.length > 0 && (
              <button
                type="button"
                onClick={handleDesfazerUltimaCompra}
                className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Desfazer Ponto</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PAINEL DE CRIAÇÃO (Se a ficha for de jogador e estiver em modo de criação) */}
      {isEmCriacao && podeEditar && (
        <PainelCriacaoFicha
          ficha={ficha}
          config={configMesa}
          onAtualizarFicha={(novaFicha) => {
            setFicha(novaFicha);
            setHasChanges(true);
          }}
          onFinalizarCriacao={() => {
            const maxDef = configMesa.maxPontosDefeitos ?? 7;
            const defs = (ficha.qualidadesDefeitos || []).filter((qd) => qd.tipo === 'defeito');
            const totalDef = defs.reduce((acc, d) => acc + d.custo, 0);

            if (totalDef > maxDef) {
              alert(
                `Não é possível finalizar a criação! O personagem possui ${totalDef} pontos em Defeitos, mas o limite máximo permitido é de ${maxDef} pontos de Defeitos. Remova defeitos excedentes para prosseguir.`
              );
              return;
            }

            if (
              confirm(
                'Deseja concluir e finalizar a criação do personagem? A pontuação inicial e os pontos bônus serão consolidados e a ficha passará para o modo de jogo normal.'
              )
            ) {
              const c = ficha.virtudes?.consciencia || 1;
              const a = ficha.virtudes?.autocontrole || 1;
              const cor = ficha.virtudes?.coragem || 1;
              const trilhaMin = Math.min(10, Math.max(1, c + a));
              const vontadeMin = Math.min(10, Math.max(1, cor));

              const finalizada: Personagem = {
                ...ficha,
                caminhoNivel: Math.max(ficha.caminhoNivel || 0, trilhaMin),
                forcaDeVontade: Math.max(ficha.forcaDeVontade || 0, vontadeMin),
                criacao: {
                  ...ficha.criacao!,
                  status: 'finalizada',
                  etapa: 'concluida',
                },
              };
              setFicha(finalizada);
              onSalvar(finalizada);
              setHasChanges(false);
              alert('Personagem finalizado com sucesso! Agora você está no modo de jogo padrão.');
            }
          }}
        />
      )}

      {/* Aviso de Modo Somente Leitura */}
      {!podeEditar && (
        <div className="max-w-7xl mx-auto px-4 mt-3">
          <div className="bg-amber-950/40 border border-amber-800 text-amber-200 px-4 py-2.5 rounded-sm text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Modo de Leitura:</strong> Esta ficha pertence a outro jogador. Apenas o Mestre da Mesa ou o próprio criador podem editar suas propriedades.
            </span>
          </div>
        </div>
      )}

      {/* Corpo da Ficha - Moldura Estilo Pergaminho Dark Gótico */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-[#100b0e] border border-[#3b181b] rounded-sm shadow-2xl p-4 sm:p-8 space-y-8 relative overflow-hidden">
          {/* Marca d'água sutil no fundo */}
          <div className="absolute right-[-100px] top-[-100px] w-96 h-96 rounded-full bg-[#8b0000]/5 blur-3xl pointer-events-none" />

          {/* ========================================================================= */}
          {/* CABEÇALHO PERMANENTE DA FICHA (Foto à Esquerda + 3 Linhas de Informações) */}
          {/* ========================================================================= */}
          <div className="border-b-2 border-[#522228] pb-3">
            <div className="flex flex-row items-start gap-2 sm:gap-4">
              {/* Foto no Canto Superior Esquerdo */}
              <div className="shrink-0 pt-0.5">
                <FotoPersonagem
                  foto={ficha.foto}
                  nome={ficha.nome}
                  podeEditar={podeEditar}
                  onFotoChange={(base64) => updateFicha((prev) => ({ ...prev, foto: base64 }))}
                  onFotoRemover={() => updateFicha((prev) => ({ ...prev, foto: undefined }))}
                  tamanho="md"
                />
              </div>

              {/* Informações na Mesma Direção da Foto */}
              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                {/* Linha 1: Nome e Jogador */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <InlineField
                    label="Nome"
                    value={ficha.nome}
                    onChange={(val) => handleHeaderChange('nome', val)}
                    placeholder="Nome do personagem"
                    readonly={!podeEditar}
                  />
                  <InlineField
                    label="Jogador"
                    value={ficha.jogador}
                    onChange={(val) => handleHeaderChange('jogador', val)}
                    placeholder="Seu nome real"
                    readonly={!podeEditar}
                  />
                </div>

                {/* Linha 2: Clã, Natureza e Comportamento */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                  <SelectDarkAgesField
                    label="Clã"
                    value={ficha.cla}
                    opcoes={opcoesClas}
                    onChange={handleClanChange}
                    placeholder="Selecione..."
                    permitirPersonalizado={true}
                    readonly={!podeEditar}
                  />
                  <SelectDarkAgesField
                    label="Natureza"
                    value={ficha.natureza}
                    opcoes={ARQUETIPOS_PERSONALIDADE_1E}
                    onChange={(val) => handleHeaderChange('natureza', val)}
                    placeholder="Selecione..."
                    permitirPersonalizado={true}
                    readonly={!podeEditar}
                  />
                  <SelectDarkAgesField
                    label="Comportamento"
                    value={ficha.comportamento}
                    opcoes={ARQUETIPOS_PERSONALIDADE_1E}
                    onChange={(val) => handleHeaderChange('comportamento', val)}
                    placeholder="Selecione..."
                    permitirPersonalizado={true}
                    readonly={!podeEditar}
                  />
                </div>

                {/* Linha 3: Geração, Crônica e Refúgio */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                  <SelectDarkAgesField
                    label="Geração"
                    value={ficha.geracao || '12ª Geração'}
                    opcoes={opcoesGeracao}
                    onChange={handleGeracaoChange}
                    permitirPersonalizado={false}
                    readonly={!podeEditar}
                  />
                  <InlineField
                    label="Crônica"
                    value={ficha.cronica}
                    onChange={(val) => handleHeaderChange('cronica', val)}
                    placeholder="Crônica"
                    readonly={!podeEditar}
                  />
                  <InlineField
                    label="Refúgio"
                    value={ficha.refugio}
                    onChange={(val) => handleHeaderChange('refugio', val)}
                    placeholder="Refúgio"
                    readonly={!podeEditar}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ABA 1: CARACTERÍSTICAS PRINCIPAIS (Atributos, Habilidades, Vantagens, etc.) */}
          {/* ========================================================================= */}
          {abaAtiva === 'secao1' && (
            <div className="space-y-8 animate-fadeIn">
              {/* ATRIBUTOS */}
              <div>
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Atributos (Escala 1 a 8)
                  </h3>
                  <div className="flex items-center gap-2 text-xs bg-[#181014] px-2.5 py-1 rounded-xs border border-[#3b181b]">
                    <span className="text-[#a89f91]">Físicos: <strong className="text-[#ded6cb]">{gastosFisicos}/{limiteFisicos.max}</strong></span>
                    <span className="text-[#3b181b]">•</span>
                    <span className="text-[#a89f91]">Sociais: <strong className="text-[#ded6cb]">{gastosSociais}/{limiteSociais.max}</strong></span>
                    <span className="text-[#3b181b]">•</span>
                    <span className="text-[#a89f91]">Mentais: <strong className="text-[#ded6cb]">{gastosMentais}/{limiteMentais.max}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FÍSICOS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Físicos
                      </h4>
                      {!isNpc && renderBadgePontos(gastosFisicos, limiteFisicos.max, limiteFisicos.prioridade)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Força</span>
                      <Bolinhas
                        valor={ficha.atributos.forca}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('forca', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Destreza</span>
                      <Bolinhas
                        valor={ficha.atributos.destreza}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('destreza', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Vigor</span>
                      <Bolinhas
                        valor={ficha.atributos.vigor}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('vigor', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                  </div>

                  {/* SOCIAIS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Sociais
                      </h4>
                      {!isNpc && renderBadgePontos(gastosSociais, limiteSociais.max, limiteSociais.prioridade)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Carisma</span>
                      <Bolinhas
                        valor={ficha.atributos.carisma}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('carisma', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Manipulação</span>
                      <Bolinhas
                        valor={ficha.atributos.manipulacao}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('manipulacao', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Aparência</span>
                      <Bolinhas
                        valor={ficha.atributos.aparencia}
                        max={maxBolinhasTraço}
                        min={0}
                        onChange={(v) => handleAtributoChange('aparencia', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                  </div>

                  {/* MENTAIS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Mentais
                      </h4>
                      {!isNpc && renderBadgePontos(gastosMentais, limiteMentais.max, limiteMentais.prioridade)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Percepção</span>
                      <Bolinhas
                        valor={ficha.atributos.percepcao}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('percepcao', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Inteligência</span>
                      <Bolinhas
                        valor={ficha.atributos.inteligencia}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('inteligencia', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Raciocínio</span>
                      <Bolinhas
                        valor={ficha.atributos.raciocinio}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('raciocinio', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* HABILIDADES */}
              <div>
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Habilidades (Escala 0 a {maxBolinhasTraço})
                  </h3>
                  {!isNpc && (
                    <div className="flex items-center gap-2 text-xs bg-[#181014] px-2.5 py-1 rounded-xs border border-[#3b181b]">
                      <span className="text-[#a89f91]">Talentos: <strong className="text-[#ded6cb]">{gastosTalentos}/{limiteTalentos.max}</strong></span>
                      <span className="text-[#3b181b]">•</span>
                      <span className="text-[#a89f91]">Perícias: <strong className="text-[#ded6cb]">{gastosPericias}/{limitePericias.max}</strong></span>
                      <span className="text-[#3b181b]">•</span>
                      <span className="text-[#a89f91]">Conhecimentos: <strong className="text-[#ded6cb]">{gastosConhecimentos}/{limiteConhecimentos.max}</strong></span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* TALENTOS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1 mb-2">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Talentos
                      </h4>
                      {!isNpc && renderBadgePontos(gastosTalentos, limiteTalentos.max, limiteTalentos.prioridade)}
                    </div>
                    {(
                      [
                        ['representacao', 'Representação'],
                        ['prontidao', 'Prontidão'],
                        ['esportes', 'Esportes'],
                        ['briga', 'Briga'],
                        ['esquiva', 'Esquiva'],
                        ['empatia', 'Empatia'],
                        ['intimidacao', 'Intimidação'],
                        ['crime', 'Crime'],
                        ['lideranca', 'Liderança'],
                        ['labia', 'Lábia'],
                      ] as const
                    ).map(([chave, label]) => (
                      <div key={chave} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-[#ded6cb]">{label}</span>
                        <Bolinhas
                          valor={ficha.habilidades[chave] ?? 0}
                          max={maxBolinhasTraço}
                          min={0}
                          tamanho="sm"
                          onChange={(v) => handleHabilidadeChange(chave, v)}
                          readonly={!podeEditar}
                        />
                      </div>
                    ))}
                  </div>

                  {/* PERÍCIAS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1 mb-2">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Perícias
                      </h4>
                      {!isNpc && renderBadgePontos(gastosPericias, limitePericias.max, limitePericias.prioridade)}
                    </div>
                    {(
                      [
                        ['empatiaAnimais', 'Empatia c/ Animais'],
                        ['arqueirismo', 'Arqueirismo'],
                        ['artesanato', 'Artesanato'],
                        ['etiqueta', 'Etiqueta'],
                        ['herborismo', 'Herborismo'],
                        ['armasBrancas', 'Armas Brancas'],
                        ['musica', 'Música'],
                        ['cavalgar', 'Cavalgar'],
                        ['furtividade', 'Furtividade'],
                        ['sobrevivencia', 'Sobrevivência'],
                      ] as const
                    ).map(([chave, label]) => (
                      <div key={chave} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-[#ded6cb]">{label}</span>
                        <Bolinhas
                          valor={ficha.habilidades[chave] ?? 0}
                          max={maxBolinhasTraço}
                          min={0}
                          tamanho="sm"
                          onChange={(v) => handleHabilidadeChange(chave, v)}
                          readonly={!podeEditar}
                        />
                      </div>
                    ))}
                  </div>

                  {/* CONHECIMENTOS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1 mb-2">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Conhecimentos
                      </h4>
                      {!isNpc && renderBadgePontos(gastosConhecimentos, limiteConhecimentos.max, limiteConhecimentos.prioridade)}
                    </div>
                    {(
                      [
                        ['instrucao', 'Instrução'],
                        ['sabedoriaPopular', 'Sabedoria Popular'],
                        ['investigacao', 'Investigação'],
                        ['direito', 'Direito'],
                        ['linguistica', 'Lingüística'],
                        ['medicina', 'Medicina'],
                        ['ocultismo', 'Ocultismo'],
                        ['politica', 'Política'],
                        ['ciencia', 'Ciência'],
                        ['senescalia', 'Senescalia'],
                      ] as const
                    ).map(([chave, label]) => (
                      <div key={chave} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-[#ded6cb]">{label}</span>
                        <Bolinhas
                          valor={ficha.habilidades[chave] ?? 0}
                          max={maxBolinhasTraço}
                          min={0}
                          tamanho="sm"
                          onChange={(v) => handleHabilidadeChange(chave, v)}
                          readonly={!podeEditar}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* VANTAGENS (Disciplinas, Antecedentes, Virtudes) */}
              <div>
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Vantagens
                  </h3>
                  {!isNpc && (
                    <div className="flex items-center gap-2 text-xs bg-[#181014] px-2.5 py-1 rounded-xs border border-[#3b181b]">
                      <span className="text-[#a89f91]">Disciplinas: <strong className="text-[#ded6cb]">{gastosDisciplinas}/{maxDisciplinas}</strong></span>
                      <span className="text-[#3b181b]">•</span>
                      <span className="text-[#a89f91]">Antecedentes: <strong className="text-[#ded6cb]">{gastosAntecedentes}/{maxAntecedentes}</strong></span>
                      <span className="text-[#3b181b]">•</span>
                      <span className="text-[#a89f91]">Virtudes: <strong className="text-[#ded6cb]">{gastosVirtudes}/{maxVirtudes}</strong></span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* DISCIPLINAS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                          Disciplinas
                        </h4>
                        {renderBadgePontos(gastosDisciplinas, maxDisciplinas, 'Inicial')}
                      </div>
                      {podeEditar && (
                        <button
                          type="button"
                          onClick={handleAbrirModalAddDisciplina}
                          className="text-[11px] text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar
                        </button>
                      )}
                    </div>
                    {ficha.disciplinas.length === 0 ? (
                      <p className="text-xs text-[#706456] italic">
                        Nenhuma disciplina registrada. Escolha um Clã para adicionar as disciplinas canônicas automaticamente.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {ficha.disciplinas.map((disc) => {
                          const claEncontrado = CLAS_DARK_AGES_1E.find(
                            (c) => c.nome.toLowerCase() === (ficha.cla || '').toLowerCase()
                          );
                          const isClan =
                            ficha.criacao?.disciplinasPrimariasIds?.includes(disc.id) ||
                            (claEncontrado &&
                              claEncontrado.disciplinas.some(
                                (cd) => cd.toLowerCase() === disc.nome.toLowerCase()
                              ));

                          return (
                            <div key={disc.id} className="flex items-center justify-between gap-2">
                              <div className="flex-1 flex items-center gap-2">
                                <span
                                  className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded-xs shrink-0 ${
                                    isClan
                                      ? 'text-[#d4af37] bg-[#2b1016] border border-[#5a1e26]'
                                      : 'text-[#8e8273] bg-[#1b1216] border border-[#3b181b]'
                                  }`}
                                >
                                  {isClan ? 'Clã' : 'Outra'}
                                </span>
                                <div className="flex-1">
                                  <InlineField
                                    value={disc.nome}
                                    onChange={(val) => handleEditarDisciplina(disc.id, 'nome', val)}
                                    readonly={!podeEditar}
                                    placeholder="Nome da Disciplina"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Bolinhas
                                  valor={disc.nivel}
                                  max={maxBolinhasTraço}
                                  min={0}
                                  tamanho="sm"
                                  onChange={(v) => handleEditarDisciplina(disc.id, 'nivel', v)}
                                  readonly={!podeEditar}
                                />
                                {podeEditar && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoverDisciplina(disc.id)}
                                    className="text-[#8e8273] hover:text-[#ef4444] transition-colors p-0.5 cursor-pointer"
                                    title="Remover Disciplina"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ANTECEDENTES */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                          Antecedentes
                        </h4>
                        {!isNpc && renderBadgePontos(gastosAntecedentes, maxAntecedentes, 'Inicial')}
                      </div>
                      {podeEditar && (
                        <button
                          type="button"
                          onClick={handleAbrirModalAddAntecedente}
                          className="text-[11px] text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar
                        </button>
                      )}
                    </div>
                    {ficha.antecedentes.length === 0 ? (
                      <p className="text-xs text-[#706456] italic">Nenhum antecedente registrado.</p>
                    ) : (
                      <div className="space-y-2">
                        {ficha.antecedentes.map((ant) => {
                          const ehGeracao =
                            ant.nome.toLowerCase().trim() === 'geração' ||
                            ant.nome.toLowerCase().trim() === 'geracao';

                          return (
                            <div key={ant.id} className="flex items-center justify-between gap-2">
                              <div className="flex-1 flex items-center gap-2">
                                {ehGeracao && (
                                  <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold text-[#ef4444] bg-[#2b1016] border border-[#8b0000]/60 rounded-xs shrink-0">
                                    Geração
                                  </span>
                                )}
                                <div className="flex-1">
                                  <InlineField
                                    value={ant.nome}
                                    onChange={(val) => handleEditarAntecedente(ant.id, 'nome', val)}
                                    readonly={!podeEditar}
                                    placeholder="Nome do Antecedente"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Bolinhas
                                  valor={ant.nivel}
                                  max={ehGeracao ? (isNpc ? 9 : 5) : maxBolinhasTraço}
                                  min={1}
                                  tamanho="sm"
                                  onChange={(v) => handleEditarAntecedente(ant.id, 'nivel', v)}
                                  readonly={!podeEditar}
                                />
                                {podeEditar && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoverAntecedente(ant.id)}
                                    className="text-[#8e8273] hover:text-[#ef4444] transition-colors p-0.5 cursor-pointer"
                                    title="Remover Antecedente"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* VIRTUDES */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Virtudes
                      </h4>
                      {!isNpc && renderBadgePontos(gastosVirtudes, maxVirtudes, 'Inicial')}
                    </div>

                    {/* Consciência ou Convicção */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <select
                          disabled={!podeEditar}
                          value={ficha.virtudes.tipoConsciencia}
                          onChange={(e) =>
                            updateFicha((prev) => ({
                              ...prev,
                              virtudes: {
                                ...prev.virtudes,
                                tipoConsciencia: e.target.value as 'consciencia' | 'conviccao',
                              },
                            }))
                          }
                          className="bg-transparent text-xs font-semibold text-[#d4af37] border-b border-[#522228] focus:outline-none cursor-pointer"
                        >
                          <option value="consciencia" className="bg-[#140e11] text-white">Consciência</option>
                          <option value="conviccao" className="bg-[#140e11] text-white">Convicção</option>
                        </select>
                        <Bolinhas
                          valor={ficha.virtudes.consciencia}
                          max={5}
                          min={1}
                          onChange={(v) => handleVirtudeChange('consciencia', v)}
                          readonly={!podeEditar}
                        />
                      </div>
                    </div>

                    {/* Autocontrole ou Instinto */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <select
                          disabled={!podeEditar}
                          value={ficha.virtudes.tipoAutocontrole}
                          onChange={(e) =>
                            updateFicha((prev) => ({
                              ...prev,
                              virtudes: {
                                ...prev.virtudes,
                                tipoAutocontrole: e.target.value as 'autocontrole' | 'instinto',
                              },
                            }))
                          }
                          className="bg-transparent text-xs font-semibold text-[#d4af37] border-b border-[#522228] focus:outline-none cursor-pointer"
                        >
                          <option value="autocontrole" className="bg-[#140e11] text-white">Autocontrole</option>
                          <option value="instinto" className="bg-[#140e11] text-white">Instinto</option>
                        </select>
                        <Bolinhas
                          valor={ficha.virtudes.autocontrole}
                          max={5}
                          min={1}
                          onChange={(v) => handleVirtudeChange('autocontrole', v)}
                          readonly={!podeEditar}
                        />
                      </div>
                    </div>

                    {/* Coragem */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-[#ded6cb]">Coragem</span>
                      <Bolinhas
                        valor={ficha.virtudes.coragem}
                        max={5}
                        min={1}
                        onChange={(v) => handleVirtudeChange('coragem', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO DE QUALIDADES E DEFEITOS */}
              <div className="bg-[#140e11] p-4 sm:p-5 rounded-sm border border-[#2d1217] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3b181b] pb-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#ef4444]" />
                      Qualidades & Defeitos
                    </h3>
                    <p className="text-[11px] text-[#a89f91]">
                      Traços físicos, mentais, sociais ou sobrenaturais escolhidos na criação do personagem.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800">
                      Qualidades: {qualidadesEscolhidas.length} (-{totalPontosQualidades} pts)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        !isNpc && totalPontosDefeitos > maxDefeitosConfig
                          ? 'bg-red-950 text-red-300 border-red-700 font-bold animate-pulse'
                          : 'bg-green-950/40 text-green-300 border-green-800'
                      }`}
                    >
                      Defeitos: {defeitosEscolhidos.length} (+{totalPontosDefeitos}{isNpc ? ' pts' : ` / ${maxDefeitosConfig} pts máx`})
                    </span>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={() => setMostrarFormCustomQD(!mostrarFormCustomQD)}
                        className="px-2 py-0.5 text-xs font-semibold bg-[#2d1217] text-[#d4af37] hover:bg-[#3d1a21] border border-[#5a252d] rounded-xs cursor-pointer transition-colors flex items-center gap-1"
                        title="Adicionar qualidade ou defeito personalizado de outras edições ou livros"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {mostrarFormCustomQD ? 'Fechar' : '+ Personalizado'}
                      </button>
                    )}
                  </div>
                </div>

                {mostrarFormCustomQD && podeEditar && (
                  <form
                    onSubmit={handleAdicionarCustomQD}
                    className="bg-[#181115] p-3 rounded-xs border border-[#3b181b] space-y-2 text-xs"
                  >
                    <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#d4af37] block">
                      + Adicionar Qualidade ou Defeito Personalizado (Outros Livros / Versões)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      <input
                        type="text"
                        placeholder="Nome do Traço..."
                        value={nomeCustomQD}
                        onChange={(e) => setNomeCustomQD(e.target.value)}
                        className="sm:col-span-2 bg-[#1b1216] border border-[#3b181b] px-2.5 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                        required
                      />
                      <select
                        value={tipoCustomQD}
                        onChange={(e) => setTipoCustomQD(e.target.value as 'qualidade' | 'defeito')}
                        className="bg-[#1b1216] border border-[#3b181b] px-2 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                      >
                        <option value="qualidade">Qualidade (Custo)</option>
                        <option value="defeito">Defeito (Bônus)</option>
                      </select>
                      <select
                        value={catCustomQD}
                        onChange={(e) => setCatCustomQD(e.target.value as any)}
                        className="bg-[#1b1216] border border-[#3b181b] px-2 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                      >
                        <option value="fisico">Físico</option>
                        <option value="mental">Mental</option>
                        <option value="social">Social</option>
                        <option value="sobrenatural">Sobrenatural</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <label className="text-[10px] text-[#8e8273]">Pts:</label>
                        <input
                          type="number"
                          min="1"
                          max="7"
                          value={pontosCustomQD}
                          onChange={(e) => setPontosCustomQD(parseInt(e.target.value, 10) || 1)}
                          className="w-14 bg-[#1b1216] border border-[#3b181b] px-2 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none text-center"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Descrição ou efeito mecânico (opcional)..."
                        value={descCustomQD}
                        onChange={(e) => setDescCustomQD(e.target.value)}
                        className="flex-1 bg-[#1b1216] border border-[#3b181b] px-2.5 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#3d1a21] hover:bg-[#5a252d] text-[#d4af37] border border-[#722f37] rounded-xs cursor-pointer font-bold transition-colors shrink-0"
                      >
                        Adicionar
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coluna 1: Qualidades */}
                  <div className="space-y-2">
                    <span className="text-xs font-gothic font-bold uppercase tracking-wider text-amber-400 block border-b border-[#2d1217] pb-1">
                      Qualidades Adquiridas (-{totalPontosQualidades} pts bônus)
                    </span>
                    {qualidadesEscolhidas.length === 0 ? (
                      <p className="text-xs text-[#706456] italic py-2">
                        Nenhuma qualidade selecionada.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {qualidadesEscolhidas.map((q) => (
                          <div
                            key={q.id}
                            className="bg-[#181115] border border-[#3b181b] rounded-xs p-2.5 text-xs flex items-start justify-between gap-2"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[#ded6cb]">{q.nome}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-950/70 text-amber-300 border border-amber-800">
                                  -{q.custo} pt{q.custo > 1 ? 's' : ''}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-semibold bg-[#221217] text-[#8e8273]">
                                  {q.categoria}
                                </span>
                              </div>
                              {q.descricao && (
                                <p className="text-[11px] text-[#a89f91]">{q.descricao}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {usuarioAtual.role === 'mestre' && (
                                <button
                                  type="button"
                                  onClick={() => handleAbrirEdicaoQD(q)}
                                  className="p-1 text-[#8e8273] hover:text-[#d4af37] hover:bg-[#251419] rounded-xs cursor-pointer transition-colors"
                                  title="Editar qualidade (Exclusivo Mestre)"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {(isEmCriacao || usuarioAtual.role === 'mestre') && podeEditar && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoverQualidadeDefeito(q.id)}
                                  className="p-1 text-[#8e8273] hover:text-[#ef4444] hover:bg-[#251419] rounded-xs cursor-pointer transition-colors"
                                  title="Remover qualidade"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Coluna 2: Defeitos */}
                  <div className="space-y-2">
                    <span className="text-xs font-gothic font-bold uppercase tracking-wider text-green-400 block border-b border-[#2d1217] pb-1">
                      Defeitos Assumidos (+{totalPontosDefeitos} / {maxDefeitosConfig} pts máx)
                    </span>
                    {defeitosEscolhidos.length === 0 ? (
                      <p className="text-xs text-[#706456] italic py-2">
                        Nenhum defeito selecionado.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {defeitosEscolhidos.map((d) => (
                          <div
                            key={d.id}
                            className="bg-[#181115] border border-[#3b181b] rounded-xs p-2.5 text-xs flex items-start justify-between gap-2"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[#ded6cb]">{d.nome}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-green-950/70 text-green-300 border border-green-800">
                                  +{d.custo} pt{d.custo > 1 ? 's' : ''}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-semibold bg-[#221217] text-[#8e8273]">
                                  {d.categoria}
                                </span>
                              </div>
                              {d.descricao && (
                                <p className="text-[11px] text-[#a89f91]">{d.descricao}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {usuarioAtual.role === 'mestre' && (
                                <button
                                  type="button"
                                  onClick={() => handleAbrirEdicaoQD(d)}
                                  className="p-1 text-[#8e8273] hover:text-[#d4af37] hover:bg-[#251419] rounded-xs cursor-pointer transition-colors"
                                  title="Editar defeito (Exclusivo Mestre)"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {(isEmCriacao || usuarioAtual.role === 'mestre') && podeEditar && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoverQualidadeDefeito(d.id)}
                                  className="p-1 text-[#8e8273] hover:text-[#ef4444] hover:bg-[#251419] rounded-xs cursor-pointer transition-colors"
                                  title="Remover defeito"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* STATUS ATUAIS & VITALIDADE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* STATUS ATUAIS (Caminho, Força de Vontade, Sangue, Fraqueza) */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-5">
                  <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 flex-wrap gap-2">
                    <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                      Status Atuais & Pontos
                    </h3>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={handleSincronizarTrilhaEVontade}
                        className="px-2.5 py-1 text-[11px] font-sans font-bold bg-[#251016] hover:bg-[#3d1822] text-[#d4af37] border border-[#ef4444]/60 hover:border-[#ef4444] rounded-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                        title="Recalcular Trilha (Consciência + Autocontrole) e Força de Vontade (Coragem)"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#ef4444]" />
                        <span>Sincronizar das Virtudes</span>
                      </button>
                    )}
                  </div>

                  {feedbackSincronizacao && (
                    <div className="p-2 bg-green-950/80 border border-green-700/80 text-green-300 text-xs rounded-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                      <span>{feedbackSincronizacao}</span>
                    </div>
                  )}

                  {/* Trilha de Iluminação */}
                  <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <SelectDarkAgesField
                          label="Trilha"
                          value={ficha.caminho}
                          onChange={(val) => handleHeaderChange('caminho', val)}
                          opcoes={TRILHAS_DARK_AGES_1E.map((t) => ({
                            valor: t.nome,
                            label: `${t.nome} (${t.viaLatin})`,
                            subtexto: `${t.descricao} [Virtudes: ${t.virtudes}]`,
                          }))}
                          placeholder="Selecione a Trilha do livro..."
                          readonly={!podeEditar}
                        />
                        <div className="text-[10px] text-[#a89f91] mt-0.5">
                          Base: Consciência ({ficha.virtudes?.consciencia || 1}) + Autocontrole ({ficha.virtudes?.autocontrole || 1}) = {(ficha.virtudes?.consciencia || 1) + (ficha.virtudes?.autocontrole || 1)}
                        </div>
                      </div>
                      <div className="pt-2 sm:pt-4">
                        <Bolinhas
                          valor={ficha.caminhoNivel}
                          max={10}
                          min={1}
                          cor="ouro"
                          onChange={(v) => handleCaminhoChange(v)}
                          readonly={!podeEditar}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Força de Vontade */}
                  <div className="space-y-2 border-t border-[#251419] pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#a89f91] block">
                          Força de Vontade (Permanente)
                        </span>
                        <span className="text-[10px] text-[#a89f91]">
                          Base: Igual à Coragem ({ficha.virtudes?.coragem || 1})
                        </span>
                      </div>
                      <Bolinhas
                        valor={ficha.forcaDeVontade}
                        max={10}
                        min={1}
                        cor="ouro"
                        onChange={(v) => handleForcaDeVontadeChange(v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    {/* Gasto Temporário de Força de Vontade */}
                    <div className="pt-1">
                      <QuadradosStatus
                        label="Gastos Temporários de Vontade"
                        total={ficha.forcaDeVontade}
                        gastos={ficha.forcaDeVontadeGasta}
                        onChange={(g) =>
                          updateFicha((prev) => ({ ...prev, forcaDeVontadeGasta: g }))
                        }
                        readonly={!podeEditar}
                      />
                    </div>
                  </div>

                  {/* Pontos de Sangue */}
                  <div className="space-y-2 border-t border-[#251419] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Pontos de Sangue (Gasto / Reserva)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#8e8273]">Pool Máx:</span>
                        <input
                          type="number"
                          min={1}
                          max={isNpc ? 100 : 50}
                          disabled={!podeEditar}
                          value={ficha.pontosDeSangueMax}
                          onChange={(e) => {
                            const val = Math.max(1, parseInt(e.target.value) || 10);
                            updateFicha((prev) => ({
                              ...prev,
                              pontosDeSangueMax: val,
                              pontosDeSangueAtual: Math.min(prev.pontosDeSangueAtual, val),
                            }));
                          }}
                          className="w-14 bg-[#1e1317] border border-[#522228] px-1 py-0.5 text-center text-xs text-[#ef4444] font-bold rounded-xs"
                        />
                      </div>
                    </div>
                    {/* Checkboxes de Sangue */}
                    <QuadradosStatus
                      label="Reserva Atual vs. Gasto de Sangue"
                      total={ficha.pontosDeSangueMax}
                      gastos={Math.max(0, ficha.pontosDeSangueMax - ficha.pontosDeSangueAtual)}
                      onChange={(gastosCalculados) =>
                        updateFicha((prev) => ({
                          ...prev,
                          pontosDeSangueAtual: Math.max(0, prev.pontosDeSangueMax - gastosCalculados),
                        }))
                      }
                      readonly={!podeEditar}
                    />
                  </div>

                  {/* Fraqueza do Clã */}
                  <div className="border-t border-[#251419] pt-3">
                    <InlineField
                      label="Fraqueza do Clã"
                      value={ficha.fraqueza}
                      onChange={(val) => handleHeaderChange('fraqueza', val)}
                      placeholder="Descreva a maldição do sangue de seu clã..."
                      multiline
                      rows={2}
                      readonly={!podeEditar}
                    />
                  </div>
                </div>

                {/* VITALIDADE (Dano Contusão, Letal, Agravado) */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217]">
                  <VitalidadeSelector
                    niveis={ficha.vitalidade}
                    onChange={(niveisNovos) =>
                      updateFicha((prev) => ({ ...prev, vitalidade: niveisNovos }))
                    }
                    readonly={!podeEditar}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 2: EXPERIÊNCIA, COMBATE E LAÇOS */}
          {/* ========================================================================= */}
          {abaAtiva === 'secao2' && (
            <div className="space-y-8 animate-fadeIn">
              {/* CONTROLE DE EXPERIÊNCIA (XP) */}
              <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-4">
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                  <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Controle de Experiência (XP)
                  </h3>
                  <span className="text-xs text-[#ef4444] font-mono">
                    Total Acumulado: {Number(ficha.xp.atual) + Number(ficha.xp.totalGasto)} XP
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#1c1216] p-3 rounded-sm border border-[#3b181b]">
                    <span className="text-[11px] font-gothic font-bold uppercase text-[#a89f91] block mb-1">
                      Experiência Atual Disponível
                    </span>
                    <input
                      type="number"
                      min={0}
                      disabled={!podeEditar}
                      value={ficha.xp.atual}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        updateFicha((prev) => ({
                          ...prev,
                          xp: { ...prev.xp, atual: val },
                        }));
                      }}
                      className="w-full bg-[#100b0e] border border-[#522228] px-3 py-1.5 text-lg font-bold text-[#d4af37] rounded-xs focus:outline-none"
                    />
                  </div>
                  <div className="bg-[#1c1216] p-3 rounded-sm border border-[#3b181b]">
                    <span className="text-[11px] font-gothic font-bold uppercase text-[#a89f91] block mb-1">
                      Total de Experiência Gasto
                    </span>
                    <input
                      type="number"
                      min={0}
                      disabled={!podeEditar}
                      value={ficha.xp.totalGasto}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        updateFicha((prev) => ({
                          ...prev,
                          xp: { ...prev.xp, totalGasto: val },
                        }));
                      }}
                      className="w-full bg-[#100b0e] border border-[#522228] px-3 py-1.5 text-lg font-bold text-[#8e8273] rounded-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <InlineField
                    label="Histórico de Gastos e Ganhos de XP"
                    value={ficha.xp.historico}
                    onChange={(val) =>
                      updateFicha((prev) => ({
                        ...prev,
                        xp: { ...prev.xp, historico: val },
                      }))
                    }
                    multiline
                    rows={4}
                    placeholder="Ex: +3 XP pela sessão 1; -7 XP para aumentar Potência 2 para 3..."
                    readonly={!podeEditar}
                  />
                </div>

                {/* Desfazer Compras de XP Pendentes */}
                {historicoTransacoesXP.length > 0 && (
                  <div className="bg-[#1b1014] border border-amber-800/60 p-3 rounded-xs flex items-center justify-between">
                    <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" />
                      {historicoTransacoesXP.length} evolução(ões) recente(s) aguardando confirmação ao salvar.
                    </span>
                    <button
                      type="button"
                      onClick={handleDesfazerUltimaCompra}
                      className="px-3 py-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-700 rounded-xs text-xs font-bold cursor-pointer"
                    >
                      ↩ Desfazer Última Compra
                    </button>
                  </div>
                )}

                {/* Tabela de Referência de Custos em XP */}
                <div className="bg-[#0f0a0d] p-3 rounded-xs border border-[#2d1217] space-y-2 text-[11px] text-[#a89f91]">
                  <span className="font-gothic font-bold uppercase tracking-wider text-[#d4af37] block">
                    📜 Regras Oficiais de Custo de XP
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="bg-[#160f13] p-2 rounded-xs border border-[#241318]">
                      <strong className="text-white block">Atributos</strong>
                      <span>Nível Atual × 4</span>
                    </div>
                    <div className="bg-[#160f13] p-2 rounded-xs border border-[#241318]">
                      <strong className="text-white block">Habilidades</strong>
                      <span>Nova: 3 XP • Evolução: Nível Atual × 2</span>
                    </div>
                    <div className="bg-[#160f13] p-2 rounded-xs border border-[#241318]">
                      <strong className="text-white block">Disciplinas</strong>
                      <span>Nova: 10 XP • Clã: Nível × 5 • Outras: Nível × 7</span>
                    </div>
                    <div className="bg-[#160f13] p-2 rounded-xs border border-[#241318]">
                      <strong className="text-white block">Trilhas Taumatúrgicas</strong>
                      <span>Nova: 7 XP • Primária: Nível × 4 • Outras: Nível × 5</span>
                    </div>
                    <div className="bg-[#160f13] p-2 rounded-xs border border-[#241318]">
                      <strong className="text-white block">Força de Vontade</strong>
                      <span>Custo igual ao Nível Atual</span>
                    </div>
                    <div className="bg-[#160f13] p-2 rounded-xs border border-[#241318]">
                      <strong className="text-white block">Caminho / Humanidade</strong>
                      <span>Nível Atual × 2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMBATE: ARMAS E ARMADURAS */}
              <div className="space-y-6">
                {/* ARMAS */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                    <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                      <Swords className="w-4 h-4 text-[#ef4444]" /> Armas de Combate
                    </h3>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={handleAdicionarArma}
                        className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer bg-[#241318] px-2 py-1 rounded border border-[#522228]"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar Arma
                      </button>
                    )}
                  </div>

                  {ficha.armas.length === 0 ? (
                    <p className="text-xs text-[#706456] italic">Nenhuma arma equipada no momento.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] uppercase font-gothic text-[#a89f91] border-b border-[#3b181b]">
                          <tr>
                            <th className="py-2 px-2">Arma</th>
                            <th className="py-2 px-2">Dificuldade</th>
                            <th className="py-2 px-2">Dano</th>
                            <th className="py-2 px-2">Ocultação</th>
                            <th className="py-2 px-2">Alcance</th>
                            {podeEditar && <th className="py-2 px-2 text-right">Ação</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#241318]">
                          {ficha.armas.map((arma) => (
                            <tr key={arma.id} className="hover:bg-[#1a1115]">
                              <td className="py-1 px-2 font-semibold">
                                <InlineField
                                  value={arma.nome}
                                  onChange={(v) => handleEditarArma(arma.id, 'nome', v)}
                                  readonly={!podeEditar}
                                  placeholder="Nome da Arma"
                                />
                              </td>
                              <td className="py-1 px-2">
                                <InlineField
                                  value={arma.dificuldade}
                                  onChange={(v) => handleEditarArma(arma.id, 'dificuldade', v)}
                                  readonly={!podeEditar}
                                  placeholder="6"
                                />
                              </td>
                              <td className="py-1 px-2 text-[#ef4444] font-bold">
                                <InlineField
                                  value={arma.dano}
                                  onChange={(v) => handleEditarArma(arma.id, 'dano', v)}
                                  readonly={!podeEditar}
                                  placeholder="For+2"
                                />
                              </td>
                              <td className="py-1 px-2">
                                <InlineField
                                  value={arma.ocultacao}
                                  onChange={(v) => handleEditarArma(arma.id, 'ocultacao', v)}
                                  readonly={!podeEditar}
                                  placeholder="Capa"
                                />
                              </td>
                              <td className="py-1 px-2">
                                <InlineField
                                  value={arma.alcance}
                                  onChange={(v) => handleEditarArma(arma.id, 'alcance', v)}
                                  readonly={!podeEditar}
                                  placeholder="Corpo a corpo"
                                />
                              </td>
                              {podeEditar && (
                                <td className="py-1 px-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoverArma(arma.id)}
                                    className="text-[#8e8273] hover:text-[#ef4444] p-1 cursor-pointer"
                                    title="Remover Arma"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ARMADURAS */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                    <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#ef4444]" /> Armadura e Proteção
                    </h3>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={handleAdicionarArmadura}
                        className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer bg-[#241318] px-2 py-1 rounded border border-[#522228]"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar Armadura
                      </button>
                    )}
                  </div>

                  {ficha.armaduras.length === 0 ? (
                    <p className="text-xs text-[#706456] italic">Nenhuma armadura em uso.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] uppercase font-gothic text-[#a89f91] border-b border-[#3b181b]">
                          <tr>
                            <th className="py-2 px-2">Tipo de Armadura</th>
                            <th className="py-2 px-2">Classe / Proteção</th>
                            <th className="py-2 px-2">Penalidade de Destreza</th>
                            {podeEditar && <th className="py-2 px-2 text-right">Ação</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#241318]">
                          {ficha.armaduras.map((arm) => (
                            <tr key={arm.id} className="hover:bg-[#1a1115]">
                              <td className="py-1 px-2 font-semibold">
                                <InlineField
                                  value={arm.nome}
                                  onChange={(v) => handleEditarArmadura(arm.id, 'nome', v)}
                                  readonly={!podeEditar}
                                  placeholder="Cota de Malha"
                                />
                              </td>
                              <td className="py-1 px-2 text-[#d4af37] font-bold">
                                <InlineField
                                  value={arm.classe}
                                  onChange={(v) => handleEditarArmadura(arm.id, 'classe', v)}
                                  readonly={!podeEditar}
                                  placeholder="3"
                                />
                              </td>
                              <td className="py-1 px-2 text-[#ef4444]">
                                <InlineField
                                  value={arm.penalidade}
                                  onChange={(v) => handleEditarArmadura(arm.id, 'penalidade', v)}
                                  readonly={!podeEditar}
                                  placeholder="-1"
                                />
                              </td>
                              {podeEditar && (
                                <td className="py-1 px-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoverArmadura(arm.id)}
                                    className="text-[#8e8273] hover:text-[#ef4444] p-1 cursor-pointer"
                                    title="Remover Armadura"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* RELAÇÕES E MENTE: LAÇOS DE SANGUE E PERTURBAÇÕES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LAÇOS DE SANGUE / VINCULI */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                    <div>
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Laços de Sangue & Vinculi
                      </h4>
                      <p className="text-[10px] text-[#8e8273]">Graus de subserviência (1 a 3 goles)</p>
                    </div>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={handleAdicionarLaco}
                        className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar
                      </button>
                    )}
                  </div>

                  {ficha.lacosDeSangue.length === 0 ? (
                    <p className="text-xs text-[#706456] italic">Nenhum laço de sangue registrado.</p>
                  ) : (
                    <div className="space-y-2">
                      {ficha.lacosDeSangue.map((laco) => (
                        <div key={laco.id} className="flex items-center justify-between gap-2 p-2 bg-[#1b1115] rounded-xs border border-[#2b161c]">
                          <div className="flex-1">
                            <InlineField
                              value={laco.regente}
                              onChange={(v) => handleEditarLaco(laco.id, 'regente', v)}
                              readonly={!podeEditar}
                              placeholder="Regente ou Vassalo"
                            />
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Bolinhas
                              valor={laco.nivel}
                              max={3}
                              min={1}
                              tamanho="sm"
                              onChange={(v) => handleEditarLaco(laco.id, 'nivel', v)}
                              readonly={!podeEditar}
                            />
                            {podeEditar && (
                              <button
                                type="button"
                                onClick={() => handleRemoverLaco(laco.id)}
                                className="text-[#8e8273] hover:text-[#ef4444] p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PERTURBAÇÕES */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                    <div>
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Perturbações Mentais
                      </h4>
                      <p className="text-[10px] text-[#8e8273]">Fraturas da psique cainita</p>
                    </div>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={handleAdicionarPerturbacao}
                        className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar
                      </button>
                    )}
                  </div>

                  {ficha.perturbacoes.length === 0 ? (
                    <p className="text-xs text-[#706456] italic">Mente lúcida (nenhuma perturbação ativa).</p>
                  ) : (
                    <div className="space-y-2">
                      {ficha.perturbacoes.map((pert) => (
                        <div key={pert.id} className="p-2.5 bg-[#1b1115] rounded-xs border border-[#2b161c] space-y-1 relative">
                          {podeEditar && (
                            <button
                              type="button"
                              onClick={() => handleRemoverPerturbacao(pert.id)}
                              className="absolute top-2 right-2 text-[#8e8273] hover:text-[#ef4444] p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <InlineField
                            value={pert.nome}
                            onChange={(v) => handleEditarPerturbacao(pert.id, 'nome', v)}
                            readonly={!podeEditar}
                            placeholder="Nome da Perturbação"
                            className="font-bold text-[#d4af37]"
                          />
                          <InlineField
                            value={pert.descricao}
                            onChange={(v) => handleEditarPerturbacao(pert.id, 'descricao', v)}
                            readonly={!podeEditar}
                            placeholder="Descrição dos sintomas e gatilhos mentais..."
                            multiline
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 3: MAGIA DE SANGUE, BIOGRAFIA E APARÊNCIA */}
          {/* ========================================================================= */}
          {abaAtiva === 'secao3' && (
            <div className="space-y-8 animate-fadeIn">
              {/* MAGIA DE SANGUE / TAUMATURGIA */}
              <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-6">
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                  <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                    <Scroll className="w-4 h-4 text-[#ef4444]" /> Magia de Sangue & Taumaturgia
                  </h3>
                  <span className="text-[11px] text-[#8e8273]">
                    Trilhas de Sangue e Rituais Herméticos
                  </span>
                </div>

                {/* Linhas / Trilhas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                      Trilhas Taumatúrgicas (1 a {maxBolinhasTraço} Pontos)
                    </h4>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={handleAdicionarLinha}
                        className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Nova Trilha
                      </button>
                    )}
                  </div>

                  {ficha.linhasTaumaturgia.length === 0 ? (
                    <p className="text-xs text-[#706456] italic">Nenhuma trilha taumatúrgica dominada.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ficha.linhasTaumaturgia.map((linha) => (
                        <div key={linha.id} className="flex items-center justify-between gap-2 p-2 bg-[#1b1115] rounded-xs border border-[#2b161c]">
                          <div className="flex-1">
                            <InlineField
                              value={linha.nome}
                              onChange={(v) => handleEditarLinha(linha.id, 'nome', v)}
                              readonly={!podeEditar}
                              placeholder="Trilha do Sangue"
                            />
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Bolinhas
                              valor={linha.nivel}
                              max={maxBolinhasTraço}
                              min={1}
                              tamanho="sm"
                              onChange={(v) => handleEditarLinha(linha.id, 'nivel', v)}
                              readonly={!podeEditar}
                            />
                            {podeEditar && (
                              <button
                                type="button"
                                onClick={() => handleRemoverLinha(linha.id)}
                                className="text-[#8e8273] hover:text-[#ef4444] p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rituais */}
                <div className="space-y-3 border-t border-[#251419] pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                      Grimório de Rituais
                    </h4>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={handleAdicionarRitual}
                        className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Novo Ritual
                      </button>
                    )}
                  </div>

                  {ficha.rituais.length === 0 ? (
                    <p className="text-xs text-[#706456] italic">Nenhum ritual aprendido.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ficha.rituais.map((rit) => (
                        <div key={rit.id} className="p-3 bg-[#1b1115] rounded-xs border border-[#2b161c] space-y-2 relative">
                          {podeEditar && (
                            <button
                              type="button"
                              onClick={() => handleRemoverRitual(rit.id)}
                              className="absolute top-2 right-2 text-[#8e8273] hover:text-[#ef4444] p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <InlineField
                                label="Nome do Ritual"
                                value={rit.nome}
                                onChange={(v) => handleEditarRitual(rit.id, 'nome', v)}
                                readonly={!podeEditar}
                                placeholder="Defesa do Refúgio"
                              />
                            </div>
                            <div>
                              <InlineField
                                label="Nível"
                                value={rit.nivel}
                                onChange={(v) => handleEditarRitual(rit.id, 'nivel', v)}
                                readonly={!podeEditar}
                                placeholder="Nível I"
                              />
                            </div>
                          </div>
                          <div>
                            <InlineField
                              label="Anotações / Livro & Página"
                              value={rit.anotacoes}
                              onChange={(v) => handleEditarRitual(rit.id, 'anotacoes', v)}
                              readonly={!podeEditar}
                              placeholder="Livro Básico pág. 214..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* APARÊNCIA */}
              <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-4">
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                  <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-[#ef4444]" /> Aparência & Traços Físicos
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <InlineField
                    label="Idade Real"
                    value={ficha.aparencia.idade}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, idade: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="Ex: 142 anos"
                  />
                  <InlineField
                    label="Idade Aparente"
                    value={ficha.aparencia.idadeAparente}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, idadeAparente: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="Ex: 28 anos"
                  />
                  <InlineField
                    label="Data do Abraço"
                    value={ficha.aparencia.abraco}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, abraco: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="Ex: 1189 d.C."
                  />
                  <InlineField
                    label="Cabelos"
                    value={ficha.aparencia.cabelos}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, cabelos: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="Negros como azeviche"
                  />
                  <InlineField
                    label="Olhos"
                    value={ficha.aparencia.olhos}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, olhos: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="Cinzas frios"
                  />
                  <InlineField
                    label="Raça / Etnia"
                    value={ficha.aparencia.raca}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, raca: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="Caucasiano / Franco"
                  />
                  <InlineField
                    label="Sexo"
                    value={ficha.aparencia.sexo}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, sexo: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="Masculino"
                  />
                  <InlineField
                    label="Nacionalidade"
                    value={ficha.aparencia.nacionalidade}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, nacionalidade: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="Normando"
                  />
                  <InlineField
                    label="Altura"
                    value={ficha.aparencia.altura}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, altura: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="1.82 m"
                  />
                  <InlineField
                    label="Peso"
                    value={ficha.aparencia.peso}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        aparencia: { ...prev.aparencia, peso: v },
                      }))
                    }
                    readonly={!podeEditar}
                    placeholder="78 kg"
                  />
                </div>
              </div>

              {/* TEXTOS LONGOS: HISTÓRIA, PRELÚDIO, OBJETIVOS */}
              <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-5">
                <div className="border-b border-[#3b181b] pb-2">
                  <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Memórias, Prelúdio & Destino
                  </h3>
                </div>

                <div className="space-y-4">
                  <InlineField
                    label="História do Personagem"
                    value={ficha.biografia.historia}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        biografia: { ...prev.biografia, historia: v },
                      }))
                    }
                    multiline
                    rows={5}
                    placeholder="Narrações sobre a linhagem, feitos mortais e tragédias que o moldaram..."
                    readonly={!podeEditar}
                  />

                  <InlineField
                    label="Prelúdio (A Noite do Abraço)"
                    value={ficha.biografia.preludio}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        biografia: { ...prev.biografia, preludio: v },
                      }))
                    }
                    multiline
                    rows={4}
                    placeholder="Como se deu o encontro fatídico com seu senhor e a perda da alma para a Besta..."
                    readonly={!podeEditar}
                  />

                  <InlineField
                    label="Objetivos da Noite & Ambições Futuras"
                    value={ficha.biografia.objetivos}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        biografia: { ...prev.biografia, objetivos: v },
                      }))
                    }
                    multiline
                    rows={3}
                    placeholder="O que move este cainita contra os perigos da noite e as maquinações feudais..."
                    readonly={!podeEditar}
                  />

                  <InlineField
                    label="Notas Adicionais & Segredos da Crônica"
                    value={ficha.biografia.notas}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        biografia: { ...prev.biografia, notas: v },
                      }))
                    }
                    multiline
                    rows={3}
                    placeholder="Anotações particulares, contatos secretos, pistas obtidas..."
                    readonly={!podeEditar}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTÃO FIXO / FLUTUANTE DE SALVAR ALTERAÇÕES (Sempre visível enquanto visualiza/edita) */}
      {/* ========================================================================= */}
      {podeEditar && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 bg-[#140d12]/95 backdrop-blur-md border border-[#8b0000] p-3 sm:px-6 rounded-md shadow-[0_10px_35px_rgba(0,0,0,0.8)] pointer-events-auto">
            <div className="flex items-center gap-3">
              {hasChanges ? (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-xs sm:text-sm font-semibold text-amber-300">
                    Alterações pendentes não salvas
                  </span>
                </div>
              ) : mensagemSalvo ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs sm:text-sm font-semibold">
                    Ficha salva com sucesso!
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#a89f91]">
                  <span className="w-2 h-2 rounded-full bg-[#3b181b]" />
                  <span className="text-xs sm:text-sm">
                    Ficha sincronizada (Pressione <kbd className="font-mono bg-[#251419] px-1 py-0.5 rounded text-[10px]">Ctrl+S</kbd> para salvar)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {historicoTransacoesXP.length > 0 && (
                <button
                  type="button"
                  onClick={handleDesfazerUltimaCompra}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xs font-gothic text-xs font-bold uppercase tracking-wider bg-[#251419] hover:bg-[#3d1820] text-amber-300 border border-amber-800/80 cursor-pointer shadow-md transition-all active:scale-95"
                  title="Desfazer a última evolução comprada com XP nesta sessão"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Desfazer Ponto ({historicoTransacoesXP.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSalvar}
                className={`
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-gothic font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-lg
                  ${
                    hasChanges
                      ? 'bg-[#8b0000] hover:bg-[#a10e13] text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-105 active:scale-95'
                      : 'bg-[#2b1217] hover:bg-[#3d1820] text-[#d4af37] border border-[#522228]'
                  }
                `}
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA ADICIONAR DISCIPLINA */}
      {modalAddDisciplinaAberto && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#120d10] border border-[#8b0000] rounded-sm max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setModalAddDisciplinaAberto(false)}
              className="absolute top-3 right-3 text-[#a89f91] hover:text-white text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#d4af37]">
              <Sparkles className="w-5 h-5 text-[#ef4444]" />
              <h4 className="text-sm font-gothic font-bold uppercase tracking-wider">
                Adicionar Disciplina
              </h4>
            </div>

            <p className="text-xs text-[#ded6cb] leading-relaxed">
              Selecione uma das disciplinas do livro básico ou digite um nome personalizado:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                  Disciplina
                </label>
                <div className="relative">
                  <select
                    value={discSelecionada}
                    onChange={(e) => setDiscSelecionada(e.target.value)}
                    className="w-full bg-[#1e1317] hover:bg-[#251419] border border-[#522228] focus:border-[#d4af37] text-xs font-semibold text-[#ded6cb] px-2.5 py-2 rounded-xs appearance-none pr-8 cursor-pointer focus:outline-hidden"
                  >
                    {discDisponiveis.length > 0 && (
                      <optgroup
                        label="─── DISCIPLINAS DO LIVRO ───"
                        className="bg-[#181115] text-[#d4af37] font-gothic font-bold"
                      >
                        {discDisponiveis.map((d) => (
                          <option key={d} value={d} className="bg-[#120a0e] text-[#ded6cb] font-sans font-normal py-1">
                            {d}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <option value="__custom__" className="bg-[#241318] text-[#ef4444] font-bold py-1">
                      ✍️ Outra Disciplina (Digitar Nome Personalizado)
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#d4af37] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {discSelecionada === '__custom__' && (
                <div className="animate-fadeIn">
                  <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                    Nome da Nova Disciplina
                  </label>
                  <input
                    type="text"
                    value={discCustomNome}
                    onChange={(e) => setDiscCustomNome(e.target.value)}
                    placeholder="Ex: Necromancia, Serpentis, etc."
                    className="w-full bg-[#181115] border border-[#ef4444]/60 focus:border-[#ef4444] text-xs text-white px-2.5 py-1.5 rounded-xs focus:outline-hidden"
                    autoFocus
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                  Nível Inicial
                </label>
                <div className="flex items-center gap-2">
                  <Bolinhas
                    valor={discNivelInicial}
                    max={isNpc ? 10 : 5}
                    min={1}
                    onChange={(v) => setDiscNivelInicial(v)}
                  />
                  <span className="text-xs text-[#a89f91] font-serif">
                    (Nível {discNivelInicial})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3b181b]">
              <button
                type="button"
                onClick={() => setModalAddDisciplinaAberto(false)}
                className="px-3 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarNovaDisciplina}
                className="px-4 py-1.5 text-xs font-gothic font-bold uppercase tracking-wider text-white bg-[#8b0000] hover:bg-[#a30d12] rounded-xs cursor-pointer shadow-md"
              >
                Adicionar à Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA ADICIONAR ANTECEDENTE */}
      {modalAddAntecedenteAberto && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#120d10] border border-[#8b0000] rounded-sm max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setModalAddAntecedenteAberto(false)}
              className="absolute top-3 right-3 text-[#a89f91] hover:text-white text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#d4af37]">
              <BookOpen className="w-5 h-5 text-[#ef4444]" />
              <h4 className="text-sm font-gothic font-bold uppercase tracking-wider">
                Adicionar Antecedente
              </h4>
            </div>

            <p className="text-xs text-[#ded6cb] leading-relaxed">
              Escolha um dos antecedentes do livro básico ou crie um antecedente personalizado:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                  Antecedente
                </label>
                <div className="relative">
                  <select
                    value={antSelecionado}
                    onChange={(e) => setAntSelecionado(e.target.value)}
                    className="w-full bg-[#1e1317] hover:bg-[#251419] border border-[#522228] focus:border-[#d4af37] text-xs font-semibold text-[#ded6cb] px-2.5 py-2 rounded-xs appearance-none pr-8 cursor-pointer focus:outline-hidden"
                  >
                    <optgroup
                      label="─── ANTECEDENTES DO LIVRO ───"
                      className="bg-[#181115] text-[#d4af37] font-gothic font-bold"
                    >
                      {ANTECEDENTES_LIVRO_1E.map((a) => (
                        <option key={a} value={a} className="bg-[#120a0e] text-[#ded6cb] font-sans font-normal py-1">
                          {a}
                        </option>
                      ))}
                    </optgroup>
                    <option value="__custom__" className="bg-[#241318] text-[#ef4444] font-bold py-1">
                      ✍️ Outro Antecedente (Digitar Nome Personalizado)
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#d4af37] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {antSelecionado === '__custom__' && (
                <div className="animate-fadeIn">
                  <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                    Nome do Novo Antecedente
                  </label>
                  <input
                    type="text"
                    value={antCustomNome}
                    onChange={(e) => setAntCustomNome(e.target.value)}
                    placeholder="Ex: Domínio, Fama, Lacaios, etc."
                    className="w-full bg-[#181115] border border-[#ef4444]/60 focus:border-[#ef4444] text-xs text-white px-2.5 py-1.5 rounded-xs focus:outline-hidden"
                    autoFocus
                  />
                </div>
              )}

              {(antSelecionado === 'Geração' || antCustomNome.toLowerCase().includes('geração')) && (
                <div className="p-2.5 bg-[#251015] border border-[#8b0000]/60 rounded-xs text-[11px] text-[#ded6cb] space-y-1 animate-fadeIn">
                  <p className="font-bold text-[#d4af37] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" /> Regra de Geração:
                  </p>
                  <p>
                    {isNpc ? (
                      <>
                        Para NPCs, o antecedente Geração pode ir até <strong>9 pontos (3ª Geração - Antediluviano)</strong>, liberando até 100 de Reserva de Sangue e traços até 10.
                      </>
                    ) : (
                      <>
                        A geração base é <strong>12ª Geração</strong>. Cada ponto neste antecedente reduz a geração em 1 nível (máx 5 pts = 7ª Geração) e aumenta automaticamente a Reserva de Sangue máxima (de 11 até 20).
                      </>
                    )}
                  </p>
                </div>
              )}

              <div>
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                  Nível Inicial
                </label>
                <div className="flex items-center gap-2">
                  <Bolinhas
                    valor={antNivelInicial}
                    max={
                      antSelecionado === 'Geração' || antCustomNome.toLowerCase().includes('geração')
                        ? (isNpc ? 9 : 5)
                        : (isNpc ? 10 : 5)
                    }
                    min={1}
                    onChange={(v) => setAntNivelInicial(v)}
                  />
                  <span className="text-xs text-[#a89f91] font-serif">
                    (Nível {antNivelInicial})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3b181b]">
              <button
                type="button"
                onClick={() => setModalAddAntecedenteAberto(false)}
                className="px-3 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarNovoAntecedente}
                className="px-4 py-1.5 text-xs font-gothic font-bold uppercase tracking-wider text-white bg-[#8b0000] hover:bg-[#a30d12] rounded-xs cursor-pointer shadow-md"
              >
                Adicionar à Ficha
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Configuração de Atalhos do Card Resumido */}
      {modalAtalhosAberto && (
        <ModalConfigAtalhosPersonagem
          personagem={ficha}
          configMesa={configMesa}
          onSalvar={(novosAtalhos) => {
            updateFicha((prev) => ({
              ...prev,
              atalhosCard: novosAtalhos,
            }));
            onSalvar({
              ...ficha,
              atalhosCard: novosAtalhos,
            });
            setModalAtalhosAberto(false);
          }}
          onFechar={() => setModalAtalhosAberto(false)}
        />
      )}

      {/* MODAL DE EDIÇÃO DE QUALIDADE / DEFEITO (EXCLUSIVO MESTRE) */}
      {itemEditandoQD && usuarioAtual.role === 'mestre' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#120d10] border border-[#d4af37] rounded-sm max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setItemEditandoQD(null)}
              className="absolute top-3 right-3 text-[#a89f91] hover:text-white text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#d4af37]">
              <Pencil className="w-4 h-4 text-[#d4af37]" />
              <h4 className="text-sm font-gothic font-bold uppercase tracking-wider">
                Editar {itemEditandoQD.tipo === 'qualidade' ? 'Qualidade' : 'Defeito'} (Mestre)
              </h4>
            </div>

            <p className="text-xs text-[#a89f91]">
              Ajuste as propriedades do traço na ficha. Alterações de pontos e vitalidade recalculam automaticamente os bônus e a trilha de saúde.
            </p>

            <form onSubmit={handleSalvarEdicaoQD} className="space-y-3">
              <div>
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                  Nome do Traço
                </label>
                <input
                  type="text"
                  value={formEditQD.nome}
                  onChange={(e) => setFormEditQD((prev) => ({ ...prev, nome: e.target.value }))}
                  required
                  className="w-full bg-[#181115] border border-[#4a2228] focus:border-[#d4af37] text-xs text-[#ded6cb] px-2.5 py-1.5 rounded-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                    Tipo
                  </label>
                  <select
                    value={formEditQD.tipo}
                    onChange={(e) =>
                      setFormEditQD((prev) => ({
                        ...prev,
                        tipo: e.target.value as 'qualidade' | 'defeito',
                      }))
                    }
                    className="w-full bg-[#181115] border border-[#4a2228] focus:border-[#d4af37] text-xs text-[#ded6cb] px-2.5 py-1.5 rounded-xs focus:outline-hidden"
                  >
                    <option value="qualidade">Qualidade (Custo)</option>
                    <option value="defeito">Defeito (Bônus)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                    Pontos / Custo
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formEditQD.custo}
                    onChange={(e) =>
                      setFormEditQD((prev) => ({
                        ...prev,
                        custo: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full bg-[#181115] border border-[#4a2228] focus:border-[#d4af37] text-xs text-[#ded6cb] px-2.5 py-1.5 rounded-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                  Categoria
                </label>
                <select
                  value={formEditQD.categoria}
                  onChange={(e) =>
                    setFormEditQD((prev) => ({
                      ...prev,
                      categoria: e.target.value as 'fisico' | 'mental' | 'social' | 'sobrenatural',
                    }))
                  }
                  className="w-full bg-[#181115] border border-[#4a2228] focus:border-[#d4af37] text-xs text-[#ded6cb] px-2.5 py-1.5 rounded-xs focus:outline-hidden"
                >
                  <option value="fisico">Físico</option>
                  <option value="mental">Mental</option>
                  <option value="social">Social</option>
                  <option value="sobrenatural">Sobrenatural</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                  Descrição / Regra
                </label>
                <textarea
                  rows={3}
                  value={formEditQD.descricao}
                  onChange={(e) =>
                    setFormEditQD((prev) => ({ ...prev, descricao: e.target.value }))
                  }
                  placeholder="Descrição opcional do efeito do traço..."
                  className="w-full bg-[#181115] border border-[#4a2228] focus:border-[#d4af37] text-xs text-[#ded6cb] p-2 rounded-xs focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#2d1217]">
                <button
                  type="button"
                  onClick={() => setItemEditandoQD(null)}
                  className="px-3 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-gothic font-bold uppercase tracking-wider text-black bg-[#d4af37] hover:bg-[#e5c158] rounded-xs cursor-pointer shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
