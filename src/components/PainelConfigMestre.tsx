import React, { useState, useEffect } from 'react';
import type { ConfiguracaoMesa, AtalhoParadaDado } from '../types';
import { storageService, CONFIGURACAO_MESA_PADRAO } from '../services/storage';
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

export const PainelConfigMestre: React.FC<PainelConfigMestreProps> = ({ onFechar }) => {
  const [config, setConfig] = useState<ConfiguracaoMesa>(() =>
    storageService.getConfiguracaoMesa()
  );
  const [salvo, setSalvo] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    storageService.carregarConfiguracaoMesaRemota().then((remoto) => {
      if (remoto) setConfig(remoto);
    });
  }, []);

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#100b0e] border border-[#522228] rounded-sm shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto space-y-6 text-[#ded6cb]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
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
      </div>
    </div>
  );
};
