import React, { useRef, useState } from 'react';
import { Camera, Trash2, Loader2, Sparkles, User as UserIcon } from 'lucide-react';
import { comprimirImagem } from '../utils/imageCompressor';

interface FotoPersonagemProps {
  foto?: string;
  nome: string;
  podeEditar?: boolean;
  onFotoChange?: (base64: string) => void;
  onFotoRemover?: () => void;
  tamanho?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FotoPersonagem: React.FC<FotoPersonagemProps> = ({
  foto,
  nome,
  podeEditar = false,
  onFotoChange,
  onFotoRemover,
  tamanho = 'md',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comprimindo, setComprimindo] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleSelecionarArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo || !onFotoChange) return;

    setComprimindo(true);
    setErro(null);
    setMensagemSucesso(null);

    try {
      const resultado = await comprimirImagem(arquivo, 600, 600, 0.75);
      onFotoChange(resultado.base64);
      setMensagemSucesso(
        `Otimizado: ${resultado.tamanhoOriginalKB} KB → ${resultado.tamanhoComprimidoKB} KB`
      );
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Falha ao processar a imagem.');
      }
      setTimeout(() => setErro(null), 4000);
    } finally {
      setComprimindo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const dimensoes = {
    sm: 'w-14 h-14 sm:w-16 sm:h-16',
    md: 'w-[96px] h-[116px] sm:w-[110px] sm:h-[130px]',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
  }[tamanho];

  return (
    <div className={`relative flex flex-col items-center select-none w-[96px] sm:w-[110px] ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleSelecionarArquivo}
        className="hidden"
        disabled={!podeEditar || comprimindo}
      />

      <div
        className={`relative ${dimensoes} rounded-sm overflow-hidden border-2 border-[#522228] bg-[#140e11] shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center justify-center group`}
      >
        {foto ? (
          <img
            src={foto}
            alt={nome || 'Personagem'}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#706456] p-2 text-center">
            <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#522228] mb-1" />
            <span className="text-[9px] font-gothic uppercase tracking-wider text-[#a89f91]">
              Sem Retrato
            </span>
          </div>
        )}

        {/* Overlay de carregamento */}
        {comprimindo && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-1 z-20">
            <Loader2 className="w-6 h-6 text-[#ef4444] animate-spin" />
            <span className="text-[9px] text-[#fca5a5] font-bold">Comprimindo...</span>
          </div>
        )}

        {/* Botão de Trocar Imagem (no hover ou toque) */}
        {podeEditar && !comprimindo && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Tirar foto ou escolher da galeria"
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer z-10 touch-manipulation"
          >
            <Camera className="w-6 h-6 text-[#d4af37]" />
            <span className="text-[9px] font-gothic font-bold uppercase mt-1">Alterar</span>
          </button>
        )}
      </div>

      {/* Botões rápidos abaixo com largura exata da parte inferior da foto */}
      {podeEditar && (
        <div className="flex items-center gap-1 mt-1 w-full">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={comprimindo}
            className="flex-1 py-1 px-1 bg-[#1e1317] hover:bg-[#2b1016] border border-[#522228] text-[9.5px] font-gothic font-bold uppercase text-[#d4af37] rounded-xs flex items-center justify-center gap-1 cursor-pointer transition-colors touch-manipulation"
          >
            <Camera className="w-3 h-3" />
            <span>Foto</span>
          </button>

          {foto && onFotoRemover && (
            <button
              type="button"
              onClick={onFotoRemover}
              title="Remover foto"
              className="shrink-0 p-1 bg-[#1e1317] hover:bg-red-950 border border-[#522228] text-[#a89f91] hover:text-[#ef4444] rounded-xs cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Notificação flutuante de compressão */}
      {mensagemSucesso && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 whitespace-nowrap bg-[#1a0f12] border border-[#d4af37] text-[10px] text-[#d4af37] px-2 py-0.5 rounded-xs shadow-lg flex items-center gap-1 animate-fadeIn">
          <Sparkles className="w-3 h-3 text-[#ef4444]" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {erro && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 whitespace-nowrap bg-red-950 border border-red-600 text-[10px] text-red-200 px-2 py-0.5 rounded-xs shadow-lg">
          {erro}
        </div>
      )}
    </div>
  );
};
