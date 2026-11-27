import type { DisciplinaTestesInfo } from './testesDisciplinas1E';

export const OUTRAS_DISCIPLINAS_TESTES: DisciplinaTestesInfo[] = [
  // =========================================================================
  // 1. ELECTROS / ELECTRUX (Crias de Tempestade — Fã / Brasil 1998)
  // =========================================================================
  {
    id: 'electros',
    nome: 'Electros (Electrux)',
    nomeIngles: 'Electros / Electrux (Crias de Tempestade)',
    clasTipicos: ['Crias de Tempestade'],
    descricaoGeral:
      'Disciplina desenvolvida por Beatrix no século XVI após sobreviver a um raio do Tremere Juan. Todo dano causado por seus efeitos é LETAL. Consome Pontos de Energia (limite máximo igual à reserva máxima de sangue).',
    poderes: [
      {
        nomePoder: 'Toque do Elétron',
        nivel: 1,
        paradaDados: 'Raciocínio + Prontidão',
        dificuldade: '6',
        custo: '1 Ponto de Energia',
        duracao: 'Instantânea',
        efeito:
          'O personagem precisa tocar a vítima dando-lhe um choque elétrico que causa dano letal. Cada sucesso obtido inflige 1 nível de vitalidade de dano.',
        livroFonte: 'Crias de Tempestade (1998)',
      },
      {
        nomePoder: 'Tração Magnética',
        nivel: 2,
        paradaDados: 'Raciocínio + Manha',
        dificuldade: '6',
        custo: '2 Pontos de Energia',
        duracao: 'Cena / Ativa',
        efeito:
          'Atrai objetos metálicos por magnetismo (também permite magnetismo reverso): 1 suc. = campo de 2 m; 2 suc. = 4 m; 3 suc. = tração focalizada a 4 m; 4 suc. = tração focalizada a 10 m; 5+ suc. = tração focalizada a qualquer distância dentro do campo de visão.',
        livroFonte: 'Crias de Tempestade (1998)',
      },
      {
        nomePoder: 'Raio',
        nivel: 3,
        paradaDados: 'Inteligência + Prontidão',
        dificuldade: '6',
        custo: '3 Pontos de Energia + 1 Ponto de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Dispara um raio pelas mãos contra o alvo: 1 suc. = clarão (+2 na dificuldade de todos ao redor no turno seguinte); 2 suc. = raio de 220V (1d10 letal); 3 suc. = raio de 750V (3d10 letal); 4 suc. = raio mortal para humanos (8d10 letal); 5 suc. = raio forte o bastante para alimentar uma cidade por 1 noite (15d10 letal).',
        livroFonte: 'Crias de Tempestade (1998)',
      },
      {
        nomePoder: 'Movimento Magnético',
        nivel: 4,
        paradaDados: 'Destreza + Armas Brancas',
        dificuldade: '6',
        custo: '4 Pontos de Energia (+1 Sangue p/ arremessar)',
        duracao: 'Por turno / cena',
        efeito:
          'Move objetos metálicos na linha de visão conforme os sucessos: 1 suc. = arrasta até 300 g (sem levitar); 2 suc. = levita até 1 kg; 3 suc. = levita até 3 kg; 4 suc. = levita até 7 kg; 5 suc. = levita até 15 kg. Arremessar o objeto exige gasto adicional de 1 Ponto de Sangue.',
        livroFonte: 'Crias de Tempestade (1998)',
      },
      {
        nomePoder: 'Sedução Magnética',
        nivel: 5,
        paradaDados: 'Autocontrole + Inteligência',
        dificuldade: '6',
        custo: '5 Pontos de Energia + 1 Ponto de Sangue',
        duracao: 'Cena / Turno',
        efeito:
          'Neutraliza a gravidade ao redor permitindo levitar: 1 suc. = 1 m de altura (sem mover horizontalmente); 2 suc. = 3 m altura / 2 m horizontal; 3 suc. = 9 m altura / 3 m horizontal; 4 suc. = 17 m altura / 4 m horizontal; 5 suc. = 30 m altura / 10 m horizontal. Só funciona no detentor e fere quem tentar tocá-lo ou deslocar-se junto.',
        livroFonte: 'Crias de Tempestade (1998)',
      },
      {
        nomePoder: 'Escudo Magnético',
        nivel: 6,
        paradaDados: 'Vigor + Prontidão',
        dificuldade: '6',
        custo: '6 Pontos de Energia + 1 Ponto de Sangue',
        duracao: 'Até ser desativado',
        efeito:
          'Defende contra qualquer objeto de metal que entre no campo magnético, prendendo-os até o escudo ser desativado: 1 suc. = 0,5 m; 2 suc. = 1 m; 3 suc. = 1,5 m; 4 suc. = 2 m; 5 suc. = 3 m de raio ao redor do corpo.',
        livroFonte: 'Crias de Tempestade (1998)',
        variacao: 'Poder de Ancião',
      },
      {
        nomePoder: 'Força Magnética',
        nivel: 7,
        paradaDados: 'Percepção + Manha',
        dificuldade: '6',
        custo: '7 Pontos de Energia',
        duracao: 'Instantânea',
        efeito:
          'Permite entortar ou quebrar objetos metálicos à distância; o número de sucessos determina a intensidade e resistência máxima rompida.',
        livroFonte: 'Crias de Tempestade (1998)',
        variacao: 'Poder de Ancião',
      },
      {
        nomePoder: 'Sedução Magnética Focada',
        nivel: 8,
        paradaDados: 'Autocontrole + Inteligência',
        dificuldade: '6',
        custo: '8 Pontos de Energia + 1 Ponto de Sangue',
        duracao: 'Cena / Turno',
        efeito:
          'Permite levitar outra pessoa (de até 120 kg) aplicando os alcances e sucessos de Sedução Magnética.',
        livroFonte: 'Crias de Tempestade (1998)',
        variacao: 'Poder de Matusalém',
      },
      {
        nomePoder: 'Sedução Magnética Conjunta',
        nivel: 9,
        paradaDados: 'Autocontrole + Inteligência',
        dificuldade: '6',
        custo: '9 Pontos de Energia + 2 Pontos de Sangue',
        duracao: 'Cena / Turno',
        efeito:
          'Permite levitar a si mesmo e outra pessoa ao mesmo tempo utilizando a mecânica de Sedução Magnética.',
        livroFonte: 'Crias de Tempestade (1998)',
        variacao: 'Poder de Matusalém',
      },
      {
        nomePoder: 'Electrus Corpus',
        nivel: 10,
        paradaDados: 'Inteligência + Prontidão',
        dificuldade: '6',
        custo: '10 Pontos de Energia',
        duracao: 'Deslocamento',
        efeito:
          'O vampiro transforma-se em energia pura e penetra na corrente elétrica, deslocando-se na velocidade da própria eletricidade.',
        livroFonte: 'Crias de Tempestade (1998)',
        variacao: 'Poder de Antediluviano / Beatrix',
      },
    ],
  },

  // =========================================================================
  // 2. DAIMOINON (Baali)
  // =========================================================================
  {
    id: 'daimoinon',
    nome: 'Daimoinon',
    nomeIngles: 'Daimoinon',
    clasTipicos: ['Baali'],
    descricaoGeral:
      'Disciplina infernal exclusiva dos Baali e diabolistas, voltada a explorar pecados ocultos, pavor sobrenatural e fogo infernal.',
    poderes: [
      {
        nomePoder: 'Sentir o Pecado (Sense the Sin)',
        nivel: 1,
        paradaDados: 'Percepção + Empatia',
        dificuldade: 'Variável (conforme culpa oculta)',
        custo: 'Nenhum',
        duracao: 'Instantânea',
        efeito:
          'Permite detectar os vícios, falhas espirituais, segredos obscuros e corrupção interior de um alvo observado.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Medo do Vazio Acima (Fear of the Void Above)',
        nivel: 2,
        paradaDados: 'Manipulação + Intimidação',
        dificuldade: 'Força de Vontade do alvo',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena / Conforme sucessos',
        efeito:
          'Instila terror sobrenatural paralisante na vítima, expondo sua insignificância perante o vazio infernal.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Chamado dos Mortos Famintos (Call of the Hungry Dead)',
        nivel: 3,
        paradaDados: 'Manipulação + Ocultismo',
        dificuldade: '7',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Invoca tormentos e espectros inquietos para assombrar, distrair ou atacar inimigos próximos.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Conflagração (Conflagration)',
        nivel: 4,
        paradaDados: 'Manipulação + Ocultismo',
        dificuldade: '7',
        custo: '1 Ponto de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Canaliza chamas infernais à distância sem necessidade de toque físico, causando dano agravado no alvo.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Barganha Infernal / Toque Desfigurador',
        nivel: 5,
        paradaDados: 'Carisma ou Manipulação + Ocultismo',
        dificuldade: 'Força de Vontade do alvo',
        custo: 'Variável (Sangue / Força de Vontade)',
        duracao: 'Permanente / Prolongada',
        efeito:
          'Invoca corrupção pesada, pactos demoníacos ou distorções físicas e mentais profundas em suas vítimas.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 3. TEMPORIS (Verdadeiros Brujah)
  // =========================================================================
  {
    id: 'temporis',
    nome: 'Temporis',
    nomeIngles: 'Temporis',
    clasTipicos: ['Verdadeiros Brujah'],
    descricaoGeral:
      'Arte temporal guardada pelos Verdadeiros Brujah, distorcendo a percepção, o fluxo e a velocidade local do tempo (exige extremo controle para não ferir o próprio usuário).',
    poderes: [
      {
        nomePoder: 'Cadência do Tempo (Time Sense / Pacing)',
        nivel: 1,
        paradaDados: 'Destreza ou Percepção + Prontidão',
        dificuldade: '6',
        custo: '1 Ponto de Sangue (ou Passivo)',
        duracao: 'Cena / Turno',
        efeito:
          'Confere noção cronológica exata e ligeiros saltos ou ajustes temporais nos reflexos imediatos do usuário.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'A Perseguição Paciente (The Patient Chase)',
        nivel: 2,
        paradaDados: 'Raciocínio + Esportes (ou Manipulação + Lábia)',
        dificuldade: 'Vigor ou Raciocínio do alvo',
        custo: '1 Ponto de Sangue',
        duracao: 'Turnos conforme sucessos',
        efeito:
          'Desacelera a percepção temporal ou o ritmo físico de um oponente no fluxo do tempo.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Conteúdo da Ampulheta (Contents of the Hourglass)',
        nivel: 3,
        paradaDados: 'Inteligência + Ocultismo',
        dificuldade: '6–7',
        custo: '1+ Pontos de Sangue',
        duracao: 'Cena / Permanente em objetos',
        efeito:
          'Altera o senso de passagem do tempo de uma vítima ou acelera/envelhece objetos e ferimentos localizados.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Eras Passadas (Ages Past)',
        nivel: 4,
        paradaDados: 'Inteligência + Ocultismo',
        dificuldade: 'Força de Vontade do alvo',
        custo: '2 Pontos de Sangue',
        duracao: 'Temporária',
        efeito:
          'Empurra um alvo para frente ou para trás em seu estado físico/temporal anterior ou futuro.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Dádiva de Cloto (Clotho’s Gift)',
        nivel: 5,
        paradaDados: 'Automática / Risco de choque temporal',
        dificuldade: '—',
        custo: 'Pontos de Sangue + Risco de dano letal inabsorvível',
        duracao: '1 Turno',
        efeito:
          'Passo fora da corrente do tempo que concede múltiplas ações extras no turno; seu abuso ou falha causa dano letal não absorvível proporcional ao nível em Temporis.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 4. VISCERATIKA (Gárgulas)
  // =========================================================================
  {
    id: 'visceratika',
    nome: 'Visceratika',
    nomeIngles: 'Visceratika',
    clasTipicos: ['Gárgulas'],
    descricaoGeral:
      'Disciplina pétrea exclusiva das Gárgulas, conferindo afinidade com pedra, paredes, camuflagem mineral e resistência estrutural.',
    poderes: [
      {
        nomePoder: 'Sussurros da Pedra (Scry the Hearthstone)',
        nivel: 1,
        paradaDados: 'Percepção + Prontidão',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Concentração',
        efeito:
          'Estende os sentidos através das paredes e estruturas de pedra ligadas ao refúgio ou local tocado pelo Gárgula.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Armadura da Terra (Armor of Earth)',
        nivel: 2,
        paradaDados: 'Vigor + Sobrevivência',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Reveste a pele do Gárgula com crosta mineral espessa, adicionando dados extras diretamente à sua parada de absorção.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Vínculo com a Montanha (Bond with the Mountain)',
        nivel: 3,
        paradaDados: 'Vigor + Sobrevivência',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Até sair',
        efeito:
          'Permite fundir o corpo físico diretamente à rocha sólida ou paredes de pedra, ficando protegido da luz solar.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Caminhar na Rocha (Stone Travel)',
        nivel: 4,
        paradaDados: 'Vigor + Atletismo / Sobrevivência',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena',
        efeito:
          'Permite atravessar e mover-se através de pedra sólida e construções rochosas como se nadasse em água.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Coração de Pedra (Heart of Stone)',
        nivel: 5,
        paradaDados: 'Vigor + Ocultismo (ou Passivo)',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena / Permanente parcial',
        efeito:
          'Transforma o âmago interno em pedra pura, conferindo enorme resiliência física e imunidade a diversas manipulações mentais e emocionais.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 5. VOO (Flight — Gárgulas)
  // =========================================================================
  {
    id: 'voo_gargula',
    nome: 'Voo',
    nomeIngles: 'Flight',
    clasTipicos: ['Gárgulas'],
    descricaoGeral:
      'Disciplina física inerente às asas de pedra das Gárgulas, evoluindo do simples planeio até manobras aéreas em tempestades.',
    poderes: [
      {
        nomePoder: 'Asas da Tempestade (Leap / Glide)',
        nivel: 1,
        paradaDados: 'Vigor + Esportes',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Concede saltos poderosos e planeio aéreo controlado a partir de lugares elevados sem sofrer dano de queda.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Pairar no Ar (Draft-Rider / Hover)',
        nivel: 2,
        paradaDados: 'Raciocínio + Sobrevivência',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Aproveita correntes térmicas e permite pairar imóvel no ar ou ganhar altitude sem exaustão.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Voo Verdadeiro / Mergulho (Flight / Dive-Bomb)',
        nivel: 3,
        paradaDados: 'Destreza + Esportes',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Permite voo autopropelido completo e ataques em mergulho vertical convertendo velocidade em dano adicional.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Domínio do Ar (Aero-Kinesis)',
        nivel: 4,
        paradaDados: 'Vigor + Esportes',
        dificuldade: '7',
        custo: '1 Ponto de Sangue',
        duracao: 'Turnos',
        efeito:
          'Manipula a pressão do ar ao redor do corpo para desviar projéteis à distância, frear quedas ou empurrar alvos.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Mestria do Furacão (Hurricane Force)',
        nivel: 5,
        paradaDados: 'Destreza + Sobrevivência',
        dificuldade: '7',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Voo veloz capaz de enfrentar vendavais, carregar passageiros e gerar rajadas concentradas para derrubar adversários.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 6. OBEAH (Salubri Curandeiros)
  // =========================================================================
  {
    id: 'obeah',
    nome: 'Obeah',
    nomeIngles: 'Obeah',
    clasTipicos: ['Salubri (Curandeiros)'],
    descricaoGeral:
      'Disciplina espiritual e curativa do terceiro olho dos Salubri Curandeiros, capaz de aliviar dores, curar ferimentos e purificar traumas da alma.',
    poderes: [
      {
        nomePoder: 'Sentir Vitalidade (Sense Vitality)',
        nivel: 1,
        paradaDados: 'Percepção + Empatia',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Instantânea',
        efeito:
          'Lê a condição de saúde, ferimentos, estado emocional, doenças e força vital de um alvo pelo terceiro olho.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Toque Anestésico (Anesthetic Touch)',
        nivel: 2,
        paradaDados: 'Manipulação + Medicina',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Instantânea / Cena',
        efeito:
          'Entorpece dores físicas severas, remove penalidades de ferimentos ou cura dano contusivo superficial.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Curar o Invólucro Mortal (Mend the Mortal Shell)',
        nivel: 3,
        paradaDados: 'Vigor + Medicina',
        dificuldade: '6–7',
        custo: 'Pontos de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Fecha ferimentos e cura dano letal em mortais e cainitas através do toque canalizado com vitae.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Aliviar a Alma (Unburden the Soul)',
        nivel: 4,
        paradaDados: 'Carisma / Manipulação + Empatia',
        dificuldade: '7',
        custo: '1 Força de Vontade',
        duracao: 'Cena / Permanente',
        efeito:
          'Alivia traumas psicológicos, perturbações mentais e culpas profundas na psique de mortais e vampiros.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Coração Pacífico / Projeção da Alma (Peaceful Heart)',
        nivel: 5,
        paradaDados: 'Raciocínio + Empatia / Ocultismo',
        dificuldade: '7–8',
        custo: '1 Força de Vontade',
        duracao: 'Cena / Repouso',
        efeito:
          'Coloca um alvo em transe regenerativo profundo ou projeta a alma pura do curandeiro para fora do corpo.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 7. VALEREN (Salubri Guerreiros)
  // =========================================================================
  {
    id: 'valeren',
    nome: 'Valeren',
    nomeIngles: 'Valeren',
    clasTipicos: ['Salubri (Guerreiros / Antitribu)'],
    descricaoGeral:
      'Vertente marcial dos Salubri na Idade das Trevas e no Sabá, focada em detecção de ameaças, foco bélico e fogo espiritual contra corrupção.',
    poderes: [
      {
        nomePoder: 'Sentir o Adversário (Sense the Adversary)',
        nivel: 1,
        paradaDados: 'Percepção + Prontidão',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Identifica inimigos ocultos, emboscadas, ameaças sobrenaturais e intenções hostis nas proximidades.',
        livroFonte: 'V20 Dark Ages / Guide to the Sabbat',
      },
      {
        nomePoder: 'Toque do Escorpião / Cegueira Tática',
        nivel: 2,
        paradaDados: 'Destreza / Manipulação + Medicina ou Armas',
        dificuldade: '6–7',
        custo: '1 Ponto de Sangue',
        duracao: 'Turnos',
        efeito:
          'Induz prejuízo sensorial incapacitante ou imbui ataques com ressonância dolorosa dirigida.',
        livroFonte: 'V20 Dark Ages / Guide to the Sabbat',
      },
      {
        nomePoder: 'Toque Ardente / Reforço Marcial (Burning Touch)',
        nivel: 3,
        paradaDados: 'Força / Vigor + Ocultismo',
        dificuldade: '6–7',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Amplifica a letalidade do guerreiro, canalizando dor ou força espiritual nos golpes e armas empunhadas.',
        livroFonte: 'V20 Dark Ages / Guide to the Sabbat',
      },
      {
        nomePoder: 'Vingança dos Despertos (Vengeance of the Awakened)',
        nivel: 4,
        paradaDados: 'Raciocínio + Briga / Armas Brancas',
        dificuldade: '7',
        custo: '1 Ponto de Sangue',
        duracao: 'Turnos / Cena',
        efeito:
          'Canaliza fúria justa contra inimigos, convertendo contra-ataques e reações em golpes devastadores.',
        livroFonte: 'V20 Dark Ages / Guide to the Sabbat',
      },
      {
        nomePoder: 'Fogo da Alma / Castigar (Soulfire / Castigate)',
        nivel: 5,
        paradaDados: 'Força de Vontade / Carisma + Ocultismo',
        dificuldade: '7–8',
        custo: '2 Pontos de Sangue + 1 Força de Vontade',
        duracao: 'Instantânea',
        efeito:
          'Projeta uma explosão de fogo espiritual puro pelo terceiro olho que queima a alma do adversário e causa dano agravado severo a infernalistas e corruptos.',
        livroFonte: 'V20 Dark Ages / Guide to the Sabbat',
      },
    ],
  },

  // =========================================================================
  // 8. THANATOSIS (Samedi)
  // =========================================================================
  {
    id: 'thanatosis',
    nome: 'Thanatosis',
    nomeIngles: 'Thanatosis',
    clasTipicos: ['Samedi'],
    descricaoGeral:
      'Disciplina macabra dos Samedi que manipula decomposição corporal, putrefação cadavérica e dispersão em cinzas.',
    poderes: [
      {
        nomePoder: 'Murchar (Wither)',
        nivel: 1,
        paradaDados: 'Força + Medicina',
        dificuldade: 'Vigor + Esportes do alvo',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena / Conforme cura',
        efeito:
          'Enfraquece e atrofia instantaneamente um membro ou tecido localizado do alvo ao toque.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Putrefação (Putrefaction)',
        nivel: 2,
        paradaDados: 'Vigor + Medicina',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Acelera drasticamente a decomposição de cadáveres ou feridas abertas, gerando odores nauseantes e contaminação.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Nuvem de Cinzas (Ashen Cloud)',
        nivel: 3,
        paradaDados: 'Vigor + Sobrevivência',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Dissolve o próprio corpo em uma nuvem densa de cinzas sufocantes e poeira cadavérica para escapar de golpes ou passar por frestas.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Solo Profanado / Estado Cadavérico (Hallowed Ground)',
        nivel: 4,
        paradaDados: 'Vigor + Ocultismo',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena / Dia',
        efeito:
          'Imita rigor mortis absoluto para enganar exames ou manipula tecidos mortos ao redor.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Necrose (Necrosis)',
        nivel: 5,
        paradaDados: 'Destreza + Briga (ou Medicina)',
        dificuldade: 'Vigor do alvo',
        custo: '2 Pontos de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Apodrece a carne viva ou morta-viva do alvo ao simples toque, causando pesado dano letal ou agravado por necrose.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 9. MYTHERCERIA (Kiasyd)
  // =========================================================================
  {
    id: 'mytherceria',
    nome: 'Mytherceria',
    nomeIngles: 'Mytherceria',
    clasTipicos: ['Kiasyd'],
    descricaoGeral:
      'Disciplina bizarra e feérica dos eruditos Kiasyd, voltada a sentidos estranhos, captura de memórias e paradoxos mentais.',
    poderes: [
      {
        nomePoder: 'Visão Feérica (Fey Sight)',
        nivel: 1,
        paradaDados: 'Percepção + Ocultismo',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Enxerga glamoures feéricos, changelings, portais ocultos e auras mágicas invisíveis à visão comum.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Absorção de Aura / Detector de Mentiras (Folderol)',
        nivel: 2,
        paradaDados: 'Percepção + Empatia',
        dificuldade: 'Força de Vontade do alvo',
        custo: 'Nenhum / 1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Detecta mentiras instantaneamente ou suga impressões emocionais e ressonâncias de um objeto/alvo.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Roubar a Mente (Steal the Mind)',
        nivel: 3,
        paradaDados: 'Inteligência + Lábia',
        dificuldade: 'Força de Vontade do alvo',
        custo: '1 Ponto de Sangue',
        duracao: 'Temporária (Cena / Noite)',
        efeito:
          'Extrai temporariamente memórias, conhecimentos ou pontos de Habilidade diretamente da mente de uma vítima.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Confusão / Enigmas (Boggle)',
        nivel: 4,
        paradaDados: 'Inteligência ou Manipulação + Ocultismo',
        dificuldade: 'Força de Vontade do alvo',
        custo: '1 Ponto de Sangue',
        duracao: 'Turnos',
        efeito:
          'Soterrra o raciocínio do adversário com paradoxos feéricos impossíveis, deixando-o desorientado e incapacitado.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'O Grande Truque (The Grandest Trick)',
        nivel: 5,
        paradaDados: 'Vigor + Ocultismo',
        dificuldade: '8',
        custo: '3 Pontos de Sangue',
        duracao: 'Até 1 dia completo',
        efeito:
          'Transforma temporariamente o Kiasyd de volta em um ser humano vivo por até 24 horas (sujeito a restrições severas da maldição).',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 10. MELPOMINEE (Filhas da Cacofonia)
  // =========================================================================
  {
    id: 'melpominee',
    nome: 'Melpominee',
    nomeIngles: 'Melpominee',
    clasTipicos: ['Filhas da Cacofonia'],
    descricaoGeral:
      'Arte vocal e sônica das Filhas da Cacofonia, projetando a voz a longas distâncias e convertendo canto em ondas destruidoras.',
    poderes: [
      {
        nomePoder: 'A Voz Perdida (The Missing Voice)',
        nivel: 1,
        paradaDados: 'Automática (ou Raciocínio + Lábia para ocultar)',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Projeta a voz como se viesse de outro ponto dentro da linha de visão (ventriloquismo sobrenatural).',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Orador Fantasma (Phantom Speaker)',
        nivel: 2,
        paradaDados: 'Inteligência + Lábia ou Prontidão',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Conversa',
        efeito:
          'Envia a voz a quilômetros de distância diretamente até um ouvinte ou local conhecido.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Silêncio (Hush)',
        nivel: 3,
        paradaDados: 'Manipulação + Performance',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Cria uma zona absoluta de silêncio ao redor de si mesmo ou de uma área, abafando qualquer som.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Sinfonia da Dor (Symphony of Pain)',
        nivel: 4,
        paradaDados: 'Vigor + Performance',
        dificuldade: '6',
        custo: '1+ Pontos de Sangue',
        duracao: 'Turnos',
        efeito:
          'Emite uma onda sônica aguda que inflige dano concussivo, letal ou agravado conforme os sucessos.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Morte do Tambor (Death of the Drum)',
        nivel: 5,
        paradaDados: 'Manipulação + Performance',
        dificuldade: 'Vigor + Fortitude do alvo',
        custo: '2 Pontos de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Estilhaça tímpanos, órgãos ou cérebro da vítima por ressonância vocal extrema, podendo causar a Morte Final.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 11. SANGUINUS (Irmãos de Sangue)
  // =========================================================================
  {
    id: 'sanguinus',
    nome: 'Sanguinus',
    nomeIngles: 'Sanguinus',
    clasTipicos: ['Irmãos de Sangue'],
    descricaoGeral:
      'Disciplina orgânica de mente coletiva usada pelos círculos de Irmãos de Sangue do Sabá para compartilhar carne, órgãos, cura e atributos.',
    poderes: [
      {
        nomePoder: 'Sangue de Irmão (Brother’s Blood)',
        nivel: 1,
        paradaDados: 'Vigor + Medicina',
        dificuldade: '6',
        custo: 'Pontos de Sangue transferidos',
        duracao: 'Instantânea',
        efeito:
          'Permite aos membros do círculo curarem uns aos outros ou partilharem energia vital à distância.',
        livroFonte: 'V20 / Guide to the Sabbat',
      },
      {
        nomePoder: 'Octópode (Octopod)',
        nivel: 2,
        paradaDados: 'Vigor + Medicina',
        dificuldade: '6',
        custo: '1 Ponto de Sangue por órgão',
        duracao: 'Cena',
        efeito:
          'Desprende braços, olhos ou bocas do próprio corpo para enxertá-los temporariamente em outro membro do círculo.',
        livroFonte: 'V20 / Guide to the Sabbat',
      },
      {
        nomePoder: 'Gestalt',
        nivel: 3,
        paradaDados: 'Raciocínio + Ocultismo (se não-iniciado)',
        dificuldade: '7',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Une o círculo numa mente coletiva temporária, compartilhando iniciativa, percepção e traços mentais.',
        livroFonte: 'V20 / Guide to the Sabbat',
      },
      {
        nomePoder: 'Saar',
        nivel: 4,
        paradaDados: 'Vigor + Liderança',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena',
        efeito:
          'Pool cooperativo que reduz efetivamente a geração aparente ou combina múltiplos atributos físicos no grupo.',
        livroFonte: 'V20 / Guide to the Sabbat',
      },
      {
        nomePoder: 'A Escultura da Carne (The Flesh Sculpt)',
        nivel: 5,
        paradaDados: 'Força + Medicina',
        dificuldade: '8',
        custo: '3 Pontos de Sangue',
        duracao: 'Cena',
        efeito:
          'Funde vários Irmãos de Sangue fisicamente em uma única monstruosidade de múltiplos membros, cabeças e níveis de vitalidade acumulados.',
        livroFonte: 'V20 / Guide to the Sabbat',
      },
    ],
  },

  // =========================================================================
  // 12. SPIRITUS (Ahrimanes)
  // =========================================================================
  {
    id: 'spiritus',
    nome: 'Spiritus',
    nomeIngles: 'Spiritus',
    clasTipicos: ['Ahrimanes'],
    descricaoGeral:
      'Arte xamânica exclusiva das Ahrimanes, conectando a cainita com espíritos da natureza, feras e formas espirituais de batalha.',
    poderes: [
      {
        nomePoder: 'Comunhão da Fauna (Fauna’s Communion)',
        nivel: 1,
        paradaDados: 'Percepção + Empatia c/ Animais ou Ocultismo',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Abre os sentidos para perceber e conversar com espíritos da natureza, do clima e dos animais ao redor.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Instigar a Besta (Urging the Beast)',
        nivel: 2,
        paradaDados: 'Manipulação + Empatia c/ Animais',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Compele feras naturais ou entidades ambientais menores a realizar tarefas simples ou fugir.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Armadura Espiritual (Spirit Armor)',
        nivel: 3,
        paradaDados: 'Vigor + Sobrevivência',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Convoca espíritos para envolver o corpo em uma aura espiritual protetora que amplia os dados de absorção.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Extrair a Alma Interior (Drawing the Inner Soul)',
        nivel: 4,
        paradaDados: 'Manipulação + Empatia',
        dificuldade: 'Força de Vontade do alvo',
        custo: '1 Ponto de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Alcança a psique de um alvo para manipular ou drenar/repor reservas de Força de Vontade.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Coração da Besta (Heart of the Beast)',
        nivel: 5,
        paradaDados: 'Vigor + Sobrevivência',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena',
        efeito:
          'Assume uma terrível forma híbrida meio-espírito, combinando fúria predatória lupina com poder vampírico.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 13. ABOMBWE (Laibon Akunanse / Bonsam)
  // =========================================================================
  {
    id: 'abombwe',
    nome: 'Abombwe',
    nomeIngles: 'Abombwe',
    clasTipicos: ['Akunanse', 'Bonsam (Laibon)'],
    descricaoGeral:
      'Disciplina predatória africana dos Laibon que canaliza a própria Besta em sentidos de caçador, camuflagem e formas de predador.',
    poderes: [
      {
        nomePoder: 'Comunhão do Predador (Predator’s Communion)',
        nivel: 1,
        paradaDados: 'Percepção + Empatia',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Lê inclinações predatórias e psicológicas do alvo, identificando sua postura como caçador ou presa.',
        livroFonte: 'Kindred of the Ebony Kingdom / V20 Dark Ages',
      },
      {
        nomePoder: 'Invocar a Besta (Invoking the Beast)',
        nivel: 2,
        paradaDados: 'Manipulação + Intimidação',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Força traços da Besta interior a se manifestarem exteriormente para intimidar rivais ou ampliar a força física.',
        livroFonte: 'Kindred of the Ebony Kingdom / V20 Dark Ages',
      },
      {
        nomePoder: 'Hibernação Oculta (Unseen Hibernation)',
        nivel: 3,
        paradaDados: 'Vigor + Sobrevivência',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Até despertar',
        efeito:
          'Funde-se perfeitamente à terra, sombras profundas ou vegetação densa para ocultar-se de qualquer detecção.',
        livroFonte: 'Kindred of the Ebony Kingdom / V20 Dark Ages',
      },
      {
        nomePoder: 'Canal do Demônio (Devil-Channel)',
        nivel: 4,
        paradaDados: 'Força + Briga',
        dificuldade: '6',
        custo: '1+ Pontos de Sangue',
        duracao: 'Turnos',
        efeito:
          'Canaliza força predatória brutal para destruir obstáculos e projetar ondas de choque cinéticas em combate.',
        livroFonte: 'Kindred of the Ebony Kingdom / V20 Dark Ages',
      },
      {
        nomePoder: 'Transformação do Predador (Predator’s Transformation)',
        nivel: 5,
        paradaDados: 'Vigor + Sobrevivência',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena',
        efeito:
          'Metamorfoseia o corpo inteiro em uma forma monstruosa de predador africano supremo.',
        livroFonte: 'Kindred of the Ebony Kingdom / V20 Dark Ages',
      },
    ],
  },

  // =========================================================================
  // 14. BARDO (Filhos de Osíris)
  // =========================================================================
  {
    id: 'bardo',
    nome: 'Bardo',
    nomeIngles: 'Bardo',
    clasTipicos: ['Filhos de Osíris'],
    descricaoGeral:
      'Disciplina espiritual de purificação e controle da Besta praticada pelos Filhos de Osíris (limitada pela Humanidade alta).',
    poderes: [
      {
        nomePoder: 'Aura da Paz / Jardim Paciente (Aura of Peace)',
        nivel: 1,
        paradaDados: 'Manipulação + Empatia',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Projeta uma aura calmante que reduz a agressividade ao redor e ajuda a resistir ao Frenesi e manipulações mentais.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Sinal de Banimento de Thoth / Passagem Incorpórea',
        nivel: 2,
        paradaDados: 'Destreza ou Raciocínio + Ocultismo',
        dificuldade: '8 (ou 6)',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Ergue uma proteção mística que eleva a dificuldade de poderes sobrenaturais ou oculta a presença espiritual.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Equilíbrio / Dádiva de Ápis (Balance / Gift of Apis)',
        nivel: 3,
        paradaDados: 'Inteligência + Empatia',
        dificuldade: '7',
        custo: '1 Ponto de Sangue / Força de Vontade',
        duracao: 'Temporária / Cena',
        efeito:
          'Estabiliza temporariamente a Humanidade ou permite subsistir inteiramente de sangue animal sem penalidades.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Pureza da Alma / Alívio do Coração (Purity of the Soul)',
        nivel: 4,
        paradaDados: 'Manipulação + Medicina (ou Vigor)',
        dificuldade: '7',
        custo: '1 Força de Vontade',
        duracao: 'Cena / Permanente',
        efeito:
          'Escuda a mente contra leituras de aura e cura traumas psicológicos ou perturbações emocionais.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Trazer a Aurora / Pureza Osiriana (Bring Forth the Dawn)',
        nivel: 5,
        paradaDados: 'Manipulação + Ocultismo',
        dificuldade: 'Humanidade / Caminho do alvo',
        custo: '2 Pontos de Sangue + Força de Vontade',
        duracao: 'Dia / Cena',
        efeito:
          'Induz sono diurno artificial em um cainita adversário ou blinda temporariamente o usuário contra torpor/tormentos da maldição.',
        livroFonte: 'V20 / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 15. OGHAM (Lhiannan)
  // =========================================================================
  {
    id: 'ogham',
    nome: 'Ogham',
    nomeIngles: 'Ogham',
    clasTipicos: ['Lhiannan'],
    descricaoGeral:
      'Magia rúnica de sangue e comunhão druídica da linhagem Lhiannan, vinculada a bosques sagrados e espíritos da terra.',
    poderes: [
      {
        nomePoder: 'Consagrar o Bosque (Consecrate the Grove)',
        nivel: 1,
        paradaDados: 'Inteligência + Ogham / Ocultismo',
        dificuldade: 'Nível do Ritual + 1 (2–6)',
        custo: '1 Ponto de Sangue',
        duracao: 'Permanente / Territorial',
        efeito:
          'Entalha runas de rastreamento e abençoa um pequeno território natural transformando-o em santuário pessoal.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Pintura Rubra / Laços do Bosque (Crimson Woad)',
        nivel: 2,
        paradaDados: 'Inteligência + Ogham',
        dificuldade: 'Nível + 1',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Inscreve pigmentos rúnicos de sangue na pele para ganhar resistência física ou enreda perseguidores com raízes vivas.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Inscrever a Maldição / Escudo de Woad',
        nivel: 3,
        paradaDados: 'Inteligência + Ogham',
        dificuldade: 'Nível + 1',
        custo: '1+ Pontos de Sangue',
        duracao: 'Cena / Variável',
        efeito:
          'Impõe uma maldição mística a um inimigo ou concede dados extras de absorção contra golpes físicos e armas.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Lua e Sol / Pedras Sussurrantes (Moon and Sun)',
        nivel: 4,
        paradaDados: 'Inteligência + Ogham',
        dificuldade: 'Nível + 1',
        custo: '2 Pontos de Sangue',
        duracao: 'Ciclo / Cena',
        efeito:
          'Sintoniza com ciclos naturais para proteção/visões ou grava mensagens proféticas em monólitos de pedra.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
      {
        nomePoder: 'Vingança do Grande Carvalho (The Great Oak’s Vengeance)',
        nivel: 5,
        paradaDados: 'Inteligência + Ogham',
        dificuldade: 'Nível + 1 (6–8)',
        custo: '3 Pontos de Sangue',
        duracao: 'Cena / Instantânea',
        efeito:
          'Drena energia de sítios sagrados ou desencadeia tempestades, tremores e rupturas naturais massivas na região.',
        livroFonte: 'V20 Dark Ages / Lore of the Bloodlines',
      },
    ],
  },

  // =========================================================================
  // 16. KINETICISM (Caitiff / Outcasts)
  // =========================================================================
  {
    id: 'kineticism',
    nome: 'Kineticism (Cinese)',
    nomeIngles: 'Kineticism',
    clasTipicos: ['Caitiff (World of Darkness: Outcasts)'],
    descricaoGeral:
      'Disciplina rara atribuída a párias/Caitiff em Outcasts, controlando, absorvendo e redirecionando energia cinética pura.',
    poderes: [
      {
        nomePoder: 'Amortecimento (Dampening)',
        nivel: 1,
        paradaDados: 'Raciocínio + Ocultismo / Esportes',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Instantânea / Turno',
        efeito:
          'Desacelera objetos em movimento ou amortece o impacto cinético de quedas e colisões.',
        livroFonte: 'World of Darkness: Outcasts',
      },
      {
        nomePoder: 'Redirecionamento (Redirection)',
        nivel: 2,
        paradaDados: 'Destreza + Ocultismo / Briga',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Absorve a força cinética de impactos recebidos e redireciona essa energia para fora.',
        livroFonte: 'World of Darkness: Outcasts',
      },
      {
        nomePoder: 'Golpe Vingativo (Vengeful Strike)',
        nivel: 3,
        paradaDados: 'Força + Briga',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Canaliza o momento cinético armazenado diretamente em um golpe físico devastador.',
        livroFonte: 'World of Darkness: Outcasts',
      },
      {
        nomePoder: 'Descarga (Discharge)',
        nivel: 4,
        paradaDados: 'Vigor + Ocultismo',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Libera toda a carga cinética acumulada em uma onda de choque em área que arremessa alvos próximos.',
        livroFonte: 'World of Darkness: Outcasts',
      },
      {
        nomePoder: 'Escudo Cinético (Kinetic Shield)',
        nivel: 5,
        paradaDados: 'Vigor + Ocultismo',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena',
        efeito:
          'Ergue uma barreira invisível de energia em movimento contínuo que desvia projéteis e ataques físicos.',
        livroFonte: 'World of Darkness: Outcasts',
      },
    ],
  },

  // =========================================================================
  // 17. DEIMOS (Lâmias)
  // =========================================================================
  {
    id: 'deimos',
    nome: 'Deimos',
    nomeIngles: 'Deimos',
    clasTipicos: ['Lâmias'],
    descricaoGeral:
      'Disciplina tanatológica e de praga da linhagem Lâmia na Idade das Trevas (anteriormente associada às filhas de Lilith antes de ser incorporada a Mortis/Necromancia).',
    poderes: [
      {
        nomePoder: 'Sussurros à Alma (Whispers to the Soul)',
        nivel: 1,
        paradaDados: 'Manipulação + Empatia / Intimidação',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Insinua pesadelos terríveis e presságios de perdição nos pensamentos despertos do alvo.',
        livroFonte: 'Dark Ages (Lâmias)',
      },
      {
        nomePoder: 'Beijo da Mãe Sombria (Kiss of the Dark Mother)',
        nivel: 2,
        paradaDados: 'Vigor + Briga (mordida)',
        dificuldade: '6',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Reveste lábios e presas com icor entrópico que drena vida, tornando a mordida muito mais letal.',
        livroFonte: 'Dark Ages (Lâmias)',
      },
      {
        nomePoder: 'Icor (Ichor)',
        nivel: 3,
        paradaDados: 'Vigor + Sobrevivência',
        dificuldade: '7',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Secreta fluido venenoso ácido pelo corpo capaz de corroer carne e matéria orgânica ao contato.',
        livroFonte: 'Dark Ages (Lâmias)',
      },
      {
        nomePoder: 'Agarrar o Sudário (Clutching the Shroud)',
        nivel: 4,
        paradaDados: 'Inteligência + Ocultismo',
        dificuldade: '7',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena',
        efeito:
          'Puxa decadência espiritual ambiente para apodrecer objetos sólidos ou enfraquecer estruturas físicas.',
        livroFonte: 'Dark Ages (Lâmias)',
      },
      {
        nomePoder: 'Hálito Negro (Black Breath)',
        nivel: 5,
        paradaDados: 'Vigor + Ocultismo',
        dificuldade: '7–8',
        custo: '2 Pontos de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Exala uma nuvem de miasma necrótico sufocante que inflige dano massivo e pode empurrar alvos ao torpor.',
        livroFonte: 'Dark Ages (Lâmias)',
      },
    ],
  },

  // =========================================================================
  // 18. NIHILISTICS (Nagaraja)
  // =========================================================================
  {
    id: 'nihilistics',
    nome: 'Nihilistics',
    nomeIngles: 'Nihilistics',
    clasTipicos: ['Nagaraja'],
    descricaoGeral:
      'Disciplina clássica dos Nagaraja ligada às Terras das Sombras, entropia e consumo espiritual de fantasmas.',
    poderes: [
      {
        nomePoder: 'Olhos do Espectro (Eyes of the Wraith)',
        nivel: 1,
        paradaDados: 'Percepção + Ocultismo',
        dificuldade: '6',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Estende os sentidos além do Sudário para enxergar diretamente as Terras das Sombras e aparições.',
        livroFonte: 'Dirty Secrets of the Black Hand',
      },
      {
        nomePoder: 'Consumir os Mortos (Consume the Dead)',
        nivel: 2,
        paradaDados: 'Vigor + Ocultismo',
        dificuldade: '6–7',
        custo: 'Nenhum',
        duracao: 'Cena',
        efeito:
          'Permite ao vampiro alimentar-se diretamente do corpus espiritual de fantasmas e espectros.',
        livroFonte: 'Dirty Secrets of the Black Hand',
      },
      {
        nomePoder: 'Aura de Decadência (Aura of Decay)',
        nivel: 3,
        paradaDados: 'Manipulação + Ocultismo',
        dificuldade: '7',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Imbui objetos ou pequena área ao redor com podridão entrópica súbita e desgaste acelerado.',
        livroFonte: 'Dirty Secrets of the Black Hand',
      },
      {
        nomePoder: 'O Toque Sombrio (The Dark Touch)',
        nivel: 4,
        paradaDados: 'Destreza + Briga',
        dificuldade: '6–7',
        custo: '1+ Pontos de Sangue',
        duracao: 'Instantânea',
        efeito:
          'Ataca a vítima diretamente com energia glacial pura canalizada do Oblívio.',
        livroFonte: 'Dirty Secrets of the Black Hand',
      },
      {
        nomePoder: 'Grito da Noite (Nightcry)',
        nivel: 5,
        paradaDados: 'Carisma + Ocultismo',
        dificuldade: '7–8',
        custo: '2 Pontos de Sangue + Força de Vontade',
        duracao: 'Cena',
        efeito:
          'Invoca entidades predadoras ou horrores menores do Submundo para o plano físico.',
        livroFonte: 'Dirty Secrets of the Black Hand',
      },
    ],
  },

  // =========================================================================
  // 19. FEITIÇARIA KOLDÚNICA (Tzimisce / Velho Clã)
  // =========================================================================
  {
    id: 'koldunic_sorcery',
    nome: 'Feitiçaria Koldúnica',
    nomeIngles: 'Koldunic Sorcery',
    clasTipicos: ['Velho Clã Tzimisce', 'Tzimisce'],
    descricaoGeral:
      'Magia elemental primordial vinculada aos espíritos da terra, vento, fogo e água dos Cárpatos; dividida em Vias (Krainas) com dificuldade padrão Nível + 3.',
    poderes: [
      {
        nomePoder: 'Sintonia Elemental (Vínculo da Kraina)',
        nivel: 1,
        paradaDados: 'Inteligência + Feitiçaria Koldúnica',
        dificuldade: '4 (Nível + 3)',
        custo: '1 Ponto de Sangue',
        duracao: 'Cena',
        efeito:
          'Sintoniza os sentidos com o elemento escolhido (ouvir através do solo, sentir correntes de água, vento ou chamas) em um raio próximo.',
        livroFonte: 'V20 Dark Ages / Blood Magic',
      },
      {
        nomePoder: 'Manipulação Elemental / Combustão',
        nivel: 2,
        paradaDados: 'Inteligência + Via Elemental',
        dificuldade: '5 (Nível + 3)',
        custo: '1 Ponto de Sangue',
        duracao: 'Instantânea / Cena',
        efeito:
          'Direciona forças elementais locais — como deslocar lama/terra ou provocar combustão súbita causando dano agravado por sucesso (Via do Fogo).',
        livroFonte: 'V20 Dark Ages / Blood Magic',
      },
      {
        nomePoder: 'Projeção & Barreira Elemental',
        nivel: 3,
        paradaDados: 'Inteligência + Via Elemental',
        dificuldade: '6 (Nível + 3)',
        custo: '1+ Pontos de Sangue',
        duracao: 'Turnos / Cena',
        efeito:
          'Manifesta perigos elementais à distância através dos espíritos da terra: muralhas de fogo, gêiseres de água ou tremores localizados.',
        livroFonte: 'V20 Dark Ages / Blood Magic',
      },
      {
        nomePoder: 'Controle Ambiental Severo',
        nivel: 4,
        paradaDados: 'Inteligência + Via Elemental',
        dificuldade: '7 (Nível + 3)',
        custo: '2 Pontos de Sangue',
        duracao: 'Cena',
        efeito:
          'Remodela o terreno ao redor, ferve corpos d’água ou altera drasticamente o clima, os ventos e a temperatura local.',
        livroFonte: 'V20 Dark Ages / Blood Magic',
      },
      {
        nomePoder: 'Cataclismo Koldúnico (Ira Elemental)',
        nivel: 5,
        paradaDados: 'Inteligência + Via Elemental',
        dificuldade: '8 (Nível + 3)',
        custo: '3 Pontos de Sangue + Força de Vontade',
        duracao: 'Cena / Desastre regional',
        efeito:
          'Desencadeia desastres regionais em larga escala (terremotos, incêndios devastadores, tempestades furiosas ou maremotos) capazes de destruir fortalezas inteiras.',
        livroFonte: 'V20 Dark Ages / Blood Magic',
      },
    ],
  },
];
