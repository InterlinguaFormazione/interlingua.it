export interface ProductOption {
  name: string;
  label: string;
  values: string[];
}

export interface ProductVariation {
  options: Record<string, string>;
  price: string;
}

export interface ShopProduct {
  slug: string;
  name: string;
  category: string;
  description: string;
  price: string;
  priceLabel: string;
  duration: string;
  features: string[];
  pageLink: string;
  pageAnchor?: string;
  options?: ProductOption[];
  variations?: ProductVariation[];
  priceRange?: { min: string; max: string };
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    slug: "corsi-gruppo",
    name: "Corsi di Gruppo in Presenza",
    category: "Formazione in Presenza",
    description: "Corsi collettivi di lingua in piccoli gruppi (5-8 partecipanti) nelle sedi di Vicenza e Thiene, con docenti madrelingua qualificati.",
    price: "340.00",
    priceLabel: "da",
    duration: "6-12 settimane",
    features: [
      "Gruppi ridotti 5-8 persone",
      "Docenti madrelingua qualificati",
      "Certificato di partecipazione",
      "Metodo Interlingua",
    ],
    pageLink: "/formazione-in-presenza",
    pageAnchor: "corsi-gruppo",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["Base", "Intermedio", "Avanzato"],
      },
      {
        name: "moduli",
        label: "Moduli",
        values: ["1 modulo (6 settimane)", "2 moduli (12 settimane)"],
      },
      {
        name: "sede",
        label: "Sede",
        values: ["Vicenza", "Thiene (VI)"],
      },
    ],
    variations: [
      { options: { moduli: "1 modulo (6 settimane)" }, price: "340.00" },
      { options: { moduli: "2 moduli (12 settimane)" }, price: "630.00" },
    ],
    priceRange: { min: "340.00", max: "630.00" },
  },
  {
    slug: "individuali-presenza",
    name: "Corsi Individuali o Semi-Individuali in Presenza",
    category: "Formazione in Presenza",
    description: "Lezioni personalizzate in presenza con docente madrelingua. Pacchetti da 6, 12, 18 o 24 ore per massima flessibilità.",
    price: "300.00",
    priceLabel: "da",
    duration: "Pacchetti da 6 a 24 ore",
    features: [
      "Lezioni 1-to-1 personalizzate",
      "Docente madrelingua dedicato",
      "Orari flessibili",
      "Certificato di competenza",
    ],
    pageLink: "/formazione-in-presenza",
    pageAnchor: "corsi-individuali",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["Base", "Intermedio", "Avanzato"],
      },
      {
        name: "ore",
        label: "Pacchetto ore",
        values: ["6 ore", "12 ore", "18 ore", "24 ore"],
      },
    ],
    variations: [
      { options: { ore: "6 ore" }, price: "300.00" },
      { options: { ore: "12 ore" }, price: "575.00" },
      { options: { ore: "18 ore" }, price: "830.00" },
      { options: { ore: "24 ore" }, price: "1060.00" },
    ],
    priceRange: { min: "300.00", max: "1060.00" },
  },
  {
    slug: "individuale-blended",
    name: "Corso Individuale Blended in Presenza",
    category: "Formazione in Presenza",
    description: "Formazione individuale che combina lezioni in sede con docente madrelingua e piattaforma e-learning attiva 24/7.",
    price: "645.00",
    priceLabel: "corso completo",
    duration: "12 settimane",
    features: [
      "Lezioni 1-to-1 in sede",
      "Piattaforma e-learning 24/7",
      "Docente madrelingua dedicato",
      "Orari flessibili",
    ],
    pageLink: "/formazione-in-presenza",
    pageAnchor: "corso-blended",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["Base", "Intermedio", "Avanzato"],
      },
    ],
  },
  {
    slug: "corso-booster",
    name: "Corso Booster di Gruppo in Aula",
    category: "Formazione in Presenza",
    description: "Corso intensivo di gruppo in aula, ideale per un avanzamento rapido durante le settimane estive.",
    price: "180.00",
    priceLabel: "corso completo",
    duration: "1 settimana intensiva",
    features: [
      "Corso intensivo in aula",
      "Piccolo gruppo",
      "Docente madrelingua",
      "Ideale per l'estate",
    ],
    pageLink: "/formazione-in-presenza",
    pageAnchor: "courses-section",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["Base", "Intermedio", "Avanzato"],
      },
    ],
  },
  {
    slug: "office-senza-segreti",
    name: "Office Senza Segreti",
    category: "Formazione in Presenza",
    description: "Padroneggia Excel, Word, PowerPoint e Copilot. Corso pratico con esercitazioni reali per la produttività quotidiana.",
    price: "340.00",
    priceLabel: "corso completo",
    duration: "Corso completo",
    features: [
      "Excel avanzato e formule",
      "Word e PowerPoint professionale",
      "Copilot e strumenti AI",
      "Esercitazioni pratiche",
    ],
    pageLink: "/formazione-in-presenza",
    pageAnchor: "office",
  },
  {
    slug: "ai-senza-segreti",
    name: "AI Senza Segreti",
    category: "Formazione in Presenza",
    description: "Scopri come l'Intelligenza Artificiale puo diventare il tuo alleato quotidiano. ChatGPT, Claude, Gemini, DALL-E e molto altro.",
    price: "340.00",
    priceLabel: "corso completo",
    duration: "Corso completo",
    features: [
      "ChatGPT, Claude e Gemini",
      "Prompt engineering",
      "Generazione immagini AI",
      "Applicazioni pratiche",
    ],
    pageLink: "/formazione-in-presenza",
    pageAnchor: "ai",
  },
  {
    slug: "full-immersion",
    name: "Full Immersion Workshop di Lingua Inglese",
    category: "Formazione in Presenza",
    description: "Workshop intensivo di inglese in presenza, disponibile in formato collettivo, semi-individuale o individuale.",
    price: "450.00",
    priceLabel: "da",
    duration: "1 settimana",
    features: [
      "Immersione totale nella lingua",
      "Docenti madrelingua qualificati",
      "Formato collettivo, semi o individuale",
      "Certificato finale",
    ],
    pageLink: "/full-immersion",
    options: [
      {
        name: "tipo",
        label: "Tipo di classe",
        values: [
          "Collettivo (da 5 a 8 partecipanti)",
          "Semi-Individuale (da 2 a 4 partecipanti)",
          "Individuale (1 to 1)",
        ],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["Intermedio", "Avanzato"],
      },
    ],
    variations: [
      { options: { tipo: "Collettivo (da 5 a 8 partecipanti)" }, price: "450.00" },
      { options: { tipo: "Semi-Individuale (da 2 a 4 partecipanti)" }, price: "840.00" },
      { options: { tipo: "Individuale (1 to 1)" }, price: "1620.00" },
    ],
    priceRange: { min: "450.00", max: "1620.00" },
  },
  {
    slug: "experiential-workshop",
    name: "Experiential Workshop",
    category: "Formazione in Presenza",
    description: "Workshop esperienziale di lingua inglese. Settimana intera o weekend intensivo con optional di consolidamento.",
    price: "550.00",
    priceLabel: "da",
    duration: "Weekend o settimana",
    features: [
      "Apprendimento esperienziale",
      "Formato weekend o settimana",
      "Optional e-learning o conversazione",
      "Certificato finale",
    ],
    pageLink: "/formazione-in-presenza",
    pageAnchor: "courses-section",
    options: [
      {
        name: "durata",
        label: "Durata",
        values: ["Weekend (venerdi pom. + sabato)", "Settimana (dal lunedi al venerdi)"],
      },
      {
        name: "optional",
        label: "Optional",
        values: [
          "Nessun Optional",
          "Foundation & Consolidation: 3 mesi di e-learning",
          "Foundation & Consolidation: 6 mesi di conversazione",
        ],
      },
    ],
    variations: [
      { options: { durata: "Weekend (venerdi pom. + sabato)", optional: "Nessun Optional" }, price: "550.00" },
      { options: { durata: "Weekend (venerdi pom. + sabato)", optional: "Foundation & Consolidation: 3 mesi di e-learning" }, price: "600.00" },
      { options: { durata: "Weekend (venerdi pom. + sabato)", optional: "Foundation & Consolidation: 6 mesi di conversazione" }, price: "600.00" },
      { options: { durata: "Settimana (dal lunedi al venerdi)", optional: "Nessun Optional" }, price: "1100.00" },
      { options: { durata: "Settimana (dal lunedi al venerdi)", optional: "Foundation & Consolidation: 3 mesi di e-learning" }, price: "1150.00" },
      { options: { durata: "Settimana (dal lunedi al venerdi)", optional: "Foundation & Consolidation: 6 mesi di conversazione" }, price: "1150.00" },
    ],
    priceRange: { min: "550.00", max: "1150.00" },
  },
  {
    slug: "camclass-selflearning",
    name: "Corso di Lingue Online - Self-Learning e Tutor",
    category: "Corsi E-Learning",
    description: "Corso online su piattaforma e-learning con AI e riconoscimento vocale. Modalita self-learning o blended con tutor madrelingua via Zoom.",
    price: "25.00",
    priceLabel: "da",
    duration: "Da 1 a 6 mesi",
    features: [
      "Piattaforma e-learning 24/7 con AI",
      "Riconoscimento vocale avanzato",
      "Community internazionale",
      "Certificato CEFR finale",
    ],
    pageLink: "/corsi-e-learning",
    pageAnchor: "self-learning",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Portoghese", "Italiano"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["A1 (principiante)", "A2 (elementare)", "B1 (intermedio)", "B2 (post-intermedio)", "C1 (avanzato)"],
      },
      {
        name: "durata",
        label: "Durata",
        values: ["1 mese", "3 mesi", "6 mesi"],
      },
      {
        name: "lezioni",
        label: "Lezioni con tutor",
        values: ["Self-learning (nessuna lezione)", "2 al mese (blended)", "4 al mese (full blended)"],
      },
    ],
    variations: [
      { options: { durata: "1 mese", lezioni: "Self-learning (nessuna lezione)" }, price: "25.00" },
      { options: { durata: "1 mese", lezioni: "2 al mese (blended)" }, price: "72.00" },
      { options: { durata: "1 mese", lezioni: "4 al mese (full blended)" }, price: "115.00" },
      { options: { durata: "3 mesi", lezioni: "Self-learning (nessuna lezione)" }, price: "70.00" },
      { options: { durata: "3 mesi", lezioni: "2 al mese (blended)" }, price: "190.00" },
      { options: { durata: "3 mesi", lezioni: "4 al mese (full blended)" }, price: "300.00" },
      { options: { durata: "6 mesi", lezioni: "Self-learning (nessuna lezione)" }, price: "130.00" },
    ],
    priceRange: { min: "25.00", max: "300.00" },
  },
  {
    slug: "camclass-gruppo",
    name: "Cam-Class Blended di Gruppo",
    category: "Corsi E-Learning",
    description: "Lezioni online di gruppo con tutor madrelingua via Zoom, combinate con piattaforma e-learning interattiva 24/7.",
    price: "60.00",
    priceLabel: "da",
    duration: "Da 1 a 4 mesi",
    features: [
      "Lezioni live via Zoom",
      "Tutor madrelingua qualificato",
      "Piattaforma e-learning 24/7",
      "Certificato CEFR finale",
    ],
    pageLink: "/corsi-e-learning",
    pageAnchor: "gruppo",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Portoghese", "Russo"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["A1 (principiante)", "A2 (elementare)", "B1 (intermedio)", "B2 (post-intermedio)", "C1 (avanzato)"],
      },
      {
        name: "durata",
        label: "Durata",
        values: ["1 mese", "2 mesi", "4 mesi (livello completo)"],
      },
    ],
    variations: [
      { options: { durata: "1 mese" }, price: "60.00" },
      { options: { durata: "2 mesi" }, price: "110.00" },
      { options: { durata: "4 mesi (livello completo)" }, price: "200.00" },
    ],
    priceRange: { min: "60.00", max: "200.00" },
  },
  {
    slug: "camclass-individuale",
    name: "Cam-Class Corso Individuale o Semi-Individuale",
    category: "Corsi E-Learning",
    description: "Percorso individuale online con tutor madrelingua dedicato. Pacchetti da 6 o 12 lezioni personalizzate.",
    price: "120.00",
    priceLabel: "da",
    duration: "6 o 12 lezioni",
    features: [
      "Lezioni 1-to-1 via Zoom",
      "Orari flessibili con prenotazione app",
      "Programma personalizzato",
      "Certificato finale",
    ],
    pageLink: "/corsi-e-learning",
    pageAnchor: "individuale",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano", "Portoghese"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["A1 (principiante)", "A2 (elementare)", "B1 (intermedio)", "B2 (post-intermedio)", "C1 (avanzato)"],
      },
      {
        name: "tipo",
        label: "Tipo",
        values: ["Individuale", "Semi-individuale"],
      },
      {
        name: "lezioni",
        label: "Numero lezioni",
        values: ["6 lezioni", "12 lezioni"],
      },
    ],
    variations: [
      { options: { lezioni: "6 lezioni" }, price: "120.00" },
      { options: { lezioni: "12 lezioni" }, price: "230.00" },
    ],
    priceRange: { min: "120.00", max: "230.00" },
  },
  {
    slug: "preparazione-certificazione",
    name: "Percorso di Certificazione Linguistica",
    category: "Corsi E-Learning",
    description: "Preparazione esami MIUR: LanguageCert, IELTS, Cambridge, Trinity, DELF, DELE, Goethe. Con opzione esame incluso.",
    price: "140.00",
    priceLabel: "da",
    duration: "12 lezioni + 60h e-learning",
    features: [
      "Tutor madrelingua specializzato",
      "Simulazioni di esame incluse",
      "12 lezioni live su Zoom",
      "60 ore piattaforma e-learning",
    ],
    pageLink: "/corsi-e-learning",
    pageAnchor: "certificazione",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Spagnolo", "Francese", "Tedesco"],
      },
      {
        name: "certificazione",
        label: "Certificazione",
        values: ["LanguageCert", "IELTS", "Cambridge", "Trinity", "DELF", "DELE", "Goethe-Zertifikat", "Altra Certificazione"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["A2 (elementare)", "B1 (intermedio)", "B2 (post-intermedio)", "C1 (avanzato)", "C2 (bilinguismo)"],
      },
      {
        name: "corso",
        label: "Tipo di percorso",
        values: ["Standard", "Ipermediale", "Standard + Esame", "Ipermediale + Esame", "Solo Esame"],
      },
    ],
    variations: [
      { options: { corso: "Solo Esame" }, price: "140.00" },
      { options: { corso: "Standard" }, price: "230.00" },
      { options: { corso: "Ipermediale" }, price: "295.00" },
      { options: { corso: "Standard + Esame" }, price: "370.00" },
      { options: { corso: "Ipermediale + Esame" }, price: "585.00" },
    ],
    priceRange: { min: "140.00", max: "585.00" },
  },
  {
    slug: "conversazione-individuale",
    name: "Cam-Class Conversazione Individuale",
    category: "Corsi E-Learning",
    description: "Sessioni di conversazione individuale con docente madrelingua per sviluppare fluency e sicurezza nella lingua.",
    price: "95.00",
    priceLabel: "5 lezioni",
    duration: "5 lezioni da 30 minuti",
    features: [
      "5 sessioni di 30 minuti",
      "Docente madrelingua dedicato",
      "Focus sulla conversazione",
      "Feedback personalizzato",
    ],
    pageLink: "/corsi-e-learning",
    pageAnchor: "conversazione",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Italiano", "Russo", "Portoghese"],
      },
    ],
  },
  {
    slug: "camclass-minigruppi",
    name: "Cam-Class Corso in Mini-Gruppi",
    category: "Corsi E-Learning",
    description: "Corso online in piccoli gruppi (max 5) con tutor madrelingua. 12 lezioni live via Zoom + piattaforma e-learning.",
    price: "230.00",
    priceLabel: "12 lezioni",
    duration: "12 lezioni",
    features: [
      "Max 5 partecipanti",
      "Lezioni live via Zoom",
      "Tutor madrelingua dedicato",
      "Piattaforma e-learning 24/7",
    ],
    pageLink: "/corsi-e-learning",
    pageAnchor: "mini-gruppi",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano"],
      },
      {
        name: "livello",
        label: "Livello",
        values: ["A1 (principiante)", "A2 (elementare)", "B1 (intermedio)", "B2 (post-intermedio)", "C1 (avanzato)"],
      },
    ],
  },
  {
    slug: "coaching-in-sede",
    name: "Coaching Individuale in Sede",
    category: "Language Coaching",
    description: "Percorso di coaching linguistico individuale nella sede di Vicenza o Thiene. Approccio personalizzato e risultati concreti.",
    price: "390.00",
    priceLabel: "modulare",
    duration: "Modulare",
    features: [
      "Sessioni 1-to-1 in sede",
      "Coach madrelingua dedicato",
      "Piano personalizzato",
      "Report progressi periodico",
    ],
    pageLink: "/language-coaching",
    pageAnchor: "coaching-presenza",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano"],
      },
    ],
  },
  {
    slug: "coaching-blended",
    name: "Coaching Blended (Presenza + Online)",
    category: "Language Coaching",
    description: "Il meglio dei due mondi: sessioni in sede con coach + piattaforma e-learning 24/7 con AI e riconoscimento vocale.",
    price: "840.00",
    priceLabel: "12 settimane",
    duration: "12 settimane intensive",
    features: [
      "Coach madrelingua in sede",
      "Piattaforma e-learning 24/7 con AI",
      "Riconoscimento vocale avanzato",
      "Certificato CEFR finale",
    ],
    pageLink: "/language-coaching",
    pageAnchor: "coaching-blended",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano"],
      },
    ],
  },
  {
    slug: "coaching-online",
    name: "Coaching Individuale Online",
    category: "Language Coaching",
    description: "Coaching linguistico individuale interamente online. 12 sessioni con coach madrelingua dedicato via Zoom.",
    price: "300.00",
    priceLabel: "12 sessioni",
    duration: "12 sessioni",
    features: [
      "12 sessioni online via Zoom",
      "Coach madrelingua dedicato",
      "Orari flessibili con prenotazione app",
      "Report di progresso dettagliato",
    ],
    pageLink: "/language-coaching",
    pageAnchor: "coaching-online",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano", "Portoghese"],
      },
    ],
  },
  {
    slug: "fluency-coaching",
    name: "Fluency Coaching Intensivo",
    category: "Language Coaching",
    description: "5 sessioni intensive focalizzate sulla scioltezza orale. Per chi sa la grammatica ma le parole non escono.",
    price: "125.00",
    priceLabel: "5 sessioni",
    duration: "5 sessioni da 30 minuti",
    features: [
      "5 sessioni intensive via Zoom",
      "Focus esclusivo su fluency",
      "Tecniche anti-blocco linguistico",
      "Coach madrelingua dedicato",
    ],
    pageLink: "/language-coaching",
    pageAnchor: "coaching-fluency",
    options: [
      {
        name: "lingua",
        label: "Lingua",
        values: ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano", "Portoghese"],
      },
    ],
  },
  {
    slug: "italiano-intensivo-15",
    name: "Italiano Intensivo Collettivo 15",
    category: "Corsi di Italiano per Stranieri",
    description: "Corso intensivo di italiano con 15 lezioni settimanali in piccoli gruppi a Vicenza. Ideale per un'immersione rapida.",
    price: "275.00",
    priceLabel: "a settimana",
    duration: "Minimo 1 settimana",
    features: [
      "15 lezioni/settimana",
      "Gruppi ridotti",
      "Attivita culturali",
      "Certificato finale",
    ],
    pageLink: "/corsi-italiano",
    pageAnchor: "italian-courses",
  },
  {
    slug: "italiano-intensivo-20",
    name: "Italiano Intensivo Collettivo 20",
    category: "Corsi di Italiano per Stranieri",
    description: "Corso super-intensivo di italiano con 20 lezioni settimanali. Massima immersione linguistica a Vicenza.",
    price: "360.00",
    priceLabel: "a settimana",
    duration: "Minimo 1 settimana",
    features: [
      "20 lezioni/settimana",
      "Gruppi ridotti",
      "Attivita culturali",
      "Certificato finale",
    ],
    pageLink: "/corsi-italiano",
    pageAnchor: "italian-courses",
  },
];

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug);
}

export function getEffectivePrice(product: ShopProduct, selectedOptions?: Record<string, string>): string {
  if (!product.variations || !selectedOptions) {
    return product.price;
  }

  const match = product.variations.find((v) => {
    return Object.entries(v.options).every(
      ([key, value]) => selectedOptions[key] === value,
    );
  });

  return match ? match.price : product.price;
}

export function formatPriceDisplay(product: ShopProduct): string {
  if (product.priceRange) {
    return `${parseFloat(product.priceRange.min).toFixed(0)} - ${parseFloat(product.priceRange.max).toFixed(0)}`;
  }
  return parseFloat(product.price).toFixed(0);
}
