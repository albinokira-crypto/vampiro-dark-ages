import React, { useState } from 'react';
import type { Personagem, ConfiguracaoMesa, AtalhoParadaDado } from '../types';
import {
  Settings,
  Plus,
  Trash2,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  MAPA_TRACOS,
  ATALHOS_CARD_PADRAO,
  ICONES_DISPONIVEIS,
  getIconeAtalho,
  calcularValorAtalho,
} from '../data/atalhosCard';

interface ModalConfigAtalhosPersonagemProps {
  personagem: Personagem;
  configMesa: ConfiguracaoMesa;
  onSalvar: (novosAtalhos: AtalhoParadaDado[] | undefined) => void;
  onFechar: () => void;
}

export const ModalConfigAtalhosPersonagem: React.FC<ModalConfigAtalhosPersonagemProps> = ({
  personagem,
  configMesa,
  onSalvar,
  onFechar,
}) => {
  const padraoMesa =
    configMesa.atalhosCard && configMesa.atalhosCard.length > 0
      ? configMesa.atalhosCard
      : ATALHOS_CARD_PADRAO;

  const [temCustom, setTemCustom] = useState<boolean>(
    Boolean(personagem.atalhosCard && personagem.atalhosCard.length > 0)
  );

  const [listaAtalhos, setListaAtalhos] = useState<AtalhoParadaDado[]>(() => {
    if (personagem.atalhosCard && personagem.atalhosCard.length > 0) {
      return [...personagem.atalhosCard];
    }
    return [...padraoMesa];
  });

  const [novoNome, setNovoNome] = useState('');
  const [novoTraco1, setNovoTraco1] = useState('destreza');
  const [novoTraco2, setNovoTraco2] = useState('nenhum');
  const [novoTipoExibicao, setNovoTipoExibicao] = useState<'dados' | 'total'>('dados');
  const [novoIcone, setNovoIcone] = useState('Swords');
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  // Traços disponíveis: Atributos, Habilidades e Disciplinas que o personagem possui
  const atributosOpcoes = Object.entries(MAPA_TRACOS).filter(([_, info]) => info.tipo === 'atributo');
  const habilidadesOpcoes = Object.entries(MAPA_TRACOS).filter(
    ([chave, info]) =>
      info.tipo === 'habilidade' &&
      !['expressao', 'ladinagem', 'manha', 'tiroComArco', 'cavalaria', 'herbalismo', 'academicos', 'senescencia'].includes(chave)
  );

  const disciplinasPersonagem = personagem.disciplinas || [];

  const handleAdicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) {
      alert('Por favor, informe o nome do teste ou atalho.');
      return;
    }

    const novo: AtalhoParadaDado = {
      id: 'at_pers_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      nome: novoNome.trim(),
      traco1: novoTraco1,
      traco2: novoTraco2 === 'nenhum' ? undefined : novoTraco2,
      tipoExibicao: novoTipoExibicao,
      icone: novoIcone,
    };

    setListaAtalhos((prev) => [...prev, novo]);
    setTemCustom(true);
    setNovoNome('');
    setNovoTraco1('destreza');
    setNovoTraco2('nenhum');
    setNovoTipoExibicao('dados');
    setNovoIcone('Swords');
  };

  const handleRemover = (id: string) => {
    setListaAtalhos((prev) => prev.filter((a) => a.id !== id));
    setTemCustom(true);
  };

  const handleRestaurarPadraoMesa = () => {
    if (
      confirm(
        'Deseja restaurar os atalhos deste personagem para a configuração padrão definida pelo Mestre?'
      )
    ) {
      setListaAtalhos([...padraoMesa]);
      setTemCustom(false);
      onSalvar(undefined);
      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 2000);
    }
  };

  const handleSalvarTudo = () => {
    onSalvar(listaAtalhos);
    setMensagemSucesso(true);
    setTimeout(() => {
      setMensagemSucesso(false);
      onFechar();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="w-full max-w-xl bg-[#120c0f] border border-[#522228] rounded-sm shadow-2xl p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto space-y-5 text-[#ded6cb]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#3b181b] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h2 className="text-base sm:text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                Atalhos do Card Resumido
              </h2>
              <p className="text-[11px] text-[#a89f91]">
                Personagem: <strong className="text-white">{personagem.nome || 'Sem Nome'}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-[#8e8273] hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status atual dos atalhos */}
        <div className="flex items-center justify-between gap-2 bg-[#181014] p-2.5 rounded-xs border border-[#2b1418] text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                temCustom ? 'bg-[#ef4444]' : 'bg-[#d4af37]'
              }`}
            />
            <span className="text-[#a89f91]">
              Modo:{' '}
              <strong className="text-white">
                {temCustom ? 'Personalizado pelo Jogador' : 'Padrão da Mesa (Mestre)'}
              </strong>
            </span>
          </div>

          {temCustom && (
            <button
              type="button"
              onClick={handleRestaurarPadraoMesa}
              className="text-[11px] text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              title="Voltar a usar a lista padrão do Mestre"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Usar Padrão da Mesa</span>
            </button>
          )}
        </div>

        {/* Lista Atual de Atalhos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
              Atalhos Ativos ({listaAtalhos.length})
            </h3>
            <span className="text-[10px] text-[#706456]">
              Exibidos no card do Dashboard
            </span>
          </div>

          {listaAtalhos.length === 0 ? (
            <p className="text-xs text-[#706456] italic py-2">
              Nenhum atalho configurado. Adicione um abaixo ou restaure o padrão da mesa.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {listaAtalhos.map((atalho) => {
                const IconeComp = getIconeAtalho(atalho.icone);
                const valor = calcularValorAtalho(personagem, atalho);
                const descFormula = `${MAPA_TRACOS[atalho.traco1]?.label || atalho.traco1}${
                  atalho.traco2 && atalho.traco2 !== 'nenhum'
                    ? ` + ${MAPA_TRACOS[atalho.traco2]?.label || atalho.traco2}`
                    : ''
                }`;
                const valorFormatado =
                  atalho.tipoExibicao === 'total' ? `${valor}` : `${valor}d10`;

                return (
                  <div
                    key={atalho.id}
                    className="bg-[#181115] border border-[#3b181b] hover:border-[#5a1e26] rounded-xs p-2 flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <IconeComp className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#ded6cb] block truncate">
                          {atalho.nome}
                        </span>
                        <span className="text-[9px] text-[#706456] block truncate">
                          {descFormula}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs font-bold text-[#d4af37]">
                        {valorFormatado}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemover(atalho.id)}
                        className="text-[#706456] hover:text-[#ef4444] p-1 cursor-pointer transition-colors"
                        title="Remover atalho"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Formulário: Adicionar Novo Atalho */}
        <form
          onSubmit={handleAdicionar}
          className="bg-[#150e12] border border-[#2b1418] p-3.5 rounded-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#ef4444]" /> Adicionar Atalho Rápido
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                Nome do Teste / Ação
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Furtividade, Percepção + Alerta..."
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                className="w-full bg-[#1e1317] border border-[#3b181b] px-2.5 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                Ícone
              </label>
              <select
                value={novoIcone}
                onChange={(e) => setNovoIcone(e.target.value)}
                className="w-full bg-[#1e1317] border border-[#3b181b] px-2.5 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
              >
                {ICONES_DISPONIVEIS.map((ic) => (
                  <option key={ic.id} value={ic.id} className="bg-[#181115] text-[#ded6cb]">
                    {ic.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                1º Traço (Principal)
              </label>
              <select
                value={novoTraco1}
                onChange={(e) => setNovoTraco1(e.target.value)}
                className="w-full bg-[#1e1317] border border-[#3b181b] px-2 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
              >
                <optgroup label="Atributos" className="bg-[#181115] text-[#ef4444]">
                  {atributosOpcoes.map(([chave, info]) => (
                    <option key={chave} value={chave} className="text-[#ded6cb]">
                      {info.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Habilidades (1ª Edição)" className="bg-[#181115] text-[#d4af37]">
                  {habilidadesOpcoes.map(([chave, info]) => (
                    <option key={chave} value={chave} className="text-[#ded6cb]">
                      {info.label}
                    </option>
                  ))}
                </optgroup>
                {disciplinasPersonagem.length > 0 && (
                  <optgroup label="Disciplinas do Personagem" className="bg-[#181115] text-[#a855f7]">
                    {disciplinasPersonagem.map((d) => (
                      <option key={d.id} value={d.nome} className="text-[#ded6cb]">
                        {d.nome} (Nv. {d.nivel})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                2º Traço (Opcional)
              </label>
              <select
                value={novoTraco2}
                onChange={(e) => setNovoTraco2(e.target.value)}
                className="w-full bg-[#1e1317] border border-[#3b181b] px-2 py-1.5 text-xs text-[#ded6cb] rounded-xs focus:outline-none focus:border-[#8b0000]"
              >
                <option value="nenhum" className="bg-[#181115] text-[#706456]">
                  (Nenhum - Usar apenas o 1º)
                </option>
                <optgroup label="Atributos" className="bg-[#181115] text-[#ef4444]">
                  {atributosOpcoes.map(([chave, info]) => (
                    <option key={chave} value={chave} className="text-[#ded6cb]">
                      {info.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Habilidades (1ª Edição)" className="bg-[#181115] text-[#d4af37]">
                  {habilidadesOpcoes.map(([chave, info]) => (
                    <option key={chave} value={chave} className="text-[#ded6cb]">
                      {info.label}
                    </option>
                  ))}
                </optgroup>
                {disciplinasPersonagem.length > 0 && (
                  <optgroup label="Disciplinas do Personagem" className="bg-[#181115] text-[#a855f7]">
                    {disciplinasPersonagem.map((d) => (
                      <option key={d.id} value={d.nome} className="text-[#ded6cb]">
                        {d.nome} (Nv. {d.nivel})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[10px] text-[#a89f91] font-semibold uppercase">Exibir como:</span>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="tipoExibicao"
                  value="dados"
                  checked={novoTipoExibicao === 'dados'}
                  onChange={() => setNovoTipoExibicao('dados')}
                  className="accent-[#8b0000]"
                />
                <span className="text-[11px] text-[#ded6cb]">Dados (Ex: 5d10)</span>
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="tipoExibicao"
                  value="total"
                  checked={novoTipoExibicao === 'total'}
                  onChange={() => setNovoTipoExibicao('total')}
                  className="accent-[#8b0000]"
                />
                <span className="text-[11px] text-[#ded6cb]">Total Fixo (Ex: 5)</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-semibold rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-[0_0_8px_rgba(239,68,68,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inserir Atalho</span>
            </button>
          </div>
        </form>

        {/* Rodapé com Salvar e Fechar */}
        <div className="flex items-center justify-between gap-3 border-t border-[#3b181b] pt-3">
          <button
            type="button"
            onClick={onFechar}
            className="px-3 py-1.5 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] text-xs font-semibold text-[#a89f91] hover:text-white rounded-xs cursor-pointer transition-colors"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            {mensagemSucesso && (
              <span className="text-xs text-green-400 font-bold flex items-center gap-1 animate-fadeIn">
                <Check className="w-4 h-4" /> Atalhos salvos!
              </span>
            )}
            <button
              type="button"
              onClick={handleSalvarTudo}
              className="px-4 py-1.5 bg-gradient-to-r from-[#8b0000] to-[#b45309] hover:from-[#a30d12] hover:to-[#d97706] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer transition-all shadow-[0_0_12px_rgba(212,175,55,0.35)] flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Atalhos do Personagem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
