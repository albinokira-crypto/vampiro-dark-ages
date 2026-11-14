function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Tratar requisições OPTIONS (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Rotas de API com banco de dados Cloudflare D1
    if (url.pathname.startsWith('/api/')) {
      const db = env.vampiro_db;
      if (!db) {
        return jsonResponse({ erro: 'Banco de dados D1 não vinculado.' }, 500);
      }

      try {
        // 1. REGISTRO DE USUÁRIO
        if (url.pathname === '/api/auth/register' && request.method === 'POST') {
          const body = await request.json();
          const { nome, email, senha, role = 'jogador' } = body;
          if (!nome || !email || !senha) {
            return jsonResponse({ erro: 'Preencha todos os campos obrigatórios.' }, 400);
          }

          const cleanEmail = email.trim().toLowerCase();
          const existente = await db.prepare('SELECT id FROM usuarios WHERE lower(email) = ?').bind(cleanEmail).first();
          if (existente) {
            return jsonResponse({ erro: 'Este e-mail já está cadastrado.' }, 409);
          }

          const id = 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
          await db.prepare(
            'INSERT INTO usuarios (id, nome, email, senha, role, criadoEm) VALUES (?, ?, ?, ?, ?, datetime("now"))'
          ).bind(id, nome.trim(), cleanEmail, senha, role).run();

          return jsonResponse({ id, nome: nome.trim(), email: cleanEmail, role });
        }

        // 2. LOGIN
        if (url.pathname === '/api/auth/login' && request.method === 'POST') {
          const body = await request.json();
          const { email, senha } = body;
          if (!email || !senha) {
            return jsonResponse({ erro: 'Informe e-mail e senha.' }, 400);
          }

          const cleanEmail = email.trim().toLowerCase();
          const user = await db.prepare(
            'SELECT id, nome, email, role FROM usuarios WHERE lower(email) = ? AND senha = ?'
          ).bind(cleanEmail, senha).first();

          if (!user) {
            return jsonResponse({ erro: 'E-mail ou senha incorretos.' }, 401);
          }

          return jsonResponse(user);
        }

        // 3. RECUPERAÇÃO DE SENHA
        if (url.pathname === '/api/auth/recuperar-senha' && request.method === 'POST') {
          const body = await request.json();
          const { email, novaSenha } = body;
          if (!email || !novaSenha) {
            return jsonResponse({ erro: 'Informe o e-mail e a nova senha.' }, 400);
          }

          const cleanEmail = email.trim().toLowerCase();
          const user = await db.prepare('SELECT id, nome FROM usuarios WHERE lower(email) = ?').bind(cleanEmail).first();
          if (!user) {
            return jsonResponse({ erro: 'E-mail não encontrado no registro da crônica.' }, 404);
          }

          await db.prepare('UPDATE usuarios SET senha = ? WHERE lower(email) = ?').bind(novaSenha, cleanEmail).run();
          return jsonResponse({ success: true, mensagem: 'Senha redefinida com sucesso! Você já pode entrar.' });
        }

        // 4. BUSCAR LOGIN ESQUECIDO (Por Nome de Jogador)
        if (url.pathname === '/api/auth/buscar-login' && request.method === 'POST') {
          const body = await request.json();
          const { nome } = body;
          if (!nome || nome.trim().length < 2) {
            return jsonResponse({ erro: 'Digite pelo menos 2 letras do seu nome.' }, 400);
          }

          const { results } = await db.prepare(
            'SELECT nome, email, role FROM usuarios WHERE lower(nome) LIKE ? LIMIT 5'
          ).bind(`%${nome.trim().toLowerCase()}%`).all();

          return jsonResponse(results || []);
        }

        // 5. LISTAR USUÁRIOS (Para o Mestre gerenciar e ver jogadores cadastrados)
        if (url.pathname === '/api/usuarios' && request.method === 'GET') {
          const { results } = await db.prepare(
            'SELECT id, nome, email, role, criadoEm FROM usuarios ORDER BY criadoEm DESC'
          ).all();
          return jsonResponse(results || []);
        }

        // 6. CONFIGURAÇÃO DA CRÔNICA / MESA
        if (url.pathname === '/api/config') {
          if (request.method === 'GET') {
            const configRow = await db.prepare('SELECT dados FROM configuracao_mesa WHERE id = "padrao"').first();
            if (configRow && configRow.dados) {
              return jsonResponse(JSON.parse(configRow.dados));
            }
            return jsonResponse(null);
          }

          if (request.method === 'POST') {
            const body = await request.json();
            const dadosStr = JSON.stringify(body);
            await db.prepare(
              'INSERT INTO configuracao_mesa (id, dados, atualizadoEm) VALUES ("padrao", ?, datetime("now")) ON CONFLICT(id) DO UPDATE SET dados = excluded.dados, atualizadoEm = excluded.atualizadoEm'
            ).bind(dadosStr).run();
            return jsonResponse({ success: true });
          }
        }

        // 7. PERSONAGENS (LISTAR)
        if (url.pathname === '/api/personagens' && request.method === 'GET') {
          const usuarioId = url.searchParams.get('usuarioId');
          const role = url.searchParams.get('role');

          let query = 'SELECT dados FROM personagens ORDER BY atualizadoEm DESC';
          let stmt;

          if (role === 'mestre') {
            stmt = db.prepare(query);
          } else if (usuarioId) {
            stmt = db.prepare('SELECT dados FROM personagens WHERE usuarioId = ? ORDER BY atualizadoEm DESC').bind(usuarioId);
          } else {
            return jsonResponse([]);
          }

          const { results } = await stmt.all();
          const personagens = (results || []).map(r => {
            try {
              return JSON.parse(r.dados);
            } catch {
              return null;
            }
          }).filter(Boolean);

          return jsonResponse(personagens);
        }

        // 8. PERSONAGEM (SALVAR / ATUALIZAR)
        if (url.pathname === '/api/personagens' && request.method === 'POST') {
          const personagem = await request.json();
          if (!personagem || !personagem.id || !personagem.usuarioId) {
            return jsonResponse({ erro: 'Dados do personagem inválidos.' }, 400);
          }

          const dadosStr = JSON.stringify(personagem);
          await db.prepare(`
            INSERT INTO personagens (id, usuarioId, nome, jogador, cla, geracao, foto, dados, atualizadoEm)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now"))
            ON CONFLICT(id) DO UPDATE SET
              usuarioId = excluded.usuarioId,
              nome = excluded.nome,
              jogador = excluded.jogador,
              cla = excluded.cla,
              geracao = excluded.geracao,
              foto = excluded.foto,
              dados = excluded.dados,
              atualizadoEm = excluded.atualizadoEm
          `).bind(
            personagem.id,
            personagem.usuarioId,
            personagem.nome || 'Sem Nome',
            personagem.jogador || '',
            personagem.cla || '',
            personagem.geracao || '',
            personagem.foto || null,
            dadosStr
          ).run();

          return jsonResponse({ success: true, personagem });
        }

        // 9. PERSONAGEM (EXCLUIR)
        if (url.pathname.startsWith('/api/personagens/') && request.method === 'DELETE') {
          const id = url.pathname.replace('/api/personagens/', '');
          await db.prepare('DELETE FROM personagens WHERE id = ?').bind(id).run();
          return jsonResponse({ success: true });
        }

        // 10. LOGS DE AUDITORIA EM TEMPO REAL (FEED DO MESTRE)
        if (url.pathname === '/api/logs') {
          if (request.method === 'GET') {
            const { results } = await db.prepare(
              'SELECT * FROM logs_alteracoes ORDER BY criadoEm DESC LIMIT 80'
            ).all();
            return jsonResponse(results || []);
          }

          if (request.method === 'POST') {
            const body = await request.json();
            const {
              personagemId,
              personagemNome,
              jogadorNome,
              tipo = 'geral',
              descricao,
              detalhes = '',
            } = body;

            if (!descricao) {
              return jsonResponse({ erro: 'Descrição é obrigatória.' }, 400);
            }

            const id = 'log_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
            await db.prepare(`
              INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
              VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))
            `).bind(
              id,
              personagemId || 'desconhecido',
              personagemNome || 'Personagem',
              jogadorNome || 'Jogador',
              tipo,
              descricao,
              detalhes
            ).run();

            return jsonResponse({ success: true, id });
          }

          if (request.method === 'DELETE') {
            await db.prepare('DELETE FROM logs_alteracoes').run();
            return jsonResponse({ success: true });
          }
        }

        return jsonResponse({ erro: 'Rota da API não encontrada.' }, 404);
      } catch (err) {
        return jsonResponse({ erro: 'Erro interno no servidor: ' + (err.message || String(err)) }, 500);
      }
    }

    // Servir arquivos estáticos (Vite SPA)
    try {
      let response = await env.ASSETS.fetch(request);
      if (response.status === 404 && !url.pathname.includes('.')) {
        return await env.ASSETS.fetch(new URL('/index.html', request.url));
      }
      return response;
    } catch {
      return await env.ASSETS.fetch(new URL('/index.html', request.url));
    }
  },
};
