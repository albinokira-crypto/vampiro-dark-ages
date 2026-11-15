var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
__name(jsonResponse, "jsonResponse");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }
    if (url.pathname.startsWith("/api/")) {
      const db = env.vampiro_db;
      if (!db) {
        return jsonResponse({ erro: "Banco de dados D1 n\xE3o vinculado." }, 500);
      }
      try {
        if (url.pathname === "/api/auth/register" && request.method === "POST") {
          const body = await request.json();
          const { nome, nick, senha, role = "jogador", email = "" } = body;
          if (!nome || !nick || !senha) {
            return jsonResponse({ erro: "Preencha o Nome, Nick e a Senha." }, 400);
          }
          const cleanNick = nick.trim().toLowerCase().replace(/\s+/g, "");
          if (cleanNick.length < 2) {
            return jsonResponse({ erro: "O Nick deve ter pelo menos 2 caracteres." }, 400);
          }
          if (role === "mestre") {
            const mestreExistente = await db.prepare(
              "SELECT id, nome, nick FROM usuarios WHERE role = 'mestre'"
            ).first();
            if (mestreExistente) {
              return jsonResponse(
                {
                  erro: `A Cr\xF4nica j\xE1 possui um Mestre ativo (${mestreExistente.nome} - @${mestreExistente.nick}). S\xF3 pode haver um \xFAnico Mestre no sistema. Novos membros devem se cadastrar como Jogador.`
                },
                403
              );
            }
          }
          const existente = await db.prepare(
            "SELECT id FROM usuarios WHERE lower(nick) = ?"
          ).bind(cleanNick).first();
          if (existente) {
            return jsonResponse({ erro: "Este Nick j\xE1 est\xE1 em uso por outro membro da cr\xF4nica. Escolha outro." }, 409);
          }
          const cleanEmail = email ? email.trim().toLowerCase() : `${cleanNick}@darkages.local`;
          const id = "usr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
          await db.prepare(
            'INSERT INTO usuarios (id, nome, nick, email, senha, role, criadoEm) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))'
          ).bind(id, nome.trim(), cleanNick, cleanEmail, senha, role).run();
          await db.prepare(`
            INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
            VALUES (?, 'sistema', 'Novo Acesso', ?, 'geral', ?, '', datetime("now"))
          `).bind(
            "log_" + Date.now().toString(36),
            cleanNick,
            `Novo cadastro realizado: "${nome.trim()}" (Nick: @${cleanNick}) como ${role.toUpperCase()}`
          ).run();
          return jsonResponse({ id, nome: nome.trim(), nick: cleanNick, email: cleanEmail, role });
        }
        if (url.pathname === "/api/auth/login" && request.method === "POST") {
          const body = await request.json();
          const identificador = (body.nick || body.email || "").trim().toLowerCase();
          const { senha } = body;
          if (!identificador || !senha) {
            return jsonResponse({ erro: "Informe seu Nick e sua Senha." }, 400);
          }
          const user = await db.prepare(`
            SELECT id, nome, COALESCE(nick, lower(replace(nome, ' ', ''))) as nick, email, role 
            FROM usuarios 
            WHERE (lower(nick) = ? OR lower(email) = ? OR lower(nome) = ?) AND senha = ?
          `).bind(identificador, identificador, identificador, senha).first();
          if (!user) {
            return jsonResponse({ erro: "Nick ou Senha incorretos." }, 401);
          }
          return jsonResponse(user);
        }
        if (url.pathname === "/api/auth/recuperar-senha" && request.method === "POST") {
          const body = await request.json();
          const identificador = (body.nick || body.email || "").trim().toLowerCase();
          const { novaSenha } = body;
          if (!identificador || !novaSenha) {
            return jsonResponse({ erro: "Informe o Nick e a nova senha." }, 400);
          }
          const user = await db.prepare(`
            SELECT id, nome, nick FROM usuarios 
            WHERE lower(nick) = ? OR lower(email) = ? OR lower(nome) = ?
          `).bind(identificador, identificador, identificador).first();
          if (!user) {
            return jsonResponse({ erro: "Nick n\xE3o encontrado no registro da cr\xF4nica." }, 404);
          }
          await db.prepare("UPDATE usuarios SET senha = ? WHERE id = ?").bind(novaSenha, user.id).run();
          await db.prepare(`
            INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
            VALUES (?, 'sistema', 'Seguran\xE7a', ?, 'geral', ?, '', datetime("now"))
          `).bind(
            "log_" + Date.now().toString(36),
            user.nick || user.nome,
            `Senha do jogador "${user.nome}" (@${user.nick}) foi redefinida.`
          ).run();
          return jsonResponse({ success: true, mensagem: `Senha do Nick @${user.nick || identificador} alterada com sucesso!` });
        }
        if (url.pathname === "/api/auth/buscar-login" && request.method === "POST") {
          const body = await request.json();
          const { nome } = body;
          if (!nome || nome.trim().length < 2) {
            return jsonResponse({ erro: "Digite pelo menos 2 letras do seu nome." }, 400);
          }
          const { results } = await db.prepare(`
            SELECT nome, COALESCE(nick, lower(replace(nome, ' ', ''))) as nick, email, role 
            FROM usuarios 
            WHERE lower(nome) LIKE ? OR lower(nick) LIKE ? 
            LIMIT 5
          `).bind(`%${nome.trim().toLowerCase()}%`, `%${nome.trim().toLowerCase()}%`).all();
          return jsonResponse(results || []);
        }
        if (url.pathname === "/api/auth/status-mestre" && request.method === "GET") {
          const mestre = await db.prepare(
            "SELECT id, nome, nick FROM usuarios WHERE role = 'mestre' LIMIT 1"
          ).first();
          return jsonResponse({
            temMestre: Boolean(mestre),
            mestreNome: mestre ? mestre.nome : null,
            mestreNick: mestre ? mestre.nick : null
          });
        }
        if (url.pathname === "/api/usuarios" && request.method === "GET") {
          const { results } = await db.prepare(`
            SELECT id, nome, COALESCE(nick, lower(replace(nome, ' ', ''))) as nick, email, role, criadoEm 
            FROM usuarios 
            ORDER BY criadoEm DESC
          `).all();
          return jsonResponse(results || []);
        }
        if (url.pathname === "/api/usuarios/transferir-mestre" && request.method === "POST") {
          const body = await request.json();
          const { mestreAtualId, novoMestreId } = body;
          if (!mestreAtualId || !novoMestreId) {
            return jsonResponse({ erro: "IDs dos usu\xE1rios s\xE3o obrigat\xF3rios." }, 400);
          }
          const mestreAtual = await db.prepare(
            "SELECT id, nome, nick, role FROM usuarios WHERE id = ?"
          ).bind(mestreAtualId).first();
          if (!mestreAtual || mestreAtual.role !== "mestre") {
            return jsonResponse(
              { erro: "Apenas o Mestre ativo tem autoriza\xE7\xE3o para transferir seus privil\xE9gios." },
              403
            );
          }
          const novoMestre = await db.prepare(
            "SELECT id, nome, nick, role FROM usuarios WHERE id = ?"
          ).bind(novoMestreId).first();
          if (!novoMestre) {
            return jsonResponse({ erro: "O jogador selecionado n\xE3o foi encontrado na cr\xF4nica." }, 404);
          }
          if (mestreAtualId === novoMestreId) {
            return jsonResponse({ erro: "Voc\xEA j\xE1 \xE9 o Mestre da Cr\xF4nica." }, 400);
          }
          await db.batch([
            db.prepare("UPDATE usuarios SET role = 'jogador' WHERE id = ?").bind(mestreAtualId),
            db.prepare("UPDATE usuarios SET role = 'mestre' WHERE id = ?").bind(novoMestreId)
          ]);
          await db.prepare(`
            INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
            VALUES (?, 'sistema', 'Sucess\xE3o de Mestre', ?, 'geral', ?, '', datetime("now"))
          `).bind(
            "log_" + Date.now().toString(36),
            mestreAtual.nick,
            `\u{1F451} SUCESS\xC3O DE MESTRE: "${mestreAtual.nome}" (@${mestreAtual.nick}) transferiu o t\xEDtulo de Mestre para "${novoMestre.nome}" (@${novoMestre.nick}).`
          ).run();
          return jsonResponse({
            success: true,
            mensagem: `Privil\xE9gios de Mestre transferidos com sucesso para ${novoMestre.nome} (@${novoMestre.nick})!`,
            novoMestre: { id: novoMestre.id, nome: novoMestre.nome, nick: novoMestre.nick, role: "mestre" },
            antigoMestre: { id: mestreAtual.id, nome: mestreAtual.nome, nick: mestreAtual.nick, role: "jogador" }
          });
        }
        if (url.pathname.startsWith("/api/usuarios/") && request.method === "DELETE") {
          const id = url.pathname.replace("/api/usuarios/", "");
          const user = await db.prepare("SELECT nome, nick FROM usuarios WHERE id = ?").bind(id).first();
          if (!user) {
            return jsonResponse({ erro: "Usu\xE1rio n\xE3o encontrado." }, 404);
          }
          await db.prepare("DELETE FROM usuarios WHERE id = ?").bind(id).run();
          await db.prepare("DELETE FROM personagens WHERE usuarioId = ?").bind(id).run();
          await db.prepare(`
            INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
            VALUES (?, 'sistema', 'Exclus\xE3o de Conta', ?, 'geral', ?, '', datetime("now"))
          `).bind(
            "log_" + Date.now().toString(36),
            "Mestre",
            `Cadastro do jogador "${user.nome}" (@${user.nick}) e suas fichas foram exclu\xEDdos definitivamente pelo Mestre.`
          ).run();
          return jsonResponse({ success: true, mensagem: `Cadastro de @${user.nick} exclu\xEDdo com sucesso.` });
        }
        if (url.pathname === "/api/config") {
          if (request.method === "GET") {
            const configRow = await db.prepare('SELECT dados FROM configuracao_mesa WHERE id = "padrao"').first();
            if (configRow && configRow.dados) {
              return jsonResponse(JSON.parse(configRow.dados));
            }
            return jsonResponse(null);
          }
          if (request.method === "POST") {
            const body = await request.json();
            const dadosStr = JSON.stringify(body);
            await db.prepare(
              'INSERT INTO configuracao_mesa (id, dados, atualizadoEm) VALUES ("padrao", ?, datetime("now")) ON CONFLICT(id) DO UPDATE SET dados = excluded.dados, atualizadoEm = excluded.atualizadoEm'
            ).bind(dadosStr).run();
            return jsonResponse({ success: true });
          }
        }
        if (url.pathname === "/api/personagens" && request.method === "GET") {
          const usuarioId = url.searchParams.get("usuarioId");
          const role = url.searchParams.get("role");
          if (!usuarioId) {
            return jsonResponse([]);
          }
          let isMestreAutenticado = false;
          if (role === "mestre") {
            const mestreRow2 = await db.prepare(
              "SELECT id FROM usuarios WHERE id = ? AND role = 'mestre'"
            ).bind(usuarioId).first();
            if (mestreRow2) {
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
            stmt = db.prepare("SELECT dados FROM personagens ORDER BY atualizadoEm DESC");
          } else {
            if (mestreId) {
              stmt = db.prepare('SELECT dados FROM personagens WHERE tipo != "npc" AND usuarioId != ? ORDER BY atualizadoEm DESC').bind(mestreId);
            } else {
              stmt = db.prepare('SELECT dados FROM personagens WHERE tipo != "npc" ORDER BY atualizadoEm DESC');
            }
          }
          const { results } = await stmt.all();
          const personagens = (results || []).map((r) => {
            try {
              return JSON.parse(r.dados);
            } catch {
              return null;
            }
          }).filter((p) => {
            if (!p) return false;
            if (!isMestreAutenticado) {
              if (p.tipo === "npc") return false;
              if (mestreId && p.usuarioId === mestreId) return false;
            }
            return true;
          });
          return jsonResponse(personagens);
        }
        if (url.pathname === "/api/personagens" && request.method === "POST") {
          const personagem = await request.json();
          if (!personagem || !personagem.id || !personagem.usuarioId) {
            return jsonResponse({ erro: "Dados do personagem inv\xE1lidos." }, 400);
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
            personagem.nome || "Sem Nome",
            personagem.jogador || "",
            personagem.cla || "",
            personagem.geracao || "",
            personagem.foto || null,
            dadosStr
          ).run();
          return jsonResponse({ success: true, personagem });
        }
        if (url.pathname.startsWith("/api/personagens/") && request.method === "DELETE") {
          const id = url.pathname.replace("/api/personagens/", "");
          await db.prepare("DELETE FROM personagens WHERE id = ?").bind(id).run();
          return jsonResponse({ success: true });
        }
        if (url.pathname === "/api/logs") {
          if (request.method === "GET") {
            const usuarioId = url.searchParams.get("usuarioId");
            if (usuarioId) {
              const mestre = await db.prepare("SELECT id FROM usuarios WHERE id = ? AND role = 'mestre'").bind(usuarioId).first();
              if (!mestre) {
                return jsonResponse([]);
              }
            }
            const { results } = await db.prepare(
              "SELECT * FROM logs_alteracoes ORDER BY criadoEm DESC LIMIT 80"
            ).all();
            return jsonResponse(results || []);
          }
          if (request.method === "POST") {
            const body = await request.json();
            const {
              personagemId,
              personagemNome,
              jogadorNome,
              tipo = "geral",
              descricao,
              detalhes = ""
            } = body;
            if (!descricao) {
              return jsonResponse({ erro: "Descri\xE7\xE3o \xE9 obrigat\xF3ria." }, 400);
            }
            const id = "log_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
            await db.prepare(`
              INSERT INTO logs_alteracoes (id, personagemId, personagemNome, jogadorNome, tipo, descricao, detalhes, criadoEm)
              VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))
            `).bind(
              id,
              personagemId || "desconhecido",
              personagemNome || "Personagem",
              jogadorNome || "Jogador",
              tipo,
              descricao,
              detalhes
            ).run();
            return jsonResponse({ success: true, id });
          }
          if (request.method === "DELETE") {
            await db.prepare("DELETE FROM logs_alteracoes").run();
            return jsonResponse({ success: true });
          }
        }
        return jsonResponse({ erro: "Rota da API n\xE3o encontrada." }, 404);
      } catch (err) {
        return jsonResponse({ erro: "Erro interno no servidor: " + (err.message || String(err)) }, 500);
      }
    }
    try {
      let response = await env.ASSETS.fetch(request);
      if (response.status === 404 && !url.pathname.includes(".")) {
        return await env.ASSETS.fetch(new URL("/index.html", request.url));
      }
      return response;
    } catch {
      return await env.ASSETS.fetch(new URL("/index.html", request.url));
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
