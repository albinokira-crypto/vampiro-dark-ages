import React, { useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { storageService } from '../services/storage';
import { Skull, KeyRound, Mail, UserPlus, LogIn, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface TelaLoginProps {
  onLoginSucesso: (user: User) => void;
}

export const TelaLogin: React.FC<TelaLoginProps> = ({ onLoginSucesso }) => {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<UserRole>('jogador');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [temConvite, setTemConvite] = useState<boolean>(false);

  useEffect(() => {
    // Detectar link de convite na URL (?convite=...)
    const params = new URLSearchParams(window.location.search);
    if (params.get('convite')) {
      setTemConvite(true);
      setModo('cadastro');
      setRole('jogador');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      if (modo === 'login') {
        const user = await storageService.login(email, senha);
        onLoginSucesso(user);
      } else {
        if (!nome.trim()) {
          setErro('Por favor, informe seu nome.');
          setCarregando(false);
          return;
        }
        const novo = await storageService.cadastrar(nome, email, senha, role);
        onLoginSucesso(novo);
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

  const handleEntradaRapida = async (emailPredefinido: string) => {
    setErro(null);
    setCarregando(true);
    try {
      const user = await storageService.login(emailPredefinido, '123');
      onLoginSucesso(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Não foi possível entrar com a conta demo.');
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

      <div className="w-full max-w-md bg-[#100b0e] border border-[#3b181b] rounded-sm shadow-2xl p-6 sm:p-8 relative z-10 space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1e1014] border border-[#8b0000] text-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.35)] mb-1">
            <Skull className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-gothic font-black text-[#d4af37] tracking-wider">
            Vampiro: A Idade das Trevas
          </h1>
          <p className="text-xs text-[#a89f91] font-serif">
            Portal da Crônica • Sincronizado em Nuvem (Cloudflare D1)
          </p>
        </div>

        {/* Banner de Link de Convite Detectado */}
        {temConvite && (
          <div className="bg-[#241318] border border-[#8b0000] p-3 rounded-xs text-xs text-[#fca5a5] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ef4444] shrink-0" />
            <span>
              <strong>Convite de Mesa Ativo:</strong> Crie seu cadastro abaixo para ingressar diretamente na crônica!
            </span>
          </div>
        )}

        {/* Alternador de Modo: Entrar vs Cadastrar */}
        <div className="grid grid-cols-2 bg-[#181115] p-1 rounded-xs border border-[#2d1217]">
          <button
            type="button"
            onClick={() => {
              setModo('login');
              setErro(null);
            }}
            className={`py-2 text-xs font-gothic uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
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
            }}
            className={`py-2 text-xs font-gothic uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              modo === 'cadastro'
                ? 'bg-[#8b0000] text-white font-bold shadow-xs'
                : 'text-[#a89f91] hover:text-[#ded6cb]'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="p-3 bg-[#2b0f14] border border-[#ef4444] rounded-xs text-xs text-[#fca5a5] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === 'cadastro' && (
            <>
              <div>
                <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                  Nome do Jogador / Mestre
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Albino ou Julian de Troyes"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                  />
                  <UserPlus className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                  Tipo de Conta na Mesa
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('jogador')}
                    className={`p-2.5 rounded-xs border text-xs font-gothic uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      role === 'jogador'
                        ? 'bg-[#2b1016] border-[#ef4444] text-[#ef4444] font-bold shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                        : 'bg-[#181115] border-[#3b181b] text-[#a89f91] hover:text-white'
                    }`}
                  >
                    <span className="text-sm">🗡️</span>
                    <span>Jogador</span>
                    <span className="text-[9px] text-[#706456] normal-case">Cria e gerencia seus Cainitas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('mestre')}
                    className={`p-2.5 rounded-xs border text-xs font-gothic uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      role === 'mestre'
                        ? 'bg-[#2b1016] border-[#d4af37] text-[#d4af37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                        : 'bg-[#181115] border-[#3b181b] text-[#a89f91] hover:text-white'
                    }`}
                  >
                    <span className="text-sm">👑</span>
                    <span>Mestre (Narrador)</span>
                    <span className="text-[9px] text-[#706456] normal-case">Configura mesa e vê todas as fichas</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="seu.email@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2.5 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
              />
              <Mail className="w-4 h-4 text-[#706456] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
              Senha
            </label>
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

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3 bg-[#8b0000] hover:bg-[#a30d12] disabled:opacity-50 text-white font-gothic font-bold text-xs tracking-wider uppercase rounded-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            {carregando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sincronizando com a Nuvem...</span>
              </>
            ) : modo === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Adentrar a Noite</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Criar Conta de {role === 'mestre' ? 'Mestre' : 'Jogador'}</span>
              </>
            )}
          </button>
        </form>

        {/* Atalhos de Demonstração / Acesso Rápido */}
        <div className="border-t border-[#251419] pt-4 space-y-2">
          <span className="text-[10px] font-gothic uppercase tracking-wider text-[#706456] block text-center">
            Acesso Rápido em Nuvem (D1)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={carregando}
              onClick={() => handleEntradaRapida('mestre@darkages.com')}
              className="px-2 py-2 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[11px] text-[#d4af37] font-semibold text-center cursor-pointer transition-colors"
            >
              👑 Mestre Alucard
            </button>
            <button
              type="button"
              disabled={carregando}
              onClick={() => handleEntradaRapida('jogador@darkages.com')}
              className="px-2 py-2 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[11px] text-[#a89f91] font-semibold text-center cursor-pointer transition-colors"
            >
              🗡️ Julian (Jogador)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
