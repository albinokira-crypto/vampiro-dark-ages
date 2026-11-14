# Vampiro: A Idade das Trevas - Sistema de Fichas (Dark Ages RPG)

Sistema Web Full-Stack para criação, visualização, armazenamento e edição interativa de fichas de RPG de "Vampiro: A Idade das Trevas" (Vampire: The Dark Ages 20th Anniversary).

---

## 🏛️ Arquitetura e Estrutura do Projeto

```
D:\vampiro-dark-ages\
├── index.html                  # Metadados, Google Fonts (Cinzel, MedievalSharp, Crimson Pro)
├── package.json                # React 19, TypeScript, Tailwind CSS v4, Lucide-React
├── vite.config.ts              # Bundler Vite com plugin Tailwind CSS v4
├── src/
│   ├── main.tsx                # Entrada React
│   ├── App.tsx                 # Roteamento de telas (Dashboard vs Ficha) e gestão de sessão
│   ├── index.css               # Tema dark gótico, sombras de sangue, estilização de pergaminho
│   ├── types/
│   │   └── index.ts            # Tipagens completas do sistema (Atributos 1-8, Habilidades, XP, etc.)
│   ├── services/
│   │   └── storage.ts          # Persistência local (LocalStorage), dados pré-cadastrados, backup JSON
│   └── components/
│       ├── Bolinhas.tsx        # Seletor interativo de 1 a 8 bolinhas (pontos) com clique cíclico/desmarcar
│       ├── QuadradosStatus.tsx # Seletor de caixas de gasto (Força de Vontade e Sangue) com marcação em 'X'
│       ├── VitalidadeSelector.tsx # Níveis de saúde (Nenhum -> Contusão / -> Letal X -> Agravado ✱)
│       ├── InlineField.tsx     # Edição direta no clique estilo ficha de papel (texto e multilinha)
│       ├── Navbar.tsx          # Cabeçalho com troca de perfil (Mestre vs Jogadores) e Backup JSON
│       ├── Dashboard.tsx       # Resumo da mesa, busca, cartões com status de saúde e sangue
│       └── FichaPersonagem.tsx # Ficha completa com 3 seções/abas e barra flutuante de salvar
```

---

## ⚔️ Funcionalidades Implementadas

### 1. Sistema de Perfis e Permissões (RBAC)
- **Mestre da Crônica (Admin):** Visualiza e edita todos os personagens e NPCs da mesa; pode criar personagens para si ou NPCs.
- **Jogadores:** Visualizam e editam apenas as suas próprias fichas. Fichas de outros jogadores abrem em modo somente leitura com aviso visual.
- **Seletor de Perfis:** Alternância instantânea no menu superior entre Mestre e Jogadores da crônica para testes e jogatina.

### 2. Painel Inicial (Dashboard de Resumo)
- Filtro por termo (Nome, Clã, Geração, Jogador) e por tipo (Todos / Jogadores / NPCs).
- Indicador visual dinâmico do status de Vitalidade e penalidade atual (ex: *Intacto*, *Ferido Gravemente (-2)*, *Incapacitado*).
- Barra de Reserva de Sangue disponível vs. gasto.
- Ações rápidas: "Abrir Ficha", "Excluir Ficha" (com confirmação da Inquisição) e "Criar Novo Personagem / NPC".

### 3. Edição Direta Visual (Inline Editing)
- Textos e anotações podem ser clicados e editados diretamente na própria ficha, sem formulários modais separados.
- Atalho global de teclado: `Ctrl + S` para salvar alterações instantaneamente.
- Barra fixa flutuante no rodapé: sempre visível, com detector de alterações pendentes e botão "Salvar Alterações".

### 4. Sistema de Bolinhas (1 a 8 Pontos)
- Componente `Bolinhas.tsx` para Atributos, Habilidades, Disciplinas, Antecedentes e Trilhas Taumatúrgicas.
- Suporte a gerações antigas (até 8 pontos).
- Clique no mesmo ponto preenchido desmarca 1 ponto, permitindo ajuste rápido de valores.

### 5. Estrutura da Ficha em 3 Abas
- **Seção 1 (Características Principais):**
  - Cabeçalho: Nome, Jogador, Crônica, Clã, Natureza, Comportamento, Geração, Refúgio, Conceito, Senhor.
  - Atributos (1 a 8): Físicos, Sociais e Mentais.
  - Habilidades (0 a 8): Talentos, Perícias e Conhecimentos.
  - Vantagens: Disciplinas dinâmicas, Antecedentes dinâmicos e Virtudes (Consciência/Convicção, Autocontrole/Instinto, Coragem).
  - Status Atuais: Caminho/Humanidade (1-10), Força de Vontade permanente + temporária em caixas 'X', Pontos de Sangue com reserva/gasto e Fraqueza de Clã.
  - Vitalidade: Escoriado a Incapacitado com ciclos de dano (Contusão `/`, Letal `X` e Agravado `✱`).
- **Seção 2 (Experiência, Combate e Laços):**
  - XP: Experiência Atual, Total Gasto, Total Acumulado e Histórico de transações.
  - Combate: Tabela dinâmica de Armas (Dificuldade, Dano, Ocultação, Alcance) e Armaduras (Classe, Penalidade).
  - Relações: Laços de Sangue / Vinculi (1 a 3 goles) e Perturbações Mentais com descrição.
- **Seção 3 (Magia de Sangue, Biografia e Aparência):**
  - Magia de Sangue / Taumaturgia: Trilhas (1 a 8 bolinhas) e Grimório de Rituais (Nome, Nível, Notas/Páginas).
  - Aparência: Idade, Idade Aparente, Abraço, Cabelos, Olhos, Raça, Sexo, Nacionalidade, Altura, Peso.
  - Memórias e Destino: História, Prelúdio, Objetivos e Notas Secretas.

---

## 🚀 Como Executar Localmente

1. Navegue até a pasta do projeto:
   ```powershell
   cd D:\vampiro-dark-ages
   ```

2. Instale as dependências (já executado):
   ```powershell
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```powershell
   npm run dev
   ```
   Acesse a URL informada (ex: `http://localhost:5173`).

---

## ☁️ Como Publicar no Cloudflare Pages

O projeto gera uma SPA estática otimizada sem necessidade de servidor Node.js em produção:

1. **Compilar a aplicação:**
   ```powershell
   npm run build
   ```
   Os arquivos finais são gerados na pasta `dist/`.

2. **Opção A - Via Dashboard do Cloudflare Pages (Deploy via Git):**
   - Conecte o repositório GitHub ao Cloudflare Pages.
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

3. **Opção B - Via Wrangler CLI (Deploy Direto):**
   ```powershell
   npx wrangler pages deploy dist --project-name vampiro-dark-ages
   ```
