import { useState, useEffect, useRef } from 'react';
import type { Personagem, User } from './types';
import { storageService } from './services/storage';
import {
  verificarAtualizacaoVersao,
  forcarAtualizacaoCompleta,
  podeRecarregarAutomaticamente,
} from './services/autoUpdate';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { FichaPersonagem } from './components/FichaPersonagem';
import { TelaLogin } from './components/TelaLogin';
import { PainelConfigMestre } from './components/PainelConfigMestre';
import { ModalPaletaCores } from './components/ModalPaletaCores';
import { SplashScreen } from './components/SplashScreen';

export function App() {
  const [splashAtivo, setSplashAtivo] = useState(true);
  const [usuarioAtual, setUsuarioAtual] = useState<User | null>(() =>
    storageService.getUsuarioAtual()
  );
  const [personagemAtivoId, setPersonagemAtivoId] = useState<string | null>(null);
  const [modalConfigMestreAberto, setModalConfigMestreAberto] = useState(false);
  const [modalPaletaAberto, setModalPaletaAberto] = useState(false);
  const [novaVersaoDisponivel, setNovaVersaoDisponivel] = useState<string | null>(null);

  const personagemAtivoIdRef = useRef<string | null>(personagemAtivoId);
  personagemAtivoIdRef.current = personagemAtivoId;

  useEffect(() => {
    storageService.carregarConfiguracaoMesaRemota();
  }, []);

  // Sistema de Auto-Atualização Instantânea (padrão version.json + limpeza de cache)
  useEffect(() => {
    let ativo = true;

    const checarVersao = async () => {
      const info = await verificarAtualizacaoVersao();
      if (!ativo || !info.temAtualizacao || !info.versaoServidor) return;

      setNovaVersaoDisponivel(info.versaoServidor);

      // Se não estiver editando uma ficha, atualiza automaticamente sem interromper trabalho
      if (!personagemAtivoIdRef.current && podeRecarregarAutomaticamente()) {
        await forcarAtualizacaoCompleta();
      }
    };

    const timerInicial = setTimeout(checarVersao, 3000);
    const intervalo = setInterval(checarVersao, 60000);
    const onFocus = () => checarVersao();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checarVersao();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      ativo = false;
      clearTimeout(timerInicial);
      clearInterval(intervalo);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const handleTrocarUsuario = (novoUsuario: User) => {
    storageService.setUsuarioAtual(novoUsuario);
    setUsuarioAtual(novoUsuario);

    // Se estiver em uma ficha que o novo usuário jogador não pode acessar, volta ao dashboard
    if (personagemAtivoId) {
      const p = storageService.getPersonagem(personagemAtivoId, novoUsuario);
      if (novoUsuario.role === 'jogador' && !p) {
        setPersonagemAtivoId(null);
      }
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setUsuarioAtual(null);
    setPersonagemAtivoId(null);
  };

  const forcarScrollTopo = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  useEffect(() => {
    forcarScrollTopo();
    const raf = requestAnimationFrame(forcarScrollTopo);
    const timer = setTimeout(forcarScrollTopo, 60);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [personagemAtivoId]);

  const handleAbrirFicha = (id: string) => {
    const p = storageService.getPersonagem(id, usuarioAtual);
    if (!p) {
      alert('Acesso restrito: Esta ficha é exclusiva do Narrador ou não foi encontrada.');
      return;
    }
    setPersonagemAtivoId(id);
    forcarScrollTopo();
  };

  const handleCriarNovo = (tipo: 'jogador' | 'npc') => {
    if (!usuarioAtual) return;
    if (tipo === 'npc' && usuarioAtual.role !== 'mestre') return;
    const novo = storageService.criarNovoPersonagem(usuarioAtual, tipo);
    setPersonagemAtivoId(novo.id);
    forcarScrollTopo();
  };

  const handleSalvarFicha = (personagemAtualizado: Personagem) => {
    storageService.salvarPersonagem(personagemAtualizado);
  };

  const handleVoltarDashboard = () => {
    setPersonagemAtivoId(null);
    forcarScrollTopo();
  };

  // Splash Screen de abertura: NADA do sistema é renderizado enquanto o splash estiver ativo
  if (splashAtivo) {
    return <SplashScreen onComplete={() => setSplashAtivo(false)} />;
  }

  // Se não estiver logado, exibe a Tela de Login e Cadastro
  if (!usuarioAtual) {
    return (
      <>
        <TelaLogin
          onLoginSucesso={(user) => setUsuarioAtual(user)}
          onAbrirPaletaCores={() => setModalPaletaAberto(true)}
        />
        {modalPaletaAberto && (
          <ModalPaletaCores onFechar={() => setModalPaletaAberto(false)} />
        )}
      </>
    );
  }

  const personagemAtivo = personagemAtivoId
    ? storageService.getPersonagem(personagemAtivoId, usuarioAtual)
    : null;

  return (
    <div className="min-h-screen bg-[#070506] text-[#ded6cb] selection:bg-[#8b0000] selection:text-white flex flex-col font-body">
      <Navbar
        usuarioAtual={usuarioAtual}
        onTrocarUsuario={handleTrocarUsuario}
        onVoltarDashboard={handleVoltarDashboard}
        onAbrirConfigMestre={() => setModalConfigMestreAberto(true)}
        onAbrirPaletaCores={() => setModalPaletaAberto(true)}
        onLogout={handleLogout}
        emFicha={!!personagemAtivoId}
        novaVersaoDisponivel={novaVersaoDisponivel}
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

      {/* Modal de Configurações da Crônica e Equipamentos (Exclusivo do Mestre) */}
      {modalConfigMestreAberto && usuarioAtual.role === 'mestre' && (
        <PainelConfigMestre onFechar={() => setModalConfigMestreAberto(false)} />
      )}

      {/* Modal de Paleta de Cores / Acessibilidade Visual (Visível para Jogadores e Mestre) */}
      {modalPaletaAberto && (
        <ModalPaletaCores onFechar={() => setModalPaletaAberto(false)} />
      )}
    </div>
  );
}

export default App;
