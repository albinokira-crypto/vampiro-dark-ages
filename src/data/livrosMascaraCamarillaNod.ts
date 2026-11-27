import type { LivroVampiro } from './livrosVampiro';

export const LIVROS_MODERNOS_E_NOD: LivroVampiro[] = [
  // =========================================================================
  // 1. O LIVRO DE NOD (THE BOOK OF NOD)
  // =========================================================================
  {
    id: 'livro_de_nod',
    titulo: 'As Crônicas de Caim',
    subtitulo: 'As Crônicas de Caim, os Mandamentos Ancestrais e a Profecia da Gehenna',
    edicao: 'Códice Ancestral (Tradução e Compilação Acadêmica de Aristóteles de Laurent)',
    ano: 'Tempo Imemorial / Século XVIII',
    categoria: 'lore_nod',
    capaIcon: '📜',
    corTema: 'from-amber-950 via-zinc-950 to-black border-amber-600/80 text-amber-300',
    descricaoBreve:
      'A bíblia proibida dos cainitas: o primeiro homicídio, o encontro místico com Lilith, as três maldições angélicas, a fundação de Enoque e os sinais aterrorizantes da Gehenna.',
    sinopse:
      'Reunido a partir de fragmentos em papiro, rolos hebraicos, placas cuneiformes sumérias e pergaminhos resgatados de mosteiros na Capadócia e no Egito, o Livro de Nod é a mais sagrada e temida crônica do mundo dos mortos-vivos. Proibido pela Inquisição e silenciado pela Camarilla moderna como um perigo herético, este tomo revela as origens míticas do Primeiro Assassino e a profecia fatal que dita o fim dos tempos.',
    capitulos: [
      {
        id: 'nod_prefacio',
        numero: 'Prefácio Acadêmico',
        titulo: 'A Advertência aos Eruditos da Noite',
        subtitulo: 'Por Aristóteles de Laurent, Acadêmico Malkaviano',
        conteudo: `> *"Não posso garantir a salvação de tua alma caso prossigas na leitura destas estrofes. Pois a verdade sobre nosso Pai Negro é um fardo pesado que consome a mente dos tolos e transforma em cinzas o coração dos soberbos."*
> — **Aristóteles de Laurent**, 1795

Durante milênios, a Igreja dos Mortais e os Príncipes da Torre de Marfim tentaram queimar cada fragmento deste texto. Para os governantes da Camarilla, o Livro de Nod é um conto de fadas perigoso que fomenta a histeria milenarista do Sabá; para os anciões, no entanto, é o espelho exato de sua própria condenação.

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

Mas o Senhor olhou apenas para o fumo gordo das crias de Abel, o pastor de ovelhas. E a fumaça de Abel subiu suave aos céus, enquanto os frutos de Caim apodreceram no chão.

> *"Por que minhas mãos calejadas colhem a terra para receber o desprezo?
> Se a carne e o sangue são a única dádiva agradável ao Criador,
> então darei ao solo o sangue do meu próprio irmão."*

No campo silente, Caim levantou a pedra pontiaguda. E o sangue de Abel jorrou sobre a grama seca. O primeiro sangue mortal a fertilizar a terra.

E o Senhor desceu em cólera e clamou: *"Caim, onde está teu irmão?"*
E Caim respondeu através de dentes cerrados: *"Acaso sou eu o guardião de meu irmão?"*

E a terra abriu sua boca para tragar o sangue inocente, e uma marca indelével foi posta sobre a fronte de Caim, para que homem ou besta alguma ousasse tirar sua vida. E ele foi banido da face dos homens, empurrado para o deserto sombrio da terra desolada de **Nod**.`,
      },
      {
        id: 'nod_cronica_caim_2',
        numero: 'Crônica de Caim — Parte II',
        titulo: 'O Encontro com Lilith',
        subtitulo: 'A Mãe da Noite e o Despertar da Magia Noturna',
        conteudo: `### A Rainha do Deserto
Sozinho na terra de Nod, onde nem os corvos ousavam voar, Caim vagou em prantos e desespero. Suas lágrimas molhavam a poeira cinzenta quando uma mulher de pele branca como marfim e cabelos negros como o abismo surgiu diante dele.

Era **Lilith**, a primeira esposa de Adão, aquela que se recusou a curvar-se e foi lançada às sombras antes mesmo da criação de Eva.

> *"Eu conheço tua dor, Caim de Nod. Teu pai expulsou-me como o Criador te expulsou. Vem à minha tenda de ossos e seda negra, e ensinar-te-ei como fazer da noite o teu reino eterno."*

Lilith acolheu o fugitivo. Com uma lâmina afiada, cortou o próprio pulso e ofereceu a Caim:
> *"Bebe do meu sangue e desperta para o que verdadeiramente és."*

E Caim bebeu da vitae de Lilith. E as escamas caíram de seus olhos: ele aprendeu a moldar as sombras (Tenebrosidade), a ordenar os pensamentos (Dominação), a acelerar os passos além do vento (Rapidez) e a rasgar o véu do invisível (Ofuscação). Caim tornou-se o Primeiro Mestre da Noite.`,
      },
      {
        id: 'nod_maldicao_anjos',
        numero: 'Crônica de Caim — Parte III',
        titulo: 'A Tripla Maldição dos Arcanjos',
        subtitulo: 'Miguel, Rafael e Uriel selam o Destino de Caim',
        conteudo: `### A Visita Celestial
Vendo o poder tenebroso que Caim acumulara na tenda de Lilith, o Senhor enviou três arcanjos para oferecer-lhe uma última oportunidade de redenção e arrependimento.

#### 1. Miguel, o General da Luz
O primeiro a descer foi o Arcanjo Miguel, portando a espada flamejante da justiça:
> *"Caim, filho de Adão! Pede perdão pelo sangue de Abel e o Senhor acolherá tua alma de volta à graça."*

Caim respondeu com orgulho imutável:
> *"Não pedirei perdão Àquele que desprezou o suor de meu trabalho. Não me curvarei!"*

Miguel então brandiu sua lâmina incandescente e proferiu a Primeira Sentença:
> *"Pois que assim seja! A partir desta hora, **o Fogo será o teu terror eterno**. Suas chamas queimarão tua carne como nenhuma arma mortal jamais queimou, e teus ossos tremerão diante da menor fagulha!"*

#### 2. Rafael, o Médico dos Céus
Na hora seguinte, Rafael desceu em asas douradas e falou com doçura:
> *"Caim, a misericórdia ainda te espera. Não deixes que o orgulho de Miguel seja tua condenação. Arrepende-te agora!"*

E Caim cuspiu na areia e replicou:
> *"Não pela Tua graça, nem pela Tua misericórdia viverei. Eu sou meu próprio senhor!"*

Rafael suspirou com tristeza infinita e decretou a Segunda Sentença:
> *"Então o Sol, a fonte da vida e do calor de Deus, será tua perdição. **A luz do dia ferverá teu sangue**, arrancará teus olhos e transformará tua carne em cinzas frias. Viverás para sempre aprisionado nas sombras da noite!"*

#### 3. Uriel, o Senhor da Sepultura
Por fim, Uriel, o arcanjo da foice e da morte, desceu como um trovão tenebroso:
> *"Arrepende-te, assassino, ou serás para sempre separado da paz dos túmulos!"*

Caim ergueu a cabeça e gritou para os céus:
> *"Nunca!"*

E Uriel selou a Terceira e Suprema Sentença:
> *"Que tua comida seja apenas o Sangue vivo dos mortais! Tudo o que colheres da terra apodrecerá em tua boca como cinza seca. Viverás para sempre sedento, arrastando tua Besta faminta pelos séculos dos séculos!"*

#### A Esperança de Gabriel
Quando os três se retiraram, o Arcanjo Gabriel desceu em silêncio e tocou a fronte marcada de Caim:
> *"Para que não sejas apenas um demônio sem retorno, deixo-te uma fresta: a **GOLCONDA**. Se tua alma encontrar a reconciliação e dominar a Besta interior, poderás um dia andar novamente em paz."*`,
      },
      {
        id: 'nod_primeira_segunda_cidade',
        numero: 'Crônica das Sombras',
        titulo: 'Enoque e a Traição dos Treze',
        subtitulo: 'A Criação dos Clãs e a Noite da Diablerie',
        conteudo: `### A Primeira Cidade (Enoque)
Cansado de sua solidão milenar, Caim construiu uma metrópole fortificada nas planícies do Oriente: a gloriosa cidade de **Enoque**. Lá, ele abraçou três filhos para governar a seu lado — a **Segunda Geração**:
- **Zillah**, a bela e sábia;
- **Irad**, o general indomável;
- **Enosh**, o arquiteto e administrador.

Estes três, com a permissão do Pai, geraram a **Terceira Geração**: os treze que se tornariam os progenitores dos Grandes Clãs.

### O Dilúvio e a Ira Divina
O Criador viu que os imortais governavam os humanos como deuses cruéis e abriu as represas dos céus. Uma inundação colossal lavou Enoque, sepultando as muralhas de basalto sob as águas.
Desolado com a destruição e culpando-se pelo sofrimento do mundo, Caim recolheu-se em exílio profundo e proibiu que novas crias fossem feitas.

### A Noite da Traição
Sem o Pai para protegê-los, os treze netos rebeldes cercaram Zillah, Irad e Enosh na Segunda Cidade. Em um frenesi hediondo de ambição, cravaram suas presas nos próprios progenitores e cometeram a primeira grande **Diablerie**, bebendo o sangue e as almas de seus senhores.

Ao saber do crime, Caim emergiu do deserto e lançou uma maldição indelével sobre cada um dos treze conforme seus pecados, dando origem aos defeitos de sangue que punem cada clã até as noites de hoje.`,
      },
      {
        id: 'nod_gehenna',
        numero: 'Crônica dos Segredos',
        titulo: 'A Profecia da Gehenna e o Fim dos Tempos',
        subtitulo: 'O Despertar dos Matusaléns e a Noite das Cinzas',
        conteudo: `### Os Sinais da Noite Final
> *"Prestai atenção aos ventos da meia-noite, pois eles trarão o cheiro de cinzas frias."*

Caim deixou gravado nos rolos de bronze os sinais infalíveis que precederão a **Gehenna**:
1. **O Sangue se Tornará Água**: As últimas gerações de cainitas (a 14ª e 15ª gerações) carregarão um sangue tão ralo que mal conseguirão manter as disciplinas dos ancestrais.
2. **A Marcha dos Sem-Clã**: Os Caitiff e os Sangue-Ralo serão mais numerosos nas ruas do que os nobres de estirpe pura.
3. **A Estrela Rubra**: Um astro da cor de sangue ferido brilhará no firmamento, visível tanto ao meio-dia quanto na meia-noite.
4. **O Despertar da Terra**: Os Antediluvianos se erguerão de seu sono milenar sob cidades e florestas. Famintos não pelo sangue do gado mortal, mas sedentos pela carne e vitae de seus próprios filhos.

> *"E naquele dia, o pai devorará o filho, e o senhor devorará o vassalo. E a terra será lavada no mesmo sangue que Abel derramou no princípio."*`,
      },
    ],
  },

  // =========================================================================
  // 2. VAMPIRO: A MÁSCARA (VAMPIRE: THE MASQUERADE)
  // =========================================================================
  {
    id: 'livro_vampiro_mascara',
    titulo: 'Noites Contemporâneas (Livro Básico)',
    subtitulo: 'O Horror Gótico-Pessoal nas Noites Contemporâneas',
    edicao: 'Edição Revisada / Livro Básico Moderno',
    ano: 'Era Contemporânea',
    categoria: 'mascara',
    capaIcon: '🩸',
    corTema: 'from-red-950 via-zinc-950 to-stone-900 border-red-800/80 text-rose-200',
    descricaoBreve:
      'A transição do feudalismo medieval para a guerrilha urbana moderna: o sigilo absoluto da Máscara, a Torre de Marfim e a luta pela alma sob as luzes de neon.',
    sinopse:
      'Quando as fogueiras da Inquisição medieval quase extinguiram a raça cainita e a pólvora mortal nivelou o campo de batalha, os vampiros foram forçados a recuar para as sombras. Em Vampiro: A Máscara, a sobrevivência exige camuflagem total na era dos arranha-céus, câmeras de segurança e redes digitais. A Besta ruge por sangue, mas o cainita deve fingir ser humano para não ser caçado pela sociedade moderna.',
    capitulos: [
      {
        id: 'masc_cap1_fim_feudos',
        numero: 'Capítulo I',
        titulo: 'A Queda dos Feudos e o Fogo da Inquisição',
        subtitulo: 'Por Que a Máscara se Tornou a Lei Suprema',
        conteudo: `### O Fim da Arrogância Medieval
Durante a Idade das Trevas, os cainitas acreditavam ser semideuses intocáveis. Governando castelos e cobrando dízimos abertos, chamaram a atenção de um poder que subestimaram: a humanidade unida pelo pavor.

No século XV, os camponeses e a Igreja Católica se organizaram. Armados com tochas, água benta, estacas e, sobretudo, as primeiras armas de fogo e canhões, a **Primeira Inquisição** invadiu catedrais e castelos. Anciões milenares foram arrancados de seus sarcófagos à luz do meio-dia e queimados em praças públicas diante de multidões ensandecidas.

Para não serem varridos da face da Terra, os líderes dos clãs sobreviventes reuniram-se e decretaram:
> *"A partir desta noite, nós não existimos. O homem deve acreditar que somos apenas lendas de terror, pesadelos de crianças e superstições do passado. Esta é a **Máscara**, e quem a quebrar será destruído por nós mesmos antes que os caçadores venham."*`,
      },
      {
        id: 'masc_cap2_faccoes',
        numero: 'Capítulo II',
        titulo: 'A Guerra Invisível: Camarilla, Sabá e Anarquistas',
        subtitulo: 'As Seitas da Noite Moderna',
        conteudo: `### As Grandes Facções
O mundo cainita moderno está dividido em três grandes blocos ideológicos irreconciliáveis:

1. **A Camarilla (A Torre de Marfim)**:
   A maior e mais bem organizada seita do planeta. Fundada formalmente pelos Ventrue, Toreador, Tremere, Malkavianos, Nosferatu, Brujah e Gangrel. Defende a aplicação ferrenha da Máscara, o respeito irrestrito aos Príncipes urbanos e a preservação da Humanidade como escudo contra a Besta.

2. **O Sabá (A Espada de Caim)**:
   Uma seita apocalíptica e violenta originada no Leste Europeu e Espanha, liderada pelos clãs Tzimisce e Lasombra rebeldes. O Sabá rejeita a Humanidade como fraqueza de gado, venera as Trilhas da Iluminação e prega que os vampiros devem dominar abertamente os mortais como predadores supremos e preparar-se militarmente para enfrentar os Antediluvianos na Gehenna.

3. **O Movimento Anarquista**:
   Composto principalmente por cainitas jovens que odeiam a tirania sufocante dos anciões da Camarilla, mas reconhecem que a loucura sanguinária do Sabá só atrai caçadores mortais. Lutam por democracias noturnas e autogestão dos domínios urbanos.`,
      },
      {
        id: 'masc_cap3_cacada_sangue',
        numero: 'Capítulo III',
        titulo: 'A Caçada de Sangue na Selva de Pedra',
        subtitulo: 'O Juízo Final nas Cidades Modernas',
        conteudo: `### A Sentença Capital
Quando um cainita comete o crime imperdoável de quebrar a Máscara publicamente, assassinar outro vampiro no Elísio ou trair a liderança da cidade, o Príncipe convoca a **Caçada de Sangue (Blood Hunt)**.

Todos os vampiros do domínio recebem o chamado através de mensageiros ou códigos cifrados. Por uma noite inteira, todas as leis de proteção do réu são suspensas:
- É permitido rastreá-lo por becos, metrôs e telhados.
- É concedida a imunidade total para rasgá-lo membro a membro.
- Frequentemente, o próprio direito de **Diablerie** sobre o criminoso é tolerado ou concedido como recompensa ao caçador vitorioso.`,
      },
    ],
  },

  // =========================================================================
  // 3. GUIA DA CAMARILLA (VAMPIRO: A CAMARILLA)
  // =========================================================================
  {
    id: 'livro_guia_camarilla',
    titulo: 'A Torre de Marfim & Seis Tradições',
    subtitulo: 'A Estrutura de Poder, o Elísio e o Protocolo das Seis Tradições',
    edicao: 'Tomo Institucional da Torre de Marfim',
    ano: '1493 aos Dias Atuais',
    categoria: 'camarilla',
    capaIcon: '🏛️',
    corTema: 'from-zinc-950 via-slate-950 to-neutral-900 border-slate-600/80 text-slate-200',
    descricaoBreve:
      'O compêndio político definitivo da Torre de Marfim: a aplicação jurídica das Tradições, a hierarquia da Corte Urbana, Justiçares e as leis invioláveis do Elísio.',
    sinopse:
      'Nascida formalmente no Tratado de Thorns em 1493 após a sangrenta Revolta Anarquista, a Camarilla é a instituição mais poderosa da história dos mortos-vivos. Este livro apresenta os bastidores do poder político das metrópoles: o papel do Príncipe e de sua Primigênie, a etiqueta estrita do Elísio, as funções do Xerife e do Guardião, e os julgamentos implacáveis executados pelos temidos Justiçares e seus Arcontes.',
    capitulos: [
      {
        id: 'cam_thorns',
        numero: 'Capítulo I',
        titulo: 'A Paz de Thorns de 1493',
        subtitulo: 'O Nascimento Oficial da Torre de Marfim',
        conteudo: `### A Convenção de Thorns
Em outubro de 1493, na pequena aldeia inglesa de Thorns, os representantes dos sete clãs fundadores reuniram-se após décadas de guerra civil contra a rebelião dos jovens cainitas.

O documento ali assinado mudou para sempre a história dos imortais:
1. Todos os rebeldes anarquistas que se rendessem e jurassem lealdade às Seis Tradições receberiam anistia total.
2. O Clã Assamita, obrigado a submeter-se perante o poderio combinado da Camarilla e a feitiçaria Tremere, aceitou uma maldição mágica que os impedia de beber a vitae de outros cainitas sem serem envenenados.
3. A criação de um corpo judicial permanente: os **Justiçares**, magistrados com autoridade suprema e transnacional para intervir em qualquer cidade e depor qualquer governante corrupto.`,
      },
      {
        id: 'cam_oficiais_corte',
        numero: 'Capítulo II',
        titulo: 'A Hierarquia da Corte Urbana',
        subtitulo: 'Os Pilares de Governo da Cidade',
        conteudo: `### A Máquina de Governo
Uma metrópole da Camarilla é administrada por uma corte estrita e implacável:

- **O Príncipe**: O governante supremo. Mantém a ordem, concede direitos de caça, autoriza a criação de prole e tem o monopólio da Caçada de Sangue.
- **O Conselho de Primigênie**: Composto pelos anciões representantes de cada um dos clãs da cidade. Aconselham o Príncipe, votam decretos e vigiam mutuamente suas ambições.
- **O Senescal**: O braço direito do Príncipe; administra as finanças, audiências públicas e assume interinamente o trono caso o soberano entre em torpor ou viaje.
- **O Xerife**: O executor da lei e investigador-chefe. Tem autoridade para prender, interrogar e usar força letal contra transgressores da Máscara.
- **Os Cães de Caça**: Tropas de choque subordinadas ao Xerife para cerco e combate armado.
- **As Harpias**: Os juízes sociais da corte; controlam o sistema de Dívidas de Sangue (Boons), fofocas de salão e decidem quem é honrado ou ridicularizado no Elísio.
- **O Guardião do Elísio**: O mestre supremo dos locais sagrados neutros.`,
      },
      {
        id: 'cam_elisio_regras',
        numero: 'Capítulo III',
        titulo: 'O Elísio: O Santuário da Paz',
        subtitulo: 'As Quatro Leis Invioláveis do Santuário Neutro',
        conteudo: `### A Ilha de Serenidade
O Elísio é um refúgio neutro estabelecido pelo Príncipe — geralmente em museus de arte sacra, teatros de ópera, bibliotecas históricas ou catedrais antigas — onde todos os cainitas podem reunir-se para negociar e socializar sem medo de emboscadas.

#### As Quatro Leis do Elísio:
1. **Nenhuma Violência Física**: É estritamente proibido desembainhar qualquer lâmina, erguer os punhos ou atacar fisicamente outro indivíduo dentro dos limites do santuário.
2. **Nenhuma Arma Visível**: Todas as espadas e armas de fogo devem ser entregues aos guardas na entrada do salão.
3. **Nenhum Uso de Disciplinas Sobrenaturais**: É vedado usar Dominação, Presença, Auspícios agressivos ou qualquer poder que altere as mentes dos presentes ou danifique o local.
4. **Respeito Absoluto à Arte e à Propriedade**: O Elísio abriga a cultura sublime dos homens; qualquer dano às pinturas, esculturas ou livros é punido com severidade extrema pelo Guardião.`,
      },
    ],
  },
];
