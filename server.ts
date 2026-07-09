import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initialization of Gemini client to prevent crashes if key is missing during startup
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave de API do Gemini (GEMINI_API_KEY) não está configurada nas variáveis de ambiente. Configure-a no painel 'Settings > Secrets'.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middleware to parse JSON body
  app.use(express.json());

  // API router / endpoints (if any)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Import and Structuring Endpoint for Accommodations (Fase 0 - POC)
  app.post("/api/accommodations/ai-import", async (req, res) => {
    try {
      const { rawInput } = req.body;
      if (!rawInput || typeof rawInput !== "string" || !rawInput.trim()) {
        return res.status(400).json({ error: "O campo rawInput é obrigatório e deve ser um texto preenchido." });
      }

      // 1. Robust Link & Token Context Extraction Helper
      let isUrl = false;
      let urlStr = "";
      let urlParsedName = "";
      let urlContextInfo = "";
      let decodedSegments: string[] = [];

      // Try to find any HTTP/HTTPS URL first
      const urlRegex = /(https?:\/\/[^\s]+)/gi;
      const match = rawInput.trim().match(urlRegex);
      
      if (match) {
        isUrl = true;
        urlStr = match[0];
      } else {
        // Check if the input looks like a link or has query parameters (e.g. from copy-pasting partial URL)
        const looksLikeUrl = rawInput.includes("booking.com") || 
                             rawInput.includes("airbnb.com") || 
                             rawInput.includes("checkin=") || 
                             rawInput.includes("checkout=") || 
                             rawInput.includes("dest_id=") || 
                             rawInput.includes("all_sr_blocks=");
        if (looksLikeUrl) {
          isUrl = true;
          // Clean up string to find the link if possible, or use raw input
          urlStr = rawInput.trim();
        }
      }

      // Extract search query parameters from raw input or URL (checkin/out, guests)
      const checkinMatch = rawInput.match(/(?:checkin|check_in)=([0-9-]{10})/i);
      const checkoutMatch = rawInput.match(/(?:checkout|check_out)=([0-9-]{10})/i);
      const adultsMatch = rawInput.match(/(?:adults|group_adults)=([0-9]+)/i);
      const childrenMatch = rawInput.match(/(?:children|group_children)=([0-9]+)/i);

      const checkin = checkinMatch ? checkinMatch[1] : '';
      const checkout = checkoutMatch ? checkoutMatch[1] : '';
      const adults = adultsMatch ? adultsMatch[1] : '';
      const children = childrenMatch ? childrenMatch[1] : '';

      if (checkin || checkout || adults || children) {
        urlContextInfo = `\nInformações adicionais identificadas na URL ou parâmetros de pesquisa:\n` +
          (checkin ? `- Data de Check-in: ${checkin}\n` : '') +
          (checkout ? `- Data de Check-out: ${checkout}\n` : '') +
          (adults ? `- Adultos: ${adults}\n` : '') +
          (children ? `- Crianças: ${children}\n` : '');
      }

      // Try to parse friendly hotel/pousada name from path segments
      try {
        let pathToParse = "";
        if (urlStr.startsWith("http")) {
          const urlObj = new URL(urlStr);
          pathToParse = urlObj.pathname;
        } else {
          pathToParse = urlStr;
        }

        const segments = pathToParse.split(/[\/\s?&]+/).filter(Boolean);
        const formatSegment = (str: string) => {
          return str
            .replace(/\.[^/.]+$/, "") // remove .html or extensions
            .replace(/-+/g, ' ')      // hyphens to spaces
            .replace(/_+/g, ' ')      // underscores to spaces
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        };

        const hotelIdx = segments.indexOf("hotel");
        if (hotelIdx !== -1 && segments[hotelIdx + 2]) {
          urlParsedName = formatSegment(segments[hotelIdx + 2]);
        } else if (hotelIdx !== -1 && segments[hotelIdx + 1]) {
          urlParsedName = formatSegment(segments[hotelIdx + 1]);
        } else {
          // Find any segments that look like names and are not standard parameters
          const likelyNames = segments.filter(seg => 
            seg.length > 5 && 
            !seg.includes("=") && 
            !/^[0-9]+$/.test(seg) &&
            !/checkin|checkout|dest_id|sr_blocks|group_adults/.test(seg)
          );
          if (likelyNames.length > 0) {
            urlParsedName = formatSegment(likelyNames[0]);
          }
        }
        urlParsedName = urlParsedName.replace(/\b(Pt Br|Html|Php|Aspx)\b/gi, '').trim();
      } catch (e) {
        // Ignore URL parsing exceptions
      }

      // Attempt to decode any base64-encoded segments in the rawInput (Booking.com feature!)
      try {
        const base64Regex = /[A-Za-z0-9+/_-]{16,120}/g;
        const matches = rawInput.match(base64Regex) || [];
        for (const match of matches) {
          let normalized = match.replace(/-/g, '+').replace(/_/g, '/');
          while (normalized.length % 4 !== 0) {
            normalized += '=';
          }
          const decoded = Buffer.from(normalized, 'base64').toString('utf-8');
          // If the decoded string looks like readable text with a hotel slug pattern
          if (/^[a-zA-Z0-9\s\-_.,/()]{8,100}$/.test(decoded)) {
            if (decoded.includes('-') || decoded.includes(' ') || decoded.toLowerCase().includes('pousada') || decoded.toLowerCase().includes('hotel')) {
              const formattedName = decoded.replace(/-/g, ' ').replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              decodedSegments.push(formattedName);
            }
          }
        }
      } catch (e) {
        // Ignore decoding errors
      }

      // Use decoded base64 segment if we didn't parse a name yet
      if (decodedSegments.length > 0 && !urlParsedName) {
        urlParsedName = decodedSegments[0];
      }

      let finalPrompt = `Analise a seguinte hospedagem e estruture-a completamente em JSON:\n\n${rawInput}`;
      let htmlContent = "";

      if (isUrl) {
        const targetUrl = urlStr.startsWith("http") ? urlStr : `https://${urlStr}`;
        try {
          console.log(`[AI-Import] Link/Token detected. Parsed Name: "${urlParsedName}". Decoded Segments: ${JSON.stringify(decodedSegments)}. Context: ${urlContextInfo.trim()}`);

          // Only attempt to fetch if it's a valid complete http/https URL
          if (targetUrl.startsWith("http")) {
            const fetchResponse = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              },
              signal: AbortSignal.timeout(5000) // 5s timeout to respond fast
            });

            if (fetchResponse.ok) {
              const rawHtml = await fetchResponse.text();
              htmlContent = rawHtml
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
                .replace(/<[^>]+>/g, ' ') // strip html tags
                .replace(/\s+/g, ' ')      // normalize whitespace
                .trim()
                .slice(0, 16000);         // limit size safely
            } else {
              console.warn(`[AI-Import] Fetch returned status: ${fetchResponse.status}`);
            }
          }
        } catch (fetchErr: any) {
          console.warn("[AI-Import] Safe fetch failed or bypassed:", fetchErr.message);
        }

        const hotelName = urlParsedName || (decodedSegments.length > 0 ? decodedSegments[0] : "Hospedagem em Arraial do Cabo");

        // 2. Build the optimal prompt based on whether content scraping succeeded
        if (htmlContent && htmlContent.length > 300) {
          finalPrompt = `O usuário forneceu o link para importação: ${targetUrl}
${urlContextInfo}
Aqui está o conteúdo textual extraído diretamente da página da web:
--- INÍCIO DO CONTEÚDO EXTRAÍDO ---
${htmlContent}
--- FIM DO CONTEÚDO EXTRAÍDO ---

Analise essas informações extraídas e monte a ficha completa da hospedagem estruturada em JSON seguindo rigorosamente as diretrizes.`;
        } else {
          // Robust Fallback: Ask Gemini to generate realistic data for Arraial do Cabo using its base knowledge of this hotel/pousada
          finalPrompt = `O usuário forneceu o seguinte link, token de pesquisa ou dados brutos de hospedagem em Arraial do Cabo:
--- INÍCIO DA ENTRADA ---
${rawInput}
--- FIM DA ENTRADA ---

${urlContextInfo}
Identificamos o nome provável da hospedagem: "${hotelName}".
${decodedSegments.length > 0 ? `Outras decodificações identificadas no token: ${decodedSegments.join(", ")}\n` : ""}

Instrução de Fallback Inteligente de Curação:
Como você possui um amplo conhecimento atualizado sobre turismo e hotelaria em Arraial do Cabo/RJ, utilize todo o seu banco de dados e treinamento histórico para preencher a ficha técnica da forma mais realística possível para a hospedagem real "${hotelName}".
- Se a hospedagem for conhecida (ex: Pousada Caminho do Sol, Capitão N'Areia, Sea Angels, etc.), use as características reais dela (piscina, proximidade com a praia, etc.).
- Caso seja um link genérico, de apartamento ou menos conhecido, crie uma estrutura luxuosa/boutique realista baseada na região aproximada informada ou use Praia Grande/Praia dos Anjos como local padrão de Arraial do Cabo.
- Estime tarifas, categorias de suítes, regras de cancelamento e comodidades de altíssimo nível condizentes com Arraial do Cabo.`;
        }
      }

      const client = getGeminiClient();

      const systemInstruction = `Você é um Engenheiro de Dados e Curador especializado em turismo de alto padrão para a Guida Trips / GuideOS.
Sua missão é extrair, normalizar e estruturar dados de hospedagens (hotéis, pousadas, casas e apartamentos de temporada) a partir de descrições brutas, textos de anúncios ou páginas da web.
Você deve produzir uma estrutura de dados de altíssima qualidade seguindo rigorosamente o esquema JSON fornecido.

Diretrizes de Extração e Normalização:
1. CATEGORIA: Escolha estritamente uma das opções: "hotel", "pousada", "hostel", "casa" ou "apartamento".
2. TYPETAG: Escolha uma tag conceitual forte como "boutique", "pe-na-areia", "vista", "rustico", "luxo", "design", "familiar".
3. AMENITIES: Extraia todas as comodidades e padronize os nomes em português (ex: "Ar Condicionado", "Piscina", "Estacionamento Gratuito", "Wi-Fi de Alta Velocidade", "Café da manhã incluso").
4. LOCATION: Identifique o bairro ou praia em Arraial do Cabo (ex: "Praia Grande", "Praia dos Anjos", "Pontal do Atalaia", "Centro", "Prainha").
5. RATES: Se houver valores numéricos na descrição, use-os como base. Caso contrário, estime valores realistas para Arraial do Cabo (ex: diária de pousada entre R$ 350 e R$ 1200). netRate (custo) deve ser cerca de 20% a 30% menor que o sellRate (venda).
6. CATEGORIAS DE QUARTO (roomCategories): Se a descrição mencionar suítes ou quartos diferentes, estruture-os com nome, descrição, capacidades (adultos, crianças, máximo) e preços. Caso contrário, crie pelo menos duas categorias fictícias altamente realistas com base no estilo do hotel (ex: "Suíte Standard" e "Suíte Master Vista Mar").
7. SAZONALIDADES (seasonalPeriods): Defina períodos de alta e baixa temporada realistas para o Brasil / Arraial do Cabo (Alta: Dezembro a Março + feriados; Baixa: Abril a Novembro). Adicione multiplicadores adequados (ex: Alta: 1.5, Baixa: 1.0).
8. POLÍTICAS E REGRAS: Extraia regras claras de cancelamento, regras de pet, fumo, barulho, check-in/out.
9. SMART TAGS: Gere de 3 a 5 tags inteligentes para o mecanismo de recomendação personalizado (ex: "Casais", "Famílias", "Pet Friendly", "Vista Pôr do Sol", "Conectado à Natureza", "Próximo ao Porto").`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: finalPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Nome completo da hospedagem" },
              category: { type: Type.STRING, description: "hotel, pousada, hostel, casa ou apartamento" },
              typeTag: { type: Type.STRING, description: "Etiqueta conceitual ex: boutique, pe-na-areia, vista, rustico, familiar" },
              description: { type: Type.STRING, description: "Breve texto de marketing/curadoria persuasivo em português" },
              highlight: { type: Type.STRING, description: "Uma frase marcante resumindo o diferencial da pousada" },
              amenities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array de comodidades e serviços padronizados em português"
              },
              location: { type: Type.STRING, description: "Bairro ou praia local em Arraial do Cabo" },
              address: { type: Type.STRING, description: "Endereço estruturado completo" },
              netRate: { type: Type.NUMBER, description: "Preço estimado de custo (net) por diária em reais" },
              sellRate: { type: Type.NUMBER, description: "Preço de venda ao cliente por diária em reais" },
              rating: { type: Type.NUMBER, description: "Avaliação da hospedagem, de 4.0 a 5.0" },
              reviews: { type: Type.INTEGER, description: "Número total estimado de avaliações da hospedagem" },
              whatsappMessage: { type: Type.STRING, description: "Mensagem personalizada pré-preenchida para contato de reserva direta via WhatsApp" },
              roomCategories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nome da categoria do quarto" },
                    description: { type: Type.STRING, description: "Descrição detalhada do conforto e diferenciais do quarto" },
                    capacityAdults: { type: Type.INTEGER, description: "Capacidade máxima de adultos" },
                    capacityChildren: { type: Type.INTEGER, description: "Capacidade máxima de crianças" },
                    capacityMax: { type: Type.INTEGER, description: "Capacidade total máxima de hóspedes" },
                    amenities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Comodidades específicas deste quarto" },
                    basePrice: { type: Type.NUMBER, description: "Preço de venda diário base do quarto em reais" },
                    netPrice: { type: Type.NUMBER, description: "Preço de custo diário base do quarto com o parceiro" }
                  }
                },
                description: "Lista estruturada das categorias de quartos disponíveis"
              },
              seasonalPeriods: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nome da época ex: Alta Temporada, Baixa Temporada, Réveillon" },
                    startDate: { type: Type.STRING, description: "Data de início em formato YYYY-MM-DD" },
                    endDate: { type: Type.STRING, description: "Data de fim em formato YYYY-MM-DD" },
                    type: { type: Type.STRING, description: "high ou low" },
                    priceMultiplier: { type: Type.NUMBER, description: "Multiplicador de preço aplicado ex: 1.5 para alta temporada" },
                    minNights: { type: Type.INTEGER, description: "Número mínimo de noites exigido para o período" }
                  }
                },
                description: "Definição de sazonalidades anuais"
              },
              policies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Políticas gerais de check-in, check-out e cancelamento"
              },
              restrictions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Restrições da hospedagem ex: Não é permitido pets, Proibido fumar"
              },
              occupancyRules: { type: Type.STRING, description: "Regra resumida de ocupação e políticas de crianças" },
              smartTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Marcadores de perfil recomendados ex: Casais, Famílias, Pet Friendly, Vista Pôr do Sol"
              }
            },
            required: ["name", "category", "description", "amenities", "location", "netRate", "sellRate", "roomCategories", "policies"]
          }
        }
      });

      // Get and sanitize response text to guarantee valid JSON
      let textResponse = response.text || "{}";
      const jsonStart = textResponse.indexOf("{");
      const jsonEnd = textResponse.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        textResponse = textResponse.slice(jsonStart, jsonEnd + 1);
      }

      const structuredData = JSON.parse(textResponse);
      return res.json({ success: true, data: structuredData });
    } catch (err: any) {
      console.error("Erro no processamento do importador IA:", err);
      
      // Let's return a friendly message even if JSON validation fails
      return res.status(200).json({ 
        success: false, 
        error: "Não conseguimos estruturar as informações com o Gemini. Verifique se o link ou texto contém dados de hospedagem válidos, ou tente novamente com um formato textual simples." 
      });
    }
  });

  // Serve static files in dev or production
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
