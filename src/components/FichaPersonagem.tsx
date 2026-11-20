import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  HabilidadeSecundariaItem,
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
  Check,
  RotateCcw,
  X,
  ChevronDown,
  SlidersHorizontal,
  Pencil,
  Search,
  FileText,
  Minus,
  Award,
} from 'lucide-react';
import {
  getCatalogoQualidadesDefeitos,
  type ModeloQualidadeDefeito,
} from '../data/qualidadesDefeitos1E';
import { ModalConfigAtalhosPersonagem } from './ModalConfigAtalhosPersonagem';
import { ModalExtratoGastosMestre } from './ModalExtratoGastosMestre';
import { ModalAjustarXP } from './ModalAjustarXP';
import { ModalAddHabilidadeSecundaria } from './ModalAddHabilidadeSecundaria';
import { obterValoresIniciaisTraços } from '../data/calculosPontosBonus';
import {
  calcularStatusCombate,
  calcularDanoArma,
  calcularParadaAtaqueArma,
  extrairClasseArmadura,
  extrairPenalidadeArmadura,
  ARMAS_CATALOGO_1E,
  ARMADURAS_CATALOGO_1E,
  type ModeloArma1E,
  type ModeloArmadura1E,
} from '../data/combate1E';

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
  type AbaFicha = 'caracteristicas' | 'combate' | 'equipamentos' | 'magia' | 'biografia';
  const [abaAtiva, setAbaAtiva] = useState<AbaFicha>('caracteristicas');
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
  // Controle de Edição Livre pelo Mestre (permite alterar traços diretamente sem consumir XP)
  const [modoEdicaoLivre, setModoEdicaoLivre] = useState<boolean>(false);

  // Status Dinâmico de Combate, Armaduras e Armas (1ª Edição)
  const statusCombate = useMemo(() => calcularStatusCombate(ficha), [ficha]);
  const [modalCatalogoArmasAberto, setModalCatalogoArmasAberto] = useState(false);
  const [modalCatalogoArmadurasAberto, setModalCatalogoArmadurasAberto] = useState(false);
  const [buscaCatalogoArmas, setBuscaCatalogoArmas] = useState('');
  const [filtroCategoriaArmas, setFiltroCategoriaArmas] = useState<
    'todas' | 'branca' | 'distancia' | 'escudo' | 'briga' | 'magica'
  >('todas');
  const [buscaCatalogoArmaduras, setBuscaCatalogoArmaduras] = useState('');
  const [somenteArmadurasMagicas, setSomenteArmadurasMagicas] = useState(false);

  useEffect(() => {
    storageService.carregarConfiguracaoMesaRemota().then((remoto) => {
      if (remoto) setConfigMesa(remoto);
    });
  }, []);

  useEffect(() => {
    if (modalCatalogoArmasAberto || modalCatalogoArmadurasAberto) {
      storageService.carregarConfiguracaoMesaRemota().then((remoto) => {
        if (remoto) setConfigMesa(remoto);
      });
    }
  }, [modalCatalogoArmasAberto, modalCatalogoArmadurasAberto]);

  const catalogoArmasAtivo =
    Array.isArray(configMesa.catalogoArmas) && configMesa.catalogoArmas.length > 0
      ? configMesa.catalogoArmas
      : ARMAS_CATALOGO_1E;

  const catalogoArmadurasAtivo =
    Array.isArray(configMesa.catalogoArmaduras) && configMesa.catalogoArmaduras.length > 0
      ? configMesa.catalogoArmaduras
      : ARMADURAS_CATALOGO_1E;

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

  // Modal de Edição de História e Biografia do Personagem
  const [modalHistoriaAberto, setModalHistoriaAberto] = useState(false);
  const [abaModalHistoria, setAbaModalHistoria] = useState<'historia' | 'preludio' | 'objetivos' | 'notas'>('historia');
  const [tempHistoria, setTempHistoria] = useState('');
  const [tempPreludio, setTempPreludio] = useState('');
  const [tempObjetivos, setTempObjetivos] = useState('');
  const [tempNotas, setTempNotas] = useState('');

  const handleAbrirModalHistoria = () => {
    setTempHistoria(ficha.biografia?.historia || '');
    setTempPreludio(ficha.biografia?.preludio || '');
    setTempObjetivos(ficha.biografia?.objetivos || '');
    setTempNotas(ficha.biografia?.notas || '');
    setAbaModalHistoria('historia');
    setModalHistoriaAberto(true);
  };

  const handleSalvarModalHistoria = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const novaBio = {
      historia: tempHistoria,
      preludio: tempPreludio,
      objetivos: tempObjetivos,
      notas: tempNotas,
    };
    updateFicha((prev) => ({
      ...prev,
      biografia: novaBio,
    }));

    const fichaSalva: Personagem = {
      ...ficha,
      biografia: novaBio,
    };
    storageService.salvarPersonagem(fichaSalva);

    setModalHistoriaAberto(false);
    setMensagemSalvo(true);
    setTimeout(() => setMensagemSalvo(false), 3000);
  };

  const autoResizeTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(260, el.scrollHeight + 4)}px`;
  };

  // Cálculo de Custo Exato em XP
  const calcularCustoXP = (
    tipo: 'atributo' | 'habilidade' | 'habilidade_secundaria' | 'disciplina' | 'trilha' | 'vontade' | 'caminho' | 'virtude',
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
        case 'habilidade_secundaria':
          // Habilidade Secundária: 1ª bola = 2 XP; Nível atual x 1
          total += n === 0 ? 2 : n * 1;
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
          // Força de Vontade: Nível atual x 2 (1ª Edição 1996 - Livro Básico)
          total += n * 2;
          break;
        case 'caminho':
          // Caminho: Nível atual x 2
          total += n * 2;
          break;
        case 'virtude':
          // Virtude: Nível atual x 3 (1ª Edição 1996 - Livro Básico)
          total += n * 3;
          break;
      }
    }
    return total;
  };

  const tentarEvoluirComXP = (
    tipo: 'atributo' | 'habilidade' | 'habilidade_secundaria' | 'disciplina' | 'trilha' | 'vontade' | 'caminho' | 'virtude',
    nomeItem: string,
    valorAtual: number,
    novoValor: number,
    aplicarMudanca: (prev: Personagem) => Personagem,
    extra?: { isPrimaria?: boolean; isClan?: boolean }
  ) => {
    const isEmCriacao = ficha.criacao?.status === 'em_criacao';

    // Se o Mestre ativou o modo de edição livre, ou a ficha está em criação, ou está diminuindo o valor
    if (modoEdicaoLivre || isEmCriacao || novoValor < valorAtual) {
      updateFicha(aplicarMudanca);
      return;
    }

    if (novoValor === valorAtual) return;

    const custo = calcularCustoXP(tipo, valorAtual, novoValor, extra);
    const xpDisponivel = ficha.xp?.atual || 0;

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
          atual: Math.max(0, (mutada.xp?.atual || 0) - custo),
          totalGasto: (mutada.xp?.totalGasto || 0) + custo,
          historico: novaLinhaHistorico + (mutada.xp?.historico ? '\n' + mutada.xp.historico : ''),
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

  // Permissão de edição: Mestre pode editar tudo; Jogador só pode editar a sua própria ficha (nunca NPCs)
  const podeEditar =
    usuarioAtual.role === 'mestre' || (ficha.usuarioId === usuarioAtual.id && ficha.tipo !== 'npc');

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

  // Ref para acompanhar estado de alterações não salvas sem reiniciar o polling
  const hasChangesRef = useRef(hasChanges);
  hasChangesRef.current = hasChanges;

  // Sincronização em tempo real com Cloudflare D1 ao abrir, ao focar e periodicamente (recebe comandos do Mestre como XP e Reabrir Criação)
  useEffect(() => {
    let ativo = true;

    const checarAtualizacaoRemota = async () => {
      if (hasChangesRef.current) return;
      const remoto = await storageService.carregarPersonagemRemoto(personagem.id, usuarioAtual);
      if (!ativo || !remoto) return;

      setFicha((atual) => {
        const remotoTs = remoto.updatedAt ? new Date(remoto.updatedAt).getTime() : 0;
        const atualTs = atual.updatedAt ? new Date(atual.updatedAt).getTime() : 0;
        const mudouXP = (remoto.xp?.atual || 0) !== (atual.xp?.atual || 0);
        const mudouStatusCriacao =
          remoto.criacao?.status !== atual.criacao?.status ||
          remoto.criacao?.etapa !== atual.criacao?.etapa;

        if (remotoTs > atualTs || mudouXP || mudouStatusCriacao) {
          if (mudouXP || mudouStatusCriacao) {
            setSucessoXP('🔄 Ficha sincronizada automaticamente com as alterações do Narrador!');
            setTimeout(() => setSucessoXP(null), 4000);
          }
          return remoto;
        }
        return atual;
      });
    };

    checarAtualizacaoRemota();

    const intervalo = setInterval(checarAtualizacaoRemota, 10000);
    const onFocus = () => checarAtualizacaoRemota();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checarAtualizacaoRemota();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      ativo = false;
      clearInterval(intervalo);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [personagem.id, usuarioAtual.id, usuarioAtual.role]);

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

    const nivelFinal = Math.max(0, Math.min(isNpc ? 10 : 8, discNivelInicial));
    const claEncontrado = CLAS_DARK_AGES_1E.find(
      (c) => c.nome.trim().toLowerCase() === (ficha.cla || '').trim().toLowerCase()
    );
    const isClan = Boolean(
      claEncontrado &&
        claEncontrado.disciplinas.some(
          (cd) => cd.trim().toLowerCase() === nomeFinal.trim().toLowerCase()
        )
    );

    const isEmCriacao = ficha.criacao?.status === 'em_criacao';

    // Se NÃO estiver em criação e nem em modo de edição livre, e comprou com nível > 0:
    // debita o custo em XP (1ª bolinha = 10 XP; evoluções seguintes = nível atual x 5 se clã, ou x 7 se fora de clã)
    if (!isEmCriacao && !modoEdicaoLivre && nivelFinal > 0) {
      const custoXP = calcularCustoXP('disciplina', 0, nivelFinal, { isClan });
      const xpDisponivel = ficha.xp?.atual || 0;

      if (xpDisponivel < custoXP) {
        setAvisoXP(
          `XP Insuficiente! Adquirir ${nomeFinal} nível ${nivelFinal} custa ${custoXP} XP (1ª bolinha = 10 XP${
            nivelFinal > 1 ? ` + evoluções a nível x ${isClan ? 5 : 7}` : ''
          }), mas você possui apenas ${xpDisponivel} XP.`
        );
        setTimeout(() => setAvisoXP(null), 5500);
        return;
      }

      const estadoAnterior = JSON.parse(JSON.stringify(ficha));
      const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const descricao = `Nova Disciplina ${nomeFinal} (Nível ${nivelFinal})`;
      const novaLinhaHistorico = `- ${custoXP} XP: ${descricao} às ${hora}`;

      const nova: ItemSimplesNivel = {
        id: 'disc_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        nome: nomeFinal,
        nivel: nivelFinal,
      };

      setFicha((prev) => ({
        ...prev,
        disciplinas: [...prev.disciplinas, nova],
        xp: {
          ...prev.xp,
          atual: Math.max(0, (prev.xp?.atual || 0) - custoXP),
          totalGasto: (prev.xp?.totalGasto || 0) + custoXP,
          historico: novaLinhaHistorico + (prev.xp?.historico ? '\n' + prev.xp.historico : ''),
        },
      }));

      setHistoricoTransacoesXP((prev) => [
        {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 4),
          descricao,
          custoXP,
          estadoAnterior,
        },
        ...prev,
      ]);
      setHasChanges(true);
      setSucessoXP(`✓ ${descricao} adquirida (-${custoXP} XP).`);
      setTimeout(() => setSucessoXP(null), 4000);

      storageService.registrarLogAlteracao({
        personagemId: ficha.id,
        personagemNome: ficha.nome,
        jogadorNome: ficha.jogador || usuarioAtual.nome,
        tipo: 'xp',
        descricao: `Gasto de XP: ${descricao} (-${custoXP} XP)`,
        detalhes: `XP Restante: ${xpDisponivel - custoXP}`,
      });

      setModalAddDisciplinaAberto(false);
      setDiscCustomNome('');
      setDiscNivelInicial(1);
      return;
    }

    const nova: ItemSimplesNivel = {
      id: 'disc_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      nome: nomeFinal,
      nivel: nivelFinal,
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
        (c) => c.nome.trim().toLowerCase() === (ficha.cla || '').trim().toLowerCase()
      );
      const isClan = Boolean(
        claEncontrado &&
          claEncontrado.disciplinas.some(
            (cd) => cd.trim().toLowerCase() === disc.nome.trim().toLowerCase()
          )
      );

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

  // Antecedentes (Travados após a criação da ficha - apenas o Narrador ou modo livre podem alterar)
  const handleAbrirModalAddAntecedente = () => {
    if (!isEmCriacao && !modoEdicaoLivre && usuarioAtual.role !== 'mestre') {
      alert('Antecedentes não podem mais ser adicionados após a finalização da criação.');
      return;
    }
    setAntSelecionado('Aliados');
    setAntCustomNome('');
    setAntNivelInicial(1);
    setModalAddAntecedenteAberto(true);
  };

  const handleConfirmarNovoAntecedente = () => {
    if (!isEmCriacao && !modoEdicaoLivre && usuarioAtual.role !== 'mestre') {
      alert('Antecedentes não podem mais ser adicionados após a finalização da criação.');
      return;
    }
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
    if (!isEmCriacao && !modoEdicaoLivre && usuarioAtual.role !== 'mestre') {
      alert('Antecedentes não podem ser removidos após a finalização da criação.');
      return;
    }
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
    if (!isEmCriacao && !modoEdicaoLivre && usuarioAtual.role !== 'mestre') {
      alert(
        'Antecedentes não podem ser alterados após a finalização da criação. Na Idade das Trevas, antecedentes só podem ser concedidos ou modificados pelo Narrador durante a crônica.'
      );
      return;
    }
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
  const isMestre = usuarioAtual.role === 'mestre';
  const isEmCriacao = !isNpc && ficha.criacao?.status === 'em_criacao';
  const deveDestacarBonus = isMestre || isEmCriacao;
  const valoresIniciais = useMemo(() => obterValoresIniciaisTraços(ficha, configMesa), [ficha, configMesa]);
  const [modalExtratoAberto, setModalExtratoAberto] = useState<boolean>(false);
  const [modalAjustarXPAberto, setModalAjustarXPAberto] = useState<boolean>(false);
  const [modalAddHabSecundariaAberto, setModalAddHabSecundariaAberto] = useState<boolean>(false);

  const listaQD = ficha.qualidadesDefeitos || [];
  const qualidadesEscolhidas = listaQD.filter((q) => q.tipo === 'qualidade');
  const defeitosEscolhidos = listaQD.filter((d) => d.tipo === 'defeito');
  const totalPontosDefeitos = defeitosEscolhidos.reduce((acc, d) => acc + d.custo, 0);
  const totalPontosQualidades = qualidadesEscolhidas.reduce((acc, q) => acc + q.custo, 0);
  const maxDefeitosConfig = configMesa.maxPontosDefeitos ?? 7;

  const handleRemoverQualidadeDefeito = (id: string) => {
    if (!isNpc && !isEmCriacao && usuarioAtual.role !== 'mestre' && !podeEditar) return;
    const novaLista = (ficha.qualidadesDefeitos || []).filter((q) => q.id !== id);
    const novaVitalidade = ajustarVitalidadeCorpoGrande(ficha.vitalidade, novaLista);
    updateFicha((prev) => ({
      ...prev,
      qualidadesDefeitos: novaLista,
      vitalidade: novaVitalidade,
    }));
  };

  // Atualização direta da observação/especificação de uma qualidade ou defeito
  const handleAtualizarObservacaoQD = (id: string, observacao: string) => {
    if (!podeEditar) return;
    updateFicha((prev) => ({
      ...prev,
      qualidadesDefeitos: (prev.qualidadesDefeitos || []).map((item) =>
        item.id === id ? { ...item, observacao } : item
      ),
    }));
  };

  // Estados e handlers para o Catálogo Oficial de Qualidades e Defeitos (1ª Edição)
  const [modalCatalogoQDAberto, setModalCatalogoQDAberto] = useState(false);
  const [filtroTipoQD, setFiltroTipoQD] = useState<'todos' | 'qualidade' | 'defeito'>('todos');
  const [filtroCatQD, setFiltroCatQD] = useState<'todas' | 'fisico' | 'mental' | 'social' | 'sobrenatural'>('todas');
  const [buscaQD, setBuscaQD] = useState('');

  const listaFiltradaQD = getCatalogoQualidadesDefeitos(configMesa).filter((item) => {
    const bateTipo = filtroTipoQD === 'todos' || item.tipo === filtroTipoQD;
    const bateCat = filtroCatQD === 'todas' || item.categoria === filtroCatQD;
    const termo = buscaQD.toLowerCase().trim();
    const bateBusca =
      !termo ||
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo);

    return bateTipo && bateCat && bateBusca;
  });

  const handleToggleQualidadeDefeito = (item: ModeloQualidadeDefeito) => {
    if (!podeEditar) return;
    const jaExiste = (ficha.qualidadesDefeitos || []).some(
      (q) => q.nome.toLowerCase().trim() === item.nome.toLowerCase().trim()
    );

    let novaLista: QualidadeDefeitoItem[];
    if (jaExiste) {
      novaLista = (ficha.qualidadesDefeitos || []).filter(
        (q) => q.nome.toLowerCase().trim() !== item.nome.toLowerCase().trim()
      );
    } else {
      const novo: QualidadeDefeitoItem = {
        id: 'qd_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        nome: item.nome,
        tipo: item.tipo,
        categoria: item.categoria,
        custo: item.pontos,
        descricao: item.descricao,
      };
      novaLista = [...(ficha.qualidadesDefeitos || []), novo];
    }

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
  const [obsCustomQD, setObsCustomQD] = useState('');

  // Estado e handlers para edição de Qualidades/Defeitos (Exclusivo Mestre)
  const [itemEditandoQD, setItemEditandoQD] = useState<QualidadeDefeitoItem | null>(null);
  const [formEditQD, setFormEditQD] = useState<{
    nome: string;
    tipo: 'qualidade' | 'defeito';
    custo: number;
    categoria: 'fisico' | 'mental' | 'social' | 'sobrenatural';
    descricao: string;
    observacao: string;
  }>({
    nome: '',
    tipo: 'qualidade',
    custo: 1,
    categoria: 'fisico',
    descricao: '',
    observacao: '',
  });

  const handleAbrirEdicaoQD = (item: QualidadeDefeitoItem) => {
    setItemEditandoQD(item);
    setFormEditQD({
      nome: item.nome,
      tipo: item.tipo,
      custo: item.custo,
      categoria: item.categoria,
      descricao: item.descricao || '',
      observacao: item.observacao || '',
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
          observacao: formEditQD.observacao.trim() || undefined,
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
      observacao: obsCustomQD.trim() || undefined,
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
    setObsCustomQD('');
    setPontosCustomQD(1);
    setMostrarFormCustomQD(false);
  };

  // Habilidades Secundárias (Canônicas 1ª Edição)
  const handleAdicionarHabilidadeSecundaria = (
    nova: HabilidadeSecundariaItem,
    custoXP: number
  ) => {
    const isEmCriacao = ficha.criacao?.status === 'em_criacao';
    const isGratis = modoEdicaoLivre || isEmCriacao;

    if (!isGratis && custoXP > 0) {
      const xpDisponivel = ficha.xp?.atual || 0;
      if (xpDisponivel < custoXP) {
        setAvisoXP(
          `XP Insuficiente! Adquirir ${nova.nome} nível ${nova.nivel} custa ${custoXP} XP, mas você possui apenas ${xpDisponivel} XP.`
        );
        setTimeout(() => setAvisoXP(null), 5000);
        return;
      }

      const estadoAnterior = JSON.parse(JSON.stringify(ficha));
      const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const descricao = `Nova Hab. Secundária ${nova.nome} (Nível ${nova.nivel})`;
      const novaLinhaHistorico = `- ${custoXP} XP: ${descricao} às ${hora}`;

      const listaAtual = ficha.habilidadesSecundarias || [];
      const novaLista = [...listaAtual, nova];

      const atualizada: Personagem = {
        ...ficha,
        habilidadesSecundarias: novaLista,
        xp: {
          ...ficha.xp,
          atual: Math.max(0, (ficha.xp?.atual || 0) - custoXP),
          totalGasto: (ficha.xp?.totalGasto || 0) + custoXP,
          historico: novaLinhaHistorico + (ficha.xp?.historico ? '\n' + ficha.xp.historico : ''),
        },
        updatedAt: new Date().toISOString(),
      };

      setFicha(atualizada);
      onSalvar(atualizada);
      setHistoricoTransacoesXP((prev) => [
        {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 4),
          descricao,
          custoXP,
          estadoAnterior,
        },
        ...prev,
      ]);
      setHasChanges(false);
      setSucessoXP(`✓ ${descricao} adquirida (-${custoXP} XP).`);
      setTimeout(() => setSucessoXP(null), 4000);

      storageService.salvarPersonagem(atualizada);
      storageService.registrarLogAlteracao({
        personagemId: ficha.id,
        personagemNome: ficha.nome,
        jogadorNome: ficha.jogador || usuarioAtual.nome,
        tipo: 'xp',
        descricao: `Gasto de XP: ${descricao} (-${custoXP} XP)`,
        detalhes: `XP Restante: ${xpDisponivel - custoXP}`,
      });

      setModalAddHabSecundariaAberto(false);
      return;
    }

    const listaAtual = ficha.habilidadesSecundarias || [];
    const novaLista = [...listaAtual, nova];
    updateFicha((prev) => ({
      ...prev,
      habilidadesSecundarias: novaLista,
    }));
    setModalAddHabSecundariaAberto(false);
  };

  const handleNivelHabilidadeSecundaria = (id: string, novoValor: number) => {
    const hab = (ficha.habilidadesSecundarias || []).find((h) => h.id === id);
    if (!hab) return;

    tentarEvoluirComXP(
      'habilidade_secundaria',
      `Hab. Secundária ${hab.nome}`,
      hab.nivel,
      novoValor,
      (prev) => ({
        ...prev,
        habilidadesSecundarias: (prev.habilidadesSecundarias || []).map((h) =>
          h.id === id ? { ...h, nivel: novoValor } : h
        ),
      })
    );
  };

  const handleRemoverHabilidadeSecundaria = (id: string) => {
    if (!podeEditar) return;
    const hab = (ficha.habilidadesSecundarias || []).find((h) => h.id === id);
    if (!confirm(`Deseja remover a habilidade secundária "${hab?.nome || 'esta habilidade'}"?`)) return;

    updateFicha((prev) => ({
      ...prev,
      habilidadesSecundarias: (prev.habilidadesSecundarias || []).filter((h) => h.id !== id),
    }));
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
  const renderBadgePontos = (
    gastos: number,
    max: number,
    prioridadeNome?: string,
    custoUnitarioBonus: number = 1
  ) => {
    // Se a ficha não está em criação e o usuário não é o mestre, não polui a tela com contadores
    if (!isEmCriacao && !isMestre) return null;

    const pontosIniciais = Math.min(gastos, max);
    const bolinhasBonus = Math.max(0, gastos - max);
    const custoTotalBonus = bolinhasBonus * custoUnitarioBonus;
    const atingiuInicial = pontosIniciais === max;
    const excedeuEmIniciais = ficha.criacao?.etapa === 'iniciais' && gastos > max;

    if (excedeuEmIniciais) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-sans font-bold bg-red-950 text-red-300 border border-red-600 animate-pulse"
          title={`Limite da etapa inicial excedido (${gastos}/${max}). Avance para a etapa de Bônus para comprar pontos adicionais.`}
        >
          <span>{gastos} / {max} pts (Excedeu Iniciais)</span>
        </span>
      );
    }

    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-sans font-bold bg-[#1e1215] border border-[#3d181e] text-[#ded6cb] transition-all"
        title={prioridadeNome ? `Cota Inicial: ${prioridadeNome} (${max} pontos)` : undefined}
      >
        <span className={atingiuInicial ? 'text-green-400' : 'text-[#d4af37]'}>
          {pontosIniciais}/{max} Iniciais
        </span>
        {atingiuInicial && <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />}
        {bolinhasBonus > 0 && (
          <span
            className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950/80 text-amber-300 border border-amber-600 font-mono font-bold"
            title={`${bolinhasBonus} bolinha${bolinhasBonus > 1 ? 's' : ''} comprada${bolinhasBonus > 1 ? 's' : ''} com Pontos Bônus (${custoUnitarioBonus} pts cada = -${custoTotalBonus} pts)`}
          >
            +{bolinhasBonus} {bolinhasBonus === 1 ? 'Bolinha' : 'Bolinhas'} (-{custoTotalBonus} pts)
          </span>
        )}
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

  const handleAdicionarArmaDoCatalogo = (modelo: ModeloArma1E) => {
    const forcaPersonagem = ficha.atributos.forca || 1;
    const recursosPersonagem =
      ficha.antecedentes.find((a) => a.nome.toLowerCase().includes('recurso'))?.nivel || 0;

    const temForca = forcaPersonagem >= (modelo.forcaMinima || 1);
    const temRecursos = recursosPersonagem >= (modelo.recursosMinimo || 0);

    // Se jogador não tem recursos e não é mestre, bloqueia com aviso explicativo
    if (!temRecursos && usuarioAtual.role !== 'mestre' && ficha.tipo !== 'npc') {
      alert(
        `Recursos Insuficientes: "${modelo.nome}" requer Recursos nível ${modelo.recursosMinimo} (seu personagem possui Recursos ${recursosPersonagem}). Você precisa da autorização do Narrador ou de espólio de batalha para adquirir esta arma.`
      );
      return;
    }

    // Se tiver recursos insuficientes mas for mestre (ou aprovado)
    if (!temRecursos && usuarioAtual.role === 'mestre') {
      if (
        !confirm(
          `Aviso do Narrador: "${modelo.nome}" requer Recursos nível ${modelo.recursosMinimo}, mas o personagem tem Recursos ${recursosPersonagem}. Deseja conceder esta arma como espólio ou presente de seu senhor?`
        )
      ) {
        return;
      }
    }

    // Se forca for insuficiente, avisa sobre a penalidade de dificuldade
    if (!temForca) {
      if (
        !confirm(
          `Aviso de Força Insuficiente: "${modelo.nome}" requer Força mínima ${modelo.forcaMinima} (seu personagem possui Força ${forcaPersonagem}). O personagem sofrerá penalidade de +${modelo.forcaMinima - forcaPersonagem} na Dificuldade dos testes de ataque devido ao peso da arma. Deseja adicionar mesmo assim?`
        )
      ) {
        return;
      }
    }

    const nova: Arma = {
      id: 'arma_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      nome: modelo.nome,
      categoria: modelo.categoria,
      dificuldade: modelo.dificuldade,
      dano: modelo.dano,
      ocultacao: modelo.ocultacao,
      alcance: modelo.alcance,
      forcaMinima: modelo.forcaMinima,
      recursosMinimo: modelo.recursosMinimo,
      magica: modelo.magica,
      danoAgravado: modelo.danoAgravado,
      bonusMagico: modelo.bonusMagico,
      poderMagico: modelo.poderMagico,
    };
    updateFicha((prev) => ({
      ...prev,
      armas: [...prev.armas, nova],
    }));
    setModalCatalogoArmasAberto(false);
  };

  // Armaduras
  const handleAdicionarArmadura = () => {
    const nova: Armadura = {
      id: 'armadura_' + Date.now().toString(36),
      nome: 'Cota de Malha Reforçada',
      classe: '3',
      penalidade: '-1',
      equipada: true,
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

  const handleAlternarEquiparArmadura = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      armaduras: prev.armaduras.map((a) =>
        a.id === id ? { ...a, equipada: a.equipada === false ? true : false } : a
      ),
    }));
  };

  const handleAdicionarArmaduraDoCatalogo = (modelo: ModeloArmadura1E) => {
    const forcaPersonagem = ficha.atributos.forca || 1;
    const recursosPersonagem =
      ficha.antecedentes.find((a) => a.nome.toLowerCase().includes('recurso'))?.nivel || 0;

    const temForca = forcaPersonagem >= (modelo.forcaMinima || 1);
    const temRecursos = recursosPersonagem >= (modelo.recursosMinimo || 0);

    // Se jogador não tem recursos e não é mestre, bloqueia com aviso
    if (!temRecursos && usuarioAtual.role !== 'mestre' && ficha.tipo !== 'npc') {
      alert(
        `Recursos Insuficientes: "${modelo.nome}" requer Recursos nível ${modelo.recursosMinimo} (seu personagem possui Recursos ${recursosPersonagem}). Armaduras medievais de metal são itens de alto prestígio e custo nobre. Consulte o Narrador para autorização.`
      );
      return;
    }

    // Se for mestre concedendo com recursos insuficientes
    if (!temRecursos && usuarioAtual.role === 'mestre') {
      if (
        !confirm(
          `Aviso do Narrador: "${modelo.nome}" requer Recursos nível ${modelo.recursosMinimo}, mas o personagem tem Recursos ${recursosPersonagem}. Deseja conceder esta armadura como espólio de guerra ou recompensa feudal?`
        )
      ) {
        return;
      }
    }

    // Se forca for insuficiente, avisa sobre a sobrecarga de peso
    if (!temForca) {
      if (
        !confirm(
          `Aviso de Sobrecarga de Armadura: "${modelo.nome}" requer Força mínima ${modelo.forcaMinima} para suportar o peso da couraça (seu personagem possui Força ${forcaPersonagem}). O personagem sofrerá -${modelo.forcaMinima - forcaPersonagem} Destreza ADICIONAL por sobrecarga de peso. Deseja adicionar mesmo assim?`
        )
      ) {
        return;
      }
    }

    const nova: Armadura = {
      id: 'armadura_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      nome: modelo.nome,
      classe: modelo.classe,
      penalidade: modelo.penalidade,
      equipada: true,
      forcaMinima: modelo.forcaMinima,
      recursosMinimo: modelo.recursosMinimo,
      penalidadePercepcao: modelo.penalidadePercepcao || 0,
      magica: modelo.magica,
      absorveAgravado: modelo.absorveAgravado,
      bonusMagico: modelo.bonusMagico,
      poderMagico: modelo.poderMagico,
    };
    updateFicha((prev) => ({
      ...prev,
      armaduras: [...prev.armaduras, nova],
    }));
    setModalCatalogoArmadurasAberto(false);
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
    const valorAtual = ficha.virtudes[tipo] || 1;
    const nomeAmigavel =
      tipo === 'consciencia'
        ? ficha.virtudes.tipoConsciencia === 'conviccao' ? 'Convicção' : 'Consciência'
        : tipo === 'autocontrole'
        ? ficha.virtudes.tipoAutocontrole === 'instinto' ? 'Instinto' : 'Autocontrole'
        : 'Coragem';

    tentarEvoluirComXP(
      'virtude',
      `Virtude (${nomeAmigavel})`,
      valorAtual,
      novoValor,
      (prev) => {
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
      }
    );
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


  // Finalizar a criação do NPC e ativar o modo oficial de evolução por XP
  const handleFinalizarCriacaoNPC = () => {
    if (
      confirm(
        'Deseja finalizar a criação deste NPC? A ficha passará a utilizar o sistema oficial de evolução por XP (com opção de alternar para Edição Livre quando o Mestre desejar).'
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
          ...(ficha.criacao || {
            disciplinasPrimariasIds: [],
            pontosBonusGastos: 0,
          }),
          status: 'finalizada',
          etapa: 'concluida',
        },
      };
      setFicha(finalizada);
      onSalvar(finalizada);
      setHasChanges(false);
      setSucessoXP('✓ Criação do NPC finalizada! O sistema de XP agora está ativo.');
      setTimeout(() => setSucessoXP(null), 4000);
    }
  };

  const handleReabrirModoCriacao = () => {
    if (
      confirm(
        `Deseja reabilitar o Modo de Criação para "${ficha.nome || 'este personagem'}"? O jogador poderá redistribuir atributos, habilidades, disciplinas e pontos bônus livremente.`
      )
    ) {
      const atualizada: Personagem = {
        ...ficha,
        criacao: {
          ...(ficha.criacao || {
            distribuicaoAtributos: { fisica: 0, social: 0, mental: 0 },
            distribuicaoHabilidades: { talentos: 0, pericias: 0, conhecimentos: 0 },
            disciplinasPrimariasIds: [],
            pontosBonusGastos: 0,
          }),
          status: 'em_criacao',
          etapa: ficha.criacao?.etapa === 'concluida' ? 'bonus' : (ficha.criacao?.etapa || 'iniciais'),
        },
      };
      setFicha(atualizada);
      onSalvar(atualizada);
      setHasChanges(false);
      setSucessoXP('✓ Modo de Criação reaberto com sucesso!');
      setTimeout(() => setSucessoXP(null), 4000);
    }
  };

  const handleBloquearModoCriacao = () => {
    if (
      confirm(
        `Deseja finalizar/travar o Modo de Criação de "${ficha.nome || 'este personagem'}"? A ficha passará para o modo de jogo padrão.`
      )
    ) {
      const atualizada: Personagem = {
        ...ficha,
        criacao: {
          ...ficha.criacao!,
          status: 'finalizada',
          etapa: 'concluida',
        },
      };
      setFicha(atualizada);
      onSalvar(atualizada);
      setHasChanges(false);
      setSucessoXP('✓ Modo de Criação travado! A ficha agora está no modo de jogo padrão.');
      setTimeout(() => setSucessoXP(null), 4000);
    }
  };

  // Bloqueio de sigilo do Narrador: se o usuário atual for jogador e a ficha for NPC ou criada pelo Mestre, bloqueia visualização
  const usuarios = storageService.getUsuarios();
  const mestre = usuarios.find((u) => u.role === 'mestre');
  const isFichaDoMestre = Boolean(mestre && ficha.usuarioId === mestre.id);

  if (usuarioAtual.role === 'jogador' && (isFichaDoMestre || ficha.tipo === 'npc')) {
    return (
      <div className="min-h-screen bg-[#070506] flex items-center justify-center p-4">
        <div className="bg-[#180e13] border border-[#522228] p-6 rounded-sm text-center max-w-md space-y-4 shadow-2xl">
          <h2 className="text-lg font-gothic text-[#ef4444] font-bold uppercase tracking-wider">
            Acesso Restrito ao Narrador
          </h2>
          <p className="text-xs text-[#a89f91]">
            Esta ficha é estritamente confidencial do Mestre da Crônica e não pode ser visualizada por jogadores.
          </p>
          <button
            type="button"
            onClick={onVoltar}
            className="px-4 py-2 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic uppercase tracking-wider rounded-xs cursor-pointer shadow-md"
          >
            Voltar ao Painel
          </button>
        </div>
      </div>
    );
  }

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
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#3f1620] text-[#d4af37] border border-[#722f37]">
                    NPC • Modo Livre
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8e8273]">
                {ficha.cla || 'Sem Clã'} • {ficha.geracao || 'Geração Indefinida'} • Criado por: {ficha.usuarioNome}
              </p>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="flex items-center gap-1 bg-[#160d11] p-1 rounded-sm border border-[#3b181b] flex-wrap">
            <button
              type="button"
              onClick={() => setAbaAtiva('caracteristicas')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xs text-xs font-gothic tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                abaAtiva === 'caracteristicas'
                  ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-[#a89f91] hover:text-white hover:bg-[#251419]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Características</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('combate')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xs text-xs font-gothic tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                abaAtiva === 'combate'
                  ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-[#a89f91] hover:text-white hover:bg-[#251419]'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>2. Combate & XP</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('equipamentos')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xs text-xs font-gothic tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                abaAtiva === 'equipamentos'
                  ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-[#a89f91] hover:text-white hover:bg-[#251419]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>3. Equipamentos</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('magia')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xs text-xs font-gothic tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                abaAtiva === 'magia'
                  ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-[#a89f91] hover:text-white hover:bg-[#251419]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4. Magia & Rituais</span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('biografia')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xs text-xs font-gothic tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                abaAtiva === 'biografia'
                  ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-[#a89f91] hover:text-white hover:bg-[#251419]'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>5. Biografia & História</span>
            </button>
          </div>

          {/* Botões de Ação Superior */}
          {podeEditar && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Badge Dinâmico de XP e Alternador de Modo */}
              <div className="flex items-center gap-1.5 bg-[#160d11] border border-[#3b181b] px-2.5 py-1 rounded-xs">
                <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#a89f91]">
                  XP:
                </span>
                <span className="text-xs font-mono font-bold text-[#d4af37]">
                  {ficha.xp?.atual || 0} pts
                </span>
                {podeEditar && (
                  <button
                    type="button"
                    onClick={() => setModalAjustarXPAberto(true)}
                    title="Ajustar, conceder ou corrigir pontos de experiência (XP)"
                    className="flex items-center gap-1 ml-1 px-1.5 py-0.5 bg-[#251217] hover:bg-[#38181f] text-[#ded6cb] hover:text-[#d4af37] border border-[#542127] hover:border-[#8b0000] rounded-xs text-[10px] font-mono cursor-pointer transition-colors"
                  >
                    <Plus className="w-2.5 h-2.5 text-emerald-400" />
                    <Minus className="w-2.5 h-2.5 text-rose-400" />
                    <span>Ajustar</span>
                  </button>
                )}
                {usuarioAtual.role === 'mestre' && ficha.criacao?.status !== 'em_criacao' && (
                  <button
                    type="button"
                    onClick={() => setModoEdicaoLivre((prev) => !prev)}
                    title={
                      modoEdicaoLivre
                        ? 'Edição Livre ativa (não consome XP). Clique para ativar modo XP.'
                        : 'Modo XP ativo (evolução gasta XP automaticamente). Clique para ativar edição livre.'
                    }
                    className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer border ${
                      modoEdicaoLivre
                        ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                        : 'bg-green-950/80 text-green-300 border-green-600'
                    }`}
                  >
                    {modoEdicaoLivre ? 'Edição Livre' : 'Modo XP'}
                  </button>
                )}
                {usuarioAtual.role === 'mestre' && (
                  <button
                    type="button"
                    onClick={() => setModalExtratoAberto(true)}
                    title="Ver extrato completo de pontos iniciais e bônus gastos (Exclusivo Mestre)"
                    className="ml-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer border bg-[#201217] hover:bg-[#331722] text-[#d4af37] border-amber-600/70 flex items-center gap-1 shadow-xs"
                  >
                    <FileText className="w-3 h-3 text-[#d4af37]" />
                    <span>Extrato</span>
                  </button>
                )}
              </div>

              {/* Opção Exclusiva do Mestre: Reabilitar / Travar Modo de Criação */}
              {usuarioAtual.role === 'mestre' && ficha.tipo !== 'npc' && (
                ficha.criacao?.status === 'em_criacao' ? (
                  <button
                    type="button"
                    onClick={handleBloquearModoCriacao}
                    title="Travar criação e consolidar a ficha no modo de jogo padrão"
                    className="px-2.5 py-1.5 rounded-xs text-xs font-gothic font-bold uppercase tracking-wider text-green-300 bg-[#122416] hover:bg-[#1a3821] border border-green-600/70 hover:border-green-500 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    <span>Travar Criação</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReabrirModoCriacao}
                    title="Reabilitar o modo de criação para permitir que o jogador altere pontos e distribuição inicial"
                    className="px-2.5 py-1.5 rounded-xs text-xs font-gothic font-bold uppercase tracking-wider text-amber-300 bg-[#2b1810] hover:bg-[#422214] border border-amber-600/70 hover:border-amber-500 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reabrir Modo Criação</span>
                  </button>
                )
              )}

              <button
                type="button"
                onClick={handleAbrirModalHistoria}
                title="Escrever ou atualizar a história deste personagem"
                className="px-2.5 py-1.5 rounded-xs text-xs font-gothic font-bold uppercase tracking-wider text-white bg-[#8b0000] hover:bg-[#a30d12] border border-[#ef4444]/60 flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_8px_rgba(239,68,68,0.3)]"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{ficha.biografia?.historia?.trim() ? 'Editar História' : 'Incluir História'}</span>
              </button>

              <button
                type="button"
                onClick={() => setModalAtalhosAberto(true)}
                title="Configurar os atalhos exibidos no card resumido do Dashboard"
                className="px-2.5 py-1.5 rounded-xs text-xs font-semibold text-[#d4af37] hover:text-white bg-[#1a1014] hover:bg-[#8b0000] border border-[#522228] hover:border-[#8b0000] flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Atalhos do Card</span>
              </button>
            </div>
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

      {/* BANNER DE CRIAÇÃO DO NPC (Se o NPC ainda estiver em modo de criação) */}
      {isNpc && ficha.criacao?.status === 'em_criacao' && podeEditar && (
        <div className="max-w-7xl mx-auto px-4 mt-3 animate-fadeIn">
          <div className="bg-[#1f1016] border border-[#ef4444]/60 p-3 rounded-sm flex items-center justify-between flex-wrap gap-2 text-xs shadow-md">
            <div className="flex items-center gap-2 text-[#d4af37]">
              <Sparkles className="w-4 h-4 text-[#ef4444] shrink-0" />
              <span>
                <strong>Modo de Criação do NPC:</strong> Você pode distribuir atributos, habilidades e disciplinas livremente (sem travas ou custos de XP).
              </span>
            </div>
            <button
              type="button"
              onClick={handleFinalizarCriacaoNPC}
              className="px-3.5 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span>Finalizar Criação do NPC (Ativar Modo XP)</span>
            </button>
          </div>
        </div>
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
          {abaAtiva === 'caracteristicas' && (
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
                      {!isNpc && renderBadgePontos(gastosFisicos, limiteFisicos.max, limiteFisicos.prioridade, 5)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Força</span>
                      <Bolinhas
                        valor={ficha.atributos.forca}
                        valorInicial={valoresIniciais.getAtributo('forca')}
                        destacarBonus={deveDestacarBonus}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('forca', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold">Destreza</span>
                        {statusCombate.totalPenalidadeArmadura !== 0 && (
                          <span
                            className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-700 px-1 py-0.2 rounded-xs"
                            title={`Penalidade de Armadura: ${statusCombate.totalPenalidadeArmadura}. Destreza efetiva: ${statusCombate.destrezaEfetiva}`}
                          >
                            Efetiva: {statusCombate.destrezaEfetiva}
                          </span>
                        )}
                      </div>
                      <Bolinhas
                        valor={ficha.atributos.destreza}
                        valorInicial={valoresIniciais.getAtributo('destreza')}
                        destacarBonus={deveDestacarBonus}
                        max={maxBolinhasTraço}
                        min={1}
                        onChange={(v) => handleAtributoChange('destreza', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold">Vigor</span>
                        {statusCombate.totalClasseArmadura > 0 && (
                          <span
                            className="text-[9px] font-mono font-bold text-[#d4af37] bg-[#241318] border border-[#522228] px-1 py-0.2 rounded-xs"
                            title={`Absorção de Dano Total: ${statusCombate.absorcaoDanoNormal} dados (Vigor ${statusCombate.vigorBase} + Fortitude ${statusCombate.fortitudeNivel} + Armadura ${statusCombate.totalClasseArmadura})`}
                          >
                            Absorção: {statusCombate.absorcaoDanoNormal}d
                          </span>
                        )}
                      </div>
                      <Bolinhas
                        valor={ficha.atributos.vigor}
                        valorInicial={valoresIniciais.getAtributo('vigor')}
                        destacarBonus={deveDestacarBonus}
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
                      {!isNpc && renderBadgePontos(gastosSociais, limiteSociais.max, limiteSociais.prioridade, 5)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Carisma</span>
                      <Bolinhas
                        valor={ficha.atributos.carisma}
                        valorInicial={valoresIniciais.getAtributo('carisma')}
                        destacarBonus={deveDestacarBonus}
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
                        valorInicial={valoresIniciais.getAtributo('manipulacao')}
                        destacarBonus={deveDestacarBonus}
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
                        valorInicial={valoresIniciais.getAtributo('aparencia')}
                        destacarBonus={deveDestacarBonus}
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
                      {!isNpc && renderBadgePontos(gastosMentais, limiteMentais.max, limiteMentais.prioridade, 5)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold">Percepção</span>
                        {statusCombate.totalPenalidadePercepcao !== 0 && (
                          <span
                            className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-700 px-1 py-0.2 rounded-xs"
                            title={`Penalidade de Elmo / Armadura: ${statusCombate.totalPenalidadePercepcao}. Percepção efetiva: ${statusCombate.percepcaoEfetiva}`}
                          >
                            Efetiva: {statusCombate.percepcaoEfetiva}
                          </span>
                        )}
                      </div>
                      <Bolinhas
                        valor={ficha.atributos.percepcao}
                        valorInicial={valoresIniciais.getAtributo('percepcao')}
                        destacarBonus={deveDestacarBonus}
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
                        valorInicial={valoresIniciais.getAtributo('inteligencia')}
                        destacarBonus={deveDestacarBonus}
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
                        valorInicial={valoresIniciais.getAtributo('raciocinio')}
                        destacarBonus={deveDestacarBonus}
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
                      {!isNpc && renderBadgePontos(gastosTalentos, limiteTalentos.max, limiteTalentos.prioridade, 2)}
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
                          valorInicial={valoresIniciais.getHabilidade(chave)}
                          destacarBonus={deveDestacarBonus}
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
                      {!isNpc && renderBadgePontos(gastosPericias, limitePericias.max, limitePericias.prioridade, 2)}
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
                          valorInicial={valoresIniciais.getHabilidade(chave)}
                          destacarBonus={deveDestacarBonus}
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
                      {!isNpc && renderBadgePontos(gastosConhecimentos, limiteConhecimentos.max, limiteConhecimentos.prioridade, 2)}
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
                          valorInicial={valoresIniciais.getHabilidade(chave)}
                          destacarBonus={deveDestacarBonus}
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

              {/* HABILIDADES SECUNDÁRIAS (Canônicas 1ª Edição) */}
              <div className="bg-[#120a0e] p-4 sm:p-5 rounded-sm border border-[#3b181b] space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                      Habilidades Secundárias
                    </h3>
                    <span className="text-[10px] text-[#8e8273] font-mono">
                      (1º ponto = 2 XP • Próximos = Nível Atual × 1)
                    </span>
                  </div>
                  {podeEditar && (
                    <button
                      type="button"
                      onClick={() => setModalAddHabSecundariaAberto(true)}
                      className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-xs bg-[#241318] hover:bg-[#381822] text-[#d4af37] hover:text-white border border-[#522228] hover:border-[#8b0000] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Adicionar talento, perícia ou conhecimento secundário"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Adicionar Habilidade Secundária</span>
                    </button>
                  )}
                </div>

                {/* 3 Colunas: Talentos Secundários | Perícias Secundárias | Conhecimentos Secundários */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* TALENTOS SECUNDÁRIOS */}
                  <div className="bg-[#180f14] p-3.5 rounded-sm border border-[#2d1217] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Talentos Secundários
                      </h4>
                      <span className="text-[10px] text-[#706456] font-mono">
                        ({(ficha.habilidadesSecundarias || []).filter((h) => h.categoria === 'talento').length})
                      </span>
                    </div>
                    {((ficha.habilidadesSecundarias || []).filter((h) => h.categoria === 'talento')).length === 0 ? (
                      <p className="text-[11px] text-[#6b6055] italic py-1">
                        Nenhum talento secundário registrado.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {(ficha.habilidadesSecundarias || [])
                          .filter((h) => h.categoria === 'talento')
                          .map((hab) => (
                            <div key={hab.id} className="flex items-center justify-between text-xs py-0.5 border-b border-[#251419] last:border-b-0">
                              <div className="flex items-center gap-1 min-w-0 pr-1">
                                {podeEditar && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoverHabilidadeSecundaria(hab.id)}
                                    title={`Remover ${hab.nome}`}
                                    className="text-[#6b6055] hover:text-rose-400 p-0.5 cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                                <span className="text-[#ded6cb] truncate" title={hab.observacao || hab.nome}>
                                  {hab.nome}
                                </span>
                              </div>
                              <Bolinhas
                                valor={hab.nivel}
                                max={maxBolinhasTraço}
                                min={0}
                                tamanho="sm"
                                onChange={(novoValor) => handleNivelHabilidadeSecundaria(hab.id, novoValor)}
                                readonly={!podeEditar}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* PERÍCIAS SECUNDÁRIAS */}
                  <div className="bg-[#180f14] p-3.5 rounded-sm border border-[#2d1217] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Perícias Secundárias
                      </h4>
                      <span className="text-[10px] text-[#706456] font-mono">
                        ({(ficha.habilidadesSecundarias || []).filter((h) => h.categoria === 'pericia').length})
                      </span>
                    </div>
                    {((ficha.habilidadesSecundarias || []).filter((h) => h.categoria === 'pericia')).length === 0 ? (
                      <p className="text-[11px] text-[#6b6055] italic py-1">
                        Nenhuma perícia secundária registrada.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {(ficha.habilidadesSecundarias || [])
                          .filter((h) => h.categoria === 'pericia')
                          .map((hab) => (
                            <div key={hab.id} className="flex items-center justify-between text-xs py-0.5 border-b border-[#251419] last:border-b-0">
                              <div className="flex items-center gap-1 min-w-0 pr-1">
                                {podeEditar && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoverHabilidadeSecundaria(hab.id)}
                                    title={`Remover ${hab.nome}`}
                                    className="text-[#6b6055] hover:text-rose-400 p-0.5 cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                                <span className="text-[#ded6cb] truncate" title={hab.observacao || hab.nome}>
                                  {hab.nome}
                                </span>
                              </div>
                              <Bolinhas
                                valor={hab.nivel}
                                max={maxBolinhasTraço}
                                min={0}
                                tamanho="sm"
                                onChange={(novoValor) => handleNivelHabilidadeSecundaria(hab.id, novoValor)}
                                readonly={!podeEditar}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* CONHECIMENTOS SECUNDÁRIOS */}
                  <div className="bg-[#180f14] p-3.5 rounded-sm border border-[#2d1217] space-y-2">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Conhecimentos Secundários
                      </h4>
                      <span className="text-[10px] text-[#706456] font-mono">
                        ({(ficha.habilidadesSecundarias || []).filter((h) => h.categoria === 'conhecimento').length})
                      </span>
                    </div>
                    {((ficha.habilidadesSecundarias || []).filter((h) => h.categoria === 'conhecimento')).length === 0 ? (
                      <p className="text-[11px] text-[#6b6055] italic py-1">
                        Nenhum conhecimento secundário registrado.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {(ficha.habilidadesSecundarias || [])
                          .filter((h) => h.categoria === 'conhecimento')
                          .map((hab) => (
                            <div key={hab.id} className="flex items-center justify-between text-xs py-0.5 border-b border-[#251419] last:border-b-0">
                              <div className="flex items-center gap-1 min-w-0 pr-1">
                                {podeEditar && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoverHabilidadeSecundaria(hab.id)}
                                    title={`Remover ${hab.nome}`}
                                    className="text-[#6b6055] hover:text-rose-400 p-0.5 cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                                <span className="text-[#ded6cb] truncate" title={hab.observacao || hab.nome}>
                                  {hab.nome}
                                </span>
                              </div>
                              <Bolinhas
                                valor={hab.nivel}
                                max={maxBolinhasTraço}
                                min={0}
                                tamanho="sm"
                                onChange={(novoValor) => handleNivelHabilidadeSecundaria(hab.id, novoValor)}
                                readonly={!podeEditar}
                              />
                            </div>
                          ))}
                      </div>
                    )}
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
                    isEmCriacao ? (
                      <div className="flex items-center gap-2 text-xs bg-[#181014] px-2.5 py-1 rounded-xs border border-[#3b181b]">
                        <span className="text-[#a89f91]">Disciplinas: <strong className="text-[#ded6cb]">{gastosDisciplinas}/{maxDisciplinas}</strong></span>
                        <span className="text-[#3b181b]">•</span>
                        <span className="text-[#a89f91]">Antecedentes: <strong className="text-[#ded6cb]">{gastosAntecedentes}/{maxAntecedentes}</strong></span>
                        <span className="text-[#3b181b]">•</span>
                        <span className="text-[#a89f91]">Virtudes: <strong className="text-[#ded6cb]">{gastosVirtudes}/{maxVirtudes}</strong></span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-xs font-bold shadow-xs">
                        ✓ Criação Consolidada • Antecedentes Travados
                      </span>
                    )
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
                        {isEmCriacao && renderBadgePontos(gastosDisciplinas, maxDisciplinas, 'Inicial', 5)}
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
                                  valorInicial={valoresIniciais.getDisciplina(disc.id || disc.nome)}
                                  destacarBonus={deveDestacarBonus}
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
                        {!isNpc && isEmCriacao && renderBadgePontos(gastosAntecedentes, maxAntecedentes, 'Inicial', 1)}
                      </div>
                      {(isEmCriacao || modoEdicaoLivre || usuarioAtual.role === 'mestre') && (
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
                                    readonly={!isEmCriacao && !modoEdicaoLivre && usuarioAtual.role !== 'mestre'}
                                    placeholder="Nome do Antecedente"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Bolinhas
                                  valor={ant.nivel}
                                  valorInicial={valoresIniciais.getAntecedente(ant.id || ant.nome)}
                                  destacarBonus={deveDestacarBonus}
                                  max={ehGeracao ? (isNpc ? 9 : 5) : maxBolinhasTraço}
                                  min={1}
                                  tamanho="sm"
                                  onChange={(v) => handleEditarAntecedente(ant.id, 'nivel', v)}
                                  readonly={!isEmCriacao && !modoEdicaoLivre && usuarioAtual.role !== 'mestre'}
                                />
                                {(isEmCriacao || modoEdicaoLivre || usuarioAtual.role === 'mestre') && (
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
                      {!isNpc && isEmCriacao && renderBadgePontos(gastosVirtudes, maxVirtudes, 'Inicial', 2)}
                    </div>

                    {/* Consciência ou Convicção */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <select
                          disabled={!isEmCriacao && !modoEdicaoLivre && usuarioAtual.role !== 'mestre'}
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
                          className="bg-transparent text-xs font-semibold text-[#d4af37] border-b border-[#522228] focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="consciencia" className="bg-[#140e11] text-white">Consciência</option>
                          <option value="conviccao" className="bg-[#140e11] text-white">Convicção</option>
                        </select>
                        <Bolinhas
                          valor={ficha.virtudes.consciencia}
                          valorInicial={valoresIniciais.getVirtude('consciencia')}
                          destacarBonus={deveDestacarBonus}
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
                          disabled={!isEmCriacao && !modoEdicaoLivre && usuarioAtual.role !== 'mestre'}
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
                          className="bg-transparent text-xs font-semibold text-[#d4af37] border-b border-[#522228] focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="autocontrole" className="bg-[#140e11] text-white">Autocontrole</option>
                          <option value="instinto" className="bg-[#140e11] text-white">Instinto</option>
                        </select>
                        <Bolinhas
                          valor={ficha.virtudes.autocontrole}
                          valorInicial={valoresIniciais.getVirtude('autocontrole')}
                          destacarBonus={deveDestacarBonus}
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
                        valorInicial={valoresIniciais.getVirtude('coragem')}
                        destacarBonus={deveDestacarBonus}
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setModalCatalogoQDAberto(true)}
                          className="px-2.5 py-1 text-xs font-gothic font-bold uppercase tracking-wider bg-[#8b0000] hover:bg-[#a30d12] text-white border border-[#ef4444]/60 rounded-xs cursor-pointer transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] flex items-center gap-1.5"
                          title="Abrir catálogo oficial de Qualidades e Defeitos do livro básico"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>+ Catálogo Oficial</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMostrarFormCustomQD(!mostrarFormCustomQD)}
                          className="px-2 py-1 text-xs font-semibold bg-[#2d1217] text-[#d4af37] hover:bg-[#3d1a21] border border-[#5a252d] rounded-xs cursor-pointer transition-colors flex items-center gap-1"
                          title="Adicionar qualidade ou defeito personalizado de outras edições ou livros"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{mostrarFormCustomQD ? 'Fechar' : '+ Personalizado'}</span>
                        </button>
                      </div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Descrição ou efeito mecânico (opcional)..."
                        value={descCustomQD}
                        onChange={(e) => setDescCustomQD(e.target.value)}
                        className="bg-[#1b1216] border border-[#3b181b] px-2.5 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Observação (ex: tipo de sangue, fobia, inimigo)..."
                        value={obsCustomQD}
                        onChange={(e) => setObsCustomQD(e.target.value)}
                        className="bg-[#1b1216] border border-[#3b181b] px-2.5 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-3.5 py-1 bg-[#3d1a21] hover:bg-[#5a252d] text-[#d4af37] border border-[#722f37] rounded-xs cursor-pointer font-bold transition-colors"
                      >
                        Adicionar Traço
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
                              {/* Campo de observação / especificação */}
                              {podeEditar ? (
                                <div className="pt-1.5 flex items-center gap-1.5">
                                  <span className="text-[10px] font-semibold text-[#d4af37] shrink-0">Obs:</span>
                                  <input
                                    type="text"
                                    value={q.observacao || ''}
                                    onChange={(e) => handleAtualizarObservacaoQD(q.id, e.target.value)}
                                    placeholder="Especificar detalhes (ex: tipo de sangue, especialidade)..."
                                    className="flex-1 bg-[#120a0d] border-b border-[#3b181b] focus:border-[#d4af37] px-1.5 py-0.5 text-[11px] text-[#ded6cb] placeholder:text-[#5c524a] focus:outline-none transition-colors"
                                  />
                                </div>
                              ) : q.observacao ? (
                                <p className="text-[11px] text-[#ded6cb] pt-1">
                                  <span className="text-[10px] font-semibold text-[#d4af37]">Obs: </span>
                                  {q.observacao}
                                </p>
                              ) : null}
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
                              {(isNpc || isEmCriacao || usuarioAtual.role === 'mestre') && podeEditar && (
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
                              {/* Campo de observação / especificação */}
                              {podeEditar ? (
                                <div className="pt-1.5 flex items-center gap-1.5">
                                  <span className="text-[10px] font-semibold text-green-400 shrink-0">Obs:</span>
                                  <input
                                    type="text"
                                    value={d.observacao || ''}
                                    onChange={(e) => handleAtualizarObservacaoQD(d.id, e.target.value)}
                                    placeholder="Especificar detalhes (ex: sangue de virgens, fobia a fogo, inimigo mortal)..."
                                    className="flex-1 bg-[#120a0d] border-b border-[#3b181b] focus:border-green-500 px-1.5 py-0.5 text-[11px] text-[#ded6cb] placeholder:text-[#5c524a] focus:outline-none transition-colors"
                                  />
                                </div>
                              ) : d.observacao ? (
                                <p className="text-[11px] text-[#ded6cb] pt-1">
                                  <span className="text-[10px] font-semibold text-green-400">Obs: </span>
                                  {d.observacao}
                                </p>
                              ) : null}
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
                              {(isNpc || isEmCriacao || usuarioAtual.role === 'mestre') && podeEditar && (
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
                          valorInicial={valoresIniciais.getCaminho()}
                          destacarBonus={deveDestacarBonus}
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
                        valorInicial={valoresIniciais.getForcaDeVontade()}
                        destacarBonus={deveDestacarBonus}
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
          {/* ABA 2: EXPERIÊNCIA E COMBATE */}
          {/* ========================================================================= */}
          {abaAtiva === 'combate' && (
            <div className="space-y-8 animate-fadeIn">
              {/* CONTROLE DE EXPERIÊNCIA (XP) */}
              <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-4">
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                      Controle de Experiência (XP)
                    </h3>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={() => setModalAjustarXPAberto(true)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#251217] hover:bg-[#3b1820] text-[#d4af37] border border-[#6b1e28] rounded-xs text-xs font-mono font-semibold cursor-pointer transition-colors"
                        title="Ajustar ou corrigir pontos de experiência (XP)"
                      >
                        <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Ajustar / Corrigir</span>
                      </button>
                    )}
                  </div>
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
                    <div className="bg-[#160f13] p-2 rounded-xs border border-amber-900/50 bg-amber-950/20">
                      <strong className="text-amber-300 block">Habilidades Secundárias</strong>
                      <span className="text-amber-200">Nova: 2 XP • Evolução: Nível Atual × 1</span>
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

              {/* COMBATE: PAINEL GERAL, ARMAS E ARMADURAS */}
              <div className="space-y-6">
                {/* PAINEL DE VISÃO GERAL DE COMBATE & PROTEÇÃO (1ª EDIÇÃO) */}
                <div className="bg-[#120a0e] p-4 sm:p-5 rounded-sm border border-[#3b181b] space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#d4af37]" />
                      <h3 className="text-sm sm:text-base font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                        Parâmetros Automáticos de Combate & Proteção (1ª Edição)
                      </h3>
                    </div>
                    <span className="text-[10px] text-[#a89f91] bg-[#1d1015] px-2 py-0.5 rounded border border-[#522228]">
                      Livro de Regras (1996) • Cálculos Automáticos
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 text-center">
                    {/* Absorção Letal / Contusão */}
                    <div className="bg-[#180e13] p-2.5 rounded border border-[#2d1217] flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-gothic text-[#a89f91] block">
                        Absorção Normal
                      </span>
                      <div className="my-1">
                        <span className="text-xl font-bold text-green-400 font-mono">
                          {statusCombate.absorcaoDanoNormal}
                        </span>
                        <span className="text-xs text-[#a89f91] ml-0.5">dados</span>
                      </div>
                      <span className="text-[9px] text-[#8e8273]">
                        Vig {statusCombate.vigorBase} + Fort {statusCombate.fortitudeNivel} + Arm {statusCombate.totalClasseArmadura}
                      </span>
                    </div>

                    {/* Absorção Agravada */}
                    <div className="bg-[#180e13] p-2.5 rounded border border-[#2d1217] flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-gothic text-[#a89f91] block">
                        Absorção Agravada
                      </span>
                      <div className="my-1">
                        <span className={`text-xl font-bold font-mono ${statusCombate.absorcaoDanoAgravado > 0 ? 'text-amber-400' : 'text-[#8e8273]'}`}>
                          {statusCombate.absorcaoDanoAgravado}
                        </span>
                        <span className="text-xs text-[#a89f91] ml-0.5">dados</span>
                      </div>
                      <span className="text-[9px] text-[#8e8273]">
                        {statusCombate.absorcaoDanoAgravado > 0 ? 'Fortitude' : 'Sem Fortitude'}
                      </span>
                    </div>

                    {/* Destreza Efetiva */}
                    <div className="bg-[#180e13] p-2.5 rounded border border-[#2d1217] flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-gothic text-[#a89f91] block">
                        Destreza Efetiva
                      </span>
                      <div className="my-1">
                        <span className={`text-xl font-bold font-mono ${statusCombate.totalPenalidadeArmadura < 0 ? 'text-amber-300' : 'text-white'}`}>
                          {statusCombate.destrezaEfetiva}
                        </span>
                        <span className="text-xs text-[#a89f91] ml-0.5">pts</span>
                      </div>
                      <span className="text-[9px] text-[#8e8273]">
                        Base {statusCombate.destrezaBase} {statusCombate.totalPenalidadeArmadura < 0 ? `(${statusCombate.totalPenalidadeArmadura} arm.)` : '(sem ônus)'}
                      </span>
                    </div>

                    {/* Esquiva Efetiva */}
                    <div className="bg-[#180e13] p-2.5 rounded border border-[#2d1217] flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-gothic text-[#a89f91] block">
                        Parada de Esquiva
                      </span>
                      <div className="my-1">
                        <span className="text-xl font-bold text-sky-400 font-mono">
                          {statusCombate.esquivaEfetiva}
                        </span>
                        <span className="text-xs text-[#a89f91] ml-0.5">dados</span>
                      </div>
                      <span className="text-[9px] text-[#8e8273]">
                        Des Efetiva + Esquiva
                      </span>
                    </div>

                    {/* Iniciativa Base */}
                    <div className="bg-[#180e13] p-2.5 rounded border border-[#2d1217] flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-gothic text-[#a89f91] block">
                        Iniciativa Base
                      </span>
                      <div className="my-1">
                        <span className="text-xl font-bold text-purple-400 font-mono">
                          {statusCombate.iniciativaBase}
                        </span>
                        <span className="text-xs text-[#a89f91] ml-0.5">+ 1d10</span>
                      </div>
                      <span className="text-[9px] text-[#8e8273]">
                        Des + Rac {statusCombate.rapidezNivel > 0 ? `+ Rap ${statusCombate.rapidezNivel}` : ''}
                      </span>
                    </div>

                    {/* Potência no Dano */}
                    <div className="bg-[#180e13] p-2.5 rounded border border-[#2d1217] flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-gothic text-[#a89f91] block">
                        Bônus de Potência
                      </span>
                      <div className="my-1">
                        <span className={`text-xl font-bold font-mono ${statusCombate.potenciaNivel > 0 ? 'text-red-400' : 'text-[#8e8273]'}`}>
                          +{statusCombate.potenciaNivel}
                        </span>
                        <span className="text-xs text-[#a89f91] ml-0.5">suc. auto</span>
                      </div>
                      <span className="text-[9px] text-[#8e8273]">
                        Dano Corpo a Corpo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 3: EQUIPAMENTOS, ARMAS E ARMADURAS */}
          {/* ========================================================================= */}
          {abaAtiva === 'equipamentos' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-6">
                {/* ARMAS */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 flex-wrap gap-2">
                    <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                      <Swords className="w-4 h-4 text-[#ef4444]" /> Armas & Ataques
                    </h3>
                    {podeEditar && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setModalCatalogoArmasAberto(true)}
                          className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer bg-[#241318] hover:bg-[#341820] px-2.5 py-1 rounded border border-[#522228] transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Catálogo 1ª Edição
                        </button>
                        <button
                          type="button"
                          onClick={handleAdicionarArma}
                          className="text-xs text-[#a89f91] hover:text-white flex items-center gap-1 cursor-pointer bg-[#190f13] hover:bg-[#251319] px-2 py-1 rounded border border-[#3b181b] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Custom
                        </button>
                      </div>
                    )}
                  </div>

                  {ficha.armas.length === 0 ? (
                    <p className="text-xs text-[#706456] italic">Nenhuma arma adicionada no momento. Utilize o Catálogo para escolher armas da 1ª Edição.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] uppercase font-gothic text-[#a89f91] border-b border-[#3b181b]">
                          <tr>
                            <th className="py-2 px-2">Arma</th>
                            <th className="py-2 px-2 text-center">Dificuldade</th>
                            <th className="py-2 px-2 text-center">Ataque Automático</th>
                            <th className="py-2 px-2 text-center">Dano Automático</th>
                            <th className="py-2 px-2">Ocultação</th>
                            <th className="py-2 px-2">Alcance</th>
                            {podeEditar && <th className="py-2 px-2 text-right">Ação</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#241318]">
                          {ficha.armas.map((arma) => {
                            const forcaPers = ficha.atributos.forca || 1;
                            const ataqueInfo = calcularParadaAtaqueArma(arma, statusCombate.destrezaEfetiva, ficha.habilidades, forcaPers);
                            const danoInfo = calcularDanoArma(arma.dano, forcaPers, statusCombate.potenciaNivel);
                            const faltaForca = arma.forcaMinima ? forcaPers < arma.forcaMinima : false;
                            return (
                              <tr key={arma.id} className="hover:bg-[#1a1115]">
                                <td className="py-2 px-2 font-semibold">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <InlineField
                                        value={arma.nome}
                                        onChange={(v) => handleEditarArma(arma.id, 'nome', v)}
                                        readonly={!podeEditar}
                                        placeholder="Nome da Arma"
                                      />
                                      {arma.categoria === 'escudo' && (
                                        <span className="text-[9px] font-mono font-bold text-sky-300 bg-sky-950/70 border border-sky-700/80 px-1.5 py-0.2 rounded-xs">
                                          🛡️ Escudo
                                        </span>
                                      )}
                                      {arma.magica && (
                                        <span className="text-[9px] font-mono font-bold text-purple-200 bg-purple-950/80 border border-purple-500/80 px-1.5 py-0.2 rounded-xs">
                                          ✨ Mágica
                                        </span>
                                      )}
                                      {arma.danoAgravado && (
                                        <span className="text-[9px] font-mono font-bold text-amber-200 bg-amber-950/80 border border-amber-500/80 px-1.5 py-0.2 rounded-xs">
                                          🔥 Agravado
                                        </span>
                                      )}
                                      {arma.bonusMagico && (
                                        <span className="text-[9px] font-mono text-fuchsia-300 bg-fuchsia-950/60 border border-fuchsia-700/70 px-1.5 py-0.2 rounded-xs">
                                          {arma.bonusMagico}
                                        </span>
                                      )}
                                      {faltaForca && (
                                        <span
                                          className="text-[9px] font-mono font-bold text-red-300 bg-red-950/80 border border-red-700/80 px-1.5 py-0.2 rounded-xs"
                                          title={`Força insuficiente (possui ${forcaPers}, exige ${arma.forcaMinima}). +${ataqueInfo.penalidadeForca} na Dificuldade de ataque.`}
                                        >
                                          ⚠️ Pesada (For &lt; {arma.forcaMinima})
                                        </span>
                                      )}
                                      {arma.forcaMinima && !faltaForca && (
                                        <span className="text-[9px] text-[#706456]" title={`Requer Força ${arma.forcaMinima}`}>
                                          (For Mín: {arma.forcaMinima})
                                        </span>
                                      )}
                                    </div>
                                    {arma.poderMagico && (
                                      <span className="text-[10px] text-purple-300 italic font-serif">
                                        ✨ {arma.poderMagico}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2 px-2 text-center">
                                  <span
                                    className={`font-mono font-bold ${faltaForca ? 'text-red-400' : 'text-amber-300'}`}
                                    title={faltaForca ? `Dificuldade base ${arma.dificuldade || 6} + ${ataqueInfo.penalidadeForca} por Força insuficiente` : undefined}
                                  >
                                    Dif {ataqueInfo.dificuldade}
                                  </span>
                                  {faltaForca && (
                                    <span className="text-[9px] text-red-400 block font-mono">
                                      (+{ataqueInfo.penalidadeForca} peso)
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-2 text-center">
                                  <div className="inline-flex flex-col items-center">
                                    <span className="font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-800/80 px-2 py-0.5 rounded-xs">
                                      {ataqueInfo.paradaDados} dados
                                    </span>
                                    <span className="text-[9px] text-[#8e8273] mt-0.5">
                                      Des ({statusCombate.destrezaEfetiva}) + {ataqueInfo.habilidadeUsada} ({ataqueInfo.habilidadeNivel})
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2 px-2 text-center">
                                  <div className="inline-flex flex-col items-center">
                                    <span className="font-mono font-bold text-red-400 bg-red-950/60 border border-red-800/80 px-2 py-0.5 rounded-xs">
                                      {danoInfo.resumoVisual}
                                    </span>
                                    <span className="text-[9px] text-[#8e8273] mt-0.5">
                                      Fórmula: {arma.dano || 'For'} (Força {ficha.atributos.forca})
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2 px-2">
                                  <InlineField
                                    value={arma.ocultacao}
                                    onChange={(v) => handleEditarArma(arma.id, 'ocultacao', v)}
                                    readonly={!podeEditar}
                                    placeholder="Capa"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <InlineField
                                    value={arma.alcance}
                                    onChange={(v) => handleEditarArma(arma.id, 'alcance', v)}
                                    readonly={!podeEditar}
                                    placeholder="Corpo a corpo"
                                  />
                                </td>
                                {podeEditar && (
                                  <td className="py-2 px-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoverArma(arma.id)}
                                      className="text-[#8e8273] hover:text-[#ef4444] p-1 cursor-pointer transition-colors"
                                      title="Remover Arma"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ARMADURAS */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#ef4444]" /> Armadura e Proteção
                      </h3>
                      {statusCombate.totalClasseArmadura > 0 && (
                        <span className="text-[10px] font-mono text-green-400 bg-green-950/60 border border-green-800 px-2 py-0.5 rounded-xs">
                          +{statusCombate.totalClasseArmadura} dados de Absorção ativos
                        </span>
                      )}
                      {statusCombate.totalPenalidadeArmadura < 0 && (
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-xs">
                          {statusCombate.totalPenalidadeArmadura} Destreza ativo
                        </span>
                      )}
                    </div>
                    {podeEditar && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setModalCatalogoArmadurasAberto(true)}
                          className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer bg-[#241318] hover:bg-[#341820] px-2.5 py-1 rounded border border-[#522228] transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Catálogo 1ª Edição
                        </button>
                        <button
                          type="button"
                          onClick={handleAdicionarArmadura}
                          className="text-xs text-[#a89f91] hover:text-white flex items-center gap-1 cursor-pointer bg-[#190f13] hover:bg-[#251319] px-2 py-1 rounded border border-[#3b181b] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Custom
                        </button>
                      </div>
                    )}
                  </div>

                  {ficha.armaduras.length === 0 ? (
                    <p className="text-xs text-[#706456] italic">Nenhuma armadura no inventário. Utilize o Catálogo para escolher armaduras da 1ª Edição.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[10px] uppercase font-gothic text-[#a89f91] border-b border-[#3b181b]">
                          <tr>
                            <th className="py-2 px-2 text-center">Estado</th>
                            <th className="py-2 px-2">Tipo de Armadura</th>
                            <th className="py-2 px-2 text-center">Classe / Absorção</th>
                            <th className="py-2 px-2 text-center">Penalidade na Destreza</th>
                            {podeEditar && <th className="py-2 px-2 text-right">Ação</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#241318]">
                          {ficha.armaduras.map((arm) => {
                            const forcaPers = ficha.atributos.forca || 1;
                            const isEquipada = (arm as any).equipada !== false;
                            const classeNum = extrairClasseArmadura(arm.classe);
                            const penNum = extrairPenalidadeArmadura(arm.penalidade);
                            const faltaForcaArm = arm.forcaMinima ? forcaPers < arm.forcaMinima : false;
                            const penExtraForca = faltaForcaArm ? (arm.forcaMinima! - forcaPers) : 0;
                            const penTotal = penNum - penExtraForca;
                            return (
                              <tr key={arm.id} className={`hover:bg-[#1a1115] ${!isEquipada ? 'opacity-60' : ''}`}>
                                <td className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleAlternarEquiparArmadura(arm.id)}
                                    disabled={!podeEditar}
                                    className={`px-2.5 py-1 rounded text-[11px] font-bold font-gothic uppercase tracking-wide cursor-pointer transition-colors border ${
                                      isEquipada
                                        ? 'bg-green-950/80 text-green-300 border-green-700 hover:bg-green-900'
                                        : 'bg-[#181115] text-[#8e8273] border-[#3b181b] hover:text-[#ded6cb]'
                                    }`}
                                    title={isEquipada ? 'Equipada (bônus e penalidades ativos na ficha)' : 'Guardada na bagagem (sem efeito)'}
                                  >
                                    {isEquipada ? '✓ Em Uso' : 'Guardada'}
                                  </button>
                                </td>
                                <td className="py-2 px-2 font-semibold">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <InlineField
                                        value={arm.nome}
                                        onChange={(v) => handleEditarArmadura(arm.id, 'nome', v)}
                                        readonly={!podeEditar}
                                        placeholder="Cota de Malha"
                                      />
                                      {arm.magica && (
                                        <span className="text-[9px] font-mono font-bold text-purple-200 bg-purple-950/80 border border-purple-500/80 px-1.5 py-0.2 rounded-xs">
                                          ✨ Mágica
                                        </span>
                                      )}
                                      {arm.absorveAgravado && (
                                        <span className="text-[9px] font-mono font-bold text-amber-200 bg-amber-950/80 border border-amber-500/80 px-1.5 py-0.2 rounded-xs">
                                          🛡️ Absorve Agravado
                                        </span>
                                      )}
                                      {arm.bonusMagico && (
                                        <span className="text-[9px] font-mono text-fuchsia-300 bg-fuchsia-950/60 border border-fuchsia-700/70 px-1.5 py-0.2 rounded-xs">
                                          {arm.bonusMagico}
                                        </span>
                                      )}
                                      {faltaForcaArm && isEquipada && (
                                        <span
                                          className="text-[9px] font-mono font-bold text-red-300 bg-red-950/80 border border-red-700/80 px-1.5 py-0.2 rounded-xs"
                                          title={`Força insuficiente (possui ${forcaPers}, exige ${arm.forcaMinima}). Sobrecarga de peso impõe -${penExtraForca} na Destreza.`}
                                        >
                                          ⚠️ Sobrecarga (For &lt; {arm.forcaMinima})
                                        </span>
                                      )}
                                      {arm.forcaMinima && !faltaForcaArm && (
                                        <span className="text-[9px] text-[#706456]" title={`Requer Força ${arm.forcaMinima}`}>
                                          (For Mín: {arm.forcaMinima})
                                        </span>
                                      )}
                                    </div>
                                    {arm.poderMagico && (
                                      <span className="text-[10px] text-purple-300 italic font-serif">
                                        ✨ {arm.poderMagico}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2 px-2 text-center">
                                  <span className="font-mono font-bold text-green-400 bg-green-950/50 border border-green-800/80 px-2 py-0.5 rounded-xs">
                                    +{classeNum} dados de absorção
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-center">
                                  <span className={`font-mono font-bold px-2 py-0.5 rounded-xs border ${
                                    penTotal < 0
                                      ? 'text-amber-300 bg-amber-950/50 border-amber-800/80'
                                      : 'text-[#8e8273] bg-[#1a1114] border-[#3b181b]'
                                  }`}>
                                    {penTotal < 0 ? `${penTotal} Destreza & Ações Físicas` : 'Sem penalidade (0)'}
                                  </span>
                                  {faltaForcaArm && isEquipada && (
                                    <span className="text-[9px] text-red-400 block font-mono mt-0.5">
                                      ({penNum} armadura - {penExtraForca} sobrecarga)
                                    </span>
                                  )}
                                  {Boolean(arm.penalidadePercepcao && arm.penalidadePercepcao < 0 && isEquipada) && (
                                    <span className="text-[9px] text-amber-400 block font-mono mt-0.5" title="Penalidade de visão e audição abafadas por elmo">
                                      {arm.penalidadePercepcao} Percepção
                                    </span>
                                  )}
                                </td>
                                {podeEditar && (
                                  <td className="py-2 px-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoverArmadura(arm.id)}
                                      className="text-[#8e8273] hover:text-[#ef4444] p-1 cursor-pointer transition-colors"
                                      title="Remover Armadura"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

                {/* PERTENCES & EQUIPAMENTOS GERAIS */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-3">
                  <div className="border-b border-[#3b181b] pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#ef4444]" /> Pertences & Equipamentos Gerais
                      </h4>
                      <p className="text-[11px] text-[#8e8273]">
                        Bolsas, moedas de prata e ouro, montarias, relíquias medievais, tochas e mantimentos.
                      </p>
                    </div>
                  </div>
                  <InlineField
                    label="Lista de Pertences & Equipamento Carregado"
                    value={ficha.biografia?.notas || ''}
                    onChange={(v) =>
                      updateFicha((prev) => ({
                        ...prev,
                        biografia: { ...prev.biografia, notas: v },
                      }))
                    }
                    multiline
                    rows={4}
                    placeholder="Ex: Cavalo de batalha com arreios, 20 denários de prata, odre de vinho, tochas, símbolos e relíquias..."
                    readonly={!podeEditar}
                  />
                </div>
              </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 4: MAGIA DE SANGUE, RITUAIS E MENTE */}
          {/* ========================================================================= */}
          {abaAtiva === 'magia' && (
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

              {/* PERTURBAÇÕES MENTAIS */}
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
          )}

          {/* ========================================================================= */}
          {/* ABA 5: BIOGRAFIA, HISTÓRIA E LAÇOS DE SANGUE */}
          {/* ========================================================================= */}
          {abaAtiva === 'biografia' && (
            <div className="space-y-8 animate-fadeIn">
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
                <div className="border-b border-[#3b181b] pb-2 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
                      <Scroll className="w-4 h-4 text-[#ef4444]" />
                      Memórias, Prelúdio & Destino
                    </h3>
                    <p className="text-[11px] text-[#a89f91]">
                      História pessoal, prelúdio do Abraço e objetivos sob a noite medieval.
                    </p>
                  </div>
                  {podeEditar && (
                    <button
                      type="button"
                      onClick={handleAbrirModalHistoria}
                      className="px-3 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.35)] transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{ficha.biografia?.historia?.trim() ? 'Editar História' : 'Incluir História'}</span>
                    </button>
                  )}
                </div>

                {/* Bloco de Destaque para História do Personagem */}
                <div className="bg-[#181115] p-4 rounded-xs border border-[#3b181b] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#ef4444]" />
                      História do Personagem
                    </span>
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={handleAbrirModalHistoria}
                        className="text-xs font-semibold text-[#ef4444] hover:text-[#d4af37] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>{ficha.biografia?.historia?.trim() ? 'Editar História' : 'Incluir História'}</span>
                      </button>
                    )}
                  </div>

                  {ficha.biografia?.historia?.trim() ? (
                    <div
                      onClick={() => podeEditar && handleAbrirModalHistoria()}
                      className={`text-xs sm:text-sm text-[#ded6cb] leading-relaxed whitespace-pre-wrap font-serif p-3 bg-[#130b0e] rounded-xs border border-[#2d1217] ${
                        podeEditar ? 'cursor-pointer hover:border-[#8b0000] hover:bg-[#1a0e13] transition-colors' : ''
                      }`}
                      title={podeEditar ? 'Clique para editar a história' : undefined}
                    >
                      {ficha.biografia.historia}
                    </div>
                  ) : (
                    <div className="p-6 text-center border border-dashed border-[#522228] rounded-xs bg-[#120a0d] space-y-3">
                      <p className="text-xs text-[#a89f91] italic font-serif max-w-md mx-auto">
                        Nenhuma narrativa de origem, feitos mortais ou crônica pessoal foi registrada para este personagem ainda.
                      </p>
                      {podeEditar && (
                        <button
                          type="button"
                          onClick={handleAbrirModalHistoria}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
                        >
                          <Plus className="w-4 h-4 text-[#d4af37]" />
                          <span>Incluir História</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-2">

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
                    min={0}
                    onChange={(v) => setDiscNivelInicial(v)}
                  />
                  <span className="text-xs text-[#a89f91] font-serif">
                    {discNivelInicial === 0 ? '(0 - Sem pontos)' : `(Nível ${discNivelInicial})`}
                  </span>
                </div>
              </div>

              {/* Box Informativo de Custo em XP ou Pontos Bônus */}
              {(() => {
                const nomePrev =
                  discSelecionada === '__custom__'
                    ? discCustomNome.trim()
                    : discSelecionada || 'Nova Disciplina';
                const claEnc = CLAS_DARK_AGES_1E.find(
                  (c) => c.nome.trim().toLowerCase() === (ficha.cla || '').trim().toLowerCase()
                );
                const isClanPrev = Boolean(
                  claEnc &&
                    claEnc.disciplinas.some(
                      (cd) => cd.trim().toLowerCase() === nomePrev.trim().toLowerCase()
                    )
                );
                const isCriacao = ficha.criacao?.status === 'em_criacao';
                const custoXP =
                  !isCriacao && !modoEdicaoLivre && discNivelInicial > 0
                    ? calcularCustoXP('disciplina', 0, discNivelInicial, { isClan: isClanPrev })
                    : 0;
                const saldoAtual = ficha.xp?.atual || 0;

                if (!isCriacao && !modoEdicaoLivre) {
                  return (
                    <div className="bg-[#181115] p-2.5 rounded-xs border border-[#3b181b] text-xs space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-[#251419] pb-1">
                        <span className="text-[10px] font-bold uppercase text-[#d4af37]">
                          {isClanPrev ? '🛡️ Disciplina de Clã' : '⚔️ Outra Disciplina (Fora do Clã)'}
                        </span>
                        <span className="font-mono text-xs font-bold text-purple-300">
                          Custo: {custoXP} XP
                        </span>
                      </div>
                      {discNivelInicial === 0 ? (
                        <p className="text-[11px] text-[#8e8273] italic">
                          A disciplina será incluída na ficha com 0 pontos (sem custo). A compra da 1ª bolinha custará 10 XP quando você clicar nela.
                        </p>
                      ) : (
                        <div className="space-y-1 text-[11px]">
                          <div className="text-[#a89f91] font-mono text-[10px]">
                            • 1ª bolinha = 10 XP
                            {discNivelInicial > 1 && (
                              <span>
                                {' '}• Próximas = nível atual × {isClanPrev ? 5 : 7} XP
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-[#251419] font-mono">
                            <span className="text-[#a89f91]">Saldo de XP Atual:</span>
                            <strong className={saldoAtual >= custoXP ? 'text-green-400' : 'text-red-400'}>
                              {saldoAtual} XP {saldoAtual < custoXP && '(Insuficiente)'}
                            </strong>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (isCriacao) {
                  const custoBonus =
                    discNivelInicial === 0
                      ? 0
                      : isClanPrev && ficha.criacao?.etapa === 'iniciais'
                      ? 0
                      : 10 + (discNivelInicial - 1) * 7;

                  return (
                    <div className="bg-[#181115] p-2.5 rounded-xs border border-[#3b181b] text-xs space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-[#251419] pb-1">
                        <span className="text-[10px] font-bold uppercase text-[#d4af37]">
                          {isClanPrev ? '🛡️ Disciplina de Clã' : '⚔️ Outra Disciplina (Fora do Clã)'}
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-300">
                          {isClanPrev && ficha.criacao?.etapa === 'iniciais'
                            ? 'Cota Inicial (5 pts)'
                            : `${custoBonus} Pontos Bônus`}
                        </span>
                      </div>
                      {!isClanPrev ? (
                        <p className="text-[10px] text-amber-400/90 leading-tight">
                          Disciplinas fora do clã não podem ser compradas com pontos iniciais. A 1ª bolinha custa 10 pontos bônus e as seguintes 7 pontos cada.
                        </p>
                      ) : (
                        <p className="text-[10px] text-[#a89f91] leading-tight">
                          Disciplinas de clã usam a cota inicial gratuita de 5 pontos ou 5 pontos bônus por bolinha adicional.
                        </p>
                      )}
                    </div>
                  );
                }

                return null;
              })()}
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

              <div>
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] block mb-1">
                  Observação / Especificação Personalizada
                </label>
                <input
                  type="text"
                  value={formEditQD.observacao}
                  onChange={(e) =>
                    setFormEditQD((prev) => ({ ...prev, observacao: e.target.value }))
                  }
                  placeholder="Ex: tipo de sangue específico, fobia, nome do inimigo..."
                  className="w-full bg-[#181115] border border-[#4a2228] focus:border-[#d4af37] text-xs text-[#ded6cb] px-2.5 py-1.5 rounded-xs focus:outline-hidden"
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
      {/* MODAL DE CATÁLOGO OFICIAL DE QUALIDADES E DEFEITOS (1ª EDIÇÃO 1996) */}
      {modalCatalogoQDAberto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#120a0e] border border-[#8b0000] rounded-sm shadow-2xl p-4 sm:p-6 space-y-4 text-[#ded6cb] flex flex-col max-h-[90vh]">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#ef4444]" />
                <div>
                  <h3 className="text-base font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Catálogo Oficial de Qualidades & Defeitos
                  </h3>
                  <p className="text-[11px] text-[#a89f91]">
                    {isNpc
                      ? 'Adição livre para NPCs (sem limites de pontos bônus ou defeitos).'
                      : 'Vampiro: A Idade das Trevas (1ª Edição 1996 / Devir 1998).'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalCatalogoQDAberto(false)}
                className="text-[#8e8273] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Filtros e Busca */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#160e12] p-2.5 rounded-xs border border-[#2d1217]">
              {/* Filtro por Tipo */}
              <div className="flex rounded-xs bg-[#120c10] border border-[#3b181b] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFiltroTipoQD('todos')}
                  className={`flex-1 py-1 rounded-xs font-semibold cursor-pointer transition-colors ${
                    filtroTipoQD === 'todos'
                      ? 'bg-[#8b0000] text-white shadow-xs'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipoQD('qualidade')}
                  className={`flex-1 py-1 rounded-xs font-semibold cursor-pointer transition-colors ${
                    filtroTipoQD === 'qualidade'
                      ? 'bg-amber-900 text-amber-200'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                >
                  Qualidades
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipoQD('defeito')}
                  className={`flex-1 py-1 rounded-xs font-semibold cursor-pointer transition-colors ${
                    filtroTipoQD === 'defeito'
                      ? 'bg-green-900 text-green-200'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                >
                  Defeitos
                </button>
              </div>

              {/* Filtro por Categoria */}
              <select
                value={filtroCatQD}
                onChange={(e) =>
                  setFiltroCatQD(
                    e.target.value as 'todas' | 'fisico' | 'mental' | 'social' | 'sobrenatural'
                  )
                }
                className="bg-[#120c10] border border-[#3b181b] px-2.5 py-1 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#ef4444] cursor-pointer"
              >
                <option value="todas">Todas as Categorias</option>
                <option value="fisico">Físicos</option>
                <option value="mental">Mentais</option>
                <option value="social">Sociais</option>
                <option value="sobrenatural">Sobrenaturais</option>
              </select>

              {/* Busca por Nome */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8e8273] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar qualidade ou defeito..."
                  value={buscaQD}
                  onChange={(e) => setBuscaQD(e.target.value)}
                  className="w-full bg-[#120c10] border border-[#3b181b] pl-8 pr-2.5 py-1 text-xs text-[#ded6cb] placeholder:text-[#6e645c] rounded-xs focus:outline-none focus:border-[#ef4444]"
                />
              </div>
            </div>

            {/* Listagem de Itens (Scrollável) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[260px]">
              {listaFiltradaQD.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8e8273] italic">
                  Nenhuma qualidade ou defeito encontrado com os filtros aplicados.
                </div>
              ) : (
                listaFiltradaQD.map((item) => {
                  const jaSelecionado = (ficha.qualidadesDefeitos || []).some(
                    (q) => q.nome.toLowerCase() === item.nome.toLowerCase()
                  );
                  const bloqueadoDefeito =
                    !isNpc &&
                    !jaSelecionado &&
                    item.tipo === 'defeito' &&
                    totalPontosDefeitos + item.pontos > maxDefeitosConfig;

                  return (
                    <div
                      key={item.nome}
                      className={`p-2.5 rounded-xs border text-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        jaSelecionado
                          ? 'bg-[#2b1016] border-[#ef4444]'
                          : bloqueadoDefeito
                          ? 'bg-[#120c10] border-[#251016] opacity-60'
                          : 'bg-[#140e11] border-[#2d1217] hover:border-[#522228]'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#ded6cb] text-sm">
                            {item.nome}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                              item.tipo === 'qualidade'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-700'
                                : 'bg-green-950/80 text-green-300 border border-green-700'
                            }`}
                          >
                            {item.tipo === 'qualidade'
                              ? `Qualidade (-${item.pontos} pt${item.pontos > 1 ? 's' : ''})`
                              : `Defeito (+${item.pontos} pt${item.pontos > 1 ? 's' : ''})`}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-semibold bg-[#1f1519] text-[#8e8273] border border-[#3b181b]">
                            {item.categoria}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#a89f91] leading-relaxed">
                          {item.descricao}
                        </p>
                        {bloqueadoDefeito && (
                          <p className="text-[10px] text-red-400 font-semibold">
                            Ultrapassa o limite de {maxDefeitosConfig} pts de defeitos ({totalPontosDefeitos} + {item.pontos} = {totalPontosDefeitos + item.pontos} pts).
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={bloqueadoDefeito}
                        onClick={() => handleToggleQualidadeDefeito(item)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                          jaSelecionado
                            ? 'bg-[#8b0000] text-white hover:bg-[#a30d12]'
                            : bloqueadoDefeito
                            ? 'bg-[#1b1216] text-[#706456] border border-[#3b181b] cursor-not-allowed opacity-50'
                            : 'bg-[#221217] hover:bg-[#341822] text-[#d4af37] border border-[#522228]'
                        }`}
                        title={
                          bloqueadoDefeito
                            ? `Limite máximo de ${maxDefeitosConfig} pontos de defeitos atingido`
                            : jaSelecionado
                            ? 'Remover da ficha'
                            : 'Adicionar à ficha'
                        }
                      >
                        {jaSelecionado ? '✓ Removível' : bloqueadoDefeito ? `Limite (${maxDefeitosConfig})` : '+ Escolher'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="border-t border-[#3b181b] pt-3 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-[#a89f91]">
                Total na ficha: <strong className="text-[#d4af37]">{(ficha.qualidadesDefeitos || []).length} traços</strong>
              </span>
              <button
                type="button"
                onClick={() => setModalCatalogoQDAberto(false)}
                className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md"
              >
                Concluir Seleção
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL COMPLETO DE EDIÇÃO DE HISTÓRIA E BIOGRAFIA */}
      {modalHistoriaAberto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#120a0e] border border-[#8b0000] rounded-sm shadow-2xl p-4 sm:p-6 space-y-4 text-[#ded6cb] flex flex-col max-h-[90vh]">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#ef4444]" />
                <div>
                  <h3 className="text-base font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Biografia & Crônica Pessoal
                  </h3>
                  <p className="text-[11px] text-[#a89f91]">
                    {ficha.nome || 'Sem Nome'} • {ficha.cla || 'Sem Clã'} • {ficha.geracao || 'Geração Indefinida'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalHistoriaAberto(false)}
                className="text-[#8e8273] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abas do Modal */}
            <div className="flex flex-wrap gap-1 border-b border-[#2d1217] pb-2 text-xs">
              <button
                type="button"
                onClick={() => setAbaModalHistoria('historia')}
                className={`px-3 py-1.5 rounded-xs font-gothic font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  abaModalHistoria === 'historia'
                    ? 'bg-[#8b0000] text-white'
                    : 'bg-[#181115] text-[#a89f91] hover:text-white border border-[#3b181b]'
                }`}
              >
                História Principal
              </button>
              <button
                type="button"
                onClick={() => setAbaModalHistoria('preludio')}
                className={`px-3 py-1.5 rounded-xs font-gothic font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  abaModalHistoria === 'preludio'
                    ? 'bg-[#8b0000] text-white'
                    : 'bg-[#181115] text-[#a89f91] hover:text-white border border-[#3b181b]'
                }`}
              >
                Prelúdio (O Abraço)
              </button>
              <button
                type="button"
                onClick={() => setAbaModalHistoria('objetivos')}
                className={`px-3 py-1.5 rounded-xs font-gothic font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  abaModalHistoria === 'objetivos'
                    ? 'bg-[#8b0000] text-white'
                    : 'bg-[#181115] text-[#a89f91] hover:text-white border border-[#3b181b]'
                }`}
              >
                Objetivos da Noite
              </button>
              <button
                type="button"
                onClick={() => setAbaModalHistoria('notas')}
                className={`px-3 py-1.5 rounded-xs font-gothic font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  abaModalHistoria === 'notas'
                    ? 'bg-[#8b0000] text-white'
                    : 'bg-[#181115] text-[#a89f91] hover:text-white border border-[#3b181b]'
                }`}
              >
                Notas & Segredos
              </button>
            </div>

            {/* Conteúdo da Aba */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {abaModalHistoria === 'historia' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                      História do Personagem
                    </label>
                    <span className="text-[10px] font-mono text-[#d4af37] bg-[#221015] px-2 py-0.5 rounded border border-[#522228]">
                      ✦ Espaço Livre • Sem limite de caracteres ({tempHistoria.length} digitados)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a89f91]">
                    Descreva os acontecimentos marcantes da vida do cainita, sua linhagem, origem mortal, feitos e tragédias. O campo expande-se automaticamente ao digitar.
                  </p>
                  <textarea
                    ref={(el) => autoResizeTextarea(el)}
                    rows={12}
                    value={tempHistoria}
                    onChange={(e) => {
                      setTempHistoria(e.target.value);
                      autoResizeTextarea(e.target);
                    }}
                    placeholder="Escreva livremente a narrativa sobre as origens do seu cainita, sua família na época medieval, os conflitos enfrentados (sem limite de tamanho)..."
                    className="w-full bg-[#181115] border border-[#522228] focus:border-[#ef4444] text-xs sm:text-sm text-[#ded6cb] p-3 rounded-xs focus:outline-hidden font-serif leading-relaxed resize-y min-h-[260px] transition-[height] duration-75"
                    autoFocus
                  />
                </div>
              )}

              {abaModalHistoria === 'preludio' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                      Prelúdio (A Noite do Abraço)
                    </label>
                    <span className="text-[10px] font-mono text-[#d4af37] bg-[#221015] px-2 py-0.5 rounded border border-[#522228]">
                      ✦ Espaço Livre • Sem limite de caracteres ({tempPreludio.length} digitados)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a89f91]">
                    Relate a noite em que o personagem deixou a vida mortal e recebeu o Abraço de seu senhor. O campo expande-se automaticamente ao digitar.
                  </p>
                  <textarea
                    ref={(el) => autoResizeTextarea(el)}
                    rows={12}
                    value={tempPreludio}
                    onChange={(e) => {
                      setTempPreludio(e.target.value);
                      autoResizeTextarea(e.target);
                    }}
                    placeholder="Descreva o fatídico encontro com o seu senhor cainita, a dor e o êxtase da transformação (sem limite de tamanho)..."
                    className="w-full bg-[#181115] border border-[#522228] focus:border-[#ef4444] text-xs sm:text-sm text-[#ded6cb] p-3 rounded-xs focus:outline-hidden font-serif leading-relaxed resize-y min-h-[260px] transition-[height] duration-75"
                    autoFocus
                  />
                </div>
              )}

              {abaModalHistoria === 'objetivos' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                      Objetivos & Ambições da Noite
                    </label>
                    <span className="text-[10px] font-mono text-[#d4af37] bg-[#221015] px-2 py-0.5 rounded border border-[#522228]">
                      ✦ Espaço Livre • Sem limite de caracteres ({tempObjetivos.length} digitados)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a89f91]">
                    Ambições feudais, desejos imediatos e grandes metas a longo prazo para o personagem.
                  </p>
                  <textarea
                    ref={(el) => autoResizeTextarea(el)}
                    rows={10}
                    value={tempObjetivos}
                    onChange={(e) => {
                      setTempObjetivos(e.target.value);
                      autoResizeTextarea(e.target);
                    }}
                    placeholder="O que move este cainita? Vingança, busca pelo conhecimento de sua Trilha, domínio de um feudo..."
                    className="w-full bg-[#181115] border border-[#522228] focus:border-[#ef4444] text-xs sm:text-sm text-[#ded6cb] p-3 rounded-xs focus:outline-hidden font-serif leading-relaxed resize-y min-h-[220px] transition-[height] duration-75"
                    autoFocus
                  />
                </div>
              )}

              {abaModalHistoria === 'notas' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                      Notas & Segredos da Crônica
                    </label>
                    <span className="text-[10px] font-mono text-[#d4af37] bg-[#221015] px-2 py-0.5 rounded border border-[#522228]">
                      ✦ Espaço Livre • Sem limite de caracteres ({tempNotas.length} digitados)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a89f91]">
                    Anotações particulares, nomes de aliados ou rivais, pistas e mistérios descobertos.
                  </p>
                  <textarea
                    ref={(el) => autoResizeTextarea(el)}
                    rows={10}
                    value={tempNotas}
                    onChange={(e) => {
                      setTempNotas(e.target.value);
                      autoResizeTextarea(e.target);
                    }}
                    placeholder="Contatos secretos, dívidas de sangue, itens raros em sua posse..."
                    className="w-full bg-[#181115] border border-[#522228] focus:border-[#ef4444] text-xs sm:text-sm text-[#ded6cb] p-3 rounded-xs focus:outline-hidden font-serif leading-relaxed resize-y min-h-[220px] transition-[height] duration-75"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Rodapé do Modal com Botões de Ação */}
            <div className="border-t border-[#3b181b] pt-3 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalHistoriaAberto(false)}
                className="px-3.5 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarModalHistoria}
                className="px-5 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar História</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DO CATÁLOGO DE ARMAS DA 1ª EDIÇÃO */}
      {modalCatalogoArmasAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#120a0e] border border-[#522228] rounded-sm max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-[#180e13] px-5 py-3.5 border-b border-[#3b181b] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Swords className="w-5 h-5 text-[#ef4444]" />
                <div>
                  <h3 className="text-base font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                    Arsenal & Armas Medievais (1ª Edição - 1996)
                  </h3>
                  <p className="text-[11px] text-[#8e8273]">
                    Selecione uma arma canônica para adicionar diretamente à ficha com bônus e fórmulas calculadas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalCatalogoArmasAberto(false)}
                className="text-[#8e8273] hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filtros e Busca */}
            <div className="p-4 bg-[#140c10] border-b border-[#2d1217] flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-[#8e8273] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buscaCatalogoArmas}
                  onChange={(e) => setBuscaCatalogoArmas(e.target.value)}
                  placeholder="Buscar arma por nome ou alcance..."
                  className="w-full bg-[#1b1116] border border-[#3b181b] focus:border-[#ef4444] text-xs text-[#ded6cb] pl-9 pr-3 py-1.5 rounded-xs focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'todas', label: 'Todas' },
                    { id: 'branca', label: 'Armas Brancas' },
                    { id: 'distancia', label: 'Longo Alcance' },
                    { id: 'escudo', label: '🛡️ Escudos' },
                    { id: 'briga', label: 'Briga' },
                    { id: 'magica', label: '✨ Mágicas' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFiltroCategoriaArmas(tab.id)}
                    className={`px-3 py-1 text-xs font-gothic uppercase tracking-wide rounded-xs cursor-pointer border transition-colors ${
                      filtroCategoriaArmas === tab.id
                        ? tab.id === 'magica'
                          ? 'bg-purple-800 text-white border-purple-400'
                          : 'bg-[#8b0000] text-white border-[#b31419]'
                        : 'bg-[#1b1116] text-[#8e8273] border-[#3b181b] hover:text-[#ded6cb]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Armas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {catalogoArmasAtivo.filter((arma) => {
                const bateCat =
                  filtroCategoriaArmas === 'todas' ||
                  (filtroCategoriaArmas === 'magica'
                    ? Boolean(arma.magica)
                    : arma.categoria === filtroCategoriaArmas);
                const termo = buscaCatalogoArmas.toLowerCase().trim();
                const bateBusca =
                  !termo ||
                  arma.nome.toLowerCase().includes(termo) ||
                  (arma.descricao || '').toLowerCase().includes(termo) ||
                  (arma.poderMagico || '').toLowerCase().includes(termo);
                return bateCat && bateBusca;
              }).map((arma, idx) => {
                const forcaPers = ficha.atributos.forca || 1;
                const recursosPers =
                  ficha.antecedentes.find((a) => a.nome.toLowerCase().includes('recurso'))?.nivel || 0;
                const temForca = forcaPers >= (arma.forcaMinima || 1);
                const temRecursos = recursosPers >= (arma.recursosMinimo || 0);

                const ataqueCalc = calcularParadaAtaqueArma(
                  { id: 'temp', nome: arma.nome, dificuldade: arma.dificuldade, dano: arma.dano, ocultacao: arma.ocultacao, alcance: arma.alcance, forcaMinima: arma.forcaMinima },
                  statusCombate.destrezaEfetiva,
                  ficha.habilidades,
                  forcaPers
                );
                const danoCalc = calcularDanoArma(arma.dano, forcaPers, statusCombate.potenciaNivel);

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors border ${
                      arma.magica
                        ? 'bg-[#180f20] hover:bg-[#21132c] border-purple-700/70 hover:border-purple-400'
                        : 'bg-[#160f13] hover:bg-[#1f141a] border-[#2d1217] hover:border-[#522228]'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-gothic font-bold text-white text-sm">
                          {arma.nome}
                        </span>
                        <span className="text-[10px] font-mono text-[#d4af37] bg-[#221015] px-2 py-0.5 rounded border border-[#522228]">
                          {arma.categoria === 'branca'
                            ? 'Armas Brancas'
                            : arma.categoria === 'distancia'
                            ? 'Longo Alcance'
                            : arma.categoria === 'escudo'
                            ? '🛡️ Escudo'
                            : 'Briga / Sobrenatural'}
                        </span>
                        {arma.magica && (
                          <span className="text-[10px] font-mono font-bold text-purple-200 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/80">
                            ✨ Mágica
                          </span>
                        )}
                        {arma.danoAgravado && (
                          <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/80">
                            🔥 Agravado
                          </span>
                        )}
                        {arma.bonusMagico && (
                          <span className="text-[10px] font-mono text-fuchsia-300 bg-fuchsia-950/60 px-2 py-0.5 rounded border border-fuchsia-700/70">
                            {arma.bonusMagico}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            temForca
                              ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800/70'
                              : 'text-red-300 bg-red-950/80 border-red-700/80 font-bold'
                          }`}
                          title={temForca ? `Atende ao requisito de Força (${arma.forcaMinima || 1})` : `Força insuficiente! Requer ${arma.forcaMinima}, possui ${forcaPers}. Dificuldade penalizada em +${arma.forcaMinima! - forcaPers}.`}
                        >
                          Força Mín: {arma.forcaMinima || 1} {temForca ? '✓' : `(Pers: ${forcaPers})`}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            temRecursos
                              ? 'text-amber-300 bg-amber-950/60 border-amber-800/70'
                              : 'text-red-300 bg-red-950/80 border-red-700/80 font-bold'
                          }`}
                          title={temRecursos ? `Atende aos Recursos necessários (${arma.recursosMinimo || 0})` : `Recursos insuficientes! Requer Recursos ${arma.recursosMinimo}, personagem possui ${recursosPers}.`}
                        >
                          Recursos: {'•'.repeat(arma.recursosMinimo || 0) || '0'} {temRecursos ? '✓' : `(Requer ${arma.recursosMinimo})`}
                        </span>
                        <span className="text-[10px] text-[#8e8273]">
                          Alcance: <strong className="text-[#ded6cb]">{arma.alcance}</strong> • Ocultação: <strong className="text-[#ded6cb]">{arma.ocultacao}</strong>
                        </span>
                      </div>
                      {arma.poderMagico && (
                        <p className="text-[11px] text-purple-300 font-serif">
                          ✨ Poder Mágico: {arma.poderMagico}
                        </p>
                      )}
                      {arma.descricao && (
                        <p className="text-[11px] text-[#a89f91] italic">{arma.descricao}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap justify-between md:justify-end">
                      {/* Dificuldade */}
                      <div className="text-center bg-[#10090c] px-2.5 py-1 rounded border border-[#2d1217]">
                        <span className="text-[9px] uppercase font-gothic text-[#8e8273] block">Dificuldade</span>
                        <span
                          className={`font-mono font-bold text-xs ${!temForca ? 'text-red-400' : 'text-amber-300'}`}
                          title={!temForca ? `Dificuldade aumentada de ${arma.dificuldade} para ${ataqueCalc.dificuldade} (+${ataqueCalc.penalidadeForca} por Força insuficiente)` : undefined}
                        >
                          Dif {ataqueCalc.dificuldade}
                        </span>
                      </div>

                      {/* Parada de Ataque Calculada */}
                      <div className="text-center bg-[#10090c] px-2.5 py-1 rounded border border-[#2d1217]">
                        <span className="text-[9px] uppercase font-gothic text-[#8e8273] block">Parada de Ataque</span>
                        <span className="font-mono font-bold text-sky-400 text-xs">{ataqueCalc.paradaDados} dados</span>
                      </div>

                      {/* Dano Calculado */}
                      <div className="text-center bg-[#10090c] px-2.5 py-1 rounded border border-[#2d1217]">
                        <span className="text-[9px] uppercase font-gothic text-[#8e8273] block">Dano Efetivo</span>
                        <span className="font-mono font-bold text-red-400 text-xs">{danoCalc.resumoVisual}</span>
                      </div>

                      {/* Botão Adicionar */}
                      <button
                        type="button"
                        onClick={() => handleAdicionarArmaDoCatalogo(arma)}
                        className={`px-3.5 py-1.5 text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md flex items-center gap-1 transition-colors ${
                          !temRecursos && usuarioAtual.role !== 'mestre' && ficha.tipo !== 'npc'
                            ? 'bg-[#4a1c22] hover:bg-[#6b252e] text-[#d4999f]'
                            : 'bg-[#8b0000] hover:bg-[#a30d12]'
                        }`}
                        title={!temRecursos && usuarioAtual.role !== 'mestre' && ficha.tipo !== 'npc' ? `Requer Recursos ${arma.recursosMinimo}` : 'Adicionar arma à ficha'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé */}
            <div className="bg-[#180e13] px-5 py-3 border-t border-[#3b181b] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setModalCatalogoArmasAberto(false)}
                className="px-4 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer"
              >
                Fechar Arsenal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DO CATÁLOGO DE ARMADURAS DA 1ª EDIÇÃO */}
      {modalCatalogoArmadurasAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#120a0e] border border-[#522228] rounded-sm max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-[#180e13] px-5 py-3.5 border-b border-[#3b181b] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#ef4444]" />
                <div>
                  <h3 className="text-base font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                    Armaduras & Proteções Medievais (1ª Edição - 1996)
                  </h3>
                  <p className="text-[11px] text-[#8e8273]">
                    Selecione uma armadura para adicionar à ficha com aplicação automática de bônus de absorção e penalidade de destreza
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalCatalogoArmadurasAberto(false)}
                className="text-[#8e8273] hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Busca e Filtro Mágicas */}
            <div className="p-4 bg-[#140c10] border-b border-[#2d1217] flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-[#8e8273] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buscaCatalogoArmaduras}
                  onChange={(e) => setBuscaCatalogoArmaduras(e.target.value)}
                  placeholder="Buscar armadura por nome, poder mágico ou tipo..."
                  className="w-full bg-[#1b1116] border border-[#3b181b] focus:border-[#ef4444] text-xs text-[#ded6cb] pl-9 pr-3 py-1.5 rounded-xs focus:outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={() => setSomenteArmadurasMagicas((v) => !v)}
                className={`px-3 py-1.5 text-xs font-gothic uppercase tracking-wide rounded-xs cursor-pointer border transition-colors ${
                  somenteArmadurasMagicas
                    ? 'bg-purple-800 text-white border-purple-400'
                    : 'bg-[#1b1116] text-[#a89f91] border-[#3b181b] hover:text-white'
                }`}
              >
                ✨ Somente Mágicas
              </button>
            </div>

            {/* Lista de Armaduras */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {catalogoArmadurasAtivo.filter((arm) => {
                if (somenteArmadurasMagicas && !arm.magica) return false;
                const termo = buscaCatalogoArmaduras.toLowerCase().trim();
                return (
                  !termo ||
                  arm.nome.toLowerCase().includes(termo) ||
                  (arm.descricao || '').toLowerCase().includes(termo) ||
                  (arm.poderMagico || '').toLowerCase().includes(termo)
                );
              }).map((arm, idx) => {
                const forcaPers = ficha.atributos.forca || 1;
                const recursosPers =
                  ficha.antecedentes.find((a) => a.nome.toLowerCase().includes('recurso'))?.nivel || 0;
                const temForca = forcaPers >= (arm.forcaMinima || 1);
                const temRecursos = recursosPers >= (arm.recursosMinimo || 0);

                const classeNum = extrairClasseArmadura(arm.classe);
                const penNum = extrairPenalidadeArmadura(arm.penalidade);
                const penExtraForca = !temForca ? (arm.forcaMinima || 1) - forcaPers : 0;
                const penFinal = penNum - penExtraForca;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors border ${
                      arm.magica
                        ? 'bg-[#180f20] hover:bg-[#21132c] border-purple-700/70 hover:border-purple-400'
                        : 'bg-[#160f13] hover:bg-[#1f141a] border-[#2d1217] hover:border-[#522228]'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-gothic font-bold text-white text-sm">
                          {arm.nome}
                        </span>
                        {arm.magica && (
                          <span className="text-[10px] font-mono font-bold text-purple-200 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/80">
                            ✨ Mágica
                          </span>
                        )}
                        {arm.absorveAgravado && (
                          <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/80">
                            🛡️ Absorve Agravado
                          </span>
                        )}
                        {arm.bonusMagico && (
                          <span className="text-[10px] font-mono text-fuchsia-300 bg-fuchsia-950/60 px-2 py-0.5 rounded border border-fuchsia-700/70">
                            {arm.bonusMagico}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            temForca
                              ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800/70'
                              : 'text-red-300 bg-red-950/80 border-red-700/80 font-bold'
                          }`}
                          title={temForca ? `Atende à Força mínima (${arm.forcaMinima || 1})` : `Força insuficiente! Requer ${arm.forcaMinima}, possui ${forcaPers}. Sobrecarga impõe -${penExtraForca} na Destreza.`}
                        >
                          Força Mín: {arm.forcaMinima || 1} {temForca ? '✓' : `(Pers: ${forcaPers})`}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            temRecursos
                              ? 'text-amber-300 bg-amber-950/60 border-amber-800/70'
                              : 'text-red-300 bg-red-950/80 border-red-700/80 font-bold'
                          }`}
                          title={temRecursos ? `Atende aos Recursos necessários (${arm.recursosMinimo || 0})` : `Recursos insuficientes! Requer Recursos ${arm.recursosMinimo}, personagem possui ${recursosPers}.`}
                        >
                          Recursos: {'•'.repeat(arm.recursosMinimo || 0) || '0'} {temRecursos ? '✓' : `(Requer ${arm.recursosMinimo})`}
                        </span>
                        {Boolean(arm.penalidadePercepcao && arm.penalidadePercepcao < 0) && (
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded border text-amber-300 bg-amber-950/60 border-amber-800/70"
                            title="Penalidade de visão e audição provocada por elmo ou viseira fechada"
                          >
                            Percepção: {arm.penalidadePercepcao}
                          </span>
                        )}
                      </div>
                      {arm.poderMagico && (
                        <p className="text-[11px] text-purple-300 font-serif">
                          ✨ Poder Mágico: {arm.poderMagico}
                        </p>
                      )}
                      {arm.descricao && (
                        <p className="text-[11px] text-[#a89f91]">{arm.descricao}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap justify-between sm:justify-end">
                      {/* Bônus de Absorção */}
                      <div className="text-center bg-[#10090c] px-3 py-1 rounded border border-[#2d1217]">
                        <span className="text-[9px] uppercase font-gothic text-[#8e8273] block">Absorção</span>
                        <span className="font-mono font-bold text-green-400 text-xs">+{classeNum} dados</span>
                      </div>

                      {/* Penalidade */}
                      <div className="text-center bg-[#10090c] px-3 py-1 rounded border border-[#2d1217]">
                        <span className="text-[9px] uppercase font-gothic text-[#8e8273] block">Penalidade</span>
                        <span className={`font-mono font-bold text-xs ${penFinal < 0 ? 'text-amber-300' : 'text-[#8e8273]'}`}>
                          {penFinal < 0 ? `${penFinal} Destreza` : 'Sem penalidade'}
                        </span>
                        {!temForca && (
                          <span className="text-[9px] text-red-400 block font-mono mt-0.5" title={`Penalidade base de ${penNum} + sobrecarga de -${penExtraForca}`}>
                            ({penNum} base - {penExtraForca} peso)
                          </span>
                        )}
                      </div>

                      {/* Botão Adicionar */}
                      <button
                        type="button"
                        onClick={() => handleAdicionarArmaduraDoCatalogo(arm)}
                        className={`px-3.5 py-1.5 text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md flex items-center gap-1 transition-colors ${
                          !temRecursos && usuarioAtual.role !== 'mestre' && ficha.tipo !== 'npc'
                            ? 'bg-[#4a1c22] hover:bg-[#6b252e] text-[#d4999f]'
                            : 'bg-[#8b0000] hover:bg-[#a30d12]'
                        }`}
                        title={!temRecursos && usuarioAtual.role !== 'mestre' && ficha.tipo !== 'npc' ? `Requer Recursos ${arm.recursosMinimo}` : 'Adicionar armadura à ficha'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé */}
            <div className="bg-[#180e13] px-5 py-3 border-t border-[#3b181b] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setModalCatalogoArmadurasAberto(false)}
                className="px-4 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer"
              >
                Fechar Catálogo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Extrato de Gastos (Exclusivo Mestre) */}
      {modalExtratoAberto && (
        <ModalExtratoGastosMestre
          ficha={ficha}
          config={configMesa}
          onFechar={() => setModalExtratoAberto(false)}
          onReabrirCriacao={isMestre ? (id) => {
            const atualizado = storageService.reabrirModoCriacao(id);
            if (atualizado) {
              setFicha(atualizado);
              onSalvar(atualizado);
            }
          } : undefined}
        />
      )}

      {/* Modal de Ajuste de XP (Mestre ou Jogador dono da ficha) */}
      {modalAjustarXPAberto && (
        <ModalAjustarXP
          ficha={ficha}
          usuarioAtual={usuarioAtual}
          onFechar={() => setModalAjustarXPAberto(false)}
          onSalvar={(atualizada) => {
            setFicha(atualizada);
            onSalvar(atualizada);
            setHasChanges(false);
            setSucessoXP(`✓ Saldo de XP atualizado com sucesso! Novo saldo: ${atualizada.xp?.atual || 0} XP.`);
            setTimeout(() => setSucessoXP(null), 4000);
          }}
        />
      )}

      {/* Modal de Adicionar Habilidade Secundária */}
      {modalAddHabSecundariaAberto && (
        <ModalAddHabilidadeSecundaria
          ficha={ficha}
          usuarioAtual={usuarioAtual}
          maxBolinhas={maxBolinhasTraço}
          modoEdicaoLivre={modoEdicaoLivre}
          onFechar={() => setModalAddHabSecundariaAberto(false)}
          onAdicionar={handleAdicionarHabilidadeSecundaria}
        />
      )}
    </div>
  );
};
