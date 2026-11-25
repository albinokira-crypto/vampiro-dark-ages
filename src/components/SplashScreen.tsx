import React, { useState, useEffect } from 'react';
import logoDarkAges from '../assets/vampire-dark-ages-logo.png';

interface SplashScreenProps {
  onComplete: () => void;
  duracaoTotalMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duracaoTotalMs = 2300,
}) => {
  const [fase, setFase] = useState<'entrando' | 'visivel' | 'saindo'>('entrando');

  useEffect(() => {
    // Remove o splash estático do HTML assim que o componente React assume
    const nativeEl = document.getElementById('native-splash');
    if (nativeEl) {
      nativeEl.remove();
    }

    // Transição de entrada suave
    const timerEntrada = setTimeout(() => {
      setFase('visivel');
    }, 50);

    // Início da saída com fade out
    const timerSaida = setTimeout(() => {
      setFase('saindo');
    }, duracaoTotalMs - 600);

    // Conclusão total do splash
    const timerFim = setTimeout(() => {
      onComplete();
    }, duracaoTotalMs);

    return () => {
      clearTimeout(timerEntrada);
      clearTimeout(timerSaida);
      clearTimeout(timerFim);
    };
  }, [duracaoTotalMs, onComplete]);

  const handlePular = () => {
    setFase('saindo');
    setTimeout(() => {
      onComplete();
    }, 250);
  };

  return (
    <div
      onClick={handlePular}
      role="dialog"
      aria-label="Abertura da Crônica"
      className={`fixed inset-0 z-[100] bg-[#070506] flex flex-col items-center justify-center p-6 select-none cursor-pointer transition-opacity duration-700 ease-in-out ${
        fase === 'saindo'
          ? 'opacity-0 pointer-events-none'
          : fase === 'visivel'
          ? 'opacity-100'
          : 'opacity-0'
      }`}
    >
      {/* Luz ambiente gótica com névoa carmesim pulsante */}
      <div className="absolute w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-[#8b0000]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Conteúdo Central: Logo Oficial com efeito de escala suave */}
      <div
        className={`relative z-10 flex flex-col items-center max-w-xl w-full transition-transform duration-1000 ease-out transform ${
          fase === 'saindo'
            ? 'scale-105'
            : fase === 'visivel'
            ? 'scale-100'
            : 'scale-95'
        }`}
      >
        <img
          src={logoDarkAges}
          alt="Vampire: The Dark Ages"
          className="vda-logo-img w-full max-w-[360px] sm:max-w-[480px] object-contain drop-shadow-[0_4px_25px_rgba(255,255,255,0.25)] filter"
        />

        {/* Linha ornamental gótica */}
        <div className="w-48 sm:w-64 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent my-4 opacity-80" />

        {/* Subtítulo Medieval */}
        <p className="text-xs sm:text-sm font-gothic tracking-[0.25em] uppercase text-[#d4af37] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90">
          Livro Básico de Regras • 1ª Edição
        </p>
      </div>

      {/* Dica sutil de toque para prosseguir rápido */}
      <span className="absolute bottom-6 text-[10px] text-[#706456] tracking-wider uppercase opacity-60">
        Toque para entrar
      </span>
    </div>
  );
};
