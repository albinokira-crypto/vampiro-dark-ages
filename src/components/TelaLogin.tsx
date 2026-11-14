import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { storageService } from '../services/storage';
import { Skull, KeyRound, Mail, UserPlus, LogIn, Sparkles, AlertCircle } from 'lucide-react';

interface TelaLoginProps {
  onLoginSucesso: (user: User) => void;
}

export const TelaLogin: React.FC<TelaLoginProps> = ({ onLoginSucesso }) => {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [temConvite, setTemConvite] = useState<boolean>(false);

  useEffect(() => {
    // Detectar link de convite na URL (?convite=...)
    const params = new URLSearchParams(window.location.search);
    if (params.get('convite')) {
      setTemConvite(true);
      setModo('cadastro');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (modo === 'login') {
      const user = storageService.login(email, senha);
      if (user) {
        onLoginSucesso(user);
      } else {
        setErro('Credenciais inválidas. Verifique o e-mail ou a senha informada.');
      }
    } else {
      if (!nome.trim()) {
        setErro('Por favor, informe seu nome de jogador.');
        return;
      }
      try {
        const novo = storageService.cadastrar(nome, email, senha);
        onLoginSucesso(novo);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErro(err.message);
        } else {
          setErro('Falha ao registrar novo jogador.');
        }
      }
    }
  };

  const handleEntradaRapida = (emailPredefinido: string) => {
    const user = storageService.login(emailPredefinido, '123');
    if (user) {
      onLoginSucesso(user);
    }
  };

  return (
    <div className="min-h-screen bg-[#070506] flex items-center justify-center p-4 relative overflow-hidden font-body text-[#ded6cb]">
      {/* Luz ambiente de sangue no fundo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8b0000]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#100b0e] border border-[#3b181b] rounded-sm shadow-2xl p-6 sm:p-8 relative z-10 space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1e1014] border border-[#8b0000] text-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.3)] mb-1">
            <Skull className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-gothic font-black text-[#d4af37] tracking-wider">
            Vampiro: A Idade das Trevas
          </h1>
          <p className="text-xs text-[#a89f91] font-serif">
            Portal da Crônica • Fichas & Grimório
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

        {/* Abas Alternar Login / Cadastro */}
        <div className="grid grid-cols-2 gap-1 bg-[#160d11] p-1 rounded-sm border border-[#3b181b]">
          <button
            type="button"
            onClick={() => {
              setModo('login');
              setErro(null);
            }}
            className={`py-2 text-xs font-gothic font-bold tracking-wider uppercase transition-all rounded-xs cursor-pointer ${
              modo === 'login'
                ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'text-[#8e8273] hover:text-white'
            }`}
          >
            Entrar na Mesa
          </button>
          <button
            type="button"
            onClick={() => {
              setModo('cadastro');
              setErro(null);
            }}
            className={`py-2 text-xs font-gothic font-bold tracking-wider uppercase transition-all rounded-xs cursor-pointer ${
              modo === 'cadastro'
                ? 'bg-[#8b0000] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'text-[#8e8273] hover:text-white'
            }`}
          >
            Novo Jogador
          </button>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-950/60 border border-red-800 text-red-200 px-3 py-2 rounded-xs text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === 'cadastro' && (
            <div>
              <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
                Nome do Jogador
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Seu nome real ou alcunha"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-gothic font-bold uppercase tracking-wider text-[#a89f91] mb-1">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
              />
              <Mail className="w-4 h-4 text-[#706456] absolute left-3 top-2.5" />
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
                className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2 pl-9 text-xs text-white placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
              />
              <KeyRound className="w-4 h-4 text-[#706456] absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#8b0000] hover:bg-[#a30d12] text-white font-gothic font-bold text-xs tracking-wider uppercase rounded-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {modo === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Adentrar a Noite</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Registrar Jogador</span>
              </>
            )}
          </button>
        </form>

        {/* Atalhos de Demonstração / Acesso Rápido */}
        <div className="border-t border-[#251419] pt-4 space-y-2">
          <span className="text-[10px] font-gothic uppercase tracking-wider text-[#706456] block text-center">
            Acesso Rápido para Testes
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleEntradaRapida('mestre@darkages.com')}
              className="px-2 py-1.5 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[11px] text-[#d4af37] font-semibold text-center cursor-pointer transition-colors"
            >
              👑 Mestre da Mesa
            </button>
            <button
              type="button"
              onClick={() => handleEntradaRapida('eleonore@darkages.com')}
              className="px-2 py-1.5 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[11px] text-[#a89f91] font-semibold text-center cursor-pointer transition-colors"
            >
              🗡️ Lady Eléonore (Jogadora)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
