import React, { useState, useRef, useEffect } from 'react';
import type { Personagem, User, DadosElisio, CargoElisio, ConfiguracaoMesa } from '../types';
import {
  Crown,
  Shield,
  Users,
  Feather,
  Plus,
  Trash2,
  Camera,
  Save,
  X,
  BookOpen,
  User as UserIcon,
  Loader2,
  Castle,
  ExternalLink,
  Gavel,
} from 'lucide-react';
import { comprimirImagem } from '../utils/imageCompressor';
import { storageService, DADOS_ELISIO_PADRAO } from '../services/storage';

interface InfoOcupanteExibicao {
  id?: string;
  nome: string;
  foto?: string;
  cla: string;
  geracao: string;
  tipo: 'jogador' | 'npc';
  jogador?: string;
  historia: string;
  preludio?: string;
  objetivos?: string;
  conceito?: string;
  natureza?: string;
  comportamento?: string;
  senhor?: string;
  personagemCompleto?: Personagem;
}

interface PainelElisioProps {
  usuarioAtual: User;
  personagens: Personagem[];
  config?: ConfiguracaoMesa;
  onConfigChange?: (novaConfig: ConfiguracaoMesa) => void;
  onVoltar: () => void;
  onAbrirFicha?: (id: string) => void;
}

export const PainelElisio: React.FC<PainelElisioProps> = ({
  usuarioAtual,
  personagens,
  config,
  onConfigChange,
  onVoltar,
  onAbrirFicha,
}) => {
  const isMestre = usuarioAtual.role === 'mestre';
  const [dadosElisio, setDadosElisio] = useState<DadosElisio>(() => {
    return config?.elisio || storageService.getDadosElisio();
  });
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Sincronizar com mudanças remotas de configuração
  useEffect(() => {
    if (config?.elisio) {
      setDadosElisio(config.elisio);
    }
  }, [config?.elisio]);

  // Carregar dados remotos do Elísio no primeiro carregamento
  useEffect(() => {
    let ativo = true;
    storageService.carregarConfiguracaoMesaRemota().then((remota) => {
      if (ativo && remota?.elisio) {
        setDadosElisio(remota.elisio);
        if (onConfigChange) {
          onConfigChange(remota);
        }
      }
    }).catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  // Modais
  const [modalHistoriaAberto, setModalHistoriaAberto] = useState(false);
  const [modalHierarquiaAberto, setModalHierarquiaAberto] = useState(false);
  const [ocupanteModalDetalhes, setOcupanteModalDetalhes] = useState<{
    info: InfoOcupanteExibicao;
    cargoNome: string;
  } | null>(null);

  // Re-sincronizar imediatamente ao abrir o modal da hierarquia
  useEffect(() => {
    if (modalHierarquiaAberto) {
      storageService.carregarConfiguracaoMesaRemota().then((remota) => {
        if (remota?.elisio) {
          setDadosElisio(remota.elisio);
          if (onConfigChange) {
            onConfigChange(remota);
          }
        }
      }).catch(() => {});
    }
  }, [modalHierarquiaAberto]);

  // Upload de Imagem do Elísio
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comprimindoImagem, setComprimindoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState<string | null>(null);

  // Estado local da história para edição no modal
  const [historiaTemp, setHistoriaTemp] = useState(dadosElisio.historia || '');

  // Persistir dados local e remotamente
  const persistirDadosElisio = async (novosDados: DadosElisio) => {
    setDadosElisio(novosDados);
    if (config && onConfigChange) {
      onConfigChange({ ...config, elisio: novosDados });
    }
    setSalvando(true);
    try {
      await storageService.salvarDadosElisio(novosDados);
      setMensagemSucesso('Hierarquia e informações do Elísio sincronizadas!');
      setTimeout(() => setMensagemSucesso(null), 3000);
    } catch {
      // Offline fallback
    } finally {
      setSalvando(false);
    }
  };

  // Upload e compressão de imagem do Elísio (máx 800x500 para leveza máxima)
  const handleSelecionarImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setComprimindoImagem(true);
    setErroImagem(null);

    try {
      const resultado = await comprimirImagem(arquivo, 800, 500, 0.75);
      const novos = { ...dadosElisio, imagem: resultado.base64 };
      await persistirDadosElisio(novos);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErroImagem(err.message);
      } else {
        setErroImagem('Falha ao processar a imagem do Elísio.');
      }
      setTimeout(() => setErroImagem(null), 4000);
    } finally {
      setComprimindoImagem(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoverImagem = async () => {
    if (!confirm('Deseja remover a imagem do Elísio?')) return;
    const novos = { ...dadosElisio, imagem: '' };
    await persistirDadosElisio(novos);
  };

  const handleSalvarHistoria = async () => {
    const novos = { ...dadosElisio, historia: historiaTemp };
    await persistirDadosElisio(novos);
    setModalHistoriaAberto(false);
  };

  // Alterar ocupante com captura completa de snapshot público da corte
  const handleAlterarOcupante = async (cargoId: string, personagemId: string) => {
    let pAlvo: Personagem | undefined;
    if (personagemId !== 'vago') {
      pAlvo = personagens.find((x) => x.id === personagemId);
    }

    const novaHierarquia: CargoElisio[] = dadosElisio.hierarquia.map((c) => {
      if (c.id !== cargoId) return c;

      if (!pAlvo || personagemId === 'vago') {
        return {
          ...c,
          personagemId: undefined,
          ocupanteNome: undefined,
          ocupanteFoto: undefined,
          ocupanteCla: undefined,
          ocupanteGeracao: undefined,
          ocupanteTipo: undefined,
          ocupanteJogador: undefined,
          ocupanteHistoria: undefined,
          ocupantePreludio: undefined,
          ocupanteObjetivos: undefined,
          ocupanteConceito: undefined,
          ocupanteNatureza: undefined,
          ocupanteComportamento: undefined,
          ocupanteSenhor: undefined,
        };
      }

      return {
        ...c,
        personagemId: pAlvo.id,
        ocupanteNome: pAlvo.nome,
        ocupanteFoto: pAlvo.foto || '',
        ocupanteCla: pAlvo.cla || 'Cainita',
        ocupanteGeracao: pAlvo.geracao || '12ª Geração',
        ocupanteTipo: pAlvo.tipo,
        ocupanteJogador: pAlvo.jogador || '',
        ocupanteHistoria: pAlvo.biografia?.historia || '',
        ocupantePreludio: pAlvo.biografia?.preludio || '',
        ocupanteObjetivos: pAlvo.biografia?.objetivos || '',
        ocupanteConceito: pAlvo.conceito || '',
        ocupanteNatureza: pAlvo.natureza || '',
        ocupanteComportamento: pAlvo.comportamento || '',
        ocupanteSenhor: pAlvo.senhor || '',
      };
    });

    await persistirDadosElisio({ ...dadosElisio, hierarquia: novaHierarquia });
  };

  const handleAdicionarCargo = async (categoria: CargoElisio['categoria'], cargoNome: string) => {
    const novo: CargoElisio = {
      id: 'cargo_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 5),
      cargo: cargoNome,
      categoria,
    };
    const novaHierarquia = [...dadosElisio.hierarquia, novo];
    await persistirDadosElisio({ ...dadosElisio, hierarquia: novaHierarquia });
  };

  const handleRemoverCargo = async (cargoId: string) => {
    if (!confirm('Deseja remover esta posição da Hierarquia do Elísio?')) return;
    const novaHierarquia = dadosElisio.hierarquia.filter((c) => c.id !== cargoId);
    await persistirDadosElisio({ ...dadosElisio, hierarquia: novaHierarquia });
  };

  // Recupera informações completas do ocupante (pela lista ao vivo ou pelo snapshot público)
  const getInfoOcupante = (cargo: CargoElisio): InfoOcupanteExibicao | undefined => {
    // 1. Tenta achar na lista carregada
    if (cargo.personagemId) {
      const live = personagens.find((p) => p.id === cargo.personagemId);
      if (live) {
        return {
          id: live.id,
          nome: live.nome,
          foto: live.foto,
          cla: live.cla || 'Cainita',
          geracao: live.geracao || '12ª Geração',
          tipo: live.tipo,
          jogador: live.jogador,
          historia: live.biografia?.historia || (live as any).historia || live.criacao?.historia || '',
          preludio: live.biografia?.preludio || live.criacao?.preludio,
          objetivos: live.biografia?.objetivos || live.criacao?.objetivos,
          conceito: live.conceito,
          natureza: live.natureza,
          comportamento: live.comportamento,
          senhor: live.senhor,
          personagemCompleto: live,
        };
      }
    }

    // 2. Fallback obrigatório: snapshot gravado pelo Mestre (permite que qualquer jogador veja NPCs sem segredo)
    if (cargo.ocupanteNome) {
      return {
        id: cargo.personagemId,
        nome: cargo.ocupanteNome,
        foto: cargo.ocupanteFoto,
        cla: cargo.ocupanteCla || 'Cainita',
        geracao: cargo.ocupanteGeracao || '12ª Geração',
        tipo: cargo.ocupanteTipo || 'npc',
        jogador: cargo.ocupanteJogador,
        historia: cargo.ocupanteHistoria || '',
        preludio: cargo.ocupantePreludio,
        objetivos: cargo.ocupanteObjetivos,
        conceito: cargo.ocupanteConceito,
        natureza: cargo.ocupanteNatureza,
        comportamento: cargo.ocupanteComportamento,
        senhor: cargo.ocupanteSenhor,
      };
    }

    return undefined;
  };

  // Ícones por categoria
  const getIconeCategoria = (categoria: CargoElisio['categoria']) => {
    switch (categoria) {
      case 'principe':
        return <Crown className="w-4 h-4 text-amber-300" />;
      case 'xerife':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'senescal_algoz':
        return <Gavel className="w-4 h-4 text-purple-300" />;
      case 'nobres':
        return <Users className="w-4 h-4 text-sky-300" />;
      case 'harpias':
        return <Feather className="w-4 h-4 text-emerald-300" />;
      default:
        return <Castle className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  // Níveis da chave
  const principe = dadosElisio.hierarquia.find((c) => c.categoria === 'principe');
  const xerife = dadosElisio.hierarquia.find((c) => c.categoria === 'xerife');
  const senescalAlgoz = dadosElisio.hierarquia.filter((c) => c.categoria === 'senescal_algoz');
  const nobres = dadosElisio.hierarquia.filter((c) => c.categoria === 'nobres');
  const harpias = dadosElisio.hierarquia.filter((c) => c.categoria === 'harpias');
  const custom = dadosElisio.hierarquia.filter((c) => c.categoria === 'custom');

  // Renderizador de Card Individual de Cargo
  const renderCardCargo = (cargo: CargoElisio, podeExcluir = false) => {
    const info = getInfoOcupante(cargo);

    return (
      <div
        key={cargo.id}
        className="bg-[#180e13] border-2 border-[#3b181b] hover:border-[#8b0000] rounded-sm p-3 shadow-xl flex flex-col justify-between transition-all w-[210px] shrink-0 relative group"
      >
        {/* Cabeçalho do Cargo */}
        <div className="flex items-center justify-between border-b border-[#2d1217] pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 truncate">
            {getIconeCategoria(cargo.categoria)}
            <span className="font-gothic font-bold text-[11px] uppercase tracking-wider text-[#d4af37] truncate">
              {cargo.cargo}
            </span>
          </div>
          {isMestre && podeExcluir && (
            <button
              type="button"
              onClick={() => handleRemoverCargo(cargo.id)}
              className="text-[#706456] hover:text-red-400 p-0.5 rounded transition-colors shrink-0"
              title="Remover posição da hierarquia"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Informações do Ocupante com Foto Clicável */}
        <div className="flex items-center gap-2.5 my-1">
          <div
            onClick={() => {
              if (info) {
                setOcupanteModalDetalhes({ info, cargoNome: cargo.cargo });
              }
            }}
            className={`w-12 h-14 rounded-xs border-2 overflow-hidden bg-[#120a0e] shrink-0 flex items-center justify-center transition-all ${
              info
                ? 'cursor-pointer border-[#8b0000] hover:scale-105 hover:border-[#d4af37] shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                : 'border-[#2d1217]'
            }`}
            title={info ? `Clique para ler a história de ${info.nome}` : 'Cargo vago no Elísio'}
          >
            {info && info.foto ? (
              <img
                src={info.foto}
                alt={info.nome}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-[#4a1c22]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {info ? (
              <div>
                <button
                  type="button"
                  onClick={() => setOcupanteModalDetalhes({ info, cargoNome: cargo.cargo })}
                  className="text-left font-bold text-xs text-white hover:text-[#d4af37] truncate block transition-colors cursor-pointer w-full"
                  title="Clique para abrir a história"
                >
                  {info.nome}
                </button>
                <span className="text-[10px] text-[#a89f91] block truncate font-serif">
                  {info.cla} • {info.tipo === 'npc' ? 'NPC' : 'Jogador'}
                </span>
                <span className="text-[9px] text-[#8e8273] block truncate font-mono">
                  {info.geracao}
                </span>
              </div>
            ) : (
              <span className="text-xs text-[#706456] italic">Cargo Vago</span>
            )}
          </div>
        </div>

        {/* Seletor exclusivo para o Narrador designar ocupante */}
        {isMestre && (
          <div className="mt-2 pt-2 border-t border-[#251015]">
            <select
              value={cargo.personagemId || (cargo.ocupanteNome ? 'custom_ocupado' : 'vago')}
              onChange={(e) => handleAlterarOcupante(cargo.id, e.target.value)}
              className="w-full bg-[#120a0e] border border-[#3b181b] rounded-xs text-[10px] text-[#ded6cb] py-1 px-1.5 focus:outline-hidden focus:border-[#ef4444]"
            >
              <option value="vago">-- Cargo Vago --</option>
              {cargo.personagemId && !personagens.some((p) => p.id === cargo.personagemId) && cargo.ocupanteNome && (
                <option value={cargo.personagemId}>{cargo.ocupanteNome} (Gravado)</option>
              )}
              <optgroup label="NPCs da Crônica">
                {personagens
                  .filter((p) => p.tipo === 'npc')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.cla || 'NPC'})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Personagens de Jogadores">
                {personagens
                  .filter((p) => p.tipo === 'jogador')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.jogador} - {p.cla})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        )}
      </div>
    );
  };

  // Conector vertical de árvore
  const LinhaVertical = () => <div className="w-0.5 h-6 bg-[#6b1e25]" />;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Barra de Navegação Superior do Elísio */}
      <div className="bg-[#120a0e] border border-[#3b181b] p-4 sm:p-5 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#241318] border border-[#522228] rounded-xs text-[#d4af37] shadow-inner">
            <Castle className="w-6 h-6 text-[#ef4444]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-gothic font-black text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
              Corte do Elísio
            </h2>
            <p className="text-xs text-[#8e8273] font-serif">
              Pax Cainita • Santuário sagrado das leis, intrigas e títulos feudais de nossa linhagem
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setHistoriaTemp(dadosElisio.historia || '');
              setModalHistoriaAberto(true);
            }}
            className="px-3.5 py-2 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs bg-[#241318] hover:bg-[#341820] text-[#ded6cb] hover:text-white border border-[#522228] hover:border-[#8b0000] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>História do Elísio</span>
          </button>

          <button
            type="button"
            onClick={() => setModalHierarquiaAberto(true)}
            className="px-3.5 py-2 text-xs font-gothic font-bold uppercase tracking-wider rounded-xs bg-[#8b0000] hover:bg-[#a30d12] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.35)]"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Hierarquia do Elísio</span>
          </button>

          <button
            type="button"
            onClick={onVoltar}
            className="px-3 py-2 text-xs text-[#a89f91] hover:text-white bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs cursor-pointer transition-colors"
          >
            Voltar às Fichas
          </button>
        </div>
      </div>

      {mensagemSucesso && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs rounded-xs text-center font-semibold">
          {mensagemSucesso}
        </div>
      )}

      {/* Painel Principal do Elísio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cartão de Imagem & Destaque do Elísio */}
        <div className="lg:col-span-1 bg-[#140e11] border border-[#2d1217] p-5 rounded-sm space-y-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 mb-3">
              <h3 className="text-sm font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <Castle className="w-4 h-4 text-[#ef4444]" /> Refúgio do Elísio
              </h3>
              {isMestre && (
                <div className="flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelecionarImagem}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={comprimindoImagem}
                    className="text-[11px] text-[#a89f91] hover:text-white bg-[#1f1217] hover:bg-[#2d141b] border border-[#3b181b] px-2 py-1 rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                    title="Subir imagem do Elísio"
                  >
                    {comprimindoImagem ? (
                      <Loader2 className="w-3 h-3 animate-spin text-[#ef4444]" />
                    ) : (
                      <Camera className="w-3 h-3 text-[#d4af37]" />
                    )}
                    <span>Alterar Imagem</span>
                  </button>
                  {dadosElisio.imagem && (
                    <button
                      type="button"
                      onClick={handleRemoverImagem}
                      className="text-[#706456] hover:text-red-400 p-1"
                      title="Remover Imagem"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {erroImagem && (
              <div className="text-[11px] text-red-400 bg-red-950/60 p-2 rounded-xs border border-red-800">
                {erroImagem}
              </div>
            )}

            {/* Imagem do Elísio com proporção adequada */}
            <div className="relative rounded-xs overflow-hidden border border-[#522228] bg-[#0c0709] aspect-video flex items-center justify-center shadow-inner group">
              {dadosElisio.imagem ? (
                <img
                  src={dadosElisio.imagem}
                  alt="Refúgio do Elísio"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
              ) : (
                <div className="p-6 text-center text-[#706456] flex flex-col items-center gap-2">
                  <Castle className="w-10 h-10 text-[#34161b]" />
                  <span className="text-xs font-serif italic">Nenhuma pintura ou gravura deste Elísio registrada.</span>
                  {isMestre && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 text-xs text-[#d4af37] hover:underline cursor-pointer"
                    >
                      Clique para subir uma gravura
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Resumo da História Abaixo da Imagem */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] uppercase font-gothic text-[#8e8273] tracking-wider block">
                História & Tradições
              </span>
              <p className="text-xs text-[#ded6cb] leading-relaxed line-clamp-6 font-serif italic">
                {dadosElisio.historia || DADOS_ELISIO_PADRAO.historia}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setHistoriaTemp(dadosElisio.historia || '');
              setModalHistoriaAberto(true);
            }}
            className="w-full py-2 bg-[#1b1115] hover:bg-[#251319] text-[#d4af37] border border-[#3b181b] hover:border-[#522228] text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ler História Completa</span>
          </button>
        </div>

        {/* Chave da Hierarquia do Elísio */}
        <div className="lg:col-span-2 bg-[#140e11] border border-[#2d1217] p-5 rounded-sm space-y-4 shadow-lg flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-sm font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                    Hierarquia do Elísio
                  </h3>
                  <p className="text-[11px] text-[#8e8273]">
                    Estrutura feudal em chave perfeita partindo do Príncipe no topo central
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalHierarquiaAberto(true)}
                className="text-xs text-[#d4af37] hover:text-white bg-[#241318] hover:bg-[#341820] border border-[#522228] px-3 py-1.5 rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Expandir Organograma</span>
              </button>
            </div>

            {/* CHAVE PERFEITA EM ÁRVORE (ROLAGEM HORIZONTAL SE NECESSÁRIO) */}
            <div className="w-full overflow-x-auto pb-4 pt-1">
              <div className="min-w-max flex flex-col items-center mx-auto px-4">
                {/* Nível 1: Príncipe Centralizado */}
                {principe && (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#241318] border border-[#522228] px-4 py-0.5 rounded-full text-[9px] font-gothic font-bold uppercase tracking-widest text-amber-300 mb-1.5 shadow-md">
                      1. Príncipe Soberano
                    </div>
                    {renderCardCargo(principe)}
                    <LinhaVertical />
                  </div>
                )}

                {/* Nível 2: Xerife Centralizado */}
                {xerife && (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#241318] border border-[#522228] px-4 py-0.5 rounded-full text-[9px] font-gothic font-bold uppercase tracking-widest text-red-400 mb-1.5 shadow-md">
                      2. Xerife da Cidade
                    </div>
                    {renderCardCargo(xerife)}
                    <LinhaVertical />
                  </div>
                )}

                {/* Nível 3: Oficiais Maiores (Senescal e Algoz LADO A LADO) */}
                {senescalAlgoz.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#241318] border border-[#522228] px-4 py-0.5 rounded-full text-[9px] font-gothic font-bold uppercase tracking-widest text-purple-300 mb-1.5 shadow-md">
                      3. Oficiais Maiores
                    </div>
                    {/* Linha horizontal para Senescal e Algoz lado a lado */}
                    <div className="flex items-start justify-center gap-6 sm:gap-10 flex-nowrap">
                      {senescalAlgoz.map((c) => renderCardCargo(c, isMestre))}
                    </div>
                    <LinhaVertical />
                  </div>
                )}

                {/* Nível 4: Nobres da Corte (TODOS LADO A LADO) */}
                {nobres.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <div className="bg-[#241318] border border-[#522228] px-4 py-0.5 rounded-full text-[9px] font-gothic font-bold uppercase tracking-widest text-sky-300 shadow-md">
                        4. Nobres da Corte
                      </div>
                      {isMestre && (
                        <button
                          type="button"
                          onClick={() => handleAdicionarCargo('nobres', 'Nobre / Primigênie')}
                          className="px-2 py-0.5 text-[10px] bg-[#1f1217] hover:bg-[#2e141c] text-[#d4af37] border border-[#3b181b] rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Adicionar Nobre
                        </button>
                      )}
                    </div>
                    {/* Linha horizontal para todos os Nobres lado a lado */}
                    <div className="flex items-start justify-center gap-4 flex-nowrap">
                      {nobres.map((c) => renderCardCargo(c, isMestre))}
                    </div>
                    <LinhaVertical />
                  </div>
                )}

                {/* Nível 5: Harpias da Corte (TODAS LADO A LADO) */}
                {harpias.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <div className="bg-[#241318] border border-[#522228] px-4 py-0.5 rounded-full text-[9px] font-gothic font-bold uppercase tracking-widest text-emerald-300 shadow-md">
                        5. Harpias da Cidade
                      </div>
                      {isMestre && (
                        <button
                          type="button"
                          onClick={() => handleAdicionarCargo('harpias', 'Hárpia')}
                          className="px-2 py-0.5 text-[10px] bg-[#1f1217] hover:bg-[#2e141c] text-[#d4af37] border border-[#3b181b] rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Adicionar Hárpia
                        </button>
                      )}
                    </div>
                    {/* Linha horizontal para todas as Harpias lado a lado */}
                    <div className="flex items-start justify-center gap-4 flex-nowrap">
                      {harpias.map((c) => renderCardCargo(c, isMestre))}
                    </div>
                  </div>
                )}

                {/* Cargos Customizados Adicionais */}
                {custom.length > 0 && (
                  <div className="flex flex-col items-center pt-4 mt-2 border-t border-[#251015]">
                    <span className="text-[9px] font-gothic text-[#8e8273] uppercase tracking-widest mb-2">
                      Outros Títulos & Guarda
                    </span>
                    <div className="flex items-start justify-center gap-4 flex-nowrap">
                      {custom.map((c) => renderCardCargo(c, isMestre))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: HISTÓRIA DO ELÍSIO */}
      {/* ========================================================================= */}
      {modalHistoriaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#120a0e] border border-[#522228] rounded-sm max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-[#180e13] px-5 py-3.5 border-b border-[#3b181b] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Castle className="w-5 h-5 text-[#ef4444]" />
                <h3 className="text-base font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                  História & Tradições do Elísio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalHistoriaAberto(false)}
                className="text-[#8e8273] hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Imagem do Elísio */}
              {dadosElisio.imagem && (
                <div className="rounded-xs overflow-hidden border border-[#522228] max-h-72 w-full flex items-center justify-center bg-[#0c0709] shadow-md">
                  <img
                    src={dadosElisio.imagem}
                    alt="Gravura do Elísio"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              {/* Botão de upload no interior do modal se mestre */}
              {isMestre && (
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#d4af37] hover:text-white bg-[#1f1217] hover:bg-[#2d141b] border border-[#3b181b] px-3 py-1.5 rounded-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>{dadosElisio.imagem ? 'Substituir Imagem' : 'Subir Imagem do Elísio'}</span>
                  </button>
                  {dadosElisio.imagem && (
                    <button
                      type="button"
                      onClick={handleRemoverImagem}
                      className="text-xs text-[#8e8273] hover:text-red-400"
                    >
                      Remover Imagem
                    </button>
                  )}
                </div>
              )}

              {/* Texto da História */}
              <div className="space-y-2">
                <label className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] block">
                  Crônica e Registro Histórico
                </label>
                {isMestre ? (
                  <textarea
                    rows={10}
                    value={historiaTemp}
                    onChange={(e) => setHistoriaTemp(e.target.value)}
                    placeholder="Descreva a história deste Elísio, as circunstâncias de sua fundação, o local sagrado onde reside e seus costumes feudais..."
                    className="w-full bg-[#180e13] border border-[#3b181b] focus:border-[#ef4444] rounded-xs p-3 text-xs text-[#ded6cb] leading-relaxed placeholder:text-[#6e645c] focus:outline-hidden font-serif"
                  />
                ) : (
                  <div className="bg-[#180e13] border border-[#2b1418] p-4 rounded-xs text-xs text-[#ded6cb] leading-relaxed font-serif whitespace-pre-wrap italic">
                    {dadosElisio.historia || DADOS_ELISIO_PADRAO.historia}
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé */}
            <div className="bg-[#180e13] px-5 py-3 border-t border-[#3b181b] flex items-center justify-between">
              <span className="text-[10px] text-[#706456]">
                {isMestre ? 'Alterações salvas para todos os membros da crônica.' : 'Visualização da crônica do Elísio.'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalHistoriaAberto(false)}
                  className="px-4 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer"
                >
                  Fechar
                </button>
                {isMestre && (
                  <button
                    type="button"
                    onClick={handleSalvarHistoria}
                    disabled={salvando}
                    className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar História</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: HIERARQUIA DO ELÍSIO EXPANDIDA (CHAVE COMPLETA) */}
      {/* ========================================================================= */}
      {modalHierarquiaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#120a0e] border border-[#522228] rounded-sm max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-[#180e13] px-5 py-3.5 border-b border-[#3b181b] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-base font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                    Hierarquia do Elísio
                  </h3>
                  <p className="text-[11px] text-[#8e8273]">
                    Estrutura feudal em chave com oficiais maiores, nobres e harpias dispostos lado a lado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalHierarquiaAberto(false)}
                className="text-[#8e8273] hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo da Chave Expandida com Rolagem Horizontal Suave */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d1017] via-[#120a0e] to-[#0c0709]">
              <div className="min-w-max flex flex-col items-center mx-auto px-6 py-4">
                {/* Nível 1: Príncipe */}
                {principe && (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#241318] border border-[#522228] px-5 py-1 rounded-full text-[10px] font-gothic font-bold uppercase tracking-widest text-amber-300 mb-2 shadow-lg">
                      1. Príncipe Soberano
                    </div>
                    {renderCardCargo(principe)}
                    <LinhaVertical />
                  </div>
                )}

                {/* Nível 2: Xerife */}
                {xerife && (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#241318] border border-[#522228] px-5 py-1 rounded-full text-[10px] font-gothic font-bold uppercase tracking-widest text-red-400 mb-2 shadow-lg">
                      2. Xerife da Cidade
                    </div>
                    {renderCardCargo(xerife)}
                    <LinhaVertical />
                  </div>
                )}

                {/* Nível 3: Oficiais Maiores (Senescal e Algoz LADO A LADO) */}
                {senescalAlgoz.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#241318] border border-[#522228] px-5 py-1 rounded-full text-[10px] font-gothic font-bold uppercase tracking-widest text-purple-300 mb-2 shadow-lg">
                      3. Oficiais Maiores
                    </div>
                    <div className="flex items-start justify-center gap-8 sm:gap-14 flex-nowrap">
                      {senescalAlgoz.map((c) => renderCardCargo(c, isMestre))}
                    </div>
                    <LinhaVertical />
                  </div>
                )}

                {/* Nível 4: Nobres da Corte (TODOS LADO A LADO) */}
                {nobres.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="bg-[#241318] border border-[#522228] px-5 py-1 rounded-full text-[10px] font-gothic font-bold uppercase tracking-widest text-sky-300 shadow-lg">
                        4. Nobres da Corte
                      </div>
                      {isMestre && (
                        <button
                          type="button"
                          onClick={() => handleAdicionarCargo('nobres', 'Nobre / Primigênie')}
                          className="px-3 py-1 text-xs bg-[#1f1217] hover:bg-[#2e141c] text-[#d4af37] border border-[#3b181b] rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Nobre
                        </button>
                      )}
                    </div>
                    <div className="flex items-start justify-center gap-5 flex-nowrap">
                      {nobres.map((c) => renderCardCargo(c, isMestre))}
                    </div>
                    <LinhaVertical />
                  </div>
                )}

                {/* Nível 5: Harpias da Corte (TODAS LADO A LADO) */}
                {harpias.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="bg-[#241318] border border-[#522228] px-5 py-1 rounded-full text-[10px] font-gothic font-bold uppercase tracking-widest text-emerald-300 shadow-lg">
                        5. Harpias da Cidade
                      </div>
                      {isMestre && (
                        <button
                          type="button"
                          onClick={() => handleAdicionarCargo('harpias', 'Hárpia')}
                          className="px-3 py-1 text-xs bg-[#1f1217] hover:bg-[#2e141c] text-[#d4af37] border border-[#3b181b] rounded-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Hárpia
                        </button>
                      )}
                    </div>
                    <div className="flex items-start justify-center gap-5 flex-nowrap">
                      {harpias.map((c) => renderCardCargo(c, isMestre))}
                    </div>
                  </div>
                )}

                {/* Cargos Customizados */}
                {custom.length > 0 && (
                  <div className="flex flex-col items-center pt-6 mt-3 border-t border-[#251015]">
                    <span className="text-[10px] font-gothic text-[#8e8273] uppercase tracking-widest mb-2">
                      Outros Títulos da Corte
                    </span>
                    <div className="flex items-start justify-center gap-5 flex-nowrap">
                      {custom.map((c) => renderCardCargo(c, isMestre))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé */}
            <div className="bg-[#180e13] px-5 py-3 border-t border-[#3b181b] flex items-center justify-between">
              <span className="text-[10px] text-[#706456]">
                {isMestre ? 'Ocupantes atribuídos são exibidos para todos os jogadores.' : 'Hierarquia oficial do Elísio da crônica.'}
              </span>
              <button
                type="button"
                onClick={() => setModalHierarquiaAberto(false)}
                className="px-4 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer"
              >
                Fechar Organograma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BIOGRAFIA & HISTÓRIA DO PERSONAGEM (AO CLICAR NA FOTO) */}
      {/* ========================================================================= */}
      {ocupanteModalDetalhes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#120a0e] border border-[#522228] rounded-sm max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-[#180e13] px-5 py-3.5 border-b border-[#3b181b] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <h3 className="text-base font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                    {ocupanteModalDetalhes.cargoNome} • Registro Histórico
                  </h3>
                  <p className="text-[11px] text-[#8e8273]">
                    Biografia, feitos e história arquivada na ficha deste cainita do Elísio
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOcupanteModalDetalhes(null)}
                className="text-[#8e8273] hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Topo com Foto e Identificação */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-[#180e13] p-4 rounded-xs border border-[#2d1217]">
                <div className="w-28 h-36 rounded-xs overflow-hidden border-2 border-[#522228] bg-[#0c0709] shrink-0 shadow-lg flex items-center justify-center">
                  {ocupanteModalDetalhes.info.foto ? (
                    <img
                      src={ocupanteModalDetalhes.info.foto}
                      alt={ocupanteModalDetalhes.info.nome}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-[#522228]" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <h4 className="text-lg font-gothic font-bold text-white tracking-wide">
                    {ocupanteModalDetalhes.info.nome}
                  </h4>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-[#d4af37] bg-[#241318] px-2 py-0.5 rounded-xs border border-[#522228]">
                      {ocupanteModalDetalhes.info.cla}
                    </span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-xs border border-purple-800">
                      {ocupanteModalDetalhes.info.geracao}
                    </span>
                    <span className="text-[10px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-xs border border-sky-800">
                      {ocupanteModalDetalhes.info.tipo === 'npc'
                        ? 'NPC da Crônica'
                        : `Jogador: ${ocupanteModalDetalhes.info.jogador || '—'}`}
                    </span>
                  </div>

                  <div className="text-xs text-[#a89f91] space-y-0.5 pt-1">
                    <p>
                      <strong>Natureza / Comportamento:</strong>{' '}
                      {ocupanteModalDetalhes.info.natureza || '—'} / {ocupanteModalDetalhes.info.comportamento || '—'}
                    </p>
                    <p>
                      <strong>Senhor:</strong> {ocupanteModalDetalhes.info.senhor || 'Desconhecido'}
                    </p>
                    {ocupanteModalDetalhes.info.conceito && (
                      <p>
                        <strong>Conceito:</strong> {ocupanteModalDetalhes.info.conceito}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* História da Ficha */}
              <div className="space-y-2">
                <h5 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#ef4444]" /> História do Personagem
                </h5>
                <div className="bg-[#180e13] border border-[#2b1418] p-4 rounded-xs text-xs text-[#ded6cb] leading-relaxed font-serif whitespace-pre-wrap">
                  {ocupanteModalDetalhes.info.historia ||
                    'Nenhuma história formal foi registrada na ficha deste cainita.'}
                </div>
              </div>

              {/* Prelúdio da Ficha */}
              {ocupanteModalDetalhes.info.preludio && (
                <div className="space-y-2">
                  <h5 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-[#ef4444]" /> Prelúdio (O Abraço)
                  </h5>
                  <div className="bg-[#180e13] border border-[#2b1418] p-4 rounded-xs text-xs text-[#ded6cb] leading-relaxed font-serif whitespace-pre-wrap italic">
                    {ocupanteModalDetalhes.info.preludio}
                  </div>
                </div>
              )}

              {/* Objetivos da Ficha */}
              {ocupanteModalDetalhes.info.objetivos && (
                <div className="space-y-2">
                  <h5 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#ef4444]" /> Ambições & Objetivos na Corte
                  </h5>
                  <div className="bg-[#180e13] border border-[#2b1418] p-4 rounded-xs text-xs text-[#ded6cb] leading-relaxed font-serif whitespace-pre-wrap">
                    {ocupanteModalDetalhes.info.objetivos}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="bg-[#180e13] px-5 py-3 border-t border-[#3b181b] flex items-center justify-between">
              {onAbrirFicha && ocupanteModalDetalhes.info.id && (
                <button
                  type="button"
                  onClick={() => {
                    const id = ocupanteModalDetalhes.info.id!;
                    setOcupanteModalDetalhes(null);
                    setModalHierarquiaAberto(false);
                    onAbrirFicha(id);
                  }}
                  className="px-3.5 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Ficha Completa</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setOcupanteModalDetalhes(null)}
                className="px-4 py-1.5 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] hover:bg-[#251419] rounded-xs border border-[#3b181b] cursor-pointer ml-auto"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
