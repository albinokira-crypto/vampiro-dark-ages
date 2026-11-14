-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'jogador',
  criadoEm TEXT NOT NULL
);

-- Tabela de Configuração da Mesa (Mestre)
CREATE TABLE IF NOT EXISTS configuracao_mesa (
  id TEXT PRIMARY KEY,
  dados TEXT NOT NULL,
  atualizadoEm TEXT NOT NULL
);

-- Tabela de Personagens (com suporte a foto Base64 e dados completos em JSON)
CREATE TABLE IF NOT EXISTS personagens (
  id TEXT PRIMARY KEY,
  usuarioId TEXT NOT NULL,
  nome TEXT NOT NULL,
  jogador TEXT,
  cla TEXT,
  geracao TEXT,
  foto TEXT,
  dados TEXT NOT NULL,
  atualizadoEm TEXT NOT NULL
);

-- Tabela de Logs de Alterações em Tempo Real (Mestre)
CREATE TABLE IF NOT EXISTS logs_alteracoes (
  id TEXT PRIMARY KEY,
  personagemId TEXT NOT NULL,
  personagemNome TEXT NOT NULL,
  jogadorNome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  detalhes TEXT,
  criadoEm TEXT NOT NULL
);

-- Inserir usuário mestre padrão se não existir
INSERT OR IGNORE INTO usuarios (id, nome, email, senha, role, criadoEm)
VALUES ('mestre_demo', 'Mestre Alucard', 'mestre@darkages.com', '123', 'mestre', datetime('now'));

-- Inserir usuário jogador padrão se não existir
INSERT OR IGNORE INTO usuarios (id, nome, email, senha, role, criadoEm)
VALUES ('jogador_demo', 'Julian, o Cavaleiro', 'jogador@darkages.com', '123', 'jogador', datetime('now'));
