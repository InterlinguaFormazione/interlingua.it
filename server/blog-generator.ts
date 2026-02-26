import OpenAI from "openai";
import { storage } from "./storage";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const BLOG_TOPICS = [
  "intelligenza artificiale nel lavoro quotidiano",
  "ChatGPT e produttività professionale",
  "Microsoft Copilot per aziende",
  "automazione dei processi con AI",
  "competenze digitali richieste nel 2025",
  "soft skills nel mondo del lavoro moderno",
  "project management agile",
  "leadership e gestione del team",
  "digital marketing tendenze",
  "formazione professionale continua",
  "prompt engineering tecniche avanzate",
  "Excel avanzato e analisi dati",
  "public speaking e comunicazione efficace",
  "problem solving creativo",
  "team building e collaborazione",
  "gestione del tempo e produttività",
  "innovazione digitale nelle PMI",
  "strumenti cloud per il lavoro remoto",
  "personal branding professionale",
  "negoziazione e vendita efficace",
];

const CATEGORIES = [
  "Intelligenza Artificiale",
  "Competenze Digitali",
  "Soft Skills",
  "Management",
  "Business",
  "Formazione",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/['']/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function generateBlogPost(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    console.log("Blog generation skipped: OPENAI_API_KEY not configured");
    return;
  }

  try {
    const topic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Sei un esperto copywriter italiano specializzato in formazione professionale, AI e competenze digitali. Scrivi articoli per il blog di SkillCraft-Interlingua, un centro di formazione professionale a Vicenza, Italia. 
          
Regole:
- Scrivi SEMPRE in italiano
- Tono professionale ma accessibile
- Usa esempi pratici e concreti
- Non usare la parola "eccellenze"
- Includi consigli actionable
- Formato markdown con heading ## e ###
- L'articolo deve essere 800-1200 parole
- Includi una conclusione con call-to-action verso i corsi di SkillCraft-Interlingua`
        },
        {
          role: "user",
          content: `Scrivi un articolo originale e coinvolgente sul tema: "${topic}". 

Rispondi in formato JSON con questa struttura esatta:
{
  "title": "titolo accattivante dell'articolo",
  "excerpt": "riassunto di 1-2 frasi (max 200 caratteri)",
  "content": "contenuto completo dell'articolo in markdown",
  "category": "${category}"
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      console.error("Blog generation: empty response from OpenAI");
      return;
    }

    const article = JSON.parse(responseText);
    
    const baseSlug = slugify(article.title);
    const datePrefix = new Date().toISOString().split("T")[0];
    const slug = `${datePrefix}-${baseSlug}`;

    await storage.createBlogPost({
      slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category || category,
      imageUrl: null,
      sourceUrl: null,
      sourceTitle: null,
      published: true,
    });

    console.log(`Blog post generated: "${article.title}" (${slug})`);
  } catch (error) {
    console.error("Blog generation error:", error);
  }
}
