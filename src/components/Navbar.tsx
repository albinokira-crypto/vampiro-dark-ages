import React, { useState } from 'react';
import type { User } from '../types';
import { storageService } from '../services/storage';
import {
  Skull,
  Settings,
  Share2,
  Download,
  Upload,
  LogOut,
  Check,
} from 'lucide-react';
import { InstaladorPWA } from './InstaladorPWA';

interface NavbarProps {
  usuarioAtual: User;
  onTrocarUsuario: (novoUsuario: User) => void;
  onVoltarDashboard?: () => void;
  onAbrirConfigMestre?: () => void;
  onLogout?: () => void;
  emFicha?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  usuarioAtual,
  onTrocarUsuario,
  onVoltarDashboard,
  onAbrirConfigMestre,
  onLogout,
  emFicha = false,
}) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const usuarios = storageService.getUsuarios();

  const handleCopiarConvite = () => {
    const url = `${window.location.origin}${window.location.pathname}?convite=dark-ages`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleExportar = () => {
    const json = storageService.exportarBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vampiro-dark-ages-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const conteudo = ev.target?.result as string;
      if (storageService.importarBackup(conteudo)) {
        alert('Backup importado com sucesso!');
        window.location.reload();
      } else {
        alert('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f0c0e]/95 border-b border-[#3b181b] backdrop-blur-md shadow-lg px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo / Título */}
        <div className="flex items-center gap-3">
          {emFicha && onVoltarDashboard && (
            <button
              type="button"
              onClick={onVoltarDashboard}
              className="px-2.5 py-1 text-xs font-bold uppercase rounded-xs border border-[#3b181b] bg-[#1a1417] text-[#d4af37] hover:border-[#8b0000] hover:bg-[#2e1215] transition-colors cursor-pointer"
            >
              ← Painel
            </button>
          )}

          <div
            onClick={onVoltarDashboard}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-full bg-[#241014] border border-[#8b0000] flex items-center justify-center text-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform">
              <Skull className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-gothic font-black text-[#d4af37] tracking-wider leading-none">
                Vampiro
              </h1>
              <span className="text-[10px] uppercase font-gothic tracking-widest text-[#a89f91] block">
                A Idade das Trevas
              </span>
            </div>
          </div>
        </div>

        {/* Ações e Perfil do Usuário */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão de Instalar Atalho PWA */}
          <InstaladorPWA />

          {/* Botão de Copiar Link de Convite */}
          <button
            type="button"
            onClick={handleCopiarConvite}
            title="Copiar link de convite para novos jogadores"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1e1317] hover:bg-[#2e1c22] border border-[#522228] text-xs font-semibold text-[#ded6cb] rounded-xs cursor-pointer transition-colors"
          >
            {copiado ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="hidden sm:inline text-green-400">Link Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#ef4444]" />
                <span className="hidden sm:inline">Convidar Jogador</span>
              </>
            )}
          </button>

          {/* Configuração de Pontos (Mestre) */}
          {usuarioAtual.role === 'mestre' && onAbrirConfigMestre && (
            <button
              type="button"
              onClick={onAbrirConfigMestre}
              title="Configurar pontuação inicial da crônica"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#251016] hover:bg-[#3d1820] border border-[#8b0000] text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] rounded-xs cursor-pointer transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)]"
            >
              <Settings className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline">Pontuação Inicial</span>
            </button>
          )}

          {/* Backup */}
          <button
            type="button"
            onClick={handleExportar}
            title="Exportar todas as fichas para arquivo JSON"
            className="p-1.5 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[#a89f91] hover:text-[#d4af37] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <label
            title="Importar backup de fichas (JSON)"
            className="p-1.5 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-[#a89f91] hover:text-[#d4af37] transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleImportar}
              className="hidden"
            />
          </label>

          {/* Dropdown de Troca de Usuário / Perfil */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuAberto(!menuAberto)}
              className="flex items-center gap-2 px-3 py-1 bg-[#181115] hover:bg-[#251419] border border-[#3b181b] rounded-xs text-xs cursor-pointer transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  usuarioAtual.role === 'mestre' ? 'bg-[#d4af37]' : 'bg-[#ef4444]'
                }`}
              />
              <span className="font-semibold text-white max-w-[120px] truncate">
                {usuarioAtual.nome}
              </span>
              <span className="text-[10px] text-[#8e8273] uppercase hidden sm:inline">
                ({usuarioAtual.role === 'mestre' ? 'Mestre' : 'Jogador'})
              </span>
            </button>

            {menuAberto && (
              <div className="absolute right-0 mt-2 w-56 bg-[#120c10] border border-[#522228] rounded-xs shadow-2xl py-1 z-50">
                <div className="px-3 py-2 border-b border-[#251419]">
                  <p className="text-[11px] font-bold text-[#d4af37] truncate">
                    {usuarioAtual.nome}
                  </p>
                  <p className="text-[10px] text-[#a89f91] font-mono truncate">
                    @{usuarioAtual.nick || usuarioAtual.nome.toLowerCase().replace(/\s+/g, '')}
                  </p>
                </div>

                <div className="px-2 py-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#706456] block px-1 my-1">
                    Alternar Identidade:
                  </span>
                  {usuarios.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onTrocarUsuario(u);
                        setMenuAberto(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded-xs flex items-center justify-between cursor-pointer transition-colors ${
                        u.id === usuarioAtual.id
                          ? 'bg-[#8b0000] text-white font-bold'
                          : 'text-[#ded6cb] hover:bg-[#251419]'
                      }`}
                    >
                      <span className="truncate">{u.nome}</span>
                      <span className="text-[10px] opacity-75">
                        {u.role === 'mestre' ? '👑' : '🗡️'}
                      </span>
                    </button>
                  ))}
                </div>

                {onLogout && (
                  <div className="border-t border-[#251419] p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuAberto(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Desconectar-se</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
