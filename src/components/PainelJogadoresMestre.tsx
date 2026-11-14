import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import {
  KeyRound,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Trash2,
  AtSign,
} from 'lucide-react';

interface UsuarioRemoto {
  id: string;
  nome: string;
  nick: string;
  email?: string;
  role: string;
  criadoEm: string;
}

export const PainelJogadoresMestre: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioRemoto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState('');
  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioRemoto | null>(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      const res = await fetch('/api/usuarios');
      if (res.ok) {
        const dados = await res.json();
        setUsuarios(dados);
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleSalvarNovaSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioEditando || !novaSenha.trim()) return;

    setErro(null);
    setMensagemSucesso(null);
    try {
      const msg = await storageService.recuperarSenha(usuarioEditando.nick, novaSenha.trim());
      setMensagemSucesso(msg || `Senha de "${usuarioEditando.nome}" alterada com sucesso!`);
      setUsuarioEditando(null);
      setNovaSenha('');
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Falha ao redefinir senha.');
      }
    }
  };

  const handleExcluirUsuario = async (u: UsuarioRemoto) => {
    if (
      confirm(
        `ATENÇÃO MESTRE:\nDeseja realmente EXCLUIR o cadastro do jogador "${u.nome}" (@${u.nick})?\n\nTodas as fichas pertencentes a este jogador também serão apagadas da crônica.`
      )
    ) {
      setErro(null);
      setMensagemSucesso(null);
      const sucesso = await storageService.excluirUsuario(u.id);
      if (sucesso) {
        setUsuarios((prev) => prev.filter((item) => item.id !== u.id));
        setMensagemSucesso(`Cadastro de @${u.nick} excluído com sucesso!`);
        setTimeout(() => setMensagemSucesso(null), 4000);
      } else {
        setErro('Falha ao excluir usuário do banco de dados.');
      }
    }
  };

  const filtrados = usuarios.filter((u) => {
    const termo = busca.toLowerCase();
    return (
      u.nome.toLowerCase().includes(termo) ||
      (u.nick && u.nick.toLowerCase().includes(termo)) ||
      (u.email && u.email.toLowerCase().includes(termo)) ||
      u.role.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#130d10] p-4 rounded-xs border border-[#3b181b]">
        <div>
          <h3 className="text-sm font-gothic font-bold uppercase tracking-wider text-[#d4af37]">
            Jogadores Cadastrados na Crônica
          </h3>
          <p className="text-[11px] text-[#a89f91] mt-0.5">
            Gerencie os Nicks de acesso, redefina senhas ou exclua cadastros da crônica.
          </p>
        </div>

        <button
          type="button"
          onClick={carregarUsuarios}
          disabled={carregando}
          className="px-3 py-1.5 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] text-xs font-semibold text-[#ded6cb] rounded-xs flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${carregando ? 'animate-spin' : ''}`} />
          <span>Recarregar Lista</span>
        </button>
      </div>

      {mensagemSucesso && (
        <div className="p-3 bg-[#0d2818] border border-green-600 rounded-xs text-xs text-green-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {erro && (
        <div className="p-3 bg-[#2b0f14] border border-[#ef4444] rounded-xs text-xs text-[#fca5a5] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Barra de Busca */}
      <div className="relative">
        <input
          type="search"
          placeholder="Buscar jogador por nome ou Nick..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-[#181115] border border-[#3b181b] rounded-xs pl-9 pr-3 py-2 text-xs text-[#ded6cb] placeholder-[#706456] focus:outline-none focus:border-[#8b0000]"
        />
        <Search className="w-4 h-4 text-[#706456] absolute left-3 top-2.5" />
      </div>

      {/* Grid de Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtrados.map((u) => (
          <div
            key={u.id}
            className="bg-[#120d10] border border-[#251419] rounded-xs p-3.5 flex items-center justify-between gap-3 shadow-md"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#1e1317] border border-[#3b181b] flex items-center justify-center text-lg shrink-0">
                {u.role === 'mestre' ? '👑' : '🗡️'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-gothic font-bold text-white truncate">{u.nome}</h4>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                      u.role === 'mestre'
                        ? 'bg-amber-950/60 text-[#d4af37] border border-amber-800'
                        : 'bg-red-950/60 text-[#ef4444] border border-[#8b0000]'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>

                <p className="text-xs text-[#d4af37] font-mono font-bold flex items-center gap-1 mt-0.5">
                  <AtSign className="w-3 h-3 text-[#706456]" />
                  <span>{u.nick || u.nome.toLowerCase().replace(/\s+/g, '')}</span>
                </p>

                <p className="text-[10px] text-[#706456] mt-0.5">
                  Criado em {new Date(u.criadoEm).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Ações: Redefinir Senha e Excluir Cadastro */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setUsuarioEditando(u);
                  setNovaSenha('');
                  setErro(null);
                }}
                title="Redefinir Senha"
                className="px-2.5 py-1.5 bg-[#1e1317] hover:bg-[#8b0000] text-[#a89f91] hover:text-white border border-[#3b181b] hover:border-[#8b0000] rounded-xs text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors touch-manipulation"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Senha</span>
              </button>

              <button
                type="button"
                onClick={() => handleExcluirUsuario(u)}
                title="Excluir Cadastro Permanentemente"
                className="p-1.5 bg-[#1e1317] hover:bg-red-900/60 text-[#706456] hover:text-[#ef4444] border border-[#3b181b] hover:border-[#8b0000] rounded-xs cursor-pointer transition-colors touch-manipulation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Redefinição de Senha */}
      {usuarioEditando && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#120d10] border border-[#8b0000] rounded-sm max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2d1217] pb-3">
              <h4 className="text-sm font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                Redefinir Senha de Jogador
              </h4>
              <button
                type="button"
                onClick={() => setUsuarioEditando(null)}
                className="text-[#a89f91] hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#ded6cb]">
              Defina a nova senha para o Nick{' '}
              <strong className="text-[#d4af37]">@{usuarioEditando.nick}</strong> (
              {usuarioEditando.nome}):
            </p>

            <form onSubmit={handleSalvarNovaSenha} className="space-y-3">
              <div>
                <label className="block text-[11px] font-gothic uppercase text-[#a89f91] mb-1 font-semibold">
                  Nova Senha
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 123 ou novaSenha@2026"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full bg-[#181115] border border-[#3b181b] rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b0000]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#251419]">
                <button
                  type="button"
                  onClick={() => setUsuarioEditando(null)}
                  className="px-3 py-1.5 bg-[#181115] text-[#a89f91] hover:text-white rounded-xs text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white font-gothic font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                >
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
