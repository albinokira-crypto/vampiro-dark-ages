import React, { useState, useEffect } from 'react';
import { Smartphone, Share, X, Monitor, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstaladorPWA: React.FC = () => {
  const [promptInstalacao, setPromptInstalacao] = useState<BeforeInstallPromptEvent | null>(null);
  const [instalado, setInstalado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [ehIos, setEhIos] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setEhIos(isIos);

    // Detectar se já está rodando em modo standalone (PWA instalado)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error navigator standalone iOS
      window.navigator.standalone === true;

    if (isStandalone) {
      setInstalado(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPromptInstalacao(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalado(true);
      setPromptInstalacao(null);
      setModalAberto(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstalar = async () => {
    if (promptInstalacao) {
      try {
        await promptInstalacao.prompt();
        const choice = await promptInstalacao.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalado(true);
        }
        setPromptInstalacao(null);
      } catch {
        setModalAberto(true);
      }
    } else {
      // Abre o modal com instruções claras para o dispositivo atual
      setModalAberto(true);
    }
  };

  if (instalado) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstalar}
        title="Instalar Atalho do Aplicativo no Celular ou PC"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#181115] hover:bg-[#251419] border border-[#522228] text-xs font-gothic font-bold uppercase tracking-wider text-[#d4af37] hover:text-white rounded-xs cursor-pointer transition-all shadow-sm touch-manipulation"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#ef4444]" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>

      {/* Modal de Instrução de Instalação (Mobile / Desktop) */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#120d10] border border-[#8b0000] rounded-sm max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setModalAberto(false)}
              className="absolute top-3 right-3 text-[#a89f91] hover:text-white text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[#d4af37]">
              {ehIos ? (
                <Smartphone className="w-5 h-5 text-[#ef4444]" />
              ) : (
                <Monitor className="w-5 h-5 text-[#ef4444]" />
              )}
              <h4 className="text-sm font-gothic font-bold uppercase tracking-wider">
                Instalar Atalho no {ehIos ? 'iPhone / iPad' : 'Celular ou Computador'}
              </h4>
            </div>

            <p className="text-xs text-[#ded6cb] leading-relaxed">
              Você pode usar o Vampiro como um aplicativo nativo em tela cheia com acesso rápido direto da sua área de trabalho:
            </p>

            {ehIos ? (
              <ol className="text-xs text-[#ded6cb] space-y-2 list-decimal list-inside bg-[#181115] p-3 rounded-xs border border-[#3b181b]">
                <li>
                  Toque no botão de <strong>Compartilhar</strong>{' '}
                  <Share className="w-3.5 h-3.5 inline text-[#d4af37]" /> na barra inferior do Safari.
                </li>
                <li>
                  Role as opções e toque em{' '}
                  <strong className="text-[#d4af37]">"Adicionar à Tela de Início"</strong>.
                </li>
                <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
              </ol>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#181115] p-3 rounded-xs border border-[#3b181b] space-y-1.5 text-xs text-[#ded6cb]">
                  <p className="font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#ef4444]" /> No Celular (Android / Chrome):
                  </p>
                  <p>
                    Toque nos <strong>três pontinhos (⋮)</strong> no canto superior direito do navegador e selecione{' '}
                    <strong className="text-[#d4af37]">"Instalar aplicativo"</strong> ou{' '}
                    <strong className="text-[#d4af37]">"Adicionar à tela inicial"</strong>.
                  </p>
                </div>

                <div className="bg-[#181115] p-3 rounded-xs border border-[#3b181b] space-y-1.5 text-xs text-[#ded6cb]">
                  <p className="font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-[#ef4444]" /> No Computador (Chrome / Edge):
                  </p>
                  <p>
                    Clique no <strong>ícone de instalação</strong> (um monitorzinho ou seta para baixo) na barra de endereços do navegador à direita, ou no menu (⋮) &gt; <strong className="text-[#d4af37]">"Instalar Vampiro: A Idade das Trevas"</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 text-[11px] text-green-400 bg-green-950/30 p-2 rounded-xs border border-green-800/40">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>O app funciona offline e sincroniza instantaneamente com o banco na nuvem!</span>
            </div>

            <button
              type="button"
              onClick={() => setModalAberto(false)}
              className="w-full py-2 bg-[#8b0000] hover:bg-[#a30d12] text-white font-gothic font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
