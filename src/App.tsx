import { useState, useEffect } from 'react';
import type { Personagem, User } from './types';
import { storageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { FichaPersonagem } from './components/FichaPersonagem';
import { TelaLogin } from './components/TelaLogin';
import { PainelConfigMestre } from './components/PainelConfigMestre';

export function App() {
  const [usuarioAtual, setUsuarioAtual] = useState<User | null>(() =>
    storageService.getUsuarioAtual()
  );
  const [personagemAtivoId, setPersonagemAtivoId] = useState<string | null>(null);
  const [modalConfigMestreAberto, setModalConfigMestreAberto] = useState(false);

  useEffect(() => {
    storageService.carregarConfiguracaoMesaRemota();
  }, []);

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

  const handleLogout = () => {
    storageService.logout();
    setUsuarioAtual(null);
    setPersonagemAtivoId(null);
  };

  const handleAbrirFicha = (id: string) => {
    setPersonagemAtivoId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCriarNovo = (tipo: 'jogador' | 'npc') => {
    if (!usuarioAtual) return;
    if (tipo === 'npc' && usuarioAtual.role !== 'mestre') return;
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

  // Se não estiver logado, exibe a Tela de Login e Cadastro
  if (!usuarioAtual) {
    return <TelaLogin onLoginSucesso={(user) => setUsuarioAtual(user)} />;
  }

  const personagemAtivo = personagemAtivoId
    ? storageService.getPersonagem(personagemAtivoId)
    : null;

  return (
    <div className="min-h-screen bg-[#070506] text-[#ded6cb] selection:bg-[#8b0000] selection:text-white flex flex-col font-body">
      <Navbar
        usuarioAtual={usuarioAtual}
        onTrocarUsuario={handleTrocarUsuario}
        onVoltarDashboard={handleVoltarDashboard}
        onAbrirConfigMestre={() => setModalConfigMestreAberto(true)}
        onLogout={handleLogout}
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
            onAbrirConfigMestre={() => setModalConfigMestreAberto(true)}
          />
        )}
      </main>

      {/* Modal de Configuração de Pontuação do Mestre */}
      {modalConfigMestreAberto && (
        <PainelConfigMestre onFechar={() => setModalConfigMestreAberto(false)} />
      )}
    </div>
  );
}

export default App;
