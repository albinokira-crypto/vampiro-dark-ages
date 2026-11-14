import React, { useState } from 'react';
import type { User } from '../types';
import { storageService } from '../services/storage';

interface NavbarProps {
  usuarioAtual: User;
  onTrocarUsuario: (novoUsuario: User) => void;
  onVoltarDashboard?: () => void;
  emFicha?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  usuarioAtual,
  onTrocarUsuario,
  onVoltarDashboard,
  emFicha = false,
}) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const usuarios = storageService.getUsuarios();

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
              className="px-2.5 py-1 text-xs font-bold uppercase rounded-xs border border-[#3b181b] bg-[#1a1417] text-[#d4af37] hover:border-[#8b0000] hover:bg-[#2e1215] transition-colors"
            >
              ← Painel
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">🦇</span>
            <div>
              <h1 className="text-base sm:text-lg font-gothic font-black tracking-widest text-[#ef4444] leading-none">
                VAMPIRO
              </h1>
              <span className="text-[10px] font-medieval text-[#a89f91] tracking-wide block">
                A Idade das Trevas · Crônicas Medievais
              </span>
            </div>
          </div>
        </div>

        {/* Perfil & Ações */}
        <div className="flex items-center gap-3">
          {/* Seletor de Perfil / Usuário */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuAberto(!menuAberto)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xs border border-[#3b181b] bg-[#171315] hover:border-[#8b0000] transition-colors text-xs"
            >
              <div className="text-left">
                <span className="block text-[10px] text-muted leading-none">Conectado como:</span>
                <span className="font-bold text-[#ded6cb]">{usuarioAtual.nome}</span>
              </div>
              <span
                className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs ${
                  usuarioAtual.role === 'mestre'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-stone-800 text-stone-300 border border-stone-600'
                }`}
              >
                {usuarioAtual.role === 'mestre' ? 'Mestre' : 'Jogador'}
              </span>
              <span className="text-[10px] text-muted">▼</span>
            </button>

            {menuAberto && (
              <div className="absolute right-0 mt-1 w-64 rounded-xs border border-[#3b181b] bg-[#171315] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-bold uppercase text-[#a89f91] px-2 py-1 border-b border-white/5 mb-1">
                  Alternar Perfil da Mesa
                </p>
                <div className="space-y-1">
                  {usuarios.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        storageService.setUsuarioAtual(u);
                        onTrocarUsuario(u);
                        setMenuAberto(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-xs text-xs flex items-center justify-between transition-colors ${
                        u.id === usuarioAtual.id
                          ? 'bg-[#3b0d10] text-red-200 font-bold border border-red-800'
                          : 'text-[#ded6cb] hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{u.nome}</span>
                      <span className="text-[9px] uppercase px-1 rounded-xs bg-black/40 text-muted">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/5 mt-2 pt-2 flex items-center justify-between text-[11px] px-1 text-muted">
                  <button
                    type="button"
                    onClick={handleExportar}
                    className="hover:text-[#d4af37] underline"
                    title="Exportar todas as fichas e dados em JSON"
                  >
                    Exportar Backup
                  </button>
                  <label className="hover:text-[#d4af37] underline cursor-pointer">
                    Importar Backup
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportar}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
