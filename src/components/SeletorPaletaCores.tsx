import React, { useState, useEffect } from 'react';
import {
  TEMAS_SISTEMA,
  getTemaSalvo,
  aplicarTema,
  EVENTO_MUDANCA_TEMA,
  type TemaSistemaId,
} from '../services/theme';
import { Check, Eye } from 'lucide-react';

export const SeletorPaletaCores: React.FC = () => {
  const [temaAtual, setTemaAtual] = useState<TemaSistemaId>(() => getTemaSalvo());

  useEffect(() => {
    const onTemaChange = (e: Event) => {
      const detail = (e as CustomEvent<TemaSistemaId>).detail;
      if (detail) {
        setTemaAtual(detail);
      } else {
        setTemaAtual(getTemaSalvo());
      }
    };
    window.addEventListener(EVENTO_MUDANCA_TEMA, onTemaChange);
    return () => window.removeEventListener(EVENTO_MUDANCA_TEMA, onTemaChange);
  }, []);

  const handleSelecionar = (id: TemaSistemaId) => {
    setTemaAtual(id);
    aplicarTema(id);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#181115] border border-[#3b181b] p-3.5 rounded-xs flex items-start gap-2.5 text-xs">
        <Eye className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#d4af37] block">
            Conforto Visual e Acessibilidade (Salvo no seu aparelho)
          </strong>
          <p className="text-[#a89f91] leading-relaxed">
            Escolha a paleta de cores mais confortável para a sua visão. A alteração vale imediatamente apenas neste dispositivo, sem mudar as cores da tela de outros jogadores. Todas as caixas de texto e seletores mantêm contraste reforçado.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {TEMAS_SISTEMA.map((tema) => {
          const ativo = temaAtual === tema.id;
          const p = tema.preview;

          return (
            <button
              key={tema.id}
              type="button"
              onClick={() => handleSelecionar(tema.id)}
              className={`text-left p-3.5 rounded-sm border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                ativo
                  ? 'bg-[#241318] border-[#d4af37] ring-1 ring-[#d4af37]/60 shadow-lg'
                  : 'bg-[#140e11] border-[#3b181b] hover:border-[#63262c]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-gothic font-bold text-sm text-[#d4af37]">
                      {tema.nome}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#ded6cb]">
                      {tema.subtitulo}
                    </p>
                  </div>
                  {ativo && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase bg-[#8b0000] text-white shrink-0">
                      <Check className="w-3 h-3" />
                      <span>Ativo</span>
                    </span>
                  )}
                </div>

                {tema.tagAcessibilidade && (
                  <span className="inline-block px-2 py-0.5 rounded-xs text-[10px] font-mono bg-[#1f160e] border border-[#523d1d] text-amber-200">
                    {tema.tagAcessibilidade}
                  </span>
                )}

                <p className="text-[11px] text-[#a89f91] leading-relaxed">
                  {tema.descricao}
                </p>
              </div>

              {/* Miniatura isolada com estilos inline para nunca sofrer interferência visual */}
              <div
                style={{
                  backgroundColor: p.pageBg,
                  borderColor: p.cardBorder,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: '4px',
                  padding: '8px',
                }}
              >
                <div
                  style={{
                    backgroundColor: p.cardBg,
                    borderColor: p.cardBorder,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: '3px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: p.textMain,
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      Título &amp; Atributos
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {[1, 2, 3, 4].map((n) => (
                        <span
                          key={n}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '9999px',
                            display: 'inline-block',
                            backgroundColor: n <= 3 ? p.dotFilled : 'transparent',
                            border: `1.5px solid ${n <= 3 ? p.dotFilled : p.dotEmptyBorder}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: p.inputBg,
                        color: p.inputText,
                        border: `1px solid ${p.inputBorder}`,
                        borderRadius: '2px',
                        padding: '3px 6px',
                        fontSize: '10px',
                        fontWeight: 500,
                      }}
                    >
                      Caixa de texto legível
                    </div>
                    <span
                      style={{
                        backgroundColor: p.btnBg,
                        color: p.btnText,
                        borderRadius: '2px',
                        padding: '3px 8px',
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      Botão
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
