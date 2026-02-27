import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Award,
  Clock,
  Globe,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Target,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface Question {
  id: number;
  level: string;
  text: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  // A1 - Beginner (Questions 1-8)
  {
    id: 1, level: "A1",
    text: "What ___ your name?",
    options: ["is", "are", "am", "do"],
    correct: 0,
  },
  {
    id: 2, level: "A1",
    text: "She ___ from Italy.",
    options: ["come", "comes", "coming", "is come"],
    correct: 1,
  },
  {
    id: 3, level: "A1",
    text: "I ___ a student.",
    options: ["is", "are", "am", "be"],
    correct: 2,
  },
  {
    id: 4, level: "A1",
    text: "___ you like coffee?",
    options: ["Are", "Is", "Do", "Does"],
    correct: 2,
  },
  {
    id: 5, level: "A1",
    text: "There ___ two cats in the garden.",
    options: ["is", "are", "be", "have"],
    correct: 1,
  },
  {
    id: 6, level: "A1",
    text: "I go to school ___ bus.",
    options: ["with", "in", "by", "on"],
    correct: 2,
  },
  {
    id: 7, level: "A1",
    text: "My sister ___ tennis every Saturday.",
    options: ["play", "plays", "playing", "is play"],
    correct: 1,
  },
  {
    id: 8, level: "A1",
    text: "We ___ got a big house.",
    options: ["has", "have", "is", "are"],
    correct: 1,
  },
  // A2 - Elementary (Questions 9-16)
  {
    id: 9, level: "A2",
    text: "I ___ to the cinema last night.",
    options: ["go", "goes", "went", "gone"],
    correct: 2,
  },
  {
    id: 10, level: "A2",
    text: "She is ___ than her brother.",
    options: ["tall", "taller", "tallest", "more tall"],
    correct: 1,
  },
  {
    id: 11, level: "A2",
    text: "We ___ dinner when the phone rang.",
    options: ["have", "had", "were having", "are having"],
    correct: 2,
  },
  {
    id: 12, level: "A2",
    text: "You ___ smoke in the hospital.",
    options: ["mustn't", "don't have", "haven't", "aren't"],
    correct: 0,
  },
  {
    id: 13, level: "A2",
    text: "He has ___ been to London.",
    options: ["ever", "never", "yet", "already"],
    correct: 1,
  },
  {
    id: 14, level: "A2",
    text: "I'm going ___ my grandparents this weekend.",
    options: ["visit", "visiting", "to visit", "visited"],
    correct: 2,
  },
  {
    id: 15, level: "A2",
    text: "There isn't ___ milk in the fridge.",
    options: ["some", "any", "no", "a"],
    correct: 1,
  },
  {
    id: 16, level: "A2",
    text: "The film was ___ boring that I fell asleep.",
    options: ["too", "very", "so", "such"],
    correct: 2,
  },
  // B1 - Intermediate (Questions 17-24)
  {
    id: 17, level: "B1",
    text: "If it ___ tomorrow, we'll stay at home.",
    options: ["will rain", "rains", "rained", "would rain"],
    correct: 1,
  },
  {
    id: 18, level: "B1",
    text: "She told me that she ___ the book.",
    options: ["reads", "read", "had read", "has read"],
    correct: 2,
  },
  {
    id: 19, level: "B1",
    text: "I wish I ___ more free time.",
    options: ["have", "had", "would have", "having"],
    correct: 1,
  },
  {
    id: 20, level: "B1",
    text: "The car ___ repaired at the moment.",
    options: ["is being", "is", "has been", "was"],
    correct: 0,
  },
  {
    id: 21, level: "B1",
    text: "He asked me where I ___.",
    options: ["live", "lived", "do live", "am living"],
    correct: 1,
  },
  {
    id: 22, level: "B1",
    text: "I ___ English for five years now.",
    options: ["study", "studied", "have been studying", "am studying"],
    correct: 2,
  },
  {
    id: 23, level: "B1",
    text: "You'd better ___ a jacket. It's cold outside.",
    options: ["to take", "take", "taking", "took"],
    correct: 1,
  },
  {
    id: 24, level: "B1",
    text: "Despite ___ tired, she continued working.",
    options: ["be", "being", "was", "to be"],
    correct: 1,
  },
  // B2 - Upper Intermediate (Questions 25-32)
  {
    id: 25, level: "B2",
    text: "By the time we arrived, the film ___.",
    options: ["started", "has started", "had already started", "was starting"],
    correct: 2,
  },
  {
    id: 26, level: "B2",
    text: "I'd rather you ___ smoke in here.",
    options: ["don't", "didn't", "won't", "not"],
    correct: 1,
  },
  {
    id: 27, level: "B2",
    text: "Not until I got home ___ I had left my keys at the office.",
    options: ["I realised", "did I realise", "I did realise", "realised I"],
    correct: 1,
  },
  {
    id: 28, level: "B2",
    text: "She ___ have left already; her coat is still here.",
    options: ["must", "can't", "might", "should"],
    correct: 1,
  },
  {
    id: 29, level: "B2",
    text: "He treats her as if she ___ a child.",
    options: ["is", "were", "was being", "has been"],
    correct: 1,
  },
  {
    id: 30, level: "B2",
    text: "The project is worth ___.",
    options: ["to do", "doing", "done", "do"],
    correct: 1,
  },
  {
    id: 31, level: "B2",
    text: "___ the rain, the match went ahead.",
    options: ["Although", "Despite", "However", "Even"],
    correct: 1,
  },
  {
    id: 32, level: "B2",
    text: "Little ___ he know what was about to happen.",
    options: ["does", "did", "was", "had"],
    correct: 1,
  },
  // C1 - Advanced (Questions 33-40)
  {
    id: 33, level: "C1",
    text: "Had I known you were coming, I ___ a cake.",
    options: ["would bake", "would have baked", "had baked", "will have baked"],
    correct: 1,
  },
  {
    id: 34, level: "C1",
    text: "Hardly had we sat down ___ the lights went out.",
    options: ["than", "when", "that", "as"],
    correct: 1,
  },
  {
    id: 35, level: "C1",
    text: "The suspect is ___ to have fled the country.",
    options: ["told", "said", "believed", "spoken"],
    correct: 2,
  },
  {
    id: 36, level: "C1",
    text: "There's no point ___ about it now.",
    options: ["to worry", "worrying", "worry", "worried"],
    correct: 1,
  },
  {
    id: 37, level: "C1",
    text: "She ___ well have taken the earlier train.",
    options: ["might", "should", "would", "could"],
    correct: 0,
  },
  {
    id: 38, level: "C1",
    text: "So ___ was the damage that the building had to be demolished.",
    options: ["big", "extensive", "large", "wide"],
    correct: 1,
  },
  {
    id: 39, level: "C1",
    text: "Under no circumstances ___ leave the building without permission.",
    options: ["you should", "should you", "you must", "must you"],
    correct: 1,
  },
  {
    id: 40, level: "C1",
    text: "The new law, ___ was passed last month, has proven controversial.",
    options: ["that", "which", "what", "whose"],
    correct: 1,
  },
  // C2 - Proficiency (Questions 41-50)
  {
    id: 41, level: "C2",
    text: "Seldom ___ such a magnificent performance.",
    options: ["I have seen", "have I seen", "I saw", "did I saw"],
    correct: 1,
  },
  {
    id: 42, level: "C2",
    text: "The politician's speech was nothing if not ___.",
    options: ["controversial", "ordinary", "mundane", "predictable"],
    correct: 0,
  },
  {
    id: 43, level: "C2",
    text: "She speaks with such ___ that you'd think she was a native.",
    options: ["fluidity", "fluency", "flowing", "fluidness"],
    correct: 1,
  },
  {
    id: 44, level: "C2",
    text: "The findings ___ our initial hypothesis.",
    options: ["corroborate", "exacerbate", "ameliorate", "exonerate"],
    correct: 0,
  },
  {
    id: 45, level: "C2",
    text: "Were it not for your timely intervention, the outcome ___ been far worse.",
    options: ["will have", "would have", "could", "should"],
    correct: 1,
  },
  {
    id: 46, level: "C2",
    text: "The author's prose is characterised by its ___.",
    options: ["verbosity", "brevity and precision", "ambiguity", "redundancy"],
    correct: 1,
  },
  {
    id: 47, level: "C2",
    text: "His argument, ___ compelling on the surface, fails to withstand scrutiny.",
    options: ["albeit", "despite", "whereas", "notwithstanding"],
    correct: 0,
  },
  {
    id: 48, level: "C2",
    text: "The committee members were at ___ over the proposed changes.",
    options: ["odds", "ends", "arms", "bay"],
    correct: 0,
  },
  {
    id: 49, level: "C2",
    text: "She has a ___ for languages that is truly remarkable.",
    options: ["flair", "talent", "knack", "aptitude"],
    correct: 0,
  },
  {
    id: 50, level: "C2",
    text: "The report left no stone ___ in its investigation.",
    options: ["unturned", "uncovered", "untouched", "unmoved"],
    correct: 0,
  },
];

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const levelInfo: Record<string, { name: string; description: string; color: string; bgColor: string }> = {
  "A1": {
    name: "Beginner",
    description: "Comprendi e usi espressioni familiari di base. Sai presentarti e fare domande semplici sulla vita quotidiana.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "from-emerald-500 to-emerald-600",
  },
  "A2": {
    name: "Elementary",
    description: "Comunichi in situazioni semplici e di routine. Sai descrivere il tuo ambiente e i tuoi bisogni immediati.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "from-green-500 to-green-600",
  },
  "B1": {
    name: "Intermediate",
    description: "Gestisci la maggior parte delle situazioni durante un viaggio. Produci testi semplici su argomenti familiari ed esprimi esperienze e opinioni.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "from-blue-500 to-blue-600",
  },
  "B2": {
    name: "Upper Intermediate",
    description: "Interagisci con scioltezza e spontaneità con parlanti nativi. Produci testi chiari e dettagliati su molti argomenti.",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "from-indigo-500 to-indigo-600",
  },
  "C1": {
    name: "Advanced",
    description: "Usi la lingua in modo flessibile ed efficace per scopi sociali, accademici e professionali. Produci testi ben strutturati e dettagliati su argomenti complessi.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "from-purple-500 to-purple-600",
  },
  "C2": {
    name: "Proficiency",
    description: "Comprendi praticamente tutto ciò che leggi o ascolti. Ti esprimi in modo spontaneo, scorrevole e preciso, differenziando sottili sfumature di significato.",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "from-rose-500 to-rose-600",
  },
};

const courseRecommendations: Record<string, { title: string; link: string; description: string }[]> = {
  "A1": [
    { title: "Corsi di Lingua in Presenza", link: "/formazione-in-presenza", description: "Corsi di gruppo per principianti a Vicenza e Thiene" },
    { title: "Formazione Online", link: "/corsi-e-learning", description: "Piattaforma e-learning con AI e tutor madrelingua" },
  ],
  "A2": [
    { title: "Corsi di Lingua in Presenza", link: "/formazione-in-presenza", description: "Corsi di gruppo elementari per consolidare le basi" },
    { title: "Language Coaching", link: "/language-coaching", description: "Percorsi 1-to-1 personalizzati per progredire velocemente" },
  ],
  "B1": [
    { title: "Language Coaching", link: "/language-coaching", description: "Percorsi personalizzati per raggiungere il livello B2" },
    { title: "Speakers' Corner", link: "/speakers-corner", description: "Pratica conversazione ogni venerdì con madrelingua" },
  ],
  "B2": [
    { title: "Speakers' Corner", link: "/speakers-corner", description: "Mantieni e migliora la fluency con conversazione settimanale" },
    { title: "Full Immersion", link: "/full-immersion", description: "Workshop intensivi per fare il salto al livello C1" },
  ],
  "C1": [
    { title: "Full Immersion", link: "/full-immersion", description: "Esperienze intensive per perfezionare il tuo inglese" },
    { title: "Speakers' Corner", link: "/speakers-corner", description: "Mantieni il livello con conversazione avanzata" },
  ],
  "C2": [
    { title: "Speakers' Corner", link: "/speakers-corner", description: "Conversazione avanzata per mantenere l'eccellenza" },
    { title: "Language Coaching", link: "/language-coaching", description: "Perfezionamento professionale e accademico" },
  ],
};

function determineLevel(answers: Record<number, number>): { level: string; scores: Record<string, { correct: number; total: number }> } {
  const scores: Record<string, { correct: number; total: number }> = {};
  levels.forEach(l => { scores[l] = { correct: 0, total: 0 }; });

  questions.forEach(q => {
    scores[q.level].total++;
    if (answers[q.id] === q.correct) {
      scores[q.level].correct++;
    }
  });

  let determinedLevel = "A1";
  for (const level of levels) {
    const { correct, total } = scores[level];
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    if (percentage >= 60) {
      determinedLevel = level;
    } else {
      break;
    }
  }

  return { level: determinedLevel, scores };
}

export default function EnglishTestPage() {
  const [phase, setPhase] = useState<"intro" | "test" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentQuestion) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentLevel = currentQ?.level || "A1";

  const handleAnswer = useCallback((optionIndex: number) => {
    setSelectedOption(optionIndex);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
      setSelectedOption(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setPhase("results");
      }
    }, 400);
  }, [currentQ, currentQuestion]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
  }, []);

  const result = useMemo(() => {
    if (phase !== "results") return null;
    return determineLevel(answers);
  }, [phase, answers]);

  const totalCorrect = useMemo(() => {
    if (!result) return 0;
    return Object.values(result.scores).reduce((sum, s) => sum + s.correct, 0);
  }, [result]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {phase === "intro" && (
        <IntroSection onStart={() => setPhase("test")} />
      )}

      {phase === "test" && currentQ && (
        <TestSection
          question={currentQ}
          currentIndex={currentQuestion}
          total={questions.length}
          progress={progress}
          level={currentLevel}
          selectedOption={selectedOption}
          onAnswer={handleAnswer}
          onBack={currentQuestion > 0 ? () => {
            setCurrentQuestion(prev => prev - 1);
            setSelectedOption(null);
          } : undefined}
        />
      )}

      {phase === "results" && result && (
        <ResultsSection
          result={result}
          totalCorrect={totalCorrect}
          totalQuestions={questions.length}
          onRestart={handleRestart}
        />
      )}

      <Footer />
    </div>
  );
}

function IntroSection({ onStart }: { onStart: () => void }) {
  return (
    <main className="pt-24 pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/6 dark:bg-accent/12 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge variant="secondary" className="mb-6" data-testid="badge-test-intro">
              <Globe className="w-4 h-4 mr-2" />
              Test di Livello Gratuito
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6" data-testid="text-test-title">
              Scopri il Tuo Livello di{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Inglese
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              50 domande per valutare le tue competenze secondo il Quadro Comune Europeo
              di Riferimento (QCER/CEFR), dal livello A1 al C2. Ricevi subito il tuo risultato
              con consigli personalizzati.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Button
                size="lg"
                className="text-lg px-10 py-6 shadow-lg shadow-primary/25"
                onClick={onStart}
                data-testid="button-start-test"
              >
                Inizia il Test
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
          >
            {[
              { icon: BookOpen, label: "50 Domande", sublabel: "Grammatica & Vocabolario" },
              { icon: Clock, label: "15-20 min", sublabel: "Tempo Stimato" },
              { icon: Award, label: "CEFR A1-C2", sublabel: "Standard Europeo" },
              { icon: Target, label: "Gratuito", sublabel: "Risultato Immediato" },
            ].map((item, i) => (
              <Card key={i} className="text-center hover-elevate" data-testid={`card-test-info-${i}`}>
                <CardContent className="p-4">
                  <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.sublabel}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-bold mb-6 text-center">I Livelli CEFR</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {levels.map((level, i) => {
                const info = levelInfo[level];
                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                  >
                    <Card className="hover-elevate h-full" data-testid={`card-level-${level}`}>
                      <CardContent className="p-4">
                        <Badge className={`bg-gradient-to-r ${info.bgColor} text-white border-0 mb-2`}>
                          {level}
                        </Badge>
                        <div className="font-semibold text-sm mb-1">{info.name}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{info.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function TestSection({
  question,
  currentIndex,
  total,
  progress,
  level,
  selectedOption,
  onAnswer,
  onBack,
}: {
  question: Question;
  currentIndex: number;
  total: number;
  progress: number;
  level: string;
  selectedOption: number | null;
  onAnswer: (index: number) => void;
  onBack?: () => void;
}) {
  const info = levelInfo[level];

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <Badge className={`bg-gradient-to-r ${info.bgColor} text-white border-0`} data-testid="badge-current-level">
              {level} - {info.name}
            </Badge>
            <span className="text-sm text-muted-foreground" data-testid="text-question-count">
              {currentIndex + 1} / {total}
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="shadow-lg" data-testid={`card-question-${question.id}`}>
              <CardContent className="p-6 sm:p-8">
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold leading-relaxed" data-testid="text-question">
                    {question.text}
                  </h2>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, i) => (
                    <motion.button
                      key={i}
                      onClick={() => selectedOption === null ? onAnswer(i) : undefined}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedOption === i
                          ? "border-primary bg-primary/10 scale-[0.98]"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                      whileHover={selectedOption === null ? { scale: 1.01 } : {}}
                      whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                      data-testid={`button-option-${i}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${
                          selectedOption === i
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          {onBack ? (
            <Button variant="ghost" onClick={onBack} data-testid="button-previous">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Precedente
            </Button>
          ) : <div />}
          <p className="text-xs text-muted-foreground">
            Seleziona la risposta corretta
          </p>
        </div>
      </div>
    </main>
  );
}

function ResultsSection({
  result,
  totalCorrect,
  totalQuestions,
  onRestart,
}: {
  result: { level: string; scores: Record<string, { correct: number; total: number }> };
  totalCorrect: number;
  totalQuestions: number;
  onRestart: () => void;
}) {
  const info = levelInfo[result.level];
  const recommendations = courseRecommendations[result.level] || [];
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);

  return (
    <main className="pt-24 pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/6 dark:bg-accent/12 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6"
              data-testid="icon-result"
            >
              <GraduationCap className="w-12 h-12 text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <p className="text-lg text-muted-foreground mb-2">Il tuo livello di inglese:</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Badge className={`bg-gradient-to-r ${info.bgColor} text-white border-0 text-2xl px-6 py-2`} data-testid="badge-result-level">
                  {result.level}
                </Badge>
                <span className={`text-3xl font-bold ${info.color}`} data-testid="text-result-name">
                  {info.name}
                </span>
              </div>
              <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed mb-2" data-testid="text-result-description">
                {info.description}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-result-score">
                Punteggio: {totalCorrect}/{totalQuestions} ({percentage}%)
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-10"
          >
            <Card data-testid="card-score-breakdown">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Dettaglio per Livello
                </h3>
                <div className="space-y-3">
                  {levels.map((level) => {
                    const score = result.scores[level];
                    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
                    const li = levelInfo[level];
                    return (
                      <div key={level} className="flex items-center gap-3" data-testid={`score-level-${level}`}>
                        <Badge className={`bg-gradient-to-r ${li.bgColor} text-white border-0 w-12 justify-center shrink-0`}>
                          {level}
                        </Badge>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{li.name}</span>
                            <span className="text-sm text-muted-foreground">{score.correct}/{score.total}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${li.bgColor} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.6 }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-10"
          >
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Corsi Consigliati per Te
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <Link key={i} href={rec.link}>
                  <Card className="h-full hover-elevate cursor-pointer group" data-testid={`card-recommendation-${i}`}>
                    <CardContent className="p-5">
                      <h4 className="font-bold group-hover:text-primary transition-colors mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium">
                        Scopri di più
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="outline" onClick={onRestart} data-testid="button-restart-test">
              <RotateCcw className="mr-2 h-4 w-4" />
              Rifai il Test
            </Button>
            <Button
              onClick={() => {
                const el = document.querySelector("#contact");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#contact";
                }
              }}
              data-testid="button-contact-after-test"
            >
              Parla con un Consulente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
