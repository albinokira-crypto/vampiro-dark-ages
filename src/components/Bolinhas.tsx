import React from 'react';

interface BolinhasProps {
  valor: number;
  valorInicial?: number; // Cota base da criação inicial
  destacarBonus?: boolean; // Se true, bolinhas além de valorInicial recebem destaque visual de ponto bônus
  max?: number; // 8 para Atributos e Habilidades, 10 para Força de Vontade/Caminho
  min?: number; // 0 ou 1
  onChange?: (novoValor: number) => void;
  readonly?: boolean;
  tamanho?: 'sm' | 'md' | 'lg';
  cor?: 'sangue' | 'ouro' | 'cinza';
}

export const Bolinhas: React.FC<BolinhasProps> = ({
  valor,
  valorInicial,
  destacarBonus = false,
  max = 8,
  min = 0,
  onChange,
  readonly = false,
  tamanho = 'md',
  cor = 'sangue',
}) => {
  const pontos = Array.from({ length: max }, (_, i) => i + 1);

  const handleClick = (ponto: number) => {
    if (readonly || !onChange) return;
    // Se clicar no mesmo ponto já preenchido, diminui 1 ponto (ou volta para o min)
    if (valor === ponto) {
      onChange(Math.max(min, ponto - 1));
    } else {
      onChange(Math.max(min, ponto));
    }
  };

  const tamanhoCls = {
    sm: 'w-3.5 h-3.5 sm:w-3 sm:h-3',
    md: 'w-4 h-4 sm:w-4 sm:h-4',
    lg: 'w-5 h-5 sm:w-5 sm:h-5',
  }[tamanho];

  const corPreenchida = {
    sangue: 'bg-[#991b1b] border-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    ouro: 'bg-[#b45309] border-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    cinza: 'bg-[#374151] border-[#9ca3af]',
  }[cor];

  return (
    <div className="inline-flex items-center gap-1 sm:gap-1.5 select-none touch-manipulation" role="group">
      {pontos.map((ponto) => {
        const preenchido = ponto <= valor;
        const ehBonus =
          preenchido &&
          destacarBonus &&
          valorInicial !== undefined &&
          ponto > valorInicial;

        const estiloPreenchido = ehBonus
          ? 'bg-gradient-to-tr from-[#b45309] via-[#f59e0b] to-[#fef08a] border-[#fef08a] shadow-[0_0_10px_rgba(251,191,36,0.9)] ring-1 ring-[#fef08a]/80'
          : corPreenchida;

        const tituloPonto = ehBonus
          ? `Nível ${ponto} de ${max} (✦ Ponto Bônus)`
          : preenchido && destacarBonus && valorInicial !== undefined
          ? `Nível ${ponto} de ${max} (● Ponto Inicial)`
          : `Nível ${ponto} de ${max}`;

        return (
          <button
            key={ponto}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(ponto)}
            title={tituloPonto}
            className={`
              ${tamanhoCls} rounded-full transition-all duration-150 relative
              border focus:outline-none touch-manipulation
              before:absolute before:-inset-1 before:content-['']
              ${
                preenchido
                  ? estiloPreenchido
                  : 'bg-[#181517] border-[#3d3337] hover:border-[#6b5860]'
              }
              ${
                readonly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-120 active:scale-90'
              }
            `}
            aria-label={tituloPonto}
          >
            {ehBonus && (
              <span className="absolute inset-0 flex items-center justify-center text-[7px] text-[#2b1103] font-black select-none pointer-events-none">
                ✦
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
