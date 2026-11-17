import React, { useState } from 'react';
import type { Personagem, User } from '../types';
import { CLAS_DARK_AGES_1E } from '../data/darkAges1e';
import { storageService } from '../services/storage';
import {
  gerarNpcElaborado1E,
  PATAMARES_GERACAO_1E,
  ARQUETIPOS_META,
  type RequisitosGeradorNpc,
  type ArquetipoNpc,
  type OrigemMedieval,
} from '../utils/geradorNpc1E';
import {
  Wand2,
  X,
  Dices,
  Save,
  Swords,
  Shield,
  Crown,
  Sparkles,
  BookOpen,
  Flame,
  Droplets,
  SlidersHorizontal,
} from 'lucide-react';

interface ModalGeradorNpcProps {
  usuarioAtual: User;
  onFechar: () => void;
  onNpcCriado: (npc: Personagem) => void;
}

export const ModalGeradorNpc: React.FC<ModalGeradorNpcProps> = ({
  usuarioAtual,
  onFechar,
  onNpcCriado,
}) => {
  const [req, setReq] = useState<RequisitosGeradorNpc>({
    geracaoNum: 8,
    cla: 'aleatorio',
    arquetipo: 'aleatorio',
    foco: 'equilibrado',
    genero: 'aleatorio',
    origem: 'aleatoria',
    nomePersonalizado: '',
    tituloPersonalizado: '',
    incluirEquipamento: true,
    incluirQualidadesDefeitos: true,
    incluirDisciplinasExtras: true,
  });

  const [previa, setPrevia] = useState<Personagem | null>(null);
  const [salvando, setSalvando] = useState(false);

  const patamarAtual = PATAMARES_GERACAO_1E[req.geracaoNum] || PATAMARES_GERACAO_1E[8];

  const handleGerarPrevia = () => {
    const armasCat = storageService.getCatalogoArmas();
    const armadurasCat = storageService.getCatalogoArmaduras();
    const npc = gerarNpcElaborado1E(req, usuarioAtual, armasCat, armadurasCat);
    setPrevia(npc);
  };

  const handleConfirmarESalvar = async () => {
    if (!previa) return;
    setSalvando(true);
    try {
      await storageService.salvarPersonagem(previa);
      onNpcCriado(previa);
    } finally {
      setSalvando(false);
    }
  };

  // Top habilidades da prévia para exibição limpa
  const topHabilidades = previa
    ? Object.entries(previa.habilidades)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#110a0d] border border-[#522228] rounded-sm max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#ded6cb]">
        {/* Cabeçalho */}
        <div className="bg-[#180e13] px-5 py-3.5 border-b border-[#3b181b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wand2 className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h3 className="text-base font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                Forja de NPCs Cainitas (1ª Edição — Exclusivo Mestre)
              </h3>
              <p className="text-[11px] text-[#8e8273]">
                Defina a geração e os requisitos narrativos para gerar uma ficha completa, equilibrada e pronta para a crônica
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-[#8e8273] hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {!previa ? (
            <>
              {/* Painel de Geração em Destaque */}
              <div className="bg-gradient-to-r from-[#1d0f15] via-[#261118] to-[#1d0f15] border border-[#6e242c] p-4 rounded-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                      1. Geração &amp; Patamar de Poder (1ª Edição)
                    </span>
                  </div>
                  <span className="text-xs font-gothic font-bold uppercase text-amber-200 bg-[#3a1218] border border-[#8b0000] px-2.5 py-0.5 rounded-xs">
                    {req.geracaoNum}ª Geração • {patamarAtual.patamar}
                  </span>
                </div>

                {/* Botões de Seleção de Geração (12ª até 4ª) */}
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
                  {[12, 11, 10, 9, 8, 7, 6, 5, 4].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setReq({ ...req, geracaoNum: g })}
                      className={`py-2 px-1 rounded-xs text-center border cursor-pointer transition-all ${
                        req.geracaoNum === g
                          ? 'bg-[#8b0000] text-white border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.45)] font-bold'
                          : 'bg-[#140c10] text-[#a89f91] border-[#3b181b] hover:border-[#8b0000] hover:text-white'
                      }`}
                    >
                      <span className="block text-sm font-gothic">{g}ª</span>
                      <span className="block text-[9px] opacity-80">
                        {g >= 11 ? 'Neóf.' : g >= 9 ? 'Ancilla' : g >= 6 ? 'Ancião' : 'Matus.'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Resumo Mecânico da Geração */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="bg-[#12090d] border border-[#2d1217] px-2.5 py-1.5 rounded-xs">
                    <span className="text-[#8e8273] block text-[9px] uppercase">Teto Características</span>
                    <strong className="text-[#d4af37] font-mono">Máx. {patamarAtual.maxTraco} pontos</strong>
                  </div>
                  <div className="bg-[#12090d] border border-[#2d1217] px-2.5 py-1.5 rounded-xs">
                    <span className="text-[#8e8273] block text-[9px] uppercase">Reserva de Sangue</span>
                    <strong className="text-red-400 font-mono">
                      {patamarAtual.sangueMax} ({patamarAtual.sanguePorTurno}/turno)
                    </strong>
                  </div>
                  <div className="bg-[#12090d] border border-[#2d1217] px-2.5 py-1.5 rounded-xs">
                    <span className="text-[#8e8273] block text-[9px] uppercase">Disciplinas</span>
                    <strong className="text-purple-300 font-mono">~{patamarAtual.disciplinasPontos} pontos</strong>
                  </div>
                  <div className="bg-[#12090d] border border-[#2d1217] px-2.5 py-1.5 rounded-xs">
                    <span className="text-[#8e8273] block text-[9px] uppercase">Idade Estimada</span>
                    <strong className="text-sky-300 font-mono">
                      {patamarAtual.idadeAnosMin}–{patamarAtual.idadeAnosMax} anos
                    </strong>
                  </div>
                </div>
              </div>

              {/* Requisitos de Identidade e Papel */}
              <div className="bg-[#150d11] border border-[#2d1217] p-4 rounded-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#2d1217] pb-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#ef4444]" />
                  <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
                    2. Requisitos do Cainita (Clã, Papel e Origem)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Clã */}
                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Clã (13 Clãs da 1ª Edição)
                    </label>
                    <select
                      value={req.cla}
                      onChange={(e) => setReq({ ...req, cla: e.target.value })}
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-2 text-xs text-white rounded-xs focus:outline-none"
                    >
                      <option value="aleatorio">🎲 Aleatório (Qualquer Clã)</option>
                      <optgroup label="Altos Clãs">
                        {CLAS_DARK_AGES_1E.filter((c) => c.tipo === 'alto_cla').map((c) => (
                          <option key={c.nome} value={c.nome}>
                            {c.nome} ({c.disciplinas.join(', ')})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Baixos Clãs">
                        {CLAS_DARK_AGES_1E.filter((c) => c.tipo === 'baixo_cla').map((c) => (
                          <option key={c.nome} value={c.nome}>
                            {c.nome} ({c.disciplinas.join(', ')})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Arquétipo */}
                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Papel / Arquétipo na Crônica
                    </label>
                    <select
                      value={req.arquetipo}
                      onChange={(e) =>
                        setReq({ ...req, arquetipo: e.target.value as ArquetipoNpc })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-2 text-xs text-white rounded-xs focus:outline-none"
                    >
                      <option value="aleatorio">🎲 Aleatório</option>
                      {(Object.keys(ARQUETIPOS_META) as Exclude<ArquetipoNpc, 'aleatorio'>[]).map(
                        (k) => (
                          <option key={k} value={k}>
                            {ARQUETIPOS_META[k].label}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Foco de Atributos */}
                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Foco de Atributos
                    </label>
                    <select
                      value={req.foco}
                      onChange={(e) =>
                        setReq({
                          ...req,
                          foco: e.target.value as RequisitosGeradorNpc['foco'],
                        })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-2 text-xs text-white rounded-xs focus:outline-none"
                    >
                      <option value="equilibrado">Automático pelo Arquétipo</option>
                      <option value="fisico">⚔️ Físico (Combate &amp; Resistência)</option>
                      <option value="social">👑 Social (Corte &amp; Manipulação)</option>
                      <option value="mental">📜 Mental (Estratégia &amp; Ocultismo)</option>
                    </select>
                  </div>

                  {/* Origem Medieval */}
                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Origem Histórica Medieval
                    </label>
                    <select
                      value={req.origem}
                      onChange={(e) =>
                        setReq({ ...req, origem: e.target.value as OrigemMedieval })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-2 text-xs text-white rounded-xs focus:outline-none"
                    >
                      <option value="aleatoria">🎲 Aleatória / Coerente com o Clã</option>
                      <option value="franca">Reino da França</option>
                      <option value="germania">Sacro Império (Germânia)</option>
                      <option value="italia">Estados Italianos</option>
                      <option value="iberia">Península Ibérica</option>
                      <option value="inglaterra">Ilhas Britânicas</option>
                      <option value="bizancio">Império Bizantino</option>
                      <option value="leste_europeu">Leste Europeu / Cárpatos</option>
                      <option value="oriente_medio">Levante / Oriente Médio</option>
                    </select>
                  </div>

                  {/* Gênero */}
                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Gênero
                    </label>
                    <select
                      value={req.genero}
                      onChange={(e) =>
                        setReq({
                          ...req,
                          genero: e.target.value as RequisitosGeradorNpc['genero'],
                        })
                      }
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-2 text-xs text-white rounded-xs focus:outline-none"
                    >
                      <option value="aleatorio">🎲 Aleatório</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                  </div>

                  {/* Título/Cargo opcional */}
                  <div>
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Título / Cargo na Crônica (Opcional)
                    </label>
                    <input
                      type="text"
                      value={req.tituloPersonalizado || ''}
                      onChange={(e) => setReq({ ...req, tituloPersonalizado: e.target.value })}
                      placeholder="Ex: Soldado de Elite, Emissário..."
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-2 text-xs text-white rounded-xs focus:outline-none"
                    />
                  </div>

                  {/* Nome opcional */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[10px] text-[#a89f91] mb-1 font-semibold uppercase">
                      Nome Personalizado (Opcional — deixe vazio para gerar nome medieval autêntico)
                    </label>
                    <input
                      type="text"
                      value={req.nomePersonalizado || ''}
                      onChange={(e) => setReq({ ...req, nomePersonalizado: e.target.value })}
                      placeholder="Ex: Lorde Malakar von Eisenberg"
                      className="w-full bg-[#100a0d] border border-[#3b181b] focus:border-[#d4af37] px-2.5 py-2 text-xs text-white rounded-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Opções Extras */}
                <div className="pt-2 border-t border-[#2d1217] flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 text-xs text-[#ded6cb] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={req.incluirEquipamento}
                      onChange={(e) => setReq({ ...req, incluirEquipamento: e.target.checked })}
                      className="accent-[#8b0000] w-4 h-4 cursor-pointer"
                    />
                    <span>Equipar armas, escudo e armadura oficiais da 1ª Edição</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs text-[#ded6cb] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={req.incluirQualidadesDefeitos}
                      onChange={(e) =>
                        setReq({ ...req, incluirQualidadesDefeitos: e.target.checked })
                      }
                      className="accent-[#8b0000] w-4 h-4 cursor-pointer"
                    />
                    <span>Sortear Qualidades e Defeitos temáticos</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs text-[#ded6cb] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={req.incluirDisciplinasExtras}
                      onChange={(e) =>
                        setReq({ ...req, incluirDisciplinasExtras: e.target.checked })
                      }
                      className="accent-[#8b0000] w-4 h-4 cursor-pointer"
                    />
                    <span>Incluir Disciplinas fora de Clã (Anciões / Matusaléns)</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* PRÉVIA COMPLETA DO NPC GERADO */
            <div className="space-y-4">
              {/* Banner Identidade */}
              <div className="bg-gradient-to-r from-[#220f16] via-[#1a0d12] to-[#220f16] border border-[#6e242c] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xl font-gothic font-black text-white">{previa.nome}</h4>
                    <span className="text-[11px] font-gothic font-bold uppercase text-[#d4af37] bg-[#2c1218] border border-[#8b0000] px-2 py-0.5 rounded-xs">
                      {previa.cla} • {previa.geracao}
                    </span>
                  </div>
                  <p className="text-xs text-[#a89f91] mt-1">
                    {previa.jogador} • Conceito: <strong className="text-[#ded6cb]">{previa.conceito}</strong> • Senhor:{' '}
                    <strong className="text-[#ded6cb]">{previa.senhor}</strong>
                  </p>
                  <p className="text-[11px] text-[#8e8273] mt-0.5">
                    Natureza: {previa.natureza} • Comportamento: {previa.comportamento} • {previa.caminho} ({previa.caminhoNivel}) • Força de Vontade: {previa.forcaDeVontade}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-center bg-[#12080c] border border-[#3b181b] px-3 py-1.5 rounded-xs">
                    <span className="text-[9px] uppercase text-[#8e8273] flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3 text-red-400" /> Sangue
                    </span>
                    <strong className="text-sm font-mono text-red-400">
                      {previa.pontosDeSangueMax}
                    </strong>
                  </div>
                  <div className="text-center bg-[#12080c] border border-[#3b181b] px-3 py-1.5 rounded-xs">
                    <span className="text-[9px] uppercase text-[#8e8273] flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3 text-amber-300" /> Vontade
                    </span>
                    <strong className="text-sm font-mono text-amber-300">
                      {previa.forcaDeVontade}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Atributos + Disciplinas + Antecedentes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Atributos */}
                <div className="bg-[#150d11] border border-[#2d1217] p-3.5 rounded-xs space-y-2">
                  <span className="text-[11px] font-gothic font-bold uppercase text-[#d4af37] block border-b border-[#2d1217] pb-1">
                    Atributos
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                    <div>For: <strong className="text-white">{previa.atributos.forca}</strong></div>
                    <div>Des: <strong className="text-white">{previa.atributos.destreza}</strong></div>
                    <div>Vig: <strong className="text-white">{previa.atributos.vigor}</strong></div>
                    <div>Car: <strong className="text-white">{previa.atributos.carisma}</strong></div>
                    <div>Man: <strong className="text-white">{previa.atributos.manipulacao}</strong></div>
                    <div>Apa: <strong className="text-white">{previa.atributos.aparencia}</strong></div>
                    <div>Per: <strong className="text-white">{previa.atributos.percepcao}</strong></div>
                    <div>Int: <strong className="text-white">{previa.atributos.inteligencia}</strong></div>
                    <div>Rac: <strong className="text-white">{previa.atributos.raciocinio}</strong></div>
                  </div>
                </div>

                {/* Disciplinas */}
                <div className="bg-[#150d11] border border-[#2d1217] p-3.5 rounded-xs space-y-2">
                  <span className="text-[11px] font-gothic font-bold uppercase text-purple-300 flex items-center gap-1 border-b border-[#2d1217] pb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Disciplinas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {previa.disciplinas.map((d) => (
                      <span
                        key={d.id}
                        className="text-[11px] font-mono bg-purple-950/60 border border-purple-800/70 text-purple-200 px-2 py-0.5 rounded-xs"
                      >
                        {d.nome} <strong>{d.nivel}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Antecedentes */}
                <div className="bg-[#150d11] border border-[#2d1217] p-3.5 rounded-xs space-y-2">
                  <span className="text-[11px] font-gothic font-bold uppercase text-amber-300 block border-b border-[#2d1217] pb-1">
                    Antecedentes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {previa.antecedentes.map((a) => (
                      <span
                        key={a.id}
                        className="text-[11px] font-mono bg-[#221216] border border-[#4a1c22] text-[#ded6cb] px-2 py-0.5 rounded-xs"
                      >
                        {a.nome} <strong className="text-[#d4af37]">{a.nivel}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Principais Habilidades + Equipamento + Qualidades/Defeitos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#150d11] border border-[#2d1217] p-3.5 rounded-xs space-y-2">
                  <span className="text-[11px] font-gothic font-bold uppercase text-sky-300 block border-b border-[#2d1217] pb-1">
                    Principais Habilidades
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topHabilidades.map(([chave, nivel]) => (
                      <span
                        key={chave}
                        className="text-[11px] font-mono bg-[#1b1216] border border-[#3b181b] px-2 py-0.5 rounded-xs capitalize"
                      >
                        {chave.replace(/([A-Z])/g, ' $1')}: <strong className="text-sky-300">{nivel}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#150d11] border border-[#2d1217] p-3.5 rounded-xs space-y-2">
                  <span className="text-[11px] font-gothic font-bold uppercase text-red-300 flex items-center gap-1 border-b border-[#2d1217] pb-1">
                    <Swords className="w-3.5 h-3.5" /> Arsenal &amp; Proteção
                  </span>
                  <div className="space-y-1 text-[11px]">
                    {previa.armas.length === 0 && previa.armaduras.length === 0 ? (
                      <span className="text-[#706456] italic">Sem equipamento inicial</span>
                    ) : (
                      <>
                        {previa.armas.map((w) => (
                          <div key={w.id} className="text-[#ded6cb]">
                            • <strong>{w.nome}</strong> (Dif {w.dificuldade}, Dano {w.dano})
                          </div>
                        ))}
                        {previa.armaduras.map((ar) => (
                          <div key={ar.id} className="text-emerald-300 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> <strong>{ar.nome}</strong> (+{ar.classe} absorção, Des {ar.penalidade})
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Qualidades e Defeitos */}
              {(previa.qualidadesDefeitos || []).length > 0 && (
                <div className="bg-[#150d11] border border-[#2d1217] p-3.5 rounded-xs space-y-1.5">
                  <span className="text-[11px] font-gothic font-bold uppercase text-[#d4af37] block">
                    Qualidades &amp; Defeitos
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(previa.qualidadesDefeitos || []).map((qd) => (
                      <span
                        key={qd.id}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-xs border ${
                          qd.tipo === 'qualidade'
                            ? 'bg-emerald-950/60 border-emerald-800/70 text-emerald-200'
                            : 'bg-red-950/60 border-red-800/70 text-red-200'
                        }`}
                      >
                        {qd.tipo === 'qualidade' ? '+' : '-'} {qd.nome} ({qd.custo} pts)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Biografia Narrativa */}
              <div className="bg-[#150d11] border border-[#2d1217] p-4 rounded-xs space-y-2.5">
                <span className="text-[11px] font-gothic font-bold uppercase text-[#d4af37] flex items-center gap-1.5 border-b border-[#2d1217] pb-1">
                  <BookOpen className="w-3.5 h-3.5" /> História, Prelúdio &amp; Objetivos Gerados
                </span>
                <p className="text-xs text-[#ded6cb] font-serif leading-relaxed">
                  <strong className="text-amber-300">História:</strong> {previa.biografia.historia}
                </p>
                <p className="text-xs text-[#ded6cb] font-serif leading-relaxed">
                  <strong className="text-amber-300">Prelúdio:</strong> {previa.biografia.preludio}
                </p>
                <p className="text-xs text-[#ded6cb] font-serif leading-relaxed">
                  <strong className="text-amber-300">Objetivos:</strong> {previa.biografia.objetivos}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="bg-[#180e13] px-5 py-3.5 border-t border-[#3b181b] flex flex-wrap items-center justify-between gap-2">
          {!previa ? (
            <>
              <button
                type="button"
                onClick={onFechar}
                className="px-4 py-2 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] border border-[#3b181b] rounded-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGerarPrevia}
                className="px-5 py-2 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.45)]"
              >
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>Forjar Prévia do NPC</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrevia(null)}
                  className="px-3.5 py-2 text-xs text-[#a89f91] hover:text-white bg-[#1a1114] border border-[#3b181b] rounded-xs cursor-pointer"
                >
                  ← Ajustar Requisitos
                </button>
                <button
                  type="button"
                  onClick={handleGerarPrevia}
                  className="px-3.5 py-2 text-xs font-semibold text-[#d4af37] bg-[#241318] hover:bg-[#381b22] border border-[#522228] rounded-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Dices className="w-4 h-4" />
                  <span>Re-rolar Outro</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleConfirmarESalvar}
                disabled={salvando}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{salvando ? 'Salvando na Nuvem...' : 'Salvar NPC e Abrir Ficha'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
