import type { LivroVampiro } from './livrosVampiro';

export const LIVROS_CLANS_VAMPIRO: LivroVampiro[] = [
  // =========================================================================
  // 1. LIVRO DE CLÃ: ASSAMITA
  // =========================================================================
  {
    id: 'livro_cla_assamita',
    titulo: 'Livro de Clã: Assamita',
    subtitulo: 'Os Filhos de Haqim, Juízes Silenciosos e Assassinos de Alamut',
    edicao: 'Libellus Sanguinis III / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🗡️',
    corTema: 'from-amber-950 via-zinc-950 to-stone-900 border-amber-700/80 text-amber-200',
    descricaoBreve:
      'Os guardiões da fortaleza inexpugnável da Montanha da Águia (Alamut), guiados pelo Código de Haqim como juízes implacáveis de toda a prole de Caim.',
    sinopse:
      'Nas terras áridas do Levante e nos cumes enevoados da Pérsia ergue-se Alamut, o ninho dos Filhos de Haqim. Temidos pelos cruzados ocidentais como assassinos mercenários de sangue frio, os Assamitas consideram-se os verdadeiros magistrados cainitas, ordenados a colher a vitae dos corruptos e aproximar-se do Pai Supremo através da diablerie ritual.',
    capitulos: [
      {
        id: 'assamita_origens',
        numero: 'Capítulo I',
        titulo: 'O Julgamento de Haqim e o Ninho da Águia',
        subtitulo: 'A Segunda Cidade e a Criação de Alamut',
        conteudo: `### O Guardião Silencioso
Haqim nunca desejou reinar em tronos de mármore como seus irmãos Antediluvianos de Enoque. Enquanto Ventrue e Brujah disputavam a adulação dos mortais, Haqim foi investido como o Grande Juiz, aquele que aplicaria a punição necessária aos cainitas rebeldes que quebrassem as leis divinas.

Quando a discórdia assolou a Segunda Cidade, Haqim retirou-se com seus leais guerreiros para o Oriente. Nas montanhas Elburz, encontrou o pico escarpado que se tornaria **Alamut**, a Montanha da Águia. Lá, entalhou na rocha viva os preceitos sagrados que governam o clã há milênios:

> *"Não derramarás o sangue daquele que segue o Caminho.
> Manterás a fortaleza inviolada contra os olhos dos incrédulos.
> Recolherás o tributo dos corruptos para alimentar os Anciões."*

Durante as Cruzadas, os Assamitas observaram com desdém os barões vampiros de Roma e Bizâncio que avançavam sobre a Terra Santa. Aos olhos do clã, cada nobre cruzado é apenas uma reserva ambulante de vitae indigna que aguarda o fio da lâmina.`,
      },
      {
        id: 'assamita_castas',
        numero: 'Capítulo II',
        titulo: 'As Três Castas da Montanha',
        subtitulo: 'Guerreiros, Vizires e Feiticeiros',
        conteudo: `### A Trindade de Haqim
Diferente dos clãs ocidentais fragmentados em feudos, o clã Assamita opera como uma irmandade coesa e estritamente hierárquica, dividida em três castas complementares:

1. **Os Guerreiros**: O punho visível do clã. Especialistas em infiltração, combate armado e assassinato de alvos de alto valor. São contratados por príncipes europeus em troca de dízimos pesados de vitae concentrada.
2. **Os Vizires**: Eruditos, diplomáticos e administradores. Dedicam-se à teologia, filosofia árabe, geometria e manutenção do código legal de Haqim.
3. **Os Feiticeiros**: Mestres da *Feitiçaria Assamita* (Dur-An-Ki). Guardam os mistérios ancestrais do sangue, criam elixires ritualísticos e sustentam as barreiras místicas que ocultam Alamut dos olhos mortais e espirituais.

No topo da hierarquia reside o **Velho da Montanha**, o regente supremo escolhido diretamente entre os mais antigos mathusaléns para transmitir as sentenças de Haqim.`,
      },
      {
        id: 'assamita_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'A Sede de Julgamento e a Maldição da Vitae',
        subtitulo: 'Disciplinas: Quietus, Rapidez, Ofuscação',
        conteudo: `### Disciplinas de Clã
- **Quietus**: A arte esotérica do sangue dos Assamitas. Permite silenciar completamente o ambiente, condensar a própria vitae em venenos corrosivos que queimam a carne mortal e o sangue cainita, ou drenar a vitalidade através de lâminas banhadas.
- **Rapidez**: Velocidade sobrenatural que transforma o assassino em um borrão imperceptível no campo de batalha.
- **Ofuscação**: O dom do ocultamento místico, permitindo atravessar patrulhas de castelos fortificados sem produzir som ou sombra.

### Fraqueza de Clã (1ª Edição / Idade das Trevas)
O sangue dos Filhos de Haqim carrega uma atração fatal pela vitae de outros vampiros. Sempre que um Assamita experimenta a vitae de outro cainita, ele deve realizar um teste de Autocontrole (dificuldade 8 na 1ª Edição). Se falhar, é tomado por uma fúria canibal para drenar o vampiro até a morte (diablerie).

Além disso, como dízimo sagrado para a Montanha, todo guerreiro do clã deve entregar um quinto de qualquer vitae colhida aos seus superiores de Alamut.`,
      },
    ],
  },

  // =========================================================================
  // 2. LIVRO DE CLÃ: BRUJAH
  // =========================================================================
  {
    id: 'livro_cla_brujah',
    titulo: 'Livro de Clã: Brujah',
    subtitulo: 'Os Reis-Filósofos, Zealotas e a Glória Perdida de Cartago',
    edicao: 'Libellus Sanguinis II / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '⚔️',
    corTema: 'from-red-950 via-zinc-950 to-stone-900 border-red-700/80 text-rose-200',
    descricaoBreve:
      'Guerreiros-eruditos que combinam paixão revolucionária, debate filosófico e força brutal na busca incansável pela utopia onde cainitas e mortais coexistam.',
    sinopse:
      'Na Idade das Trevas, os Brujah não são meros vândalos anarquistas; são cavaleiros intelectuais, oradores inflamados e filósofos guerreiros que choram as cinzas de Cartago. Destruída pela perfídia romana liderada pelos Ventrue e Malkavianos, a utopia cartaginesa ainda queima na alma de cada Brujah, impulsionando-os contra qualquer tirania que pretenda subjugar o homem ou o cainita.',
    capitulos: [
      {
        id: 'brujah_cartago',
        numero: 'Capítulo I',
        titulo: 'O Sonho em Chamas de Cartago',
        subtitulo: 'A Cidade Onde Deuses e Homens Caminharam Juntos',
        conteudo: `### O Testamento de Troile
Enquanto os outros clãs usavam a humanidade como gado aterrorizado em currais de pedra, os Brujah criaram **Cartago**, uma civilização luminosa nas margens do Mediterrâneo onde mortais e cainitas colaboravam publicamente na ciência, filosofia e governo.

> *"Nós mostramos ao mundo que a Maldição de Caim não precisava ser uma jaula de trevas. Nós fomos reis que debatiam com camponeses e generais que ouviam poetas."*
> — **Guillaume de Montpellier**, Ancião Brujah, 1145

Mas a ambição dos patrícios Ventrue de Roma, envenenados pelo medo e atiçados pela intriga dos Malkavianos, levantou as legiões de Cipião. Cartago foi cercada, pilhada e queimada até o chão. A terra foi semeada com sal para que nada florescesse, e os antigos mestres Brujah foram enterrados sob toneladas de pedra ardente. Desde aquela noite, o clã carrega um luto que se transforma em labaredas de vingança.`,
      },
      {
        id: 'brujah_linhagens_medievais',
        numero: 'Capítulo II',
        titulo: 'Zealotas, Sofistas e Cavaleiros Andantes',
        subtitulo: 'O Papel do Clã nas Cortes Medievais',
        conteudo: `### As Facções do Sangue
Na Europa do século XII, os Brujah se dividem em três grandes vertentes de pensamento:

1. **Os Sofistas**: Professores universitários em Paris, Bolonha e Oxford. Eruditos que utilizam a retórica para desarmar príncipes autoritários e incitar questionamentos sobre o direito divino dos reis.
2. **Os Cavaleiros Errantes**: Guerreiros em armadura de cota de malha que juram lealdade a causas de honra, protegendo estradas contra bandidos e tiranos locais, enfrentando o clã Ventrue em campos de batalha justos.
3. **Os Zealotas**: Radicais inflamados pela Trilha do Paradoxo ou Trilha do Sangue que pregam a destruição imediata de toda autoridade cainita estabelecida para forçar o renascimento de uma nova Cartago.`,
      },
      {
        id: 'brujah_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'O Sangue Indomável',
        subtitulo: 'Disciplinas: Potência, Rapidez, Presença',
        conteudo: `### Disciplinas de Clã
- **Potência**: Força física titânica, capaz de estilhaçar portões de castelo com as mãos desnudas e despedaçar couraças de aço temperado.
- **Rapidez**: O reflexo fulminante que permite brandir montantes pesados como se fossem estiletes de pena.
- **Presença**: A eloquência magnética que comove multidões, faz cavaleiros ajoelharem-se em lágrimas ou inspira exércitos inteiros a lutar até o último homem.

### Fraqueza de Clã (1ª Edição / Idade das Trevas)
A paixão violenta que queima no peito do Brujah é tanto sua maior força quanto sua perdição. O calor da vitae de Troile torna os Brujah extremamente suscetíveis à Fera.

Nas regras canônicas da 1ª Edição, a dificuldade de qualquer teste de **Autocontrole** para resistir ao Frenesi ou Röstschreck é sempre **aumentada em 2**, nunca podendo ultrapassar 10. Um Brujah provocado raramente mantém a calma por muito tempo.`,
      },
    ],
  },

  // =========================================================================
  // 3. LIVRO DE CLÃ: CAPADÓCIO
  // =========================================================================
  {
    id: 'livro_cla_capadocio',
    titulo: 'Livro de Clã: Capadócio',
    subtitulo: 'Os Ladrões de Cadáveres, Necromantes e Eruditos da Sepultura',
    edicao: 'Libellus Sanguinis II / Canon 1ª Edição 1996',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '💀',
    corTema: 'from-stone-900 via-neutral-950 to-zinc-900 border-stone-500/80 text-stone-300',
    descricaoBreve:
      'Sacerdotes pálidos, filósofos da decomposição e mestres da disciplina proibida de Mortis, dedicados a desvendar o mistério definitivo: a comunhão com a própria Morte.',
    sinopse:
      'Sob as cidades subterrâneas de Kaymakli e Derinkuyu, na Anatólia, o Antediluviano Ashur — venerado como Capadócio — reuniu teólogos, monges eremitas e sábios obcecados pelo limiar que separa a carne viva da carniça podre. Venerados nas cortes feudais como conselheiros melancólicos e sacerdotes fúnebres, os Capadócios buscam o conhecimento supremo sobre a transmigração das almas antes que a ambição de seus criados mercadores venezianos (os Giovanni) sele seu trágico destino.',
    capitulos: [
      {
        id: 'capadocio_cidades_subterraneas',
        numero: 'Capítulo I',
        titulo: 'A Rocha Oca da Anatólia',
        subtitulo: 'Ashur e a Teologia do Fim dos Tempos',
        conteudo: `### O Profeta do Sepulcro
Ashur era um místico e sacerdote antes mesmo de Caim chamá-lo à noite. Para ele, o Vampirismo nunca foi uma dádiva imperial ou maldição mundana, mas um estado divino de meia-morte projetado para transcender as limitações humanas e alcançar o coração de Deus através da morte.

Nas profundezas da Capadócia, o clã esculpiu basílicas inteiras sob rochas vulcânicas. Milhares de corpos foram mumificados em nichos de calcário, servindo como biblioteca viva para as preces dos eremitas do clã.

> *"O pulso do mortal é um tique-taque tolo em direção à podridão. Nós somos a eternidade silenciosa que testemunha a poeira retornar à poeira."*
> — **Constância**, Alta Sacerdotisa de Erciyes, 1190

Na magnífica fortaleza de **Erciyes**, o clã conserva os rolos mais antigos do Livro de Nod, rezando diariamente para que a Morte lhes conceda o entendimento final sobre a redenção da alma de Caim.`,
      },
      {
        id: 'capadocio_estudos_cadavéricos',
        numero: 'Capítulo II',
        titulo: 'Os Escribas da Decomposição',
        subtitulo: 'Conselheiros das Cortes e a Ameaça Giovanni',
        conteudo: `### Monges e Embalsamadores
Nas cortes do Sacro Império e de Constantinopla, os príncipes mantêm Capadócios como confessores espirituais, arquivistas e coveiros reais. Sua frieza impassível garante conselhos desprovidos de vaidade mundana.

Porém, as sombras se adensam no seio do próprio clã. Fascinado pelos segredos dos mercadores marítimos que dominam o comércio de especiarias e a necromancia ritual em Veneza, o patriarca Ashur concedeu o Abraço ao nobre veneziano **Augustus Giovanni**. Muitos sábios avisaram o pai sobre a ganância mercantil dessa linhagem adotiva, mas o patriarca cego pela profecia não ouviu os alertas de seus próprios filhos de sangue.`,
      },
      {
        id: 'capadocio_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'O Dom de Mortis e a Marca do Cadáver',
        subtitulo: 'Disciplinas: Mortis, Auspícios, Fortitude',
        conteudo: `### Disciplinas de Clã (Canônico 1ª Edição)
- **Mortis**: A magia primordial da morte, exclusiva dos Capadócios. Permite paralisar articulações como rigor mortis, apodrecer carne viva à distância, conservar ou reanimar carcaças e convocar o hálito da peste. *(Nota Canônica: Na 1ª Edição de 1996, o clã possui estritamente Mortis, e NUNCA a Necromancia moderna).*
- **Auspícios**: Visão espectral capaz de ler auras de doentes, prever o instante exato da morte de uma criatura e perscrutar os reinos das sombras.
- **Fortitude**: A resiliência cadavérica do corpo imune ao cansaço, venenos mortais e golpes de armas brancas.

### Fraqueza de Clã (1ª Edição)
A proximidade com a sepultura cobra um preço irreversível na carne: todo Capadócio possui a palidez de um cadáver ressecado que morreu há vários dias. A pele é fria como mármore de túmulo, os olhos perdem o brilho da vida e um odor residual de bálsamo funerário e decomposição cerca o vampiro.

Em termos de regras da 1ª Edição, a sua aparência sobrenaturalmente mórbida impõe dificuldade mínima de +1 ou +2 em testes sociais onde devam interagir com humanos vivos que não estejam acostumados com cortejos fúnebres.`,
      },
    ],
  },

  // =========================================================================
  // 4. LIVRO DE CLÃ: GANGREL
  // =========================================================================
  {
    id: 'livro_cla_gangrel',
    titulo: 'Livro de Clã: Gangrel',
    subtitulo: 'Os Selvagens, Mestres da Floresta e Andarilhos da Noite',
    edicao: 'Libellus Sanguinis I / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🐺',
    corTema: 'from-amber-950 via-stone-950 to-emerald-950 border-amber-800/80 text-amber-100',
    descricaoBreve:
      'Predadores nômades que rejeitam o confinamento sufocante das muralhas de pedra para reinar como feras soberanas nas florestas escuras e estepes selvagens.',
    sinopse:
      'Filhos da andarilha Ennoia, os Gangrel são o único clã que não teme as sombras da mata virgem nem os uivos dos lupinos que dilaceram outros cainitas desavisados. Sobreviventes natos, eles dormem no seio da terra fértil, caçam em bando com as alcateias e riem dos príncipes empoleirados em castelos que cairão em cinzas quando as cidades forem engolidas pelas raízes.',
    capitulos: [
      {
        id: 'gangrel_ennoia',
        numero: 'Capítulo I',
        titulo: 'A Mãe das Terras Ermas',
        subtitulo: 'Ennoia e a Lei do Mais Forte',
        conteudo: `### O Uivo Sob a Lua Medieval
Ennoia recusou-se a habitar os palácios de pedra da Primeira Cidade. Quando Caim ordenou que governassem sobre a humanidade, ela caminhou para as florestas infinitas, onde os dentes e as garras decidem quem respira ao alvorecer.

> *"Vossos muros de pedra não vos protegem da Morte; apenas garantem que sereis devorados dentro de vosso próprio sepulcro. A terra é o único lar que não trai seus filhos."*

Na Idade das Trevas, a Europa é coberta pela imensa e aterrorizante Floresta Hercínia. Os viajantes rezam a todos os santos antes de cruzar as estradas lamacentas da Boêmia ou da Germânia, pois sabem que os olhos dourados que brilham na escuridão entre as árvores pertencem aos cainitas que usam peles de urso e dentes de lobo.`,
      },
      {
        id: 'gangrel_costumes',
        numero: 'Capítulo II',
        titulo: 'O Círculo de Fogueira e os Andarilhos',
        subtitulo: 'Tradições Nômades e a Convivência com Feras',
        conteudo: `### A Sociedade dos Ermos
Os Gangrel não mantêm cortes pomposas, mas reúnem-se nos chamados **Concílios dos Ermos** ao redor de grandes fogueiras acesas sob carvalhos centenários. Lá, contam fábulas sobre suas caçadas, disputam desafios físicos de liderança e testam os jovens recém-abraçados.

Respeitados e temidos até mesmo pelos orgulhosos cavaleiros Ventrue, os Gangrel são frequentemente contratados como batedores e mensageiros interurbanos, pois são os únicos capazes de atravessar territórios infestados por lobisomens através de camuflagem mística e velocidade animal.`,
      },
      {
        id: 'gangrel_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'O Chamado da Fera Interior',
        subtitulo: 'Disciplinas: Animalismo, Fortitude, Metamorfose',
        conteudo: `### Disciplinas de Clã
- **Animalismo**: A linguagem das feras. Permite acalmar corcéis assustados, comandar alcateias de lobos, espionar através dos olhos de corvos e silenciar ou incitar a Fera interior de outros cainitas.
- **Fortitude**: Couraça natural que permite ignorar o frio congelante do inverno russo e sobreviver a ferimentos provocados por flechas e lanças.
- **Metamorfose**: O poder primal de mesclar-se com a terra para o repouso diurno, afiar garras capazes de cortar rocha e aço, ou transmutar-se completamente em lobos e névoas opacas.

### Fraqueza de Clã (1ª Edição)
O Gangrel é tão íntimo de sua Fera primordial que, cada vez que sucumbe ao **Frenesi**, um fragmento do animal permanece impresso em seu corpo mortal.

A cada frenesi sofrido, o personagem desenvolve uma característica bestial permanente (olhos de fenda felinos, orelhas pontiagudas, escamas leves, unhas grossas, penugem espessa ou voz gutural). Conforme acumula traços de fera, suas características sociais e Aparência começam a decair inevitavelmente.`,
      },
    ],
  },

  // =========================================================================
  // 5. LIVRO DE CLÃ: LASOMBRA
  // =========================================================================
  {
    id: 'livro_cla_lasombra',
    titulo: 'Livro de Clã: Lasombra',
    subtitulo: 'Os Mestres das Sombras, Magísteres e Reis do Mar Noturno',
    edicao: 'Libellus Sanguinis I / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🌑',
    corTema: 'from-blue-950 via-zinc-950 to-black border-blue-800/80 text-blue-200',
    descricaoBreve:
      'Aristocratas implacáveis da bacia do Mediterrâneo, sacerdotes sombrios da Igreja e manipuladores da própria substância negra do Abismo.',
    sinopse:
      'Nos palácios de Aragão, Sicília, Gênova e Veneza, os Magísteres do Clã Lasombra consideram o poder temporal dos mortais um mero instrumento para a elevação de sua própria glória. Mestres em teologia inquisitorial e navegação marítima, os Lasombra ordenam reis sem usar coroas visíveis e comandam os tentáculos do Abismo para sufocar qualquer rival na escuridão absoluta.',
    capitulos: [
      {
        id: 'lasombra_abismo',
        numero: 'Capítulo I',
        titulo: 'O Chamado do Oceano Negro',
        subtitulo: 'O Patriarca e as Profundezas do Abismo',
        conteudo: `### O Poder das Trevas Vivas
Enquanto outros clãs temem a escuridão como o manto onde se escondem demônios, o pai do Clã Lasombra mergulhou no próprio coração do nada. Para os Lasombra, a luz do sol é ilusória e efêmera; as sombras são eternas e compõem a verdadeira substância da criação.

No castelo de **Castel d'Ombro**, na costa da Sicília, o Antediluviano residia fitando o mar escuro, ensinando seus filhos que o poder absoluto exige a eliminação de qualquer fraqueza moral:

> *"O mundo é uma partida de xadrez disputada entre deuses cegos. Quem teme sujar as mãos com sangue ou trevas está fadado a ser um peão descartável."*

Os Lasombra abraçam predominantemente nobres ibéricos, capitães mercantes destemidos e prelados católicos de alto escalão, tecendo uma teia de influência que domina bispados e principados inteiros.`,
      },
      {
        id: 'lasombra_igreja',
        numero: 'Capítulo II',
        titulo: 'Os Magísteres e a Batina',
        subtitulo: 'O Controle da Cristandade Medieval',
        conteudo: `### A Cruz e a Sombra
Nenhum clã compreende melhor a psicologia do poder da Igreja Católica do que os Lasombra. Enquanto os Ventrue constroem fortalezas militares que custam fortunas, os Lasombra sussurram nos ouvidos dos cardeais, bispos e inquisidores em confessionários sombrios.

Ao patrocinar mosteiros e catedrais com o ouro de suas frotas mediterrâneas, os Lasombra garantem que a doutrina cristã mantenha o rebanho mortal temeroso e dócil. Aqueles que desafiam as diretrizes dos Magísteres são rapidamente denunciados como hereges e entregues às fogueiras da Inquisição mortal, sem que uma gota de sangue cainita seja derramada publicamente.`,
      },
      {
        id: 'lasombra_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'Os Tentáculos da Noite',
        subtitulo: 'Disciplinas: Tenebrosidade, Dominação, Potência',
        conteudo: `### Disciplinas de Clã
- **Tenebrosidade**: O poder aterrador de manipular sombras físicas, arrancando fios do Abismo para extinguir tochas, cegar inimigos, projetar braços e tentáculos negros que esmagam cavaleiros armados ou metamorfosear o próprio corpo em uma mancha viva de trevas.
- **Dominação**: A força mental aristocrática que escraviza a vontade alheia com uma simples palavra ou olhar fulminante.
- **Potência**: A força bruta do sangue para esmagar ossos e quebrar barreiras defensivas.

### Fraqueza de Clã (1ª Edição)
O pacto com as trevas profundas roubou dos Lasombra qualquer imagem refletida. Nenhum Lasombra projeta reflexo em espelhos de vidro, pratas polidas, elmos brilhantes ou na superfície calma da água. Além disso, suas sombras frequentemente se movem de maneira sutil e independente, traindo sua natureza sobrenatural diante de observadores atentos.`,
      },
    ],
  },

  // =========================================================================
  // 6. LIVRO DE CLÃ: MALKAVIANO
  // =========================================================================
  {
    id: 'livro_cla_malkaviano',
    titulo: 'Livro de Clã: Malkaviano',
    subtitulo: 'Os Lunáticos, Videntes da Loucura e a Rede da Teia',
    edicao: 'Libellus Sanguinis IV / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🎭',
    corTema: 'from-purple-950 via-zinc-950 to-stone-900 border-purple-700/80 text-purple-200',
    descricaoBreve:
      'Fraturados pela verdade incompreensível do cosmos, os Malkavianos são bobos da corte temidos, santos insanos e oráculos que veem através do tempo.',
    sinopse:
      'Quando o Antediluviano Malkav foi amaldiçoado por Caim, sua mente se partiu em miríades de fragmentos que continuam conectados por uma teia invisível de telepatia e sabedoria delirante. Na Idade das Trevas, os príncipes toleram os Malkavianos com calafrios: suas risadas zombeteiras e profecias enigmáticas revelam traições antes mesmo que sejam concebidas nos corações dos vassalos.',
    capitulos: [
      {
        id: 'malkaviano_visao',
        numero: 'Capítulo I',
        titulo: 'O Espelho Quebrado de Malkav',
        subtitulo: 'A Loucura como Porta para a Verdade Maior',
        conteudo: `### A Voz Que Nunca Cala
O homem são enxerga apenas o véu conveniente que esconde o caos. O Malkaviano, no instante em que recebe o Beijo, tem suas correntes da razão humana despedaçadas para que possa ouvir o murmúrio constante de todos os seus irmãos de sangue ao redor do mundo.

> *"Vós dizeis que eu perdi o juízo. Eu digo que vós apenas trancastes vossa mente num quarto escuro e chamastes vossa ignorância de sensatez. Vinde ver as cores da Lua sangrando sobre a catedral!"*

Na Europa medieval, muitos Malkavianos atuam como bobos da corte real, eremitas do deserto, leprosários e mendigos santos. Sua condição lhes concede imunidade poética para dizer ao rosto dos reis as verdades que nenhum outro nobre ousaria sussurrar.`,
      },
      {
        id: 'malkaviano_teia',
        numero: 'Capítulo II',
        titulo: 'A Teia da Loucura e as Pragas Mentais',
        subtitulo: 'A Comunhão Oculta dos Amaldiçoados',
        conteudo: `### O Sussurro Invisível
A lendária **Grande Teia** (The Cobweb) conecta cada descendente de Malkav. Em noites de alinhamento celestial ou grande catástrofe cósmica, centenas de Malkavianos espalhados de Lisboa a Novgorod acordam ao mesmo tempo com visões idênticas ou gargalhadas histéricas inexplicáveis.

Eles são terapeutas reversos: compreendem as fragilidades e dores psicológicas de seus alvos com tamanha precisão que podem desmontar a sanidade de um oponente com uma única frase bem colocada em um banquete de corte.`,
      },
      {
        id: 'malkaviano_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'O Eco da Fratura',
        subtitulo: 'Disciplinas: Auspícios, Demência / Dominação, Ofuscação',
        conteudo: `### Disciplinas de Clã
- **Auspícios**: Percepção extrassensorial afiada, leitura de pensamentos e visões premonitórias do futuro.
- **Demência / Dominação**: A capacidade de transferir as próprias fraturas psíquicas para os outros, provocando ataques de pânico irracional, histeria coletiva ou ilusões perturbadoras. *(Na 1ª Edição de 1996, o clã utilizava primariamente Dominação e Auspícios na corte feudal, enquanto linhagens místicas acessavam a Demência primal).*
- **Ofuscação**: O poder de fundir-se com as sombras do ambiente para observar em silêncio.

### Fraqueza de Clã (1ª Edição)
Todo membro do Clã Malkaviano é acometido por pelo menos uma **Perturbação Mental** (Derangement) incurável desde o momento de seu Abraço. Essa insanidade nunca pode ser curada ou gasta com pontos de Força de Vontade; ela faz parte da própria arquitetura de sua alma e dita como ele interpreta a realidade.`,
      },
    ],
  },

  // =========================================================================
  // 7. LIVRO DE CLÃ: NOSFERATU
  // =========================================================================
  {
    id: 'livro_cla_nosferatu',
    titulo: 'Livro de Clã: Nosferatu',
    subtitulo: 'Os Leprosos, Senhores das Catacumbas e Mercadores de Segredos',
    edicao: 'Libellus Sanguinis IV / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🐀',
    corTema: 'from-stone-900 via-neutral-950 to-emerald-950 border-emerald-900/80 text-emerald-200',
    descricaoBreve:
      'Marcados pela maldição da fealdade monstruosa, habitam esgotos, masmorras e criptas góticas, tecendo a maior e mais valiosa rede de espionagem do mundo cainita.',
    sinopse:
      'Amaldiçoados com uma deformidade física repulsiva que reflete a Besta interior, os Nosferatu foram banidos dos salões dourados para viver sob a lama. No entanto, sua exclusão tornou-se sua maior arma: enquanto os príncipes conspiram nos tronos, os ratos e os mendigos escutam cada palavra. Nenhum segredo em uma corte medieval escapa aos ouvidos dos invisíveis.',
    capitulos: [
      {
        id: 'nosferatu_absimiliard',
        numero: 'Capítulo I',
        titulo: 'A Vaidade Punida de Absimiliard',
        subtitulo: 'A Queda do Caçador e a Maldição da Carne Podre',
        conteudo: `### A Face da Verdade Monstruosa
Absimiliard era o caçador mais belo e arrogante da Primeira Cidade. Orgulhava-se de sua perfeição física a ponto de zombar dos deuses. Quando Caim o transformou, amaldiçoou-o para que sua carne refletisse a crueldade podre de sua alma vaidosa.

Em questão de semanas, sua pele rachou, seus ossos retorceram-se e sua beleza transformou-se em uma máscara de pesadelo que provocava náuseas até nos animais mais ferozes.

> *"Vós cobris vossa podridão moral com veludo bordado e joias de ouro. Nós carregamos nossos pecados expostos em nossa carne para que todos vejam. Quem é mais honesto diante de Deus?"*

Na Idade das Trevas, os Nosferatu fundaram comunidades inteiras nas galerias de esgoto de Paris, nas catacumbas romanas e nas masmorras subterrâneas das fortalezas germânicas, criando refúgios coletivos onde os rejeitados encontram fraternidade.`,
      },
      {
        id: 'nosferatu_informacao',
        numero: 'Capítulo II',
        titulo: 'A Moeda Invisível: Os Segredos do Trono',
        subtitulo: 'A Diplomacia dos Esgotos',
        conteudo: `### O Monopólio da Verdade
Nenhum governante inteligente ousa declarar guerra aberta aos Nosferatu de sua cidade. Se um príncipe tentar expurgar as criptas, os Nosferatu simplesmente divulgam os nomes de suas amantes, as heresias secretas de seus bispos e as dívidas ocultas que o monarca mantém com judeus e templários.

Eles operam as **Casas dos Leprosos** nos limites das cidades, alimentando-se dos párias da sociedade mortal sem atrair suspeitas e usando enxames de morcegos e ratazanas para vigiar castelos noite e dia.`,
      },
      {
        id: 'nosferatu_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'A Sombra Inviolável',
        subtitulo: 'Disciplinas: Animalismo, Ofuscação, Potência',
        conteudo: `### Disciplinas de Clã
- **Animalismo**: Comunicação instantânea com pragas urbanas (ratos, corvos, morcegos) para vigilância e ataque em massa.
- **Ofuscação**: A maestria absoluta do desaparecimento; permite deslizar por salões lotados de guardas como se fosse ar transparente.
- **Potência**: Força monstruosa para dobrar barras de ferro e desmembrar cavaleiros armados quando o combate físico se torna inevitável.

### Fraqueza de Clã (1ª Edição)
A maldição de Absimiliard é absoluta: o atributo **Aparência de qualquer Nosferatu é 0 permanente**. Eles não podem adquirir pontuação nesta característica nem disfarçar sua fealdade natural através de maquiagem mortal. Qualquer tentativa de interação social baseada em charme físico ou primeiras impressões falha automaticamente.`,
      },
    ],
  },

  // =========================================================================
  // 8. LIVRO DE CLÃ: RAVNOS
  // =========================================================================
  {
    id: 'livro_cla_ravnos',
    titulo: 'Livro de Clã: Ravnos',
    subtitulo: 'Os Ilusionistas, Trapaceiros e Mestres da Miragem Cósmica',
    edicao: 'Libellus Sanguinis IV / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🎪',
    corTema: 'from-indigo-950 via-zinc-950 to-stone-900 border-indigo-700/80 text-indigo-200',
    descricaoBreve:
      'Andarilhos carismáticos de caravanas nômades, filósofos do Caos e mestres da disciplina de Quimerismo, capazes de moldar ilusões indistinguíveis da realidade.',
    sinopse:
      'Originários das terras ancestrais da Índia e dispersos pelas rotas de comércio da Rota da Seda e Europa Oriental, os Ravnos consideram o mundo material uma gigantesca miragem (Maya). Mestres da trapaça, do roubo elegante e do engano sagrado, eles ensinam aos outros clãs que tudo o que consideram permanente — impérios, castelos e leis — é apenas fumaça soprada ao vento.',
    capitulos: [
      {
        id: 'ravnos_maya',
        numero: 'Capítulo I',
        titulo: 'A Dança de Maya e os Filhos de Dracian',
        subtitulo: 'A Filosofia da Ilusão Oriental',
        conteudo: `### O Tecido dos Sonhos
Enquanto o nobre Ventrue jura lealdade a um feudo de lama e pedra que será esquecido em cem anos, o Ravnos sabe que a própria matéria é um véu ilusório criado para enganar as almas tolas.

Dracian, o patrono ocidental do clã, ensinou que o engano não é pecado, mas um dever espiritual para despertar os adormecidos:

> *"Se eu vos vendo um anel de vidro brilhante pelo preço de um rubi sagrado, eu não vos roubei: eu apenas cobrei o justo tributo pela vossa própria tolice e vaidade."*

Na Europa medieval, os Ravnos viajam integrados a trupes de artistas itinerantes, domadores de cavalos, ciganos e saltimbancos, desfrutando de uma liberdade desconhecida pelos cainitas aprisionados em cidades muradas.`,
      },
      {
        id: 'ravnos_sociedade',
        numero: 'Capítulo II',
        titulo: 'A Honra Entre Ladrões',
        subtitulo: 'O Código de Tratamento dos Ravnos',
        conteudo: `### O Juramento da Caravana
Embora os príncipes considerem os Ravnos ladrões imprevisíveis sem honra, o clã possui um código estrito de conduta interna chamado **Tradição da Hospitalidade**. Um Ravnos jamais rouba, engana ou trapaceia outro membro de sua caravana de sangue sem aviso prévio formal.

Seus serviços são frequentemente contratados por nobres para desacreditar rivais políticos forjando escândalos, espalhando boatos ou fazendo itens preciosos desaparecerem misteriosamente de cofres lacrados.`,
      },
      {
        id: 'ravnos_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'O Toque de Quimerismo',
        subtitulo: 'Disciplinas: Animalismo, Quimerismo, Fortitude',
        conteudo: `### Disciplinas de Clã
- **Animalismo**: Domínio sobre corcéis e feras da estepe, essencial para manter cavalos tranquilos durante longas viagens noturnas.
- **Quimerismo**: O dom fabuloso de tecer ilusões táteis, visuais e sonoras. Com ele, o Ravnos pode projetar o rugido de um dragão invisível, forjar o ouro reluzente de moedas falsas ou criar espelhos mágicos que aterrorizam os inimigos.
- **Fortitude**: A resistência necessária para sobreviver a noites gélidas a céu aberto e tempestades nas estradas.

### Fraqueza de Clã (1ª Edição)
O sangue dos Ravnos carrega uma compulsão incontrolável por um tipo específico de crime ou trapaça moral (furtar joias de igrejas, trapacear em apostas de dados, mentir compulsivamente a superiores, falsificar documentos ou humilhar tiranos).

Sempre que a oportunidade para cometer esse delito se apresenta, o Ravnos deve ter sucesso em um teste de **Autocontrole** (dificuldade 6) para resistir ao seu vício criminoso.`,
      },
    ],
  },

  // =========================================================================
  // 9. LIVRO DE CLÃ: SEGUIDORES DE SET
  // =========================================================================
  {
    id: 'livro_cla_setita',
    titulo: 'Livro de Clã: Seguidores de Set',
    subtitulo: 'As Serpentes do Nilo, Corruptores da Alma e Guardiões de Typhon',
    edicao: 'Libellus Sanguinis IV / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🐍',
    corTema: 'from-yellow-950 via-zinc-950 to-stone-900 border-yellow-700/80 text-yellow-200',
    descricaoBreve:
      'Sacerdotes das areias egípcias que usam o vício, o veneno e a sedução moral para quebrar as amarras da civilização e preparar o despertar do Deus Negro Set.',
    sinopse:
      'Banidos das cortes cristãs como demônios adoradores de serpentes, os Setitas operam nas sombras das cidades portuárias e rotas de especiarias. Eles não buscam coroas mundanas; seu objetivo é muito mais sutil e devastador: descobrir os desejos mais íntimos e proibidos de cada padre, rei ou vampiro virtuoso e conceder-lhes exatamente o que anseiam, até que suas almas estejam irrevogavelmente presas às presas de Set.',
    capitulos: [
      {
        id: 'setita_teologia',
        numero: 'Capítulo I',
        titulo: 'O Despertar do Senhor da Tempestade',
        subtitulo: 'A Teologia Primordial das Areias Vermelhas',
        conteudo: `### O Verdadeiro Deus da Noite
Para os Setitas, Caim foi apenas um instrumento menor. O verdadeiro criador da noite e da escuridão sagrada foi **Sutekh** (Set), o deus guerreiro que enfrentou Rá e as falsas divindades que aprisionaram a humanidade sob a luz sufocante do sol.

> *"A virtude é uma camisa de força inventada pelos fracos para limitar os fortes. Quebrai vossas amarras morais, provai o veneno mais doce e vereis que as trevas são o único abraço libertador."*

Com base em templos subterrâneos esculpidos sob o delta do Nilo e nas ruelas de Alexandria, os Setitas viajam para o Ocidente em caravanas de especiarias, trazendo haxixe, sedas finas, venenos exóticos e ensinamentos que corroem as certezas dos fiéis.`,
      },
      {
        id: 'setita_corrupcao',
        numero: 'Capítulo II',
        titulo: 'O Mercado das Almas Perdidas',
        subtitulo: 'Como Quebrar a Vontade de Príncipes e Bispos',
        conteudo: `### A Corrupção Piedosa
Um Setita raramente brande uma espada de ferro em duelo franco. Seus métodos são infinitamente mais refinados:
Ele descobre que um monge piedoso sonha secretamente com o toque de uma mulher; que um cavaleiro honrado precisa de ouro para salvar seu feudo da ruína; ou que um príncipe cainita morre de medo da velhice de seus mortais favoritos.

O Setita providencia a solução perfeita sem exigir nada em troca de início. Apenas um favorzinho sutil depois. Mais uma pitada de tentação adiante. Quando o cliente percebe, ele já quebrou todos os seus votos e está totalmente à mercê das serpentes.`,
      },
      {
        id: 'setita_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'O Veneno de Typhon',
        subtitulo: 'Disciplinas: Ofuscação, Presença, Serpentis',
        conteudo: `### Disciplinas de Clã
- **Ofuscação**: Deslizar silenciosamente como uma víbora sob os tapetes e cortinas dos aposentos reais.
- **Presença**: A hipnose irresistível das serpentes, atraindo presas para o abraço voluntário através de palavras açucaradas.
- **Serpentis**: O poder esotérico de transmutar os olhos nos de uma naja paralisante, esticar a língua em farpas venenosas, tornar a pele escamosa e resistente ou transformar o próprio corpo em uma imensa serpente negra.

### Fraqueza de Clã (1ª Edição)
Como criaturas concebidas nas trevas mais puras e devotadas a Sutekh, os Seguidores de Set são incrivelmente vulneráveis à luz solar. Qualquer exposição ao **sol causa dano dobrado** em um Setita. Além disso, mesmo luzes intensas como tochas flamejantes ou fogueiras grandes provocam dor aguda e impõem -1 em todas as paradas de dados.`,
      },
    ],
  },

  // =========================================================================
  // 10. LIVRO DE CLÃ: TOREADOR
  // =========================================================================
  {
    id: 'livro_cla_toreador',
    titulo: 'Livro de Clã: Toreador',
    subtitulo: 'Os Degenerados, Artesãos e Patronos da Alta Cultura',
    edicao: 'Libellus Sanguinis II / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🌹',
    corTema: 'from-pink-950 via-zinc-950 to-stone-900 border-pink-700/80 text-rose-200',
    descricaoBreve:
      'Mestres da elegância, poetas e patronos das artes que transformam o Elísio e as cortes medievais em palcos magníficos de paixão, intriga e beleza imortal.',
    sinopse:
      'Enquanto outros clãs gastam seus séculos planejando guerras de cerco ou desenterrando tumbas podres, os Toreador dedicam sua eternidade a capturar a centelha sublime da alma humana. Em Constantinopla e nas ricas cortes de Provença e Champagne, eles lideram as guildas de arquitetos de catedrais góticas, inspiram trovadores amorosos e ditam quem dita a moda nas noites eternas.',
    capitulos: [
      {
        id: 'toreador_sonho_bizantino',
        numero: 'Capítulo I',
        titulo: 'O Sonho Dourado de Constantinopla',
        subtitulo: 'Michael e o Triunvirato da Beleza Eterna',
        conteudo: `### A Cidade dos Desejos
Nenhum lugar na Idade das Trevas brilha com tanta intensidade quanto a magnífica **Constantinopla**, a Rainha das Cidades. Sob a bênção do patriarca Toreador Michael, a cidade foi concebida como o céu na Terra, um império onde os cainitas não se escondiam como monstros, mas eram reverenciados como anjos imortais da beleza e da arte sacra.

> *"A Besta não é vencida pela reclusão na caverna nem por orações vazias; a Besta é domesticada pela contemplação da Beleza divina. Onde há harmonia, a escuridão não tem poder."*

Os Toreador escolhem seus rebentos entre os escultores mais talentosos, iluminadores de manuscritos bíblicos, arquitetos de abóbadas góticas e damas da nobreza famosas por sua astúcia social.`,
      },
      {
        id: 'toreador_cortes_amor',
        numero: 'Capítulo II',
        titulo: 'As Cortes do Amor e a Política do Salão',
        subtitulo: 'Harpias e Trovadores nas Noites Feudais',
        conteudo: `### O Terror da Fofoca
Nas famosas Cortes do Amor na França meridional, os Toreador inventaram o conceito de prestígio social cainita.
Um cavaleiro Ventrue pode possuir duzentos homens de armas armados até os dentes, mas se a principal Harpia Toreador rir de seu sotaque em um sarau e compor uma estrofe satírica ridicularizando sua postura, o nobre será rejeitado em todas as cortes da Europa.

Sua rivalidade secular com os Nosferatu é lendária: enquanto os Toreador veneram a perfeição exterior, odeiam ser lembrados de que, por dentro, seu coração está tão morto quanto o de qualquer monstro deformado.`,
      },
      {
        id: 'toreador_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'O Transe da Perfeição',
        subtitulo: 'Disciplinas: Auspícios, Rapidez, Presença',
        conteudo: `### Disciplinas de Clã
- **Auspícios**: A sensibilidade estética aguçada para discernir a mínima imperfeição em uma pintura, sentir o pulsar do coração de um mortal e decodificar emoções sutis.
- **Rapidez**: A graciosidade sobre-humana que permite dançar em banquetes ou desferir floreios de espada com elegância estonteante.
- **Presença**: O carisma radiante que faz homens caírem de amores à primeira vista e cortes inteiras suspirarem de encanto.

### Fraqueza de Clã (1ª Edição)
A sensibilidade extrema à beleza é a armadilha do clã: sempre que um Toreador testemunha uma obra de arte verdadeiramente sublime, uma pessoa de beleza deslumbrante ou uma melodia perfeita, ele deve fazer um teste de **Autocontrole** (dificuldade 6). Se falhar, entra em um transe hipnótico completo, incapaz de se mover ou reagir até que a visão ou som cesse, mesmo que esteja correndo risco iminente de morte.`,
      },
    ],
  },

  // =========================================================================
  // 11. LIVRO DE CLÃ: TREMERE
  // =========================================================================
  {
    id: 'livro_cla_tremere',
    titulo: 'Livro de Clã: Tremere',
    subtitulo: 'Os Usurpadores, Feiticeiros Herméticos e Mestres da Taumaturgia',
    edicao: 'Libellus Sanguinis II / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🩸',
    corTema: 'from-rose-950 via-zinc-950 to-stone-900 border-rose-800/80 text-rose-200',
    descricaoBreve:
      'Antigos magos humanos da Ordem de Hermes que roubaram a imortalidade através da alquimia proibida, cercados de inimigos jurados mas armados com a devastadora Taumaturgia.',
    sinopse:
      'Em 1022, na fortaleza de Ceoris na Transilvânia, o mago Tremere e seus conselheiros consumiram o sangue roubado de cainitas Tzimisce para alcançar a vida eterna sem perder o intelecto mágico. Ousando erguer-se como um novo clã por pura vontade e ciência arcana, os Usurpadores enfrentam o ódio dos Tzimisce, Gangrel e Nosferatu, mantendo a disciplina militar de sua Pirâmide e o poder absoluto da Taumaturgia de Sangue.',
    capitulos: [
      {
        id: 'tremere_origem_ceoris',
        numero: 'Capítulo I',
        titulo: 'A Grande Transmutação de 1022',
        subtitulo: 'A Queda da Casa Hermética e o Nascimento em Sangue',
        conteudo: `### O Fim da Magia Verdadeira
No décimo século da era cristã, a magia dos homens estava morrendo. A expansão da fé cristã e o avanço da razão estavam extinguindo o fluxo visível dos reinos místicos.

O grão-mestre hermético **Tremere** e seu arquimago Goratrix recusaram-se a aceitar a velhice e a sepultura. No laboratório subterrâneo da fortaleza de **Ceoris**, capturaram nobres Tzimisce e realizaram experimentos alquímicos sacrílegos com a vitae dos cainitas. Ao beberem do elixir condensado, tornaram-se os primeiros vampiros criados por artifício mágico na história do mundo.

> *"Nós não imploramos pela dádiva de Caim nas trevas; nós a tomamos com o poder da nossa própria vontade e da nossa ciência superior. Que os outros nos chamem de Usurpadores: a história é escrita por aqueles que sobrevivem."*`,
      },
      {
        id: 'tremere_piramide',
        numero: 'Capítulo II',
        titulo: 'A Pirâmide Inquebrável de Ceoris',
        subtitulo: 'O Conselho dos Sete e a Hierarquia Hermética',
        conteudo: `### A Estrutura da Obediência
Ao contrário de clãs caóticos, todo membro do Clã Tremere sabe exatamente qual é o seu lugar no tabuleiro:
- **O Conselho dos Sete**: Os aprendizes originais de Tremere (como Etrius, Meerlinda e Goratrix), que governam porções inteiras do mundo conhecido.
- **Os Pontífices e Lordes**: Mestres de regiões que supervisionam as **Capelas** (fortalezas acadêmicas onde o clã estuda e guarda seus tomos).
- **Os Regentes**: Comandantes das capelas locais.
- **Os Aprendizes**: Recém-abraçados que passam décadas decifrando textos e servindo aos superiores.

Essa lealdade inabalável permite que o clã, numericamente inferior, resista a cercos furiosos de exércitos inteiros de Tzimisce nas montanhas cárpates.`,
      },
      {
        id: 'tremere_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'A Magia Proibida da Vitae',
        subtitulo: 'Disciplinas: Auspícios, Dominação, Taumaturgia',
        conteudo: `### Disciplinas de Clã
- **Auspícios**: Percepção mística afiada para rastrear energias astrais e antecipar armadilhas inimigas.
- **Dominação**: O rigor da autoridade mental para manter a hierarquia e comandar escravos mortais.
- **Taumaturgia**: A disciplina assinatura dos Tremere. Permite ferver o sangue das veias dos inimigos à distância, conjurar chamas verdes que queimam vampiros, manipular metais e comandar rituais ancestrais devastadores.

### Fraqueza de Clã (1ª Edição)
A estrutura da Pirâmide é mantida através do Laço de Sangue formal: todo Tremere recém-criado é obrigado a beber da vitae misturada dos **Sete Anciões de Ceoris** durante sua iniciação. Como consequência dessa tradição estrita, todos os Tremere começam com um passo a mais em direção a um Laço de Sangue com seus superiores (são mais fáceis de dominar e vincular pela liderança do clã).`,
      },
    ],
  },

  // =========================================================================
  // 12. LIVRO DE CLÃ: TZIMISCE
  // =========================================================================
  {
    id: 'livro_cla_tzimisce',
    titulo: 'Livro de Clã: Tzimisce',
    subtitulo: 'Os Voivodas, Demônios dos Cárpatos e Mestres da Moldagem da Carne',
    edicao: 'Libellus Sanguinis I / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '🐲',
    corTema: 'from-zinc-950 via-stone-900 to-black border-red-900/80 text-zinc-300',
    descricaoBreve:
      'Senhores feudais temíveis do Leste Europeu que consideram o corpo humano e cainita uma mera argila a ser esculpida pela disciplina visceral de Vicissitude.',
    sinopse:
      'Nas florestas escarpadas da Transilvânia, Polônia e Rússia, os Voivodas Tzimisce reinam absolutos há milênios como deuses-monstros temidos pelos camponeses eslavos. Guardiões da Trilha da Metamorfose, eles transcendem os limites da humanidade esculpindo carne e osso em abominações de guerra (Vozhd e Szlachta) e travando uma guerra sangrenta de extermínio contra os Usurpadores Tremere.',
    capitulos: [
      {
        id: 'tzimisce_voivodatos',
        numero: 'Capítulo I',
        titulo: 'Os Senhores das Terras Além da Floresta',
        subtitulo: 'O Dragão e o Domínio Sagrado do Solo',
        conteudo: `### O Reino dos Demônios Feudais
Enquanto os príncipes do Ocidente brincam com leis civis e parlamentos de cortesãos, o Voivoda Tzimisce não precisa pedir permissão a ninguém. Cada castelo nas montanhas cárpates é uma fortaleza isolada onde a vontade do mestre é absoluta sobre camponeses, animais e almas.

> *"A carne é fraca e imperfeita; uma prisão tola dada pelo Criador. Nós somos os escultores divinos que quebram essa jaula, moldando os ossos e os músculos naquilo que verdadeiramente deveriam ser."*

Os Tzimisce vivem em simbiose com a própria terra eslava. Eles acolhem viajantes com uma hospitalidade impecável e assustadora — sob a condição sagrada de que as regras da casa sejam rigorosamente respeitadas. Quebrar o pão na mesa de um Tzimisce é estar seguro; ofender o anfitrião é acordar transformado em uma mobília de pele viva.`,
      },
      {
        id: 'tzimisce_guerra_ceoris',
        numero: 'Capítulo II',
        titulo: 'A Praga dos Feiticeiros e os Carniçais de Guerra',
        subtitulo: 'O Ódio Mortal aos Usurpadores Tremere',
        conteudo: `### A Ira do Sangue Violado
A traição de Tremere em 1022 inflamou os Cárpatos em uma conflagração eterna. Furiosos com o roubo de seu sangue ancestral pelos magos herméticos, os Voivodas libertaram seus exércitos de **Szlachta** — servos humanos alterados cirurgicamente com Vicissitude com ossos em forma de lâminas e couraças dérmicas monstruosas.

Nas batalhas mais ferozes, dezenas de servos são fundidos misticamente em uma única massa titânica de carne e dentes: o colossal **Vozhd**, uma máquina viva de cerco capaz de derrubar as muralhas de Ceoris sob seu peso aterrorizante.`,
      },
      {
        id: 'tzimisce_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'A Arte da Vicissitude',
        subtitulo: 'Disciplinas: Animalismo, Auspícios, Vicissitude',
        conteudo: `### Disciplinas de Clã
- **Animalismo**: O controle sobre matilhas de lobos e morcegos gigantes das montanhas.
- **Auspícios**: Visão clarividente afiada para monitorar o perímetro de seus extensos feudos.
- **Vicissitude**: O poder lendário e perturbador de esculpir carne, cartilagem e osso como se fossem cera quente. Permite alterar o próprio rosto, transformar mãos em lâminas ósseas perfurantes ou transmutar-se no horrendo corpo elemental de sangue ou forma de Zulo.

### Fraqueza de Clã (1ª Edição)
O Tzimisce está irrevogavelmente conectado à sua terra de origem. Para descansar durante o dia sem penalidades, ele deve dormir cercado por pelo menos **dois punhados de terra nativa** de uma região sagrada para ele em vida (geralmente seu feudo natal ou o local de seu Abraço).

Caso seja privado de seu solo nativo, todas as suas paradas de dados são divididas pela metade a cada dia que passa, até que ele se torne completamente incapaz de agir.`,
      },
    ],
  },

  // =========================================================================
  // 13. LIVRO DE CLÃ: VENTRUE
  // =========================================================================
  {
    id: 'livro_cla_ventrue',
    titulo: 'Livro de Clã: Ventrue',
    subtitulo: 'Os Nobres, Soberanos do Sangue e Comandantes das Cortes',
    edicao: 'Libellus Sanguinis II / Clanbook Canônico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '👑',
    corTema: 'from-amber-900 via-zinc-950 to-stone-900 border-amber-600/80 text-amber-200',
    descricaoBreve:
      'Cavaleiros feudais, barões e imperadores cainitas que carregam com soberba o fardo divino da liderança, da cavalaria e da ordem da civilização.',
    sinopse:
      'Desde os tempos do Patriarca Veddartha, os Ventrue aprenderam que sem ordem e liderança, a sociedade dos cainitas degenera em barbárie irracional. Na Idade das Trevas, os nobres do clã governam o Sacro Império Romano-Germânico, lideram ordens cruzadas na Terra Santa e presidem as mais gloriosas cortes feudais com um comando régio e determinação férrea.',
    capitulos: [
      {
        id: 'ventrue_nobreza',
        numero: 'Capítulo I',
        titulo: 'O Nobreza Obriga (Noblesse Oblige)',
        subtitulo: 'A Doutrina Divina do Direito de Governar',
        conteudo: `### O Fardo da Coroa
Outros clãs acusam os Ventrue de arrogância e sede tirânica de poder. O Ventrue apenas sorri e aponta para o caos que reina onde quer que eles não estejam no comando.

Para o clã, o governo não é um privilégio de vaidade; é um dever sacrificial pesado:

> *"Alguém precisa manter as tochas acesas nas muralhas. Alguém precisa ditar a lei que impede o Brujah de queimar a cidade e o Tzimisce de devorar os inocentes. Nós fomos coroados pelo próprio Caim para liderar."*

Na Europa do século XII, os Ventrue são a personificação viva da cavalaria feudal: cavaleiros de armadura reluzente, barões que mantêm juramentos de sangue com vassalos e defensores da estabilidade cristã contra o paganismo bárbaro.`,
      },
      {
        id: 'ventrue_cruzadas',
        numero: 'Capítulo II',
        titulo: 'As Espadas de Cristo e os Barões da Germânia',
        subtitulo: 'A Expansão Feudal e a Ordem Teutônica',
        conteudo: `### A Conquista do Leste
Sob a liderança de patriarcas como Jürgen von Verden, os Ventrue lideram a expansão germânica em direção ao Leste europeu (Drang nach Osten). Suas ordens de cavaleiros vampiros marcham ao lado dos Cavaleiros Teutônicos e Templários, erguendo castelos de pedra para desafiar o domínio selvagem dos Gangrel e Tzimisce.

Eles dominam a economia feudal, financiando a construção de catedrais e pontes fortificadas, garantindo que o dízimo mortal flua diretamente para seus cofres e que nenhum príncipe rival governe sem seu aval.`,
      },
      {
        id: 'ventrue_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'A Força do Comando Soberano',
        subtitulo: 'Disciplinas: Dominação, Fortitude, Presença',
        conteudo: `### Disciplinas de Clã
- **Dominação**: O comando inquestionável que dobra reis mortais e servos rebeldes com uma única palavra firme.
- **Fortitude**: A resiliência de um líder inquebrável, capaz de marchar à frente de suas tropas mesmo atravessado por lanças e flechas inimigas.
- **Presença**: A aura régia que inspira devoção cega em seus vassalos e pavor paralisante nos oponentes.

### Fraqueza de Clã (1ª Edição)
O paladar aristocrático dos Ventrue é extremamente rarefeito e seletivo. Cada Ventrue só é capaz de se alimentar da vitae de um **tipo muito específico de mortal** (apenas nobres com sangue real, apenas virgens piedosas, apenas monges tonsurados, apenas soldados feridos em combate, etc.).

Se tentar beber o sangue de qualquer pessoa fora de sua exigência restrita, o vampiro vomitará a vitae imediatamente sem absorver nenhum ponto de sangue.`,
      },
    ],
  },

  // =========================================================================
  // 14. LIVRO DE CLÃ: SALUBRI
  // =========================================================================
  {
    id: 'livro_cla_salubri',
    titulo: 'Livro de Clã: Salubri',
    subtitulo: 'Os Santos Mártires, Curandeiros de Três Olhos e Guerreiros de Saulot',
    edicao: 'Libellus Sanguinis II / Canon Histórico',
    ano: '1197 (Idade das Trevas)',
    categoria: 'cla',
    capaIcon: '👁️',
    corTema: 'from-amber-950 via-zinc-950 to-stone-900 border-amber-500/80 text-amber-200',
    descricaoBreve:
      'Uma das maiores tragédias da história cainita: sábios curandeiros e guerreiros templários caçados impiedosamente até a quase extinção pela calúnia dos Tremere.',
    sinopse:
      'Antes da traição, o clã do místico Saulot era respeitado como os curandeiros e protetores da sociedade cainita. Quando os Tremere diablerizaram o Patriarca Saulot no início do milênio, espalharam a mentira monstruosa de que os Salubri eram demônios comedores de almas. Na Idade das Trevas de 1197, os poucos sobreviventes do Terceiro Olho viajam disfarçados como monges e cavaleiros andantes, curando os aflitos enquanto fogem dos algozes.',
    capitulos: [
      {
        id: 'salubri_saulot',
        numero: 'Capítulo I',
        titulo: 'A Iluminação e o Terceiro Olho de Saulot',
        subtitulo: 'A Viagem ao Oriente e o Dom de Golconda',
        conteudo: `### O Único Pacificador
Saulot foi o primeiro cainita a compreender que a sede de sangue não precisava ser eterna. Viajou para o Oriente distante e alcançou a lendária **Golconda** — o estado de serenidade perfeita onde a Fera interior é adormecida e a humanidade brilha novamente.

Ao retornar a Enoque, uma terceira visão despertou em sua fronte: um olho místico capaz de enxergar a pureza ou corrupção de qualquer alma viva.

> *"Não devolvais o golpe com rancor. O ódio alimenta a Besta; o sacrifício e a cura são a única escada que leva o filho da noite de volta à luz do Criador."*`,
      },
      {
        id: 'salubri_cacada_tremere',
        numero: 'Capítulo II',
        titulo: 'A Diablerie e a Grande Calúnia',
        subtitulo: 'A Caçada de Sangue dos Usurpadores',
        conteudo: `### A Noite em que o Santo Caiu
Em uma noite fatídica, Tremere entrou no túmulo onde Saulot repousava em torpor sereno e drenou a alma do patriarca. Para justificar seu crime perante os outros clãs, os Tremere orquestraram a maior campanha de difamação da história: acusaram os Salubri de roubar almas de crianças e de pactos com o Diabo.

Os príncipes ingênuos emitiram éditos de destruição. No entanto, a casta dos **Guerreiros Salubri** — cavaleiros armados com espadas de duas mãos que protegem os curandeiros com a vida — continua viva nas estradas da Terra Santa, jurando proteger os fracos até o último suspiro.`,
      },
      {
        id: 'salubri_disciplinas_fraqueza',
        numero: 'Capítulo III',
        titulo: 'A Graça de Obeah e Valeren',
        subtitulo: 'Disciplinas: Auspícios, Fortitude, Obeah / Valeren',
        conteudo: `### Disciplinas de Clã
- **Auspícios**: A capacidade de ler auras e compreender o sofrimento dos feridos.
- **Fortitude**: A armadura sagrada do corpo que permite suportar a dor em nome dos outros.
- **Obeah / Valeren**: O poder lendário do Terceiro Olho. Permite fechar ferimentos mortais com o toque das mãos, acalmar almas atormentadas por frenesi ou, na casta guerreira, queimar inimigos com a luz da retribuição justa.

### Fraqueza de Clã (1ª Edição)
O juramento sagrado de Saulot impede que os curandeiros tirem a vida ou forcem o sofrimento: um Salubri curandeiro **não pode se alimentar de um mortal sem o consentimento voluntário dele**. Se tentar forçar a alimentação contra a vontade da vítima, ele sofrerá dores agonizantes e perderá temporariamente a capacidade de canalizar seus poderes de cura.`,
      },
    ],
  },
];
