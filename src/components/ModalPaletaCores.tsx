import React from 'react';
import { Palette, X } from 'lucide-react';
import { SeletorPaletaCores } from './SeletorPaletaCores';

interface ModalPaletaCoresProps {
  onFechar: () => void;
}

export const ModalPaletaCores: React.FC<ModalPaletaCoresProps> = ({ onFechar }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#120a0e] border border-[#8b0000] rounded-sm shadow-2xl p-4 sm:p-6 space-y-4 text-[#ded6cb] max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[#3b181b] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h3 className="text-base sm:text-lg font-gothic font-bold text-[#d4af37] uppercase tracking-wider">
                Paleta de Cores &amp; Conforto Visual
              </h3>
              <p className="text-[11px] text-[#a89f91]">
                Personalize as cores da sua tela (inclui modos Preto &amp; Branco, Sépia e Azul Noturno)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-[#8e8273] hover:text-white p-1 cursor-pointer transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          <SeletorPaletaCores />
        </div>

        <div className="border-t border-[#3b181b] pt-3 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#a30d12] text-white text-xs font-gothic font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
