import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { GraduationCap, ArrowRight, Globe, CheckCircle, Clock } from "lucide-react";

function FlagGB() {
  return (
    <svg viewBox="0 0 60 40" className="w-14 h-10 rounded-lg shadow-md border border-slate-200/50 dark:border-slate-600/50">
      <rect width="60" height="40" fill="#012169"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="6.5"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  );
}

function FlagIT() {
  return (
    <svg viewBox="0 0 60 40" className="w-14 h-10 rounded-lg shadow-md border border-slate-200/50 dark:border-slate-600/50">
      <rect width="20" height="40" fill="#009246"/>
      <rect x="20" width="20" height="40" fill="#fff"/>
      <rect x="40" width="20" height="40" fill="#CE2B37"/>
    </svg>
  );
}

function FlagDE() {
  return (
    <svg viewBox="0 0 60 40" className="w-14 h-10 rounded-lg shadow-md border border-slate-200/50 dark:border-slate-600/50">
      <rect width="60" height="13.33" fill="#000"/>
      <rect y="13.33" width="60" height="13.33" fill="#DD0000"/>
      <rect y="26.67" width="60" height="13.33" fill="#FFCC00"/>
    </svg>
  );
}

function FlagFR() {
  return (
    <svg viewBox="0 0 60 40" className="w-14 h-10 rounded-lg shadow-md border border-slate-200/50 dark:border-slate-600/50">
      <rect width="20" height="40" fill="#002395"/>
      <rect x="20" width="20" height="40" fill="#fff"/>
      <rect x="40" width="20" height="40" fill="#ED2939"/>
    </svg>
  );
}

function FlagES() {
  return (
    <svg viewBox="0 0 60 40" className="w-14 h-10 rounded-lg shadow-md border border-slate-200/50 dark:border-slate-600/50">
      <rect width="60" height="10" fill="#AA151B"/>
      <rect y="10" width="60" height="20" fill="#F1BF00"/>
      <rect y="30" width="60" height="10" fill="#AA151B"/>
    </svg>
  );
}

const flagComponents: Record<string, () => JSX.Element> = {
  english: FlagGB,
  italian: FlagIT,
  german: FlagDE,
  french: FlagFR,
  spanish: FlagES,
};

const languageTests = [
  {
    id: "english",
    language: "English",
    href: "/english-test",
    available: true,
    description: "Adaptive placement test covering grammar, vocabulary, use of English, reading, listening, writing, and speaking.",
    levels: "A0 - C1",
    duration: "20-35 min",
    sections: 7,
  },
  {
    id: "italian",
    language: "Italiano",
    href: "/italian-test",
    available: true,
    description: "Test di posizionamento adattivo per valutare le competenze di italiano come lingua straniera.",
    levels: "A0 - C1",
    duration: "15-25 min",
    sections: 5,
  },
  {
    id: "german",
    language: "Deutsch",
    href: "/german-test",
    available: true,
    description: "Adaptiver Einstufungstest zur Bewertung Ihrer Deutschkenntnisse.",
    levels: "A0 - C1",
    duration: "15-25 min",
    sections: 5,
  },
  {
    id: "french",
    language: "Français",
    href: "/french-test",
    available: true,
    description: "Test de placement adaptatif pour évaluer vos compétences en français.",
    levels: "A0 - C1",
    duration: "15-25 min",
    sections: 5,
  },
  {
    id: "spanish",
    language: "Español",
    href: "/spanish-test",
    available: true,
    description: "Prueba de nivel adaptativa para evaluar tus competencias en español.",
    levels: "A0 - C1",
    duration: "15-25 min",
    sections: 5,
  },
];

export default function LanguageTestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-violet-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <Navigation />

      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-medium mb-5 border border-blue-100 dark:border-blue-800/40 shadow-sm">
              <Globe className="w-4 h-4" />
              Test di Livello
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-200 bg-clip-text text-transparent leading-normal pb-2" data-testid="text-page-title">
              Scopri il Tuo Livello<br className="hidden md:block" /> Linguistico
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-base max-w-lg mx-auto">
              Test adattivi gratuiti che si adattano alle tue risposte per valutare con precisione le tue competenze linguistiche secondo il framework CEFR.
            </p>
          </div>

          <div className="grid gap-5">
            {languageTests.map((test) => {
              const FlagComponent = flagComponents[test.id];
              return (
                <div key={test.id}>
                  {test.available ? (
                    <Link href={test.href} data-testid={`link-test-${test.id}`}>
                      <Card className="group cursor-pointer border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm">
                        <CardContent className="p-6 flex items-center gap-6">
                          <div className="flex-shrink-0">
                            <FlagComponent />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white" data-testid={`text-language-${test.id}`}>
                                {test.language}
                              </h2>
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0" data-testid={`badge-available-${test.id}`}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Disponibile
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{test.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5" />
                                {test.levels}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {test.duration}
                              </span>
                              <span>{test.sections} sezioni</span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="border border-slate-200/60 dark:border-slate-700/40 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm opacity-70" data-testid={`card-test-${test.id}`}>
                      <CardContent className="p-6 flex items-center gap-6">
                        <div className="flex-shrink-0 grayscale opacity-60">
                          <FlagComponent />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            <h2 className="text-xl font-bold text-slate-400 dark:text-slate-500" data-testid={`text-language-${test.id}`}>
                              {test.language}
                            </h2>
                            <Badge variant="secondary" className="text-xs" data-testid={`badge-coming-${test.id}`}>
                              Prossimamente
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400 dark:text-slate-500">{test.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
