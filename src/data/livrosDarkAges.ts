import type { LivroVampiro } from './livrosVampiro';

export const LIVRO_DARK_AGES_1E: LivroVampiro = {
  id: 'livro_dark_ages_1e',
  titulo: 'Livro Básico (1ª Edição)',
  subtitulo: 'O Livro Básico de 1996 — Regras Canônicas da 1ª Edição',
  edicao: '1ª Edição Canônica (White Wolf / 1996)',
  ano: '1197 d.C.',
  categoria: 'dark_ages',
  capaIcon: '⚔️',
  corTema: 'from-rose-950 via-zinc-950 to-black border-red-700/80 text-rose-300',
  descricaoBreve:
    'O tomo canônico do RPG medieval de horror pessoal: criação de personagem, as Seis Tradições feudais, todas as Disciplinas (níveis 1 a 5), sistemas de sangue e combate.',
  sinopse:
    'Ambientado na Europa de 1197, no auge do feudalismo e das Cruzadas, este é o livro básico oficial da 1ª Edição de Vampiro: A Idade das Trevas. Contém as regras completas para criação de cainitas, as tabelas de reserva de sangue da 1ª edição, o compêndio exaustivo de todas as Disciplinas de nível 1 a 5 (incluindo Mortis para os Capadócios), combate feudal, frenesi e as Trilhas de Sabedoria medievais.',
  capitulos: [
    {
      id: 'da1e_cap1_cenario',
      numero: 'Capítulo I',
      titulo: 'A Longa Noite de 1197',
      subtitulo: 'O Feudalismo da Noite e a Condição Cainita',
      conteudo: `### O Mundo em Trevas
O ano é **1197**. O Sacro Império Romano-Germânico, os reinos da França e Inglaterra, o Império Bizantino e os principados da Península Ibérica vivem sob a sombra de guerras constantes, cruzadas e fomes devastadoras.

Para a humanidade, a noite é um abismo impenetrável iluminado apenas por tochas bruxuleantes e fogueiras de aldeias apavoradas. A Igreja ensina que os demônios espreitam além dos muros de pedra, e os padres não estão enganados: os **Cainitas** governam a escuridão.

### O Feudalismo Sobrenatural
Na Idade das Trevas, a *Máscara* como decreto global ainda não existe. Os vampiros vivem abertamente como senhores feudais da noite:
- **O Barão ou Príncipe**: O cainita mais antigo e poderoso de um castelo ou cidade fortificada, cuja palavra é lei incontestável.
- **O Juramento de Vassalagem**: Os jovens cainitas juram fidelidade de sangue a seus senhores feudais em troca do direito de caçar e residir em seus territórios.
- **O Rebanho Mortal**: Camponeses, servos e até nobres mortais são mantidos sob controle através de superstição religiosa, tributos de sangue e laços de carniçal.`,
    },
    {
      id: 'da1e_cap2_tradicoes',
      numero: 'Capítulo II',
      titulo: 'As Seis Grandes Tradições Medievais',
      subtitulo: 'A Lei Ancestral de Caim nos Feudos',
      conteudo: `### O Código dos Senhores da Noite
Transmitidas oralmente de senhor para cria desde a queda da Segunda Cidade, as Seis Tradições formam a espinha dorsal da justiça cainita na Idade das Trevas:

#### 1. A Primeira Tradição: O Pacto de Silêncio
> *"Não revelarás tua verdadeira natureza àqueles que não são do Sangue. Fazer isso é abrir mão de teus direitos perante teus irmãos."*
Na época medieval, embora os cainitas não se escondam como na era moderna, revelar abertamente os poderes demoníacos a multidões atrai a fúria das tochas camponesas e a atenção perigosa de inquisidores armados com a Fé Verdadeira.

#### 2. A Segunda Tradição: O Domínio
> *"Teu domínio é tua própria preocupação. Todos os outros devem-te respeito enquanto estiverem nele. Ninguém pode desafiar tua palavra no feudo que governas."*
Um senhor feudal cainita é soberano absoluto em sua torre e terras; invadir um domínio sem permissão é causa legítima para execução sumária.

#### 3. A Terceira Tradição: A Prole
> *"Só gerarás outro com a permissão de teu Ancião. Se criares uma cria sem a bênção de teu senhor, tu e tua progênie sereis destruídos."*
Evita a proliferação descontrolada de bocas famintas que possam drenar o gado mortal de uma região.

#### 4. A Quarta Tradição: A Responsabilidade
> *"Aqueles que criares são teus próprios filhos. Até que tua cria seja libertada, tu a comandarás em todas as coisas e responderás por suas ofensas perante o Príncipe."*

#### 5. A Quinta Tradição: A Hospitalidade
> *"Honra o domínio de outro. Quando chegares a uma cidade estrangeira, deves apresentar-te àquele que governa. Sem a palavra de aceitação, não tens direito à noite."*

#### 6. A Sexta Tradição: A Destruição
> *"És proibido de destruir outro de tua espécie. O direito de destruição pertence apenas ao teu Ancião ou ao Príncipe do Domínio. Ninguém cometerá diablerie sem julgamento formal."*`,
    },
    {
      id: 'da1e_cap3_criacao',
      numero: 'Capítulo III',
      titulo: 'Criação Canônica de Personagem (1ª Edição)',
      subtitulo: 'Atributos, Habilidades, Disciplinas e Reserva por Geração',
      conteudo: `### O Processo de Criação Passo a Passo

#### 1. Conceito e Linhagem
- Escolha o **Conceito**, a **Natureza** (quem você realmente é no fundo), o **Comportamento** (a máscara social que você apresenta) e o **Clã** ou Linhagem.

#### 2. Atributos (Prioridades: 7 / 5 / 3)
Distribua entre as três categorias (todos começam com 1 ponto gratuito em cada atributo):
- **Físicos**: Força, Destreza, Vigor.
- **Sociais**: Carisma, Manipulação, Aparência.
- **Mentais**: Percepção, Inteligência, Raciocínio.

#### 3. Habilidades (Prioridades: 13 / 9 / 5)
Distribua entre:
- **Talentos**: Prontidão, Esportes, Briga, Esquiva, Empatia, Intimidação, Liderança, Manha, Lábia.
- **Perícias**: Empatia com Animais, Arquearia, Ofícios, Cavalgar, Etiqueta, Armas Brancas, Música, Furtividade, Sobrevivência.
- **Conhecimentos**: Erudição, Investigação, Direito, Linguística, Medicina, Ocultismo, Política, Ciência, Senescalsia.

#### 4. Vantagens
- **Disciplinas**: Exatamente **3 pontos** iniciais distribuídos entre as disciplinas de seu Clã.
- **Antecedentes**: **5 pontos** (Aliados, Contatos, Rebanho, Influência, Mentor, Recursos, Lacaios, Status, e **Geração**).
- **Virtudes**: **7 pontos** distribuídos entre Consciência (ou Convicção), Autocontrole (ou Instinto) e Coragem (todos começam com 1 ponto gratuito).

#### 5. Traços Finais e a Regra Canônica de Geração (1ª Edição)
- **Geração Inicial**: O personagem inicia na **12ª Geração**.
- Cada ponto gasto no antecedente **Geração** reduz a geração em 1 (até o máximo de 5 pontos = **7ª Geração**):
  - **12ª Geração**: Reserva máxima de Sangue = **11 pontos** | Gasto por turno = **1 ponto**.
  - **11ª Geração**: Reserva máxima de Sangue = **12 pontos** | Gasto por turno = **1 ponto**.
  - **10ª Geração**: Reserva máxima de Sangue = **13 pontos** | Gasto por turno = **1 ponto**.
  - **9ª Geração**: Reserva máxima de Sangue = **14 pontos** | Gasto por turno = **2 pontos**.
  - **8ª Geração**: Reserva máxima de Sangue = **15 pontos** | Gasto por turno = **3 pontos**.
  - **7ª Geração**: Reserva máxima de Sangue = **20 pontos** | Gasto por turno = **4 pontos**.
- **Humanidade**: Igual a Consciência + Autocontrole.
- **Força de Vontade**: Igual ao valor de Coragem.
- **Pontos de Sangue Iniciais**: Jogue 1d10 para determinar com quanto sangue inicia a crônica.

#### 6. Pontos Bônus (15 Pontos)
- Atributos: 5 pontos por bolinha.
- Habilidades: 2 pontos por bolinha.
- Disciplinas de Clã: 7 pontos por bolinha.
- Disciplinas Fora do Clã: 10 pontos para a primeira bolinha; 7 pontos por bolinha adicional.
- Antecedentes: 1 ponto por bolinha.
- Virtudes: 2 pontos por bolinha.
- Força de Vontade: 1 ponto por bolinha.
- Humanidade / Trilha: 1 ponto por bolinha.`,
    },
    {
      id: 'da1e_cap4_disciplinas_pt1',
      numero: 'Capítulo IV',
      titulo: 'Compêndio de Disciplinas — Parte I',
      subtitulo: 'Animalismo, Auspícios, Rapidez, Dominação, Fortitude e Mortis',
      conteudo: `### 1. Animalismo
A afinidade sobrenatural com as criaturas da terra e com a Besta interior.
- **● Sussurros Animais**: Permite comunicar-se telepática ou vocalmente com qualquer animal e solicitar favores.
- **●● O Chamado**: O vampiro emite um grito inaudível que convoca animais de uma determinada espécie em um raio de quilômetros.
- **●●● Acalmar a Fera**: O cainita toca a alma de um mortal ou vampiro, acalmando paixões e impedindo ou encerrando um frenesi imediatamente.
- **●●●● Compartilhar a Alma**: Projeta a consciência do cainita para dentro do corpo de um animal, controlando seus movimentos e sentidos enquanto seu corpo dorme.
- **●●●●● Expulsar a Fera**: O vampiro projeta sua própria Besta enfurecida para dentro do peito de outro indivíduo, forçando-o a entrar em frenesi catastrófico enquanto o invocador permanece sereno.

---

### 2. Auspícios
Percepções sensoriais místicas que ultrapassam os limites físicos.
- **● Sentidos Aguçados**: Dobra a acuidade de visão, audição, olfato e tato; permite enxergar na escuridão absoluta.
- **●● Percepção da Aura**: Revela auras espirituais ao redor dos seres, decodificando emoções, mentiras, presença de vampirismo, magia ou licantropia.
- **●●● O Toque do Espírito**: Ao tocar um objeto ou parede antiga, o vampiro experimenta flashes psíquicos das pessoas que o usaram e eventos traumáticos ali ocorridos.
- **●●●● Telepatia**: Leitura direta de pensamentos superficiais e comunicação mente a mente silenciosa com outros indivíduos.
- **●●●●● Projeção Psíquica**: A alma do cainita abandona a casca física na forma astral, voando através de paredes e continentes a velocidades prodigiosas.

---

### 3. Rapidez
A aceleração miraculosa do tempo e do corpo.
- **Níveis ● a ●●●●●**: A cada ponto de Rapidez, o vampiro pode gastar 1 ponto de sangue no início do turno para obter **ações físicas adicionais completas** no mesmo turno de combate, tornando-se um borrão mortal no campo de batalha.

---

### 4. Dominação
O poder imperioso de dobrar a mente alheia através do olhar.
- **● O Comando**: Uma ordem de uma única palavra que deve ser obedecida instantaneamente pelo alvo ("Pare!", "Fuja!", "Ajoelhe!").
- **●● O Olhar Hipnótico**: Coloca a vítima em transe profundo, permitindo implantar sugestões complexas que serão executadas mais tarde.
- **●●● A Mente Esquecida**: Permite vasculhar as memórias do alvo, reescrevendo lembranças, apagando eventos ou implantando testemunhos falsos.
- **●●●● Condicionamento**: Através de sessões contínuas de comando, a vítima torna-se um servo mental permanente, imune a manipulações de outros vampiros.
- **●●●●● Possessão**: A mente do cainita invade o corpo de um mortal indefeso, assumindo controle biológico total enquanto seu corpo vampírico repousa inerte.

---

### 5. Fortitude
A resiliência sobrenatural da carne contra qualquer destruição.
- **Níveis ● a ●●●●●**: Cada ponto adiciona um dado à parada de absorção de dano físico e, crucialmente, **permite absorver dano agravado** proveniente de garras de lobisomem, fogo e da luz solar direta.

---

### 6. Mortis (Canônico 1ª Edição — Exclusivo do Clã Capadócio)
A ciência esotérica da decomposição e comunhão com a sepultura.
- **● Máscara da Morte**: O Capadócio assume o aspecto cadavérico rígido e lívido de um defunto há muito sepultado, fingindo a morte final para enganar caçadores ou aterrorizar servos.
- **●● Calafrio da Sepultura**: O toque gélido do vampiro congela o sangue da vítima, causando calafrios incontroláveis, lentidão severa e perda temporária de atributos físicos.
- **●●● Rigor Mortis**: O cainita aponta o dedo e enrijece instantaneamente as articulações do alvo como gesso; o oponente fica completamente paralisado de dor e rigidez cadavérica.
- **●●●● Murchar a Carne**: Com uma maldição sussurrada, o Capadócio apodrece e resseca os músculos e membros do alvo, transformando braços e pernas em carne podre e causando dano agravado severo.
- **●●●●● O Hálito Pestilento**: O vampiro exala uma névoa esverdeada de putrefação cadavérica; todos os seres vivos na área sufocam e apodrecem, enquanto cainitas são consumidos pelo fedor da sepultura.`,
    },
    {
      id: 'da1e_cap5_disciplinas_pt2',
      numero: 'Capítulo V',
      titulo: 'Compêndio de Disciplinas — Parte II',
      subtitulo: 'Ofuscação, Potência, Presença, Metamorfose, Quietus e Serpentis',
      conteudo: `### 7. Ofuscação
O controle místico sobre a atenção e a percepção alheia.
- **● Manto das Sombras**: Permite permanecer perfeitamente oculto enquanto imóvel em qualquer sombra ou penumbra.
- **●● Presença Invisível**: O cainita pode mover-se abertamente em plena luz ou salões lotados; as mentes dos presentes simplesmente ignoram sua existência.
- **●●● Máscara das Mil Faces**: Transmuta a percepção de sua aparência na mente de todos os observadores, podendo simular o rosto de um nobre, um guarda ou um servo.
- **●●●● Desvanecer**: Permite evaporar da visão de uma sala inteira bem diante dos olhos dos observadores, deixando-os desnorteados.
- **●●●●● Cobertura da Concentração**: Estende a invisibilidade da Ofuscação a um grupo inteiro de companheiros que acompanhem o cainita.

---

### 8. Potência
A força brutal e titânica concedida pelo sangue amaldiçoado.
- **Níveis ● a ●●●●●**: Na 1ª Edição de 1996, cada nível de Potência confere **um sucesso automático** em todos os testes de Força e manobras de dano corporal, permitindo estilhaçar portas de ferro fundido e partir couraças ao meio com um único soco.

---

### 9. Presença
O magnetismo emocional irresistível que comove multidões.
- **● Fascínio**: Atrai a admiração e atenção benevolente de todos os presentes no salão; os mortais tornam-se receptivos e cooperativos.
- **●● Olhar Aterrorizante**: O vampiro revela um vislumbre da Besta ancestral nos olhos, congelando um oponente de puro terror ou forçando-o a fugir em pânico.
- **●●● Encanto**: Conquista a lealdade e afeto incondicional de um alvo; a vítima passa a enxergar o cainita como seu amigo mais querido e venerado.
- **●●●● Invocação**: O cainita projeta seu chamado mental através de qualquer distância; o indivíduo chamado sente uma necessidade irreprimível de viajar até o invocador.
- **●●●●● Majestade**: Uma aura divina e aterrorizante irradia do cainita; ninguém na sala pode erguer a voz, desembainhar armas ou pensar em atacá-lo sem ser esmagado pelo desespero e adoração.

---

### 10. Metamorfose
O poder dos ermos que transmuta a carne cainita em fera e elemento.
- **● Olhos da Besta**: Olhos dourados e brilhantes que concedem visão perfeita na escuridão mais absoluta e intimidam animais.
- **●● Garras da Fera**: Unhas crescem e transformam-se em garras afiadas como navalhas de pedra, que causam **dano agravado** em combate corpo a corpo.
- **●●● Fusão com a Terra**: O vampiro derrete seu corpo para dentro do solo fértil, dormindo no ventre da terra a salvo da luz solar diurna.
- **●●●● A Sombra da Fera**: Metamorfose completa do corpo em um lobo veloz e feroz ou em um morcego silencioso para voo noturno.
- **●●●●● Forma de Névoa**: O cainita desfaz sua carne em uma névoa impalpável, capaz de atravessar buracos de fechadura e frestas, imune a armas físicas.

---

### 11. Quietus (Clã Assamita)
A arte do assassinato ritualístico e da condensação do veneno do sangue.
- **● Silêncio da Morte**: Cria uma redoma de silêncio absoluto ao redor do cainita; nenhum som, grito ou golpe é emitido ou ouvido no perímetro.
- **●● O Toque do Escorpião**: Transmuta a própria vitae em um veneno que queima a vitalidade e a resistência física da vítima.
- **●●● O Chamado de Dagon**: Após banhar o oponente com sangue, o assassino concentra sua vontade à distância para romper os vasos sanguíneos internos da presa.
- **●●●● O Veneno de Baal**: Converte o sangue do vampiro em um ácido corrosivo de alta potência que dissolve armaduras, tecidos e ossos instantaneamente.
- **●●●●● O Gosto da Morte**: Permite cuspir ou projetar jatos de vitae cáustica e venenosa à distância, infligindo dano agravado fatal.

---

### 12. Serpentis (Seguidores de Set)
Os mistérios ophidianos do Deus Negro do Nilo.
- **● Os Olhos da Serpente**: Um olhar hipnótico paralisante que congela qualquer mortal ou cainita no lugar enquanto os olhos mantiverem contato.
- **●● A Língua da Serpente**: A língua do vampiro se bifurca e estica em uma farpa venenosa que ataca como chicote e drena sangue à distância.
- **●●● A Pele da Víbora**: A pele torna-se elástica e coberta por escamas negras brilhantes, reduzindo o impacto de armas e facilitando contorções impossíveis.
- **●●●● O Formato da Naja**: O vampiro se transmuta completamente em uma serpente colossal de veneno letal.
- **●●●●● O Coração das Trevas**: O sacerdote setita remove cirurgicamente seu próprio coração do peito e o guarda em um vaso de barro lacrado, tornando-se imune à estaca no coração!`,
    },
    {
      id: 'da1e_cap6_disciplinas_pt3',
      numero: 'Capítulo VI',
      titulo: 'Compêndio de Disciplinas — Parte III',
      subtitulo: 'Taumaturgia, Tenebrosidade, Vicissitude, Quimerismo e Valeren',
      conteudo: `### 13. Taumaturgia (Clã Tremere)
A feitiçaria hermética baseada na manipulação ritual do sangue.
#### A Senda Principal: A Senda do Sangue
- **● Gosto de Sangue**: Ao provar uma gota de sangue, o mago descobre a geração, clã, reserva restante e pureza da vitae do alvo.
- **●● Fúria do Sangue**: Incita temporariamente a Besta de outro cainita, aumentando a fome ou forçando-o a gastar sangue involuntariamente.
- **●●● Potência do Sangue**: Concentra temporariamente a densidade de sua própria vitae, reduzindo sua geração aparente por algumas noites.
- **●●●● Roubo de Sangue**: Atrai fios de vitae das veias de um alvo à distância diretamente para a boca do taumaturgo.
- **●●●●● Caldeirão de Sangue**: Ferve instantaneamente o sangue dentro do peito da vítima; mortais explodem em chamas horríveis e vampiros sofrem dano agravado colossal.

---

### 14. Tenebrosidade (Clã Lasombra)
O comando aterrorizante sobre a substância viva do Abismo.
- **● Jogo de Sombras**: Molda e alonga sombras do ambiente, distorcendo silhuetas para apavorar mortais e ocultar passagens.
- **●● Manto da Noite**: Conjura uma nuvem densa de escuridão viva e gélida que extingue tochas, sufoca sons e cega completamente quem estiver dentro.
- **●●● Braços do Abismo**: Arranca tentáculos negros e monstruosos das sombras do chão e paredes, que agarram, esmagam e sufocam inimigos.
- **●●●● Metamorfose Negra**: O Lasombra funde sua carne com as sombras do Abismo, ganhando estatura gigantesca, tentáculos extras e garras sombrias.
- **●●●●● Forma Tenebrosa**: Transforma todo o corpo em uma mancha viva de trevas puras, imune a dano físico e capaz de escorrer por frestas.

---

### 15. Vicissitude (Clã Tzimisce)
A esculpidação cirúrgica e mística de carne e osso.
- **● Aspecto Mutável**: Altera os traços faciais, voz, tom de pele e altura própria ou de outra criatura como massa de modelar.
- **●● Moldar a Carne**: Estica, corta e cicatriza músculos e pele, permitindo criar bolsos dérmicos, suturar ferimentos ou transformar faces em máscaras lisas sem olhos.
- **●●● Moldar os Ossos**: Entalha ossos vivos; permite criar lâminas ósseas que brotam dos antebraços, espinhos dorsais defensivos ou quebrar esqueletos inimigos ao toque.
- **●●●● Forma Horrenda (Forma de Zulo)**: O Tzimisce se transmuta em uma monstruosidade de dois metros e meio coberta de espinhos ósseos, garras pretas e musculatura demoníaca (+3 em todos os Atributos Físicos).
- **●●●●● Forma de Sangue**: Desfaz o corpo físico em uma poça senciente de sangue vivo, capaz de rastejar e evitar qualquer ataque corporal.

---

### 16. Quimerismo (Clã Ravnos)
A projeção e manifestação física de ilusões sagradas.
- **● Ignis Fatuus**: Ilusão estática que engana um único sentido (uma voz sussurrada, um cheiro de enxofre, um brilho de ouro).
- **●● Fata Morgana**: Ilusão dinâmica e complexa que engana todos os cinco sentidos simultaneamente (um guerreiro marchando, um salão em chamas).
- **●●● Aparição**: Permite que a ilusão se mova autonomamente e responda a estímulos sem que o Ravnos precise concentrar-se o tempo todo.
- **●●●● Permanência**: Ancora a ilusão no tempo e espaço; ela continua existindo mesmo que o Ravnos viaje para outra cidade.
- **●●●●● Horrível Realidade**: A ilusão torna-se tão perfeita e violenta que a mente da vítima acredita estar sendo queimada ou esmagada, sofrendo **ferimentos reais** de dano!

---

### 17. Obeah / Valeren (Clã Salubri)
O poder místico do Terceiro Olho de Saulot.
- **● Paz de Saulot**: Acalma dores físicas atrozes e dissipa o pavor do frenesi em humanos e vampiros.
- **●● Toque Anestésico**: Adormece completamente os sentidos e nervos de um alvo ferido com um simples toque carinhoso.
- **●●● Toque Curativo**: O Salubri gasta pontos de sangue para cicatrizar ferimentos mortais em humanos e até curar dano agravado em outros cainitas!
- **●●●● O Olhar Vigilante**: O Terceiro Olho emite uma luz diáfana que repele espíritos corrompidos e revela possessões demoníacas.
- **●●●●● Alívio da Alma**: Liberta a mente de maldições mentais profundas e aproxima o cainita do caminho sagrado de Golconda.`,
    },
    {
      id: 'da1e_cap7_sistemas',
      numero: 'Capítulo VII',
      titulo: 'Sistemas de Jogo, Sangue e Combate Feudal',
      subtitulo: 'Regras de Testes, Danos, Cura, Frenesi e Röstschreck',
      conteudo: `### A Mecânica Básica: O Sistema Storyteller
Todas as ações incertas são resolvidas somando-se um **Atributo + uma Habilidade**, rolando um número equivalente de dados de dez faces (d10) contra uma **Dificuldade** estipulada pelo Narrador (geralmente de 3 a 9, sendo 6 a dificuldade padrão):
- Cada dado cujo resultado for igual ou superior à Dificuldade é um **Sucesso**.
- Cada resultado **1** em qualquer dado cancela um sucesso obtido.
- Se não houver nenhum sucesso e pelo menos um '1' for rolado, ocorre uma **Falha Crítica (Botch)**.

---

### O Sangue Cainita: A Fonte de Poder
A vitae que queima nas veias do vampiro pode ser gasta das seguintes formas:
1. **Acordar Cada Noite**: Custa obrigatoriamente **1 Ponto de Sangue** ao despertar ao anoitecer.
2. **Curar Ferimentos**: Cada ponto de sangue gasto cura **1 nível de dano Contundente ou Letal**. Para curar **1 nível de dano Agravado**, o cainita precisa descansar um dia inteiro e gastar **3 pontos de sangue**.
3. **Aumentar Atributos Físicos**: O vampiro pode gastar sangue para elevar Força, Destreza ou Vigor além de seus limites mortais por uma cena inteira.
4. **Alimentar Disciplinas**: Ativação de poderes ancestrais como Rapidez, Metamorfose e Taumaturgia.

---

### Fases do Combate Feudal
1. **Iniciativa**: Raciocínio + Prontidão + 1d10. Age primeiro quem obtiver o maior total.
2. **Ataque**:
   - Ataque com Espada/Machado: Destreza + Armas Brancas (Dif. estipulada pela arma, geralmente 6).
   - Ataque com Arco: Destreza + Arquearia.
   - Briga Desarmada: Destreza + Briga.
3. **Defesa (Esquiva ou Bloqueio)**: O defensor pode abdicar de sua ação para esquivar (Destreza + Esquiva) ou aparar com espada (Destreza + Armas Brancas). Cada sucesso de defesa subtrai um sucesso do ataque.
4. **Dano e Absorção**:
   - Parada de Dano: Força + bônus da arma + sucessos sobressalentes do ataque.
   - Parada de Absorção: O defensor rola **Vigor + Fortitude** (Dificuldade 6) contra danos contundentes e letais. Se o dano for **Agravado** (fogo, luz do sol, garras sobrenaturais), apenas a pontuação de **Fortitude** pode ser rolada para absorver!

---

### A Fera Interior: Frenesi e Röstschreck
- **O Frenesi (A Fúria Cega)**: Desencadeado por fome intensa, humilhação pública ou raiva. O jogador rola **Autocontrole** contra dificuldade entre 6 e 8. Se falhar, a Besta assume o controle total e ataca tudo ao redor sem piedade.
- **O Röstschreck (O Terror Vermelho)**: O medo primordial do fogo de tochas, fogueiras e da luz solar. O jogador rola **Coragem** contra dificuldade proporcional à intensidade da chama (tocha pequena = 6; incêndio ou sol = 8 a 9). Se falhar, o vampiro foge em pânico ensandecido, atropelando quem estiver pelo caminho.`,
    },
    {
      id: 'da1e_cap8_trilhas',
      numero: 'Capítulo VIII',
      titulo: 'Humanidade e Trilhas de Sabedoria Medievais',
      subtitulo: 'As Vias da Noite e a Luta Contra a Perda da Alma',
      conteudo: `### A Moralidade na Idade das Trevas
Na era medieval, a Humanidade não é a única tábua de salvação contra a degeneração. Muitos cainitas adotam as **Trilhas de Sabedoria (Vias)** — filosofias estritas e códigos morais elaborados para dar propósito à eternidade e manter a Besta domesticada.

#### 1. O Caminho da Humanidade (Via Humanitas)
A busca por preservar a empatia e a piedade mortal.
- Pecados capitais: assassinato desnecessário, roubo, tortura, crueldade com inocentes.

#### 2. A Trilha dos Reis (Via Regalis)
A filosofia da nobreza feudal, adotada principalmente por Ventrue e Lasombra.
- Preceitos: A liderança é um dever divino; governe com mão firme mas justa; honre sua palavra e seus juramentos feudais; nunca demonstre fraqueza ou covardia perante inferiores.

#### 3. A Trilha dos Céus (Via Caeli)
A devoção religiosa cainita, popular entre cavaleiros cruzados e monges da noite.
- Preceitos: Caim foi punido por Deus para servir como flagelo dos pecadores; aceite sua maldição com penitência sincera; busque a absolvição através da oração diária e do arrependimento.

#### 4. A Trilha da Fera (Via Bestiae)
O código dos predadores naturais, venerado pelos Gangrel e guerreiros selvagens.
- Preceitos: Sobreviva a qualquer custo; não mate por prazer sádico, apenas para se alimentar e defender seu território; respeite os animais e os ciclos sagrados da natureza.

#### 5. A Trilha dos Ossos (Via Ossis)
A ciência fúnebre do Clã Capadócio.
- Preceitos: A morte é o mistério supremo do universo; estude a decomposição e o limiar entre corpo e alma com desapego acadêmico impassível; não tema a morte nem mate por impulso vulgar.

#### 6. A Trilha do Sangue (Via Sanguinis)
A doutrina sagrada dos Assassinos de Haqim (Assamitas).
- Preceitos: O sangue de Caim deve ser purificado; colha o dízimo da vitae dos indignos para alimentar Alamut; aproxime-se do Pai Primordial através da diablerie justa contra pecadores.

#### 7. A Trilha do Pecado (Via Peccati)
Abraçada por Setitas e hedonistas que acreditam que a libertação reside em mergulhar nas paixões carnais mais extremas para exaurir os desejos mundanos.`,
    },
  ],
};
