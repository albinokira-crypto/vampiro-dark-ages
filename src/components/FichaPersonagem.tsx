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
} from '../types';
import { Bolinhas } from './Bolinhas';
import { QuadradosStatus } from './QuadradosStatus';
import { VitalidadeSelector } from './VitalidadeSelector';
import { InlineField } from './InlineField';
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
} from 'lucide-react';

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
  const [ficha, setFicha] = useState<Personagem>(personagem);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [abaAtiva, setAbaAtiva] = useState<'secao1' | 'secao2' | 'secao3'>('secao1');
  const [mensagemSalvo, setMensagemSalvo] = useState<boolean>(false);

  // Permissão de edição: Mestre pode editar tudo; Jogador só pode editar a sua própria ficha
  const podeEditar =
    usuarioAtual.role === 'mestre' || ficha.usuarioId === usuarioAtual.id;

  // Atualizar quando mudar o personagem passado por prop
  useEffect(() => {
    setFicha(personagem);
    setHasChanges(false);
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

  // Atualização de atributos
  const handleAtributoChange = (
    nome: keyof Personagem['atributos'],
    valor: number
  ) => {
    updateFicha((prev) => ({
      ...prev,
      atributos: {
        ...prev.atributos,
        [nome]: valor,
      },
    }));
  };

  // Atualização de habilidades
  const handleHabilidadeChange = (
    nome: keyof Personagem['habilidades'],
    valor: number
  ) => {
    updateFicha((prev) => ({
      ...prev,
      habilidades: {
        ...prev.habilidades,
        [nome]: valor,
      },
    }));
  };

  // Disciplinas
  const handleAdicionarDisciplina = () => {
    const nova: ItemSimplesNivel = {
      id: 'disc_' + Date.now().toString(36),
      nome: 'Nova Disciplina',
      nivel: 1,
    };
    updateFicha((prev) => ({
      ...prev,
      disciplinas: [...prev.disciplinas, nova],
    }));
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
    updateFicha((prev) => ({
      ...prev,
      disciplinas: prev.disciplinas.map((d) =>
        d.id === id ? { ...d, [campo]: valor } : d
      ),
    }));
  };

  // Antecedentes
  const handleAdicionarAntecedente = () => {
    const novo: ItemSimplesNivel = {
      id: 'ant_' + Date.now().toString(36),
      nome: 'Novo Antecedente',
      nivel: 1,
    };
    updateFicha((prev) => ({
      ...prev,
      antecedentes: [...prev.antecedentes, novo],
    }));
  };

  const handleRemoverAntecedente = (id: string) => {
    updateFicha((prev) => ({
      ...prev,
      antecedentes: prev.antecedentes.filter((a) => a.id !== id),
    }));
  };

  const handleEditarAntecedente = (
    id: string,
    campo: 'nome' | 'nivel',
    valor: string | number
  ) => {
    updateFicha((prev) => ({
      ...prev,
      antecedentes: prev.antecedentes.map((a) =>
        a.id === id ? { ...a, [campo]: valor } : a
      ),
    }));
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
    updateFicha((prev) => ({
      ...prev,
      linhasTaumaturgia: prev.linhasTaumaturgia.map((l) =>
        l.id === id ? { ...l, [campo]: valor } : l
      ),
    }));
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
        </div>
      </div>

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
          {/* CABEÇALHO PERMANENTE DA FICHA (Nome, Clã, Geração, etc.) */}
          {/* ========================================================================= */}
          <div className="border-b-2 border-[#522228] pb-6">
            <div className="text-center mb-6">
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#a89f91] font-bold">
                Vampiro: A Idade das Trevas
              </span>
              <h2 className="text-2xl sm:text-3xl font-gothic font-black text-[#d4af37] tracking-wider mt-0.5">
                {ficha.nome || 'Ficha de Personagem'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 bg-[#160f13]/80 p-4 rounded-sm border border-[#2d1217]">
              <InlineField
                label="Nome do Personagem"
                value={ficha.nome}
                onChange={(val) => handleHeaderChange('nome', val)}
                placeholder="Ex: Alistair de Montfort"
                readonly={!podeEditar}
              />
              <InlineField
                label="Jogador"
                value={ficha.jogador}
                onChange={(val) => handleHeaderChange('jogador', val)}
                placeholder="Seu nome real"
                readonly={!podeEditar}
              />
              <InlineField
                label="Crônica"
                value={ficha.cronica}
                onChange={(val) => handleHeaderChange('cronica', val)}
                placeholder="Ex: Sombras de Paris"
                readonly={!podeEditar}
              />
              <InlineField
                label="Clã"
                value={ficha.cla}
                onChange={(val) => handleHeaderChange('cla', val)}
                placeholder="Ex: Ventrue, Lasombra, Tremere..."
                readonly={!podeEditar}
              />
              <InlineField
                label="Natureza"
                value={ficha.natureza}
                onChange={(val) => handleHeaderChange('natureza', val)}
                placeholder="Ex: Autocrata, Tradicionalista"
                readonly={!podeEditar}
              />
              <InlineField
                label="Comportamento"
                value={ficha.comportamento}
                onChange={(val) => handleHeaderChange('comportamento', val)}
                placeholder="Ex: Benfeitor, Rebelde"
                readonly={!podeEditar}
              />
              <InlineField
                label="Geração"
                value={ficha.geracao}
                onChange={(val) => handleHeaderChange('geracao', val)}
                placeholder="Ex: 8ª Geração"
                readonly={!podeEditar}
              />
              <InlineField
                label="Refúgio"
                value={ficha.refugio}
                onChange={(val) => handleHeaderChange('refugio', val)}
                placeholder="Ex: Cripta da Abadia"
                readonly={!podeEditar}
              />
              <InlineField
                label="Conceito"
                value={ficha.conceito}
                onChange={(val) => handleHeaderChange('conceito', val)}
                placeholder="Ex: Nobre Banido"
                readonly={!podeEditar}
              />
              <div className="sm:col-span-2 lg:col-span-3">
                <InlineField
                  label="Senhor (Sire)"
                  value={ficha.senhor}
                  onChange={(val) => handleHeaderChange('senhor', val)}
                  placeholder="Nome do vampiro que lhe concedeu o Abraço"
                  readonly={!podeEditar}
                />
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
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 mb-4">
                  <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Atributos (Escala 1 a 8)
                  </h3>
                  <span className="text-[11px] text-[#8e8273]">
                    Físicos • Sociais • Mentais
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FÍSICOS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444] border-b border-[#3b181b] pb-1">
                      Físicos
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Força</span>
                      <Bolinhas
                        valor={ficha.atributos.forca}
                        max={8}
                        min={1}
                        onChange={(v) => handleAtributoChange('forca', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Destreza</span>
                      <Bolinhas
                        valor={ficha.atributos.destreza}
                        max={8}
                        min={1}
                        onChange={(v) => handleAtributoChange('destreza', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Vigor</span>
                      <Bolinhas
                        valor={ficha.atributos.vigor}
                        max={8}
                        min={1}
                        onChange={(v) => handleAtributoChange('vigor', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                  </div>

                  {/* SOCIAIS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444] border-b border-[#3b181b] pb-1">
                      Sociais
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Carisma</span>
                      <Bolinhas
                        valor={ficha.atributos.carisma}
                        max={8}
                        min={1}
                        onChange={(v) => handleAtributoChange('carisma', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Manipulação</span>
                      <Bolinhas
                        valor={ficha.atributos.manipulacao}
                        max={8}
                        min={1}
                        onChange={(v) => handleAtributoChange('manipulacao', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Aparência</span>
                      <Bolinhas
                        valor={ficha.atributos.aparencia}
                        max={8}
                        min={0}
                        onChange={(v) => handleAtributoChange('aparencia', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                  </div>

                  {/* MENTAIS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444] border-b border-[#3b181b] pb-1">
                      Mentais
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Percepção</span>
                      <Bolinhas
                        valor={ficha.atributos.percepcao}
                        max={8}
                        min={1}
                        onChange={(v) => handleAtributoChange('percepcao', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Inteligência</span>
                      <Bolinhas
                        valor={ficha.atributos.inteligencia}
                        max={8}
                        min={1}
                        onChange={(v) => handleAtributoChange('inteligencia', v)}
                        readonly={!podeEditar}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Raciocínio</span>
                      <Bolinhas
                        valor={ficha.atributos.raciocinio}
                        max={8}
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
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 mb-4">
                  <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Habilidades (Escala 0 a 8)
                  </h3>
                  <span className="text-[11px] text-[#8e8273]">
                    Talentos • Perícias • Conhecimentos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* TALENTOS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-2">
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444] border-b border-[#3b181b] pb-1 mb-2">
                      Talentos
                    </h4>
                    {(
                      [
                        ['prontidao', 'Prontidão'],
                        ['esportes', 'Esportes'],
                        ['briga', 'Briga'],
                        ['esquiva', 'Esquiva'],
                        ['empatia', 'Empatia'],
                        ['expressao', 'Expressão'],
                        ['intimidacao', 'Intimidação'],
                        ['lideranca', 'Liderança'],
                        ['ladinagem', 'Ladinagem'],
                        ['manha', 'Manha'],
                      ] as const
                    ).map(([chave, label]) => (
                      <div key={chave} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-[#ded6cb]">{label}</span>
                        <Bolinhas
                          valor={ficha.habilidades[chave]}
                          max={8}
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
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444] border-b border-[#3b181b] pb-1 mb-2">
                      Perícias
                    </h4>
                    {(
                      [
                        ['empatiaAnimais', 'Empatia c/ Animais'],
                        ['tiroComArco', 'Tiro c/ Arco'],
                        ['artesanato', 'Artesanato'],
                        ['cavalaria', 'Cavalaria'],
                        ['etiqueta', 'Etiqueta'],
                        ['herbalismo', 'Herbalismo'],
                        ['armasBrancas', 'Armas Brancas'],
                        ['musica', 'Música'],
                        ['sobrevivencia', 'Sobrevivência'],
                      ] as const
                    ).map(([chave, label]) => (
                      <div key={chave} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-[#ded6cb]">{label}</span>
                        <Bolinhas
                          valor={ficha.habilidades[chave]}
                          max={8}
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
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444] border-b border-[#3b181b] pb-1 mb-2">
                      Conhecimentos
                    </h4>
                    {(
                      [
                        ['academicos', 'Acadêmicos'],
                        ['sabedoriaPopular', 'Sabedoria Popular'],
                        ['investigacao', 'Investigação'],
                        ['direito', 'Direito'],
                        ['linguistica', 'Linguística'],
                        ['medicina', 'Medicina'],
                        ['ocultismo', 'Ocultismo'],
                        ['politica', 'Política'],
                        ['senescencia', 'Senescência'],
                      ] as const
                    ).map(([chave, label]) => (
                      <div key={chave} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-[#ded6cb]">{label}</span>
                        <Bolinhas
                          valor={ficha.habilidades[chave]}
                          max={8}
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
                <div className="flex items-center justify-between border-b border-[#3b181b] pb-2 mb-4">
                  <h3 className="text-lg font-gothic font-bold text-[#d4af37] tracking-wider uppercase">
                    Vantagens
                  </h3>
                  <span className="text-[11px] text-[#8e8273]">
                    Disciplinas • Antecedentes • Virtudes
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* DISCIPLINAS */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Disciplinas
                      </h4>
                      {podeEditar && (
                        <button
                          type="button"
                          onClick={handleAdicionarDisciplina}
                          className="text-[11px] text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar
                        </button>
                      )}
                    </div>
                    {ficha.disciplinas.length === 0 ? (
                      <p className="text-xs text-[#706456] italic">Nenhuma disciplina registrada.</p>
                    ) : (
                      <div className="space-y-2">
                        {ficha.disciplinas.map((disc) => (
                          <div key={disc.id} className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <InlineField
                                value={disc.nome}
                                onChange={(val) => handleEditarDisciplina(disc.id, 'nome', val)}
                                readonly={!podeEditar}
                                placeholder="Nome da Disciplina"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Bolinhas
                                valor={disc.nivel}
                                max={8}
                                min={1}
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
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ANTECEDENTES */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#3b181b] pb-1">
                      <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444]">
                        Antecedentes
                      </h4>
                      {podeEditar && (
                        <button
                          type="button"
                          onClick={handleAdicionarAntecedente}
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
                        {ficha.antecedentes.map((ant) => (
                          <div key={ant.id} className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <InlineField
                                value={ant.nome}
                                onChange={(val) => handleEditarAntecedente(ant.id, 'nome', val)}
                                readonly={!podeEditar}
                                placeholder="Nome do Antecedente"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Bolinhas
                                valor={ant.nivel}
                                max={8}
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
                        ))}
                      </div>
                    )}
                  </div>

                  {/* VIRTUDES */}
                  <div className="bg-[#140e11] p-4 rounded-sm border border-[#2d1217] space-y-4">
                    <h4 className="text-xs font-gothic font-bold uppercase tracking-wider text-[#ef4444] border-b border-[#3b181b] pb-1">
                      Virtudes
                    </h4>

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
                          onChange={(v) =>
                            updateFicha((prev) => ({
                              ...prev,
                              virtudes: { ...prev.virtudes, consciencia: v },
                            }))
                          }
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
                          onChange={(v) =>
                            updateFicha((prev) => ({
                              ...prev,
                              virtudes: { ...prev.virtudes, autocontrole: v },
                            }))
                          }
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
                        onChange={(v) =>
                          updateFicha((prev) => ({
                            ...prev,
                            virtudes: { ...prev.virtudes, coragem: v },
                          }))
                        }
                        readonly={!podeEditar}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STATUS ATUAIS & VITALIDADE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* STATUS ATUAIS (Caminho, Força de Vontade, Sangue, Fraqueza) */}
                <div className="bg-[#140e11] p-5 rounded-sm border border-[#2d1217] space-y-5">
                  <h3 className="text-md font-gothic font-bold text-[#d4af37] tracking-wider uppercase border-b border-[#3b181b] pb-2">
                    Status Atuais & Pontos
                  </h3>

                  {/* Caminho / Humanidade */}
                  <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <InlineField
                        label="Caminho / Iluminação"
                        value={ficha.caminho}
                        onChange={(val) => handleHeaderChange('caminho', val)}
                        placeholder="Ex: Humanidade, Caminho dos Reis"
                        readonly={!podeEditar}
                        className="flex-1"
                      />
                      <div className="pt-2">
                        <Bolinhas
                          valor={ficha.caminhoNivel}
                          max={10}
                          min={1}
                          cor="ouro"
                          onChange={(v) =>
                            updateFicha((prev) => ({ ...prev, caminhoNivel: v }))
                          }
                          readonly={!podeEditar}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Força de Vontade */}
                  <div className="space-y-2 border-t border-[#251419] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-gothic font-bold uppercase tracking-wider text-[#a89f91]">
                        Força de Vontade (Permanente)
                      </span>
                      <Bolinhas
                        valor={ficha.forcaDeVontade}
                        max={10}
                        min={1}
                        cor="ouro"
                        onChange={(v) =>
                          updateFicha((prev) => ({ ...prev, forcaDeVontade: v }))
                        }
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
                          max={50}
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
                      Trilhas Taumatúrgicas (1 a 8 Pontos)
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
                              max={8}
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

            <div className="flex items-center gap-3">
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
    </div>
  );
};
