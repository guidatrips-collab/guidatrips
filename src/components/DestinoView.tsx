/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  MapPin, Info, Compass, HelpCircle, Heart, Star, Sparkles, 
  ArrowRight, Phone, Calendar, Clock, BookOpen, Coffee, Wifi, Shield
} from "lucide-react";
import { motion } from "motion/react";
import { Destination, Experience, Accommodation, BlogPost } from "../types";

interface DestinoViewProps {
  destinationSlug?: string | null;
  destinations: Destination[];
  experiences: Experience[];
  accommodations: Accommodation[];
  posts: BlogPost[];
  onNavigate: (view: string) => void;
  onSelectExperience?: (slug: string) => void;
  onSelectAccommodation?: (slug: string) => void;
  onSelectDestination?: (slug: string | null) => void;
  onSelectPost?: (slug: string) => void;
  onChangeHotelId?: (id: string | null) => void;
  onUpdateSelectedDestinationId?: (id: string | null) => void;
}

// Tailored localized landmarks and tips for each destination hub
const DESTINATION_LANDMARKS: Record<string, {
  ecoTitle: string;
  ecoSubtitle: string;
  ecoParagraph1: string;
  ecoParagraph2: string;
  ecoImage: string;
  places: Array<{ id: string; name: string; category: string; phrase: string; img: string; highlight: string }>;
  infoTips: Array<{ title: string; desc: string }>;
}> = {
  "arraial-do-cabo": {
    ecoTitle: "FENÔMENO ÚNICO DA RESSURGÊNCIA",
    ecoSubtitle: "O mistério científico por trás da transparência caribenha das nossas águas.",
    ecoParagraph1: "Arraial do Cabo reside em um ponto geográfico muito particular na América do Sul. Correntes ricas em oxigênio e micro-organismos que viajam de forma profunda na Antártica colidem com nossa encosta e se elevam ao sol.",
    ecoParagraph2: "Esse abraço ecológico atua purificando constantemente a água, gerando matizes de azul exuberantes e sustentando populações gigantes de tartarugas, golfinhos e as majestosas baleias-jubarte.",
    ecoImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    places: [
      {
        id: "atalaia",
        name: "Pontal do Atalaia",
        category: "Encostas & Pôr do Sol",
        phrase: "A famosa escadaria de madeira que se descortina revela as areias incandescentes e um mar que se perde no horizonte azul. É o mirante definitivo de celebração do fim de tarde.",
        img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
        highlight: "Melhor momento: Cedo pela manhã ou ao entardecer"
      },
      {
        id: "farol",
        name: "Ilha do Farol",
        category: "Joia de Proteção Ambiental",
        phrase: "Protegida rigorosamente pela Marinha do Brasil, possui regras estritas de visitação. Suas águas puras e areia ultrafina branca a colocam entre as praias mais perfeitas do mundo.",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        highlight: "Acesso controlado: Apenas por embarcações credenciadas"
      },
      {
        id: "azul",
        name: "Gruta Azul",
        category: "Formação Geológica Única",
        phrase: "Uma belíssima fenda milenar aberta nos paredões rochosos externos da península. Sob a luz dourada do sol d'água, as paredes pedregosas reluzem em incríveis tons de azul safira.",
        img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
        highlight: "Observação náutica: Aproximação de barco segura"
      },
      {
        id: "prainhas",
        name: "Prainhas do Pontal",
        category: "Piscinas Naturais Calmas",
        phrase: "Com águas extremamente calmas, transparentes e abrigadas do vento leste, é perfeita para quem busca nadar livremente de máscara de mergulho para observar a fauna costeira e tartarugas gaivotas.",
        img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        highlight: "Dica: Ideal para famílias e banho sossegado"
      }
    ],
    infoTips: [
      {
        title: "O Fenômeno da Ressurgência",
        desc: "Arraial do Cabo é famosa internacionalmente por possuir um fenômeno oceanográfico único no Brasil. Correntes de águas profundas e polares sobem à superfície bem em nossa península. Elas trazem nutrientes extraordinários que purificam as águas, gerando a incrível transparência azul-turquesa e uma biodiversidade marinha inigualável."
      },
      {
        title: "Preservação em Primeiro Lugar",
        desc: "Por ser uma Reserva Extrativista Marinha (RESEX), Arraial possui normas rígidas de conduta. Nós da Guida Trips operamos em absoluta sintonia com o ICMBio e a Marinha do Brasil. Não jogue lixo, evite alimentar os peixes selvagens e siga sempre as trilhas certificadas para manter esse paraíso intocado."
      },
      {
        title: "Previsibilidade do Vento",
        desc: "O vento leste é o motor da região, moldando a paisagem das dunas e limpando a atmosfera. Nossa equipe estuda diariamente o padrão dessas rajadas para adaptar o itinerário dos passeios. Se o vento do leste está forte no mar aberto, navegamos para as enseadas calmas do lado oeste, garantindo conforto e segurança."
      }
    ]
  },
  "buzios": {
    ecoTitle: "ESTILO & HISTÓRIA LOCAL",
    ecoSubtitle: "Como uma bucólica vila de pescadores se tornou a península mais charmosa do Brasil.",
    ecoParagraph1: "Consagrada nos anos 60 pela estrela francesa Brigitte Bardot, Búzios une perfeitamente a simplicidade caiçara ao charme cosmopolita europeu. Suas ruas com paralelepípedos centenários abrigam galerias de arte, alta gastronomia e ateliês de moda.",
    ecoParagraph2: "A península possui mais de 20 praias distintas, cada uma com sua personalidade: desde as ondas badaladas de Geribá até as águas calmas e límpidas de Ferradurinha e João Fernandes. É o retiro perfeito de sofisticação e belezas naturais.",
    ecoImage: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=600&q=80",
    places: [
      {
        id: "orlabardot",
        name: "Orla Bardot & Rua das Pedras",
        category: "Charme Histórico & Vida Noturna",
        phrase: "O calçadão à beira-mar adornado por barcos coloridos e esculturas de bronze icônicas. Conecta a calmaria do pôr do sol ao vibrante burburinho de bistrôs e lojas sofisticadas.",
        img: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80",
        highlight: "Melhor momento: No fim da tarde para caminhar sem pressa"
      },
      {
        id: "ferradurinha",
        name: "Praia de Ferradurinha",
        category: "Enseada de Águas Calmas",
        phrase: "Uma das praias mais encantadoras de Búzios. Uma pequena ferradura de areias claras protegida por paredões de pedra gigantes, criando uma piscina de água verde-esmeralda totalmente sem ondas.",
        img: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=800&q=80",
        highlight: "Atividade: Aluguel de caiaque e stand-up paddle"
      },
      {
        id: "geriba",
        name: "Praia de Geribá",
        category: "Badalação & Surf",
        phrase: "Com uma extensa faixa de areia dourada e ondas propícias para esportes náuticos, é o ponto de encontro de jovens, famílias e amantes do surf. Ideal para longas caminhadas na areia macia.",
        img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
        highlight: "Clima: Ótimos quiosques pé na areia"
      },
      {
        id: "joaofernandes",
        name: "Praia de João Fernandes",
        category: "Águas Cristalinas & Snorkeling",
        phrase: "Frequentada por turistas internacionais, oferece águas incrivelmente mansas e transparentes, ideais para o snorkeling ao lado de costões rochosos ricos em peixes coloridos e corais nativos.",
        img: "https://images.unsplash.com/photo-1520116468888-953a79ff95d4?auto=format&fit=crop&w=800&q=80",
        highlight: "Dica: Experimente os petiscos de frutos do mar"
      }
    ],
    infoTips: [
      {
        title: "A Origem da Fama",
        desc: "Búzios era uma pacata colônia de pescadores até 1964, quando a estrela do cinema francês Brigitte Bardot se hospedou na vila para fugir dos paparazzi. A sua paixão declarada pela beleza intocada da península colocou a região de vez no mapa do turismo internacional de luxo."
      },
      {
        title: "Culinária Internacional",
        desc: "A gastronomia buziana é uma das mais prestigiadas do estado. Graças aos imigrantes franceses, italianos e argentinos que se apaixonaram pelo lugar, a Rua das Pedras abriga dezenas de restaurantes renomados que fundem ingredientes caiçaras com técnicas europeias."
      },
      {
        title: "Microclima de Búzios",
        desc: "Devido aos ventos fortes constantes e sua posição peninsular, Búzios desfruta de um microclima excelente. Chove cerca de 3 vezes menos do que na capital do estado, e as nuvens de chuva costumam ser empurradas rapidamente, garantindo dias ensolarados memoráveis."
      }
    ]
  },
  "cabo-frio": {
    ecoTitle: "HISTÓRIA & PRAIAS MONUMENTAIS",
    ecoSubtitle: "A maior e mais histórica metrópole da Região dos Lagos fluminense.",
    ecoParagraph1: "Cabo Frio é a sétima cidade mais antiga do Brasil, rica em monumentos coloniais, casarios do século XVII e dunas de areia alva ultrafina e rica em quartzo puro. Seu mar é calmo e incrivelmente refrescante, com águas límpidas de tom turquesa fascinante.",
    ecoParagraph2: "A cidade preserva o Bairro da Passagem, um tesouro arquitetônico de ruelas de pedra, casarões caiçaras restaurados e o imponente Forte São Mateus, que protege a entrada do canal há mais de 400 anos.",
    ecoImage: "https://images.unsplash.com/photo-1589979482837-e74f2e145060?auto=format&fit=crop&w=600&q=80",
    places: [
      {
        id: "praiadoforte",
        name: "Praia do Forte",
        category: "Areia de Quartzo & Mar Azul",
        phrase: "Uma das praias mais imponentes do país. Seus 7 km de extensão contam com areia tão branca e fina que parece talco. Suas águas puras e frias são ideais para renovar as energias.",
        img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
        highlight: "Atrativo: No canto esquerdo fica o Forte colonial"
      },
      {
        id: "bairropassagem",
        name: "Bairro da Passagem",
        category: "Patrimônio Histórico Colonial",
        phrase: "O marco de fundação da cidade. Caminhar por suas ruelas de pedras irregulares, ladeadas por casarões coloniais com janelas e portas coloridas de época, é uma verdadeira viagem no tempo.",
        img: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?auto=format&fit=crop&w=800&q=80",
        highlight: "Bônus: Polo gastronômico intimista ao anoitecer"
      },
      {
        id: "ilhajapones",
        name: "Ilha do Japonês",
        category: "Canal de Águas Rasas",
        phrase: "Uma pequena ilha cercada por águas rasas, mornas e totalmente calmas no canal de Itajuru. O local é perfeito para passar o dia relaxando e observando garças marinhas pescando ao sol.",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        highlight: "Dica: Atravesse a pé na maré baixa ou de barquinho"
      },
      {
        id: "fortesaomateus",
        name: "Forte São Mateus",
        category: "Fortificação Militar do Século XVII",
        phrase: "Construído em 1616 por portugueses e índios tamoios no topo de um rochedo. Preserva canhões de bronze originais voltados para o mar e proporciona uma vista panorâmica completa da orla marítima.",
        img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
        highlight: "Acesso: Aberto para visitação gratuita diária"
      }
    ],
    infoTips: [
      {
        title: "História e Fundação",
        desc: "Fundada em 1615, Cabo Frio foi alvo constante de piratas ingleses e franceses que tentavam contrabandear pau-brasil. A imponente estrutura de pedra do Forte São Mateus e as fortificações foram vitais para consolidar a soberania luso-brasileira na Região dos Lagos."
      },
      {
        title: "Quartzo Único do Mundo",
        desc: "As areias de Cabo Frio possuem uma concentração raríssima de quartzo puro em sua composição mineralógica. Isso significa que a areia não retém calor, permanecendo confortavelmente fresca sob os pés mesmo nos dias mais quentes de verão tropical."
      },
      {
        title: "A Lagoa de Araruama",
        desc: "Cabo Frio faz limite com a maior laguna hiper-salina em estado permanente do mundo. Esse berçário ecológico possui níveis de salinidade muito elevados, o que facilita a flutuabilidade e serve de habitat para centenas de espécies de aves migratórias e peixes nobres."
      }
    ]
  },
  "rio-de-janeiro": {
    ecoTitle: "A CIDADE MARAVILHOSA",
    ecoSubtitle: "Onde a floresta tropical abraça o mar sob o olhar do Redentor.",
    ecoParagraph1: "O Rio de Janeiro é mundialmente aclamado por seu cenário dramático que funde montanhas de granito abruptas, mata atlântica verdejante e praias de fama internacional. É a capital cultural de alma calorosa, berço da Bossa Nova.",
    ecoParagraph2: "Além das areias de Copacabana e Ipanema, o Rio abriga monumentos eternos como o Cristo Redentor e o Pão de Açúcar, integrados de forma poética a uma metrópole cosmopolita vibrante, cheia de museus e parques.",
    ecoImage: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=600&q=80",
    places: [
      {
        id: "cristoredentor",
        name: "Cristo Redentor & Corcovado",
        category: "Monumento & Maravilha do Mundo",
        phrase: "De braços abertos sobre a Baía de Guanabara, a monumental estátua Art Déco de 38 metros coroa o morro do Corcovado. A subida de trenzinho pela Floresta da Tijuca é uma experiência à parte.",
        img: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80",
        highlight: "Ícone: Eleito uma das Sete Novas Maravilhas do Mundo"
      },
      {
        id: "paodeacucar",
        name: "Pão de Açúcar & Bondinho",
        category: "Mirante & Teleférico Histórico",
        phrase: "Dois morros interligados por um dos teleféricos mais antigos do planeta. Proporciona uma visão panorâmica arrebatadora de 360 graus que capta as curvas perfeitas das praias e enseadas.",
        img: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80",
        highlight: "Dica: Perfeito para assistir ao pôr do sol dourado"
      },
      {
        id: "copacabana",
        name: "Praia de Copacabana & Calçadão",
        category: "Praia Urbana Lendária",
        phrase: "O famoso desenho sinuoso em pedras portuguesas pretas e brancas de Burle Marx emoldura a praia de areia fofa. Um local vibrante que respira esportes, música e cultura carioca genuína.",
        img: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
        highlight: "Visual: Emoldurado pelo histórico Copacabana Palace"
      },
      {
        id: "parquelage",
        name: "Parque Lage & Floresta",
        category: "Refúgio Histórico & Arquitetura",
        phrase: "Um casarão em estilo palacete europeu do início do século XX aninhado aos pés do Corcovado. Seu pátio interno com piscina central e bistrô é cercado por cavernas de pedra e floresta exuberante.",
        img: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80",
        highlight: "Dica: Ótimo local para brunch de fim de semana"
      }
    ],
    infoTips: [
      {
        title: "Patrimônio Cultural",
        desc: "O Rio de Janeiro foi a primeira área urbana do mundo a receber o título de Patrimônio Mundial como Paisagem Cultural da UNESCO. Essa honra reconhece a forma espetacular como a cidade cresceu entre barreiras naturais monumentais."
      },
      {
        title: "A Maior Floresta Urbana",
        desc: "A Floresta da Tijuca, que corta o coração do Rio, é a maior floresta urbana replantada pelo homem no mundo. Ela foi totalmente reflorestada no século XIX para recuperar mananciais de água, restaurando a flora e fauna originais de Mata Atlântica."
      },
      {
        title: "Logística Conectada Guida",
        desc: "Muitos de nossos clientes chegam pelos aeroportos do Rio de Janeiro. Criamos um serviço premium de transfer executivo privativo com motorista homologado, conectando diretamente seus voos de chegada ao conforto de sua pousada parceira em Arraial do Cabo ou Búzios."
      }
    ]
  },
  "angra-dos-reis": {
    ecoTitle: "BAÍA DE ILHA GRANDE",
    ecoSubtitle: "Um santuário ecológico de 365 ilhas de águas calmas e esmeraldas.",
    ecoParagraph1: "Angra dos Reis reside em uma gigantesca baía protegida de mar aberto, formando um espelho d'água cor esmeralda ideal para a navegação de iates e veleiros. O local possui uma ilha para cada dia do ano.",
    ecoParagraph2: "O destaque absoluto é a histórica e selvagem Ilha Grande, uma reserva florestal gigante sem carros, repleta de trilhas de mata atlântica nativa, praias intocadas como Lopes Mendes e lagoas repletas de peixes ornamentais.",
    ecoImage: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80",
    places: [
      {
        id: "lagoaazul",
        name: "Lagoa Azul (Ilha Grande)",
        category: "Piscina de Corais & Snorkeling",
        phrase: "Uma piscina natural espetacular espremida entre pequenas ilhas de rocha e mata nativa. Águas verdes cristalinas onde cardumes de sargentinhos coloridos nadam calmamente entre os visitantes.",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        highlight: "Mergulho: Cardumes dóceis de peixes tropicais"
      },
      {
        id: "praiadodentista",
        name: "Praia do Dentista (Ilha de Gipóia)",
        category: "Areia Branca & Mar de Almirante",
        phrase: "Uma das praias de maior prestígio em Angra. Suas areias branquíssimas e águas de um azul translúcido hipnotizante atraem embarcações de alto luxo que se ancoram para desfrutar da calmaria.",
        img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
        highlight: "Visual: Cercada por morros de mata virgem densa"
      },
      {
        id: "ilhacataguases",
        name: "Ilha de Cataguases",
        category: "Praia de Bolso Paradisíaca",
        phrase: "Uma pequena ilhota de areia claríssima e coqueiros rústicos, cercada por águas rasas que variam entre o verde e o azul turquesa. Parece uma pintura caribenha a poucos metros do continente.",
        img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        highlight: "Melhor horário: Cedo pela manhã para fotos isoladas"
      },
      {
        id: "lopesmendes",
        name: "Praia de Lopes Mendes",
        category: "Praia Selvagem de Surf",
        phrase: "Considerada uma das praias mais bonitas do mundo. Seus 3 km de areia tão fina que estala sob os pés abrigam um mar de ondas perfeitas e águas cristalinas, acessível apenas por trilha ou barco de passeio.",
        img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        highlight: "Visual: Sombra natural sob as árvores de amendoeira"
      }
    ],
    infoTips: [
      {
        title: "365 Ilhas",
        desc: "Angra dos Reis possui a maior concentração de ilhas costeiras do Brasil. O folclore local brinca que a baía abriga uma ilha para cada dia do ano. Na verdade, são 365 acidentes geográficos insulares mapeados e ideais para cruzeiros privativos."
      },
      {
        title: "Ilha Grande e História",
        desc: "A Ilha Grande preserva uma rica história. Já foi abrigo de piratas europeus, colônia de leprosos isolados e abrigou o célebre presídio de segurança máxima Cândido Mendes. Seu isolamento forçado preservou 90% da Mata Atlântica original intocada."
      },
      {
        title: "Mergulho de Naufrágios",
        desc: "Devido ao intenso tráfego marítimo comercial durante o Brasil Império e a colonização, a Baía de Angra abriga mais de 50 naufrágios catalogados de galeões espanhóis, vapores de carga e navios de guerra, sendo um eldorado do mergulho histórico."
      }
    ]
  }
};

export default function DestinoView({ 
  destinationSlug, 
  destinations, 
  experiences, 
  accommodations, 
  posts,
  onNavigate,
  onSelectExperience,
  onSelectAccommodation,
  onSelectDestination,
  onSelectPost,
  onChangeHotelId,
  onUpdateSelectedDestinationId
}: DestinoViewProps) {
  
  const activeDest = destinations.find(d => d.slug === destinationSlug);

  // Scroll to top on load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [destinationSlug]);

  const handleNavigateToWizardWithDest = (destId: string) => {
    if (onUpdateSelectedDestinationId) {
      onUpdateSelectedDestinationId(destId);
    }
    onNavigate("wizard");
  };

  const handleNavigateToExperiencesWithLocation = (destId: string) => {
    onNavigate("experiencias");
  };

  const handleNavigateToHospedagensWithLocation = (destId: string) => {
    onNavigate("hospedagens");
  };

  // 1. RENDER SINGLE DESTINATION DETAIL HUB
  if (destinationSlug && activeDest) {
    const destLandmarks = DESTINATION_LANDMARKS[activeDest.slug] || DESTINATION_LANDMARKS["arraial-do-cabo"];
    
    // Filter experiences matching this destination
    const relatedExps = experiences.filter(e => e.destinationId === activeDest.id);
    
    // Filter accommodations matching this destination
    const relatedAccs = accommodations.filter(a => a.destinationId === activeDest.id);

    // Filter blog posts related to this destination
    const relatedPosts = posts.filter(post => 
      post.title.toLowerCase().includes(activeDest.name.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(activeDest.name.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase() === activeDest.name.toLowerCase()))
    );

    return (
      <div id="destino-detail-hub" className="pt-24 pb-20 bg-[#FBF9F6] min-h-screen">
        {/* Editorial Header Hero */}
        <section className="relative h-[65vh] flex items-center justify-center overflow-hidden mb-16">
          <div className="absolute inset-0 z-0">
            <img 
              src={activeDest.heroImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"} 
              alt={activeDest.name}
              className="w-full h-full object-cover filter brightness-[0.45]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#E8711A]" />
              <span className="font-accent text-white text-[9px] font-extrabold tracking-widest uppercase">
                GUIA DE DESTINO OFICIAL
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              {activeDest.name}
            </h1>
            <div className="h-0.5 w-20 bg-[#E8711A] mx-auto my-3"></div>
            <p className="font-sans text-sm sm:text-base text-zinc-200 max-w-2xl mx-auto leading-relaxed">
              {activeDest.description} Descubra o que fazer, os passeios de barco mais exuberantes, pousadas charmosas e mimos de curadoria exclusivos da Guida Trips.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FBF9F6] to-transparent z-10"></div>
        </section>

        {/* Breadcrumb Navigation & Back to Hub Link */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <nav className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-zinc-200 text-xs font-sans text-zinc-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <button onClick={() => onSelectDestination?.(null)} className="hover:text-[#E8711A] font-medium transition-colors">
                Destinos
              </button>
              <span>&gt;</span>
              <span className="text-[#0D1B2A] font-bold">{activeDest.name}</span>
            </div>
            <button 
              onClick={() => onSelectDestination?.(null)}
              className="font-accent text-[10px] font-extrabold text-[#E8711A] hover:text-[#0D1B2A] tracking-widest flex items-center gap-1 transition-all"
            >
              &larr; VER TODOS OS LUGARES
            </button>
          </nav>
        </div>

        {/* ECO-FENOMENO / LOCAL BRANDING SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-[#0D1B2A]/10 rounded-lg shadow-[0_4px_25px_rgba(13,27,42,0.02)] p-6 sm:p-12">
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#E8711A]" /> {destLandmarks.ecoTitle}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#0D1B2A] leading-tight">
                {destLandmarks.ecoSubtitle}
              </h2>
              <p className="font-sans text-sm text-[#5C6874] leading-relaxed">
                {destLandmarks.ecoParagraph1}
              </p>
              <p className="font-sans text-sm text-[#5C6874] leading-relaxed">
                {destLandmarks.ecoParagraph2} Operamos em absoluta sintonia com órgãos de preservação ambiental locais, garantindo que sua visita seja sustentável, regenerativa e inesquecível.
              </p>
            </div>
            <div className="lg:col-span-5 h-[320px] relative overflow-hidden rounded-lg border border-zinc-200">
              <img 
                src={destLandmarks.ecoImage} 
                alt={activeDest.name} 
                className="w-full h-full object-cover filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/85 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-xs font-accent tracking-widest text-white uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E8711A]" /> Curadoria Homologada
              </div>
            </div>
          </div>
        </section>

        {/* 4 LANDMARK POINTS / CARTÕES POSTAIS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-accent text-[#E8711A] text-[10px] tracking-widest uppercase font-extrabold">Geografia do Paraíso</span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-[#0D1B2A] mt-1 tracking-tight">
              Os Cartões-Postais em {activeDest.name}
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto mt-3"></div>
            <p className="font-sans text-xs text-[#5C6874] mt-2 leading-relaxed">
              Mapeamos os refúgios, mirantes e enseadas que tornam {activeDest.name} mundialmente aclamada por sua incomparável beleza cênica preservada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destLandmarks.places.map((place) => (
              <div 
                key={place.id}
                className="bg-white border border-zinc-200 rounded-lg shadow-[0_4px_20px_rgba(13,27,42,0.02)] overflow-hidden flex flex-col md:flex-row hover:border-[#0D1B2A]/35 transition-all duration-300"
              >
                {/* Img Container */}
                <div className="w-full md:w-[45%] h-[200px] md:h-full relative overflow-hidden shrink-0">
                  <img 
                    src={place.img} 
                    alt={place.name} 
                    className="w-full h-full object-cover filter brightness-[0.96]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0D1B2A] px-2.5 py-1 rounded-sm text-[8px] font-accent text-white font-extrabold tracking-wider uppercase shadow">
                    {place.category}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#0D1B2A] tracking-tight">{place.name}</h3>
                    <p className="font-sans text-xs text-[#5C6874] leading-relaxed line-clamp-4">{place.phrase}</p>
                  </div>
                  
                  <div className="text-[10px] font-accent text-[#E8711A] tracking-wider uppercase border-t border-zinc-100 pt-3 font-extrabold">
                    ✨ {place.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED PASSEIOS (Passeios Relacionados) */}
        {relatedExps.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-zinc-200 pb-4">
              <div className="text-left">
                <span className="font-accent text-[#E8711A] text-[9px] tracking-widest uppercase font-extrabold">EXPERIÊNCIAS PREMIUM</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D1B2A] mt-1">
                  Passeios Exclusivos em {activeDest.name}
                </h2>
              </div>
              <button 
                onClick={() => handleNavigateToExperiencesWithLocation(activeDest.id)}
                className="font-accent text-xs font-bold text-[#0D1B2A] hover:text-[#E8711A] tracking-widest flex items-center gap-1.5 shrink-0 transition-colors uppercase border-b border-[#0D1B2A]/20 pb-0.5"
              >
                Ver todos os passeios <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedExps.slice(0, 3).map((exp) => (
                <div 
                  key={exp.id}
                  className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#0D1B2A]/30 transition-all duration-300 hover:shadow-md"
                >
                  <div 
                    onClick={() => onSelectExperience?.(exp.slug)}
                    className="aspect-square relative overflow-hidden group cursor-pointer"
                  >
                    <img 
                      src={exp.photos?.[0]} 
                      alt={exp.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 filter brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#0D1B2A]/90 text-white font-accent text-[8px] font-bold px-2 py-1 tracking-widest uppercase rounded-sm">
                      {exp.duration}
                    </div>
                  </div>

                  <div className="p-6 text-left space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#E8711A]">{exp.category}</span>
                      <h3 
                        onClick={() => onSelectExperience?.(exp.slug)}
                        className="font-serif text-base sm:text-lg font-bold text-[#0D1B2A] hover:text-[#E8711A] cursor-pointer transition-colors line-clamp-1"
                      >
                        {exp.name}
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 leading-relaxed line-clamp-3">{exp.shortDescription}</p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold block">A partir de</span>
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#0D1B2A]">R$ {exp.priceFrom} / p.</span>
                      </div>
                      <button 
                        onClick={() => onSelectExperience?.(exp.slug)}
                        className="px-3.5 py-1.5 border border-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white text-[#0D1B2A] font-accent text-[9px] font-bold tracking-wider uppercase rounded-sm transition-all cursor-pointer"
                      >
                        RESERVAR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RELATED HOSPEDAGENS (Hospedagens na Região) */}
        {relatedAccs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-zinc-200 pb-4">
              <div className="text-left">
                <span className="font-accent text-[#E8711A] text-[9px] tracking-widest uppercase font-extrabold">CURADORIA DE POUSADAS</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D1B2A] mt-1">
                  Onde Hospedar-se em {activeDest.name}
                </h2>
              </div>
              <button 
                onClick={() => handleNavigateToHospedagensWithLocation(activeDest.id)}
                className="font-accent text-xs font-bold text-[#0D1B2A] hover:text-[#E8711A] tracking-widest flex items-center gap-1.5 shrink-0 transition-colors uppercase border-b border-[#0D1B2A]/20 pb-0.5"
              >
                Ver todas as pousadas <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedAccs.slice(0, 3).map((acc) => (
                <div 
                  key={acc.id}
                  className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#0D1B2A]/30 transition-all duration-300 hover:shadow-md"
                >
                  <div 
                    onClick={() => onSelectAccommodation?.(acc.slug)}
                    className="aspect-square relative overflow-hidden group cursor-pointer"
                  >
                    <img 
                      src={(acc.mediaGallery && acc.mediaGallery.length > 0 ? acc.mediaGallery.filter(m => m.type === 'image')[0]?.url : acc.photos?.[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"} 
                      alt={acc.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 filter brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-[#0D1B2A] text-white text-[8px] font-accent font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                      {acc.typeTag ? acc.typeTag.toUpperCase() : "CURADORIA EXCLUSIVA"}
                    </span>
                  </div>

                  <div className="p-6 text-left space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                        <MapPin className="w-3 h-3 text-[#E8711A]" />
                        <span>{acc.location}</span>
                      </div>
                      <h3 
                        onClick={() => onSelectAccommodation?.(acc.slug)}
                        className="font-serif text-base sm:text-lg font-bold text-[#0D1B2A] hover:text-[#E8711A] cursor-pointer transition-colors line-clamp-1"
                      >
                        {acc.name}
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 leading-relaxed line-clamp-3">{acc.description}</p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold block">MELHOR TARIFA</span>
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#0D1B2A]">A partir de R$ {acc.sellRate} / noite</span>
                      </div>
                      <button 
                        onClick={() => onSelectAccommodation?.(acc.slug)}
                        className="px-3.5 py-1.5 border border-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white text-[#0D1B2A] font-accent text-[9px] font-bold tracking-wider uppercase rounded-sm transition-all cursor-pointer"
                      >
                        DETALHES
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LOCAL TRIP GUIDE / INTELLIGENT ROUTE PLANNER CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-[#0D1B2A] text-white rounded-2xl p-8 sm:p-16 text-center max-w-5xl mx-auto space-y-8 shadow-[0_20px_50px_rgba(13,27,42,0.5)] relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E8711A]/20 via-[#0D1B2A]/0 to-[#0D1B2A]/0 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            
            <div className="relative z-10 space-y-5 max-w-3xl mx-auto">
              <span className="font-accent text-[#E8711A] text-[10px] font-extrabold tracking-widest uppercase block flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> INTELIGÊNCIA ARTIFICIAL + CURADORIA LOCAL
              </span>
              <h3 className="font-serif text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Deixe a mágica acontecer em {activeDest.name}
              </h3>
              <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Não gaste horas planejando. Nosso sistema analisa a logística da cidade, as condições climáticas e a duração de cada atração para montar a sua <strong className="text-white">linha do tempo perfeita</strong>. Hotéis, passeios e dicas, tudo sincronizado em segundos.
              </p>
              <div className="pt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => handleNavigateToWizardWithDest(activeDest.id)}
                  className="px-8 py-4 bg-[#E8711A] hover:bg-white text-[#0D1B2A] font-accent text-xs font-extrabold tracking-widest uppercase rounded shadow-[0_0_20px_rgba(232,113,26,0.3)] duration-300 cursor-pointer hover:scale-105 transition-all flex items-center gap-2"
                >
                  GERAR ROTEIRO INTELIGENTE <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* REVELANT BLOG POSTS / CONTEUDO ADICIONAL */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="text-left border-b border-zinc-200 pb-4 mb-10">
              <span className="font-accent text-[#E8711A] text-[9px] tracking-widest uppercase font-extrabold font-bold">REVISTA DIGITAL</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D1B2A] mt-1">
                Artigos & Dicas Editoriais
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => onSelectPost?.(post.slug)}
                  className="bg-white border border-zinc-200 p-6 sm:p-8 rounded-lg flex flex-col md:flex-row gap-6 hover:border-[#0D1B2A] transition-colors duration-300 cursor-pointer text-left shadow-[0_4px_15px_rgba(0,0,0,0.01)]"
                >
                  <div className="w-full md:w-1/3 h-40 shrink-0 overflow-hidden rounded">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="px-2.5 py-0.5 bg-[#E8711A]/10 text-[#E8711A] font-accent text-[8px] font-bold rounded-full uppercase tracking-wider inline-block">
                        {post.category}
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#0D1B2A] hover:text-[#E8711A] leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-sans pt-2 border-t border-zinc-100">
                      <span>👁 {post.views} vistas</span>
                      <span>•</span>
                      <span>{post.readTime} min leitura</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3 EDITORIAL TIPS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {destLandmarks.infoTips.map((tip, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-zinc-200 p-8 rounded-lg shadow-[0_4px_25px_rgba(13,27,42,0.01)] space-y-4 text-left hover:border-[#0D1B2A] transition-colors duration-250"
              >
                <div className="text-[#0D1B2A] font-extrabold text-xs font-accent uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#E8711A] animate-pulse"></span>
                  {tip.title}
                </div>
                <p className="font-sans text-xs text-[#5C6874] leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 2. RENDER THE ALL DESTINATIONS HUBS DIRECTORY (Places Catalog)
  const activeDestinations = destinations.filter(d => d.status === "active" || d.id === "arraial-do-cabo" || d.id === "buzios" || d.id === "cabo-frio");

  return (
    <div id="destinos-catalog-view" className="pt-28 pb-24 bg-[#FBF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8711A]/5 rounded-full border border-[#E8711A]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#E8711A]" />
            <span className="font-accent text-[#0d1b2a] text-[9px] font-extrabold tracking-widest uppercase">
              Curadoria de Territórios Guida Trips
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
            Nossos Hubs de Destinos
          </h1>
          <div className="h-0.5 w-16 bg-[#E8711A] mx-auto"></div>
          <p className="font-sans text-sm text-[#5C6874] leading-relaxed max-w-lg mx-auto">
            Explore nossos guias editoriais sob medida. Oferecemos pacotes integrados com o que há de mais exclusivo em hospedagem, passeios náuticos e consultoria local.
          </p>
        </div>

        {/* CARDS GRID OF AVAILABLE DESTINATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeDestinations.map((dest) => {
            const expCount = experiences.filter(e => e.destinationId === dest.id).length;
            const hotelCount = accommodations.filter(a => a.destinationId === dest.id).length;

            return (
              <motion.div
                key={dest.id}
                whileHover={{ y: -5 }}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(13,27,42,0.04)] hover:border-[#0D1B2A] transition-all duration-300"
              >
                {/* Photo Header */}
                <div 
                  onClick={() => onSelectDestination?.(dest.slug)}
                  className="h-56 relative overflow-hidden cursor-pointer group"
                >
                  <img 
                    src={dest.heroImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white text-left">
                    <span className="font-accent text-[9px] font-extrabold tracking-widest uppercase text-[#E8711A] block">DESTINO HOMOLOGADO</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight leading-tight">{dest.name}</h3>
                  </div>
                </div>

                {/* Info and stats area */}
                <div className="p-6 text-left space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="font-sans text-xs text-[#5C6874] leading-relaxed line-clamp-3">
                      {dest.description} Descubra praias secretas, trilhas ecológicas, marés e mirantes exclusivos.
                    </p>
                    <div className="flex items-center gap-4 pt-2 text-[10px] font-sans text-zinc-500 font-medium">
                      <span>⛵ {expCount > 0 ? `${expCount} Passeios` : "Passeios Curados"}</span>
                      <span>•</span>
                      <span>🏡 {hotelCount > 0 ? `${hotelCount} Pousadas` : "Hotéis Boutique"}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onSelectDestination?.(dest.slug)}
                    className="w-full py-2.5 bg-zinc-50 border border-zinc-200 text-[#0D1B2A] font-accent text-[10px] font-extrabold tracking-wider uppercase rounded-sm hover:bg-[#0D1B2A] hover:text-white transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    EXPLORAR DESTINO <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Direct Trust badging block */}
        <div className="mt-24 border-t border-zinc-200 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <span className="p-3 bg-[#E8711A]/5 rounded-sm border border-[#E8711A]/20 text-[#E8711A]">
              <Shield className="w-5 h-5" />
            </span>
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Selo Guida de Qualidade</h4>
              <p className="font-sans text-[11px] text-zinc-500">Apenas destinos exaustivamente testados, homologados e com equipe local de concierge parceira.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <span className="p-3 bg-[#E8711A]/5 rounded-sm border border-[#E8711A]/20 text-[#E8711A]">
              <Compass className="w-5 h-5" />
            </span>
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Expertise Geoclimática</h4>
              <p className="font-sans text-[11px] text-zinc-500">Estudamos as monções de vento e as correntes para direcionar o cliente aos melhores cantos do paraíso.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <span className="p-3 bg-[#E8711A]/5 rounded-sm border border-[#E8711A]/20 text-[#E8711A]">
              <Coffee className="w-5 h-5" />
            </span>
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Mimos Exclusivos</h4>
              <p className="font-sans text-[11px] text-zinc-500">Ao reservar por nossos guias, desfrute de espumantes, mimos regionais e check-out ampliado.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
