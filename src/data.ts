/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experience, ExperienceCategory, BlogPost, GlobalSettings, Destination, Accommodation } from "./types";

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: "arraial-do-cabo",
    name: "Arraial do Cabo",
    slug: "arraial-do-cabo",
    description: "O Caribe Brasileiro.",
    shortDescription: "O Caribe Brasileiro.",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    status: "active",
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "buzios",
    name: "Búzios",
    slug: "buzios",
    description: "A charmosa península.",
    shortDescription: "A charmosa península.",
    heroImage: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?auto=format&fit=crop&w=600&q=80",
    status: "inactive",
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "cabo-frio",
    name: "Cabo Frio",
    slug: "cabo-frio",
    description: "Areias brancas e águas cristalinas.",
    shortDescription: "Praias deslumbrantes.",
    heroImage: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
    status: "inactive",
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "angra-dos-reis",
    name: "Angra dos Reis",
    slug: "angra-dos-reis",
    description: "365 ilhas para explorar.",
    shortDescription: "Ilhas paradisíacas.",
    heroImage: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80",
    status: "inactive",
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  }
];

export const INITIAL_ACCOMMODATIONS: Accommodation[] = [
  {
    id: "pousada-timoneiro",
    name: "Pousada do Timoneiro",
    slug: "pousada-timoneiro",
    category: "pousada",
    typeTag: "boutique",
    destinationId: "arraial-do-cabo",
    partnerId: "timoneiro",
    description: "Uma referência clássica de hospitalidade e elegância em Arraial. Famosa pela farta mesa de café da manhã colonial e o acolhimento caloroso da equipe de forma tátil.",
    amenities: ["Piscina climatizada", "Café da manhã artesanal", "Wi-Fi Fibra", "Estacionamento", "Ar-condicionado Split", "Espaço Zen"],
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"],
    location: "Praia Grande, Arraial do Cabo",
    address: "Rua das Flores, 123",
    netRate: 300,
    sellRate: 380,
    markup: 26,
    commission: 80,
    status: "active",
    tag: "CONFORTO & TRADIÇÃO",
    rating: 4.9,
    reviews: 184,
    highlight: "Próxima ao maior calçadão do pôr do sol na beira da Praia Grande.",
    whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios exclusivos para a Pousada do Timoneiro.",
    priceDisplay: "A partir de R$ 380 / noite",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pousada-caminho-mar",
    name: "Pousada Caminho do Mar",
    slug: "pousada-caminho-mar",
    category: "pousada",
    typeTag: "pe-na-areia",
    destinationId: "arraial-do-cabo",
    partnerId: "caminho-mar",
    description: "A poucos passos da Praia dos Anjos, é o refúgio perfeito para quem deseja dormir ao som suave da ressurgência marinha e ter acesso imediato às melhores expedições de barco e mergulho.",
    amenities: ["Café da manhã regional", "Estacionamento privativo", "Wi-Fi ultraveloz", "Ar-condicionado", "Ducha de alta pressão", "Serviço de praia"],
    photos: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"],
    location: "Praia dos Anjos, Arraial do Cabo",
    address: "Rua do Porto, 456",
    netRate: 250,
    sellRate: 320,
    markup: 28,
    commission: 70,
    status: "active",
    tag: "FÁCIL ACESSO A EMBARQUES",
    rating: 4.8,
    reviews: 142,
    highlight: "O melhor ponto de partida matinal com suítes recém-renovadas.",
    whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios para a Pousada Caminho do Mar.",
    priceDisplay: "A partir de R$ 320 / noite",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "ohana-pousada",
    name: "Ohana Pousada Boutique",
    slug: "ohana-pousada",
    category: "pousada",
    typeTag: "vista",
    destinationId: "arraial-do-cabo",
    partnerId: "ohana",
    description: "Erguida nas rochas sagradas do Pontal do Atalaia. Dispõe de um deck infinito de onde se contempla o pôr do sol mais lendário do Brasil e braguilhas de baleias jubartes na temporada costeira.",
    amenities: ["Deck Panorâmico", "Café da manhã flutuante", "Jacuzzi de borda infinita", "Wi-Fi Fibra", "Frigobar Premium", "Amenities L'Occitane"],
    photos: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"],
    location: "Encosta do Pontal do Atalaia, Arraial do Cabo",
    address: "Pontal do Atalaia, s/n",
    netRate: 400,
    sellRate: 510,
    markup: 27,
    commission: 110,
    status: "active",
    tag: "RETRETE EXCLUSIVO COM VISTA",
    rating: 5.0,
    reviews: 96,
    highlight: "Deck panorâmico com jacuzzi flutuante debruçada no mar aberto.",
    whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios na Ohana Pousada Boutique.",
    priceDisplay: "A partir de R$ 510 / noite",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: "bate-volta-arraial",
    destinationId: "arraial-do-cabo",
    name: "Bate e Volta Arraial do Cabo: O Paraíso Saindo do Rio!",
    slug: "bate-volta-arraial-cabo-rio",
    category: ExperienceCategory.NAUTICO,
    shortDescription: "Saia do Rio de Janeiro e venha viver um dia inesquecível no \"Caribe Brasileiro\" com o máximo de conforto e conveniência.",
    fullDescription: `### Sobre o Passeio
Saia do Rio de Janeiro e venha viver um dia inesquecível no "Caribe Brasileiro" com o máximo de conforto e conveniência. Esqueça as preocupações com trânsito ou onde comer: nós cuidamos de tudo, do embarque ao churrasco em alto mar!

🌟 **O que está incluso na sua experiência:**
- **🚍 Transporte Premium**: Ônibus cadastrado com ar-condicionado (saídas da Zona Sul e Centro do Rio).
- **🙋🏻‍♂️ Acompanhamento VIP**: Guia credenciado durante todo o percurso.
- **🚤 O Melhor Barco de Arraial**: Embarcação de dois andares, com toboágua, Wi-Fi, 2 banheiros e flutuadores inclusos.
- **🍹 Almoço**: Churrasco Completo: Carne bovina, porco, frango, linguiça, pão de alho, arroz, farofa e vinagrete.
  - **Acompanhamento**: Fritas ou macarronese.
  - **Bebidas**: 1 caipirinha grande + 2 refrigerantes ou sucos grandes.
  - **Mimos**: 1 taça exclusiva e frutas da estação.

🏝️ **Um Roteiro de Tirar o Fôlego**
👶 **Crianças**: Até 5 anos não pagam (indo no colo).

🎒 **Dicas para o seu dia:**
- Leve protetor solar, toalha, roupa de banho e um casaco para o ar-condicionado do ônibus.
- É permitido levar lanches leves para a viagem de ônibus.
- Não esqueça: O pagamento das taxas da Marinha (R$ 15,00) e da Jardineira (R$ 20,00) deve ser feito em dinheiro no dia do passeio.

🚐 **Compromisso com sua Diversão**
Em caso de condições adversas de mar que impeçam a navegação, garantimos o Tour Terrestre Alternativo via jardineira, visitando a Praia dos Anjos, Praia do Forno e a espetacular Praia Grande. Você aproveita o paraíso de qualquer jeito!`,
    duration: "14 horas",
    capacity: 46,
    priceFrom: 250,
    included: [
      "Transporte Premium Rio-Arraial-Rio com ar-condicionado",
      "Guia de Turismo credenciado Cadastur",
      "Passeio de Barco de dois andares com toboágua e Wi-Fi",
      "Churrasco Completo a bordo (bovino, porco, frango, linguiça, acompanhamentos)",
      "1 Caipirinha grande, 2 Refrigerantes ou Sucos grandes",
      "1 Taça exclusiva e frutas da estação"
    ],
    notIncluded: [
      "Sobremesas",
      "Máscaras de mergulho (aluguel no barco se disponível – sem cilindro)",
      "Taxa da Marinha (píer): R$ 15,00 (pago em dinheiro)",
      "Taxa da jardineira (acesso): R$ 20,00 (pago em dinheiro)"
    ],
    meetingPoint: "Embarque em hotéis da Zona Sul ou pontos de encontro no Centro do Rio",
    coordinates: { lat: -22.9715, lng: -42.0224 },
    photos: [],
    status: "active",
    featured: true,
    badge: "mais-vendido",
    location: "Arraial do Cabo",
    departureCity: "Arraial do Cabo RJ",
    minAge: "2 anos",
    maxAge: "65 anos",
    schedules: ["06:00"],
    itinerary: [
      "Ilha do Farol: Uma das praias mais famosas e preservadas da região, acessível apenas de barco.",
      "As Prainhas do Pontal do Atalaia: Duas praias paradisíacas conectadas por uma faixa de areia branca.",
      "Grota Azul: Uma caverna fascinante com um espetáculo de luzes naturais.",
      "Pedra do Gorila: Um ponto icônico, onde as formações rochosas se assemelham ao perfil de um gorila.",
      "Pedra da Tartaruga: Uma formação rochosa que lembra o formato de uma tartaruga.",
      "Fenda da nossa Senhora: Uma estreita abertura nas rochas com grande valor cênico e espiritual.",
      "Praia do Forno: Uma charmosa praia com águas calmas e cristalinas, ideal para banho.",
      "Impacto do Meteorito: Um ponto de interesse geológico único.",
      "Gruta do Amor: Uma pequena caverna cheia de charme, cercada por lendas locais."
    ],
    faqs: [
      { question: "De onde sai o transporte no Rio de Janeiro?", answer: "Temos saídas diárias da Zona Sul e do Centro. Oferecemos o serviço \"porta a porta\" para a maioria dos hotéis e pontos de encontro estratégicos. Ao fazer a sua reserva, solicitamos a sua localização para indicar o ponto e horário mais próximos." },
      { question: "A que horas começa o embarque e quando voltamos?", answer: "O embarque começa a partir das 06:00h. O retorno de Arraial do Cabo acontece no final da tarde, com chegada prevista ao Rio de Janeiro por volta das 20:30h, dependendo das condições do trânsito." },
      { question: "O que está incluído no Pacote?", answer: "O nosso Pacote inclui um churrasco misto (carne, frango, porco e linguiça) com arroz, farofa, vinagrete e pão de alho. Pode escolher entre batata frita ou macarronese como acompanhamento. Além disso, inclui 1 caipirinha grande, 2 refrigerantes/sucos, fruta e uma taça personalizada." },
      { question: "Crianças pagam?", answer: "Crianças até 5 anos são isentas, desde que viajem no colo dos responsáveis no autocarro/ônibus. A partir dos 6 anos, pagam o valor integral do pacote." },
      { question: "Quais são as taxas pagas à parte?", answer: "Existem duas taxas municipais que não estão incluídas no pacote e devem ser pagas obrigatoriamente em dinheiro: Taxa da Marinha (Píer): R$ 15,00. Taxa da Jardineira (Acesso): R$ 20,00." },
      { question: "E se o mar estiver agitado e o barco não sair?", answer: "A saída do barco depende da autorização da Marinha. Caso a navegação seja proibida por questões de segurança, realizaremos um Tour Terrestre Alternativo em jardineiras, visitando a Praia dos Anjos, Praia do Forno e Praia Grande. O valor do passeio permanece o mesmo." },
      { question: "Posso levar bebidas ou cooler?", answer: "Por normas de segurança e organização da embarcação, não é permitida a entrada de bebidas alcoólicas, coolers ou caixas de som. O nosso pacote já inclui bebidas e temos serviço de bar a bordo." },
      { question: "Quanto tempo dura a viagem do Rio até Arraial?", answer: "A viagem dura em média 2h50 a 4h, podendo variar conforme o trânsito na saída do Rio ou na Ponte Rio-Niterói. Recomendamos levar um lanche leve para o trajeto de ida." },
      { question: "Como faço para garantir a minha reserva?", answer: "A reserva é confirmada mediante o pagamento de um sinal de R$ 100,00 por pessoa. O restante do valor é pago no dia do embarque. Aceitamos PIX (sem taxas) ou cartão de crédito/débito (crédito com 5% de acréscimo)." },
      { question: "Qual é a política de cancelamento ou reagendamento?", answer: "Reagendamento: Pode ser feito com até 2 dias de antecedência. Arrependimento: O cliente tem direito ao cancelamento gratuito até 7 dias após a compra (conforme o Código de Defesa do Consumidor). No-show: O não comparecimento no local e hora marcados implica a perda do sinal da reserva." },
      { question: "Dica de Ouro", answer: "Como este tour sai muito cedo, recomendamos que deixe a sua roupa de banho já por baixo da roupa leve e não esqueça o protetor solar! ☀️🏝️" }
    ],
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "experiencia-gastronomica-mar",
    destinationId: "arraial-do-cabo",
    name: "Experiência Gastronômica & Mar: Passeio de Barco Completo em Arraial do Cabo",
    slug: "experiencia-gastronomica-mar-barco-arraial",
    category: ExperienceCategory.GASTRONOMIA,
    shortDescription: "Se você não quer apenas um passeio, mas um dia de rei e rainha no Caribe Brasileiro, este é o seu pacote! Unimos o melhor do roteiro com uma experiência gastronômica.",
    fullDescription: `### Sobre o Passeio
Se você não quer apenas um passeio, mas um dia de rei e rainha no Caribe Brasileiro, este é o seu pacote! Unimos o melhor do roteiro paradisíaco de Arraial com uma experiência gastronômica completa a bordo.

✨ **O Diferencial: Churrasco e Drinks Inclusos**
Nesta modalidade, você já tem tudo garantido para curtir o mar com o pé na areia e o copo na mão:
- **🍹 Drinks & Refrescos**: 1 Caipirinha grande + 2 Refrigerantes ou sucos grandes + 1 Taça personalizada.
- **🍽️ Almoço Premium (Churrasco Misto)**: Carnes nobres (bovina, frango, porco e linguiça) preparadas na hora.
- **🥗 Acompanhamentos**: Arroz, farofa, vinagrete, pão de alho quentinho e a escolha entre batata frita ou macarronese.
- **🍎 Extra**: 1 Fruta da estação para refrescar.

🚤 **Estrutura de Lazer (Barco Toboágua)**
Diversão e conforto em cada detalhe da nossa embarcação de dois andares:
- **Toboágua**: Para mergulhar com estilo nas paradas.
- **Conectividade**: Wi-Fi liberado em alto mar.
- **Conforto**: 2 banheiros higienizados e água inclusa.
- **Cenários Instagramáveis**: Coração para fotos e fotógrafo profissional a bordo (serviço à parte).

🏝️ **Roteiro de Tirar o Fôlego**
Visitamos os pontos mais icônicos da região, com tempo para relaxar e fotografar:
- **Praia da Ilha do Farol**: Águas cristalinas e areia branquíssima (desembarque).
- **Prainhas do Pontal do Atalaia**: A famosa escadaria de Arraial (desembarque).
- **Enseada do Guriri & Praia do Forno**: Paradas estratégicas para banho com uso do toboágua.
- **Tour Panorâmico**: Gruta Azul, Pedra do Gorila, Pedra da Tartaruga, Fenda de Nossa Senhora e o Impacto do Meteorito.

📅 **Planeje sua Saída**
- **Duração**: 4 horas.
- **Check-in**: Das 10h30 às 11h30 na Praia dos Anjos.
- **Saída**: Diariamente às 12h.
- **Local de Encontro**: Rua Gonçalves Dias, nº 10 (Próximo à Praça do Cova).
- **Vantagem Extra**: Clientes do Pacote Completo têm desconto especial no Estacionamento ArraialShow (consulte disponibilidade e agende sua vaga).

⚠️ **Informações Importantes**
- **Taxa de Embarque**: R$ 15,00 (paga em dinheiro no píer).
- **Restrições**: Não é permitido o embarque com coolers ou caixas de som (temos tudo o que você precisa a bordo!).
- **Condições do Mar**: O roteiro pode sofrer alterações pela Marinha visando a segurança dos passageiros.`,
    duration: "4 horas",
    capacity: 45,
    priceFrom: 180,
    included: [
      "🍹 1 Caipirinha grande, 2 Refrigerantes ou sucos grandes e 1 Taça personalizada",
      "🍽️ Almoço Premium (Churrasco Misto) preparado na hora",
      "🥗 Arroz, farofa, vinagrete, pão de alho e batata frita ou macarronese",
      "🍎 1 Fruta da estação",
      "🚤 Embarcação de dois andares com Toboágua e Wi-Fi liberado",
      "Flutuadores e coletes salva-vidas"
    ],
    notIncluded: [
      "Fotografia",
      "Taxa de Embarque (Marinha): R$ 15,00 (pago em dinheiro)"
    ],
    meetingPoint: "Rua Gonçalves Dias, nº 10 - Praia dos Anjos (Próximo à Praça do Cova), Arraial do Cabo",
    coordinates: { lat: -22.9715, lng: -42.0224 },
    photos: [],
    status: "active",
    featured: true,
    badge: "mais-vendido",
    location: "Arraial do Cabo",
    departureCity: "Arraial do Cabo RJ",
    minAge: "2 anos",
    maxAge: "90 anos",
    schedules: ["12:00"],
    itinerary: [
      "Praia da Ilha do Farol (desembarque) 🏝️",
      "Enseada do Guriri (mergulho e toboáguas) 🤿",
      "Praia do Forno (mergulho e toboáguas) 🌊",
      "Prainhas do Pontal do Atalaia 🌅",
      "Gruta Azul 🏔️",
      "Pedra do Gorila 🦍",
      "Pedra da Tartaruga 🐢",
      "Fenda de Nossa Senhora 🙏",
      "Impacto do Meteorito ☄️"
    ],
    faqs: [
      { question: "Qual o horário e local de saída?", answer: "Nossas embarcações saem diariamente às 12h. No entanto, o check-in deve ser feito obrigatoriamente entre 10h30 e 11h30 no nosso ponto de encontro: Rua Gonçalves Dias, nº 10 – Praia dos Anjos (próximo à Praça do Cova)." },
      { question: "O que está incluso na refeição do Pacote Completo?", answer: "É um banquete completo! Você terá direito a um churrasco misto (carne bovina, frango, porco e linguiça) com arroz, farofa, vinagrete e pão de alho. Para acompanhar, você escolhe entre fritas ou macarronese. Além disso, inclui 1 caipirinha grande, 2 refrigerantes ou sucos e uma fruta." },
      { question: "O passeio para em quais praias?", answer: "Nós visitamos os principais cartões-postais de Arraial! O roteiro inclui desembarque na Ilha do Farol e nas Prainhas do Pontal do Atalaia. Também fazemos paradas para mergulho (com uso do toboágua) na Enseada do Guriri e na Praia do Forno, além de passar por pontos panorâmicos como a Gruta Azul e a Fenda de Nossa Senhora." },
      { question: "O barco oferece estrutura para crianças e idosos?", answer: "Sim! Nosso barco possui dois andares, é seguro e conta com 2 banheiros. Crianças até 5 anos e idosos acima de 60 anos são isentos da taxa do píer. Além disso, disponibilizamos \"espaguetes\" flutuantes para auxiliar no mergulho." },
      { question: "Posso levar minha própria bebida ou comida?", answer: "De acordo com as normas de segurança e organização, não é permitida a entrada de coolers, bolsas térmicas ou caixas de som. Temos um bar e serviço de cozinha completo a bordo para sua comodidade." },
      { question: "Existe algum custo extra além do pacote?", answer: "Sim, há uma taxa de embarque da Prefeitura (Píer) no valor de R$ 15,00 por pessoa, que deve ser paga obrigatoriamente em dinheiro no momento do embarque. Isentos: Crianças até 5 anos, idosos acima de 60, militares e moradores." },
      { question: "Onde posso estacionar o carro?", answer: "Temos parceria com o Estacionamento ArraialShow (procurar por Gabriel). Dica: Clientes do Pacote Completo pagam um valor reduzido no estacionamento! É necessário agendar com antecedência, pois as vagas são limitadas." },
      { question: "E se o tempo estiver ruim ou a Marinha cancelar?", answer: "A segurança vem em primeiro lugar. Caso a Marinha do Brasil proíba a navegação devido às condições do mar, o passeio poderá ser reagendado. O roteiro também pode sofrer alterações de percurso sem aviso prévim por determinação das autoridades marítimas." },
      { question: "Como funciona o cancelamento e reagendamento?", answer: "Reagendamento: Pode ser solicitado com até 2 dias de antecedência. No-show: O não comparecimento no horário do check-in resulta na perda do sinal da reserva." }
    ],
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "passeio-barco-toboagua",
    destinationId: "arraial-do-cabo",
    name: "Passeio de Barco em Arraial do Cabo (com Tobogã)",
    slug: "passeio-barco-toboagua-arraial",
    category: ExperienceCategory.NAUTICO,
    shortDescription: "O Pacote Básico oferece uma experiência completa para explorar as belezas de Arraial do Cabo com conforto e excelente custo-benefício.",
    fullDescription: `### Sobre o Passeio
O Pacote Básico oferece uma experiência completa para explorar as belezas de Arraial do Cabo com conforto e economia.

Ideal para quem busca um passeio inesquecível pelas águas cristalinas da região, o pacote inclui acesso a um barco moderno de dois andares, equipado com Wi-Fi, água mineral à vontade, e banheiros a bordo.

Durante o passeio, são servidas frutas frescas para tornar a experiência ainda mais agradável.

O roteiro contempla paradas nos principais pontos turísticos, como a Ilha do Farol, as Prainhas do Pontal do Atalaia, a Gruta Azul, a Pedra do Gorila, e outras atrações naturais deslumbrantes.

Além disso, o barco conta com um coração decorativo exclusivo para registros fotográficos perfeitos.

A taxa do píer (R$15 por pessoa) não está inclusa e deve ser paga separadamente.

Um fotógrafo estará disponível como atração opcional para eternizar os melhores momentos do passeio.

O Pacote Básico é uma excelente opção para quem deseja vivenciar o melhor de Arraial do Cabo com um ótimo custo-benefício.

Seja para relaxar, capturar momentos inesquecíveis ou aproveitar um dia repleto de conforto e exclusividade, o Pacote Premium é a opção perfeita para quem valoriza qualidade e conveniência em cada detalhe.`,
    duration: "4 horas",
    capacity: 60,
    priceFrom: 110,
    included: [
      "Passeio de barco moderno de dois andares com tobogã/toboágua",
      "Água mineral liberada a bordo",
      "Frutas da estação servidas durante o percurso",
      "Wi-Fi de alta velocidade em alto mar"
    ],
    notIncluded: [
      "Fotografia",
      "Taxa do Píer (Prefeitura): R$ 15,00 (pago em dinheiro)"
    ],
    meetingPoint: "Píer da Praia dos Anjos, Arraial do Cabo",
    coordinates: { lat: -22.9715, lng: -42.0224 },
    photos: [],
    status: "active",
    featured: false,
    badge: "novidade",
    location: "Arraial do Cabo",
    departureCity: "Arraial do Cabo RJ",
    minAge: "1 anos",
    maxAge: "90 anos",
    schedules: ["09:00", "11:30", "13:30"],
    itinerary: [
      "Ilha do Farol: Uma das praias mais famosas e preservadas da região, acessível apenas de barco.",
      "As Prainhas do Pontal do Atalaia: Duas praias paradisíacas conectadas por uma faixa de areia branca.",
      "Grota Azul: Uma caverna fascinante com um espetáculo de luzes naturais.",
      "Pedra do Gorila: Um ponto icônico, onde as formações rochosas se assemelham ao perfil de um gorila.",
      "Pedra da Tartaruga: Uma formação rochosa que lembra o formato de uma tartaruga.",
      "Fenda da nossa Senhora: Uma estreita abertura nas rochas com grande valor cênico.",
      "Praia do Forno: Uma charmosa praia com águas calmas e cristalinas.",
      "Impacto do Meteorito: Um ponto de interesse geológico único.",
      "Gruta do Amor: Uma pequena caverna cheia de charme, cercada por lendas locais."
    ],
    faqs: [],
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "passeio-lancha-cabo-frio",
    destinationId: "cabo-frio",
    name: "Passeio de Lancha em Cabo Frio RJ RIO X CABO FRIO (DAY USE)",
    slug: "passeio-lancha-cabo-frio-day-use",
    category: ExperienceCategory.NAUTICO,
    shortDescription: "Viva uma experiência inesquecível pela maior lagoa navegável do mundo, com paradas nas ilhas e pontos mais encantadores de Cabo Frio + Day Use.",
    fullDescription: `### Sobre o Passeio
Passeio de Lancha pelas Ilhas de Cabo Frio + Day Use na Pousada 🛥️🌅

Viva uma experiência inesquecível pela maior lagoa navegável do mundo, com paradas nas ilhas e pontos mais encantadores de Cabo Frio. Um passeio exclusivo, com conforto, segurança e paisagens de tirar o fôlego — perfeito para quem quer conhecer a região de um jeito único.

#### Roteiro Lagoon Experience
Durante as 4 horas de passeio, você visitará os pontos mais incríveis de Cabo Frio com máximo conforto e registros inesquecíveis.

#### Horários:
- ⏱️ **09h às 13h** — período mais calmo, com pouco movimento na água
- 🌅 **13h30 às 17h30** — passeio com pôr do sol na lagoa
Ambos com 4 horas de navegação a bordo de lancha, com máximo conforto.

#### Incluso no Passeio:
- 🥤 Água, 🍹 Suco e 🥤 Refrigerante.

#### Day Use na Pousada 😍
Após o passeio, aproveite nossa estrutura completa na pousada parceira:
- 🍽️ **Almoço Self-Service** (sem balança)
- 🚿 **Ducha exclusiva**
- 🏊 **Piscina**
Relaxe, curta o dia e finalize sua experiência com conforto absoluto!`,
    duration: "4 horas",
    capacity: 12,
    priceFrom: 290,
    included: [
      "Bebidas à vontade (Água, Suco, Refrigerante)",
      "Navegação exclusiva em lancha confortável",
      "Day Use em pousada parceira pós-passeio",
      "Almoço Self-Service liberado (sem balança) na pousada",
      "Uso de piscina e ducha exclusiva na pousada"
    ],
    notIncluded: [
      "Aluguel de Jet Ski"
    ],
    meetingPoint: "Canal de Cabo Frio / Pousada Parceira, Cabo Frio",
    coordinates: { lat: -22.8784, lng: -42.0191 },
    photos: [],
    status: "active",
    featured: true,
    badge: "mais-vendido",
    location: "Cabo Frio",
    departureCity: "Cabo Frio RJ",
    minAge: "2 anos",
    maxAge: "65 anos",
    schedules: ["09:00", "13:30"],
    itinerary: [
      "Praia do Forte 🌊: Linda vista panorâmica de uma das praias urbanas mais famosas.",
      "Ilha dos Papagaios 🦜: Parada perfeita para banho de mar e flutuação em águas límpidas.",
      "Ilha do Japonês 🏝️: O coração ecológico e raso da lagoa de Cabo Frio.",
      "Enseada da Carolina ✨: Parada charmosa com águas calmas e límpidas.",
      "Pedra da Baleia 🐋: Formação rochosa curiosa de Cabo Frio.",
      "Praia Brava 🌊: Cenário rústico e ondas exuberantes.",
      "Bairro Histórico da Passagem 🏘️: Vista do canal margeando a rica arquitetura colonial.",
      "Anjo Caído 😇: Monumento de passagem turística clássica no meio do canal.",
      "Forte São Matheus 🏰: O forte histórico que guarda a entrada do porto antigo."
    ],
    faqs: [],
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "quadriciclo-arraial",
    destinationId: "arraial-do-cabo",
    name: "Descubra Arraial do Cabo de Quadriciclo: Uma Aventura Off-Road Inesquecível!",
    slug: "passeio-quadriciclo-arraial",
    category: ExperienceCategory.OFF_ROAD,
    shortDescription: "Uma emocionante aventura de quadriciclo off-road pelos cenários mais deslumbrantes, trilhas ecológicas e pontos históricos de Arraial do Cabo.",
    fullDescription: `### Sobre o Passeio
Viva uma emocionante aventura de quadriciclo off-road pelos cenários mais deslumbrantes, trilhas ecológicas e pontos históricos de Arraial do Cabo. Uma experiência perfeita para os amantes de adrenalina e natureza!

Sinta a liberdade de pilotar seu próprio quadriciclo por rotas exclusivas que mostram as dunas, lagoas e praias deslumbrantes da península.`,
    duration: "2h30",
    capacity: 10,
    priceFrom: 180,
    included: [
      "Uso de quadriciclo moderno de alta cilindrada",
      "Guia local experiente que acompanha durante todo o trajeto",
      "Capacete e equipamentos de segurança individuais",
      "Treinamento básico antes da partida"
    ],
    notIncluded: [
      "Fotos profissionais adicionais"
    ],
    meetingPoint: "Base de quadriciclos de Arraial do Cabo",
    coordinates: { lat: -22.9642, lng: -42.0298 },
    photos: [],
    status: "active",
    featured: false,
    badge: "",
    location: "Arraial do Cabo",
    departureCity: "Arraial do Cabo RJ",
    minAge: "12 anos",
    maxAge: "65 anos",
    schedules: ["09:00", "12:00", "15:00"],
    itinerary: [
      "Pedreira: Início do passeio em um cenário deslumbrante, com formações rochosas impressionantes e vista panorâmica.",
      "Lagoa Rosada: Uma parada em um verdadeiro paraíso natural com águas de tons rosados encantadores.",
      "Trilhas das Salinas: Aventura por uma das trilhas mais icônicas, com paisagens marcantes das antigas salinas.",
      "Pórtico: Registro fotográfico clássico no ponto de boas-vindas da cidade.",
      "Trilhas do Pórtico: Caminhos cercados por vegetação exuberante de restinga e contato direto com a natureza.",
      "Caminho das Árvores: Uma trilha encantadora com árvores formando um lindo túnel natural.",
      "Trilha da Praia Grande: Trajeto panorâmico com paisagens de tirar o fôlego da icônica Praia Grande.",
      "Deserto da Praia Grande: Encerramento espetacular onde o deserto de areias brancas se funde ao oceano azul."
    ],
    faqs: [],
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "buggy-arraial-novo",
    destinationId: "arraial-do-cabo",
    name: "Descubra Arraial do Cabo de Buggy: Uma Aventura Off-Road Inesquecível!",
    slug: "passeio-buggy-arraial-novo",
    category: ExperienceCategory.OFF_ROAD,
    shortDescription: "Descubra a beleza de Arraial do Cabo com nosso exclusivo passeio de buggy! Uma aventura emocionante que combina paisagens deslumbrantes.",
    fullDescription: `### Sobre o Passeio
Descubra a beleza de Arraial do Cabo com nosso exclusivo passeio de buggy! Prepare-se para uma aventura emocionante que combina paisagens deslumbrantes, praias paradisíacas e momentos inesquecíveis.

Nosso passeio de buggy oferece paradas estratégicas em pontos icônicos de Arraial, como a Prainha, Praia do Pontal, Lagoa Vermelha e muito mais. Com duração de 2 horas e 30 minutos, você terá tempo de sobra para mergulhar nas águas cristalinas e capturar fotos incríveis, tudo com a comodidade de um guia experiente e fotos inclusas no pacote.

Escolha entre nossos horários de saída ao longo do dia e finalize a experiência com o pôr do sol espetacular, caso opte pelo último horário. Valores acessíveis para grupos de até 4 pessoas. Faça sua reserva e viva a emoção de explorar Arraial do Cabo de uma maneira única e cheia de estilo!

🌟 **Destaques da Viagem:**
- 📸 **Fotos Inclusas**
- 🗺️ **O Melhor Roteiro**
- 🎢 **Diversão Garantida!**`,
    duration: "2h30",
    capacity: 4,
    priceFrom: 160,
    included: [
      "Buggy privativo limpo e higienizado",
      "Piloto/Guia credenciado local",
      "Combustível do veículo incluso",
      "Serviço de fotografia digital com as fotos inclusas"
    ],
    notIncluded: [
      "Alimentação e bebidas"
    ],
    meetingPoint: "Embarque na pousada do cliente em Arraial do Cabo",
    coordinates: { lat: -22.9642, lng: -42.0298 },
    photos: [],
    status: "active",
    featured: true,
    badge: "mais-vendido",
    location: "Arraial do Cabo",
    departureCity: "Arraial do Cabo RJ",
    minAge: "7 anos",
    maxAge: "65 anos",
    schedules: ["09:00", "12:00", "15:00", "16:30"],
    itinerary: [
      "Prainha: Um paraíso com águas cristalinas e areia branca, ideal para um mergulho refrescante.",
      "Praia do Pontal: Uma praia tranquila e pouco explorada com um visual encantador.",
      "Curvinha: Um ponto especial com uma vista privilegiada para belos registros.",
      "Lagoa Vermelha: Famosa por sua coloração única, ótima para contemplação.",
      "Pórtico da Cidade: Parada clássica no cartão de boas-vindas da cidade.",
      "Praia Grande: Longa faixa de areia branca e mar azul intenso, ideal para curtir o pôr do sol."
    ],
    faqs: [],
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
  },
  {
    id: "mergulho-batismo-novo",
    destinationId: "arraial-do-cabo",
    name: "Mergulho de Batismo em Arraial do Cabo",
    slug: "mergulho-batismo-arraial-novo",
    category: ExperienceCategory.NAUTICO,
    shortDescription: "Prepare-se para uma experiência inesquecível! Descubra o paraíso submerso de Arraial do Cabo em um mergulho guiado com total segurança.",
    fullDescription: `### Sobre o Passeio
Prepare-se para uma experiência inesquecível! Nosso Mergulho de Batismo é a oportunidade perfeita para explorar as incríveis belezas subaquáticas de Arraial do Cabo, mesmo sem experiência prévia. Guiado por um instrutor profissional, você mergulhará em águas cristalinas, conhecendo a rica vida marinha da região com total segurança e conforto.

Com duração de 30 minutos submerso e profundidade de até 10 metros, o passeio inclui todos os equipamentos necessários, como máscara, cilindro, colete equilibrador, roupa de neoprene e nadadeiras. Para tornar o momento ainda mais especial, oferecemos serviços opcionais de fotografia e vídeo subaquáticos, capturando cada detalhe da sua aventura.

A embarcação é espaçosa e confortável, com dois andares — um convés principal e um deck panorâmico — garantindo uma experiência relaxante antes e depois do mergulho. Além disso, o embarque é direto no píer principal da cidade, evitando filas e garantindo sua comodidade.

Descubra o paraíso submerso com o suporte da renomada operadora AquaWorld e leve para casa memórias incríveis desse passeio único. Reserve agora e viva a magia de Arraial do Cabo de um jeito que você nunca imaginou!`,
    duration: "3 horas",
    capacity: 12,
    priceFrom: 290,
    included: [
      "Equipamento de mergulho completo (máscara, cilindro, colete, neoprene, nadadeiras)",
      "Instrução profissional individual por instrutor credenciado",
      "Duração de 30 minutos submerso (até 10 metros de profundidade)",
      "Embarcação ampla com deck de dois andares"
    ],
    notIncluded: [
      "Serviços de foto e vídeo subaquáticos opcionais"
    ],
    meetingPoint: "Píer principal de Arraial do Cabo, Praia dos Anjos",
    coordinates: { lat: -22.9720, lng: -42.0250 },
    photos: [],
    status: "active",
    featured: false,
    badge: "",
    location: "Arraial do Cabo",
    departureCity: "Arraial do Cabo RJ",
    minAge: "10 anos",
    maxAge: "65 anos",
    schedules: ["08:00", "11:00", "14:00"],
    itinerary: [
      "Instrução Inicial: Aula rápida sobre os sinais básicos, respiração e funcionamento do equipamento.",
      "Navegação até o Ponto: Passeio confortável de barco até o local ideal de mergulho selecionado no dia.",
      "Adaptação na Água: Respiração e flutuação inicial assistida pelo instrutor na superfície.",
      "Mergulho de Batismo (30 min): Descida lenta e assistida até no máximo 10 metros para fitar cardumes, tartarugas e corais."
    ],
    faqs: [],
    createdAt: "2026-06-25T12:00:00-03:00",
    updatedAt: "2026-06-25T12:00:00-03:00"
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
