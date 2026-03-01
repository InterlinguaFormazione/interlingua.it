import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { GraduationCap, ArrowRight, Globe, CheckCircle, Clock } from "lucide-react";

const languageTests = [
  {
    id: "english",
    language: "English",
    flag: "🇬🇧",
    href: "/english-test",
    available: true,
    description: "Adaptive placement test covering grammar, vocabulary, use of English, reading, listening, writing, and speaking.",
    levels: "A0 - C1",
    duration: "20-35 min",
    sections: 7,
  },
  {
    id: "business-english",
    language: "Business English",
    flag: "🇬🇧",
    href: "/business-english-test",
    available: true,
    description: "Quick adaptive test for professional and corporate English skills. Shorter format ideal for HR assessments and corporate training needs.",
    levels: "A0 - C1",
    duration: "10-15 min",
    sections: 7,
  },
  {
    id: "italian",
    language: "Italiano",
    flag: "🇮🇹",
    href: "/italian-test",
    available: false,
    description: "Test di posizionamento adattivo per valutare le competenze di italiano come lingua straniera.",
    levels: "A0 - C1",
    duration: "20-35 min",
    sections: 7,
  },
  {
    id: "german",
    language: "Deutsch",
    flag: "🇩🇪",
    href: "/german-test",
    available: false,
    description: "Adaptiver Einstufungstest zur Bewertung Ihrer Deutschkenntnisse.",
    levels: "A0 - C1",
    duration: "20-35 min",
    sections: 7,
  },
  {
    id: "french",
    language: "Fran\u00e7ais",
    flag: "🇫🇷",
    href: "/french-test",
    available: false,
    description: "Test de placement adaptatif pour \u00e9valuer vos comp\u00e9tences en fran\u00e7ais.",
    levels: "A0 - C1",
    duration: "20-35 min",
    sections: 7,
  },
  {
    id: "spanish",
    language: "Espa\u00f1ol",
    flag: "🇪🇸",
    href: "/spanish-test",
    available: false,
    description: "Prueba de nivel adaptativa para evaluar tus competencias en espa\u00f1ol.",
    levels: "A0 - C1",
    duration: "20-35 min",
    sections: 7,
  },
];

export default function LanguageTestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-violet-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <Navigation />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-medium mb-5 border border-blue-100 dark:border-blue-800/40 shadow-sm">
              <Globe className="w-4 h-4" />
              Test di Livello
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-200 bg-clip-text text-transparent leading-tight" data-testid="text-page-title">
              Scopri il Tuo Livello<br className="hidden md:block" /> Linguistico
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-base max-w-lg mx-auto">
              Test adattivi gratuiti che si adattano alle tue risposte per valutare con precisione le tue competenze linguistiche secondo il framework CEFR.
            </p>
          </div>

          <div className="grid gap-5">
            {languageTests.map((test) => (
              <div key={test.id}>
                {test.available ? (
                  <Link href={test.href} data-testid={`link-test-${test.id}`}>
                    <Card className="group cursor-pointer border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm">
                      <CardContent className="p-6 flex items-center gap-6">
                        <div className="text-5xl flex-shrink-0">{test.flag}</div>
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
                      <div className="text-5xl flex-shrink-0 grayscale">{test.flag}</div>
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
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
