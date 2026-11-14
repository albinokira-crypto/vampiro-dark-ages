# Vampiro: A Idade das Trevas - Sistema de Fichas (Dark Ages RPG)

Sistema Web Full-Stack para criação, visualização, armazenamento e edição interativa de fichas de RPG de "Vampiro: A Idade das Trevas" (Vampire: The Dark Ages 20th Anniversary).

---

## 🏛️ Arquitetura e Estrutura do Projeto

```
D:\vampiro-dark-ages\
├── index.html                     # Metadados, Google Fonts (Cinzel, MedievalSharp, Crimson Pro)
├── package.json                   # React 19, TypeScript, Tailwind CSS v4, Lucide-React
├── vite.config.ts                 # Bundler Vite com plugin Tailwind CSS v4
├── src/
│   ├── main.tsx                   # Entrada React
│   ├── App.tsx                    # Roteamento de telas (Login vs Dashboard vs Ficha)
│   ├── index.css                  # Tema dark gótico, sombras de sangue, estilização de pergaminho
│   ├── types/
│   │   └── index.ts               # Tipagens completas (Atributos, Prioridades, Pontos Bônus, RBAC)
│   ├── services/
│   │   └── storage.ts             # Persistência local, login, cadastro, configurações da mesa
│   └── components/
│       ├── TelaLogin.tsx          # Autenticação, cadastro de jogador e link de convite
│       ├── PainelConfigMestre.tsx # Painel do Mestre para ajustar pontuação inicial e copiar convite
│       ├── PainelCriacaoFicha.tsx # Assistente de criação com prioridades, pontos básicos e 15 bônus
│       ├── Bolinhas.tsx           # Seletor interativo de 1 a 8 bolinhas (pontos)
│       ├── QuadradosStatus.tsx    # Seletor de caixas de gasto com marcação em 'X'
│       ├── VitalidadeSelector.tsx # Níveis de saúde (Nenhum -> Contusão / -> Letal X -> Agravado ✱)
│       ├── InlineField.tsx        # Edição direta no clique estilo ficha de papel
│       ├── Navbar.tsx             # Cabeçalho com convites, troca de perfil e logout
│       ├── Dashboard.tsx          # Resumo da mesa, busca, cartões com status de saúde e sangue
│       └── FichaPersonagem.tsx    # Ficha completa com 3 seções/abas e barra flutuante de salvar
```

---

## ⚔️ Funcionalidades Implementadas

### 1. Sistema de Autenticação e Link de Convite
- **Página de Login e Cadastro Dedicada:**
  - Login com e-mail e senha.
  - Cadastro de novos jogadores.
  - Acesso rápido para testes (Mestre ou Jogadores).
- **Link de Convite da Mesa:**
  - Botão no cabeçalho e no painel para copiar o link da crônica (`?convite=dark-ages`).
  - O jogador abre o link e cai direto no cadastro da mesa do Mestre.

### 2. Configuração de Pontuação Inicial pelo Mestre
- Painel exclusivo onde o Mestre customiza a pontuação inicial da crônica:
  - Atributos (Primário: 7, Secundário: 5, Terciário: 3).
  - Habilidades (Primária: 13, Secundária: 7, Terciária: 5).
  - Disciplinas: 4 pontos.
  - Antecedentes: 5 pontos.
  - Virtudes: 7 pontos.
  - Pontos Bônus: 15 pontos.
  - Botão para restaurar os padrões oficiais a qualquer momento.

### 3. Assistente de Criação de Ficha
- **Ficha Zerada:**
  - Atributos: Todos começam com **1 bolinha** obrigatória.
  - Virtudes: Consciência/Convicção, Autocontrole/Instinto e Coragem começam com **1 bolinha** obrigatória.
  - Habilidades, Disciplinas e Antecedentes: Começam zerados (**0 bolinhas**).
  - Caminho inicial = Consciência + Autocontrole.
  - Força de Vontade inicial = Coragem.
- **Passo 1 (Definição de Prioridades):**
  - Jogador escolhe quais categorias são Primárias, Secundárias e Terciárias de Atributos e Habilidades.
- **Passo 2 (Distribuição dos Pontos Iniciais):**
  - Régua em tempo real indicando gastos vs. limite permitido.
  - Indicador visual verde quando a distribuição estiver completa.
- **Passo 3 (Distribuição dos 15 Pontos Bônus):**
  - Atributos: 5 pts por bola.
  - Habilidades: 2 pts por bola.
  - Antecedentes: 1 pt por bola.
  - Força de Vontade: 1 pt por bola.
  - Virtudes: 2 pts por bola.
  - Caminho: 1 pt por bola.
  - 3 Primeiras Disciplinas de Clã: 5 pts por bola (travadas como disciplinas iniciais).
  - Outras Disciplinas existentes: 7 pts por bola.
  - Nova Disciplina: 10 pts (1ª bola) / 7 pts (demais bolas).
- **Finalização:**
  - Botão "Finalizar Personagem" consolida a criação e libera a ficha para o modo de jogo padrão.
