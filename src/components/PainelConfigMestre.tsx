import React, { useState } from 'react';
import type { ConfiguracaoMesa } from '../types';
import { storageService, CONFIGURACAO_MESA_PADRAO } from '../services/storage';
import { Settings, Save, RotateCcw, X, Copy, Check, Share2 } from 'lucide-react';

interface PainelConfigMestreProps {
  onFechar: () => void;
}

export const PainelConfigMestre: React.FC<PainelConfigMestreProps> = ({ onFechar }) => {
  const [config, setConfig] = useState<ConfiguracaoMesa>(() =>
    storageService.getConfiguracaoMesa()
  );
  const [salvo, setSalvo] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.salvarConfiguracaoMesa(config);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const handleRestaurar = () => {
    if (confirm('Deseja restaurar as pontuações padrão oficiais de Vampiro: A Idade das Trevas?')) {
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
