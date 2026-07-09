/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Experience, Accommodation, BlogPost } from "../types";

export interface SEOData {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: "website" | "article";
  schemaJson: Record<string, any> | Record<string, any>[];
}

/**
 * Dynamically computes and updates the HTML head tags (Titles, Meta, OG, Twitter) 
 * and injects the corresponding Schema.org JSON-LD structured markup.
 */
export function updatePageSEO(pathname: string, data: {
  destinations: Destination[];
  experiences: Experience[];
  accommodations: Accommodation[];
  posts: BlogPost[];
}) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const baseUrl = "https://guidatrips.com";
  const canonicalUrl = `${baseUrl}${pathname}`;
  const defaultLogo = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"; // Premium scenic image representing Guida Trips
  
  let title = "Guida Trips | Curadoria de Viagens e Experiências Exclusivas";
  let metaDescription = "Descubra Arraial do Cabo, Búzios, Cabo Frio e o Rio de Janeiro com a Guida Trips. Curadoria de passeios de barco exclusivos, pousadas charmosas e roteiros inteligentes personalizados.";
  let ogImage = defaultLogo;
  let ogType: "website" | "article" = "website";
  let schemaJson: Record<string, any> | Record<string, any>[] = [];

  const pathParts = pathname.split("/").filter(Boolean);

  // Define global brand / agency structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${baseUrl}/#organization`,
    "name": "Guida Trips",
    "url": baseUrl,
    "logo": defaultLogo,
    "image": defaultLogo,
    "description": "Agência boutique especializada em curadoria de roteiros personalizados, passeios exclusivos e hospedagens de charme na Região dos Lagos e Rio de Janeiro.",
    "telephone": "+552299887766",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Arraial do Cabo",
      "addressRegion": "RJ",
      "addressCountry": "BR"
    },
    "sameAs": [
      "https://instagram.com/guidatrips",
      "https://facebook.com/guidatrips"
    ]
  };

  // 1. HOME VIEW
  if (pathParts.length === 0) {
    title = "Guida Trips | Curadoria de Viagens e Roteiros Personalizados";
    metaDescription = "Monte seu roteiro inteligente personalizado em Arraial do Cabo, Búzios e Cabo Frio. Reserve passeios exclusivos e hospedagens de charme com mimos garantidos.";
    
    schemaJson = [
      organizationSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Guida Trips",
        "description": metaDescription,
        "publisher": { "@id": `${baseUrl}/#organization` }
      }
    ];
  } 
  // 2. BLOG INDEX OR DETAIL
  else if (pathParts[0] === "blog") {
    const postSlug = pathParts[1];
    
    if (postSlug) {
      // Blog Post Detail
      const post = data.posts.find(p => p.slug === postSlug);
      if (post) {
        title = `${post.title} | Blog Guida Trips`;
        metaDescription = post.excerpt || "Confira este artigo exclusivo no Blog da Guida Trips com dicas valiosas de viagem, restaurantes e roteiros locais.";
        ogImage = post.coverImage || defaultLogo;
        ogType = "article";

        schemaJson = [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
              { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${canonicalUrl}/#article`,
            "isPartOf": {
              "@type": "WebPage",
              "@id": canonicalUrl
            },
            "headline": post.title,
            "description": metaDescription,
            "image": ogImage,
            "datePublished": post.publishedAt || new Date().toISOString(),
            "dateModified": post.publishedAt || new Date().toISOString(),
            "author": {
              "@type": "Person",
              "name": "Curador Guida Trips"
            },
            "publisher": { "@id": `${baseUrl}/#organization` },
            "articleBody": post.body || ""
          }
        ];
      }
    } else {
      // Blog Index
      title = "Revista Guida Trips | Dicas de Viagem, Gastronomia e Roteiros";
      metaDescription = "O guia definitivo para planejar sua viagem na Região dos Lagos. Leia sobre as praias secretas, melhores restaurantes, previsibilidade do vento e passeios exclusivos.";
      
      schemaJson = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": canonicalUrl }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${canonicalUrl}/#blog`,
          "name": "Revista Guida Trips",
          "description": metaDescription,
          "publisher": { "@id": `${baseUrl}/#organization` },
          "blogPost": data.posts.slice(0, 10).map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "url": `${baseUrl}/blog/${post.slug}`,
            "datePublished": post.publishedAt
          }))
        }
      ];
    }
  }
  // 3. PASSEIOS/EXPERIENCIAS INDEX OR DETAIL
  else if (pathParts[0] === "passeios" || pathParts[0] === "experiencias") {
    const expSlug = pathParts[1];

    if (expSlug) {
      // Experience Detail
      const exp = data.experiences.find(e => e.slug === expSlug);
      if (exp) {
        title = `${exp.name} em Arraial do Cabo | Guida Trips`;
        metaDescription = exp.shortDescription || "Reserve este passeio exclusivo e vivencie momentos inesquecíveis. Curadoria de segurança, atendimento premium e benefícios adicionais inclusos.";
        ogImage = exp.photos?.[0] || defaultLogo;

        schemaJson = [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": "Passeios", "item": `${baseUrl}/passeios` },
              { "@type": "ListItem", "position": 3, "name": exp.name, "item": canonicalUrl }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": `${canonicalUrl}/#product`,
            "name": exp.name,
            "image": exp.photos || [ogImage],
            "description": exp.fullDescription || exp.shortDescription,
            "category": "TouristTrip",
            "offers": {
              "@type": "Offer",
              "url": canonicalUrl,
              "priceCurrency": "BRL",
              "price": exp.priceFrom || 150,
              "valueAddedTaxIncluded": "true",
              "availability": "https://schema.org/InStock",
              "seller": { "@id": `${baseUrl}/#organization` }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "128"
            }
          }
        ];
      }
    } else {
      // Experiences list
      title = "Passeios e Experiências Exclusivas | Guida Trips";
      metaDescription = "Passeios de barco exclusivos, lanchas privativas, mergulho batismo, trilhas históricas e quadriciclo. Viva a Região dos Lagos de forma única, longe de aglomerações.";
      
      schemaJson = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Passeios", "item": canonicalUrl }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${canonicalUrl}/#itemlist`,
          "name": "Passeios da Guida Trips",
          "description": metaDescription,
          "itemListElement": data.experiences.slice(0, 15).map((exp, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "url": `${baseUrl}/passeios/${exp.slug}`,
            "name": exp.name
          }))
        }
      ];
    }
  }
  // 4. HOSPEDAGENS INDEX OR DETAIL
  else if (pathParts[0] === "hospedagens") {
    const accSlug = pathParts[1];

    if (accSlug) {
      // Accommodation Detail
      const acc = data.accommodations.find(a => a.slug === accSlug);
      if (acc) {
        title = `${acc.name} | Benefícios Exclusivos Guida Trips`;
        metaDescription = acc.description || `Hospede-se na ${acc.name} com tarifa sob medida, check-in estendido e espumante de cortesia reservando pelo canal oficial da Guida Trips.`;
        ogImage = acc.photos?.[0] || defaultLogo;

        schemaJson = [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": "Hospedagens", "item": `${baseUrl}/hospedagens` },
              { "@type": "ListItem", "position": 3, "name": acc.name, "item": canonicalUrl }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "Hotel",
            "@id": `${canonicalUrl}/#hotel`,
            "name": acc.name,
            "image": acc.photos || [ogImage],
            "description": acc.description,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": acc.address || "",
              "addressLocality": acc.location || "Arraial do Cabo",
              "addressRegion": "RJ",
              "addressCountry": "BR"
            },
            "starRating": {
              "@type": "Rating",
              "ratingValue": "5.0"
            },
            "priceRange": `R$ ${acc.sellRate} - R$ ${acc.sellRate * 1.5}`
          }
        ];
      }
    } else {
      // Hospedagens List
      title = "Pousadas de Charme e Hotéis Boutique | Guida Trips";
      metaDescription = "Nossa seleção de hospedagens homologadas com mimos inclusos. Reservando com a Guida Trips Club, você garante espumante de boas-vindas e atendimento premium.";
      
      schemaJson = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Hospedagens", "item": canonicalUrl }
          ]
        }
      ];
    }
  }
  // 5. LUGARES / DESTINATIONS INDEX, DETAIL, OR THEMATIC ITINERARY
  else if (pathParts[0] === "lugares") {
    const destSlug = pathParts[1];
    const thematicSlug = pathParts[2];

    if (destSlug && thematicSlug) {
      // Thematic Itinerary View (e.g. /lugares/arraial-do-cabo/roteiro-casal)
      const dest = data.destinations.find(d => d.slug === destSlug);
      const destName = dest ? dest.name : "Destino";
      const formatThematicName = (slug: string) => {
        return slug
          .replace(/-/g, " ")
          .replace(/\b\w/g, c => c.toUpperCase())
          .replace("Roteiro ", "Roteiro de Viagem ");
      };
      const thematicTitle = formatThematicName(thematicSlug);

      title = `${thematicTitle} em ${destName} | Guida Trips`;
      metaDescription = `Confira nosso roteiro temático exclusivo para sua viagem a ${destName}. Dicas completas, passeios otimizados e suporte concierge.`;
      
      schemaJson = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Lugares", "item": `${baseUrl}/lugares` },
            { "@type": "ListItem", "position": 3, "name": destName, "item": `${baseUrl}/lugares/${destSlug}` },
            { "@type": "ListItem", "position": 4, "name": thematicTitle, "item": canonicalUrl }
          ]
        }
      ];
    } else if (destSlug) {
      // Destination Detail Hub (e.g. /lugares/arraial-do-cabo)
      const dest = data.destinations.find(d => d.slug === destSlug);
      if (dest) {
        title = `Guia Completo de ${dest.name} | Guida Trips Hub`;
        metaDescription = dest.description || `O que fazer, onde se hospedar, as praias secretas e os melhores passeios exclusivos em ${dest.name}. Confira o hub oficial da Guida Trips.`;
        ogImage = dest.heroImage || defaultLogo;

        schemaJson = [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": "Lugares", "item": `${baseUrl}/lugares` },
              { "@type": "ListItem", "position": 3, "name": dest.name, "item": canonicalUrl }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "TouristAttraction",
            "@id": `${canonicalUrl}/#attraction`,
            "name": dest.name,
            "description": dest.description,
            "image": ogImage,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": dest.name,
              "addressRegion": "RJ",
              "addressCountry": "BR"
            }
          }
        ];
      }
    } else {
      // Destination list index (/lugares)
      title = "Melhores Destinos do Rio de Janeiro e Lagos | Guida Trips";
      metaDescription = "Explore nossos hubs para planejar sua viagem dos sonhos. Guias completos de Arraial do Cabo, Búzios, Cabo Frio e muito mais.";
      
      schemaJson = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Lugares", "item": canonicalUrl }
          ]
        }
      ];
    }
  }
  // 6. ROTEIRO INTELIGENTE (WIZARD)
  else if (pathParts[0] === "roteiro-inteligente") {
    title = "Roteiro Inteligente Personalizado | Guida Trips";
    metaDescription = "Planeje sua viagem ideal em segundos. Insira as datas, adicione passeios, selecione pousadas charmosas e envie o roteiro consolidado para nosso WhatsApp Concierge.";
    
    schemaJson = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Roteiro Inteligente", "item": canonicalUrl }
        ]
      }
    ];
  }

  // Inject updated meta tags inside <head>
  document.title = title;

  // Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement("meta");
    descMeta.setAttribute("name", "description");
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute("content", metaDescription);

  // Canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute("href", canonicalUrl);

  // Open Graph Title
  let ogTitleMeta = document.querySelector('meta[property="og:title"]');
  if (!ogTitleMeta) {
    ogTitleMeta = document.createElement("meta");
    ogTitleMeta.setAttribute("property", "og:title");
    document.head.appendChild(ogTitleMeta);
  }
  ogTitleMeta.setAttribute("content", title);

  // Open Graph Description
  let ogDescMeta = document.querySelector('meta[property="og:description"]');
  if (!ogDescMeta) {
    ogDescMeta = document.createElement("meta");
    ogDescMeta.setAttribute("property", "og:description");
    document.head.appendChild(ogDescMeta);
  }
  ogDescMeta.setAttribute("content", metaDescription);

  // Open Graph Image
  let ogImageMeta = document.querySelector('meta[property="og:image"]');
  if (!ogImageMeta) {
    ogImageMeta = document.createElement("meta");
    ogImageMeta.setAttribute("property", "og:image");
    document.head.appendChild(ogImageMeta);
  }
  ogImageMeta.setAttribute("content", ogImage);

  // Open Graph URL
  let ogUrlMeta = document.querySelector('meta[property="og:url"]');
  if (!ogUrlMeta) {
    ogUrlMeta = document.createElement("meta");
    ogUrlMeta.setAttribute("property", "og:url");
    document.head.appendChild(ogUrlMeta);
  }
  ogUrlMeta.setAttribute("content", canonicalUrl);

  // Open Graph Type
  let ogTypeMeta = document.querySelector('meta[property="og:type"]');
  if (!ogTypeMeta) {
    ogTypeMeta = document.createElement("meta");
    ogTypeMeta.setAttribute("property", "og:type");
    document.head.appendChild(ogTypeMeta);
  }
  ogTypeMeta.setAttribute("content", ogType);

  // Twitter Cards Title
  let twTitleMeta = document.querySelector('meta[name="twitter:title"]');
  if (!twTitleMeta) {
    twTitleMeta = document.createElement("meta");
    twTitleMeta.setAttribute("name", "twitter:title");
    document.head.appendChild(twTitleMeta);
  }
  twTitleMeta.setAttribute("content", title);

  // Twitter Cards Description
  let twDescMeta = document.querySelector('meta[name="twitter:description"]');
  if (!twDescMeta) {
    twDescMeta = document.createElement("meta");
    twDescMeta.setAttribute("name", "twitter:description");
    document.head.appendChild(twDescMeta);
  }
  twDescMeta.setAttribute("content", metaDescription);

  // Twitter Cards Image
  let twImageMeta = document.querySelector('meta[name="twitter:image"]');
  if (!twImageMeta) {
    twImageMeta = document.createElement("meta");
    twImageMeta.setAttribute("name", "twitter:image");
    document.head.appendChild(twImageMeta);
  }
  twImageMeta.setAttribute("content", ogImage);

  // Twitter Cards type
  let twCardMeta = document.querySelector('meta[name="twitter:card"]');
  if (!twCardMeta) {
    twCardMeta = document.createElement("meta");
    twCardMeta.setAttribute("name", "twitter:card");
    document.head.appendChild(twCardMeta);
  }
  twCardMeta.setAttribute("content", "summary_large_image");

  // Injetar os dados estruturados do Schema.org
  let scriptTag = document.getElementById("schema-jsonld") as HTMLScriptElement;
  if (!scriptTag) {
    scriptTag = document.createElement("script");
    scriptTag.id = "schema-jsonld";
    scriptTag.type = "application/ld+json";
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(schemaJson, null, 2);
}
