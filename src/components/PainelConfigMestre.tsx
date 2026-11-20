import React, { useState, useEffect } from 'react';
import type {
  ConfiguracaoMesa,
  AtalhoParadaDado,
  CatalogoArmaItem,
  CatalogoArmaduraItem,
  ModeloQualidadeDefeito,
} from '../types';
import { storageService, CONFIGURACAO_MESA_PADRAO } from '../services/storage';
import { ARMAS_CATALOGO_1E, ARMADURAS_CATALOGO_1E } from '../data/combate1E';
import { QUALIDADES_DEFEITOS_1E, getCatalogoQualidadesDefeitos } from '../data/qualidadesDefeitos1E';
import {
  Settings,
  Save,
  RotateCcw,
  X,
  Copy,
  Check,
  Share2,
  Plus,
  Trash2,
  Swords,
  Shield,
  Pencil,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  MAPA_TRACOS,
  ATALHOS_CARD_PADRAO,
  ICONES_DISPONIVEIS,
  getIconeAtalho,
} from '../data/atalhosCard';

interface PainelConfigMestreProps {
  onFechar: () => void;
}

const ARMA_VAZIA: CatalogoArmaItem = {
  nome: '',
  categoria: 'branca',
  dificuldade: '6',
  dano: 'Força + 2',
  ocultacao: 'M',
  alcance: 'Corpo a corpo',
  forcaMinima: 1,
  recursosMinimo: 1,
  descricao: '',
  magica: false,
  danoAgravado: false,
  bonusMagico: '',
  poderMagico: '',
};

const ARMADURA_VAZIA: CatalogoArmaduraItem = {
  nome: '',
  classe: '2',
  penalidade: '-1',
  forcaMinima: 2,
  recursosMinimo: 2,
  penalidadePercepcao: 0,
  descricao: '',
  magica: false,
  absorveAgravado: false,
  bonusMagico: '',
  poderMagico: '',
};

const QD_VAZIA: ModeloQualidadeDefeito = {
  nome: '',
  tipo: 'qualidade',
  categoria: 'mental',
  pontos: 1,
  descricao: '',
};

export const PainelConfigMestre: React.FC<PainelConfigMestreProps> = ({ onFechar }) => {
  const [abaAtiva, setAbaAtiva] = useState<'regras' | 'armas' | 'armaduras' | 'qualidades_defeitos'>('regras');
  const [config, setConfig] = useState<ConfiguracaoMesa>(() =>
    storageService.getConfiguracaoMesa()
  );
  const [salvo, setSalvo] = useState(false);
  const [mensagemEquipamento, setMensagemEquipamento] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Estados de gestão de Armas
  const [buscaArma, setBuscaArma] = useState('');
  const [editandoArmaIdx, setEditandoArmaIdx] = useState<number | null>(null);
  const [criandoNovaArma, setCriandoNovaArma] = useState(false);
  const [formArma, setFormArma] = useState<CatalogoArmaItem>({ ...ARMA_VAZIA });

  // Estados de gestão de Armaduras
  const [buscaArmadura, setBuscaArmadura] = useState('');
  const [editandoArmaduraIdx, setEditandoArmaduraIdx] = useState<number | null>(null);
  const [criandoNovaArmadura, setCriandoNovaArmadura] = useState(false);
  const [formArmadura, setFormArmadura] = useState<CatalogoArmaduraItem>({ ...ARMADURA_VAZIA });

  // Estados de gestão de Qualidades & Defeitos
  const [buscaQD, setBuscaQD] = useState('');
  const [filtroTipoQD, setFiltroTipoQD] = useState<'todos' | 'qualidade' | 'defeito'>('todos');
  const [filtroCatQD, setFiltroCatQD] = useState<'todas' | 'fisico' | 'mental' | 'social' | 'sobrenatural'>('todas');
  const [editandoQDIdx, setEditandoQDIdx] = useState<number | null>(null);
  const [criandoNovoQD, setCriandoNovoQD] = useState(false);
  const [formQD, setFormQD] = useState<ModeloQualidadeDefeito>({ ...QD_VAZIA });

  useEffect(() => {
    storageService.carregarConfiguracaoMesaRemota().then((remoto) => {
      if (remoto) setConfig(remoto);
    });
  }, []);

  const notificarEquipamentoSalvo = (msg: string) => {
    setMensagemEquipamento(msg);
    setTimeout(() => setMensagemEquipamento(null), 3000);
  };

  const persistirConfig = async (novaConfig: ConfiguracaoMesa, msgSucesso?: string) => {
    setConfig(novaConfig);
    await storageService.salvarConfiguracaoMesa(novaConfig);
    if (msgSucesso) {
      notificarEquipamentoSalvo(msgSucesso);
    }
  };

  const armasAtuais: CatalogoArmaItem[] =
    Array.isArray(config.catalogoArmas) && config.catalogoArmas.length > 0
      ? config.catalogoArmas
      : ARMAS_CATALOGO_1E;

  const armadurasAtuais: CatalogoArmaduraItem[] =
    Array.isArray(config.catalogoArmaduras) && config.catalogoArmaduras.length > 0
      ? config.catalogoArmaduras
      : ARMADURAS_CATALOGO_1E;

  const qdAtuais: ModeloQualidadeDefeito[] = getCatalogoQualidadesDefeitos(config);

  // CRUD Qualidades e Defeitos do Sistema
  const handleIniciarNovoQD = () => {
    setEditandoQDIdx(null);
    setFormQD({ ...QD_VAZIA });
    setCriandoNovoQD(true);
  };

  const handleIniciarEdicaoQD = (idx: number) => {
    setCriandoNovoQD(false);
    setEditandoQDIdx(idx);
    setFormQD({ ...qdAtuais[idx] });
  };

  const handleSalvarQD = async () => {
    if (!formQD.nome.trim()) {
      alert('Informe o nome da qualidade ou defeito.');
      return;
    }
    const itemLimpo: ModeloQualidadeDefeito = {
      nome: formQD.nome.trim(),
      tipo: formQD.tipo,
      categoria: formQD.categoria,
      pontos: Math.max(1, Math.min(7, Number(formQD.pontos) || 1)),
      descricao: formQD.descricao.trim(),
    };

    const novaLista = [...qdAtuais];
    if (editandoQDIdx !== null) {
      novaLista[editandoQDIdx] = itemLimpo;
    } else {
      novaLista.unshift(itemLimpo);
    }

    await persistirConfig(
      { ...config, catalogoQualidadesDefeitos: novaLista },
      editandoQDIdx !== null
        ? `✓ ${itemLimpo.tipo === 'qualidade' ? 'Qualidade' : 'Defeito'} "${itemLimpo.nome}" atualizado no sistema!`
        : `✓ Novo ${itemLimpo.tipo === 'qualidade' ? 'Qualidade' : 'Defeito'} "${itemLimpo.nome}" cadastrado com sucesso!`
    );
    setEditandoQDIdx(null);
    setCriandoNovoQD(false);
    setFormQD({ ...QD_VAZIA });
  };

  const handleExcluirQD = async (idx: number) => {
    const alvo = qdAtuais[idx];
    if (!confirm(`Deseja remover "${alvo.nome}" (${alvo.tipo}) do catálogo de Qualidades e Defeitos da crônica?`)) return;
    const novaLista = qdAtuais.filter((_, i) => i !== idx);
    await persistirConfig(
      { ...config, catalogoQualidadesDefeitos: novaLista },
      `"${alvo.nome}" removido do catálogo.`
    );
    if (editandoQDIdx === idx) {
      setEditandoQDIdx(null);
    }
  };

  const handleRestaurarQDPadrao = async () => {
    if (!confirm('Deseja restaurar o catálogo de Qualidades e Defeitos para os itens oficiais padrão da 1ª Edição?')) return;
    await persistirConfig(
      { ...config, catalogoQualidadesDefeitos: [...QUALIDADES_DEFEITOS_1E] },
      '✓ Catálogo de Qualidades e Defeitos restaurado para o padrão oficial.'
    );
    setEditandoQDIdx(null);
    setCriandoNovoQD(false);
  };

  // CRUD Armas do Sistema
  const handleIniciarNovaArma = () => {
    setEditandoArmaIdx(null);
    setFormArma({ ...ARMA_VAZIA });
    setCriandoNovaArma(true);
  };

  const handleIniciarEdicaoArma = (idx: number) => {
    setCriandoNovaArma(false);
    setEditandoArmaIdx(idx);
    setFormArma({ ...armasAtuais[idx] });
  };

  const handleSalvarArma = async () => {
    if (!formArma.nome.trim()) {
      alert('Informe o nome da arma.');
      return;
    }
    const itemLimpo: CatalogoArmaItem = {
      ...formArma,
      nome: formArma.nome.trim(),
      dificuldade: String(formArma.dificuldade || '6').trim(),
      dano: String(formArma.dano || 'For').trim(),
      ocultacao: String(formArma.ocultacao || '-').trim(),
      alcance: String(formArma.alcance || 'Corpo a corpo').trim(),
      forcaMinima: Math.max(0, Number(formArma.forcaMinima) || 0),
      recursosMinimo: Math.max(0, Number(formArma.recursosMinimo) || 0),
      descricao: (formArma.descricao || '').trim(),
      magica: Boolean(formArma.magica),
      danoAgravado: formArma.magica ? Boolean(formArma.danoAgravado) : false,
      bonusMagico: formArma.magica ? (formArma.bonusMagico || '').trim() : '',
      poderMagico: formArma.magica ? (formArma.poderMagico || '').trim() : '',
    };

    const novaLista = [...armasAtuais];
    if (editandoArmaIdx !== null) {
      novaLista[editandoArmaIdx] = itemLimpo;
    } else {
      novaLista.push(itemLimpo);
    }

    await persistirConfig(
      { ...config, catalogoArmas: novaLista },
      editandoArmaIdx !== null
        ? `✓ Arma "${itemLimpo.nome}" atualizada no sistema!`
        : `✓ Nova arma "${itemLimpo.nome}" cadastrada no sistema!`
    );
    setEditandoArmaIdx(null);
    setCriandoNovaArma(false);
    setFormArma({ ...ARMA_VAZIA });
  };

  const handleExcluirArma = async (idx: number) => {
    const alvo = armasAtuais[idx];
    if (!confirm(`Deseja remover a arma "${alvo.nome}" do catálogo do sistema?`)) return;
    const novaLista = armasAtuais.filter((_, i) => i !== idx);
    await persistirConfig(
      { ...config, catalogoArmas: novaLista },
      `Arma "${alvo.nome}" removida do catálogo.`
    );
    if (editandoArmaIdx === idx) {
      setEditandoArmaIdx(null);
    }
  };

  const handleRestaurarArmasPadrao = async () => {
    if (!confirm('Restaurar o catálogo de armas para os itens oficiais padrão da 1ª Edição?')) return;
    await persistirConfig(
      { ...config, catalogoArmas: [...ARMAS_CATALOGO_1E] },
      '✓ Catálogo de armas restaurado para o padrão oficial.'
    );
    setEditandoArmaIdx(null);
    setCriandoNovaArma(false);
  };

  // CRUD Armaduras do Sistema
  const handleIniciarNovaArmadura = () => {
    setEditandoArmaduraIdx(null);
    setFormArmadura({ ...ARMADURA_VAZIA });
    setCriandoNovaArmadura(true);
  };

  const handleIniciarEdicaoArmadura = (idx: number) => {
    setCriandoNovaArmadura(false);
    setEditandoArmaduraIdx(idx);
    setFormArmadura({
      ...armadurasAtuais[idx],
      penalidadePercepcao: armadurasAtuais[idx].penalidadePercepcao ?? 0,
    });
  };

  const handleSalvarArmadura = async () => {
    if (!formArmadura.nome.trim()) {
      alert('Informe o nome da armadura.');
      return;
    }
    const penPercNum = Number(formArmadura.penalidadePercepcao) || 0;
    const penPercFinal = penPercNum > 0 ? -penPercNum : penPercNum;
    const itemLimpo: CatalogoArmaduraItem = {
      ...formArmadura,
      nome: formArmadura.nome.trim(),
      classe: String(formArmadura.classe || '0').trim(),
      penalidade: String(formArmadura.penalidade || '0').trim(),
      forcaMinima: Math.max(0, Number(formArmadura.forcaMinima) || 0),
      recursosMinimo: Math.max(0, Number(formArmadura.recursosMinimo) || 0),
      penalidadePercepcao: penPercFinal,
      descricao: (formArmadura.descricao || '').trim(),
      magica: Boolean(formArmadura.magica),
      absorveAgravado: formArmadura.magica ? Boolean(formArmadura.absorveAgravado) : false,
      bonusMagico: formArmadura.magica ? (formArmadura.bonusMagico || '').trim() : '',
      poderMagico: formArmadura.magica ? (formArmadura.poderMagico || '').trim() : '',
    };

    const novaLista = [...armadurasAtuais];
    if (editandoArmaduraIdx !== null) {
      novaLista[editandoArmaduraIdx] = itemLimpo;
    } else {
      novaLista.push(itemLimpo);
    }

    await persistirConfig(
      { ...config, catalogoArmaduras: novaLista },
      editandoArmaduraIdx !== null
        ? `✓ Armadura "${itemLimpo.nome}" atualizada no sistema!`
        : `✓ Nova armadura "${itemLimpo.nome}" cadastrada no sistema!`
    );
    setEditandoArmaduraIdx(null);
    setCriandoNovaArmadura(false);
    setFormArmadura({ ...ARMADURA_VAZIA });
  };

  const handleExcluirArmadura = async (idx: number) => {
    const alvo = armadurasAtuais[idx];
    if (!confirm(`Deseja remover a armadura "${alvo.nome}" do catálogo do sistema?`)) return;
    const novaLista = armadurasAtuais.filter((_, i) => i !== idx);
    await persistirConfig(
      { ...config, catalogoArmaduras: novaLista },
      `Armadura "${alvo.nome}" removida do catálogo.`
    );
    if (editandoArmaduraIdx === idx) {
      setEditandoArmaduraIdx(null);
    }
  };

  const handleRestaurarArmadurasPadrao = async () => {
    if (!confirm('Restaurar o catálogo de armaduras para os itens oficiais padrão da 1ª Edição?')) return;
    await persistirConfig(
      { ...config, catalogoArmaduras: [...ARMADURAS_CATALOGO_1E] },
      '✓ Catálogo de armaduras restaurado para o padrão oficial.'
    );
    setEditandoArmaduraIdx(null);
    setCriandoNovaArmadura(false);
  };

  // Estados locais para cadastrar novo atalho no card
  const [novoNome, setNovoNome] = useState('');
  const [novoTraco1, setNovoTraco1] = useState('destreza');
  const [novoTraco2, setNovoTraco2] = useState('nenhum');
  const [novoTipoExibicao, setNovoTipoExibicao] = useState<'dados' | 'total'>('dados');
  const [novoIcone, setNovoIcone] = useState('Swords');

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.salvarConfiguracaoMesa(config);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const handleRestaurar = () => {
    if (confirm('Deseja restaurar as configurações padrão oficiais de Vampiro: A Idade das Trevas?')) {
      setConfig({ ...CONFIGURACAO_MESA_PADRAO });
      storageService.salvarConfiguracaoMesa(CONFIGURACAO_MESA_PADRAO);
    }
  };

  const handleCopiarLinkConvite = () => {
    const url = `${window.location.origin}${window.location.pathname}?convite=dark-ages`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const handleAdicionarAtalho = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) {
      alert('Por favor, informe o nome do atalho.');
      return;
    }

    const novoAtalho: AtalhoParadaDado = {
      id: 'atalho_' + Date.now().toString(36),
      nome: novoNome.trim(),
      traco1: novoTraco1,
      traco2: novoTraco2 === 'nenhum' ? undefined : novoTraco2,
      tipoExibicao: novoTipoExibicao,
      icone: novoIcone,
    };

    const listaAtual = config.atalhosCard || ATALHOS_CARD_PADRAO;
    setConfig({
      ...config,
      atalhosCard: [...listaAtual, novoAtalho],
    });

    setNovoNome('');
    setNovoTraco1('destreza');
    setNovoTraco2('nenhum');
    setNovoTipoExibicao('dados');
    setNovoIcone('Swords');
  };

  const handleRemoverAtalho = (id: string) => {
    const listaAtual = config.atalhosCard || ATALHOS_CARD_PADRAO;
    setConfig({
      ...config,
      atalhosCard: listaAtual.filter((a) => a.id !== id),
    });
  };

  const handleRestaurarAtalhos = () => {
    if (confirm('Deseja restaurar os atalhos de testes para as 5 opções oficiais padrão?')) {
      setConfig({
        ...config,
        atalhosCard: [...ATALHOS_CARD_PADRAO],
      });
    }
  };

  const atributosOpcoes = Object.entries(MAPA_TRACOS).filter(([_, info]) => info.tipo === 'atributo');
  const habilidadesOpcoes = Object.entries(MAPA_TRACOS).filter(([_, info]) => info.tipo === 'habilidade');
  const atalhosAtuais = config.atalhosCard && config.atalhosCard.length > 0 ? config.atalhosCard : ATALHOS_CARD_PADRAO;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className={`w-full ${
          abaAtiva === 'regras' ? 'max-w-2xl' : 'max-w-4xl'
        } bg-[#100b0e] border border-[#522228] rounded-sm shadow-2xl p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto space-y-5 text-[#ded6cb] transition-all`}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-lg sm:text-xl font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
              Configurações da Crônica (Mestre)
            </h2>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-[#8e8273] hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação Exclusivas do Mestre */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#2d1217] pb-3">
          <button
            type="button"
            onClick={() => setAbaAtiva('regras')}
            className={`px-3 py-1.5 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs border cursor-pointer transition-colors flex items-center gap-1.5 ${
              abaAtiva === 'regras'
                ? 'bg-[#8b0000] text-white border-[#b31419] shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                : 'bg-[#181115] text-[#a89f91] border-[#3b181b] hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pontuação &amp; Atalhos</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('armas')}
            className={`px-3 py-1.5 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs border cursor-pointer transition-colors flex items-center gap-1.5 ${
              abaAtiva === 'armas'
                ? 'bg-[#8b0000] text-white border-[#b31419] shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                : 'bg-[#181115] text-[#a89f91] border-[#3b181b] hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-amber-300" />
            <span>Armas ({armasAtuais.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('armaduras')}
            className={`px-3 py-1.5 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs border cursor-pointer transition-colors flex items-center gap-1.5 ${
              abaAtiva === 'armaduras'
                ? 'bg-[#8b0000] text-white border-[#b31419] shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                : 'bg-[#181115] text-[#a89f91] border-[#3b181b] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-sky-300" />
            <span>Armaduras ({armadurasAtuais.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('qualidades_defeitos')}
            className={`px-3 py-1.5 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs border cursor-pointer transition-colors flex items-center gap-1.5 ${
              abaAtiva === 'qualidades_defeitos'
                ? 'bg-[#8b0000] text-white border-[#b31419] shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                : 'bg-[#181115] text-[#a89f91] border-[#3b181b] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Qualidades &amp; Defeitos ({qdAtuais.length})</span>
          </button>
        </div>

        {mensagemEquipamento && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs rounded-xs text-center font-semibold">
            {mensagemEquipamento}
          </div>
        )}

        {abaAtiva === 'regras' && (
          <>
        {/* Bloco de Compartilhamento de Convite para Jogadores */}
        <div className="bg-[#1b1014] border border-[#8b0000] p-4 rounded-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444] flex items-center gap-1.5">
              <Share2 className="w-4 h-4" /> Link de Convite para Jogadores
            </span>
            <button
              type="button"
              onClick={handleCopiarLinkConvite}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-semibold rounded-xs cursor-pointer transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)]"
            >
              {copiado ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-300" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Link de Acesso</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-[#a89f91]">
            Envie este link para seus jogadores no WhatsApp ou Discord. Ao abrir, eles cairão diretamente na tela de cadastro da sua mesa.
          </p>
        </div>

        {/* Formulário de Pontos Iniciais */}
        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Pontos de Atributos */}
          <div className="bg-[#140e11] p-4 rounded-xs border border-[#2d1217] space-y-3">
            <h3 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
              Pontos de Atributos (Iniciais)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Primário
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={config.pontosAtributos.primario}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosAtributos: {
                        ...config.pontosAtributos,
                        primario: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Secundário
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={config.pontosAtributos.secundario}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosAtributos: {
                        ...config.pontosAtributos,
                        secundario: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Terciário
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={config.pontosAtributos.terciario}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosAtributos: {
                        ...config.pontosAtributos,
                        terciario: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pontos de Habilidades */}
          <div className="bg-[#140e11] p-4 rounded-xs border border-[#2d1217] space-y-3">
            <h3 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
              Pontos de Habilidades (Iniciais)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Primária
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={config.pontosHabilidades.primario}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosHabilidades: {
                        ...config.pontosHabilidades,
                        primario: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Secundária
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={config.pontosHabilidades.secundario}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosHabilidades: {
                        ...config.pontosHabilidades,
                        secundario: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Terciária
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={config.pontosHabilidades.terciario}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosHabilidades: {
                        ...config.pontosHabilidades,
                        terciario: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Vantagens & Pontos Bônus */}
          <div className="bg-[#140e11] p-4 rounded-xs border border-[#2d1217] space-y-3">
            <h3 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
              Vantagens & Pontos Bônus
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Disciplinas
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={config.pontosDisciplinas}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosDisciplinas: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Antecedentes
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={config.pontosAntecedentes}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosAntecedentes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Virtudes
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={config.pontosVirtudes}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosVirtudes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#ef4444] rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Pontos Bônus
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={config.pontosBonus}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pontosBonus: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-[#d4af37] rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                  Máx. Defeitos
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={config.maxPontosDefeitos ?? 7}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxPontosDefeitos: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#1e1317] border border-[#522228] px-3 py-1.5 text-sm font-bold text-center text-green-400 rounded-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Seção de Atalhos de Testes nos Cards dos Jogadores */}
          <div className="bg-[#140e11] p-4 rounded-xs border border-[#2d1217] space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d1217] pb-2">
              <div>
                <h3 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-[#ef4444]" />
                  Atalhos de Testes nos Cards dos Jogadores
                </h3>
                <p className="text-[11px] text-[#a89f91] mt-0.5">
                  Define quais paradas de dados aparecem no card de resumo de todos os personagens.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRestaurarAtalhos}
                className="text-[10px] text-[#a89f91] hover:text-[#d4af37] flex items-center gap-1 border border-[#3b181b] px-2 py-1 rounded-xs bg-[#1b1014] cursor-pointer transition-colors"
                title="Restaurar os 5 atalhos oficiais de Vampiro: A Idade das Trevas"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar 5 Atalhos Padrão</span>
              </button>
            </div>

            {/* Lista dos Atalhos Ativos */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-[#8e8273] uppercase tracking-wider block">
                Atalhos Ativos ({atalhosAtuais.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {atalhosAtuais.map((atalho) => {
                  const IconeComp = getIconeAtalho(atalho.icone);
                  const label1 = MAPA_TRACOS[atalho.traco1]?.label || atalho.traco1;
                  const label2 =
                    atalho.traco2 && atalho.traco2 !== 'nenhum'
                      ? ` + ${MAPA_TRACOS[atalho.traco2]?.label || atalho.traco2}`
                      : '';

                  return (
                    <div
                      key={atalho.id}
                      className="bg-[#1b1014] border border-[#3b181b] rounded-xs p-2 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 bg-[#251419] rounded-xs text-[#d4af37] shrink-0">
                          <IconeComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#ded6cb] truncate flex items-center gap-1.5">
                            <span>{atalho.nome}</span>
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-mono font-semibold ${
                                atalho.tipoExibicao === 'total'
                                  ? 'bg-blue-950/60 text-blue-300 border border-blue-900'
                                  : 'bg-amber-950/60 text-amber-300 border border-amber-900'
                              }`}
                            >
                              {atalho.tipoExibicao === 'total' ? 'Total (ex: 5)' : 'Dados (ex: 5d10)'}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#8e8273] truncate">
                            {label1}
                            {label2}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoverAtalho(atalho.id)}
                        className="p-1 text-[#8e8273] hover:text-red-400 hover:bg-red-950/40 rounded-xs transition-colors cursor-pointer shrink-0"
                        title="Remover atalho"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Box para Cadastrar Novo Atalho */}
            <div className="bg-[#1b1014] border border-[#522228] p-3 rounded-xs space-y-3">
              <span className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#ef4444] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Adicionar Novo Atalho ao Card
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nome do Atalho */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Nome do Atalho (ex: Ataque c/ Arco, Investigação, etc.)
                  </label>
                  <input
                    type="text"
                    placeholder="Nome que aparecerá no card..."
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="w-full bg-[#120d10] border border-[#3b181b] px-3 py-1.5 text-xs text-[#ded6cb] placeholder:text-[#6e645c] rounded-xs focus:outline-none focus:border-[#8b0000]"
                  />
                </div>

                {/* 1º Traço */}
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    1º Traço (Atributo ou Habilidade)
                  </label>
                  <select
                    value={novoTraco1}
                    onChange={(e) => setNovoTraco1(e.target.value)}
                    className="w-full bg-[#120d10] border border-[#3b181b] px-2 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
                  >
                    <optgroup label="Atributos">
                      {atributosOpcoes.map(([chave, info]) => (
                        <option key={chave} value={chave}>
                          {info.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Habilidades">
                      {habilidadesOpcoes.map(([chave, info]) => (
                        <option key={chave} value={chave}>
                          {info.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* 2º Traço (Opcional) */}
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    2º Traço (Opcional)
                  </label>
                  <select
                    value={novoTraco2}
                    onChange={(e) => setNovoTraco2(e.target.value)}
                    className="w-full bg-[#120d10] border border-[#3b181b] px-2 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
                  >
                    <option value="nenhum">-- Nenhum (Usar apenas o 1º traço) --</option>
                    <optgroup label="Atributos">
                      {atributosOpcoes.map(([chave, info]) => (
                        <option key={chave} value={chave}>
                          {info.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Habilidades">
                      {habilidadesOpcoes.map(([chave, info]) => (
                        <option key={chave} value={chave}>
                          {info.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Formato de Exibição */}
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Formato no Card
                  </label>
                  <select
                    value={novoTipoExibicao}
                    onChange={(e) =>
                      setNovoTipoExibicao(e.target.value as 'dados' | 'total')
                    }
                    className="w-full bg-[#120d10] border border-[#3b181b] px-2 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
                  >
                    <option value="dados">Parada em Dados (ex: 5d10)</option>
                    <option value="total">Apenas Total Numérico (ex: 5)</option>
                  </select>
                </div>

                {/* Ícone */}
                <div>
                  <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold">
                    Ícone do Atalho
                  </label>
                  <select
                    value={novoIcone}
                    onChange={(e) => setNovoIcone(e.target.value)}
                    className="w-full bg-[#120d10] border border-[#3b181b] px-2 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
                  >
                    {ICONES_DISPONIVEIS.map((ic) => (
                      <option key={ic.id} value={ic.id}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAdicionarAtalho}
                  className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Atalho à Lista</span>
                </button>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-between border-t border-[#3b181b] pt-4">
            <button
              type="button"
              onClick={handleRestaurar}
              className="px-3 py-2 bg-[#1e1317] hover:bg-[#2e1c22] border border-[#522228] text-xs font-semibold text-[#ded6cb] rounded-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#a89f91]" />
              <span>Restaurar Padrões Oficiais</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              <Save className="w-4 h-4" />
              <span>{salvo ? 'Configurações Salvas!' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
          </>
        )}

        {/* ================================================================= */}
        {/* ABA: ARMAS DO SISTEMA (EDITAR & CADASTRAR - EXCLUSIVO MESTRE) */}
        {/* ================================================================= */}
        {abaAtiva === 'armas' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8e8273] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buscaArma}
                  onChange={(e) => setBuscaArma(e.target.value)}
                  placeholder="Buscar arma cadastrada..."
                  className="w-full bg-[#181115] border border-[#3b181b] focus:border-[#8b0000] text-xs text-[#ded6cb] pl-9 pr-3 py-2 rounded-xs focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleIniciarNovaArma}
                  className="px-3.5 py-2 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Nova Arma</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestaurarArmasPadrao}
                  title="Restaurar armas oficiais padrão"
                  className="px-2.5 py-2 bg-[#1e1317] hover:bg-[#2e1c22] border border-[#522228] text-xs text-[#a89f91] hover:text-white rounded-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Padrão</span>
                </button>
              </div>
            </div>

            {/* Formulário de Cadastro / Edição de Arma */}
            {(criandoNovaArma || editandoArmaIdx !== null) && (
              <div className="bg-[#180f14] border-2 border-[#8b0000] p-4 rounded-sm space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                  <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                    {editandoArmaIdx !== null
                      ? `Editando Arma: ${armasAtuais[editandoArmaIdx]?.nome}`
                      : 'Cadastrar Nova Arma no Sistema'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCriandoNovaArma(false);
                      setEditandoArmaIdx(null);
                    }}
                    className="text-[#8e8273] hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Nome da Arma *
                    </label>
                    <input
                      type="text"
                      value={formArma.nome}
                      onChange={(e) => setFormArma({ ...formArma, nome: e.target.value })}
                      placeholder="Ex: Espada Bastarda"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Categoria
                    </label>
                    <select
                      value={formArma.categoria}
                      onChange={(e) =>
                        setFormArma({
                          ...formArma,
                          categoria: e.target.value as CatalogoArmaItem['categoria'],
                        })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                    >
                      <option value="branca">Armas Brancas</option>
                      <option value="distancia">Projéteis / Distância</option>
                      <option value="escudo">Escudos</option>
                      <option value="briga">Briga / Sobrenatural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Dificuldade
                    </label>
                    <input
                      type="text"
                      value={formArma.dificuldade}
                      onChange={(e) => setFormArma({ ...formArma, dificuldade: e.target.value })}
                      placeholder="Ex: 6"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Dano (ex: For+3 ou 5)
                    </label>
                    <input
                      type="text"
                      value={formArma.dano}
                      onChange={(e) => setFormArma({ ...formArma, dano: e.target.value })}
                      placeholder="Ex: For+3"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Força Mínima
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formArma.forcaMinima}
                      onChange={(e) =>
                        setFormArma({ ...formArma, forcaMinima: Number(e.target.value) })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Recursos Mínimo
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formArma.recursosMinimo}
                      onChange={(e) =>
                        setFormArma({ ...formArma, recursosMinimo: Number(e.target.value) })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Alcance
                    </label>
                    <input
                      type="text"
                      value={formArma.alcance}
                      onChange={(e) => setFormArma({ ...formArma, alcance: e.target.value })}
                      placeholder="Corpo a corpo"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Ocultação
                    </label>
                    <input
                      type="text"
                      value={formArma.ocultacao}
                      onChange={(e) => setFormArma({ ...formArma, ocultacao: e.target.value })}
                      placeholder="Bainha / Capa"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Descrição / Observações
                    </label>
                    <input
                      type="text"
                      value={formArma.descricao || ''}
                      onChange={(e) => setFormArma({ ...formArma, descricao: e.target.value })}
                      placeholder="Detalhes da arma, notas de regra..."
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Opção de Arma / Escudo Mágico (Encantado) */}
                <div className="bg-[#160c1d] border border-purple-900/70 rounded-xs p-3 space-y-2.5">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(formArma.magica)}
                      onChange={(e) => setFormArma({ ...formArma, magica: e.target.checked })}
                      className="accent-purple-500 w-4 h-4 cursor-pointer"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span className="text-xs font-gothic font-bold uppercase tracking-wider text-purple-200">
                      Item Mágico / Artefato Encantado
                    </span>
                  </label>

                  {formArma.magica && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="flex items-center">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-amber-200">
                          <input
                            type="checkbox"
                            checked={Boolean(formArma.danoAgravado)}
                            onChange={(e) =>
                              setFormArma({ ...formArma, danoAgravado: e.target.checked })
                            }
                            className="accent-amber-500 w-4 h-4 cursor-pointer"
                          />
                          <span>Causa Dano Agravado</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] text-purple-300 mb-1 font-semibold uppercase">
                          Bônus Mágico (ex: +1 dado, +2 dano)
                        </label>
                        <input
                          type="text"
                          value={formArma.bonusMagico || ''}
                          onChange={(e) =>
                            setFormArma({ ...formArma, bonusMagico: e.target.value })
                          }
                          placeholder="Ex: +1 dado de ataque"
                          className="w-full bg-[#100816] border border-purple-800/80 focus:border-purple-400 px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-purple-300 mb-1 font-semibold uppercase">
                          Poder Mágico / Ritual / Maldição
                        </label>
                        <input
                          type="text"
                          value={formArma.poderMagico || ''}
                          onChange={(e) =>
                            setFormArma({ ...formArma, poderMagico: e.target.value })
                          }
                          placeholder="Ex: Lâmina forjada em ritual Tremere que incendeia o sangue do alvo..."
                          className="w-full bg-[#100816] border border-purple-800/80 focus:border-purple-400 px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2d1217]">
                  <button
                    type="button"
                    onClick={() => {
                      setCriandoNovaArma(false);
                      setEditandoArmaIdx(null);
                    }}
                    className="px-3 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] border border-[#3b181b] rounded-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSalvarArma}
                    className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{editandoArmaIdx !== null ? 'Salvar Alterações da Arma' : 'Cadastrar Arma'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Lista de Armas Cadastradas */}
            <div className="space-y-2">
              {armasAtuais
                .map((arma, idx) => ({ arma, idx }))
                .filter(({ arma }) => {
                  const t = buscaArma.toLowerCase().trim();
                  return (
                    !t ||
                    arma.nome.toLowerCase().includes(t) ||
                    (arma.descricao || '').toLowerCase().includes(t)
                  );
                })
                .map(({ arma, idx }) => (
                  <div
                    key={`${arma.nome}-${idx}`}
                    className={`p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors border ${
                      arma.magica
                        ? 'bg-[#170e1d] border-purple-700/70 hover:border-purple-500'
                        : 'bg-[#150e12] border-[#2d1217] hover:border-[#522228]'
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-gothic font-bold text-sm text-white">
                          {arma.nome}
                        </span>
                        {arma.categoria === 'escudo' && (
                          <span className="text-[10px] font-mono text-sky-300 bg-sky-950/70 px-1.5 py-0.5 rounded border border-sky-700/80">
                            🛡️ Escudo
                          </span>
                        )}
                        {arma.magica && (
                          <span className="text-[10px] font-mono font-bold text-purple-200 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/80">
                            ✨ Mágica
                          </span>
                        )}
                        {arma.danoAgravado && (
                          <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/80">
                            🔥 Agravado
                          </span>
                        )}
                        {arma.bonusMagico && (
                          <span className="text-[10px] font-mono text-fuchsia-300 bg-fuchsia-950/60 px-1.5 py-0.5 rounded border border-fuchsia-700/70">
                            {arma.bonusMagico}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[#d4af37] bg-[#221015] px-1.5 py-0.5 rounded border border-[#522228]">
                          Dif {arma.dificuldade}
                        </span>
                        <span className="text-[10px] font-mono text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/70">
                          Dano: {arma.dano}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/70">
                          Força Mín: {arma.forcaMinima}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/70">
                          Recursos: {arma.recursosMinimo}
                        </span>
                        <span className="text-[10px] text-[#8e8273]">
                          Alcance: {arma.alcance} • Ocult: {arma.ocultacao}
                        </span>
                      </div>
                      {arma.poderMagico && (
                        <p className="text-[11px] text-purple-300 font-serif">
                          ✨ Poder Mágico: {arma.poderMagico}
                        </p>
                      )}
                      {arma.descricao && (
                        <p className="text-[11px] text-[#a89f91] italic truncate">{arma.descricao}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleIniciarEdicaoArma(idx)}
                        className="px-2.5 py-1 bg-[#241318] hover:bg-[#381b22] border border-[#522228] text-[#d4af37] text-xs font-semibold rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExcluirArma(idx)}
                        className="p-1.5 bg-[#1b1014] hover:bg-red-950 border border-[#3b181b] text-[#8e8273] hover:text-red-400 rounded-xs cursor-pointer transition-colors"
                        title="Excluir arma do catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ABA: ARMADURAS DO SISTEMA (EDITAR & CADASTRAR - EXCLUSIVO MESTRE) */}
        {/* ================================================================= */}
        {abaAtiva === 'armaduras' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8e8273] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buscaArmadura}
                  onChange={(e) => setBuscaArmadura(e.target.value)}
                  placeholder="Buscar armadura ou elmo cadastrado..."
                  className="w-full bg-[#181115] border border-[#3b181b] focus:border-[#8b0000] text-xs text-[#ded6cb] pl-9 pr-3 py-2 rounded-xs focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleIniciarNovaArmadura}
                  className="px-3.5 py-2 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Nova Armadura</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestaurarArmadurasPadrao}
                  title="Restaurar armaduras oficiais padrão"
                  className="px-2.5 py-2 bg-[#1e1317] hover:bg-[#2e1c22] border border-[#522228] text-xs text-[#a89f91] hover:text-white rounded-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Padrão</span>
                </button>
              </div>
            </div>

            {/* Formulário de Cadastro / Edição de Armadura */}
            {(criandoNovaArmadura || editandoArmaduraIdx !== null) && (
              <div className="bg-[#180f14] border-2 border-[#8b0000] p-4 rounded-sm space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                  <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                    {editandoArmaduraIdx !== null
                      ? `Editando Armadura: ${armadurasAtuais[editandoArmaduraIdx]?.nome}`
                      : 'Cadastrar Nova Armadura / Elmo no Sistema'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCriandoNovaArmadura(false);
                      setEditandoArmaduraIdx(null);
                    }}
                    className="text-[#8e8273] hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Nome da Armadura / Proteção *
                    </label>
                    <input
                      type="text"
                      value={formArmadura.nome}
                      onChange={(e) => setFormArmadura({ ...formArmadura, nome: e.target.value })}
                      placeholder="Ex: Cota de Malha Medieval"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Classe / Absorção (dados)
                    </label>
                    <input
                      type="text"
                      value={formArmadura.classe}
                      onChange={(e) => setFormArmadura({ ...formArmadura, classe: e.target.value })}
                      placeholder="Ex: 3"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Penalidade na Destreza (ex: 0, -1, -2)
                    </label>
                    <input
                      type="text"
                      value={formArmadura.penalidade}
                      onChange={(e) =>
                        setFormArmadura({ ...formArmadura, penalidade: e.target.value })
                      }
                      placeholder="Ex: -1"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Penalidade na Percepção (ex: 0, -1, -2)
                    </label>
                    <input
                      type="number"
                      min={-5}
                      max={0}
                      value={formArmadura.penalidadePercepcao ?? 0}
                      onChange={(e) =>
                        setFormArmadura({
                          ...formArmadura,
                          penalidadePercepcao: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Força Mínima
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formArmadura.forcaMinima}
                      onChange={(e) =>
                        setFormArmadura({ ...formArmadura, forcaMinima: Number(e.target.value) })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Recursos Mínimo
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formArmadura.recursosMinimo}
                      onChange={(e) =>
                        setFormArmadura({
                          ...formArmadura,
                          recursosMinimo: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white font-mono rounded-xs focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Descrição / Observações
                    </label>
                    <input
                      type="text"
                      value={formArmadura.descricao || ''}
                      onChange={(e) =>
                        setFormArmadura({ ...formArmadura, descricao: e.target.value })
                      }
                      placeholder="Detalhes da armadura, peso, cobertura..."
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Opção de Armadura Mágica (Encantada) */}
                <div className="bg-[#160c1d] border border-purple-900/70 rounded-xs p-3 space-y-2.5">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(formArmadura.magica)}
                      onChange={(e) =>
                        setFormArmadura({ ...formArmadura, magica: e.target.checked })
                      }
                      className="accent-purple-500 w-4 h-4 cursor-pointer"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span className="text-xs font-gothic font-bold uppercase tracking-wider text-purple-200">
                      Armadura Mágica / Artefato Encantado
                    </span>
                  </label>

                  {formArmadura.magica && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="flex items-center">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-amber-200">
                          <input
                            type="checkbox"
                            checked={Boolean(formArmadura.absorveAgravado)}
                            onChange={(e) =>
                              setFormArmadura({
                                ...formArmadura,
                                absorveAgravado: e.target.checked,
                              })
                            }
                            className="accent-amber-500 w-4 h-4 cursor-pointer"
                          />
                          <span>Absorve Agravado / Fogo</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] text-purple-300 mb-1 font-semibold uppercase">
                          Bônus Mágico (ex: +1 absorção, leveza)
                        </label>
                        <input
                          type="text"
                          value={formArmadura.bonusMagico || ''}
                          onChange={(e) =>
                            setFormArmadura({ ...formArmadura, bonusMagico: e.target.value })
                          }
                          placeholder="Ex: +2 dados absorção"
                          className="w-full bg-[#100816] border border-purple-800/80 focus:border-purple-400 px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-purple-300 mb-1 font-semibold uppercase">
                          Poder Mágico / Proteção Especial / Maldição
                        </label>
                        <input
                          type="text"
                          value={formArmadura.poderMagico || ''}
                          onChange={(e) =>
                            setFormArmadura({ ...formArmadura, poderMagico: e.target.value })
                          }
                          placeholder="Ex: Runas de proteção contra fogo e garras lupinas..."
                          className="w-full bg-[#100816] border border-purple-800/80 focus:border-purple-400 px-2.5 py-1.5 text-xs text-white rounded-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2d1217]">
                  <button
                    type="button"
                    onClick={() => {
                      setCriandoNovaArmadura(false);
                      setEditandoArmaduraIdx(null);
                    }}
                    className="px-3 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] border border-[#3b181b] rounded-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSalvarArmadura}
                    className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {editandoArmaduraIdx !== null
                        ? 'Salvar Alterações da Armadura'
                        : 'Cadastrar Armadura'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Lista de Armaduras Cadastradas */}
            <div className="space-y-2">
              {armadurasAtuais
                .map((arm, idx) => ({ arm, idx }))
                .filter(({ arm }) => {
                  const t = buscaArmadura.toLowerCase().trim();
                  return (
                    !t ||
                    arm.nome.toLowerCase().includes(t) ||
                    (arm.descricao || '').toLowerCase().includes(t)
                  );
                })
                .map(({ arm, idx }) => (
                  <div
                    key={`${arm.nome}-${idx}`}
                    className={`p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors border ${
                      arm.magica
                        ? 'bg-[#170e1d] border-purple-700/70 hover:border-purple-500'
                        : 'bg-[#150e12] border-[#2d1217] hover:border-[#522228]'
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-gothic font-bold text-sm text-white">
                          {arm.nome}
                        </span>
                        {arm.magica && (
                          <span className="text-[10px] font-mono font-bold text-purple-200 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/80">
                            ✨ Mágica
                          </span>
                        )}
                        {arm.absorveAgravado && (
                          <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/80">
                            🛡️ Absorve Agravado
                          </span>
                        )}
                        {arm.bonusMagico && (
                          <span className="text-[10px] font-mono text-fuchsia-300 bg-fuchsia-950/60 px-1.5 py-0.5 rounded border border-fuchsia-700/70">
                            {arm.bonusMagico}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-green-300 bg-green-950/60 px-1.5 py-0.5 rounded border border-green-800/70">
                          Absorção: +{arm.classe}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/70">
                          Destreza: {arm.penalidade}
                        </span>
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/70">
                          Percepção: {arm.penalidadePercepcao || 0}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/70">
                          Força Mín: {arm.forcaMinima}
                        </span>
                        <span className="text-[10px] font-mono text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/70">
                          Recursos: {arm.recursosMinimo}
                        </span>
                      </div>
                      {arm.poderMagico && (
                        <p className="text-[11px] text-purple-300 font-serif">
                          ✨ Poder Mágico: {arm.poderMagico}
                        </p>
                      )}
                      {arm.descricao && (
                        <p className="text-[11px] text-[#a89f91] italic truncate">{arm.descricao}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleIniciarEdicaoArmadura(idx)}
                        className="px-2.5 py-1 bg-[#241318] hover:bg-[#381b22] border border-[#522228] text-[#d4af37] text-xs font-semibold rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExcluirArmadura(idx)}
                        className="p-1.5 bg-[#1b1014] hover:bg-red-950 border border-[#3b181b] text-[#8e8273] hover:text-red-400 rounded-xs cursor-pointer transition-colors"
                        title="Excluir armadura do catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* ABA: QUALIDADES E DEFEITOS                                           */}
        {/* ===================================================================== */}
        {abaAtiva === 'qualidades_defeitos' && (
          <div className="space-y-4">
            {/* Barra de Ações: Busca, Filtros, Novo Item e Restaurar */}
            <div className="bg-[#140e11] p-3.5 rounded-xs border border-[#2d1217] space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8e8273] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={buscaQD}
                    onChange={(e) => setBuscaQD(e.target.value)}
                    placeholder="Buscar por nome ou efeito da qualidade/defeito..."
                    className="w-full bg-[#1b1216] border border-[#3b181b] focus:border-[#d4af37] rounded-xs text-xs text-[#ded6cb] pl-9 pr-8 py-2 focus:outline-hidden"
                  />
                  {buscaQD && (
                    <button
                      type="button"
                      onClick={() => setBuscaQD('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8273] hover:text-white text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleIniciarNovoQD}
                    className="px-3 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.35)] whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cadastrar Característica</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestaurarQDPadrao}
                    title="Restaurar para as Qualidades e Defeitos oficiais padrão da 1ª Edição"
                    className="p-1.5 bg-[#1b1014] hover:bg-[#2e1820] border border-[#3b181b] text-[#a89f91] hover:text-[#d4af37] rounded-xs cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filtros por Tipo e Categoria */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#251015]">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-[#8e8273] uppercase font-bold mr-1">Tipo:</span>
                  {(
                    [
                      ['todos', 'Todos'],
                      ['qualidade', 'Qualidades'],
                      ['defeito', 'Defeitos'],
                    ] as const
                  ).map(([tipoVal, label]) => (
                    <button
                      key={tipoVal}
                      type="button"
                      onClick={() => setFiltroTipoQD(tipoVal)}
                      className={`px-2.5 py-1 rounded-xs font-semibold text-[11px] transition-colors cursor-pointer ${
                        filtroTipoQD === tipoVal
                          ? tipoVal === 'qualidade'
                            ? 'bg-emerald-900 text-emerald-100 border border-emerald-600'
                            : tipoVal === 'defeito'
                            ? 'bg-rose-950 text-rose-100 border border-rose-700'
                            : 'bg-[#8b0000] text-white border border-[#b31419]'
                          : 'bg-[#1b1216] text-[#a89f91] border border-[#3b181b] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-[#8e8273] uppercase font-bold">Categoria:</span>
                  <select
                    value={filtroCatQD}
                    onChange={(e) => setFiltroCatQD(e.target.value as any)}
                    className="bg-[#1b1216] border border-[#3b181b] text-[#ded6cb] text-xs rounded-xs px-2 py-1 focus:border-[#d4af37] focus:outline-hidden"
                  >
                    <option value="todas">Todas as Categorias</option>
                    <option value="fisico">Físico</option>
                    <option value="mental">Mental</option>
                    <option value="social">Social</option>
                    <option value="sobrenatural">Sobrenatural</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Formulário de Criação / Edição de Qualidade ou Defeito */}
            {(criandoNovoQD || editandoQDIdx !== null) && (
              <div className="bg-[#180f14] border-2 border-[#8b0000] p-4 rounded-xs shadow-xl space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2">
                  <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>
                      {editandoQDIdx !== null
                        ? `Editar Característica: ${qdAtuais[editandoQDIdx]?.nome}`
                        : 'Nova Qualidade ou Defeito'}
                    </span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setCriandoNovoQD(false);
                      setEditandoQDIdx(null);
                    }}
                    className="text-[#8e8273] hover:text-white p-1 text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                      Nome da Característica *
                    </label>
                    <input
                      type="text"
                      value={formQD.nome}
                      onChange={(e) => setFormQD({ ...formQD, nome: e.target.value })}
                      placeholder="Ex: Exclusão de Presa, Intolerância..."
                      className="w-full bg-[#120a0e] border border-[#3b181b] focus:border-[#d4af37] rounded-xs px-2.5 py-1.5 text-xs text-[#ded6cb] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                      Tipo *
                    </label>
                    <select
                      value={formQD.tipo}
                      onChange={(e) => setFormQD({ ...formQD, tipo: e.target.value as 'qualidade' | 'defeito' })}
                      className="w-full bg-[#120a0e] border border-[#3b181b] focus:border-[#d4af37] rounded-xs px-2 py-1.5 text-xs text-[#ded6cb] focus:outline-hidden"
                    >
                      <option value="qualidade">Qualidade (Custo em Bônus)</option>
                      <option value="defeito">Defeito (Ganha Bônus)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                      Categoria *
                    </label>
                    <select
                      value={formQD.categoria}
                      onChange={(e) => setFormQD({ ...formQD, categoria: e.target.value as any })}
                      className="w-full bg-[#120a0e] border border-[#3b181b] focus:border-[#d4af37] rounded-xs px-2 py-1.5 text-xs text-[#ded6cb] focus:outline-hidden"
                    >
                      <option value="fisico">Físico</option>
                      <option value="mental">Mental</option>
                      <option value="social">Social</option>
                      <option value="sobrenatural">Sobrenatural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                      Pontos (1 a 7) *
                    </label>
                    <select
                      value={formQD.pontos}
                      onChange={(e) => setFormQD({ ...formQD, pontos: Number(e.target.value) || 1 })}
                      className="w-full bg-[#120a0e] border border-[#3b181b] focus:border-[#d4af37] rounded-xs px-2 py-1.5 text-xs text-[#ded6cb] focus:outline-hidden"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Ponto' : 'Pontos'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-[11px] font-bold text-[#a89f91] mb-1">
                      Descrição / Regra Mecânica e Narrativa
                    </label>
                    <textarea
                      value={formQD.descricao}
                      onChange={(e) => setFormQD({ ...formQD, descricao: e.target.value })}
                      placeholder="Descreva o funcionamento no jogo, dificuldades de testes, penalidades ou vantagens concedidas..."
                      rows={2}
                      className="w-full bg-[#120a0e] border border-[#3b181b] focus:border-[#d4af37] rounded-xs px-2.5 py-1.5 text-xs text-[#ded6cb] focus:outline-hidden resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3b181b]">
                  <button
                    type="button"
                    onClick={() => {
                      setCriandoNovoQD(false);
                      setEditandoQDIdx(null);
                    }}
                    className="px-3 py-1.5 bg-[#1b1216] hover:bg-[#29161d] border border-[#3b181b] text-xs font-semibold text-[#a89f91] hover:text-white rounded-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSalvarQD}
                    className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar no Catálogo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Listagem de Qualidades e Defeitos */}
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {qdAtuais
                .map((item, idx) => ({ item, idx }))
                .filter(({ item }) => {
                  const bateTipo = filtroTipoQD === 'todos' || item.tipo === filtroTipoQD;
                  const bateCat = filtroCatQD === 'todas' || item.categoria === filtroCatQD;
                  const termo = buscaQD.toLowerCase().trim();
                  const bateBusca =
                    !termo ||
                    item.nome.toLowerCase().includes(termo) ||
                    item.descricao.toLowerCase().includes(termo);
                  return bateTipo && bateCat && bateBusca;
                })
                .map(({ item, idx }) => (
                  <div
                    key={`${item.nome}_${idx}`}
                    className="bg-[#160f13] hover:bg-[#1f141a] border border-[#2d1217] hover:border-[#522228] p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-gothic font-bold text-sm text-[#f5e6d3]">
                          {item.nome}
                        </span>

                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            item.tipo === 'qualidade'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                              : 'bg-rose-950/80 text-rose-300 border-rose-700/80'
                          }`}
                        >
                          {item.tipo === 'qualidade' ? `+${item.pontos} Pts (Qualidade)` : `-${item.pontos} Pts (Defeito)`}
                        </span>

                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#241318] text-[#d4af37] border border-[#522228]">
                          {item.categoria}
                        </span>
                      </div>

                      {item.descricao && (
                        <p className="text-xs text-[#a89f91] leading-relaxed line-clamp-2">
                          {item.descricao}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleIniciarEdicaoQD(idx)}
                        className="px-2.5 py-1 bg-[#241318] hover:bg-[#381b22] border border-[#522228] text-[#d4af37] text-xs font-semibold rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExcluirQD(idx)}
                        className="p-1.5 bg-[#1b1014] hover:bg-red-950 border border-[#3b181b] text-[#8e8273] hover:text-red-400 rounded-xs cursor-pointer transition-colors"
                        title="Excluir do catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
