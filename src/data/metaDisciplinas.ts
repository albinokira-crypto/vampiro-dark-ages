export interface PrerequisitoMetaDisciplina {
  disciplina: string;
  nivel: number;
}

export interface MetaDisciplinaInfo {
  id: string;
  nome: string;
  nomeIngles: string;
  categoriaTag: string;
  prerequisitos: PrerequisitoMetaDisciplina[];
  custoXP: string;
  paradaOuAtivacao: string;
  efeito: string;
  origem: string;
}

export const calcularCustoMetaDisciplinaXP = (meta: MetaDisciplinaInfo): number =>
  meta.prerequisitos.reduce((total, pr) => total + pr.nivel, 0) * 3;

export const META_DISCIPLINAS: MetaDisciplinaInfo[] = [
  {
    id: 'orelhas_morcego',
    nome: 'Orelhas de Morcego',
    nomeIngles: 'Ears of the Bat',
    categoriaTag: 'Tzimisce / Sensorial',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 1 },
      { disciplina: 'Vicissitude', nivel: 1 },
    ],
    custoXP: '6 XP',
    paradaOuAtivacao: 'Percepção + Prontidão (após moldar os ouvidos)',
    efeito:
      'Permite moldar as orelhas do cainita para emitir e captar sons de alta frequência, concedendo ecolocalização funcional mesmo em escuridão absoluta.',
    origem: 'V20 Lore of the Clans (pág. 241)',
  },
  {
    id: 'veu_tenebroso',
    nome: 'Véu Tenebroso',
    nomeIngles: 'Tenebrous Veil',
    categoriaTag: 'Furtividade / Sombras',
    prerequisitos: [
      { disciplina: 'Ofuscação', nivel: 1 },
      { disciplina: 'Tenebrosidade', nivel: 1 },
    ],
    custoXP: '7 XP (Dark Ages: 7 × maior nível) / 6 XP (Soma × 3)',
    paradaOuAtivacao: 'Raciocínio + Furtividade (automático em sombras)',
    efeito:
      'Mescla sombras abissais com ilusões mentais de Ofuscação, facilitando esconder-se em áreas pouco iluminadas mesmo diante de observadores atentos.',
    origem: 'Anarchs Unbound',
  },
  {
    id: 'absorver_sangue',
    nome: 'Absorver Sangue',
    nomeIngles: 'Suck It Up',
    categoriaTag: 'Alimentação / Selvagem',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 1 },
      { disciplina: 'Metamorfose', nivel: 2 },
    ],
    custoXP: '9 XP',
    paradaOuAtivacao: 'Contato direto da pele com sangue derramado',
    efeito:
      'Permite ao vampiro absorver sangue derramado diretamente pelos poros através do toque, evitando ter de lamber ou beber do chão.',
    origem: 'Guide to the Anarchs (pág. 162) / Anarchs Unbound',
  },
  {
    id: 'sepultamento_compartilhado',
    nome: 'Sepultamento Compartilhado',
    nomeIngles: 'Shared Entombment',
    categoriaTag: 'Gangrel / Refúgio',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 1 },
      { disciplina: 'Metamorfose', nivel: 3 },
    ],
    custoXP: '21 XP (Dark Ages: 7 × 3) / 12 XP (Soma × 3)',
    paradaOuAtivacao: '1 Ponto de Sangue ao fundir-se à terra',
    efeito:
      'Permite ao usuário levar aliados, carniçais ou companheiros animais consigo ao mesclar-se com o solo usando Fusão com a Terra.',
    origem: 'Players Guide to Low Clans (Dark Ages)',
  },
  {
    id: 'pulso_nao_vida',
    nome: 'Pulso da Não-Vida',
    nomeIngles: 'Pulse of Undeath',
    categoriaTag: 'Brujah / Detecção',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 1 },
      { disciplina: 'Potência', nivel: 3 },
    ],
    custoXP: '6 XP',
    paradaOuAtivacao: 'Percepção + Prontidão / Medicina',
    efeito:
      'Permite sentir a vitalidade física e as reservas brutas de força ou sangue em outro oponente antes mesmo do combate físico começar.',
    origem: 'Clanbook: Brujah (Revised) / V20 Lore of the Clans',
  },
  {
    id: 'clareza_vazio',
    nome: 'Clareza do Vazio',
    nomeIngles: 'Clarity of Emptiness',
    categoriaTag: 'Lasombra / Defesa Mental',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 1 },
      { disciplina: 'Tenebrosidade (ou Mortis)', nivel: 2 },
    ],
    custoXP: '30 XP (Lair of the Hidden) / 14 XP (Dark Ages)',
    paradaOuAtivacao: 'Força de Vontade / Passivo em meditação',
    efeito:
      'Escuda a mente e as emoções contra leituras de aura, telepatia e manipulações mentais usando a frieza absoluta do Abismo.',
    origem: 'Lair of the Hidden (pág. 140) / High Clans',
  },
  {
    id: 'visao_sangue',
    nome: 'Visão do Sangue',
    nomeIngles: 'Blood Sight',
    categoriaTag: 'Tremere / Investigação',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 2 },
      { disciplina: 'Taumaturgia (Trilha do Sangue)', nivel: 1 },
    ],
    custoXP: '14 XP (Dark Ages: 7 × 2) / 9 XP (Soma × 3)',
    paradaOuAtivacao: 'Percepção + Ocultismo ao provar ou observar vitae',
    efeito:
      'Unifica Percepção da Aura e Gosto por Sangue para revelar instantaneamente geração, linhagem e traços místicos de quem derramou o sangue.',
    origem: 'Dark Ages / Suplementos Tremere',
  },
  {
    id: 'maos_ensanguentadas',
    nome: 'Mãos Ensanguentadas',
    nomeIngles: 'Bloodied Hands',
    categoriaTag: 'Precursores / Investigação',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 3 },
      { disciplina: 'Necromancia', nivel: 1 },
    ],
    custoXP: '12 a 15 XP',
    paradaOuAtivacao: 'Percepção + Ocultismo (Dif. Força de Vontade do alvo)',
    efeito:
      'Utilizada pelos Precursores do Ódio para perfurar ocultações e identificar a vítima de homicídio mais recente de um alvo para chantagem ou julgamento.',
    origem: 'V20 Lore of the Bloodlines (pág. 48)',
  },
  {
    id: 'nome_caido',
    nome: 'Nome do Caído',
    nomeIngles: 'Name of the Fallen',
    categoriaTag: 'Inquisição / Necro-Investigação',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 3 },
      { disciplina: 'Taumaturgia (ou Necromancia)', nivel: 1 },
    ],
    custoXP: '23 XP',
    paradaOuAtivacao: 'Percepção + Ocultismo segurando resto mortal',
    efeito:
      'Identifica um indivíduo falecido (mortal ou vampiro) e vislumbra circunstâncias de sua morte possuindo apenas um minúsculo fragmento de seu corpo.',
    origem: 'Archons & Templars (pág. 140)',
  },
  {
    id: 'tempera_sangue',
    nome: 'Têmpera de Sangue',
    nomeIngles: 'Blood Tempering',
    categoriaTag: 'Assamita / Armamento',
    prerequisitos: [
      { disciplina: 'Quietus', nivel: 1 },
      { disciplina: 'Fortitude', nivel: 2 },
    ],
    custoXP: '15 XP (variante V20 pode exigir Quietus 4)',
    paradaOuAtivacao: '1+ Pontos de Sangue banhando o equipamento',
    efeito:
      'Imbui armas ou armaduras com a própria vitae para reforçar sua durabilidade, resistir à quebra e ampliar a capacidade de dano.',
    origem: 'Libellus Sanguinis III (pág. 66) / V20 Dark Ages',
  },
  {
    id: 'rastreamento_espiritual',
    nome: 'Rastreamento Espiritual',
    nomeIngles: 'Spirit Tracking',
    categoriaTag: 'Gangrel / Caçada',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 2 },
      { disciplina: 'Metamorfose', nivel: 2 },
    ],
    custoXP: '12 XP',
    paradaOuAtivacao: 'Percepção + Sobrevivência',
    efeito:
      'Permite à Besta do vampiro farejar o rastro espiritual deixado pela Besta de outro cainita, ignorando disfarces físicos e pistas falsas.',
    origem: 'V20 Lore of the Clans (pág. 90)',
  },
  {
    id: 'finta_sombria',
    nome: 'Finta Sombria',
    nomeIngles: 'Shadow Feint',
    categoriaTag: 'Assamita / Combate',
    prerequisitos: [
      { disciplina: 'Rapidez', nivel: 2 },
      { disciplina: 'Ofuscação', nivel: 2 },
    ],
    custoXP: '12 XP (V20) / 14 XP (Revised)',
    paradaOuAtivacao: 'Ao ativar Rapidez com ação evasiva',
    efeito:
      'Distorce a percepção de posição do atacante durante movimentos velozes, aumentando significativamente a dificuldade dos oponentes para acertá-lo.',
    origem: 'Clanbook: Assamite (Revised) / V20 Lore of the Clans',
  },
  {
    id: 'saltos_limites',
    nome: 'Saltos & Limites',
    nomeIngles: 'Leaps and Bounds',
    categoriaTag: 'Brujah / Mobilidade',
    prerequisitos: [
      { disciplina: 'Rapidez', nivel: 2 },
      { disciplina: 'Potência', nivel: 2 },
    ],
    custoXP: '12 XP (variantes: 10 XP)',
    paradaOuAtivacao: 'Força + Esportes ao saltar',
    efeito:
      'Combina impulsão brutal com velocidade sobre-humana para realizar saltos colossais em grandes distâncias horizontais e verticais.',
    origem: 'V20 Lore of the Clans',
  },
  {
    id: 'rei_colina',
    nome: 'Rei da Colina',
    nomeIngles: 'King of the Hill',
    categoriaTag: 'Anarquista / Combate Social',
    prerequisitos: [
      { disciplina: 'Fortitude', nivel: 2 },
      { disciplina: 'Presença', nivel: 2 },
    ],
    custoXP: '12 XP',
    paradaOuAtivacao: '1 Ponto de Sangue em confronto aberto',
    efeito:
      'Impõe presença inabalável enquanto absorve ataques inimigos, desencorajando adversários a se aproximarem ou atacarem o usuário.',
    origem: 'Guide to the Anarchs (pág. 160)',
  },
  {
    id: 'ver_forma_verdadeira',
    nome: 'Ver a Verdadeira Forma',
    nomeIngles: 'See the True Shape',
    categoriaTag: 'Tzimisce / Percepção',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 2 },
      { disciplina: 'Vicissitude', nivel: 2 },
    ],
    custoXP: '14 XP',
    paradaOuAtivacao: 'Percepção + Ocultismo / Empatia',
    efeito:
      'Detecta se um corpo foi alterado por Vicissitude, cirurgias ou metamorfoses físicas, revelando sua anatomia original.',
    origem: 'Players Guide to High Clans (pág. 169)',
  },
  {
    id: 'padroes_aleatorios',
    nome: 'Padrões Aleatórios',
    nomeIngles: 'Random Patterns',
    categoriaTag: 'Malkaviano / Combate',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 2 },
      { disciplina: 'Demência', nivel: 2 },
    ],
    custoXP: '14 XP',
    paradaOuAtivacao: 'Percepção + Ocultismo ou Prontidão',
    efeito:
      'Permite ler probabilidades caóticas através da loucura para antecipar o próximo movimento de um oponente em combate ou perseguição.',
    origem: 'Archons & Templars (pág. 141)',
  },
  {
    id: 'extase',
    nome: 'Êxtase',
    nomeIngles: 'Bliss',
    categoriaTag: 'Toreador / Manipulação',
    prerequisitos: [
      { disciplina: 'Dominação', nivel: 2 },
      { disciplina: 'Presença', nivel: 3 },
    ],
    custoXP: '14 XP',
    paradaOuAtivacao: 'Carisma + Empatia (ou Lábia)',
    efeito:
      'Induz uma sensação avassaladora de prazer e devoção emocional na vítima, tornando-a altamente sugestionável e passiva.',
    origem: 'Clanbook: Toreador Revised (pág. 73)',
  },
  {
    id: 'previsao',
    nome: 'Previsão',
    nomeIngles: 'Premonition Defense',
    categoriaTag: 'Defesa / Reflexos',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 2 },
      { disciplina: 'Fortitude', nivel: 2 },
    ],
    custoXP: '14 XP (Dark Ages: 7 × 2) / 12 XP (Soma × 3)',
    paradaOuAtivacao: 'Percepção + Prontidão antes de sofrer ataque',
    efeito:
      'Concede reflexos místicos antecipando ataques físicos instantes antes do impacto, somando dados extras à defesa/esquiva.',
    origem: 'Compêndio Clássico / Meta-Disciplinas',
  },
  {
    id: 'marcha_longa',
    nome: 'Marcha Longa',
    nomeIngles: 'Long March',
    categoriaTag: 'Assamita / Viagem',
    prerequisitos: [
      { disciplina: 'Rapidez', nivel: 2 },
      { disciplina: 'Fortitude', nivel: 2 },
    ],
    custoXP: '14 XP (Dark Ages: 7 × 2) / 12 XP (Soma × 3)',
    paradaOuAtivacao: '1 Ponto de Sangue por jornada',
    efeito:
      'Técnica criada pelos Banu Haqim (Assamitas) para percorrer longas distâncias a pé em alta velocidade sem exaustão.',
    origem: 'V20 / Suplementos Assamitas',
  },
  {
    id: 'pele_texugo',
    nome: 'Pele de Texugo',
    nomeIngles: "Badger's Hide",
    categoriaTag: 'Anarquista / Resistência',
    prerequisitos: [
      { disciplina: 'Fortitude', nivel: 1 },
      { disciplina: 'Metamorfose', nivel: 4 },
    ],
    custoXP: '12 XP',
    paradaOuAtivacao: '1 Ponto de Sangue',
    efeito:
      'Endurece e torna elástica a pele sob impacto físico, reduzindo severamente o dano recebido de ataques contundentes e perfurantes.',
    origem: 'Guide to the Anarchs (pág. 158)',
  },
  {
    id: 'resistir_golpe_fulminante',
    nome: 'Resistir ao Golpe Fulminante',
    nomeIngles: 'Withstand the Blow',
    categoriaTag: 'Brujah / Defesa',
    prerequisitos: [
      { disciplina: 'Fortitude', nivel: 2 },
      { disciplina: 'Potência', nivel: 3 },
    ],
    custoXP: '21 XP (Dark Ages: 7 × 3) / 15 XP (Soma × 3)',
    paradaOuAtivacao: '1 Ponto de Sangue (reação ao ataque com Potência)',
    efeito:
      'Permite utilizar sua própria resistência para anular diretamente os sucessos automáticos de dano vindos da Potência do agressor.',
    origem: 'Compêndios Clássicos / Dark Ages',
  },
  {
    id: 'lobo_pele_cordeiro',
    nome: 'Lobo em Pele de Cordeiro',
    nomeIngles: "Wolf in Sheep's Clothing",
    categoriaTag: 'Nosferatu / Furtividade',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 3 },
      { disciplina: 'Ofuscação', nivel: 2 },
    ],
    custoXP: '15 XP',
    paradaOuAtivacao: 'Manipulação + Lábia (1 Ponto de Sangue)',
    efeito:
      'Oculta a natureza predatória e bestial do vampiro diante dos sentidos de animais e detecções sobrenaturais da Besta.',
    origem: 'V20 Lore of the Clans (pág. 165)',
  },
  {
    id: 'ferimento_superficial',
    nome: 'Ferimento Superficial',
    nomeIngles: 'Flesh Wound',
    categoriaTag: 'Gangrel / Intimidação',
    prerequisitos: [
      { disciplina: 'Fortitude', nivel: 2 },
      { disciplina: 'Ofuscação', nivel: 3 },
    ],
    custoXP: '15 XP',
    paradaOuAtivacao: 'Vigor + Lábia após receber dano',
    efeito:
      'Faz ferimentos graves e ossos quebrados parecerem arranhões insignificantes para observadores, projetando uma aura aterradora de invulnerabilidade.',
    origem: 'Clanbook: Gangrel Revised (pág. 72)',
  },
  {
    id: 'comandar_fera_cautelosa',
    nome: 'Comandar a Fera Cautelosa',
    nomeIngles: 'Command the Wary Beast',
    categoriaTag: 'Brujah / Controle Animal',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 2 },
      { disciplina: 'Presença', nivel: 3 },
    ],
    custoXP: '15 XP',
    paradaOuAtivacao: 'Carisma ou Manipulação + Empatia c/ Animais',
    efeito:
      'Projeta carisma feroz e domínio animal para fazer animais de guarda fugirem em pânico ou acalmar feras sob estresse.',
    origem: 'V20 Lore of the Clans (pág. 49) / Libellus Sanguinis II',
  },
  {
    id: 'moldar_efemera',
    nome: 'Moldar Efêmera (Ilusões Sólidas)',
    nomeIngles: 'Craft Ephemera',
    categoriaTag: 'Ravnos / Ilusionismo Sólido',
    prerequisitos: [
      { disciplina: 'Quimerismo', nivel: 5 },
      { disciplina: 'Fortitude', nivel: 3 },
    ],
    custoXP: '15 XP',
    paradaOuAtivacao: 'Manipulação + Ocultismo + Gasto de Sangue/Vontade',
    efeito:
      'Permite a um mestre Ravnos solidificar sonhos e ilusões de Quimerismo em objetos físicos tangíveis e duradouros.',
    origem: 'Players Guide to Low Clans / V20 Dark Ages (pág. 314)',
  },
  {
    id: 'armadura_trevas',
    nome: 'Armadura das Trevas',
    nomeIngles: 'Armor of Darkness',
    categoriaTag: 'Lasombra / Defesa Solar',
    prerequisitos: [
      { disciplina: 'Tenebrosidade', nivel: 4 },
      { disciplina: 'Fortitude', nivel: 2 },
    ],
    custoXP: '15 XP',
    paradaOuAtivacao: '2 Pontos de Sangue (Cena)',
    efeito:
      'Envolve o Lasombra em um manto espesso de matéria abissal que protege contra ataques físicos e reduz danos de fogo e luz solar.',
    origem: 'Dark Ages Companion (pág. 87) / V20 Dark Ages',
  },
  {
    id: 'ira_ardente',
    nome: 'Ira Ardente',
    nomeIngles: 'Burning Wrath',
    categoriaTag: 'Brujah / Combate Letal',
    prerequisitos: [
      { disciplina: 'Rapidez', nivel: 3 },
      { disciplina: 'Potência', nivel: 3 },
    ],
    custoXP: '15 XP (ou 18 XP conforme edição)',
    paradaOuAtivacao: '1 Ponto de Sangue por cena/ataque',
    efeito:
      'Canaliza a fúria do sangue através de velocidade e força brutais para que ataques desarmados de Briga inflijam **dano agravado**.',
    origem: 'Clanbook: Brujah (Revised) / V20',
  },
  {
    id: 'olhos_sombrios',
    nome: 'Olhos Sombrios',
    nomeIngles: 'Shadowed Eyes',
    categoriaTag: 'Lasombra / Cegueira',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 3 },
      { disciplina: 'Tenebrosidade', nivel: 3 },
    ],
    custoXP: '12 XP',
    paradaOuAtivacao: 'Percepção + Ocultismo (Dif. Força de Vontade)',
    efeito:
      'Permite cegar um oponente envolvendo sua visão com retalhos de escuridão abissal enquanto enxerga perfeitamente através das trevas.',
    origem: 'Libellus Sanguinis I (pág. 33)',
  },
  {
    id: 'aco_negro',
    nome: 'Aço Negro',
    nomeIngles: 'Dark Steel',
    categoriaTag: 'Lasombra / Tentáculos Aprimorados',
    prerequisitos: [
      { disciplina: 'Tenebrosidade', nivel: 3 },
      { disciplina: 'Potência', nivel: 3 },
    ],
    custoXP: '18 XP',
    paradaOuAtivacao: 'Ao conjurar Braços do Abismo',
    efeito:
      'Fortalece os tentáculos de sombra invocados por Braços do Abismo, elevando sua Força, Destreza e resistência estrutural com base em Tenebrosidade.',
    origem: 'Libellus Sanguinis I (pág. 33)',
  },
  {
    id: 'presenca_bestial',
    nome: 'Presença Bestial',
    nomeIngles: 'Bestial Presence',
    categoriaTag: 'Nosferatu / Terror',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 3 },
      { disciplina: 'Ofuscação', nivel: 3 },
    ],
    custoXP: '18 XP',
    paradaOuAtivacao: '1 Ponto de Sangue + Manipulação + Intimidação',
    efeito:
      'Extrai um fragmento sombrio da Besta de vampiros próximos e o manifesta como um acompanhante visível que penaliza rolagens sociais e testes de Frenesi alheios.',
    origem: 'V20 Lore of the Clans (pág. 164)',
  },
  {
    id: 'coracao_ferro',
    nome: 'Coração de Ferro',
    nomeIngles: 'Iron Heart',
    categoriaTag: 'Brujah / Imposição',
    prerequisitos: [
      { disciplina: 'Potência', nivel: 3 },
      { disciplina: 'Presença', nivel: 3 },
    ],
    custoXP: '18 XP',
    paradaOuAtivacao: '1 Força de Vontade (Cena)',
    efeito:
      'Reforça a resolução física e moral em meio ao caos, garantindo resistência superior contra coerções sociais, medo e abalos emocionais.',
    origem: 'V20 Lore of the Clans',
  },
  {
    id: 'vigor_besta',
    nome: 'Vigor da Besta',
    nomeIngles: "Beast's Vigor",
    categoriaTag: 'Ravnos / Transferência de Dano',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 3 },
      { disciplina: 'Fortitude', nivel: 3 },
    ],
    custoXP: '18 XP (ou 10–15 XP em adaptações)',
    paradaOuAtivacao: '1 Ponto de Sangue (com animal carniçal ligado)',
    efeito:
      'Permite transferir ou desviar ferimentos recebidos para animais carniçais vinculados ao usuário.',
    origem: 'Players Guide to Low Clans (pág. 159)',
  },
  {
    id: 'mortalha_ausencia',
    nome: 'Sombra de Ausência',
    nomeIngles: 'Shroud of Absence',
    categoriaTag: 'Lasombra / Ocultação Mental',
    prerequisitos: [
      { disciplina: 'Dominação', nivel: 3 },
      { disciplina: 'Tenebrosidade', nivel: 3 },
    ],
    custoXP: '18 XP',
    paradaOuAtivacao: 'Manipulação + Furtividade / Lábia',
    efeito:
      'Apaga temporariamente a presença do usuário tanto da visão física pelas sombras quanto da percepção consciente da mente dos observadores.',
    origem: 'Clanbook: Lasombra Revised (pág. 72) / Lore of the Clans',
  },
  {
    id: 'acoite_alecto',
    nome: 'Açoite de Alecto',
    nomeIngles: 'Scourge of Alecto',
    categoriaTag: 'Brujah / Terror Veloz',
    prerequisitos: [
      { disciplina: 'Rapidez', nivel: 2 },
      { disciplina: 'Presença', nivel: 4 },
    ],
    custoXP: '18 XP',
    paradaOuAtivacao: 'Carisma + Intimidação + Rapidez',
    efeito:
      'Combina velocidade sobrenatural com terror avassalador de Presença para subjugar múltiplos alvos no mesmo instante.',
    origem: 'Clanbook: Brujah Revised (pág. 31)',
  },
  {
    id: 'comandar_besta',
    nome: 'Comandar a Besta',
    nomeIngles: 'Command the Beast',
    categoriaTag: 'Ventrue / Controle Animal',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 3 },
      { disciplina: 'Dominação', nivel: 3 },
    ],
    custoXP: '18 a 21 XP',
    paradaOuAtivacao: 'Manipulação + Empatia c/ Animais (Dif. variável)',
    efeito:
      'Permite aplicar ordens complexas e condicionamentos mentais de Dominação diretamente em animais.',
    origem: 'V20 Companion / V20 Dark Ages',
  },
  {
    id: 'olho_cadaver',
    nome: 'Olho do Cadáver',
    nomeIngles: 'Eye of the Corpse',
    categoriaTag: 'Capadócio / Necro-Visão',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 3 },
      { disciplina: 'Mortis (ou Necromancia)', nivel: 3 },
    ],
    custoXP: '21 XP (Dark Ages: 7 × 3) / 18 XP (Soma × 3)',
    paradaOuAtivacao: 'Percepção + Ocultismo tocando o crânio',
    efeito:
      'Ao tocar o crânio ou cabeça de um cadáver (inclusive de cainitas destruídos), visualiza as últimas memórias e o instante exato de sua morte.',
    origem: 'Suplementos Capadócios / Compêndio Clássico',
  },
  {
    id: 'arsenal_corporal',
    nome: 'Arsenal Corporal',
    nomeIngles: 'Body Armory',
    categoriaTag: 'Tzimisce / Armas Orgânicas',
    prerequisitos: [
      { disciplina: 'Vicissitude', nivel: 3 },
      { disciplina: 'Metamorfose', nivel: 3 },
    ],
    custoXP: '20 XP',
    paradaOuAtivacao: 'Vigor + Medicina ou Ofícios Corporais (1 Sangue)',
    efeito:
      'Molda os ossos e tecidos do cainita em lâminas, esporões e armas orgânicas letais que irrompem diretamente através da carne.',
    origem: 'Guide to the Sabbat / V20 Dark Ages',
  },
  {
    id: 'agonia_simpatetica',
    nome: 'Agonia Simpática',
    nomeIngles: 'Sympathetic Agony',
    categoriaTag: 'Ravnos / Tortura Ilusória',
    prerequisitos: [
      { disciplina: 'Quimerismo', nivel: 2 },
      { disciplina: 'Fortitude', nivel: 4 },
    ],
    custoXP: '20 XP',
    paradaOuAtivacao: 'Manipulação + Empatia (Dif. Força de Vontade)',
    efeito:
      'Transfere ilusoriamente a dor dos ferimentos que o Ravnos acaba de suportar diretamente para a mente do atacante, podendo incapacitá-lo.',
    origem: 'Clanbook: Ravnos Revised (pág. 67)',
  },
  {
    id: 'arsenal_abismo',
    nome: 'Arsenal do Abismo',
    nomeIngles: "Armory of the Abyss / Bagman's Shelter",
    categoriaTag: 'Lasombra / Armas Abissais',
    prerequisitos: [
      { disciplina: 'Tenebrosidade', nivel: 3 },
      { disciplina: 'Fortitude (ou Potência)', nivel: 3 },
    ],
    custoXP: '21 XP',
    paradaOuAtivacao: '1+ Pontos de Sangue (Cena)',
    efeito:
      'Condensa sombras sólidas pelos poros formando espadas, escudos ou armaduras de cristal negro plenamente tangíveis e letais.',
    origem: 'Players Guide to High Clans (pág. 163) / V20 Dark Ages',
  },
  {
    id: 'preparar_impacto',
    nome: 'Preparar para o Impacto',
    nomeIngles: 'Brace for Impact',
    categoriaTag: 'Sabá / Absorção Física',
    prerequisitos: [
      { disciplina: 'Fortitude', nivel: 4 },
      { disciplina: 'Potência', nivel: 2 },
    ],
    custoXP: '21 XP',
    paradaOuAtivacao: '1 Ponto de Sangue ao receber ataque contundente',
    efeito:
      'Converte a potência muscular em resistência estrutural momentânea para suportar colisões, quedas e golpes esmagadores.',
    origem: 'Mexico City by Night (pág. 115)',
  },
  {
    id: 'aura_furia_amaldicoada',
    nome: 'Aura da Fúria Amaldiçoada',
    nomeIngles: 'Aura of Accursed Rage',
    categoriaTag: 'Caminho da Besta / Frenesi',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 3 },
      { disciplina: 'Presença', nivel: 2 },
    ],
    custoXP: '21 XP (variante: 15 XP)',
    paradaOuAtivacao: 'Manipulação + Intimidação (2 Pontos de Sangue)',
    efeito:
      'Popularizada pelos seguidores do Caminho da Besta; faz a fúria do vampiro transbordar ao redor, elevando drasticamente a dificuldade de Frenesi de todos próximos.',
    origem: 'Players Guide to Low Clans (pág. 158) / V20 Dark Ages (pág. 313)',
  },
  {
    id: 'suavizar_garras',
    nome: 'Suavizar as Garras Selvagens',
    nomeIngles: 'Soothe the Savage Claws',
    categoriaTag: 'Defesa contra Lupinos',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 3 },
      { disciplina: 'Fortitude', nivel: 3 },
    ],
    custoXP: '21 XP (Dark Ages: 7 × 3) / 18 XP (Soma × 3)',
    paradaOuAtivacao: 'Carisma + Empatia c/ Animais (reação)',
    efeito:
      'Acalma momentaneamente a Besta feroz de metamorfos e lobisomens, mitigando ou reduzindo o dano agravado de garras e presas.',
    origem: 'Compêndio Idade das Trevas / Dark Ages',
  },
  {
    id: 'ocultar_besta',
    nome: 'Ocultar a Besta',
    nomeIngles: 'Cloak the Beast',
    categoriaTag: 'Nosferatu / Engano Espiritual',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 5 },
      { disciplina: 'Ofuscação', nivel: 3 },
    ],
    custoXP: '24 XP',
    paradaOuAtivacao: 'Raciocínio + Lábia (1 Ponto de Sangue)',
    efeito:
      'Permite mascarar e falsificar seus níveis reais de Humanidade, Caminho de Iluminação e Virtudes contra leituras sobrenaturais e Auspícios.',
    origem: 'V20 Lore of the Clans (pág. 164)',
  },
  {
    id: 'esprit_de_corps',
    nome: 'Esprit de Corps',
    nomeIngles: 'Esprit de Corps',
    categoriaTag: 'Brujah / Moral em Batalha',
    prerequisitos: [
      { disciplina: 'Potência', nivel: 4 },
      { disciplina: 'Presença', nivel: 4 },
    ],
    custoXP: '24 XP (versões antigas: Potência 3 + Presença 2)',
    paradaOuAtivacao: 'Carisma + Liderança',
    efeito:
      'Inspira aliados próximos transmitindo coragem marcial, concedendo bônus em testes de combate e resistência contra medo sobrenatural.',
    origem: 'V20 Lore of the Clans (pág. 49)',
  },
  {
    id: 'aura_verdade_inescapavel',
    nome: 'Aura da Verdade Inescapável',
    nomeIngles: 'Aura of Inescapable Truth',
    categoriaTag: 'Ventrue / Juiz da Corte',
    prerequisitos: [
      { disciplina: 'Dominação', nivel: 4 },
      { disciplina: 'Presença', nivel: 4 },
    ],
    custoXP: '14 a 24 XP',
    paradaOuAtivacao: 'Carisma + Liderança / Empatia (Dif. Força de Vontade)',
    efeito:
      'Impõe uma aura solene que impede interlocutores na corte de proferirem mentiras deliberadas diante do vampiro.',
    origem: 'Libellus Sanguinis I (pág. 95) / V20 Dark Ages (pág. 313)',
  },
  {
    id: 'olho_mente',
    nome: 'Olho da Mente',
    nomeIngles: "Mind's Eye",
    categoriaTag: 'Arcontes / Memória',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 4 },
      { disciplina: 'Dominação', nivel: 3 },
    ],
    custoXP: '25 XP',
    paradaOuAtivacao: 'Inteligência + Empatia (Dif. variável)',
    efeito:
      'Permite ao investigador reviver fisicamente a memória de outro indivíduo — vendo, ouvindo e sentindo exatamente o que o alvo experimentou.',
    origem: 'Archons & Templars (pág. 143)',
  },
  {
    id: 'pele_urso',
    nome: 'Pele de Urso',
    nomeIngles: "Bear's Skin",
    categoriaTag: 'Gangrel / Forma de Guerra',
    prerequisitos: [
      { disciplina: 'Animalismo', nivel: 2 },
      { disciplina: 'Metamorfose', nivel: 4 },
    ],
    custoXP: '28 XP',
    paradaOuAtivacao: 'Vigor + Sobrevivência durante Frenesi / Combate',
    efeito:
      'Transforma o Gangrel em uma forma de guerra ursina gigantesca, concedendo bônus de Força e Vigor e permitindo absorver dano agravado com Vigor + Fortitude.',
    origem: 'Players Guide to Low Clans / V20 Dark Ages',
  },
  {
    id: 'ver_forma_refletida',
    nome: 'Ver a Forma Refletida',
    nomeIngles: 'See the Reflected Form',
    categoriaTag: 'Gangrel / Contra-Metamorfose',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 4 },
      { disciplina: 'Metamorfose', nivel: 4 },
    ],
    custoXP: '28 XP (Dark Ages: 7 × 4) / 24 XP (Soma × 3)',
    paradaOuAtivacao: 'Percepção + Ocultismo ao ler aura',
    efeito:
      'Examina a aura de um alvo revelando instantaneamente disfarces de mudança de forma (Gangrel, Lupinos, Fadas, Tenebrosidade ou Vicissitude).',
    origem: 'Suplementos Clássicos / Compêndio de Meta-Disciplinas',
  },
  {
    id: 'mudanca_rapida',
    nome: 'Mudança Rápida',
    nomeIngles: 'Quick Shift',
    categoriaTag: 'Gangrel / Transformação Instantânea',
    prerequisitos: [
      { disciplina: 'Rapidez', nivel: 3 },
      { disciplina: 'Metamorfose', nivel: 4 },
    ],
    custoXP: '28 XP (Dark Ages: 7 × 4) / 21 XP (Soma × 3)',
    paradaOuAtivacao: '1 Ponto de Sangue ao ativar Metamorfose',
    efeito:
      'Usa a velocidade sobre-humana para acelerar transformações corporais, assumindo formas de Metamorfose em apenas 1 turno.',
    origem: 'Compêndio Clássico / Adaptações Idade das Trevas',
  },
  {
    id: 'comandar_vassalo',
    nome: 'Comandar o Vassalo',
    nomeIngles: 'Command the Vassal',
    categoriaTag: 'Ventrue / Soberania',
    prerequisitos: [
      { disciplina: 'Dominação', nivel: 4 },
      { disciplina: 'Presença', nivel: 5 },
    ],
    custoXP: '35 XP (Dark Ages: 7 × 5) / 27 XP (Soma × 3)',
    paradaOuAtivacao: 'Manipulação + Liderança',
    efeito:
      'Une Majestade com Dominação, impedindo que a vítima gaste Força de Vontade para resistir aos comandos diretos do senhor.',
    origem: 'Compêndios de Meta-Disciplinas Clássicos',
  },
  {
    id: 'aproximacao_lealdade',
    nome: 'Aproximação da Lealdade Absoluta',
    nomeIngles: 'Approximation of Loyalty Absolute',
    categoriaTag: 'Ventrue Ancião / Subjugação',
    prerequisitos: [
      { disciplina: 'Dominação', nivel: 5 },
      { disciplina: 'Presença', nivel: 5 },
    ],
    custoXP: '30 XP',
    paradaOuAtivacao: 'Carisma + Liderança / Manipulação + Lábia',
    efeito:
      'Cria uma devoção mental e emocional quase indistinguível de um Laço de Sangue completo sem precisar alimentar a vítima.',
    origem: 'Counsel of Primogen (pág. 104)',
  },
  {
    id: 'aparar_inexpugnavel',
    nome: 'Defesa Inexpugnável',
    nomeIngles: 'Unassailable Parry',
    categoriaTag: 'Camarilla Ancião / Duelo',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 3 },
      { disciplina: 'Rapidez', nivel: 7 },
    ],
    custoXP: '30 a 42 XP',
    paradaOuAtivacao: 'Destreza + Armas Brancas / Esquiva',
    efeito:
      'Permite antecipar e aparar praticamente qualquer enxurrada de golpes corpo a corpo e à distância usando reflexos pré-cognitivos e velocidade de ancião.',
    origem: 'Guide to the Camarilla (pág. 117)',
  },
  {
    id: 'resiliencia_martir',
    nome: 'Resiliência do Mártir',
    nomeIngles: "Martyr's Resilience",
    categoriaTag: 'Camarilla Ancião / Absorção',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 4 },
      { disciplina: 'Fortitude', nivel: 7 },
    ],
    custoXP: '35 XP',
    paradaOuAtivacao: 'Vigor + Fortitude sob concentração',
    efeito:
      'Foca a mente e a resistência sobrenatural em grau de ancião para anular dores e sustentar o corpo diante de traumas normalmente fatais.',
    origem: 'Guide to the Camarilla (pág. 117)',
  },
  {
    id: 'eminencia_sombras',
    nome: 'Eminência das Sombras',
    nomeIngles: 'Eminence of Shade',
    categoriaTag: 'Lasombra Ancião / Possessão Sombria',
    prerequisitos: [
      { disciplina: 'Tenebrosidade', nivel: 5 },
      { disciplina: 'Dominação', nivel: 5 },
    ],
    custoXP: '35 XP (variante High Clans: Tenebrosidade 3 + Presença 3)',
    paradaOuAtivacao: '2 Pontos de Sangue + Força de Vontade',
    efeito:
      'Funde Avatar das Trevas e Possessão: transforma-se em sombra viva, penetra o corpo de um hospedeiro vivo ou morto-vivo e o controla por dentro como marionete.',
    origem: 'Players Guide to High Clans (pág. 166)',
  },
  {
    id: 'estoicismo_elemental',
    nome: 'Estoicismo Elemental',
    nomeIngles: 'Elemental Stoicism',
    categoriaTag: 'Camarilla Ancião / Invulnerabilidade',
    prerequisitos: [
      { disciplina: 'Fortitude', nivel: 8 },
      { disciplina: 'Ofuscação', nivel: 4 },
    ],
    custoXP: '40 XP',
    paradaOuAtivacao: 'Vigor + Fortitude + Ocultação',
    efeito:
      'Poder de Matusalém que confere resistência impressionante combinada com desvio perceptual das agressões físicas.',
    origem: 'Guide to the Camarilla (pág. 117)',
  },
  {
    id: 'armadilha_vitae',
    nome: 'Armadilha de Vitae',
    nomeIngles: 'Vitae Trap',
    categoriaTag: 'Assamita / Emboscada',
    prerequisitos: [
      { disciplina: 'Ofuscação', nivel: 5 },
      { disciplina: 'Quietus', nivel: 3 },
    ],
    custoXP: '35 XP (Dark Ages: 7 × 5) / 24 XP (Soma × 3)',
    paradaOuAtivacao: 'Gasto de sangue ácido preparado com Ofuscação',
    efeito:
      'O cainita oculta poças de seu próprio sangue ácido cáustico utilizando Ofuscação, infligindo dano agravado em quem pisar ou tocar.',
    origem: 'Compêndios Assamitas / Meta-Disciplinas',
  },
  {
    id: 'projecao_cadaverica',
    nome: 'Projeção Cadavérica',
    nomeIngles: 'Corpse Projection',
    categoriaTag: 'Capadócio Ancião / Possessão',
    prerequisitos: [
      { disciplina: 'Auspícios', nivel: 5 },
      { disciplina: 'Mortis', nivel: 6 },
    ],
    custoXP: '42 XP (Dark Ages: 7 × 6) / 33 XP (Soma × 3)',
    paradaOuAtivacao: 'Projeção Psíquica + Mortis sobre cadáver animado',
    efeito:
      'Permite ao ancião Capadócio ou Lâmia enviar sua forma astral a grandes distâncias para possuir e animar fisicamente um cadáver longínquo.',
    origem: 'Compêndio Idade das Trevas / Meta-Disciplinas',
  },
  {
    id: 'gerar_vozhd',
    nome: 'Gerar o Vozhd',
    nomeIngles: 'Birth the Vozhd',
    categoriaTag: 'Tzimisce / Sabá Ancião',
    prerequisitos: [
      { disciplina: 'Vicissitude', nivel: 6 },
      { disciplina: 'Animalismo', nivel: 6 },
    ],
    custoXP: '42 XP (Dark Ages: 7 × 6) / 36 XP (Soma × 3)',
    paradaOuAtivacao: 'Ritual prolongado com múltiplos carniçais e vitae',
    efeito:
      'O infame ritual de criação do Vozhd — costura e funde dezenas de carniçais e feras em uma máquina de cerco monstruosa do Sabá.',
    origem: 'Guide to the Sabbat / V20 Dark Ages',
  },
  {
    id: 'amalgama_sudario_fino',
    nome: 'Onde o Sudário Afina (Amálgama V5)',
    nomeIngles: 'Where the Shroud Thins',
    categoriaTag: 'Amálgama V5 / Hecata & Lasombra',
    prerequisitos: [
      { disciplina: 'Oblívio', nivel: 2 },
      { disciplina: 'Auspícios', nivel: 2 },
    ],
    custoXP: 'V5: Nível 2 (10 XP em clã / 14 XP fora de clã)',
    paradaOuAtivacao: 'Teste de Despertar + Raciocínio + Oblívio',
    efeito:
      'Determina a densidade local do Sudário entre o mundo físico e as Terras das Sombras, revelando se fantasmas podem atravessar.',
    origem: 'Vampire: The Masquerade V5 (Cults of the Blood Gods)',
  },
  {
    id: 'amalgama_precognicao_fatal',
    nome: 'Precognição Fatal (Amálgama V5)',
    nomeIngles: 'Fatal Precognition',
    categoriaTag: 'Amálgama V5 / Profecia',
    prerequisitos: [
      { disciplina: 'Oblívio', nivel: 3 },
      { disciplina: 'Potência', nivel: 2 },
    ],
    custoXP: 'V5: Nível 3 (15 XP em clã / 21 XP fora de clã)',
    paradaOuAtivacao: 'Teste de Despertar + Determinação + Oblívio',
    efeito:
      'O usuário fixa o olhar sobre um mortal percebido e tem uma visão profética clara de como ocorrerá sua morte violenta.',
    origem: 'Vampire: The Masquerade V5',
  },
];
