/**
 * Biblioteca Canônica dos Vampiros
 * Acervo digital particionado e leve para leitura no sistema:
 * 1. Vampiro: A Idade das Trevas (Livro Básico de 1996 - 1ª Edição)
 * 2. Vampiro: A Máscara (Vampire: The Masquerade)
 * 3. Guia da Camarilla (Vampiro: A Camarilla)
 * 4. O Livro de Nod (The Book of Nod)
 */

export interface CapituloLivro {
  id: string;
  numero: string;
  titulo: string;
  subtitulo?: string;
  conteudo: string; // Texto formatado em Markdown com seções e citações
}

export interface LivroVampiro {
  id: string;
  titulo: string;
  subtitulo: string;
  edicao: string;
  ano: string;
  categoria: 'dark_ages' | 'mascara' | 'camarilla' | 'lore_nod';
  capaIcon: string;
  corTema: string;
  descricaoBreve: string;
  sinopse: string;
  capitulos: CapituloLivro[];
}

export const LIVROS_BIBLIOTECA_VAMPIRO: LivroVampiro[] = [
  // =========================================================================
  // 1. O LIVRO DE NOD (THE BOOK OF NOD)
  // =========================================================================
  {
    id: 'livro_de_nod',
    titulo: 'O Livro de Nod',
    subtitulo: 'As Crônicas de Caim e os Provérbios dos Primeiros Amaldiçoados',
    edicao: 'Códice Ancestral (Tradução Acadêmica de Aristóteles de Laurent)',
    ano: 'Tempo Imemorial',
    categoria: 'lore_nod',
    capaIcon: '📜',
    corTema: 'from-amber-950 via-zinc-950 to-black border-amber-600/80 text-amber-300',
    descricaoBreve:
      'A bíblia proibida dos cainitas narrando o primeiro assassinato, o encontro com Lilith e a maldição dos Arcanjos.',
    sinopse:
      'Reunido a partir de fragmentos em papiro, pergaminhos gregos, hieróglifos coptas e estelas de pedra por sábios cainitas, o Livro de Nod relata a queda do Primeiro Assassino, o nascimento do Vampirismo, a Primeira Cidade de Enoque e a profecia aterradora da Gehenna.',
    capitulos: [
      {
        id: 'nod_prefacio',
        numero: 'Prefácio',
        titulo: 'A Busca do Erudito Aristóteles de Laurent',
        subtitulo: 'Nota aos Eruditos da Noite',
        conteudo: `> *"Não posso garantir a salvação de vossa alma caso prossigais na leitura destas estrofes. Pois a verdade sobre nosso Pai Negro é um fardo que consome a mente dos tolos e envenena o coração dos soberbos."*
> — **Aristóteles de Laurent**, Estudioso Malkaviano, 1795

Durante séculos, a Igreja dos Homens e os Príncipes da Torre de Marfim tentaram queimar cada fragmento deste texto. Para a Camarilla, o Livro de Nod é um mito perigoso que fomenta heresias do Sabá; para os anciões, é o espelho de sua própria condenação.

Os fragmentos aqui reunidos foram resgatados de tumbas nas areias de Gizé, criptas ocultas sob mosteiros ortodoxos em Salonica e pergaminhos conservados pelos escribas Capadócios antes de sua dispersão. Que o leitor observe com reverência: estas são as palavras ditadas na escuridão original.`,
      },
      {
        id: 'nod_cronica_caim_1',
        numero: 'Crônica de Caim — Parte I',
        titulo: 'O Primeiro Sangue e o Banimento',
        subtitulo: 'A Queda do Lavrador para a Noite de Nod',
        conteudo: `### O Canto do Começo

Eu canto sobre o primeiro pai, Caim.
Aquele que cultivava a terra negra sob a luz do sol nascente.
Aquele que colheu os frutos mais doces e os espalhou sobre o altar sagrado.

Mas o Senhor olhou apenas para o fumo gordo das crias de Abel,
o pastor de ovelhas. E a fumaça de Abel subiu suave aos céus,
enquanto os frutos de Caim apodreceram no chão.

> *"Por que minhas mãos calejadas colhem a terra para receber o desprezo?
> Se a carne e o sangue são a única dádiva agradável ao Criador,
> então darei ao solo o sangue do meu próprio irmão."*

No campo silente, Caim levantou a pedra pontiaguda.
E o sangue de Abel jorrou sobre a grama seca.
O primeiro sangue mortal a fertilizar a terra.

E o Senhor desceu em cólera e clamou:
*"Caim, onde está teu irmão?"*
E Caim respondeu através de dentes cerrados:
*"Acaso sou eu o guardião de meu irmão?"*

E a terra abriu sua boca para tragar o sangue inocente,
e uma marca indelével foi posta sobre a fronte de Caim,
para que homem ou besta alguma ousasse tirar sua vida.
E ele foi banido da face dos homens, empurrado para o deserto sombrio
da terra desolada de **Nod**.`,
      },
      {
        id: 'nod_cronica_caim_2',
        numero: 'Crônica de Caim — Parte II',
        titulo: 'O Encontro com Lilith',
        subtitulo: 'A Mãe da Noite e o Despertar do Sangue',
        conteudo: `### Na Escuridão de Nod

Caim vagou faminto e nu pelas trevas frias.
Nenhum fruto nascia para suas mãos; a terra o rejeitava e os animais fugiam.
Foi quando uma mulher envolta em seda negra e olhos de prata viva surgiu das brumas.

Era **Lilith**, a primeira esposa de Adão, que recusara se submeter aos homens e aos anjos.

> *"Vem a mim, lavrador de Abel", disse ela com lábios gélidos.
> "Pois eu também conheço o sabor do desterro e a fúria das estrelas vazias."*

Lilith levou Caim para sua morada de pedras e ossos.
Ela curou suas feridas e o alimentou com seu próprio sangue.
E quando o sangue de Lilith tocou os lábios ressequidos de Caim,
seus olhos se abriram para o além-mundo:

1. **A Descoberta da Disciplina**: Caim aprendeu a comandar a força dos membros (*Potência*), a velar sua forma com as sombras (*Ofuscação*) e a se mover mais veloz que o vento da tempestade (*Rapidez*).
2. **A Maldição da Fome**: Mas junto ao poder veio uma sede abrasadora que água alguma jamais aplacaria.`,
      },
      {
        id: 'nod_maldicoes_arcanjos',
        numero: 'Crônica de Caim — Parte III',
        titulo: 'A Visita dos Quatro Arcanjos',
        subtitulo: 'O Fogo, o Sol, a Besta e o Julgamento',
        conteudo: `### As Quatro Maldições

Enquanto Caim dormia nas margens do mar revolto, os Céus enviaram seus generais para oferecer-lhe perdão ou condenação:

#### 1. Miguel, a Espada de Luz
Miguel, o Arcanjo do Sol, desceu como fogo consumidor:
*"Caim, arrepende-te de teu crime e o Senhor te perdoará!"*
Mas Caim ergueu a cabeça e bradou:
*"Pela honra de minha dor, jamais me curvarei!"*
Então disse Miguel:
> *"Pois que assim seja. De agora em diante, o **FOGO** será teu inimigo mortal. Ele queimará tua carne como a cinza e acenderá o pavor em teu peito até o fim dos tempos."*

#### 2. Rafael, a Aurora Curadora
Veio então Rafael com vestes de alvorada:
*"Pede perdão, filho da terra, e serás recebido nos campos celestes."*
Caim cuspiu na areia e respondeu:
*"Não pelo perdão Dele eu sangrarei. Minha vontade me basta."*
E Rafael decretou:
> *"Pois que o **SOL** seja teu carrasco! O raio mais tímido da aurora queimará tuas entranhas e te condenará a rastejar como verme sob o manto da escuridão."*

#### 3. Uriel, o Ceifador Implacável
Desceu o anjo da morte silenciosa:
*"Tua recusa sela teu destino, assassino."*
E Uriel tocou o peito de Caim com a ponta de sua foice de gelo:
> *"Em teu peito habitará a **BESTA**. Ela rugirá faminta por sangue vivo. Todas as tuas afeições apodrecerão, e aqueles que abraçares carregarão tua maldição como peçonha eterna."*

#### 4. Gabriel, a Misericórdia
Por fim, Gabriel derramou uma lágrima sobre a terra seca:
> *"Caim, para que não sejas apenas um monstro na escuridão, deixo-te uma fresta de luz: a **GOLCONDA**. Se tua alma encontrar a reconciliação e o domínio sobre a Besta, poderás um dia andar novamente em paz."*`,
      },
      {
        id: 'nod_cidades_antediluvianos',
        numero: 'Crônica das Sombras',
        titulo: 'A Primeira e Segunda Cidades',
        subtitulo: 'Enoque, o Dilúvio e a Traição dos Treze',
        conteudo: `### A Primeira Cidade (Enoque)

Caim cansou-se da solidão e fundou uma grande muralha de pedras negras sobre o vale: a cidade de **Enoque**.
Ali, para aplacar seu vazio, ele abraçou três filhos da carne — a **Segunda Geração**:
- **Zillah**, a bela;
- **Irad**, o forte e destemido;
- **Enosh**, o sábio governante.

Estes três, por sua vez, criaram a **Terceira Geração**: os treze que viriam a ser os fundadores dos Grandes Clãs.

### O Grande Dilúvio e o Castigo
O Criador viu que a carne dos mortais fora escravizada pelos mortos-vivos e abriu as comportas dos céus. Uma tormenta imensa afogou Enoque sob as águas barrentas.
Quando as águas baixaram, Caim, consumido pelo luto e pelo desgosto de ver suas crias escravizando os homens, retirou-se para a solidão das montanhas.

### A Noite da Traição
Sem o Pai para protegê-los ou contê-los, os treze netos de Caim cercaram seus próprios progenitores da Segunda Geração:
> *"Eles cravaram presas naqueles que lhes deram a não-vida. Cometeram o pecado nefando da **Diablerie**, bebendo o sangue e as almas de Zillah, Irad e Enosh."*

Ao saber da atrocidade, Caim amaldiçoou cada um dos treze conforme seus pecados, dando origem aos vícios e defeitos que marcam cada clã até esta noite.`,
      },
      {
        id: 'nod_profecia_gehenna',
        numero: 'Crônica dos Segredos',
        titulo: 'Os Sinais da Gehenna',
        subtitulo: 'Quando a Estrela Vermelha Sangrar no Céu',
        conteudo: `### Os Sinais da Noite Final

> *"Prestai atenção aos ventos da meia-noite, pois eles trarão o cheiro de cinzas frias."*

Caim profetizou que nos dias finais:
1. **O Sangue se Tornará Ralo**: O sangue das crias será como água (a 14ª e 15ª gerações), incapaz de sustentar os poderes ancestrais.
2. **Os Sem-Clã Andarão pelas Ruas**: Os Caitiff e os Renegados serão mais numerosos que os nobres de estirpe.
3. **A Estrela Rubra**: Um astro da cor de sangue ferido brilhará no firmamento diurno e noturno.
4. **O Despertar dos Matusaléns**: Os Antediluvianos se erguerão de seu torpor milenar famintos não pelo sangue dos mortais, mas pela carne e sangue de seus próprios filhos.

> *"E naquele dia, o pai devorará o filho, e o senhor devorará o vassalo. E a terra será lavada no mesmo sangue que Abel derramou no princípio."*`,
      },
    ],
  },

  // =========================================================================
  // 2. VAMPIRO: A IDADE DAS TREVAS (LIVRO BÁSICO DE 1996 - 1ª EDIÇÃO)
  // =========================================================================
  {
    id: 'livro_dark_ages_1e',
    titulo: 'Vampiro: A Idade das Trevas',
    subtitulo: 'O Livro Básico de 1996 — Crônicas da Longa Noite',
    edicao: '1ª Edição Canônica (White Wolf / Devir Livraria 1998)',
    ano: '1197 d.C.',
    categoria: 'dark_ages',
    capaIcon: '⚔️',
    corTema: 'from-rose-950 via-zinc-950 to-black border-red-700/80 text-rose-300',
    descricaoBreve:
      'O tomo sagrado do RPG medieval de horror pessoal: os altos e baixos clãs, feudos, caminhos da virtude e a Besta no ano de 1197.',
    sinopse:
      'Ambientado na Europa de 1197 durante a Terceira Cruzada e o auge do feudalismo, Vampiro: A Idade das Trevas coloca os cainitas não como fugitivos ocultos na modernidade, mas como senhores nobres e monstros soberanos nos castelos e catedrais da cristandade medieval.',
    capitulos: [
      {
        id: 'da1e_introducao',
        numero: 'Capítulo I',
        titulo: 'A Longa Noite Medieval',
        subtitulo: 'O Mundo das Trevas no Século XII',
        conteudo: `### O Feudalismo Sobrenatural

O ano é **1197**. As estradas da Europa são lamas traiçoeiras cercadas por florestas impenetráveis onde lobos, bandoleiros e coisas piores espreitam nas sombras.
Os mortais vivem sob o jugo triplo: o Rei, o Bispo e o **Senhor da Noite**.

Diferente do mundo contemporâneo, no século XII a *Máscara* ainda não existe como um decreto centralizado da Camarilla. Os cainitas governam seus domínios abertamente ou através de vassalos mortais aterrorizados. Um vampiro medieval é um barão em sua torre de menagem, um inquisidor sombrio no claustro ou um demônio que cobra tributo de sangue nas pontes e aldeias.

### As Seis Tradições Medievais
Embora não houvesse Camarilla, a antiga lei cainita já era transmitida de senhor para cria:
1. **O Pacto de Silêncio**: Não revelai tua verdadeira natureza àqueles que não são do Sangue (para evitar a ira de Deus e das tochas populares).
2. **O Domínio Feudal**: Teu domínio é teu feudo sagrado; ninguém deve caçar nele sem tua expressa permissão.
3. **A Prole**: Só podes gerar uma cria com o consentimento do teu próprio Senhor ou Ancião.
4. **A Responsabilidade**: És responsável pelas ações de tua cria até que ela seja libertada formalmente.
5. **A Hospitalidade**: Apresentai-vos ao senhor feudal do território assim que adentrardes suas fronteiras.
6. **A Destruição**: Nenhum cainita tirará a não-vida de seu irmão sem o julgamento formal do Príncipe ou Barão local.`,
      },
      {
        id: 'da1e_altos_baixos_clas',
        numero: 'Capítulo II',
        titulo: 'A Aristocracia da Noite: Altos e Baixos Clãs',
        subtitulo: 'A Divisão Social nos Feudos da Meia-Noite',
        conteudo: `### A Separação Feudal dos Clãs

Na Idade das Trevas, os treze clãs são rigidamente separados em duas castas sociais incontornáveis:

#### Os Altos Clãs (A Nobreza Soberana)
Aqueles que reivindicam honra, sangue nobre, intelecto e comando divino sobre os reinos mortais:
- **Ventrue (Patrícios / Senhores da Guerra)**: Cavaleiros de armadura pesada, barões e cruzados que lideram os homens pela espada e pela nobreza do sangue.
- **Toreador (Artesãos / Cortesãos)**: Patronos das artes góticas, poetas provençais e cortesãs que controlam as cortes de amor e as catedrais.
- **Lasombra (Magistrados / Senhores das Sombras)**: Príncipes do mar Mediterrâneo e conselheiros espirituais da Igreja Romana, manipuladores do abismo e da fé.
- **Capadócios (Ladrões de Cadáveres / Eruditos da Morte)**: Clã contemplativo de monges, filósofos e necromantes dedicados a desvendar o mistério da Morte e de Deus através da disciplina **Mortis**.
- **Tzimisce (Voivodas / Senhores dos Cárpatos)**: Demônios territoriais do Leste Europeu que moldam a carne e os ossos como argila viva com a **Vicissitude**.

#### Os Baixos Clãs (Os Servos e Marginalizados)
Aqueles vistos pela nobreza como ferramentas, aberrações ou plebeus sem direito a coroas:
- **Brujah (Filósofos Belicosos)**: Intelectuais radicais e guerreiros inconformados que lamentam a queima de Cartago.
- **Gangrel (Bárbaros Selvagens)**: Caçadores nômades que dormem sob a terra batida e convivem com os lobos da floresta.
- **Malkavianos (Profetas Loucos)**: Videntes abençoados com visões perturbadoras, loucos de corte e oráculos da desgraça.
- **Nosferatu (Leprosos)**: Amaldiçoados com deformidades asquerosas, vivem sob os esgotos e criptas, mestres dos segredos e da espionagem.
- **Ravnos (Salteadores / Trapaceiros)**: Ilusionistas nômades e encantadores que viajam em carroças pelos limites do mundo conhecido.
- **Seguidores de Set (Ofitas / Sacerdotes de Tífon)**: Adoradores da Serpente que corrompem a cristandade e o islã através do vício e do veneno.
- **Assamitas (Assassinos Sarracenos)**: Lâminas temidas de Alamut que cobram tributo de sangue e julgam outros vampiros pelas leis de Haqim.`,
      },
      {
        id: 'da1e_caminhos',
        numero: 'Capítulo III',
        titulo: 'As Trilhas e Caminhos Medievais',
        subtitulo: 'A Moralidade que Freia a Fera sem a Humanidade Moderna',
        conteudo: `### Substituindo a Frágil Humanidade

Na Idade das Trevas, a maioria dos cainitas considera o conceito moderno de "Humanidade" fraco e ingênuo diante dos horrores da peste, das guerras e do inferno. Para não sucumbirem à Besta, os cainitas adotam **Caminhos Morais (Via)**:

1. **Via Regalis (Caminho dos Reis)**:
   - *Conceito*: O poder é um mandato sagrado. Servir com lealdade a quem comanda e exigir obediência absoluta dos inferiores.
   - *Pecados*: Demonstrar covardia, permitir motins, falhar em honrar seu juramento de suserania.

2. **Via Humanitatis (Caminho da Humanidade)**:
   - *Conceito*: Apegar-se às lembranças da vida mortal e proteger os inocentes para não se tornar um monstro total.
   - *Pecados*: Matar sem necessidade, causar sofrimento gratuito, sucumbir à frieza da pedra.

3. **Via Caeli (Caminho do Céu / Paraíso)**:
   - *Conceito*: O cainita é um instrumento da ira e da punição de Deus na terra. Pela oração, penitência e caça aos infiéis ele busca a absolvição.
   - *Pecados*: Blasfemar contra o Criador, faltar às preces da noite, tolerar hereges e demônios.

4. **Via Bestiae (Caminho da Besta)**:
   - *Conceito*: A harmonia com o predador interior. A Besta não é uma inimiga, mas a verdadeira natureza cainita que deve ser respeitada como o leão respeita a savana.
   - *Pecados*: Raciocinar excessivamente, viver em cidades claustrofóbicas, matar por crueldade e não por alimento.

5. **Via Peccati (Caminho do Pecado)**:
   - *Conceito*: O pecado é uma arte e um caminho espiritual. Através do excesso, da dor e do prazer carnal e sangrento, a alma transcende os limites mortais.
   - *Pecados*: Recuar diante de um desejo, demonstrar culpa cristã, agir com moderação.

6. **Via Sanguinis (Caminho do Sangue)**:
   - *Conceito*: Exclusivo dos Assamitas. Honrar a sabedoria de Haqim, cultivar a disciplina do corpo e purificar a raça dos mortos-vivos.
   - *Pecados*: Desperdiçar vitae sagrada, desobedecer os anciões de Alamut, recusar o contrato de sangue.`,
      },
      {
        id: 'da1e_combate_feudal',
        numero: 'Capítulo IV',
        titulo: 'Sistemas de Combate e Sobrevivência Feudal',
        subtitulo: 'Armaduras de Aço, Montarias e Dano Agravado',
        conteudo: `### O Choque de Aço e Sangue

Nas noites medievais, o combate não envolve armas de fogo ou pistolas silenciosas. Os duelos são decididos pelo fio da espada longa, pelo impacto da lança em investida montada e pela resistência da cota de malha:

#### As Armaduras Medievais
- **Armadura Leve (Couro Curtido)**: Proteção 1 (absorção extra), sem penalidades.
- **Armadura Composta (Couro Reforçado com Anéis de Metal)**: Proteção 2, -1 em testes de Destreza.
- **Armadura Pesada (Cota de Malha Completa)**: Proteção 3, -1 em Destreza, -1 em Percepção (visão obstruída por coifa de aço).
- **Armadura de Cavaleiro (Placas Inteiriças sobre Malha)**: Proteção 4, -2 em Destreza, -2 em Percepção, exige Força 3 para suportar os 40 kg de peso.

#### O Terror do Cavalo
Cavalos são montarias assustadiças. Um cavalo mortal sente o odor do predador morto-vivo e exige testes imediatos de **Carisma + Cavalgar** para não derrubar o cainita ou sair em debandada desenfreada. Cavalos de guerra treinados resistem melhor, desferindo coices de Força + 2 dados de dano.

#### Os Dois Horrores Supremos: Fogo e Sol
Nenhum atributo ou armadura comum protege contra o fogo ou a luz solar. Apenas a disciplina **Fortitude** permite a absorção desse dano tenebroso, considerado sempre **Dano Agravado**, cuja cura exige tempo, descanso em torpor ou dias inteiros consumindo sangue precioso.`,
      },
    ],
  },

  // =========================================================================
  // 3. VAMPIRO: A MÁSCARA (VAMPIRE: THE MASQUERADE)
  // =========================================================================
  {
    id: 'livro_mascara',
    titulo: 'Vampiro: A Máscara',
    subtitulo: 'O Horror Pessoal no Mundo Moderno',
    edicao: 'Edição Clássica Storyteller',
    ano: 'Século XX / XXI',
    categoria: 'mascara',
    capaIcon: '🩸',
    corTema: 'from-emerald-950 via-zinc-950 to-black border-emerald-700/80 text-emerald-300',
    descricaoBreve:
      'A obra-prima do RPG gótico-punk: a luta pela sobrevivência e pela sanidade nos labirintos de néon e arranha-céus das metrópoles contemporâneas.',
    sinopse:
      'Com o fim da Idade Média e o avanço da tecnologia humana, os vampiros foram forçados a criar a Máscara. Agora, nos becos úmidos e nas boates de néon, predadores imortais travam guerras políticas veladas através de peões mortais enquanto tentam não perder o último vestígio de sua alma.',
    capitulos: [
      {
        id: 'vm_condicao_cainita',
        numero: 'Capítulo I',
        titulo: 'A Condição de Condenado',
        subtitulo: 'A Maldição Eterna na Cidade Moderna',
        conteudo: `### O Horror Pessoal

Você não é um herói salvador da pátria; você é um parasita da noite.
Cada noite que você acorda em seu refúgio, um ponto de seu sangue foi consumido apenas para manter seu coração paralisado e seus olhos abertos.
Para continuar existindo, você **precisa caçar**.

> *"Um monstro eu sou, para que um monstro eu não me torne."*

A tragédia do cainita é que, para preservar a própria existência, ele deve roubar a vida dos seres humanos — os mesmos seres que um dia foram seus irmãos, pais, filhos e amantes. Conforme as décadas passam e todos aqueles que você amou morrem e viram pó, o mundo mortal se torna um teatro distante e indiferente.

### A Besta Interior
Dentro de cada vampiro habita um demônio instintivo e faminto: a **Besta**.
Ela não se importa com honra, alianças ou planos políticos. Quando você é ferido com fogo, ela exige fuga cega (*Rötschreck*); quando você é humilhado ou fica com fome extrema, ela assume o controle do seu corpo em uma fúria sanguinária (*Frenesi*), atacando qualquer pessoa que estiver ao seu redor.`,
      },
      {
        id: 'vm_treze_clas',
        numero: 'Capítulo II',
        titulo: 'Os Treze Clãs no Mundo das Trevas',
        subtitulo: 'As Linhagens Amaldiçoadas e suas Fraquezas',
        conteudo: `### A Herança dos Treze Antediluvianos

Cada cainita descende espiritualmente de um dos treze fundadores da Terceira Cidade, herdando seus dons sobrenaturais e sua maldição única:

1. **Brujah**: Rebeldes inflamados, filósofos revolucionários e motoqueiros arruaceiros. *Maldição*: Dificuldade de resistir ao Frenesi é sempre 2 pontos mais alta.
2. **Gangrel**: Selvagens metamorfos que se sentem mais à vontade nas florestas que no asfalto. *Maldição*: A cada frenesi, adquirem um traço físico animal permanente.
3. **Malkavianos**: Videntes brilhantes e insanos conectados pela Rede da Loucura (*Cobweb*). *Maldição*: Possuem ao menos uma perturbação mental incurável desde o Abraço.
4. **Nosferatu**: Mestres dos esgotos, espiões de aluguel e deformidades ambulantes. *Maldição*: Aparência zero; quebram a Máscara apenas ao mostrar o rosto.
5. **Toreador**: Artistas, modelos, mecenas e esnobes que buscam a beleza para lembrar o que era sentir. *Maldição*: Entram em transe catatônico diante de obras de arte excepcionais.
6. **Tremere**: Os usurpadores usurpados; magos herméticos que roubaram a imortalidade e criaram a *Taumaturgia*. *Maldição*: Rígida lealdade ao Conselho dos Sete (Laço de Sangue forçado).
7. **Ventrue**: A aristocracia corporativa e política; reis e CEOs da noite. *Maldição*: Paladar refinado exclusivo (só se alimentam de um tipo específico de presa, como nobres, virgens ou artistas).
8. **Lasombra**: Senhores do Sabá e mestres das sombras. *Maldição*: Não possuem reflexo em espelhos ou câmeras de vídeo.
9. **Tzimisce**: Os dragões mutadores da carne do Leste Europeu. *Maldição*: Devem dormir enterrados com pelo menos dois punhados de terra de sua terra natal.
10. **Assamitas**: Assassinos e alquimistas do Oriente Médio. *Maldição*: Sede perigosa pelo sangue de outros vampiros (vício em vitae).
11. **Giovanni**: Mafiosos venezianos e necromantes incestuosos. *Maldição*: O Beijo causa dor excruciante e mortal na vítima em vez de prazer.
12. **Ravnos**: Mestres da ilusão e andarilhos ciganos. *Maldição*: Compulsão irresistível por um tipo específico de crime ou trapaça.
13. **Seguidores de Set**: Serpentes e traficantes de corrupção da alma. *Maldição*: Sensibilidade atroz à luz solar (dobro de ferimentos).`,
      },
      {
        id: 'vm_laco_diablerie',
        numero: 'Capítulo III',
        titulo: 'O Sangue: O Laço e o Pecado da Diablerie',
        subtitulo: 'A Corrupção do Vinculum e a Devoração da Alma',
        conteudo: `### O Laço de Sangue (Vinculum)

O sangue de um cainita possui propriedades de escravização mística sobre quem o bebe:
- **Primeiro Gole**: A semente da afeição. O alvo começa a ter sonhos e empatia intensa pelo doador.
- **Segundo Gole**: A semente da lealdade. O alvo faz favores e não suporta ver o doador ferido.
- **Terceiro Gole**: O **Laço Completo**. O alvo torna-se um escravo amoroso e cego do doador, incapaz de desobedecer ordens diretas ou prejudicá-lo deliberadamente.

### O Pecado Supremo: A Diablerie
Quando um vampiro drena todo o sangue de outro vampiro e continua sugando até arrancar o sopro da vida de seu coração, ele absorve não apenas o sangue, mas a **própria alma** da vítima:
> *"A Diablerie é a experiência mais intensa e extasiante que um monstro pode experimentar — superior a qualquer êxtase mortal. O agressor rouba a potência de geração da vítima caso ela seja mais antiga."*

**O Preço da Diablerie**:
A aura do diablerista fica manchada por **veios negros pulsantes** visíveis através da disciplina *Auspícios* por anos ou décadas. O tribunal de qualquer cidade da Camarilla condena o diablerista à **Morte Final imediata sob Caçada de Sangue** sem direito a defesa.`,
      },
    ],
  },

  // =========================================================================
  // 4. GUIA DA CAMARILLA (VAMPIRO: A CAMARILLA)
  // =========================================================================
  {
    id: 'livro_camarilla',
    titulo: 'Guia da Camarilla',
    subtitulo: 'A Torre de Marfim e as Leis da Cidade',
    edicao: 'Suplemento Oficial de Facção',
    ano: 'Século Moderno',
    categoria: 'camarilla',
    capaIcon: '🏛️',
    corTema: 'from-blue-950 via-zinc-950 to-black border-blue-600/80 text-blue-300',
    descricaoBreve:
      'A anatomia política da maior seita vampírica: Príncipes, Primigênies, Justiçares, o Silêncio da Máscara e a Caçada de Sangue.',
    sinopse:
      'Nascida das cinzas da Inquisição Medieval e da Revolta dos Anarquistas em 1493, a Camarilla é o maior império político da noite. Conheça as leis inquebrantáveis, a corte do Príncipe, as intrigas das Harpias e as punições aplicadas pelos temidos Justiçares e Arcontes.',
    capitulos: [
      {
        id: 'cam_origem_marfim',
        numero: 'Capítulo I',
        titulo: 'A Fundação da Torre de Marfim',
        subtitulo: 'A Convenção de Thorns de 1493',
        conteudo: `### O Fim da Guerra Aberta

No século XV, as fogueiras da Inquisição mortal estavam queimando centenas de vampiros por toda a Europa. Os anciões sacrificavam suas crias mais jovens para salvar a própria pele, gerando a sangrenta **Revolta dos Anarquistas**.

Percebendo que a destruição mútua seria o fim de toda a espécie cainita, sete nobres clãs reuniram-se na pequena vila de **Thorns** (Inglaterra) em 1493 para assinar o maior tratado de paz da história sobrenatural: a fundação da **Camarilla**.

### Os Pilares Fundadores
A seita foi erguida sobre a premissa de que os vampiros devem se esconder dos mortais a qualquer custo, construindo uma máscara impenetrável de racionalidade e mentiras no mundo mortal, mantendo a estrutura feudal aristocrática onde os mais velhos governam os mais novos.`,
      },
      {
        id: 'cam_seis_tradicoes',
        numero: 'Capítulo II',
        titulo: 'As Seis Tradições Oficiais da Torre',
        subtitulo: 'A Lei Suprema que Governa Cada Metrópole',
        conteudo: `### O Código Penal dos Imortais

Em qualquer cidade governada pela Camarilla, estas seis regras têm força de lei absoluta e incontestável:

#### 1. A Máscara
> *"Não revelarás tua verdadeira natureza àqueles que não são do Sangue. Fazer isso é renunciar aos teus direitos de Sangue."*
A quebra da Máscara é a maior ofensa capital na Camarilla, punida com execução sumária.

#### 2. O Domínio
> *"Teu domínio é tua própria preocupação. Todos os outros devem-te respeito enquanto nele estiverem. Ninguém pode desafiar tua palavra em teu domínio."*
O Príncipe é o senhor supremo do domínio da cidade inteira.

#### 3. A Prole
> *"Só gerarás outro com a permissão de teu Ancião. Se criares outro sem a bênção de teu Ancião, tu e tua prole sereis mortos."*
Controla superpopulação e evita que idiotas revelem a espécie aos humanos.

#### 4. A Responsabilidade
> *"Aqueles que criares são teus próprios filhos. Até que tua prole seja libertada, tu a comandarás em todas as coisas. Seus pecados serão teus para pagar."*

#### 5. A Hospitalidade
> *"Honra o domínio de outro. Quando chegares a uma cidade estrangeira, deves apresentar-te àquele que nela governa. Sem a palavra de aceitação, não és nada."*

#### 6. A Destruição
> *"És proibido de destruir outro de tua espécie. O direito de destruição pertence apenas ao teu Ancião. Apenas o Ancião do Domínio pode convocar a Caçada de Sangue."*`,
      },
      {
        id: 'cam_corte_urbana',
        numero: 'Capítulo III',
        titulo: 'Os Oficiais da Corte e o Elísio',
        subtitulo: 'A Estrutura de Poder de Uma Cidade',
        conteudo: `### O Governo da Cidade

Uma metrópole da Camarilla é administrada por uma corte estrita:

- **O Príncipe**: Não é necessariamente um monarca hereditário, mas o cainita mais poderoso, influente e temido da cidade, cuja palavra é lei.
- **O Conselho de Primigênie**: Representantes dos clãs fundadores que aconselham (e vigiam) o Príncipe.
- **O Senescal**: O primeiro-ministro do Príncipe, responsável pela burocracia e por presidir a corte em sua ausência.
- **O Xerife**: O braço armado do Príncipe; o investigador e executor das leis que caça transgressores.
- **Os Cães de Caça**: Executores menores que auxiliam o Xerife em operações de combate.
- **As Harpias**: Os juízes sociais da corte; vampiros influentes que decidem quem tem prestígio, quem está em desgraça e quem deve favores a quem através de fofocas e escândalos.
- **O Guardião do Elísio**: O administrador dos santuários neutros da cidade (museus, teatros, bibliotecas) onde qualquer violência física, ameaça ou uso de disciplinas é estritamente proibido.`,
      },
    ],
  },
];
