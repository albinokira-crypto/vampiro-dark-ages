function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
    },
  });
}

async function enriquecerHierarquiaElisio(db, cfg) {
  if (cfg && cfg.elisio && Array.isArray(cfg.elisio.hierarquia)) {
    for (const cargo of cfg.elisio.hierarquia) {
      if (cargo.personagemId) {
        try {
          const charRow = await db.prepare(
            'SELECT id, nome, cla, geracao, foto, dados FROM personagens WHERE id = ?'
          ).bind(cargo.personagemId).first();
          if (charRow) {
            let pDados = {};
            try { pDados = JSON.parse(charRow.dados); } catch {}
            cargo.ocupanteNome = charRow.nome;
            cargo.ocupanteFoto = charRow.foto || '';
            cargo.ocupanteCla = charRow.cla || 'Cainita';
            cargo.ocupanteGeracao = charRow.geracao || '12ª Geração';
            cargo.ocupanteTipo = pDados.tipo || 'npc';
            cargo.ocupanteJogador = pDados.jogador || '';
            cargo.ocupanteHistoria = pDados.biografia?.historia || pDados.criacao?.historia || pDados.historia || '';
            cargo.ocupantePreludio = pDados.biografia?.preludio || pDados.criacao?.preludio || '';
            cargo.ocupanteObjetivos = pDados.biografia?.objetivos || pDados.criacao?.objetivos || '';
            cargo.ocupanteConceito = pDados.conceito || '';
            cargo.ocupanteNatureza = pDados.natureza || '';
            cargo.ocupanteComportamento = pDados.comportamento || '';
            cargo.ocupanteSenhor = pDados.senhor || '';
          }
        } catch {}
      }
    }
  }
  return cfg;
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
        // 1. REGISTRO DE USUÁRIO POR NICK
        if (url.pathname === '/api/auth/register' && request.method === 'POST') {
          const body = await request.json();
          const { nome, nick, senha, role = 'jogador', email = '' } = body;
          if (!nome || !nick || !senha) {
            return jsonResponse({ erro: 'Preencha o Nome, Nick e a Senha.' }, 400);
          }

          const cleanNick = nick.trim().toLowerCase().replace(/\s+/g, '');
          if (cleanNick.length < 2) {
            return jsonResponse({ erro: 'O Nick deve ter pelo menos 2 caracteres.' }, 400);
          }

          // REGRA DE OURO: Só pode haver 1 único login de Mestre no sistema
          if (role === 'mestre') {
            const mestreExistente = await db.prepare(
              "SELECT id, nome, nick FROM usuarios WHERE role = 'mestre'"
            ).first();
            if (mestreExistente) {
              return jsonResponse(
                {
                  erro: `A Crônica já possui um Mestre ativo (${mestreExistente.nome} - @${mestreExistente.nick}). Só pode haver um único Mestre no sistema. Novos membros devem se cadastrar como Jogador.`
                },
                403
              );
            }
          }

          const existente = await db.prepare(
            'SELECT id FROM usuarios WHERE lower(nick) = ?'
          ).bind(cleanNick).first();

          if (existente) {
            return jsonResponse({ erro: 'Este Nick já está em uso por outro membro da crônica. Escolha outro.' }, 409);
          }

          const cleanEmail = email ? email.trim().toLowerCase() : `${cleanNick}@darkages.local`;
          const id = 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

          await db.prepare(
            'INSERT INTO usuarios (id, nome, nick, email, senha, role, criadoEm) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))'
          ).bind(id, nome.trim(), cleanNick, cleanEmail, senha, role).run();

          // Registrar no feed do Mestre
          await db.prepare(`
            INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
            VALUES (?, 'sistema', 'Novo Acesso', ?, 'geral', ?, '', datetime("now"))
          `).bind(
            'log_' + Date.now().toString(36),
            cleanNick,
            `Novo cadastro realizado: "${nome.trim()}" (Nick: @${cleanNick}) como ${role.toUpperCase()}`
          ).run();

          return jsonResponse({ id, nome: nome.trim(), nick: cleanNick, email: cleanEmail, role });
        }

        // 2. LOGIN POR NICK (Com suporte a e-mail como fallback)
        if (url.pathname === '/api/auth/login' && request.method === 'POST') {
          const body = await request.json();
          const identificador = (body.nick || body.email || '').trim().toLowerCase();
          const { senha } = body;

          if (!identificador || !senha) {
            return jsonResponse({ erro: 'Informe seu Nick e sua Senha.' }, 400);
          }

          const user = await db.prepare(`
            SELECT id, nome, COALESCE(nick, lower(replace(nome, ' ', ''))) as nick, email, role 
            FROM usuarios 
            WHERE (lower(nick) = ? OR lower(email) = ? OR lower(nome) = ?) AND senha = ?
          `).bind(identificador, identificador, identificador, senha).first();

          if (!user) {
            return jsonResponse({ erro: 'Nick ou Senha incorretos.' }, 401);
          }

          return jsonResponse(user);
        }

        // 3. RECUPERAÇÃO DE SENHA POR NICK
        if (url.pathname === '/api/auth/recuperar-senha' && request.method === 'POST') {
          const body = await request.json();
          const identificador = (body.nick || body.email || '').trim().toLowerCase();
          const { novaSenha } = body;

          if (!identificador || !novaSenha) {
            return jsonResponse({ erro: 'Informe o Nick e a nova senha.' }, 400);
          }

          const user = await db.prepare(`
            SELECT id, nome, nick FROM usuarios 
            WHERE lower(nick) = ? OR lower(email) = ? OR lower(nome) = ?
          `).bind(identificador, identificador, identificador).first();

          if (!user) {
            return jsonResponse({ erro: 'Nick não encontrado no registro da crônica.' }, 404);
          }

          await db.prepare('UPDATE usuarios SET senha = ? WHERE id = ?').bind(novaSenha, user.id).run();

          // Registrar no feed do Mestre
          await db.prepare(`
            INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
            VALUES (?, 'sistema', 'Segurança', ?, 'geral', ?, '', datetime("now"))
          `).bind(
            'log_' + Date.now().toString(36),
            user.nick || user.nome,
            `Senha do jogador "${user.nome}" (@${user.nick}) foi redefinida.`
          ).run();

          return jsonResponse({ success: true, mensagem: `Senha do Nick @${user.nick || identificador} alterada com sucesso!` });
        }

        // 4. LOCALIZAR NICK ESQUECIDO (Por Nome)
        if (url.pathname === '/api/auth/buscar-login' && request.method === 'POST') {
          const body = await request.json();
          const { nome } = body;
          if (!nome || nome.trim().length < 2) {
            return jsonResponse({ erro: 'Digite pelo menos 2 letras do seu nome.' }, 400);
          }

          const { results } = await db.prepare(`
            SELECT nome, COALESCE(nick, lower(replace(nome, ' ', ''))) as nick, email, role 
            FROM usuarios 
            WHERE lower(nome) LIKE ? OR lower(nick) LIKE ? 
            LIMIT 5
          `).bind(`%${nome.trim().toLowerCase()}%`, `%${nome.trim().toLowerCase()}%`).all();

          return jsonResponse(results || []);
        }

        // 4.1. STATUS DE EXISTÊNCIA DE MESTRE NA CRÔNICA
        if (url.pathname === '/api/auth/status-mestre' && request.method === 'GET') {
          const mestre = await db.prepare(
            "SELECT id, nome, nick FROM usuarios WHERE role = 'mestre' LIMIT 1"
          ).first();
          return jsonResponse({
            temMestre: Boolean(mestre),
            mestreNome: mestre ? mestre.nome : null,
            mestreNick: mestre ? mestre.nick : null,
          });
        }

        // 5. LISTAR USUÁRIOS (Para o Mestre)
        if (url.pathname === '/api/usuarios' && request.method === 'GET') {
          const { results } = await db.prepare(`
            SELECT id, nome, COALESCE(nick, lower(replace(nome, ' ', ''))) as nick, email, role, criadoEm 
            FROM usuarios 
            ORDER BY criadoEm DESC
          `).all();
          return jsonResponse(results || []);
        }

        // 5.1. TRANSFERÊNCIA DE PRIVILÉGIOS DE MESTRE
        if (url.pathname === '/api/usuarios/transferir-mestre' && request.method === 'POST') {
          const body = await request.json();
          const { mestreAtualId, novoMestreId } = body;

          if (!mestreAtualId || !novoMestreId) {
            return jsonResponse({ erro: 'IDs dos usuários são obrigatórios.' }, 400);
          }

          const mestreAtual = await db.prepare(
            'SELECT id, nome, nick, role FROM usuarios WHERE id = ?'
          ).bind(mestreAtualId).first();

          if (!mestreAtual || mestreAtual.role !== 'mestre') {
            return jsonResponse(
              { erro: 'Apenas o Mestre ativo tem autorização para transferir seus privilégios.' },
              403
            );
          }

          const novoMestre = await db.prepare(
            'SELECT id, nome, nick, role FROM usuarios WHERE id = ?'
          ).bind(novoMestreId).first();

          if (!novoMestre) {
            return jsonResponse({ erro: 'O jogador selecionado não foi encontrado na crônica.' }, 404);
          }

          if (mestreAtualId === novoMestreId) {
            return jsonResponse({ erro: 'Você já é o Mestre da Crônica.' }, 400);
          }

          // Atualização atômica: antigo mestre vira jogador, novo mestre vira mestre
          await db.batch([
            db.prepare("UPDATE usuarios SET role = 'jogador' WHERE id = ?").bind(mestreAtualId),
            db.prepare("UPDATE usuarios SET role = 'mestre' WHERE id = ?").bind(novoMestreId)
          ]);

          // Registrar no feed de auditoria
          await db.prepare(`
            INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
            VALUES (?, 'sistema', 'Sucessão de Mestre', ?, 'geral', ?, '', datetime("now"))
          `).bind(
            'log_' + Date.now().toString(36),
            mestreAtual.nick,
            `👑 SUCESSÃO DE MESTRE: "${mestreAtual.nome}" (@${mestreAtual.nick}) transferiu o título de Mestre para "${novoMestre.nome}" (@${novoMestre.nick}).`
          ).run();

          return jsonResponse({
            success: true,
            mensagem: `Privilégios de Mestre transferidos com sucesso para ${novoMestre.nome} (@${novoMestre.nick})!`,
            novoMestre: { id: novoMestre.id, nome: novoMestre.nome, nick: novoMestre.nick, role: 'mestre' },
            antigoMestre: { id: mestreAtual.id, nome: mestreAtual.nome, nick: mestreAtual.nick, role: 'jogador' }
          });
        }

        // 6. EXCLUIR CADASTRO DE USUÁRIO (Mestre da Mesa)
        if (url.pathname.startsWith('/api/usuarios/') && request.method === 'DELETE') {
          const id = url.pathname.replace('/api/usuarios/', '');

          const user = await db.prepare('SELECT nome, nick FROM usuarios WHERE id = ?').bind(id).first();
          if (!user) {
            return jsonResponse({ erro: 'Usuário não encontrado.' }, 404);
          }

          // Excluir usuário
          await db.prepare('DELETE FROM usuarios WHERE id = ?').bind(id).run();

          // Excluir fichas associadas a esse usuário
          await db.prepare('DELETE FROM personagens WHERE usuarioId = ?').bind(id).run();

          // Registrar no feed do Mestre
          await db.prepare(`
            INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
            VALUES (?, 'sistema', 'Exclusão de Conta', ?, 'geral', ?, '', datetime("now"))
          `).bind(
            'log_' + Date.now().toString(36),
            'Mestre',
            `Cadastro do jogador "${user.nome}" (@${user.nick}) e suas fichas foram excluídos definitivamente pelo Mestre.`
          ).run();

          return jsonResponse({ success: true, mensagem: `Cadastro de @${user.nick} excluído com sucesso.` });
        }

        // 7. CONFIGURAÇÃO DA CRÔNICA / MESA
        if (url.pathname === '/api/config') {
          if (request.method === 'GET') {
            const configRow = await db.prepare('SELECT dados FROM configuracao_mesa WHERE id = "padrao"').first();
            if (configRow && configRow.dados) {
              const cfg = JSON.parse(configRow.dados);
              const precisavaEnriquecer = cfg?.elisio?.hierarquia?.some(c => c.personagemId && !c.ocupanteNome);
              await enriquecerHierarquiaElisio(db, cfg);
              if (precisavaEnriquecer) {
                try {
                  await db.prepare('UPDATE configuracao_mesa SET dados = ?, atualizadoEm = datetime("now") WHERE id = "padrao"').bind(JSON.stringify(cfg)).run();
                } catch {}
              }
              return jsonResponse(cfg);
            }
            return jsonResponse(null);
          }

          if (request.method === 'POST') {
            const body = await request.json();
            await enriquecerHierarquiaElisio(db, body);
            const dadosStr = JSON.stringify(body);
            await db.prepare(
              'INSERT INTO configuracao_mesa (id, dados, atualizadoEm) VALUES ("padrao", ?, datetime("now")) ON CONFLICT(id) DO UPDATE SET dados = excluded.dados, atualizadoEm = excluded.atualizadoEm'
            ).bind(dadosStr).run();
            return jsonResponse({ success: true });
          }
        }

        // 8. PERSONAGENS (LISTAR) - Sigilo Absoluto das Fichas e NPCs do Mestre
        if (url.pathname === '/api/personagens' && request.method === 'GET') {
          const usuarioId = url.searchParams.get('usuarioId');
          const role = url.searchParams.get('role');

          if (!usuarioId) {
            return jsonResponse([]);
          }

          let isMestreAutenticado = false;

          if (role === 'mestre') {
            const mestreRow = await db.prepare(
              "SELECT id FROM usuarios WHERE id = ? AND role = 'mestre'"
            ).bind(usuarioId).first();
            if (mestreRow) {
              isMestreAutenticado = true;
            }
          }

          let stmt;
          let mestreId = null;
          const mestreRow = await db.prepare("SELECT id FROM usuarios WHERE role = 'mestre'").first();
          if (mestreRow) {
            mestreId = mestreRow.id;
          }

          if (isMestreAutenticado) {
            // Mestre autenticado tem visão completa de todas as fichas e NPCs da crônica
            stmt = db.prepare('SELECT dados FROM personagens ORDER BY atualizadoEm DESC');
          } else {
            // Jogador: Tem visão dos seus personagens e de outros jogadores, mas NUNCA NPCs ou fichas criadas pelo Mestre
            if (mestreId) {
              stmt = db.prepare('SELECT dados FROM personagens WHERE tipo != "npc" AND usuarioId != ? ORDER BY atualizadoEm DESC').bind(mestreId);
            } else {
              stmt = db.prepare('SELECT dados FROM personagens WHERE tipo != "npc" ORDER BY atualizadoEm DESC');
            }
          }

          const { results } = await stmt.all();
          const personagens = (results || []).map(r => {
            try {
              return JSON.parse(r.dados);
            } catch {
              return null;
            }
          }).filter(p => {
            if (!p) return false;
            if (!isMestreAutenticado) {
              // Garantia adicional de sigilo em nível de backend:
              // Se não for o Mestre autenticado, nunca retorna fichas do Mestre nem NPCs
              if (p.tipo === 'npc') return false;
              if (mestreId && p.usuarioId === mestreId) return false;
            }
            return true;
          });

          return jsonResponse(personagens);
        }

        // 9. PERSONAGEM (SALVAR / ATUALIZAR)
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

        // 10. PERSONAGEM (EXCLUIR)
        if (url.pathname.startsWith('/api/personagens/') && request.method === 'DELETE') {
          const id = url.pathname.replace('/api/personagens/', '');
          await db.prepare('DELETE FROM personagens WHERE id = ?').bind(id).run();
          return jsonResponse({ success: true });
        }

        // 11. LOGS DE AUDITORIA EM TEMPO REAL (FEED EXCLUSIVO DO MESTRE)
        if (url.pathname === '/api/logs') {
          if (request.method === 'GET') {
            const usuarioId = url.searchParams.get('usuarioId');
            if (usuarioId) {
              const mestre = await db.prepare("SELECT id FROM usuarios WHERE id = ? AND role = 'mestre'").bind(usuarioId).first();
              if (!mestre) {
                return jsonResponse([]);
              }
            }
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
