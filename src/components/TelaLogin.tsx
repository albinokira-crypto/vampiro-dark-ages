import React, { useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { storageService } from '../services/storage';
import {
  Skull,
  KeyRound,
  UserPlus,
  LogIn,
  Sparkles,
  AlertCircle,
  Loader2,
  HelpCircle,
  Search,
  CheckCircle,
  ArrowLeft,
  AtSign,
} from 'lucide-react';

interface TelaLoginProps {
  onLoginSucesso: (user: User) => void;
}

export const TelaLogin: React.FC<TelaLoginProps> = ({ onLoginSucesso }) => {
  const [modo, setModo] = useState<'login' | 'cadastro' | 'recuperar' | 'buscar_login'>('login');
  const [nome, setNome] = useState('');
  const [nick, setNick] = useState('');
  const [senha, setSenha] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [role, setRole] = useState<UserRole>('jogador');
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [temConvite, setTemConvite] = useState<boolean>(false);
  const [statusMestre, setStatusMestre] = useState<{
    temMestre: boolean;
    mestreNome?: string;
    mestreNick?: string;
  }>({ temMestre: false });
  const [contasEncontradas, setContasEncontradas] = useState<
    Array<{ nome: string; nick: string; email?: string; role: string }>
  >([]);

  useEffect(() => {
    // Detectar link de convite na URL (?convite=...)
    const params = new URLSearchParams(window.location.search);
    if (params.get('convite')) {
      setTemConvite(true);
      setModo('cadastro');
      setRole('jogador');
    }

    // Verificar se já existe Mestre no sistema
    storageService.checarStatusMestre().then((status) => {
      setStatusMestre(status);
      if (status.temMestre) {
        setRole('jogador');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setCarregando(true);

    try {
      if (modo === 'login') {
        if (!nick.trim()) {
          setErro('Por favor, informe seu Nick de acesso.');
          setCarregando(false);
          return;
        }
        const user = await storageService.login(nick, senha);
        onLoginSucesso(user);
      } else if (modo === 'cadastro') {
        if (!nome.trim()) {
          setErro('Por favor, informe seu nome real ou de personagem.');
          setCarregando(false);
          return;
        }
        if (!nick.trim() || nick.trim().length < 2) {
          setErro('Seu Nick deve conter no mínimo 2 letras (sem espaços).');
          setCarregando(false);
          return;
        }
        const novo = await storageService.cadastrar(nome, nick, senha, role);
        onLoginSucesso(novo);
      } else if (modo === 'recuperar') {
        if (!nick.trim() || !novaSenha.trim()) {
          setErro('Preencha seu Nick e a nova senha desejada.');
          setCarregando(false);
          return;
        }
        if (novaSenha !== confirmarNovaSenha) {
          setErro('As senhas digitadas não coincidem.');
          setCarregando(false);
          return;
        }
        const msg = await storageService.recuperarSenha(nick, novaSenha);
        setSucesso(msg);
        // Tenta fazer login imediatamente com a nova senha
        setTimeout(async () => {
          try {
            const user = await storageService.login(nick, novaSenha);
            onLoginSucesso(user);
          } catch {
            setModo('login');
          }
        }, 1200);
      } else if (modo === 'buscar_login') {
        if (!nome.trim() || nome.trim().length < 2) {
          setErro('Digite pelo menos 2 caracteres do seu nome para localizar seu Nick.');
          setCarregando(false);
          return;
        }
        const resultados = await storageService.buscarLogin(nome);
        setContasEncontradas(resultados);
        if (resultados.length === 0) {
          setErro(`Nenhum Nick cadastrado encontrado com o nome "${nome}".`);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Ocorreu um erro ao processar. Verifique sua conexão.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleEntradaRapida = async (nickPredefinido: string) => {
    setErro(null);
    setSucesso(null);
    setCarregando(true);
    try {
      const user = await storageService.login(nickPredefinido, '123');
      onLoginSucesso(user);
    } catch {
      // Se tiver outra senha (ex: Diego)
      try {
        const user = await storageService.login(nickPredefinido, 'Irons365.');
        onLoginSucesso(user);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErro(err.message);
        } else {
          setErro('Não foi possível entrar com a conta demo.');
        }
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070506] flex items-center justify-center p-4 relative overflow-hidden font-body text-[#ded6cb]">
      {/* Luz ambiente de sangue no fundo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8b0000]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#100b0e] border border-[#3b181b] rounded-sm shadow-2xl p-5 sm:p-8 relative z-10 space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1e1014] border border-[#8b0000] text-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.35)] mb-1">
            <Skull className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-gothic font-black text-[#d4af37] tracking-wider">
            Vampiro: A Idade das Trevas
          </h1>
          <p className="text-xs text-[#a89f91] font-serif">
            Portal da Crônica • Acesso Rápido por Nick
          </p>
        </div>

        {/* Banner de Link de Convite Detectado */}
        {temConvite && (
          <div className="bg-[#241318] border border-[#8b0000] p-3 rounded-xs text-xs text-[#fca5a5] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ef4444] shrink-0" />
            <span>
              <strong>Convite de Mesa Ativo:</strong> Escolha seu Nick abaixo para ingressar diretamente na crônica!
            </span>
          </div>
        )}

        {/* Alternador de Modo: Entrar vs Cadastrar (Quando não em recuperação) */}
        {(modo === 'login' || modo === 'cadastro') && (
          <div className="grid grid-cols-2 bg-[#181115] p-1 rounded-xs border border-[#2d1217]">
            <button
              type="button"
              onClick={() => {
                setModo('login');
                setErro(null);
                setSucesso(null);
              }}
              className={`py-2 text-xs font-gothic uppercase tracking-wider rounded-xs transition-colors cursor-pointer touch-manipulation ${
                modo === 'login'
                  ? 'bg-[#8b0000] text-white font-bold shadow-xs'
                  : 'text-[#a89f91] hover:text-[#ded6cb]'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setModo('cadastro');
                setErro(null);
                setSucesso(null);
              }}
              className={`py-2 text-xs font-gothic uppercase tracking-wider rounded-xs transition-colors cursor-pointer touch-manipulation ${
                modo === 'cadastro'
                  ? 'bg-[#8b0000] text-white font-bold shadow-xs'
                  : 'text-[#a89f91] hover:text-[#ded6cb]'
              }`}
            >
              Cadastrar
            </button>
          </div>
        )}

        {/* Cabeçalho de Modos de Recuperação */}
        {modo === 'recuperar' && (
          <div className="flex items-center justify-between border-b border-[#2d1217] pb-3">
            <div>
              <h2 className="text-sm font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                Recuperação de Senha
              </h2>
              <p className="text-[11px] text-[#a89f91]">
                Informe o seu Nick para redefinir sua senha.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setModo('login');
                setErro(null);
                setSucesso(null);
              }}
              className="text-xs text-[#a89f91] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar
            </button>
          </div>
        )}

        {modo === 'buscar_login' && (
          <div className="flex items-center justify-between border-b border-[#2d1217] pb-3">
            <div>
              <h2 className="text-sm font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                Descobrir Meu Nick
              </h2>
              <p className="text-[11px] text-[#a89f91]">
                Localize seu Nick pelo seu nome de jogador.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setModo('login');
                setErro(null);
                setSucesso(null);
              }}
              className="text-xs text-[#a89f91] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar
            </button>
          </div>
        )}

        {/* Mensagem de Erro */}
        {erro && (
          <div className="p-3 bg-[#2b0f14] border border-[#ef4444] rounded-xs text-xs text-[#fca5a5] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Mensagem de Sucesso */}
        {sucesso && (
          <div className="p-3 bg-[#0d2818] border border-green-600 rounded-xs text-xs text-green-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            <span>{sucesso}</span>
          </div>
        )}

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* MODO CADASTRO */}
          {modo === 'cadastro' && (
            <>
              <div>
                <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                  Nome Completo ou do Personagem
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Diego Albino ou Sir Julian"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                  />
                  <UserPlus className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                  Seu Nick de Acesso (Único, sem espaços)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: diego, alucard, kira..."
                    value={nick}
                    onChange={(e) => setNick(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-[#d4af37] font-mono font-bold placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                  />
                  <AtSign className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
                </div>
                <span className="text-[10px] text-[#706456] mt-0.5 block">
                  Você usará este Nick para entrar em qualquer celular ou computador.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                  Tipo de Conta na Mesa
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('jogador')}
                    className={`p-2.5 rounded-xs border text-xs font-gothic uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer transition-all touch-manipulation ${
                      role === 'jogador'
                        ? 'bg-[#2b1016] border-[#ef4444] text-[#ef4444] font-bold shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                        : 'bg-[#181115] border-[#3b181b] text-[#a89f91] hover:text-white'
                    }`}
                  >
                    <span className="text-sm">🗡️</span>
                    <span>Jogador</span>
                    <span className="text-[9px] text-[#706456] normal-case">Cria e joga com Cainitas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (statusMestre.temMestre) {
                        setErro(
                          `A Crônica já possui um Mestre ativo (${statusMestre.mestreNome || ''} @${statusMestre.mestreNick || ''}). Só pode haver 1 único login de Mestre no sistema. Novos membros devem entrar como Jogador.`
                        );
                        setRole('jogador');
                        return;
                      }
                      setRole('mestre');
                    }}
                    className={`p-2.5 rounded-xs border text-xs font-gothic uppercase tracking-wider flex flex-col items-center gap-1 transition-all touch-manipulation ${
                      statusMestre.temMestre
                        ? 'bg-[#140e11] border-[#251419] text-[#706456] opacity-60 cursor-not-allowed'
                        : role === 'mestre'
                        ? 'bg-[#2b1016] border-[#d4af37] text-[#d4af37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.25)] cursor-pointer'
                        : 'bg-[#181115] border-[#3b181b] text-[#a89f91] hover:text-white cursor-pointer'
                    }`}
                  >
                    <span className="text-sm">{statusMestre.temMestre ? '🔒' : '👑'}</span>
                    <span>Mestre (Narrador)</span>
                    <span className="text-[9px] text-[#706456] normal-case text-center">
                      {statusMestre.temMestre
                        ? 'Vaga ocupada (1 Mestre permitido)'
                        : 'Auditoria e controle da mesa'}
                    </span>
                  </button>
                </div>
                {statusMestre.temMestre && (
                  <span className="text-[10px] text-[#8e8273] italic mt-1 block">
                    * A Crônica já possui um Mestre ativo. O cargo só pode ser transferido pelo próprio Mestre.
                  </span>
                )}
              </div>
            </>
          )}

          {/* MODO BUSCAR NICK ESQUECIDO */}
          {modo === 'buscar_login' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                  Seu Nome ou Nome do Personagem
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Digite parte do seu nome..."
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                  />
                  <Search className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
                </div>
              </div>

              {contasEncontradas.length > 0 && (
                <div className="space-y-2 bg-[#160f13] p-3 rounded-xs border border-[#3b181b]">
                  <span className="text-[10px] font-gothic uppercase tracking-wider text-[#d4af37] block font-bold">
                    Nicks Encontrados:
                  </span>
                  {contasEncontradas.map((conta, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setNick(conta.nick);
                        setModo('login');
                      }}
                      className="p-2.5 bg-[#1e1317] hover:bg-[#2e1c22] border border-[#522228] rounded-xs cursor-pointer text-xs flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-white block">{conta.nome}</strong>
                        <span className="text-xs text-[#d4af37] font-mono font-bold">
                          Nick: @{conta.nick}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#a89f91] bg-[#120d10] px-2 py-0.5 rounded">
                        {conta.role === 'mestre' ? '👑 Mestre' : '🗡️ Jogador'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CAMPO NICK (Login ou Recuperação) */}
          {(modo === 'login' || modo === 'recuperar') && (
            <div>
              <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                Seu Nick de Acesso
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: diego, alucard, julian..."
                  value={nick}
                  onChange={(e) => setNick(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-[#d4af37] font-mono font-bold placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                />
                <AtSign className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* SENHA (Usado em login e cadastro) */}
          {(modo === 'login' || modo === 'cadastro') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91]">
                  Senha
                </label>
                {modo === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setModo('recuperar');
                      setErro(null);
                      setSucesso(null);
                    }}
                    className="text-[10px] text-[#ef4444] hover:text-white cursor-pointer transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                />
                <KeyRound className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* CAMPOS DE NOVA SENHA (Modo Recuperação) */}
          {modo === 'recuperar' && (
            <>
              <div>
                <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Digite a nova senha..."
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                  />
                  <KeyRound className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Repita a nova senha..."
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                  />
                  <KeyRound className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setModo('buscar_login');
                    setErro(null);
                    setSucesso(null);
                  }}
                  className="text-[10px] text-[#d4af37] hover:underline cursor-pointer"
                >
                  Esqueceu seu Nick? Localizar pelo seu nome
                </button>
              </div>
            </>
          )}

          {/* Botão de Submissão */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3 bg-[#8b0000] hover:bg-[#a30d12] disabled:opacity-50 text-white font-gothic font-bold text-xs tracking-wider uppercase rounded-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            {carregando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : modo === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Adentrar a Noite</span>
              </>
            ) : modo === 'cadastro' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Criar Conta de {role === 'mestre' ? 'Mestre' : 'Jogador'}</span>
              </>
            ) : modo === 'recuperar' ? (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Salvar Nova Senha & Entrar</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Pesquisar Meu Nick</span>
              </>
            )}
          </button>
        </form>

        {/* Atalhos de Demonstração / Acesso Rápido */}
        <div className="border-t border-[#251419] pt-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-gothic uppercase tracking-wider text-[#706456]">
            <span>Acesso Rápido por Nick</span>
            {modo === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setModo('buscar_login');
                  setErro(null);
                  setSucesso(null);
                }}
                className="text-[#a89f91] hover:text-[#d4af37] flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Localizar Nick</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              disabled={carregando}
              onClick={() => handleEntradaRapida('diego')}
              className="px-2 py-2 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[11px] text-[#d4af37] font-semibold text-center cursor-pointer transition-colors"
            >
              👑 @diego
            </button>
            <button
              type="button"
              disabled={carregando}
              onClick={() => handleEntradaRapida('alucard')}
              className="px-2 py-2 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[11px] text-[#ded6cb] font-semibold text-center cursor-pointer transition-colors"
            >
              👑 @alucard
            </button>
            <button
              type="button"
              disabled={carregando}
              onClick={() => handleEntradaRapida('julian')}
              className="px-2 py-2 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[11px] text-[#a89f91] font-semibold text-center cursor-pointer transition-colors"
            >
              🗡️ @julian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
