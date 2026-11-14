/**
 * Utilitário para redimensionar e comprimir fotos de personagens no navegador (mobile & desktop)
 * Reduz fotos pesadas de celulares (5MB-10MB) para ~40KB-70KB no formato WebP/JPEG
 */
export async function comprimirImagem(
  arquivo: File,
  maxLargura: number = 600,
  maxAltura: number = 600,
  qualidade: number = 0.75
): Promise<{ base64: string; tamanhoOriginalKB: number; tamanhoComprimidoKB: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let largura = img.width;
        let altura = img.height;

        // Calcular proporção mantendo aspecto
        if (largura > altura) {
          if (largura > maxLargura) {
            altura = Math.round((altura * maxLargura) / largura);
            largura = maxLargura;
          }
        } else {
          if (altura > maxAltura) {
            largura = Math.round((largura * maxAltura) / altura);
            altura = maxAltura;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = largura;
        canvas.height = altura;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter contexto do canvas'));
          return;
        }

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, largura, altura);

        // Tentar exportar em WebP, se falhar ou não suportar cai para JPEG
        let dataUrl = canvas.toDataURL('image/webp', qualidade);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', qualidade);
        }

        const tamanhoOriginalKB = Math.round(arquivo.size / 1024);
        // Tamanho aproximado do base64 em KB (comprimento * 3/4 / 1024)
        const tamanhoComprimidoKB = Math.round((dataUrl.length * (3 / 4)) / 1024);

        resolve({
          base64: dataUrl,
          tamanhoOriginalKB,
          tamanhoComprimidoKB,
        });
      };

      img.onerror = () => reject(new Error('Erro ao carregar a imagem selecionada.'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo da imagem.'));
    reader.readAsDataURL(arquivo);
  });
}
