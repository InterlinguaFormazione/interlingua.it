import { useEffect } from "react";

const PROVIDER = {
  "@type": ["EducationalOrganization", "LanguageSchool"],
  name: "SkillCraft-Interlingua",
  url: "https://skillcraft-interlingua.it",
  telephone: "+390444321601",
  email: "postpec@pec.interlingua.it",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Viale Giuseppe Mazzini 27",
    addressLocality: "Vicenza",
    postalCode: "36100",
    addressRegion: "VI",
    addressCountry: "IT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.5455,
    longitude: 11.5354,
  },
};

function useJsonLd(schema: Record<string, unknown> | Record<string, unknown>[]) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-schema", "true");
    script.textContent = JSON.stringify(
      Array.isArray(schema)
        ? schema.map((s) => ({ "@context": "https://schema.org", ...s }))
        : { "@context": "https://schema.org", ...schema }
    );
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
}

export function FormazionePresenzaSchema() {
  useJsonLd([
    {
      "@type": "Course",
      name: "Corsi di Gruppo in Presenza",
      description:
        "Corsi collettivi di lingua straniera in piccoli gruppi nelle sedi di Vicenza e Thiene, con docenti madrelingua qualificati.",
      provider: PROVIDER,
      courseMode: "onsite",
      locationCreated: "Vicenza",
      availableLanguage: ["Inglese", "Francese", "Spagnolo", "Tedesco", "Russo"],
      offers: {
        "@type": "Offer",
        price: "340",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Corsi Individuali o Semi-Individuali in Presenza",
      description:
        "Apprendimento personalizzato con docenti qualificati, lezioni su misura e massima flessibilità.",
      provider: PROVIDER,
      courseMode: "onsite",
      locationCreated: "Vicenza",
      availableLanguage: ["Inglese", "Francese", "Spagnolo", "Tedesco", "Russo"],
      offers: {
        "@type": "Offer",
        price: "300",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Corso Individuale Blended",
      description:
        "Lezioni individuali in sede con docente qualificato integrate dalla piattaforma e-learning attiva 24/7.",
      provider: PROVIDER,
      courseMode: ["onsite", "online"],
      locationCreated: "Vicenza",
      availableLanguage: ["Inglese", "Francese", "Spagnolo", "Tedesco", "Russo"],
      offers: {
        "@type": "Offer",
        price: "645",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Office senza segreti",
      description:
        "Corso pratico per padroneggiare Excel, Word, PowerPoint e Copilot.",
      provider: PROVIDER,
      courseMode: "onsite",
      locationCreated: "Vicenza",
      offers: {
        "@type": "Offer",
        price: "340",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "AI senza segreti",
      description:
        "Scopri come l'Intelligenza Artificiale può diventare il tuo alleato quotidiano.",
      provider: PROVIDER,
      courseMode: "onsite",
      locationCreated: "Vicenza",
      offers: {
        "@type": "Offer",
        price: "340",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
  ]);
  return null;
}

export function CorsiELearningSchema() {
  useJsonLd([
    {
      "@type": "Course",
      name: "Cam-Class Blended Individuale e Self-Learning",
      description:
        "Corso di lingua online con piattaforma e-learning moderna e tutor qualificato via Zoom.",
      provider: PROVIDER,
      courseMode: "online",
      availableLanguage: ["Inglese", "Francese", "Spagnolo", "Tedesco", "Russo", "Portoghese", "Italiano"],
      offers: {
        "@type": "Offer",
        price: "25",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Cam-Class Blended di Gruppo",
      description:
        "Corso blended con lezioni live via Zoom e piattaforma e-learning interattiva.",
      provider: PROVIDER,
      courseMode: "online",
      availableLanguage: ["Inglese", "Francese", "Spagnolo", "Tedesco", "Russo", "Portoghese"],
      offers: {
        "@type": "Offer",
        price: "60",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Cam-Class Corso Individuale o Semi-Individuale",
      description:
        "Formazione linguistica online modulare per 1 o 2 partecipanti con programma personalizzato.",
      provider: PROVIDER,
      courseMode: "online",
      availableLanguage: ["Inglese", "Francese", "Spagnolo", "Tedesco", "Russo", "Portoghese", "Italiano"],
      offers: {
        "@type": "Offer",
        price: "230",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Percorso di Preparazione a Certificazione Linguistica",
      description:
        "Preparazione esami MIUR: LanguageCert, IELTS, TOEFL, Cambridge, Trinity, DELF, DELE, Goethe.",
      provider: PROVIDER,
      courseMode: "online",
      availableLanguage: ["Inglese", "Francese", "Spagnolo", "Tedesco"],
      offers: {
        "@type": "Offer",
        price: "230",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
  ]);
  return null;
}

export function CorsiItalianoSchema() {
  useJsonLd([
    {
      "@type": "LanguageSchool",
      name: "SkillCraft-Interlingua - Corsi di Italiano per Stranieri",
      url: "https://skillcraft-interlingua.it/corsi-italiano",
      description:
        "Corsi di italiano per stranieri a Vicenza. Intensivi, individuali e online con docenti qualificati.",
      address: PROVIDER.address,
      geo: PROVIDER.geo,
      availableLanguage: "Italiano",
    },
    {
      "@type": "Course",
      name: "Corso Intensivo Collettivo 15",
      description:
        "Corso intensivo di italiano in piccoli gruppi a Vicenza. 15 lezioni a settimana con approccio comunicativo.",
      provider: PROVIDER,
      courseMode: "onsite",
      locationCreated: "Vicenza",
      availableLanguage: "Italiano",
      offers: {
        "@type": "Offer",
        price: "275",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Corso Intensivo Collettivo 20",
      description:
        "Corso super-intensivo di italiano a Vicenza. 20 lezioni a settimana per massima immersione linguistica.",
      provider: PROVIDER,
      courseMode: "onsite",
      locationCreated: "Vicenza",
      availableLanguage: "Italiano",
      offers: {
        "@type": "Offer",
        price: "360",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Italiano Individuale in Presenza",
      description:
        "Lezioni individuali di italiano in sede a Vicenza con docente qualificato.",
      provider: PROVIDER,
      courseMode: "onsite",
      locationCreated: "Vicenza",
      availableLanguage: "Italiano",
      offers: {
        "@type": "Offer",
        price: "300",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Course",
      name: "Italiano Individuale Online",
      description:
        "Lezioni individuali di italiano online via Zoom con docente qualificato.",
      provider: PROVIDER,
      courseMode: "online",
      availableLanguage: "Italiano",
      offers: {
        "@type": "Offer",
        price: "300",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
  ]);
  return null;
}

export function FullImmersionSchema() {
  useJsonLd({
    "@type": "Course",
    name: "Full Immersion Workshop di Lingua Inglese",
    description:
      "Workshop intensivo di inglese a Vicenza. 5 giorni di immersione totale con 30+ ore frontali. Formati collettivo, semi-individuale e individuale.",
    provider: PROVIDER,
    courseMode: "onsite",
    locationCreated: "Vicenza",
    availableLanguage: "Inglese",
    timeRequired: "P5D",
    offers: [
      {
        "@type": "Offer",
        name: "FIW Collettivo",
        price: "450",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "FIW Semi-Individuale",
        price: "840",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "FIW Individuale",
        price: "1620",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    ],
  });
  return null;
}

export function BlogPostSchema({
  title,
  excerpt,
  slug,
  category,
  createdAt,
  authorName,
}: {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  createdAt: string;
  authorName?: string;
}) {
  useJsonLd({
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    url: `https://skillcraft-interlingua.it/blog/${slug}`,
    datePublished: createdAt,
    author: {
      "@type": "Person",
      name: authorName || "Staff Interlingua Formazione",
    },
    publisher: {
      "@type": "Organization",
      name: "SkillCraft-Interlingua",
      url: "https://skillcraft-interlingua.it",
    },
    articleSection: category,
    inLanguage: "it",
  });
  return null;
}

export function ShopProductSchema({
  name,
  description,
  price,
  slug,
  category,
}: {
  name: string;
  description: string;
  price: string;
  slug: string;
  category: string;
}) {
  useJsonLd({
    "@type": "Product",
    name,
    description,
    url: `https://skillcraft-interlingua.it/shop/product/${slug}`,
    category,
    brand: {
      "@type": "Organization",
      name: "SkillCraft-Interlingua",
    },
    offers: {
      "@type": "Offer",
      price: parseFloat(price).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "SkillCraft-Interlingua",
      },
    },
  });
  return null;
}

export function LanguageTestSchema({ language, href }: { language: string; href: string }) {
  useJsonLd({
    "@type": "LearningResource",
    name: `Test di Livello ${language} Gratuito Online`,
    description: `Test di posizionamento adattivo gratuito per valutare le competenze di ${language} secondo il framework CEFR. Livelli da A0 a C1.`,
    url: `https://skillcraft-interlingua.it${href}`,
    provider: PROVIDER,
    learningResourceType: "Quiz",
    educationalLevel: "A0-C1",
    isAccessibleForFree: true,
    inLanguage: language === "Inglese" ? "en" : language === "Italiano" ? "it" : language === "Tedesco" ? "de" : language === "Francese" ? "fr" : language === "Spagnolo" ? "es" : "en",
  });
  return null;
}

export function LanguageTestsPageSchema() {
  useJsonLd({
    "@type": "CollectionPage",
    name: "Test di Livello Linguistico Gratuiti Online",
    description:
      "Test adattivi gratuiti per valutare le competenze linguistiche in inglese, italiano, tedesco, francese e spagnolo secondo il CEFR.",
    url: "https://skillcraft-interlingua.it/language-tests",
    provider: PROVIDER,
    hasPart: [
      { "@type": "LearningResource", name: "Test di Inglese", url: "https://skillcraft-interlingua.it/english-test" },
      { "@type": "LearningResource", name: "Test di Italiano", url: "https://skillcraft-interlingua.it/italian-test" },
      { "@type": "LearningResource", name: "Test di Tedesco", url: "https://skillcraft-interlingua.it/german-test" },
      { "@type": "LearningResource", name: "Test di Francese", url: "https://skillcraft-interlingua.it/french-test" },
      { "@type": "LearningResource", name: "Test di Spagnolo", url: "https://skillcraft-interlingua.it/spanish-test" },
    ],
  });
  return null;
}

export function ChiSiamoSchema() {
  useJsonLd({
    "@type": "AboutPage",
    name: "Chi Siamo - SkillCraft-Interlingua",
    description:
      "Oltre 30 anni di esperienza nella formazione professionale. Primo ente accreditato in Veneto, leader nell'integrazione di lingue, AI e competenze digitali.",
    url: "https://skillcraft-interlingua.it/chi-siamo",
    mainEntity: {
      ...PROVIDER,
      foundingDate: "1993",
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: 50,
      },
      areaServed: ["Vicenza", "Thiene", "Veneto", "Italia", "Online worldwide"],
    },
  });
  return null;
}
