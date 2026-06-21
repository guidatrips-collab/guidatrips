/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experience, ExperienceCategory, BlogPost, GlobalSettings } from "./types";

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: "passeio-barco-premium",
    name: "Passeio de Barco Premium — Ilha do Farol & Pontal",
    slug: "passeio-barco-premium-ilha-farol",
    category: ExperienceCategory.NAUTICO,
    shortDescription: "Navegue pelas águas mais cristalinas do Brasil com embarcação exclusiva e curadoria de paradas.",
    fullDescription: `### O Caribe Brasileiro como você nunca viu

Navegar por Arraial do Cabo é mergulhar em um cenário cinematográfico. O nosso passeio náutico exclusivo foi desenhado para quem busca escapar da bagunça dos barcos de turismo de massa e vivenciar o mar como ele deve ser vivido: com calma, conforto e atenção aos detalhes.

Nossa embarcação conta com infraestrutura premium, marinheiro experiente e serviço de bordo atencioso, incluindo água fresca, gelo e frutas da estação.

#### O Roteiro Editorial:
- **Ilha do Farol**: Acesso restrito controlado pela Marinha do Brasil. Uma das praias mais puras e perfeita do planeta, caracterizada por sua areia branca ultrafina e águas azul-turquesa inertes.
- **Prainhas do Pontal do Atalaia**: Desembarque direto na areia para caminhar sob a famosa escadaria de madeira e admirar a vista privilegiada do alto da colina.
- **Gruta Azul**: Aproximação segura do paredão pedregoso de fendas milenares que, ao receber o reflexo dourado do sol, reluz em tons de safira hipnotizantes.
- **Fenda de Nossa Senhora**: Uma incrível formação geológica de 40 metros de altura no meio do mar aberto.
- **Praia do Forno**: Parada estratégica para mergulho livre (snorkeling) e observação da fauna marinha local (tartarugas são visitantes frequentes).`,
    duration: "4 horas",
    capacity: 45,
    priceFrom: 120,
    included: [
      "Marinheiro credenciado",
      "Colete salva-vidas e óculos de snorkeling",
      "Serviço de bordo (água mineral e frutas)",
      "Taxa de embarque inclusa"
    ],
    notIncluded: [
      "Almoço e bebidas alcoólicas",
      "Despesas de transporte até o píer",
      "Fotografia profissional (serviço opcional)"
    ],
    meetingPoint: "Píer da Praia dos Anjos (Porto de Arraial do Cabo)",
    coordinates: { lat: -22.9715, lng: -42.0224 },
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    whatsappMessage: "Olá! Gostaria de reservar o Passeio de Barco Premium.",
    status: "active",
    featured: true,
    badge: "mais-vendido",
    location: "Arraial do Cabo",
    schedules: ["08:00", "11:30", "15:00"],
    recommendations: ["buggy-massambaba", "batismo-mergulho-autonomo"],
    faqs: [
      { question: "A escadaria do Pontal está incluída?", answer: "Sim! Faremos parada especial nas Prainhas do Pontal do Atalaia com tempo livre para caminhar e fotografar na escadaria." },
      { question: "Qual é a tolerância de atraso?", answer: "Sugerimos chegar com 20 minutos de antecedência no píer de embarque da Praia dos Anjos para o check-in." }
    ],
    seo: {
      metaTitle: "Passeio de Barco Premium em Arraial do Cabo | Guida Trips",
      metaDescription: "Fugir do turismo de massa. Explore a Ilha do Farol e as prainhas do Atalaia em embarcação exclusiva com curadoria de roteiro de 4 horas.",
      keywords: ["passeio de barco arraial", "ilha do farol", "prainhas do pontal", "caribe brasileiro"]
    },
    createdAt: "2026-06-20T12:00:00-03:00",
    updatedAt: "2026-06-20T12:00:00-03:00"
  },
  {
    id: "buggy-massambaba",
    name: "Expedição Buggy Off-Road — Dunas de Massambaba",
    slug: "expedicao-buggy-off-road-massambaba",
    category: ExperienceCategory.OFF_ROAD,
    shortDescription: "Aventura imersiva cruzando praias desertas, dunas gigantes e mirantes secretos em alta definição estética.",
    fullDescription: `### Sinta o vento. Descubra caminhos selvagens.

Se você acha que Arraial do Cabo se limita à praia dos Anjos e barcos, esta expedição vai revolucionar a sua percepção. A nossa rota Off-Road de Buggy foi desenhada por aventureiros locais para explorar o lado intocado e selvagem da península.

Guiados por profissionais credenciados que respiram o destino, cruzaremos as incríveis dunas móveis e margearemos praias de mar aberto onde o homem raramente pisa.

#### O Roteiro de Liberdade:
- **Praia Grande**: Parada inicial para contemplar a grandiosidade de uma das maiores praias do estado, com sua areia que range sob os pés e ondas selvagens.
- **Dunas de Massambaba**: Verdadeiros desertos de areia cristalina esculpidos pelo vento contínuo. Aqui, o buggy dança entre caminhos sinuosos com total segurança.
- **Lagoa Vermelha**: Parada ecológica para compreender o ecossistema local e o fenômeno de águas com ricas propriedades minerais.
- **Mirante Secreto do Pontal**: Acesso exclusivo por trilha off-road para ver o entardecer do ponto geográfico mais alto e privilegiado, longe da muvuca de observadores clássicos.`,
    duration: "3h30",
    capacity: 4,
    priceFrom: 180,
    included: [
      "Buggy privativo higienizado",
      "Piloto/Guia credenciado e experiente",
      "Combustível e taxas locais",
      "Seguro de aventura individual"
    ],
    notIncluded: [
      "Alimentos e bebidas nos quiosques",
      "Acessórios adicionais de mergulho"
    ],
    meetingPoint: "Acomodação do cliente (Hotel/Pousada em Arraial do Cabo)",
    coordinates: { lat: -22.9642, lng: -42.0298 },
    photos: [
      "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    videoEmbed: "",
    whatsappMessage: "Olá! Gostaria de agendar a Expedição Buggy Off-Road.",
    status: "active",
    featured: true,
    badge: "mais-vendido",
    location: "Arraial do Cabo",
    schedules: ["09:00", "14:00", "16:30"],
    recommendations: ["sunset-pontal-cultural", "passeio-barco-premium"],
    faqs: [
      { question: "Quantas pessoas cabem por buggy?", answer: "Cada veículo comporta com total segurança até 4 passageiros mais o piloto credenciado." },
      { question: "O passeio inclui parada para banho?", answer: "Sim! Paramos na fantástica Praia Grande e contornamos dunas com paradas para banho na lagoa." }
    ],
    seo: {
      metaTitle: "Passeio de Buggy em Arraial do Cabo | Guida Trips",
      metaDescription: "Sinta a liberdade máxima com nossa Expedição de Buggy pelas Dunas de Massambaba e praias selvagens de Arraial do Cabo. Faça sua reserva hoje.",
      keywords: ["passeio de buggy", "dunas de massambaba", "pôr do sol arraial do cabo", "off road rj"]
    },
    createdAt: "2026-06-20T12:00:00-03:00",
    updatedAt: "2026-06-20T12:00:00-03:00"
  },
  {
    id: "temporada-baleias-avistamento",
    name: "Safári Ambiental — Avistamento de Baleias Jubarte",
    slug: "safari-ambiental-avistamento-baleias-jubarte",
    category: ExperienceCategory.TEMPORADA,
    shortDescription: "Um espetáculo indescritível em mar aberto. Monitores biólogos guiam o avistamento da rota migratória anual.",
    fullDescription: `### Gigantes do Oceano bem na sua frente

De julho a outubro, as águas profundas do entorno de Arraial do Cabo se transformam em uma verdadeira rodovia de gigantes. As baleias-jubarte viajam milhares de quilômetros das águas antárticas para se reproduzir nas águas quentes da Bahia, e Arraial é um ponto estratégico e geográfico maravilhoso para avistamento.

Nossa operação é estritamente ecológica, seguindo portarias internacionais de proteção de mamíferos marinhos. Navegamos sob a orientação de biólogos marinhos dedicados que enriquecem a jornada com palestras científicas ao vivo.

#### A Experiência Científica e Emocional:
- **Briefing de Conservação**: Palestra de 15 minutos antes do embarque sobre a ecologia das baleias e regras éticas de aproximação passiva.
- **Busca em Mar Aberto**: Navegação coordenada por profissionais munidos de telescópios na terra e rádio de apoio.
- **Música do Oceano**: Lançamento de hidrofone subaquático (se as condições permitirem) para tentar escutar o belo canto melódico dos machos de jubarte.
- **Registro Fotográfico**: Envio gratuito das melhores fotos científicas captadas por nossa equipe profissional durante o passeio.`,
    duration: "4h30",
    capacity: 25,
    priceFrom: 220,
    included: [
      "Embarcação homologada de alta estabilidade",
      "Acompanhamento de Biólogo Marinho especialista",
      "Uso de hidrofone de alta sensitividade",
      "Café e lanche de bordo ecológico"
    ],
    notIncluded: [
      "Medicação para enjoo (recomenda-se tomar antes)",
      "Bebidas alcoólicas"
    ],
    meetingPoint: "Deck dos Pescadores, Praia dos Anjos",
    coordinates: { lat: -22.9731, lng: -42.0210 },
    photos: [
      "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80"
    ],
    videoEmbed: "",
    whatsappMessage: "Olá! Tenho interesse no Safári Ambiental das Baleias Jubarte.",
    status: "active",
    featured: true,
    badge: "temporada",
    location: "Arraial do Cabo",
    schedules: ["07:30", "12:30"],
    recommendations: ["batismo-mergulho-autonomo", "sunset-pontal-cultural"],
    faqs: [
      { question: "E se não virmos nenhuma baleia?", answer: "Por tratar-se de vida selvagem e livre no mar aberto, não há garantia absoluta. No entanto, nossa taxa histórica de sucesso na temporada é superior a 94%." }
    ],
    seo: {
      metaTitle: "Passeio Avistamento de Baleias em Arraial do Cabo | Guida Trips",
      metaDescription: "Participe da temporada de baleias-jubarte in Arraial do Cabo com equipe de biólogos marinhos. Conforto, segurança e rígidos protocolos ecológicos.",
      keywords: ["baleia jubarte arraial", "quando ver baleias", "safari ambiental", "biologia marinha rj"]
    },
    createdAt: "2026-06-20T12:00:00-03:00",
    updatedAt: "2026-06-20T12:00:00-03:00"
  },
  {
    id: "batismo-mergulho-autonomo",
    name: "Batismo de Mergulho Autônomo — Capitânia Ecológica",
    slug: "batismo-mergulho-autonomo-arraial",
    category: ExperienceCategory.NAUTICO,
    shortDescription: "Descubra por que Arraial do Cabo é a Capital Nacional do Mergulho com águas transparentes e rica biodiversidade.",
    fullDescription: `### O Universo Subaquático Conectado

Arraial do Cabo goza de uma característica mágica no continente sul-americano: o fenômeno da **Ressurgência**. Águas profundas e gélidas ricas em nutrientes sobem à superfície, transformando a região em um berço ecológico imbatível de vida marinha.

No nosso Batismo de Mergulho, você não precisa de curso ou experiência prévia. Um instrutor altamente qualificado e certificado internacionalmente (PADI/NAUI) acompanhará você de forma individual, operando o seu equipamento durante todo o tempo sob a água.

#### O Passeio de Mapeamento:
- **Adaptação Superficial**: Treinamento de 15 minutos em água rasa e abrigada para se habituar ao regulador de respiração.
- **Mergulho Alinhado**: Desfazer o estresse flutuando entre 5 e 10 metros de profundidade ao lado do seu instrutor exclusivo.
- **Biodiversidade Fantástica**: Interagir com tartarugas gigantes de carapaça brilhante, arraias-chita voando na correnteza, cardumes de lagostas amarelas e corais multicoloridos raros.`,
    duration: "3 horas",
    capacity: 12,
    priceFrom: 290,
    included: [
      "Equipamento de mergulho completo (roupa de neoprene, cilindro, regulador)",
      "Instrutor individual (credenciado PADI/NAUI)",
      "Lanches leves pós-mergulho no barco",
      "Sessão de fotos subaquáticas em alta resolução inclusa"
    ],
    notIncluded: [
      "Aluguel de computador de mergulho profissional",
      "Bebidas gaseificadas"
    ],
    meetingPoint: "Operadora de Mergulho parceira, Praia Grande",
    coordinates: { lat: -22.9720, lng: -42.0250 },
    photos: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80"
    ],
    videoEmbed: "",
    whatsappMessage: "Olá! Gostaria de reservar o Batismo de Mergulho em Arraial.",
    status: "active",
    featured: false,
    badge: "novidade",
    location: "Arraial do Cabo",
    schedules: ["08:00", "11:30", "14:30"],
    recommendations: ["passeio-barco-premium", "gourmet-praia-dos-anjos"],
    faqs: [
      { question: "Precisa saber nadar?", answer: "Não é obrigatório saber nadar. Faremos uma adaptação na superfície e a descida é totalmente guiada de forma individual pelo instrutor, que controla seus equipamentos." }
    ],
    seo: {
      metaTitle: "Mergulho de Batismo em Arraial do Cabo | Guida Trips",
      metaDescription: "Respire debaixo d'água de forma totalmente segura. Batismo guiado por instrutores dedicados com equipamento premium e sessão fotográfica inclusa.",
      keywords: ["mergulho arraial do cabo", "batismo de mergulho", "ressurgencia rj", "ver tartarugas rj"]
    },
    createdAt: "2026-06-20T12:00:00-03:00",
    updatedAt: "2026-06-20T12:00:00-03:00"
  },
  {
    id: "sunset-pontal-cultural",
    name: "Roteiro Histórico & Sunset Curado no Pontal do Atalaia",
    slug: "roteiro-historico-sunset-pontal-atalaia",
    category: ExperienceCategory.CULTURA,
    shortDescription: "Uma caminhada elegante resgatando histórias dos povos sambaquianos finalizando com espumante de curadoria no pôr do sol.",
    fullDescription: `### O Sol se deita no fim da América

Dizem que o entardecer nas encostas do Pontal do Atalaia cura a alma. Criamos essa experiência intimista para os apreciadores de belas histórias, vinhos refinados e geografia peculiar de Arraial.

Mapeado de forma exclusiva, o nosso guia cultural conduzirá você a pé por caminhos secretos contornando despenhadeiros oceânicos, enquanto desvenda curiosidades sobre a colonização portuguesa, piratas ingleses que naufragaram nessas águas e a lendária rota dos navegadores indígenas.

#### A Linha de Rota:
- **Caminho das Falésias**: Uma trilha suave interpretando a fauna e flora endêmica da restinga fluminense.
- **Ruínas da Antiga Fortaleza**: Visita explicativa aos cumes de observação militar desativados da Marinha colonial.
- **Brinde Editorial**: Ao som das ondas colidindo nas rochas e o sol submergindo no horizonte atlântico, ofereceremos uma degustação especial de queijos artesanais fluminenses e espumante brut gelado.`,
    duration: "3 horas",
    capacity: 10,
    priceFrom: 160,
    included: [
      "Mochileiro Guia Cultural especializado",
      "Cesta de piquenique gourmet (queijos locais, pães de fermentação natural)",
      "Garrafa de Espumante Brut (para cada 2 pessoas)",
      "Taças de acrílico premium reutilizáveis de brinde"
    ],
    notIncluded: [
      "Buggy ou veículo particular de trânsito",
      "Calçados próprios de caminhada (recomenda-se tênis)"
    ],
    meetingPoint: "Guarita de Segurança do Pontal do Atalaia",
    coordinates: { lat: -22.9818, lng: -42.0195 },
    photos: [
      "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
    ],
    videoEmbed: "",
    whatsappMessage: "Olá! Desejo reservar o Sunset Curado no Pontal do Atalaia.",
    status: "active",
    featured: false,
    badge: "",
    location: "Arraial do Cabo",
    schedules: ["16:00"],
    recommendations: ["gourmet-praia-dos-anjos", "buggy-massambaba"],
    faqs: [
      { question: "O piquenique é privativo?", answer: "Sim! Montamos uma mesa/lounge privativa para casais ou pequenos grupos em pontos reservados e afastados do trânsito na colina." }
    ],
    seo: {
      metaTitle: "Pôr do Sol no Pontal do Atalaia com Espumante | Guida Trips",
      metaDescription: "Um piquenique gourmet exclusivo no pôr do sol mais espetacular de Arraial do Cabo. Trilha histórica, brinde luxuoso e vista dinâmica incrível.",
      keywords: ["pontal do atalaia por do sol", "piquenique arraial", "turismo historico", "sunset rj"]
    },
    createdAt: "2026-06-20T12:00:00-03:00",
    updatedAt: "2026-06-20T12:00:00-03:00"
  },
  {
    id: "gourmet-praia-dos-anjos",
    name: "Jantar Curado à Luz de Velas — Praia dos Anjos",
    slug: "jantar-curado-luz-de-velas-praia-anjos",
    category: ExperienceCategory.GASTRONOMIA,
    shortDescription: "Menu degustação focado em frutos do mar grelhados com pescaria sustentável do dia, sob o céu estrelado.",
    fullDescription: `### O Mar servido no seu prato

A gastronomia da Região dos Lagos transcende o clássico peixe frito com batata. Unindo a pescaria artesanal local com técnicas refinadas da cozinha ibero-americana, criamos uma experiência acolhedora, intimista e profundamente aromática.

Montamos uma mesa privativa diretamente na areia ou no deck de madeira de um bistrô parceiro secreto na areia da Praia dos Anjos, perfeitamente isolada e decorada com velas aromáticas e iluminação quente minimalista.

#### O Menu da Noite:
- **Entrada**: Ceviche de Peixe Branco da Ressurgência marinado no limão galego com raspas de tangerina e pimenta de cheiro local.
- **Prato Principal**: Lula gigante de Arraial grelhada na brasa acompanhada de risoto cremoso de limão siciliano e castanha de caju crocante.
- **Sobremesa**: Mousse aerada de maracujá da restinga com calda de chocolate meio amargo e sal marinho.`,
    duration: "2h30",
    capacity: 6,
    priceFrom: 195,
    included: [
      "Menu degustação de 3 etapas completo",
      "Mesa decorada privativa",
      "Sommelier local sugerindo harmonização",
      "Água e welcome drink artesanal"
    ],
    notIncluded: [
      "Vinhos e espumantes adicionais consumidos",
      "Taxa de serviço padrão da cozinha"
    ],
    meetingPoint: "Orla da Praia dos Anjos, Cabo Frio/Arraial",
    coordinates: { lat: -22.9698, lng: -42.0232 },
    photos: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
    ],
    videoEmbed: "",
    whatsappMessage: "Olá! Desejo reservar o Jantar à Luz de Velas na Praia dos Anjos.",
    status: "active",
    featured: false,
    badge: "",
    location: "Arraial do Cabo",
    schedules: ["19:30", "21:00"],
    recommendations: ["sunset-pontal-cultural", "passeio-barco-premium"],
    faqs: [
      { question: "Há alternativas vegetarianas?", answer: "Sim, oferecemos opções como carpaccio de abobrinha defumada e massa fresca artesanal com molho de cogumelos locais. Nos informe na reserva." }
    ],
    seo: {
      metaTitle: "Jantar à Luz de Velas em Arraial do Cabo | Guida Trips",
      metaDescription: "Vivencie um jantar gourmet exclusivo com frutos do mar grelhados e pescaria do dia na Praia dos Anjos. Mesa decorada privativa com menus de 3 etapas.",
      keywords: ["jantar romantico arraial", "restaurante praia dos anjos", "onde comer arraial do cabo", "frutos do mar rj"]
    },
    createdAt: "2026-06-20T12:00:00-03:00",
    updatedAt: "2026-06-20T12:00:00-03:00"
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "guia-completo-arraial-2026",
    title: "O que fazer em Arraial do Cabo: Guia de Viagem Definitivo para 100% de Conexão",
    slug: "o-que-fazer-em-arraial-do-cabo-guia-completo",
    category: "Roteiros",
    tags: ["Arraial do Cabo", "Roteiro Completo", "Caribe Brasileiro", "Viagem Premium"],
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Arraial do Cabo é mundialmente conhecida por suas praias hipnotizantes. Porém, muito além do comum, revelamos segredos intocados que poucos têm o privilégio de vivenciar.",
    body: `## Uma Conexão Real com a Capital do Mar

Quando os viajantes planejam uma ida a Arraial do Cabo, a mente costuma ser inundada por imagens clássicas de águas caribenhas e da célebre escadaria de madeira do Pontal do Atalaia. E sim, estes pontos são espetaculares. Mas para absorver de fato a energia e a história que emanam da península fluminense, é preciso ir mais fundo.

Neste guia editorial, desvendamos dicas práticas, cronogramas de fuga dos períodos de superlotamento e o resgate da autêntica curadoria em cada passeio.

---

### Quando Ir e Como Evitar as Multidões?

Arraial do Cabo goza de sol quase o ano todo. Devido à sua geografia de restinga, chove muito menos aqui do que na vizinha Angra dos Reis, por exemplo. Mas o principal fator a ser analisado na sua viagem é a fluidez de visitantes.

- **Baixa Temporada (De Março a Junho)**: Para nós, o período definitivo. O vento diminui levemente, o trânsito flui perfeitamente, os hotéis operam com tranquilidade e a transparência das águas chega ao auge técnico de alta nitidez.
- **Finais de Semana e Feriados**: Se precisar viajar nessas datas, a regra de ouro é **acordar cedo**. O desembarque nos pontos turísticos abre nas primeiras horas da manhã. Iniciar no amanhecer garante fotos isoladas fantásticas e o mar lisinho, quase sem vento.

---

### Roteiro Recomendado de 3 Dias:

#### Dia 1: O Batismo Náutico
Comece o seu dia a bordo de nosso barco premium rumo à **Ilha do Farol**. O acesso controlado garante poucos banhistas dividindo o banco de areia com você. Na volta, flutue na Praia do Forno admirando cardumes de siris azuis e tartarugas-marinhas no snorkeling. Termine a tarde no centro, degustando um peixe cozido na folha de bananeira.

#### Dia 2: Aventura nas Areias Selvagens
De manhã, embarque no buggy privativo rumo às gigantescas **Dunas de Massambaba**. Sinta a emoção do vento no rosto cruzando quilômetros de praias selvagens e areia pura. À noite, configure sua mesa privativa com o Jantar à Luz de Velas em um bistrô acolhedor na Praia dos Anjos.

#### Dia 3: O Pôr do Sol Absoluto e Mirantes
Explore a rica geologia e ecologia da península a pé pela colina histórica. Finalize a viagem sentando confortavelmente nas gramas que debruçam para despenhadeiros oceânicos no Pontal, brindando com espumante nacional premiado enquanto o sol se extingue no mar azul escuro.`,
    seo: {
      metaTitle: "Guia Editorial: O que Fazer em Arraial do Cabo | Guida Trips",
      metaDescription: "Um guia de viagem definitivo feito por locais. Quando visitar as Prainhas, roteiros de 3 dias, gastronomia e dicas para evitar o tráfego turístico."
    },
    status: "published",
    publishedAt: "2026-06-18T09:00:00-03:00",
    views: 1240,
    readTime: 6
  },
  {
    id: "temporada-baleias-arraial-guia",
    title: "Temporada de Baleias em Arraial do Cabo: O Guia Definitivo para esse Fenômeno",
    slug: "temporada-baleias-arraial-do-cabo-guia",
    category: "Natureza",
    tags: ["Temporada", "Baleias Jubarte", "Avistamento", "Vida Selvagem"],
    coverImage: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Entre Julho e Outubro, dezenas de baleias-jubarte cruzam o cabo dando saltos espetaculares. Aprenda as dinâmicas de avistamento responsável e ecologia.",
    body: `## O Espetáculo Humano do Avistamento de Jubartes

Todos os anos, um dos episódios migratórios mais belos e dramáticos do reino animal se desenrola na costa fluminense. As baleias-jubarte (Megaptera novaeangliae) deixam os mares gelados e profundos dos polos e rumam para as águas quentes e abrigadas do litoral nordeste brasileiro.

Neste trajeto épico de milhares de quilômetros, Arraial do Cabo atua como um mirante estratégico definitivo. Com águas ricas e profundas bem próximas às praias, os animais frequentemente se aproximam para interagir, amamentar seus filhotes e realizar malabarismos inesquecíveis.

---

### Como Funciona o Avistamento Responsável?

Garantir o respeito à vida marinha é o nosso dogma maior. A operação do Safári de Avistamento de Baleias segue portarias ecológicas rígidas que protegem esses incríveis mamíferos contra o assédio mecânico.

1. **Aproximação Passiva**: O motor do barco é desligado ou operado em neutro a uma distância segura de 100 metros. Nós não perseguimos as baleias; permitimos que a curiosidade natural delas as tragam em nossa direção.
2. **Tempo Limitado**: Cada observação a um mesmo grupo de cetáceos é restrita a 30 minutos, impedindo o estresse fonoaudiológico do motor do navio na audição sensível dos filhotes.
3. **Equipe de Biólogos**: Toda embarcação científica é comandada por pesquisadores que explicam em tempo real os comportamentos observados, como o bater de nadadeiras peitorais, saltos com exposição corporal de até 80% e jatos de condensação espirados a metros de altura.

---

### Dicas para quem quer Embarcar:
- **Câmeras prontas**: Configure sua câmera para o modo de disparo contínuo (Burst) para conseguir registrar o milésimo de segundo em que o animal expõe a cauda majestosa no oceano.
- **Vestuário**: O mar aberto costuma ser mais fresco e de forte vento devido à massa de ar fria atlântica. Um casaco corta-vento leve e óculos para o sol farão total diferença no seu conforto.
- **Ansiedade controlada**: A vida marinha é livre e autônoma. Curtir o balanço da embarcação, escutar as histórias dos guias e desfrutar do horizonte azul faz parte da jornada até que as primeiras nadadeiras surjam no horizonte para acelerar os corações!`,
    seo: {
      metaTitle: "Guia de Avistamento de Baleias em Arraial do Cabo | Guida Trips",
      metaDescription: "Saiba como vivenciar o incrível festival atlântico das baleias jubarte em Arraial do Cabo de julho a outubro. Dicas de vestuário e ecologia marinha."
    },
    status: "published",
    publishedAt: "2026-06-15T15:30:00-03:00",
    views: 890,
    readTime: 5
  },
  {
    id: "pontal-do-atalaia-sem-transito",
    title: "Como Visitar as Prainhas do Pontal do Atalaia Sem Aglomerações",
    slug: "prainhas-pontal-atalaia-sem-transito",
    category: "Dicas de Viagem",
    tags: ["Pontal do Atalaia", "Dicas Locais", "Segurança", "Praias Isoladas"],
    coverImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Você sonha em tirar aquela foto clássica na escadaria do Pontal sem centenas de pessoas ao fundo? Te damos as coordenadas que as agências comuns escondem.",
    body: `## O Segredo do Topo da Escadaria de Madeira

A escadaria que desce a encosta verde jorrando areia branca no mar azul-turquesa é um dos cartões-postais da América do Sul. Mas o que as páginas gerais do Instagram omitiram é que, nas altas temporadas e feriados, esse cenário de serenidade pura pode se transformar em um festival confuso de caixas de som acústicas coletivas e filas extensas para tirar fotos.

Mas não se preocupe! Como curadores dedicados da Guida Trips, preparamos esse guia tático de visitação silenciosa para que você registre e sinta a verdadeira pureza desse templo natural.

---

### 1. A Regra das Primeiras Horas Comerciais
Os portões de controle do condomínio florestal do Pontal abrem para veículos de turismo às **07h00 da manhã**. Se você chegar exatamente nesse horário ou um pouco antes, descerá a escadaria com o sol nascendo manso refletido na água prateada, com a areia fria sem marca de passos alguma e, de bônus, o frescor de temperaturas arejadas de amanhecer.

---

### 2. Chegar pelo Estilo Náutico (Desembarque Molhado!)
Se você odeia dirigir ou quer contornar filas no guichê terrestre, a melhor opção é o aproamento do seu navio diretamente nas areias. O nosso **Passeio de Barco Premium** sai do píer às 08h00 e desembarca prioritariamente nas Prainhas nas primeiras posições de fondeamento, antes dos grandes pesqueiros turísticos barulhentos ancorarem.

---

### 3. A Visita no Pôr do Sol (Pós 16h)
A esmagadora maioria dos turistas casuais deixa as Prainhas rumo aos restaurantes por volta das 15h. Visitar o Pontal no fim da tarde reserva tons dourados inigualáveis nas falésias e possibilita um mergulho sob céu rosa sob total calmaria acústica, coroando seu dia com o espetáculo cósmico de nascer celeste das primeiras estrelas de Arraial.`,
    seo: {
      metaTitle: "Como Ir às Prainhas do Pontal do Atalaia em Arraial do Cabo",
      metaDescription: "Quer tirar fotos clássicas na escadaria sem ninguém? Veja nosso guia de horários e rotas náuticas secretas para aproveitar as Prainhas do Atalaia."
    },
    status: "published",
    publishedAt: "2026-06-10T10:15:00-03:00",
    views: 1520,
    readTime: 4
  }
];

export const INITIAL_LEADS = [
  {
    id: "lead-maria-santos",
    name: "Maria Santos",
    phone: "21999999999",
    email: "maria.santos@gmail.com",
    experienceInterest: ["passeio-barco-premium", "sunset-pontal-cultural"],
    preferredDate: "2026-07-25",
    groupSize: 3,
    origin: "formulario" as const,
    status: "novo" as const,
    notes: ["Cliente vindo do Rio de Janeiro. Gosta de espumante doce."],
    createdAt: "2026-06-20T10:15:00-03:00",
    updatedAt: "2026-06-20T10:15:00-03:00"
  },
  {
    id: "lead-carlos-lima",
    name: "Carlos Lima",
    phone: "11988888888",
    email: "carlos.lima@hotmail.com",
    experienceInterest: ["buggy-massambaba"],
    preferredDate: "2026-07-26",
    groupSize: 4,
    origin: "whatsapp" as const,
    status: "atendendo" as const,
    notes: ["Está hospedado na Pousada do Sol. Quer roteiro de muita aventura."],
    createdAt: "2026-06-19T14:32:00-03:00",
    updatedAt: "2026-06-19T15:00:00-03:00"
  }
];

export const INITIAL_SETTINGS: GlobalSettings = {
  whatsappNumber: "552299887766",
  whatsappGreeting: "Olá! Peguei seu número no site da Guida Trips. Gostaria de entender mais sobre as experiências e roteiros curados que vocês oferecem.",
  businessHours: "Segunda a Domingo: 08h00 às 20h00",
  googleAnalyticsId: "G-GUIDATRIPS2026",
  metaPixelId: "PX-GUIDATRIPS2026",
  socialLinks: {
    instagram: "https://instagram.com/guidatrips",
    youtube: "https://youtube.com/@guidatrips",
    tiktok: "https://tiktok.com/@guidatrips",
    whatsapp: "https://wa.me/552299887766"
  },
  diferencialTitle: "Arraial merece ser vivido, não apenas visitado.",
  diferencialDescription: "Conectamos você ao melhor da Região dos Lagos através de experiências customizadas, hospitalidade de nativos e sorrisos reais que viram lembranças douradas de felicidade.",

  // Default Home Page configurations
  homeFilosofiaTag: "01 / FILOSOFIA DE EXPERIÊNCIA",
  homeFilosofiaTitle: "A felicidade não está na pressa. Está no afeto.",
  homeFilosofiaDesc: "As agências tradicionais empilham dezenas de turistas em barcos barulhentos para paradas rápidas e frias. A Guida Trips preza pelo valor do seu tempo. Desenhagemos cada trajeto para ser uma sutil partilha de sentimentos, risos e sossego real.",
  homeFilosofiaPillars: [
    {
      id: "brinde",
      title: "Catering Gourmet a Bordo",
      desc: "Nossos barcos privativos contam com espumante gelado, tábua de queijos artesanais e frutas selecionadas para brindar os momentos dourados de felicidade.",
      badge: "🥂 CELEBRAÇÃO"
    },
    {
      id: "direcao",
      title: "Direção de Fotografia",
      desc: "Nossa equipe domina as marés, as melhores horas de luz e os ângulos secretos. Você foca em sorrir e sentir; nós eternizamos cada fração de segundo.",
      badge: "📸 RENDERIZAR AFETO"
    },
    {
      id: "concierge",
      title: "Concierge Individualizado",
      desc: "Decoramos suas preferências com antecedência: restrições de alimentação, mimos favoritos das crianças e assessoria fina para surpresas românticas ou aniversários.",
      badge: "✨ CARINHO HUMANO"
    },
    {
      id: "exclusividade",
      title: "Sossego Sem Aglomerações",
      desc: "Rotas táticas e saídas antecipadas programadas milimetricamente para aportar nas praias antes dos grandes barcos de massa barulhentos.",
      badge: "🤫 PRIVACIDADE"
    }
  ],
  homeFilosofiaVideoTitle: "ASSISTA O DOCUMENTÁRIO",
  homeFilosofiaVideoSub: "Sinta o clima real de nossos passeios (3 min)",

  homeCompassTag: "02 / COMPASS MAP",
  homeCompassTitle: "Descubra Arraial de todos os ângulos",
  homeCompassDesc: "Clique em nossas gavetas de curadoria para desbravar o cabo de acordo com a sua preferência pessoal.",
  homeCategories: [
    { id: "praias", label: "PRAIAS", count: "8 praias" },
    { id: "gastronomia", label: "GASTRONOMIA", count: "12 locais" },
    { id: "experiencias", label: "PASSEIOS", count: "6 aventuras" },
    { id: "hospedagens", label: "HOSPEDAGENS", count: "3 parceiras" },
    { id: "noite", label: "VIDA NOTURNA", count: "5 luas e bares" },
    { id: "trilhas", label: "TRILHAS", count: "4 segredos" },
    { id: "mergulho", label: "MERGULHO", count: "Capital Nacional" },
    { id: "sobre", label: "CULTURA LOCAL", count: "Nativismo puro" }
  ],

  homeBannerTag: "📍 PONTO RETRO-ACLAMADO",
  homeBannerTitle: "Mergulhe no silêncio da Praia do Forno.",
  homeBannerDesc: "Abraçada por mata virgem e penhascos de pedra, as águas esmeraldas dão abrigo natural a tartarugas gigantes e corais ornamentais. Nossos barcos aportam na orla silenciosamente para que você nade em pura sintonia.",
  homeBannerBtnText: "Ler Guia de Praias",
  homeBannerImgUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",

  homeMimosTag: "04 / Detalhes Que Tornam Único",
  homeMimosTitle: "Os mimos que você só encontra aqui.",
  homeMimosDesc: "Não fazemos turismo padrão de massa. Fornecemos encontros customizados regados a carinho e mimos artesanais.",
  homeMimosTabs: [
    {
      key: "sabores",
      label: "Sabores do Afeto",
      badge: "🍽️ COMPOSIÇÃO ARTESANAL",
      title: "Sabores Que Unem E Celebram",
      text: "A nossa gastronomia abraça o seu paladar com frescor incomparável. Desfrute de espumantes selecionados de vinícolas de selo premiado, tábuas de frios rústicas, ceviche preparado na hora e deliciosos mimos regionais servidos sob a brisa morna do oceano.",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
    },
    {
      key: "lounges",
      label: "Lounges Exclusivos",
      badge: "✨ INSTALAÇÃO PRIVADA",
      title: "Piqueniques Sob a Luz Dourada",
      text: "Montamos lounges boutique com tapetes rústicos, almofadas macias e iluminação minimalista quente diretamente em mirantes ou praias reservadas. Uma experiência mágica de cinema para conversar, provar iguarias e desfrutar da melhor hora do pôr do sol com quem você mais ama.",
      img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
    },
    {
      key: "noite",
      label: "Luau Sob As Estrelas",
      badge: "🌙 ENCONTROS NO DECK",
      title: "Luau Intimista & Noite sob Velas",
      text: "Ao entardecer, as estrelas tomam conta do cabo. Projetamos jantares privativos aconchegantes sob velas aromáticas flutuantes nas areias, harmonizados com vinhos finos de selo orgânico e o som rítmico das ondas quebrando suavemente na orla.",
      img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
    },
    {
      key: "nativismo",
      label: "Acolhimento Amigo",
      badge: "🤝 CONEXÃO VERDADEIRA",
      title: "A Hospitalidade de Pura Alma",
      text: "Liderados por Guida, nossa equipe é composta por moradores apaixonados que respiram o destino. Nosso diferencial é a conexão humana verdadeira: recebemos você com sorrisos sinceros de braços abertos, contando causos divertidos de pescadores, lendas marítimas e segredos fascinantes.",
      img: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80"
    }
  ],

  homeLogisticaTag: "05 / GUIA DE LOGÍSTICA COMPLETA",
  homeLogisticaTitle: "Planeje sem imprevistos.",
  homeLogisticaDesc: "Reunimos as coordenadas mais estratégicas de quem é nascido e criado no mar de Arraial. Entenda as marés, distâncias e como tirar 100% proveito de suas memórias douradas.",
  homeLogisticaPoints: [
    {
      title: "Como Chegar em Conforto",
      desc: "Arraial fica a 165km do Rio. Oferecemos opções sob medida de transfer executivo corporativo porta-a-porta partindo dos aeroportos rústicos da capital diretamente para a sua pousada curada."
    },
    {
      title: "A Melhor Época de Ventos",
      desc: "O sol brilha o ano todo. Para águas com nitidez mística extrema de reflexos azulados, indicamos os meses de Março a Junho, onde a calmaria de ventos sintoniza mar cristalino."
    },
    {
      title: "O Que Trazer na Mochila",
      desc: "Traga bonés leves, protetor solar mineral (pelo zelo ecológico da fauna de restinga) e claro: óculos de mergulho para fitar cavalos-marinhos e siris coloridos."
    }
  ],

  homeFeedbackTag: "07 / LAZER & CONEXÕES DE ALMA",
  homeFeedbackTitle: "Histórias que nos inspiram.",
  homeFeedbackDesc: "Não vendemos apenas passeios. Criamos lembranças afetivas duradouras que dão cor aos sorrisos mais sinceros do mundo.",
  homeFeedbackList: [
    {
      name: "Daniela Pinheiro & Noivo",
      city: "Rio de Janeiro - RJ",
      quote: "Eu queria um pedido de casamento surpresa perfeito nas dunas e a equipe da Guida estruturou TUDO. Montaram um lounge maravilhoso com velas, queijos e champanhe maravilhoso no Pontal e até contrataram fotógrafo para se disfarçar de turista! Sensacional!",
      role: "Momentos Especiais",
      avatar: "D"
    },
    {
      name: "Ricardo e Cláudia Lemos",
      city: "Campinas - SP",
      quote: "Viajamos com as crianças de 5 e 8 anos. O barco é limpíssimo, o colete das crianças coube perfeitamente e os marinheiros prepararam cortes de melancia bem gelada que as crianças devoraram após o mergulho. Foi o dia mais feliz de nossas férias!",
      role: "Fórmula de Família",
      avatar: "R"
    },
    {
      name: "Letícia Amaral",
      city: "Brasília - DF",
      quote: "Atendimento caloroso incrível. Não somos tratadas como meros bilhetes de turismo. Guida nos pegou na porta da pousada, nos deu dicas preciosas sobre horários e nos levou para jantar lulas na brasa. Esse afeto é o verdadeiro ouro!",
      role: "Aventura Curada",
      avatar: "L"
    }
  ],

  homeGuideTag: "📖 DOWNLOAD GRATUITO",
  homeGuideTitle: "Guia Digital Secreto de Arraial do Cabo",
  homeGuideDesc: "Preparamos um guia interativo com praias secretas, melhores marés de recifes, contatos de nativos para peixes frescos e o melhor roteiro desimpedido para as suas férias.",
  homeGuideBtnText: "Receber Guia no E-mail"
};
