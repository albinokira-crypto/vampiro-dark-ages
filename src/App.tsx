import { useState } from 'react';
import type { Personagem, User } from './types';
import { storageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { FichaPersonagem } from './components/FichaPersonagem';

export function App() {
  const [usuarioAtual, setUsuarioAtual] = useState<User>(() =>
    storageService.getUsuarioAtual()
  );
  const [personagemAtivoId, setPersonagemAtivoId] = useState<string | null>(null);

  const handleTrocarUsuario = (novoUsuario: User) => {
    storageService.setUsuarioAtual(novoUsuario);
    setUsuarioAtual(novoUsuario);

    // Se estiver em uma ficha que o novo usuário jogador não pode acessar, volta ao dashboard
    if (personagemAtivoId) {
      const p = storageService.getPersonagem(personagemAtivoId);
      if (novoUsuario.role === 'jogador' && p && p.usuarioId !== novoUsuario.id) {
        setPersonagemAtivoId(null);
      }
    }
  };

  const handleAbrirFicha = (id: string) => {
    setPersonagemAtivoId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCriarNovo = (tipo: 'jogador' | 'npc') => {
    const novo = storageService.criarNovoPersonagem(usuarioAtual, tipo);
    setPersonagemAtivoId(novo.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSalvarFicha = (personagemAtualizado: Personagem) => {
    storageService.salvarPersonagem(personagemAtualizado);
  };

  const handleVoltarDashboard = () => {
    setPersonagemAtivoId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const personagemAtivo = personagemAtivoId
    ? storageService.getPersonagem(personagemAtivoId)
    : null;

  return (
    <div className="min-h-screen bg-[#070506] text-[#ded6cb] selection:bg-[#8b0000] selection:text-white flex flex-col font-body">
      <Navbar
        usuarioAtual={usuarioAtual}
        onTrocarUsuario={handleTrocarUsuario}
        onVoltarDashboard={handleVoltarDashboard}
        emFicha={!!personagemAtivoId}
      />

      <main className="flex-1">
        {personagemAtivo ? (
          <FichaPersonagem
            key={personagemAtivo.id}
            personagem={personagemAtivo}
            usuarioAtual={usuarioAtual}
            onSalvar={handleSalvarFicha}
            onVoltar={handleVoltarDashboard}
          />
        ) : (
          <Dashboard
            usuarioAtual={usuarioAtual}
            onAbrirFicha={handleAbrirFicha}
            onCriarNovo={handleCriarNovo}
          />
        )}
      </main>
    </div>
  );
}

export default App;
